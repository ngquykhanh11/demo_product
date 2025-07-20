
import "../styles/create_product.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainNav } from "../components/nav";
import axios from "axios";

const CreateProduct = () => {

  const bgImage = `${process.env.PUBLIC_URL}/background1.png`;

  // Page background that covers the entire window
  const pageStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start", 
    alignItems: "center",
    paddingTop: "30px", 
};


  // Container style (replacing #create-product-page)
  const containerStyle = {
    maxWidth: "800px", 
    width: "90%", 
    padding: "50px 20px",
    boxSizing: "border-box",
    animation: "fadeIn 0.3s ease-in-out",
};



  const headingStyle = {
    fontFamily: '"Abril Fatface", sans-serif',
    fontSize: "2.5em",
    textAlign: "center",
    color: "#044b4d",
    backgroundColor: "#f8f4eb",
    padding: "15px 40px",
    borderRadius: "50px",
    position: "absolute",
    top: "20%", 
    left: "50%",
    transform: "translate(-50%, -50%)", 
};


  // Form container style
const formStyle = {
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    marginTop: "170px",
    backgroundColor: "#f8f4eb8e",
    borderRadius: "10px",
    padding: "20px",
    width: "100%",
    maxWidth: "500px", 
    textAlign: "left", 
};



  const commonInputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    margin: "5px",
  };

  // Submit button style (for #create-product)
  const buttonStyle = {
    color: "black",
    backgroundColor: "#f0f2ab",
    borderRadius: "10px",
    border: "olive",
    width: "100%",
    padding: "10px",
    margin: "5px",
  };



    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Animal");
    const [quantity, setQuantity] = useState("1");
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const username = currentUser.username || "";


    // Handle image upload and preview
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result); 
        reader.readAsDataURL(file);
        }
    };



    // Confirm the process: save product and navigate to shop
    const handleFormSubmit = (e) => {
      e.preventDefault();

      const newProduct = {
        name: productName.trim(),
        price: Number(price) || 0,
        currency,
        img: image || "",
        description: description.trim() || "No description available",
        category: category || "Other",
        quantity: Number(quantity) || 1,
        assetType: "NFT",
        owner: username,           
        creator: username,         
        tradeable: true,
        tokenId: "",
        contractAddress: ""
      };

      axios.post("http://localhost:8000/api/create", newProduct)
        .then(res => {
          alert("Product created! Happy farming!");
          navigate("/shop");
        })
        .catch(err => {
          alert("Error creating product: " + (err.response?.data?.detail || err.message));
        });
    };




  return (
    <>
    <MainNav />
    <div style={pageStyle}>
      <div id="create-product-page" style={containerStyle}>
        <h1 style={headingStyle} id="heading-container">CREATE NEW PRODUCT</h1>
        
        <form onSubmit={handleFormSubmit} style={formStyle} id="create-product-form">
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={commonInputStyle}
            required
          />

          <label>Price:</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={commonInputStyle}
            required
          />

          <label>Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={commonInputStyle}
          >
            <option value="USD">$ - USD</option>
            <option value="EUR">€ - EUR</option>
            <option value="VND">₫ - VND</option>
            <option value="JPY">¥ - JPY</option>
          </select>

          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={commonInputStyle}
            required
          />

          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={commonInputStyle}
          >
            <option value="Animal">Animal</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Tree">Tree</option>
            <option value="Agriculture products">Agriculture products</option>
            <option value="Other">Other</option>
          </select>

          <label>Quantity:</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={commonInputStyle}
            required
          />

          <label>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={commonInputStyle}
          />

          {image && (
            <img
              src={image}
              alt="Uploaded Preview"
              style={{ width: "100%", margin: "5px", borderRadius: "5px" }}
            />
          )}

          <input
            type="submit"
            id="create-product"
            value="Create Product"
            style={buttonStyle}
          />
        </form>

      </div>
    </div>
    </>
  );
};

export { CreateProduct };