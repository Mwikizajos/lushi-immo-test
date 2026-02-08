const express = require('express');
const cors = require('cors');
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

// --- CONFIGURATION CORS FLEXIBLE ---
// Cette configuration accepte tes deux versions de liens Vercel
const allowedOrigins = [
  'https://lushi-immo-front.vercel.app',
  'https://lushi-immo.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // autorise les requêtes sans origine (comme les outils de test) 
        // ou les origines dans notre liste
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS non autorisé pour cette origine'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// ------------------------------------

app.use(express.json());

// Servir les fichiers uploads
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/proprietaires', proprietairesRoutes);
app.use('/api/immeubles', immeublesRoutes);
app.use('/api/appartements', appartementsRoutes);

app.get('/', (req, res) => res.send('Lushi_immo backend running and connected to MongoDB Atlas'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));