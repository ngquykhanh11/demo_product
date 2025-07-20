import { Link } from "react-router-dom";
import "../styles/sidebar.css";
import Footer from "./footer";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <p><Link to="/" onClick={onClose}>Home</Link></p>
        <p><Link to="/shop" onClick={onClose}>Shop</Link></p>
        <p><Link to="/create-product" onClick={onClose}>Create new product</Link></p>
        <p><Link to="/trans-history" onClick={onClose}>Transaction history</Link></p>
        <p><Link to="/my-product" onClick={onClose}>My Product</Link></p>

        
        <div className="sidebar-footer">
          <Footer />
        </div>
      </div>

      {isOpen && <div className="overlay" onClick={onClose}></div>}
    </>
  );
};

export { Sidebar };
