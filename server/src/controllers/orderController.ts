import { Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/authMiddleware';
import { Order } from '../models/Order';
import { Product } from '../models/Product';

export const getOrders = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const query: any = {};

  // If not admin, only show user's orders
  if (req.user?.role !== 'admin') {
    query.user = req.user?._id;
  }

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name image')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name image price');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Check if user owns the order or is admin
  if (req.user?.role !== 'admin' && order.user.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, 'Not authorized to view this order');
  }

  res.json({
    success: true,
    data: order,
  });
});

export const createOrder = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, 'No order items');
  }

  let itemsPrice = 0;

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(404, `Product ${item.product} not found`);
    }
    itemsPrice += product.price * item.quantity;

    // Update stock
    product.stock -= item.quantity;
    await product.save();
  }

  const shippingPrice = itemsPrice > 999 ? 0 : 50;
  const taxPrice = itemsPrice * 0.18;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user?._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.status = status;

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  await order.save();

  res.json({
    success: true,
    data: order,
  });
});

