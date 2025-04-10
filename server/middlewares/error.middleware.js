import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`Status Code: ${statusCode}`);
  console.error(`Message: ${err.message}`);
  if (err.errors) {
    console.error(`Errors:`, err.errors);
  }
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Stack Trace:\n${err.stack}`);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
