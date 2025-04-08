import Product from '../models/product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, rating } = req.body;

  const product = await Product.create({
    name,
    description,
    category,
    price,
    rating,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, product),"Product created successfully");
});

export const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, rating, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }
  if (rating) filter.rating = { $gte: rating };
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const products = await Product.find(filter);
  res.status(200).json(new ApiResponse(200, products),"Products fetched successfully");
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new ApiError(404, 'Product not found');
  if (product.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Unauthorized to update this product');
  }

  Object.assign(product, req.body);
  await product.save();

  res.status(200).json(new ApiResponse(200, product),"Product updated successfully");
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new ApiError(404, 'Product not found');
  if (product.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Unauthorized to delete this product');
  }

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});
