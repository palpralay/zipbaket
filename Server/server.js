import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.js';
import userRoutes from './routes/userRoutes.js';
import sellerRoutes from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productsRoutes from './routes/productsRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import addressRoutes from './routes/addressRouter.js';
import orderRoute from './routes/orderRoute.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

// Connect to database and cloudinary
try {
  await connectDB();
  await connectCloudinary();
} catch (error) {
  console.error('Initialization failed:', error);
  process.exit(1);
}

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'ZipBasket API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRoutes);
app.use('/api/orders', orderRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});