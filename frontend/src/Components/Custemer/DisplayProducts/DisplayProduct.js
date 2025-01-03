import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import './displayproduct.css';

const URL = "http://localhost:5000/api/products";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function DisplayProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setProducts(data.products));
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Product Report",
    onAfterPrint: () => alert("Printing completed"),
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredProducts = data.products.filter((product) =>
        Object.values(product).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setProducts(filteredProducts);
      setNoResults(filteredProducts.length === 0);
    });
  };

  const handleSendReport = async () => {
    const phoneNumber = "1234567890"; 
    const message = "Hello, here is the product report";
    const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    window.open(WhatsAppUrl, "_blank");
  };

  return (
    <div className="product-list">
      <h1>Product Details Page</h1>
      <input type="text" name="search" onChange={(e) => setSearchQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      {noResults ? (
        <div>
          <p>No results found</p>
        </div>
      ) : (
        <div ref={componentRef}>
          {products &&
            products.map((product, index) => (
              <div key={index} className="product-item">
                <h2>{product.productName}</h2>
                <p>Category: {product.category}</p>
                <p>Price: ${product.price}</p>
                <div className="product-images">
                  {product.images.map((image, index) => (
                    <img key={index} src={image} alt={product.productName} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
      <br />
      <button onClick={handlePrint}>Download Report</button>
      <br />
      <button onClick={handleSendReport}>Send Report</button>
    </div>
  );
}

export default DisplayProduct;