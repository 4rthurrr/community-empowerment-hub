import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './updateproduct.css';

const UpdateProduct = () => {
  const { id } = useParams();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the existing product data
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProductName(data.productName);
        setCategory(data.category);
        setPrice(data.price);
        setImages(data.images);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!productName || !category || !price || images.length === 0) {
      alert('Please fill out all fields and upload at least one image.');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('category', category);
    formData.append('price', price);
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      // Send data to backend
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        // Handle success
        alert('Product updated successfully!');
        // Navigate to product listing page
        navigate('/products');
      } else {
        // Handle error
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          alert('Failed to update product. Please try again.');
        } else {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          alert('Failed to update product. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred: ${error.message}. Please try again.`);
    }
  };

  return (
    <form className="update-product-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
        </select>
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Product Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      <button className="submit-button" type="submit">Update Product</button>
    </form>
  );
};

export default UpdateProduct;
