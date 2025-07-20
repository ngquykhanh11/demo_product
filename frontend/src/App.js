import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home"; 
import { Shop } from "./pages/shop"; 
import { CreateProduct } from "./pages/create_product";
import Wallet from "./pages/wallet";
import { Detail } from "./pages/details";
import {TransactionHistory} from "./pages/trans_history";
import { Login } from "./pages/login";
import connectContract from "./blockchain/service";
import { MyProduct } from "./pages/my_product";



function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/create-wallet" element={<Wallet />} />
          <Route path="/details/:id" element={<Detail />} />
          <Route path="/trans-history" element={<TransactionHistory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blockchain-service" element={<connectContract />} />
          <Route path="/my-product" element={<MyProduct />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;