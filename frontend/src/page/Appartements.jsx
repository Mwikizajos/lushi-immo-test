import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Appartements.css";

function Appartements() {
  const [appartements, setAppartements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApparts = async () => {
      try {
        const response = await api.get("/appartements");
        setAppartements(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération:", error);
        setLoading(false);
      }
    };
    fetchApparts();
  }, []);

  if (loading) return (
    <div className="loader-container">
      <div className="loader-lushi"></div>
      <p>Recherche des meilleurs appartements à Lubumbashi...</p>
    </div>
  );

  return (
    <div className="appartement-page">
      <div className="page-intro">
        <h2>Nos Appartements</h2>
        <div className="orange-divider"></div>
        <p>Trouvez le confort que vous méritez dans le Haut-Katanga.</p>
      </div>

      <div className="appartement-grid">
        {appartements.length > 0 ? (
          appartements.map((ap) => (
            <div className="appartement-card" key={ap._id}>
              <div className="image-wrapper">
                <img 
                  src={ap.images && ap.images.length > 0 
                    ? `https://lushi-backend.onrender.com/${ap.images[0]}` 
                    : "https://via.placeholder.com/400x300"} 
                  alt={ap.numero} 
                  className="appartement-img" 
                />
                <div className="price-tag">{ap.prix} {ap.devise}</div>
              </div>
              
              <div className="appartement-details">
                <h3>Appartement {ap.numero}</h3>
                <p className="app-desc">
                  {ap.description ? `${ap.description.substring(0, 65)}...` : "Luxueux appartement situé dans un quartier calme."}
                </p>
                <Link to={`/appartements/${ap._id}`} className="btn-details">
                  Voir les détails
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>Désolé, aucun appartement n'est disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Appartements;