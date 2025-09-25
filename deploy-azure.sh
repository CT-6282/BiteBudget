#!/bin/bash

# BiteBudget V2 - Azure Deployment Script
# This script deploys the application to Azure Container Apps

set -e

# Configuration - Update these values with your Azure subscription details
RESOURCE_GROUP="bitebudget-rg"
LOCATION="East US"
CONTAINER_APP_ENV="bitebudget-env"
ACR_NAME="bitebudgetacr"
BACKEND_APP_NAME="bitebudget-backend"
FRONTEND_APP_NAME="bitebudget-frontend"
SUBSCRIPTION_ID=""  # Add your Azure subscription ID here

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 BiteBudget V2 Azure Deployment Script${NC}"
echo "======================================"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if user is logged in
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}🔐 Please log in to Azure first${NC}"
    az login
fi

# Set subscription
if [ -n "$SUBSCRIPTION_ID" ]; then
    echo -e "${YELLOW}📋 Setting subscription to $SUBSCRIPTION_ID${NC}"
    az account set --subscription "$SUBSCRIPTION_ID"
fi

# Create resource group
echo -e "${YELLOW}📦 Creating resource group...${NC}"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# Create Azure Container Registry
echo -e "${YELLOW}🏗️ Creating Azure Container Registry...${NC}"
az acr create --resource-group "$RESOURCE_GROUP" --name "$ACR_NAME" --sku Basic --admin-enabled true

# Get ACR login server
ACR_LOGIN_SERVER=$(az acr show --name "$ACR_NAME" --query loginServer --output tsv)
echo -e "${GREEN}📍 ACR Login Server: $ACR_LOGIN_SERVER${NC}"

# Build and push backend image
echo -e "${YELLOW}🔨 Building and pushing backend image...${NC}"
az acr build --registry "$ACR_NAME" --image bitebudget-backend:latest ./backend

# Build and push frontend image
echo -e "${YELLOW}🔨 Building and pushing frontend image...${NC}"
az acr build --registry "$ACR_NAME" --image bitebudget-frontend:latest ./frontend

# Create Container Apps Environment
echo -e "${YELLOW}🌐 Creating Container Apps Environment...${NC}"
az containerapp env create \
  --name "$CONTAINER_APP_ENV" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION"

# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name "$ACR_NAME" --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name "$ACR_NAME" --query passwords[0].value --output tsv)

# Deploy backend container app
echo -e "${YELLOW}🚀 Deploying backend container app...${NC}"
az containerapp create \
  --name "$BACKEND_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$CONTAINER_APP_ENV" \
  --image "$ACR_LOGIN_SERVER/bitebudget-backend:latest" \
  --target-port 5000 \
  --ingress 'external' \
  --registry-server "$ACR_LOGIN_SERVER" \
  --registry-username "$ACR_USERNAME" \
  --registry-password "$ACR_PASSWORD" \
  --env-vars \
    SECRET_KEY="your-production-secret-key-change-me" \
    JWT_SECRET_KEY="your-jwt-secret-key-change-me" \
    DATABASE_URL="sqlite:///bitebudget.db" \
    FLASK_ENV="production"

# Get backend URL
BACKEND_URL=$(az containerapp show --name "$BACKEND_APP_NAME" --resource-group "$RESOURCE_GROUP" --query properties.configuration.ingress.fqdn --output tsv)
echo -e "${GREEN}🔗 Backend URL: https://$BACKEND_URL${NC}"

# Deploy frontend container app
echo -e "${YELLOW}🚀 Deploying frontend container app...${NC}"
az containerapp create \
  --name "$FRONTEND_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$CONTAINER_APP_ENV" \
  --image "$ACR_LOGIN_SERVER/bitebudget-frontend:latest" \
  --target-port 80 \
  --ingress 'external' \
  --registry-server "$ACR_LOGIN_SERVER" \
  --registry-username "$ACR_USERNAME" \
  --registry-password "$ACR_PASSWORD" \
  --env-vars \
    REACT_APP_API_URL="https://$BACKEND_URL"

# Get frontend URL
FRONTEND_URL=$(az containerapp show --name "$FRONTEND_APP_NAME" --resource-group "$RESOURCE_GROUP" --query properties.configuration.ingress.fqdn --output tsv)

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "=================================="
echo -e "${GREEN}🌐 Frontend URL: https://$FRONTEND_URL${NC}"
echo -e "${GREEN}🔗 Backend URL: https://$BACKEND_URL${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Update your domain DNS to point to the frontend URL"
echo "2. Configure SSL certificates if needed"
echo "3. Set up monitoring and logging"
echo "4. Configure backup strategies"
echo ""
echo -e "${YELLOW}💰 Cost Management:${NC}"
echo "- Monitor your Azure spending in the Azure portal"
echo "- Consider setting up billing alerts"
echo "- Scale down resources when not needed"
