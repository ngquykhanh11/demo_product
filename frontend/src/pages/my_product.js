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
      window.location.reload(); // reload after edit
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <>
      <MainNav />
      <div style={{ padding: "40px" }}>
        <h1>My Products</h1>
        {products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ccc", padding: "15px", margin: "10px" }}>
            <h3>{product.name}</h3>
            <p>Description: {product.description}</p>
            <p>Price: {product.price}</p>
            <p>Category: {product.category}</p>

            {editingId === product.id ? (
              <>
                <select onChange={(e) => setEditField(e.target.value)} value={editField}>
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
                />
                <button onClick={() => handleEdit(product.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditingId(product.id)}>Edit</button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
