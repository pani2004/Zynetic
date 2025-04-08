import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import connectDB from './db/index.js';
import userRoutes from './routes/user.route.js';
import productRoutes from './routes/product.route.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('❌ MongoDB connection failed:', err);
  });


app.use('/api/auth', userRoutes);
app.use('/api/products', productRoutes);


const frontendPath = path.join(__dirname, 'public');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});


