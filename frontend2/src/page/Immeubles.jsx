import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Immeubles.css";

function Immeuble() {
  const [immeubles, setImmeubles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction magique pour gérer Cloudinary vs Ancien Stockage
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300";
    
    // Si l'image commence par http, c'est du Cloudinary
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    
    // Sinon, c'veut dire que c'est l'ancien chemin relatif (ex: uploads/image.jpg)
    return `https://lushi-backend.onrender.com/${imagePath}`;
  };

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
    fetchAppartements(); // Je te conseille de vérifier si cette fonction n'est pas fetchImmeubles()
    fetchImmeubles();
  }, []);

  if (loading) return (
    <div className="loader-container">
      <div className="loader-lushi"></div> {/* Utilisation de ton loader personnalisé */}
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
                  src={getImageUrl(im.image)} // MODIFICATION ICI
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
                <Link to={`/immeubles/${im._id}`} className="voir-plus-btn">
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