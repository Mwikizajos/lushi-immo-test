import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom" ;
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Immeuble from "./page/Immeubles.jsx";
import ImmeubleDetail from "./page/Details/ImmeublesDetails.jsx" ;
import Appartement from "./page/Appartements.jsx";
import According from "./page/According.jsx";
import Accueil from "./page/Accueil.jsx";
import AppartementDetail from "./page/Details/AppartementsDetails.jsx";
import Login from "./page/Login.jsx";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer.jsx"; // 1. Importation du Footer
// ... tes autres imports ...

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("adminUser"); 
  return isAdmin ? children : <Navigate replace to="/Login" /> ;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* 2. On simplifie la route Accueil pour éviter les doublons de titres */}
          <Route path="/Accueil" element={<Accueil />} />
          <Route path="/" element={<Navigate to="/Accueil" />} /> {/* Redirection auto */}
          
          <Route path="/immeubles" element={<Immeuble />} />
          <Route path="/immeubles/:id" element={<ImmeubleDetail />} />
          <Route path="/Appartements" element={<Appartement />} />
          <Route path="/Appartements/:id" element={<AppartementDetail />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/According" element={<According />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Footer /> {/* 3. Le Footer est ici, il sera sur toutes les pages ! */}
      </div>
    </Router>
  );
}

export default App;