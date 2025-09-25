import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Divider,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  ShoppingCart,
  Check,
  Clear,
  Category,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  estimated_price?: number;
  completed: boolean;
  notes?: string;
}

const categories = [
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Meat & Seafood',
  'Pantry & Canned',
  'Frozen Foods',
  'Bakery',
  'Beverages',
  'Snacks',
  'Health & Beauty',
  'Household',
  'Other'
];

const units = ['kg', 'g', 'L', 'mL', 'pcs', 'pack', 'box', 'bottle', 'bag'];

const ShoppingList: React.FC = () => {
  const { t, formatCurrency } = useLanguage();
  
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: 1, name: 'Apples', quantity: 2, unit: 'kg', category: 'Fruits & Vegetables', estimated_price: 45, completed: false },
    { id: 2, name: 'Milk', quantity: 1, unit: 'L', category: 'Dairy & Eggs', estimated_price: 25, completed: false },
    { id: 3, name: 'Bread', quantity: 1, unit: 'pcs', category: 'Bakery', estimated_price: 30, completed: true },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<ShoppingItem>>({
    name: '',
    quantity: 1,
    unit: 'pcs',
    category: 'Other',
    estimated_price: 0,
    notes: '',
  });

  const [filterCategory, setFilterCategory] = useState<string>('All');

  const handleAddItem = () => {
    setEditingItem(null);
    setNewItem({
      name: '',
      quantity: 1,
      unit: 'pcs',
      category: 'Other',
      estimated_price: 0,
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleEditItem = (item: ShoppingItem) => {
    setEditingItem(item);
    setNewItem(item);
    setOpenDialog(true);
  };

  const handleSaveItem = () => {
    if (!newItem.name) return;

    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...newItem as ShoppingItem }
          : item
      ));
    } else {
      const id = Math.max(...items.map(i => i.id), 0) + 1;
      setItems([...items, { 
        ...newItem as ShoppingItem, 
        id, 
        completed: false 
      }]);
    }
    setOpenDialog(false);
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleToggleCompleted = (id: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, completed: !item.completed }
        : item
    ));
  };

  const handleClearCompleted = () => {
    setItems(items.filter(item => !item.completed));
  };

  const filteredItems = filterCategory === 'All' 
    ? items 
    : items.filter(item => item.category === filterCategory);

  const completedItems = filteredItems.filter(item => item.completed);
  const pendingItems = filteredItems.filter(item => !item.completed);

  const totalEstimatedCost = items
    .filter(item => !item.completed)
    .reduce((sum, item) => sum + (item.estimated_price || 0), 0);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {t('shopping_list')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddItem}
        >
          Add Item
        </Button>
      </Box>

      {/* Summary Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Shopping Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pendingItems.length} items remaining • {completedItems.length} completed
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Est. Total: {formatCurrency(totalEstimatedCost)}
              </Typography>
              {completedItems.length > 0 && (
                <Button
                  size="small"
                  startIcon={<Clear />}
                  onClick={handleClearCompleted}
                  color="secondary"
                >
                  Clear Completed
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={filterCategory}
            label="Filter by Category"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="All">All Categories</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Shopping Items */}
      <Card>
        <CardContent>
          {/* Pending Items */}
          {pendingItems.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
                To Buy ({pendingItems.length})
              </Typography>
              <List>
                {pendingItems.map((item) => (
                  <ListItem key={item.id} divider>
                    <Checkbox
                      checked={item.completed}
                      onChange={() => handleToggleCompleted(item.id)}
                    />
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {item.name}
                          </Typography>
                          <Chip
                            label={item.category}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {item.quantity} {item.unit}
                            {item.estimated_price && ` • ${formatCurrency(item.estimated_price)}`}
                          </Typography>
                          {item.notes && (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                              {item.notes}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleEditItem(item)} size="small">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteItem(item.id)} size="small" color="error">
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {/* Completed Items */}
          {completedItems.length > 0 && (
            <>
              {pendingItems.length > 0 && <Divider sx={{ my: 2 }} />}
              <Typography variant="h6" gutterBottom fontWeight="bold" color="success.main">
                <Check sx={{ mr: 1, verticalAlign: 'middle' }} />
                Completed ({completedItems.length})
              </Typography>
              <List>
                {completedItems.map((item) => (
                  <ListItem key={item.id} divider>
                    <Checkbox
                      checked={item.completed}
                      onChange={() => handleToggleCompleted(item.id)}
                    />
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body1" 
                            fontWeight="medium"
                            sx={{ textDecoration: 'line-through', opacity: 0.7 }}
                          >
                            {item.name}
                          </Typography>
                          <Chip
                            label={item.category}
                            size="small"
                            variant="outlined"
                            sx={{ opacity: 0.7 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ opacity: 0.7 }}
                        >
                          {item.quantity} {item.unit}
                          {item.estimated_price && ` • ${formatCurrency(item.estimated_price)}`}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleDeleteItem(item.id)} size="small" color="error">
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {filteredItems.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Category sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No items in this category
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add items to start building your shopping list
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Floating Add Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddItem}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Add />
      </Fab>

      {/* Add/Edit Item Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Item Name"
              value={newItem.name || ''}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              fullWidth
              required
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Quantity"
                type="number"
                value={newItem.quantity || 1}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                sx={{ flex: 1 }}
                inputProps={{ min: 0.1, step: 0.1 }}
              />
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={newItem.unit || 'pcs'}
                  label="Unit"
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                >
                  {units.map(unit => (
                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newItem.category || 'Other'}
                label="Category"
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Estimated Price"
              type="number"
              value={newItem.estimated_price || ''}
              onChange={(e) => setNewItem({ ...newItem, estimated_price: Number(e.target.value) })}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label="Notes (Optional)"
              value={newItem.notes || ''}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSaveItem} variant="contained" disabled={!newItem.name}>
            {editingItem ? 'Update' : 'Add'} Item
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ShoppingList;
