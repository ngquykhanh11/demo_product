import React, { useEffect, useState } from "react";
import axios from "axios";
import { MainNav } from "../components/nav";

export const MyProduct = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        const res = await axios.get(`http://localhost:8000/api/my-products/${currentUser.username}`);
        setProducts(res.data.content);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchMyProducts();
  }, []);

  const handleEdit = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:8000/api/product/${id}`, null, {
        params: { column: editField, new_value: editValue },
      });
      alert(res.data.message);
      window.location.reload(); // refresh to see change
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  const bgImage = `${process.env.PUBLIC_URL}/background.png`;

  return (
    <>
      <MainNav />
      <div style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        paddingTop: "120px"
      }}>
        <h1 style={{
          textAlign: "center",
          background: "rgba(188, 222, 214, 0.9)",
          margin: "0 auto",
          width: "fit-content",
          padding: "20px 40px",
          borderRadius: "10px"
        }}>MY PRODUCTS</h1>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "40px",
        }}>
          {products.map((product) => (
            <div key={product.id} style={{
              background: "rgba(255, 255, 255, 0.85)",
              margin: "10px",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
              position: "relative"
            }}>
              <img src={product.img} alt={product.name} style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "10px"
              }} />
              <h4>{product.name?.toUpperCase()}</h4>
              <p>{product.price} {product.currency}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Asset Type: {product.assetType}</p>
              <p>By: {product.owner}</p>

              {editingId === product.id ? (
                <>
                  <select
                    onChange={(e) => setEditField(e.target.value)}
                    value={editField}
                    style={{ width: "100%", marginTop: "10px" }}
                  >
                    <option value="">Select field</option>
                    <option value="name">Name</option>
                    <option value="description">Description</option>
                    <option value="price">Price</option>
                    <option value="category">Category</option>
                  </select>
                  <input
                    type="text"
                    placeholder="New value"
                    onChange={(e) => setEditValue(e.target.value)}
                    value={editValue}
                    style={{ width: "100%", marginTop: "5px" }}
                  />
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px"
                  }}>
                    <button onClick={() => handleEdit(product.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <button onClick={() => setEditingId(product.id)} style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  backgroundColor: "rgba(188, 222, 214, 0.9)",
                  color: "black",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  boxShadow: "3px 3px 8px rgba(0, 0, 0, 0.3)"
                }}>
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
