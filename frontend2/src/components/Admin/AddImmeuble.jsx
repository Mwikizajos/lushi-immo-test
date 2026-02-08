import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { FaBuilding, FaMapMarkerAlt, FaUser, FaImage, FaTimes, FaSave, FaInfoCircle } from "react-icons/fa";
import "./AddImmeuble.css";

function AddImmeuble({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    adress: "",
    description: "",
    proprietaire_id: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [proprios, setProprios] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les propriétaires à l'ouverture
  useEffect(() => {
    if (isOpen) {
      const fetchProprios = async () => {
        try {
          const res = await api.get("/proprietaires");
          setProprios(res.data);
        } catch (err) {
          console.error("Erreur chargement proprios:", err);
        }
      };
      fetchProprios();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: "Format invalide (JPEG, PNG, WebP uniquement)" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "L'image est trop lourde (max 5MB)" });
        return;
      }

      // Nettoyage de l'ancienne URL de prévisualisation si elle existe
      if (imagePreview) URL.revokeObjectURL(imagePreview);

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.adress.trim()) newErrors.adress = "L'adresse est requise";
    if (formData.description.length > 500) newErrors.description = "Trop long (max 500 car.)";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetAndClose = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setFormData({ name: "", adress: "", description: "", proprietaire_id: "" });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append("image", imageFile);

    try {
      await api.post("/immeubles", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (onSuccess) onSuccess();
      resetAndClose();
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Erreur lors de l'ajout" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <FaBuilding className="modal-icon" />
            <h2>Nouvel Immeuble</h2>
          </div>
          <button className="modal-close-btn" onClick={resetAndClose} disabled={isSubmitting} >
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            
            {imagePreview && (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button type="button" className="remove-image-btn" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                    <FaTimes />
                  </button>
                </div>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label"><FaBuilding className="input-icon" /> Nom *</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Ex: Résidence Horizon"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : '' }
                  disabled={isSubmitting}
                />
                {errors.name && < span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label"><FaMapMarkerAlt className="input-icon" /> Adresse *</label>
                <input
                  name="adress"
                  type="text"
                  placeholder="Avenue, Quartier, Ville"
                  value={formData.adress}
                  onChange={handleChange}
                  className={errors.adress ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.adress && <span className="error-message">{errors.adress}</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label"><FaUser className="input-icon" /> Propriétaire</label>
                <select
                  name="proprietaire_id"
                  value={formData.proprietaire_id}
                  onChange={handleChange}
                  disabled={isSubmitting || proprios.length === 0}
                >
                  <option value="">Sélectionner un propriétaire</option>
                  {proprios.map(p => (
                    <option key={p._id} value={p._id}>{p.nom} {p.prenom}</option>
                  ))}
                </select>
                {proprios.length === 0 && <p className="info-message"><FaInfoCircle /> Aucun propriétaire trouvé</p>}
              </div>

              <div className="form-group full-width">
                <label className="form-label"><FaImage className="input-icon" /> Image</label>
                <div className="file-upload-area">
                  <input type="file" id="img-up" accept="image/*" onChange={handleImageChange} className="file-input" disabled={isSubmitting} />
                  <label htmlFor="img-up" className="file-upload-label">
                    <FaImage className="upload-icon" />
                    <p className="upload-title">Cliquez pour ajouter une photo</p>
                  </label>
                </div>
                {errors.image && <span className="error-message">{errors.image}</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  placeholder="Détails supplémentaires..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  disabled={isSubmitting}
                />
                <div className="char-counter">{formData.description.length}/500</div>
              </div>
            </div>

            {errors.submit && <div className="submit-error">{errors.submit}</div>}

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={resetAndClose} disabled={isSubmitting}>Annuler</button>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? <span className="spinner"></span> : <FaSave />} Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddImmeuble;