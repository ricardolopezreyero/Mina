/* RLR · El escaparate 3D de La Pinturería — Ricardo López Reyero · mina.capitaltorreon.com
   La maquinita en volumen, con Three.js (servido desde aquí mismo, para que funcione sin internet): carrocería, cabina de
   vidrio, orugas con ruedas, taladro con rosca, dos hélices plegables, faro, calcomanía, placa con nombre y mascota.
   Gira sola despacio y se arrastra con el dedo o el ratón. Dos botones prenden lo que la maquinita sabe hacer:
   el taladro (gira, saca chispas, las orugas avanzan) y las hélices (se abren, giran y la maquinita se eleva). */
(() => {
  'use strict';
  const _RLR = 'Ricardo López Reyero', _k = 'EYE', _rev = 181218;
  let T = null, renderer = null, scene = null, camera = null, raf = 0, grupo = null, clave = '', piezas = {}, estado = { taladro: 0, helices: 0 }, giro = 0, giroObj = 0, arrastre = null, tArrastre = 0, reloj = 0, ult = 0, cont = null, chispas = null, polvo = null, estelaP = null;
  const col = (c) => new T.Color(c);
  const mezcla = (c, k) => { const x = col(c); const o = k < 0 ? new T.Color(0) : new T.Color(1, 1, 1); return x.lerp(o, Math.abs(k)); };

  // ── materiales
  const laca = (c, fuerte) => new T.MeshPhysicalMaterial({ color: col(c), metalness: 0.25, roughness: fuerte ? 0.3 : 0.5, clearcoat: fuerte ? 0.9 : 0.3, clearcoatRoughness: 0.2 });
  const metal = (c = '#8d949b', r = 0.35) => new T.MeshStandardMaterial({ color: col(c), metalness: 0.9, roughness: r });
  const goma = (c = '#2b2b2b') => new T.MeshStandardMaterial({ color: col(c), metalness: 0.05, roughness: 0.95 });
  const vidrio = () => new T.MeshPhysicalMaterial({ color: col('#bfe9ff'), metalness: 0, roughness: 0.08, transmission: 0.55, transparent: true, opacity: 0.75, clearcoat: 1 });

  // ── geometrías de ayuda
  function cajaRedonda(w, h, d, r) {
    const f = new T.Shape(); const x = -w / 2, y = -h / 2;
    f.moveTo(x + r, y); f.lineTo(x + w - r, y); f.quadraticCurveTo(x + w, y, x + w, y + r); f.lineTo(x + w, y + h - r); f.quadraticCurveTo(x + w, y + h, x + w - r, y + h); f.lineTo(x + r, y + h); f.quadraticCurveTo(x, y + h, x, y + h - r); f.lineTo(x, y + r); f.quadraticCurveTo(x, y, x + r, y);
    const g = new T.ExtrudeGeometry(f, { depth: d - r * 1.2, bevelEnabled: true, bevelThickness: r * 0.6, bevelSize: r * 0.6, bevelSegments: 4, curveSegments: 10 });
    g.center(); return g;
  }
  // la banda de la oruga: un estadio hueco (recto arriba y abajo, redondo en las puntas) extruido; y un punto sobre su perímetro
  const BL = 1.5, BR = 0.26;
  function bandaGeo(d) {
    const f = new T.Shape(); f.absarc(-BL / 2, 0, BR, Math.PI / 2, -Math.PI / 2, false); f.absarc(BL / 2, 0, BR, -Math.PI / 2, Math.PI / 2, false); f.closePath();
    const h = new T.Path(); h.absarc(-BL / 2, 0, BR * 0.72, Math.PI / 2, -Math.PI / 2, false); h.absarc(BL / 2, 0, BR * 0.72, -Math.PI / 2, Math.PI / 2, false); h.closePath(); f.holes.push(h);
    const g = new T.ExtrudeGeometry(f, { depth: d, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2, curveSegments: 28 }); g.center(); return g;
  }
  function puntoBanda(u) {            // u de 0 a 1 por el perímetro: arriba de izquierda a derecha, punta derecha, abajo, punta izquierda
    const P = 2 * BL + 2 * Math.PI * BR, s = ((u % 1) + 1) % 1 * P, r = BR + 0.03;
    if (s < BL) return [-BL / 2 + s, r, 0];
    if (s < BL + Math.PI * BR) { const a = Math.PI / 2 - (s - BL) / BR; return [BL / 2 + Math.cos(a) * r, Math.sin(a) * r, a - Math.PI / 2]; }
    if (s < 2 * BL + Math.PI * BR) return [BL / 2 - (s - BL - Math.PI * BR), -r, Math.PI];
    const a = -Math.PI / 2 - (s - 2 * BL - Math.PI * BR) / BR; return [-BL / 2 + Math.cos(a) * r, Math.sin(a) * r, a - Math.PI / 2];
  }
  const malla = (g, m, x = 0, y = 0, z = 0) => { const o = new T.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o; };

  // ── la maquinita entera
  function construir(P, modelo, nombre, MODELOS, TC) {
    const M = MODELOS[modelo] || MODELOS[0], c1 = P.c1 || M[0], c2 = P.c2 || M[1], c3 = P.c3 || '#3a3a3a', carro = P.carro | 0;
    const g = new T.Group(), cuerpo = new T.Group(); g.add(cuerpo); piezas = { cuerpo, ruedas: [], rotores: [], brazos: [] };
    const mC = laca(c1, !!P.c1), mD = laca(c2, !!P.c2);
    // carrocería
    if (carro === 1) {                                  // El Escarabajo: lomo redondo con raya y lunares
      const lomo = malla(new T.SphereGeometry(1.05, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.52), mC, 0, 0.42, 0); lomo.scale.set(1.15, 0.78, 1); cuerpo.add(lomo);
      cuerpo.add(malla(cajaRedonda(2.3, 0.5, 1.5, 0.12), mD, 0, 0.42, 0));
      cuerpo.add(malla(new T.BoxGeometry(0.04, 0.5, 1.9), mD, 0, 0.95, 0));
      for (const [x, z] of [[-0.55, 0.45], [0.2, 0.6], [0.55, -0.3], [-0.3, -0.55], [0.1, -0.1]]) { const l = malla(new T.SphereGeometry(0.11, 14, 10), mD, x, 1.12 - Math.hypot(x, z) * 0.18, z); cuerpo.add(l); }
      cuerpo.add(malla(new T.CylinderGeometry(0.06, 0.06, 2.5, 12), metal('#e8ecef', 0.15), 0, 0.26, 0.82).rotateZ(Math.PI / 2));
    } else if (carro === 2) {                           // La Locomotora: caja, caldera, chimenea y campana
      cuerpo.add(malla(cajaRedonda(2.3, 0.75, 1.4, 0.08), mC, 0, 0.55, 0));
      const cal = malla(new T.CylinderGeometry(0.42, 0.42, 1.3, 28), mC, 0.45, 0.95, 0); cal.rotation.z = Math.PI / 2; cuerpo.add(cal);
      cuerpo.add(malla(new T.CylinderGeometry(0.44, 0.44, 0.07, 28), metal('#e2b24a', 0.3), 0.25, 0.95, 0).rotateZ(Math.PI / 2));
      cuerpo.add(malla(new T.CylinderGeometry(0.44, 0.44, 0.07, 28), metal('#e2b24a', 0.3), 0.7, 0.95, 0).rotateZ(Math.PI / 2));
      cuerpo.add(malla(new T.CylinderGeometry(0.12, 0.16, 0.5, 16), goma('#2b2b2b'), 0.7, 1.55, 0));
      cuerpo.add(malla(new T.SphereGeometry(0.11, 14, 10), metal('#e2b24a', 0.3), 0.15, 1.46, 0));
      cuerpo.add(malla(new T.BoxGeometry(0.5, 0.5, 1.2), mD, -0.65, 1.05, 0));
    } else if (carro === 3) {                           // El Submarino: cápsula, ojos de buey, periscopio, aleta y hélice
      const cap = malla(new T.CapsuleGeometry(0.62, 1.4, 8, 28), mC, 0, 0.72, 0); cap.rotation.z = Math.PI / 2; cuerpo.add(cap);
      for (const x of [-0.35, 0.25]) { cuerpo.add(malla(new T.TorusGeometry(0.17, 0.045, 10, 24), metal('#e2b24a', 0.3), x, 0.78, 0.6)); cuerpo.add(malla(new T.CircleGeometry(0.15, 20), vidrio(), x, 0.78, 0.62)); }
      cuerpo.add(malla(new T.CylinderGeometry(0.04, 0.04, 0.6, 10), metal(), -0.3, 1.55, 0)); cuerpo.add(malla(new T.BoxGeometry(0.22, 0.07, 0.07), metal(), -0.22, 1.85, 0));
      cuerpo.add(malla(new T.BoxGeometry(0.5, 0.45, 0.05), mD, -0.8, 1.3, 0));
      const hel = new T.Group(); hel.position.set(-1.35, 0.72, 0); for (let k = 0; k < 3; k++) { const b = malla(new T.BoxGeometry(0.04, 0.42, 0.16), metal('#c9ced3', 0.2), 0, 0.2, 0); const p = new T.Group(); p.rotation.x = k * 2.094; p.add(b); hel.add(p); } cuerpo.add(hel); piezas.helSub = hel;
    } else if (carro === 4) {                           // El Tanque: casco angulado, placas, torreta y cañón corto
      const f = new T.Shape(); f.moveTo(-1.25, 0.2); f.lineTo(-1.25, 0.7); f.lineTo(-0.85, 1.05); f.lineTo(0.85, 1.05); f.lineTo(1.25, 0.7); f.lineTo(1.25, 0.2); f.closePath();
      const casco = malla(new T.ExtrudeGeometry(f, { depth: 1.5, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 }), mC, 0, 0, -0.75); cuerpo.add(casco);
      const tor = malla(new T.SphereGeometry(0.45, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), mD, -0.2, 1.05, 0); cuerpo.add(tor);
      cuerpo.add(malla(new T.CylinderGeometry(0.07, 0.08, 0.9, 14), goma('#4a4543'), 0.3, 1.25, 0).rotateZ(Math.PI / 2));
      cuerpo.add(malla(new T.CylinderGeometry(0.012, 0.012, 0.8, 6), metal('#9aa3ab'), -0.6, 1.5, 0.3));
      for (let k = 0; k < 6; k++) for (const z of [0.76, -0.76]) cuerpo.add(malla(new T.SphereGeometry(0.03, 8, 6), mezclaMat(c2, -0.4), -1 + k * 0.4, 0.62, z));
    } else {                                            // de fábrica: caja redondeada con banda
      cuerpo.add(malla(cajaRedonda(2.3, 0.85, 1.5, 0.22), mC, 0, 0.62, 0));
      cuerpo.add(malla(new T.BoxGeometry(2.34, 0.08, 1.54), mD, 0, 0.3, 0));
      if (modelo % 4 === 1) cuerpo.add(malla(new T.BoxGeometry(2.34, 0.06, 1.54), new T.MeshStandardMaterial({ color: col('#ffffff'), roughness: 0.4 }), 0, 0.5, 0));
    }
    // cabina de vidrio con piloto
    if (carro !== 3) { const cab = malla(new T.SphereGeometry(0.42, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2), vidrio(), 0.45, carro === 2 ? 1.42 : carro === 1 ? 0.95 : carro === 4 ? 0.9 : 1.02, 0); cab.scale.set(1, 0.75, 1); cuerpo.add(cab); cuerpo.add(malla(new T.SphereGeometry(0.16, 16, 12), goma('#24323a'), 0.48, (carro === 2 ? 1.42 : carro === 1 ? 0.95 : carro === 4 ? 0.9 : 1.02) + 0.08, 0)); }
    // orugas: dos bandas con sus ruedas
    for (const z of [0.66, -0.66]) {
      const banda = malla(bandaGeo(0.3), goma(c3 === '#3a3a3a' ? '#2b2b2b' : mezcla(c3, -0.35).getStyle()), 0, 0.26, z); cuerpo.add(banda);
      for (const x of [-0.72, -0.24, 0.24, 0.72]) { const r = malla(new T.CylinderGeometry(0.16, 0.16, 0.2, 22), metal(P.c3 ? c3 : '#c9ced3', 0.3), x, 0.26, z); r.rotation.x = Math.PI / 2; cuerpo.add(r); piezas.ruedas.push(r); const eje = malla(new T.CylinderGeometry(0.05, 0.05, 0.24, 10), goma('#1b1b1b'), x, 0.26, z); eje.rotation.x = Math.PI / 2; cuerpo.add(eje); }
      for (const x of [-0.75, 0.75]) { const r = malla(new T.CylinderGeometry(0.19, 0.19, 0.18, 22), metal('#6f777e', 0.4), x, 0.26, z); r.rotation.x = Math.PI / 2; cuerpo.add(r); piezas.ruedas.push(r); }
      for (let k = 0; k < 26; k++) { const b = malla(new T.BoxGeometry(0.08, 0.05, 0.36), goma('#1b1b1b'), 0, 0.26, z); b.userData.u = k / 26; b.userData.z = z; cuerpo.add(b); (piezas.tacos = piezas.tacos || []).push(b); }
    }
    // el taladro, al frente, mirando un poco hacia abajo
    const tal = new T.Group(); tal.position.set(1.15, 0.5, 0); tal.rotation.z = -0.35;
    const broca = new T.Group(); broca.add(malla(new T.ConeGeometry(0.26, 0.95, 24), metal('#aeb6bd', 0.25), 0, 0.47, 0));
    for (let k = 0; k < 5; k++) { const r = malla(new T.TorusGeometry(0.25 - k * 0.045, 0.03, 8, 24), metal('#6f777e', 0.35), 0, 0.12 + k * 0.17, 0); r.rotation.x = Math.PI / 2; r.rotation.z = k * 0.5; broca.add(r); }
    broca.rotation.z = -Math.PI / 2; tal.add(broca); piezas.broca = broca;
    tal.add(malla(new T.CylinderGeometry(0.14, 0.14, 0.3, 16), goma('#4a4543'), -0.12, 0, 0).rotateZ(Math.PI / 2));
    cuerpo.add(tal); piezas.taladro = tal;
    // las hélices: dos mástiles con sus rotores, plegados cuando no se usan
    for (const x of [-0.55, 0.45]) {
      const brazo = new T.Group(); brazo.position.set(x, carro === 2 ? 1.1 : carro === 3 ? 1.3 : 1.0, 0);
      brazo.add(malla(new T.CylinderGeometry(0.035, 0.045, 0.55, 10), metal('#9aa3ab'), 0, 0.27, 0));
      const rotor = new T.Group(); rotor.position.y = 0.56; rotor.add(malla(new T.SphereGeometry(0.07, 12, 8), metal('#e2b24a', 0.3)));
      for (const a of [0, Math.PI / 2]) { const pala = malla(new T.BoxGeometry(0.95, 0.018, 0.1), new T.MeshStandardMaterial({ color: col('#dfe6ea'), metalness: 0.3, roughness: 0.4, transparent: true }), 0, 0, 0); pala.rotation.y = a; rotor.add(pala); }
      brazo.add(rotor); brazo.rotation.z = 0; cuerpo.add(brazo); piezas.rotores.push(rotor); piezas.brazos.push(brazo);
    }
    // el faro y su luz
    const luzCol = P.luz || '#fff3b0'; const faro = malla(new T.SphereGeometry(0.1, 14, 10), new T.MeshStandardMaterial({ color: col(luzCol), emissive: col(luzCol), emissiveIntensity: P.luz ? 2 : 0.6 }), 1.17, 0.78, 0); cuerpo.add(faro);
    if (P.luz) { const sp = new T.SpotLight(col(luzCol), 6, 6, 0.6, 0.5, 1); sp.position.set(1.2, 0.78, 0); const obj = new T.Object3D(); obj.position.set(4, -0.6, 0); cuerpo.add(obj); sp.target = obj; cuerpo.add(sp); const piso = new T.PointLight(col(luzCol), 2, 2.5); piso.position.set(0, 0.15, 0); cuerpo.add(piso); }
    // calcomanía: troquelada en blanco, en el costado que mira a la cámara
    if (P.calca !== undefined && TC.CALCAS_TODAS[P.calca]) { const c = document.createElement('canvas'); c.width = c.height = 128; const q = c.getContext('2d'); q.fillStyle = '#fff'; q.beginPath(); q.roundRect(6, 6, 116, 116, 26); q.fill(); q.font = '72px system-ui,"Apple Color Emoji","Segoe UI Emoji"'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(TC.CALCAS_TODAS[P.calca], 64, 70); const tx = new T.CanvasTexture(c); tx.colorSpace = T.SRGBColorSpace; const d = new T.Mesh(new T.PlaneGeometry(0.5, 0.5), new T.MeshStandardMaterial({ map: tx, transparent: true, roughness: 0.6 })); d.position.set(-0.45, 0.72, carro === 3 ? 0.63 : 0.78); d.rotation.z = -0.1; cuerpo.add(d); }
    // la placa con el nombre (dibujada por el juego, como en el mundo) y la mascota, como letreros que siempre miran a la cámara
    piezas.letrero = letrero(nombre, P, modelo); piezas.letrero.position.set(0, carro === 2 ? 2.45 : 2.2, 0); g.add(piezas.letrero);
    if (P.mascota) { piezas.mascota = { k: P.mascota, c: document.createElement('canvas'), s: null }; piezas.mascota.c.width = piezas.mascota.c.height = 160; const tx = new T.CanvasTexture(piezas.mascota.c); tx.colorSpace = T.SRGBColorSpace; piezas.mascota.tx = tx; const s = new T.Sprite(new T.SpriteMaterial({ map: tx, transparent: true })); s.scale.set(1.1, 1.1, 1); s.position.set(-1.7, P.mascota === 2 || P.mascota === 6 ? 0.45 : 1.4, 0.3); g.add(s); piezas.mascota.s = s; }
    piezas.estela = P.estela | 0; piezas.c1 = c1;
    return g;
  }
  function mezclaMat(c, k) { return new T.MeshStandardMaterial({ color: mezcla(c, k), metalness: 0.4, roughness: 0.5 }); }
  // el letrero: el nombre con su título y su placa, exactamente como lo dibuja el juego (dibMaq, recortado a la franja de arriba)
  function letrero(nombre, P, modelo) {
    const c = document.createElement('canvas'); c.width = 720; c.height = 272; const q = c.getContext('2d');      // 272 de alto: con 220 el nombre salía cortado por abajo
    if (window.dibMaq) { q.save(); q.beginPath(); q.rect(0, 0, 720, 272); q.clip(); window.dibMaq(q, 360, 420, 300, modelo, 1, false, 0, nombre, '', 0, { ...P, mascota: 0, cu: 0 }); q.restore(); }
    const tx = new T.CanvasTexture(c); tx.colorSpace = T.SRGBColorSpace; const s = new T.Sprite(new T.SpriteMaterial({ map: tx, transparent: true })); s.scale.set(2.7, 1.02, 1); return s;
  }
  // chispas del taladro, polvo de las hélices y la estela
  function particulas(n, color, tam) { const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(new Float32Array(n * 3), 3)); const m = new T.PointsMaterial({ color: col(color), size: tam, transparent: true, opacity: 0.9, depthWrite: false }); const p = new T.Points(geo, m); p.userData.v = new Float32Array(n * 3); p.userData.t = new Float32Array(n); return p; }
  function moverParticulas(p, d, nace, grav) {
    const pos = p.geometry.attributes.position.array, v = p.userData.v, t = p.userData.t, n = t.length;
    for (let i = 0; i < n; i++) { t[i] -= d; if (t[i] <= 0) { if (nace) { const [x, y, z, vx, vy, vz, vida] = nace(); pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; v[i * 3] = vx; v[i * 3 + 1] = vy; v[i * 3 + 2] = vz; t[i] = vida; } else { pos[i * 3 + 1] = -99; continue; } } v[i * 3 + 1] -= grav * d; pos[i * 3] += v[i * 3] * d; pos[i * 3 + 1] += v[i * 3 + 1] * d; pos[i * 3 + 2] += v[i * 3 + 2] * d; }
    p.geometry.attributes.position.needsUpdate = true;
  }

  // ── montar, actualizar, animar
  function montar(contenedor) {
    T = window.THREE; if (!T) return false;
    cont = contenedor;
    if (!renderer) {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
      scene = new T.Scene();
      camera = new T.PerspectiveCamera(33, 1, 0.1, 50); camera.position.set(3.7, 2.3, 4.1); camera.lookAt(0, 1.22, 0);      // encuadre con aire arriba: el letrero del nombre sale completo
      scene.add(new T.HemisphereLight(0xdfefff, 0x6b4a33, 0.9));
      const sol = new T.DirectionalLight(0xfff1d6, 1.8); sol.position.set(3, 6, 4); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024); sol.shadow.camera.near = 1; sol.shadow.camera.far = 20; for (const k of ['left', 'bottom']) sol.shadow.camera[k] = -4; for (const k of ['right', 'top']) sol.shadow.camera[k] = 4; sol.shadow.bias = -0.0005; scene.add(sol);
      const relleno = new T.PointLight(0xffd9a0, 0.6, 12); relleno.position.set(-4, 2, -2); scene.add(relleno);
      const tarima = new T.Mesh(new T.CylinderGeometry(2.1, 2.2, 0.18, 48), new T.MeshStandardMaterial({ color: col('#8a6448'), roughness: 0.8 })); tarima.position.y = -0.09; tarima.receiveShadow = true; scene.add(tarima);
      const aro = new T.Mesh(new T.TorusGeometry(2.1, 0.03, 8, 64), metal('#e2b24a', 0.3)); aro.rotation.x = Math.PI / 2; aro.position.y = 0.005; scene.add(aro);
      const piso = new T.Mesh(new T.CircleGeometry(6, 48), new T.ShadowMaterial({ opacity: 0.35 })); piso.rotation.x = -Math.PI / 2; piso.position.y = -0.18; piso.receiveShadow = true; scene.add(piso);
      chispas = particulas(60, '#ffd23f', 0.07); scene.add(chispas); polvo = particulas(80, '#c8a27c', 0.14); scene.add(polvo); estelaP = particulas(70, '#ffffff', 0.12); scene.add(estelaP);
      const el = renderer.domElement; el.style.cssText = 'width:100%;height:auto;display:block;border-radius:8px;touch-action:none;cursor:grab';
      el.addEventListener('pointerdown', (e) => { arrastre = { x: e.clientX, g: giroObj }; el.setPointerCapture(e.pointerId); el.style.cursor = 'grabbing'; });
      el.addEventListener('pointermove', (e) => { if (!arrastre) return; giroObj = arrastre.g + (e.clientX - arrastre.x) * 0.012; tArrastre = performance.now(); });
      const suelta = () => { arrastre = null; el.style.cursor = 'grab'; }; el.addEventListener('pointerup', suelta); el.addEventListener('pointercancel', suelta);
    }
    const lienzo = cont.querySelector('canvas'); if (lienzo && lienzo !== renderer.domElement) lienzo.replaceWith(renderer.domElement); else if (!lienzo) cont.prepend(renderer.domElement);
    medir(); if (!raf) { ult = performance.now(); raf = requestAnimationFrame(cuadro); }
    return true;
  }
  function medir() { const w = Math.max(200, cont.clientWidth || 420), h = Math.round(w * 1.05); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  function actualizar(P, modelo, nombre, MODELOS, TC) {
    if (!T || !scene) return;
    const k = JSON.stringify([P, modelo, nombre]); if (k === clave) return; clave = k;
    if (grupo) { scene.remove(grupo); grupo.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.map) o.material.map.dispose(); if (o.material) o.material.dispose(); }); }
    grupo = construir(P, modelo, nombre, MODELOS, TC); grupo.rotation.y = giroObj; scene.add(grupo);
  }
  function set(que, v) { estado[que] = v ? 1 : 0; }
  function cuadro(ahora) {
    raf = requestAnimationFrame(cuadro);
    if (!cont || !cont.isConnected) { destruirLoop(); return; }
    const d = Math.min(0.05, (ahora - ult) / 1000); ult = ahora; reloj += d;
    if (!arrastre && ahora - tArrastre > 2500) giroObj += d * 0.35;
    if (grupo) {
      grupo.rotation.y = giroObj;
      const tal = estado.taladro, hel = estado.helices;
      if (piezas.broca) piezas.broca.rotation.y += d * (tal ? 22 : 0); if (piezas.taladro) piezas.taladro.rotation.z += ((tal ? -0.75 : -0.35) - piezas.taladro.rotation.z) * Math.min(1, d * 5);
      for (const r of piezas.ruedas) r.rotation.z -= d * (tal ? 3 : hel ? 0.6 : 0.25);
      if (piezas.tacos) for (const b of piezas.tacos) { b.userData.u += d * (tal ? 0.35 : hel ? 0.08 : 0.03); const [x, y, a] = puntoBanda(b.userData.u); b.position.set(x, 0.26 + y, b.userData.z); b.rotation.z = a; }
      const abre = hel ? 1 : 0; for (const b of piezas.brazos) b.scale.y += (abre ? 1 : 0.55) - b.scale.y > 0 ? Math.min(d * 2, (abre ? 1 : 0.55) - b.scale.y) : Math.max(-d * 2, (abre ? 1 : 0.55) - b.scale.y);
      for (const r of piezas.rotores) { r.rotation.y += d * (hel ? 40 : 0.4); for (const p of r.children) if (p.material && p.material.transparent) p.material.opacity = hel ? 0.45 : 1; }
      if (piezas.helSub) piezas.helSub.rotation.x += d * (tal || hel ? 12 : 1.5);
      const alto = hel ? 0.55 + Math.sin(reloj * 2.2) * 0.06 : 0; piezas.cuerpo.position.y += (alto - piezas.cuerpo.position.y) * Math.min(1, d * 3); piezas.cuerpo.rotation.z = hel ? Math.sin(reloj * 1.7) * 0.03 : tal ? Math.sin(reloj * 40) * 0.006 : 0;
      if (piezas.letrero) piezas.letrero.position.y = (piezas.letrero.userData.y0 || (piezas.letrero.userData.y0 = piezas.letrero.position.y)) + piezas.cuerpo.position.y;
      if (piezas.mascota) { const m = piezas.mascota, q = m.c.getContext('2d'); q.clearRect(0, 0, 160, 160); if (window.dibMascota) window.dibMascota(q, m.k, 80, 80, 150, 1, reloj + 3); m.tx.needsUpdate = true; m.s.position.x = -1.7 + Math.sin(reloj * 0.9) * 0.15; m.s.position.y = (m.k === 2 || m.k === 6 ? 0.45 : 1.4) + piezas.cuerpo.position.y * 0.6; }
      // chispas al taladrar, polvo al elevarse, la estela al volar
      const rot = grupo.rotation.y, punta = new T.Vector3(1.95, 0.2 + piezas.cuerpo.position.y, 0).applyAxisAngle(new T.Vector3(0, 1, 0), rot);
      moverParticulas(chispas, d, tal ? () => [punta.x, punta.y, punta.z, (Math.random() - 0.5) * 2.5, Math.random() * 2.5 + 0.5, (Math.random() - 0.5) * 2.5, 0.25 + Math.random() * 0.3] : null, 9);
      moverParticulas(polvo, d, hel ? () => { const a = Math.random() * 6.28, r = 0.6 + Math.random() * 0.3; return [Math.cos(a) * r, 0.02, Math.sin(a) * r, Math.cos(a) * 1.6, 0.3 + Math.random() * 0.4, Math.sin(a) * 1.6, 0.5 + Math.random() * 0.5]; } : null, 0.2);
      if (estelaP.material.color.getHexString() !== estelaColor(piezas.estela, reloj)) estelaP.material.color.set(estelaColor(piezas.estela, reloj));
      const cola = new T.Vector3(-1.2, 0.5 + piezas.cuerpo.position.y, 0).applyAxisAngle(new T.Vector3(0, 1, 0), rot);
      moverParticulas(estelaP, d, hel && piezas.estela ? () => [cola.x + (Math.random() - 0.5) * 0.3, cola.y + (Math.random() - 0.5) * 0.3, cola.z + (Math.random() - 0.5) * 0.3, -Math.cos(rot) * 1.2, piezas.estela === 5 ? 0.8 : -0.3, Math.sin(rot) * 1.2, 0.6 + Math.random() * 0.6] : null, piezas.estela === 5 ? -0.6 : 0.8);
    }
    renderer.render(scene, camera);
  }
  function estelaColor(t, r) { return ['ffffff', 'ffd23f', 'hsl', 'ffffff', 'ff5e9a', 'c8ebff', 'ff8a3a', 'ffb7d5'][t] === 'hsl' ? new T.Color(`hsl(${Math.floor((r * 90) % 360)},95%,62%)`).getHexString() : ['ffffff', 'ffd23f', 'ffffff', 'ffffff', 'ff5e9a', 'c8ebff', 'ff8a3a', 'ffb7d5'][t] || 'ffffff'; }
  function destruirLoop() { cancelAnimationFrame(raf); raf = 0; }
  function destruir() { destruirLoop(); cont = null; }
  window.Escaparate = { montar, actualizar, set, destruir, estado, medir };
})();
