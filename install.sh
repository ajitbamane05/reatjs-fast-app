#!/bin/bash
set -e

# Configuration
BACKEND_IMAGE="backend-prod:local"
FRONTEND_IMAGE="frontend-prod:local"
DEPLOY_DIR="./deploy"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starting ReactJS + FastAPI Local Deployment on Minikube...${NC}"

# 1. Prerequisite Checks
echo -e "\n${GREEN}[1/5] Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}kubectl is not installed. Installing...${NC}"
    sudo snap install kubectl --classic
fi

if ! command -v minikube &> /dev/null; then
    echo -e "${GREEN}Minikube not found. Installing for Ubuntu (amd64)...${NC}"
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    sudo install minikube-linux-amd64 /usr/local/bin/minikube
    rm minikube-linux-amd64
fi

# 2. Start Minikube
echo -e "\n${GREEN}[2/5] Starting Minikube...${NC}"
minikube start --driver=docker
minikube addons enable ingress

# 3. Build Images in Minikube
echo -e "\n${GREEN}[3/5] Building Docker images inside Minikube...${NC}"

# Point shell to minikube's docker-daemon
eval $(minikube -p minikube docker-env)

echo "Building Backend Image..."
docker build -f backend/Dockerfile.prod -t $BACKEND_IMAGE backend/

echo "Building Frontend Image..."
docker build -f frontend/Dockerfile.prod -t $FRONTEND_IMAGE frontend/

# 4. Prepare and Apply Manifests
echo -e "\n${GREEN}[4/5] Applying Kubernetes Manifests...${NC}"

# Verify secrets exist or create default ones for local dev if missing
if [ ! -f "$DEPLOY_DIR/secrets.yaml" ]; then
    echo -e "${RED}Error: $DEPLOY_DIR/secrets.yaml missing.${NC}"
    exit 1
fi

# Apply standard manifests first (DB, Secrets, Service)
kubectl apply -f $DEPLOY_DIR/secrets.yaml
kubectl apply -f $DEPLOY_DIR/postgres-pv-claim.yaml
kubectl apply -f $DEPLOY_DIR/postgres-deployment.yaml
kubectl apply -f $DEPLOY_DIR/postgres-service.yaml
kubectl apply -f $DEPLOY_DIR/backend-service.yaml
kubectl apply -f $DEPLOY_DIR/frontend-service.yaml

# Apply Deployments with patched image names for local dev
# We use 'envsubst' or 'sed' to replace images on the fly, or just patch them after apply.
# Here we will use 'kubectl set image' approach for simplicity after applying, 
# BUT 'kubectl apply' might fail if image is invalid initially. 
# Better approach: Create temporary manifests.

mkdir -p build/generated-manifests

# Backend Deployment Patch
# Replace whatever image is in the yaml with our local image and set PullPolicy to Never (or IfNotPresent)
sed "s|image: .*|image: $BACKEND_IMAGE|g; s|imagePullPolicy: .*|imagePullPolicy: IfNotPresent|g" $DEPLOY_DIR/backend-deployment.yaml > build/generated-manifests/backend-deployment.yaml
kubectl apply -f build/generated-manifests/backend-deployment.yaml

# Frontend Deployment Patch
sed "s|image: .*|image: $FRONTEND_IMAGE|g; s|imagePullPolicy: .*|imagePullPolicy: IfNotPresent|g" $DEPLOY_DIR/frontend-deployment.yaml > build/generated-manifests/frontend-deployment.yaml
kubectl apply -f build/generated-manifests/frontend-deployment.yaml

# Ingress
kubectl apply -f $DEPLOY_DIR/ingress.yaml

# 5. Wait for Rollout
echo -e "\n${GREEN}[5/5] Waiting for deployment to be ready...${NC}"
kubectl rollout status deployment/postgres
kubectl rollout status deployment/backend
kubectl rollout status deployment/frontend

echo -e "\n${GREEN}Deployment Complete!${NC}"
echo "------------------------------------------------"
echo "Minikube IP: $(minikube ip)"
echo "Ingress Address: $(kubectl get ingress app-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}')"
echo "------------------------------------------------"
echo "To access the app, you may need to add the Minikube IP to your /etc/hosts file:"
echo "echo \"$(minikube ip)  localhost\" | sudo tee -a /etc/hosts"
echo "Or simply access via Minikube tunnel in another terminal:"
echo "minikube tunnel"
