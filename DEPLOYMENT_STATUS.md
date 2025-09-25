# BiteBudget V2 - Deployment Status & Management Guide

## Current Deployment Status

### Docker Build Status

- **Local Docker Images**: ✅ Frontend image built (`bitebudgetacr21.azurecr.io/bitebudget-frontend:latest`)
- **Docker Compose**: No services currently running locally
- **Image Size**: Frontend image is 88MB (optimized for production)

### Azure Deployment Status

- **Resource Group**: ✅ `bitebudget-rg` exists in East US
- **Container Registry**: ✅ `bitebudgetacr21` active with admin enabled
- **Backend Container App**: ✅ `bitebudget-backend` deployed
  - URL: https://bitebudget-backend.politefield-08e3c514.eastus.azurecontainerapps.io
- **Frontend Container App**: ⚠️ Status unknown (may need redeploy)
- **Container Environment**: ✅ `bitebudget-env` exists

## Updated PowerShell Script Features

The `deploy-azure.ps1` script has been enhanced with three main actions:

### 1. Deploy (Default)

```powershell
.\deploy-azure.ps1 -SubscriptionId "your-subscription-id" -Action deploy
```

- Creates all Azure resources
- Builds and pushes Docker images to ACR
- Deploys both frontend and backend container apps

### 2. Status Check

```powershell
.\deploy-azure.ps1 -SubscriptionId "your-subscription-id" -Action status
```

- Shows current deployment status
- Lists all container apps and their URLs
- Displays ACR images
- Shows resource group status

### 3. Delete Resources

```powershell
.\deploy-azure.ps1 -SubscriptionId "your-subscription-id" -Action delete
```

- **⚠️ WARNING**: This deletes ALL resources in the resource group
- Requires typing "DELETE" to confirm
- Removes the entire resource group and all contained resources
- Deletion happens in the background

## Security Features

- Confirmation required for deletion (must type "DELETE")
- No-wait option for background deletion to prevent accidental hanging
- Clear status reporting before any destructive actions

## Quick Commands

### Check what's currently deployed:

```powershell
.\deploy-azure.ps1 -SubscriptionId "0ee4d157-5405-4a09-bf25-b4a0581a1adb" -Action status
```

### Clean up everything (be careful!):

```powershell
.\deploy-azure.ps1 -SubscriptionId "0ee4d157-5405-4a09-bf25-b4a0581a1adb" -Action delete
```

### Fresh deployment:

```powershell
.\deploy-azure.ps1 -SubscriptionId "0ee4d157-5405-4a09-bf25-b4a0581a1adb" -Action deploy
```

## Local Development

### Start local development environment:

```powershell
docker-compose up -d
```

### Check local services:

```powershell
docker-compose ps
```

### Stop local services:

```powershell
docker-compose down
```

## Current Issues to Address

1. **Frontend Container App**: May need redeployment as it wasn't found in the status check
2. **Environment Variables**: Production secrets need to be updated from defaults
3. **SSL Certificates**: Not yet configured for custom domains
4. **Monitoring**: No monitoring/logging solution currently active

## Next Steps

1. Complete frontend container app deployment
2. Update production environment variables
3. Configure custom domain and SSL
4. Set up monitoring and alerting
5. Implement backup strategies for data persistence
