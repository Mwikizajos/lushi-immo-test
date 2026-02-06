// GRADISCORE : STRUCTURE FINALE POUR TEST
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Connexion MongoDB
const connectDB = require('./src/config/db');

// Initialisation de la base de données
connectDB(); 

const usersRoutes = require('./src/routes/usersRoutes');
const proprietairesRoutes = require('./src/routes/proprietairesRoutes');
const immeublesRoutes = require('./src/routes/immeublesRoutes');
const appartementsRoutes = require('./src/routes/appartementsRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir les fichiers uploads en statique 
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

// Routes API
app.use('/api/users', usersRoutes);
app.use('/api/proprietaires', proprietairesRoutes);
app.use('/api/immeubles', immeublesRoutes);
app.use('/api/appartements', appartementsRoutes);

// Route de base
app.get('/', (req, res) => {
    res.send('Lushi_immo backend running and connected to MongoDB Atlas');
});

// Port dynamique pour l'hébergement (Render/Heroku)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});