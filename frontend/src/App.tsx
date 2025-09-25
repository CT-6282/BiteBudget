import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Receipts from './pages/Receipts';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import Products from './pages/Products';
import Profile from './pages/Profile';
import ShoppingList from './pages/ShoppingList';
import MapView from './pages/MapView';
import MarketplaceSettings from './pages/MarketplaceSettings';
import RealTimePricing from './pages/RealTimePricing';
import MLPredictionsSimple from './pages/MLPredictionsSimple';
import SocialFeatures from './pages/SocialFeatures';
import DeliveryIntegration from './pages/DeliveryIntegration';
import ShoppingListReceiptMapping from './pages/ShoppingListReceiptMapping';
import UserGuide from './pages/UserGuide';
import TestDataManager from './pages/TestDataManager';
import FeatureSettings from './pages/FeatureSettings';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <LanguageProvider>
          <SettingsProvider>
            <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/receipts" element={<Receipts />} />
                        <Route path="/budget" element={<Budget />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/shopping-list" element={<ShoppingList />} />
                        <Route path="/map" element={<MapView />} />
                        <Route path="/settings/marketplace" element={<MarketplaceSettings />} />
                        <Route path="/realtime-pricing" element={<RealTimePricing />} />
                        <Route path="/ml-predictions-simple" element={<MLPredictionsSimple />} />
                        <Route path="/social-features" element={<SocialFeatures />} />
                        <Route path="/delivery-integration" element={<DeliveryIntegration />} />
                        <Route path="/shopping-mapping" element={<ShoppingListReceiptMapping />} />
                        <Route path="/user-guide" element={<UserGuide />} />
                        <Route path="/test-data-manager" element={<TestDataManager />} />
                        <Route path="/feature-settings" element={<FeatureSettings />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </SettingsProvider>
      </LanguageProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
