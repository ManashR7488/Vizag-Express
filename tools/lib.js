/* Shared helpers for the build tools (no dependencies). */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const file = (...p) => path.join(ROOT, ...p);
const read = (p) => fs.readFileSync(file(p), "utf8");

// js/data.js is a browser script (window.X = …); run it in a sandbox to read the data
const loadData = () => {
  const box = { window: {} };
  vm.runInNewContext(read("js/data.js"), box, { filename: "data.js" });
  return box.window;
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const siteUrl = (SITE) => (SITE.url.endsWith("/") ? SITE.url : SITE.url + "/");
const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
const pad2 = (n) => String(n).padStart(2, "0");

const svg = (p, extra = "") =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${p}</svg>`;
const ICON = {
  arrow: svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
  back: svg('<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>'),
  pin: svg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'),
  close: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  left: svg('<path d="m15 18-6-6 6-6"/>'),
  right: svg('<path d="m9 18 6-6-6-6"/>'),
  flag: svg('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>'),
};

module.exports = { fs, path, ROOT, file, read, loadData, esc, siteUrl, today, pad2, ICON };
