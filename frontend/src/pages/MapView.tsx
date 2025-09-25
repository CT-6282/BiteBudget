import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Alert,
  Switch,
  FormControlLabel,
  Button,
} from '@mui/material';
import {
  LocationOn,
  Store,
  DirectionsCar,
  AccessTime,
  TrendingUp,
  Settings,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

interface StoreLocation {
  id: number;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  visit_count: number;
  total_spent: number;
  last_visit: string;
  store_type: string;
  distance_km: number;
}

const MapView: React.FC = () => {
  const { t, formatCurrency } = useLanguage();
  const [showMap, setShowMap] = useState(false);
  const [locations, setLocations] = useState<StoreLocation[]>([]);

  useEffect(() => {
    // Mock store locations data
    setLocations([
      {
        id: 1,
        name: 'Walmart Supercenter Polanco',
        address: 'Av. Ejército Nacional 843, Polanco, Miguel Hidalgo, CDMX',
        coordinates: { lat: 19.4284, lng: -99.1891 },
        visit_count: 12,
        total_spent: 4567.89,
        last_visit: '2024-07-18',
        store_type: 'Supermarket',
        distance_km: 2.3,
      },
      {
        id: 2,
        name: 'Chedraui Selecto Insurgentes',
        address: 'Av. Insurgentes Sur 1352, Del Valle, Benito Juárez, CDMX',
        coordinates: { lat: 19.3867, lng: -99.1644 },
        visit_count: 8,
        total_spent: 2134.56,
        last_visit: '2024-07-15',
        store_type: 'Supermarket',
        distance_km: 4.7,
      },
      {
        id: 3,
        name: 'Soriana Hiper Santa Fe',
        address: 'Av. Vasco de Quiroga 3800, Santa Fe, Cuajimalpa, CDMX',
        coordinates: { lat: 19.3591, lng: -99.2576 },
        visit_count: 5,
        total_spent: 1876.34,
        last_visit: '2024-07-10',
        store_type: 'Hypermarket',
        distance_km: 8.2,
      },
      {
        id: 4,
        name: 'Tienda Local San Ángel',
        address: 'Plaza San Jacinto 15, San Ángel, Álvaro Obregón, CDMX',
        coordinates: { lat: 19.3467, lng: -99.1897 },
        visit_count: 15,
        total_spent: 892.45,
        last_visit: '2024-07-17',
        store_type: 'Local Store',
        distance_km: 1.8,
      },
    ]);
  }, []);

  const getStoreTypeColor = (storeType: string) => {
    const colors: { [key: string]: string } = {
      'Supermarket': '#2196F3',
      'Hypermarket': '#9C27B0',
      'Local Store': '#4CAF50',
      'Online': '#FF5722',
    };
    return colors[storeType] || '#757575';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Shopping Locations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View your shopping history and store locations on the map
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={showMap}
              onChange={(e) => setShowMap(e.target.checked)}
              color="primary"
            />
          }
          label="Show Map View"
        />
      </Box>

      {showMap ? (
        /* Map View */
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Alert severity="info" icon={<Settings />} sx={{ mb: 2 }}>
              Interactive map integration coming soon! For now, please use the location details below.
              <br />
              <strong>Planned features:</strong> Google Maps integration, real-time navigation, 
              store hours, and special offers at nearby locations.
            </Alert>
            
            <Box 
              sx={{ 
                height: 400,
                bgcolor: 'grey.100',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed',
                borderColor: 'grey.300',
              }}
            >
              <Box textAlign="center">
                <LocationOn sx={{ fontSize: 80, color: 'grey.400' }} />
                <Typography variant="h6" color="text.secondary">
                  Map View Coming Soon
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Interactive map with store locations and navigation
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => setShowMap(false)}
                >
                  View Store List
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ) : (
        /* List View */
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Shopping Locations ({locations.length})
            </Typography>
            
            <List>
              {locations.map((location, index) => (
                <React.Fragment key={location.id}>
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
                          bgcolor: getStoreTypeColor(location.store_type),
                          width: 56,
                          height: 56,
                        }}
                      >
                        <Store />
                      </Avatar>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" fontWeight="bold">
                            {location.name}
                          </Typography>
                          <Box display="flex" gap={1}>
                            <Chip
                              label={location.store_type}
                              size="small"
                              sx={{
                                bgcolor: getStoreTypeColor(location.store_type),
                                color: 'white',
                              }}
                            />
                            <Chip
                              label={`${location.distance_km} km`}
                              size="small"
                              icon={<DirectionsCar />}
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {location.address}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" gap={3}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <TrendingUp sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption">
                                  {location.visit_count} visits
                                </Typography>
                              </Box>
                              
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption">
                                  Last: {formatDate(location.last_visit)}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              {formatCurrency(location.total_spent)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < locations.length - 1 && <Box sx={{ height: 8 }} />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Statistics Card */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Shopping Statistics
          </Typography>
          
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary" fontWeight="bold">
                {locations.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique Stores
              </Typography>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h4" color="primary" fontWeight="bold">
                {locations.reduce((sum, loc) => sum + loc.visit_count, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Visits
              </Typography>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h4" color="primary" fontWeight="bold">
                {formatCurrency(locations.reduce((sum, loc) => sum + loc.total_spent, 0))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Spent
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MapView;
