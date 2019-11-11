package db

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"io/ioutil"

	"gopkg.in/yaml.v2"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type collectionConfig struct {
	Text string `yaml:"text"`
}

type config struct {
	DbName     string           `yaml:"db"`
	Collection collectionConfig `yaml:"collection"`
}

// WordPair consists of an English and Japanese word pair
type WordPair struct {
	EN string
	JP string
}

// GetClient returns client of MongoDB
func GetClient() *mongo.Client {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
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

/*
 * MongoDB IO
 */

// InsertWord inserts one object to DB and returns _id
func InsertWord(cl *mongo.Collection, o *WordPair) (interface{}, error) {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	res, err := cl.InsertOne(ctx, bson.M{
		"EN": o.EN,
		"JP": o.JP,
	})

	if err != nil {
		return nil, err
	}

	return res.InsertedID, nil
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
			EN string
			JP string
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
