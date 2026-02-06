// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding, FaHome, FaUsers, FaSignOutAlt, FaPlus,
  FaChartLine, FaUserCircle
} from "react-icons/fa";
import api from "../api/axios";
import "./Dashboard.css";

// Imports des composants Admin
import AddImmeuble from "./Admin/AddImmeuble";
import AddProprietaire from "./Admin/AddProprietaire";
import AddAppartement from "./Admin/AddAppartement";
import GestImmeuble from "./Admin/GestImmeuble";
import GestProprietaire from "./Admin/GestProprio";
import GestAppartement from "./Admin/GestAppartement";

// Composant Statistique Générique (plus propre)
const StatCardContent = ({ endpoint, label }) => {
  const [count, setCount] = useState("--");
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get(endpoint);
        setCount(data.nombreTotal ?? 0);
      } catch (err) { console.error(`Erreur ${label}:`, err); }
    };
    fetchStats();
  }, [endpoint, label]);

  return (
    <div className="stat-content">
      <h3>{count}</h3>
      <p>{label}</p>
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const adminData = JSON.parse(localStorage.getItem("adminUser")) || { name: "Admin" };
  
  const [activeView, setActiveView] = useState("overview");
  // Regroupement des modals pour plus de clarté
  const [modals, setModals] = useState({ immeuble: false, proprio: false, appart: false });

  const toggleModal = (name, state) => setModals(prev => ({ ...prev, [name]: state }));

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">🏢</div>
            <h2>Lushi Immo</h2>
          </div>
          <div className="admin-profile">
            <FaUserCircle size={40} className="avatar-icon" />
            <div className="admin-info">
              <h4>{adminData.name}</h4>
              <p className="role">Administrateur</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button className={activeView === "overview" ? "active" : ""} onClick={() => setActiveView("overview")}>
            <FaChartLine /> <span>Tableau de Bord</span>
          </button>
          <button className={activeView === "buildings" ? "active" : ""} onClick={() => setActiveView("buildings")}>
            <FaBuilding /> <span>Immeubles</span>
          </button>
          <button className={activeView === "apartments" ? "active" : ""} onClick={() => setActiveView("apartments")}>
            <FaHome /> <span>Appartements</span>
          </button>
          <button className={activeView === "proprietaire" ? "active" : ""} onClick={() => setActiveView("proprietaire")}>
            <FaUsers /> <span>Propriétaires</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-left">
            <h1>{activeView === "overview" ? "Vue d'ensemble" : activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
            <p className="welcome-text">Ravi de vous revoir, {adminData.name}</p>
          </div>
        </header>

        {activeView === "overview" && (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon building"><FaBuilding /></div>
                <StatCardContent endpoint="/immeubles/count" label="Immeubles" />
              </div>
              <div className="stat-card">
                <div className="stat-icon apartment"><FaHome /></div>
                <StatCardContent endpoint="/appartements/count" label="Appartements" />
              </div>
              <div className="stat-card">
                <div className="stat-icon owner"><FaUsers /></div>
                <StatCardContent endpoint="/proprietaires/count" label="Propriétaires" />
              </div>
            </section>

            <div className="quick-actions">
              <h3>Actions Rapides</h3>
              <div className="actions-grid">
                <button className="action-btn" onClick={() => toggleModal('immeuble', true)}>
                  <div className="action-icon"><FaPlus /></div>
                  <span>Ajouter Immeuble</span>
                </button>
                <button className="action-btn" onClick={() => toggleModal('appart', true)}>
                  <div className="action-icon"><FaHome /></div>
                  <span>Ajouter Appartement</span>
                </button>
                <button className="action-btn" onClick={() => toggleModal('proprio', true)}>
                  <div className="action-icon"><FaUsers /></div>
                  <span>Nouveau Propriétaire</span>
                </button>
              </div>
            </div>
          </>
        )}

        <div className="view-container">
          {activeView === "buildings" && <GestImmeuble />}
          {activeView === "apartments" && <GestAppartement />}
          {activeView === "proprietaire" && <GestProprietaire />}
        </div>

        {/* Modals */}
        <AddImmeuble isOpen={modals.immeuble} onClose={() => toggleModal('immeuble', false)} />
        <AddProprietaire isOpen={modals.proprio} onClose={() => toggleModal('proprio', false)} />
        <AddAppartement isOpen={modals.appart} onClose={() => toggleModal('appart', false)} />
      </main>
    </div>
  );
}

export default Dashboard;