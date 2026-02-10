// ═══════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════
const API_URL = "https://saas-maitresse-sarah-api.onrender.com";

// ═══════════════════════════════════════════════════
// RÉCUPÉRATION DES ÉLÉMENTS HTML
// ═══════════════════════════════════════════════════
const form = document.getElementById("livretForm");
const resultatDiv = document.getElementById("resultat");
const prenomInput = document.getElementById("prenom");
const themeSelect = document.getElementById("theme");

// ═══════════════════════════════════════════════════
// FONCTION POUR CRÉER UN LIVRET
// ═══════════════════════════════════════════════════
async function creerLivret(prenom, theme) {
  try {
    // Envoyer la requête à l'API
    const response = await fetch(`${API_URL}/api/livret`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prenom, theme }),
    });

    // Vérifier si la requête a réussi
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erreur lors de la création");
    }

    // Récupérer la réponse
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════
// FONCTION POUR AFFICHER LE RÉSULTAT
// ═══════════════════════════════════════════════════
function afficherResultat(data) {
  const livret = data.livret;

  resultatDiv.innerHTML = `
    <div class="resultat-titre">✅ ${data.message}</div>
    
    <div class="resultat-info">
      <strong>Prénom :</strong> ${livret.prenom}
    </div>
    
    <div class="resultat-info">
      <strong>Thème :</strong> ${livret.theme}
    </div>
    
    <div class="resultat-info">
      <strong>ID :</strong> ${livret.id}
    </div>

    <div class="consigne-box">
      <h3>📝 Consigne de l'exercice</h3>
      <p>${livret.consigne}</p>
    </div>
  `;

  resultatDiv.classList.add("show");
}

// ═══════════════════════════════════════════════════
// FONCTION POUR AFFICHER UNE ERREUR
// ═══════════════════════════════════════════════════
function afficherErreur(message) {
  resultatDiv.innerHTML = `
    <div class="error">
      ❌ ${message}
    </div>
  `;
  resultatDiv.classList.add("show");
}

// ═══════════════════════════════════════════════════
// GESTION DU FORMULAIRE
// ═══════════════════════════════════════════════════
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Empêcher le rechargement de la page

  // Récupérer les valeurs du formulaire
  const prenom = prenomInput.value.trim();
  const theme = themeSelect.value;

  // Validation
  if (!prenom || !theme) {
    afficherErreur("Veuillez remplir tous les champs");
    return;
  }

  // Ajouter un effet de chargement
  form.classList.add("loading");
  resultatDiv.classList.remove("show");

  try {
    // Appeler l'API
    const data = await creerLivret(prenom, theme);

    // Afficher le résultat
    afficherResultat(data);
  } catch (error) {
    // Afficher l'erreur
    afficherErreur(error.message);
  } finally {
    // Retirer l'effet de chargement
    form.classList.remove("loading");
  }
});

// ═══════════════════════════════════════════════════
// TEST DE CONNEXION À L'API AU CHARGEMENT
// ═══════════════════════════════════════════════════
async function testerAPI() {
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    console.log("✅ API connectée:", data.message);
  } catch (error) {
    console.error(
      "❌ API non accessible. Assurez-vous que le serveur est démarré (npm run dev)",
    );
  }
}

// Tester la connexion au chargement de la page
testerAPI();
