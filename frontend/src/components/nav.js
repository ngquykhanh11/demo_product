// src/components/nav.jsx
import { Link } from "react-router-dom";
import "../styles/nav.css";
import { Sidebar } from "./sidebar";
import { useState } from "react";

const LogoWeb = "/logo1.png";

const MainNav = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <nav id="main-nav">
        <p id="logo">
          <img
            className="logoweb"
            src={LogoWeb}
            alt="Intro tho"
            onClick={() => setShowSidebar(true)}
            style={{ cursor: "pointer" }}
          />
        </p>

        <p className="nav-hover"><Link to="/login">Login</Link></p>
        <p className="nav-hover"><Link to="/shop">Shop</Link></p>

        <Link to="/create-wallet" id="create-wallet">
          Connect Wallet
        </Link>
      </nav>

      {/* Sidebar is always rendered, shown based on `showSidebar` */}
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  );
};

export { MainNav };
