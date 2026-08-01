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
          <li>Roccapina en escale 2–3 h (pas journée entière)</li>
          <li>Sartène soirée + replis Restonica / Melo</li>
        </ul>
      </article>
      <article class="alt-principle">
        <h3>Ce qu’on change (avec recherche terrain)</h3>
        <ul>
          <li>Sud : Bavella à la place de Roccapina→Bonifacio</li>
          <li>Palombaggia (#2) + PV ; Santa Giulia (#3) en repli</li>
          <li>Roccapina + Sartène calées le 15 (sans Bonifacio)</li>
          <li>Polischellu : uniquement avec guide</li>
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

  /* meloFallback rendu par app.js (partagé principal + variante) */
})();
