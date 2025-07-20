import React, { useEffect, useState } from "react";
import { MainNav } from "../components/nav"; 
import axios from "axios";
import { Link } from "react-router-dom";

const Shop = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/products")
            .then(res => {
                console.log("DATA FROM API:", res.data);
                setProducts(Array.isArray(res.data.content) ? res.data.content : []);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setProducts([]);
            });
    }, []);


    const filteredProducts = products.filter((product) => {
        const matchSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory === "All" || product.category === selectedCategory;
        return matchSearch && matchCategory;
    });

    const bgImage = `${process.env.PUBLIC_URL}/background.png`;

    // ... style definitions giữ nguyên ...

    return (
        <>
            <MainNav />
            <div id="shop-container" style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                minHeight: "100vh",
            }}>
                {/* Header + Search & Category */}
                <div style={{
                    position: "absolute",
                    top: "90px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80%",
                    background: "rgba(188, 222, 214, 0.9)",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    textAlign: "center",
                }} id="header-container">
                    <h1>SHOPPING WITH US</h1>
                    <div style={{
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px"
                    }}>
                        <input
                            type="text"
                            placeholder="Search for product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: "10px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                width: "200px"
                            }}
                        />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{
                                padding: "10px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                width: "200px",
                            }}
                        >
                            <option value="All">All Categories</option>
                            <option value="Vegetable">Vegetable</option>
                            <option value="Tree">Tree</option>
                            <option value="Agriculture products">Agriculture products</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Product List */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginTop: "290px",
                }}>
                    {filteredProducts.map((product) => (
                        <div key={product.id} style={{
                            background: "rgba(255, 255, 255, 0.8)",
                            margin: "10px",
                            padding: "20px",
                            borderRadius: "10px",
                            textAlign: "left",
                            width: "300px",
                            position: "relative",
                        }}>
                            <img src={product.img} alt={product.name} style={{
                                width: "100%",
                                height: "200px",
                                maxHeight: "200px",
                                display: "block",
                                objectFit: "cover",
                                borderRadius: "10px"
                            }} />
                            <h4>{product.name?.toUpperCase()}</h4>
                            <p>{product.price} {product.currency}</p>
                            <p>Quantity: {product.quantity}</p>
                            <p>Asset Type: {product.assetType}</p>
                            <p>By: {product.owner}</p>
                            <Link
                                style={{
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
                                }}
                                to={`/details/${product.id}`}
                            >
                                Details
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export { Shop };
