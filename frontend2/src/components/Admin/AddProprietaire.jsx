import React, { useState } from "react";
import api from "../../api/axios";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTimes, FaSave } from "react-icons/fa";
import "./AddProprietaire.css";

function AddProprietaire({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    email: "",
    adresse: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom du propriétaire est requis";
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le numéro de téléphone est requis";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse email n'est pas valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      telephone: "",
      email: "",
      adresse: ""
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await api.post("/proprietaires", formData);

      if (onSuccess) onSuccess();
      resetForm();
      onClose();

    } catch (err) {
      console.error("Erreur ajout propriétaire:", err);
      setErrors({
        submit: err.response?.data?.message || "Une erreur est survenue lors de l'ajout"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <FaUser className="modal-icon" />
            <h2>Ajouter un Propriétaire</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nom" className="form-label">
                  <FaUser className="input-icon" /> Nom complet *
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  placeholder="Ex: Jospin MWIKIZA"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`form-input ${errors.nom ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.nom && <span className="error-message">{errors.nom}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="telephone" className="form-label">
                  <FaPhone className="input-icon" /> Téléphone *
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  placeholder="Ex: +243 973 760 697"
                  value={formData.telephone}
                  onChange={handleChange}
                  className={`form-input ${errors.telephone ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.telephone && <span className="error-message">{errors.telephone}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="email" className="form-label">
                  <FaEnvelope className="input-icon" /> Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Ex: jospinmwikiza@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="adresse" className="form-label">
                  <FaMapMarkerAlt className="input-icon" /> Adresse
                </label>
                <textarea
                  id="adresse"
                  name="adresse"
                  placeholder="Adresse complète du propriétaire..."
                  value={formData.adresse}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="3"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {errors.submit && <div className="submit-error">{errors.submit}</div>}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><span className="spinner"></span> Ajout...</>
                ) : (
                  <><FaSave className="btn-icon" /> Enregistrer</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProprietaire;