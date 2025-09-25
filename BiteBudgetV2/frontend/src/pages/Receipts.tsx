import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Receipt as ReceiptIcon,
  Camera,
  Delete,
  Edit,
  Store,
  CalendarToday,
  PhotoCamera,
  Upload,
  Close,
  FilterList,
  QrCodeScanner,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import BarcodeScanner from '../components/BarcodeScanner';

interface ReceiptItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  category: string;
}

interface Receipt {
  id: number;
  store_name: string;
  total_amount: number;
  purchase_date: string;
  created_at: string;
  items: ReceiptItem[];
}

const Receipts: React.FC = () => {
  const { t, formatCurrency } = useLanguage();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [scanDialog, setScanDialog] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [barcodeScanning, setBarcodeScanning] = useState(false);
  const [barcodeScannerOpen, setBarcodeScannerOpen] = useState(false);
  const [scannedProducts, setScannedProducts] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    setReceipts([
      {
        id: 1,
        store_name: 'SuperMart',
        total_amount: 45.67,
        purchase_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        items: [
          {
            id: 1,
            product_name: 'Organic Bananas',
            quantity: 2,
            unit_price: 1.99,
            total_price: 3.98,
            category: 'Fruits',
          },
          {
            id: 2,
            product_name: 'Whole Milk',
            quantity: 1,
            unit_price: 4.50,
            total_price: 4.50,
            category: 'Dairy',
          },
        ],
      },
      {
        id: 2,
        store_name: 'Fresh Market',
        total_amount: 28.90,
        purchase_date: new Date(Date.now() - 86400000).toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(),
        items: [
          {
            id: 3,
            product_name: 'Chicken Breast',
            quantity: 1,
            unit_price: 12.99,
            total_price: 12.99,
            category: 'Meat',
          },
        ],
      },
    ]);
  }, []);

  const handleScanReceipt = () => {
    setScanDialog(true);
  };

  const handleUploadImage = () => {
    setAnchorEl(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setOpenDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Fruits': '#4CAF50',
      'Vegetables': '#8BC34A',
      'Dairy': '#2196F3',
      'Meat': '#F44336',
      'Bakery': '#FF9800',
      'Beverages': '#9C27B0',
      'Snacks': '#607D8B',
      'Other': '#795548',
    };
    return colors[category] || colors['Other'];
  };

  const getMonthOptions = () => {
    const months = [
      { value: '', label: 'All Months' },
      { value: '2024-01', label: 'January 2024' },
      { value: '2024-02', label: 'February 2024' },
      { value: '2024-03', label: 'March 2024' },
      { value: '2024-04', label: 'April 2024' },
      { value: '2024-05', label: 'May 2024' },
      { value: '2024-06', label: 'June 2024' },
      { value: '2024-07', label: 'July 2024' },
      { value: '2024-08', label: 'August 2024' },
      { value: '2024-09', label: 'September 2024' },
      { value: '2024-10', label: 'October 2024' },
      { value: '2024-11', label: 'November 2024' },
      { value: '2024-12', label: 'December 2024' },
    ];
    return months;
  };

  const filteredReceipts = receipts.filter(receipt => {
    if (!selectedMonth) return true;
    const receiptMonth = new Date(receipt.purchase_date).toISOString().slice(0, 7);
    return receiptMonth === selectedMonth;
  });

  // Camera and Upload Functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use rear camera on mobile
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions or try uploading a file.');
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
        processReceiptImage(imageData);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        processReceiptImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const processReceiptImage = async (imageData: string) => {
    setUploading(true);
    setError('');
    
    try {
      // Simulate API call to process receipt
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock processed receipt data
      const newReceipt: Receipt = {
        id: receipts.length + 1,
        store_name: 'Walmart Supercenter',
        total_amount: 87.43,
        purchase_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        items: [
          {
            id: 1,
            product_name: 'Coca-Cola 2L',
            quantity: 2,
            unit_price: 22.50,
            total_price: 45.00,
            category: 'Beverages',
          },
          {
            id: 2,
            product_name: 'Pan Bimbo Integral',
            quantity: 1,
            unit_price: 28.90,
            total_price: 28.90,
            category: 'Bakery',
          },
          {
            id: 3,
            product_name: 'Huevos San Juan',
            quantity: 1,
            unit_price: 13.53,
            total_price: 13.53,
            category: 'Dairy',
          },
        ],
      };
      
      setReceipts([newReceipt, ...receipts]);
      setSuccess('Receipt processed successfully!');
      setScanDialog(false);
      setCapturedImage(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError('Failed to process receipt. Please try again.');
      console.error('Error processing receipt:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleScanMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleScanMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTakePhoto = () => {
    handleScanMenuClose();
    setScanDialog(true);
    setTimeout(startCamera, 100); // Small delay to ensure dialog is open
  };

  const handleUploadFile = () => {
    handleScanMenuClose();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleStartBarcodeScanning = () => {
    handleScanMenuClose();
    setBarcodeScannerOpen(true);
  };

  const handleBarcodeScanned = (results: any[]) => {
    // Process barcode scan results
    const productNames = results.map(result => result.product_name || result.code);
    setScannedProducts(productNames);
    setSuccess(`${results.length} products scanned successfully!`);
    
    // Create a new receipt from scanned products
    const newReceipt: Receipt = {
      id: receipts.length + 1,
      store_name: 'Scanned Products',
      total_amount: results.reduce((sum, r) => sum + (r.price || 0), 0),
      purchase_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      items: results.map((result, index) => ({
        id: index + 1,
        product_name: result.product_name || 'Unknown Product',
        quantity: 1,
        unit_price: result.price || 0,
        total_price: result.price || 0,
        category: 'Scanned',
      })),
    };
    
    setReceipts([newReceipt, ...receipts]);
  };

  const handleCloseScanDialog = () => {
    setScanDialog(false);
    stopCamera();
    setCapturedImage(null);
    setError('');
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload
      console.log('Selected file:', file);
    }
  };

  const handleTakePhotoLegacy = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL('image/png');
        setCapturedImage(imageData);
        setScanDialog(false);
        // Here you can also upload the image data to the server
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('receipts')}
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Filter by Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterList sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              }
            >
              {getMonthOptions().map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {t('receipts')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track your grocery receipts
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Camera />}
          onClick={handleScanMenuClick}
          size="large"
        >
          {t('scan_receipt')}
        </Button>
      </Box>

      {/* Month Filter */}
      <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
        <InputLabel id="month-select-label">Filter by Month</InputLabel>
        <Select
          labelId="month-select-label"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          label="Filter by Month"
          endAdornment={
            <InputAdornment position="end">
              <IconButton edge="end" onClick={() => setSelectedMonth('')}>
                <Close />
              </IconButton>
            </InputAdornment>
          }
        >
          {getMonthOptions().map((month) => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Scan Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleScanMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleTakePhoto}>
          <PhotoCamera sx={{ mr: 1 }} />
          Take Photo
        </MenuItem>
        <MenuItem onClick={handleUploadFile}>
          <Upload sx={{ mr: 1 }} />
          Upload Image
        </MenuItem>
      </Menu>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {filteredReceipts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <ReceiptIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No receipts yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Start by scanning your first receipt
            </Typography>
            <Button variant="contained" startIcon={<Camera />} onClick={handleScanReceipt}>
              Scan Your First Receipt
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
            gap: 3 
          }}
        >
          {filteredReceipts.map((receipt) => (
            <Box key={receipt.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => handleViewReceipt(receipt)}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <Store />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {receipt.store_name}
                        </Typography>
                        <Box display="flex" alignItems="center" color="text.secondary">
                          <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="caption">
                            {formatDate(receipt.purchase_date)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${receipt.total_amount.toFixed(2)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {receipt.items.length} items
                  </Typography>

                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {receipt.items.slice(0, 3).map((item) => (
                      <Chip
                        key={item.id}
                        label={item.category}
                        size="small"
                        sx={{
                          bgcolor: getCategoryColor(item.category),
                          color: 'white',
                        }}
                      />
                    ))}
                    {receipt.items.length > 3 && (
                      <Chip
                        label={`+${receipt.items.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Receipt Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Receipt Details</Typography>
            <Box>
              <IconButton>
                <Edit />
              </IconButton>
              <IconButton color="error">
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedReceipt && (
            <Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Store
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedReceipt.store_name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatDate(selectedReceipt.purchase_date)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${selectedReceipt.total_amount.toFixed(2)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Items
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedReceipt.items.length} items
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                Items
              </Typography>
              <List>
                {selectedReceipt.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem disablePadding>
                      <Box display="flex" justifyContent="space-between" width="100%" py={1}>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {item.product_name}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={item.category}
                              size="small"
                              sx={{
                                bgcolor: getCategoryColor(item.category),
                                color: 'white',
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body1" fontWeight="bold">
                          ${item.total_price.toFixed(2)}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < selectedReceipt.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Scan Receipt Dialog */}
      <Dialog open={scanDialog} onClose={() => setScanDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Scan Receipt</DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={4}>
            <Camera sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Receipt Scanner
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Take a photo of your receipt or upload an image
            </Typography>
            <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={handleTakePhoto}>
              Take Photo
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(e.currentTarget);
              }}
            >
              Upload Image
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScanDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2,
            mt: 1.5,
            minWidth: 200,
            boxShadow: (theme) => `0px 4px 8px rgba(0, 0, 0, 0.1)`,
          },
        }}
      >
        <MenuItem
          onClick={handleTakePhoto}
          sx={{ py: 1.5, '&:hover': { backgroundColor: 'action.hover' } }}
        >
          <PhotoCamera sx={{ mr: 1 }} />
          Take Photo
        </MenuItem>
        <MenuItem
          onClick={handleUploadImage}
          sx={{ py: 1.5, '&:hover': { backgroundColor: 'action.hover' } }}
        >
          <Upload sx={{ mr: 1 }} />
          Upload Image
        </MenuItem>
        <MenuItem
          onClick={handleStartBarcodeScanning}
          sx={{ py: 1.5, '&:hover': { backgroundColor: 'action.hover' } }}
        >
          <QrCodeScanner sx={{ mr: 1 }} />
          Scan Barcodes
        </MenuItem>
      </Menu>

      {uploading && (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            width: 300,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            p: 2,
            zIndex: 1300,
          }}
        >
          <Alert
            severity="info"
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setUploading(false)}
              >
                <Close fontSize="small" />
              </IconButton>
            }
          >
            Uploading receipt image...
          </Alert>
        </Box>
      )}

      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseError}
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="scan receipt"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={handleScanReceipt}
      >
        <Add />
      </Fab>

      {/* Barcode Scanner */}
      <BarcodeScanner
        open={barcodeScannerOpen}
        onClose={() => setBarcodeScannerOpen(false)}
        onScanComplete={handleBarcodeScanned}
      />
    </Container>
  );
};

export default Receipts;
