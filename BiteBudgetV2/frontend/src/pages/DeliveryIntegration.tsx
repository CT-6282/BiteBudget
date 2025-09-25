import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
} from '@mui/material';
import {
  LocalShipping,
  ShoppingCart,
  Schedule,
  LocationOn,
  Star,
  AttachMoney,
  DirectionsCar,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

interface DeliveryService {
  id: string;
  name: string;
  logo: string;
  description: string;
  enabled: boolean;
  connected: boolean;
  features: string[];
  delivery_fee: number;
  min_order: number;
  avg_delivery_time: number;
  rating: number;
  coverage_areas: string[];
}

interface DeliveryOrder {
  id: number;
  service: string;
  items: number;
  total: number;
  delivery_fee: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'on_way' | 'delivered';
  estimated_delivery: string;
  created_at: string;
}

const DeliveryIntegration: React.FC = () => {
  const { formatCurrency } = useLanguage();
  const [services, setServices] = useState<DeliveryService[]>([]);
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [configDialog, setConfigDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<DeliveryService | null>(null);
  const [orderDialog, setOrderDialog] = useState(false);
  const [orderingService, setOrderingService] = useState<DeliveryService | null>(null);

  useEffect(() => {
    // Mock delivery services data
    setServices([
      {
        id: 'rappi',
        name: 'Rappi',
        logo: '🛒',
        description: 'Entrega rápida desde supermercados y tiendas locales',
        enabled: true,
        connected: true,
        features: ['Supermercados', 'Restaurantes', 'Farmacia', 'Licores'],
        delivery_fee: 29.00,
        min_order: 150.00,
        avg_delivery_time: 35,
        rating: 4.2,
        coverage_areas: ['CDMX', 'Guadalajara', 'Monterrey', 'Puebla'],
      },
      {
        id: 'uber_eats',
        name: 'Uber Eats',
        logo: '🚗',
        description: 'Delivery de comida y supermercados con Uber',
        enabled: true,
        connected: false,
        features: ['Restaurantes', 'Supermercados', 'Convenience'],
        delivery_fee: 25.00,
        min_order: 100.00,
        avg_delivery_time: 30,
        rating: 4.1,
        coverage_areas: ['CDMX', 'Guadalajara', 'Monterrey'],
      },
      {
        id: 'didi_food',
        name: 'DiDi Food',
        logo: '🛺',
        description: 'Plataforma de delivery con precios competitivos',
        enabled: false,
        connected: false,
        features: ['Restaurantes', 'Supermercados', 'Postres'],
        delivery_fee: 22.00,
        min_order: 120.00,
        avg_delivery_time: 40,
        rating: 3.9,
        coverage_areas: ['CDMX', 'Tijuana', 'León'],
      },
      {
        id: 'cornershop',
        name: 'Cornershop by Uber',
        logo: '🏪',
        description: 'Especializado en supermercados y farmacias',
        enabled: true,
        connected: true,
        features: ['Supermercados', 'Farmacia', 'Licores', 'Mascotas'],
        delivery_fee: 35.00,
        min_order: 200.00,
        avg_delivery_time: 60,
        rating: 4.3,
        coverage_areas: ['CDMX', 'Guadalajara', 'Monterrey', 'Mérida'],
      },
      {
        id: 'jokr',
        name: 'JOKR',
        logo: '⚡',
        description: 'Delivery ultrarrápido en 15 minutos',
        enabled: false,
        connected: false,
        features: ['Convenience', 'Snacks', 'Bebidas', 'Básicos'],
        delivery_fee: 15.00,
        min_order: 80.00,
        avg_delivery_time: 15,
        rating: 4.0,
        coverage_areas: ['CDMX', 'Guadalajara'],
      },
    ]);

    setOrders([
      {
        id: 1,
        service: 'Rappi',
        items: 8,
        total: 287.50,
        delivery_fee: 29.00,
        status: 'on_way',
        estimated_delivery: '2024-07-20T16:30:00Z',
        created_at: '2024-07-20T15:45:00Z',
      },
      {
        id: 2,
        service: 'Cornershop',
        items: 12,
        total: 456.20,
        delivery_fee: 35.00,
        status: 'delivered',
        estimated_delivery: '2024-07-19T19:00:00Z',
        created_at: '2024-07-19T17:30:00Z',
      },
    ]);
  }, []);

  const handleToggleService = (serviceId: string) => {
    setServices(services.map(service =>
      service.id === serviceId
        ? { ...service, enabled: !service.enabled }
        : service
    ));
  };

  const handleConfigureService = (service: DeliveryService) => {
    setSelectedService(service);
    setConfigDialog(true);
  };

  const handleOrderFromService = (service: DeliveryService) => {
    setOrderingService(service);
    setOrderDialog(true);
  };

  const handleGoToApp = (service: DeliveryService) => {
    // This would open the actual delivery app or website
    const urls: Record<string, string> = {
      rappi: 'https://www.rappi.com.mx/',
      uber_eats: 'https://www.ubereats.com/mx',
      didi_food: 'https://food.didiglobal.com/',
      cornershop: 'https://cornershopapp.com/mx',
    };
    
    const url = urls[service.id] || '#';
    window.open(url, '_blank');
    setOrderDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'preparing': return 'info';
      case 'on_way': return 'primary';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'on_way': return 'En camino';
      case 'delivered': return 'Entregado';
      default: return status;
    }
  };

  const getDeliveryIcon = (avgTime: number) => {
    if (avgTime <= 20) return <DirectionsCar color="success" />;
    if (avgTime <= 40) return <DirectionsCar color="info" />;
    return <LocalShipping color="warning" />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <LocalShipping color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Servicios de Delivery
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Integra tu lista de compras con apps de delivery
          </Typography>
        </Box>
      </Box>

      {/* Active Orders */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pedidos Activos ({orders.filter(o => o.status !== 'delivered').length})
          </Typography>
          
          {orders.filter(order => order.status !== 'delivered').map((order) => (
            <Box key={order.id} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {order.service}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.items} productos • {formatCurrency(order.total + order.delivery_fee)}
                  </Typography>
                  <Chip
                    label={getStatusText(order.status)}
                    color={getStatusColor(order.status) as any}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Box textAlign="right">
                  <Typography variant="caption" color="text.secondary">
                    Entrega estimada
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {new Date(order.estimated_delivery).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}

          {orders.filter(o => o.status !== 'delivered').length === 0 && (
            <Alert severity="info">
              No tienes pedidos activos. ¡Haz tu primera compra usando las integraciones!
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Delivery Services */}
      <Typography variant="h6" gutterBottom>
        Servicios Disponibles
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3 
      }}>
        {services.map((service) => (
          <Card key={service.id} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: 'transparent', fontSize: '2rem', mr: 2 }}>
                      {service.logo}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {service.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="caption">
                          {service.rating}
                        </Typography>
                        <Chip
                          label={service.connected ? 'Conectado' : 'Desconectado'}
                          size="small"
                          color={service.connected ? 'success' : 'default'}
                        />
                      </Box>
                    </Box>
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={service.enabled}
                        onChange={() => handleToggleService(service.id)}
                        color="primary"
                      />
                    }
                    label=""
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2}>
                  {service.description}
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                  {service.features.map((feature) => (
                    <Chip
                      key={feature}
                      label={feature}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <List dense>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <AttachMoney sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Envío: ${formatCurrency(service.delivery_fee)}`}
                      secondary={`Mínimo: ${formatCurrency(service.min_order)}`}
                    />
                  </ListItem>
                  
                  <ListItem disablePadding>
                    <ListItemIcon>
                      {getDeliveryIcon(service.avg_delivery_time)}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${service.avg_delivery_time} min promedio`}
                      secondary="Tiempo de entrega"
                    />
                  </ListItem>
                  
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <LocationOn sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={service.coverage_areas.join(', ')}
                      secondary="Áreas de cobertura"
                    />
                  </ListItem>
                </List>

                {service.enabled && (
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleConfigureService(service)}
                      sx={{ mr: 1 }}
                    >
                      Configurar
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ShoppingCart />}
                      disabled={!service.connected}
                      onClick={() => handleOrderFromService(service)}
                    >
                      Hacer Pedido
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
        ))}
      </Box>

      {/* Configuration Dialog */}
      <Dialog open={configDialog} onClose={() => setConfigDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Configurar {selectedService?.name}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Conecta tu cuenta de {selectedService?.name} para hacer pedidos directamente desde BiteBudget.
          </Alert>
          
          <TextField
            fullWidth
            label="Email de la cuenta"
            type="email"
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Token de API (opcional)"
            type="password"
            helperText="Puedes obtener esto desde la configuración de desarrollador de la app"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialog(false)}>Cancelar</Button>
          <Button variant="contained">Conectar Cuenta</Button>
        </DialogActions>
      </Dialog>

      {/* Order Dialog */}
      <Dialog open={orderDialog} onClose={() => setOrderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Pedido con {orderingService?.name}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Serás redirigido a la app de {orderingService?.name} para completar tu pedido.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => orderingService && handleGoToApp(orderingService)}
          >
            Ir a la App
          </Button>
        </DialogActions>
      </Dialog>

      {/* Integration Benefits */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Beneficios de la Integración
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <ShoppingCart color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Compra Automática"
                secondary="Transfiere tu lista de compras directamente a la app de delivery"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <AttachMoney color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Comparación de Precios"
                secondary="Compara precios entre diferentes servicios antes de ordenar"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Schedule color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Tracking Unificado"
                secondary="Rastrea todos tus pedidos desde una sola aplicación"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DeliveryIntegration;
