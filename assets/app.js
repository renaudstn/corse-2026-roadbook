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

  // Always land at the very top (ignore restored scroll / leftover hashes)
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const scrollToTop = (smooth = false) => {
    window.scrollTo({ top: 0, left: 0, behavior: smooth ? "smooth" : "auto" });
  };
  scrollToTop(false);
  // Clear hash anchors that would jump mid-page on load
  if (location.hash && location.hash !== "#accueil") {
    history.replaceState(null, "", location.pathname + location.search);
  }
  requestAnimationFrame(() => scrollToTop(false));
  window.addEventListener("load", () => scrollToTop(false), { once: true });

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
    if (!next) return;
    const stageEl = $("#dayStage");
    if (stageEl) {
      stageEl.classList.remove("is-swipe-left", "is-swipe-right");
      // force reflow for retrigger
      void stageEl.offsetWidth;
      stageEl.classList.add(delta > 0 ? "is-swipe-left" : "is-swipe-right");
    }
    selectDay(next.id, { scroll: false });
  };

  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go-day]");
    if (go) selectDay(go.dataset.goDay);
  });

  $("#prevDay")?.addEventListener("click", () => goRelative(-1));
  $("#nextDay")?.addEventListener("click", () => goRelative(1));
  $("#daySwitcherLabel")?.addEventListener("click", () => setMenu(true));

  /* Swipe between days (horizontal) */
  const bindDaySwipe = (el) => {
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let tracking = false;

    el.addEventListener(
      "touchstart",
      (e) => {
        if (e.target.closest(".map, .leaflet-container, a, button, input, label")) {
          tracking = false;
          return;
        }
        const t = e.changedTouches[0];
        startX = t.clientX;
        startY = t.clientY;
        tracking = true;
      },
      { passive: true }
    );

    el.addEventListener(
      "touchend",
      (e) => {
        if (!tracking) return;
        tracking = false;
        const t = e.changedTouches[0];
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;
        if (Math.abs(dx) < 56) return;
        if (Math.abs(dx) < Math.abs(dy) * 1.2) return; // vertical scroll wins
        // swipe left → next day ; swipe right → previous
        goRelative(dx < 0 ? 1 : -1);
      },
      { passive: true }
    );
  };

  bindDaySwipe($("#programme"));
  bindDaySwipe($("#dayStage"));

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

  /* ---------- Today / Programme ---------- */
  const today = findToday();
  const firstDay = DATA.days[0];
  const programmeTarget = today || firstDay;
  const ribbon = $("#todayRibbon");
  const jumpToday = $("#jumpToday");

  if (today) {
    ribbon.hidden = false;
    $("#todayTitle").textContent = `${today.weekday} ${today.dayNum} · ${today.short}`;
    $("#todayLink").href = "#programme";
  }

  jumpToday?.addEventListener("click", () => {
    selectDay(programmeTarget.id);
  });
  $("#todayLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    selectDay(programmeTarget.id);
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

  const markerIcon = (num, label) =>
    L.divIcon({
      className: "pin",
      html: `<div class="pin__wrap" title="${escapeAttr(label)}">
        <span class="pin__badge">${num}</span>
        <span class="pin__label">${escapeAttr(label)}</span>
      </div>`,
      iconSize: [120, 36],
      iconAnchor: [14, 18],
    });

  const addNumberedMarkers = (map, pts) => {
    const latLngs = pts.map((p) => [p.lat, p.lng]);
    pts.forEach((p, i) => {
      L.marker([p.lat, p.lng], { icon: markerIcon(i + 1, p.name), zIndexOffset: 100 + i })
        .bindPopup(`<strong>${i + 1}. ${p.name}</strong>`)
        .addTo(map);
    });
    return latLngs;
  };

  const drawStraightRoute = (map, latLngs) => {
    if (latLngs.length < 2) return null;
    return L.polyline(latLngs, {
      color: "#163f39",
      weight: 3.5,
      opacity: 0.85,
      dashArray: null,
      lineJoin: "round",
    }).addTo(map);
  };

  const fetchRoadRoute = async (pts) => {
    if (pts.length < 2) return null;
    const coords = pts.map((p) => `${p.lng},${p.lat}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) return null;
      const data = await res.json();
      const geom = data?.routes?.[0]?.geometry?.coordinates;
      if (!geom?.length) return null;
      return geom.map(([lng, lat]) => [lat, lng]);
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };

  const makeMap = (el, markers, zoom = 10) => {
    if (!window.L || !el || !markers?.length) return null;
    const pts = markers.map((id) => place(id)).filter(Boolean);
    if (!pts.length) return null;

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

    const latLngs = addNumberedMarkers(map, pts);
    let routeLine = drawStraightRoute(map, latLngs);

    if (latLngs.length === 1) map.setView(latLngs[0], zoom);
    else map.fitBounds(latLngs, { padding: [48, 48], maxZoom: Math.min(zoom, 12) });

    refreshMap(map);

    // Upgrade to real road geometry when online
    if (pts.length >= 2) {
      fetchRoadRoute(pts).then((road) => {
        if (!road?.length || !map) return;
        if (routeLine) map.removeLayer(routeLine);
        routeLine = L.polyline(road, {
          color: "#163f39",
          weight: 4,
          opacity: 0.9,
          lineJoin: "round",
        }).addTo(map);
        map.fitBounds(routeLine.getBounds(), { padding: [40, 40], maxZoom: Math.min(zoom, 12) });
        refreshMap(map);
      });
    }

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

    const ordered = DATA.bases.filter((b) => b.lat != null);
    const pts = ordered.map((b) => ({ name: b.name, lat: b.lat, lng: b.lng, color: b.color }));
    const latLngs = pts.map((p) => [p.lat, p.lng]);

    pts.forEach((p, i) => {
      L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: "pin",
          html: `<div class="pin__wrap pin__wrap--base" style="--pin:${p.color}">
            <span class="pin__badge">${i + 1}</span>
            <span class="pin__label">${escapeAttr(p.name)}</span>
          </div>`,
          iconSize: [140, 36],
          iconAnchor: [14, 18],
        }),
        zIndexOffset: 100 + i,
      })
        .bindPopup(
          `<strong>${i + 1}. ${p.name}</strong><br>${ordered[i].dates}<br><em>${ordered[i].statusLabel}</em>`
        )
        .addTo(overviewMap);
    });

    let routeLine = drawStraightRoute(overviewMap, latLngs);
    if (latLngs.length) overviewMap.fitBounds(latLngs, { padding: [48, 48] });
    refreshMap(overviewMap);

    fetchRoadRoute(pts).then((road) => {
      if (!road?.length || !overviewMap) return;
      if (routeLine) overviewMap.removeLayer(routeLine);
      routeLine = L.polyline(road, {
        color: "#163f39",
        weight: 4,
        opacity: 0.85,
      }).addTo(overviewMap);
      overviewMap.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
      refreshMap(overviewMap);
    });

    const legend = $("#overviewLegend");
    if (legend) {
      legend.innerHTML = ordered
        .map(
          (b, i) =>
            `<li><span class="map-legend__n" style="background:${b.color}">${i + 1}</span><span>${b.name}${b.place ? ` · ${b.place}` : ""} <em>${b.dates}</em></span></li>`
        )
        .join("");
    }
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

    // Horizontal centering only — never scroll the page
    const activeBtn = $(`.day-pill[data-day="${selectedId}"]`, rail);
    if (activeBtn && rail) {
      const left = activeBtn.offsetLeft - (rail.clientWidth - activeBtn.offsetWidth) / 2;
      rail.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
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
          <ol class="map-legend">
            ${(day.mapMarkers || [])
              .map((id, i) => {
                const p = place(id);
                return p
                  ? `<li><span class="map-legend__n">${i + 1}</span><span>${p.name}</span></li>`
                  : "";
              })
              .join("")}
          </ol>
          <p class="map-caption">${
            (day.mapMarkers || []).length > 1
              ? "Trajet dans l’ordre numéroté · trait = itinéraire routier"
              : "Point du jour"
          }</p>
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
      L.marker([b.lat, b.lng], {
        icon: L.divIcon({
          className: "pin",
          html: `<div class="pin__wrap pin__wrap--mini" style="--pin:${b.color}">
            <span class="pin__badge">•</span>
            <span class="pin__label">${escapeAttr(b.name)}</span>
          </div>`,
          iconSize: [130, 32],
          iconAnchor: [12, 16],
        }),
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

  /* Brand / title → always back to absolute top */
  const goHomeTop = (e) => {
    e?.preventDefault?.();
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    setMenu(false);
    scrollToTop(true);
  };
  $("#heroTitle")?.addEventListener("click", goHomeTop);
  $$('a[href="#accueil"]').forEach((a) => a.addEventListener("click", goHomeTop));

  /* ---------- Boot ---------- */
  renderRail();
  renderDay();
  updateSwitcher();
  updateDrawerActive();

  /* Hero wow: entrance + parallax + menu solidify off-hero */
  const hero = $("#accueil");
  const heroParallax = $("#heroParallax");
  const menuBtnFab = $("#menuBtn");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  requestAnimationFrame(() => hero?.classList.add("is-ready"));

  const onScrollHero = () => {
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const h = hero.offsetHeight || 1;
    const progress = Math.min(1, Math.max(0, -rect.top / (h * 0.75)));
    hero.style.setProperty("--hero-progress", progress.toFixed(3));
    hero.classList.toggle("is-leaving", progress > 0.02);

    // Glass on hero → solid when leaving the photo
    const onHero = rect.bottom > window.innerHeight * 0.55;
    menuBtnFab?.classList.toggle("is-solid", !onHero);

    if (!reduceMotion && heroParallax) {
      if (progress > 0.01) {
        heroParallax.style.animation = "none";
        const y = Math.min(140, Math.max(0, -rect.top * 0.38));
        heroParallax.style.transform = `translate3d(0, ${y}px, 0) scale(1.1)`;
      } else {
        heroParallax.style.animation = "";
        heroParallax.style.transform = "";
      }
    }
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScrollHero();
        ticking = false;
      });
    },
    { passive: true }
  );
  onScrollHero();

  // Section reveal
  const revealIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-in");
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  $$("[data-reveal]").forEach((el) => revealIo.observe(el));

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
