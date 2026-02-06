//GRADISCORE : MODIFICATIONS DES ROUTES ICI AUSSI 
const express = require('express');
const router = express.Router();
// GRADISCORE : Je fais la meme chose pour toutes les  routes mais change juste le nom
const ctrl = require('../controllers/proprietairesController'); 

// j'utilise les fonctions que j'ai préparées dans le contrôleur
router.get('/count', ctrl.getallnumber);
router.get('/', ctrl.getAll);           
router.get('/:id', ctrl.getById);       
router.post('/', ctrl.create);          
router.put('/:id', ctrl.update);        
router.delete('/:id', ctrl.remove);     

module.exports = router;