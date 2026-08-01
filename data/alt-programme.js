(() => {
  const DATA = window.CORSE2026;
  if (!DATA) return;

  DATA.mode = "variants";
  DATA.altMeta = {
    title: "Variantes & replis",
    role: "Complément du programme principal",
    note:
      "Pas un second roadbook. Utilisez cette page quand la météo, un accès ou le niveau des enfants imposent un ajustement. Le programme recommandé reste sur la page principale.",
  };

  DATA.meloFallback = {
    title: "Option sportive Restonica (conditionnelle)",
    intro:
      "Depuis les crues de 2023, la route Restonica s'arrête au pont de Frasseta. Melo ≈ 16–18 km A/R et 7–9 h ; Capitello encore plus. Ce n'est pas une sortie familiale standard pour des enfants de 5 et 8 ans. L'option sportive n'est ouverte que si toutes les conditions ci-dessous sont réunies.",
    items: [
      {
        id: "sport-conditions",
        title: "Conditions obligatoires",
        badge: "Option sportive",
        text: "Accès officiellement ouverts · météo favorable · adultes qui connaissent la difficulté · enfants vraiment en forme · départ suffisamment tôt. Sinon : rester sur le Plan A (Restonica basse) ou le Plan B (Tavignano).",
      },
      {
        id: "repli-a",
        title: "Plan A — Restonica basse",
        badge: "Remplace Melo/Capitello",
        text: "Navette ou accès autorisé vers Frasseta / zone basse. Promenade vallée + baignade encadrée. Objectif rivière, pas les lacs.",
      },
      {
        id: "repli-b",
        title: "Plan B — Tavignano",
        badge: "Remplace Restonica",
        text: "Vraie belle journée depuis Corte / Chez Bartho : version courte ~2 h ou longue ~3 h, demi-tour possible, baignade, retour avant la chaleur. Pas une consolation.",
      },
      {
        id: "repli-c",
        title: "Repli ombre — Vizzavona",
        badge: "Repli météo",
        text: "Si l'eau de montagne est compromise mais que la famille veut de la forêt : cascade des Anglais. Verghellu canyoning exclu pour un enfant de 5 ans.",
      },
    ],
  };

  DATA.variantThemes = [
    {
      title: "Conservé du programme principal",
      text: "Campings et dates · Calanques de Piana · Scandola · équilibre grosses / légères · arrivée matinale Chez Bartho · scénario sud B (Bonifacio le 13, Campomoro le 14, Roccapina + Sartène le 15).",
    },
    {
      title: "Rôle de cette page",
      text: "Lister les replis météo, les raccourcis et l'option sportive Restonica déjà structurés dans les données du jour — sans maintenir un second calendrier qui divergerait.",
    },
    {
      title: "Temps réel",
      text: "Accès Restonica, navettes, incendies, pistes et tarifs évoluent. Vérifier la veille et le matin. Ce site n'est pas une source temps réel.",
    },
  ];
})();
