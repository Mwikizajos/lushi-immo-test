
const express = require('express');
const router = express.Router();

// Import des contrôleurs et middlewares
const ctrl = require('../controllers/immeublesController');
const upload = require('../middlewares/multer-config');
const auth = require("../middlewares/authMiddleware");

// 1. Routes Publiques (accessibles par tout le monde)
router.get('/count', ctrl.getallnumber);           
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// 2. Routes Protégées (nécessitent d'être connecté)
// Note l'ordre : 'auth' d'abord, puis 'upload'
router.post('/', auth, upload.single('image'), ctrl.create);          
router.put('/:id', auth, upload.single('image'), ctrl.update);        
router.delete('/:id', auth, ctrl.remove);

// Route de test pour la connexion
router.get("/verify-auth", auth, (req, res) => {
  res.json({ message: "Accès autorisé", user: req.user });
});

module.exports = router;