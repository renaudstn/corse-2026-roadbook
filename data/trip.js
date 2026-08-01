window.CORSE2026 = (() => {
  const fmtKm = (km) => `~${km} km`;
  const fmtMin = (m) => {
    if (m == null) return "—";
    const h = Math.floor(m / 60);
    const min = m % 60;
    if (h === 0) return `${min} min`;
    if (min === 0) return `${h} h`;
    return `${h} h ${String(min).padStart(2, "0")}`;
  };
  const vehicleLabel = (v) =>
    ({ car: "Voiture", camper: "Camping-car", both: "CC + voiture", walk: "À pied / navette", boat: "Bateau + voiture" }[v] || v);

  const buildMetrics = (day) => {
    const m = [];
    if (day.travel?.distanceKm != null) m.push({ label: "Route", value: fmtKm(day.travel.distanceKm) });
    if (day.travel?.drivingMinutes != null) m.push({ label: "Conduite", value: fmtMin(day.travel.drivingMinutes) });
    if (day.activity?.durationMinutes != null) m.push({ label: "Activité", value: fmtMin(day.activity.durationMinutes) });
    if (day.schedule?.departure) m.push({ label: "Départ", value: day.schedule.departure.replace(":", " h ") });
    if (day.travel?.vehicle) m.push({ label: "Véhicule", value: vehicleLabel(day.travel.vehicle) });
    return m;
  };

  const normalize = (day) => {
    const out = { ...day };
    if (!out.metrics?.length) out.metrics = buildMetrics(out);
    if (!out.map && out.mapMarkers) {
      out.map = { markers: out.mapMarkers, zoom: out.mapZoom || 10, googleMapsUrl: out.maps || "" };
    }
    if (out.map) {
      out.mapMarkers = out.map.markers || out.mapMarkers;
      out.mapZoom = out.map.zoom || out.mapZoom || 10;
      out.maps = out.map.googleMapsUrl || out.maps;
    }
    if (!out.pack && out.essentials) out.pack = out.essentials;
    if (!out.essentials && out.pack) out.essentials = out.pack;
    if (!out.vigilance && out.alerts?.length) {
      out.vigilance = out.alerts.filter((a) => a.level !== "info").map((a) => a.text).join(" ");
    }
    if (!out.planB && out.alternatives?.length) {
      const primary = out.alternatives.find((a) => a.kind === "fallback" || a.kind === "weather") || out.alternatives[0];
      if (primary) out.planB = `${primary.title} — ${primary.description}`;
    }
    if (!out.category) {
      if (out.intensity >= 4) out.category = "signature";
      else if ((out.tags || []).includes("transfert") && out.intensity <= 2) out.category = "transfert";
      else if (out.intensity <= 2) out.category = "legere";
      else out.category = "sortie";
    }
    return out;
  };

  const DATA = {
    meta: {
      title: "Corse 2026",
      subtitle: "Roadbook familial",
      dates: "3 → 16 août 2026",
      start: "2026-08-03",
      end: "2026-08-16",
      vehicles: "1 camping-car + 1 voiture",
      vehicleCount: 2,
      kids: "enfants 5 et 8 ans",
      spirit: "Nature, peu de villes, camping-car peu déplacé",
      editorialDate: "2026-08-01",
      editorialNote: "Infos éditoriales — pas une source temps réel.",
      scenarioSouth: "B",
      scenarioSouthLabel: "Bonifacio seul le 13 · Campomoro le 14 · Roccapina + Sartène le 15",
      scenarioSouthWhy:
        "Avec des enfants de 5 et 8 ans, cumuler Roccapina et Bonifacio le même jour reste trop dense en août (parking, chaleur, fatigue). Deux journées séparées avec une journée calme entre les deux sont plus réalistes. La répétition partielle de route vers le sud est acceptée et expliquée.",
    },

    places: {
      ajaccio: { name: "Ajaccio", lat: 41.9192, lng: 8.7386, kind: "ville", info: "https://fr.wikipedia.org/wiki/Ajaccio", infoLabel: "Wikipédia" },
      sagone: { name: "Sagone", lat: 42.112, lng: 8.688, kind: "base", info: "https://fr.wikipedia.org/wiki/Sagone", infoLabel: "Wikipédia" },
      vico: { name: "Vico", lat: 42.1667, lng: 8.8, kind: "ville", info: "https://fr.wikipedia.org/wiki/Vico_(Corse-du-Sud)", infoLabel: "Wikipédia" },
      evisa: { name: "Évisa", lat: 42.253, lng: 8.801, kind: "base", info: "https://fr.wikipedia.org/wiki/%C3%89visa", infoLabel: "Wikipédia" },
      aitone: { name: "Forêt & vasques d'Aïtone", lat: 42.268, lng: 8.835, kind: "randonnee", info: "https://www.visit-corsica.com/fr/Mon-sejour/Patrimoine-naturel/Tout-le-patrimoine-naturel/FORET-D-AITONE", infoLabel: "Visit Corsica" },
      porto: { name: "Porto", lat: 42.266, lng: 8.694, kind: "ville", info: "https://fr.wikipedia.org/wiki/Golfe_de_Porto", infoLabel: "Wikipédia" },
      piana: { name: "Piana", lat: 42.238, lng: 8.636, kind: "ville", info: "https://fr.wikipedia.org/wiki/Calanques_de_Piana", infoLabel: "Wikipédia" },
      belvederePiana: { name: "Belvédère des Calanques", lat: 42.245, lng: 8.628, kind: "viewpoint", info: "https://fr.wikipedia.org/wiki/Calanques_de_Piana", infoLabel: "Wikipédia" },
      ficajola: { name: "Ficajola", lat: 42.245, lng: 8.615, kind: "plage", info: "https://www.calanquedepiana.fr/", infoLabel: "Site officiel" },
      ota: { name: "Ota / Spelunca", lat: 42.257, lng: 8.746, kind: "randonnee", info: "https://fr.wikipedia.org/wiki/Gorges_de_la_Spelunca", infoLabel: "Wikipédia" },
      corte: { name: "Corte", lat: 42.306, lng: 9.15, kind: "ville", info: "https://fr.wikipedia.org/wiki/Corte", infoLabel: "Wikipédia" },
      bartho: { name: "Chez Bartho", lat: 42.301, lng: 9.145, kind: "base", info: "https://campingchezbartho.com/", infoLabel: "Site officiel" },
      tavignano: { name: "Tavignano", lat: 42.305, lng: 9.135, kind: "randonnee", info: "https://fr.wikipedia.org/wiki/Tavignano", infoLabel: "Wikipédia" },
      frasseta: { name: "Pont de Frasseta (Restonica)", lat: 42.28, lng: 9.1, kind: "parking", info: "https://www.visit-corsica.com/", infoLabel: "À vérifier" },
      melo: { name: "Lac de Melo", lat: 42.263, lng: 9.068, kind: "randonnee", info: "https://fr.wikipedia.org/wiki/Lac_de_Melo", infoLabel: "Wikipédia" },
      vizzavona: { name: "Vizzavona", lat: 42.117, lng: 9.133, kind: "randonnee", info: "https://fr.wikipedia.org/wiki/Vizzavona", infoLabel: "Wikipédia" },
      abbartello: { name: "Abbartello", lat: 41.707, lng: 8.846, kind: "base", info: "https://camping-abbartello.fr/", infoLabel: "Site officiel" },
      filitosa: { name: "Filitosa", lat: 41.747, lng: 8.872, kind: "visite", info: "https://www.filitosa.fr/", infoLabel: "Site officiel" },
      cupabia: { name: "Cupabia", lat: 41.725, lng: 8.825, kind: "plage", info: "https://guide.corsica/poi/ouest/coti-chiavari/plage-coti-chiavari", infoLabel: "Guide.Corsica" },
      bonifacio: { name: "Bonifacio", lat: 41.387, lng: 9.159, kind: "ville", info: "https://fr.wikipedia.org/wiki/Bonifacio", infoLabel: "Wikipédia" },
      campomoro: { name: "Campomoro", lat: 41.629, lng: 8.808, kind: "plage", info: "https://fr.wikipedia.org/wiki/Tour_de_Campomoro", infoLabel: "Wikipédia" },
      roccapina: { name: "Roccapina", lat: 41.495, lng: 8.928, kind: "viewpoint", info: "https://fr.wikipedia.org/wiki/Roccapina", infoLabel: "Wikipédia" },
      sartene: { name: "Sartène", lat: 41.621, lng: 8.973, kind: "ville", info: "https://fr.wikipedia.org/wiki/Sart%C3%A8ne", infoLabel: "Wikipédia" },
    },

    bases: [
      {
        id: "sagone", lat: 42.112, lng: 8.688, name: "Sagone / Vico", role: "Nuit-étape", dates: "3 août", nights: 1,
        status: "pending", statusLabel: "À confirmer", altitude: null,
        note: "Secteur côte ouest après débarquement Ajaccio. Arrivée tardive ~22 h. Confirmer le camping exact et l'accord d'arrivée tardive.",
        color: "#1f6f6a",
      },
      {
        id: "acciola", lat: 42.253, lng: 8.801, name: "Camping L'Acciola", place: "Évisa", role: "Base montagne", dates: "4 → 8 août", nights: 4,
        status: "ok", statusLabel: "Réservé", altitude: "930 m",
        phone: "+33495262301", phoneDisplay: "+33 4 95 26 23 01", email: "contact@acciola.com",
        note: "Petit camping 12 emplacements · ~2 km d'Évisa · soirées fraîches", color: "#2f5d3a",
      },
      {
        id: "bartho", lat: 42.301, lng: 9.145, name: "Camping Chez Bartho", place: "Corte", role: "Base intérieure", dates: "8 → 11 août", nights: 3,
        status: "warn", statusLabel: "Sans réservation", altitude: null,
        phone: "+33495460230", phoneDisplay: "04 95 46 02 30", email: "camping.bartho@orange.fr",
        note: "Arriver avant 12 h · cible 9 h 30 · appeler le 7 août · aucune visite avant l'emplacement",
        color: "#8a5a2b",
        fallbacks: [
          "Camping U Ponte · Corte / Restonica (appeler avant de bouger)",
          "Camping Tukutuku · Corte",
          "Autre camping / aire autorisée secteur Corte (liste à jour dans le téléphone)",
        ],
      },
      {
        id: "abbartello", lat: 41.707, lng: 8.846, name: "Camping Abbartello", place: "Olmeto-Plage", role: "Base mer", dates: "11 → 16 août", nights: 5,
        status: "ok", statusLabel: "Réservé", altitude: null,
        phone: "+33618827349", phoneDisplay: "06 18 82 73 49", phone2: "+33611182909", phone2Display: "06 11 18 29 09",
        email: "camping.abbartello@gmail.com",
        note: "Plage de sable à ~30 m · réception 7 h–21 h · barbecues interdits", color: "#1d4f6e",
      },
    ],

    rules: [
      { title: "Rythme", text: "Une grosse journée (intensité 4–5) est suivie d'une journée sensiblement plus calme. En cas de chaleur, alerte incendie ou fatigue : supprimer l'option de l'après-midi plutôt que de décaler toute la journée." },
      { title: "Camping-car", text: "Il ne bouge que les 3, 4, 8, 11 et 16 août. Les excursions locales se font en voiture." },
      { title: "Marches", text: "Départ avant 9 h 30 quand la journée le justifie (parking, chaleur, accès). Chaque randonnée doit pouvoir être raccourcie. Un adulte ouvre, l'autre ferme." },
      { title: "Priorités", text: "1. Arriver le matin chez Bartho. 2. Ne pas forcer Restonica si fermée. 3. Restituer le camping-car avec 2 h de marge. 4. Vérifier accès / incendies la veille et le matin." },
    ],

    checklist: [
      { id: "nuit3", label: "Confirmer la nuit du 3 août et l'arrivée tardive" },
      { id: "bateau", label: "Réserver le bateau Scandola / Girolata (annulation météo)" },
      { id: "cartes", label: "Télécharger les cartes hors ligne sur les deux téléphones" },
      { id: "repli", label: "Enregistrer 2–3 solutions de repli autour de Corte (noms + téléphone)" },
      { id: "contacts", label: "Enregistrer campings, agence camping-car et assurance" },
      { id: "restonica", label: "Vérifier accès Restonica / navette / incendies la veille du 9" },
      { id: "sac", label: "Préparer le sac « première nuit » et pique-niques de secours" },
      { id: "conducteurs", label: "Partager le planning aux deux conducteurs" },
    ],

    logistics: [
      { title: "Temps de route", text: "Horaires en mode voiture / camping-car. En Corse, compter large en août : pauses et croisements non inclus sauf mention. Les distances sont des estimations." },
      { title: "Carburant", text: "Plein avant la montée vers Évisa et le 7 août avant Corte. Le 15 au soir, préparer la station de restitution du 16." },
      { title: "Courses", text: "Structurantes le 4 (avant L'Acciola), le 7 (avant départ), le 11/12 autour de Propriano. Garder 2 repas froids + 24 h d'eau." },
      { title: "Enfants", text: "Chaussures fermées, casquettes, gourdes identifiées, trousse de secours, vêtements secs après rivière, temps calme quotidien." },
      { title: "Chaleur & feux", text: "Consulter chaque soir restrictions massifs, météo et alertes. Risque élevé → plage ou visite courte à la place. Ce site n'est pas une source temps réel." },
    ],

    days: [],
  };

  DATA.days = [
    normalize({
      id: "d03", date: "2026-08-03", weekday: "Lundi", dayNum: 3,
      title: "Arrivée Ajaccio → nuit-étape", short: "Arrivée & nuit-étape", baseId: "sagone",
      category: "transfert", vibe: "Opérationnel", intensity: 2,
      tags: ["transfert", "camping-car"],
      summary: "Arrivée vers 20 h, regroupement des véhicules, route vers Sagone/Vico, installation minimale. Aucun tourisme.",
      enrich: "Sac « première nuit » déjà accessible : pyjamas, trousses, lampe, petit-déj, eau, habits du lendemain.",
      why: "Journée d'arrivée volontairement minimale : récupérer les véhicules, rejoindre une nuit-étape proche, préserver l'énergie pour la montée du lendemain.",
      travel: { distanceKm: 55, drivingMinutes: 70, vehicle: "both" },
      schedule: { departure: "20:45", arrivalTarget: "22:00" },
      activity: { durationMinutes: 60, walkingMinutes: 0, difficulty: "facile", childSuitability: "adapté" },
      highlights: ["Arrivée Ajaccio ~20 h", "Regroupement véhicules", "Route Sagone/Vico", "Installation minimale", "Sac 1re nuit"],
      timeline: [
        { time: "20:00", title: "Arrivée Ajaccio", detail: "Débarquement / récupération. Pas de courses importantes." },
        { time: "20:35", title: "Regroupement", detail: "Carburant si besoin, téléphones, eau, adresse camping confirmée." },
        { time: "20:45", title: "Départ Sagone/Vico", detail: "Route côtière de nuit, conduite calme, voiture derrière le CC." },
        { time: "21:55", title: "Arrivée camping", detail: "Installation silencieuse, dîner froid prévu." },
        { time: "22:30", title: "Coucher", detail: "Pas de déballage complet." },
      ],
      alerts: [{ level: "critical", text: "Confirmer avant le 3 le nom exact du camping et l'accord pour ~22 h." }],
      remember: "Garder la voiture derrière le camping-car sans se perdre dans Ajaccio.",
      vigilance: "Obtenir avant le 3 le nom exact du camping et l'accord pour ~22 h. Prévoir un repli officiel secteur Sagone.",
      planB: "Si nuit non confirmée : camping officiel ouvert tard dans le secteur Sagone/Vico, ou aire autorisée clairement signalée.",
      alternatives: [{
        id: "nuit-repli-sagone", kind: "fallback", badge: "Repli",
        trigger: "Camping non confirmé ou fermé à l'arrivée",
        title: "Camping / aire officielle secteur Sagone-Vico",
        replaces: "Nuit prévue non confirmée",
        impact: { difficultyDelta: "identique" },
        description: "Utiliser uniquement un établissement ou une aire officiellement ouverte tard. Pas de stationnement sauvage.",
      }],
      verify: [{ when: "avant le 3 août", what: "Nom exact + accord arrivée tardive", source: "Camping / booking", consequence: "Activer le repli officiel secteur Sagone" }],
      essentials: ["Sac 1re nuit", "Lampe", "Dîner froid", "Habits J+1"],
      map: { markers: ["ajaccio", "sagone"], zoom: 10, googleMapsUrl: "https://www.google.com/maps/dir/Ajaccio/Sagone" },
      tips: [
        { title: "Arrivée tardive", text: "Prévenir le camping : arrivée ~22 h. Installation minimale uniquement." },
        { title: "Convoi", text: "Voiture derrière le camping-car. Ne pas se séparer dans Ajaccio." },
      ],
    }),

    normalize({
      id: "d04", date: "2026-08-04", weekday: "Mardi", dayNum: 4,
      title: "Montée L'Acciola & Aïtone", short: "L'Acciola & Aïtone", baseId: "acciola",
      category: "sortie", vibe: "Installation", intensity: 2,
      tags: ["transfert", "forêt", "vasques"],
      summary: "Transfert vers Évisa, courses structurantes, installation à L'Acciola. Vasques d'Aïtone en 2e partie de journée seulement si conditions bonnes.",
      enrich: "À 930 m, soirées fraîches. Distinguer : forêt d'Aïtone (promenade ombragée) ≠ accès aux vasques (non surveillées, chaussures adhérentes). Version courte pour 5 et 8 ans.",
      why: "Premier ancrage du séjour : installer le camping-car, faire les courses, puis une première sortie nature courte si l'énergie le permet.",
      travel: { distanceKm: 55, drivingMinutes: 80, vehicle: "both" },
      schedule: { wakeUp: "07:45", departure: "09:00", expectedReturn: "18:00" },
      activity: { durationMinutes: 120, walkingMinutes: 40, difficulty: "facile", childSuitability: "version courte adaptée 5–8 ans" },
      highlights: ["Transfert Évisa", "Courses structurantes", "Installation L'Acciola", "Forêt d'Aïtone", "Vasques si conditions OK"],
      timeline: [
        { time: "07:45", title: "Réveil & petit-déj", detail: "Rangement rapide de la nuit-étape." },
        { time: "09:00", title: "Départ Sagone/Vico", detail: "Via Vico vers Évisa." },
        { time: "10:15", title: "Courses Vico ou Évisa", detail: "Frais, eau, pain, pique-niques pour 2 jours." },
        { time: "11:30", title: "Arrivée L'Acciola", detail: "Accueil, emplacement, branchements, installation complète." },
        { time: "13:00", title: "Déjeuner & repos", detail: "Temps calme pour les enfants." },
        { time: "15:30", title: "Forêt d'Aïtone", detail: "Promenade ombragée. Vasques seulement si débit OK et surveillance adulte." },
        { time: "17:30", title: "Retour camping", detail: "Douche, dîner sur place." },
      ],
      alerts: [{ level: "warn", text: "Vasques naturelles non surveillées — version courte pour 5 et 8 ans." }],
      remember: "Wifi surtout autour du bar/restaurant. Camping petit : installation calme.",
      vigilance: "Vasques non surveillées. Chaussures adhérentes, adulte au contact de chaque enfant. Pas d'entrée si débit fort ou orage.",
      planB: "Si Aïtone trop chargé ou conditions mauvaises : balade courte autour d'Évisa + temps libre au camping.",
      alternatives: [
        { id: "aitone-court", kind: "shorten", badge: "Raccourcit", trigger: "Enfants fatigués ou vasques fréquentées", title: "Promenade forêt uniquement", replaces: "Accès et baignade dans les vasques", impact: { walkingMinutesDelta: -20, difficultyDelta: "plus facile" }, description: "Rester sur les sentiers forestiers ombragés. Observer l'eau sans y entrer si le débit ou les rochers sont douteux." },
        { id: "aitone-skip", kind: "fallback", badge: "Repli", trigger: "Orage, débit fort, ou installation trop longue", title: "Évisa + camping", replaces: "Sortie Aïtone", impact: { drivingMinutesDelta: -25, walkingMinutesDelta: -40, difficultyDelta: "plus facile" }, description: "Balade courte au village et temps libre à L'Acciola." },
      ],
      verify: [{ when: "après-midi sur place", what: "Débit, orage, fréquentation des vasques", source: "Observation locale", consequence: "Rester en forêt ou rentrer au camping" }],
      essentials: ["Courses 2 j", "Couche chaude", "Chaussures rivière"],
      parking: [{ place: "Aïtone", note: "Parking forestier limité en août." }],
      map: { markers: ["sagone", "vico", "evisa", "aitone"], zoom: 10, googleMapsUrl: "https://www.google.com/maps/dir/Sagone/%C3%89visa" },
      tips: [
        { title: "Altitude", text: "930 m : soirées fraîches, sortir une polaire dès le 1er soir." },
        { title: "Aïtone", text: "Forêt ≠ vasques. Vasques froides, non surveillées. Version courte pour les enfants." },
      ],
    }),

    normalize({
      id: "d05", date: "2026-08-05", weekday: "Mercredi", dayNum: 5,
      title: "Calanques de Piana & option Ficajola", short: "Piana", baseId: "acciola",
      category: "signature", vibe: "Journée phare", intensity: 3,
      tags: ["voiture", "belvédères", "plage optionnelle", "départ tôt"],
      summary: "Départ matinal d'Évisa via Porto, traversée des Calanques avec arrêts sûrs, village de Piana, puis Ficajola seulement si parking raisonnable.",
      enrich: "Ne pas promettre tous les belvédères. Cibler 2–3 arrêts autorisés + belvédère principal. Ficajola = bonus, pas une obligation.",
      why: "Temps fort de la côte ouest : falaises des Calanques, pause village, option plage. Le camping-car reste à Évisa.",
      travel: { distanceKm: 95, drivingMinutes: 160, vehicle: "car" },
      schedule: { wakeUp: "07:15", departure: "08:00", expectedReturn: "17:45" },
      activity: { durationMinutes: 360, walkingMinutes: 60, difficulty: "facile", childSuitability: "adapté avec surveillance et pauses" },
      highlights: ["Départ tôt Évisa", "Passage Porto", "Calanques — arrêts autorisés", "Belvédère principal", "Village de Piana", "Ficajola si parking OK"],
      timeline: [
        { time: "07:15", title: "Petit-déj", detail: "Pique-nique, eau, ombre. Partir avant le trafic." },
        { time: "08:00", title: "Départ L'Acciola", detail: "Descente vers Porto, puis route des Calanques." },
        { time: "08:50", title: "Porto", detail: "Pause courte toilettes / vue golfe si besoin — sans s'attarder." },
        { time: "09:20", title: "Calanques — arrêts sûrs", detail: "Uniquement emplacements autorisés. Jamais sur la chaussée. 2–3 arrêts max." },
        { time: "09:50", title: "Belvédère principal", detail: "Point de vue large sur les falaises. Photos, 15–20 min." },
        { time: "10:20", title: "Option marche courte", detail: "Sentier familial plat près d'un belvédère si balisé — max 30–40 min A/R." },
        { time: "11:00", title: "Village de Piana", detail: "Toilettes, eau, ombre, boisson. Décision Ficajola ici." },
        { time: "11:30", title: "Ficajola (si OK)", detail: "Descente étroite. Si parking saturé ou doute → plan B Porto." },
        { time: "12:00", title: "Plage & pique-nique", detail: "Baignade, ombre improvisée, pause longue." },
        { time: "15:30", title: "Départ retour", detail: "Via Piana / Porto selon trafic." },
        { time: "17:45", title: "Retour camping", detail: "Dîner calme." },
      ],
      alerts: [{ level: "warn", text: "Ne jamais bloquer la chaussée dans les Calanques. Demi-tour si Ficajola saturée." }],
      remember: "Départ tôt = parking plus simple. Ficajola n'est pas obligatoire.",
      vigilance: "Arrêts uniquement sur emplacements autorisés. Route étroite vers Ficajola ; demi-tour si saturée.",
      planB: "Remplace Ficajola : plage de Porto (accès et stationnement nettement plus simples) + retour plus tôt.",
      alternatives: [
        { id: "ficajola-saturee", kind: "fallback", badge: "Remplace", trigger: "Parking de Ficajola complet ou accès déconseillé", title: "Plage de Porto", replaces: "Descente et baignade à Ficajola", impact: { drivingMinutesDelta: -35, walkingMinutesDelta: -20, difficultyDelta: "plus facile" }, description: "Après Piana, redescendre à Porto pour une baignade plus accessible. Conserve le cœur de journée (Calanques + village)." },
        { id: "piana-only", kind: "shorten", badge: "Raccourcit", trigger: "Chaleur ou fatigue dès le matin", title: "Calanques + Piana seulement", replaces: "Plage de l'après-midi", impact: { drivingMinutesDelta: -40, difficultyDelta: "plus facile" }, description: "Belvédères et village, retour anticipé à Évisa." },
      ],
      verify: [
        { when: "matin même", what: "Météo côte / vent", source: "Météo-France", consequence: "Réduire les arrêts exposés" },
        { when: "à Piana ~11 h", what: "État parking Ficajola", source: "Observation / infos locales", consequence: "Basculer plage de Porto" },
      ],
      essentials: ["Pique-nique", "Ombre", "Beaucoup d'eau", "Chapeaux"],
      parking: [
        { place: "Calanques", note: "Emplacements autorisés uniquement — jamais sur la chaussée." },
        { place: "Ficajola", note: "Parking limité ; si doute, ne pas s'engager." },
        { place: "Porto (repli)", note: "Plus simple en août pour une baignade familiale." },
      ],
      map: { markers: ["evisa", "porto", "belvederePiana", "piana", "ficajola"], zoom: 10, googleMapsUrl: "https://www.google.com/maps/dir/%C3%89visa/Porto+Corse/Piana/Plage+de+Ficajola" },
      tips: [
        { title: "Belvédères", text: "2–3 arrêts autorisés + un belvédère principal. Pas une chasse à tous les points de vue." },
        { title: "Ficajola", text: "Bonus si parking OK. Sinon plage de Porto — explicite dans le plan B." },
      ],
    }),

    normalize({
      id: "d06", date: "2026-08-06", weekday: "Jeudi", dayNum: 6,
      title: "Scandola & Girolata en bateau", short: "Scandola bateau", baseId: "acciola",
      category: "signature", vibe: "Journée signature", intensity: 4,
      tags: ["bateau", "à réserver", "porto", "départ tôt"],
      summary: "Descente matinale à Porto, circuit bateau Scandola + Girolata (~2 h 30–3 h de navigation), après-midi très légère.",
      enrich: "RÉSERVER AVANT LE SÉJOUR. Port de départ : Porto. Marge check-in ≥ 30 min. Navigation ≠ temps total journée (~8 h).",
      why: "Sortie signature du secteur Porto : Scandola et Girolata vus depuis la mer. Matin cadré, après-midi volontairement légère. Le plan B météo ne reproduit pas la journée Piana.",
      travel: { distanceKm: 45, drivingMinutes: 90, vehicle: "boat" },
      schedule: { wakeUp: "06:45", departure: "07:30", expectedReturn: "17:30" },
      activity: { durationMinutes: 180, walkingMinutes: 20, difficulty: "facile", childSuitability: "adapté avec coupe-vent et anti-mal des transports" },
      highlights: ["Réservation bateau obligatoire", "Départ port de Porto", "Marge −30 min embarquement", "Navigation 2 h 30–3 h", "Après-midi légère"],
      timeline: [
        { time: "06:45", title: "Réveil", detail: "Petit-déj rapide, coupe-vent, crème, anti-mal des transports." },
        { time: "07:30", title: "Départ L'Acciola → Porto", detail: "Marge route + stationnement portuaire." },
        { time: "08:20", title: "Parking & check-in", detail: "Présence au comptoir ≥ 30 min avant l'embarquement." },
        { time: "09:00", title: "Embarquement bateau", detail: "Créneau conseillé — confirmer l'heure réelle à la réservation." },
        { time: "09:15", title: "Navigation Scandola / Girolata", detail: "Environ 2 h 30 à 3 h sur l'eau selon opérateur et escale." },
        { time: "12:15", title: "Retour port / déjeuner", detail: "Repas simple à Porto, temps calme." },
        { time: "14:30", title: "Option très légère", detail: "Glace, tour du port, ou plage courte — sans obligation." },
        { time: "16:00", title: "Retour Évisa", detail: "Avant la fatigue de fin de journée." },
        { time: "17:30", title: "Camping", detail: "Repos et dîner." },
      ],
      alerts: [
        { level: "critical", text: "Réserver le bateau avant le séjour — confirmer port, heure et annulation météo." },
      ],
      remember: "Opérateur avec annulation / report météo. Vérifier escale Girolata et taille du bateau.",
      vigilance: "Le créneau 9 h est une recommandation. Confirmer lieu d'embarquement et heure réelle.",
      planB: "Mer agitée / sortie annulée : matinée calme à Porto (port + plage) + retour anticipé. Ne pas refaire les Calanques de Piana.",
      alternatives: [
        { id: "scandola-annule", kind: "weather", badge: "Repli météo", trigger: "Mer agitée ou sortie annulée", title: "Porto calme (port + plage)", replaces: "Circuit Scandola / Girolata", impact: { difficultyDelta: "plus facile" }, description: "Temps libre à Porto, baignade, déjeuner, retour tôt à Évisa. Distinct de la journée Piana de la veille." },
      ],
      verify: [
        { when: "avant le séjour", what: "Réservation bateau + conditions d'annulation", source: "Opérateur Porto", consequence: "Reporter ou activer le plan B météo" },
        { when: "matin même", what: "État de la mer / confirmation départ", source: "Opérateur", consequence: "Basculer Porto calme" },
      ],
      essentials: ["Coupe-vent", "Crème", "Anti-mal des transports", "Confirmation résa"],
      parking: [{ place: "Porto", note: "Arriver tôt ; parking portuaire tendu en août." }],
      map: { markers: ["evisa", "porto"], zoom: 11, googleMapsUrl: "https://www.google.com/maps/dir/%C3%89visa/Porto+Corse" },
      tips: [
        { title: "Réservation", text: "Priorité n°1 de cette journée. Confirmer heure, embarquement et annulation météo." },
        { title: "Durées", text: "Navigation ~2 h 30–3 h · journée totale ~8 h avec route et pauses." },
      ],
    }),
    normalize({
      id: "d07", date: "2026-08-07", weekday: "Vendredi", dayNum: 7,
      title: "Journée légère autour d'Évisa", short: "Évisa légère", baseId: "acciola",
      category: "legere", vibe: "Récupération & préparation", intensity: 2,
      tags: ["repos", "forêt", "préparation"],
      summary: "Journée d'équilibre : village / forêt courte, option Spelunca très limitée, repos, carburant et courses avant le transfert vers Corte.",
      enrich: "Ne pas cumuler châtaigniers + Aïtone + Spelunca. Choisir UNE sortie courte. Appeler Chez Bartho. Ranger pour un départ 7 h 15 demain.",
      why: "Après Scandola, cette journée sert à récupérer et préparer le départ critique du 8. Priorité : énergie et logistique, pas maximiser les lieux.",
      travel: { distanceKm: 25, drivingMinutes: 50, vehicle: "car" },
      schedule: { wakeUp: "08:00", departure: "09:00", expectedReturn: "16:00" },
      activity: { durationMinutes: 120, walkingMinutes: 75, difficulty: "facile", childSuitability: "adapté — une seule sortie" },
      highlights: ["Matinée calme Évisa / forêt", "Une seule sortie courte", "Repos", "Carburant + courses", "Appel Chez Bartho", "Rangement départ"],
      timeline: [
        { time: "08:00", title: "Petit-déj tranquille", detail: "Pas d'urgence. Préparer déjà une partie du départ du lendemain." },
        { time: "09:00", title: "Sortie unique au choix", detail: "A) Promenade village / châtaigniers 1–1 h 30  OU  B) Spelunca jusqu'au pont de Zaglia seulement." },
        { time: "11:30", title: "Retour / déjeuner", detail: "Pause longue au camping ou à Évisa." },
        { time: "14:00", title: "Repos & jeux libres", detail: "Temps calme obligatoire pour les enfants." },
        { time: "16:00", title: "Carburant + courses", detail: "Plein avant Corte. Eau, pain, pique-nique départ." },
        { time: "17:30", title: "Appel Chez Bartho", detail: "Confirmer l'accueil du lendemain (sans demander de réservation)." },
        { time: "18:00", title: "Préparation départ", detail: "Tout ranger sauf couchage et petit-déj. Coucher tôt." },
      ],
      alerts: [{ level: "warn", text: "Appeler Chez Bartho aujourd'hui. Départ demain 7 h 15 — aucune visite avant l'emplacement." }],
      remember: "Une seule sortie courte. Le vrai objectif du jour est la préparation du 8 août.",
      vigilance: "Si chaleur : rester au camping. Ne pas prolonger Spelunca au-delà du pont de Zaglia.",
      planB: "Journée 100 % camping + courses + rangement si fatigue ou orage.",
      alternatives: [
        { id: "spelunca-court", kind: "option", badge: "Option", trigger: "Envie d'une marche ombragée et énergie OK", title: "Spelunca jusqu'au pont de Zaglia", replaces: "Rien — alternative à la promenade village", impact: { walkingMinutesDelta: 30, drivingMinutesDelta: 40, difficultyDelta: "un peu plus soutenu" }, description: "Aller-retour limité au pont (~1 h 30 marche). Pas au-delà. Remplace la promenade village, ne s'ajoute pas." },
        { id: "evisa-full-rest", kind: "fallback", badge: "Repli", trigger: "Fatigue après Scandola ou orage", title: "Repos total camping", replaces: "Toute sortie nature", impact: { drivingMinutesDelta: -50, walkingMinutesDelta: -75, difficultyDelta: "plus facile" }, description: "Courses, rangement, jeux, appel Bartho. Parfaitement légitime." },
      ],
      verify: [{ when: "aujourd'hui", what: "Appel Chez Bartho + plein carburant", source: "Téléphone camping", consequence: "Reporter l'appel au soir au plus tard" }],
      essentials: ["Plein carburant", "Eau CC", "Téléphone Bartho", "Prêt départ 8"],
      map: { markers: ["evisa", "ota"], zoom: 11, googleMapsUrl: "https://www.google.com/maps/dir/%C3%89visa/Ota" },
      tips: [
        { title: "Demain Bartho", text: "Appeler aujourd'hui. Départ 7 h 15. Aucune course ni visite avant l'emplacement." },
        { title: "Une sortie", text: "Village/forêt OU Spelunca courte — pas les deux." },
      ],
    }),

    normalize({
      id: "d08", date: "2026-08-08", weekday: "Samedi", dayNum: 8,
      title: "Transfert matinal → Chez Bartho", short: "Vers Corte", baseId: "bartho",
      category: "transfert", vibe: "Priorité absolue", intensity: 3,
      tags: ["transfert", "critique", "sans résa", "départ tôt"],
      summary: "PRIORITÉ DU JOUR : départ 7 h 15, aucune visite, aucune course, arrivée cible 9 h 30 chez Bartho. Installation puis après-midi libre à Corte.",
      enrich: "Sans réservation. Arrivée impérativement le matin, avant midi. Si complet : activer immédiatement les replis listés — ne pas improviser.",
      why: "Journée prioritaire du séjour : sécuriser l'emplacement chez Bartho. Tout le reste est secondaire.",
      travel: { distanceKm: 66, drivingMinutes: 105, vehicle: "both" },
      schedule: { wakeUp: "06:15", departure: "07:15", arrivalTarget: "09:30", expectedReturn: null },
      activity: { durationMinutes: 120, walkingMinutes: 60, difficulty: "facile", childSuitability: "après-midi seulement, une fois installés" },
      highlights: ["Départ 7 h 15", "Aucune visite en route", "Cible 9 h 30 Chez Bartho", "Avant midi impératif", "Installation 3 nuits", "Après-midi Corte si OK"],
      timeline: [
        { time: "06:15", title: "Réveil", detail: "Petit-déj déjà préparé, toilette rapide." },
        { time: "06:45", title: "Fin de rangement", detail: "Contrôle camping-car, voiture prête derrière." },
        { time: "07:15", title: "Départ L'Acciola", detail: "D84 · Vergio · Calacuccia · Santa Regina. Aucun arrêt touristique." },
        { time: "08:00", title: "Col de Vergio", detail: "Pause technique max 10 min si besoin — pas de promenade." },
        { time: "08:50", title: "Calacuccia", detail: "Toilettes / étirement uniquement si nécessaire." },
        { time: "09:30", title: "Arrivée Chez Bartho", detail: "Se présenter immédiatement à l'accueil. Priorité absolue." },
        { time: "10:00", title: "Installation", detail: "Base pour 3 nuits, voiture libre ensuite." },
        { time: "12:00", title: "Déjeuner", detail: "Repos après la route." },
        { time: "15:00", title: "Corte à pied (si installés)", detail: "Citadelle / glace — seulement après emplacement sécurisé." },
        { time: "17:30", title: "Tavignano détente", detail: "Baignade légère près du camping éventuelle." },
      ],
      alerts: [
        { level: "critical", text: "Sans réservation — arriver ~9 h 30, impérativement avant midi. Aucune visite ni course avant l'emplacement." },
      ],
      remember: "Le camping ne garantit jamais de place. La marge avant midi est stratégique.",
      vigilance: "Si complet à 9 h 30 : appeler les replis préparés avant de déplacer le camping-car au hasard.",
      planB: "Replis Corte déjà listés (U Ponte, Tukutuku, autre) — décider sans attendre.",
      alternatives: [
        { id: "bartho-full", kind: "fallback", badge: "Repli", trigger: "Chez Bartho complet", title: "Campings de repli Corte", replaces: "Emplacement Chez Bartho", impact: { difficultyDelta: "identique" }, description: "Appeler U Ponte, Tukutuku ou autre camping/aire autorisée du secteur. Ne pas circuler au hasard avec le CC." },
      ],
      verify: [
        { when: "veille (7 août)", what: "Appel Chez Bartho", source: "04 95 46 02 30", consequence: "Confirmer l'accueil matinal" },
        { when: "arrivée", what: "Disponibilité emplacement", source: "Accueil camping", consequence: "Activer les replis immédiatement" },
      ],
      essentials: ["Petit-déj prêt", "Replis Corte", "Téléphone Bartho"],
      map: { markers: ["evisa", "corte", "bartho"], zoom: 9, googleMapsUrl: "https://www.google.com/maps/dir/%C3%89visa/Corte" },
      tips: [
        { title: "Sans résa", text: "Aucune course ni visite avant l'emplacement. Si complet → replis immédiatement." },
        { title: "Cible", text: "Arriver avant 12 h, idéalement ~9 h 30. Priorité n°1 du séjour." },
      ],
    }),

    normalize({
      id: "d09", date: "2026-08-09", weekday: "Dimanche", dayNum: 9,
      title: "Restonica familiale ou Tavignano", short: "Restonica / Tavignano", baseId: "bartho",
      category: "sortie", vibe: "Trois niveaux clairs", intensity: 2,
      tags: ["marche", "rivière", "flexible"],
      summary: "Plan A familial : Restonica basse (navette / accès autorisé) + baignade encadrée. Option sportive Melo/Capitello seulement si conditions strictes. Plan B : Tavignano, vraie belle journée.",
      enrich: "Melo ≈ 16–18 km A/R et 7–9 h depuis Frasseta — inadapté comme sortie familiale standard pour 5 et 8 ans. Capitello encore plus long. Ne jamais les présenter comme le programme du jour.",
      why: "Eau douce autour de Corte avec trois niveaux explicites : familial recommandé, sportif conditionnel, repli valorisant.",
      travel: { distanceKm: 20, drivingMinutes: 40, vehicle: "walk" },
      schedule: { wakeUp: "06:30", departure: "07:00", expectedReturn: "13:00" },
      activity: { durationMinutes: 180, walkingMinutes: 150, difficulty: "facile", childSuitability: "Plan A adapté ; Melo/Capitello non recommandés en famille" },
      highlights: ["Plan A : Restonica basse", "Navette / accès à vérifier", "Baignade zone sûre", "Option sportive conditionnelle", "Plan B : Tavignano"],
      timeline: [
        { time: "18:00 J-1", title: "Décision la veille", detail: "Vérifier accès Restonica, navette, incendies. Choisir Plan A ou Plan B." },
        { time: "06:30", title: "Si Plan A Restonica", detail: "Réveil tôt pour navette / accès officiel uniquement." },
        { time: "07:00", title: "Navette / départ Corte", detail: "Vers pont de Frasseta / zone basse autorisée." },
        { time: "07:40", title: "Promenade Restonica basse", detail: "Vallée + rivière. Pas d'objectif lac. Pauses fréquentes." },
        { time: "11:30", title: "Retour Corte", detail: "Avant chaleur et affluence." },
        { time: "12:30", title: "Déjeuner camping", detail: "Après-midi libre." },
        { time: "08:30", title: "Si Plan B Tavignano", detail: "Départ à pied depuis le secteur camping / Corte." },
        { time: "09:00", title: "Tavignano", detail: "Version courte 2 h ou longue 3 h. Demi-tour possible. Baignade zone sûre." },
        { time: "12:30", title: "Retour Plan B", detail: "Déjeuner et repos." },
      ],
      alerts: [{ level: "warn", text: "Ne jamais forcer Restonica si l'accès n'est pas ouvert officiellement. Melo/Capitello ≠ sortie familiale standard." }],
      remember: "Trois niveaux : A familial · option sportive · B Tavignano (vraie belle journée, pas une consolation).",
      vigilance: "Vérifier info officielle la veille et le matin. Suspensions possibles liées aux incendies.",
      planB: "Tavignano depuis Corte / camping = vraie belle journée (pas une consolation) : départ adapté, durée courte ou longue, demi-tour, baignade, retour avant la chaleur.",
      alternatives: [
        { id: "restonica-family", kind: "option", badge: "Plan A", trigger: "Accès / navette officiellement ouverts", title: "Restonica basse familiale", replaces: "— programme principal si ouvert", impact: { difficultyDelta: "facile" }, description: "Navette ou accès autorisé, promenade vallée, baignade encadrée en zone sûre. Objectif rivière, pas les lacs." },
        { id: "melo-sport", kind: "sport", badge: "Option sportive", trigger: "Accès ouverts + météo OK + adultes expérimentés + enfants vraiment en forme + départ très tôt", title: "Melo (voire Capitello)", replaces: "Ajoute une option sportive — ne remplace pas le Plan A par défaut", impact: { walkingMinutesDelta: 300, difficultyDelta: "beaucoup plus dur" }, description: "Uniquement si toutes les conditions sont réunies. Capitello n'est jamais une sortie familiale standard pour 5 et 8 ans. Prévoir demi-tour sans culpabilité." },
        { id: "tavignano-b", kind: "fallback", badge: "Remplace Restonica", trigger: "Restonica fermée, navette KO, orage, ou fatigue", title: "Tavignano — belle journée complète", replaces: "Restonica", impact: { drivingMinutesDelta: -30, difficultyDelta: "facile à modéré" }, description: "Départ depuis Corte / camping. Version courte ~2 h ou longue ~3 h. Point de demi-tour. Pause / baignade. Retour avant la chaleur. À présenter comme une vraie réussite." },
      ],
      verify: [
        { when: "veille ~18 h", what: "Accès Restonica / navette / incendies", source: "Infos officielles locales / mairie / sites parkings", consequence: "Basculer Tavignano" },
        { when: "matin même", what: "Confirmation ouverture", source: "Même sources", consequence: "Ne pas forcer" },
      ],
      essentials: ["Info Restonica", "Chaussures", "Gourdes", "Couche rivière"],
      map: { markers: ["corte", "frasseta", "tavignano"], zoom: 11, googleMapsUrl: "https://www.google.com/maps/search/Vall%C3%A9e+de+la+Restonica+Corte" },
      tips: [
        { title: "Plan A", text: "Restonica basse + rivière. Pas Melo/Capitello en famille par défaut." },
        { title: "Plan B", text: "Tavignano est une belle journée — pas une consolation." },
        { title: "Sport", text: "Melo seulement si accès, météo, niveau et énergie sont vraiment au rendez-vous." },
      ],
    }),

    normalize({
      id: "d10", date: "2026-08-10", weekday: "Lundi", dayNum: 10,
      title: "Corte légère — citadelle & musée", short: "Corte légère", baseId: "bartho",
      category: "legere", vibe: "Journée locale", intensity: 2,
      tags: ["ville", "repos", "préparation"],
      summary: "Journée raisonnablement légère à Corte : citadelle, musée, ruelles, repos. Préparation du transfert vers Abbartello. Vizzavona et Tavignano restent des alternatives.",
      enrich: "Évite ~95 km / 2 h 20 de conduite juste avant le transfert du 11. On ne remplit pas la journée pour cocher des lieux.",
      why: "Équilibre avant le transfert mer : rester local préserve l'énergie. Vizzavona est beau mais coûteux en conduite la veille d'un changement de base.",
      travel: { distanceKm: 8, drivingMinutes: 15, vehicle: "walk" },
      schedule: { wakeUp: "08:00", departure: "09:30", expectedReturn: "16:00" },
      activity: { durationMinutes: 180, walkingMinutes: 90, difficulty: "facile", childSuitability: "très adapté" },
      highlights: ["Citadelle de Corte", "Musée / intérieur frais", "Ruelles & glace", "Repos", "Préparer le transfert"],
      timeline: [
        { time: "08:00", title: "Petit-déj camping", detail: "Matinée sans précipitation." },
        { time: "09:30", title: "Montée citadelle", detail: "À pied depuis le camping / parking. Rythme enfants." },
        { time: "10:30", title: "Musée / belvédères", detail: "Intérieur frais utile en août. Visite courte." },
        { time: "12:30", title: "Déjeuner Corte", detail: "Ou retour camping." },
        { time: "14:30", title: "Temps libre", detail: "Repos, jeux, Tavignano très court si envie d'eau." },
        { time: "17:00", title: "Préparation transfert", detail: "Rangement partiel pour le départ du 11." },
      ],
      alerts: [],
      remember: "Programme principal local. Vizzavona = alternative si forte envie de forêt et énergie OK.",
      vigilance: "Ne pas transformer cette journée en grosse sortie la veille du transfert.",
      planB: "Repos total camping + courses légères si chaleur ou fatigue.",
      alternatives: [
        { id: "vizzavona-alt", kind: "option", badge: "Option", trigger: "Forte envie de forêt ombragée et enfants en forme", title: "Vizzavona + cascade des Anglais", replaces: "Programme Corte ville", impact: { drivingMinutesDelta: 70, distanceKmDelta: 62, walkingMinutesDelta: 60, difficultyDelta: "un peu plus soutenu" }, description: "~62 km A/R, ~1 h de conduite. Cascade des Anglais en famille. Verghellu canyoning exclu pour un enfant de 5 ans. Rentrer assez tôt pour préparer le 11." },
        { id: "tavignano-light", kind: "option", badge: "Option", trigger: "Envie d'eau douce sans voiture", title: "Tavignano court depuis le camping", replaces: "Visite citadelle (ou s'ajoute en version très courte)", impact: { walkingMinutesDelta: 90, difficultyDelta: "facile" }, description: "Aller-retour court, baignade, retour avant 13 h." },
        { id: "corte-rest", kind: "fallback", badge: "Repli", trigger: "Chaleur ou fatigue", title: "Repos camping", replaces: "Sortie du jour", impact: { difficultyDelta: "plus facile" }, description: "Ombre, jeux, rangement anticipé pour Abbartello." },
      ],
      verify: [{ when: "veille", what: "Envie / énergie / météo pour trancher Corte vs Vizzavona", source: "Famille", consequence: "Garder Corte par défaut" }],
      essentials: ["Chapeaux", "Eau", "Préparer transfert"],
      map: { markers: ["corte", "bartho"], zoom: 13, googleMapsUrl: "https://www.google.com/maps/search/Citadelle+de+Corte" },
      tips: [
        { title: "Choix", text: "Corte locale = principal. Vizzavona = option forêt. Pas les deux." },
        { title: "Veille transfert", text: "Garder de la marge mentale et physique pour le 11." },
      ],
    }),

    normalize({
      id: "d11", date: "2026-08-11", weekday: "Mardi", dayNum: 11,
      title: "Corte → Abbartello (la mer)", short: "Vers la mer", baseId: "abbartello",
      category: "transfert", vibe: "Changement de base", intensity: 2,
      tags: ["transfert", "plage", "camping-car"],
      summary: "Transfert sans visite vers Olmeto-Plage. Installation pour 5 nuits, après-midi plage du camping en récupération.",
      enrich: "Boulanger livre le camping le matin. Objectif : être installés vers 11 h 30–12 h. Aucune visite en cours de route.",
      why: "Changement de décor : quitter l'intérieur pour la base mer. Transfert propre + installation, puis plage à pied.",
      travel: { distanceKm: 145, drivingMinutes: 165, vehicle: "both" },
      schedule: { wakeUp: "07:15", departure: "08:45", arrivalTarget: "11:30", expectedReturn: null },
      activity: { durationMinutes: 180, walkingMinutes: 20, difficulty: "facile", childSuitability: "adapté — journée transfert" },
      highlights: ["Départ ~08:45", "Transfert ~145 km / ~2 h 45", "Arrivée ~11 h 30", "Installation 5 nuits", "Plage camping"],
      timeline: [
        { time: "07:15", title: "Réveil", detail: "Petit-déj et démontage complet." },
        { time: "08:30", title: "Check-out", detail: "Contrôle des 2 véhicules, emplacement propre." },
        { time: "08:45", title: "Départ Corte", detail: "Venaco · Vizzavona · Cauro · Propriano. Aucune visite." },
        { time: "10:05", title: "Pause Cauro/Petreto", detail: "15 min, toilettes, changement conducteur." },
        { time: "11:30", title: "Arrivée Abbartello", detail: "Accueil, installation 5 nuits." },
        { time: "12:30", title: "Déjeuner", detail: "Pain / produits locaux selon dispo." },
        { time: "15:00", title: "Plage Abbartello", detail: "Sans voiture, baignade, récupération." },
        { time: "18:30", title: "Courses courtes", detail: "Seulement si nécessaire — sinon lendemain." },
      ],
      alerts: [],
      remember: "Plage ~30 m. Réception 7 h–21 h. Barbecues interdits.",
      vigilance: "Trafic sensible autour d'Ajaccio et Propriano. Ne pas placer de visite pendant le transfert.",
      planB: "Si retard trafic : avancer l'arrivée, reporter courses au lendemain, prioriser installation + repos.",
      alternatives: [
        { id: "transfert-late", kind: "fallback", badge: "Repli", trigger: "Fort retard trafic", title: "Installation + plage uniquement", replaces: "Courses du jour", impact: { difficultyDelta: "plus facile" }, description: "Reporter courses et explorations au 12." },
      ],
      verify: [{ when: "matin", what: "Trafic / travaux éventuels", source: "Info trafic", consequence: "Partir un peu plus tôt" }],
      essentials: ["Démontage complet", "Pause conducteur"],
      map: { markers: ["corte", "abbartello"], zoom: 8, googleMapsUrl: "https://www.google.com/maps/dir/Corte/Olmeto-Plage" },
      tips: [
        { title: "Mer", text: "Plage à ~30 m. Boulanger le matin. Barbecues interdits." },
        { title: "Transfert", text: "Aucune visite en route. Objectif : installés avant / autour du déjeuner." },
      ],
    }),
    normalize({
      id: "d12", date: "2026-08-12", weekday: "Mercredi", dayNum: 12,
      title: "Filitosa & plage de Cupabia", short: "Filitosa & Cupabia", baseId: "abbartello",
      category: "sortie", vibe: "Culture + mer", intensity: 2,
      tags: ["visite", "plage", "doux"],
      summary: "Culture le matin au frais (Filitosa ~1 h 30–2 h avec enfants), longue après-midi plage à Cupabia. Repli plage Abbartello si besoin.",
      enrich: "Filitosa : ombre partielle, prévoir eau. Vérifier horaires / tarif sur le site. Cupabia : peu d'ombre naturelle parfois.",
      why: "Combo culture + mer à proximité après un transfert, avec peu de kilomètres et un vrai temps de baignade.",
      travel: { distanceKm: 55, drivingMinutes: 80, vehicle: "car" },
      schedule: { wakeUp: "08:00", departure: "09:00", expectedReturn: "17:30" },
      activity: { durationMinutes: 330, walkingMinutes: 60, difficulty: "facile", childSuitability: "adapté — visite courte puis plage" },
      highlights: ["Filitosa le matin", "Visite ~1 h 30–2 h", "Pique-nique", "Cupabia l'après-midi", "Repli Abbartello"],
      timeline: [
        { time: "08:00", title: "Petit-déj", detail: "Eau, chapeaux, pique-nique." },
        { time: "09:00", title: "Départ Filitosa", detail: "Trajet court depuis Abbartello." },
        { time: "09:20", title: "Site préhistorique", detail: "Visite tôt, progression tranquille, ombre quand possible." },
        { time: "11:15", title: "Fin de visite", detail: "Ne pas forcer si les enfants saturent." },
        { time: "12:10", title: "Pique-nique", detail: "Près de Cupabia, à l'ombre." },
        { time: "13:00", title: "Cupabia", detail: "Baignade et repos long." },
        { time: "16:45", title: "Départ", detail: "Avant l'affluence de fin de journée." },
        { time: "17:30", title: "Camping", detail: "Douche, dîner, soirée plage." },
      ],
      alerts: [],
      remember: "Commencer par la visite évite le plein soleil sur le site archéologique.",
      vigilance: "Surveiller hydratation et soleil sur Cupabia (ombre parfois limitée).",
      planB: "Filitosa le matin + déjeuner camping + plage Abbartello sans trajet supplémentaire.",
      alternatives: [
        { id: "cupabia-skip", kind: "fallback", badge: "Remplace", trigger: "Parking Cupabia saturé ou fatigue", title: "Plage Abbartello", replaces: "Cupabia", impact: { drivingMinutesDelta: -40, difficultyDelta: "plus facile" }, description: "Après Filitosa, rentrer directement au camping pour la plage à 30 m." },
        { id: "filitosa-short", kind: "shorten", badge: "Raccourcit", trigger: "Enfants saturés sur le site", title: "Filitosa express ≤ 1 h", replaces: "Visite complète 2 h", impact: { walkingMinutesDelta: -30, difficultyDelta: "plus facile" }, description: "Parcours principal seulement, puis route vers la plage." },
      ],
      verify: [
        { when: "veille", what: "Horaires et tarif Filitosa", source: "filitosa.fr", consequence: "Adapter l'heure de départ" },
      ],
      essentials: ["Chapeaux", "Pique-nique", "Eau", "Ombre"],
      parking: [
        { place: "Filitosa", note: "Parking du site — arriver en ouverture." },
        { place: "Cupabia", note: "Peut saturer ; repli Abbartello immédiat." },
      ],
      map: { markers: ["abbartello", "filitosa", "cupabia"], zoom: 11, googleMapsUrl: "https://www.google.com/maps/dir/Olmeto-Plage/Filitosa/Plage+de+Cupabia" },
      tips: [
        { title: "Ordre", text: "Filitosa le matin au frais, Cupabia l'après-midi." },
        { title: "Coût", text: "Vérifier tarif / horaires Filitosa la veille sur le site officiel." },
      ],
    }),

    normalize({
      id: "d13", date: "2026-08-13", weekday: "Jeudi", dayNum: 13,
      title: "Bonifacio (journée dédiée)", short: "Bonifacio", baseId: "abbartello",
      category: "signature", vibe: "Grande journée", intensity: 5,
      tags: ["ville", "bateau optionnel", "départ tôt"],
      summary: "Scénario B retenu : Bonifacio seule. Départ 7 h. Hiérarchie : 1) ville haute & belvédères 2) port 3) bateau falaises optionnel 4) escalier Roy d'Aragon optionnel. Retour direct.",
      enrich: "Roccapina est volontairement reportée au 15 pour éviter une journée surchargée. Escalier et bateau ne sont pas obligatoires.",
      why: "Une seule vraie grande journée urbaine. Séparer Bonifacio de Roccapina/Sartène préserve le réalisme avec des enfants.",
      travel: { distanceKm: 180, drivingMinutes: 190, vehicle: "car" },
      schedule: { wakeUp: "06:20", departure: "07:00", expectedReturn: "18:00" },
      activity: { durationMinutes: 420, walkingMinutes: 120, difficulty: "modéré", childSuitability: "adapté avec pauses ; options facultatives" },
      highlights: ["Départ 7 h", "Ville haute & belvédères", "Port", "Bateau falaises (option)", "Escalier (option)", "Retour direct"],
      timeline: [
        { time: "06:20", title: "Réveil", detail: "Petit-déj simple + pique-nique de secours." },
        { time: "07:00", title: "Départ Abbartello", detail: "Via Propriano / Sartène (passage, pas visite)." },
        { time: "08:35", title: "Arrivée Bonifacio", detail: "Parking officiel avant saturation." },
        { time: "09:00", title: "1. Ville haute & belvédères", detail: "Priorité du jour — avant la chaleur." },
        { time: "10:30", title: "2. Port", detail: "Descente / vue port. Temps photos." },
        { time: "11:15", title: "3. Option bateau ~1 h", detail: "Falaises / grottes — seulement si énergie et horaire OK." },
        { time: "12:30", title: "Déjeuner", detail: "Tôt ou pique-nique selon affluence." },
        { time: "14:00", title: "4. Option escalier Roy d'Aragon", detail: "Selon chaleur, vertige et forme des enfants — souvent à skipper." },
        { time: "15:30", title: "Dernière pause", detail: "Glace, toilettes, gourdes." },
        { time: "16:15", title: "Départ retour", detail: "Retour direct Abbartello — pas de Roccapina aujourd'hui." },
        { time: "18:00", title: "Abbartello", detail: "Dîner simple, aucune autre activité." },
      ],
      alerts: [{ level: "critical", text: "Grande journée — départ 7 h essentiel. Ne pas ajouter Roccapina ni plage éloignée." }],
      remember: "Hiérarchie claire : ville haute > port > bateau > escalier. Tout n'est pas obligatoire.",
      vigilance: "Temps réel très dépendant du trafic d'août et du stationnement.",
      planB: "Si retard : supprimer bateau et escalier, concentrer ville haute + belvédères + port, repartir plus tôt.",
      alternatives: [
        { id: "bonifacio-no-boat", kind: "shorten", badge: "Raccourcit", trigger: "Retard ou enfants fatigués", title: "Ville haute + port seulement", replaces: "Bateau et escalier", impact: { walkingMinutesDelta: -60, difficultyDelta: "plus facile" }, description: "Garde l'essentiel de Bonifacio sans options chronophages." },
        { id: "bonifacio-early-return", kind: "fallback", badge: "Repli", trigger: "Parking impossible ou chaleur extrême", title: "Belvédères express + retour", replaces: "Journée complète", impact: { difficultyDelta: "plus facile" }, description: "1–2 h sur place puis retour Abbartello / plage camping." },
      ],
      verify: [
        { when: "veille", what: "Météo vent pour option bateau", source: "Météo + opérateur", consequence: "Skipper le bateau" },
        { when: "matin", what: "Trafic / parking", source: "Observation", consequence: "Arriver encore plus tôt si possible" },
      ],
      essentials: ["Pique-nique secours", "Départ 7 h", "Beaucoup d'eau"],
      parking: [{ place: "Bonifacio", note: "Parking officiel dès l'arrivée — saturable dès le milieu de matinée." }],
      map: { markers: ["abbartello", "bonifacio"], zoom: 8, googleMapsUrl: "https://www.google.com/maps/dir/Olmeto-Plage/Bonifacio" },
      tips: [
        { title: "Scénario B", text: "Bonifacio seule aujourd'hui. Roccapina + Sartène = 15 août. Campomoro = 14 (récup)." },
        { title: "Options", text: "Bateau et escalier sont facultatifs. Ville haute + port suffisent pour une belle journée." },
      ],
    }),

    normalize({
      id: "d14", date: "2026-08-14", weekday: "Vendredi", dayNum: 14,
      title: "Campomoro — récupération", short: "Campomoro", baseId: "abbartello",
      category: "legere", vibe: "Récupération active", intensity: 2,
      tags: ["plage", "marche légère", "côte"],
      summary: "Journée tampon après Bonifacio : marche courte à la tour, longue plage. ~70 km A/R, pas une journée chargée.",
      enrich: "Réévaluer : Abbartello → Campomoro ≈ 35 km / ~45–55 min un aller. Total ~70 km / ~1 h 40–2 h. Sentiers côtiers : vérifier fermetures incendie.",
      why: "Récupérer après Bonifacio sans s'ennuyer, tout en restant sur la côte proche.",
      travel: { distanceKm: 70, drivingMinutes: 100, vehicle: "car" },
      schedule: { wakeUp: "07:45", departure: "08:45", expectedReturn: "17:00" },
      activity: { durationMinutes: 300, walkingMinutes: 90, difficulty: "facile", childSuitability: "adapté" },
      highlights: ["Marche courte tour", "Plage Campomoro", "Stationnement à anticiper", "Retour simple"],
      timeline: [
        { time: "07:45", title: "Petit-déj", detail: "Pique-nique + chaussures fermées." },
        { time: "08:45", title: "Départ", detail: "Propriano puis Campomoro (~45–55 min)." },
        { time: "09:40", title: "Stationnement", detail: "Marge pour marcher jusqu'au départ du sentier." },
        { time: "10:00", title: "Tour génoise", detail: "Boucle ou A/R court selon accès et chaleur." },
        { time: "11:45", title: "Retour plage", detail: "Installation, baignade, déjeuner." },
        { time: "15:30", title: "Fin de plage", detail: "Douche rapide, rangement." },
        { time: "16:15", title: "Départ", detail: "Retour simple Abbartello." },
        { time: "17:15", title: "Camping", detail: "Soirée libre." },
      ],
      alerts: [{ level: "warn", text: "Restrictions incendie possibles sur le littoral — vérifier la veille." }],
      remember: "Marche le matin, plage pour récupérer. Retour simple — ne pas ajouter d'étape.",
      vigilance: "Sentiers fermés si risque incendie. Parking saturé → plage Abbartello / Cupabia.",
      planB: "Parking saturé ou massif fermé → plage Abbartello / Cupabia, journée récupération totale.",
      alternatives: [
        { id: "campomoro-beach-only", kind: "shorten", badge: "Raccourcit", trigger: "Chaleur ou sentier fermé", title: "Plage Campomoro seulement", replaces: "Marche tour génoise", impact: { walkingMinutesDelta: -90, difficultyDelta: "plus facile" }, description: "Baignade longue sans la marche." },
        { id: "abbartello-recup", kind: "fallback", badge: "Repli", trigger: "Parking saturé ou fermeture sentiers", title: "Plage Abbartello", replaces: "Sortie Campomoro", impact: { drivingMinutesDelta: -100, difficultyDelta: "plus facile" }, description: "Récupération totale à 30 m du camping." },
      ],
      verify: [{ when: "veille", what: "Restrictions incendie / sentiers côtiers", source: "Préfecture / infos locales", consequence: "Plage sans marche ou repli Abbartello" }],
      essentials: ["Chaussures fermées", "Pique-nique", "Eau"],
      parking: [{ place: "Campomoro", note: "Saturable en août — arriver en matinée." }],
      map: { markers: ["abbartello", "campomoro"], zoom: 10, googleMapsUrl: "https://www.google.com/maps/dir/Olmeto-Plage/Campomoro" },
      tips: [
        { title: "Distances", text: "~70 km A/R / ~1 h 40–2 h de conduite — pas une journée de 80 km « mystérieux » sans A/R." },
        { title: "Récup", text: "Journée tampon après Bonifacio, avant le 15 août." },
      ],
    }),

    normalize({
      id: "d15", date: "2026-08-15", weekday: "Samedi", dayNum: 15,
      title: "Roccapina (court) & Sartène", short: "Roccapina & Sartène", baseId: "abbartello",
      category: "sortie", vibe: "15 août — cadré", intensity: 3,
      tags: ["belvédère", "village", "15 août", "départ tôt"],
      summary: "15 août : forte fréquentation. Roccapina courte et cadrée (belvédère Lion ; plage seulement si piste/parking OK), puis Sartène = déjeuner + balade courte. Rentrer assez tôt pour préparer la restitution.",
      enrich: "Camping-car interdit sur la piste. Belvédère accessible depuis la route. Services et ombre potentiellement absents. Préparer le 16 dès le retour.",
      why: "Scénario B : Roccapina + Sartène séparés de Bonifacio. On assume la répétition partielle de route vers le sud, compensée par une journée moins urbaine et un retour anticipé.",
      travel: { distanceKm: 120, drivingMinutes: 150, vehicle: "car" },
      schedule: { wakeUp: "06:50", departure: "07:30", expectedReturn: "16:30" },
      activity: { durationMinutes: 300, walkingMinutes: 60, difficulty: "facile", childSuitability: "adapté si Roccapina reste courte" },
      highlights: ["Départ tôt (15 août)", "Belvédère du Lion", "Piste variable — voiture seule", "Plage seulement si OK", "Sartène déjeuner + balade", "Retour tôt"],
      timeline: [
        { time: "06:50", title: "Réveil", detail: "Partir avant l'affluence du 15 août." },
        { time: "07:30", title: "Départ Abbartello", detail: "Direction Roccapina (via secteur Sartène en transit)." },
        { time: "08:45", title: "Belvédère Roccapina", detail: "Lion de Roccapina depuis la route / parking belvédère. Photos, 20–40 min." },
        { time: "09:15", title: "Décision piste / plage", detail: "Uniquement si piste et parking raisonnables pour la voiture. Sinon belvédère suffit." },
        { time: "09:30", title: "Plage courte (si OK)", detail: "Max ~1 h 30 sur place. Peu d'ombre, peu de services." },
        { time: "11:30", title: "Départ Sartène", detail: "Éviter de déjeuner trop tard." },
        { time: "12:15", title: "Sartène", detail: "Déjeuner + balade courte centre historique — pas une visite exhaustive." },
        { time: "14:30", title: "Départ retour", detail: "Rentrer assez tôt pour préparer la restitution." },
        { time: "15:45", title: "Camping", detail: "Rangement final du séjour (sauf couchage)." },
        { time: "19:00", title: "Dernière soirée", detail: "Dîner simple, coucher raisonnable." },
      ],
      alerts: [
        { level: "critical", text: "15 août : fréquentation et parking tendus. Roccapina courte. Pas de journée surchargée. Camping-car interdit sur la piste." },
      ],
      remember: "Sartène = déjeuner + balade courte, pas une visite complète. Préparer le 16 dès le retour.",
      vigilance: "Piste Roccapina variable. Pas d'ombre garantie. Si doute → belvédère + Sartène + plage Abbartello.",
      planB: "Belvédère Roccapina uniquement + Sartène en fin de matinée + plage Abbartello / Cupabia l'après-midi.",
      alternatives: [
        { id: "rocca-belvedere-only", kind: "shorten", badge: "Raccourcit", trigger: "Piste mauvaise, parking saturé, chaleur", title: "Belvédère uniquement", replaces: "Descente plage Roccapina", impact: { walkingMinutesDelta: -40, difficultyDelta: "plus facile" }, description: "Garde le Lion et la vue sans engager la piste." },
        { id: "rocca-skip-beach-repli", kind: "fallback", badge: "Remplace", trigger: "Roccapina saturée ou conditions mauvaises", title: "Sartène + plage Abbartello", replaces: "Temps plage à Roccapina", impact: { drivingMinutesDelta: -20, difficultyDelta: "plus facile" }, description: "Belvédère express si possible, puis Sartène, puis plage du camping." },
      ],
      verify: [
        { when: "veille", what: "État piste / infos locales Roccapina", source: "Infos locales / observation", consequence: "Belvédère seulement" },
        { when: "matin", what: "Circulation 15 août", source: "Route", consequence: "Partir encore plus tôt ou simplifier" },
      ],
      essentials: ["Préparer restitution", "Eau + ombre", "Voiture seulement"],
      parking: [
        { place: "Belvédère Roccapina", note: "Accessible depuis la route — priorité du jour." },
        { place: "Piste / plage", note: "Variable ; camping-car interdit ; voiture seulement si conditions OK." },
        { place: "Sartène", note: "Parking village tendu le 15 août." },
      ],
      map: { markers: ["abbartello", "roccapina", "sartene"], zoom: 9, googleMapsUrl: "https://www.google.com/maps/dir/Olmeto-Plage/Roccapina/Sart%C3%A8ne" },
      tips: [
        { title: "15 août", text: "Très chargé. Roccapina courte et cadrée. Rentrer tôt pour le 16." },
        { title: "Sartène", text: "Déjeuner + balade courte — pas une visite de musée complète." },
        { title: "Route", text: "Répétition partielle de la route sud vs le 13 : acceptée pour garder des journées réalistes." },
      ],
    }),

    normalize({
      id: "d16", date: "2026-08-16", weekday: "Dimanche", dayNum: 16,
      title: "Retour & restitution camping-car", short: "Retour Ajaccio", baseId: "abbartello",
      category: "transfert", vibe: "Marge avant midi", intensity: 3,
      tags: ["transfert", "restitution", "critique"],
      summary: "Journée purement logistique : rangement, vidanges/contrôles, carburant, nettoyage si exigé, restitution cible ~12 h, marge jusqu'à 14 h. Aucune visite.",
      enrich: "Viser midi, pas 13 h 45. Documents, clés et photos restent accessibles — jamais dans une valise déjà chargée.",
      why: "Restituer sans stress. Deux heures de marge sont non négociables.",
      travel: { distanceKm: 85, drivingMinutes: 110, vehicle: "both" },
      schedule: { wakeUp: "06:50", departure: "08:45", arrivalTarget: "12:00" },
      activity: { durationMinutes: 60, walkingMinutes: 0, difficulty: "facile", childSuitability: "journée véhicule" },
      highlights: ["Rangement & contrôles", "Vidanges", "Carburant", "Restitution ~12 h", "Marge jusqu'à 14 h"],
      timeline: [
        { time: "06:50", title: "Réveil", detail: "Petit-déj + rangement couchages." },
        { time: "07:30", title: "Contrôles finaux", detail: "Nettoyage, déchets, eaux, inventaire, photos." },
        { time: "08:30", title: "Check-out", detail: "Emplacement propre, véhicules regroupés." },
        { time: "08:45", title: "Départ Abbartello", detail: "Propriano · Petreto · Cauro. Aucune visite." },
        { time: "10:35", title: "Secteur Ajaccio", detail: "Carburant au point choisi à l'avance." },
        { time: "11:00", title: "Nettoyage final", detail: "Seulement si exigé et déjà localisé." },
        { time: "11:40", title: "Trajet agence", detail: "Arriver avant midi." },
        { time: "12:00", title: "Restitution", detail: "État des lieux, documents, bagages → voiture." },
        { time: "13:00", title: "Marge", detail: "Embouteillage / contrôle / formalité." },
        { time: "14:00", title: "Heure limite", detail: "Aucune activité touristique avant restitution." },
      ],
      alerts: [{ level: "critical", text: "Restitution cible 12 h — marge jusqu'à 14 h. Aucune visite avant." }],
      remember: "Prévoir la veille l'adresse station-service compatible gabarit camping-car.",
      vigilance: "Conserver contrat, état des lieux initial, justificatifs carburant et coordonnées agence à portée de main.",
      planB: "Si gros retard : appeler l'agence immédiatement, prioriser restitution propre sur toute autre tâche.",
      alternatives: [
        { id: "restitution-late", kind: "fallback", badge: "Repli", trigger: "Retard important", title: "Appel agence + priorité restitution", replaces: "Toute autre tâche", impact: { difficultyDelta: "identique" }, description: "Prévenir, simplifier le nettoyage au minimum exigé, arriver propre et documentés." },
      ],
      verify: [
        { when: "veille (15)", what: "Adresse station + exigences restitution", source: "Contrat / agence", consequence: "Partir plus tôt" },
      ],
      essentials: ["Docs accessibles", "Photos CC", "Carburant"],
      map: { markers: ["abbartello", "ajaccio"], zoom: 9, googleMapsUrl: "https://www.google.com/maps/dir/Olmeto-Plage/Ajaccio" },
      tips: [
        { title: "Marge", text: "Viser 12 h, pas 13 h 45. Contrat / clés / photos hors valises déjà chargées." },
      ],
    }),
  ];

  return DATA;
})();
