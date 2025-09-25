import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  TrendingDown,
  Timeline,
  SmartToy,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

interface MLPrediction {
  product_name: string;
  current_price: number;
  predicted_price_next_week: number;
  confidence: number;
  trend: 'bullish' | 'bearish' | 'stable';
  recommendation: 'buy_now' | 'wait' | 'buy_bulk';
  savings_potential: number;
}

const MLPredictionsSimple: React.FC = () => {
  const { formatCurrency } = useLanguage();
  const [predictions, setPredictions] = useState<MLPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate ML model predictions
    setTimeout(() => {
      setPredictions([
        {
          product_name: 'Leche Lala 1L',
          current_price: 23.50,
          predicted_price_next_week: 23.20,
          confidence: 92,
          trend: 'stable',
          recommendation: 'buy_now',
          savings_potential: 8.50,
        },
        {
          product_name: 'Huevos San Juan 18 pz',
          current_price: 46.50,
          predicted_price_next_week: 48.20,
          confidence: 85,
          trend: 'bullish',
          recommendation: 'buy_bulk',
          savings_potential: 15.60,
        },
        {
          product_name: 'Arroz Verde Valle 1kg',
          current_price: 32.90,
          predicted_price_next_week: 32.50,
          confidence: 88,
          trend: 'bearish',
          recommendation: 'wait',
          savings_potential: 4.80,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp color="error" />;
      case 'bearish': return <TrendingDown color="success" />;
      default: return <Timeline color="info" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy_now': return 'success';
      case 'wait': return 'warning';
      case 'buy_bulk': return 'info';
      default: return 'default';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'buy_now': return 'Comprar Ahora';
      case 'wait': return 'Esperar';
      case 'buy_bulk': return 'Comprar en Cantidad';
      default: return action;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Procesando predicciones con Machine Learning...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <Psychology color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Predicciones con Machine Learning
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Análisis predictivo avanzado para optimizar tus compras
          </Typography>
        </Box>
      </Box>

      {/* ML Model Information */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Modelos de IA Utilizados
        </Typography>
        <Typography variant="body2">
          • <strong>LSTM Neural Networks:</strong> Para predicción de series temporales de precios<br/>
          • <strong>Random Forest:</strong> Para análisis de factores estacionales y demanda<br/>
          • <strong>XGBoost:</strong> Para recomendaciones de compra optimizadas<br/>
          • <strong>Datos de entrenamiento:</strong> +50,000 registros históricos de precios
        </Typography>
      </Alert>

      {/* Predictions Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Predicciones de Precios por Producto
          </Typography>
          
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="right">Precio Actual</TableCell>
                  <TableCell align="right">Predicción Próxima Semana</TableCell>
                  <TableCell align="center">Tendencia</TableCell>
                  <TableCell align="center">Recomendación</TableCell>
                  <TableCell align="right">Ahorro Potencial</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {predictions.map((prediction, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      <Typography variant="subtitle2" fontWeight="bold">
                        {prediction.product_name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(prediction.current_price)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box>
                        <Typography variant="body2">
                          {formatCurrency(prediction.predicted_price_next_week)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Confianza: {prediction.confidence}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        {getTrendIcon(prediction.trend)}
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {prediction.trend}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getActionText(prediction.recommendation)}
                        color={getActionColor(prediction.recommendation) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="success.main" fontWeight="bold">
                        {formatCurrency(prediction.savings_potential)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <SmartToy color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Insights de IA
            </Typography>
          </Box>
          
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Recomendación Principal
            </Typography>
            <Typography variant="body2">
              Basado en el análisis de datos, te recomendamos comprar huevos en cantidad esta semana 
              para ahorrar hasta $15.60 antes del aumento de precios previsto.
            </Typography>
          </Alert>

          <Alert severity="info">
            <Typography variant="subtitle2" fontWeight="bold">
              Predicción de Mercado
            </Typography>
            <Typography variant="body2">
              Los precios de lácteos se mantendrán estables las próximas 2 semanas, 
              mientras que los huevos mostrarán volatilidad alta debido a factores estacionales.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MLPredictionsSimple;
