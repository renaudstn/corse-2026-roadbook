(() => {
  const DATA = window.CORSE2026;
  if (!DATA) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const storageKey = "corse2026-checklist-v1";
  const dayKey = "corse2026-selected-day";

  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const params = new URLSearchParams(location.search);
  const nowISO = params.get("day") || todayISO();
  const findToday = () => DATA.days.find((d) => d.date === nowISO) || null;
  const baseById = (id) => DATA.bases.find((b) => b.id === id);
  const place = (id) => DATA.places?.[id];
  const dayIndex = (id) => DATA.days.findIndex((d) => d.id === id);

  let selectedId =
    localStorage.getItem(dayKey) || (findToday()?.id ?? DATA.days[0].id);
  if (!DATA.days.some((d) => d.id === selectedId)) selectedId = DATA.days[0].id;

  let dayMap = null;
  let overviewMap = null;

  /* ---------- Tips / info bubbles ---------- */
  const tipLayer = $("#tipLayer");
  const openTip = (title, text, eyebrow = "Info utile") => {
    $("#tipEyebrow").textContent = eyebrow;
    $("#tipTitle").textContent = title;
    $("#tipBody").textContent = text;
    tipLayer.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const closeTip = () => {
    tipLayer.hidden = true;
    document.body.style.overflow = "";
  };
  $("#tipClose")?.addEventListener("click", closeTip);
  tipLayer?.addEventListener("click", (e) => {
    if (e.target === tipLayer) closeTip();
  });

  const tipBtn = (title, text, eyebrow = "Info") =>
    `<button type="button" class="tip-btn" data-tip-title="${escapeAttr(title)}" data-tip-text="${escapeAttr(text)}" data-tip-eye="${escapeAttr(eyebrow)}" aria-label="Info : ${escapeAttr(title)}">i</button>`;

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tip-title]");
    if (!btn) return;
    openTip(btn.dataset.tipTitle, btn.dataset.tipText, btn.dataset.tipEye || "Info");
  });

  /* ---------- Menu / drawer ---------- */
  const drawer = $("#drawer");
  const scrim = $("#scrim");
  const menuBtn = $("#menuBtn");

  const setMenu = (open) => {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
    scrim.hidden = !open;
    const tipOpen = tipLayer && !tipLayer.hidden;
    document.body.style.overflow = open || tipOpen ? "hidden" : "";
  };

  menuBtn?.addEventListener("click", () => setMenu(!drawer.classList.contains("is-open")));
  $("#drawerClose")?.addEventListener("click", () => setMenu(false));
  scrim?.addEventListener("click", () => setMenu(false));
  $$("[data-nav]").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  $("#drawerDays").innerHTML = DATA.days
    .map((d) => {
      const isToday = d.date === nowISO;
      return `<button type="button" class="drawer-day${isToday ? " is-today" : ""}" data-go-day="${d.id}">
        <span class="drawer-day__num">${d.dayNum}</span>
        <span class="drawer-day__meta">
          <strong>${d.weekday}</strong>
          <em>${d.short}</em>
        </span>
      </button>`;
    })
    .join("");

  /* ---------- Select day helper ---------- */
  const selectDay = (id, { scroll = true, closeMenu = true } = {}) => {
    if (!DATA.days.some((d) => d.id === id)) return;
    selectedId = id;
    localStorage.setItem(dayKey, selectedId);
    renderRail();
    renderDay();
    updateSwitcher();
    updateDrawerActive();
    if (closeMenu) setMenu(false);
    if (scroll) {
      $("#programme")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goRelative = (delta) => {
    const i = dayIndex(selectedId);
    const next = DATA.days[i + delta];
    if (next) selectDay(next.id);
  };

  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go-day]");
    if (go) selectDay(go.dataset.goDay);
  });

  $("#prevDay")?.addEventListener("click", () => goRelative(-1));
  $("#nextDay")?.addEventListener("click", () => goRelative(1));
  $("#daySwitcherLabel")?.addEventListener("click", () => setMenu(true));

  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea, select")) return;
    if (e.key === "ArrowLeft") goRelative(-1);
    if (e.key === "ArrowRight") goRelative(1);
    if (e.key === "Escape") {
      closeTip();
      setMenu(false);
    }
  });

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
    .map(
      (r) => `<article class="rule"><h3>${r.title} ${tipBtn(r.title, r.text, "Règle")}</h3><p>${r.text}</p></article>`
    )
    .join("");

  /* ---------- Today ---------- */
  const today = findToday();
  const ribbon = $("#todayRibbon");
  const jumpToday = $("#jumpToday");

  if (today) {
    ribbon.hidden = false;
    $("#todayTitle").textContent = `${today.weekday} ${today.dayNum} · ${today.short}`;
    $("#todayLink").href = "#programme";
    $("#brandSub").textContent = `Aujourd'hui · ${today.short}`;
    jumpToday.classList.remove("is-dim");
  } else {
    $("#brandSub").textContent = nowISO < DATA.meta.start ? "Avant le départ" : "Séjour terminé";
    jumpToday.classList.add("is-dim");
  }

  jumpToday?.addEventListener("click", () => {
    if (!today) return;
    selectDay(today.id);
  });
  $("#ctaProgramme")?.addEventListener("click", (e) => {
    if (today) {
      e.preventDefault();
      selectDay(today.id);
    }
  });
  $("#todayLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (today) selectDay(today.id);
    else $("#programme")?.scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- Maps ---------- */
  const refreshMap = (map) => {
    if (!map) return;
    requestAnimationFrame(() => {
      map.invalidateSize(true);
      setTimeout(() => map.invalidateSize(true), 120);
      setTimeout(() => map.invalidateSize(true), 400);
    });
  };

  const makeMap = (el, markers, zoom = 10) => {
    if (!window.L || !el || !markers?.length) return null;
    const pts = markers.map((id) => place(id)).filter(Boolean);
    if (!pts.length) return null;

    // Ensure container has size before init
    el.style.minHeight = el.classList.contains("map--overview") ? "240px" : "220px";

    const map = L.map(el, {
      scrollWheelZoom: false,
      attributionControl: true,
      tapTolerance: 20,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    const latLngs = pts.map((p) => [p.lat, p.lng]);
    pts.forEach((p) => {
      L.circleMarker([p.lat, p.lng], {
        radius: 7,
        color: "#1a3d38",
        weight: 2,
        fillColor: "#c4a574",
        fillOpacity: 1,
      })
        .bindPopup(`<strong>${p.name}</strong>`)
        .addTo(map);
    });

    if (latLngs.length === 1) map.setView(latLngs[0], zoom);
    else map.fitBounds(latLngs, { padding: [32, 32], maxZoom: Math.min(zoom, 12) });

    refreshMap(map);

    // Re-layout when the map enters viewport (fixes blank tiles)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) refreshMap(map);
      },
      { threshold: 0.2 }
    );
    io.observe(el);

    return map;
  };

  const initOverviewMap = () => {
    const el = $("#overviewMap");
    if (!el || !window.L) return;
    if (overviewMap) {
      refreshMap(overviewMap);
      return;
    }
    overviewMap = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap",
    }).addTo(overviewMap);

    const latLngs = [];
    DATA.bases.forEach((b) => {
      if (b.lat == null) return;
      latLngs.push([b.lat, b.lng]);
      L.circleMarker([b.lat, b.lng], {
        radius: 8,
        color: b.color,
        weight: 2,
        fillColor: b.color,
        fillOpacity: 0.9,
      })
        .bindPopup(
          `<strong>${b.name}</strong><br>${b.dates}<br><em>${b.statusLabel}</em>`
        )
        .addTo(overviewMap);
    });
    if (latLngs.length) overviewMap.fitBounds(latLngs, { padding: [40, 40] });
    refreshMap(overviewMap);
  };

  /* ---------- Days UI ---------- */
  const rail = $("#dayRail");
  const stage = $("#dayStage");

  const intensityBars = (n) =>
    Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("");

  const intensityLabel = (n) =>
    ["", "Très légère", "Douce", "Modérée", "Soutenue", "Très chargée"][n] || "";

  const updateSwitcher = () => {
    const day = DATA.days.find((d) => d.id === selectedId);
    const i = dayIndex(selectedId);
    $("#switchDate").textContent = `${day.weekday} ${day.dayNum} août`;
    $("#switchTitle").textContent = day.short;
    $("#prevDay").disabled = i <= 0;
    $("#nextDay").disabled = i >= DATA.days.length - 1;
  };

  const updateDrawerActive = () => {
    $$("[data-go-day]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.goDay === selectedId);
    });
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
            title="${d.short}"
          >
            <span class="day-pill__dow">${d.weekday.slice(0, 3)}</span>
            <span class="day-pill__num">${d.dayNum}</span>
          </button>`;
      })
      .join("");

    $$(".day-pill", rail).forEach((btn) => {
      btn.addEventListener("click", () => selectDay(btn.dataset.day, { scroll: false }));
    });

    const activeBtn = $(`.day-pill[data-day="${selectedId}"]`, rail);
    activeBtn?.scrollIntoView({ inline: "center", block: "nearest" });
  };

  const renderDay = () => {
    const day = DATA.days.find((d) => d.id === selectedId);
    const base = baseById(day.baseId);
    const isToday = day.date === nowISO;
    const i = dayIndex(selectedId);
    const prev = DATA.days[i - 1];
    const next = DATA.days[i + 1];

    if (dayMap) {
      dayMap.remove();
      dayMap = null;
    }

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
            <span>Intensité ${tipBtn("Intensité", `Niveau ${day.intensity}/5 — ${intensityLabel(day.intensity)}. Une grosse journée sur deux max.`, "Rythme")}</span>
            <span class="intensity__bars">${intensityBars(day.intensity)}</span>
            <em class="intensity__label">${intensityLabel(day.intensity)}</em>
          </div>
        </div>

        ${
          day.why
            ? `<div class="why-block">
                <h4>Pourquoi ce programme</h4>
                <p>${day.why}</p>
              </div>`
            : ""
        }

        <div class="metrics">
          ${day.metrics
            .map(
              (m) => `<div class="metric"><span>${m.label}</span><strong>${m.value}</strong></div>`
            )
            .join("")}
        </div>

        ${
          day.pack?.length
            ? `<div class="pack-row">${day.pack.map((p) => `<span class="pack-chip">${p}</span>`).join("")}</div>`
            : ""
        }

        <p class="enrich"><strong>Conseil terrain ·</strong> ${day.enrich}</p>

        ${
          day.tips?.length
            ? `<div class="tip-row">${day.tips
                .map(
                  (t) =>
                    `<button type="button" class="tip-pill" data-tip-title="${escapeAttr(t.title)}" data-tip-text="${escapeAttr(t.text)}" data-tip-eye="À savoir"><span>${escapeAttr(t.title)}</span></button>`
                )
                .join("")}</div>`
            : ""
        }

        <div class="map-block">
          <div class="map-block__head">
            <h4>Carte du jour</h4>
            ${
              day.maps
                ? `<a class="map-link" href="${day.maps}" target="_blank" rel="noopener">Ouvrir l’itinéraire ↗</a>`
                : ""
            }
          </div>
          <div id="dayMap" class="map map--day"></div>
          <p class="map-caption">${(day.mapMarkers || [])
            .map((id) => place(id)?.name)
            .filter(Boolean)
            .join(" · ")}</p>
        </div>

        <div class="day-section-head">
          <h4>Déroulé</h4>
          ${tipBtn("Horaires", "Horaires indicatifs voiture/camping-car. À ajuster selon météo, circulation et énergie des enfants.", "Timing")}
        </div>
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
            <h4>À retenir ${tipBtn("À retenir", day.remember, "Mémo")}</h4>
            <p>${day.remember}</p>
          </div>
          <div class="note note--vigilance">
            <h4>Vigilance ${tipBtn("Vigilance", day.vigilance, "Attention")}</h4>
            <p>${day.vigilance}</p>
          </div>
          <div class="note note--planb" style="grid-column:1/-1">
            <h4>Plan B ${tipBtn("Plan B", day.planB, "Repli")}</h4>
            <p>${day.planB}</p>
          </div>
        </div>

        <div class="day-actions">
          ${base ? `<span class="btn btn--small" style="cursor:default">Base · ${base.name}</span>` : ""}
          ${day.maps ? `<a class="btn btn--small" href="${day.maps}" target="_blank" rel="noopener">Google Maps</a>` : ""}
          ${base?.phone ? `<a class="btn btn--small" href="tel:${base.phone}">Appeler</a>` : ""}
        </div>

        <div class="day-pager">
          <button type="button" class="day-pager__btn" data-go-day="${prev?.id || ""}" ${prev ? "" : "disabled"}>
            <span>← Précédent</span>
            <strong>${prev ? `${prev.dayNum} · ${prev.short}` : "—"}</strong>
          </button>
          <button type="button" class="day-pager__btn day-pager__btn--next" data-go-day="${next?.id || ""}" ${next ? "" : "disabled"}>
            <span>Suivant →</span>
            <strong>${next ? `${next.dayNum} · ${next.short}` : "—"}</strong>
          </button>
        </div>
      </article>`;

    // Fix empty data-go-day on disabled
    $$(".day-pager__btn[disabled]").forEach((b) => b.removeAttribute("data-go-day"));

    dayMap = makeMap($("#dayMap"), day.mapMarkers, day.mapZoom || 10);
  };

  /* ---------- Bases ---------- */
  $("#baseGrid").innerHTML = DATA.bases
    .map((b) => {
      const phones = [
        b.phone ? `<a href="tel:${b.phone}">${b.phoneDisplay || b.phone}</a>` : "",
        b.phone2 ? `<a class="secondary" href="tel:${b.phone2}">${b.phone2Display || b.phone2}</a>` : "",
        b.email ? `<a class="secondary" href="mailto:${b.email}">Email</a>` : "",
      ]
        .filter(Boolean)
        .join("");

      const osm =
        b.lat != null
          ? `https://www.openstreetmap.org/?mlat=${b.lat}&mlon=${b.lng}#map=14/${b.lat}/${b.lng}`
          : null;

      return `
        <article class="base-card" style="--accent:${b.color}">
          <h3>${b.name} ${tipBtn(b.name, b.note, b.statusLabel)}</h3>
          ${b.place ? `<p class="place">${b.place}</p>` : ""}
          <div class="meta">
            <span class="badge badge--${b.status}">${b.statusLabel}</span>
            <span class="badge">${b.dates}</span>
            ${b.altitude ? `<span class="badge">${b.altitude}</span>` : ""}
            ${b.nights ? `<span class="badge">${b.nights} nuit${b.nights > 1 ? "s" : ""}</span>` : ""}
          </div>
          <p class="note">${b.note}</p>
          ${b.lat != null ? `<div class="base-mini-map" data-base-map="${b.id}"></div>` : ""}
          <div class="base-actions">
            ${phones}
            ${osm ? `<a class="secondary" href="${osm}" target="_blank" rel="noopener">Carte</a>` : ""}
          </div>
        </article>`;
    })
    .join("");

  // Mini maps for bases
  const initBaseMaps = () => {
    if (!window.L) return;
    DATA.bases.forEach((b) => {
      const el = $(`[data-base-map="${b.id}"]`);
      if (!el || b.lat == null) return;
      const m = L.map(el, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
      }).setView([b.lat, b.lng], 12);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 16 }).addTo(m);
      L.circleMarker([b.lat, b.lng], {
        radius: 7,
        color: b.color,
        fillColor: b.color,
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(m);
      refreshMap(m);
    });
  };

  /* ---------- Checklist ---------- */
  let checks = (() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      return {};
    }
  })();

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
    .map(
      (l) =>
        `<article class="log-card"><h3>${l.title} ${tipBtn(l.title, l.text, "Logistique")}</h3><p>${l.text}</p></article>`
    )
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

  /* ---------- Active nav ---------- */
  const sections = ["accueil", "programme", "bases", "checklist", "logistique", "contacts"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActiveNav = (id) => {
    $$("[data-nav]").forEach((el) => {
      const key = el.getAttribute("data-nav");
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

  /* ---------- Boot ---------- */
  renderRail();
  renderDay();
  updateSwitcher();
  updateDrawerActive();

  const bootMaps = () => {
    initOverviewMap();
    initBaseMaps();
  };

  if (window.L) bootMaps();
  else window.addEventListener("load", bootMaps);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();
