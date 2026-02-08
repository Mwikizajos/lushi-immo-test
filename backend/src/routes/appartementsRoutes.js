const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/appartementsController');
const upload = require('../middlewares/multer-config');
// On importe le middleware d'authentification
const auth = require("../middlewares/authMiddleware");

// --- ROUTES PUBLIQUES ---
router.get('/', ctrl.getAllAppartements);
router.get('/count', ctrl.getallnumber);
router.get('/immeuble/:immeubleId', ctrl.getByImmeuble);
router.get('/:id', ctrl.getAppartementById);

// --- ROUTES PROTÉGÉES (Ajout de 'auth') ---
// Note : 'auth' doit toujours être placé AVANT 'upload'
router.post('/', auth, upload.array('images', 5), ctrl.createAppartement);
router.put('/:id', auth, upload.array('images', 5), ctrl.updateAppartement);
router.delete('/:id', auth, ctrl.deleteAppartement);

module.exports = router;