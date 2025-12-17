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
import addressRoutes from './routes/addresssRouter.js';
import orderRoute from './controllers/orderRoute.js';



const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = ['http://localhost:5173'];


try {
    await connectDB();
    await connectCloudinary();  
} catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
}

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/users', userRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRoutes);
app.use('/api/orders', orderRoute);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});