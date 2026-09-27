/* ==========================================================================
   VIZAG EXPRESS — SOUND
   Ambient beds that crossfade as you move between sections, plus one-shot
   effects for interactions. Uses Web Audio when the site is served over
   http(s) (seamless loops, volume control on phones) and falls back to plain
   <audio> elements when index.html is opened straight from disk.
   All sounds are CC0 recordings from freesound.org — see assets/audio/CREDITS.md.
   ========================================================================== */
(() => {
  "use strict";

  const BASE = "assets/audio/";
  const KEY = "ve-muted";
  const MASTER = 0.9;
  const LOOPS = ["rolling", "ride", "station", "waves"];
  const EFFECTS = ["horn", "horn-far", "announce", "chime", "bell", "flap", "stamp", "whoosh", "flip", "shuffle", "slap", "shutter", "ping", "tick", "click"];

  // ambient mix per section (0..1)
  const SCENES = {
    home: { rolling: 0.6, waves: 0.28 },
    journey: { station: 0.42, rolling: 0.1 },
    crew: { ride: 0.32 },
    roles: { ride: 0.32 },
    places: { ride: 0.14, waves: 0.4 },
    events: { ride: 0.32 },
    faq: { ride: 0.22 },
    footer: { waves: 0.32, ride: 0.1 },
  };

  // signature sound the first time each section comes into view
  const STINGERS = {
    journey: () => {
      play("chime", { volume: 0.55 });
      play("announce", { volume: 0.5, delay: 1.7 });
    },
    crew: () => play("whoosh", { volume: 0.55 }),
    roles: () => play("stamp", { volume: 0.45 }),
    places: () => play("bell", { volume: 0.45 }),
    events: () => play("shuffle", { volume: 0.6 }),
    footer: () => play("horn-far", { volume: 0.85 }),
  };

  const AC = window.AudioContext || window.webkitAudioContext;
  const webAudio = /^https?:$/.test(location.protocol) && !!AC;
  let ctx = null;
  let master = null;
  let enabled = false;
  let scene = "home";
  const buffers = {};
  const loading = {};
  const beds = {};
  const lastPlayed = {};
  const stung = new Set();

  // Sound is ON by default; only an explicit mute is remembered.
  const pref = () => {
    try {
      return localStorage.getItem(KEY) === "1" ? "off" : "on";
    } catch {
      return "on";
    }
  };
  const store = (v) => {
    try {
      v === "off" ? localStorage.setItem(KEY, "1") : localStorage.removeItem(KEY);
    } catch {}
  };
  const emit = () => dispatchEvent(new CustomEvent("sound:change", { detail: { enabled } }));

  /* ------------------------------------------------------------ loading */
  // bytes can be downloaded before the first tap; decoding needs the AudioContext
  const bytes = {};
  const fetchBytes = (name) =>
    (bytes[name] ||= fetch(BASE + name + ".mp3")
      .then((r) => r.arrayBuffer())
      .catch(() => null));
  const load = (name) =>
    (loading[name] ||= !webAudio
      ? Promise.resolve(null)
      : fetchBytes(name)
          .then((data) => data && new Promise((ok, bad) => ctx.decodeAudioData(data, ok, bad)))
          .then((buf) => (buffers[name] = buf))
          .catch(() => null));

  const ensureContext = () => {
    if (!webAudio || ctx) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = MASTER;
    master.connect(ctx.destination);
    // beds + horn first, the rest shortly after
    ["horn", ...LOOPS].forEach(load);
    setTimeout(() => EFFECTS.forEach(load), 1200);
  };

  /* ---------------------------------------------------------- one-shots */
  function play(name, { volume = 1, rate = 1, pan = 0, delay = 0, throttle = 80 } = {}) {
    if (!enabled) return;
    const now = performance.now();
    if (now - (lastPlayed[name] || 0) < throttle) return;
    lastPlayed[name] = now;
    if (name === "horn") setTimeout(() => dispatchEvent(new Event("train:horn")), delay * 1000);

    if (!webAudio) {
      const a = new Audio(BASE + name + ".mp3");
      a.volume = Math.min(1, volume * MASTER);
      a.playbackRate = rate;
      setTimeout(() => a.play().catch(() => {}), delay * 1000);
      return;
    }
    const start = (buf) => {
      if (!buf || !enabled) return;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = rate;
      const gain = ctx.createGain();
      gain.gain.value = volume;
      src.connect(gain);
      if (pan && ctx.createStereoPanner) {
        const p = ctx.createStereoPanner();
        p.pan.value = pan;
        gain.connect(p).connect(master);
      } else {
        gain.connect(master);
      }
      src.start(ctx.currentTime + delay);
    };
    buffers[name] ? start(buffers[name]) : load(name).then(start);
  }

  /* ------------------------------------------------------ ambient beds */
  // Each bed re-triggers its clip with an equal-power crossfade, so any clip loops seamlessly.
  const FADE = 2;
  const curve = (up) =>
    Float32Array.from({ length: 64 }, (_, i) => {
      const t = i / 63;
      return up ? Math.sin((t * Math.PI) / 2) : Math.cos((t * Math.PI) / 2);
    });
  const UP = curve(true);
  const DOWN = curve(false);

  const bed = (name) => {
    if (beds[name]) return beds[name];
    const b = {};
    if (webAudio) {
      b.gain = ctx.createGain();
      b.gain.gain.value = 0;
      b.gain.connect(master);
      let next = 0;
      const schedule = () => {
        const buf = buffers[name];
        if (buf && ctx.state === "running") {
          if (next < ctx.currentTime) next = ctx.currentTime + 0.05;
          while (next < ctx.currentTime + 3) {
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const g = ctx.createGain();
            src.connect(g).connect(b.gain);
            g.gain.setValueCurveAtTime(UP, next, FADE);
            g.gain.setValueCurveAtTime(DOWN, next + buf.duration - FADE, FADE);
            src.start(next);
            src.stop(next + buf.duration);
            next += buf.duration - FADE;
          }
        }
        setTimeout(schedule, 1000);
      };
      load(name).then(schedule);
      b.set = (v, secs = 1.5) => {
        b.gain.gain.cancelScheduledValues(ctx.currentTime);
        b.gain.gain.setTargetAtTime(v, ctx.currentTime, secs / 3);
      };
    } else {
      const a = new Audio(BASE + name + ".mp3");
      a.loop = true;
      a.volume = 0;
      let raf = 0;
      b.set = (v) => {
        const target = Math.min(1, v * MASTER);
        if (target > 0 && a.paused) a.play().catch(() => {});
        cancelAnimationFrame(raf);
        const step = () => {
          a.volume += (target - a.volume) * 0.05;
          if (Math.abs(target - a.volume) > 0.004) raf = requestAnimationFrame(step);
          else {
            a.volume = target;
            if (!target) a.pause();
          }
        };
        step();
      };
    }
    return (beds[name] = b);
  };

  const mix = (secs) => {
    const levels = SCENES[scene] || {};
    LOOPS.forEach((n) => {
      const v = enabled && !document.hidden ? levels[n] || 0 : 0;
      if (v || beds[n]) bed(n).set(v, secs);
    });
  };

  /* ------------------------------------------------------------ public */
  const enable = ({ intro = false } = {}) => {
    ensureContext();
    if (ctx) {
      ctx.resume();
      master.gain.setTargetAtTime(MASTER, ctx.currentTime, 0.05);
    }
    enabled = true;
    store("on");
    mix(intro ? 4 : 1.5);
    if (intro) play("horn", { throttle: 0 });
    emit();
  };

  const disable = () => {
    enabled = false;
    store("off");
    mix(0.4);
    if (ctx) {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      setTimeout(() => !enabled && ctx.suspend(), 700);
    }
    emit();
  };

  const enterSection = (id) => {
    if (id === scene) return;
    scene = id;
    mix();
    if (enabled && STINGERS[id] && !stung.has(id)) {
      stung.add(id);
      STINGERS[id]();
    }
  };

  // Start sound on the visitor's first tap / click / key press anywhere. Keeps listening until the
  // browser really lets audio run (e.g. a scroll swipe on a phone doesn't count, a tap does).
  const unlockOnInteraction = () => {
    const events = ["click", "keydown", "touchend"];
    let waiting = false;
    const stop = () => events.forEach((ev) => removeEventListener(ev, handler, true));
    const handler = (e) => {
      if (e.target.closest && e.target.closest("#sound-btn, [data-sound-skip]")) return; // these handle themselves
      if (pref() === "off") return stop();
      if (!enabled) enable({ intro: true });
      if (!ctx) return stop(); // <audio> fallback: started by this gesture
      if (waiting) return;
      waiting = true;
      ctx
        .resume()
        .catch(() => {})
        .then(() => {
          waiting = false;
          if (ctx.state === "running") stop();
        });
    };
    events.forEach((ev) => addEventListener(ev, handler, true));
  };

  // Can audio start right now, before any tap? (e.g. Chrome allows it on sites you use often)
  const canAutoplay = async () => {
    if (navigator.getAutoplayPolicy) {
      try {
        return navigator.getAutoplayPolicy(webAudio ? "audiocontext" : "mediaelement") === "allowed";
      } catch {}
    }
    if (webAudio) {
      // download the horn + ambience once the page itself has loaded, so the first tap plays instantly
      const prefetch = () => setTimeout(() => ["horn", ...LOOPS].forEach(fetchBytes), 800);
      document.readyState === "complete" ? prefetch() : addEventListener("load", prefetch, { once: true });
      // probe with a throwaway context: the real one is created inside the tap, where it starts
      // running immediately (resuming a context made before the tap can lag by seconds)
      const probe = new AC();
      await Promise.race([probe.resume().catch(() => {}), new Promise((r) => setTimeout(r, 300))]);
      const allowed = probe.state === "running";
      probe.close().catch(() => {});
      return allowed;
    }
    const probe = new Audio(BASE + "tick.mp3");
    probe.volume = 0;
    try {
      await probe.play();
      probe.pause();
      return true;
    } catch {
      return false;
    }
  };

  document.addEventListener("visibilitychange", () => {
    if (ctx) document.hidden ? ctx.suspend() : enabled && ctx.resume();
    else mix(0.3);
  });

  window.SFX = {
    play,
    enable,
    disable,
    toggle: () => (enabled ? disable() : enable()),
    enterSection,
    canAutoplay,
    unlockOnInteraction,
    pref,
    get enabled() {
      return enabled;
    },
  };
})();
