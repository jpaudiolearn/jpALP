package db

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"reflect"
	"sort"
	"time"

	"io/ioutil"

	"gopkg.in/yaml.v2"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type collectionConfig struct {
	Text string `yaml:"text"`
	Test string `yaml:"test"`
}

type config struct {
	DbName     string           `yaml:"db"`
	Collection collectionConfig `yaml:"collection"`
}

// WordPair consists of an English, Japanese and WEight
type WordPair struct {
	EN     string
	JP     string
	WE     int
	UserID string
}

type TestDb struct {
	UserID   string
	TotalQ   int
	CorrectA int
}

type WrongObj struct {
	EN     string
	UserID string
}

// GetClient returns client of MongoDB
func GetClient() *mongo.Client {
	url := "mongodb://" + os.Getenv("DB_HOST") + ":27017"
	fmt.Println("@zkl:", url)
	clientOptions := options.Client().ApplyURI(url)
	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	err = client.Connect(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	return client
}

func loadConfig(fileDir string) (*config, error) {
	var cfg config
	content, err := ioutil.ReadFile(fileDir)
	if err != nil {
		return nil, err
	}
	err = yaml.Unmarshal(content, &cfg)
	if err != nil {
		return nil, err
	}

	log.Printf("load db config: %s", cfg)

	return &cfg, nil
}

// LoadDB returns database based on config
func LoadDB(c *mongo.Client, fileDir string) (*mongo.Database, error) {
	cfg, err := loadConfig(fileDir)

	if err != nil {
		return nil, err
	}

	if c == nil {
		return nil, errors.New("can not load database without Client")
	}

	return c.Database(cfg.DbName), nil
}

// LoadTextColl returns Text Collection based on config
func LoadTextColl(c *mongo.Client, fileDir string) (*mongo.Collection, error) {
	cfg, err := loadConfig(fileDir)

	if err != nil {
		return nil, err
	}

	if c == nil {
		return nil, errors.New("can not load database without Client")
	}

	return c.Database(cfg.DbName).Collection(cfg.Collection.Text), nil
}

// LoadTestColl returns Test collection based on config
func LoadTestColl(c *mongo.Client, fileDir string) (*mongo.Collection, error) {
	cfg, err := loadConfig(fileDir)

	if err != nil {
		return nil, err
	}

	if c == nil {
		return nil, errors.New("can not load database without Client")
	}

	return c.Database(cfg.DbName).Collection(cfg.Collection.Test), nil
}

// InitTextColl init the collection with some random word pairs
func InitTextColl(cl *mongo.Collection) error {

	ens := []string{"hello", "world", "dog", "airport", "today", "sky", "apartment"}
	jps := []string{"こんにちは", "世界", "犬", "空港", "今日", "空", "アパート"}

	for i := range ens {
		_, err := InsertWord(cl, &WordPair{EN: ens[i], JP: jps[i]})
		if err != nil {
			return err
		}
	}
	return nil
}

/*
 * MongoDB IO
 */

// InsertWord inserts one object to DB and returns _id
func InsertWord(cl *mongo.Collection, o *WordPair) (interface{}, error) {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	res, err := cl.InsertOne(ctx, bson.M{
		"EN":     o.EN,
		"JP":     o.JP,
		"WE":     1,
		"UserID": o.UserID,
	})

	if err != nil {
		return nil, err
	}
	fmt.Println("InsertWord in db.go")
	fmt.Println(res.InsertedID)
	return res.InsertedID, nil
}

// InsertTest inserts one object to DB and returns _id
func InsertTest(cl *mongo.Collection, o *TestDb) (interface{}, error) {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	res, err := cl.InsertOne(ctx, bson.M{
		"TotalQ":   o.TotalQ,
		"CorrectA": o.CorrectA,
		"UserID":   o.UserID,
	})

	if err != nil {
		return nil, err
	}

	fmt.Println("InsertTest in db.go")
	fmt.Println(res.InsertedID)
	return res.InsertedID, nil
}

func GetTests(cl *mongo.Collection, o string) (interface{}, error) {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	fmt.Println("user_id in getTests " + o)

	// var result []TestDb
	result, err := cl.Find(ctx, bson.M{"UserID": o})
	if err != nil {
		return nil, err
	}

	fmt.Println("\n result TYPE:", reflect.TypeOf(result))
	fmt.Println("\n result: ", result)
	var ret []TestDb
	for result.Next(ctx) {
		var p TestDb

		if err := result.Decode(&p); err != nil {
			fmt.Println(err)
			continue
		}
		fmt.Printf("\n TestDb: %+v \n", p)
		ret = append(ret, p)
	}
	fmt.Println("queried data from db")
	return ret, nil
}

func GetWords(cl *mongo.Collection, o string) (interface{}, error) {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	fmt.Println("userID in GetWords " + o)

	result, err := cl.Find(ctx, bson.M{"UserID": o})
	if err != nil {
		return nil, err
	}

	fmt.Printf("\n result TYPE:", reflect.TypeOf(result))
	fmt.Println("\n result: ", result)

	var ret []WordPair
	for result.Next(ctx) {
		var p WordPair

		if err := result.Decode(&p); err != nil {
			fmt.Println(err)
			continue
		}
		fmt.Printf("\n WordPair: %+v \n", p)
		ret = append(ret, p)
	}
	sort.Slice(ret, func(i, j int) bool {
		return ret[i].WE > ret[j].WE
	})

	fmt.Println("quried for words")
	return ret, nil
}

func WrongUpdate(cl *mongo.Collection, o []WrongObj) error {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	for _, v := range o {
		filter := bson.M{
			"EN":     v.EN,
			"UserID": v.UserID,
		}

		update := bson.M{
			"$inc": bson.M{
				"WE": 1,
			},
		}
		opt := options.FindOneAndUpdateOptions{}
		flag := true
		opt.Upsert = &flag
		res := cl.FindOneAndUpdate(ctx, filter, update, &opt)

		if res.Err() != nil {
			return res.Err()
		}
	}
	return nil
}

// UpdateWord updates single word
func UpdateWord(cl *mongo.Collection, o *WordPair) error {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	filter := bson.M{
		"EN": o.EN,
	}
	update := bson.M{
		"$set": bson.M{
			"EN": o.EN,
			"JP": o.JP,
		},
	}
	opt := options.FindOneAndUpdateOptions{}
	flag := true
	opt.Upsert = &flag

	res := cl.FindOneAndUpdate(ctx, filter, update, &opt)

	if res.Err() != nil {
		return res.Err()
	}

	return nil
}

// FindWordPairByEN returns word pair according to english word
func FindWordPairByEN(cl *mongo.Collection, en string) (*WordPair, error) {
	filter := bson.D{{"EN", en}}
	result, err := findWordPair(cl, filter)
	if err != nil {
		return nil, err
	}
	return result, err
}

// FindWordPairByJP returns word pair according to japanese word
func FindWordPairByJP(cl *mongo.Collection, jp string) (*WordPair, error) {
	filter := bson.D{{"JP", jp}}
	result, err := findWordPair(cl, filter)
	if err != nil {
		return nil, err
	}
	return result, err
}

func findWordPair(cl *mongo.Collection, filter bson.D) (*WordPair, error) {
	var result WordPair
	err := cl.FindOne(context.Background(), filter).Decode(&result)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

// FindNWord returns N word pairs
func FindNWord(cl *mongo.Collection, N int) (ls []WordPair, err error) {
	cur, err := cl.Aggregate(context.Background(), []bson.M{{"$sample": bson.M{"size": N}}})
	if err != nil {
		return nil, err
	}

	fmt.Println(cur)
	defer cur.Close(context.Background())
	for cur.Next(context.Background()) {

		result := struct {
			EN     string
			JP     string
			WE     int
			UserID string
		}{}
		err := cur.Decode(&result)
		if err != nil {
			log.Fatal(err)
		}
		ls = append(ls, result)

	}
	if err := cur.Err(); err != nil {
		return nil, err
	}

	return ls, nil
}
