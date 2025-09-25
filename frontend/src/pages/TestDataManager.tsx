import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  DataUsage,
  Warning,
  CheckCircle,
  Receipt,
  ShoppingCart,
  TrendingUp,
  People,
  Refresh,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

const TestDataManager: React.FC = () => {
  const { t } = useLanguage();
  const [testDataEnabled, setTestDataEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [injectionStatus, setInjectionStatus] = useState<Record<string, boolean>>({
    receipts: false,
    budgets: false,
    products: false,
    analytics: false,
    social: false,
  });

  const testDataCategories = [
    {
      name: t('Sample Receipts'),
      description: t('20 realistic grocery receipts from different stores'),
      icon: <Receipt color="primary" />,
      count: 20,
      endpoint: '/api/test-data/receipts',
    },
    {
      name: t('Budget Templates'),
      description: t('Pre-configured budgets for different family sizes'),
      icon: <TrendingUp color="primary" />,
      count: 5,
      endpoint: '/api/test-data/budgets',
    },
    {
      name: t('Product Database'),
      description: t('500+ products with prices and sustainability scores'),
      icon: <ShoppingCart color="primary" />,
      count: 500,
      endpoint: '/api/test-data/products',
    },
    {
      name: t('Analytics Data'),
      description: t('Historical spending patterns and trends'),
      icon: <DataUsage color="primary" />,
      count: 12,
      endpoint: '/api/test-data/analytics',
    },
    {
      name: t('Social Data'),
      description: t('Community deals and user interactions'),
      icon: <People color="primary" />,
      count: 50,
      endpoint: '/api/test-data/social',
    },
  ];

  const handleTestDataToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setConfirmDialog(true);
    } else {
      setTestDataEnabled(false);
      clearTestData();
    }
  };

  const handleConfirmInjection = async () => {
    setConfirmDialog(false);
    setLoading(true);
    
    try {
      await injectTestData();
      setTestDataEnabled(true);
    } catch (error) {
      console.error('Failed to inject test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const injectTestData = async () => {
    const token = localStorage.getItem('token');
    
    for (const category of testDataCategories) {
      try {
        setInjectionStatus(prev => ({ ...prev, [category.name.toLowerCase()]: false }));
        
        await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${category.endpoint}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setInjectionStatus(prev => ({ ...prev, [category.name.toLowerCase()]: true }));
        
        // Add delay to show progress
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to inject ${category.name}:`, error);
      }
    }
  };

  const clearTestData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/test-data/clear`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setInjectionStatus({
        receipts: false,
        budgets: false,
        products: false,
        analytics: false,
      });
    } catch (error) {
      console.error('Failed to clear test data:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('Test Data Management')}
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          {t('Test data helps you explore BiteBudget features without manually entering information. You can enable or disable test data at any time.')}
        </Typography>
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              {t('Test Data Status')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={testDataEnabled}
                  onChange={handleTestDataToggle}
                  disabled={loading}
                />
              }
              label={testDataEnabled ? t('Enabled') : t('Disabled')}
            />
          </Box>
          
          {loading && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('Injecting test data...')}
              </Typography>
              <LinearProgress />
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            {t('Available Test Data Categories')}
          </Typography>
          
          <List>
            {testDataCategories.map((category, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {category.icon}
                </ListItemIcon>
                <ListItemText
                  primary={category.name}
                  secondary={category.description}
                />
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip 
                    label={`${category.count} items`} 
                    size="small" 
                    variant="outlined" 
                  />
                  {testDataEnabled && injectionStatus[category.name.toLowerCase()] && (
                    <CheckCircle color="success" fontSize="small" />
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {testDataEnabled && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('Test Data Actions')}
            </Typography>
            
            <Box display="flex" gap={2} mt={2}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => injectTestData()}
                disabled={loading}
              >
                {t('Refresh Test Data')}
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                onClick={clearTestData}
                disabled={loading}
              >
                {t('Clear All Test Data')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>{t('Enable Test Data?')}</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              {t('This will add sample data to your account including receipts, budgets, and analytics. This action can be reversed.')}
            </Typography>
          </Alert>
          <Typography variant="body2">
            {t('Test data includes:')}
          </Typography>
          <List dense>
            {testDataCategories.map((category, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {category.icon}
                </ListItemIcon>
                <ListItemText
                  primary={`${category.count} ${category.name}`}
                  secondary={category.description}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleConfirmInjection} variant="contained">
            {t('Enable Test Data')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TestDataManager;
