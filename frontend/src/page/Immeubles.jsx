import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Immeubles.css";

function Immeuble() {
  const [immeubles, setImmeubles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImmeubles = async () => {
      try {
        const response = await api.get("/immeubles");
        setImmeubles(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des immeubles:", error);
        setLoading(false);
      }
    };
    fetchImmeubles();
  }, []);

  if (loading) return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p>Chargement des immeubles de Lushi...</p>
    </div>
  );

  return (
    <div className="immeuble-page">
      <div className="page-header">
        <h2>Immeubles Disponibles</h2>
        <p>Découvrez nos bâtiments de prestige à travers Lubumbashi</p>
        <div className="header-line"></div>
      </div>

      <div className="immeuble-container">
        {immeubles.length > 0 ? (
          immeubles.map((im) => (
            <div className="immeuble-card" key={im._id}>
              <div className="card-image-box" >
                <img
                  src={im.image ? `https://lushi-backend.onrender.com/${im.image}`: "https://via.placeholder.com/400x300" }
                  alt={im.name}
                  className="immeuble-image"
                />
                <div className="location-tag">📍 {im.adress || "Lubumbashi"}</div>
              </div>
              <div className="card-content">
                <h3>{im.name}</h3>
                <p className="desc-text">
                  {im.description ? im.description.substring(0, 60) + "..." : "Aucune description disponible"}
                </p>
                <Link to={`/immeubles/${im._id} `} className="voir-plus-btn">
                  Voir l'immeuble
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">Aucun immeuble trouvé pour le moment.</div>
        )}
      </div>
    </div>
  );
}

export default Immeuble;