import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // État pour le menu mobile
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("adminUser");

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/");
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="nav">
      <div className="nav-logo">
        <h1 className="logo1">Lushi<span>Immo</span></h1>
      </div>

      {/* Icône Burger pour Mobile */}
      <div className={`hamburger ${isOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <div className={`Nav-links ${isOpen ? "open" : ""}`}>
        <ul>
          <li><Link to="/Accueil" onClick={() => setIsOpen(false)}>Accueil</Link></li>
          <li><Link to="/Appartements" onClick={() => setIsOpen(false)}>Appartements</Link></li>
          <li><Link to="/immeubles" onClick={() => setIsOpen(false)}>Immeubles</Link></li>
          <li><Link to="/According" onClick={() => setIsOpen(false)}>À propos</Link></li>
          {isAdmin ? (
            <>
              <li><Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
              <li><button onClick={handleLogout} className="logout-btn">Déconnexion</button></li>
            </>
          ) : (
            <li><Link to="/Login" className="login-btn-nav" onClick={() => setIsOpen(false)}>Connexion</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;