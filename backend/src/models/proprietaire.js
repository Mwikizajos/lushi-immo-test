//GRADISCORE / ICI AUSSI JAI AJOUTER CEST LE MODELEDU PROPRIO 
const mongoose = require('mongoose');

const ProprietaireSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    adresse: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proprietaire', ProprietaireSchema);