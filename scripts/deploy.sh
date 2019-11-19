source envs2

gcloud container clusters get-credentials $GKE_CLUSTER

# create config map
# kubectl create configmap nginx-config --from-file=kubernetes/nginx.conf
kubectl create configmap nginx-config --from-file=kubernetes/nginx.conf -o yaml --dry-run | kubectl replace -f -

kubectl apply -f kubernetes

kubectl rollout restart deployment/jpalp-backend-deployment
kubectl rollout restart deployment/jpalp-frontend-deployment