//GRADISCORE : ici je met le code pour le model des appartement leurs champ et type de donnée 
const mongoose = require('mongoose');

const AppartementSchema = new mongoose.Schema({
    immeuble_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Immeuble', required: true },
    numero: {type:String, required:true},
    etage: {type: Number, required: true},
    compost: String, // ex: Studio, T3, etc.
    type: String,
    prix: { type: Number, required: true }, 
    devise: { type: String, enum: ['USD', 'CDF' ], default: 'USD' },
    images: [{ type: String }], // Un tableau pour stocker plusieurs chemins d'images
    statut: { type: String, default: 'Disponible' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appartement', AppartementSchema);