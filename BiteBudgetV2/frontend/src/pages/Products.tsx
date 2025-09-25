import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Fab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Slider,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Nature as Eco,
  TrendingUp,
  Store,
  CompareArrows,
  Add,
  Info,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

interface Product {
  id: number;
  name: string;
  category: string;
  average_price: number;
  sustainability_score: number;
}

interface PriceComparison {
  store_name: string;
  price: number;
  availability: boolean;
  store_type: string;
}

interface ProductComparison {
  product_name: string;
  stores: PriceComparison[];
}

const Products: React.FC = () => {
  const { t, formatCurrency } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [comparisonDialog, setComparisonDialog] = useState(false);
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [sustainabilityInfoDialog, setSustainabilityInfoDialog] = useState(false);
  const [priceComparison, setPriceComparison] = useState<ProductComparison[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    average_price: 0,
    sustainability_score: 50,
  });

  const categories = ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Household', 'Personal Care'];

  useEffect(() => {
    // Mock data - replace with actual API call
    setProducts([
      {
        id: 1,
        name: 'Organic Bananas',
        category: 'Fruits',
        average_price: 1.99,
        sustainability_score: 85,
      },
      {
        id: 2,
        name: 'Whole Milk',
        category: 'Dairy',
        average_price: 4.50,
        sustainability_score: 65,
      },
      {
        id: 3,
        name: 'Free-Range Eggs',
        category: 'Dairy',
        average_price: 6.50,
        sustainability_score: 78,
      },
      {
        id: 4,
        name: 'Chicken Breast',
        category: 'Meat',
        average_price: 12.99,
        sustainability_score: 45,
      },
      {
        id: 5,
        name: 'Organic Spinach',
        category: 'Vegetables',
        average_price: 3.49,
        sustainability_score: 92,
      },
    ]);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category) {
      const product: Product = {
        id: products.length + 1,
        name: newProduct.name,
        category: newProduct.category,
        average_price: newProduct.average_price,
        sustainability_score: newProduct.sustainability_score,
      };
      
      setProducts([...products, product]);
      setNewProduct({
        name: '',
        category: '',
        average_price: 0,
        sustainability_score: 50,
      });
      setAddProductDialog(false);
    }
  };

  const handleComparePrice = (productName: string) => {
    // Mock price comparison data
    const mockComparison: ProductComparison[] = [
      {
        product_name: productName,
        stores: [
          {
            store_name: 'Walmart Supercenter',
            price: 22.50,
            availability: true,
            store_type: 'Supermarket',
          },
          {
            store_name: 'Chedraui Selecto',
            price: 24.00,
            availability: true,
            store_type: 'Supermarket',
          },
          {
            store_name: 'Soriana Hiper',
            price: 21.75,
            availability: false,
            store_type: 'Hypermarket',
          },
          {
            store_name: 'Tienda Local',
            price: 26.00,
            availability: true,
            store_type: 'Local Store',
          },
        ],
      },
    ];
    
    setPriceComparison(mockComparison);
    setComparisonDialog(true);
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getSustainabilityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getStoreTypeColor = (storeType: string) => {
    const colors: { [key: string]: string } = {
      'Supermarket': '#2196F3',
      'Hypermarket': '#9C27B0',
      'Local Store': '#4CAF50',
      'Online': '#FF5722',
    };
    return colors[storeType] || '#757575';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Products Database
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse products, compare prices, and check sustainability scores
          </Typography>
        </Box>
        <Tooltip title="Learn about Sustainability Scoring">
          <IconButton onClick={() => setSustainabilityInfoDialog(true)}>
            <Info />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Sustainability Score Info Dialog */}
      <Dialog open={sustainabilityInfoDialog} onClose={() => setSustainabilityInfoDialog(false)} maxWidth="md">
        <DialogTitle>How Sustainability Score is Calculated</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Our sustainability score is calculated based on multiple environmental and social factors
          </Alert>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Scoring Factors (0-100 scale):
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">• Carbon Footprint (25%)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mb: 1 }}>
              Transportation distance, production methods, packaging materials
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold">• Water Usage (20%)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mb: 1 }}>
              Water consumption during production and processing
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold">• Organic/Natural (20%)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mb: 1 }}>
              Use of pesticides, chemicals, and artificial additives
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold">• Local Sourcing (15%)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mb: 1 }}>
              Distance from production source to consumer
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold">• Fair Trade/Labor (10%)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mb: 1 }}>
              Fair labor practices and worker compensation
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold">• Packaging (10%)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2, mb: 1 }}>
              Recyclability and biodegradability of packaging materials
            </Typography>
          </Box>
          
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Score Ranges:</Typography>
            <Typography variant="body2"><strong>80-100:</strong> Excellent (Highly sustainable)</Typography>
            <Typography variant="body2"><strong>60-79:</strong> Good (Generally sustainable)</Typography>
            <Typography variant="body2"><strong>40-59:</strong> Fair (Some sustainability concerns)</Typography>
            <Typography variant="body2"><strong>0-39:</strong> Poor (Significant sustainability issues)</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSustainabilityInfoDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Search and Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                label="All Categories"
                onClick={() => setSelectedCategory('')}
                color={selectedCategory === '' ? 'primary' : 'default'}
                variant={selectedCategory === '' ? 'filled' : 'outlined'}
              />
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Products ({filteredProducts.length})
          </Typography>
          
          {filteredProducts.length === 0 ? (
            <Box textAlign="center" py={4}>
              <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search terms or filters
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredProducts.map((product, index) => (
                <React.Fragment key={product.id}>
                  <ListItem
                    sx={{
                      px: 0,
                      py: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box display="flex" alignItems="center" flex={1}>
                      <Avatar
                        sx={{
                          mr: 2,
                          bgcolor: 'primary.light',
                          width: 48,
                          height: 48,
                        }}
                      >
                        <ShoppingCart />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="medium">
                          {product.name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                          <Chip
                            label={product.category}
                            size="small"
                            variant="outlined"
                          />
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Eco
                              sx={{
                                fontSize: 16,
                                color: getSustainabilityColor(product.sustainability_score),
                              }}
                            />
                            <Typography
                              variant="caption"
                              color={getSustainabilityColor(product.sustainability_score)}
                              fontWeight="bold"
                            >
                              {getSustainabilityLabel(product.sustainability_score)} ({product.sustainability_score}/100)
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box textAlign="right">
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ${product.average_price.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Avg. Price
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CompareArrows />}
                        onClick={() => handleComparePrice(product.name)}
                      >
                        Compare
                      </Button>
                    </Box>
                  </ListItem>
                  {index < filteredProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Price Comparison Dialog */}
      <Dialog
        open={comparisonDialog}
        onClose={() => setComparisonDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Price Comparison</DialogTitle>
        <DialogContent>
          {priceComparison.map((comparison) => (
            <Box key={comparison.product_name}>
              <Typography variant="h6" gutterBottom>
                {comparison.product_name}
              </Typography>
              <List>
                {comparison.stores.map((store, index) => (
                  <React.Fragment key={store.store_name}>
                    <ListItem>
                      <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              bgcolor: getStoreTypeColor(store.store_type),
                              width: 40,
                              height: 40,
                            }}
                          >
                            <Store />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {store.store_name}
                            </Typography>
                            <Chip
                              label={store.store_type}
                              size="small"
                              sx={{
                                bgcolor: getStoreTypeColor(store.store_type),
                                color: 'white',
                              }}
                            />
                          </Box>
                        </Box>
                        
                        <Box textAlign="right">
                          {store.availability ? (
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              ${store.price.toFixed(2)}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Out of Stock
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </ListItem>
                    {index < comparison.stores.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComparisonDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={addProductDialog} onClose={() => setAddProductDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Average Price"
              type="number"
              value={newProduct.average_price}
              onChange={(e) => setNewProduct({ ...newProduct, average_price: parseFloat(e.target.value) || 0 })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ mb: 3 }}
            />
            
            <Typography gutterBottom>Sustainability Score</Typography>
            <Slider
              value={newProduct.sustainability_score}
              onChange={(_, value) => setNewProduct({ ...newProduct, sustainability_score: value as number })}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}/100`}
              sx={{ color: getSustainabilityColor(newProduct.sustainability_score) }}
            />
            <Typography variant="caption" color="text.secondary">
              Current: {getSustainabilityLabel(newProduct.sustainability_score)} ({newProduct.sustainability_score}/100)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddProductDialog(false)}>Cancel</Button>
          <Button onClick={handleAddProduct} variant="contained">Add Product</Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add product"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => setAddProductDialog(true)}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default Products;
