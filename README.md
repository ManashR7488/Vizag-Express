# 🚆 Vizag Express — Bhubaneswar → Visakhapatnam

A 3D trip website for the Vizag Express crew. Built with **HTML + Tailwind CSS + JavaScript + Three.js**, SEO-optimized (Lighthouse: SEO 100 · Accessibility 100 · Best Practices 100).

## Open it
- **Double-click `index.html`.** It works straight from disk (the 3D engine loads from a CDN, so it needs internet).
- Or serve the folder: `python -m http.server 5173`, then open http://localhost:5173

## Everyday updates
Everything the site shows lives in **`js/data.js`**. After changing anything, run the build once (first time: `npm install`):

```
npm run build
```

It optimizes photos, compiles the CSS and regenerates all the SEO files. Individual steps:

| Command | What it does |
|---|---|
| `npm run photos` | Makes small WebP versions of member photos (`assets/members/web/`) |
| `npm run places` | Writes the themed page for every place (`places/<id>/`) and the photo credits |
| `npm run build:css` | Compiles Tailwind + `css/style.css` into one minified `css/site.css` |
| `npm run seo` | Regenerates the SEO `<head>`, structured data, crawlable content, FAQ, `sitemap.xml`, `robots.txt` |
| `npm run dist` | Everything above + copies the deployable site into `dist/` |

### Member photos
Drop them into `assets/members/` named by member id (`durga.jpg`, `manash.jpg`, `ashish.jpg`, `amit.jpg`, `akash.jpg`, `somesh.jpg`, `sandeep.jpg`; `.jpeg/.png/.webp` work too), then run `npm run photos` (or `npm run build`). Originals are never modified.

### Places (the 2-day itinerary)
Each place in `PLACES` (`js/data.js`) gets a themed card on the home page and its own page at `places/<id>/`, with its own SEO tags, share image and structured data.
- **Text:** `summary`, `details` (card bullets), `about`, `facts`, `highlights`, `tips`, `plan`. The facts come from Wikipedia and other sources credited at the bottom of each page.
- **Look:** `theme` sets the design: `temple` (saffron arches + mandala), `church` (Gothic lancet windows), `promenade` (sunrise panorama), `naval` (blueprint + porthole + spec sheet), `summit` (full-bleed view + altimeter), `garden` (leaf-shaped photos), `safari` (jungle + paw trail), `surf` (sand, turquoise wave, tilted photos).
- **Photos:** in `assets/places/<id>/` as `<name>-800.webp` / `-1600.webp` plus a 1200×630 `og.jpg`. All are from Wikimedia Commons under CC licences; credits are shown on each page and listed in `assets/places/CREDITS.md`. `card` picks which photo appears on the home card.
- Run `npm run build` after editing (or `npm run places` for just the place pages).

### Trip details
- **Tickets booked?** Set `date` (e.g. `"2026-12-20T21:30:00+05:30"`), `train` and `coach` in `js/data.js`. The ticket shows a live countdown, and the FAQ + structured data pick up the date.
- **Roles / events / members:** edit the matching arrays.

## Publish it (and get it on Google)
1. **Site address** is set to `https://vizag-express.manash.in/` (change it with `node tools/seo.js https://new-address/`).
2. **Deploys run on Vercel** (see `vercel.json`): every push to `main` is published automatically. Vercel copies the prebuilt site into `dist/`; it doesn't rebuild photos or CSS. So **run `npm run build` locally before you commit**, then `git push`.
3. **Google Search Console** (https://search.google.com/search-console): add the site, copy the HTML-tag verification code into `SITE.googleVerification` in `js/data.js`, run `npm run dist` and redeploy, click Verify. Then **Sitemaps → submit `sitemap.xml`** and use **URL Inspection → Request indexing**.
4. **Bing Webmaster Tools** (https://www.bing.com/webmasters): same idea with `SITE.bingVerification` (this also covers Yahoo and DuckDuckGo).
5. **Check the previews:** paste the link into WhatsApp / https://www.opengraph.xyz, and test with https://search.google.com/test/rich-results and https://pagespeed.web.dev.
6. **Share it.** Links from Instagram bios, WhatsApp groups, YouTube vlog descriptions and friends' profiles help Google discover and trust the site.

## What the SEO covers
- **Head:** title (55 chars) + description (156 chars), canonical URL, robots directives, Open Graph + Twitter/X cards with a 1200×630 share image (`assets/og-image.jpg`), verification tags.
- **Structured data (JSON-LD):** `WebSite`, `WebPage`, `ImageObject`, `Organization` with the crew as `Person`s, `TrainTrip` (Bhubaneswar → Visakhapatnam stations, itinerary with Simhachalam as a `HinduTemple`), and `FAQPage`.
- **Crawlable content:** every section the JavaScript draws also exists as plain HTML, so search engines and link-preview bots see the crew, roles, route, places, activities and FAQ without running scripts. There's a clean h1 → h2 → h3 outline, and every image has alt text.
- **Trip FAQ** section: real answers (distance, stations, the temple, the crew), generated from `data.js`.
- **`sitemap.xml`** (with image entries) and **`robots.txt`**, plus a branded **`404.html`**.
- **Speed (Core Web Vitals):**
  - Compiled CSS (11 KB gzipped) and self-hosted, preloaded fonts with size-matched fallbacks, so there's no layout shift.
  - Optimized WebP photos (1.3 MB → 180 KB).
  - The hero text paints immediately. The 3D scene loads after the page, is built in small chunks, runs its waves on the GPU, and is skipped on devices without a real GPU, which see a poster of the same scene instead.
  - Sound downloads only after the page has loaded.
- **No interstitials:** sound is on by default but starts on the first tap via a small chip. No full-screen gate, which Google penalizes.

## Sound
Sound is **on by default**. If the browser allows audio right away, it starts immediately. Otherwise (most browsers need one tap first) a small chip says *"Tap anywhere to start it"*. The equalizer button in the menu bar (or the **M** key) mutes/unmutes, and a mute is remembered.
- Ambience crossfades per section; effects for the horn (tap the landing scene), station chime + announcement, route pings, carousel whoosh, ticket stamp, temple bells, card flips and the departure-board menu.
- All clips are CC0 recordings from freesound.org. See `assets/audio/CREDITS.md`.

## Files
```
index.html          page (SEO block + crawlable content are generated, see tools/seo.js)
404.html            "Wrong platform" page
js/data.js          ← all trip content + SITE settings (URL, title, description, verification)
js/main.js          interactive sections: carousel, tilt, flip cards, route map, nav
js/scene.js         Three.js hero (train, sea, sunrise)
js/sound.js         audio engine
js/photos.js        generated: optimized photo map
css/style.css       custom styles (source)   → compiled into css/site.css
tools/seo.js        SEO generator            tools/photos.js  photo optimizer
tools/dist.js       deploy-folder builder
assets/             icons, fonts, audio, member photos, posters, og-image
sitemap.xml, robots.txt, site.webmanifest, favicon.ico
PROMPT.md           the optimized project brief
```
