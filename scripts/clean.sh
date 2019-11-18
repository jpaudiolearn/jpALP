source envs

kubectl delete service jpalp-backend-service
kubectl delete service mongo-service
# kubectl delete service nginx-service

kubectl delete deployment jpalp-backend-deployment
kubectl delete deployment mongo-deployment
# kubectl delete deployment nginx-deployment

kubectl get services
kubectl get deployments
