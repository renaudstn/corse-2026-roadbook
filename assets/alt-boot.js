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
          <li>Sartène en soirée (Place Porta → Valinco → dîner)</li>
          <li>Replis Restonica / Melo partagés avec le principal</li>
        </ul>
      </article>
      <article class="alt-principle">
        <h3>Ce qu’on change (avec recherche terrain)</h3>
        <ul>
          <li>Sud : Bavella à la place de Bonifacio ; Rondinara + Porto-Vecchio</li>
          <li>Sartène calée le 15 (après Rondinara) plutôt que le 14</li>
          <li>Polischellu : uniquement avec guide (règles 2024–2026)</li>
          <li>Roccapina sunset = option si pas Sartène</li>
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
