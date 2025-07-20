import React, { useState } from "react";
import axios from "axios";
import { MainNav } from "../components/nav"; 
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  
  const bgImage = `${process.env.PUBLIC_URL}/background.png`;

  const containerStyle = {
    maxWidth: "800px", 
    width: "90%", 
    padding: "50px 20px",
    boxSizing: "border-box",
    animation: "fadeIn 0.3s ease-in-out",
  };

  const homeStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    display: "flex", 
    justifyContent: "center",
    alignItems: "center",
  };

 // Form container style
const formStyle = {
    marginLeft: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    marginTop: "170px",
    backgroundColor: "#044b4d6c",
    borderRadius: "10px",
    padding: "20px",
    width: "100%",
    maxWidth: "500px", 
    textAlign: "left", 
};

const headingStyle = {
    fontFamily: '"Abril Fatface", sans-serif',
    fontSize: "2.5em",
    textAlign: "center",
    color: "#f8f4eb",
    backgroundColor: "#044b4d",
    padding: "15px 40px",
    borderRadius: "50px",
    position: "absolute",
    top: "20%", 
    left: "50%",
    transform: "translate(-50%, -50%)", 
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
    textAlign: "center",
    width: "100px",
    padding: "10px",
    marginLeft: "40%",
    marginTop: "20px",
  };

  

  const handleLogin = async (event) => {
    event.preventDefault(); 

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        username,
        password,
      });

      if (res.data.message === "Login successful") {
        alert("Login success!");
        localStorage.setItem("currentUser", JSON.stringify({ username })); //i wanna let the username be saved tho
        navigate("/shop");
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };



  return (
    <>
    <MainNav />
        <div style={homeStyle}>
            <div style={containerStyle}>
                
            <h1 style={headingStyle}>Login</h1>
                <form onSubmit={handleLogin} style={formStyle}>
                <input style={commonInputStyle} value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                <input style={commonInputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                
                <button type="submit" style={buttonStyle}>Login now</button>

                </form>

            </div>
        </div>
    </>
  );
};
