import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Add,
  AccountBalance,
  Edit,
  Delete,
} from '@mui/icons-material';

interface BudgetItem {
  id: number;
  name: string;
  total_budget: number;
  spent_amount: number;
  remaining_budget: number;
  category: string;
  period: string;
  start_date: string;
  end_date: string;
}

const Budget: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    total_budget: '',
    category: '',
    period: 'monthly',
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    setBudgets([
      {
        id: 1,
        name: 'Monthly Groceries',
        total_budget: 500,
        spent_amount: 342.50,
        remaining_budget: 157.50,
        category: 'Groceries',
        period: 'monthly',
        start_date: '2025-07-01',
        end_date: '2025-07-31',
      },
      {
        id: 2,
        name: 'Dining Out',
        total_budget: 200,
        spent_amount: 180.25,
        remaining_budget: 19.75,
        category: 'Dining',
        period: 'monthly',
        start_date: '2025-07-01',
        end_date: '2025-07-31',
      },
    ]);
  }, []);

  const handleCreateBudget = () => {
    setSelectedBudget(null);
    setFormData({
      name: '',
      total_budget: '',
      category: '',
      period: 'monthly',
    });
    setOpenDialog(true);
  };

  const handleEditBudget = (budget: BudgetItem) => {
    setSelectedBudget(budget);
    setFormData({
      name: budget.name,
      total_budget: budget.total_budget.toString(),
      category: budget.category,
      period: budget.period,
    });
    setOpenDialog(true);
  };

  const handleSaveBudget = () => {
    // Implement save logic here
    setOpenDialog(false);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const getStatusChip = (budget: BudgetItem) => {
    const percentage = (budget.spent_amount / budget.total_budget) * 100;
    
    if (percentage >= 100) {
      return <Chip label="Over Budget" color="error" size="small" />;
    } else if (percentage >= 90) {
      return <Chip label="Critical" color="warning" size="small" />;
    } else if (percentage >= 75) {
      return <Chip label="Warning" color="warning" size="small" variant="outlined" />;
    } else {
      return <Chip label="On Track" color="success" size="small" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Budget Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage your spending budgets
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateBudget}
          size="large"
        >
          Create Budget
        </Button>
      </Box>

      {/* Budget Summary */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Budget Overview
          </Typography>
          <Box display="flex" justifyContent="space-around" textAlign="center">
            <Box>
              <Typography variant="h4" color="primary" fontWeight="bold">
                ${budgets.reduce((sum, budget) => sum + budget.total_budget, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Allocated
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="error" fontWeight="bold">
                ${budgets.reduce((sum, budget) => sum + budget.spent_amount, 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Spent
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                ${budgets.reduce((sum, budget) => sum + budget.remaining_budget, 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remaining
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Budget List */}
      {budgets.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <AccountBalance sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No budgets created yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Create your first budget to start tracking your spending
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleCreateBudget}>
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {budgets.map((budget) => {
            const utilization = (budget.spent_amount / budget.total_budget) * 100;
            
            return (
              <Card key={budget.id}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {budget.name}
                        </Typography>
                        {getStatusChip(budget)}
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {budget.category} • {budget.period}
                      </Typography>
                      
                      <Box mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">
                            ${budget.spent_amount.toFixed(2)} of ${budget.total_budget}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {utilization.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(utilization, 100)}
                          color={getUtilizationColor(utilization)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        Remaining: ${budget.remaining_budget.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" gap={1}>
                      <IconButton onClick={() => handleEditBudget(budget)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Create/Edit Budget Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedBudget ? 'Edit Budget' : 'Create New Budget'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Budget Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Total Budget Amount"
              type="number"
              fullWidth
              value={formData.total_budget}
              onChange={(e) => setFormData({ ...formData, total_budget: e.target.value })}
              InputProps={{
                startAdornment: <span style={{ marginRight: 8 }}>$</span>,
              }}
            />
            <TextField
              label="Category"
              fullWidth
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Period</InputLabel>
              <Select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                label="Period"
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveBudget} variant="contained">
            {selectedBudget ? 'Update' : 'Create'} Budget
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Budget;
