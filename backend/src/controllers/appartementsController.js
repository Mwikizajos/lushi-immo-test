//GRADISCORE : c'est dans ce fichier ou je fais l'invocation du model appartement en mode mongoose 
const fs = require('fs');
const path = require ('path');
const Appartement = require("../models/appartement"); // GRADISCORE :j'importe le modèle, plus la DB directe
const appartement = require('../models/appartement');
// CGRADISCORE : CEST POUR CA QUE JE KIFF LE SQL 😏

//  Récupérer tous les appartements
exports.getAllAppartements = async (req, res) => {
    try {
        const rows = await Appartement.find().populate('immeuble_id');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Erreur interne", error });
    }
};

//recupere les nombres total des appartements 
exports.getallnumber = async(req, res) => {
    try {
        //methode pour compter les immeubles 
        const total = await Appartement.countDocuments();
        res.status(200).json({
            success:true,
            nombreTotal: total
        });
    }catch (err){
        res.status(500).json({messsage:"erreur lors du comptage des Appartements ", error});
    }
};

//  Récupérer tous les appart d'un immeuble 
exports.getByImmeuble = async (req, res) => {
    try {
        const { immeubleId } = req.params;
        // find() avec un filtre et sort() pour le triag
        const results = await Appartement.find({ immeuble_id: immeubleId }).sort({ created_at: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Erreur", error });
    }
};

//  Récupérer un appartement par ID
exports.getAppartementById = async (req, res) => {
    try {
        const { id } = req.params;
        const appartement = await Appartement.findById(id); 

        if (!appartement) {
            return res.status(404).json({ message: "Appartement non trouvé" });
        }
        res.json(appartement);
    } catch (error) {
        res.status(500).json({ message: "Erreur interne", error });
    }
};

// Créer un nouvel appartement
exports.createAppartement = async (req, res) => {
    try {
        const data = { ...req.body };

        // On vérifie si Multer a reçu des fichiers (tableau req.files)
        if (req.files && req.files.length > 0) {
            // On crée un tableau avec les chemins de chaque photo
            data.images = req.files.map(file => `uploads/${file.filename}`);
        }

        const nouvelAppart = new Appartement(data);
        await nouvelAppart.save();

        res.status(201).json({ 
            message: "Appartement avec galerie créé !", 
            data: nouvelAppart 
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création", error });
    }
};

// Modifier un appartement
exports.updateAppartement = async (req, res) => {
    try {
        const data = { ...req.body };

        // 1. Si de nouvelles images sont envoyées
        if (req.files && req.files.length > 0) {
            // On crée le nouveau tableau de chemins
            data.images = req.files.map(file => `uploads/${file.filename}`);
            
            // GRADISCORE NOTE : Ici, on remplace les anciennes photos par les nouvelles.
            // Optionnel : Tu pourrais ajouter une logique pour supprimer les anciens fichiers 
            
        }

        // 2. Mise à jour dans MongoDB
        const updated = await Appartement.findByIdAndUpdate(
            req.params.id, 
            data, 
            { new: true } // Pour renvoyer l'objet modifié et non l'ancien
        );

        if (!updated) return res.status(404).json({ message: "Appartement non trouvé" });

        res.json({ message: 'Appartement mis à jour avec succès', data: updated });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification", error });
    }
};

//  Supprimer un appartement
exports.deleteAppartement = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. On cherche l'appartement d'abord
        const appartement = await Appartement.findById(id);
        if (!appartement) return res.status(404).json({ message: "Appartement non trouvé" });

        // 2. On supprime les images du dossier uploads s'il y en a
        if (appartement.images && appartement.images.length > 0) {
            appartement.images.forEach(imagePath => {
                // On construit le chemin complet vers le fichier
                const fullPath = path.join(__dirname, '..', '..', imagePath);
                
                // On vérifie si le fichier existe et on le supprime
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        // 3. Enfin, on le supprime de MongoDB
        await Appartement.findByIdAndDelete(id); 

        res.json({ message: "Appartement et ses images supprimés avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression", error });
    }
};