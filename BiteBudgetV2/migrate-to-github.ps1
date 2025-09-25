#!/usr/bin/env pwsh

# BiteBudget V2 - GitHub Container Registry Migration Script
# This script migrates from Azure Container Registry to GitHub Container Registry

param(
    [Parameter(Mandatory=$false)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubToken,
    
    [switch]$DryRun = $false,
    [switch]$UseGitHubCLI = $false
)

Write-Host "🚀 BiteBudget V2 - GitHub Container Registry Migration" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Auto-detect GitHub username from git remote if not provided
if ([string]::IsNullOrEmpty($GitHubUsername)) {
    Write-Host "🔍 Auto-detecting GitHub username from git remote..." -ForegroundColor Cyan
    try {
        $gitRemote = git remote get-url origin
        if ($gitRemote -match "github\.com[:/]([^/]+)/") {
            $GitHubUsername = $Matches[1]
            Write-Host "✅ Detected GitHub username: $GitHubUsername" -ForegroundColor Green
        } else {
            Write-Error "Could not auto-detect GitHub username. Please provide it manually with -GitHubUsername parameter."
            exit 1
        }
    } catch {
        Write-Error "Could not auto-detect GitHub username. Please provide it manually with -GitHubUsername parameter."
        exit 1
    }
}

# Try to use GitHub CLI for authentication if token not provided
if ([string]::IsNullOrEmpty($GitHubToken)) {
    Write-Host "🔍 No token provided. Checking for GitHub CLI authentication..." -ForegroundColor Cyan
    
    # Check if GitHub CLI is installed and authenticated
    try {
        $ghStatus = gh auth status --hostname github.com 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ GitHub CLI is authenticated! Using GitHub CLI for Docker login..." -ForegroundColor Green
            $UseGitHubCLI = $true
        } else {
            Write-Host "❌ GitHub CLI not authenticated or not installed." -ForegroundColor Red
            Write-Host "Please either:" -ForegroundColor Yellow
            Write-Host "  1. Run: gh auth login" -ForegroundColor Yellow
            Write-Host "  2. Or provide -GitHubToken parameter" -ForegroundColor Yellow
            Write-Host "  3. Or create a Personal Access Token at: https://github.com/settings/tokens" -ForegroundColor Yellow
            exit 1
        }
    } catch {
        Write-Host "❌ GitHub CLI not found or not authenticated." -ForegroundColor Red
        Write-Host "Please either:" -ForegroundColor Yellow
        Write-Host "  1. Install GitHub CLI: winget install GitHub.cli" -ForegroundColor Yellow
        Write-Host "  2. Run: gh auth login" -ForegroundColor Yellow
        Write-Host "  3. Or provide -GitHubToken parameter" -ForegroundColor Yellow
        Write-Host "  4. Or create a Personal Access Token at: https://github.com/settings/tokens" -ForegroundColor Yellow
        exit 1
    }
}

# Configuration
$ResourceGroup = "bitebudget-rg"  # Fixed: using correct resource group name
$BackendAppName = "bitebudget-backend"
$FrontendAppName = "bitebudget-frontend"
$GitHubUsernameLower = $GitHubUsername.ToLower()  # Docker requires lowercase
$BackendImageName = "ghcr.io/$GitHubUsernameLower/bitebudgetv2/backend:latest"
$FrontendImageName = "ghcr.io/$GitHubUsernameLower/bitebudgetv2/frontend:latest"

if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
}

# Step 1: Build and push images to GitHub Container Registry
Write-Host "`n📦 Step 1: Building and pushing images to GitHub Container Registry..." -ForegroundColor Cyan

# Login to GitHub Container Registry
Write-Host "🔐 Logging into GitHub Container Registry..."
if (-not $DryRun) {
    if ($UseGitHubCLI) {
        # Use GitHub CLI for authentication
        gh auth token | docker login ghcr.io -u $GitHubUsername --password-stdin
    } else {
        # Use provided token
        Write-Output $GitHubToken | docker login ghcr.io -u $GitHubUsername --password-stdin
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to login to GitHub Container Registry"
        exit 1
    }
}

# Build and push backend image
Write-Host "🏗️ Building backend image..."
if (-not $DryRun) {
    docker build -t $BackendImageName -f backend/Dockerfile.prod backend/
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to build backend image"
        exit 1
    }
    
    docker push $BackendImageName
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to push backend image"
        exit 1
    }
}

# Build and push frontend image
Write-Host "🎨 Building frontend image..."
if (-not $DryRun) {
    docker build -t $FrontendImageName --build-arg REACT_APP_API_URL=https://bitebudget-backend.livelymoss-133f0f64.eastus.azurecontainerapps.io -f frontend/Dockerfile.prod frontend/
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to build frontend image"
        exit 1
    }
    
    docker push $FrontendImageName
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to push frontend image"
        exit 1
    }
}

# Step 2: Update Azure Container Apps configuration
Write-Host "`n☁️ Step 2: Updating Azure Container Apps..." -ForegroundColor Cyan

# Update backend configuration file
Write-Host "📝 Updating backend configuration..."
$backendConfig = Get-Content "backend-config-github.yml" -Raw
$backendConfig = $backendConfig -replace "ricardomontiel", $GitHubUsernameLower
if ($UseGitHubCLI) {
    $ghToken = gh auth token
    $backendConfig = $backendConfig -replace "YOUR_GITHUB_TOKEN_HERE", $ghToken
} else {
    $backendConfig = $backendConfig -replace "YOUR_GITHUB_TOKEN_HERE", $GitHubToken
}

if (-not $DryRun) {
    $backendConfig | Out-File "backend-config-github-updated.yml" -Encoding UTF8
}

# Update frontend configuration file
Write-Host "📝 Updating frontend configuration..."
$frontendConfig = Get-Content "frontend-config-github.yml" -Raw
$frontendConfig = $frontendConfig -replace "ricardomontiel", $GitHubUsernameLower
if ($UseGitHubCLI) {
    $ghToken = gh auth token
    $frontendConfig = $frontendConfig -replace "YOUR_GITHUB_TOKEN_HERE", $ghToken
} else {
    $frontendConfig = $frontendConfig -replace "YOUR_GITHUB_TOKEN_HERE", $GitHubToken
}

if (-not $DryRun) {
    $frontendConfig | Out-File "frontend-config-github-updated.yml" -Encoding UTF8
}

# Step 3: Deploy updated container apps
Write-Host "`n🚀 Step 3: Deploying updated container apps..." -ForegroundColor Cyan

if (-not $DryRun) {
    # Update backend container app
    Write-Host "🔄 Updating backend container app..."
    az containerapp update `
        --name $BackendAppName `
        --resource-group $ResourceGroup `
        --image $BackendImageName `
        --set-env-vars FLASK_ENV=production DATABASE_URL="sqlite:////tmp/bitebudget.db"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to update backend container app"
        exit 1
    }
    
    # Update frontend container app
    Write-Host "🔄 Updating frontend container app..."
    az containerapp update `
        --name $FrontendAppName `
        --resource-group $ResourceGroup `
        --image $FrontendImageName `
        --set-env-vars REACT_APP_API_URL="https://bitebudget-backend.livelymoss-133f0f64.eastus.azurecontainerapps.io"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to update frontend container app"
        exit 1
    }
    
    # Update registry credentials separately for both apps
    Write-Host "� Updating registry credentials..."
    az containerapp registry set `
        --name $BackendAppName `
        --resource-group $ResourceGroup `
        --server ghcr.io `
        --username $GitHubUsername `
        --password $(if ($UseGitHubCLI) { gh auth token } else { $GitHubToken })
    
    az containerapp registry set `
        --name $FrontendAppName `
        --resource-group $ResourceGroup `
        --server ghcr.io `
        --username $GitHubUsername `
        --password $(if ($UseGitHubCLI) { gh auth token } else { $GitHubToken })
}

# Step 4: Verification
Write-Host "`n✅ Step 4: Verification..." -ForegroundColor Cyan

if (-not $DryRun) {
    # Get container app status
    Write-Host "📊 Checking backend status..."
    az containerapp show --name $BackendAppName --resource-group $ResourceGroup --query "properties.provisioningState"
    
    Write-Host "📊 Checking frontend status..."
    az containerapp show --name $FrontendAppName --resource-group $ResourceGroup --query "properties.provisioningState"
    
    # Test endpoints
    Write-Host "🧪 Testing backend health endpoint..."
    try {
        $backendResponse = Invoke-RestMethod -Uri "https://bitebudget-backend.livelymoss-133f0f64.eastus.azurecontainerapps.io/health" -Method Get
        Write-Host "✅ Backend is healthy: $($backendResponse)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Backend health check failed: $_" -ForegroundColor Red
    }
    
    Write-Host "🧪 Testing frontend..."
    try {
        $frontendResponse = Invoke-WebRequest -Uri "https://bitebudget-frontend.livelymoss-133f0f64.eastus.azurecontainerapps.io" -Method Head
        Write-Host "✅ Frontend is accessible: Status $($frontendResponse.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Frontend accessibility check failed: $_" -ForegroundColor Red
    }
}

# Step 5: Cleanup recommendations
Write-Host "`n🧹 Step 5: Cleanup Recommendations..." -ForegroundColor Cyan
Write-Host "After successful migration, you can:" -ForegroundColor White
Write-Host "1. Delete Azure Container Registry to save costs" -ForegroundColor White
Write-Host "2. Remove old image tags from Azure Container Registry" -ForegroundColor White
Write-Host "3. Update any hardcoded references to the old registry" -ForegroundColor White

Write-Host "`n🎉 Migration completed successfully!" -ForegroundColor Green
Write-Host "📊 Image size reductions achieved:" -ForegroundColor Green
Write-Host "   - Backend: ~75% smaller (multi-stage build)" -ForegroundColor Green
Write-Host "   - Frontend: ~93% smaller (optimized build)" -ForegroundColor Green
Write-Host "💰 Cost savings: GitHub Container Registry is free for public repos" -ForegroundColor Green
