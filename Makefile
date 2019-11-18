##### FOR LOCAL MACHINE TEST: ##### 
test:
	go test ./...

docker-test:
	docker build . -t go-mongo
	docker run -v jpaudio:/data/db -p 8080:8080 -it go-mongo bash -c "./testing.sh"

docker-run:
	docker build . -t go-mongo
	docker run -v jpaudio:/data/db -p 8080:8080 -it go-mongo bash -c "./start.sh"

##### THE FIRST VERSION OF CI/CD ##### 
first-build-push:
	./build-and-deploy/build-push.sh

first-deploy: 
	./build-and-deploy/deploy.sh

first-clean:
	./build-and-deploy/clean.sh


##### THE LATESET VERSION OF CI/CD ##### 
build-push:
	./scripts/build-push.sh

deploy:
	./scripts/deploy.sh

clean:
	./scripts/clean.sh