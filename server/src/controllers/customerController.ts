import { Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { Order } from '../models/Order';

export const getCustomers = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { search } = req.query;
  const query: any = { role: 'customer' };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const customers = await User.find(query).select('-password').sort({ createdAt: -1 });

  // Get order stats for each customer
  const customersWithStats = await Promise.all(
    customers.map(async (customer) => {
      const orders = await Order.find({ user: customer._id });
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

      return {
        ...customer.toObject(),
        totalOrders,
        totalSpent,
      };
    })
  );

  res.json({
    success: true,
    count: customersWithStats.length,
    data: customersWithStats,
  });
});

export const getCustomerById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const customer = await User.findById(req.params.id).select('-password');

  if (!customer || customer.role !== 'customer') {
    throw new ApiError(404, 'Customer not found');
  }

  const orders = await Order.find({ user: customer._id });
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  res.json({
    success: true,
    data: {
      ...customer.toObject(),
      totalOrders,
      totalSpent,
    },
  });
});

