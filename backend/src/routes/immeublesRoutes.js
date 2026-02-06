//GRADISCORE : MODIFICATIONS DES ROUTES ICI AUSSI 
const express = require('express');
const router = express.Router();
// GRADISCORE : Je fais la meme chose pour toutes les  routes mais change juste le nom
const ctrl = require('../controllers/immeublesController');
//GRADISCORE : Le middleware de stockage avec la librairie multer  
const upload = require('../middlewares/multer-config');

const auth = require("../middlewares/authMiddleware");

router.get("/users", auth, (req, res) => {
  res.json({ message: "Accès autorisé" });
});
//GRADISCORE : j'utilise les fonctions que j'ai préparées dans le contrôleur

router.get('/count', ctrl.getallnumber);           
router.get('/', ctrl.getAll);
     
router.post('/', upload.single('image'), ctrl.create);          
router.put('/:id', upload.single('image'), ctrl.update);        
router.delete('/:id', ctrl.remove);   
router.get('/:id', ctrl.getById);  


module.exports = router;