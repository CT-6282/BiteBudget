import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  AccountBalance as BudgetIcon,
  Analytics as AnalyticsIcon,
  ShoppingCart as ProductsIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  ShoppingBasket as ShoppingListIcon,
  Language as LanguageIcon,
  Map as MapIcon,
  Api as ApiIcon,
  TrendingUp as PricingIcon,
  Psychology as MLIcon,
  People as SocialIcon,
  LocalShipping as DeliveryIcon,
  CompareArrows,
  Help,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { features } = useSettings();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const allMenuItems = [
    { text: t('dashboard'), icon: <DashboardIcon />, path: '/', enabled: true },
    { text: t('receipts'), icon: <ReceiptIcon />, path: '/receipts', enabled: true },
    { text: t('budget'), icon: <BudgetIcon />, path: '/budget', enabled: true },
    { text: t('analytics'), icon: <AnalyticsIcon />, path: '/analytics', enabled: true },
    { text: t('products'), icon: <ProductsIcon />, path: '/products', enabled: true },
    { text: t('shoppingList'), icon: <ShoppingListIcon />, path: '/shopping-list', enabled: true },
    { text: t('map'), icon: <MapIcon />, path: '/map', enabled: true },
    { text: t('User Guide'), icon: <Help />, path: '/user-guide', enabled: true },
    { text: 'Real-Time Pricing', icon: <PricingIcon />, path: '/realtime-pricing', enabled: features.showRealTimePricing },
    { text: 'ML Predictions', icon: <MLIcon />, path: '/ml-predictions-simple', enabled: features.showMLPredictions },
    { text: 'Social Features', icon: <SocialIcon />, path: '/social-features', enabled: features.showCommunityFeatures },
    { text: 'Delivery Services', icon: <DeliveryIcon />, path: '/delivery-integration', enabled: features.showDeliveryIntegration },
    { text: 'Shopping Mapping', icon: <CompareArrows />, path: '/shopping-mapping', enabled: true },
    { text: 'Feature Settings', icon: <SettingsIcon />, path: '/feature-settings', enabled: true },
  ];

  const menuItems = allMenuItems.filter(item => item.enabled);

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          BiteBudget
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Smart Grocery Budget Tracker
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="subtitle2">{user?.username}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { setLanguage(language === 'en' ? 'es-MX' : 'en'); handleProfileMenuClose(); }}>
              <ListItemIcon>
                <LanguageIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{language === 'en' ? 'Español (México)' : 'English'}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { navigate('/settings/marketplace'); handleProfileMenuClose(); }}>
              <ListItemIcon>
                <ApiIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Marketplace APIs</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('logout')}</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
