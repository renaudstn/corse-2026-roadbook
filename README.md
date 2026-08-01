# Corse 2026 — Roadbook

Site web familial pour le voyage en Corse du **3 au 16 août 2026**.

Site publié : https://renaudstn.github.io/corse-2026-roadbook/index.html#accueil

## Utilisation

1. Ouvrir le site sur le téléphone (idéalement « Ajouter à l’écran d’accueil »)
2. Fonctionne **hors ligne** après la première ouverture (PWA ; polices système en secours)
3. Bouton **Programme** / **Aujourd’hui** pour aller au jour utile
4. Navigation basse : Vue d’ensemble · Programme · Campings · Plus
5. Check-list sauvegardée localement sur l’appareil

## Contenu

- Un seul programme principal recommandé (horaires, vigilance, plans B structurés)
- **4 étapes d’hébergement** : nuit-étape Sagone/Vico, L’Acciola, Chez Bartho, Abbartello
- Page [Variantes & replis](./alt.html) pour météo / accès / option sportive (pas un second roadbook)
- Budget estimé, contacts, logistique

## Scénario sud

**Bonifacio seul le 13 · Campomoro le 14 · Roccapina + Sartène le 15**  
(détails dans `CHANGELOG.md` et `meta.scenarioSouthWhy`)

## Technique

Site statique (HTML / CSS / JS) pour GitHub Pages.

- Données : `data/trip.js`
- Rendu : `assets/app.js`
- Styles : `assets/styles.css`
- Historique des changements : `CHANGELOG.md`
