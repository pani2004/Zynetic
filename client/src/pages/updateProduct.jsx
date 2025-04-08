
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    rating: ''
  });

  const [error, setError] = useState('');
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products?search=${id}`, { withCredentials: true });
        const product = res.data.data.find(p => p._id === id);
        if (product) {
          setForm({
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            rating: product.rating
          });
        }
      } catch (err) {
        setError('Failed to load product');
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`/api/products/${id}`, form, { withCredentials: true });
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-md mt-10 rounded">
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Rating</label>
          <input
            type="number"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            step="0.1"
            max="5"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
