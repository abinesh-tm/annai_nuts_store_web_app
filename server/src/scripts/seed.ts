import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';

const seedData = async (): Promise<void> => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    console.log('Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create Customers
    const customers = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '+1 (555) 123-4567',
        role: 'customer',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        phone: '+1 (555) 234-5678',
        role: 'customer',
      },
      {
        name: 'Bob Johnson',
        email: 'bob.j@example.com',
        password: 'password123',
        phone: '+1 (555) 345-6789',
        role: 'customer',
      },
      {
        name: 'Alice Williams',
        email: 'alice.w@example.com',
        password: 'password123',
        phone: '+1 (555) 456-7890',
        role: 'customer',
      },
    ]);

    console.log('Created users');

    // Create Products
    const products = await Product.insertMany([
      {
        name: 'Walnut',
        description: 'Premium quality shelled walnuts, rich in omega-3 fatty acids',
        price: 10.20,
        originalPrice: 12.00,
        sku: 'WH-1000',
        category: 'Walnuts',
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4ddaa81f?w=400',
        stock: 45,
        status: 'active',
        rating: 5,
        numReviews: 24,
      },
      {
        name: 'Cashew',
        description: 'Premium grade cashews, creamy and delicious',
        price: 15.00,
        sku: 'CH-2000',
        category: 'Cashews',
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4ddaa81f?w=400',
        stock: 120,
        status: 'active',
        rating: 5,
        numReviews: 18,
      },
      {
        name: 'Pistachio',
        description: 'Fresh shelled pistachios, perfect for snacking',
        price: 12.50,
        sku: 'PS-3000',
        category: 'Pistachios',
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4ddaa81f?w=400',
        stock: 89,
        status: 'active',
        rating: 5,
        numReviews: 32,
      },
      {
        name: 'Almond',
        description: 'Premium California almonds, crunchy and nutritious',
        price: 18.00,
        sku: 'AL-4000',
        category: 'Almonds',
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4ddaa81f?w=400',
        stock: 25,
        status: 'active',
        rating: 5,
        numReviews: 15,
      },
      {
        name: 'Sunflower Seeds',
        description: 'Roasted sunflower seeds, great for snacking',
        price: 8.50,
        sku: 'SS-5000',
        category: 'Seeds',
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4ddaa81f?w=400',
        stock: 150,
        status: 'active',
        rating: 4.5,
        numReviews: 12,
      },
      {
        name: 'Mixed Nuts',
        description: 'Premium mix of walnuts, almonds, cashews, and pistachios',
        price: 22.00,
        sku: 'MN-6000',
        category: 'Mixes',
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4ddaa81f?w=400',
        stock: 60,
        status: 'active',
        rating: 5,
        numReviews: 28,
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation',
        price: 199.99,
        sku: 'WH-1000',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        stock: 45,
        status: 'active',
        rating: 4.8,
        numReviews: 245,
      },
      {
        name: 'Smartphone Case',
        description: 'Durable protective case for smartphones',
        price: 29.99,
        sku: 'SC-2000',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400',
        stock: 120,
        status: 'active',
        rating: 4.5,
        numReviews: 189,
      },
      {
        name: 'Laptop Stand',
        description: 'Ergonomic aluminum laptop stand',
        price: 49.99,
        sku: 'LS-3000',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        stock: 8,
        status: 'active',
        rating: 4.7,
        numReviews: 156,
      },
      {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical gaming keyboard',
        price: 149.99,
        sku: 'MK-4000',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
        stock: 25,
        status: 'active',
        rating: 4.9,
        numReviews: 189,
      },
      {
        name: 'USB-C Hub',
        description: '7-in-1 USB-C hub with HDMI',
        price: 59.99,
        sku: 'UH-5000',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
        stock: 0,
        status: 'active',
        rating: 4.6,
        numReviews: 98,
      },
    ]);

    console.log('Created products');

    // Create Orders
    const orders = await Order.insertMany([
      {
        user: customers[0]._id,
        orderItems: [
          {
            product: products[0]._id,
            name: products[0].name,
            quantity: 2,
            price: products[0].price,
            image: products[0].image,
          },
          {
            product: products[1]._id,
            name: products[1].name,
            quantity: 1,
            price: products[1].price,
            image: products[1].image,
          },
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        paymentMethod: 'card',
        itemsPrice: 35.40,
        shippingPrice: 0,
        taxPrice: 6.37,
        totalPrice: 41.77,
        isPaid: true,
        paidAt: new Date('2024-02-20'),
        isDelivered: true,
        deliveredAt: new Date('2024-02-22'),
        status: 'delivered',
        createdAt: new Date('2024-02-20'),
      },
      {
        user: customers[1]._id,
        orderItems: [
          {
            product: products[2]._id,
            name: products[2].name,
            quantity: 1,
            price: products[2].price,
            image: products[2].image,
          },
        ],
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
        },
        paymentMethod: 'card',
        itemsPrice: 12.50,
        shippingPrice: 0,
        taxPrice: 2.25,
        totalPrice: 14.75,
        isPaid: true,
        paidAt: new Date('2024-02-22'),
        status: 'shipped',
        createdAt: new Date('2024-02-22'),
      },
      {
        user: customers[2]._id,
        orderItems: [
          {
            product: products[3]._id,
            name: products[3].name,
            quantity: 2,
            price: products[3].price,
            image: products[3].image,
          },
        ],
        shippingAddress: {
          street: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
        },
        paymentMethod: 'card',
        itemsPrice: 36.00,
        shippingPrice: 0,
        taxPrice: 6.48,
        totalPrice: 42.48,
        isPaid: true,
        paidAt: new Date('2024-02-25'),
        status: 'processing',
        createdAt: new Date('2024-02-25'),
      },
      {
        user: customers[3]._id,
        orderItems: [
          {
            product: products[4]._id,
            name: products[4].name,
            quantity: 1,
            price: products[4].price,
            image: products[4].image,
          },
        ],
        shippingAddress: {
          street: '321 Elm St',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA',
        },
        paymentMethod: 'card',
        itemsPrice: 8.50,
        shippingPrice: 50,
        taxPrice: 10.53,
        totalPrice: 69.03,
        status: 'pending',
        createdAt: new Date('2024-02-28'),
      },
    ]);

    console.log('Created orders');
    console.log('Seed data created successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\nCustomer credentials:');
    console.log('Email: john.doe@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

