const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // On récupère le lien MongoDB depuis le .env
        const uri = process.env.MONGO_URI;
        
        if (!uri) {
            throw new Error("La variable MONGO_URI n'est pas définie dans le fichier .env");
        }

        const conn = await mongoose.connect(uri);

        console.log(`✅ MongoDB Connecté : ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Erreur de connexion : ${error.message}`);
        process.exit(1); // Arrête le serveur en cas d'échec critique
    }
};

module.exports = connectDB;