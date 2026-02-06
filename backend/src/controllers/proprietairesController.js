// GRADISCORE : Ici j'ai carrement fais les menage tout le SQL je l'ai remplacer 
// le truc pour les proprietair 
const Proprietaire = require('../models/proprietaire');

module.exports = {

  //  GET ALL
  getAll: async (req, res) => {
    try {
      const results = await Proprietaire.find();
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération", error: err });
    }
  },

  //compter tout les immeubles existants 
  getallnumber: async(req, res) => {
      try {
          //methode pour compter les immeubles 
          const total = await Proprietaire.countDocuments();
          res.status(200).json({
              success:true,
              nombreTotal: total
          });
      }catch (err){
          res.status(500).json({messsage:"erreur lors du comptage des Proprietaire ", error});
      }
  },

  //  GET BY ID
  getById: async (req, res) => {
    try {
      const result = await Proprietaire.findById(req.params.id);
      if (!result) return res.status(404).json({ message: "Propriétaire non trouvé" });
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err });
    }
  },

  //  CREATE
  create: async (req, res) => {
    try {
      const { nom, telephone, email, adresse } = req.body;

      if (!nom || !telephone) {
        return res.status(400).json({ message: " Le Nom et téléphone sont obligatoires" });
      }

      const nouveauProprio = new Proprietaire({ nom, telephone, email, adresse });
      await nouveauProprio.save();

      res.status(201).json({ id: nouveauProprio._id, message: 'Propriétaire créé avec succès' });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la création", error: err });
    }
  },

  //  UPDATE
  update: async (req, res) => {
    try {
      const { nom, telephone, email, adresse } = req.body;

      // { new: true } permet de renvoyer le document modifié et non l'ancien
      const updated = await Proprietaire.findByIdAndUpdate(
        req.params.id,
        { nom, telephone, email, adresse },
        { new: true }
      );

      if (!updated) return res.status(404).json({ message: "Propriétaire non trouvé" });
      res.json({ message: 'Propriétaire mis à jour', data: updated });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la modification", error: err });
    }
  },

  //  DELETE
  remove: async (req, res) => {
    try {
      const deleted = await Proprietaire.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Propriétaire non trouvé" });
      res.json({ message: 'Propriétaire supprimé' });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la suppression", error: err });
    }
  }

};