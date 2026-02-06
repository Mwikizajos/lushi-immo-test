//GRADISCORE JAI ALEGER LE FICHIER 
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/appartementsController');
const upload = require('../middlewares/multer-config');

// Le menu :
router.get('/', ctrl.getAllAppartements);
router.get('/count', ctrl.getallnumber);
// GRADISCORE: j'utilise .array au lieu de .single Pour pouvoir mettre plusieurs images pour un appart 
// j'ai mis maximum 5 images qu'on peut ajouter 
router.post('/', upload.array('images', 5), ctrl.createAppartement);
router.put('/:id', upload.array('images', 5), ctrl.updateAppartement);
router.get('/immeuble/:immeubleId', ctrl.getByImmeuble);
router.get('/:id', ctrl.getAppartementById );
router.delete('/:id', ctrl.deleteAppartement);


module.exports = router;