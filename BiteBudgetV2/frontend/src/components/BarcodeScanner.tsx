import React, { useRef, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  QrCodeScanner,
  CheckCircle,
} from '@mui/icons-material';

// Import Quagga for barcode scanning
// Note: In production, you'd import this properly
// import Quagga from 'quagga';

interface BarcodeResult {
  code: string;
  format: string;
  product_name?: string;
  price?: number;
  confidence: number;
}

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScanComplete: (results: BarcodeResult[]) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  open,
  onClose,
  onScanComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedCodes, setScannedCodes] = useState<BarcodeResult[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (open && videoRef.current) {
      startScanning();
    }
    return () => {
      stopScanning();
    };
  }, [open]);

  const startScanning = async () => {
    try {
      setScanning(true);
      setError('');

      // Get camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Initialize QuaggaJS (mock implementation for now)
      // In a real implementation, you would use:
      /*
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
          }
        },
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader"
          ]
        }
      }, (err) => {
        if (err) {
          console.error(err);
          setError('Failed to initialize barcode scanner');
          return;
        }
        Quagga.start();
      });

      Quagga.onDetected((data) => {
        const result: BarcodeResult = {
          code: data.codeResult.code,
          format: data.codeResult.format,
          confidence: data.codeResult.confidence || 0
        };
        
        // Look up product information (this would be an API call)
        lookupProduct(result.code).then(productInfo => {
          const enhancedResult = { ...result, ...productInfo };
          setScannedCodes(prev => [...prev, enhancedResult]);
        });
      });
      */

      // Mock scanning for demonstration
      setTimeout(() => {
        const mockResults: BarcodeResult[] = [
          {
            code: '7501055363989',
            format: 'EAN_13',
            product_name: 'Coca-Cola 2L',
            price: 22.50,
            confidence: 98.5
          },
          {
            code: '7501000673209',
            format: 'EAN_13',
            product_name: 'Pan Bimbo Integral',
            price: 28.90,
            confidence: 95.2
          },
          {
            code: '7501031312504',
            format: 'EAN_13',
            product_name: 'Leche Lala 1L',
            price: 23.50,
            confidence: 97.8
          }
        ];
        
        setScannedCodes(mockResults);
        setScanning(false);
      }, 3000);

    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    // Stop Quagga
    // Quagga.stop();
    
    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setScanning(false);
  };

  const lookupProduct = async (barcode: string) => {
    // Mock product lookup - in production this would be an API call
    const mockProducts: Record<string, { product_name: string; price: number }> = {
      '7501055363989': { product_name: 'Coca-Cola 2L', price: 22.50 },
      '7501000673209': { product_name: 'Pan Bimbo Integral', price: 28.90 },
      '7501031312504': { product_name: 'Leche Lala 1L', price: 23.50 },
    };
    
    return mockProducts[barcode] || { product_name: 'Unknown Product', price: 0 };
  };

  const handleComplete = () => {
    onScanComplete(scannedCodes);
    handleClose();
  };

  const handleClose = () => {
    stopScanning();
    setScannedCodes([]);
    setError('');
    onClose();
  };

  const formatConfidence = (confidence: number) => {
    return `${confidence.toFixed(1)}%`;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <QrCodeScanner sx={{ mr: 1 }} />
          Barcode Scanner
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* Camera View */}
        <Box
          ref={scannerRef}
          sx={{
            position: 'relative',
            width: '100%',
            height: 300,
            backgroundColor: '#000',
            borderRadius: 1,
            overflow: 'hidden',
            mb: 2
          }}
        >
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            playsInline
            muted
          />
          
          {/* Scanning Overlay */}
          {scanning && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)'
              }}
            >
              <Box textAlign="center" color="white">
                <CircularProgress color="inherit" sx={{ mb: 1 }} />
                <Typography variant="body2">
                  Scanning for barcodes...
                </Typography>
              </Box>
            </Box>
          )}
          
          {/* Scanning Frame */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 200,
              height: 100,
              border: '2px solid #fff',
              borderRadius: 1,
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                width: 20,
                height: 20,
                border: '3px solid #4CAF50',
              },
              '&::before': {
                top: -3,
                left: -3,
                borderRight: 'none',
                borderBottom: 'none',
              },
              '&::after': {
                bottom: -3,
                right: -3,
                borderLeft: 'none',
                borderTop: 'none',
              }
            }}
          />
        </Box>

        {/* Scanning Instructions */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Position the barcode within the frame. The scanner supports EAN, UPC, Code 128, and Code 39 formats.
          </Typography>
        </Alert>

        {/* Scanned Results */}
        {scannedCodes.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Scanned Products ({scannedCodes.length})
            </Typography>
            <List>
              {scannedCodes.map((result, index) => (
                <ListItem key={index} divider>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {result.product_name || 'Unknown Product'}
                        </Typography>
                        <Chip
                          label={formatConfidence(result.confidence)}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Barcode: {result.code} ({result.format})
                        </Typography>
                        {result.price && (
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            Price: ${result.price.toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleComplete} 
          variant="contained"
          disabled={scannedCodes.length === 0}
        >
          Use Scanned Products ({scannedCodes.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BarcodeScanner;
