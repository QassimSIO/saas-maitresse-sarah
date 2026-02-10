// mongodb+srv://qassimbelktatidev:Mongo110606.qassim@cluster0.pdjo2n6.mongodb.net/?appName=Cluster0

import mongoose from "mongoose";

// ═══════════════════════════════════════════════════
// CONNEXION À MONGODB ATLAS
// ═══════════════════════════════════════════════════
const connectDB = async () => {
  try {
    // Utiliser la variable d'environnement
    const MONGODB_URI = process.env.MONGODB_URI;

    await mongoose.connect(MONGODB_URI);

    console.log("✅ Connecté à MongoDB Atlas !");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
