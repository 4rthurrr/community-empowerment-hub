import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainDashBoard from './Components/MaindashBoard/MainDashBoard';
import SellerDashboard from './Components/Seller/SellerDashboard';
import AddItems from './Components/Seller/AddItem/AddItems';
import DisplayProduct from './Components/Custemer/DisplayProducts/DisplayProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainDashBoard />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/additems" element={<AddItems />} />
        <Route path="/products" element={<DisplayProduct/>} />

      </Routes>
    </Router>
  );
}

export default App;