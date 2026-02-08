const mongoose = require('mongoose');

const ImmeubleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    adress: { type: String, required: true },
    
    description: String,
    image: String,
    proprietaire_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Proprietaire', 
        default: null 
    },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Immeuble', ImmeubleSchema);