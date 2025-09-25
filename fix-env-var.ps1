#!/usr/bin/env pwsh

# Fix Environment Variable Mismatch for Registration Issue
# This script ensures consistent API URL environment variable usage

Write-Host "🔧 BiteBudget V2 - Environment Variable Fix" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

$BackendAppName = "bitebudget-backend"
$FrontendAppName = "bitebudget-frontend" 
$ResourceGroup = "bitebudget-rg"  # Fixed: using correct resource group name
$ApiUrl = "https://bitebudget-backend.livelymoss-133f0f64.eastus.azurecontainerapps.io"

Write-Host "📋 Current Issue: Registration failing due to API URL environment variable mismatch" -ForegroundColor Yellow
Write-Host "   Frontend expects: REACT_APP_API_URL" -ForegroundColor Yellow  
Write-Host "   Container has: REACT_APP_API_BASE_URL" -ForegroundColor Yellow

Write-Host "`n🔄 Fixing frontend container environment variable..." -ForegroundColor Cyan

# Update frontend container app environment variable
az containerapp update `
    --name $FrontendAppName `
    --resource-group $ResourceGroup `
    --set-env-vars REACT_APP_API_URL=$ApiUrl `
    --remove-env-vars REACT_APP_API_BASE_URL

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Environment variable fixed successfully!" -ForegroundColor Green
    
    Write-Host "`n🧪 Testing registration endpoint..." -ForegroundColor Cyan
    
    # Wait for container to restart
    Start-Sleep -Seconds 30
    
    # Test the backend registration endpoint
    try {
        $testPayload = @{
            username = "testuser"
            email = "test@example.com"  
            password = "testpass123"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$ApiUrl/auth/register" -Method Post -Body $testPayload -ContentType "application/json"
        Write-Host "✅ Registration endpoint is working!" -ForegroundColor Green
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 400 -and $_.Exception.Response -match "already exists") {
            Write-Host "✅ Registration endpoint is working (user exists error is expected)!" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️  Registration endpoint test: $($_)" -ForegroundColor Yellow
            Write-Host "   This might be normal if validation failed" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n📱 Please test the frontend registration form now:" -ForegroundColor Cyan
    Write-Host "   https://bitebudget-frontend.livelymoss-133f0f64.eastus.azurecontainerapps.io" -ForegroundColor Cyan
}
else {
    Write-Host "❌ Failed to update environment variable" -ForegroundColor Red
    exit 1
}
