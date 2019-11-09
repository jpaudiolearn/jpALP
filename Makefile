build:
	docker build . -t aryon/go-mongo
	docker volume create jpaudio-db

run:
	docker run -v jpaudio:/data/db -p 8080:8080 -it aryon/go-mongo
