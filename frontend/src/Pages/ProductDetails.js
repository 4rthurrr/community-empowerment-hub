import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import '../Styles/ProductDetails.css'; // Import the CSS file

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load product details.');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="product-details-container">
      <h1 className="product-name">{product.name}</h1>
      <img
        src={product.image || 'https://via.placeholder.com/600x400'}
        alt={product.name}
        className="product-image"
      />
      <p className="product-description">{product.description}</p>
      <p className="product-price">Price: LKR {product.price}</p>
      <p className="product-seller">
        Seller: <strong>{product.seller}</strong>
      </p>
      <button className="order-button" onClick={() => alert('Order functionality coming soon!')}>
        Order Now
      </button>
    </div>
  );
};

export default ProductDetails;
