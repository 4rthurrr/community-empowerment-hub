import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/AddProduct.css'; // Import the CSS file

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    seller: '',
    image: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/products', formData); // Ensure the endpoint is correct
      setSuccess('Product added successfully!');
      setTimeout(() => navigate('/'), 2000); // Redirect to the homepage after 2 seconds
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add the product. Please try again.');
    }
  };

  return (
    <div className="add-product-container">
      <h1 className="add-product-title">Add a New Product</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="add-product-form">
        <label className="form-label">Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
        />

        <label className="form-label">Price (LKR)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="form-input"
        />

        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          className="form-textarea"
        />

        <label className="form-label">Seller Name</label>
        <input
          type="text"
          name="seller"
          value={formData.seller}
          onChange={handleChange}
          required
          className="form-input"
        />

        <label className="form-label">Image URL</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="form-input"
        />

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
