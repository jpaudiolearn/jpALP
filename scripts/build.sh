source envs2

export IMAGE_BACKEND=gcr.io/$GOOGLE_PROJECT_ID/$IMAGE_NAME_BACKEND

docker build . --file=./docker/backend -t $IMAGE_BACKEND
