source envs2

export IMAGE_BACKEND=gcr.io/$GOOGLE_PROJECT_ID/$IMAGE_NAME_BACKEND
export IMAGE_FRONTEND=gcr.io/$GOOGLE_PROJECT_ID/$IMAGE_NAME_FRONTEND

docker build . --file=./docker/backend -t $IMAGE_BACKEND
docker build . --file=./docker/frontend -t $IMAGE_FRONTEND

docker push $IMAGE_BACKEND
docker push $IMAGE_FRONTEND
