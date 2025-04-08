import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from "./db/index.js";
import userRoutes from './routes/user.route.js';
import productRoutes from './routes/product.route.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port :${process.env.PORT}`)
    })
})
.catch((err)=>[
    console.log("MongoDB connection failed",err)
])

app.use('/api/auth', userRoutes);
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
