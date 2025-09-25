# Advanced: Use Image Digests for Guaranteed Latest Deployment
# This approach uses image digests (SHA256 hashes) to ensure exact image versions

param(
    [string]$ResourceGroup = "bitebudget-rg",
    [string]$Registry = "ghcr.io/ct-6282/bitebudgetv2"
)

Write-Host "🔍 Getting latest image digests..." -ForegroundColor Cyan

# Get latest backend image digest
$backendDigest = az acr repository show-manifests `
    --name $Registry `
    --repository backend `
    --query "[0].digest" `
    --output tsv

# Get latest frontend image digest  
$frontendDigest = az acr repository show-manifests `
    --name $Registry `
    --repository frontend `
    --query "[0].digest" `
    --output tsv

if ($backendDigest -and $frontendDigest) {
    Write-Host "📦 Deploying with image digests:" -ForegroundColor Green
    Write-Host "   Backend:  $Registry/backend@$backendDigest"
    Write-Host "   Frontend: $Registry/frontend@$frontendDigest"
    
    # Update with specific digests
    az containerapp update `
        --name bitebudget-backend `
        --resource-group $ResourceGroup `
        --image "$Registry/backend@$backendDigest"
        
    az containerapp update `
        --name bitebudget-frontend `
        --resource-group $ResourceGroup `
        --image "$Registry/frontend@$frontendDigest"
        
    Write-Host "✅ Deployed with guaranteed latest images using digests!" -ForegroundColor Green
} else {
    Write-Host "❌ Could not retrieve image digests. Using tag-based deployment..." -ForegroundColor Red
    
    # Fallback to latest tags
    az containerapp update `
        --name bitebudget-backend `
        --resource-group $ResourceGroup `
        --image "$Registry/backend:latest"
        
    az containerapp update `
        --name bitebudget-frontend `
        --resource-group $ResourceGroup `
        --image "$Registry/frontend:latest"
}
