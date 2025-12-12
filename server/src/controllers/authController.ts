import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';

// Generate JWT Token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

/**
 * @desc   Register user
 * @route  POST /api/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'customer',
  });

  const token = generateToken(user._id.toString());

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    },
  });
});

/**
 * @desc   Login user
 * @route  POST /api/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id.toString());
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } else {
    throw new ApiError(401, 'Invalid email or password');
  }
});

/**
 * @desc   Get logged-in user profile
 * @route  GET /api/auth/me
 * @access Private
 */
export const getMe = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?._id).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    data: user,
  });
});

/**
 * @desc   Update user profile (Admin Settings Page)
 * @route  PUT /api/auth/update-profile
 * @access Private
 */
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, 'Not authorized');
  }

  // Allowed fields to update
  const allowedFields = [
    'name',
    'firstName',
    'lastName',
    'phone',
    'company',
    'address',
    'avatar',
  ];

  const updates: any = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
  }).select('-password');

  if (!updatedUser) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    data: updatedUser,
  });
});

