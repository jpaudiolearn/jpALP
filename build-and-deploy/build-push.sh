source envs

export IMAGE=gcr.io/$GOOGLE_PROJECT_ID/$IMAGE_NAME

docker build . -t $IMAGE
docker push $IMAGE