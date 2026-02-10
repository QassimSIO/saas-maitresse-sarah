import mongoose from "mongoose";

// ═══════════════════════════════════════════════════
// SCHÉMA DU LIVRET
// ═══════════════════════════════════════════════════
const livretSchema = new mongoose.Schema({
  prenom: {
    type: String,
    required: true,
    trim: true,
  },
  theme: {
    type: String,
    required: true,
    enum: ["lecture", "maths"], // Seulement ces valeurs autorisées
  },
  consigne: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ═══════════════════════════════════════════════════
// CRÉER LE MODÈLE
// ═══════════════════════════════════════════════════
const Livret = mongoose.model("Livret", livretSchema);

export default Livret;
