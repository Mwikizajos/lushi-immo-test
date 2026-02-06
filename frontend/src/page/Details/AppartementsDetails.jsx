import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import "./AppartementsDetails.css";

function AppartementDetail() {
  // 1. CES LIGNES SONT INDISPENSABLES (Elles définissent les variables "soulignées")
  const { id } = useParams();
  const [appartement, setAppartement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [indexImage, setIndexImage] = useState(0);

  // 2. Récupération des données depuis ton API
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

  // 3. Gestion du Slider automatique
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

  // 4. Gestion des états de chargement
  if (loading) return <div className="loader">Chargement...</div>;
  if (error || !appartement) return <div className="error">Erreur : {error || "Introuvable"}</div>;

  // 5. LE RENDU (Le visuel que je t'ai donné avant)
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

                <img
                  src={`https://lushi-backend.onrender.com/${appartement.images[indexImage]}`}
                  alt="Vue"
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
                    src={`https://lushi-backend.onrender.com/${img}`}
                    alt="mini"
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
            <button className="btn-contact-main" onClick={() => window.open(` https://wa.me/243975477341?text=Je suis intéressé par l'appartement ${appartement.numero}`, '_blank')}>
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