build:
	docker build . -t aryon/go-mongo

run:
	docker run -it aryon/go-mongo
