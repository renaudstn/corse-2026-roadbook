(() => {
  const DATA = window.CORSE2026_ALT;
  if (!DATA) return;

  const $ = (sel, root = document) => root.querySelector(sel);

  const changeClass = (type) => {
    if (type === "keep") return "is-keep";
    if (type === "add") return "is-add";
    if (type === "replace") return "is-replace";
    if (type === "alt") return "is-alt";
    return "is-note";
  };

  const changeLabel = (type) => {
    if (type === "keep") return "Conserve";
    if (type === "add") return "Ajoute";
    if (type === "replace") return "Remplace";
    if (type === "alt") return "Repli";
    return "Note";
  };

  $("#altLead").textContent = DATA.meta.note;

  $("#altPrinciples").innerHTML = DATA.principles
    .map(
      (block) => `<article class="alt-principle">
        <h3>${block.title}</h3>
        <ul>${block.items.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>`
    )
    .join("");

  const melo = DATA.meloFallback;
  $("#meloTitle").textContent = melo.title;
  $("#meloIntro").textContent = melo.intro;
  $("#meloFallbacks").innerHTML = melo.options
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

  $("#altDays").innerHTML = DATA.days
    .map(
      (day) => `<article class="alt-day" id="${day.id}">
        <header class="alt-day__head">
          <div class="alt-day__meta">
            <span class="tag">${day.weekday} ${day.dayNum} août</span>
            <span class="tag">${day.base}</span>
            <span class="tag">Intensité ${day.intensity}/5</span>
          </div>
          <h3>${day.title}</h3>
          <p class="lead">${day.summary}</p>
        </header>

        <div class="alt-day__changes">
          <h4>Ce que ça change</h4>
          <ul>
            ${day.changes
              .map(
                (c) => `<li class="alt-change ${changeClass(c.type)}">
                  <span class="alt-change__type">${changeLabel(c.type)}</span>
                  <span>${c.text}</span>
                </li>`
              )
              .join("")}
          </ul>
        </div>

        <div class="alt-day__plan">
          <h4>Déroulement proposé</h4>
          <ol>${day.plan.map((step) => `<li>${step}</li>`).join("")}</ol>
        </div>

        ${
          day.caution
            ? `<p class="alt-day__caution"><strong>Attention ·</strong> ${day.caution}</p>`
            : ""
        }
      </article>`
    )
    .join("");
})();
