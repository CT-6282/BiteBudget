# Azure Container Apps - Always Use Latest Images
# This script configures your container apps to always pull the latest images

# Configure Backend for continuous deployment
Write-Host "Configuring backend for continuous deployment..." -ForegroundColor Yellow
az containerapp update `
  --name bitebudget-backend `
  --resource-group bitebudget-rg `
  --image ghcr.io/ct-6282/bitebudgetv2/backend:latest

# Configure Frontend for continuous deployment  
Write-Host "Configuring frontend for continuous deployment..." -ForegroundColor Yellow
az containerapp update `
  --name bitebudget-frontend `
  --resource-group bitebudget-rg `
  --image ghcr.io/ct-6282/bitebudgetv2/frontend:latest

# Enable revision management
Write-Host "Enabling single revision mode (always latest)..." -ForegroundColor Yellow
az containerapp revision set-mode `
  --name bitebudget-backend `
  --resource-group bitebudget-rg `
  --mode Single

az containerapp revision set-mode `
  --name bitebudget-frontend `
  --resource-group bitebudget-rg `
  --mode Single

Write-Host "✅ Configuration complete! Your apps will now always use the latest images." -ForegroundColor Green
Write-Host "💡 Tip: Use specific commit tags in production for better rollback control." -ForegroundColor Cyan
