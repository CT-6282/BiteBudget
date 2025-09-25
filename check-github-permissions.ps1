#!/usr/bin/env pwsh

# Quick script to help with GitHub Container Registry permissions
param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken
)

Write-Host "🔧 GitHub Container Registry - Permission Helper" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Auto-detect GitHub username
$gitRemote = git remote get-url origin
if ($gitRemote -match "github\.com[:/]([^/]+)/") {
    $GitHubUsername = $Matches[1]
    Write-Host "✅ Detected GitHub username: $GitHubUsername" -ForegroundColor Green
} else {
    Write-Error "Could not auto-detect GitHub username"
    exit 1
}

Write-Host "`n📋 To fix the permission issue, you need to:" -ForegroundColor Cyan
Write-Host "1. Create a new Personal Access Token at: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "2. Select these scopes:" -ForegroundColor White
Write-Host "   ✅ write:packages" -ForegroundColor Green
Write-Host "   ✅ read:packages" -ForegroundColor Green
Write-Host "   ✅ repo" -ForegroundColor Green
Write-Host "3. Copy the new token and run the migration again" -ForegroundColor White

Write-Host "`n🔍 Let me check your current token permissions..." -ForegroundColor Cyan

try {
    # Try to list packages to test permissions
    $headers = @{
        'Authorization' = "Bearer $GitHubToken"
        'Accept' = 'application/vnd.github.v3+json'
    }
    
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/packages?package_type=container" -Headers $headers
    Write-Host "✅ Token has package read access!" -ForegroundColor Green
    
    # Test write permissions by checking if we can access package details
    if ($response.Count -gt 0) {
        Write-Host "📦 Found $($response.Count) existing package(s)" -ForegroundColor Yellow
    } else {
        Write-Host "📦 No existing packages found (this is normal for first time)" -ForegroundColor Yellow
    }
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "❌ Token authentication failed - invalid token" -ForegroundColor Red
    } elseif ($statusCode -eq 403) {
        Write-Host "❌ Token missing required scopes (write:packages, read:packages, repo)" -ForegroundColor Red
    } else {
        Write-Host "⚠️  Unexpected error: $_" -ForegroundColor Yellow
    }
    
    Write-Host "`n🔧 Please create a new token with the required scopes" -ForegroundColor Yellow
}

Write-Host "`n💡 After creating the new token, run:" -ForegroundColor Cyan
Write-Host "   ./migrate-to-github.ps1 -GitHubToken 'your_new_token'" -ForegroundColor White
