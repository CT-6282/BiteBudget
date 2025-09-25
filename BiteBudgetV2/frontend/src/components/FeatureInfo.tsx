import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Info,
  ExpandMore,
  Nature,
  TrendingUp,
  CompareArrows,
  Receipt,
  Psychology,
  People,
  LocalShipping,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

interface FeatureInfoProps {
  feature: 
    | 'sustainability'
    | 'smart-mapping'
    | 'price-prediction'
    | 'barcode-scanning'
    | 'ml-insights'
    | 'community'
    | 'delivery'
    | 'budget-tracking';
  size?: 'small' | 'medium' | 'large';
}

const FeatureInfo: React.FC<FeatureInfoProps> = ({ feature, size = 'medium' }) => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const featureData = {
    sustainability: {
      title: t('Sustainability Score'),
      icon: <Nature color="success" />,
      description: t('Track the environmental impact of your shopping choices'),
      howItWorks: [
        t('Organic products add +20 points to your score'),
        t('Local products (within 100km) add +15 points'),
        t('Eco-friendly packaging adds +10 points'),
        t('Seasonal products add +5 points'),
        t('Highly processed foods subtract -10 points'),
      ],
      benefits: [
        t('Make environmentally conscious decisions'),
        t('Reduce your carbon footprint'),
        t('Support local businesses'),
        t('Track improvement over time'),
      ],
      calculation: t('Score = Base(50) + Organic(±20) + Local(±15) + Packaging(±10) + Seasonal(±5) + Processing(±10)'),
    },
    'smart-mapping': {
      title: t('Smart Mapping'),
      icon: <CompareArrows color="primary" />,
      description: t('AI-powered matching between shopping lists and receipts'),
      howItWorks: [
        t('AI analyzes product names using fuzzy matching'),
        t('Handles brand variations and size differences'),
        t('Uses machine learning to improve accuracy over time'),
        t('Provides confidence scores for each match'),
        t('Learns from your feedback to improve suggestions'),
      ],
      benefits: [
        t('Automatically track what you actually bought vs planned'),
        t('Identify frequently forgotten items'),
        t('Analyze spending patterns and impulse purchases'),
        t('97% accuracy in product matching'),
      ],
      calculation: t('Uses Natural Language Processing and fuzzy string matching algorithms'),
    },
    'price-prediction': {
      title: t('Price Prediction'),
      icon: <TrendingUp color="primary" />,
      description: t('ML-powered price forecasting and trend analysis'),
      howItWorks: [
        t('Machine learning models analyze historical price data'),
        t('Factors in seasonal trends and market conditions'),
        t('Considers demand patterns and supply chain data'),
        t('Updates predictions daily with new data'),
        t('Provides confidence intervals for accuracy'),
      ],
      benefits: [
        t('Know the best time to buy products'),
        t('Set intelligent price alerts'),
        t('Plan purchases around price drops'),
        t('87% accuracy within ±5% price range'),
      ],
      calculation: t('Linear Regression + Random Forest + Gradient Boosting ensemble model'),
    },
    'barcode-scanning': {
      title: t('Barcode Scanning'),
      icon: <Receipt color="primary" />,
      description: t('Real-time barcode recognition for quick product entry'),
      howItWorks: [
        t('Uses QuaggaJS library for browser-based scanning'),
        t('Supports multiple barcode formats (EAN-13, UPC-A, etc.)'),
        t('Real-time camera processing'),
        t('Automatic product lookup in database'),
        t('Works offline with cached product data'),
      ],
      benefits: [
        t('Quick product entry without typing'),
        t('99% accuracy in good lighting conditions'),
        t('Works with most smartphone cameras'),
        t('Instant price and product information'),
      ],
      calculation: t('Computer vision with pattern recognition algorithms'),
    },
    'ml-insights': {
      title: t('ML Insights'),
      icon: <Psychology color="primary" />,
      description: t('AI-powered shopping recommendations and insights'),
      howItWorks: [
        t('Analyzes your shopping patterns over time'),
        t('Identifies seasonal spending trends'),
        t('Predicts likely next purchases'),
        t('Recommends budget optimizations'),
        t('Learns from user feedback and behavior'),
      ],
      benefits: [
        t('Personalized shopping recommendations'),
        t('Early warning for budget overruns'),
        t('Discover money-saving opportunities'),
        t('Improve shopping efficiency'),
      ],
      calculation: t('K-means clustering + LSTM neural networks + collaborative filtering'),
    },
    community: {
      title: t('Community Features'),
      icon: <People color="primary" />,
      description: t('Social platform for sharing deals and savings tips'),
      howItWorks: [
        t('Users share deals and verify prices'),
        t('Community voting system for deal accuracy'),
        t('Location-based deal sharing'),
        t('Gamified savings challenges'),
        t('Achievement system with badges'),
      ],
      benefits: [
        t('Discover deals you might miss'),
        t('Verify prices before shopping'),
        t('Learn from experienced savers'),
        t('Participate in fun challenges'),
      ],
      calculation: t('Reputation system based on contribution quality and accuracy'),
    },
    delivery: {
      title: t('Delivery Integration'),
      icon: <LocalShipping color="primary" />,
      description: t('Compare and track delivery service costs'),
      howItWorks: [
        t('Integrates with major delivery platforms'),
        t('Compares delivery vs in-store costs'),
        t('Tracks delivery fees and tips'),
        t('Analyzes time vs money trade-offs'),
        t('Automatic expense categorization'),
      ],
      benefits: [
        t('Make informed delivery decisions'),
        t('Track true cost of convenience'),
        t('Optimize delivery timing for savings'),
        t('Complete expense tracking'),
      ],
      calculation: t('Cost analysis including fees, tips, time value, and gas savings'),
    },
    'budget-tracking': {
      title: t('Budget Tracking'),
      icon: <TrendingUp color="primary" />,
      description: t('Intelligent budget management with AI recommendations'),
      howItWorks: [
        t('ML algorithms analyze spending patterns'),
        t('Dynamic budget adjustments based on history'),
        t('Predictive alerts before overspending'),
        t('Category-based budget optimization'),
        t('Goal setting with milestone tracking'),
      ],
      benefits: [
        t('Stay within spending limits'),
        t('Achieve financial goals faster'),
        t('Understand spending triggers'),
        t('Automatic savings recommendations'),
      ],
      calculation: t('Statistical analysis of spending patterns with variance prediction'),
    },
  };

  const data = featureData[feature];

  if (!data) {
    return null;
  }

  return (
    <>
      <Tooltip title={t('Learn more about this feature')}>
        <IconButton 
          size={size} 
          onClick={() => setOpen(true)}
          sx={{ ml: 1 }}
        >
          <Info fontSize={size} />
        </IconButton>
      </Tooltip>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            {data.icon}
            <Typography variant="h6">{data.title}</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" paragraph>
            {data.description}
          </Typography>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t('How It Works')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {data.howItWorks.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Chip label={index + 1} size="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t('Benefits')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {data.benefits.map((benefit, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Nature fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight="bold">
                {t('Technical Details')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {data.calculation}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            {t('Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FeatureInfo;
