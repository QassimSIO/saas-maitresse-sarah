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
