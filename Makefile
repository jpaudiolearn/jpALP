##### FOR LOCAL MACHINE TEST: ##### 
test:
	go test ./...

docker-test:
	docker build . -t go-mongo
	docker run -v jpaudio:/data/db -p 8080:8080 -it go-mongo bash -c "./testing.sh"

docker-run:
	docker build . -t go-mongo
	docker run -v jpaudio:/data/db -p 8080:8080 -it go-mongo bash -c "./start.sh"

##### DON'T RUN THESE COMMANDS! ##### 
build-push:
	./build-and-deploy/build-push.sh

deploy: 
	./build-and-deploy/deploy.sh

clean:
	./build-and-deploy/clean.sh