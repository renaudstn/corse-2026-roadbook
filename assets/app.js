(() => {
  const DATA = window.CORSE2026;
  if (!DATA) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const storageKey = "corse2026-checklist-v1";
  const dayKey = "corse2026-selected-day";

  const todayISO = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Allow preview of a day via ?day=2026-08-08
  const params = new URLSearchParams(location.search);
  const forcedDay = params.get("day");
  const nowISO = forcedDay || todayISO();

  const findToday = () => DATA.days.find((d) => d.date === nowISO) || null;
  const baseById = (id) => DATA.bases.find((b) => b.id === id);

  /* ---------- Menu ---------- */
  const drawer = $("#drawer");
  const scrim = $("#scrim");
  const menuBtn = $("#menuBtn");

  const setMenu = (open) => {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
    scrim.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  };

  menuBtn?.addEventListener("click", () => setMenu(!drawer.classList.contains("is-open")));
  scrim?.addEventListener("click", () => setMenu(false));
  $$("[data-nav]").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Overview ---------- */
  const stats = [
    { value: "14", label: "jours" },
    { value: "13", label: "nuits" },
    { value: "3", label: "bases camping" },
    { value: "2", label: "véhicules" },
  ];
  $("#statRow").innerHTML = stats
    .map((s) => `<div class="stat"><strong>${s.value}</strong><span>${s.label}</span></div>`)
    .join("");

  $("#routeStrip").innerHTML = DATA.bases
    .map(
      (b) => `
      <article class="route-item" style="--accent:${b.color}">
        <span class="route-item__dot" aria-hidden="true"></span>
        <div>
          <h3>${b.name}${b.place ? ` · ${b.place}` : ""}</h3>
          <p>${b.role} · ${b.dates}${b.nights ? ` · ${b.nights} nuit${b.nights > 1 ? "s" : ""}` : ""}</p>
        </div>
        <span class="badge badge--${b.status}">${b.statusLabel}</span>
      </article>`
    )
    .join("");

  $("#rules").innerHTML = DATA.rules
    .map((r) => `<article class="rule"><h3>${r.title}</h3><p>${r.text}</p></article>`)
    .join("");

  /* ---------- Today ribbon ---------- */
  const today = findToday();
  const ribbon = $("#todayRibbon");
  const jumpToday = $("#jumpToday");

  if (today) {
    ribbon.hidden = false;
    $("#todayTitle").textContent = `${today.weekday} ${today.dayNum} · ${today.short}`;
    $("#todayLink").href = `#day-${today.id}`;
    $("#brandSub").textContent = `Aujourd'hui · ${today.short}`;
    jumpToday.classList.remove("is-dim");
  } else {
    const before = nowISO < DATA.meta.start;
    $("#brandSub").textContent = before ? "Avant le départ" : "Séjour terminé";
    jumpToday.classList.add("is-dim");
  }

  /* ---------- Days ---------- */
  let selectedId =
    localStorage.getItem(dayKey) ||
    (today ? today.id : DATA.days[0].id);

  if (!DATA.days.some((d) => d.id === selectedId)) {
    selectedId = DATA.days[0].id;
  }

  const rail = $("#dayRail");
  const stage = $("#dayStage");

  const intensityBars = (n) =>
    Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("");

  const renderDay = (day) => {
    const base = baseById(day.baseId);
    const isToday = day.date === nowISO;

    stage.innerHTML = `
      <article class="day-card" id="day-${day.id}">
        <div class="day-card__hero">
          <div class="day-card__meta">
            <span class="tag">${day.weekday} ${day.dayNum} août</span>
            <span class="tag">${day.vibe}</span>
            ${isToday ? `<span class="tag">Aujourd'hui</span>` : ""}
            ${day.tags.slice(0, 2).map((t) => `<span class="tag">${t}</span>`).join("")}
          </div>
          <h3>${day.title}</h3>
          <p class="lead">${day.summary}</p>
          <div class="intensity" aria-label="Intensité ${day.intensity} sur 5">
            <span>Intensité</span>
            <span class="intensity__bars">${intensityBars(day.intensity)}</span>
          </div>
        </div>

        <div class="metrics">
          ${day.metrics
            .map(
              (m) => `<div class="metric"><span>${m.label}</span><strong>${m.value}</strong></div>`
            )
            .join("")}
        </div>

        <p class="enrich" style="margin-top:1rem"><strong>Conseil terrain ·</strong> ${day.enrich}</p>

        <ol class="timeline">
          ${day.timeline
            .map(
              (t) => `
            <li>
              <span class="timeline__time">${t.time}</span>
              <div class="timeline__body">
                <h4>${t.title}</h4>
                <p>${t.detail}</p>
              </div>
            </li>`
            )
            .join("")}
        </ol>

        <div class="notes">
          <div class="note">
            <h4>À retenir</h4>
            <p>${day.remember}</p>
          </div>
          <div class="note note--vigilance">
            <h4>Vigilance</h4>
            <p>${day.vigilance}</p>
          </div>
          <div class="note note--planb" style="grid-column:1/-1">
            <h4>Plan B</h4>
            <p>${day.planB}</p>
          </div>
        </div>

        <div class="day-actions">
          ${
            base
              ? `<span class="btn btn--small" style="cursor:default">Base · ${base.name}</span>`
              : ""
          }
          ${
            day.maps
              ? `<a class="btn btn--small" href="${day.maps}" target="_blank" rel="noopener">Itinéraire Maps</a>`
              : ""
          }
          ${
            base?.phone
              ? `<a class="btn btn--small" href="tel:${base.phone}">Appeler le camping</a>`
              : ""
          }
        </div>
      </article>`;
  };

  const renderRail = () => {
    rail.innerHTML = DATA.days
      .map((d) => {
        const active = d.id === selectedId;
        const isToday = d.date === nowISO;
        return `
          <button
            class="day-pill${active ? " is-active" : ""}${isToday ? " is-today" : ""}"
            role="tab"
            aria-selected="${active}"
            data-day="${d.id}"
            type="button"
          >
            <span class="day-pill__dow">${d.weekday.slice(0, 3)}</span>
            <span class="day-pill__num">${d.dayNum}</span>
          </button>`;
      })
      .join("");

    $$(".day-pill", rail).forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedId = btn.dataset.day;
        localStorage.setItem(dayKey, selectedId);
        renderRail();
        renderDay(DATA.days.find((d) => d.id === selectedId));
        btn.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      });
    });

    const activeBtn = $(`.day-pill[data-day="${selectedId}"]`, rail);
    activeBtn?.scrollIntoView({ inline: "center", block: "nearest" });
  };

  renderRail();
  renderDay(DATA.days.find((d) => d.id === selectedId));

  jumpToday?.addEventListener("click", () => {
    if (!today) return;
    selectedId = today.id;
    localStorage.setItem(dayKey, selectedId);
    renderRail();
    renderDay(today);
    $("#programme").scrollIntoView({ behavior: "smooth" });
  });

  $("#ctaProgramme")?.addEventListener("click", () => {
    if (today) {
      selectedId = today.id;
      localStorage.setItem(dayKey, selectedId);
      renderRail();
      renderDay(today);
    }
  });

  /* ---------- Bases ---------- */
  $("#baseGrid").innerHTML = DATA.bases
    .map((b) => {
      const phones = [
        b.phone
          ? `<a href="tel:${b.phone}">${b.phoneDisplay || b.phone}</a>`
          : "",
        b.phone2
          ? `<a class="secondary" href="tel:${b.phone2}">${b.phone2Display || b.phone2}</a>`
          : "",
        b.email
          ? `<a class="secondary" href="mailto:${b.email}">Email</a>`
          : "",
      ]
        .filter(Boolean)
        .join("");

      return `
        <article class="base-card" style="--accent:${b.color}">
          <h3>${b.name}</h3>
          ${b.place ? `<p class="place">${b.place}</p>` : ""}
          <div class="meta">
            <span class="badge badge--${b.status}">${b.statusLabel}</span>
            <span class="badge">${b.dates}</span>
            ${b.altitude ? `<span class="badge">${b.altitude}</span>` : ""}
            ${b.nights ? `<span class="badge">${b.nights} nuit${b.nights > 1 ? "s" : ""}</span>` : ""}
          </div>
          <p class="note">${b.note}</p>
          ${phones ? `<div class="base-actions">${phones}</div>` : ""}
        </article>`;
    })
    .join("");

  /* ---------- Checklist ---------- */
  const loadChecks = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  };

  let checks = loadChecks();

  const renderChecks = () => {
    $("#checkList").innerHTML = DATA.checklist
      .map((item) => {
        const done = !!checks[item.id];
        return `
          <li>
            <label class="check-item${done ? " is-done" : ""}">
              <input type="checkbox" data-check="${item.id}" ${done ? "checked" : ""} />
              <span>${item.label}</span>
            </label>
          </li>`;
      })
      .join("");

    $$("[data-check]").forEach((input) => {
      input.addEventListener("change", () => {
        checks[input.dataset.check] = input.checked;
        localStorage.setItem(storageKey, JSON.stringify(checks));
        renderChecks();
      });
    });
  };

  renderChecks();

  $("#resetCheck")?.addEventListener("click", () => {
    checks = {};
    localStorage.setItem(storageKey, JSON.stringify(checks));
    renderChecks();
  });

  /* ---------- Logistics & contacts ---------- */
  $("#logGrid").innerHTML = DATA.logistics
    .map((l) => `<article class="log-card"><h3>${l.title}</h3><p>${l.text}</p></article>`)
    .join("");

  const contactBases = DATA.bases.filter((b) => b.phone || b.email);
  $("#contactGrid").innerHTML = contactBases
    .map(
      (b) => `
      <article class="contact-card">
        <h3>${b.name}</h3>
        <p class="place" style="margin:0.25rem 0 0;color:var(--muted);font-size:0.9rem">${b.dates}</p>
        <div class="base-actions" style="margin-top:0.9rem">
          ${b.phone ? `<a href="tel:${b.phone}">${b.phoneDisplay}</a>` : ""}
          ${b.phone2 ? `<a class="secondary" href="tel:${b.phone2}">${b.phone2Display}</a>` : ""}
          ${b.email ? `<a class="secondary" href="mailto:${b.email}">${b.email}</a>` : ""}
        </div>
      </article>`
    )
    .join("");

  /* ---------- Active nav on scroll ---------- */
  const sections = ["accueil", "programme", "bases", "checklist", "logistique", "contacts"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActiveNav = (id) => {
    $$("[data-nav], [data-dock]").forEach((el) => {
      const key = el.getAttribute("data-nav") || el.getAttribute("data-dock");
      const map = {
        home: "accueil",
        days: "programme",
        bases: "bases",
        check: "checklist",
        logistics: "logistique",
        contacts: "contacts",
      };
      el.classList.toggle("is-active", map[key] === id);
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveNav(visible.target.id);
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.35, 0.6] }
  );
  sections.forEach((s) => io.observe(s));

  /* ---------- Service worker ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();
