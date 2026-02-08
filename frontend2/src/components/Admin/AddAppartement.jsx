import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { FaHome, FaBuilding, FaDollarSign, FaLayerGroup, FaImage, FaTimes, FaSave } from "react-icons/fa";
import "./AddAppartement.css";

function AddAppartement({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    immeuble_id: "",
    numero: "",
    etage: "",
    compost: "",
    type: "Standard",
    prix: "",
    devise: "USD",
    statut: "disponible"
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [immeubles, setImmeubles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les immeubles
  useEffect(() => {
    if (isOpen) {
      const fetchImmeubles = async () => {
        try {
          const res = await api.get("/immeubles");
          setImmeubles(res.data);
        } catch (err) {
          console.error("Erreur lors du chargement des immeubles:", err);
        }
      };
      fetchImmeubles();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setErrors({ ...errors, images: "Vous ne pouvez télécharger que 5 images maximum" });
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setErrors({ ...errors, images: "Veuillez sélectionner uniquement des images (JPEG, PNG, WebP)" });
      return;
    }

    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors({ ...errors, images: "Chaque image ne doit pas dépasser 5MB" });
      return;
    }

    setImageFiles(files);
    setErrors({ ...errors, images: "" });

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.immeuble_id) {
      newErrors.immeuble_id = "L'immeuble est requis";
    }
    if (!formData.numero.trim()) {
      newErrors.numero = "Le numéro de l'appartement est requis";
    }
    if (!formData.compost) {
      newErrors.compost = "Veuillez indiquer la composition de l'appartement";
    }
    if (!formData.type) {
      newErrors.type = "Veuillez préciser le type d'appartement";
    }
    if (!formData.prix || formData.prix <= 0) {
      newErrors.prix = "Le prix doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const data = new FormData();
    data.append("immeuble_id", formData.immeuble_id);
    data.append("numero", formData.numero);
    data.append("etage", formData.etage || "");
    data.append("compost", formData.compost);
    data.append("type", formData.type);
    data.append("prix", formData.prix);
    data.append("devise", formData.devise);
    data.append("statut", formData.statut);

    imageFiles.forEach((file) => {
      data.append("images", file);
    });

    try {
      await api.post("/appartements", data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (onSuccess) onSuccess();
      handleClose();

    } catch (err) {
      console.error("Erreur complète:", err);
      let errorMessage = "Une erreur est survenue lors de l'ajout de l'appartement";
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setFormData({
        immeuble_id: "",
        numero: "",
        etage: "",
        compost: "",
        type: "Standard",
        prix: "",
        devise: "USD",
        statut: "disponible"
      });
      setImageFiles([]);
      setImagePreviews([]);
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <FaHome className="modal-icon" />
            <h2>Ajouter un Appartement</h2>
          </div>
          <button className="modal-close-btn" onClick={handleClose} disabled={isSubmitting}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            {imagePreviews.length > 0 && (
              <div className="images-preview-container">
                <h3>Images sélectionnées ({imagePreviews.length}/5)</h3>
                <div className="images-preview-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img src={preview} alt={`Prévisualisation ${index + 1}`} />
                      <button type="button" className="remove-image-btn" onClick={() => removeImage(index)}>
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="immeuble_id" className="form-label">
                  <FaBuilding className="input-icon" /> Immeuble *
                </label>
                <select
                  id="immeuble_id"
                  name="immeuble_id"
                  value={formData.immeuble_id}
                  onChange={handleChange}
                  className={`form-select ${errors.immeuble_id ? 'error' : ''}`}
                  disabled={isSubmitting || immeubles.length === 0}
                >
                  <option value="">Sélectionner un immeuble</option>
                  {immeubles.map(im => (
                    <option key={im._id} value={im._id}>{im.name} - {im.adress}</option>
                  ))}
                </select>
                {errors.immeuble_id && <span className="error-message">{errors.immeuble_id}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="numero" className="form-label">
                  <FaHome className="input-icon" /> Numéro *
                </label>
                <input
                  id="numero"
                  name="numero"
                  type="text"
                  placeholder="Ex: A101, 5B"
                  value={formData.numero}
                  onChange={handleChange}
                  className={`form-input ${errors.numero ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.numero && <span className="error-message">{errors.numero}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="etage" className="form-label">
                  <FaLayerGroup className="input-icon" /> Étage
                </label>
                <input
                  id="etage"
                  name="etage"
                  type="number"
                  placeholder="Ex: 1, 2"
                  value={formData.etage}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isSubmitting}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="compost" className="form-label">
                  <FaHome className="input-icon" /> Composition *
                </label>
                <select
                  id="compost"
                  name="compost"
                  value={formData.compost}
                  onChange={handleChange}
                  className={`form-select ${errors.compost ? 'error' : ''}`}
                  disabled={isSubmitting}
                >
                  <option value="">Sélectionner la composition</option>
                  <option value="1R">1 chambre Salon cuisine</option>
                  <option value="2R">2 Chambre Salon Cuisine</option>
                  <option value="1RS">1 chambre Salon</option>
                </select>
                {errors.compost && <span className="error-message">{errors.compost}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="type" className="form-label">
                  <FaHome className="input-icon" /> Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`form-select ${errors.type ? 'error' : ''}`}
                  disabled={isSubmitting}
                >
                  <option value="Standard">Standard</option>
                  <option value="Luxe">Luxe</option>
                </select>
                {errors.type && <span className="error-message">{errors.type}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="prix" className="form-label">
                  <FaDollarSign className="input-icon" /> Prix *
                </label>
                <div className="price-input-group">
                  <input
                    id="prix"
                    name="prix"
                    type="number"
                    value={formData.prix}
                    onChange={handleChange}
                    className={`form-input ${errors.prix ? 'error' : ''}`}
                    disabled={isSubmitting}
                    min="0"
                  />
                  <select
                    name="devise"
                    value={formData.devise}
                    onChange={handleChange}
                    className="devise-select"
                    disabled={isSubmitting}
                  >
                    <option value="USD">USD</option>
                    <option value="CDF">CDF</option>
                  </select>
                </div>
                {errors.prix && <span className="error-message">{errors.prix}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="statut" className="form-label">Statut</label>
                <select
                  id="statut"
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className="form-select"
                  disabled={isSubmitting}
                >
                  <option value="disponible">Disponible</option>
                  <option value="loué">Loué</option>
                  <option value="réservé">Réservé</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  <FaImage className="input-icon" /> Images (max 5)
                </label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="file-input"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="image-upload" className="file-upload-label">
                    <FaImage className="upload-icon" />
                    <div className="upload-text">
                      <p className="upload-title">Cliquez pour télécharger</p>
                      <p className="upload-subtitle">Max. 5 fichiers (JPEG, PNG, WebP)</p>
                    </div>
                  </label>
                </div>
                {errors.images && <span className="error-message">{errors.images}</span>}
              </div>
            </div>

            {errors.submit && <div className="submit-error">{errors.submit}</div>}

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={handleClose} disabled={isSubmitting}>Annuler</button>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? <><span className="spinner"></span> Ajout...</> : <><FaSave className="btn-icon" /> Ajouter</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAppartement;