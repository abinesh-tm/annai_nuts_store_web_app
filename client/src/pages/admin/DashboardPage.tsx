import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchOrders } from '../../store/features/orders/ordersSlice';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { DashboardStats } from '../../types';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.orders);
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading || !stats) {
    return <div>Loading dashboard...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              <p className={`text-sm mt-1 ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange.toFixed(1)}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">$</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              <p className={`text-sm mt-1 ${stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.ordersChange >= 0 ? '+' : ''}{stats.ordersChange.toFixed(1)}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🛒</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              <p className={`text-sm mt-1 ${stats.customersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.customersChange >= 0 ? '+' : ''}{stats.customersChange.toFixed(1)}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              <p className={`text-sm mt-1 ${stats.productsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.productsChange >= 0 ? '+' : ''}{stats.productsChange.toFixed(1)}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order._id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-medium text-sm">{typeof order.user === 'object' ? order.user.name : 'Customer'}</p>
                    <p className="text-xs text-gray-500">{order._id}</p>
                  </div>
                  <Badge variant={getStatusColor(order.status) as any}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-900">${order.totalPrice.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-3">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{product.name}</span>
                <span className="text-sm font-medium">{product.sold} sold</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Low Stock Alert</h2>
          <div className="space-y-3">
            {stats.lowStockProducts.map((product) => (
              <div key={product._id} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{product.name}</span>
                <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                  {product.stock} left
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Conversion Rate</span>
              <span className="text-sm font-medium text-green-600">3.24% ↗</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Avg. Order Value</span>
              <span className="text-sm font-medium text-green-600">$87.50 ↗</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Cart Abandonment</span>
              <span className="text-sm font-medium text-red-600">68% ↘</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

