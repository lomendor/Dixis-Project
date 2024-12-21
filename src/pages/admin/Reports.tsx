import React, { useState } from 'react';
import { Box, Heading, Tabs, TabList, Tab, TabPanels, TabPanel, Grid, Select, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAdminStats } from '@/features/admin/hooks/useAdminStats';
import { StatsCard } from '@/components/admin/dashboard/StatsCard';
import { FiTrendingUp, FiUsers, FiShoppingBag, FiPackage } from 'react-icons/fi';
import type { MonthlySales, ProductDistribution, TopProducer } from '@/features/admin/types/stats';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Reports() {
  const { data: stats, isLoading, error } = useAdminStats();
  const [timeRange, setTimeRange] = useState('month');

  if (isLoading) {
    return (
      <Box p={6} display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          Σφάλμα κατά τη φόρτωση των στατιστικών
        </Alert>
      </Box>
    );
  }

  if (!stats?.overview) {
    return (
      <Box p={6}>
        <Alert status="info">
          <AlertIcon />
          Δεν βρέθηκαν στατιστικά δεδομένα
        </Alert>
      </Box>
    );
  }

  const overview = [
    {
      title: 'Συνολικά Έσοδα',
      value: `€${stats.overview.revenue.toLocaleString()}`,
      icon: FiTrendingUp,
      trend: { value: 12.5, isPositive: true }
    },
    {
      title: 'Συνολικοί Χρήστες',
      value: stats.overview.totalUsers.toLocaleString(),
      icon: FiUsers,
      trend: { value: 8.2, isPositive: true }
    },
    {
      title: 'Συνολικά Προϊόντα',
      value: stats.overview.totalProducts.toLocaleString(),
      icon: FiShoppingBag,
      trend: { value: 4.1, isPositive: true }
    },
    {
      title: 'Συνολικές Παραγγελίες',
      value: stats.overview.totalOrders.toLocaleString(),
      icon: FiPackage,
      trend: { value: 15.3, isPositive: true }
    }
  ];

  return (
    <Box p={6} maxW="7xl" mx="auto">
      <Box mb={6}>
        <Heading size="lg" mb={4}>Αναφορές & Στατιστικά</Heading>
        
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          maxW="xs"
          mb={6}
        >
          <option value="week">Τελευταία Εβδομάδα</option>
          <option value="month">Τελευταίος Μήνας</option>
          <option value="quarter">Τελευταίο Τρίμηνο</option>
          <option value="year">Τελευταίο Έτος</option>
        </Select>

        {/* Overview Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
          {overview.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </Grid>
      </Box>

      <Tabs>
        <TabList>
          <Tab>Πωλήσεις</Tab>
          <Tab>Χρήστες</Tab>
          <Tab>Προϊόντα</Tab>
        </TabList>

        <TabPanels>
          {/* Sales Tab */}
          <TabPanel>
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
              {/* Monthly Sales Trend */}
              <Box bg="white" p={6} borderRadius="lg" shadow="sm">
                <Heading size="md" mb={4}>Τάση Πωλήσεων</Heading>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.monthlySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tickFormatter={(date: string) => format(new Date(date), 'MMM yy')}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(date: string) => format(new Date(date), 'MMMM yyyy')}
                        formatter={(value: number) => [`€${value}`, 'Πωλήσεις']}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#0088FE" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Box>

              {/* Product Distribution */}
              <Box bg="white" p={6} borderRadius="lg" shadow="sm">
                <Heading size="md" mb={4}>Κατανομή Προϊόντων</Heading>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.productDistribution}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {stats.productDistribution.map((entry: ProductDistribution, index: number) => (
                          <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </Grid>
          </TabPanel>

          {/* Users Tab */}
          <TabPanel>
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
              {/* Top Producers */}
              <Box bg="white" p={6} borderRadius="lg" shadow="sm">
                <Heading size="md" mb={4}>Κορυφαίοι Παραγωγοί</Heading>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={stats.topProducers}
                      margin={{ left: 100 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={100}
                      />
                      <Tooltip formatter={(value: number) => [`€${value}`, 'Πωλήσεις']} />
                      <Bar dataKey="totalSales" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>

              {/* Recent Orders */}
              <Box bg="white" p={6} borderRadius="lg" shadow="sm">
                <Heading size="md" mb={4}>Πρόσφατες Παραγγελίες</Heading>
                <Box overflowX="auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">Αριθμός</th>
                        <th className="px-4 py-2 text-left">Πελάτης</th>
                        <th className="px-4 py-2 text-left">Ποσό</th>
                        <th className="px-4 py-2 text-left">Κατάσταση</th>
                        <th className="px-4 py-2 text-left">Ημερομηνία</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-4 py-2">{order.orderNumber}</td>
                          <td className="px-4 py-2">{order.customer}</td>
                          <td className="px-4 py-2">€{order.total}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status === 'completed' ? 'Ολοκληρώθηκε' :
                               order.status === 'pending' ? 'Σε Εκκρεμότητα' :
                               'Σε Επεξεργασία'}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {format(new Date(order.date), 'dd/MM/yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Box>
            </Grid>
          </TabPanel>

          {/* Products Tab */}
          <TabPanel>
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
              {/* Product Distribution */}
              <Box bg="white" p={6} borderRadius="lg" shadow="sm">
                <Heading size="md" mb={4}>Κατανομή ανά Κατηγορία</Heading>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.productDistribution}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {stats.productDistribution.map((entry: ProductDistribution, index: number) => (
                          <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Box>

              {/* Top Products */}
              <Box bg="white" p={6} borderRadius="lg" shadow="sm">
                <Heading size="md" mb={4}>Κορυφαία Προϊόντα</Heading>
                <Box h="300px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: 'Βιολογικό Μέλι', sales: 245 },
                        { name: 'Ελαιόλαδο Extra', sales: 189 },
                        { name: 'Φέτα ΠΟΠ', sales: 156 },
                        { name: 'Κρασί Νεμέας', sales: 134 },
                        { name: 'Γραβιέρα', sales: 112 }
                      ]}
                      margin={{ left: 100 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}