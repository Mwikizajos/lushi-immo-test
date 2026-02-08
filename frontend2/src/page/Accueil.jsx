import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios"; // On utilise ta config axios
import "./Accueil.css";

function Accueil() {
  const [recents, setRecents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecents = async () => {
      try {
        const response = await api.get("/appartements");
        // On prend les 3 derniers pour ne pas encombrer l'accueil
        const top3 = response.data.slice(0, 3);
        setRecents(top3);
        setLoading(false);
      } catch (error) {
        console.error("Erreur Accueil:", error);
        setLoading(false);
      }
    };
    fetchRecents();
  }, []);

  return (
    <div className="home-wrapper">
      {/* HERO SECTION : L'impact visuel */}
      <section className="hero-modern">
        <div className="hero-content">
          <span className="tagline">L'immobilier de prestige à Lubumbashi</span>
          <h1>Trouvez l'appartement <br/> qui vous <span className="highlight">ressemble</span></h1>
          <p>La première plateforme de gestion immobilière digitalisée dans le Haut-Katanga.</p>
          <div className="hero-actions">
            <Link to="/appartements" className="btn-main">Découvrir les biens</Link>
            <Link to="/According" className="btn-secondary">Qui sommes-nous ?</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="main-img-card">
             <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" alt="Lushi Home" />
             <div className="floating-badge">Qualité Garantie ✅</div>
          </div>
        </div>
      </section>

      {/* SECTION DYNAMIQUE : Les derniers appartements du Backend */}
      <section className="recent-listings">
        <div className="section-title-area">
          <h2>Nos dernières opportunités</h2>
          <Link to="/appartements" className="see-all">Voir tout →</Link>
        </div>

        {loading ? (
          <div className="loading-state">Recherche des meilleures offres...</div>
         ) : (
          <div className="cards-grid">
            {recents.map((ap) => (
              <div className="home-card" key={ap._id}>
                <div className="card-media">
                  <img 
                    src={ap.images && ap.images.length > 0 
                      ? `https://lushi-backend.onrender.com/${ap.images[0]}` 
                      : "https://via.placeholder.com/300"} 
                    alt={ap.numero} 
                  />
                  <div className="price-overlay">{ap.prix} {ap.devise}</div>
                </div>
                <div className="card-details">
                  <h3>Appartement {ap.numero}</h3>
                  <p>📍 Lubumbashi, RDC</p>
                  <Link to={`/appartements/${ap._id}`} className="btn-details">
                    Consulter
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Accueil;