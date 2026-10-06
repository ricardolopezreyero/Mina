/* RLR · Ricardo López Reyero — Ritmo de Mina: las canciones y su sonido · mina.capitaltorreon.com/ritmo
   Nueve melodías clásicas, de dominio público (sus autores murieron hace más de cien años), tocadas aquí mismo con un sintetizador hecho
   a mano: marimba para la melodía, campanitas en cada gema, bajo, acordes y una batería sencilla. No se descarga ningún audio.
   De cada canción salen dos cosas con los mismos tiempos: lo que suena (programa) y la partitura que sigue la maquinita (pasos):
   cada nota es una celda con su gema, y trae la hora exacta en que el taladro debe llegar a ella. */
(() => {
  'use strict';
  const _RLR = 'Ricardo López Reyero', _k = 'EYE', _rev = 181218;
  const N = null;
  // notas: [nota MIDI o silencio, cuántos tiempos dura] · armonia: [desde qué tiempo, nota grave del acorde, 'M' mayor | 'm' menor | '7' séptima]
  // Para agregar una canción basta un renglón aquí: la página, la partitura de la maquinita y el video salen solos.
  const CANCIONES = {
    alegria: { n: 'Himno a la alegría', de: 'Beethoven', bpm: 192, tonica: 0, rej: 1, compas: 4, zona: 300,
      notas: [[76, 1], [76, 1], [77, 1], [79, 1], [79, 1], [77, 1], [76, 1], [74, 1], [72, 1], [72, 1], [74, 1], [76, 1], [76, 1.5], [74, 0.5], [74, 2],
        [76, 1], [76, 1], [77, 1], [79, 1], [79, 1], [77, 1], [76, 1], [74, 1], [72, 1], [72, 1], [74, 1], [76, 1], [74, 1.5], [72, 0.5], [72, 2]],
      armonia: [[0, 48, 'M'], [4, 43, 'M'], [8, 48, 'M'], [12, 48, 'M'], [13.5, 43, 'M'], [16, 48, 'M'], [20, 43, 'M'], [24, 48, 'M'], [28, 43, '7'], [29.5, 48, 'M']] },
    cancan: { n: 'Can-can', de: 'Offenbach', bpm: 176, tonica: 0, rej: 0.5, compas: 2, zona: 2600,
      notas: ((tema) => [...tema, ...tema.slice(-13).map(([m, d]) => [m + 12, d])])([[60, 2], [62, 0.5], [65, 0.5], [64, 0.5], [62, 0.5], [67, 1], [67, 1], [67, 0.5], [69, 0.5], [64, 0.5], [65, 0.5], [62, 1], [62, 1],
        [62, 0.5], [65, 0.5], [64, 0.5], [62, 0.5], [60, 0.5], [72, 0.5], [71, 0.5], [69, 0.5], [67, 0.5], [65, 0.5], [64, 0.5], [62, 0.5], [60, 2]]),      // el tema completo y, de remate, sus últimos cuatro compases una octava arriba
      armonia: [[0, 48, 'M'], [2, 43, '7'], [4, 48, 'M'], [6, 48, 'M'], [8, 43, 'M'], [10, 43, '7'], [12, 48, 'M'], [14, 43, '7'], [16, 48, 'M'], [18, 43, '7'], [20, 48, 'M'], [22, 43, '7'], [24, 48, 'M']] },
    serenata: { n: 'Pequeña serenata nocturna', de: 'Mozart', bpm: 144, tonica: 7, rej: 0.5, compas: 4, zona: 4600,
      notas: [[67, 1], [N, 0.5], [62, 0.5], [67, 1], [N, 0.5], [62, 0.5], [67, 0.5], [62, 0.5], [67, 0.5], [71, 0.5], [74, 1], [N, 1],
        [72, 1], [N, 0.5], [69, 0.5], [72, 1], [N, 0.5], [69, 0.5], [72, 0.5], [69, 0.5], [66, 0.5], [69, 0.5], [62, 1], [N, 1],
        [67, 0.5], [71, 0.5], [74, 0.5], [79, 0.5], [83, 0.5], [79, 0.5], [74, 0.5], [71, 0.5], [79, 1], [74, 1], [79, 2]],      // los dos últimos compases son un remate nuestro: el arpegio de sol
      armonia: [[0, 43, 'M'], [8, 38, '7'], [16, 43, 'M'], [20, 43, 'M']] },
    // ── las seis que siguen: ana = tiempos de anacrusa (lo que suena antes del primer tiempo fuerte) · ancho = celdas por renglón · lugar = en cuál lugar sale su toma fija
    turca: { n: 'Marcha turca', de: 'Mozart', bpm: 132, tonica: 0, rej: 0.5, compas: 2, ana: 1, lugar: 3,      // en la menor: las gemas se cuentan desde do, su relativo mayor
      notas: [[71, 0.25], [69, 0.25], [68, 0.25], [69, 0.25], [72, 0.5], [N, 0.5], [74, 0.25], [72, 0.25], [71, 0.25], [72, 0.25], [76, 0.5], [N, 0.5], [77, 0.25], [76, 0.25], [75, 0.25], [76, 0.25],
        [83, 0.25], [81, 0.25], [80, 0.25], [81, 0.25], [83, 0.25], [81, 0.25], [80, 0.25], [81, 0.25], [84, 1], [81, 0.5], [84, 0.5],
        [83, 0.5], [81, 0.5], [79, 0.5], [81, 0.5], [83, 0.5], [81, 0.5], [79, 0.5], [81, 0.5], [83, 0.5], [81, 0.5], [79, 0.5], [78, 0.5], [76, 1]],
      armonia: [[0, 45, 'm'], [9, 52, 'm'], [13, 47, '7'], [15, 52, 'm']] },
    tell: { n: 'Guillermo Tell', de: 'Rossini', bpm: 152, tonica: 0, rej: 0.5, compas: 2, ana: 0.5, lugar: 2,
      notas: ((a, b) => [...a, ...b, ...a, [72, 0.25], [76, 0.25], [79, 1], [77, 0.5], [76, 0.5], [74, 0.5], [72, 0.5], [76, 0.5], [72, 1]])(
        [[67, 0.25], [67, 0.25], [67, 0.5], [67, 0.25], [67, 0.25], [67, 0.5], [67, 0.25], [67, 0.25], [72, 0.5], [74, 0.5], [76, 0.5]],
        [[67, 0.25], [67, 0.25], [67, 0.5], [67, 0.25], [67, 0.25], [72, 0.5], [76, 0.25], [76, 0.25], [74, 0.5], [71, 0.5], [67, 0.5]]),
      armonia: [[0, 48, 'M'], [6.5, 43, 'M'], [8, 48, 'M'], [13.5, 43, '7'], [15, 48, 'M']] },
    primavera: { n: 'La primavera', de: 'Vivaldi', bpm: 126, tonica: 4, rej: 0.5, compas: 4, ana: 0.5, lugar: 0,
      notas: ((a) => [[76, 0.5], ...a, ...a, [80, 0.5], [81, 0.25], [83, 0.25], [81, 0.5], [80, 0.5], [78, 0.5], [75, 0.5], [71, 0.5], [76, 0.5],
        [83, 0.5], [81, 0.25], [80, 0.25], [81, 0.5], [83, 0.5], [85, 1], [83, 0.5], [76, 0.5], [81, 0.5], [80, 0.5], [78, 0.5], [76, 0.5], [78, 1], [76, 1]])(
        [[80, 0.5], [80, 0.5], [80, 0.5], [78, 0.25], [76, 0.25], [83, 1.5], [83, 0.25], [81, 0.25]]),
      armonia: [[0, 52, 'M'], [11, 47, 'M'], [12, 52, 'M'], [14.5, 45, 'M'], [15.5, 52, 'M'], [16.5, 45, 'M'], [18.5, 47, '7'], [19.5, 52, 'M']] },
    minueto: { n: 'Minueto en sol', de: 'Bach (Petzold)', bpm: 152, tonica: 7, rej: 0.5, compas: 3, ancho: 3, lugar: 1,      // compases 1 a 4 y 13 a 16: la primera frase y el cierre de la segunda
      notas: [[74, 1], [67, 0.5], [69, 0.5], [71, 0.5], [72, 0.5], [74, 1], [67, 1], [67, 1], [76, 1], [72, 0.5], [74, 0.5], [76, 0.5], [78, 0.5], [79, 1], [67, 1], [67, 1],
        [72, 1], [74, 0.5], [72, 0.5], [71, 0.5], [69, 0.5], [71, 1], [72, 0.5], [71, 0.5], [69, 0.5], [67, 0.5], [69, 1], [71, 0.5], [69, 0.5], [67, 0.5], [66, 0.5], [67, 2]],
      armonia: [[0, 43, 'M'], [6, 48, 'M'], [9, 43, 'M'], [12, 45, 'm'], [15, 43, 'M'], [18, 50, '7'], [21, 43, 'M']] },
    gruta: { n: 'En la gruta del rey de la montaña', de: 'Grieg', bpm: 192, tonica: 2, rej: 0.5, compas: 4, lugar: 4,      // en si menor (gemas desde re); dos vueltas, la segunda una octava arriba y cerrando en si
      notas: ((v) => [...v, [69, 2], ...v.map(([m, d]) => [m + 12, d]), [83, 2]])([[59, 0.5], [61, 0.5], [62, 0.5], [64, 0.5], [66, 0.5], [62, 0.5], [66, 1], [65, 0.5], [61, 0.5], [65, 1], [64, 0.5], [60, 0.5], [64, 1],
        [59, 0.5], [61, 0.5], [62, 0.5], [64, 0.5], [66, 0.5], [62, 0.5], [66, 0.5], [71, 0.5], [69, 0.5], [66, 0.5], [62, 0.5], [66, 0.5]]),
      armonia: [[0, 47, 'm'], [4, 54, 'M'], [6, 48, 'M'], [8, 47, 'm'], [12, 50, 'M'], [16, 47, 'm'], [20, 54, 'M'], [22, 48, 'M'], [24, 47, 'm'], [28, 50, 'M'], [30, 47, 'm']] },
    jesus: { n: 'Jesús, alegría de los hombres', de: 'Bach', bpm: 240, tonica: 7, rej: 1, compas: 3, ana: 2, ancho: 3, lugar: 3,      // cada nota es un tiempo (van de tres en tres); la última baja a sol para cerrar
      notas: [67, 69, 71, 74, 72, 72, 76, 74, 74, 79, 78, 79, 74, 71, 67, 69, 71, 72, 74, 76, 74, 72, 71, 69, 71, 67, 66, 67, 69].map((m) => [m, 1]).concat([[67, 2]]),
      armonia: [[0, 43, 'M'], [5, 48, 'M'], [8, 50, 'M'], [11, 43, 'M'], [17, 48, 'M'], [20, 43, 'M'], [23, 50, '7'], [29, 43, 'M']] },
    // ── versiones completas. bpm puede ser un mapa [[tiempo, bpm], …] (acelera o frena de un punto al otro) · crece: empieza quedito y va sumando
    // batería y volumen · doblaDesde: desde ese tiempo la melodía suena también una octava arriba.
    grutaCompleta: (() => {      // la pieza entera como la armó Grieg: el tema 18 veces (tres ciclos de si, si, fa♯, fa♯, si, si), cada vez más rápido y más fuerte
      const A = [[59, 0.5], [61, 0.5], [62, 0.5], [64, 0.5], [66, 0.5], [62, 0.5], [66, 1], [65, 0.5], [61, 0.5], [65, 1], [64, 0.5], [60, 0.5], [64, 1],
        [59, 0.5], [61, 0.5], [62, 0.5], [64, 0.5], [66, 0.5], [62, 0.5], [66, 0.5], [71, 0.5], [69, 0.5], [66, 0.5], [62, 0.5], [66, 0.5], [69, 2]];
      const B = [[66, 0.5], [68, 0.5], [70, 0.5], [71, 0.5], [73, 0.5], [70, 0.5], [73, 1], [74, 0.5], [70, 0.5], [74, 1], [73, 0.5], [70, 0.5], [73, 1],
        [66, 0.5], [68, 0.5], [70, 0.5], [71, 0.5], [73, 0.5], [70, 0.5], [73, 1], [74, 0.5], [70, 0.5], [74, 1], [73, 2]];
      const ciclo = (o) => [A, A, B, B, A, A].flatMap((f) => f.map(([m, d]) => [m + o, d]));
      const coda = [[83, 1], [N, 1], [83, 1], [N, 1], [86, 1], [N, 1], [86, 1], [N, 1], [71, 0.5], [73, 0.5], [74, 0.5], [76, 0.5], [78, 0.5], [79, 0.5], [82, 0.5], [N, 0.5], [83, 2]];      // el final es un arreglo nuestro: golpes, una escala que sube corriendo y el último si
      return { n: 'En la gruta del rey de la montaña', de: 'Grieg', completa: true, bpm: [[0, 138], [96, 160], [192, 200], [288, 270]], tonica: 2, rej: 0.5, compas: 4, lugar: 4, crece: true, doblaDesde: 192,
        notas: [...ciclo(0), ...ciclo(12), ...ciclo(12), ...coda],
        armonia: [...Array.from({ length: 18 }, (_, k) => [k * 16, 'AABBAA'[k % 6] === 'A' ? 47 : 54, 'p']), [288, 47, 'm']] };      // 'p': quintas sin tercera, el bajo de pedal del original
    })(),
    jesusCompleta: (() => {      // el tema entero (los ocho compases), tres veces: como empieza, una octava arriba y de regreso con la octava doblada; frena al final
      const R = [N, 67, 69, 71, 74, 72, 72, 76, 74, 74, 79, 78, 79, 74, 71, 67, 69, 71, 72, 74, 76, 74, 72, 71, 69, 71, 67, 66, 67, 69, 62, 66, 69, 72, 71, 69,
        71, 67, 69, 71, 74, 72, 72, 76, 74, 74, 79, 78, 79, 74, 71, 67, 69, 71, 76, 74, 72, 71, 69, 67, 62, 67, 66, 67, 71, 74, 79, 74, 71];
      const pasada = (o, fin) => [...R.map((m) => [m === N ? N : m + o, 1]), [67 + o, fin]];
      const acordes = [[2, 43, 'M'], [5, 48, 'M'], [8, 50, 'M'], [11, 43, 'M'], [17, 48, 'M'], [20, 43, 'M'], [23, 50, '7'], [26, 50, 'M'], [32, 50, '7'], [35, 43, 'M'], [41, 48, 'M'], [44, 50, 'M'], [47, 43, 'M'], [53, 48, 'M'], [56, 43, 'M'], [59, 50, '7'], [62, 43, 'M']];
      return { n: 'Jesús, alegría de los hombres', de: 'Bach', completa: true, bpm: [[0, 236], [206, 236], [215, 150]], tonica: 7, rej: 1, compas: 3, ana: 2, ancho: 3, lugar: 3, doblaDesde: 143,
        notas: [...pasada(0, 3).slice(1), ...pasada(12, 3), ...pasada(0, 4)],
        armonia: [0, 72, 144].flatMap((d, k) => acordes.map(([t, r, c], i) => [k === 0 && i === 0 ? 0 : t + d, r, c])) };
    })(),
  };
  // qué gema le toca a cada grado de la escala: la misma nota, siempre la misma gema (do rubí, re topacio, mi oro, fa esmeralda, sol aguamarina, la zafiro, si amatista)
  const GEMA = { 0: 7, 2: 14, 4: 3, 5: 6, 7: 10, 9: 11, 11: 16 }, ENTRADA = 0.85, COLA = 0.9;
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  // De tiempos a segundos. Con un bpm fijo es una multiplicación; con un mapa de bpm se va sumando de dieciseisavo en dieciseisavo.
  function relojDe(bpm) {
    if (typeof bpm === 'number') return (b) => b * 60 / bpm;
    const paso = 1 / 16, acum = [0], en = (b) => { let i = 0; while (i < bpm.length - 2 && b >= bpm[i + 1][0]) i++; const [b0, v0] = bpm[i], [b1, v1] = bpm[i + 1]; return v0 + (v1 - v0) * Math.max(0, Math.min(1, (b - b0) / (b1 - b0))); };
    for (let k = 1, n = (bpm[bpm.length - 1][0] + 64) / paso; k <= n; k++) acum.push(acum[k - 1] + paso * 60 / en((k - 0.5) * paso));
    return (b) => { const x = Math.max(0, b) / paso, i = Math.min(acum.length - 2, Math.floor(x)); return acum[i] + (acum[i + 1] - acum[i]) * (x - i); };
  }
  function compilar(clave) {
    const C = CANCIONES[clave], T = relojDe(C.bpm), pasos = [], notas = []; let b = 0;
    for (const [m, d] of C.notas) {
      if (m !== null) notas.push({ t: ENTRADA + T(b), m, d: T(b + d) - T(b), x: C.doblaDesde !== undefined && b >= C.doblaDesde });
      pasos.push({ t: ENTRADA + T(b), g: m === null ? -1 : GEMA[(((m - C.tonica) % 12) + 12) % 12] ?? 8 });
      for (let k = 1; (k + 1) * C.rej <= d + 1e-6; k++) pasos.push({ t: ENTRADA + T(b + k * C.rej), g: -1 });      // lo que dura de más una nota, y los silencios, son celdas de pura tierra: el taladro no para
      b += d;
    }
    pasos.sort((x, y) => x.t - y.t); while (pasos[pasos.length - 1].g < 0) pasos.pop();      // la última celda es la última nota: ahí remata
    return { clave, ...C, T, seg: T(1), tiempos: b, pasos, notasT: notas, fin: ENTRADA + T(b), dura: +(ENTRADA + T(b) + COLA).toFixed(2), d0: T(C.rej) };
  }
  // ── el sonido ──
  function ruidoDe(ctx) { if (!ctx.__ruido) { const n = ctx.sampleRate, b = ctx.createBuffer(1, n, n), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; ctx.__ruido = b; } return ctx.__ruido; }
  function tono(ctx, sal, f, t, dur, tipo, vol, ataque = 0.004) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = tipo; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + ataque); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(sal); o.start(t); o.stop(t + dur + 0.03); }
  function golpe(ctx, sal, t, dur, vol, tipoF, fc, q = 0.8) { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = ruidoDe(ctx); s.loop = true; f.type = tipoF; f.frequency.value = fc; f.Q.value = q; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(f); f.connect(g); g.connect(sal); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.03); }
  function bombo(ctx, sal, t, vol) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(44, t + 0.11); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2); o.connect(g); g.connect(sal); o.start(t); o.stop(t + 0.23); }
  // Programa la canción a partir de t0 (segundos del reloj del audio). sal: a dónde suena. Las cortas quedan programadas de una vez;
  // las largas se van programando tres segundos por delante, para no cargar miles de sonidos de golpe.
  function programa(ctx, sal, K, t0) {
    const mezcla = ctx.createGain(), aprieta = ctx.createDynamicsCompressor(), tope = ctx.createGain(); mezcla.gain.value = 1; tope.gain.value = 1.4;
    aprieta.threshold.value = -24; aprieta.knee.value = 12; aprieta.ratio.value = 7; aprieta.attack.value = 0.002; aprieta.release.value = 0.12; mezcla.connect(aprieta); aprieta.connect(tope); tope.connect(sal);      // apretado, para que suene parejo y fuerte en el teléfono sin tronar
    const ev = [], pon = (t, fn) => ev.push([Math.max(0.005, t), fn]);       // cada sonido: a qué segundo de la canción va y cómo se hace
    for (const n of K.notasT) pon(n.t, (t) => {            // la melodía: marimba (cuerpo y un armónico que se apaga pronto) y una campanita una octava arriba
      const f = hz(n.m), largo = Math.min(1.1, Math.max(0.32, n.d * 1.25));
      tono(ctx, mezcla, f, t, largo, 'sine', 0.36); tono(ctx, mezcla, f, t, largo * 0.8, 'triangle', 0.13); tono(ctx, mezcla, f * 4, t, 0.11, 'sine', 0.085); tono(ctx, mezcla, f * 2, t, largo * 0.55, 'sine', 0.06);
      if (n.x) { tono(ctx, mezcla, f * 2, t, largo * 0.8, 'sine', 0.17); tono(ctx, mezcla, f * 2, t, largo * 0.6, 'triangle', 0.06); }
    });
    const acorde = (b) => { let a = K.armonia[0]; for (const x of K.armonia) if (x[0] <= b + 1e-6) a = x; return a; };
    const ana = K.ana || 0;
    for (let b = ana; b < K.tiempos - 1e-6; b += 0.5) {       // el acompañamiento, de medio tiempo en medio tiempo, desde el primer tiempo fuerte
      const s = K.T(b + 1) - K.T(b), [, raiz, clase] = acorde(b), p = b - ana, entero = Math.abs(p - Math.round(p)) < 1e-6, n = Math.round(p), fuerte = entero && n % K.compas === 0, par = entero && n % 2 === 0;
      const tres = clase === '7' ? [4, 7, 10] : clase === 'm' ? [3, 7, 12] : clase === 'p' ? [7, 12, 19] : [4, 7, 12], va = K.crece ? b / K.tiempos : 1;      // va: qué tan avanzada va una canción que crece
      if (K.compas === 3) {                                  // de tres en tres: bajo en el primero y acordes en los otros dos
        if (entero) pon(ENTRADA + K.T(b), (t) => {
          if (fuerte) { tono(ctx, mezcla, hz(raiz), t, s * 2.2, 'triangle', 0.3, 0.008); bombo(ctx, mezcla, t, 0.36); } else for (const i of tres) tono(ctx, mezcla, hz(raiz + 12 + i), t, s * 0.6, 'triangle', 0.045, 0.006);
          golpe(ctx, mezcla, t, 0.035, fuerte ? 0.05 : 0.08, 'highpass', 7500);
        });
        continue;
      }
      pon(ENTRADA + K.T(b), (t) => {
        if (entero) { tono(ctx, mezcla, hz(raiz + (par ? 0 : 7) - (K.compas === 2 && !par ? 12 : 0)), t, s * 0.9, 'triangle', 0.3, 0.008); if (va >= 1 / 3 && (fuerte || K.compas === 2 || par || va >= 2 / 3 && K.crece)) bombo(ctx, mezcla, t, fuerte ? 0.5 : 0.32); }
        else { for (const i of tres) tono(ctx, mezcla, hz(raiz + 12 + i), t, s * 0.38, 'triangle', K.crece ? 0.025 + 0.04 * va : 0.05, 0.006); }      // el «chan» de los acordes, a contratiempo
        golpe(ctx, mezcla, t, 0.035, entero ? 0.05 : 0.09, 'highpass', 7500);                       // platillito
        if (entero && va >= 2 / 3 && (K.compas === 2 ? !par : n % 4 === 1 || n % 4 === 3)) golpe(ctx, mezcla, t, 0.11, 0.2, 'bandpass', 1900, 0.7);      // palmada
      });
    }
    for (const k of [2, 1]) pon(ENTRADA - k * Math.min(K.seg, 0.36), (t) => golpe(ctx, mezcla, t, 0.03, 0.22, 'bandpass', 2600, 3));      // dos baquetazos de entrada
    pon(K.fin - K.notasT[K.notasT.length - 1].d, (t) => {        // el remate, con la última nota: platillo y acorde
      golpe(ctx, mezcla, t, 1.3, 0.16, 'highpass', 5200); const u = K.armonia[K.armonia.length - 1]; for (const i of [0, u[2] === 'm' ? 3 : 4, 7, 12]) tono(ctx, mezcla, hz(u[1] + 12 + i), t, 1.2, 'triangle', 0.07, 0.01);
    });
    if (K.crece) { mezcla.gain.setValueAtTime(0.45, t0); mezcla.gain.linearRampToValueAtTime(1, t0 + ENTRADA + K.T(K.tiempos * 0.82)); }      // de quedito a todo
    ev.sort((x, y) => x[0] - y[0]);
    const seguido = K.dura <= 20 || (typeof OfflineAudioContext !== 'undefined' && ctx instanceof OfflineAudioContext); let i = 0, id = 0;
    const empuja = () => { const hasta = seguido ? Infinity : ctx.currentTime - t0 + 3; while (i < ev.length && ev[i][0] < hasta) { const [t, fn] = ev[i++]; if (seguido || t0 + t > ctx.currentTime - 0.03) fn(t0 + t); } if (i >= ev.length && id) { clearInterval(id); id = 0; } };
    empuja(); if (i < ev.length) id = setInterval(empuja, 300);
    return { para() { if (id) clearInterval(id); id = 0; try { tope.disconnect(); } catch {} } };
  }
  window.RitmoMina = { CANCIONES, compilar, programa };
})();
