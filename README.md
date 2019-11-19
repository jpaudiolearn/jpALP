# JpALP V2

***

[![CircleCI](https://circleci.com/gh/jpaudiolearn/jpALP.svg?style=svg)](https://circleci.com/gh/jpaudiolearn/jpALP)

***

## You have just found the jpALP!
The jpALP (short for Japanese Audio Learning Platform) is an app we developed to create a platform where Japanese learners can hone their speaking abilities on their own terms.

The user is free to memorize whatever vocabulary or phrase she wants to and can summon them at a moment's whim for testing purposes. By repeatedly and actively recalling japanese words, she can become a fluent speaker in no time.

***

## Getting Started
The web app is simple to use. Currently, there are two options in the app:
1. Add a wrod
2. Test vocab
3. Revision

The first option allows us to add new word pairs to the app for future recalling by either text input or a cool voice input.

The second option allows us to test vocabulary by answering the questions by voice.

The third option allows us to learn words that were added earlier. 

Together the three features will help anyone improve their recalling ability.

***

## Run on your local machine without Docker

```
git clone https://github.com/jpaudiolearn/jpALP.git
cd jpALP
go run .
```

Then open another terminal in the same folder:

```
cd frontend
npm install
npm start
```

You can see `http://localhost:3000/` now!

***

## Deploy with Docker and GCP!

```
make build-push
make deploy
```
