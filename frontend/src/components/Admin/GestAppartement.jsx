import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import "./GestAppartement.css";
import AddAppartement from "./AddAppartement";

const GestAppartement = () => {
  const [appartements, setAppartements] = useState([]); // Changé en pluriel pour plus de clarté
  const [loading, setLoading] = useState(true);
  const [showAddAppartement, setShowAddAppartement] = useState(false);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchAppartement();
  }, []);

  const fetchAppartement = async () => {
    setLoading(true);
    try {
      // AJOUT DU "s" : On utilise la même route que dans le fichier Appartements.js
      const res = await api.get("/appartements");
      setAppartements(res.data);
    } catch (err) {
      console.error("Erreur de chargement des appartements dans le dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAppart = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet appartement ?")) {
      try {
        await api.delete(`/appartements/${id}`); // Vérifie si ton backend utilise /appartement ou /appartements pour le DELETE
        fetchAppartement(); // Rafraîchir la liste après suppression
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Gestion des Appartements</h2>
        <button className="btn-primary" onClick={() => setShowAddAppartement(true)}>
          + Nouvel Appartement
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Immeuble</th>
            <th>Numéro</th>
            <th>Étage</th>
            <th>Composition</th>
            <th>Type</th>
            <th>Prix</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                Chargement des données...
              </td>
            </tr>
          ) : appartements.length > 0 ? (
            appartements.map((ap) => (
              <tr key={ap._id}>
                <td>
                  <img
                    src={ap.images && ap.images.length > 0 
                      ? `https://lushi-backend.onrender.com/${ap.images[0]}` 
                      : "https://via.placeholder.com/50"}
                    alt={ap.numero}
                    className="table-img"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/50")}
                  />
                </td>
                <td><strong>{ap.immeuble_id?.name || "N/A"}</strong></td> {/* .nom si tu as fait un populate */}
                <td>{ap.numero}</td>
                <td>{ap.etage}</td>
                <td>{ap.compost}</td>
                <td>{ap.type}</td>
                <td>{ap.prix} {ap.devise || "$"}</td>
                <td>
                  <span className={`status-badge ${ap.statut}`}>
                    {ap.statut}
                  </span>
                </td>
                <td>
                  {/*<button className="btn-edit">Modifier</button>*/}
                  <button className="btn-delete" onClick={() => deleteAppart(ap._id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                Aucun appartement trouvé à Lubumbashi pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL D'AJOUT */}
      {showAddAppartement && (
        <AddAppartement 
          isOpen={showAddAppartement} 
          onClose={() => {
            setShowAddAppartement(false);
            fetchAppartement(); // On rafraîchit la liste quand on ferme la modal (au cas où un ajout a été fait)
          }} 
        />
      )}
    </div>
  );
};

export default GestAppartement;