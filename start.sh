#!/bin/bash

echo "MONGODB VERSION: "

echo $(mongod --version)

echo "GO VERSION: "

echo $(go version)

nohup mongod > /var/log/mongo.log &

export GIN_MODE=release

go run .