import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Analytics: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock data for charts
  const categoryData = [
    { name: 'Groceries', value: 450, color: '#2E7D32' },
    { name: 'Dining', value: 250, color: '#FF9800' },
    { name: 'Household', value: 150, color: '#2196F3' },
    { name: 'Personal Care', value: 100, color: '#9C27B0' },
    { name: 'Other', value: 50, color: '#757575' },
  ];

  const monthlyTrends = [
    { month: 'Jan', groceries: 400, dining: 200, household: 100 },
    { month: 'Feb', groceries: 450, dining: 220, household: 120 },
    { month: 'Mar', groceries: 380, dining: 180, household: 90 },
    { month: 'Apr', groceries: 520, dining: 280, household: 150 },
    { month: 'May', groceries: 480, dining: 240, household: 130 },
    { month: 'Jun', groceries: 550, dining: 300, household: 170 },
  ];

  const weeklySpending = [
    { day: 'Mon', amount: 45 },
    { day: 'Tue', amount: 32 },
    { day: 'Wed', amount: 28 },
    { day: 'Thu', amount: 65 },
    { day: 'Fri', amount: 89 },
    { day: 'Sat', amount: 156 },
    { day: 'Sun', amount: 78 },
  ];

  const topProducts = [
    { name: 'Milk', spending: 45.60, frequency: 12 },
    { name: 'Bread', spending: 32.40, frequency: 8 },
    { name: 'Eggs', spending: 28.80, frequency: 6 },
    { name: 'Chicken', spending: 67.20, frequency: 4 },
    { name: 'Bananas', spending: 23.50, frequency: 10 },
  ];

  const shoppingPatterns = {
    favoriteStores: [
      { name: 'SuperMart', visits: 15, spending: 567.80 },
      { name: 'Fresh Market', visits: 8, spending: 234.50 },
      { name: 'Corner Store', visits: 6, spending: 123.20 },
    ],
    peakHours: [
      { hour: '9-10 AM', frequency: 8 },
      { hour: '12-1 PM', frequency: 15 },
      { hour: '5-6 PM', frequency: 12 },
      { hour: '7-8 PM', frequency: 10 },
    ],
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Analytics & Insights
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Deep dive into your spending patterns and trends
        </Typography>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="analytics tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PieChartIcon />} label="Category Breakdown" />
          <Tab icon={<TrendingUp />} label="Spending Trends" />
          <Tab icon={<BarChartIcon />} label="Top Products" />
          <Tab icon={<Timeline />} label="Shopping Patterns" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Box display="flex" flexWrap="wrap" gap={3}>
              <Card sx={{ flex: 1, minWidth: 300 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Spending by Category
                  </Typography>
                  <Box height={400}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, minWidth: 300 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Category Summary
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2} pt={2}>
                    {categoryData.map((category) => (
                      <Box key={category.name} display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            width={16}
                            height={16}
                            borderRadius="50%"
                            bgcolor={category.color}
                          />
                          <Typography variant="body2">{category.name}</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                          ${category.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Monthly Spending Trends
                </Typography>
                <Box height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="groceries" stackId="1" stroke="#2E7D32" fill="#2E7D32" />
                      <Area type="monotone" dataKey="dining" stackId="1" stroke="#FF9800" fill="#FF9800" />
                      <Area type="monotone" dataKey="household" stackId="1" stroke="#2196F3" fill="#2196F3" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Weekly Spending Pattern
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklySpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      <Line type="monotone" dataKey="amount" stroke="#2E7D32" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Top Products by Spending
              </Typography>
              <Box height={400}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Total Spent']} />
                    <Bar dataKey="spending" fill="#2E7D32" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Favorite Stores
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {shoppingPatterns.favoriteStores.map((store, index) => (
                    <Box key={store.name} display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {index + 1}. {store.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {store.visits} visits
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ${store.spending.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Shopping Time Patterns
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {shoppingPatterns.peakHours.map((hour) => (
                    <Box key={hour.hour} display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1">{hour.hour}</Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          width={`${(hour.frequency / 15) * 100}px`}
                          height={8}
                          bgcolor="primary.main"
                          borderRadius={4}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {hour.frequency} times
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Analytics;
