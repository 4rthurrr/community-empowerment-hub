import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ProductCard from '../Components/ProductCard';
import '../Styles/Marketplace.css'; // Import the CSS file

const Marketplace = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="marketplace-container">
      <h1>Marketplace</h1>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
