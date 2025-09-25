import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Receipt,
  AccountBalance,
  Nature,
  Add,
  AttachMoney,
  ShoppingCart,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalSpent: number;
  budgetUtilization: number;
  receiptsCount: number;
  sustainabilityScore: number;
}

interface RecentActivity {
  id: number;
  type: 'receipt' | 'budget' | 'goal';
  title: string;
  amount?: number;
  date: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  // Mock data for charts
  const spendingData = [
    { name: 'Groceries', value: 450, color: '#2E7D32' },
    { name: 'Dining', value: 250, color: '#FF9800' },
    { name: 'Household', value: 150, color: '#2196F3' },
    { name: 'Other', value: 100, color: '#9C27B0' },
  ];

  const monthlyData = [
    { month: 'Jan', spent: 850 },
    { month: 'Feb', spent: 920 },
    { month: 'Mar', spent: 780 },
    { month: 'Apr', spent: 950 },
    { month: 'May', spent: 890 },
    { month: 'Jun', spent: 1020 },
  ];

  useEffect(() => {
    // Mock API call to fetch dashboard data
    setStats({
      totalSpent: 2840.50,
      budgetUtilization: 68.5,
      receiptsCount: 24,
      sustainabilityScore: 78,
    });

    setRecentActivity([
      {
        id: 1,
        type: 'receipt',
        title: 'SuperMart Receipt',
        amount: 45.67,
        date: '2 hours ago',
      },
      {
        id: 2,
        type: 'budget',
        title: 'Monthly Grocery Budget',
        amount: 500,
        date: '1 day ago',
      },
      {
        id: 3,
        type: 'receipt',
        title: 'Fresh Market Receipt',
        amount: 28.90,
        date: '2 days ago',
      },
    ]);
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    progress?: number;
  }> = ({ title, value, subtitle, icon, color, progress }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
        {progress !== undefined && (
          <Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                },
              }} 
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {progress}% of budget used
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's your grocery spending overview.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 3, 
          mb: 4, 
          flexWrap: 'wrap',
          '& > *': { 
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }
          }
        }}
      >
        <Box>
          <StatCard
            title="Total Spent This Month"
            value={`$${(stats?.totalSpent || 0).toFixed(2)}`}
            subtitle="+12% from last month"
            icon={<AttachMoney />}
            color="#2E7D32"
          />
        </Box>
        <Box>
          <StatCard
            title="Budget Utilization"
            value={`${stats?.budgetUtilization || 0}%`}
            subtitle="On track"
            icon={<AccountBalance />}
            color="#FF9800"
            progress={stats?.budgetUtilization || 0}
          />
        </Box>
        <Box>
          <StatCard
            title="Receipts Scanned"
            value={stats?.receiptsCount || 0}
            subtitle="This month"
            icon={<Receipt />}
            color="#2196F3"
          />
        </Box>
        <Box>
          <StatCard
            title="Sustainability Score"
            value={`${stats?.sustainabilityScore || 0}/100`}
            subtitle="Excellent!"
            icon={<Nature />}
            color="#4CAF50"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Spending Breakdown Chart */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Spending Breakdown
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Monthly Trend */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Monthly Spending Trend
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Spent']} />
                    <Bar dataKey="spent" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activity */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Activity
                </Typography>
                <Button size="small" variant="outlined">
                  View All
                </Button>
              </Box>
              <List disablePadding>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem disablePadding>
                      <Box display="flex" alignItems="center" width="100%" py={1}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            width: 40, 
                            height: 40,
                            bgcolor: activity.type === 'receipt' ? '#2E7D32' : '#FF9800'
                          }}
                        >
                          {activity.type === 'receipt' ? <Receipt /> : <AccountBalance />}
                        </Avatar>
                        <Box flexGrow={1}>
                          <Typography variant="body2" fontWeight="medium">
                            {activity.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.date}
                          </Typography>
                        </Box>
                        {activity.amount && (
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            ${activity.amount}
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quick Actions
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Receipt />}
                    sx={{ py: 2 }}
                    onClick={() => navigate('/receipts')}
                  >
                    Scan Receipt
                  </Button>
                </Box>
                <Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    sx={{ py: 2 }}
                    onClick={() => navigate('/budget')}
                  >
                    Add Budget
                  </Button>
                </Box>
                <Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ShoppingCart />}
                    sx={{ py: 2 }}
                    onClick={() => navigate('/shopping-list')}
                  >
                    Shopping List
                  </Button>
                </Box>
                <Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<TrendingUp />}
                    sx={{ py: 2 }}
                    onClick={() => navigate('/analytics')}
                  >
                    View Analytics
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
