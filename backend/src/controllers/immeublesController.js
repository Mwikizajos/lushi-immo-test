//GRADISCORE : JAI FAIS DES MODIFS ICI AUSSI 
const Immeuble = require('../models/immeuble');
const path = require('path');

//  GET /api/immeubles
exports.getAll = async (req, res) => {
    try {
        const results = await Immeuble.find().populate('proprietaire_id');
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
};

//compter tout les immeubles existants 
exports.getallnumber = async(req, res) => {
    try {
        //methode pour compter les immeubles 
        const total = await Immeuble.countDocuments();
        res.status(200).json({
            success:true,
            nombreTotal: total
        });
    }catch (err){
        res.status(500).json({messsage:"erreur lors du comptage des immeubles ", error});
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
        
        // Gestion du chemin de l'image (Upload)
        let imagePath = req.file ? `uploads/${req.file.filename}` : null;

        const nouveauImmeuble = new Immeuble({
            name,
            adress,
            description,
            proprietaire_id: proprietaire_id || null,
            image: imagePath
        });

        await nouveauImmeuble.save();
        res.status(201).json({ 
            id: nouveauImmeuble._id, 
            message: 'Immeuble créé avec succès !' 
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

//  PUT /api/immeubles/:id
exports.update = async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Si une nouvelle image est téléchargée, on met à jour le chemin
        if (req.file) {
            updateData.image = `uploads/${req.file.filename}`;
        }

        const updatedImmeuble = await Immeuble.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true } // Pour renvoyer l'objet modifié
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