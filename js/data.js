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
  url: "https://vizag-express.manash.in/",
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

  from: { code: "BBSR", city: "Bhubaneswar", state: "Odisha" },
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
    { code: "BBSR", name: "Bhubaneswar" },
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
   PLACES: the 2-day itinerary. Each place gets its own page (places/<id>/),
   generated by `npm run build`. `theme` picks its look:
   temple | church | promenade | naval | summit | garden | safari | surf.
   Photos live in assets/places/<id>/ (freely licensed, from Wikimedia Commons;
   the credits below are shown on each page).
   -------------------------------------------------------------------------- */
window.DAYS = {
  1: { title: "Temples & the seafront", blurb: "A hilltop temple, a hilltop chapel, the city beach and a real submarine." },
  2: { title: "Hills, gardens & the Blue Flag beach", blurb: "Ropeway views, seaside gardens, a forest zoo and the golden sands of Rushikonda." },
};

window.PLACES = [
  {
    id: "simhachalam-temple",
    name: "Simhachalam Temple",
    subtitle: "Sri Varaha Lakshmi Narasimha Swamy Temple",
    day: 1,
    main: true,
    theme: "temple",
    type: "HinduTemple",
    kicker: "Hilltop temple",
    summary: "A 13th-century hilltop temple to Varaha Narasimha, 300 m up the Simhachalam hills.",
    details: [
      "300 m up the Simhachalam hills",
      "Built in the 13th century",
      "Kalinga-style architecture",
    ],
    about: [
      "Sri Varaha Lakshmi Narasimha Swamy Temple stands on the Simhachalam Hill Range, about 300 metres above sea level on the edge of Visakhapatnam. It is dedicated to Lord Vishnu in his Varaha Narasimha form; legend says he appeared here as the lion-headed protector of his devotee Prahlada.",
      "The present temple was built in the 13th century by the Eastern Ganga king Narasingha Deva I and consecrated in 1268 AD. It is built in the Kalinga style, and its carved halls and towering gopurams are the highlight of the climb.",
      "For most of the year the idol is covered in sandalwood paste, which makes it resemble a linga. Only on Akshaya Tritiya is the paste removed for the deity's true-form darshan, and the whole hill fills with pilgrims.",
    ],
    facts: [
      ["Built", "13th century · consecrated 1268 AD"],
      ["Height", "~300 m above sea level"],
      ["Style", "Kalinga architecture"],
      ["Deity", "Varaha Lakshmi Narasimha (Vishnu)"],
      ["The climb", "1,000 steps from Bhairava Dwaram, or the ghat road"],
    ],
    highlights: [
      "The carved Kalinga-style shrine and its golden gopurams",
      "Climbing the thousand-step path from the foot of the hill",
      "Sweeping views over the green Simhachalam hills",
      "The temple lit up after dark",
    ],
    tips: [
      "Go early in the morning to beat the queues and the heat.",
      "Dress modestly; footwear stays outside the shrine.",
      "Check darshan timings before you go; queues swell on weekends and festival days.",
    ],
    plan: "The trip begins here: early-morning darshan, then the photography team catches the gopuram in golden light.",
    map: "Simhachalam Temple, Visakhapatnam",
    coords: [17.7664, 83.2505],
    images: [
      {
        file: "gopuram",
        alt: "The golden gopuram (gateway tower) of Simhachalam temple against a blue sky",
        w: 1600,
        h: 2211,
        widths: [800, 1600],
        credit: {
          title: "Simhachalam temple front.jpg",
          author: "Saiphani02",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Simhachalam_temple_front.jpg",
        },
      },
      {
        file: "gopuram-dusk",
        alt: "The carved entrance gopuram of Simhachalam temple under a pink evening sky",
        w: 1600,
        h: 2845,
        widths: [800, 1600],
        credit: {
          title: "Simhachalam temple entrance gopuram.jpg",
          author: "Molleti Sai Kiran",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Simhachalam_temple_entrance_gopuram.jpg",
        },
      },
      {
        file: "temple-hills",
        alt: "The Simhachalam temple complex nestled in the green Simhachalam hills",
        w: 1600,
        h: 946,
        widths: [800, 1600],
        credit: {
          title: "Sri Varaha Lakshmi Narasimha temple, Simhachalam.jpg",
          author: "Tentu srinivas",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Sri_Varaha_Lakshmi_Narasimha_temple,_Simhachalam.jpg",
        },
      },
      {
        file: "gopuram-night",
        alt: "Simhachalam temple gopuram lit up at night beneath the moon",
        w: 1600,
        h: 2404,
        widths: [800, 1600],
        credit: {
          title: "Simhachalam Gopuram Night.jpg",
          author: "Av9",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Simhachalam_Gopuram_Night.jpg",
        },
      },
    ],
  },
  {
    id: "ross-hill-church",
    name: "Ross Hill Church",
    subtitle: "Mother Mary shrine on Ross Hill (Kanyamarykonda)",
    day: 1,
    main: false,
    theme: "church",
    type: "Church",
    kicker: "Hilltop chapel",
    summary: "A white hilltop chapel above the harbour, one of Vizag's three hills of harmony.",
    details: ["A chapel since 1867", "The middle of the 'three hills'", "Harbour views from the top"],
    about: [
      "Ross Hill is the middle and highest of three small hills beside the channel into Visakhapatnam's inner harbour. It takes its name from Monsieur Ross, who built a house on the hilltop in 1864.",
      "Bishop J. M. Tissot acquired the bungalow in 1866, and on 15 August 1867 an altar was blessed there, turning it into a chapel dedicated to Mother Mary. Locals also call the hill Kanyamarykonda.",
      "The neighbouring hills hold a Sri Venkateswara temple and the Baba Ishaq Madina dargah, so the three are often seen as a symbol of the city's religious harmony. Every 8 December a procession climbs the hill for the Feast of the Immaculate Conception.",
    ],
    facts: [
      ["Hill named after", "M. Ross, who built a house here in 1864"],
      ["Chapel", "Blessed on 15 August 1867"],
      ["Feast", "Procession every 8 December"],
      ["Neighbours", "A Venkateswara temple and the Ishaq Madina dargah"],
    ],
    highlights: [
      "The castle-like white facade with blue windows",
      "Panoramic views over the port and the harbour channel",
      "Three hills, three faiths, side by side",
      "Sunsets over the harbour",
    ],
    tips: [
      "The way up is a steep flight of steps: wear comfortable shoes.",
      "It's an active place of worship, so keep it quiet inside.",
      "Late afternoon gives the best light for harbour photos.",
    ],
    plan: "A short climb after Simhachalam: harbour views and a group photo against the white facade.",
    map: "Ross Hill Church, Visakhapatnam",
    images: [
      {
        file: "church",
        alt: "The white, turreted facade of Ross Hill Church with its blue windows",
        w: 1600,
        h: 2400,
        widths: [800, 1600],
        credit: {
          title: "Ross Hill Church.jpg",
          author: "iMahesh",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Ross_Hill_Church.jpg",
        },
      },
      {
        file: "sunset",
        alt: "A fiery sunset over the harbour channel seen from Ross Hill",
        w: 1600,
        h: 2138,
        widths: [800, 1600],
        credit: {
          title: "Sunset at Ross hill, Vishakapatnam.jpg",
          author: "Nikhilsatyavardhan",
          license: "CC BY 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Sunset_at_Ross_hill,_Vishakapatnam.jpg",
        },
      },
      {
        file: "port-view",
        alt: "Bird's-eye view of Visakhapatnam Port from the top of Ross Hill",
        w: 1600,
        h: 720,
        widths: [800, 1600],
        credit: {
          title: "Bird's eye view of Visakhapatnam Port from Ross hill in Visakhaptnam 07.jpg",
          author: "Pinakpani",
          license: "CC BY 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Bird%27s_eye_view_of_Visakhapatnam_Port_from_Ross_hill_in_Visakhaptnam_07.jpg",
        },
      },
      {
        file: "altar",
        alt: "The Marian altar inside Ross Hill Church",
        w: 1600,
        h: 2133,
        widths: [800, 1600],
        credit: {
          title: "Preserve the Perservance.jpg",
          author: "Santubunny101",
          license: "CC0",
          licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
          source: "https://commons.wikimedia.org/wiki/File:Preserve_the_Perservance.jpg",
        },
      },
    ],
  },
  {
    id: "rk-beach",
    name: "Rama Krishna Beach",
    subtitle: "RK Beach on Beach Road",
    day: 1,
    main: false,
    theme: "promenade",
    type: "Beach",
    kicker: "City beach",
    summary: "Vizag's best-known seafront, along Beach Road on the Bay of Bengal.",
    details: [
      "Named after the Ramakrishna Mission",
      "The Beach Road promenade",
      "Sunrise over the Bay of Bengal",
    ],
    about: [
      "Ramakrishna Beach, better known as RK Beach, is the city's main seafront on the Bay of Bengal, running along Beach Road near Dolphin's Nose. It takes its name from the Ramakrishna Mission ashram beside the beach.",
      "The promenade is lined with lamp posts, food stalls and landmarks: the Kali Temple, the INS Kursura Submarine Museum and the TU-142 aircraft museum are all within a short walk.",
      "It's at its best at sunrise, when the sun comes up straight out of the sea, and in the evening, when Beach Road lights up.",
    ],
    facts: [
      ["Faces", "The Bay of Bengal, east"],
      ["Named after", "The Ramakrishna Mission ashram"],
      ["Nearby", "Kali Temple, INS Kursura, TU-142 museum"],
      ["Best time", "Sunrise and evening"],
    ],
    highlights: [
      "Sunrise straight out of the sea",
      "An evening walk along the lit-up Beach Road",
      "Street food and chai on the promenade",
      "Museums and memorials a few steps away",
    ],
    tips: [
      "The currents are strong: paddle, don't swim.",
      "Come back after dark for the Beach Road lights.",
      "Weekend evenings get crowded.",
    ],
    plan: "Evening of Day 1: reels on the promenade, chai and street food, with the submarine right next door.",
    map: "RK Beach, Visakhapatnam",
    coords: [17.71423, 83.323628],
    images: [
      {
        file: "sunrise",
        alt: "A vibrant sunrise over the Bay of Bengal at RK Beach",
        w: 1600,
        h: 1067,
        widths: [800, 1600],
        credit: {
          title: "Vibrant Sunrise at RK Beach, Vizag.jpg",
          author: "Justin Carnielli",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Vibrant_Sunrise_at_RK_Beach,_Vizag.jpg",
        },
      },
      {
        file: "beach-road",
        alt: "Panorama of Beach Road along RK Beach, Visakhapatnam",
        w: 3200,
        h: 592,
        widths: [1600, 3200],
        credit: {
          title: "Beach Road, Visakhapatnam.jpg",
          author: "Ashwin Kumar from Bangalore, India",
          license: "CC BY-SA 2.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
          source: "https://commons.wikimedia.org/wiki/File:Beach_Road,_Visakhapatnam.jpg",
        },
      },
      {
        file: "night-port",
        alt: "Long exposure of Visakhapatnam Port glowing at night, seen from RK Beach",
        w: 1600,
        h: 1067,
        widths: [800, 1600],
        credit: {
          title: "Visakhapatnam port from RK beach at night.jpg",
          author: "iMahesh",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Visakhapatnam_port_from_RK_beach_at_night.jpg",
        },
      },
      {
        file: "afternoon",
        alt: "Waves washing over the rocks on an afternoon at RK Beach",
        w: 1600,
        h: 1200,
        widths: [800, 1600],
        credit: {
          title: "An afternoon view of RK Beach in Visakhapatnam.JPG",
          author: "Adityamadhav83",
          license: "CC BY-SA 3.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
          source: "https://commons.wikimedia.org/wiki/File:An_afternoon_view_of_RK_Beach_in_Visakhapatnam.JPG",
        },
      },
    ],
  },
  {
    id: "ins-kursura-submarine-museum",
    name: "INS Kursura Submarine Museum",
    subtitle: "VMRDA submarine museum on RK Beach",
    day: 1,
    main: false,
    theme: "naval",
    type: "Museum",
    kicker: "Submarine museum",
    summary: "A real Indian Navy submarine from 1969, now a walk-through museum on RK Beach.",
    details: ["Commissioned in 1969", "Served in the 1971 war", "91.3 m long, walk-through"],
    about: [
      "INS Kursura (S20) was a Kalvari-class diesel-electric submarine, a variant of the Soviet Foxtrot class, and India's fourth submarine. She was commissioned at Riga on 18 December 1969 and served for 31 years, including patrols in the Indo-Pakistani War of 1971.",
      "After she was decommissioned on 27 February 2001, she was brought ashore on RK Beach and opened to the public as a museum in August 2002. She is one of the very few submarine museums that keep their original fittings.",
      "Walking through the narrow hull, past the torpedo room, engine rooms and control panels, shows how her crew of about 75 lived and worked underwater. Though retired, she still receives the Navy's 'Dressing Ship' honour.",
    ],
    facts: [
      ["Commissioned", "18 December 1969, Riga"],
      ["Decommissioned", "27 February 2001"],
      ["Museum since", "August 2002"],
      ["Length", "91.3 m"],
      ["Beam", "7.5 m"],
      ["Displacement", "1,950 t surfaced · 2,475 t submerged"],
      ["Crew", "~75 (8 officers, 67 sailors)"],
      ["Top speed", "16 kn surfaced · 15 kn submerged"],
      ["Diving depth", "Up to 300 m"],
      ["Torpedo tubes", "10"],
    ],
    highlights: [
      "Walking the full length of a real submarine",
      "The torpedo room, control room and crew bunks",
      "The hull lit up at night on Beach Road",
      "Right on RK Beach: easy to pair with the evening walk",
    ],
    tips: [
      "The interior is narrow, with low hatches: watch your head.",
      "Entry is ticketed; check opening days and times before you go.",
      "Visit before sunset, then stay for the promenade.",
    ],
    plan: "Next door to RK Beach: a walk through the submarine before the evening on the promenade.",
    map: "INS Kursura Submarine Museum, Visakhapatnam",
    coords: [17.7175, 83.32944444],
    images: [
      {
        file: "night",
        alt: "INS Kursura Submarine Museum on Beach Road at night",
        w: 1600,
        h: 1065,
        widths: [800, 1600],
        credit: {
          title: "INS Kursura Night.jpg",
          author: "Av9",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:INS_Kursura_Night.jpg",
        },
      },
      {
        file: "utsav",
        alt: "INS Kursura lit up with lights during Visakha Utsav 2019",
        w: 1600,
        h: 1067,
        widths: [800, 1600],
        credit: {
          title: "INS Kursura, Visakha Utsav 2019 02.jpg",
          author: "Pratishkhedekar",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:INS_Kursura,_Visakha_Utsav_2019_02.jpg",
        },
      },
      {
        file: "controls",
        alt: "Valves, wheels and control panels inside INS Kursura",
        w: 1600,
        h: 1200,
        widths: [800, 1600],
        credit: {
          title: "Inside INS Kursura, Vishakhapatnam-01.jpg",
          author: "রবিরশ্মি রায়",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Inside_INS_Kursura,_Vishakhapatnam-01.jpg",
        },
      },
      {
        file: "gauges",
        alt: "Gauges and instrument panels inside the submarine",
        w: 1600,
        h: 1200,
        widths: [800, 1600],
        credit: {
          title: "Inside INS Kursura, Vishakhapatnam-04.jpg",
          author: "রবিরশ্মি রায়",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Inside_INS_Kursura,_Vishakhapatnam-04.jpg",
        },
      },
    ],
  },
  {
    id: "kailasagiri",
    name: "Kailasagiri",
    subtitle: "Hilltop park above the city",
    day: 2,
    main: true,
    theme: "summit",
    type: "Park",
    kicker: "Hilltop park",
    summary: "A 173 m hilltop park with a ropeway, a glass skybridge and sweeping sea views.",
    card: "shiva-parvati", // photo shown on the home-page card (default: the first image)
    details: ["173 m above the city", "A 350 m ropeway", "A 55 m glass skybridge"],
    about: [
      "Kailasagiri is a hilltop park developed by VMRDA across about 380 acres of native trees and gardens. The hill rises to 173 metres and looks out over the whole city, Beach Road and the long curve of the Bay of Bengal.",
      "A 350-metre ropeway, the first of its kind in Andhra Pradesh, carries visitors up the hill, and a 55-metre glass skybridge on the summit hangs out over the view. Giant white statues of Shiva and Parvati greet you near the entrance.",
      "The Andhra Pradesh government named it the state's 'Best Tourist Spot' in 2003, and around three lakh visitors come every year. The whole hill is a plastic-free zone.",
    ],
    facts: [
      ["Height", "173 m"],
      ["Area", "~380 acres (150 ha)"],
      ["Ropeway", "350 m, Andhra Pradesh's first"],
      ["Skybridge", "55 m glass bridge"],
      ["Award", "AP's 'Best Tourist Spot', 2003"],
    ],
    highlights: [
      "Riding the ropeway up the hill",
      "Walking out on the glass skybridge",
      "The giant Shiva and Parvati statues",
      "Viewpoints over the city and the coastline",
    ],
    tips: [
      "Stay for sunset and the city lights coming on.",
      "Leave the plastic behind: it's a plastic-free zone.",
      "Ropeway queues get long on weekends.",
    ],
    plan: "Day 2's big one: ropeway up, skybridge photos, and the group shot with the whole coastline behind us.",
    map: "Kailasagiri, Visakhapatnam",
    coords: [17.748992, 83.342236],
    images: [
      {
        file: "coastline",
        alt: "The curving Bay of Bengal coastline seen from Kailasagiri hill",
        w: 1600,
        h: 1067,
        widths: [800, 1600],
        credit: {
          title: "Beach and Sewage treatment plant from Kailasagiri (May 2019).jpg",
          author: "IM3847",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Beach_and_Sewage_treatment_plant_from_Kailasagiri_(May_2019).jpg",
        },
      },
      {
        file: "shiva-parvati",
        alt: "The giant white Shiva and Parvati statues on Kailasagiri",
        w: 1600,
        h: 1067,
        widths: [800, 1600],
        credit: {
          title: "Shiva and Parvati statues on Kailasagiri hill (May 2019).jpg",
          author: "IM3847",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Shiva_and_Parvati_statues_on_Kailasagiri_hill_(May_2019).jpg",
        },
      },
      {
        file: "ropeway",
        alt: "A Kailasagiri ropeway cable car gliding up the hill",
        w: 1600,
        h: 2133,
        widths: [800, 1600],
        credit: {
          title: "Ropeway at Kailasagiri.jpg",
          author: "Ravi Teja Karuparthi",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Ropeway_at_Kailasagiri.jpg",
        },
      },
      {
        file: "hill-park",
        alt: "The green hill park of Kailasagiri overlooking Visakhapatnam",
        w: 1600,
        h: 1067,
        widths: [800, 1600],
        credit: {
          title: "Kailasagiri hill park in Visakhapatnam 07.jpg",
          author: "Pinakpani",
          license: "CC BY 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Kailasagiri_hill_park_in_Visakhapatnam_07.jpg",
        },
      },
    ],
  },
  {
    id: "tenneti-park",
    name: "Tenneti Park",
    subtitle: "Seaside gardens on Beach Road",
    day: 2,
    main: false,
    theme: "garden",
    type: "Park",
    kicker: "Seaside garden",
    summary: "Clifftop gardens above the sea, named after freedom fighter Tenneti Viswanadham.",
    details: [
      "Gardens above the sea",
      "Named after Tenneti Viswanadham",
      "Sunrise and shipwreck views",
    ],
    about: [
      "Tenneti Park (VUDA Tenneti Park) is a coastal park on Beach Road, just below Kailasagiri, laid out with lawns, gardens and walking paths right above the Bay of Bengal. It is named after Tenneti Viswanadham, a freedom fighter and social reformer.",
      "It's one of the city's favourite spots for sunrise, picnics and photography, and it has appeared in many films. After Cyclone Hudhud damaged the park, GITAM University alumni funded its facelift.",
      "In October 2020 the Bangladeshi cargo ship MV Maa ran aground on the beach below during a storm, and the stranded 80-metre ship became an attraction of its own.",
    ],
    facts: [
      ["Named after", "Tenneti Viswanadham, freedom fighter"],
      ["Setting", "Clifftop gardens on Beach Road"],
      ["Best time", "Sunrise"],
      ["Next door", "Kailasagiri, right above"],
    ],
    highlights: [
      "Sunrise over the sea from the garden walkways",
      "Sea-view lawns and sculptures",
      "The MV Maa ship on the beach below",
      "A calm picnic and photo stop",
    ],
    tips: [
      "Early morning gives the best light and the coolest air.",
      "It's right below Kailasagiri, so pair the two.",
      "Keep to the paths near the cliff edges.",
    ],
    plan: "A breezy stop right below Kailasagiri: garden walks, sea views and slow-motion reels.",
    map: "Tenneti Park, Visakhapatnam",
    coords: [17.747944, 83.349915],
    images: [
      {
        file: "sunrise",
        alt: "Sunrise over the sea at Tenneti, framed by leaves",
        w: 1600,
        h: 1000,
        widths: [800, 1600],
        credit: {
          title: "Sunrise, Tenneti Beach, Tennetti Beach, Visakhapatnam, Andhra Pradesh, India,.jpg",
          author: "UdayAgastya77",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Sunrise,_Tenneti_Beach,_Tennetti_Beach,_Visakhapatnam,_Andhra_Pradesh,_India,.jpg",
        },
      },
      {
        file: "park-aerial",
        alt: "Tenneti Park's gardens on the sea cliff, seen from Kailasagiri",
        w: 1600,
        h: 1067,
        widths: [800, 1600],
        credit: {
          title: "Tenneti park as seen from Kailasagiri (May 2019).jpg",
          author: "IM3847",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Tenneti_park_as_seen_from_Kailasagiri_(May_2019).jpg",
        },
      },
      {
        file: "sunrise-walk",
        alt: "Morning sunrise over the sea from the walkway at Tenneti Park",
        w: 1600,
        h: 1200,
        widths: [800, 1600],
        credit: {
          title: "Sunrising in the mornings at Tenneti Park,Visakhapatnam(Vizag).jpg",
          author: "Rajapolipilli",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Sunrising_in_the_mornings_at_Tenneti_Park,Visakhapatnam(Vizag).jpg",
        },
      },
      {
        file: "garden-sunrise",
        alt: "Lawns and a sculpture at Tenneti Park during sunrise",
        w: 1600,
        h: 1200,
        widths: [800, 1600],
        credit: {
          title: "Tenneti park during sunrise (January 2019) 1.jpg",
          author: "IM3847",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Tenneti_park_during_sunrise_(January_2019)_1.jpg",
        },
      },
    ],
  },
  {
    id: "indira-gandhi-zoological-park",
    name: "Indira Gandhi Zoological Park",
    subtitle: "Vizag Zoo in the Kambalakonda forest",
    day: 2,
    main: false,
    theme: "safari",
    type: "Zoo",
    kicker: "Forest zoo",
    summary: "A 625-acre forest zoo between the Eastern Ghats and the sea, home to about 80 species.",
    details: ["625 acres of forest", "About 80 species", "Open since 1977"],
    about: [
      "Indira Gandhi Zoological Park sits inside the Kambalakonda Reserve Forest, with the Eastern Ghats on three sides and the Bay of Bengal on the fourth. Spread over 625 acres, it opened on 19 May 1977 and is one of the largest zoos in India.",
      "Around 800 animals of nearly 80 species live here: Bengal tigers, Asiatic lions and Indian elephants, greater one-horned rhinos, hippos, giraffes and chimpanzees. All three Indian crocodilians (the mugger, the gharial and the saltwater crocodile) live here too.",
      "In 2022 the World Association of Zoos and Aquariums recognised the zoo for its successful breeding programme for the dhole, the Indian wild dog.",
    ],
    facts: [
      ["Opened", "19 May 1977"],
      ["Area", "625 acres (253 ha)"],
      ["Animals", "~800, of ~80 species"],
      ["Closed", "Mondays"],
      ["Distance", "~11 km from Visakhapatnam station"],
    ],
    highlights: [
      "Big cats: tigers, a white tiger, lions and leopards",
      "Rhinos, hippos, giraffes and elephants",
      "Three species of Indian crocodile",
      "Forest trails with the Eastern Ghats behind",
    ],
    tips: [
      "The zoo is closed on Mondays.",
      "It's huge: start early and wear walking shoes.",
      "Carry water; the trails are long and the afternoons warm.",
    ],
    plan: "The longest walk of the trip: forest trails past the big cats, and the photography team's long-lens challenge.",
    map: "Indira Gandhi Zoological Park, Visakhapatnam",
    coords: [17.7691, 83.35],
    images: [
      {
        file: "white-tiger",
        alt: "A white tiger at Indira Gandhi Zoological Park",
        w: 1600,
        h: 1200,
        widths: [800, 1600],
        credit: {
          title: "Indira Gandhi Zoological Park.JPG",
          author: "Nani992",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Indira_Gandhi_Zoological_Park.JPG",
        },
      },
      {
        file: "rhino",
        alt: "A greater one-horned rhinoceros at the zoo",
        w: 1600,
        h: 1067,
        widths: [800, 1600],
        credit: {
          title: "Rhino in indira gandhi zoological park vizag.jpg",
          author: "Bharatshyam",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Rhino_in_indira_gandhi_zoological_park_vizag.jpg",
        },
      },
      {
        file: "painted-storks",
        alt: "A pair of painted storks resting at the zoo",
        w: 1600,
        h: 1200,
        widths: [800, 1600],
        credit: {
          title: "Pair of painted storks, Indira Gandhi Zoological Park.jpg",
          author: "Gouri.v",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Pair_of_painted_storks,_Indira_Gandhi_Zoological_Park.jpg",
        },
      },
      {
        file: "deer",
        alt: "Spotted deer and sambar under the trees at the zoo",
        w: 1600,
        h: 1067,
        widths: [800, 1600],
        credit: {
          title: "Deer at Indira Gandhi Zoological Park, Visakhapatnam.jpg",
          author: "Bdmshiva",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Deer_at_Indira_Gandhi_Zoological_Park,_Visakhapatnam.jpg",
        },
      },
    ],
  },
  {
    id: "rushikonda-beach",
    name: "Rushikonda Beach",
    subtitle: "Blue Flag beach on the north coast",
    day: 2,
    main: true,
    theme: "surf",
    type: "Beach",
    kicker: "Blue Flag beach",
    summary: "A golden, Blue Flag-certified beach north of the city, loved for clean sand and water sports.",
    card: "hill-reflection",
    details: ["Blue Flag certified", "Golden sand, green hills", "Water sports and sunrise"],
    about: [
      "Rushikonda Beach lies north of the city along the coast road, where green hills roll down to a wide curve of golden sand. It is maintained by the Andhra Pradesh Tourism Development Corporation (APTDC).",
      "It is one of the cleanest beaches in Visakhapatnam and holds Blue Flag certification, the international eco-label for clean, safe and well-managed beaches.",
      "The wide bay is popular for water sports when the sea allows, and for sunrise walks, when tiny crabs leave patterns across the wet sand.",
    ],
    facts: [
      ["Certification", "Blue Flag beach"],
      ["Managed by", "APTDC"],
      ["Where", "~10 km north of RK Beach"],
      ["Best for", "Sunrise, water sports, long walks"],
    ],
    highlights: [
      "Golden sand and turquoise water",
      "Water sports, when they're running",
      "Sunrise walks and crab-trail patterns",
      "Hilltop views over the bay",
    ],
    tips: [
      "Swim only where the lifeguards say it's safe.",
      "Water sports depend on the sea and the season: check on the day.",
      "There's little shade: bring sunscreen and water.",
    ],
    plan: "The grand finale: sunset on the sand, the final group reel, and one last horn for the Vizag Express.",
    map: "Rushikonda Beach, Visakhapatnam",
    images: [
      {
        file: "bay-aerial",
        alt: "The turquoise curve of Rushikonda Beach between green hills",
        w: 1600,
        h: 1067,
        widths: [800, 1600],
        credit: {
          title: "Rushikonda Beach in Visakhapatnam in 2024 March 04.jpg",
          author: "Pinakpani",
          license: "CC BY 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Rushikonda_Beach_in_Visakhapatnam_in_2024_March_04.jpg",
        },
      },
      {
        file: "hill-reflection",
        alt: "Rushikonda hill reflected in tide pools between the rocks",
        w: 1600,
        h: 1200,
        widths: [800, 1600],
        credit: {
          title: "Reflection of Rushikonda hill at Beach in Vizag.jpg",
          author: "Adityamadhav83",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Reflection_of_Rushikonda_hill_at_Beach_in_Vizag.jpg",
        },
      },
      {
        file: "sunrise",
        alt: "Sunrise reflecting on the wet sand near Rushikonda Beach",
        w: 1600,
        h: 1200,
        widths: [800, 1600],
        credit: {
          title: "Sunrise near Rushikonda beach (December 2018).jpg",
          author: "IM3847",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Sunrise_near_Rushikonda_beach_(December_2018).jpg",
        },
      },
      {
        file: "crab-trails",
        alt: "Patterns left by juvenile crabs on the sand at Rushikonda",
        w: 1600,
        h: 1200,
        widths: [800, 1600],
        credit: {
          title: "Trails left by Juvenile crabs near Rushikonda beach (1).jpg",
          author: "IM3847",
          license: "CC BY-SA 4.0",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
          source: "https://commons.wikimedia.org/wiki/File:Trails_left_by_Juvenile_crabs_near_Rushikonda_beach_(1).jpg",
        },
      },
    ],
  },
];

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
