(() => {
  const IS_ALT = document.body.dataset.mode === "alt";
  const DATA = window.CORSE2026;
  if (!DATA) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const CHECKLIST_KEY = "corse2026-checklist-v1";
  const DAY_KEY = IS_ALT ? "corse2026-alt-selected-day" : "corse2026-selected-day";
  const hasLocalStorage = (() => {
    try {
      const k = "__corse2026_test__";
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return true;
    } catch {
      return false;
    }
  })();

  const escapeAttr = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  const h = escapeAttr;
  const cssEscape = (value) =>
    window.CSS?.escape ? CSS.escape(String(value)) : String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");

  const getStored = (key) => {
    if (!hasLocalStorage) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const setStored = (key, value) => {
    if (!hasLocalStorage) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Private browsing or storage quota should not block the roadbook.
    }
  };

  const parseStoredJson = (key, fallback) => {
    try {
      return JSON.parse(getStored(key) || "") || fallback;
    } catch {
      return fallback;
    }
  };

  const arrays = (value) => (Array.isArray(value) ? value : []);
  const number = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
  const place = (id) => DATA.places?.[id] || null;
  const baseById = (id) => arrays(DATA.bases).find((b) => b.id === id) || null;
  const dayIndex = (id) => arrays(DATA.days).findIndex((d) => d.id === id);
  const currentDay = () => arrays(DATA.days).find((d) => d.id === selectedId) || arrays(DATA.days)[0] || null;
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const REAL_TODAY = todayISO();

  const formatMinutes = (minutes) => {
    if (minutes == null || Number.isNaN(Number(minutes))) return "—";
    const total = Math.max(0, Math.round(Number(minutes)));
    const hr = Math.floor(total / 60);
    const min = total % 60;
    if (!hr) return `${min} min`;
    if (!min) return `${hr} h`;
    return `${hr} h ${String(min).padStart(2, "0")}`;
  };

  const formatKm = (km) => (km == null || Number.isNaN(Number(km)) ? "—" : `~${Math.round(Number(km))} km`);
  const formatTime = (time) => (time ? String(time).replace(":", " h ") : "—");
  const vehicleLabel = (vehicle) =>
    ({
      car: "Voiture",
      camper: "Camping-car",
      both: "CC + voiture",
      walk: "À pied / navette",
      boat: "Bateau + voiture",
    }[vehicle] || vehicle || "—");

  const intensityLabel = (n) =>
    ({
      1: "Très légère",
      2: "Journée légère",
      3: "Modérée",
      4: "Grande journée",
      5: "Très chargée",
    }[Number(n)] || "Non renseignée");

  const intensityClass = (n) => `badge--intensity-${Math.max(1, Math.min(5, Number(n) || 1))}`;
  const isEarlyDeparture = (departure) => !!departure && String(departure).slice(0, 5) <= "08:00";
  const categoryLabel = (day) => day.vibe || day.category || arrays(day.tags)[0] || "Programme";
  const mapMarkersFor = (day) => arrays(day.map?.markers || day.mapMarkers);
  const mapZoomFor = (day) => day.map?.zoom || day.mapZoom || 10;
  const googleMapsFor = (day) => day.map?.googleMapsUrl || day.maps || "";

  const fmtDateFr = (iso) => {
    if (!iso) return "";
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(d);
  };

  const tripStatus = () => {
    const start = DATA.meta?.start || arrays(DATA.days)[0]?.date;
    const end = DATA.meta?.end || arrays(DATA.days).at(-1)?.date;
    if (start && REAL_TODAY < start) return "before";
    if (end && REAL_TODAY > end) return "after";
    return arrays(DATA.days).some((d) => d.date === REAL_TODAY) ? "during" : "outside";
  };

  const tripToday = () => arrays(DATA.days).find((d) => d.date === REAL_TODAY) || null;
  const nextOrCurrentDay = () => {
    const days = arrays(DATA.days);
    if (!days.length) return null;
    const current = tripToday();
    if (current) return current;
    return days.find((d) => d.date && d.date >= REAL_TODAY) || days.at(-1);
  };

  const params = new URLSearchParams(location.search);
  const dayParam = params.get("day");
  const paramDay = dayParam
    ? arrays(DATA.days).find((d) => d.id === dayParam || d.date === dayParam) || null
    : null;

  let selectedId =
    paramDay?.id ||
    getStored(DAY_KEY) ||
    tripToday()?.id ||
    arrays(DATA.days)[0]?.id ||
    "";
  if (!arrays(DATA.days).some((d) => d.id === selectedId)) selectedId = arrays(DATA.days)[0]?.id || "";

  let dayMap = null;
  let overviewMap = null;
  let checks = parseStoredJson(CHECKLIST_KEY, {});
  let lastTipTrigger = null;
  let lastDrawerTrigger = null;
  let lastPickerTrigger = null;

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const scrollToTop = (smooth = false) => {
    window.scrollTo({ top: 0, left: 0, behavior: smooth ? "smooth" : "auto" });
  };

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  const focusables = (root) => $$(focusableSelector, root).filter((el) => el.offsetParent !== null || el === document.activeElement);
  const isTypingTarget = (el = document.activeElement) =>
    !!el?.closest?.("input, textarea, select, [contenteditable='true']");
  const tipOpen = () => {
    const layer = $("#tipLayer");
    return !!layer && !layer.hidden;
  };
  const drawerOpen = () => $("#drawer")?.classList.contains("is-open") || false;
  const pickerOpen = () => {
    const picker = $("#dayPicker");
    return !!picker && !picker.hidden;
  };
  const setBodyLock = () => {
    document.body.style.overflow = tipOpen() || drawerOpen() ? "hidden" : "";
  };

  const trapTab = (event, root) => {
    if (event.key !== "Tab" || !root) return;
    const items = focusables(root);
    if (!items.length) {
      event.preventDefault();
      return;
    }
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const tipLayer = $("#tipLayer");
  const openTip = (title, text, eyebrow = "Info utile", trigger = document.activeElement) => {
    if (!tipLayer) return;
    lastTipTrigger = trigger instanceof HTMLElement ? trigger : null;
    $("#tipEyebrow") && ($("#tipEyebrow").textContent = eyebrow);
    $("#tipTitle") && ($("#tipTitle").textContent = title);
    $("#tipBody") && ($("#tipBody").textContent = text);
    tipLayer.hidden = false;
    setBodyLock();
    requestAnimationFrame(() => $("#tipClose")?.focus());
  };

  const closeTip = ({ restore = true } = {}) => {
    if (!tipLayer || tipLayer.hidden) return;
    tipLayer.hidden = true;
    setBodyLock();
    if (restore) lastTipTrigger?.focus?.();
    lastTipTrigger = null;
  };

  const tipBtn = (title, text, eyebrow = "Info") =>
    `<button type="button" class="tip-btn" data-tip-title="${h(title)}" data-tip-text="${h(text)}" data-tip-eye="${h(eyebrow)}" aria-label="Info : ${h(title)}">i</button>`;

  $("#tipClose")?.addEventListener("click", () => closeTip());
  tipLayer?.addEventListener("click", (event) => {
    if (event.target === tipLayer) closeTip();
  });

  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-tip-title]");
    if (!btn) return;
    openTip(btn.dataset.tipTitle || "", btn.dataset.tipText || "", btn.dataset.tipEye || "Info", btn);
  });

  /* ---------- Drawer, day picker, bottom nav ---------- */
  const drawer = $("#drawer");
  const scrim = $("#scrim");
  const menuBtn = $("#menuBtn");

  const setDrawer = (open, trigger = menuBtn) => {
    if (!drawer) return;
    if (open) lastDrawerTrigger = trigger instanceof HTMLElement ? trigger : menuBtn;
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    menuBtn?.setAttribute("aria-expanded", String(open));
    $$("[data-open-drawer]").forEach((btn) => btn.setAttribute("aria-expanded", String(open)));
    if (scrim) scrim.hidden = !open;
    setBodyLock();
    if (open) {
      requestAnimationFrame(() => ($("#drawerClose") || focusables(drawer)[0])?.focus?.());
    } else {
      lastDrawerTrigger?.focus?.();
      lastDrawerTrigger = null;
    }
  };

  const ensureDayPicker = () => {
    if ($("#dayPicker")) return $("#dayPicker");
    const switcher = $("#daySwitcher");
    if (!switcher) return null;
    const panel = document.createElement("div");
    panel.id = "dayPicker";
    panel.className = "day-picker";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Choisir un jour");
    switcher.insertAdjacentElement("afterend", panel);
    return panel;
  };

  const renderDayPicker = () => {
    const picker = ensureDayPicker();
    if (!picker) return;
    picker.innerHTML = `
      <div class="day-picker__panel">
        <div class="day-picker__head">
          <strong>Choisir un jour</strong>
          <button type="button" class="day-picker__close" id="dayPickerClose" aria-label="Fermer le choix du jour">×</button>
        </div>
        <div class="day-picker__list" role="listbox">
          ${arrays(DATA.days)
            .map((d) => {
              const active = d.id === selectedId;
              const isToday = d.date === REAL_TODAY;
              return `<button type="button" class="drawer-day day-picker__day${active ? " is-active" : ""}${isToday ? " is-today" : ""}" data-picker-day="${h(d.id)}" role="option" aria-selected="${active}">
                <span class="drawer-day__num">${h(d.dayNum)}</span>
                <span class="drawer-day__meta">
                  <strong>${h(d.weekday)} ${h(d.dayNum)}</strong>
                  <em>${h(d.short || d.title)}</em>
                </span>
              </button>`;
            })
            .join("")}
        </div>
      </div>`;
  };

  const setDayPicker = (open, trigger = $("#daySwitcherLabel")) => {
    const picker = ensureDayPicker();
    const label = $("#daySwitcherLabel");
    if (!picker) return;
    if (open) {
      renderDayPicker();
      lastPickerTrigger = trigger instanceof HTMLElement ? trigger : label;
    }
    picker.hidden = !open;
    label?.setAttribute("aria-expanded", String(open));
    if (open) requestAnimationFrame(() => $(".day-picker__day.is-active", picker)?.focus() || $("#dayPickerClose")?.focus());
    if (!open) {
      lastPickerTrigger?.focus?.();
      lastPickerTrigger = null;
    }
  };

  const ensureBottomNav = () => {
    let nav = $("#bottomNav");
    if (!nav) {
      nav = document.createElement("nav");
      nav.id = "bottomNav";
      nav.className = "bottom-nav";
      nav.setAttribute("aria-label", "Navigation rapide");
      document.body.appendChild(nav);
    }
    const items = [
      $("#overview") ? { label: "Vue d'ensemble", href: "#overview", nav: "overview" } : null,
      $("#programme") ? { label: "Programme", href: "#programme", nav: "days" } : null,
      $("#bases") ? { label: "Campings", href: "#bases", nav: "bases" } : null,
      { label: "Plus", action: "drawer", nav: "plus" },
    ].filter(Boolean).slice(0, 4);

    nav.innerHTML = items
      .map((item) =>
        item.action === "drawer"
          ? `<button type="button" class="bottom-nav__item" data-open-drawer data-nav="${h(item.nav)}" aria-controls="drawer" aria-expanded="false">${h(item.label)}</button>`
          : `<a class="bottom-nav__item" href="${h(item.href)}" data-nav="${h(item.nav)}">${h(item.label)}</a>`
      )
      .join("");
    document.body.classList.add("has-bottom-nav");
    menuBtn?.classList.add("menu-btn--with-bottom-nav");
  };

  ensureBottomNav();
  renderDayPicker();
  $("#daySwitcherLabel")?.setAttribute("aria-controls", "dayPicker");
  $("#daySwitcherLabel")?.setAttribute("aria-expanded", "false");

  menuBtn?.addEventListener("click", () => setDrawer(!drawerOpen(), menuBtn));
  $("#drawerClose")?.addEventListener("click", () => setDrawer(false));
  scrim?.addEventListener("click", () => setDrawer(false));

  document.addEventListener("click", (event) => {
    const openDrawer = event.target.closest("[data-open-drawer]");
    if (openDrawer) {
      event.preventDefault();
      setDrawer(true, openDrawer);
      return;
    }

    const nav = event.target.closest("[data-nav]");
    if (nav && nav.tagName === "A") setDrawer(false);

    const picked = event.target.closest("[data-picker-day]");
    if (picked) {
      selectDay(picked.dataset.pickerDay, { scroll: true, closePicker: true });
      return;
    }

    if (pickerOpen() && !event.target.closest("#dayPicker, #daySwitcherLabel")) {
      setDayPicker(false);
    }
  });

  $("#daySwitcherLabel")?.addEventListener("click", () => setDayPicker(!pickerOpen(), $("#daySwitcherLabel")));
  document.addEventListener("click", (event) => {
    if (event.target.closest("#dayPickerClose")) setDayPicker(false);
  });

  const renderDrawerDays = () => {
    const drawerDays = $("#drawerDays");
    if (!drawerDays) return;
    drawerDays.innerHTML = arrays(DATA.days)
      .map((d) => {
        const active = d.id === selectedId;
        const isToday = d.date === REAL_TODAY;
        return `<button type="button" class="drawer-day${active ? " is-active" : ""}${isToday ? " is-today" : ""}" data-go-day="${h(d.id)}">
          <span class="drawer-day__num">${h(d.dayNum)}</span>
          <span class="drawer-day__meta">
            <strong>${h(d.weekday)} ${h(d.dayNum)}</strong>
            <em>${h(d.short || d.title)}</em>
          </span>
        </button>`;
      })
      .join("");
  };

  /* ---------- Overview ---------- */
  const overviewStats = () => {
    const days = arrays(DATA.days);
    const bases = arrays(DATA.bases);
    const reserved = bases.filter((b) => b.status === "ok").length;
    const unreserved = bases.filter((b) => b.status !== "ok").length;
    const nightsFromBases = bases.reduce((acc, b) => acc + number(b.nights), 0);
    return {
      days: days.length,
      nights: nightsFromBases || Math.max(0, days.length - 1),
      stages: bases.length,
      vehicles: DATA.meta?.vehicleCount || 2,
      bigDays: days.filter((d) => number(d.intensity) >= 4).length,
      reserved,
      unreserved,
      distanceKm: days.reduce((acc, d) => acc + number(d.travel?.distanceKm), 0),
    };
  };

  const uncheckedChecklist = () =>
    arrays(DATA.checklist)
      .filter((item) => !checks[item.id])
      .slice(0, 3);

  const renderOverview = () => {
    const stats = overviewStats();
    const statRow = $("#statRow");
    if (statRow) {
      const items = [
        { value: stats.days, label: "jours" },
        { value: stats.nights, label: "nuits" },
        { value: stats.stages, label: "étapes" },
        { value: stats.vehicles, label: "véhicules" },
        { value: stats.bigDays, label: "grandes journées" },
        { value: stats.reserved, label: "réservées" },
        { value: stats.unreserved, label: "à caler" },
        { value: `${Math.round(stats.distanceKm)} km`, label: "route estimée" },
      ];
      statRow.innerHTML = items
        .map((s) => `<div class="stat"><strong>${h(s.value)}</strong><span>${h(s.label)}</span></div>`)
        .join("");
    }

    const overviewLead = $("#overviewLead");
    if (overviewLead) {
      overviewLead.textContent = `${stats.days} jours, ${stats.nights} nuits, ${stats.stages} étapes d'hébergement et ${stats.vehicles} véhicules. ${stats.bigDays} grande(s) journée(s) à protéger par des journées plus légères.`;
    }

    const overviewActions = $("#overviewActions");
    if (overviewActions) {
      const next = uncheckedChecklist();
      overviewActions.innerHTML = `
        <a class="btn btn--small" href="#programme">Voir le programme</a>
        <a class="btn btn--small btn--ghost" href="#checklist">Check-list</a>
        ${
          next.length
            ? `<div class="overview-next">
                <strong>À faire ensuite</strong>
                <ol>${next.map((item) => `<li>${h(item.label)}</li>`).join("")}</ol>
              </div>`
            : `<p class="overview-next"><strong>Check-list prête</strong> Tous les items sont cochés sur cet appareil.</p>`
        }`;
    }

    const scenarioNote = $("#scenarioNote");
    if (scenarioNote && (DATA.meta?.scenarioSouthLabel || DATA.meta?.scenarioSouthWhy)) {
      scenarioNote.innerHTML = `
        <strong>${h(DATA.meta.scenarioSouthLabel || "Scénario sud retenu")}</strong>
        ${DATA.meta.scenarioSouthWhy ? `<span>${h(DATA.meta.scenarioSouthWhy)}</span>` : ""}`;
    }
  };

  const renderRouteStrip = () => {
    const routeStrip = $("#routeStrip");
    if (!routeStrip || !DATA.bases) return;
    routeStrip.innerHTML = arrays(DATA.bases)
      .map(
        (b, index) => `
      <article class="route-item" style="--accent:${h(b.color || "#163f39")}">
        <span class="route-item__dot" aria-hidden="true"></span>
        <div>
          <h3>${h(index + 1)}. ${h(b.name)}${b.place ? ` · ${h(b.place)}` : ""}</h3>
          <p>${h(b.role || "Étape")} · ${h(b.dates || "")}${b.nights ? ` · ${h(b.nights)} nuit${number(b.nights) > 1 ? "s" : ""}` : ""}</p>
        </div>
        <span class="badge badge--${h(b.status || "pending")}">${h(b.statusLabel || b.status || "À confirmer")}</span>
      </article>`
      )
      .join("");
  };

  const renderRules = () => {
    const rulesEl = $("#rules");
    if (!rulesEl || !DATA.rules) return;
    rulesEl.innerHTML = arrays(DATA.rules)
      .map((r) => `<article class="rule"><h3>${h(r.title)} ${tipBtn(r.title, r.text, "Règle")}</h3><p>${h(r.text)}</p></article>`)
      .join("");
  };

  /* ---------- Hero / today ---------- */
  const renderHeroToday = () => {
    const status = tripStatus();
    const today = tripToday();
    const next = nextOrCurrentDay();
    const jumpToday = $("#jumpToday");
    const programmeTarget = today || next || arrays(DATA.days)[0];

    if (jumpToday) jumpToday.textContent = status === "during" && today ? "Aujourd'hui" : "Programme";

    const heroNext = $("#heroNext");
    if (heroNext && next) {
      const prefix = today ? "Aujourd'hui" : status === "after" ? "Dernier jour" : "Prochain jour";
      heroNext.textContent = `${prefix} : ${next.weekday} ${next.dayNum} · ${next.short || next.title}`;
    }

    const ribbon = $("#todayRibbon");
    if (today && ribbon) {
      ribbon.hidden = false;
      $("#todayTitle") && ($("#todayTitle").textContent = `${today.weekday} ${today.dayNum} · ${today.short || today.title}`);
      const todayLink = $("#todayLink");
      if (todayLink) todayLink.href = "#programme";
    }

    jumpToday?.addEventListener("click", () => {
      if (programmeTarget) selectDay(programmeTarget.id);
    });
    $("#todayLink")?.addEventListener("click", (event) => {
      event.preventDefault();
      if (programmeTarget) selectDay(programmeTarget.id);
    });
  };

  /* ---------- Maps ---------- */
  const refreshMap = (map) => {
    if (!map) return;
    requestAnimationFrame(() => {
      map.invalidateSize(true);
      setTimeout(() => map.invalidateSize(true), 120);
      setTimeout(() => map.invalidateSize(true), 420);
    });
  };

  const markerColor = (kind) =>
    ({
      base: "#163f39",
      plage: "#1d5f7a",
      randonnee: "#2f6b3c",
      parking: "#8a5a2b",
      viewpoint: "#a55c26",
      ville: "#354f73",
      visite: "#7a4f8f",
    }[kind] || "#163f39");

  const markerIcon = (num, label, kind = "point") => {
    const compact = window.matchMedia("(max-width: 640px)").matches;
    const safeKind = String(kind || "point").replace(/[^a-z0-9_-]/gi, "").toLowerCase();
    return L.divIcon({
      className: `pin pin--${safeKind}${compact ? " pin--compact" : ""}`,
      html: `<div class="pin__wrap pin__wrap--${safeKind}" title="${h(label)}" style="--pin:${h(markerColor(kind))}">
        <span class="pin__badge">${h(num)}</span>
        ${compact ? "" : `<span class="pin__label">${h(label)}</span>`}
      </div>`,
      iconSize: compact ? [34, 34] : [132, 38],
      iconAnchor: compact ? [17, 17] : [15, 19],
    });
  };

  const popupHtml = (p, index) =>
    p.info
      ? `<strong>${h(index + 1)}. ${h(p.name)}</strong><br><a href="${h(p.info)}" target="_blank" rel="noopener">${h(p.infoLabel || "Infos")} ↗</a>`
      : `<strong>${h(index + 1)}. ${h(p.name)}</strong>`;

  const drawStraightRoute = (map, latLngs, options = {}) => {
    if (!map || latLngs.length < 2) return null;
    return L.polyline(latLngs, {
      color: options.color || "#163f39",
      weight: options.weight || 3.5,
      opacity: options.opacity || 0.85,
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

  const pointListFromMarkers = (markerIds) =>
    arrays(markerIds)
      .map((id) => place(id))
      .filter((p) => p && p.lat != null && p.lng != null);

  const makeMap = (el, markerIds, zoom = 10, captionEl = null, { road = true } = {}) => {
    if (!window.L || !el) return null;
    const pts = pointListFromMarkers(markerIds);
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

    const latLngs = pts.map((p) => [p.lat, p.lng]);
    pts.forEach((p, index) => {
      L.marker([p.lat, p.lng], {
        icon: markerIcon(index + 1, p.name, p.kind),
        zIndexOffset: 100 + index,
      })
        .bindPopup(popupHtml(p, index))
        .addTo(map);
    });

    let routeLine = drawStraightRoute(map, latLngs);
    if (captionEl) captionEl.textContent = latLngs.length > 1 ? "Ordre des étapes" : "Point du jour";
    if (latLngs.length === 1) map.setView(latLngs[0], zoom);
    else map.fitBounds(latLngs, { padding: [48, 48], maxZoom: Math.min(zoom, 12) });
    refreshMap(map);

    if (road && pts.length >= 2) {
      fetchRoadRoute(pts).then((roadLatLngs) => {
        if (!roadLatLngs?.length || !map) return;
        if (routeLine) map.removeLayer(routeLine);
        routeLine = L.polyline(roadLatLngs, {
          color: "#163f39",
          weight: 4,
          opacity: 0.9,
          lineJoin: "round",
        }).addTo(map);
        if (captionEl) captionEl.textContent = "Itinéraire routier estimé";
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

  const renderMapLegend = (markerIds) =>
    arrays(markerIds)
      .map((id, index) => {
        const p = place(id);
        if (!p) return "";
        const link = p.info
          ? `<a class="place-link" href="${h(p.info)}" target="_blank" rel="noopener">${h(p.name)}<span class="place-link__src">${h(p.infoLabel || "Infos")} ↗</span></a>`
          : h(p.name);
        return `<li><span class="map-legend__n">${h(index + 1)}</span><span>${link}</span></li>`;
      })
      .join("");

  const initOverviewMap = () => {
    const el = $("#overviewMap");
    if (!el || !window.L || !DATA.bases) return;
    if (overviewMap) {
      refreshMap(overviewMap);
      return;
    }

    const ordered = arrays(DATA.bases).filter((b) => b.lat != null && b.lng != null);
    if (!ordered.length) return;
    const pts = ordered.map((b) => ({
      name: b.name,
      lat: b.lat,
      lng: b.lng,
      kind: "base",
      color: b.color,
      dates: b.dates,
      statusLabel: b.statusLabel,
    }));

    overviewMap = L.map(el, { scrollWheelZoom: false, tapTolerance: 20 });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap",
    }).addTo(overviewMap);

    const latLngs = pts.map((p) => [p.lat, p.lng]);
    pts.forEach((p, index) => {
      L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: "pin pin--base",
          html: `<div class="pin__wrap pin__wrap--base" style="--pin:${h(p.color || markerColor("base"))}">
            <span class="pin__badge">${h(index + 1)}</span>
            <span class="pin__label">${h(p.name)}</span>
          </div>`,
          iconSize: [140, 36],
          iconAnchor: [14, 18],
        }),
        zIndexOffset: 100 + index,
      })
        .bindPopup(`<strong>${h(index + 1)}. ${h(p.name)}</strong><br>${h(p.dates || "")}<br><em>${h(p.statusLabel || "")}</em>`)
        .addTo(overviewMap);
    });

    drawStraightRoute(overviewMap, latLngs);
    overviewMap.fitBounds(latLngs, { padding: [48, 48] });
    refreshMap(overviewMap);

    const legend = $("#overviewLegend");
    if (legend) {
      legend.innerHTML = ordered
        .map(
          (b, index) =>
            `<li><span class="map-legend__n" style="background:${h(b.color || markerColor("base"))}">${h(index + 1)}</span><span>${h(b.name)}${b.place ? ` · ${h(b.place)}` : ""} <em>${h(b.dates || "")}</em></span></li>`
        )
        .join("");
    }

    const caption = $(".overview-map-wrap .map-caption");
    if (caption) caption.textContent = `${ordered.length} étapes d'hébergement · trait = transfert principal (ordre)`;
  };

  const placesStripHtml = (markerIds) => {
    const items = arrays(markerIds)
      .map((id) => place(id))
      .filter((p) => p?.info);
    if (!items.length) return "";
    return `<div class="places-strip">
      <h4>Lieux · infos & photos</h4>
      <div class="places-strip__list">
        ${items
          .map(
            (p) =>
              `<a class="place-chip" href="${h(p.info)}" target="_blank" rel="noopener">
                <strong>${h(p.name)}</strong>
                <span>${h(p.infoLabel || "Infos")} ↗</span>
              </a>`
          )
          .join("")}
      </div>
    </div>`;
  };

  const closeFullscreenMaps = () => {
    $$(".map-block.is-fullscreen").forEach((block) => block.classList.remove("is-fullscreen"));
    refreshMap(dayMap);
    refreshMap(overviewMap);
  };

  document.addEventListener("click", (event) => {
    const expand = event.target.closest("[data-map-expand]");
    if (!expand) return;
    const block = expand.closest(".map-block, .overview-map-wrap");
    if (!block) return;
    block.classList.toggle("is-fullscreen");
    expand.setAttribute("aria-expanded", String(block.classList.contains("is-fullscreen")));
    refreshMap(dayMap);
    refreshMap(overviewMap);
  });

  /* ---------- Days UI ---------- */
  const rail = $("#dayRail");
  const stage = $("#dayStage");
  const canRenderDays = !!stage || !(IS_ALT && $("#variantsRoot"));

  const metricHtml = (label, value, extraClass = "") =>
    `<div class="metric ${h(extraClass)}"><span>${h(label)}</span><strong>${h(value)}</strong></div>`;

  const levelOneMetrics = (day) => [
    metricHtml("Départ", formatTime(day.schedule?.departure), isEarlyDeparture(day.schedule?.departure) ? "badge--early" : ""),
    metricHtml("Distance", formatKm(day.travel?.distanceKm)),
    metricHtml("Conduite", formatMinutes(day.travel?.drivingMinutes)),
    metricHtml("Activité", formatMinutes(day.activity?.durationMinutes)),
    metricHtml("Véhicule", vehicleLabel(day.travel?.vehicle)),
  ];

  const criticalAlertsHtml = (day) => {
    const criticals = arrays(day.alerts).filter((a) => a.level === "critical");
    if (!criticals.length) return "";
    return `<div class="day-alerts day-alerts--critical" role="list" aria-label="Alertes critiques">
      ${criticals
        .map((a) => `<p class="day-alert day-alert--critical" role="listitem"><strong>Critique</strong><span>${h(a.text)}</span></p>`)
        .join("")}
    </div>`;
  };

  const highlightsHtml = (day) => {
    const highlights = arrays(day.highlights).length
      ? arrays(day.highlights).slice(0, 5)
      : arrays(day.timeline)
          .map((t) => t.title)
          .slice(0, 5);
    if (!highlights.length) return "";
    return `<ol class="day-highlights">
      ${highlights.map((item) => `<li>${h(item)}</li>`).join("")}
    </ol>`;
  };

  const timelineHtml = (day) => {
    if (!arrays(day.timeline).length) return "";
    return `<div class="day-section-head">
      <h4>Déroulé complet</h4>
      ${tipBtn("Horaires", "Horaires indicatifs voiture/camping-car. À ajuster selon météo, circulation et énergie des enfants.", "Timing")}
    </div>
    <ol class="timeline">
      ${arrays(day.timeline)
        .map(
          (t) => `<li>
            <span class="timeline__time">${h(t.time)}</span>
            <div class="timeline__body">
              <h4>${h(t.title)}</h4>
              <p>${h(t.detail)}</p>
            </div>
          </li>`
        )
        .join("")}
    </ol>`;
  };

  const parkingHtml = (day) => {
    const parking = arrays(day.parking);
    if (!parking.length) return "";
    return `<div class="note note--parking">
      <h4>Stationnement</h4>
      <ul>${parking.map((p) => `<li><strong>${h(p.place || "Parking")}</strong> — ${h(p.note || p)}</li>`).join("")}</ul>
    </div>`;
  };

  const childAndLunchHtml = (day) => {
    if (!day.activity?.childSuitability && !day.enrich) return "";
    return `<div class="note note--children">
      <h4>Enfants & repas</h4>
      ${day.activity?.childSuitability ? `<p><strong>Adaptation :</strong> ${h(day.activity.childSuitability)}</p>` : ""}
      ${day.enrich ? `<p><strong>Conseil terrain :</strong> ${h(day.enrich)}</p>` : ""}
    </div>`;
  };

  const timingHtml = (day) => {
    const items = [
      day.schedule?.wakeUp ? ["Réveil", formatTime(day.schedule.wakeUp)] : null,
      day.schedule?.departure ? ["Départ cible", formatTime(day.schedule.departure)] : null,
      day.schedule?.arrivalTarget ? ["Arrivée cible", formatTime(day.schedule.arrivalTarget)] : null,
      day.schedule?.expectedReturn ? ["Retour prévu", formatTime(day.schedule.expectedReturn)] : null,
    ].filter(Boolean);
    if (!items.length) return "";
    return `<div class="metrics metrics--timing">
      ${items.map(([label, value]) => metricHtml(label, value, label === "Départ cible" && isEarlyDeparture(day.schedule?.departure) ? "badge--early" : "")).join("")}
    </div>`;
  };

  const essentialsHtml = (day) => {
    const essentials = arrays(day.essentials || day.pack);
    if (!essentials.length) return "";
    return `<div class="pack-row" aria-label="Essentiels">${essentials.map((p) => `<span class="pack-chip">${h(p)}</span>`).join("")}</div>`;
  };

  const nonCriticalVigilanceHtml = (day) => {
    const alerts = arrays(day.alerts).filter((a) => a.level !== "critical");
    if (!day.vigilance && !alerts.length) return "";
    return `<div class="notes notes--vigilance">
      ${day.vigilance ? `<div class="note note--vigilance"><h4>Vigilance</h4><p>${h(day.vigilance)}</p></div>` : ""}
      ${alerts
        .map(
          (a) =>
            `<div class="note note--${h(a.level || "info")}"><h4>${a.level === "warn" ? "Attention" : "Info"}</h4><p>${h(a.text)}</p></div>`
        )
        .join("")}
    </div>`;
  };

  const alternativeBadge = (alt) =>
    ({
      replace: "Remplace",
      add: "Ajoute",
      shorten: "Raccourcit",
      weather: "Repli météo",
      sport: "Option sportive",
      sportive: "Option sportive",
      fallback: "Repli météo",
    }[alt.kind] || alt.badge || "Option");

  const alternativesHtml = (day) => {
    const alts = arrays(day.alternatives);
    if (!alts.length && !day.planB && !arrays(day.changes).length) return "";
    return `<div class="alt-diff">
      ${arrays(day.changes).length ? `<h4>Ce que ça change</h4>` : `<h4>Variantes & replis</h4>`}
      <ul>
        ${arrays(day.changes)
          .map((c) => `<li class="alt-change is-${h(c.type || "note")}"><span class="alt-change__type">${h(c.type || "Note")}</span><span>${h(c.text)}</span></li>`)
          .join("")}
        ${alts
          .map(
            (alt) => `<li class="alt-change is-${h(alt.kind || "note")}">
              <span class="alt-change__type">${h(alternativeBadge(alt))}</span>
              <span>
                <strong>${h(alt.title)}</strong>
                ${alt.trigger ? `<em>Déclencheur : ${h(alt.trigger)}</em>` : ""}
                ${alt.replaces ? `<em>Remplace : ${h(alt.replaces)}</em>` : ""}
                ${alt.description ? `<small>${h(alt.description)}</small>` : ""}
              </span>
            </li>`
          )
          .join("")}
      </ul>
      ${day.planB ? `<p class="note note--planb"><strong>Plan B :</strong> ${h(day.planB)}</p>` : ""}
    </div>`;
  };

  const verifyHtml = (day) => {
    if (!arrays(day.verify).length) return "";
    return `<div class="verify">
      <h4>À vérifier</h4>
      <ul>
        ${arrays(day.verify)
          .map(
            (v) => `<li>
              <strong>${h(v.when)}</strong>
              <span>${h(v.what)}</span>
              <em>${h(v.source)}${v.consequence ? ` · ${h(v.consequence)}` : ""}</em>
              ${v.link ? `<a href="${h(v.link)}" target="_blank" rel="noopener">Source ↗</a>` : ""}
            </li>`
          )
          .join("")}
      </ul>
    </div>`;
  };

  const tipsSourcesHtml = (day) => {
    const tips = arrays(day.tips);
    const sourcePlaces = mapMarkersFor(day)
      .map((id) => place(id))
      .filter((p) => p?.info);
    if (!tips.length && !sourcePlaces.length) return "";
    return `<div>
      ${
        tips.length
          ? `<div class="tip-row">${tips
              .map(
                (t) =>
                  `<button type="button" class="tip-pill" data-tip-title="${h(t.title)}" data-tip-text="${h(t.text)}" data-tip-eye="À savoir"><span>${h(t.title)}</span></button>`
              )
              .join("")}</div>`
          : ""
      }
      ${sourcePlaces.length ? placesStripHtml(mapMarkersFor(day)) : ""}
    </div>`;
  };

  const detailsHtml = (title, body, open = false) => {
    if (!body) return "";
    return `<details class="day-details"${open ? " open" : ""}>
      <summary>${h(title)}</summary>
      <div class="day-details__body">${body}</div>
    </details>`;
  };

  const mapBlockHtml = (day) => {
    const markers = mapMarkersFor(day);
    const maps = googleMapsFor(day);
    if (!markers.length && !maps) return "";
    return `<div class="map-block">
      <div class="map-block__head">
        <h4>Carte du jour</h4>
        <div class="map-block__actions">
          <button type="button" class="btn btn--small btn--ghost" data-map-expand aria-expanded="false">Agrandir</button>
          ${maps ? `<a class="btn btn--small btn--solid map-link" href="${h(maps)}" target="_blank" rel="noopener">Google Maps ↗</a>` : ""}
        </div>
      </div>
      ${markers.length ? `<div id="dayMap" class="map map--day"></div>` : ""}
      ${markers.length ? `<ol class="map-legend">${renderMapLegend(markers)}</ol>` : ""}
      <p class="map-caption">${markers.length > 1 ? "Ordre des étapes" : "Point du jour"}</p>
    </div>`;
  };

  const renderRail = () => {
    if (!rail) return;
    rail.innerHTML = arrays(DATA.days)
      .map((d) => {
        const active = d.id === selectedId;
        const isToday = d.date === REAL_TODAY;
        return `<button class="day-pill${active ? " is-active" : ""}${isToday ? " is-today" : ""}" role="tab" aria-selected="${active}" data-day="${h(d.id)}" type="button" title="${h(d.short || d.title)}">
          <span class="day-pill__dow">${h(String(d.weekday || "").slice(0, 3))}</span>
          <span class="day-pill__num">${h(d.dayNum)}</span>
        </button>`;
      })
      .join("");

    $$(".day-pill", rail).forEach((btn) => {
      btn.addEventListener("click", () => selectDay(btn.dataset.day, { scroll: false }));
    });

    const activeBtn = $(`.day-pill[data-day="${cssEscape(selectedId)}"]`, rail);
    if (activeBtn) {
      const left = activeBtn.offsetLeft - (rail.clientWidth - activeBtn.offsetWidth) / 2;
      rail.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
  };

  const updateSwitcher = () => {
    const day = currentDay();
    if (!day) return;
    const index = dayIndex(selectedId);
    $("#switchDate") && ($("#switchDate").textContent = `${day.weekday} ${day.dayNum} août`);
    $("#switchTitle") && ($("#switchTitle").textContent = day.short || day.title);
    const prevBtn = $("#prevDay");
    const nextBtn = $("#nextDay");
    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= arrays(DATA.days).length - 1;
    renderDayPicker();
  };

  const updateActiveDayButtons = () => {
    $$("[data-go-day], [data-picker-day]").forEach((btn) => {
      const id = btn.dataset.goDay || btn.dataset.pickerDay;
      btn.classList.toggle("is-active", id === selectedId);
      if (btn.hasAttribute("aria-selected")) btn.setAttribute("aria-selected", String(id === selectedId));
    });
  };

  const updateUrlDay = () => {
    if (!new URLSearchParams(location.search).has("day")) return;
    const url = new URL(location.href);
    url.searchParams.set("day", selectedId);
    history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  function selectDay(id, { scroll = true, closeMenu = true, closePicker = false } = {}) {
    if (!arrays(DATA.days).some((d) => d.id === id)) return;
    selectedId = id;
    setStored(DAY_KEY, selectedId);
    updateUrlDay();
    renderRail();
    renderDay();
    updateSwitcher();
    renderDrawerDays();
    updateActiveDayButtons();
    if (closeMenu) setDrawer(false);
    if (closePicker) setDayPicker(false);
    if (scroll) $("#programme")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const goRelative = (delta) => {
    const index = dayIndex(selectedId);
    const next = arrays(DATA.days)[index + delta];
    if (!next) return;
    const stageEl = $("#dayStage");
    if (stageEl) {
      stageEl.classList.remove("is-swipe-left", "is-swipe-right");
      void stageEl.offsetWidth;
      stageEl.classList.add(delta > 0 ? "is-swipe-left" : "is-swipe-right");
    }
    selectDay(next.id, { scroll: false });
  };

  const renderDay = () => {
    const day = currentDay();
    if (!day || !stage || !canRenderDays) return;
    const base = baseById(day.baseId);
    const index = dayIndex(day.id);
    const prev = arrays(DATA.days)[index - 1];
    const next = arrays(DATA.days)[index + 1];
    const isToday = day.date === REAL_TODAY;
    const maps = googleMapsFor(day);

    if (dayMap) {
      dayMap.remove();
      dayMap = null;
    }

    const altLinkHtml = IS_ALT
      ? `<a class="day-alt-link btn btn--small" href="./index.html?day=${h(day.id)}#programme">Programme principal</a>`
      : `<a class="day-alt-link btn btn--small" href="./alt.html?day=${h(day.id)}">Variantes & replis</a>`;

    stage.innerHTML = `<article class="day-card" id="day-${h(day.id)}">
      <div class="day-card__hero">
        <div class="day-card__meta">
          <span class="tag">${h(day.weekday)} ${h(day.dayNum)} août</span>
          <span class="tag">${h(categoryLabel(day))}</span>
          ${isToday ? `<span class="tag">Aujourd'hui</span>` : ""}
          ${arrays(day.tags)
            .slice(0, 2)
            .map((t) => `<span class="tag">${h(t)}</span>`)
            .join("")}
        </div>
        <h3>${h(day.short || day.title)}</h3>
        ${day.title && day.short && day.title !== day.short ? `<p class="lead">${h(day.title)}</p>` : day.summary ? `<p class="lead">${h(day.summary)}</p>` : ""}
        <div class="day-card__badges">
          <span class="badge ${h(intensityClass(day.intensity))}">${h(intensityLabel(day.intensity))}</span>
          ${isEarlyDeparture(day.schedule?.departure) ? `<span class="badge badge--early">Départ tôt ${h(formatTime(day.schedule.departure))}</span>` : ""}
        </div>
        <div class="day-alt-row">${altLinkHtml}</div>
        ${
          day.budgetDay
            ? `<p class="day-cost-chip" title="${h(day.budgetDay.note || "")}">Coût jour ~ <strong>${h(day.budgetDay.mid)} €</strong><span>estimation milieu</span></p>`
            : ""
        }
      </div>

      <div class="day-layout">
        <div class="day-layout__main">
          <section class="day-level day-level--primary" aria-label="Essentiel du jour">
            ${highlightsHtml(day)}
            ${criticalAlertsHtml(day)}
            ${maps ? `<p class="day-primary-action"><a class="btn btn--primary" href="${h(maps)}" target="_blank" rel="noopener">Ouvrir l'itinéraire Google Maps ↗</a></p>` : ""}
          </section>

          <section class="day-level day-level--secondary" aria-label="Détails pratiques">
            ${timelineHtml(day)}
            <div class="notes">
              ${parkingHtml(day)}
              ${childAndLunchHtml(day)}
            </div>
            ${essentialsHtml(day)}
            ${timingHtml(day)}
          </section>
        </div>

        <aside class="day-layout__aside" aria-label="Carte et métriques du jour">
          <div class="metrics">${levelOneMetrics(day).join("")}</div>
          ${mapBlockHtml(day)}
        </aside>
      </div>

      <section class="day-level day-level--tertiary" aria-label="Compléments">
        ${detailsHtml("Pourquoi ce programme", day.why ? `<p>${h(day.why)}</p>` : "")}
        ${detailsHtml("Vigilance", nonCriticalVigilanceHtml(day))}
        ${detailsHtml("Alternatives / plan B", alternativesHtml(day))}
        ${detailsHtml("À vérifier", verifyHtml(day), arrays(day.verify).some((v) => /veille|avant|aujourd/i.test(v.when || "")))}
        ${detailsHtml("Tips / sources", tipsSourcesHtml(day))}
      </section>

      <div class="day-actions">
        ${base ? `<span class="btn btn--small" style="cursor:default">Étape · ${h(base.name)}</span>` : ""}
        ${maps ? `<a class="btn btn--small" href="${h(maps)}" target="_blank" rel="noopener">Google Maps</a>` : ""}
        ${base?.phone ? `<a class="btn btn--small" href="tel:${h(base.phone)}">Appeler</a>` : ""}
      </div>

      <div class="day-pager">
        <button type="button" class="day-pager__btn" data-go-day="${prev ? h(prev.id) : ""}" ${prev ? "" : "disabled"}>
          <span>← Précédent</span>
          <strong>${prev ? `${h(prev.dayNum)} · ${h(prev.short || prev.title)}` : "—"}</strong>
        </button>
        <button type="button" class="day-pager__btn day-pager__btn--next" data-go-day="${next ? h(next.id) : ""}" ${next ? "" : "disabled"}>
          <span>Suivant →</span>
          <strong>${next ? `${h(next.dayNum)} · ${h(next.short || next.title)}` : "—"}</strong>
        </button>
      </div>
    </article>`;

    $$(".day-pager__btn[disabled]", stage).forEach((btn) => btn.removeAttribute("data-go-day"));
    const mapEl = $("#dayMap", stage);
    const caption = $(".map-block .map-caption", stage);
    if (mapEl) dayMap = makeMap(mapEl, mapMarkersFor(day), mapZoomFor(day), caption, { road: true });
  };

  document.addEventListener("click", (event) => {
    const go = event.target.closest("[data-go-day]");
    if (!go || !go.dataset.goDay) return;
    selectDay(go.dataset.goDay);
  });

  $("#prevDay")?.addEventListener("click", () => goRelative(-1));
  $("#nextDay")?.addEventListener("click", () => goRelative(1));

  const bindDaySwipe = (el) => {
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let tracking = false;
    el.addEventListener(
      "touchstart",
      (event) => {
        if (event.target.closest(".map, .leaflet-container, a, button, input, label, details")) {
          tracking = false;
          return;
        }
        const t = event.changedTouches[0];
        startX = t.clientX;
        startY = t.clientY;
        tracking = true;
      },
      { passive: true }
    );
    el.addEventListener(
      "touchend",
      (event) => {
        if (!tracking) return;
        tracking = false;
        const t = event.changedTouches[0];
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;
        if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
        goRelative(dx < 0 ? 1 : -1);
      },
      { passive: true }
    );
  };
  bindDaySwipe($("#programme"));

  /* ---------- Bases, budget, checklist, logistics ---------- */
  const renderBases = () => {
    const baseGrid = $("#baseGrid");
    if (!baseGrid || !DATA.bases) return;
    baseGrid.innerHTML = arrays(DATA.bases)
      .map((b) => {
        const phones = [
          b.phone ? `<a href="tel:${h(b.phone)}">${h(b.phoneDisplay || b.phone)}</a>` : "",
          b.phone2 ? `<a class="secondary" href="tel:${h(b.phone2)}">${h(b.phone2Display || b.phone2)}</a>` : "",
          b.email ? `<a class="secondary" href="mailto:${h(b.email)}">Email</a>` : "",
        ]
          .filter(Boolean)
          .join("");
        const osm =
          b.lat != null
            ? `https://www.openstreetmap.org/?mlat=${encodeURIComponent(b.lat)}&mlon=${encodeURIComponent(b.lng)}#map=14/${encodeURIComponent(b.lat)}/${encodeURIComponent(b.lng)}`
            : "";
        return `<article class="base-card" style="--accent:${h(b.color || "#163f39")}">
          <h3>${h(b.name)} ${tipBtn(b.name, b.note || "", b.statusLabel || "Camping")}</h3>
          ${b.place ? `<p class="place">${h(b.place)}</p>` : ""}
          <div class="meta">
            <span class="badge badge--${h(b.status || "pending")}">${h(b.statusLabel || b.status || "À confirmer")}</span>
            ${b.dates ? `<span class="badge">${h(b.dates)}</span>` : ""}
            ${b.altitude ? `<span class="badge">${h(b.altitude)}</span>` : ""}
            ${b.nights ? `<span class="badge">${h(b.nights)} nuit${number(b.nights) > 1 ? "s" : ""}</span>` : ""}
          </div>
          ${b.note ? `<p class="note">${h(b.note)}</p>` : ""}
          ${arrays(b.fallbacks).length ? `<ul class="base-fallbacks">${arrays(b.fallbacks).map((f) => `<li>${h(f)}</li>`).join("")}</ul>` : ""}
          ${b.lat != null ? `<div class="base-mini-map" data-base-map="${h(b.id)}"></div>` : ""}
          <div class="base-actions">
            ${phones}
            ${osm ? `<a class="secondary" href="${h(osm)}" target="_blank" rel="noopener">Carte</a>` : ""}
          </div>
        </article>`;
      })
      .join("");
  };

  const initBaseMaps = () => {
    if (!window.L || !DATA.bases) return;
    arrays(DATA.bases).forEach((b) => {
      const el = $(`[data-base-map="${cssEscape(b.id)}"]`);
      if (!el || b.lat == null || el.dataset.ready === "1") return;
      el.dataset.ready = "1";
      const map = L.map(el, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
      }).setView([b.lat, b.lng], 12);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 16 }).addTo(map);
      L.marker([b.lat, b.lng], {
        icon: L.divIcon({
          className: "pin pin--base",
          html: `<div class="pin__wrap pin__wrap--mini pin__wrap--base" style="--pin:${h(b.color || markerColor("base"))}">
            <span class="pin__badge">•</span>
            <span class="pin__label">${h(b.name)}</span>
          </div>`,
          iconSize: [130, 32],
          iconAnchor: [12, 16],
        }),
      }).addTo(map);
      refreshMap(map);
    });
  };

  const money = (n) => `${Math.round(number(n)).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
  const attachDayBudgets = () => {
    const map = IS_ALT ? DATA._dayCostsAlt : DATA._dayCostsMain;
    if (!map) return;
    arrays(DATA.days).forEach((d) => {
      if (map[d.id]) d.budgetDay = map[d.id];
    });
  };

  const renderBudget = () => {
    const root = $("#budgetRoot");
    const budget = IS_ALT ? DATA.budgetAlt : DATA.budget;
    if (!root || !budget) return;
    const delta =
      IS_ALT && budget.vsMain
        ? `<p class="budget-delta">Écart vs programme principal (milieu) : <strong>${budget.vsMain.mid >= 0 ? "+" : ""}${money(budget.vsMain.mid)}</strong></p>`
        : "";
    root.innerHTML = `<div class="budget-hero">
      <div class="budget-hero__main">
        <p class="budget-hero__label">Estimation milieu · ${h(arrays(DATA.days).length)} jours</p>
        <p class="budget-hero__total">${money(budget.totals?.mid)}</p>
        <p class="budget-hero__range">Fourchette <strong>${money(budget.totals?.low)}</strong> → <strong>${money(budget.totals?.high)}</strong></p>
        <p class="budget-hero__day">~ ${money(budget.perDay?.mid)} / jour (milieu)</p>
        ${delta}
      </div>
      <div class="budget-hero__meta">
        <p><strong>${h(budget.party?.label || "")}</strong></p>
        <p>${h(budget.party?.vehicles || "")}</p>
        <p class="budget-hero__updated">Maj. ${h(budget.updated || "")}</p>
      </div>
    </div>
    <div class="budget-cats">
      ${arrays(budget.categories)
        .map(
          (cat) => `<details class="budget-cat">
            <summary><span class="budget-cat__title">${h(cat.label)}</span><span class="budget-cat__sum">${money(cat.subtotal?.mid)}</span></summary>
            <ul class="budget-items">
              ${arrays(cat.items)
                .map(
                  (it) => `<li class="budget-item${it.optional ? " is-optional" : ""}">
                    <div class="budget-item__head"><strong>${h(it.label)}</strong><span>${money(it.mid)}</span></div>
                    <p>${h(it.detail)}</p>
                    <p class="budget-item__meta"><span>${money(it.low)} – ${money(it.high)}</span><span>${h(it.source || "")}</span>${it.optional ? "<em>option</em>" : ""}</p>
                  </li>`
                )
                .join("")}
            </ul>
          </details>`
        )
        .join("")}
    </div>
    <div class="budget-notes">
      <h3>Hypothèses</h3>
      <ul>${arrays(budget.assumptions).map((a) => `<li>${h(a)}</li>`).join("")}</ul>
      <h3>Hors budget</h3>
      <ul>${arrays(budget.excluded).map((a) => `<li>${h(a)}</li>`).join("")}</ul>
    </div>`;
  };

  const renderChecks = () => {
    const checkList = $("#checkList");
    if (!checkList || !DATA.checklist) return;
    checkList.innerHTML = arrays(DATA.checklist)
      .map((item) => {
        const done = !!checks[item.id];
        return `<li>
          <label class="check-item${done ? " is-done" : ""}">
            <input type="checkbox" data-check="${h(item.id)}" ${done ? "checked" : ""} />
            <span>${h(item.label)}</span>
          </label>
        </li>`;
      })
      .join("");
    $$("[data-check]", checkList).forEach((input) => {
      input.addEventListener("change", () => {
        checks[input.dataset.check] = input.checked;
        setStored(CHECKLIST_KEY, JSON.stringify(checks));
        renderChecks();
        renderOverview();
      });
    });
  };

  $("#resetCheck")?.addEventListener("click", () => {
    checks = {};
    setStored(CHECKLIST_KEY, JSON.stringify(checks));
    renderChecks();
    renderOverview();
  });

  const renderLogistics = () => {
    const logGrid = $("#logGrid");
    if (logGrid && DATA.logistics) {
      logGrid.innerHTML = arrays(DATA.logistics)
        .map((l) => `<article class="log-card"><h3>${h(l.title)} ${tipBtn(l.title, l.text, "Logistique")}</h3><p>${h(l.text)}</p></article>`)
        .join("");
    }

    const contactGrid = $("#contactGrid");
    if (contactGrid && DATA.bases) {
      contactGrid.innerHTML = arrays(DATA.bases)
        .filter((b) => b.phone || b.email)
        .map(
          (b) => `<article class="contact-card">
            <h3>${h(b.name)}</h3>
            <p class="place" style="margin:0.25rem 0 0;color:var(--muted);font-size:0.9rem">${h(b.dates || "")}</p>
            <div class="base-actions" style="margin-top:0.9rem">
              ${b.phone ? `<a href="tel:${h(b.phone)}">${h(b.phoneDisplay || b.phone)}</a>` : ""}
              ${b.phone2 ? `<a class="secondary" href="tel:${h(b.phone2)}">${h(b.phone2Display || b.phone2)}</a>` : ""}
              ${b.email ? `<a class="secondary" href="mailto:${h(b.email)}">${h(b.email)}</a>` : ""}
            </div>
          </article>`
        )
        .join("");
    }
  };

  /* ---------- Active nav, keyboard, motion ---------- */
  const setActiveNav = (id) => {
    const map = {
      accueil: "home",
      overview: "overview",
      "intro-alt": "overview",
      programme: "days",
      budget: "budget",
      bases: "bases",
      checklist: "check",
      logistique: "logistics",
      contacts: "contacts",
    };
    $$("[data-nav]").forEach((el) => {
      const key = el.getAttribute("data-nav");
      el.classList.toggle("is-active", key === map[id]);
    });
  };

  const initActiveNav = () => {
    const sections = ["accueil", "overview", "intro-alt", "replis-melo", "programme", "budget", "bases", "checklist", "logistique", "contacts"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveNav(visible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.35, 0.6] }
    );
    sections.forEach((section) => io.observe(section));
  };

  document.addEventListener("keydown", (event) => {
    if (tipOpen()) trapTab(event, $(".tip-card", tipLayer));
    if (drawerOpen()) trapTab(event, drawer);

    if (event.key === "Escape") {
      closeFullscreenMaps();
      if (pickerOpen()) setDayPicker(false);
      if (tipOpen()) closeTip();
      if (drawerOpen()) setDrawer(false);
      return;
    }

    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (tipOpen() || drawerOpen() || pickerOpen()) return;
    const programme = $("#programme");
    const active = document.activeElement;
    const focusInProgramme = !!programme && programme.contains(active);
    if (!focusInProgramme && isTypingTarget(active)) return;
    if (event.key === "ArrowLeft") goRelative(-1);
    if (event.key === "ArrowRight") goRelative(1);
  });

  const initHeroMotion = () => {
    const hero = $("#accueil");
    const heroParallax = $("#heroParallax");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hero) return;
    requestAnimationFrame(() => hero.classList.add("is-ready"));
    const onScrollHero = () => {
      const rect = hero.getBoundingClientRect();
      const height = hero.offsetHeight || 1;
      const progress = Math.min(1, Math.max(0, -rect.top / (height * 0.75)));
      hero.style.setProperty("--hero-progress", progress.toFixed(3));
      hero.classList.toggle("is-leaving", progress > 0.02);
      menuBtn?.classList.toggle("is-solid", rect.bottom <= window.innerHeight * 0.55);
      if (!reduceMotion && heroParallax) {
        if (progress > 0.01) {
          heroParallax.style.animation = "none";
          heroParallax.style.transform = `translate3d(0, ${Math.min(140, Math.max(0, -rect.top * 0.38))}px, 0) scale(1.1)`;
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
  };

  const initReveal = () => {
    if (!("IntersectionObserver" in window)) {
      $$("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    $$("[data-reveal]").forEach((el) => revealIo.observe(el));
  };

  const initFooter = () => {
    const footer = $(".footer p");
    const date = fmtDateFr(DATA.meta?.editorialDate);
    if (footer && date) {
      footer.textContent = IS_ALT
        ? `Variante best-of · infos au ${date} · pas une source temps réel.`
        : `Plan de voyage familial · infos au ${date} · pas une source temps réel.`;
    }
  };

  const initHomeLinks = () => {
    const goHomeTop = (event) => {
      event?.preventDefault?.();
      if (location.hash) history.replaceState(null, "", location.pathname + location.search);
      setDrawer(false);
      scrollToTop(true);
    };
    $("#heroTitle")?.addEventListener("click", goHomeTop);
    $$('a[href="#accueil"]').forEach((a) => a.addEventListener("click", goHomeTop));
  };

  const bootMaps = () => {
    initOverviewMap();
    initBaseMaps();
    if (stage && $("#dayMap", stage) && !dayMap) {
      const day = currentDay();
      dayMap = makeMap($("#dayMap", stage), mapMarkersFor(day), mapZoomFor(day), $(".map-block .map-caption", stage), { road: true });
    }
  };

  const scrollInitial = () => {
    if (dayParam) {
      const scrollToProgramme = () => $("#programme")?.scrollIntoView({ behavior: "smooth", block: "start" });
      requestAnimationFrame(scrollToProgramme);
      window.addEventListener("load", scrollToProgramme, { once: true });
    } else if (!IS_ALT) {
      scrollToTop(false);
      if (location.hash && location.hash !== "#accueil") history.replaceState(null, "", location.pathname + location.search);
      requestAnimationFrame(() => scrollToTop(false));
      window.addEventListener("load", () => scrollToTop(false), { once: true });
    }
  };

  /* ---------- Boot ---------- */
  attachDayBudgets();
  renderOverview();
  renderRouteStrip();
  renderRules();
  renderHeroToday();
  renderDrawerDays();
  renderRail();
  renderDay();
  updateSwitcher();
  updateActiveDayButtons();
  renderBases();
  renderBudget();
  renderChecks();
  renderLogistics();
  initActiveNav();
  initHeroMotion();
  initReveal();
  initFooter();
  initHomeLinks();
  scrollInitial();

  if (window.L) bootMaps();
  else window.addEventListener("load", bootMaps);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();
