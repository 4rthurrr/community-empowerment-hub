import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Marketplace from './Pages/Marketplace';
import ProductDetails from './Pages/ProductDetails';
import AddProduct from './Pages/AddProduct';
import DisplayProduct from './Pages/DisplayProduct';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/display-product" element={<DisplayProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
