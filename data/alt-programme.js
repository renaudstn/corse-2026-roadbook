(() => {
  const DATA = window.CORSE2026;
  if (!DATA) return;

  /* Extra POIs for the best-of variant */
  Object.assign(DATA.places, {
    bavella: {
      name: "Col de Bavella",
      lat: 41.795,
      lng: 9.224,
      info: "https://fr.wikipedia.org/wiki/Col_de_Bavella",
      infoLabel: "Wikipédia",
    },
    aiguilles: {
      name: "Aiguilles de Bavella",
      lat: 41.804,
      lng: 9.21,
      info: "https://fr.wikipedia.org/wiki/Aiguilles_de_Bavella",
      infoLabel: "Wikipédia",
    },
    polischellu: {
      name: "Polischellu",
      lat: 41.82,
      lng: 9.26,
      info: "https://les4mondes.fr/cascades-polischellu-guide-accès/",
      infoLabel: "Accès / règles",
    },
    rondinara: {
      name: "Rondinara",
      lat: 41.47,
      lng: 9.275,
      info: "https://guide.corsica/poi/sud/porto-vecchio/plage-rondinara",
      infoLabel: "Guide.Corsica",
    },
    palombaggia: {
      name: "Palombaggia",
      lat: 41.56,
      lng: 9.323,
      info: "https://fr.wikipedia.org/wiki/Palombaggia",
      infoLabel: "Wikipédia",
    },
    santaGiulia: {
      name: "Santa Giulia",
      lat: 41.525,
      lng: 9.275,
      info: "https://fr.wikipedia.org/wiki/Santa_Giulia",
      infoLabel: "Wikipédia",
    },
    portoVecchio: {
      name: "Porto-Vecchio",
      lat: 41.591,
      lng: 9.28,
      info: "https://fr.wikipedia.org/wiki/Porto-Vecchio",
      infoLabel: "Wikipédia",
    },
    melo: {
      name: "Lac de Melo",
      lat: 42.216,
      lng: 9.058,
      info: "https://www.horizonrando.fr/corse/lacs-de-melo-et-capitello/",
      infoLabel: "Guide terrain",
    },
    frasseta: {
      name: "Pont de Frasseta",
      lat: 42.275,
      lng: 9.12,
      info: "https://fr.wikipedia.org/wiki/Lac_de_Melo",
      infoLabel: "Wikipédia",
    },
    verhellu: {
      name: "Verghellu (pont du Vecchio)",
      lat: 42.22,
      lng: 9.18,
      info: "https://www.canyon-corse.com/Le-Canyon-du-Verghellu_a26.html",
      infoLabel: "Canyon (dès 10 ans)",
    },
  });

  DATA.mode = "alt";
  DATA.altMeta = {
    title: "Variante best-of",
    note:
      "Même roadbook (campings & dates), version plus « sites spectaculaires ». Calanques de Piana conservées. Melo/Capitello et Polischellu traités avec les contraintes réelles 2025–2026 (accès, guide, famille).",
  };

  DATA.meloFallback = {
    title: "Replis Melo & Capitello (réalistes en 2026)",
    intro:
      "Depuis les crues de 2023, la route Restonica s’arrête au pont de Frasseta. Melo ≈ 16–18 km A/R et 7–9 h ; Capitello encore plus. Inadapté à 5 et 8 ans. Les options ci-dessous remplacent l’objectif « lacs ».",
    options: [
      {
        id: "A",
        name: "Restonica basse (Frasseta / Tuani)",
        replaces: "Remplace la montée aux lacs Melo / Capitello",
        when: "Navette / accès ouverts, mais pas d’objectif lac",
        detail:
          "Navette Corte → Frasseta (réserver Via Corsica / M-Ticket, ~4 € A/R, −8 ans souvent gratuit). Marche rivière + baignade vasques du bas. Retour avant la chaleur.",
      },
      {
        id: "B",
        name: "Tavignano depuis Chez Bartho",
        replaces: "Remplace toute la journée Restonica",
        when: "Restonica fermée, navette KO, orage, ou enfants fatigués",
        detail:
          "Départ à pied du camping → sentier Tavignano 2–3 h familial → baignade zone sûre → repos. Excellent plan principal.",
      },
      {
        id: "C",
        name: "Vizzavona + cascade des Anglais",
        replaces: "Remplace Restonica si vous voulez de l’eau en forêt sans canyon",
        when: "Envie d’ombre et de marche douce",
        detail:
          "Basculer sur le programme type jour 10 (Vizzavona). Le « canyon Verghellu » cité dans les best-of est une activité guidée dès 10 ans — pas pour 5 ans.",
      },
    ],
  };

  const byId = Object.fromEntries(DATA.days.map((d) => [d.id, d]));

  const patch = (id, overrides) => {
    const base = byId[id];
    if (!base) return null;
    return { ...base, ...overrides };
  };

  DATA.days = [
    patch("d03", {
      changes: [
        { type: "keep", text: "Arrivée minimale inchangée — aucun tourisme le soir du débarquement." },
      ],
    }),

    patch("d04", {
      changes: [
        { type: "keep", text: "Conserve Aïtone (Top piscines naturelles, accès facile depuis L’Acciola)." },
        { type: "keep", text: "Conserve l’installation camping-car prioritaire le matin." },
      ],
    }),

    patch("d05", {
      title: "Calanques de Piana & Ficajola",
      short: "Piana & Ficajola",
      vibe: "Signature ouest — conservée",
      summary:
        "Journee signature UNESCO. Conservée volontairement (certains best-of 7 jours la sautent pour « gagner » du temps voiture — ici on la garde).",
      why:
        "Les Calanques de Piana restent parmi les plus beaux paysages de Corse accèssibles en demi-journée depuis Evisa. Les supprimer pour enchaîner le sud n’a pas de sens avec votre base L’Acciola déjà posée.",
      enrich:
        "Partir avant 8 h. Stationnements uniquement aux emplacements autorisés. Ficajola = plage longue ; si parking plein → Piana / Porto en plan B.",
      changes: [
        {
          type: "keep",
          text: "Conserve les Calanques de Piana + Ficajola (choix explicite famille / base Evisa).",
        },
        {
          type: "note",
          text: "Ne remplace rien du programme principal : meme grand jour ouest, assume contre les road-trips qui le sautent.",
        },
      ],
    }),

    patch("d06", {
      changes: [
        { type: "keep", text: "Conserve Scandola / Girolata en bateau (inaccèssible autrement)." },
        {
          type: "alt",
          text: "Si bateau annulé (météo) → Aitone + belvédères Porto/Piana sans forcer une autre grosse route.",
        },
      ],
    }),

    patch("d07", {
      changes: [
        { type: "keep", text: "Conserve Aïtone + Spelunca jusqu’au pont de Zaglia." },
        { type: "keep", text: "Conserve appel Chez Bartho + rangement pour le transfert du 8." },
      ],
    }),

    patch("d08", {
      title: "Transfert Vergio → Chez Bartho",
      short: "Vergio → Corte",
      summary:
        "Priorité places chez Bartho. Col de Vergio valorisé en belvédère court (15–20 min) si vous avez de la marge sur l’horaire.",
      enrich:
        "Ne transformez pas Vergio en randonnée. Photos / étirement, puis repartir. Cible arrivée ~9 h 30 toujours prioritaire.",
      timeline: [
        { time: "06:15", title: "Réveil", detail: "Petit-déj déjà préparé, toilette rapide." },
        { time: "06:45", title: "Fin de rangement", detail: "Contrôle camping-car, voiture derrière." },
        { time: "07:15", title: "Départ L’Acciola", detail: "D84 · Vergio · Calacuccia · Santa Regina." },
        {
          time: "08:00",
          title: "Col de Vergio",
          detail: "Pause belvédère 15–20 min max si avance horaire — sinon 5 min et on repart.",
        },
        { time: "08:55", title: "Calacuccia", detail: "Toilettes / étirement si besoin." },
        { time: "09:30", title: "Arrivée Chez Bartho", detail: "Se présenter immédiatement à l’accueil." },
        { time: "10:00", title: "Installation", detail: "Base pour 3 nuits, voiture libre." },
        { time: "12:00", title: "Déjeuner", detail: "Repos après la route." },
        { time: "14:30", title: "Corte à pied", detail: "Citadelle, vieille ville, glace." },
        { time: "17:30", title: "Tavignano", detail: "Baignade / détente près du camping." },
      ],
      changes: [
        { type: "keep", text: "Conserve départ 7 h 15 et cible ~9 h 30 chez Bartho (sans resa)." },
        {
          type: "add",
          text: "Ajoute une vraie pause belvédère au col de Vergio (15–20 min) si marge — Top point de vue centre Corse.",
        },
        {
          type: "replace",
          text: "Remplace l’arrêt « max 10 min » du programme principal par une courte pause paysage conditionnelle.",
        },
      ],
    }),

    patch("d09", {
      title: "Restonica réaliste (pas Melo/Capitello en famille)",
      short: "Restonica basse",
      vibe: "Eau montagne — version 2026",
      intensity: 3,
      tags: ["rivière", "navette", "repli"],
      summary:
        "Objectif honest : profiter de la Restonica sans viser Melo/Capitello. Depuis 2023, les lacs = 7–9 h de marche depuis Frasseta — inadapté a 5 et 8 ans.",
      enrich:
        "Réserver la navette Restonica (Via Corsica / M-Ticket). Terminus Frasseta. Baignade bas de vallée / Tuani. Les « best-of » qui collent encore Melo+Capitello en demi-journée sont obsolètes.",
      why:
        "Les lacs restent magnifiques, mais l’accès actuel les transforme en trek sportif. Pour un road-trip familial avec base Bartho, la valeur est dans la vallée et l’eau, pas dans l’ego « j’ai fait Capitello ».",
      metrics: [
        { label: "Marche", value: "2–4 h" },
        { label: "Niveau", value: "Familial+" },
        { label: "Navette", value: "à réserver" },
        { label: "Lacs", value: "hors cible" },
      ],
      timeline: [
        { time: "Veille 18 h", title: "Décision accès", detail: "Vérifier navette + fermetures massif / feux." },
        { time: "07:00", title: "Petit-déj", detail: "Gourdes, chaussures, pique-nique léger." },
        { time: "07:40", title: "Navette Corte", detail: "Gare / arrêt officiel → Frasseta (tarif indicatif 4 € A/R)." },
        { time: "08:30", title: "Restonica basse", detail: "Marche rivière, vasques, ombre — sans monter aux bergeries pour « forcer » les lacs." },
        { time: "12:00", title: "Retour navette", detail: "Avant chaleur et files." },
        { time: "13:00", title: "Déjeuner camping", detail: "Repos après-midi + Tavignano optionnel." },
        {
          time: "—",
          title: "Si Restonica fermée",
          detail: "Basculer immédiatement sur Tavignano (repli B) — voir encadré en tete de page.",
        },
      ],
      remember:
        "Melo/Capitello ne sont pas « le matin ». Les prétendus top listes qui les placent en demi-journée ignorent l’état de la route depuis 2023.",
      vigilance:
        "Ne jamais improviser hors sentier. Roches glissantes, eau froide, orages d’altitude possibles.",
      planB:
        "Repli A = rester bas Restonica. Repli B = Tavignano depuis Bartho. Repli C = Vizzavona le meme jour ou le lendemain.",
      mapMarkers: ["bartho", "corte", "frasseta", "melo"],
      mapZoom: 11,
      pack: ["Reservation navette", "Chaussures", "Gourdes", "Pique-nique"],
      tips: [
        {
          title: "Lacs ?",
          text: "Uniquement si adultes tres sportifs EN DEHORS de cette variante famille. Avec 5 et 8 ans : non.",
        },
        {
          title: "Navette",
          text: "Pas de vente a bord : reserver. Enfants −8 ans souvent gratuits — verifier l’appli.",
        },
      ],
      maps: "https://www.google.com/maps/dir/Corte/Vall%C3%A9e+de+la+Restonica",
      changes: [
        {
          type: "replace",
          text: "Remplace l’idee « Melo + Capitello » des best-of generiques par une Restonica basse réaliste (accès 2026).",
        },
        {
          type: "replace",
          text: "Remplace aussi la version trop vague du programme principal par un deroule navette + vasques + replis nommes.",
        },
        {
          type: "alt",
          text: "Si lacs vraiment vises un jour : ce n’est plus une journée road-trip famille — prévoir une sortie adults-only ou abandonner.",
        },
        {
          type: "note",
          text: "Voir encadré « Replis Melo & Capitello » en haut de page (A / B / C).",
        },
      ],
    }),

    patch("d10", {
      title: "Vizzavona & cascade des Anglais",
      short: "Vizzavona",
      vibe: "Foret / eau douce",
      intensity: 3,
      tags: ["marche", "forêt", "ombre"],
      summary:
        "Journee eau + ombre. On ne force pas le canyon du Verghellu (guide, dès 10 ans) avec un enfant de 5 ans.",
      enrich:
        "Les « piscines du Verghellu » des best-of désignent surtout le canyon guide. Pour 5–8 ans : Vizzavona / cascade des Anglais reste le meilleur rapport magie / sécurité / fatigue.",
      why:
        "Garder une vraie journée nature avant le transfert mer, sans ajouter une activite âgée 10+ ni une deuxième grosse route sud.",
      metrics: [
        { label: "Route", value: "~62 km A/R" },
        { label: "Conduite", value: "~1 h" },
        { label: "Marche", value: "2–3 h" },
        { label: "Vehicule", value: "Voiture" },
      ],
      timeline: [
        { time: "07:30", title: "Petit-déj", detail: "Départ avant la chaleur." },
        { time: "08:15", title: "Départ Corte", detail: "T20 via Venaco → Vizzavona (~30–35 min)." },
        { time: "09:00", title: "Vizzavona", detail: "Parking gare / zones autorisées." },
        { time: "09:20", title: "Cascade des Anglais", detail: "Balade familiale, pauses, eau froide." },
        { time: "12:30", title: "Pique-nique ombre", detail: "Repos long." },
        {
          time: "14:00",
          title: "Option",
          detail: "Deuxieme boucle courte en forêt OU retour Corte + Tavignano.",
        },
        { time: "16:30", title: "Retour camping", detail: "Preparer le transfert du 11." },
      ],
      remember: "Verghellu canyon = activite payante guidee des ~10 ans. Ce n’est pas une balade libre « vasques » pour toute la famille.",
      vigilance: "Respecter fermetures de massifs / feux. Sol humide autour des cascades.",
      planB: "Matinee Corte (citadelle) + Tavignano si fatigue ou météo.",
      mapMarkers: ["corte", "vizzavona", "verhellu"],
      mapZoom: 10,
      pack: ["Pique-nique", "Chaussures accroche", "Couche"],
      tips: [
        {
          title: "Verghellu ?",
          text: "Si un jour les grands (+10) veulent le canyon : demi-journée guidee séparée — pas a la place de Vizzavona avec le petit.",
        },
      ],
      maps: "https://www.google.com/maps/dir/Corte/Vizzavona",
      changes: [
        {
          type: "replace",
          text: "Remplace l’idee « journée Verghellu libre » des best-of par Vizzavona (adapte 5–8 ans).",
        },
        {
          type: "note",
          text: "Conserve l’esprit « eau + forêt » du programme principal, avec mise en garde canyon.",
        },
        {
          type: "keep",
          text: "Conserve Vizzavona / cascade des Anglais comme programme principal du jour.",
        },
      ],
    }),

    patch("d11", {
      changes: [
        { type: "keep", text: "Conserve le transfert camping-car Corte → Abbartello sans visite en route." },
        { type: "keep", text: "Conserve plage Abbartello l’après-midi pour recuperer." },
      ],
    }),

    patch("d12", {
      title: "Cupabia (cœur) · Filitosa (option)",
      short: "Cupabia",
      vibe: "Plage emblématique",
      intensity: 2,
      tags: ["plage", "doux", "option culture"],
      summary:
        "Priorité Cupabia (sable / eau / peu de route). Filitosa seulement en visite courte au frais si envie.",
      enrich:
        "Cupabia est dans le Top plages « accèssibles depuis l’ouest/sud proche ». Inutile de sacrifier la baignade pour allonger Filitosa.",
      why:
        "Après un transfert, la valeur du jour est l’eau. Filitosa reste un bonus culturel, pas le centre de gravite.",
      metrics: [
        { label: "Route", value: "~40–55 km" },
        { label: "Plage", value: "4 h+" },
        { label: "Filitosa", value: "option ≤ 1 h 30" },
        { label: "Vehicule", value: "Voiture" },
      ],
      timeline: [
        { time: "08:00", title: "Petit-déj", detail: "Eau, chapeaux, pique-nique." },
        {
          time: "09:00",
          title: "Option Filitosa",
          detail: "Visite rapide au frais — sinon skip et route directe Cupabia.",
        },
        { time: "11:00", title: "Cupabia", detail: "Installation ombre, baignade, déjeuner." },
        { time: "16:30", title: "Départ", detail: "Avant files de fin de journée." },
        { time: "17:15", title: "Camping", detail: "Douche, diner, soiree plage Abbartello possible." },
      ],
      mapMarkers: ["abbartello", "cupabia", "filitosa"],
      maps: "https://www.google.com/maps/dir/Olmeto-Plage/Plage+de+Cupabia",
      changes: [
        { type: "keep", text: "Conserve Cupabia (plage best-of depuis Abbartello)." },
        {
          type: "replace",
          text: "Remplace le duo équilibre Filitosa+Cupabia par Cupabia prioritaire ; Filitosa = option courte.",
        },
      ],
    }),

    patch("d13", {
      title: "Bavella (+ Polischellu seulement avec guide)",
      short: "Bavella",
      vibe: "Grande journée sud montagne",
      intensity: 4,
      tags: ["point de vue", "guide?", "depart tot"],
      summary:
        "Col & Aiguilles de Bavella (~1 h 10 depuis Abbartello). Polischellu : accès libre interdit une grande partie de l’annee — uniquement en sortie guidee reservee.",
      enrich:
        "Depuis 2024, Quenza impose un guide pro pour Polischellu (amende possible). Ne pas « tenter le sentier ». Sans réservation guide : Bavella belvédères + retour, ou plage Solenzara/Favone en descente.",
      why:
        "Bavella est le pendant montagne du sud que Bonifacio ne remplace pas. On echange la grosse journée urbaine contre aiguilles + (option) vasques encadrées.",
      metrics: [
        { label: "Route", value: "~120 km A/R" },
        { label: "Conduite", value: "~2 h 20" },
        { label: "Départ", value: "7 h" },
        { label: "Polischellu", value: "guide only" },
      ],
      timeline: [
        { time: "06:30", title: "Réveil", detail: "Petit-déj + pique-nique." },
        { time: "07:00", title: "Départ Abbartello", detail: "Direction Solenzara / D268 / col de Bavella." },
        { time: "08:15", title: "Col de Bavella", detail: "Parkings tot — points de vue Aiguilles." },
        { time: "09:00", title: "Belvederes / courte marche", detail: "Rester sur sentiers ouverts, chaleur rapide en aout." },
        {
          time: "11:00",
          title: "Option Polischellu",
          detail: "Uniquement si sortie guidee reservee (2 h 30–3 h). Sinon skip.",
        },
        {
          time: "13:30",
          title: "Plan sans guide",
          detail: "Pique-nique col ou descente vers Solenzara / petite plage — pas de canyon libre.",
        },
        { time: "16:00", title: "Retour Abbartello", detail: "Aucune autre grosse activite." },
      ],
      remember:
        "Bonifacio n’est plus le grand jour de cette variante (il reste dans le programme principal). Ici : Bavella.",
      vigilance:
        "Polischellu sans guide = risque amende + danger. Feux / vent : verifier arrêtés.",
      planB:
        "Col de Bavella matin + plage Solenzara/Favone après-midi si guide indisponible ou enfants saturés.",
      mapMarkers: ["abbartello", "bavella", "aiguilles", "polischellu"],
      mapZoom: 9,
      pack: ["Reservation guide?", "Pique-nique", "Chaussures", "Eau x2"],
      tips: [
        {
          title: "Guide",
          text: "Réserver Polischellu plusieurs jours avant en aout. Age mini souvent ~8 ans selon prèsta.",
        },
        {
          title: "Bonifacio",
          text: "Non inclus ici. Pour le voir : garder le programme principal du 13.",
        },
      ],
      maps: "https://www.google.com/maps/dir/Olmeto-Plage/Col+de+Bavella",
      changes: [
        {
          type: "replace",
          text: "Remplace la journée Bonifacio par Bavella (points de vue best-of absents du programme principal).",
        },
        {
          type: "add",
          text: "Ajoute Polischellu en OPTION guidee seulement — pas en randonnée libre.",
        },
        {
          type: "note",
          text: "Bonifacio reste disponible via le bouton « Programme principal » du meme jour.",
        },
      ],
    }),

    patch("d14", {
      title: "Rondinara · soir Porto-Vecchio",
      short: "Rondinara & PV",
      vibe: "Plage iconique",
      intensity: 4,
      tags: ["plage", "depart tot", "soirée"],
      summary:
        "Une seule plage star pour rester réaliste : Rondinara (~1 h 50 A/R depuis Abbartello). Soirée légere a Porto-Vecchio. Palombaggia = autre jour ou repli si Rondinara saturée.",
      enrich:
        "Enchaîner Rondinara + Palombaggia + Santa Giulia la meme journée depuis Olmeto = 4 h+ de voiture. On choisit Rondinara (forme coquillage, eau peu profonde) + PV.",
      why:
        "Les Top 6 plages du sud-est sont loin d’Abbartello. Mieux vaut une plage réussie qu’un triathlon parking.",
      metrics: [
        { label: "Route", value: "~180 km A/R" },
        { label: "Conduite", value: "~3 h 40" },
        { label: "Plage", value: "Rondinara" },
        { label: "Départ", value: "7 h" },
      ],
      timeline: [
        { time: "06:30", title: "Réveil", detail: "Pique-nique, cash parking eventuel." },
        { time: "07:00", title: "Départ Abbartello", detail: "Via Propriano / Sartene / PV selon trafic." },
        { time: "08:50", title: "Rondinara", detail: "Arrivée avant saturation — baignade longue." },
        { time: "13:00", title: "Pique-nique / repos", detail: "Ombre limitee : tentes/uv, hydratation." },
        { time: "15:30", title: "Départ plage", detail: "Douche sable, route Porto-Vecchio." },
        { time: "16:30", title: "Porto-Vecchio", detail: "Glace / balade port / vieille ville courte." },
        { time: "18:00", title: "Retour Abbartello", detail: "Diner camping, pas d’autre sortie." },
      ],
      remember: "Palombaggia et Santa Giulia sont des replis / un autre creneau — pas un combo obligatoire.",
      vigilance: "Parkings payants / complètes tot en aout. Ne pas laisser d’objets visibless.",
      planB:
        "Si Rondinara complète → Palombaggia OU Santa Giulia (une seule), puis PV. Sinon retour Abbartello / Cupabia.",
      mapMarkers: ["abbartello", "rondinara", "portoVecchio", "palombaggia"],
      mapZoom: 9,
      pack: ["Départ 7 h", "Cash parking", "Ombre / UV", "Eau"],
      tips: [
        {
          title: "Pourquoi pas 3 plages",
          text: "Depuis Abbartello, chaque plage du secteur PV coûte ~1 h 30–2 h A/R. Qualité > quantité.",
        },
      ],
      maps: "https://www.google.com/maps/dir/Olmeto-Plage/Plage+de+Rondinara/Porto-Vecchio",
      changes: [
        {
          type: "replace",
          text: "Remplace Campomoro (tour+plage) par Rondinara + soiree Porto-Vecchio.",
        },
        {
          type: "add",
          text: "Ajoute Rondinara (Top plage) et un vrai creneau Porto-Vecchio.",
        },
        {
          type: "alt",
          text: "Palombaggia / Santa Giulia = repli si Rondinara incomplète — pas un enchainement.",
        },
      ],
    }),

    patch("d15", {
      title: "Campomoro le jour · Roccapina au coucher",
      short: "Campomoro & sunset",
      vibe: "Cote proche + sunset",
      intensity: 3,
      tags: ["plage", "sunset", "15 aout"],
      summary:
        "Matinee / après-midi Campomoro (tour si fraîcheur). Fin de journée Roccapina pour belvédère / coucher de soleil. Sartene devient option courte.",
      enrich:
        "Le 15 aout sature Roccapina : viser le belvédère plutot que la piste plage si doute. Si foule extreme → sunset depuis Campomoro.",
      why:
        "Après la grosse route Rondinara, on reste proche d’Abbartello et on offre le sunset demande par les best-of sans refaire 200 km.",
      metrics: [
        { label: "Route", value: "~90–130 km" },
        { label: "Plage", value: "Campomoro" },
        { label: "Sunset", value: "Roccapina" },
        { label: "Vehicule", value: "Voiture" },
      ],
      timeline: [
        { time: "07:30", title: "Petit-déj", detail: "Chaussures si tour génoise." },
        { time: "08:30", title: "Départ Campomoro", detail: "~45–55 min selon trafic." },
        { time: "09:30", title: "Tour / plage", detail: "Marche courte au frais puis baignade longue." },
        { time: "15:30", title: "Route Roccapina", detail: "Belvedere pour la lumiere du soir." },
        { time: "19:00", title: "Coucher de soleil", detail: "Photos, vent possible, redescendre avant la nuit totale." },
        { time: "20:15", title: "Retour Abbartello", detail: "Preparer restitution du 16." },
      ],
      remember: "Preparer check-out / carburant / docs dès le retour.",
      vigilance: "15 aout = monde. Piste Roccapina : ne pas engager un véhicule inadéquat.",
      planB: "Tout Campomoro jusqu’au sunset si Roccapina impossible.",
      mapMarkers: ["abbartello", "campomoro", "roccapina"],
      mapZoom: 10,
      pack: ["Preparer restitution", "Lampe", "Coupe-vent"],
      tips: [
        { title: "Sartene", text: "Option déjeuner court seulement si vous sautez la tour Campomoro." },
      ],
      maps: "https://www.google.com/maps/dir/Olmeto-Plage/Campomoro/Roccapina",
      changes: [
        {
          type: "replace",
          text: "Remplace Roccapina+Sartene « journée classique » par Campomoro jour + Roccapina sunset.",
        },
        { type: "add", text: "Ajoute un coucher de soleil dédié (Campomoro ou Roccapina)." },
        {
          type: "alt",
          text: "Si 15 aout sature a Roccapina → sunset Campomoro (remplace le deplacement).",
        },
      ],
    }),

    patch("d16", {
      changes: [
        { type: "keep", text: "Conserve restitution Ajaccio cible 12 h avec marge — aucun tourisme." },
      ],
    }),
  ].filter(Boolean);
})();
