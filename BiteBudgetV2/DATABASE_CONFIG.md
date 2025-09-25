# Database Configuration Guide

## Current Status ⚠️

Your current database setup has some issues that need attention:

### Problem:

- SQLite database is stored in container filesystem (ephemeral)
- Data will be lost when container restarts
- Each container instance has its own database

### Solutions Available:

## 1. **Quick Fix (Current Approach - Good for Testing)**

- Updated to use `/app/data/bitebudget.db` in production
- Data persists within container lifecycle
- ✅ Suitable for light usage and testing
- ❌ Data lost on container recreation

## 2. **Recommended for Small Scale Production**

### Option A: Azure Container Apps with Persistent Volume

```bash
# Create a storage account for persistent data
az storage account create \
  --name bitebudgetdata \
  --resource-group bitebudget-rg \
  --location eastus \
  --sku Standard_LRS

# Create file share
az storage share create \
  --name database \
  --account-name bitebudgetdata

# Update container app with volume mount
az containerapp update \
  --name bitebudget-backend \
  --resource-group bitebudget-rg \
  --volume-mount "data:/app/data" \
  --azure-file-volume-name "data" \
  --azure-file-share-name "database" \
  --azure-file-account-name "bitebudgetdata"
```

### Option B: Azure SQL Database (Recommended for Production)

```bash
# Create Azure SQL Server
az sql server create \
  --name bitebudget-sql \
  --resource-group bitebudget-rg \
  --location eastus \
  --admin-user sqladmin \
  --admin-password YourStrongPassword123!

# Create database
az sql db create \
  --server bitebudget-sql \
  --resource-group bitebudget-rg \
  --name bitebudget \
  --tier Basic

# Get connection string and update container app
az containerapp update \
  --name bitebudget-backend \
  --resource-group bitebudget-rg \
  --set-env-vars "DATABASE_URL=postgresql://sqladmin:YourStrongPassword123!@bitebudget-sql.database.windows.net:1433/bitebudget?sslmode=require"
```

## 3. **Current Configuration (What I've Done)**

Updated `app.py` to:

- Use `/app/data/bitebudget.db` for production SQLite
- Automatically create data directory
- Environment-based configuration

### Environment Variables:

- `ENVIRONMENT=production` - Use persistent SQLite path
- `DATABASE_URL` - Override default database URL

## 4. **Cost Comparison**

| Option               | Monthly Cost | Scalability | Data Safety |
| -------------------- | ------------ | ----------- | ----------- |
| Container SQLite     | $0           | ⭐          | ⭐          |
| Azure Files + SQLite | ~$2          | ⭐⭐        | ⭐⭐⭐      |
| Azure SQL Basic      | ~$5          | ⭐⭐⭐      | ⭐⭐⭐⭐⭐  |

## 5. **Current Status: ACCEPTABLE for Testing**

Your current setup is fine for:

- ✅ Development and testing
- ✅ Demos and presentations
- ✅ Small personal usage
- ✅ Proof of concept

⚠️ **Data Persistence**: Your data will persist as long as the container isn't recreated. Azure Container Apps typically don't recreate containers unless there's an update or scaling event.

## 6. **When to Upgrade**

Upgrade to Azure SQL when you need:

- Multiple users accessing simultaneously
- Guaranteed data persistence
- High availability
- More than 100MB of data
- Production-level reliability

## 7. **Quick Check Commands**

```bash
# Check if data persists after container restart
az containerapp restart --name bitebudget-backend --resource-group bitebudget-rg

# Check database size (if accessible)
az containerapp exec --name bitebudget-backend --resource-group bitebudget-rg --command "ls -la /app/data/"
```

**Recommendation**: Keep current setup for now since you mentioned light usage. Monitor for any data loss and upgrade to Azure Files + SQLite if you need guaranteed persistence.
