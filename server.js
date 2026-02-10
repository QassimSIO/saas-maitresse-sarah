import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import Livret from "./models/Livret.js";

// ═══════════════════════════════════════════════════
// CRÉER L'APPLICATION EXPRESS
// ═══════════════════════════════════════════════════
const app = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════════════════
// CONNEXION À LA BASE DE DONNÉES
// ═══════════════════════════════════════════════════
connectDB();

// ═══════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════
app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════
// BASE DE DONNÉES DE CONSIGNES (temporaire)
// ═══════════════════════════════════════════════════
const consignes = {
  lecture: [
    "Entoure toutes les lettres A que tu vois.",
    "Colorie la grande lettre E en rouge.",
    "Trouve les mots qui commencent par la lettre M.",
  ],
  maths: [
    "Compte les pommes et écris le nombre.",
    "Trace 5 ronds dans le cadre.",
    "Colorie 3 étoiles sur 6.",
  ],
};

// ═══════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════

// Route de test (page d'accueil)
app.get("/", (req, res) => {
  res.json({
    message: "✅ API Livret Creator avec MongoDB Atlas !",
    endpoints: {
      "POST /api/livret": "Créer un livret",
      "GET /api/livrets": "Récupérer tous les livrets",
    },
  });
});

// Route pour créer un livret (AVEC SAUVEGARDE EN BDD)
app.post("/api/livret", async (req, res) => {
  try {
    const { prenom, theme } = req.body;

    // Validation
    if (!prenom || !theme) {
      return res.status(400).json({
        error: "Le prénom et le thème sont obligatoires",
      });
    }

    // Vérifier que le thème existe
    if (!consignes[theme]) {
      return res.status(404).json({
        error: `Le thème "${theme}" n'existe pas. Thèmes disponibles: lecture, maths`,
      });
    }

    // Sélectionner la première consigne du thème
    const consigne = consignes[theme][0];

    // CRÉER le livret dans MongoDB
    const livret = new Livret({
      prenom: prenom,
      theme: theme,
      consigne: consigne,
    });

    // SAUVEGARDER dans la base de données
    await livret.save();

    console.log("✅ Livret sauvegardé:", livret._id);

    // Envoyer le livret au frontend
    res.status(201).json({
      success: true,
      message: `Livret créé et sauvegardé pour ${prenom} !`,
      livret: {
        id: livret._id,
        prenom: livret.prenom,
        theme: livret.theme,
        consigne: livret.consigne,
        createdAt: livret.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
    res.status(500).json({
      error: "Erreur lors de la création du livret",
    });
  }
});

// NOUVELLE ROUTE : Récupérer tous les livrets
app.get("/api/livrets", async (req, res) => {
  try {
    // Récupérer TOUS les livrets de la BDD
    const livrets = await Livret.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      total: livrets.length,
      livrets: livrets,
    });
  } catch (error) {
    console.error("❌ Erreur:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des livrets",
    });
  }
});

// ═══════════════════════════════════════════════════
// DÉMARRAGE DU SERVEUR
// ═══════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 API disponible sur http://localhost:${PORT}/api/livret`);
});
