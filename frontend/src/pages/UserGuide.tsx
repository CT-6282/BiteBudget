import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
} from '@mui/material';
import {
  ExpandMore,
  PlayArrow,
  Receipt,
  Analytics,
  AccountBalanceWallet,
  ShoppingCart,
  CameraAlt,
  TrendingUp,
  Nature,
  Share,
  LocalOffer,
  Notifications,
  Settings,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

const UserGuide: React.FC = () => {
  const { t } = useLanguage();

  const gettingStartedSteps = [
    {
      label: t('Create your account'),
      description: t('Sign up with your email and create a secure password'),
      icon: <PlayArrow />,
    },
    {
      label: t('Set your budget'),
      description: t('Go to Budget tab and set monthly or weekly spending limits'),
      icon: <AccountBalanceWallet />,
    },
    {
      label: t('Add your first receipt'),
      description: t('Use camera scanning or manual entry to add receipts'),
      icon: <Receipt />,
    },
    {
      label: t('Explore analytics'),
      description: t('View your spending patterns and insights'),
      icon: <Analytics />,
    },
  ];

  const features = [
    {
      title: t('Receipt Scanning'),
      icon: <CameraAlt color="primary" />,
      description: t('Scan receipts with your camera for automatic data extraction'),
      howTo: [
        t('Click the camera icon on receipts page'),
        t('Point camera at receipt ensuring good lighting'),
        t('Tap capture when receipt is clearly visible'),
        t('Review and edit extracted information'),
        t('Save to add to your spending history'),
      ],
    },
    {
      title: t('Smart Mapping'),
      icon: <ShoppingCart color="primary" />,
      description: t('AI-powered matching between shopping lists and receipts'),
      howTo: [
        t('Create a shopping list before shopping'),
        t('Scan receipt after shopping'),
        t('Go to Shopping List Mapping tab'),
        t('AI will automatically match items'),
        t('Review matches and confirm accuracy'),
      ],
    },
    {
      title: t('Sustainability Score'),
      icon: <Nature color="success" />,
      description: t('Track environmental impact of your purchases'),
      calculation: [
        t('Organic products: +20 points'),
        t('Local products: +15 points'),
        t('Eco-friendly packaging: +10 points'),
        t('Seasonal products: +5 points'),
        t('Processed foods: -10 points'),
      ],
    },
    {
      title: t('Real-time Pricing'),
      icon: <TrendingUp color="primary" />,
      description: t('Compare prices across stores and track trends'),
      howTo: [
        t('Go to Real-time Pricing tab'),
        t('Search for products you want to compare'),
        t('View prices from different stores'),
        t('Set price alerts for automatic notifications'),
        t('Track historical price trends'),
      ],
    },
    {
      title: t('Community Features'),
      icon: <Share color="primary" />,
      description: t('Share deals and learn from other users'),
      howTo: [
        t('Go to Social Features tab'),
        t('Share great deals you find'),
        t('Vote on deal accuracy'),
        t('Participate in savings challenges'),
        t('Add community deals to your list'),
      ],
    },
    {
      title: t('Budget Tracking'),
      icon: <AccountBalanceWallet color="primary" />,
      description: t('Set and monitor spending limits'),
      howTo: [
        t('Set category-specific budgets'),
        t('Monitor real-time spending'),
        t('Receive alerts when approaching limits'),
        t('Analyze budget performance'),
        t('Adjust budgets based on patterns'),
      ],
    },
  ];

  const tips = [
    {
      title: t('Best Receipt Scanning'),
      content: t('Ensure good lighting, flat surface, and capture entire receipt'),
    },
    {
      title: t('Accurate Budgeting'),
      content: t('Start with realistic budgets and adjust based on your actual spending patterns'),
    },
    {
      title: t('Maximize Savings'),
      content: t('Check real-time pricing before major purchases and set price alerts'),
    },
    {
      title: t('Community Benefits'),
      content: t('Active community participation helps everyone save more money'),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        {t('User Guide')}
      </Typography>
      <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
        {t('Learn how to make the most of BiteBudget')}
      </Typography>

      {/* Getting Started */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {t('Getting Started')}
          </Typography>
          <Stepper orientation="vertical">
            {gettingStartedSteps.map((step, index) => (
              <Step key={index} active>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                      }}
                    >
                      {step.icon}
                    </Box>
                  )}
                >
                  <Typography variant="h6">{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography color="text.secondary">{step.description}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Features Guide */}
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        {t('Features Guide')}
      </Typography>
      
      {features.map((feature, index) => (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={2}>
              {feature.icon}
              <Typography variant="h6">{feature.title}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{feature.description}</Typography>
            
            {feature.howTo && (
              <>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t('How to use:')}
                </Typography>
                <List dense>
                  {feature.howTo.map((step, stepIndex) => (
                    <ListItem key={stepIndex}>
                      <ListItemIcon>
                        <Chip label={stepIndex + 1} size="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {feature.calculation && (
              <>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                  {t('Sustainability Score Calculation:')}
                </Typography>
                <List dense>
                  {feature.calculation.map((item, itemIndex) => (
                    <ListItem key={itemIndex}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Tips & Best Practices */}
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        {t('Tips & Best Practices')}
      </Typography>
      
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
        {tips.map((tip, index) => (
          <Alert key={index} severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {tip.title}
            </Typography>
            <Typography variant="body2">{tip.content}</Typography>
          </Alert>
        ))}
      </Box>

      {/* Currency Information */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {t('Currency Information')}
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              {t('BiteBudget automatically detects your location and uses the appropriate currency (MXN for Mexico, USD for US). All prices are displayed in your local currency.')}
            </Typography>
          </Alert>
          <Typography variant="body2" color="text.secondary">
            {t('You can change currency settings in your profile if needed.')}
          </Typography>
        </CardContent>
      </Card>

      {/* Support */}
      <Paper sx={{ p: 3, mt: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          {t('Need More Help?')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('Contact our support team or check the community forums')}
        </Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          <Chip
            icon={<Settings />}
            label={t('Support Center')}
            clickable
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />
          <Chip
            icon={<Share />}
            label={t('Community Forum')}
            clickable
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default UserGuide;
