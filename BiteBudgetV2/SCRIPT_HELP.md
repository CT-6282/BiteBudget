# Enhanced deploy-azure.ps1 Script Help

## Overview

The `deploy-azure.ps1` script now supports multiple actions for complete Azure deployment lifecycle management.

## Usage

```powershell
.\deploy-azure.ps1 -SubscriptionId "<your-subscription-id>" [-Action <deploy|status|delete>] [-ResourceGroup "<rg-name>"] [-Location "<location>"] [-AcrName "<acr-name>"]
```

## Parameters

### Required

- **SubscriptionId**: Your Azure subscription ID

### Optional

- **Action**: What to do (default: "deploy")
  - `deploy`: Create/update the entire deployment
  - `status`: Check current deployment status
  - `delete`: Remove all resources (requires confirmation)
- **ResourceGroup**: Resource group name (default: "bitebudget-rg")
- **Location**: Azure region (default: "East US")
- **AcrName**: Container registry name (default: auto-generated)

## Examples

### Check deployment status

```powershell
.\deploy-azure.ps1 -SubscriptionId "0ee4d157-5405-4a09-bf25-b4a0581a1adb" -Action status
```

### Deploy to custom resource group

```powershell
.\deploy-azure.ps1 -SubscriptionId "0ee4d157-5405-4a09-bf25-b4a0581a1adb" -ResourceGroup "my-custom-rg" -Action deploy
```

### Delete everything (with confirmation)

```powershell
.\deploy-azure.ps1 -SubscriptionId "0ee4d157-5405-4a09-bf25-b4a0581a1adb" -Action delete
```

## Safety Features

### Deletion Protection

- Requires typing "DELETE" (all caps) to confirm
- Shows what will be deleted before confirmation
- Uses background deletion to prevent hanging

### Status Reporting

- Shows comprehensive deployment status
- Lists all resources and their states
- Displays URLs for deployed applications

## Error Handling

- Validates Azure CLI installation
- Provides helpful error messages
- Suggests troubleshooting commands on failure

## Output Colors

- 🚀 **Green**: Success messages
- ⚠️ **Yellow**: Warnings and informational messages
- ❌ **Red**: Errors and failures
- 🔗 **Cyan**: URLs and secondary information
