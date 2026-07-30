(() => {
  const DATA = window.CORSE2026;
  if (!DATA?.altMeta) return;

  const $ = (sel) => document.querySelector(sel);

  const lead = $("#altLead");
  if (lead && DATA.altMeta.note) lead.textContent = DATA.altMeta.note;

  const principles = $("#altPrinciples");
  if (principles) {
    principles.innerHTML = `
      <article class="alt-principle">
        <h3>Ce qu’on conserve</h3>
        <ul>
          <li>Campings & dates (L’Acciola, Bartho, Abbartello)</li>
          <li>Calanques de Piana + Ficajola</li>
          <li>Aïtone, Scandola, Cupabia</li>
          <li>Format complet : horaires, cartes, liens lieux</li>
        </ul>
      </article>
      <article class="alt-principle">
        <h3>Ce qu’on change (avec recherche terrain)</h3>
        <ul>
          <li>Restonica : version basse réaliste (pas Melo/Capitello en famille depuis Frasseta)</li>
          <li>Sud : Bavella à la place de Bonifacio ; Rondinara + Porto-Vecchio</li>
          <li>Polischellu : uniquement avec guide (règles 2024–2026)</li>
          <li>Sunset Campomoro / Roccapina</li>
        </ul>
      </article>
      <article class="alt-principle">
        <h3>Comment comparer</h3>
        <ul>
          <li>Sur chaque jour : bouton « Programme principal »</li>
          <li>Sur le programme principal : bouton « Alternatif »</li>
          <li>Bloc « Ce que ça change » sur chaque carte</li>
        </ul>
      </article>`;
  }

  const melo = DATA.meloFallback;
  if (!melo) return;
  const title = $("#meloTitle");
  const intro = $("#meloIntro");
  const box = $("#meloFallbacks");
  if (title) title.textContent = melo.title;
  if (intro) intro.textContent = melo.intro;
  if (box) {
    box.innerHTML = melo.options
      .map(
        (opt) => `<article class="alt-fallback">
        <p class="alt-fallback__id">Repli ${opt.id}</p>
        <h3>${opt.name}</h3>
        <p class="alt-fallback__replaces">${opt.replaces}</p>
        <p class="alt-fallback__when"><strong>Quand :</strong> ${opt.when}</p>
        <p>${opt.detail}</p>
      </article>`
      )
      .join("");
  }
})();
