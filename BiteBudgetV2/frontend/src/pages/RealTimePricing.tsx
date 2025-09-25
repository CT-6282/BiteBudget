import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Store,
  Notifications,
  Timeline,
  CompareArrows,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

interface PriceAlert {
  id: number;
  product_name: string;
  target_price: number;
  current_price: number;
  store_name: string;
  percentage_drop: number;
  created_at: string;
}

interface PriceTrend {
  product_name: string;
  prices: {
    date: string;
    price: number;
    store: string;
  }[];
  prediction: {
    next_week: number;
    confidence: number;
    trend: 'up' | 'down' | 'stable';
  };
}

const RealTimePricing: React.FC = () => {
  const { formatCurrency } = useLanguage();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [trends, setTrends] = useState<PriceTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceTracking, setPriceTracking] = useState(true);

  useEffect(() => {
    // Simulate real-time price data
    const fetchPriceData = () => {
      setAlerts([
        {
          id: 1,
          product_name: 'Coca-Cola 2L',
          target_price: 20.00,
          current_price: 18.50,
          store_name: 'Walmart Supercenter',
          percentage_drop: 7.5,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          product_name: 'Pan Bimbo Integral',
          target_price: 25.00,
          current_price: 23.90,
          store_name: 'Chedraui',
          percentage_drop: 4.4,
          created_at: new Date().toISOString(),
        },
      ]);

      setTrends([
        {
          product_name: 'Leche Lala 1L',
          prices: [
            { date: '2024-07-15', price: 24.50, store: 'Walmart' },
            { date: '2024-07-16', price: 24.20, store: 'Walmart' },
            { date: '2024-07-17', price: 23.90, store: 'Walmart' },
            { date: '2024-07-18', price: 23.75, store: 'Walmart' },
            { date: '2024-07-19', price: 23.50, store: 'Walmart' },
          ],
          prediction: {
            next_week: 23.20,
            confidence: 85,
            trend: 'down',
          },
        },
        {
          product_name: 'Huevos San Juan',
          prices: [
            { date: '2024-07-15', price: 42.00, store: 'Soriana' },
            { date: '2024-07-16', price: 43.50, store: 'Soriana' },
            { date: '2024-07-17', price: 44.20, store: 'Soriana' },
            { date: '2024-07-18', price: 45.00, store: 'Soriana' },
            { date: '2024-07-19', price: 46.50, store: 'Soriana' },
          ],
          prediction: {
            next_week: 48.20,
            confidence: 78,
            trend: 'up',
          },
        },
      ]);

      setLoading(false);
    };

    fetchPriceData();
    
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(fetchPriceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp color="error" />;
      case 'down': return <TrendingDown color="success" />;
      default: return <Timeline color="info" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'error';
      case 'down': return 'success';
      default: return 'info';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando datos de precios en tiempo real...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Seguimiento de Precios en Tiempo Real
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitoreo automático de precios y predicciones con ML
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={priceTracking}
              onChange={(e) => setPriceTracking(e.target.checked)}
              color="primary"
            />
          }
          label="Tracking Activo"
        />
      </Box>

      {/* Price Alerts */}
      <Box mb={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Notifications color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Alertas de Precio ({alerts.length})
              </Typography>
            </Box>
              
              {alerts.length > 0 ? (
                <List>
                  {alerts.map((alert) => (
                    <ListItem key={alert.id} sx={{ bgcolor: 'success.light', borderRadius: 1, mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                        <TrendingDown />
                      </Avatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="bold">
                            {alert.product_name} - {alert.store_name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              Precio objetivo: {formatCurrency(alert.target_price)} → 
                              Precio actual: <strong>{formatCurrency(alert.current_price)}</strong>
                            </Typography>
                            <Chip
                              label={`-${alert.percentage_drop}%`}
                              size="small"
                              color="success"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                      <Button variant="contained" size="small">
                        Ver Oferta
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  No hay alertas de precio activas. Configura alertas en la página de productos.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Price Trends & ML Predictions */}
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
          {trends.map((trend, index) => (
            <Card key={index}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    {trend.product_name}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    {getTrendIcon(trend.prediction.trend)}
                    <Chip
                      label={trend.prediction.trend.toUpperCase()}
                      size="small"
                      color={getTrendColor(trend.prediction.trend) as any}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Box>

                {/* Price History */}
                <Typography variant="subtitle2" gutterBottom>
                  Historial de Precios (últimos 5 días)
                </Typography>
                <List dense>
                  {trend.prices.slice(-3).map((price, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">
                              {new Date(price.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {formatCurrency(price.price)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                {/* ML Prediction */}
                <Alert 
                  severity={trend.prediction.trend === 'up' ? 'warning' : 'success'}
                  sx={{ mt: 2 }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    Predicción ML (próxima semana)
                  </Typography>
                  <Typography variant="body2">
                    Precio estimado: <strong>{formatCurrency(trend.prediction.next_week)}</strong>
                  </Typography>
                  <Typography variant="caption">
                    Confianza: {trend.prediction.confidence}%
                  </Typography>
                </Alert>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CompareArrows />}
                  sx={{ mt: 2 }}
                >
                  Comparar Tiendas
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Real-time Status */}
        <Box mt={4}>
        <Alert severity="info" icon={<Timeline />}>
          <Typography variant="subtitle2" fontWeight="bold">
            Sistema de Monitoreo Activo
          </Typography>
          <Typography variant="body2">
            Última actualización: {new Date().toLocaleTimeString()} • 
            Próxima actualización en 30 segundos • 
            {alerts.length} alertas activas
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};

export default RealTimePricing;
