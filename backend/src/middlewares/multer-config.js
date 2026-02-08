const cloudinary = require(' cloudinary').v2;
const { CloudinaryStorage } = require(' multer-storage-cloudinary');
const multer = require('multer' );

// 1. CONFIGURATION DE CLOUDINARY
// Ces informations sont lues depuis tes variables d'environnement sur Render
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. CONFIGURATION DU STOCKAGE CLOUD
// On ne crée plus de dossier local, on définit un dossier sur Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lushi_immo_uploads', // Nom du dossier sur ton compte Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg' ], // Formats autorisés
  },
});

// 3. INITIALISATION DE MULTER
const upload = multer({ storage: storage });

// 4. EXPORTATION
module.exports = upload;