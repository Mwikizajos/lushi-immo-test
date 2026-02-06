const express = require('express');
const cors = require('cors'); // Assure-toi que ce package est bien installé
const path = require('path');
require('dotenv').config();

const connectDB = require('./src/config/db');

// Connexion à la base de données
connectDB(); 

const usersRoutes = require('./src/routes/usersRoutes');
const proprietairesRoutes = require('./src/routes/proprietairesRoutes');
const immeublesRoutes = require('./src/routes/immeublesRoutes');
const appartementsRoutes = require('./src/routes/appartementsRoutes');

const app = express();

// --- MODIFICATION ICI : CONFIGURATION CORS ---
app.use(cors({
    origin: 'https://lushi-immo-front.vercel.app', // Ton lien Vercel précis
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// ----------------------------------------------

app.use(express.json());

// Servir les fichiers uploads en statique 
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/proprietaires', proprietairesRoutes);
app.use('/api/immeubles', immeublesRoutes);
app.use('/api/appartements', appartementsRoutes);

app.get('/', (req, res) => res.send('Lushi_immo backend running and connected to MongoDB Atlas'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));