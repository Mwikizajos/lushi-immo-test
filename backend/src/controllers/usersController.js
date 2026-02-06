//GRADISCORE EST PASSER PAR LA AUSSI 
const User = require('../models/user');

//  GET ALL
exports.getAll = async (req, res) => {
    try {
        // .select('-password') permet de tout récupérer SAUF le mot de passe
        const results = await User.find().select('-password');
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération", error: err });
    }
};

//  GET BY ID
exports.getById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

//  CREATE
exports.create = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const newUser = new User({
            name,
            email,
            password, //  Attention : plus tard il faudra utiliser bcrypt.hash() ici
            role: role || 'agent'
        });

        await newUser.save();
        
        // On renvoie l'utilisateur créé sans son mot de passe
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({ 
            id: newUser._id, 
            message: 'Utilisateur créé avec succès',
            user: userResponse 
        });
    } catch (err) {
        if (err.code === 11000) { // Code erreur MongoDB pour "doublon" (email déjà pris)
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }
        res.status(500).json(err);
    }
};

//  UPDATE
exports.update = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json({ message: 'Utilisateur mis à jour', user: updatedUser });
    } catch (err) {
        res.status(500).json(err);
    }
};

//  DELETE
exports.remove = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        res.status(500).json(err);
    }
};

// LOGIN
// ... (tes fonctions getAll, getById, create, etc. restent au dessus)

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. VÉRIFICATION VIA LE FICHIER .ENV (L'Admin Local)
        const MASTER_EMAIL = process.env.ADMIN_EMAIL;
        const MASTER_PASSWORD = process.env.ADMIN_PASSWORD;

        if (email === MASTER_EMAIL && password === MASTER_PASSWORD) {
            return res.status(200).json({
                message: "Connexion Admin locale réussie (via .env)",
                user: {
                    name: "Administrateur Local",
                    email: MASTER_EMAIL,
                    role: "admin"
                }
            });
        }

        // 2. SI CE N'EST PAS L'ADMIN DU .ENV, ON CHERCHE DANS LA BASE DE DONNÉES
        const user = await User.findOne({ email });

        if (user && user.password === password && user.role === 'admin') {
            return res.status(200).json({
                message: "Connexion réussie (via Base de données)",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }

        // 3. SI RIEN NE CORRESPOND
        return res.status(401).json({ message: "Identifiants invalides" });

    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err });
    }
};