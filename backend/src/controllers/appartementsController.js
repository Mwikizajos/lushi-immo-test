// On n'a plus besoin de fs et path car tout est sur le cloud !
const Appartement = require("../models/appartement");

// Récupérer tous les appartements
exports.getAllAppartements = async (req, res) => {
    try {
        const rows = await Appartement.find().populate('immeuble_id');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Erreur interne", error: error.message });
    }
};

// Récupérer le nombre total d'appartements 
exports.getallnumber = async(req, res) => {
    try {
        const total = await Appartement.countDocuments();
        res.status(200).json({
            success: true,
            nombreTotal: total
        });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors du comptage", error: err.message });
    }
};

// Récupérer tous les appartements d'un immeuble 
exports.getByImmeuble = async (req, res) => {
    try {
        const { immeubleId } = req.params;
        const results = await Appartement.find({ immeuble_id: immeubleId }).sort({ created_at: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Erreur", error: error.message });
    }
};

// Récupérer un appartement par ID
exports.getAppartementById = async (req, res) => {
    try {
        const { id } = req.params;
        const appartement = await Appartement.findById(id); 

        if (!appartement) {
            return res.status(404).json({ message: "Appartement non trouvé" });
        }
        res.json(appartement);
    } catch (error) {
        res.status(500).json({ message: "Erreur interne", error: error.message });
    }
};

// Créer un nouvel appartement
exports.createAppartement = async (req, res) => {
    try {
        const data = { ...req.body };

        // MODIFICATION CLOUDINARY : 
        // req.files contient maintenant les URLs Cloudinary dans la propriété 'path'
        if (req.files && req.files.length > 0) {
            data.images = req.files.map(file => file.path); // URL complète https://...
        }

        const nouvelAppart = new Appartement(data);
        await nouvelAppart.save();

        res.status(201).json({ 
            message: "Appartement avec galerie Cloudinary créé !", 
            data: nouvelAppart 
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création", error: error.message });
    }
};

// Modifier un appartement
exports.updateAppartement = async (req, res) => {
    try {
        const data = { ...req.body };

        // MODIFICATION CLOUDINARY :
        if (req.files && req.files.length > 0) {
            data.images = req.files.map(file => file.path); // On remplace par les nouvelles URLs
        }

        const updated = await Appartement.findByIdAndUpdate(
            req.params.id, 
            data, 
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Appartement non trouvé" });

        res.json({ message: 'Appartement mis à jour avec succès', data: updated });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification", error: error.message });
    }
};

// Supprimer un appartement
exports.deleteAppartement = async (req, res) => {
    try {
        const { id } = req.params;

        // Avec Cloudinary, on ne supprime pas manuellement les fichiers sur le disque dur
        // Les images resteront sur Cloudinary sauf si tu configures la suppression via leur API (plus complexe)
        // Pour l'instant, on se concentre sur le nettoyage de la DB
        const deleted = await Appartement.findByIdAndDelete(id); 

        if (!deleted) return res.status(404).json({ message: "Appartement non trouvé" });

        res.json({ message: "Appartement supprimé de la base de données" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
    }
};