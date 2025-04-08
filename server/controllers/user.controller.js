import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import dotenv from 'dotenv';
dotenv.config();

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};


export const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }
  const userExists = await User.findOne({ email });
  if (userExists) throw new ApiError(400, 'User already exists');

  const user = await User.create({ email, password });
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
  });

  res.status(201).json(new ApiResponse(201, { user, accessToken }),"User registered successfully");
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) {
    throw new ApiError(400, 'Email and password are required');
}
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json(new ApiResponse(200, { user, accessToken },"User logged in successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) throw new ApiError(401, 'Refresh token missing');

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(decoded.userId);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json(new ApiResponse(200, { accessToken }));
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token');
  }
});
