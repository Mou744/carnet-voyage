# Carnet de voyage

Carnet de bord personnel, hors ligne : lieux, visites, dépenses et achats.
Application web autonome, sans build, sans dépendance externe, sans backend.

**L'app (pour moi) :** https://mou744.github.io/carnet-voyage/carnet/voyage.html
**Le carnet public (pour la famille) :** https://mou744.github.io/carnet-voyage/

À ouvrir sur le téléphone, puis à installer sur l'écran d'accueil (Safari →
Partager → *Sur l'écran d'accueil* ; Chrome → menu → *Installer l'application*).
L'installation déclenche le mode hors ligne complet et protège les données
contre l'effacement automatique du navigateur.

## Où sont mes données

Dans IndexedDB, sur le téléphone. Rien n'est envoyé nulle part : ce dépôt ne
contient que le code de l'application.

## Structure

    carnet/voyage.html            l'application entière (HTML + CSS + JS inline)
    carnet/manifest.webmanifest   PWA installable
    carnet/sw.js                  service worker, cache-first
    carnet/icone-*.png            icônes d'installation

## État

Phase 3 — partage (viewer public, export, publication GitHub).
Phase 2 — argent (totaux, par personne, budget).
Phase 1 — saisie et consultation.
