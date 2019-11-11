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

Modify ./start.sh to modify start operations.

Make sure ```go run .``` works on **root** of workdir

### test

```sh
$ make test
```

Modify ./testing.sh to add more test operations.

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

