import { Link } from 'react-router-dom';
import '../Styles/ProductCard.css'; // Import the CSS file

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>Price: LKR {product.price}</p>
      <p>{product.description}</p>
      <Link to={`/products/${product._id}`} className="view-details-link">
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
