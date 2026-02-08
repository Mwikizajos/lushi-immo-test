//GRADISCORE : AJOUT DE GRADISCORE POUR MONGODB 
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, //  on verra comment le "hash" avec bcrypt
    role: { type: String, enum: ['admin', 'agent', 'client'], default: 'agent' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);