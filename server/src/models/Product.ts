import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  sku: string;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  status: 'active' | 'inactive';
  rating?: number;
  numReviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    originalPrice: {
      type: Number,
    },
    sku: {
      type: String,
      required: [true, 'Please add a SKU'],
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image'],
    },
    images: {
      type: [String],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);

