/* ==========================================================================
   VIZAG EXPRESS — 3D HERO SCENE (Three.js)
   A low-poly express train running along the East Coast at sunrise.
   The train stays put while the world (track, masts, palms, sea) scrolls past.
   Loaded as a classic script; Three.js is pulled in with a dynamic import so
   the site still works when index.html is opened straight from disk.
   ========================================================================== */
(async () => {
  "use strict";

  const canvas = document.getElementById("scene");
  if (!canvas) return;

  const ready = () => {
    document.documentElement.classList.add("scene-ready");
    dispatchEvent(new Event("scene:ready"));
  };
  const fail = (err) => {
    console.info("[Vizag Express] 3D scene off:", String(err));
    document.documentElement.classList.add("no-webgl");
    ready();
  };

  // Only run the live scene on a real GPU. Software-emulated WebGL (no GPU, blocklisted drivers,
  // headless crawlers) would stutter and block the page, so those keep the poster image of the scene.
  const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;
  const checkOnMainThread = () => {
    try {
      const gl = document.createElement("canvas").getContext("webgl", { failIfMajorPerformanceCaveat: true });
      if (!gl) return false;
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const name = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "";
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return !SOFTWARE.test(name);
    } catch {
      return false;
    }
  };
  // The check runs in a background worker: on machines without a GPU, merely creating a WebGL
  // context spins up a software emulator for ~1 s, which would otherwise freeze the page.
  const detectGpu = () =>
    new Promise((resolve) => {
      let settled = false;
      const done = (v) => !settled && ((settled = true), resolve(v));
      try {
        if (!window.Worker || !window.OffscreenCanvas) throw new Error("no worker WebGL");
        const code = `onmessage = () => {
          let r = "unsupported";
          try {
            const gl = new OffscreenCanvas(1, 1).getContext("webgl", { failIfMajorPerformanceCaveat: true });
            if (!gl) r = new OffscreenCanvas(1, 1).getContext("webgl") ? "software" : "unsupported";
            else {
              const i = gl.getExtension("WEBGL_debug_renderer_info");
              r = ${SOFTWARE}.test(i ? gl.getParameter(i.UNMASKED_RENDERER_WEBGL) : "") ? "software" : "gpu";
            }
          } catch (e) {}
          postMessage(r);
        };`;
        const url = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
        const worker = new Worker(url);
        const finish = (v) => {
          worker.terminate();
          URL.revokeObjectURL(url);
          done(v);
        };
        worker.onmessage = (e) => finish(e.data === "unsupported" ? checkOnMainThread() : e.data === "gpu");
        worker.onerror = () => finish(checkOnMainThread());
        setTimeout(() => finish(false), 5000);
        worker.postMessage(0);
      } catch {
        done(checkOnMainThread());
      }
    });
  const hasGpu = await detectGpu();
  if (!hasGpu && !/[?&]force3d\b/.test(location.search)) return fail("no hardware-accelerated WebGL; showing the poster");

  // Let the page's text and images load first; the 3D scene then fades in over the hero poster.
  if (document.readyState !== "complete") await new Promise((r) => addEventListener("load", r, { once: true }));

  let THREE;
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
  } catch (e) {
    return fail(e);
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch (e) {
    return fail(e);
  }

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 768;
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const ANISO = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();
  const FOG = new THREE.Color("#6e3a63");
  scene.fog = new THREE.Fog(FOG, 70, 280);
  renderer.setClearColor(FOG);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1200);

  /* ------------------------------------------------------------ helpers */
  const SPEED = 16; // world units per second
  const SUN_DIR = new THREE.Vector3(-0.78, 0.06, -1).normalize();

  const mulberry32 = (a) => () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rand = mulberry32(20261226);

  const std = (color, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.05, flatShading: true, ...extra });

  const canvasTex = (w, h, draw, { repeat, srgb = true } = {}) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const tex = new THREE.CanvasTexture(c);
    if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = ANISO;
    if (repeat) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeat[0], repeat[1]);
    }
    return tex;
  };

  const speckle = (base, dots, count, [rMin, rMax]) => (g, w, h) => {
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < count; i++) {
      g.fillStyle = dots[(Math.random() * dots.length) | 0];
      g.globalAlpha = 0.35 + Math.random() * 0.5;
      g.beginPath();
      g.ellipse(Math.random() * w, Math.random() * h, rMin + Math.random() * (rMax - rMin), rMin + Math.random() * (rMax - rMin) * 0.6, Math.random() * 3, 0, 7);
      g.fill();
    }
    g.globalAlpha = 1;
  };

  const radialTex = (stops) =>
    canvasTex(128, 128, (g) => {
      const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      stops.forEach(([o, c]) => gr.addColorStop(o, c));
      g.fillStyle = gr;
      g.fillRect(0, 0, 128, 128);
    });

  const glowSprite = (tex, color, size) => {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })
    );
    s.scale.set(size, size, 1);
    return s;
  };
  const GLOW = radialTex([
    [0, "rgba(255,255,255,1)"],
    [0.18, "rgba(255,255,255,0.55)"],
    [0.5, "rgba(255,255,255,0.12)"],
    [1, "rgba(255,255,255,0)"],
  ]);

  // Box stretched between two points — used for masts and the pantograph
  const X_AXIS = new THREE.Vector3(1, 0, 0);
  const bar = (a, b, t, mat) => {
    const dir = new THREE.Vector3().subVectors(b, a);
    const m = new THREE.Mesh(new THREE.BoxGeometry(dir.length(), t, t), mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(X_AXIS, dir.normalize());
    return m;
  };

  const mergeGeos = (geos) => {
    const arrays = geos.map((g) => (g.index ? g.toNonIndexed() : g).attributes.position.array);
    const out = new Float32Array(arrays.reduce((n, a) => n + a.length, 0));
    let o = 0;
    arrays.forEach((a) => {
      out.set(a, o);
      o += a.length;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(out, 3));
    g.computeVertexNormals();
    return g;
  };

  // hand control back to the browser between build steps (keeps each task short)
  const breathe = () =>
    new Promise((r) => (window.scheduler && scheduler.yield ? scheduler.yield().then(r) : setTimeout(r, 0)));

  /* ---------------------------------------------------------------- sky */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(600, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uTop: { value: new THREE.Color("#050922") },
        uMid: { value: new THREE.Color("#35194f") },
        uHorizon: { value: new THREE.Color("#ff8d5c") },
        uSun: { value: new THREE.Color("#ffc58a") },
        uSunDir: { value: SUN_DIR },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uHorizon; uniform vec3 uSun; uniform vec3 uSunDir;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float h = d.y;
          vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.2, h));
          col = mix(col, uTop, smoothstep(0.16, 0.6, h));
          float s = max(dot(d, uSunDir), 0.0);
          col += uSun * (pow(s, 10.0) * 0.5 + pow(s, 90.0) * 0.7);
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    })
  );
  sky.renderOrder = -1;
  scene.add(sky);

  // stars
  {
    const n = small ? 700 : 1500;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2;
      const y = 0.1 + rand() * 0.9;
      const r = Math.sqrt(1 - y * y);
      pos.set([Math.cos(a) * r * 520, y * 520, Math.sin(a) * r * 520], i * 3);
      const b = Math.min(1, (y - 0.1) * 2.5) * (0.4 + rand() * 0.6);
      col.set([b, b, b * 1.1], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    var stars = new THREE.Points(
      g,
      new THREE.PointsMaterial({ size: small ? 1.4 : 1.7, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false, fog: false })
    );
    scene.add(stars);
  }

  // sun
  const sunPos = SUN_DIR.clone().multiplyScalar(480);
  const sun = new THREE.Mesh(new THREE.CircleGeometry(15, 48), new THREE.MeshBasicMaterial({ color: "#fff1d6", fog: false, toneMapped: false, depthWrite: false }));
  sun.position.copy(sunPos);
  sun.lookAt(0, 0, 0);
  scene.add(sun);
  const sunGlow = glowSprite(GLOW, "#ffb070", 230);
  sunGlow.position.copy(sunPos);
  scene.add(sunGlow);

  // clouds — clusters of flattened low-poly puffs lit by the sunrise
  {
    const puff = new THREE.IcosahedronGeometry(1, 0);
    const mat = std("#f3a58a", { emissive: "#6b2f4f", emissiveIntensity: 0.6, roughness: 1, fog: false });
    for (let c = 0; c < 9; c++) {
      const cloud = new THREE.Group();
      const count = 4 + ((rand() * 4) | 0);
      for (let i = 0; i < count; i++) {
        const m = new THREE.Mesh(puff, mat);
        const s = 5 + rand() * 7;
        m.scale.set(s * 1.6, s * 0.55, s);
        m.position.set(i * 7 - count * 3.5 + rand() * 3, rand() * 2, rand() * 4);
        cloud.add(m);
      }
      // spread across the sky but keep clear of the sun
      const sunAng = Math.atan2(SUN_DIR.z, SUN_DIR.x);
      let ang = -2.6 + rand() * 2.3;
      if (Math.abs(ang - sunAng) < 0.22) ang += 0.45 * Math.sign(ang - sunAng || 1);
      const dist = 300 + rand() * 120;
      cloud.position.set(Math.cos(ang) * dist, 48 + rand() * 60, Math.sin(ang) * dist);
      cloud.lookAt(0, cloud.position.y, 0);
      scene.add(cloud);
    }
  }

  await breathe();

  /* ------------------------------------------------------------ lights */
  scene.add(new THREE.HemisphereLight("#ffc4a2", "#1b2142", 1.15));
  const sunLight = new THREE.DirectionalLight("#ffaa6e", 2.6);
  sunLight.position.copy(SUN_DIR).multiplyScalar(100);
  scene.add(sunLight);
  const fill = new THREE.DirectionalLight("#8ea0ff", 0.9);
  fill.position.set(30, 25, 45);
  scene.add(fill);

  /* ------------------------------------------------------------- ocean */
  const SHORE_Z = -7.5;
  const waves = { uTime: { value: 0 }, uOffset: { value: 0 } };
  {
    const SX = small ? 110 : 170;
    const SZ = small ? 60 : 90;
    const geo = new THREE.PlaneGeometry(2, 1, SX, SZ);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i);
      const v = p.getY(i) + 0.5; // 0 at shore → 1 far
      // denser vertices near the shore and the view centre, sparse towards the horizon
      p.setXYZ(i, -40 + Math.sign(u) * Math.pow(Math.abs(u), 1.9) * 520, 0, SHORE_Z - Math.pow(v, 2.1) * 620);
    }
    geo.computeVertexNormals();
    const mat = std("#0d5877", { roughness: 0.22, metalness: 0.25 });
    // waves are computed on the GPU; flat shading derives the facet normals per pixel
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, waves);
      shader.vertexShader =
        "uniform float uTime;\nuniform float uOffset;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          float wx = position.x + uOffset;
          float wz = position.z;
          float amp = 0.25 + min(1.0, (${SHORE_Z.toFixed(1)} - wz) / 18.0) * 0.75;
          transformed.y += amp * (sin(wx * 0.11 + uTime * 1.25) * 0.38
                                + sin(wz * 0.19 - uTime * 1.05 + wx * 0.035) * 0.32
                                + sin((wx - wz) * 0.045 + uTime * 0.6) * 0.55);`
        );
    };
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = -0.45;
    mesh.frustumCulled = false;
    scene.add(mesh);
  }
  const updateOcean = (t, off) => {
    waves.uTime.value = t;
    waves.uOffset.value = off;
  };
  await breathe();

  /* -------------------------------------------------- beach, land, track */
  const sandTex = canvasTex(256, 64, speckle("#d6a574", ["#e8c190", "#b98659", "#f0d2a8"], 900, [0.6, 2.2]), { repeat: [60, 1] });
  const landTex = canvasTex(256, 256, speckle("#294a31", ["#35603c", "#1c3824", "#4b6d3a", "#5a4b35"], 1400, [1, 5]), { repeat: [70, 7] });
  const ballastTex = canvasTex(256, 64, speckle("#6a615b", ["#8a817a", "#4b4541", "#a39a92"], 1600, [0.6, 1.8]), { repeat: [240, 1] });
  const scrollers = [
    { tex: sandTex, width: 700 },
    { tex: landTex, width: 700 },
    { tex: ballastTex, width: 700 },
  ];

  {
    // sand slopes down under the waterline so the shoreline wobbles with the waves
    const g = new THREE.PlaneGeometry(700, 7.5, 1, 6);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const k = (p.getZ(i) + 3.75) / 7.5; // 0 far (sea side) → 1 near
      p.setY(i, -0.95 + k * 1.0);
    }
    g.computeVertexNormals();
    const sand = new THREE.Mesh(g, std("#ffffff", { map: sandTex, flatShading: false, roughness: 1 }));
    sand.position.set(-60, 0, -5.4);
    scene.add(sand);

    const land = new THREE.Mesh(new THREE.PlaneGeometry(700, 80), std("#ffffff", { map: landTex, flatShading: false, roughness: 1 }));
    land.rotation.x = -Math.PI / 2;
    land.position.set(-60, 0.02, 38.3);
    scene.add(land);

    const bed = new THREE.Mesh(new THREE.BoxGeometry(700, 0.36, 3.6), std("#ffffff", { map: ballastTex, flatShading: false, roughness: 1 }));
    bed.position.set(-60, 0.18, 0);
    scene.add(bed);

    const railMat = std("#d9dde6", { metalness: 0.9, roughness: 0.3, flatShading: false });
    [-0.75, 0.75].forEach((z) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(700, 0.16, 0.12), railMat);
      rail.position.set(-60, 0.58, z);
      scene.add(rail);
    });
  }

  await breathe();

  // things that scroll past: each group is periodic, so it just slides by (offset % period)
  const movers = [];
  const periodic = (period) => {
    const g = new THREE.Group();
    scene.add(g);
    movers.push({ g, period });
    return g;
  };

  // sleepers
  {
    const SP = 0.9;
    const from = -170;
    const count = Math.ceil(230 / SP);
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.32, 0.13, 2.7), std("#8b8179", { roughness: 0.9 }), count);
    const m = new THREE.Matrix4();
    for (let i = 0; i < count; i++) im.setMatrixAt(i, m.makeTranslation(from + i * SP, 0.43, 0));
    periodic(SP).add(im);
  }

  // overhead line masts + contact wire
  const WIRE_Y = 6.55;
  {
    const SP = 18;
    const from = -180;
    const count = Math.ceil(250 / SP);
    const mastMat = std("#8e96a6", { metalness: 0.5, roughness: 0.5 });
    const post = new THREE.BoxGeometry(0.28, 7.6, 0.28);
    post.translate(0, 3.8, -3.1);
    const arm = new THREE.BoxGeometry(0.1, 0.1, 3.6);
    arm.translate(0, 7.2, -1.3);
    const drop = new THREE.BoxGeometry(0.05, 0.7, 0.05);
    drop.translate(0, 6.9, 0);
    const posts = new THREE.InstancedMesh(post, mastMat, count);
    const arms = new THREE.InstancedMesh(arm, mastMat, count);
    const drops = new THREE.InstancedMesh(drop, mastMat, count);
    const m = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      m.makeTranslation(from + i * SP, 0, 0);
      posts.setMatrixAt(i, m);
      arms.setMatrixAt(i, m);
      drops.setMatrixAt(i, m);
    }
    periodic(SP).add(posts, arms, drops);

    const wireMat = new THREE.MeshBasicMaterial({ color: "#2a2438" });
    [WIRE_Y, 7.25].forEach((y) => {
      const w = new THREE.Mesh(new THREE.BoxGeometry(700, 0.04, 0.04), wireMat);
      w.position.set(-60, y, 0);
      scene.add(w);
    });
  }

  await breathe();

  // palms and bushes (period P, laid out twice so the loop is seamless)
  {
    const P = 240;
    const from = -190;
    const trunk = new THREE.CylinderGeometry(0.12, 0.26, 6, 7, 8, true);
    trunk.translate(0, 3, 0);
    const tp = trunk.attributes.position;
    for (let i = 0; i < tp.count; i++) tp.setX(i, tp.getX(i) + 0.04 * tp.getY(i) ** 2);
    trunk.computeVertexNormals();
    const top = new THREE.Vector3(0.04 * 36, 5.95, 0);
    const fronds = [];
    for (let k = 0; k < 9; k++) {
      const f = new THREE.PlaneGeometry(3.4, 0.9, 7, 1);
      f.translate(1.7, 0, 0);
      f.rotateX(-Math.PI / 2);
      const p = f.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i);
        p.setY(i, 0.35 * x - 0.17 * x * x);
        p.setZ(i, p.getZ(i) * (1 - (0.8 * x) / 3.4));
      }
      f.rotateY((k * Math.PI * 2) / 9 + (k % 2) * 0.25);
      f.translate(top.x, top.y, top.z);
      fronds.push(f);
    }
    const crown = mergeGeos(fronds);

    const spots = [];
    for (let i = 0; i < 16; i++) {
      spots.push({
        x: from + (i / 16) * P + rand() * 8,
        z: -3.6 - rand() * 2.4,
        s: 0.75 + rand() * 0.5,
        r: rand() * Math.PI * 2,
      });
    }
    const n = spots.length * 2;
    const trunks = new THREE.InstancedMesh(trunk, std("#6a4a33"), n);
    const crowns = new THREE.InstancedMesh(crown, std("#2f6e3d", { side: THREE.DoubleSide }), n);
    const o = new THREE.Object3D();
    spots.forEach((s, i) => {
      [0, P].forEach((shift, k) => {
        o.position.set(s.x + shift, 0, s.z);
        o.rotation.set(0, s.r, 0);
        o.scale.setScalar(s.s);
        o.updateMatrix();
        trunks.setMatrixAt(i * 2 + k, o.matrix);
        crowns.setMatrixAt(i * 2 + k, o.matrix);
      });
    });

    const bushCount = 60;
    const bushes = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.6, 0), std("#3b6b3a"), bushCount * 2);
    for (let i = 0; i < bushCount; i++) {
      const x = from + rand() * P;
      const z = 2.6 + rand() * 12;
      const s = 0.5 + rand() * 0.9;
      [0, P].forEach((shift, k) => {
        o.position.set(x + shift, 0.15, z);
        o.rotation.set(rand(), rand() * 3, 0);
        o.scale.set(s * 1.3, s * 0.8, s);
        o.updateMatrix();
        bushes.setMatrixAt(i * 2 + k, o.matrix);
      });
    }
    periodic(P).add(trunks, crowns, bushes);
  }

  await breathe();

  /* ------------------------------------------------------ distant coast */
  const hillMat = std("#3c2a55", { roughness: 1 });
  const hill = (x, z, r, sx, sy, sz, y = -2) => {
    const g = new THREE.IcosahedronGeometry(r, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * (0.85 + rand() * 0.3), p.getY(i) * (0.85 + rand() * 0.3), p.getZ(i));
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, hillMat);
    m.scale.set(sx, sy, sz);
    m.position.set(x, y, z);
    scene.add(m);
    return m;
  };
  // Eastern Ghats along the coast, and a headland with a lighthouse (hello, Dolphin's Nose)
  hill(-330, 30, 40, 1.8, 0.9, 1.2, -6);
  hill(-280, 70, 45, 1.5, 1.1, 1, -8);
  hill(-380, -10, 35, 1.6, 0.8, 1.1, -6);
  hill(-230, 90, 30, 1.4, 0.8, 1, -4);
  const headland = hill(-170, -120, 30, 1.7, 0.5, 1.2, -5);
  headland.updateMatrixWorld();
  const LH = new THREE.Vector3(-165, 9, -118);
  {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.4, 9, 10), std("#f2ece4", { flatShading: false }));
    tower.position.set(LH.x, LH.y + 4.5, LH.z);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.4, 10), std("#b3312d"));
    cap.position.set(LH.x, LH.y + 9.7, LH.z);
    scene.add(tower, cap);
  }
  const beacon = glowSprite(GLOW, "#fff1c2", 18);
  beacon.position.set(LH.x, LH.y + 9.9, LH.z);
  scene.add(beacon);

  await breathe();

  /* -------------------------------------------------------------- train */
  const H = 2.7; // body height
  const W = 2.9; // body width
  const BODY_Y = 1.95 + H / 2;

  const glass = (g, x, y, w, h, r = 10) => {
    const gr = g.createLinearGradient(x, y, x + w, y + h);
    gr.addColorStop(0, "#26324d");
    gr.addColorStop(0.45, "#101829");
    gr.addColorStop(1, "#2d3b5c");
    g.fillStyle = gr;
    g.beginPath();
    g.roundRect(x, y, w, h, r);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.12)";
    g.beginPath();
    g.moveTo(x + w * 0.15, y + h);
    g.lineTo(x + w * 0.55, y);
    g.lineTo(x + w * 0.75, y);
    g.lineTo(x + w * 0.35, y + h);
    g.fill();
  };

  const coachSide = (num) => {
    const draw = (lit) => (g, w, h) => {
      if (lit) {
        g.fillStyle = "#000";
        g.fillRect(0, 0, w, h);
      } else {
        const gr = g.createLinearGradient(0, 0, 0, h);
        gr.addColorStop(0, "#3057b3");
        gr.addColorStop(1, "#1b2f6e");
        g.fillStyle = gr;
        g.fillRect(0, 0, w, h);
        g.fillStyle = "rgba(0,0,0,0.25)";
        g.fillRect(0, 0, w, 12);
        g.fillStyle = "#efe0bf";
        g.fillRect(0, 178, w, 16);
        g.fillStyle = "#e0463a";
        g.fillRect(0, 199, w, 6);
        g.fillStyle = "#14224f";
        g.fillRect(0, 252, w, 48);
        // doors
        g.fillStyle = "#223a82";
        [26, w - 104].forEach((x) => g.fillRect(x, 40, 78, 206));
        g.strokeStyle = "rgba(0,0,0,0.35)";
        g.lineWidth = 3;
        [26, w - 104].forEach((x) => g.strokeRect(x, 40, 78, 206));
        g.fillStyle = "#efe0bf";
        g.font = "800 30px Outfit, 'Segoe UI', sans-serif";
        g.textAlign = "center";
        g.fillText("VIZAG EXPRESS", w / 2, 238);
        g.font = "800 26px Outfit, 'Segoe UI', sans-serif";
        g.fillText(num, 65, 30);
      }
      // windows
      for (let i = 0; i < 8; i++) {
        const x = 150 + i * 92;
        if (lit) {
          const gr = g.createLinearGradient(0, 62, 0, 150);
          gr.addColorStop(0, "#ffcf85");
          gr.addColorStop(1, "#ff9748");
          g.fillStyle = gr;
          g.beginPath();
          g.roundRect(x, 62, 66, 88, 10);
          g.fill();
          g.fillStyle = "#000";
          g.fillRect(x, 102, 66, 5);
          // a few passenger silhouettes
          if ((i + num.length) % 3 === 0) {
            g.beginPath();
            g.arc(x + 33, 124, 11, 0, 7);
            g.fill();
            g.fillRect(x + 16, 134, 34, 16);
          }
        } else {
          g.fillStyle = "#ffd9a0";
          g.beginPath();
          g.roundRect(x, 62, 66, 88, 10);
          g.fill();
          g.strokeStyle = "#0f1a3d";
          g.lineWidth = 5;
          g.stroke();
        }
      }
      // door windows
      [26, w - 104].forEach((x) => {
        g.fillStyle = lit ? "#ffb566" : "#ffd9a0";
        g.beginPath();
        g.roundRect(x + 20, 62, 38, 56, 8);
        g.fill();
      });
    };
    return { map: canvasTex(1024, 300, draw(false)), glow: canvasTex(1024, 300, draw(true)) };
  };

  const engineSide = () => {
    const draw = (lit) => (g, w, h) => {
      if (lit) {
        g.fillStyle = "#000";
        g.fillRect(0, 0, w, h);
        return;
      }
      g.fillStyle = "#efe9de";
      g.fillRect(0, 0, w, h);
      g.fillStyle = "#1f2b5c";
      g.fillRect(0, 166, w, 12);
      g.fillStyle = "#c9302c";
      g.fillRect(0, 180, w, 72);
      g.fillStyle = "#262b36";
      g.fillRect(0, 252, w, 48);
      glass(g, 34, 48, 96, 82);
      glass(g, w - 130, 48, 96, 82);
      g.strokeStyle = "rgba(0,0,0,0.3)";
      g.lineWidth = 3;
      g.strokeRect(150, 36, 72, 214);
      g.strokeRect(w - 222, 36, 72, 214);
      for (let x = 262; x < 762; x += 11) {
        g.fillStyle = "rgba(55,64,86,0.55)";
        g.fillRect(x, 58, 5, 92);
      }
      g.fillStyle = "#ffffff";
      g.font = "800 36px Outfit, 'Segoe UI', sans-serif";
      g.textAlign = "center";
      g.fillText("VIZAG EXPRESS", w / 2, 230);
      g.fillStyle = "#1f2b5c";
      g.font = "700 20px Outfit, 'Segoe UI', sans-serif";
      g.fillText("BBS ⇄ VSKP", w / 2, 36);
    };
    return { map: canvasTex(1024, 300, draw(false)), glow: canvasTex(1024, 300, draw(true)) };
  };

  const engineFront = () => {
    const draw = (lit) => (g, w, h) => {
      g.fillStyle = lit ? "#000" : "#efe9de";
      g.fillRect(0, 0, w, h);
      if (!lit) {
        g.fillStyle = "#1f2b5c";
        g.fillRect(0, 166, w, 12);
        g.fillStyle = "#c9302c";
        g.fillRect(0, 180, w, 72);
        g.fillStyle = "#262b36";
        g.fillRect(0, 252, w, 48);
        glass(g, 18, 34, 132, 104, 14);
        glass(g, 170, 34, 132, 104, 14);
      }
      g.fillStyle = lit ? "#fff7de" : "#fffbe8";
      [
        [70, 214],
        [250, 214],
      ].forEach(([x, y]) => {
        g.beginPath();
        g.arc(x, y, 20, 0, 7);
        g.fill();
      });
      g.fillStyle = lit ? "#ffe9a8" : "#fff2c4";
      g.beginPath();
      g.arc(160, 22, 12, 0, 7);
      g.fill();
    };
    return { map: canvasTex(320, 300, draw(false)), glow: canvasTex(320, 300, draw(true)) };
  };

  const dark = std("#1b1d26", { roughness: 0.7 });
  const wheelMat = std("#3a3d47", { metalness: 0.6, roughness: 0.4 });
  const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.14, 14);
  wheelGeo.rotateX(Math.PI / 2);

  const buildCar = ({ length, side, front, bodyColor, roofColor, axles }) => {
    const car = new THREE.Group();
    const sideMat = new THREE.MeshStandardMaterial({
      map: side.map,
      emissiveMap: side.glow,
      emissive: "#ffffff",
      emissiveIntensity: 1.5,
      roughness: 0.5,
      metalness: 0.15,
    });
    const plain = std(bodyColor, { flatShading: false, roughness: 0.6 });
    const frontMat = front
      ? new THREE.MeshStandardMaterial({ map: front.map, emissiveMap: front.glow, emissive: "#ffffff", emissiveIntensity: 2.2, roughness: 0.45 })
      : plain;
    const body = new THREE.Mesh(new THREE.BoxGeometry(length, H, W), [frontMat, plain, plain, plain, sideMat, sideMat]);
    body.position.y = BODY_Y;
    car.add(body);

    const roofGeo = new THREE.CylinderGeometry(W / 2, W / 2, length - 0.02, 24);
    roofGeo.rotateZ(Math.PI / 2);
    roofGeo.scale(1, 0.26, 1);
    const roof = new THREE.Mesh(roofGeo, std(roofColor, { flatShading: false, metalness: 0.3, roughness: 0.5 }));
    roof.position.y = BODY_Y + H / 2;
    car.add(roof);

    const under = new THREE.Mesh(new THREE.BoxGeometry(length - 0.8, 0.5, W - 0.5), dark);
    under.position.y = 1.72;
    car.add(under);

    const bx = length / 2 - (axles === 3 ? 2.2 : 1.9);
    [-bx, bx].forEach((x) => {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(axles === 3 ? 3.6 : 2.8, 0.42, 2.1), dark);
      frame.position.set(x, 1.2, 0);
      car.add(frame);
      const spread = axles === 3 ? [-1.2, 0, 1.2] : [-0.8, 0.8];
      spread.forEach((ax) =>
        [-0.78, 0.78].forEach((z) => {
          const w = new THREE.Mesh(wheelGeo, wheelMat);
          w.position.set(x + ax, 1.07, z);
          car.add(w);
        })
      );
    });
    return car;
  };

  const train = new THREE.Group();
  scene.add(train);
  const cars = [];
  const ENGINE_L = 8.4;
  const COACH_L = 9.4;
  const GAP = 0.55;
  const FRONT_X = 7;

  await breathe();
  const engine = buildCar({ length: ENGINE_L, side: engineSide(), front: engineFront(), bodyColor: "#e9e2d6", roofColor: "#9aa1ad", axles: 3 });
  engine.position.x = FRONT_X - ENGINE_L / 2;
  train.add(engine);
  cars.push(engine);

  // pantograph reaching up to the contact wire
  {
    const pm = std("#c9ced8", { metalness: 0.7, roughness: 0.35 });
    const roofTop = BODY_Y + H / 2 + 0.38;
    const px = -ENGINE_L / 2 + 2.2;
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.14, 1.3), pm);
    base.position.set(px, roofTop + 0.07, 0);
    const knee = new THREE.Vector3(px + 1.0, roofTop + (WIRE_Y - roofTop) * 0.5, 0);
    const lower = bar(new THREE.Vector3(px - 0.2, roofTop + 0.14, 0), knee, 0.07, pm);
    const upper = bar(knee, new THREE.Vector3(px, WIRE_Y - 0.06, 0), 0.06, pm);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 1.9), pm);
    head.position.set(px, WIRE_Y - 0.05, 0);
    engine.add(base, lower, upper, head);
    var sparkAnchor = new THREE.Vector3(px, WIRE_Y, 0);
  }

  const COACHES = small ? 5 : 7;
  for (let i = 0; i < COACHES; i++) {
    await breathe();
    const coach = buildCar({ length: COACH_L, side: coachSide("S" + (i + 1)), bodyColor: "#24418f", roofColor: "#6f7a8c", axles: 2 });
    coach.position.x = FRONT_X - ENGINE_L - GAP - COACH_L / 2 - i * (COACH_L + GAP);
    train.add(coach);
    cars.push(coach);
    // gangway to the car in front
    const gw = new THREE.Mesh(new THREE.BoxGeometry(GAP + 0.1, 2.4, 2.1), dark);
    gw.position.set(coach.position.x + COACH_L / 2 + GAP / 2, BODY_Y, 0);
    train.add(gw);
  }

  // headlight: glow sprites + a spotlight washing the track ahead
  const headGlows = [];
  [-0.62, 0.62].forEach((z) => {
    const s = glowSprite(GLOW, "#fff2cc", 2.6);
    s.position.set(FRONT_X + 0.08, BODY_Y - 0.62, z);
    train.add(s);
    headGlows.push(s);
  });
  const topGlow = glowSprite(GLOW, "#ffe7a3", 1.6);
  topGlow.position.set(FRONT_X + 0.08, BODY_Y + H / 2 - 0.2, 0);
  train.add(topGlow);
  const spot = new THREE.SpotLight("#fff0c8", 220, 70, 0.32, 0.6, 1.4);
  spot.position.set(FRONT_X + 0.3, BODY_Y - 0.4, 0);
  spot.target.position.set(FRONT_X + 30, 0, 0);
  train.add(spot, spot.target);

  // occasional pantograph spark
  const spark = glowSprite(GLOW, "#9fd8ff", 1.2);
  spark.position.copy(sparkAnchor).add(engine.position);
  spark.material.opacity = 0;
  train.add(spark);

  /* ------------------------------------------------------------- camera */
  const base = { pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 40 };
  const layoutCamera = () => {
    const a = camera.aspect;
    if (a < 0.8) {
      // phones (portrait): pull back so the engine and a few coaches fit under the headline
      base.pos.set(24, 7.5, 27);
      base.look.set(-1, 1.2, -4);
      base.fov = 52;
    } else if (a < 1.3) {
      base.pos.set(19, 5.2, 21);
      base.look.set(-3, 2.2, -3);
      base.fov = 44;
    } else {
      base.pos.set(18.5, 4.6, 18.5);
      base.look.set(-11, 3.3, -2.5);
      base.fov = 38;
    }
    camera.fov = base.fov;
    camera.updateProjectionMatrix();
  };

  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  addEventListener(
    "pointermove",
    (e) => {
      pointer.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.y = (e.clientY / innerHeight) * 2 - 1;
    },
    { passive: true }
  );

  const hero = canvas.parentElement;
  const tmpPos = new THREE.Vector3();
  const tmpLook = new THREE.Vector3();
  const updateCamera = (t, intro) => {
    pointer.sx += (pointer.x - pointer.sx) * 0.05;
    pointer.sy += (pointer.y - pointer.sy) * 0.05;
    const scroll = Math.min(1, Math.max(0, scrollY / (hero.offsetHeight || 1)));
    const k = 1 - Math.pow(1 - intro, 3); // ease-out
    tmpPos.copy(base.pos);
    tmpPos.x += 14 * (1 - k) + pointer.sx * 2.2;
    tmpPos.y += 6 * (1 - k) - pointer.sy * 1.1 + scroll * 5 + Math.sin(t * 0.7) * 0.08;
    tmpPos.z += 10 * (1 - k) + scroll * 4;
    tmpLook.copy(base.look);
    tmpLook.y += scroll * 1.5;
    camera.position.copy(tmpPos);
    camera.lookAt(tmpLook);
  };

  /* --------------------------------------------------------------- loop */
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    layoutCamera();
  };
  resize();
  new ResizeObserver(() => {
    resize();
    if (!running) renderFrame(0);
  }).observe(canvas);

  let time = 0;
  let hornFlash = 0;
  let offset = 0;
  let intro = reduceMotion ? 1 : 0;
  const clock = new THREE.Clock();

  const renderFrame = (dt) => {
    time += dt;
    offset += SPEED * dt;
    intro = Math.min(1, intro + dt / 2.6);

    movers.forEach(({ g, period }) => (g.position.x = -(offset % period)));
    scrollers.forEach(({ tex, width }) => (tex.offset.x = ((offset * tex.repeat.x) / width) % 1));
    updateOcean(time, offset);

    cars.forEach((car, i) => {
      car.position.y = Math.sin(time * 9 + i * 1.7) * 0.025 + Math.sin(time * 2.3 + i) * 0.02;
      car.rotation.x = Math.sin(time * 1.9 + i * 0.8) * 0.006;
    });
    const flicker = 0.9 + Math.sin(time * 30) * 0.05;
    hornFlash = Math.max(0, hornFlash - dt * 0.35);
    const boost = 1 + hornFlash * (1.6 + Math.sin(time * 38) * 0.4);
    headGlows.forEach((s) => s.scale.setScalar(2.6 * flicker * boost));
    topGlow.scale.setScalar(1.6 * boost);
    spot.intensity = 220 * (1 + hornFlash * 1.5);
    spark.material.opacity = Math.max(0, Math.sin(time * 1.3) * Math.sin(time * 17.1) - 0.82) * 5;
    beacon.material.opacity = 0.25 + 0.75 * Math.pow(Math.max(0, Math.sin(time * 1.6)), 6);
    stars.rotation.y = time * 0.003;

    updateCamera(time, intro);
    renderer.render(scene, camera);
  };

  // headlights flash while the horn sounds (fired by js/sound.js)
  addEventListener("train:horn", () => {
    hornFlash = 1;
    if (!running) renderFrame(0);
  });

  let running = false;
  let heroVisible = true;
  const loop = () => {
    if (!running) return;
    renderFrame(Math.min(clock.getDelta(), 0.05));
    requestAnimationFrame(loop);
  };
  const setRunning = () => {
    const should = heroVisible && !document.hidden && !reduceMotion;
    if (should && !running) {
      running = true;
      clock.getDelta();
      requestAnimationFrame(loop);
    } else if (!should) {
      running = false;
    }
  };

  new IntersectionObserver(([en]) => {
    heroVisible = en.isIntersecting;
    setRunning();
  }).observe(hero);
  document.addEventListener("visibilitychange", setRunning);

  // compile shaders without blocking (uses parallel compilation where the GPU supports it)
  await breathe();
  if (renderer.compileAsync) await renderer.compileAsync(scene, camera).catch(() => {});

  // first frame, then hand over to the loop
  renderFrame(reduceMotion ? 2 : 0.016);
  ready();
  setRunning();

  if (reduceMotion) {
    addEventListener("scroll", () => heroVisible && renderFrame(0), { passive: true });
  }
})();
