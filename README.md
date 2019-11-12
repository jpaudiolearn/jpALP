# JpALP

## You have just found the jpALP!
The jpALP (short for japanese Audio Learning Program) is an app we developed to create a platform where Japanese learners can hone their speaking abilities on their own terms.

The user is free to memorize whatever vocabulary or phrase she wants to and can summon them at a moment's whim for testing purposes. By repeatedly and actively recalling japanese words, she can become a fluent speaker in no time.

## Getting Started
The web app is simple to use. Currently, there are two options in the app:
1. Add new words
2. Test words

The first option allows us to add new words to the app for future recalling. The second option allows us to learn words that were added earlier. Together the two features will help anyone improve their recalling ability.

## Installation Instructions


## Docker

***Important**: Notice that ```start.sh``` and ```testing.sh``` could only run on enviroment with golang and MongoDB installed, 
for ecample, in ```./Dockerfile``` built Docker container. Otherwise should use ```make *```.*

To run the application, you could first **build** the app, then **run** or **test**. It's recommended to use ```make *```. You can make modifications by modifying ```Makefile```.

### build

```sh
$ make build
```

### run

```sh
$ make run
```

Modify ./start.sh to change start operations.

### test

```sh
$ make test
```

Modify ./testing.sh to add more test operations.

## Deploy

Set up Google cloud CLI and select the corresponding gcp project

```shell script
export GCP_PROJ_NAME=kouzoh-p-name # insert your gcp proj name here
gcloud builds submit --tag gcr.io/$(GCP_PROJ_NAME)/jpalp
gcloud beta run deploy --image gcr.io/$(GCP_PROJ_NAME)/jpalp --platform managed --memory 1G
```

## DB interface

```go
client, err := db.GetClient()
coll, err := db.LoadTextColl(client)

// MongoDB IO
pair = db.WordPair{
    EN: "hello", JP: "こんにちは"
}
_id, err := db.InsertWord(cl, &pair)
res, err := db.FindWordPairByEN(cl, "hello")
// res should be same with pair
```

### GetClient

### LoadDB

### LoadTextColl

### InsertWord

### FindWordPairByEN

### FindWordPairByJP

