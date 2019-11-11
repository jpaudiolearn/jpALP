# JpALP


## Docker

### build

```sh
$ make build
```

### run

```sh
$ make run
```

Make sure ```go run .``` works on **root** of workdir

### test

```sh
$ make test
```

## DB

```go
client, err := db.GetClient()
coll, err := db.LoadTextColl(client)

// MongoDB IO
pair = db.WordPair{
    EN: "hello", JP: "こんにちは"
}
_id, err := db.InsertWord(cl, &pair)
res, err := db.FindWordPairByEN(cl, "hello")
```

### GetClient

### LoadDB

### LoadTextColl

### InsertWord

### FindWordPairByEN

### FindWordPairByJP

