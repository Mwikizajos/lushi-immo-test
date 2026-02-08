import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import "./GestImmeuble.css";
import AddImmeuble from "./AddImmeuble";

const Immeubles = () => {
  const [immeubles, setImmeubles] = useState([]);
  //const [showModal, setShowModal] = useState(false);
  const [showAddImmeuble, setShowAddImmeuble] = useState(false);
  
  // État pour le formulaire (doit matcher ton schéma Mongoose)
  /*const [formData, setFormData] = useState({
    name: "",
    adress: "",
    type: "",
    description: "",
    image: null
  });*/

  useEffect(() => {
    fetchImmeubles();
  }, []);

  const fetchImmeubles = async () => {
    try {
      const res = await api.get("/immeubles");
      setImmeubles(res.data);
    } catch (err) {
      console.error("Erreur de chargement", err);
    }
  };

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    // Utilisation de FormData pour envoyer l'image au serveur via Multer
    const data = new FormData();
    data.append("name", formData.name);
    data.append("adress", formData.adress);
    data.append("type", formData.type);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    try {
      await api.post("/immeubles", data);
      setShowModal(false);
      fetchImmeubles(); // Rafraîchir
      setFormData({ name: "", adress: "", type: "", description: "", image: null });
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
  };*/

  const deleteImmeuble = async (id) => {
    if (window.confirm("Supprimer cet immeuble ?")) {
      await api.delete(`/immeubles/${id}`);
      fetchImmeubles();
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Gestion des Immeubles</h2>
        <button className="btn-primary" onClick={() => setShowAddImmeuble(true)}>+ Nouvel Immeuble </button>
        
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Type</th>
            <th>Proprietaire</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {immeubles.map((imm) => (
            <tr key={imm._id}>
              <td>
                <img 
                  src={`https://lushi-backend.onrender.com/${imm.image}`} 
                  alt="Batiment" 
                  className="table-img" 
                  onError={(e) => e.target.src = "https://via.placeholder.com/50"}
                />
              </td>
              <td><strong>{imm.name}</strong></td>
              <td>{imm.adress}</td>
              <td>{imm.type}</td>
              <td><strong>{imm.proprietaire_id?.nom || "N/A"}</strong></td> {/* .nom si tu as fait un populate */}
              
              <td>
                <button className="btn-delete" onClick={() => deleteImmeuble(imm._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL D'AJOUT */}
      
        <AddImmeuble isOpen={showAddImmeuble} onClose={() => setShowAddImmeuble(false)} />
        
      
    </div>
  );
};

export default Immeubles;