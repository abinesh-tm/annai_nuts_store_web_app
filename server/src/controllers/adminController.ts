import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/authMiddleware';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Product } from '../models/Product';

export const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());

  // Total Revenue
  const allOrders = await Order.find({});
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const lastMonthOrders = await Order.find({
    createdAt: { $gte: lastMonth },
  });
  const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const previousMonthOrders = await Order.find({
    createdAt: { $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate()), $lt: lastMonth },
  });
  const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const revenueChange = previousMonthRevenue > 0
    ? ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
    : 0;

  // Total Orders
  const totalOrders = allOrders.length;
  const lastMonthOrdersCount = lastMonthOrders.length;
  const previousMonthOrdersCount = previousMonthOrders.length;
  const ordersChange = previousMonthOrdersCount > 0
    ? ((lastMonthOrdersCount - previousMonthOrdersCount) / previousMonthOrdersCount) * 100
    : 0;

  // Total Customers
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const lastMonthCustomers = await User.countDocuments({
    role: 'customer',
    createdAt: { $gte: lastMonth },
  });
  const previousMonthCustomers = await User.countDocuments({
    role: 'customer',
    createdAt: {
      $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate()),
      $lt: lastMonth,
    },
  });
  const customersChange = previousMonthCustomers > 0
    ? ((lastMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100
    : 0;

  // Total Products
  const totalProducts = await Product.countDocuments();
  const lastMonthProducts = await Product.countDocuments({ createdAt: { $gte: lastMonth } });
  const previousMonthProducts = await Product.countDocuments({
    createdAt: {
      $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate()),
      $lt: lastMonth,
    },
  });
  const productsChange = previousMonthProducts > 0
    ? ((lastMonthProducts - previousMonthProducts) / previousMonthProducts) * 100
    : 0;

  // Monthly Sales (last 6 months)
  const monthlySales = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthOrders = await Order.find({
      createdAt: { $gte: monthStart, $lte: monthEnd },
    });
    const monthRevenue = monthOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    monthlySales.push({
      month: monthStart.toLocaleString('default', { month: 'short' }),
      revenue: monthRevenue,
    });
  }

  // Recent Orders
  const recentOrders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(4);

  // Top Products
  const productSales: { [key: string]: number } = {};
  allOrders.forEach((order) => {
    order.orderItems.forEach((item) => {
      const productId = item.product.toString();
      productSales[productId] = (productSales[productId] || 0) + item.quantity;
    });
  });

  const topProductsData = await Promise.all(
    Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(async ([productId, quantity]) => {
        const product = await Product.findById(productId);
        return {
          name: product?.name || 'Unknown',
          sold: quantity,
        };
      })
  );

  // Low Stock Products
  const lowStockProducts = await Product.find({ stock: { $lte: 10 } })
    .select('name stock')
    .limit(3);

  res.json({
    success: true,
    data: {
      totalRevenue,
      revenueChange,
      totalOrders,
      ordersChange,
      totalCustomers,
      customersChange,
      totalProducts,
      productsChange,
      monthlySales,
      recentOrders,
      topProducts: topProductsData,
      lowStockProducts,
    },
  });
});

