import express from 'express';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, createProduct);

router
  .route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;
