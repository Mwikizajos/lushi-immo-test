import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import "./ImmeublesDetails.css";

function ImmeubleDetail() {
  const { id } = useParams();
  const [immeuble, setImmeuble] = useState(null);
  const [appartements, setAppartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction hybride pour gérer l'affichage Cloudinary vs Ancien Dossier Render
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/1200x500";
    if (imagePath.startsWith("http")) return imagePath; // Cloudinary
    return `https://lushi-backend.onrender.com/${imagePath}`; // Ancien système
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const immeubleRes = await api.get(`/immeubles/${id}`);
        setImmeuble(immeubleRes.data);

        const appartRes = await api.get(`/appartements/immeuble/${id}`);
        setAppartements(appartRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError("Erreur lors du chargement des données");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="loader-container">
      <div className="loader-lushi"></div>
      <p>Chargement des détails de l'immeuble...</p>
    </div>
  );

  if (error || !immeuble) return (
    <div className="error-screen">
      <h2>{error || "Immeuble introuvable"}</h2>
      <Link to="/immeubles">Retour</Link>
    </div>
  );

  return (
    <div className="immeuble-detail-page">
      {/* Header avec Image Hero */}
      <div className="detail-hero">
        <img
          src={getImageUrl(immeuble.image)} // MODIFICATION ICI
          alt={immeuble.name}
          className="hero-img"
        />
        <div className="hero-overlay">
           <h1>{immeuble.name}</h1>
           <p className="hero-loc">📍 {immeuble.adress}</p>
        </div>
      </div>

      <div className="content-wrapper">
        <section className="info-section">
          <div className="info-card">
            <h3>À propos de cet immeuble</h3>
            <p className="description">
              {immeuble.description || "Aucune description disponible pour cet immeuble à Lubumbashi."}
            </p>
            <Link to="/immeubles" className="btn-back">⬅ Voir tous les immeubles</Link>
          </div>
        </section>

        <section className="listing-section">
          <h2>Appartements disponibles</h2>
          <div className="header-line-small"></div>

          <div className="appart-grid">
            {appartements.length > 0 ? (
              appartements.map((app) => (
                <div className="minimal-app-card" key={app._id}>
                  <div className="app-img-container" >
                    <img
                      // MODIFICATION ICI AUSSI pour les appartements de la grille
                      src={app.images && app.images.length > 0 
                        ? getImageUrl(app.images[0]) 
                        : "https://via.placeholder.com/300"}
                      alt={app.numero}
                    />
                    <div className="app-price">{app.prix} {app.devise}</div>
                  </div>
                  <div className="app-info">
                    <h4>Appartement {app.numero || "N/A"}</h4>
                    <p>{app.type || "Studio / Appartement"}</p>
                    <Link to={`/Appartements/${app._id}`} className="btn-explore"> Détails</Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-msg">Aucun appartement disponible actuellement dans ce bâtiment.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ImmeubleDetail;