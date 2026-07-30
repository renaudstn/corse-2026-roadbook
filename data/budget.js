(() => {
  const DATA = window.CORSE2026;
  if (!DATA) return;

  const party = {
    adults: 2,
    children: 2,
    ages: [5, 8],
    label: "2 adultes + enfants 5 et 8 ans",
    vehicles: "1 camping-car + 1 voiture",
  };

  const assumptions = [
    "Budget « sur place » uniquement : hors location camping-car, ferry/avion, assurance.",
    "Tarifs haute saison août, sources 2025–2026 (sites campings, offices, opérateurs bateaux).",
    "Diesel Corse retenu à ~1,95 €/L (île souvent plus chère que le continent).",
    "Conso indicative : camping-car ~12 L/100 km · voiture ~7,5 L/100 km.",
    "Repas : mélange courses camping + ~5 sorties resto/pizzeria famille.",
    "Fourchettes bas / milieu / haut = incertitude réelle (affluence, options, météo).",
  ];

  /** Helpers */
  const item = (o) => o;

  const sumItems = (items, key = "mid") =>
    items.reduce((acc, it) => acc + (Number(it[key]) || 0), 0);

  const campingMain = [
    item({
      id: "sagone",
      label: "Nuit-étape Sagone / Vico",
      detail: "1 nuit CC famille (estimation secteur côte ouest HS)",
      mid: 35,
      low: 28,
      high: 45,
      confidence: "low",
      source: "Estimation camping côtier HS",
    }),
    item({
      id: "acciola",
      label: "L’Acciola (Évisa)",
      detail: "4 nuits · base ~19–20 €/2 pers. + 2 enfants + élec. → ~40 €/nuit famille",
      mid: 160,
      low: 140,
      high: 185,
      confidence: "mid",
      source: "MeinWoMo / retours camping 3★ altitude",
    }),
    item({
      id: "bartho",
      label: "Chez Bartho (Corte)",
      detail: "3 nuits · ~25 €/2 pers. + extra + élec. 4 € → ~42 €/nuit famille",
      mid: 126,
      low: 110,
      high: 150,
      confidence: "mid",
      source: "Campercontact 2026 + retours terrain (~9 €/pers.)",
    }),
    item({
      id: "abbartello",
      label: "Abbartello (Olmeto)",
      detail: "5 nuits · 21,90 €/2 pers. HS + enfants/élec. → ~40 €/nuit famille",
      mid: 200,
      low: 175,
      high: 240,
      confidence: "high",
      source: "Campercontact tarifs 07–08/2026",
    }),
    item({
      id: "taxe",
      label: "Taxe de séjour",
      detail: "~0,20–0,60 €/pers./nuit × 13 nuits × 4",
      mid: 25,
      low: 15,
      high: 40,
      confidence: "mid",
      source: "Ordre de grandeur communes corses",
    }),
  ];

  const fuelMain = [
    item({
      id: "fuel-cc",
      label: "Diesel camping-car",
      detail: "~300 km transferts (Ajaccio↔bases) · 12 L/100 · 1,95 €/L",
      mid: 70,
      low: 58,
      high: 85,
      confidence: "mid",
      source: "OSRM trajets + conso CC montagne",
    }),
    item({
      id: "fuel-car",
      label: "Diesel / essence voiture",
      detail: "~850 km (transferts suivis + sorties jour) · 7,5 L/100 · 1,95 €/L",
      mid: 125,
      low: 105,
      high: 155,
      confidence: "mid",
      source: "OSRM sorties programme principal",
    }),
    item({
      id: "fuel-buffer",
      label: "Marge essence (bouchons, erreurs, errances)",
      detail: "+12 % sur carburant",
      mid: 25,
      low: 15,
      high: 40,
      confidence: "low",
      source: "Marge sécurité août",
    }),
  ];

  const activitiesMain = [
    item({
      id: "scandola",
      label: "Bateau Scandola / Girolata (Porto)",
      detail: "HS ~55 €/adulte · ~40 €/enfant 5–8 · départ Porto 2 h 30",
      mid: 190,
      low: 160,
      high: 230,
      confidence: "high",
      source: "Opérateurs Porto 2025 (Corse Adrénaline, Alpana, etc.)",
    }),
    item({
      id: "bonifacio-boat",
      label: "Bateau falaises / grottes Bonifacio (option)",
      detail: "~20–25 €/adulte · ~12–18 €/enfant · 1 h",
      mid: 75,
      low: 0,
      high: 95,
      confidence: "mid",
      source: "Promenades en mer Bonifacio (fourchette)",
      optional: true,
    }),
    item({
      id: "filitosa",
      label: "Filitosa (site + musée)",
      detail: "9 € adulte · 7 € (6–17) · −6 ans gratuit → ~25 €",
      mid: 25,
      low: 18,
      high: 28,
      confidence: "high",
      source: "filitosa.fr tarifs officiels",
    }),
    item({
      id: "bonifacio-park",
      label: "Parkings (Bonifacio, plages, centres)",
      detail: "Bonifacio 15–25 € + plages/villages cumulés",
      mid: 45,
      low: 25,
      high: 70,
      confidence: "mid",
      source: "Tarifs parkings été Corse",
    }),
  ];

  const foodMain = [
    item({
      id: "groceries",
      label: "Courses / supermarché",
      detail: "14 jours · ~45–55 €/j famille (Corse = panier cher)",
      mid: 700,
      low: 560,
      high: 850,
      confidence: "mid",
      source: "Panier familial HS Corse",
    }),
    item({
      id: "restaurants",
      label: "Restaurants / pizzerias",
      detail: "5 sorties · ~95–110 € la table famille (2A+2E)",
      mid: 500,
      low: 380,
      high: 650,
      confidence: "mid",
      source: "Ticket moyen resto familial Corse",
    }),
    item({
      id: "snacks",
      label: "Glaces, cafés, boulanger",
      detail: "Quotidien léger + pain matin Abbartello",
      mid: 160,
      low: 100,
      high: 220,
      confidence: "mid",
      source: "Estimation terrain",
    }),
  ];

  const miscMain = [
    item({
      id: "laundry",
      label: "Lave-linge / jetons",
      detail: "2 lessives × ~6 €",
      mid: 12,
      low: 6,
      high: 20,
      confidence: "high",
      source: "Tarifs campings courants",
    }),
    item({
      id: "contingency",
      label: "Imprévus",
      detail: "Pharmacie, bricolage, remplacement matériel, pourboires",
      mid: 120,
      low: 60,
      high: 200,
      confidence: "low",
      source: "Marge voyage",
    }),
  ];

  const build = (categories) => {
    const cats = categories.map((c) => ({
      ...c,
      subtotal: {
        mid: sumItems(c.items, "mid"),
        low: sumItems(c.items, "low"),
        high: sumItems(c.items, "high"),
      },
    }));
    const totals = cats.reduce(
      (acc, c) => ({
        mid: acc.mid + c.subtotal.mid,
        low: acc.low + c.subtotal.low,
        high: acc.high + c.subtotal.high,
      }),
      { mid: 0, low: 0, high: 0 }
    );
    return { categories: cats, totals };
  };

  const mainBuilt = build([
    { id: "camping", label: "Campings & taxes", items: campingMain },
    { id: "fuel", label: "Carburant", items: fuelMain },
    { id: "activities", label: "Activités & tickets", items: activitiesMain },
    { id: "food", label: "Nourriture", items: foodMain },
    { id: "misc", label: "Divers", items: miscMain },
  ]);

  DATA.budget = {
    id: "main",
    title: "Budget séjour (programme principal)",
    updated: "2026-07-30",
    party,
    assumptions,
    ...mainBuilt,
    perDay: {
      mid: Math.round(mainBuilt.totals.mid / 14),
      low: Math.round(mainBuilt.totals.low / 14),
      high: Math.round(mainBuilt.totals.high / 14),
    },
    excluded: [
      "Location du camping-car",
      "Ferry / avion A/R continent",
      "Assurance voyage / annulation",
      "Péages continent avant embarquement",
    ],
  };

  /* ---------- Variante best-of deltas ---------- */
  const fuelAlt = [
    item({
      id: "fuel-cc",
      label: "Diesel camping-car",
      detail: "Mêmes transferts CC (~300 km)",
      mid: 70,
      low: 58,
      high: 85,
      confidence: "mid",
      source: "OSRM",
    }),
    item({
      id: "fuel-car",
      label: "Diesel / essence voiture",
      detail: "~950 km (Bavella + Rondinara/PV + sunset) · 7,5 L/100 · 1,95 €/L",
      mid: 140,
      low: 120,
      high: 175,
      confidence: "mid",
      source: "OSRM variante best-of",
    }),
    item({
      id: "fuel-buffer",
      label: "Marge essence",
      detail: "+12 %",
      mid: 25,
      low: 15,
      high: 40,
      confidence: "low",
      source: "Marge",
    }),
  ];

  const activitiesAlt = [
    item({
      id: "scandola",
      label: "Bateau Scandola / Girolata (Porto)",
      detail: "Identique programme principal",
      mid: 190,
      low: 160,
      high: 230,
      confidence: "high",
      source: "Opérateurs Porto",
    }),
    item({
      id: "restonica",
      label: "Navette Restonica C13",
      detail: "4 € A/R / adulte · −8 ans gratuit → 2 × 4 €",
      mid: 8,
      low: 8,
      high: 16,
      confidence: "high",
      source: "isula.corsica / Via Corsica 2026",
    }),
    item({
      id: "filitosa-opt",
      label: "Filitosa (option courte)",
      detail: "Souvent skippée dans la variante → budget bas 0",
      mid: 12,
      low: 0,
      high: 28,
      confidence: "mid",
      source: "filitosa.fr",
      optional: true,
    }),
    item({
      id: "polischellu",
      label: "Guide Polischellu (option)",
      detail: "~50 €/pers. · souvent dès 8 ans · 2A+enfant 8 ≈ 150 €",
      mid: 0,
      low: 0,
      high: 160,
      confidence: "mid",
      source: "Prestataires canyon Bavella 45–55 €",
      optional: true,
    }),
    item({
      id: "parkings-alt",
      label: "Parkings (Rondinara, PV, Bavella)",
      detail: "Plages sud-est souvent payantes en HS",
      mid: 35,
      low: 20,
      high: 60,
      confidence: "mid",
      source: "Parkings plages PV / col",
    }),
  ];

  const altBuilt = build([
    { id: "camping", label: "Campings & taxes", items: campingMain },
    { id: "fuel", label: "Carburant", items: fuelAlt },
    { id: "activities", label: "Activités & tickets", items: activitiesAlt },
    { id: "food", label: "Nourriture", items: foodMain },
    { id: "misc", label: "Divers", items: miscMain },
  ]);

  DATA.budgetAlt = {
    id: "alt",
    title: "Budget séjour (variante best-of)",
    updated: "2026-07-30",
    party,
    assumptions: [
      ...assumptions,
      "Sans Bonifacio bateau ; avec navette Restonica ; Polischellu guidé en option (haut de fourchette).",
      "Plus de km voiture (Bavella, Rondinara, Porto-Vecchio) → carburant un peu plus élevé.",
    ],
    ...altBuilt,
    perDay: {
      mid: Math.round(altBuilt.totals.mid / 14),
      low: Math.round(altBuilt.totals.low / 14),
      high: Math.round(altBuilt.totals.high / 14),
    },
    excluded: DATA.budget.excluded,
    vsMain: {
      mid: altBuilt.totals.mid - mainBuilt.totals.mid,
      note: "Écart milieu vs programme principal (négatif = moins cher).",
    },
  };

  /* Day-level hints (mid, programme principal) */
  const dayCosts = {
    d03: { mid: 55, note: "Nuit Sagone + dîner froid courses" },
    d04: { mid: 95, note: "Nuit Acciola + courses installation + Aïtone gratuit" },
    d05: { mid: 85, note: "Essence Piana/Ficajola + pique-nique + nuit" },
    d06: { mid: 280, note: "Bateau Scandola famille + essence Porto + nuit" },
    d07: { mid: 80, note: "Spelunca/Aïtone + plein + nuit" },
    d08: { mid: 110, note: "Essence transfert Vergio + nuit Bartho + restos éventuels" },
    d09: { mid: 75, note: "Restonica/Tavignano surtout gratuit + nuit" },
    d10: { mid: 90, note: "Essence Vizzavona + pique-nique + nuit" },
    d11: { mid: 120, note: "Gros transfert CC+voiture + nuit Abbartello" },
    d12: { mid: 100, note: "Filitosa ~25 € + Cupabia + nuit" },
    d13: { mid: 200, note: "Essence Bonifacio + parking + bateau option + resto" },
    d14: { mid: 95, note: "Campomoro + pique-nique + nuit" },
    d15: { mid: 110, note: "Roccapina/Sartène + possible resto + nuit" },
    d16: { mid: 90, note: "Essence restitution + snacks (sans nuit)" },
  };

  const dayCostsAlt = {
    ...dayCosts,
    d09: { mid: 85, note: "Navette Restonica 8 € + pique-nique + nuit" },
    d12: { mid: 85, note: "Cupabia prioritaire (Filitosa option)" },
    d13: { mid: 130, note: "Bavella + essence ; +150 € si guide Polischellu" },
    d14: { mid: 140, note: "Rondinara + parking + soir PV + essence longue" },
    d15: { mid: 100, note: "Campomoro + Roccapina sunset" },
  };

  DATA._dayCostsMain = dayCosts;
  DATA._dayCostsAlt = dayCostsAlt;
})();
