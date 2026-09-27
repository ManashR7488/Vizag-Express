#!/usr/bin/env node
/* ==========================================================================
   VIZAG EXPRESS — DEPLOY FOLDER
   Copies only what the live site needs into dist/ (no tools, node_modules or
   sources) and adds a _headers file (Netlify / Cloudflare Pages) with caching
   and security headers.  Usage: npm run dist  → upload the dist/ folder.
   ========================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "dist");
const INCLUDE = ["index.html", "404.html", "robots.txt", "sitemap.xml", "site.webmanifest", "favicon.ico", "css/site.css", "js", "assets"];
const SKIP = new Set(["README.txt"]);

fs.rmSync(OUT, { recursive: true, force: true });
let files = 0;
let bytes = 0;
const copy = (rel) => {
  const src = path.join(ROOT, rel);
  if (!fs.existsSync(src)) return console.warn("  ! missing " + rel);
  if (fs.statSync(src).isDirectory()) return fs.readdirSync(src).forEach((f) => copy(path.join(rel, f)));
  if (SKIP.has(path.basename(rel))) return;
  fs.mkdirSync(path.dirname(path.join(OUT, rel)), { recursive: true });
  fs.copyFileSync(src, path.join(OUT, rel));
  files++;
  bytes += fs.statSync(src).size;
};
INCLUDE.forEach(copy);
// search-engine ownership files (Google Search Console / Bing) dropped in the project root
fs.readdirSync(ROOT)
  .filter((f) => /^google[0-9a-f]+\.html$|^BingSiteAuth\.xml$/.test(f))
  .forEach(copy);

fs.writeFileSync(
  path.join(OUT, "_headers"),
  `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=604800

/css/*
  Cache-Control: public, max-age=86400

/js/*
  Cache-Control: public, max-age=86400
`
);
console.log(`✓ dist/ ready: ${files + 1} files, ${(bytes / 1024 / 1024).toFixed(1)} MB. Upload this folder.`);
