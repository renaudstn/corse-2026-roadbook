window.CORSE2026_ALT = {
  meta: {
    title: "Corse 2026 · Variante best-of",
    subtitle: "Programme alternatif — mêmes campings & dates",
    dates: "3 → 16 août 2026",
    note:
      "Cette page n’efface pas le programme principal. Elle propose une variante « plus de sites spectaculaires » tout en gardant L’Acciola, Chez Bartho et Abbartello. Les Calanques de Piana sont conservées (choix famille).",
  },

  principles: [
    {
      title: "Ce qu’on conserve absolument",
      items: [
        "Calanques de Piana + Ficajola (jour 5)",
        "Piscines d’Aïtone (base Évisa)",
        "Col de Vergio (passage transfert 8)",
        "Cupabia",
        "Campings & dates inchangés",
      ],
    },
    {
      title: "Ce qu’on ajoute (inspiré best-of)",
      items: [
        "Lacs Melo / Capitello en option ambitieuse (Restonica)",
        "Verghellu comme journée eau/cascades",
        "Polischellu + Bavella",
        "Rondinara / Palombaggia (+ Santa Giulia si énergie)",
        "Soirée Porto-Vecchio",
        "Coucher de soleil Campomoro ou Roccapina",
      ],
    },
    {
      title: "Ce qu’on retire ou reporte",
      items: [
        "Bonifacio n’est plus le « grand jour » sud (trop de route vs Bavella/plages)",
        "Filitosa devient option courte, pas le cœur de journée",
        "Vizzavona passe en repli si Verghellu ou Restonica saturés",
      ],
    },
  ],

  meloFallback: {
    title: "Replis Melo & Capitello",
    intro:
      "Avec enfants de 5 et 8 ans, Melo est déjà très exigeant ; Capitello est souvent trop long. Toujours vérifier accès / navette Restonica la veille et le matin.",
    options: [
      {
        id: "A",
        name: "Restonica basse + vasques",
        replaces: "Remplace la montée aux lacs Melo / Capitello",
        when: "Accès Restonica ouvert, mais chaleur, fatigue, ou marche trop longue",
        detail:
          "Navette / parking selon règles du jour → balade rivière + baignade dans les vasques du fond de vallée → retour avant 12 h. Même secteur, sans l’objectif lacs.",
      },
      {
        id: "B",
        name: "Tavignano depuis Chez Bartho",
        replaces: "Remplace toute la journée Restonica",
        when: "Restonica fermée, navette KO, ou départ trop tardif",
        detail:
          "Départ à pied depuis le camping → sentier Tavignano 2–3 h A/R familial → baignade zone sûre → repos après-midi. Excellent plan principal de repli.",
      },
      {
        id: "C",
        name: "Verghellu (cascades & vasques)",
        replaces: "Remplace Restonica / les lacs si le massif est fermé ou trop dur",
        when: "Envie d’eau spectaculaire sans viser Melo, ou jour 9 raté",
        detail:
          "Basculer le « jour eau montagne » sur Verghellu (prévu en variante jour 10). Vérifier accès / feux. Vizzavona devient alors le plan B de cette journée.",
      },
    ],
  },

  days: [
    {
      id: "a03",
      date: "2026-08-03",
      weekday: "Lundi",
      dayNum: 3,
      title: "Arrivée Ajaccio → nuit-étape",
      base: "Sagone / Vico",
      intensity: 1,
      summary: "Identique au programme principal : débarquement, transfert court, installation minimale.",
      changes: [
        { type: "keep", text: "Conserve l’arrivée minimale — aucun tourisme le soir." },
      ],
      plan: [
        "20 h Ajaccio → regroupement → Sagone/Vico",
        "Installation silencieuse, dîner froid, coucher",
      ],
    },
    {
      id: "a04",
      date: "2026-08-04",
      weekday: "Mardi",
      dayNum: 4,
      title: "L’Acciola + piscines d’Aïtone",
      base: "L’Acciola · Évisa",
      intensity: 2,
      summary: "Ancrage altitude + première baignade nature. Aïtone reste incontournable.",
      changes: [
        { type: "keep", text: "Conserve Aïtone (Top piscines naturelles)." },
        { type: "keep", text: "Conserve l’installation camping-car prioritaire le matin." },
      ],
      plan: [
        "Transfert Sagone → Vico → Évisa / L’Acciola",
        "Courses + installation",
        "Après-midi : piscines d’Aïtone (eau froide, adulte au contact)",
      ],
    },
    {
      id: "a05",
      date: "2026-08-05",
      weekday: "Mercredi",
      dayNum: 5,
      title: "Calanques de Piana & Ficajola",
      base: "L’Acciola · Évisa",
      intensity: 3,
      summary:
        "Journée signature côte ouest. Conservée volontairement (contrairement à certains road-trips « best-of 7 jours » qui la sautent pour gagner du temps).",
      changes: [
        {
          type: "keep",
          text: "Conserve les Calanques de Piana — choix explicite de cette variante famille.",
        },
        { type: "keep", text: "Conserve Ficajola pour la baignade longue." },
        {
          type: "note",
          text: "Ne remplace rien du programme principal : c’est le même grand jour ouest.",
        },
      ],
      plan: [
        "Départ tôt → calanques (arrêts autorisés seulement)",
        "Piana → descente Ficajola → plage / pique-nique",
        "Retour Évisa avant fatigue",
      ],
    },
    {
      id: "a06",
      date: "2026-08-06",
      weekday: "Jeudi",
      dayNum: 6,
      title: "Scandola & Girolata en bateau",
      base: "L’Acciola · Évisa",
      intensity: 3,
      summary: "Sortie mer UNESCO depuis Porto. Après-midi légère.",
      changes: [
        { type: "keep", text: "Conserve la sortie bateau Scandola / Girolata." },
        {
          type: "alt",
          text: "Si bateau annulé (météo) → Aïtone + belvédères Porto / Piana sans forcer.",
        },
      ],
      plan: [
        "Départ tôt Porto → check-in → sortie bateau",
        "Déjeuner Porto → option plage / tour génoise",
        "Retour camping",
      ],
    },
    {
      id: "a07",
      date: "2026-08-07",
      weekday: "Vendredi",
      dayNum: 7,
      title: "Aïtone + Spelunca (préparation départ)",
      base: "L’Acciola · Évisa",
      intensity: 3,
      summary: "Dernière journée montagne ouest : eau d’Aïtone + pont de Spelunca, puis prêt départ Bartho.",
      changes: [
        { type: "keep", text: "Conserve Aïtone + Spelunca (jusqu’au pont de Zaglia)." },
        { type: "keep", text: "Conserve l’appel Chez Bartho + rangement pour le 8." },
      ],
      plan: [
        "Châtaigniers / Aïtone le matin",
        "Spelunca A/R limité au pont",
        "Carburant, courses, appel Bartho, rangement",
      ],
    },
    {
      id: "a08",
      date: "2026-08-08",
      weekday: "Samedi",
      dayNum: 8,
      title: "Transfert Vergio → Chez Bartho",
      base: "Chez Bartho · Corte",
      intensity: 3,
      summary: "Priorité places chez Bartho. Col de Vergio valorisé comme point de vue (pause un peu plus longue).",
      changes: [
        { type: "keep", text: "Conserve le départ 7 h 15 et la cible ~9 h 30 chez Bartho." },
        {
          type: "add",
          text: "Ajoute une pause belvédère Col de Vergio (15–20 min max) — sans transformer le transfert en visite.",
        },
        {
          type: "replace",
          text: "Remplace l’arrêt « max 10 min » du programme principal par une courte pause paysage (si avance sur l’horaire).",
        },
      ],
      plan: [
        "07 h 15 départ L’Acciola via D84",
        "Col de Vergio : photos / étirement si marge",
        "Arrivée Bartho → installation → Corte / Tavignano détente",
      ],
    },
    {
      id: "a09",
      date: "2026-08-09",
      weekday: "Dimanche",
      dayNum: 9,
      title: "Restonica ambitieuse : Melo (+ Capitello)",
      base: "Chez Bartho · Corte",
      intensity: 5,
      summary:
        "Journée « best-of montagne ». Objectif Melo si accès ouvert et forme OK. Capitello seulement si les enfants suivent encore après Melo.",
      changes: [
        {
          type: "add",
          text: "Ajoute l’objectif lacs Melo / Capitello (absents du programme principal familial).",
        },
        {
          type: "replace",
          text: "Remplace la journée « Restonica conditionnelle / Tavignano » par une tentative lacs, avec replis clairs.",
        },
        {
          type: "alt",
          text: "Si lacs impossibles → voir encadré Replis A/B/C (Restonica basse, Tavignano, ou Verghellu).",
        },
      ],
      plan: [
        "Décision veille 18 h + contrôle matin (accès / navette / feux)",
        "Départ très tôt → Restonica",
        "Cible : Melo ; Capitello uniquement si marge et moral OK",
        "Retour début d’après-midi → repos camping",
      ],
      caution:
        "Avec 5 et 8 ans, abandonner Capitello (voire Melo) n’est pas un échec. Le repli est prévu pour ça.",
    },
    {
      id: "a10",
      date: "2026-08-10",
      weekday: "Lundi",
      dayNum: 10,
      title: "Verghellu (principal) · Vizzavona (repli)",
      base: "Chez Bartho · Corte",
      intensity: 3,
      summary: "Cascades et vasques du Verghellu en programme principal. Vizzavona si accès / énergie insuffisants.",
      changes: [
        {
          type: "replace",
          text: "Remplace Vizzavona (principal) + Verghellu (option) par Verghellu (principal) + Vizzavona (repli).",
        },
        {
          type: "add",
          text: "Ajoute Verghellu comme journée eau « Top » après Restonica.",
        },
        {
          type: "alt",
          text: "Si jour 9 a déjà basculé sur Verghellu → faire Vizzavona / cascade des Anglais ici.",
        },
      ],
      plan: [
        "Départ matin frais → Verghellu",
        "Cascades / vasques, pique-nique, retour Corte",
        "Plan B : Vizzavona + cascade des Anglais",
      ],
    },
    {
      id: "a11",
      date: "2026-08-11",
      weekday: "Mardi",
      dayNum: 11,
      title: "Corte → Abbartello (la mer)",
      base: "Abbartello · Olmeto",
      intensity: 2,
      summary: "Transfert camping-car inchangé. Aucune visite en route.",
      changes: [
        { type: "keep", text: "Conserve le transfert direct et l’installation 5 nuits." },
        { type: "keep", text: "Conserve la plage Abbartello l’après-midi pour récupérer." },
      ],
      plan: [
        "Check-out Bartho → route vers Olmeto-Plage",
        "Installation → plage à pied → courses si besoin",
      ],
    },
    {
      id: "a12",
      date: "2026-08-12",
      weekday: "Mercredi",
      dayNum: 12,
      title: "Cupabia (cœur) · Filitosa (option courte)",
      base: "Abbartello · Olmeto",
      intensity: 2,
      summary: "Priorité plage emblématique Cupabia. Filitosa seulement en visite courte au frais si envie culture.",
      changes: [
        { type: "keep", text: "Conserve Cupabia (plage best-of accessible depuis Abbartello)." },
        {
          type: "replace",
          text: "Remplace le duo équilibré Filitosa + Cupabia par Cupabia prioritaire ; Filitosa devient option ≤ 1 h 30.",
        },
      ],
      plan: [
        "Option 09 h : Filitosa rapide",
        "Sinon départ direct Cupabia",
        "Longue baignade / pique-nique → retour camping",
      ],
    },
    {
      id: "a13",
      date: "2026-08-13",
      weekday: "Jeudi",
      dayNum: 13,
      title: "Bavella + Polischellu",
      base: "Abbartello · Olmeto",
      intensity: 4,
      summary:
        "Grande journée sud montagne/eau : col & aiguilles de Bavella, puis vasques de Polischellu (2–3 h sur place).",
      changes: [
        {
          type: "replace",
          text: "Remplace la journée Bonifacio par Bavella + Polischellu (sites best-of absents du programme principal).",
        },
        {
          type: "add",
          text: "Ajoute Polischellu (Top vasques du sud) et points de vue Bavella.",
        },
        {
          type: "note",
          text: "Bonifacio n’est plus dans cette variante (trop de route le même jour que Bavella/plages). Il reste dans le programme principal.",
        },
      ],
      plan: [
        "Départ 7 h → col de Bavella (points de vue)",
        "Polischellu 2–3 h (vasques, vigilance glissade / monde)",
        "Retour Abbartello sans autre activité",
      ],
    },
    {
      id: "a14",
      date: "2026-08-14",
      weekday: "Vendredi",
      dayNum: 14,
      title: "Rondinara · Palombaggia · soir Porto-Vecchio",
      base: "Abbartello · Olmeto",
      intensity: 4,
      summary: "Plages emblématiques du sud-est, puis passage / dîner léger à Porto-Vecchio.",
      changes: [
        {
          type: "replace",
          text: "Remplace Campomoro (tour + plage) par Rondinara + Palombaggia (+ Santa Giulia si énergie).",
        },
        { type: "add", text: "Ajoute un arrêt / soirée Porto-Vecchio." },
        {
          type: "alt",
          text: "Si parking saturé → une seule plage (Rondinara prioritaire) + retour plus tôt.",
        },
      ],
      plan: [
        "Départ tôt → Rondinara (matin)",
        "Palombaggia en début d’après-midi (ou Santa Giulia en plan B famille)",
        "Fin de journée : Porto-Vecchio (glace / balade port) → retour Abbartello",
      ],
    },
    {
      id: "a15",
      date: "2026-08-15",
      weekday: "Samedi",
      dayNum: 15,
      title: "Campomoro le jour · Roccapina au coucher",
      base: "Abbartello · Olmeto",
      intensity: 3,
      summary: "Côte proche : plage / tour Campomoro, puis belvédère ou plage Roccapina pour le coucher de soleil.",
      changes: [
        {
          type: "replace",
          text: "Remplace Roccapina + Sartène « journée classique » par Campomoro journée + Roccapina sunset.",
        },
        {
          type: "add",
          text: "Ajoute un coucher de soleil dédié (Campomoro ou Roccapina selon météo / foule du 15 août).",
        },
        {
          type: "alt",
          text: "Si 15 août saturé à Roccapina → rester Campomoro jusqu’au sunset (remplace le déplacement Roccapina).",
        },
      ],
      plan: [
        "Matin : Campomoro (tour si fraîcheur, puis plage)",
        "Fin d’après-midi : route Roccapina pour belvédère / sunset",
        "Retour + préparation restitution du 16",
      ],
    },
    {
      id: "a16",
      date: "2026-08-16",
      weekday: "Dimanche",
      dayNum: 16,
      title: "Retour & restitution camping-car",
      base: "Abbartello → Ajaccio",
      intensity: 3,
      summary: "Identique au programme principal : marge avant midi, aucun tourisme.",
      changes: [
        { type: "keep", text: "Conserve restitution cible 12 h avec 2 h de marge." },
      ],
      plan: [
        "Check-out → carburant → restitution Ajaccio",
        "Documents / photos / clés accessibles",
      ],
    },
  ],
};
