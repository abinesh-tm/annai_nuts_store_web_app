# Anand Dry Fruits Store - E-Commerce Platform

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application with TypeScript, featuring a customer storefront and admin panel.

## 🚀 Features

### Customer Storefront
- Browse products by category
- Product search and filtering
- Shopping cart functionality
- Secure checkout process
- User authentication
- Responsive design with warm brown/cream theme

### Admin Panel
- Dashboard with analytics and charts
- Product management (CRUD operations)
- Order management and status updates
- Customer management
- Inventory tracking
- Sales reports and statistics

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Redux Toolkit** for state management
- **React Router** for routing
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Heroicons** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📁 Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── features/       # Redux slices
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Router configuration
│   │   ├── services/       # API service layer
│   │   ├── store/          # Redux store setup
│   │   ├── styles/         # Global styles
│   │   └── types/          # TypeScript type definitions
│   └── package.json
│
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── config/         # Database and environment config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth and error middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Seed scripts
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Express server entry
│   └── package.json
│
└── package.json           # Root package.json for workspace
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Annai_nuts_store
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/annai_nuts_store
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Seed the Database**
   ```bash
   cd server
   npm run seed
   ```

   This will create:
   - Admin user: `admin@example.com` / `admin123`
   - Sample customers
   - Sample products
   - Sample orders

5. **Start Development Servers**

   From the root directory:
   ```bash
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📝 Available Scripts

### Root
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm start` - Start production server

### Client
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server
- `npm run dev` - Start server with hot reload (tsx watch)
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

## 🔐 Default Credentials

After running the seed script:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Customer:**
- Email: `john.doe@example.com`
- Password: `password123`

## 🎨 Theme Colors

### Storefront (Brown Theme)
- Primary: `#6B3A1E`
- Primary Dark: `#4A2614`
- Cream Background: `#FFF6EC`
- Peach: `#FFE0CC`
- Accent Orange: `#F97316`

### Admin Panel (Blue Theme)
- Primary: `#2563EB`
- Sidebar: `#020617`
- Background: `#F9FAFB`

## 🔒 Authentication

- JWT-based authentication
- Protected routes for admin panel
- Token stored in localStorage
- Automatic token refresh on API calls

## 📦 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get orders (admin) or user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Customers
- `GET /api/customers` - Get all customers (admin)
- `GET /api/customers/:id` - Get customer by ID (admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics (admin)

## 🚀 Deployment

### Build for Production

```bash
# Build both client and server
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Make sure to set proper environment variables:
- Use a strong `JWT_SECRET`
- Set `NODE_ENV=production`
- Use MongoDB Atlas or production MongoDB instance
- Configure CORS for your domain

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@example.com or create an issue in the repository.

---

Built with ❤️ using MERN Stack + TypeScript

