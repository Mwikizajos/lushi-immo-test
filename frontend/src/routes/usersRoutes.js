//GRADISCORE : MODIFICATIONS DES ROUTES ICI AUSSI 
const express = require('express'); 
const router = express.Router();

// GRADISCORE : Je fais la meme chose pour toutes les  routes mais change juste le nom
const usersController = require('../controllers/usersController');
const auth = require("../middlewares/authMiddleware");

// j'utilise les fonctions que j'ai préparées dans le contrôleur
router.get('/', usersController.getAll);           
router.get('/:id', usersController.getById);                
router.put('/:id', usersController.update);        
router.delete('/:id', usersController.remove);
router.post('/login', usersController.login);
router.get("/users", auth, (req, res) => {
  res.json({ message: "Accès autorisé" });
});    

module.exports = router;