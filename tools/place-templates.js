/* ==========================================================================
   HTML templates for the places: the home-page itinerary cards and the
   themed per-place pages. Used by tools/places.js and tools/seo.js.
   ========================================================================== */
"use strict";
const { esc, pad2, ICON } = require("./lib");

// page background per theme (for <meta name="theme-color">)
const THEME_BG = {
  temple: "#1a0d05", church: "#f5f8ff", promenade: "#0a1530", naval: "#061829",
  summit: "#051d18", garden: "#f7f4e6", safari: "#14100a", surf: "#fbf6ea",
};

const pageUrl = (p) => `places/${p.id}/`;
const imgSrc = (prefix, p, im, w) => `${prefix}assets/places/${p.id}/${im.file}-${w}.webp`;

/** <img> with srcset; `big` picks the larger file as the fallback src */
const img = (prefix, p, im, { sizes, eager = false, big = false } = {}) =>
  `<img src="${imgSrc(prefix, p, im, im.widths[big ? 1 : 0])}" srcset="${im.widths
    .map((w) => `${imgSrc(prefix, p, im, w)} ${w}w`)
    .join(", ")}" sizes="${sizes}" width="${im.w}" height="${im.h}" alt="${esc(im.alt)}" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} />`;

const byFile = (p, name) => p.images.find((i) => i.file === name) || p.images[0];
const stopNo = (PLACES, p) => PLACES.indexOf(p) + 1;

/** the timeline slot of a place: { day, time, note, status } or null if unscheduled */
const slotOf = (DAYS, p) => {
  for (const [d, day] of Object.entries(DAYS || {})) {
    const s = (day.schedule || []).find((x) => x.place === p.id);
    if (s) return { day: +d, time: s.time, note: s.note, status: day.status };
  }
  return null;
};

const KIND_ICON = {
  arrive: '<path d="M8 3.1V7a4 4 0 0 0 8 0V3.1"/><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/>',
  meal: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  stay: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  place: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
};
const kindIcon = (k) =>
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${KIND_ICON[k] || KIND_ICON.place}</svg>`;

/** the day's schedule board */
const timeline = (PLACES, day) => `
            <ol class="tl" aria-label="Timeline" style="--rows:${Math.ceil(day.schedule.length / 2)}">${day.schedule
              .map((s) => {
                const p = s.place && PLACES.find((x) => x.id === s.place);
                const what = p
                  ? `<a class="tl-what" href="${pageUrl(p)}">${esc(p.name)}</a>`
                  : `<span class="tl-what">${esc(s.what)}</span>`;
                return `
              <li class="tl-row tl-${p ? "place theme-" + p.theme : s.kind}">
                <span class="tl-time">${esc(s.time)}</span>
                <span class="tl-dot">${kindIcon(p ? "place" : s.kind)}</span>
                <span class="tl-body">${what}${p && p.main ? ' <span class="tl-star" title="Main stop">★</span>' : ""}${s.note ? `<span class="tl-note">${esc(s.note)}</span>` : ""}</span>
              </li>`;
              })
              .join("")}
            </ol>`;

/* ------------------------------------------------------------------ home */
const homePlaces = (PLACES, DAYS) =>
  `<div class="days">${[1, 2]
    .map((d) => {
      const list = PLACES.filter((p) => p.day === d);
      return `
          <section class="day" aria-labelledby="day-${d}-title">
            <div class="day-head" data-reveal>
              <span class="day-badge">Day ${d}</span>
              <h3 id="day-${d}-title" class="day-title">${esc(DAYS[d].title)}</h3>
              <span class="day-status is-${DAYS[d].status}">${esc(DAYS[d].statusLabel)}</span>
              <p class="day-blurb">${esc(DAYS[d].blurb)}</p>
            </div>
            <div data-reveal>${timeline(PLACES, DAYS[d])}</div>
            <ol class="day-track">${list
              .map((p, k) => {
                const slot = slotOf(DAYS, p);
                return `
              <li data-reveal style="--delay:${k * 90}ms">
                <a class="pcard tilt theme-${p.theme}" href="${pageUrl(p)}" data-tilt="6" data-place="${p.theme}">
                  <span class="pcard-stop">Stop ${pad2(stopNo(PLACES, p))}</span>${p.main ? '<span class="pcard-main">★ Main stop</span>' : ""}${slot ? "" : '<span class="pcard-main is-optional">Optional</span>'}
                  <span class="shape">${img("", p, byFile(p, p.card), { sizes: "(min-width: 1100px) 22vw, (min-width: 640px) 45vw, 90vw" })}</span>
                  <div class="pcard-body">
                    <span class="pcard-time">${slot ? `🕒 ${esc(slot.time)}` : "Not in the timeline · if time allows"}</span>
                    <span class="pcard-kicker">${esc(p.kicker)}</span>
                    <h4 class="pcard-name">${esc(p.name)}</h4>
                    <ul class="pcard-details">${p.details.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
                    <span class="pcard-cta">Explore the stop ${ICON.arrow}</span>
                  </div>
                  <span class="glare"></span>
                </a>
              </li>`;
              })
              .join("")}
            </ol>
          </section>`;
    })
    .join("")}
        </div>`;

/* --------------------------------------------------------- hero ornaments */
const MANDALA = `<svg class="mandala" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width=".5" aria-hidden="true">
  <circle cx="100" cy="100" r="98"/><circle cx="100" cy="100" r="90"/><circle cx="100" cy="100" r="62"/><circle cx="100" cy="100" r="40"/>
  ${Array.from({ length: 24 }, (_, i) => `<ellipse cx="100" cy="30" rx="6" ry="20" transform="rotate(${i * 15} 100 100)"/>`).join("")}
  ${Array.from({ length: 36 }, (_, i) => `<circle cx="100" cy="6" r="1.6" transform="rotate(${i * 10} 100 100)"/>`).join("")}
  ${Array.from({ length: 12 }, (_, i) => `<path d="M100 60 L106 76 L100 92 L94 76Z" transform="rotate(${i * 30} 100 100)"/>`).join("")}
</svg>`;
const SPRIG = (style) =>
  `<svg class="sprig" style="${style}" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M10 90C40 70 60 45 88 12"/><path d="M30 76c-9-12-8-24 2-31 6 12 6 22-2 31Z"/><path d="M48 59c12 4 22 0 28-10-12-5-22-2-28 10Z"/><path d="M58 45c-6-12-3-23 8-28 4 12 1 21-8 28Z"/><path d="M72 30c11 2 18-3 21-12-11-2-18 2-21 12Z"/></svg>`;
const JUNGLE = (style) =>
  `<svg class="jungle" style="${style}" viewBox="0 0 120 120" fill="currentColor" aria-hidden="true"><path d="M60 118C58 80 40 60 8 54c26-6 44 6 52 30 0-30-10-52-30-70 26 6 40 30 36 62 6-26 22-44 48-50-18 14-30 36-30 64 10-16 22-24 36-24-16 10-26 26-28 52Z"/></svg>`;
const PAW = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><ellipse cx="12" cy="16" rx="5" ry="4.2"/><circle cx="5.5" cy="10" r="2.2"/><circle cx="9.5" cy="6" r="2.2"/><circle cx="14.5" cy="6" r="2.2"/><circle cx="18.5" cy="10" r="2.2"/></svg>`;

const intro = (PLACES, p, { center = false } = {}, slot) => `
        <p class="p-kicker">Day ${p.day} · Stop ${pad2(stopNo(PLACES, p))} · ${esc(p.kicker)}${p.main ? ' <span class="pcard-main">★ Main stop</span>' : ""}</p>
        <p class="p-when">${slot ? `🕒 Day ${slot.day} · ${esc(slot.time)}${slot.status === "tentative" ? ' <span class="p-when-note">may shift</span>' : ""}` : "Optional stop · not in the timeline yet"}</p>
        <h1 class="p-title">${esc(p.name)}</h1>
        <p class="p-aka">${esc(p.subtitle)}</p>
        <p class="p-sub">${esc(p.summary)}</p>
        <ul class="p-chips${center ? " justify-center" : ""}">${p.details.map((x) => `<li class="p-chip">${esc(x)}</li>`).join("")}</ul>`;

const NAVAL_SPEC = ["Length", "Beam", "Displacement", "Crew", "Top speed", "Diving depth", "Torpedo tubes"];

const hero = (PLACES, p, X, slot) => {
  const im = (name, opts) => img(X, p, byFile(p, name), opts);
  switch (p.theme) {
    case "temple":
      return `<section class="p-hero hero-temple"><div class="p-wrap">${intro(PLACES, p, { center: true }, slot)}
        <div class="temple-stage">${MANDALA}<div class="shape">${im("gopuram", { sizes: "(min-width: 640px) 368px, 78vw", eager: true, big: true })}</div></div>
      </div></section>`;
    case "church":
      return `<section class="p-hero hero-church"><div class="p-wrap">${intro(PLACES, p, { center: true }, slot)}
        <div class="triptych">
          <div class="shape">${im("sunset", { sizes: "(min-width: 832px) 220px, 26vw" })}</div>
          <div class="shape is-center">${im("church", { sizes: "(min-width: 832px) 300px, 36vw", eager: true })}</div>
          <div class="shape">${im("altar", { sizes: "(min-width: 832px) 220px, 26vw" })}</div>
        </div>
      </div></section>`;
    case "promenade":
      return `<section class="p-hero hero-promenade"><div class="p-wrap">${intro(PLACES, p, {}, slot)}</div>
        <div class="pano" tabindex="0" aria-label="Panorama of Beach Road: scroll sideways">${im("beach-road", { sizes: "(min-width: 768px) 2100px, 1150px", eager: true, big: true })}<span class="pano-hint">Swipe along the promenade →</span></div>
        <svg class="wave-edge" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0 34c160-30 320-30 480 0s320 30 480 0 320-30 480 0V60H0Z"/></svg>
      </section>`;
    case "naval":
      return `<section class="p-hero hero-naval"><div class="p-wrap">
        <div><p class="stencil" aria-hidden="true">S20</p>${intro(PLACES, p, {}, slot)}
          <dl class="spec">${p.facts
            .filter(([k]) => NAVAL_SPEC.includes(k))
            .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
            .join("")}</dl>
        </div>
        <div class="porthole"><div class="shape">${im("night", { sizes: "(min-width: 900px) 480px, 86vw", eager: true, big: true })}</div></div>
      </div></section>`;
    case "summit":
      return `<section class="p-hero hero-summit">
        <div class="summit-bg">${im("coastline", { sizes: "100vw", eager: true, big: true })}</div>
        <div class="altimeter" aria-hidden="true"><span class="alt-top">▲ 173 m · summit</span><span class="alt-sea">0 m · sea</span></div>
        <div class="p-wrap">${intro(PLACES, p, {}, slot)}</div>
      </section>`;
    case "garden":
      return `<section class="p-hero hero-garden"><div class="p-wrap">
        <div>${intro(PLACES, p, {}, slot)}</div>
        <div class="leaves">
          <div class="shape">${im("sunrise", { sizes: "(min-width: 900px) 440px, 70vw", eager: true })}</div>
          <div class="shape">${im("park-aerial", { sizes: "(min-width: 900px) 240px, 40vw" })}</div>
          <div class="shape">${im("garden-sunrise", { sizes: "(min-width: 900px) 260px, 45vw" })}</div>
          ${SPRIG("left:-2.5rem;bottom:-1.5rem;transform:rotate(-20deg)")}
        </div>
      </div></section>`;
    case "safari":
      return `<section class="p-hero hero-safari">${JUNGLE("width:14rem;left:-3rem;top:5rem;transform:rotate(25deg)")}${JUNGLE("width:18rem;right:-4rem;bottom:-4rem;transform:rotate(-30deg)")}<div class="p-wrap">
        <div>${intro(PLACES, p, {}, slot)}<div class="paws" aria-hidden="true">${PAW.repeat(6)}</div></div>
        <div class="shape">${im("white-tiger", { sizes: "(min-width: 900px) 560px, 90vw", eager: true, big: true })}</div>
      </div></section>`;
    case "surf":
      return `<section class="p-hero hero-surf"><div class="p-wrap">
        <div>${intro(PLACES, p, {}, slot)}<span class="blue-flag">${ICON.flag} Blue Flag certified beach</span></div>
        <div class="boards">
          <div class="shape">${im("bay-aerial", { sizes: "(min-width: 900px) 520px, 80vw", eager: true, big: true })}</div>
          <div class="shape">${im("hill-reflection", { sizes: "(min-width: 900px) 260px, 40vw" })}</div>
        </div>
      </div></section>`;
    default:
      return `<section class="p-hero"><div class="p-wrap">${intro(PLACES, p, {}, slot)}</div></section>`;
  }
};

/* ------------------------------------------------------------- full page */
const placePage = ({ SITE, TRIP, PLACES, DAYS, URL_, p, jsonLd, sources }) => {
  const slot = slotOf(DAYS, p);
  const X = "../../";
  const i = PLACES.indexOf(p);
  const prev = PLACES[i - 1];
  const next = PLACES[i + 1];
  const url = URL_ + pageUrl(p);
  const title = `${p.name}, Visakhapatnam · Vizag Express`;
  const desc = `${p.summary} Day ${p.day} of the Vizag Express trip: facts, photos and tips.`;
  const og = `${URL_}assets/places/${p.id}/og.jpg`;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.map)}`;
  const credit = (im) => `Photo: ${im.credit.author} · ${im.credit.license}`;
  const asideFacts = p.theme === "naval" ? p.facts.filter(([k]) => !NAVAL_SPEC.includes(k)) : p.facts;
  const stopLink = (q) =>
    `<a class="pnav-stop" href="${X}${pageUrl(q)}" title="${esc(q.name)}"${q === p ? ' aria-current="page"' : ""}>${stopNo(PLACES, q)}</a>`;
  const nextCard = (q, label, cls) =>
    q
      ? `<a class="${cls}" href="${X}${pageUrl(q)}"><img src="${imgSrc(X, q, q.images[0], 800)}" alt="" width="72" height="72" loading="lazy" /><span><small>${label}</small><strong>${esc(q.name)}</strong></span></a>`
      : `<a class="${cls}" href="${X}#places"><img src="${X}assets/icons/apple-touch-icon.png" alt="" width="72" height="72" loading="lazy" /><span><small>${label}</small><strong>Back to the full itinerary</strong></span></a>`;

  return `<!doctype html>
<html lang="en-IN" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${esc(url)}" />
    <meta name="theme-color" content="${THEME_BG[p.theme]}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${esc(TRIP.name)}" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="og:title" content="${esc(`${p.name} · ${TRIP.name}`)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:image" content="${esc(og)}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(p.images[0].alt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(`${p.name} · ${TRIP.name}`)}" />
    <meta name="twitter:description" content="${esc(desc)}" />
    <meta name="twitter:image" content="${esc(og)}" />
    <link rel="icon" href="${X}favicon.ico" sizes="32x32" />
    <link rel="icon" href="${X}assets/icons/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="${X}assets/icons/apple-touch-icon.png" />
    <link rel="preload" href="${X}assets/fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="${X}assets/fonts/outfit-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="${X}css/site.css" />
    <noscript><style>[data-reveal] { opacity: 1 !important; transform: none !important; }</style></noscript>
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2).replace(/</g, "\\u003c").replace(/^/gm, "    ")}
    </script>
  </head>
  <body class="place-page theme-${p.theme} font-body antialiased">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-night-950">Skip to content</a>
    <header class="pnav">
      <nav class="pnav-bar" aria-label="Trip">
        <a class="pnav-brand" href="${X}"><img src="${X}assets/icons/favicon.svg" alt="" width="32" height="32" />Vizag Express</a>
        <div class="pnav-route" aria-label="All stops">
          <span class="pnav-day">Day 1</span>${PLACES.filter((q) => q.day === 1).map(stopLink).join("")}
          <span class="pnav-day">Day 2</span>${PLACES.filter((q) => q.day === 2).map(stopLink).join("")}
        </div>
        <a class="pnav-all" href="${X}#places">All places</a>
      </nav>
    </header>

    <main id="main">
      ${hero(PLACES, p, X, slot)}

      <section class="p-section" aria-labelledby="about-title">
        <div class="p-wrap p-intro">
          <div class="p-about" data-reveal>
            <h2 id="about-title" class="p-h2">About <em>${esc(p.name)}</em></h2>
            ${p.about.map((t) => `<p>${esc(t)}</p>`).join("\n            ")}
          </div>
          <aside class="p-facts" data-reveal style="--delay: 120ms" aria-labelledby="facts-title">
            <h2 id="facts-title">Good to know</h2>
            <dl>${asideFacts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
          </aside>
        </div>
      </section>

      <section class="p-section" aria-labelledby="see-title">
        <div class="p-wrap">
          <h2 id="see-title" class="p-h2" data-reveal>What we'll <em>see</em></h2>
          <ul class="p-highlights">${p.highlights.map((h, k) => `<li data-reveal style="--delay:${k * 80}ms">${esc(h)}</li>`).join("")}</ul>
        </div>
      </section>

      <section class="p-section" aria-labelledby="gallery-title">
        <div class="p-wrap">
          <h2 id="gallery-title" class="p-h2" data-reveal>Photo <em>gallery</em></h2>
          <div class="p-gallery">${p.images
            .map(
              (im, k) => `
            <figure data-reveal style="--delay:${k * 90}ms">
              <button type="button" class="p-zoom" data-full="${imgSrc(X, p, im, im.widths[1])}" data-caption="${esc(im.alt)}" data-credit="${esc(credit(im))}" data-source="${esc(im.credit.source)}" aria-label="Enlarge photo: ${esc(im.alt)}">
                <span class="shape">${img(X, p, im, { sizes: "(min-width: 900px) 22vw, 46vw" })}</span>
              </button>
              <figcaption>${esc(im.alt)}<span class="credit">Photo: <a href="${esc(im.credit.source)}" rel="noopener">${esc(im.credit.author)}</a> · <a href="${esc(im.credit.licenseUrl)}" rel="noopener license">${esc(im.credit.license)}</a>, resized</span></figcaption>
            </figure>`
            )
            .join("")}
          </div>
        </div>
      </section>

      <section class="p-section" aria-labelledby="plan-title">
        <div class="p-wrap">
          <div class="p-plan" data-reveal>
            <div>
              <p class="p-kicker" id="plan-title">Crew plan · Day ${p.day} · Stop ${stopNo(PLACES, p)} of ${PLACES.length}</p>
              <p class="p-plan-time">${slot ? `${esc(slot.time)}${slot.note ? ` · ${esc(slot.note)}` : ""}${slot.status === "tentative" ? " · Day 2 times may shift" : ""}` : "Not in the timeline yet: we'll fit it in if there's time."}</p>
              <p class="p-plan-quote">${esc(p.plan)}</p>
              <a class="p-btn" href="${esc(maps)}" target="_blank" rel="noopener">Open in Google Maps ${ICON.pin}</a>
            </div>
            <div>
              <h2 class="p-h2" style="font-size: 1.4rem">Tips</h2>
              <ul class="p-tips">${p.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
            </div>
          </div>
        </div>
      </section>

      <nav class="p-section" aria-label="Previous and next stop" style="padding-top: 0">
        <div class="p-wrap p-next">
          ${nextCard(prev, prev ? `← Stop ${stopNo(PLACES, prev)}` : "← Start", "is-prev")}
          ${nextCard(next, next ? `Stop ${stopNo(PLACES, next)} →` : "Last stop →", "is-next")}
        </div>
      </nav>
    </main>

    <footer class="p-footer">
      <div class="p-wrap">
        <p><a href="${X}">← Back to Vizag Express</a> · ${esc(TRIP.from.city)} → ${esc(TRIP.to.city)} by train</p>
        <p class="mt-3">Facts: ${sources.map(([n, u]) => `<a href="${esc(u)}" rel="noopener">${esc(n)}</a>`).join(", ")}. Photos from Wikimedia Commons under their own licences: ${p.images
          .map((im) => `“${esc(im.credit.title.replace(/\.[a-z]+$/i, ""))}” by ${esc(im.credit.author)} (<a href="${esc(im.credit.licenseUrl)}" rel="noopener license">${esc(im.credit.license)}</a>)`)
          .join("; ")}. Images were resized and cropped.</p>
      </div>
    </footer>

    <dialog class="lightbox" aria-label="Photo viewer">
      <button type="button" class="lightbox-close" aria-label="Close">${ICON.close}</button>
      <button type="button" class="lightbox-nav prev" aria-label="Previous photo">${ICON.left}</button>
      <button type="button" class="lightbox-nav next" aria-label="Next photo">${ICON.right}</button>
      <img alt="" />
      <p></p>
    </dialog>
    <script src="${X}js/place.js" defer></script>
  </body>
</html>
`;
};

module.exports = { homePlaces, placePage, pageUrl, imgSrc, slotOf, THEME_BG };
