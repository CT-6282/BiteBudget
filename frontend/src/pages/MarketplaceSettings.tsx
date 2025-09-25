import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from '@mui/material';
import {
  Store,
  Api,
  CheckCircle,
  Error,
  Settings,
  Key,
  Sync,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

interface MarketplaceAPI {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  connected: boolean;
  apiKey?: string;
  lastSync?: string;
  status: 'active' | 'error' | 'disconnected';
  features: string[];
  logo: string;
}

const MarketplaceSettings: React.FC = () => {
  const { t, formatCurrency } = useLanguage();
  const [apis, setApis] = useState<MarketplaceAPI[]>([
    {
      id: 'walmart',
      name: 'Walmart México',
      description: 'Precios en tiempo real y disponibilidad de productos',
      enabled: true,
      connected: true,
      lastSync: '2024-07-20T10:30:00Z',
      status: 'active',
      features: ['Precios', 'Inventario', 'Ofertas', 'Ubicaciones'],
      logo: '🛒',
    },
    {
      id: 'chedraui',
      name: 'Chedraui',
      description: 'Catálogo de productos y precios especiales',
      enabled: true,
      connected: false,
      status: 'disconnected',
      features: ['Precios', 'Ofertas especiales', 'Puntos Chedraui'],
      logo: '🏪',
    },
    {
      id: 'soriana',
      name: 'Soriana',
      description: 'Integración con Soriana y promociones semanales',
      enabled: false,
      connected: false,
      status: 'disconnected',
      features: ['Precios', 'Folleto digital', 'Descuentos'],
      logo: '🛍️',
    },
    {
      id: 'heb',
      name: 'H-E-B México',
      description: 'Precios y productos H-E-B México',
      enabled: false,
      connected: false,
      status: 'disconnected',
      features: ['Precios', 'Productos exclusivos', 'Mi Tienda del Ahorro'],
      logo: '🏬',
    },
    {
      id: 'cityclub',
      name: 'City Club',
      description: 'Precios de mayoreo y membresías',
      enabled: false,
      connected: false,
      status: 'disconnected',
      features: ['Precios mayoreo', 'Membresías', 'Productos a granel'],
      logo: '🏭',
    },
    {
      id: 'costco',
      name: 'Costco México',
      description: 'Productos Costco y ofertas exclusivas',
      enabled: false,
      connected: false,
      status: 'disconnected',
      features: ['Precios Costco', 'Ofertas exclusivas', 'Productos Kirkland'],
      logo: '📦',
    },
  ]);

  const [configDialog, setConfigDialog] = useState(false);
  const [selectedApi, setSelectedApi] = useState<MarketplaceAPI | null>(null);
  const [apiKey, setApiKey] = useState('');

  const handleToggleAPI = (apiId: string) => {
    setApis(apis.map(api => 
      api.id === apiId 
        ? { ...api, enabled: !api.enabled }
        : api
    ));
  };

  const handleConfigureAPI = (api: MarketplaceAPI) => {
    setSelectedApi(api);
    setApiKey(api.apiKey || '');
    setConfigDialog(true);
  };

  const handleSaveConfig = () => {
    if (selectedApi) {
      setApis(apis.map(api => 
        api.id === selectedApi.id 
          ? { 
              ...api, 
              apiKey,
              connected: apiKey.length > 0,
              status: apiKey.length > 0 ? 'active' : 'disconnected'
            }
          : api
      ));
    }
    setConfigDialog(false);
    setSelectedApi(null);
    setApiKey('');
  };

  const handleSyncAll = () => {
    const now = new Date().toISOString();
    setApis(apis.map(api => 
      api.enabled && api.connected 
        ? { ...api, lastSync: now }
        : api
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle color="success" />;
      case 'error': return <Error color="error" />;
      default: return <Api color="disabled" />;
    }
  };

  const formatLastSync = (lastSync?: string) => {
    if (!lastSync) return 'Nunca sincronizado';
    const date = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)} horas`;
    return `Hace ${Math.floor(diffMins / 1440)} días`;
  };

  const connectedApis = apis.filter(api => api.enabled && api.connected).length;
  const totalEnabledApis = apis.filter(api => api.enabled).length;

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Conexiones de Marketplace
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configura las integraciones con supermercados mexicanos para obtener precios en tiempo real
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Sync />}
          onClick={handleSyncAll}
          disabled={connectedApis === 0}
        >
          Sincronizar Todo
        </Button>
      </Box>

      {/* Status Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Estado de Conexiones
          </Typography>
          
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary" fontWeight="bold">
                {connectedApis}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                APIs Conectadas
              </Typography>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {totalEnabledApis}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                APIs Habilitadas
              </Typography>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {apis.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Disponibles
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* API List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Marketplaces Disponibles
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Nota:</strong> Estas integraciones están en desarrollo. Por ahora puedes habilitar/deshabilitar 
            las conexiones simuladas para probar la funcionalidad.
          </Alert>

          <List>
            {apis.map((api, index) => (
              <React.Fragment key={api.id}>
                <ListItem
                  sx={{
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: api.enabled ? 'primary.main' : 'grey.400',
                        width: 56,
                        height: 56,
                        fontSize: '1.5rem',
                      }}
                    >
                      {api.logo}
                    </Avatar>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                          {api.name}
                        </Typography>
                        <Box display="flex" gap={1} alignItems="center">
                          {getStatusIcon(api.status)}
                          <Chip
                            label={api.status === 'active' ? 'Activo' : api.status === 'error' ? 'Error' : 'Desconectado'}
                            size="small"
                            color={getStatusColor(api.status) as any}
                          />
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          {api.description}
                        </Typography>
                        
                        <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                          {api.features.map((feature) => (
                            <Chip
                              key={feature}
                              label={feature}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                        
                        {api.enabled && (
                          <Typography variant="caption" color="text.secondary">
                            Última sincronización: {formatLastSync(api.lastSync)}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box display="flex" gap={1} alignItems="center">
                      {api.enabled && (
                        <Button
                          size="small"
                          startIcon={<Settings />}
                          onClick={() => handleConfigureAPI(api)}
                        >
                          Configurar
                        </Button>
                      )}
                      <FormControlLabel
                        control={
                          <Switch
                            checked={api.enabled}
                            onChange={() => handleToggleAPI(api.id)}
                            color="primary"
                          />
                        }
                        label=""
                      />
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < apis.length - 1 && <Box sx={{ height: 8 }} />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={configDialog} onClose={() => setConfigDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Configurar {selectedApi?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Esta es una configuración simulada. En producción, aquí configurarías las credenciales reales de la API.
            </Alert>
            
            <TextField
              fullWidth
              label="API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Ingresa tu API key"
              InputProps={{
                startAdornment: <Key sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              helperText="Obtén tu API key desde el portal de desarrolladores del marketplace"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveConfig} variant="contained">
            Guardar Configuración
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MarketplaceSettings;
