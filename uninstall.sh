#!/bin/bash
set -e

# Configuration
DEPLOY_DIR="./deploy"
BACKEND_IMAGE="backend-prod:local"
FRONTEND_IMAGE="frontend-prod:local"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starting Cleanup...${NC}"

# 1. Delete Manifests
echo -e "\n${GREEN}[1/3] Deleting Kubernetes Resources...${NC}"
if kubectl api-resources &> /dev/null; then
    kubectl delete -f $DEPLOY_DIR/ --ignore-not-found=true
    # Also delete generated manifests if they were used/created
    kubectl delete -f build/generated-manifests/ --ignore-not-found=true 2>/dev/null || true
else
    echo -e "${RED}Kubernetes cluster not accessible. Skipping resource deletion.${NC}"
fi

# 2. Clean Images (Optional)
echo -e "\n${GREEN}[2/3] Cleaning up Docker images in Minikube...${NC}"
# Use minikube docker-env
if command -v minikube &> /dev/null && minikube status &> /dev/null; then
    eval $(minikube -p minikube docker-env)
    docker rmi $BACKEND_IMAGE $FRONTEND_IMAGE 2>/dev/null || echo "Images already removed or not found."
else
    echo "Minikube not running or installed. Skipping image cleanup."
fi

# 3. Stop Minikube (Optional prompt)
echo -e "\n${GREEN}[3/3] Minikube Status${NC}"
read -p "Do you want to stop Minikube as well? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    minikube stop
    echo "Minikube stopped."
else
    echo "Minikube left running."
fi

echo -e "\n${GREEN}Cleanup Complete!${NC}"
