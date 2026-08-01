(() => {
  const DATA = window.CORSE2026;
  if (!DATA?.altMeta) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const escape = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const lead = $("#altLead");
  if (lead) lead.textContent = DATA.altMeta.note;

  const principles = $("#altPrinciples");
  if (principles && DATA.variantThemes) {
    principles.innerHTML = DATA.variantThemes
      .map(
        (p) => `<article class="rule">
          <h3>${escape(p.title)}</h3>
          <p>${escape(p.text)}</p>
        </article>`
      )
      .join("");
  }

  const melo = DATA.meloFallback;
  if (melo) {
    const title = $("#meloTitle");
    const intro = $("#meloIntro");
    const list = $("#meloFallbacks");
    if (title) title.textContent = melo.title;
    if (intro) intro.textContent = melo.intro;
    if (list) {
      list.innerHTML = (melo.items || [])
        .map((item) => {
          const sport = /sport/i.test(item.badge || "");
          return `<article class="alt-fallback">
            <div class="alt-fallback__head">
              <span class="badge badge--${sport ? "warn" : "confirm"}">${escape(item.badge || "Note")}</span>
              <h3>${escape(item.title)}</h3>
            </div>
            <p>${escape(item.text)}</p>
          </article>`;
        })
        .join("");
    }
  }

  const root = $("#variantsRoot");
  if (root && Array.isArray(DATA.days)) {
    const dayParam = new URLSearchParams(location.search).get("day");
    root.innerHTML = DATA.days
      .map((day) => {
        const alts = Array.isArray(day.alternatives) ? day.alternatives : [];
        if (!alts.length) return "";
        const focus = dayParam && (dayParam === day.id || dayParam === day.date);
        return `<article class="variant-day${focus ? " is-focus" : ""}" id="variant-${escape(day.id)}">
          <header class="variant-day__head">
            <div>
              <p class="eyebrow">${escape(day.weekday)} ${escape(day.dayNum)} août</p>
              <h3>${escape(day.short || day.title)}</h3>
            </div>
            <a class="btn btn--small" href="./index.html?day=${escape(day.id)}#programme">Voir le jour</a>
          </header>
          <ul class="variant-day__list">
            ${alts
              .map(
                (alt) => `<li class="variant-card">
                  <div class="variant-card__meta">
                    <span class="badge">${escape(alt.badge || "Option")}</span>
                    ${alt.trigger ? `<span class="variant-card__trigger">${escape(alt.trigger)}</span>` : ""}
                  </div>
                  <strong>${escape(alt.title)}</strong>
                  ${alt.replaces ? `<p class="variant-card__replaces">${escape(alt.replaces)}</p>` : ""}
                  <p>${escape(alt.description || "")}</p>
                </li>`
              )
              .join("")}
          </ul>
        </article>`;
      })
      .filter(Boolean)
      .join("");

    const match = DATA.days.find((d) => d.id === dayParam || d.date === dayParam);
    if (match) {
      const focusEl = document.getElementById(`variant-${match.id}`);
      if (focusEl) {
        requestAnimationFrame(() => focusEl.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    }
  }
})();
