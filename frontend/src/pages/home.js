import React from "react";
import { MainNav } from "../components/nav"; 
import "../styles/home.css"

{/*I add some parts of the css into this bc idk why all in css so lag and even effect on other pages */}
const Home = () => {

  const bgImage = `${process.env.PUBLIC_URL}/background.png`;

  const homeStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    
  };

  const introImageStyle = {
    width: "750px",
    height: "750px",
    alignItems: "bottom",
    marginTop: "100px",
    borderRadius: "100%",
    border: "10px solid #095a5d",
    boxShadow: "30px 8px 20px rgba(109, 98, 49, 0.4)",
    clipPath: "ellipse(100% 75% at center)"
  };


  {/*the main part */}

  return (
    <>
      <MainNav />
      <div id="home-container" style={homeStyle}>
        
        <div id="header">
          <h1 style={{ fontFamily: '"Abril Fatface", sans-serif' }}>HAPPY FARMING</h1>
        </div>

        <div id="description-intro">
          <p style={{ margin: 0 }}>Fresh, new, clean products always here for you</p>
        </div>

        <div className="image-wrapper">
          <img id="intro-image" style={introImageStyle} src={`${process.env.PUBLIC_URL}/intro.png`} alt="Intro tho" />
        </div>

      </div>
    </>
  );
};

export { Home };