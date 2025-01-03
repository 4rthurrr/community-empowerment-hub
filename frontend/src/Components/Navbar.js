import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css'; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div>
        <Link to="/" className="navbar-logo">
          Marketplace
        </Link>
      </div>

      {/* Navigation Links */}
      <div>
        <Link to="/" className="navbar-link">
          Home
        </Link>
        <Link to="/products" className="navbar-link">
          Products
        </Link>
        <Link to="/add-product" className="navbar-link">
          Add Product
        </Link>
        <Link to="/about" className="navbar-link">
          About
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
