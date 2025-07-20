import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainNav } from "../components/nav";
import axios from "axios";
import "../styles/details.css";
import { BrowserProvider, Contract, parseUnits } from "ethers";

const contractAddress = "0x23fAC5155570Af04Bac10BF1b1a6Edd39c98d900";
const contractABI = [ 
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "createProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			}
		],
		"name": "FarmCreated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "productCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
 ];  //my ABI bros

const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("1");

  const bgImage = `${process.env.PUBLIC_URL}/background.png`;
  const pageStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    width: "100vw",
  };
  const headerContainerStyle = {
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
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(res.data.content);
      } catch (err) {
        setProduct(null);
      }
    }
    fetchProduct();
  }, [id]);

  const handleBuyClick = () => {
    handleConfirm();
  };

  const handleConfirm = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);
      
      // Convert price to wei uh....
      const priceInWei = parseUnits(product.price.toString(), "ether");

      // Call smart contract
      const tx = await contract.createProduct(product.name, priceInWei);
      await tx.wait();

      // Save transaction locally
      const transaction = {
        name: product.name,
        deducted: `- ${parseFloat(product.price) * parseInt(quantity || 1)} ${product.currency}`,
        img: product.img,
        quantity,
        timestamp: new Date().toISOString(),
        id: Date.now(),
        status: "Purchased",
      };

      const oldHistory = JSON.parse(localStorage.getItem("transactionHistory") || "[]");
      oldHistory.unshift(transaction);
      localStorage.setItem("transactionHistory", JSON.stringify(oldHistory));

      alert(`You have bought ${product.name} successfully!`);
      alert(`Payment confirmed. ${transaction.deducted} has been deducted.`);

    } catch (err) {
      console.error("Transaction failed", err);
      alert("Transaction failed: " + (err.message || "Unknown error"));
    }
  };



  if (!product) {
    return <div style={{ color: "#888", padding: "60px 0 0 60px" }}>Loading...</div>;
  }

  return (
    <>
      <MainNav />
      <div id="shop-container" style={pageStyle}>
        <div style={headerContainerStyle} id="header-container">
          <h1>DETAIL OF PRODUCT: {product.name && product.name.toUpperCase()}</h1>
        </div>
        <div className="product-container">
          <div className="img-container">
            <img src={product.img} alt={product.name} className="product-img" />
          </div>
          <div className="details-container">
            <h1>{product.name && product.name.toUpperCase()}</h1>
            {product.contractAddress && <p>Contract Address: {product.contractAddress}</p>}
            {product.tokenId && <p>Token ID: {product.tokenId}</p>}
            <p>{product.description}</p>
            <p>Category: {product.category}</p>
            <br />
            <h2>{product.price} {product.currency}</h2>
            <br />
            <label>Quantity:</label>
            <br />
            <input
              type="number"
              placeholder="Enter amount"
              value={quantity}
              min="1"
              max={product.quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input-style"
              required
            />
            <button className="buy-button" onClick={handleBuyClick}>Buy</button>
          </div>
        </div>
      </div>
    </>

  );
};

export { Detail };
