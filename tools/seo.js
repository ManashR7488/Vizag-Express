#!/usr/bin/env node
/* ==========================================================================
   VIZAG EXPRESS — SEO BUILDER
   Reads js/data.js and regenerates everything search engines and link
   previews look at:
     • <head> SEO block in index.html (title, description, canonical,
       Open Graph, Twitter/X card, verification tags, JSON-LD structured data)
     • crawlable HTML for every section that is otherwise drawn by JavaScript
     • the FAQ section (+ FAQPage structured data)
     • sitemap.xml (with image entries) and robots.txt
   Usage:   node tools/seo.js                 (after editing js/data.js)
            node tools/seo.js https://my.site/  (also sets the site URL)
   No dependencies.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const file = (...p) => path.join(ROOT, ...p);
const read = (p) => fs.readFileSync(file(p), "utf8");
const write = (p, s) => fs.writeFileSync(file(p), s);

/* ------------------------------------------------------------ load data */
let dataSrc = read("js/data.js");
const urlArg = process.argv[2];
if (urlArg) {
  const u = urlArg.endsWith("/") ? urlArg : urlArg + "/";
  if (!/^https:\/\/[^/]+\.[^/]+/.test(u)) exit(`"${urlArg}" doesn't look like a full https:// address.`);
  dataSrc = dataSrc.replace(/(window\.SITE\s*=\s*{\s*url:\s*)"[^"]*"/, `$1"${u}"`);
  write("js/data.js", dataSrc);
  console.log(`✓ SITE.url set to ${u} in js/data.js`);
}
const sandbox = { window: {} };
vm.runInNewContext(dataSrc, sandbox, { filename: "data.js" });
const { SITE, TRIP, MEMBERS, ROLES, PLACES, EVENTS } = sandbox.window;
if (!SITE || !SITE.url) exit("window.SITE.url is missing in js/data.js");
const URL_ = SITE.url.endsWith("/") ? SITE.url : SITE.url + "/";
const abs = (p) => (/^https?:/.test(p) ? p : URL_ + p.replace(/^\.?\//, ""));

function exit(msg) {
  console.error("✗ " + msg);
  process.exit(1);
}

/* -------------------------------------------------------------- helpers */
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const byId = Object.fromEntries(MEMBERS.map((m) => [m.id, m]));
const list = (arr) => (arr.length < 2 ? arr.join("") : arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1]);
const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
const rolesOf = (id) => ROLES.filter((r) => r.members.some((e) => e.id === id)).map((r) => r.title);
const realStops = TRIP.stops.filter((s) => !s.scenic);
const pad2 = (n) => String(n).padStart(2, "0");

// member photos that actually exist (same lookup order as the site)
const photoOf = (m) => {
  if (m.photo) return fs.existsSync(file(m.photo)) ? m.photo : null;
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const p = `assets/members/${m.id}.${ext}`;
    if (fs.existsSync(file(p))) return p;
  }
  return null;
};

// width/height of a JPEG or PNG, for og:image and ImageObject
const imageSize = (p) => {
  try {
    const b = fs.readFileSync(file(p));
    if (b[0] === 0x89 && b[1] === 0x50) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) break;
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      i += 2 + len;
    }
  } catch {}
  return null;
};

/* ------------------------------------------------------------------ FAQ */
const tripDate = TRIP.date ? new Date(TRIP.date) : null;
const faqs = [
  {
    q: `What is ${TRIP.name}?`,
    a: `${TRIP.name} is a train trip by ${MEMBERS.length} friends from ${TRIP.from.city}, ${TRIP.from.state} to ${TRIP.to.city} (Vizag), ${TRIP.to.state}. This site has the crew, the route, the places we plan to visit and the fun list for the journey.`,
  },
  {
    q: `How far is ${TRIP.to.city} from ${TRIP.from.city} by train?`,
    a: `About ${TRIP.distanceKm} km by rail along the East Coast line. Express trains take roughly ${TRIP.durationHrs} hours, depending on the train.`,
  },
  {
    q: `Which major stations are on the ${TRIP.from.city} to ${TRIP.to.city} route?`,
    a: `The line runs through ${list(realStops.map((s) => `${s.name} (${s.code})`))}${
      TRIP.stops.some((s) => s.scenic) ? `, passing ${list(TRIP.stops.filter((s) => s.scenic).map((s) => s.name))} on the way` : ""
    }.`,
  },
  {
    q: `When is the ${TRIP.name} trip?`,
    a: tripDate
      ? `The train leaves ${TRIP.from.city} on ${tripDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}${TRIP.train !== "TBA" ? ` on train ${TRIP.train}` : ""}.`
      : `The date and train will be announced once tickets are booked. The boarding pass on this site then shows a live countdown.`,
  },
  ...PLACES.map((p) => ({
    q: `What is ${p.name}?`,
    a: `${p.name}${p.subtitle ? ` (${p.subtitle})` : ""}: ${p.description}${p.tip ? ` Tip: ${p.tip}` : ""}`,
  })),
  {
    q: `Who is travelling on ${TRIP.name}?`,
    a: `The crew is ${list(MEMBERS.map((m) => m.name))}.`,
  },
  {
    q: `Who handles what on the trip?`,
    a: ROLES.map((r) => `${r.title}: ${list(r.members.map((e) => byId[e.id].nick + (e.note ? ` (${e.note})` : "")))}.`).join(" "),
  },
  {
    q: `What will the crew do during the journey?`,
    a: `${list(EVENTS.map((e) => (e.items && e.items.length ? `${e.title} (${e.items.join(", ")})` : e.title)))}.`,
  },
];

/* ---------------------------------------------------------- JSON-LD */
const shareImg = SITE.shareImage && fs.existsSync(file(SITE.shareImage)) ? SITE.shareImage : null;
const shareSize = shareImg ? imageSize(shareImg) || { width: 1200, height: 630 } : null;
const id = (frag) => URL_ + "#" + frag;
const station = (s) => ({
  "@type": "TrainStation",
  name: `${s.city} (${s.code})`,
  address: { "@type": "PostalAddress", addressLocality: s.city, addressRegion: s.state, addressCountry: "IN" },
});
const placeType = { temple: "HinduTemple", beach: "Beach", hills: "TouristAttraction", city: "TouristAttraction" };

const graph = [
  {
    "@type": "WebSite",
    "@id": id("website"),
    url: URL_,
    name: TRIP.name,
    alternateName: [`${TRIP.name} trip`, `${TRIP.from.city} to ${TRIP.to.city} train trip`],
    description: SITE.description,
    inLanguage: "en-IN",
    publisher: { "@id": id("crew") },
  },
  {
    "@type": "WebPage",
    "@id": id("webpage"),
    url: URL_,
    name: SITE.title,
    description: SITE.description,
    inLanguage: "en-IN",
    isPartOf: { "@id": id("website") },
    about: { "@id": id("trip") },
    hasPart: { "@id": id("faq") },
    ...(shareImg && { primaryImageOfPage: { "@id": id("image") }, image: { "@id": id("image") } }),
    datePublished: SITE.published,
    dateModified: today,
  },
  shareImg && {
    "@type": "ImageObject",
    "@id": id("image"),
    url: abs(shareImg),
    contentUrl: abs(shareImg),
    width: shareSize.width,
    height: shareSize.height,
    caption: SITE.shareImageAlt,
  },
  {
    "@type": "Organization",
    "@id": id("crew"),
    name: `${TRIP.name} crew`,
    url: URL_,
    logo: { "@type": "ImageObject", url: abs("assets/icons/icon-512.png"), width: 512, height: 512 },
    member: MEMBERS.map((m) => {
      const photo = photoOf(m);
      return { "@type": "Person", name: m.name, jobTitle: rolesOf(m.id).join(", "), ...(photo && { image: abs(photo) }) };
    }),
  },
  {
    "@type": "TrainTrip",
    "@id": id("trip"),
    name: TRIP.name,
    description: `${TRIP.tagline} A ${TRIP.distanceKm} km train journey from ${TRIP.from.city} to ${TRIP.to.city} along the East Coast line.`,
    url: URL_ + "#journey",
    departureStation: station(TRIP.from),
    arrivalStation: station(TRIP.to),
    ...(tripDate && { departureTime: TRIP.date }),
    ...(TRIP.train && TRIP.train !== "TBA" && { trainNumber: TRIP.train }),
    itinerary: {
      "@type": "ItemList",
      name: `Places to visit in ${TRIP.to.city}`,
      numberOfItems: PLACES.length,
      itemListElement: PLACES.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": placeType[p.art] || "TouristAttraction",
          name: p.name,
          ...(p.subtitle && { alternateName: p.subtitle }),
          description: p.description,
          ...(p.image && { image: abs(p.image) }),
          address: { "@type": "PostalAddress", addressLocality: TRIP.to.city, addressRegion: TRIP.to.state, addressCountry: "IN" },
        },
      })),
    },
  },
  {
    "@type": "FAQPage",
    "@id": id("faq"),
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
].filter(Boolean);

const jsonLd = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2).replace(/</g, "\\u003c");

/* ------------------------------------------------------------ <head> */
const meta = (attr, key, content) => (content ? `    <meta ${attr}="${key}" content="${esc(content)}" />` : null);
const head = [
  `    <title>${esc(SITE.title)}</title>`,
  meta("name", "description", SITE.description),
  meta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"),
  meta("name", "author", SITE.author),
  meta("name", "application-name", TRIP.name),
  meta("name", "apple-mobile-web-app-title", TRIP.name),
  `    <link rel="canonical" href="${esc(URL_)}" />`,
  meta("name", "google-site-verification", SITE.googleVerification),
  meta("name", "msvalidate.01", SITE.bingVerification),
  "",
  "    <!-- Open Graph (WhatsApp, Facebook, LinkedIn, Telegram…) -->",
  meta("property", "og:type", "website"),
  meta("property", "og:site_name", TRIP.name),
  meta("property", "og:locale", "en_IN"),
  meta("property", "og:url", URL_),
  meta("property", "og:title", SITE.shareTitle || SITE.title),
  meta("property", "og:description", SITE.description),
  ...(shareImg
    ? [
        meta("property", "og:image", abs(shareImg)),
        meta("property", "og:image:secure_url", abs(shareImg)),
        meta("property", "og:image:type", shareImg.endsWith(".png") ? "image/png" : "image/jpeg"),
        meta("property", "og:image:width", String(shareSize.width)),
        meta("property", "og:image:height", String(shareSize.height)),
        meta("property", "og:image:alt", SITE.shareImageAlt),
      ]
    : []),
  "",
  "    <!-- Twitter / X card -->",
  meta("name", "twitter:card", shareImg ? "summary_large_image" : "summary"),
  meta("name", "twitter:site", SITE.twitter),
  meta("name", "twitter:title", SITE.shareTitle || SITE.title),
  meta("name", "twitter:description", SITE.description),
  shareImg && meta("name", "twitter:image", abs(shareImg)),
  shareImg && meta("name", "twitter:image:alt", SITE.shareImageAlt),
  "",
  "    <!-- Structured data: WebSite, WebPage, TrainTrip, places, crew, FAQ -->",
  `    <script type="application/ld+json">\n${jsonLd.replace(/^/gm, "    ")}\n    </script>`,
]
  .filter((l) => l !== null && l !== false && l !== undefined)
  .join("\n");

/* ------------------------------------ crawlable HTML for the JS sections */
// The site's JavaScript replaces these with the interactive 3D versions; crawlers
// and link-preview bots that don't run JavaScript read these instead.
const stats = [
  [MEMBERS.length, "Travellers"],
  [`~${TRIP.distanceKm} km`, "On the rails"],
  [ROLES.length, "Crew teams"],
  [PLACES.length, PLACES.length === 1 ? "Place so far" : "Places so far"],
  [EVENTS.length, "Activities"],
]
  .map(([n, l]) => `<div class="stat"><span class="block h-5" aria-hidden="true"></span><p class="mt-3 whitespace-nowrap font-display text-3xl font-extrabold sm:text-2xl md:text-3xl lg:text-4xl">${esc(n)}</p><p class="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">${esc(l)}</p></div>`)
  .join("");

const ticket = `<article class="ticket flex-col p-7" aria-label="Boarding pass"><p class="field-label">${esc(TRIP.name)} · Boarding pass</p><p class="mt-2 font-display text-4xl font-extrabold">${esc(TRIP.from.code)} → ${esc(TRIP.to.code)}</p><p class="mt-2 text-slate-600">${esc(TRIP.from.city)} to ${esc(TRIP.to.city)} · ~${TRIP.distanceKm} km · ~${TRIP.durationHrs} hrs · ${pad2(MEMBERS.length)} passengers · Date: ${esc(tripDate ? tripDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBA")} · Train: ${esc(TRIP.train)}</p></article>`;

const route = `<ol class="grid gap-2">${TRIP.stops
  .map((s, i) => {
    const note = i === 0 ? "Departure" : i === TRIP.stops.length - 1 ? "Arrival" : s.scenic ? "Scenic stretch" : "En route";
    return `<li class="stop-card"><span><strong class="font-display">${esc(s.name)}</strong> <span class="text-xs text-slate-400">${note}</span></span>${s.code ? `<span class="font-mono text-xs text-slate-300">${esc(s.code)}</span>` : ""}</li>`;
  })
  .join("")}</ol>`;

const crew = `<h3 class="font-display text-2xl font-extrabold">The crew</h3><ul class="mt-4 grid gap-2">${MEMBERS.map(
  (m) => `<li><strong>${esc(m.name)}</strong> <span class="text-sm text-slate-400">· ${esc(rolesOf(m.id).join(", "))}</span></li>`
).join("")}</ul>`;

const roles = ROLES.map(
  (r) =>
    `<div class="role-wrap"><article class="role-card"><h3 class="font-display text-2xl font-extrabold">${esc(r.title)}</h3><p class="mt-2 text-sm text-slate-400">${esc(r.blurb)}</p><ul class="mt-4 grid gap-1">${r.members
      .map((e) => `<li>${esc(byId[e.id].name)}${e.note ? ` <span class="text-xs text-amber-300">(${esc(e.note)})</span>` : ""}</li>`)
      .join("")}</ul></article></div>`
).join("");

const places = PLACES.map(
  (p) =>
    `<article class="place-card p-7">${p.subtitle ? `<p class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">${esc(p.subtitle)}</p>` : ""}<h3 class="mt-1 font-display text-3xl font-extrabold">${esc(p.name)}</h3><p class="mt-3 text-slate-300">${esc(p.description)}</p>${
      p.tip ? `<p class="mt-3 text-sm text-amber-100">Tip: ${esc(p.tip)}</p>` : ""
    }</article>`
).join("");

const events = EVENTS.map(
  (e) =>
    `<article class="rounded-2xl border border-white/10 p-5"><h3 class="font-display text-xl font-extrabold">${esc(e.title)}</h3><p class="text-sm text-slate-400">${esc(e.tagline)}</p>${
      e.items && e.items.length ? `<ul class="mt-2 text-sm">${e.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>` : `<p class="mt-2 text-sm">${esc(e.description || "")}</p>`
    }</article>`
).join("");

const footer = MEMBERS.map((m) => `<span>${esc(m.name)}</span>`).join("");

const faqHtml = faqs
  .map(
    (f, i) =>
      `<details class="faq-item"${i === 0 ? " open" : ""}><summary><h3 class="faq-q">${esc(f.q)}</h3><span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-a"><p>${esc(f.a)}</p></div></details>`
  )
  .join("\n          ");

/* ------------------------------------------------------ write index.html */
let html = read("index.html");
const put = (name, content, indent = "") => {
  const re = new RegExp(`(<!-- seo:${name}\\b[^>]*-->)[\\s\\S]*?(<!-- /seo:${name} -->)`);
  if (!re.test(html)) exit(`marker <!-- seo:${name} --> not found in index.html`);
  html = html.replace(re, (_, open, close) => `${open}${indent ? "\n" + content + "\n" + indent : content}${close}`);
};
put("head", head, "    ");
put("stats", stats);
put("ticket", ticket);
put("route", route);
put("crew", crew);
put("roles", roles);
put("places", places);
put("events", events);
put("footer", footer);
put("faq", "\n          " + faqHtml + "\n        ");

// static text for data-bound spans (visible before/without JavaScript)
const lookup = (k) => k.split(".").reduce((o, p) => (o == null ? o : o[p]), TRIP);
html = html.replace(/(<(\w+)[^>]*\sdata-bind="([\w.]+)"[^>]*>)([^<]*)(<\/\2>)/g, (m, open, tag, key, _old, close) => {
  const v = lookup(key);
  return v == null ? m : open + esc(v) + close;
});
write("index.html", html);

/* ----------------------------------------------------------- sitemap.xml */
const images = [shareImg, ...MEMBERS.map(photoOf), ...PLACES.map((p) => p.image)].filter(Boolean);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${esc(URL_)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
${images.map((p) => `    <image:image><image:loc>${esc(abs(p))}</image:loc></image:image>`).join("\n")}
  </url>
</urlset>
`;
write("sitemap.xml", sitemap);

/* ------------------------------------------------------------ robots.txt */
write(
  "robots.txt",
  `# Vizag Express — everyone is welcome aboard.
# CSS, JS and images stay crawlable so search engines can render the page.
User-agent: *
Allow: /
Disallow: /tools/
Disallow: /node_modules/

Sitemap: ${URL_}sitemap.xml
`
);

/* --------------------------------------------------------------- report */
const warn = [];
if (/vizag-express\.netlify\.app/.test(URL_)) warn.push(`SITE.url is still the default (${URL_}). Set your real address: node tools/seo.js https://your-site/`);
if (!shareImg) warn.push(`Share image ${SITE.shareImage} not found: link previews will have no picture.`);
if (SITE.title.length > 60) warn.push(`Title is ${SITE.title.length} characters; Google shows about 60.`);
if (SITE.description.length > 160) warn.push(`Description is ${SITE.description.length} characters; Google shows about 155–160.`);
const missing = MEMBERS.filter((m) => !photoOf(m)).map((m) => m.nick);
try {
  const photosSrc = read("js/photos.js");
  const box = { window: {} };
  vm.runInNewContext(photosSrc, box);
  const stale = MEMBERS.filter((m) => photoOf(m) && !(box.window.PHOTOS || {})[m.id]).map((m) => m.nick);
  if (stale.length) warn.push(`New photo(s) not optimized yet for: ${stale.join(", ")}. Run: npm run photos`);
} catch {
  warn.push("js/photos.js missing. Run: npm run photos");
}
if (missing.length) warn.push(`No photo yet for: ${missing.join(", ")}.`);

console.log(`✓ index.html  <head> SEO block, JSON-LD (${graph.length} entities), crawlable content, ${faqs.length} FAQs`);
console.log(`✓ sitemap.xml  1 page, ${images.length} images, lastmod ${today}`);
console.log(`✓ robots.txt`);
warn.forEach((w) => console.log("! " + w));
