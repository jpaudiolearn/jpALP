FROM ubuntu:16.04

ENV HOME=/root

RUN apt update && apt upgrade -y &&\
    apt install wget apt-transport-https -y && \
    wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add - && \
    echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list && \
    apt update && apt upgrade -y && apt install mongodb-org -y

RUN mkdir /data && mkdir /data/db

RUN apt update && apt install -y software-properties-common && apt update && \
    add-apt-repository ppa:longsleep/golang-backports && apt update && \
    apt install golang-go git vim -y && \
    mkdir $HOME/go && mkdir $HOME/go/src 

ENV GOPATH=$HOME/go

ENV PATH=$PATH:/usr/local/go/bin

RUN mkdir $GOPATH/src/github.com && \
    mkdir $GOPATH/src/github.com/japaudio && \
    mkdir $GOPATH/src/github.com/japaudio/JapALP

WORKDIR $GOPATH/src/github.com/japaudio/JapALP

ADD ./ ./

RUN go get

# CMD ["./start.sh"]
