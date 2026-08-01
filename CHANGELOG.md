# Changelog — Corse 2026 Roadbook

## 2026-08-01 — Audit + programme + UX

### Choix d’itinéraire

- **Scénario sud B retenu** : Bonifacio seul le 13 · Campomoro récupération le 14 · Roccapina (courte) + Sartène (déjeuner / balade) le 15.
- Motif : avec des enfants de 5 et 8 ans, cumuler Roccapina et Bonifacio le même jour reste trop dense en août (parking, chaleur, fatigue). La répétition partielle de route vers le sud est acceptée et expliquée.
- **5 août** : Calanques de Piana détaillées (Porto, arrêts autorisés, belvédère, marche courte, Piana, Ficajola optionnelle) + repli plage de Porto.
- **6 août** : Scandola priorise la réservation, le port de Porto, la marge −30 min, navigation ≠ temps total ; plan B météo distinct de Piana.
- **7 août** : journée légère d’équilibre (une seule sortie) + préparation Bartho.
- **8 août** : priorité logistique renforcée (cible 9 h 30, avant midi, replis nommés).
- **9 août** : trois niveaux — Plan A Restonica basse · option sportive Melo/Capitello conditionnelle · Plan B Tavignano valorisé.
- **10 août** : programme principal local à Corte (citadelle / musée) ; Vizzavona et Tavignano en options.
- **Réservations inchangées** : Sagone/Vico (3), L’Acciola (4→8), Chez Bartho (8→11), Abbartello (11→16).

### Changements UX

- Cartes journalières en 3 niveaux (essentiel / détails / accordéons).
- Alertes critiques toujours visibles.
- Navigation basse mobile (Vue d’ensemble · Programme · Campings · Plus).
- Sélecteur de jour explicite (ne ouvre plus le menu latéral).
- Vue d’ensemble calculée (14 jours, 13 nuits, **4 étapes**, distances numériques, check-list).
- Desktop ~1180 px avec colonne sticky carte / métriques.
- Hero mobile réduit (~80–82 svh) + prochaine étape + CTA Programme.
- Page `alt.html` repositionnée en **Variantes & replis** (plus un second roadbook).

### Changements techniques

- Modèle de données enrichi : `travel`, `schedule`, `activity`, `highlights`, `alerts`, `alternatives`, `verify`, `map`.
- Stats et libellés dérivés des données (fin du « 3 bases » codé en dur).
- Budget carburant aligné (~406 km CC) ; date éditoriale via `meta.editorialDate`.
- Service worker `corse2026-v22` ; focus trap modale / drawer ; badges texte + couleur.

### Toujours dépendant du temps réel

- Accès Restonica / navette
- Restrictions incendie / massifs
- État de la piste Roccapina
- Disponibilité Chez Bartho (sans résa)
- Horaires / mer pour Scandola et bateau Bonifacio
- Tarifs Filitosa et parkings d’août
