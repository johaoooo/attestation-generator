# 📄 RAPPORT DE REFONTE & DOCUMENTATION TECHNIQUE — DOCSTUDIO PME ALL-IN-ONE

**Projet** : DocStudio PME — Suite Marketing & Documents All-in-One  
**Localisation** : `/home/joe/generateur-attestation`  
**Technologies** : React 19, Vite 8, Tailwind CSS v4, html2canvas, jsPDF  
**Date de la refonte** : Août 2026  

---

## 1. Vision & Objectif de la Refonte

**DocStudio PME** est une suite complète de création visuelle et documentaire spécialement conçue pour les responsables marketing et dirigeants de PME. 
Elle élimine le besoin d'utiliser séparément des outils lourds comme Canva ou Photoshop en regroupant **dans un seul environnement web ultra-rapide et sécurisé** :

1. 🎨 **Studio Canva & Photoshop PME (Visual Marketing Studio)** :
   - Éditeur visuel interactif avec **Glisser-Déposer (Drag & Drop)**, calques (Layers), et retouches d'images.
   - 7 Formats marketing : Posts Instagram/FB (1:1), Story WhatsApp/Insta (9:16), Bannière Web/LinkedIn (16:9), Affiche Événement A4, Flyer A5, Cartes de visite et Badges.
   - Presets de modèles PME prêts à l'emploi (Lancement de produit, Solde -50%, Atelier/Masterclass, Offre promo).

2. 🏢 **Brand Kit & Charte Graphique PME Centralisée** :
   - Enregistrement unique de la charte de la PME : Logo, Sceau/Tampon officiel, Signature de la Direction, Palette de couleurs, IFU, RCCM, RIB/MoMo, Coordonnées.
   - Injection **automatique et instantanée** de ces visuels et informations dans TOUS les documents et visuels créés.

3. 🎴 **Générateur de Cartes de Visite PME** :
   - Cartes Recto / Verso avec QR Code dynamique vers le site web ou MoMo.
   - Exportation en planche A4 de **10 cartes par page** prête pour impression HD.

4. 💼 **Générateurs Administratifs, Ventes & RH** :
   - Factures & Proformas (calculs automatiques HT/TVA/TTC, acompte, RIB/MoMo).
   - Courriers officiels (conforme aux normes administratives et AFNOR).
   - Attestations de formation & Certificats de réussite (sceaux de cire, dorures et import CSV).
   - CV professionnels & Rapports d'activité multi-pages.

---

## 2. Architecture de la Codebase

```
generateur-attestation/
├── src/
│   ├── App.jsx                       # Routeur principal & gestionnaire du Brand Kit Modal
│   ├── index.css                     # Design system CSS Studio Dark & Glassmorphism
│   ├── utils/
│   │   └── brandStore.js             # Gestionnaire centralisé du Brand Kit PME (LocalStorage + Custom Events)
│   ├── components/
│   │   ├── BrandKitModal.jsx         # Fenêtre modale d'édition de la Charte Graphique PME
│   │   ├── CanvaStudio.jsx           # Studio Canva & Photoshop (Drag & Drop, Calques, Presets, Export PNG/PDF)
│   │   ├── CarteVisiteGenerator.jsx  # Générateur de Cartes de Visite (Recto/Verso, Planche A4 PDF)
│   │   ├── HomeHub.jsx               # Dashboard Hub PME réinventé
│   │   ├── Navbar.jsx                # Barre de navigation avec bouton Charte PME
│   │   ├── FactureGenerator.jsx      # Générateur de Factures & Proformas
│   │   ├── CourrierGenerator.jsx     # Générateur de Courriers Officiels
│   │   ├── AfficheGenerator.jsx      # Générateur d'Affiches Événementielles
│   │   ├── CvGenerator.jsx           # Générateur de CV
│   │   ├── RapportMemoireGenerator.jsx # Générateur de Rapports & Mémoires
│   │   └── Icons.jsx                 # Bibliothèque d'icônes SVG vectorielles HD
├── docstudio.md                      # Documentation technique du projet
├── package.json
└── vite.config.js
```

---

## 3. Validation de Compilation

- **Commande de Build** : `npm run build`
- **Résultat** : `✓ built in 1.20s` — **0 erreur**.
- **Serveur Dev** : Lancé sur le port 5180 (`http://localhost:5180`).
