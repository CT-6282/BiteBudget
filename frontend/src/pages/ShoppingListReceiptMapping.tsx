import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Avatar,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CompareArrows,
  CheckCircle,
  Cancel,
  ShoppingCart,
  Receipt,
  TrendingUp,
  TrendingDown,
  Analytics,
  Sync,
  AutoAwesome,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

interface ShoppingListItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  estimated_price: number;
  completed: boolean;
  notes?: string;
}

interface ReceiptItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  category: string;
}

interface ComparisonResult {
  shopping_item: ShoppingListItem;
  receipt_item?: ReceiptItem;
  status: 'matched' | 'not_purchased' | 'overspent' | 'saved';
  price_difference: number;
  confidence_score: number;
}

const ShoppingListReceiptMapping: React.FC = () => {
  const { formatCurrency } = useLanguage();
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [comparisons, setComparisons] = useState<ComparisonResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalOverspend, setTotalOverspend] = useState(0);

  useEffect(() => {
    // Mock data for demonstration
    setShoppingList([
      { id: 1, name: 'Milk', quantity: 2, unit: 'L', category: 'Dairy', estimated_price: 50.00, completed: true },
      { id: 2, name: 'Bread', quantity: 1, unit: 'pcs', category: 'Bakery', estimated_price: 30.00, completed: true },
      { id: 3, name: 'Bananas', quantity: 1, unit: 'kg', category: 'Fruits', estimated_price: 25.00, completed: false },
      { id: 4, name: 'Chicken Breast', quantity: 1, unit: 'kg', category: 'Meat', estimated_price: 120.00, completed: true },
      { id: 5, name: 'Rice', quantity: 1, unit: 'kg', category: 'Grains', estimated_price: 35.00, completed: true },
    ]);

    setReceipts([
      { id: 1, product_name: 'Leche Lala 1L', quantity: 2, unit_price: 23.50, total_price: 47.00, category: 'Dairy' },
      { id: 2, product_name: 'Pan Bimbo Integral', quantity: 1, unit_price: 28.90, total_price: 28.90, category: 'Bakery' },
      { id: 3, product_name: 'Pechuga de Pollo', quantity: 1, unit_price: 135.00, total_price: 135.00, category: 'Meat' },
      { id: 4, product_name: 'Arroz Verde Valle', quantity: 1, unit_price: 32.90, total_price: 32.90, category: 'Grains' },
      { id: 5, product_name: 'Tomates', quantity: 1, unit_price: 18.50, total_price: 18.50, category: 'Vegetables' },
    ]);
  }, []);

  const performMapping = async () => {
    setLoading(true);
    
    // Simulate AI-powered mapping algorithm
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results: ComparisonResult[] = [];
    let savings = 0;
    let overspend = 0;

    // Smart matching algorithm (simplified for demo)
    shoppingList.forEach(shoppingItem => {
      // Find matching receipt item using ML-like similarity scoring
      const matchingReceiptItem = receipts.find(receiptItem => {
        const nameSimilarity = calculateSimilarity(shoppingItem.name, receiptItem.product_name);
        const categorySimilarity = shoppingItem.category === receiptItem.category ? 1 : 0;
        return nameSimilarity > 0.6 || categorySimilarity === 1;
      });

      if (matchingReceiptItem) {
        const priceDifference = shoppingItem.estimated_price - matchingReceiptItem.total_price;
        let status: 'matched' | 'overspent' | 'saved' = 'matched';
        
        if (priceDifference > 2) {
          status = 'saved';
          savings += priceDifference;
        } else if (priceDifference < -2) {
          status = 'overspent';
          overspend += Math.abs(priceDifference);
        }

        results.push({
          shopping_item: shoppingItem,
          receipt_item: matchingReceiptItem,
          status,
          price_difference: priceDifference,
          confidence_score: calculateSimilarity(shoppingItem.name, matchingReceiptItem.product_name) * 100,
        });
      } else {
        results.push({
          shopping_item: shoppingItem,
          status: 'not_purchased',
          price_difference: 0,
          confidence_score: 0,
        });
      }
    });

    setComparisons(results);
    setTotalSavings(savings);
    setTotalOverspend(overspend);
    setLoading(false);
    setShowAnalysis(true);
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    // Simple similarity algorithm for demo
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    if (s1.includes(s2) || s2.includes(s1)) return 0.9;
    
    const words1 = s1.split(' ');
    const words2 = s2.split(' ');
    let matches = 0;
    
    words1.forEach(word1 => {
      words2.forEach(word2 => {
        if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
          matches++;
        }
      });
    });
    
    return matches / Math.max(words1.length, words2.length);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'saved': return 'success';
      case 'overspent': return 'error';
      case 'not_purchased': return 'warning';
      default: return 'info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'saved': return <TrendingDown color="success" />;
      case 'overspent': return <TrendingUp color="error" />;
      case 'not_purchased': return <Cancel color="warning" />;
      default: return <CheckCircle color="info" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={4}>
        <CompareArrows color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Shopping List vs Receipt Analysis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered mapping between planned and actual purchases
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 4 
      }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <ShoppingCart />
              </Avatar>
              <Box>
                <Typography variant="h6">{shoppingList.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Planned Items
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                <Receipt />
              </Avatar>
              <Box>
                <Typography variant="h6">{receipts.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Purchased Items
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <TrendingDown />
              </Avatar>
              <Box>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(totalSavings)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Savings
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                <TrendingUp />
              </Avatar>
              <Box>
                <Typography variant="h6" color="error.main">
                  {formatCurrency(totalOverspend)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overspend
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Action Button */}
      <Box mb={4} textAlign="center">
        <Button
          variant="contained"
          size="large"
          startIcon={<AutoAwesome />}
          onClick={performMapping}
          disabled={loading}
          sx={{ minWidth: 250 }}
        >
          {loading ? 'Analyzing with AI...' : 'Perform Smart Mapping'}
        </Button>
        {loading && (
          <Box mt={2}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" mt={1}>
              Using machine learning to match items and analyze spending patterns...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Results Table */}
      {showAnalysis && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Detailed Comparison Results
            </Typography>
            
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Planned Item</TableCell>
                    <TableCell>Actual Purchase</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="right">Price Difference</TableCell>
                    <TableCell align="center">AI Confidence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comparisons.map((comparison, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {comparison.shopping_item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {comparison.shopping_item.quantity} {comparison.shopping_item.unit} - {formatCurrency(comparison.shopping_item.estimated_price)}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        {comparison.receipt_item ? (
                          <Box>
                            <Typography variant="subtitle2">
                              {comparison.receipt_item.product_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {comparison.receipt_item.quantity} × {formatCurrency(comparison.receipt_item.unit_price)} = {formatCurrency(comparison.receipt_item.total_price)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not purchased
                          </Typography>
                        )}
                      </TableCell>
                      
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          {getStatusIcon(comparison.status)}
                          <Chip
                            label={comparison.status.replace('_', ' ').toUpperCase()}
                            color={getStatusColor(comparison.status) as any}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </TableCell>
                      
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={
                            comparison.price_difference > 0 ? 'success.main' :
                            comparison.price_difference < 0 ? 'error.main' : 'text.primary'
                          }
                        >
                          {comparison.price_difference !== 0 ? (
                            `${comparison.price_difference > 0 ? '+' : ''}${formatCurrency(comparison.price_difference)}`
                          ) : '-'}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        {comparison.confidence_score > 0 && (
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {Math.round(comparison.confidence_score)}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={comparison.confidence_score}
                              sx={{ width: 60, height: 4 }}
                            />
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* AI Insights */}
            <Box mt={4}>
              <Alert severity="info" icon={<Analytics />}>
                <Typography variant="subtitle2" fontWeight="bold">
                  AI Analysis Summary
                </Typography>
                <Typography variant="body2">
                  • {comparisons.filter(c => c.status === 'matched' || c.status === 'saved' || c.status === 'overspent').length} items successfully matched using similarity algorithms<br/>
                  • {comparisons.filter(c => c.status === 'saved').length} items where you saved money vs. planned budget<br/>
                  • {comparisons.filter(c => c.status === 'overspent').length} items where you spent more than planned<br/>
                  • {comparisons.filter(c => c.status === 'not_purchased').length} planned items not purchased<br/>
                  • Average matching confidence: {Math.round(comparisons.reduce((sum, c) => sum + c.confidence_score, 0) / comparisons.length)}%
                </Typography>
              </Alert>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ShoppingListReceiptMapping;
