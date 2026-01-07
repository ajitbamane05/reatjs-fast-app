# Deploying to AWS Kubernetes (EKS)

## Prerequisites
- `kubectl` configured to point to your EKS cluster.
- Docker installed (to build images).
- `git` installed.

## 1. Build Docker Images
You need to build the production images and push them to a container registry (like ECR or Docker Hub).

### Backend
```bash
# Build
docker build -f backend/Dockerfile.prod -t <your-registry>/backend-prod:latest backend/
# Push
docker push <your-registry>/backend-prod:latest
```

### Frontend
```bash
# Build
docker build -f frontend/Dockerfile.prod -t <your-registry>/frontend-prod:latest frontend/
# Push
docker push <your-registry>/frontend-prod:latest
```

> **Note:** Update `deploy/backend-deployment.yaml` and `deploy/frontend-deployment.yaml` with your actual image paths (`<your-registry>/...`).

## 2. Secrets Management
The `deploy/secrets.yaml` file contains placeholders. You must encode your actual secrets in Base64 before applying.

```bash
echo -n "my-super-secret" | base64
```

Update `deploy/secrets.yaml` with the encoded values.

## 3. Apply Manifests
Apply the configuration file by file or all at once.

```bash
# 1. Secrets and Database Storage
kubectl apply -f deploy/secrets.yaml
kubectl apply -f deploy/postgres-pv-claim.yaml

# 2. Database
kubectl apply -f deploy/postgres-deployment.yaml
kubectl apply -f deploy/postgres-service.yaml

# 3. Backend
kubectl apply -f deploy/backend-deployment.yaml
kubectl apply -f deploy/backend-service.yaml

# 4. Frontend
kubectl apply -f deploy/frontend-deployment.yaml
kubectl apply -f deploy/frontend-service.yaml

# 5. Ingress
kubectl apply -f deploy/ingress.yaml
```

## 4. Verification
Check the status of your pods:
```bash
kubectl get pods
```

Get the Ingress address:
```bash
kubectl get ingress
```

Access your application at the Ingress LoadBalancer address.
