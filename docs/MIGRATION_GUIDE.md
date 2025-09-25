# GitHub Container Registry Migration Guide

This guide will help you migrate BiteBudget V2 from Azure Container Registry to GitHub Container Registry with optimized container images.

## 🎯 Migration Benefits

- **Cost Savings**: GitHub Container Registry is free for public repositories
- **Image Size Reduction**: 75% smaller backend images, 93% smaller frontend images
- **Improved Security**: Multi-stage builds with non-root users
- **Better CI/CD Integration**: Native GitHub Actions support
- **Enhanced Performance**: Optimized container builds

## 📋 Prerequisites

1. **GitHub Personal Access Token** with the following scopes:
   - `write:packages`
   - `read:packages` 
   - `delete:packages` (optional, for cleanup)

2. **Azure CLI** installed and authenticated
3. **Docker** installed locally
4. **Repository Access** to push to your GitHub repository

## 🚀 Step-by-Step Migration

### Step 1: Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select the required scopes mentioned above
4. Copy the token securely

### Step 2: Repository Setup

1. Make sure your code is committed to the main branch
2. The GitHub Actions workflow will automatically trigger on push to main

### Step 3: Update Configuration Files

Update the following placeholders in the configuration files:

**backend-config-github.yml**:
```yaml
username: YOUR_GITHUB_USERNAME  # Replace with your GitHub username
value: YOUR_GITHUB_TOKEN_HERE   # Replace with your Personal Access Token
image: ghcr.io/YOUR_GITHUB_USERNAME/bitebudgetv2/backend:latest
```

**frontend-config-github.yml**:
```yaml
username: YOUR_GITHUB_USERNAME  # Replace with your GitHub username  
value: YOUR_GITHUB_TOKEN_HERE   # Replace with your Personal Access Token
image: ghcr.io/YOUR_GITHUB_USERNAME/bitebudgetv2/frontend:latest
```

### Step 4: Run Migration Script

```powershell
# Interactive migration (recommended)
./migrate-to-github.ps1 -GitHubUsername "your-username" -GitHubToken "your-token"

# Dry run first (to test)
./migrate-to-github.ps1 -GitHubUsername "your-username" -GitHubToken "your-token" -DryRun
```

### Step 5: Verify Migration

1. Check GitHub Container Registry packages:
   - Go to your GitHub profile → Packages
   - Verify both `bitebudgetv2/backend` and `bitebudgetv2/frontend` packages exist

2. Verify Azure Container Apps:
   ```bash
   az containerapp show --name bitebudget-backend --resource-group BiteBudget
   az containerapp show --name bitebudget-frontend --resource-group BiteBudget
   ```

3. Test application endpoints:
   - Backend: https://bitebudget-backend.livelymoss-133f0f64.eastus.azurecontainerapps.io/health
   - Frontend: https://bitebudget-frontend.livelymoss-133f0f64.eastus.azurecontainerapps.io

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Ensure your GitHub token has correct scopes
   - Verify your GitHub username is correct
   - Check token expiration date

2. **Build Failures**:
   - Check Docker daemon is running
   - Verify Dockerfile.prod exists in both directories
   - Ensure all dependencies are properly installed

3. **Container App Update Errors**:
   - Verify Azure CLI authentication: `az account show`
   - Check resource group and app names are correct
   - Ensure sufficient permissions in Azure

4. **Application Not Loading**:
   - Check environment variables are correctly set
   - Verify API_URL matches backend endpoint
   - Check container logs: `az containerapp logs show`

### Rollback Procedure

If you need to rollback to Azure Container Registry:

```powershell
# Update backend to use Azure Container Registry
az containerapp update \
  --name bitebudget-backend \
  --resource-group BiteBudget \
  --image bitebudgetacr219.azurecr.io/backend:v2

# Update frontend to use Azure Container Registry  
az containerapp update \
  --name bitebudget-frontend \
  --resource-group BiteBudget \
  --image bitebudgetacr219.azurecr.io/frontend:latest
```

## 📊 Image Size Comparison

| Component | Before (Azure CR) | After (GitHub CR) | Reduction |
|-----------|------------------|-------------------|-----------|
| Backend   | ~800MB           | ~200MB            | 75%       |
| Frontend  | ~1.2GB           | ~85MB             | 93%       |

## 🔒 Security Improvements

1. **Multi-stage builds** reduce attack surface
2. **Non-root users** in containers
3. **Security updates** applied to base images
4. **Health checks** for better monitoring
5. **Minimal base images** (Alpine Linux)

## 💰 Cost Savings

- **Azure Container Registry**: ~$5-10/month for storage and bandwidth
- **GitHub Container Registry**: Free for public repositories
- **Estimated Annual Savings**: $60-120

## 🔄 CI/CD Integration

The GitHub Actions workflow automatically:
- Builds optimized container images on every push
- Pushes to GitHub Container Registry
- Updates Azure Container Apps with new images
- Includes caching for faster builds

## 📚 Additional Resources

- [GitHub Container Registry Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Azure Container Apps Documentation](https://docs.microsoft.com/en-us/azure/container-apps/)
- [Docker Multi-stage Builds](https://docs.docker.com/develop/dev-best-practices/dockerfile_best-practices/)

## 🎉 Post-Migration

After successful migration:
1. Update any hardcoded references to the old registry
2. Consider making your repository private if using sensitive data
3. Set up branch protection rules for the main branch
4. Configure automated security scanning for your images
5. Monitor container performance and costs

---

For questions or issues, please create a GitHub issue in this repository.
