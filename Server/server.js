import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.js';


const app = express();
const PORT = process.env.PORT || 4000;
const allowOrigins = ['http://localhost:5173'];


try {
    await connectDB();
} catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
}

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowOrigins, credentials: true}));
app.use(express.urlencoded({ extended: true }));




app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});