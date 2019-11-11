build:
	docker build . -t aryon/go-mongo
	docker volume create jpaudio-db

run:
	docker run -v jpaudio:/var/lib/mongodb -p 8080:8080 -it aryon/go-mongo bash -c "./start.sh"

test:
	docker run -v jpaudio:/var/lib/mongodb -p 8080:8080 -it aryon/go-mongo bash -c "./testing.sh"
