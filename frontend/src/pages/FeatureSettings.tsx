import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Box,
  Divider,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Group as GroupIcon,
  LocalShipping as DeliveryIcon,
  Psychology as MLIcon,
  TrendingUp as PricingIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext';

const FeatureSettings: React.FC = () => {
  const { features, updateFeature, resetToDefaults } = useSettings();

  const featureList = [
    {
      key: 'showCommunityFeatures' as const,
      label: 'Community Features',
      description: 'Social features, deal sharing, and community challenges',
      icon: <GroupIcon color="primary" />
    },
    {
      key: 'showDeliveryIntegration' as const,
      label: 'Delivery Integration',
      description: 'Integration with delivery services and order tracking',
      icon: <DeliveryIcon color="primary" />
    },
    {
      key: 'showMLPredictions' as const,
      label: 'ML Predictions',
      description: 'Machine learning-based price predictions and recommendations',
      icon: <MLIcon color="primary" />
    },
    {
      key: 'showRealTimePricing' as const,
      label: 'Real-time Pricing',
      description: 'Live price comparisons and alerts across stores',
      icon: <PricingIcon color="primary" />
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <SettingsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Feature Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Control which features are visible in your BiteBudget app
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Presentation Mode:</strong> You can hide advanced features when demonstrating 
          the core functionality of BiteBudget. Changes are saved locally and will persist 
          across sessions.
        </Typography>
      </Alert>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2">
              Available Features
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={resetToDefaults}
              size="small"
            >
              Reset to Defaults
            </Button>
          </Box>

          <List>
            {featureList.map((feature, index) => (
              <React.Fragment key={feature.key}>
                <ListItem sx={{ px: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    {feature.icon}
                  </Box>
                  <ListItemText
                    primary={feature.label}
                    secondary={feature.description}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={features[feature.key]}
                      onChange={(e) => updateFeature(feature.key, e.target.checked)}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                {index < featureList.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Active features in your current session:
          </Typography>
          <Box sx={{ mt: 2 }}>
            {featureList
              .filter(feature => features[feature.key])
              .map(feature => (
                <Box
                  key={feature.key}
                  sx={{
                    display: 'inline-block',
                    mr: 1,
                    mb: 1,
                    px: 2,
                    py: 0.5,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: 1,
                    fontSize: '0.875rem'
                  }}
                >
                  {feature.label}
                </Box>
              ))}
            {featureList.filter(feature => features[feature.key]).length === 0 && (
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                No features enabled
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FeatureSettings;
