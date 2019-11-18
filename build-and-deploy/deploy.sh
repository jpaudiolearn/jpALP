source envs

gcloud container clusters get-credentials $GKE_CLUSTER

kubectl apply --validate=true -f yamls

kubectl rollout restart deployment/circleci-cd-demo-cluster