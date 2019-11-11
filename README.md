# JpALP

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

