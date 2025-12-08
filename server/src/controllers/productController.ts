import { Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/authMiddleware';
import { Product } from '../models/Product';

export const getProducts = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { category, search, status } = req.query;
  const query: any = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (status) {
    query.status = status;
  }

  const products = await Product.find(query).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

export const getProductById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.json({
    success: true,
    data: product,
  });
});

export const createProduct = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res.json({
    success: true,
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  await product.deleteOne();

  res.json({
    success: true,
    data: {},
  });
});

