package db_test

import (
	"context"
	"log"

	"github.com/japaudio/JapALP/db"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var _ = Describe("DB", func() {

	var c *mongo.Client

	BeforeEach(func() {
		c = db.GetClient()
	})

	Describe("MongoDB Connection", func() {
		It("Should be connected", func() {
			Expect(c.Ping(context.Background(), readpref.Primary())).Should(BeNil())
		})
	})

	Describe("Load Config", func() {
		It("Should be loaded", func() {
			_, err := db.LoadDB(c, "config.yml")
			Expect(err).Should(BeNil())
			_, err = db.LoadTextColl(c, "config.yml")
			Expect(err).Should(BeNil())
		})
	})

	Describe("MongoDB IO", func() {
		var cl *mongo.Collection

		BeforeEach(func() {
			cl, _ = db.LoadTextColl(c, "config.yml")
		})

		Describe("Insert One Word", func() {
			It("Should be successful", func() {
				pair := db.WordPair{EN: "hello", JP: "こんにちは"}
				_id, err := db.InsertWord(cl, &pair)
				log.Printf("inserted id: %s", _id)
				Expect(err).Should(BeNil())
			})
		})

		Describe("Find One Word Pair", func() {
			// 	pair := db.WordPair{EN: "hello", JP: "こんにちは"}
			// 	_, _ = db.InsertWord(cl, &pair)

			It("Should find JP こんにちは", func() {
				res, err := db.FindWordPairByEN(cl, "hello")
				Expect(err).Should(BeNil())
				Expect(res).Should(Equal(&db.WordPair{
					EN: "hello",
					JP: "こんにちは",
				}))
			})

			It("Should find EN hello", func() {
				res, err := db.FindWordPairByJP(cl, "こんにちは")
				Expect(err).Should(BeNil())
				Expect(res).Should(Equal(&db.WordPair{
					EN: "hello",
					JP: "こんにちは",
				}))
			})
		})

	})
})
