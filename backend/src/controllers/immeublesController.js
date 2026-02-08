const Immeuble = require('../models/immeuble');

//  GET /api/immeubles
exports.getAll = async (req, res) => {
    try {
        const results = await Immeuble.find().populate('proprietaire_id');
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Compter tous les immeubles existants 
exports.getallnumber = async(req, res) => {
    try {
        const total = await Immeuble.countDocuments();
        res.status(200).json({
            success: true,
            nombreTotal: total
        });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors du comptage des immeubles", error: err.message });
    }
};

//  GET /api/immeubles/:id
exports.getById = async (req, res) => {
    try {
        const result = await Immeuble.findById(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

//  POST /api/immeubles
exports.create = async (req, res) => {
    try {
        const { name, adress, description, proprietaire_id } = req.body;
        
        // MODIFICATION ICI : On récupère l'URL Cloudinary via req.file.path
        let imagePath = req.file ? req.file.path : null;

        const nouveauImmeuble = new Immeuble({
            name,
            adress,
            description,
            proprietaire_id: proprietaire_id || null,
            image: imagePath // Enregistre l'URL HTTPS complète
        });

        await nouveauImmeuble.save();
        res.status(201).json({ 
            id: nouveauImmeuble._id, 
            message: 'Immeuble créé avec succès sur Cloudinary !' 
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

//  PUT /api/immeubles/:id
exports.update = async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // MODIFICATION ICI : Si une nouvelle image est téléchargée
        if (req.file) {
            updateData.image = req.file.path; // On met à jour avec la nouvelle URL Cloudinary
        }

        const updatedImmeuble = await Immeuble.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true }
        );

        if (!updatedImmeuble) return res.status(404).json({ message: "Non trouvé" });

        res.json({ message: 'Immeuble modifié avec succès !', data: updatedImmeuble });
    } catch (err) {
        res.status(500).json(err);
    }
};

//  DELETE /api/immeubles/:id
exports.remove = async (req, res) => {
    try {
        await Immeuble.findByIdAndDelete(req.params.id);
        res.json({ message: 'Immeuble supprimé' });
    } catch (err) {
        res.status(500).json(err);
    }
};