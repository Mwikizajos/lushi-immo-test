import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import "./AppartementsDetails.css";

function AppartementDetail() {
  const { id } = useParams();
  const [appartement, setAppartement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [indexImage, setIndexImage] = useState(0);

  // Fonction pour gérer l'affichage intelligent de l'image (Cloudinary vs Local)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/600x400";
    if (imagePath.startsWith("http")) return imagePath; // Cloudinary
    return `https://lushi-backend.onrender.com/${imagePath}`; // Ancien système
  };

  useEffect(() => {
    const fetchAppartement = async () => {
      try {
        const response = await api.get(`/appartements/${id}`);
        setAppartement(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Appartement introuvable");
        setLoading(false);
      }
    };
    fetchAppartement();
  }, [id]);

  useEffect(() => {
    if (appartement && appartement.images && appartement.images.length > 0) {
      const interval = setInterval(() => {
        setIndexImage((prev) =>
          prev === appartement.images.length - 1 ? 0 : prev + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [appartement]);

  if (loading) return (
    <div className="loader-container">
       <div className="loader-lushi"></div>
       <p>Chargement des détails...</p>
    </div>
  );

  if (error || !appartement) return <div className="error">Erreur : {error || "Introuvable"}</div>;

  return (
    <div className="detail-page-wrapper">
      <div className="detail-header">
        <h1>Appartement {appartement.numero || "Standing"}</h1>
        <div className="status-badge">
          <span className={appartement.statut === 'disponible' ? "dispo" : "indispo"}>
            {appartement.statut === 'disponible' ? "● Disponible" : "● Indisponible"}
          </span>
        </div>
      </div>

      <div className="detail-content-grid">
        <div className="gallery-section">
          {appartement.images && appartement.images.length > 0 ? (
            <>
              <div className="slider-main">
                <button className="slider-arrow prev" onClick={() => setIndexImage((prev) =>
                  prev === 0 ? appartement.images.length - 1 : prev - 1
                )}>❮</button>

                {/* MODIFICATION ICI : Utilisation de getImageUrl */}
                <img
                  src={getImageUrl(appartement.images[indexImage])}
                  alt={`Vue ${indexImage + 1}`}
                  className="main-display-img"
                />

                <button className="slider-arrow next" onClick={() => setIndexImage((prev) =>
                  prev === appartement.images.length - 1 ? 0 : prev + 1
                )}>❯</button>
              </div>

              <div className="thumbnails-container">
                {appartement.images.map((img, i) => (
                  <img
                    key={i}
                    src={getImageUrl(img)} // MODIFICATION ICI AUSSI
                    alt={`miniature ${i}`}
                    className={`thumb-img ${indexImage === i ? "active" : ""}`}
                    onClick={() => setIndexImage(i)}
                  />
                ))}
              </div>
            </>
          ) : (
            <img src="https://via.placeholder.com/600x400" alt="Vide" className="main-display-img" />
          )}
        </div>

        <div className="specs-section">
          <div className="price-box">
             <span className="price-label">Prix de location</span>
             <h2 className="price-value">{appartement.prix} {appartement.devise}<span>/mois</span></h2>
          </div>

          <div className="specs-list">
            <div className="spec-item"><strong>Type</strong> <span>{appartement.type || "Appartement"}</span></div>
            <div className="spec-item"><strong>Étage</strong> <span>{appartement.etage || "N/A"}</span></div>
            <div className="spec-item"><strong>Ville</strong> <span>Lubumbashi</span></div>
          </div>

          <div className="description-box">
            <h3>Description</h3>
            <p>{appartement.description || "Pas de description."}</p>
          </div>

          <div className="action-buttons">
            <button className="btn-contact-main" onClick={() => window.open(`https://wa.me/243975477341?text=Je suis intéressé par l'appartement ${appartement.numero}`, '_blank')}>
                Contacter sur WhatsApp
            </button>
            <Link to="/Appartements" className="link-back">← Retour aux annonces</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppartementDetail;