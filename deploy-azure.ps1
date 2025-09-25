# BiteBudget V2 - Azure Deployment PowerShell Script
# This script deploys the application to Azure Container Apps

param(
    [Parameter(Mandatory = $true)]
    [string]$SubscriptionId,
    
    [Parameter(Mandatory = $false)]
    [string]$ResourceGroup = "bitebudget-rg",
    
    [Parameter(Mandatory = $false)]
    [string]$Location = "East US",
    
    [Parameter(Mandatory = $false)]
    [string]$AcrName = "bitebudgetacr$(Get-Random -Maximum 1000)",
    
    [Parameter(Mandatory = $false)]
    [ValidateSet("deploy", "delete", "status")]
    [string]$Action = "deploy"
)

Write-Host "🚀 BiteBudget V2 Azure Deployment Script" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host "Action: $Action" -ForegroundColor Cyan

# Check if Azure CLI is installed
try {
    az --version | Out-Null
}
catch {
    Write-Host "❌ Azure CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
}

# Login and set subscription
Write-Host "🔐 Logging in to Azure..." -ForegroundColor Yellow
az login
az account set --subscription $SubscriptionId

# Variables
$ContainerAppEnv = "bitebudget-env"
$BackendAppName = "bitebudget-backend"
$FrontendAppName = "bitebudget-frontend"

# Function to check deployment status
function Show-DeploymentStatus {
    Write-Host "📊 Checking BiteBudget V2 Deployment Status..." -ForegroundColor Yellow
    Write-Host "=============================================" -ForegroundColor Yellow
    
    # Check resource group
    $ResourceGroupExists = az group exists --name $ResourceGroup
    if ($ResourceGroupExists -eq "true") {
        Write-Host "✅ Resource Group '$ResourceGroup' exists" -ForegroundColor Green
        
        # Check ACR
        $AcrList = az acr list --resource-group $ResourceGroup --query "[].name" --output tsv
        if ($AcrList) {
            Write-Host "✅ Azure Container Registry: $($AcrList -join ', ')" -ForegroundColor Green
            
            # Show images in ACR
            foreach ($Acr in $AcrList.Split()) {
                $Images = az acr repository list --name $Acr --output tsv 2>$null
                if ($Images) {
                    Write-Host "  📦 Images in $Acr`: $($Images -join ', ')" -ForegroundColor Cyan
                }
            }
        }
        else {
            Write-Host "❌ No Azure Container Registry found" -ForegroundColor Red
        }
        
        # Check Container Apps Environment
        $ContainerAppEnvExists = az containerapp env show --name $ContainerAppEnv --resource-group $ResourceGroup --query "name" --output tsv 2>$null
        if ($ContainerAppEnvExists) {
            Write-Host "✅ Container Apps Environment '$ContainerAppEnv' exists" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Container Apps Environment '$ContainerAppEnv' not found" -ForegroundColor Red
        }
        
        # Check Container Apps
        $ContainerApps = az containerapp list --resource-group $ResourceGroup --query "[].{Name:name, Fqdn:properties.configuration.ingress.fqdn, Status:properties.runningStatus}" --output json | ConvertFrom-Json
        if ($ContainerApps) {
            Write-Host "✅ Container Apps:" -ForegroundColor Green
            foreach ($App in $ContainerApps) {
                $Status = if ($App.Status) { $App.Status } else { "Unknown" }
                Write-Host "  🚀 $($App.Name): https://$($App.Fqdn) (Status: $Status)" -ForegroundColor Cyan
            }
        }
        else {
            Write-Host "❌ No Container Apps found" -ForegroundColor Red
        }
        
    }
    else {
        Write-Host "❌ Resource Group '$ResourceGroup' does not exist" -ForegroundColor Red
    }
}

# Function to delete all resources
function Remove-Deployment {
    Write-Host "🗑️ Deleting BiteBudget V2 Deployment..." -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Red
    
    $Confirmation = Read-Host "Are you sure you want to delete all resources in '$ResourceGroup'? This action cannot be undone. Type 'DELETE' to confirm"
    if ($Confirmation -ne "DELETE") {
        Write-Host "❌ Deletion cancelled" -ForegroundColor Yellow
        return
    }
    
    try {
        # Check if resource group exists
        $ResourceGroupExists = az group exists --name $ResourceGroup
        if ($ResourceGroupExists -eq "true") {
            Write-Host "🗑️ Deleting resource group and all resources..." -ForegroundColor Yellow
            az group delete --name $ResourceGroup --yes --no-wait
            Write-Host "✅ Deletion initiated. Resources are being deleted in the background." -ForegroundColor Green
            Write-Host "   You can check the status in the Azure Portal or run the 'status' action." -ForegroundColor Yellow
        }
        else {
            Write-Host "❌ Resource Group '$ResourceGroup' does not exist" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ Failed to delete resources: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Main execution logic
switch ($Action) {
    "status" {
        Show-DeploymentStatus
        exit 0
    }
    "delete" {
        Remove-Deployment
        exit 0
    }
    "deploy" {
        # Continue with existing deployment logic
    }
    default {
        Write-Host "❌ Invalid action: $Action. Valid actions are: deploy, delete, status" -ForegroundColor Red
        exit 1
    }
}

try {
    Write-Host "🚀 Starting deployment process..." -ForegroundColor Yellow
    
    # Create resource group
    Write-Host "📦 Creating resource group..." -ForegroundColor Yellow
    az group create --name $ResourceGroup --location $Location

    # Create Azure Container Registry
    Write-Host "🏗️ Creating Azure Container Registry..." -ForegroundColor Yellow
    az acr create --resource-group $ResourceGroup --name $AcrName --sku Basic --admin-enabled true

    # Get ACR login server
    $AcrLoginServer = az acr show --name $AcrName --query loginServer --output tsv
    Write-Host "📍 ACR Login Server: $AcrLoginServer" -ForegroundColor Green

    # Build and push images
    Write-Host "🔨 Building and pushing backend image..." -ForegroundColor Yellow
    az acr build --registry $AcrName --image bitebudget-backend:latest ./backend

    Write-Host "🔨 Building and pushing frontend image..." -ForegroundColor Yellow
    az acr build --registry $AcrName --image bitebudget-frontend:latest --file "./frontend/Dockerfile.prod" ./frontend

    # Create Container Apps Environment
    Write-Host "🌐 Creating Container Apps Environment..." -ForegroundColor Yellow
    az containerapp env create --name $ContainerAppEnv --resource-group $ResourceGroup --location $Location

    # Get ACR credentials
    $AcrUsername = az acr credential show --name $AcrName --query username --output tsv
    $AcrPassword = az acr credential show --name $AcrName --query passwords[0].value --output tsv

    # Deploy backend
    Write-Host "🚀 Deploying backend container app..." -ForegroundColor Yellow
    az containerapp create `
        --name $BackendAppName `
        --resource-group $ResourceGroup `
        --environment $ContainerAppEnv `
        --image "$AcrLoginServer/bitebudget-backend:latest" `
        --target-port 5000 `
        --ingress 'external' `
        --registry-server $AcrLoginServer `
        --registry-username $AcrUsername `
        --registry-password $AcrPassword `
        --env-vars "SECRET_KEY=your-production-secret-key-change-me" "JWT_SECRET_KEY=your-jwt-secret-key-change-me" "DATABASE_URL=sqlite:///bitebudget.db" "FLASK_ENV=production"

    # Get backend URL
    $BackendUrl = az containerapp show --name $BackendAppName --resource-group $ResourceGroup --query properties.configuration.ingress.fqdn --output tsv
    Write-Host "🔗 Backend URL: https://$BackendUrl" -ForegroundColor Green

    # Deploy frontend
    Write-Host "🚀 Deploying frontend container app..." -ForegroundColor Yellow
    az containerapp create `
        --name $FrontendAppName `
        --resource-group $ResourceGroup `
        --environment $ContainerAppEnv `
        --image "$AcrLoginServer/bitebudget-frontend:latest" `
        --target-port 80 `
        --ingress 'external' `
        --registry-server $AcrLoginServer `
        --registry-username $AcrUsername `
        --registry-password $AcrPassword `
        --env-vars "REACT_APP_API_URL=https://$BackendUrl"

    # Get frontend URL
    $FrontendUrl = az containerapp show --name $FrontendAppName --resource-group $ResourceGroup --query properties.configuration.ingress.fqdn --output tsv

    Write-Host "✅ Deployment Complete!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "🌐 Frontend URL: https://$FrontendUrl" -ForegroundColor Green
    Write-Host "🔗 Backend URL: https://$BackendUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Update your domain DNS to point to the frontend URL"
    Write-Host "2. Configure SSL certificates if needed"
    Write-Host "3. Set up monitoring and logging"
    Write-Host "4. Configure backup strategies"
    Write-Host ""
    Write-Host "💡 Useful Commands:" -ForegroundColor Cyan
    Write-Host "   Check status: .\deploy-azure.ps1 -SubscriptionId $SubscriptionId -Action status"
    Write-Host "   Delete all:   .\deploy-azure.ps1 -SubscriptionId $SubscriptionId -Action delete"

}
catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   Check status: .\deploy-azure.ps1 -SubscriptionId $SubscriptionId -Action status"
    Write-Host "   Clean up:     .\deploy-azure.ps1 -SubscriptionId $SubscriptionId -Action delete"
    exit 1
}
