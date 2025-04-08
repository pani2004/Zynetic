import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Logging in with:', { email, password });

      const res = await axios.post(
        '/api/auth/login',
        { email, password },
        { withCredentials: true } // ✅ Send cookies (important!)
      );

      console.log('Login Response:', res.data);

      const { user } = res.data.data;

      // ✅ Just store user (token is in cookie)
      dispatch(setCredentials({ user }));

      console.log('Dispatch complete. Navigating to /products...');
      navigate('/products');
    } catch (err) {
      console.error('Login Error:', err?.response?.data || err.message);
      alert(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg w-80 space-y-4 shadow-md"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-gray-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-gray-700 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full p-2 bg-green-600 hover:bg-green-700 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;



