import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { FaUserPlus, FaTrash, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import AddProprietaire from "./AddProprietaire";
import "./GestProprio.css";

const Proprietaire = () => {
  const [proprietaires, setProprietaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchProprietaires();
  }, []);

  const fetchProprietaires = async () => {
    setLoading(true);
    try {
      const res = await api.get("/proprietaires");
      setProprietaires(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des propriétaires:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProprio = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce propriétaire ? Cette action est irréversible.")) {
      try {
        await api.delete(`/proprietaires/${id}`);
        fetchProprietaires();
      } catch (err) {
        alert("Erreur lors de la suppression. Le propriétaire est peut-être lié à un immeuble.");
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-text">
          <h2>Gestion des Propriétaires</h2>
          <p>{proprietaires.length} propriétaire(s) enregistré(s)</p>
        </div>
        <button className="btn-add-main" onClick={() => setShowAddModal(true)}>
          <FaUserPlus /> Nouveau Propriétaire
        </button>
      </div>

      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Nom Complet</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Localisation</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="status-cell">
                  <div className="loader-dots">Chargement en cours...</div>
                </td>
              </tr>
            ) : proprietaires.length > 0 ? (
              proprietaires.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="proprio-name">
                      <div className="avatar-circle">
                        {p.nom.charAt(0).toUpperCase()}
                      </div>
                      <strong>{p.nom}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <FaPhoneAlt className="mini-icon" /> {p.telephone}
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <FaEnvelope className="mini-icon" /> 
                      <span className={!p.email ? "text-muted" : ""}>
                        {p.email || "Non renseigné"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <FaMapMarkerAlt className="mini-icon" /> 
                      {p.adresse || "Lubumbashi"}
                    </div>
                  </td>
                  <td className="text-center">
                    <button 
                      className="btn-action delete" 
                      onClick={() => deleteProprio(p._id)}
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="status-cell">
                  Aucun propriétaire trouvé dans la base de données.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddProprietaire 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={fetchProprietaires} 
      />
    </div>
  );
};

export default Proprietaire;