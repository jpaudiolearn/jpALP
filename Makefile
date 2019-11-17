build:
	docker build . -t kailizhu/go-mongo

run:
	docker run -v jpaudio:/data/db -p 8080:8080 -it kailizhu/go-mongo bash -c "./start.sh"

test:
	docker run -v jpaudio:/data/db -p 8080:8080 -it kailizhu/go-mongo bash -c "./testing.sh"

build-push:
	./build-and-deploy/build-push.sh

deploy: 
	./build-and-deploy/deploy.sh

clean:
	./build-and-deploy/clean.sh