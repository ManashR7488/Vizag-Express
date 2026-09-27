/* ==========================================================================
   VIZAG EXPRESS — TRIP DATA
   Everything on the website is generated from this file.
   Edit the values below, then run  `node tools/seo.js`  so search engines,
   the sitemap and link previews pick up the changes too.
   ========================================================================== */

/* --------------------------------------------------------------------------
   SITE / SEO
   `url` MUST be the real address the site is published at (with trailing /).
   -------------------------------------------------------------------------- */
window.SITE = {
  url: "https://vizag-express.netlify.app/",
  title: "Vizag Express | Bhubaneswar to Visakhapatnam Train Trip",
  description:
    "Seven friends, one train: the Vizag Express trip from Bhubaneswar to Visakhapatnam. Meet the crew, follow the East Coast route, Simhachalam Temple and more.",
  shareTitle: "Vizag Express: Bhubaneswar → Visakhapatnam by train",
  shareImage: "assets/og-image.jpg", // 1200×630 preview for WhatsApp, Facebook, X, LinkedIn…
  shareImageAlt: "Vizag Express: a 3D express train running along the East Coast at sunrise",
  author: "The Vizag Express crew",
  twitter: "", // optional, e.g. "@vizagexpress"
  // Paste the verification codes from Google Search Console / Bing Webmaster Tools here:
  googleVerification: "",
  bingVerification: "",
  published: "2026-09-26",
};

window.TRIP = {
  name: "Vizag Express",
  tagline: "Seven friends. One train. The whole East Coast.",

  from: { code: "BBS", city: "Bhubaneswar", state: "Odisha" },
  to: { code: "VSKP", city: "Visakhapatnam", state: "Andhra Pradesh" },

  // Fill these in once tickets are booked.
  // date: ISO format "2026-12-20T21:30:00+05:30" turns on the live countdown.
  date: null,
  train: "TBA",
  coach: "TBA",
  distanceKm: 440, // approx. rail distance
  durationHrs: 7, // approx. travel time

  // Major stops along the East Coast line (approximate, for the route map).
  stops: [
    { code: "BBS", name: "Bhubaneswar" },
    { code: "KUR", name: "Khurda Road" },
    { name: "Chilika Lake", scenic: true }, // scenic stretch, not a halt
    { code: "BAM", name: "Brahmapur" },
    { code: "PSA", name: "Palasa" },
    { code: "CHE", name: "Srikakulam Rd" },
    { code: "VZM", name: "Vizianagaram" },
    { code: "VSKP", name: "Visakhapatnam" },
  ],
};

/* --------------------------------------------------------------------------
   MEMBERS
   Photos: drop a file named <id>.jpg into  assets/members/
   (e.g. assets/members/manash.jpg). .jpeg, .png and .webp also work.
   Until a photo exists, a coloured initials avatar is shown.
   -------------------------------------------------------------------------- */
window.MEMBERS = [
  { id: "durga", name: "Durga Dutta Pandia", nick: "Durga" },
  { id: "manash", name: "Manash R. Mahanand", nick: "Manash" },
  { id: "ashish", name: "Ashish Mahanta", nick: "Ashish" },
  { id: "amit", name: "Amit Ku. Pradhan", nick: "Amit" },
  { id: "akash", name: "Akash Das", nick: "Akash" },
  { id: "somesh", name: "Somesh Ku. Nayak", nick: "Somesh" },
  { id: "sandeep", name: "Sandeep Padua", nick: "Sandeep" },
];

/* --------------------------------------------------------------------------
   ROLES & RESPONSIBILITIES
   `note` adds a sub-role tag next to that member.
   -------------------------------------------------------------------------- */
window.ROLES = [
  {
    id: "ticket",
    title: "Ticket / Train",
    icon: "ticket",
    blurb: "Bookings, berths, PNR status and keeping everyone on the platform on time.",
    gradient: "from-amber-400 to-orange-500",
    members: [
      { id: "amit" },
      { id: "somesh" },
      { id: "ashish", note: "Notification & Update" },
    ],
  },
  {
    id: "place",
    title: "Place / Destination",
    icon: "pin",
    blurb: "Scouting spots, mapping routes and deciding where the crew goes next.",
    gradient: "from-teal-400 to-cyan-500",
    members: [{ id: "amit" }, { id: "akash" }, { id: "somesh" }, { id: "sandeep" }],
  },
  {
    id: "budget",
    title: "Budget / Planning",
    icon: "calc",
    blurb: "The master plan — itinerary, timings and a budget that actually adds up.",
    gradient: "from-violet-400 to-fuchsia-500",
    members: [{ id: "ashish" }, { id: "akash" }, { id: "durga" }, { id: "manash" }],
  },
  {
    id: "payment",
    title: "Payment / Investments",
    icon: "wallet",
    blurb: "Collecting contributions, paying the bills and keeping the accounts clean.",
    gradient: "from-emerald-400 to-green-500",
    members: [{ id: "ashish" }, { id: "durga" }],
  },
  {
    id: "event",
    title: "Event / Activity",
    icon: "sparkles",
    blurb: "Games on the train, content on the beach and fun at every stop.",
    gradient: "from-rose-400 to-pink-500",
    members: [{ id: "amit" }, { id: "somesh" }, { id: "manash" }, { id: "sandeep" }],
  },
];

/* --------------------------------------------------------------------------
   PLACES
   Add more places here. `image` is optional (e.g. "assets/places/rk-beach.jpg").
   `art` picks the built-in illustration: "temple" | "beach" | "hills" | "city".
   -------------------------------------------------------------------------- */
window.PLACES = [
  {
    id: "simhachalam",
    name: "Simhachalam Temple",
    subtitle: "Sri Varaha Lakshmi Narasimha Swamy",
    description:
      "A hilltop shrine on the Simhachalam hills on the edge of Visakhapatnam, reached by a winding ghat road with sweeping views of the city below.",
    tags: ["Temple", "Hilltop", "Darshan"],
    tip: "Go early morning to beat the queue and the heat.",
    art: "temple",
  },
  // Ideas for later — uncomment to add them to the site:
  // { id: "rk-beach", name: "RK Beach", subtitle: "Ramakrishna Beach", description: "Vizag's most famous seafront promenade.", tags: ["Beach", "Sunrise"], art: "beach" },
  // { id: "kailasagiri", name: "Kailasagiri", subtitle: "Hilltop park", description: "Ropeway and panoramic views of the coastline.", tags: ["Hills", "Ropeway"], art: "hills" },
  // { id: "submarine", name: "INS Kursura Submarine Museum", subtitle: "RK Beach Road", description: "Walk through a real decommissioned submarine.", tags: ["Museum"], art: "city" },
];

// How many "to be revealed" placeholder cards to show after the places above.
window.UPCOMING_PLACE_SLOTS = 4;

/* --------------------------------------------------------------------------
   EVENTS / ACTIVITIES
   Each activity is shown as a flippable playing card.
   -------------------------------------------------------------------------- */
window.EVENTS = [
  {
    id: "cards",
    sound: "shuffle", // played when the card flips (see js/sound.js)
    title: "Playing Cards",
    tagline: "The berth-side tournament",
    rank: "A",
    suit: "♠",
    icon: "cards",
    items: ["Ranga", "Gadha", "Natish"],
    color: "#f59e0b",
  },
  {
    id: "uno",
    sound: "slap", // played when the card flips (see js/sound.js)
    title: "UNO",
    tagline: "Draw four. No mercy.",
    rank: "+4",
    suit: "♦",
    icon: "uno",
    items: [],
    description: "The classic colour-matching chaos — perfect for the long stretches between stations.",
    color: "#ef4444",
  },
  {
    id: "reels",
    sound: "pop", // played when the card flips (see js/sound.js)
    title: "Reels",
    tagline: "Content from every coach",
    rank: "K",
    suit: "♥",
    icon: "video",
    items: ["Insta", "Vlog"],
    color: "#ec4899",
  },
  {
    id: "photo",
    sound: "shutter", // played when the card flips (see js/sound.js)
    title: "Photography",
    tagline: "Sunrise to sea-face",
    rank: "Q",
    suit: "♣",
    icon: "camera",
    items: [],
    description: "Capturing the whole trip — the train, the coast, the temple and the crew.",
    color: "#14b8a6",
  },
];
