/* RLR · Ricardo López Reyero — Ritmo de Mina: las canciones y su sonido · mina.capitaltorreon.com/ritmo
   Tres melodías clásicas, de dominio público (sus autores murieron hace más de cien años), tocadas aquí mismo con un sintetizador hecho
   a mano: marimba para la melodía, campanitas en cada gema, bajo, acordes y una batería sencilla. No se descarga ningún audio.
   De cada canción salen dos cosas con los mismos tiempos: lo que suena (programa) y la partitura que sigue la maquinita (pasos):
   cada nota es una celda con su gema, y trae la hora exacta en que el taladro debe llegar a ella. */
(() => {
  'use strict';
  const _RLR = 'Ricardo López Reyero', _k = 'EYE', _rev = 181218;
  const N = null;
  // notas: [nota MIDI o silencio, cuántos tiempos dura] · armonia: [desde qué tiempo, nota grave del acorde, 'M' mayor | '7' séptima]
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
  };
  // qué gema le toca a cada grado de la escala: la misma nota, siempre la misma gema (do rubí, re topacio, mi oro, fa esmeralda, sol aguamarina, la zafiro, si amatista)
  const GEMA = { 0: 7, 2: 14, 4: 3, 5: 6, 7: 10, 9: 11, 11: 16 }, ENTRADA = 0.85, COLA = 0.9;
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function compilar(clave) {
    const C = CANCIONES[clave], seg = 60 / C.bpm, pasos = [], notas = []; let b = 0;
    for (const [m, d] of C.notas) {
      if (m !== null) notas.push({ t: ENTRADA + b * seg, m, d: d * seg });
      pasos.push({ t: ENTRADA + b * seg, g: m === null ? -1 : GEMA[(((m - C.tonica) % 12) + 12) % 12] ?? 8 });
      for (let k = 1; (k + 1) * C.rej <= d + 1e-6; k++) pasos.push({ t: ENTRADA + (b + k * C.rej) * seg, g: -1 });      // lo que dura de más una nota, y los silencios, son celdas de pura tierra: el taladro no para
      b += d;
    }
    pasos.sort((x, y) => x.t - y.t); while (pasos[pasos.length - 1].g < 0) pasos.pop();      // la última celda es la última nota: ahí remata
    return { clave, ...C, seg, tiempos: b, pasos, notasT: notas, fin: ENTRADA + b * seg, dura: +(ENTRADA + b * seg + COLA).toFixed(2), d0: C.rej * seg };
  }
  // ── el sonido ──
  function ruidoDe(ctx) { if (!ctx.__ruido) { const n = ctx.sampleRate, b = ctx.createBuffer(1, n, n), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; ctx.__ruido = b; } return ctx.__ruido; }
  function tono(ctx, sal, f, t, dur, tipo, vol, ataque = 0.004) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = tipo; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + ataque); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(sal); o.start(t); o.stop(t + dur + 0.03); }
  function golpe(ctx, sal, t, dur, vol, tipoF, fc, q = 0.8) { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = ruidoDe(ctx); s.loop = true; f.type = tipoF; f.frequency.value = fc; f.Q.value = q; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(f); f.connect(g); g.connect(sal); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.03); }
  function bombo(ctx, sal, t, vol) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(44, t + 0.11); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2); o.connect(g); g.connect(sal); o.start(t); o.stop(t + 0.23); }
  // Deja programada la canción completa a partir de t0 (segundos del reloj del audio). sal: a dónde suena.
  function programa(ctx, sal, K, t0) {
    const mezcla = ctx.createGain(), aprieta = ctx.createDynamicsCompressor(), tope = ctx.createGain(); mezcla.gain.value = 1; tope.gain.value = 1.5;
    aprieta.threshold.value = -24; aprieta.knee.value = 12; aprieta.ratio.value = 7; aprieta.attack.value = 0.002; aprieta.release.value = 0.12; mezcla.connect(aprieta); aprieta.connect(tope); tope.connect(sal);      // apretado, para que suene parejo y fuerte en el teléfono sin tronar
    const s = K.seg;
    for (const n of K.notasT) {            // la melodía: marimba (cuerpo y un armónico que se apaga pronto) y una campanita una octava arriba
      const f = hz(n.m), t = t0 + n.t, largo = Math.min(1.1, Math.max(0.32, n.d * 1.25));
      tono(ctx, mezcla, f, t, largo, 'sine', 0.36); tono(ctx, mezcla, f, t, largo * 0.8, 'triangle', 0.13); tono(ctx, mezcla, f * 4, t, 0.11, 'sine', 0.085); tono(ctx, mezcla, f * 2, t, largo * 0.55, 'sine', 0.06);
    }
    const acorde = (b) => { let a = K.armonia[0]; for (const x of K.armonia) if (x[0] <= b + 1e-6) a = x; return a; };
    for (let b = 0; b < K.tiempos - 1e-6; b += 0.5) {       // el acompañamiento, de medio tiempo en medio tiempo
      const t = t0 + ENTRADA + b * s, [, raiz, clase] = acorde(b), entero = Math.abs(b - Math.round(b)) < 1e-6, fuerte = entero && Math.round(b) % K.compas === 0, par = entero && Math.round(b) % 2 === 0;
      if (entero) { tono(ctx, mezcla, hz(raiz + (par ? 0 : 7) - (K.compas === 2 && !par ? 12 : 0)), t, s * 0.9, 'triangle', 0.3, 0.008); if (fuerte || K.compas === 2 || par) bombo(ctx, mezcla, t, fuerte ? 0.5 : 0.32); }
      else { for (const i of clase === '7' ? [4, 7, 10] : [4, 7, 12]) tono(ctx, mezcla, hz(raiz + 12 + i), t, s * 0.38, 'triangle', 0.05, 0.006); }      // el «chan» de los acordes, a contratiempo
      golpe(ctx, mezcla, t, 0.035, entero ? 0.05 : 0.09, 'highpass', 7500);                       // platillito
      if (entero && (K.compas === 2 ? !par : Math.round(b) % 4 === 1 || Math.round(b) % 4 === 3)) golpe(ctx, mezcla, t, 0.11, 0.2, 'bandpass', 1900, 0.7);      // palmada
    }
    for (const k of [2, 1]) golpe(ctx, mezcla, t0 + ENTRADA - k * s, 0.03, 0.22, 'bandpass', 2600, 3);      // dos baquetazos de entrada
    const tf = t0 + K.fin - (K.notasT[K.notasT.length - 1].d);        // el remate, con la última nota: platillo y acorde
    golpe(ctx, mezcla, tf, 1.3, 0.16, 'highpass', 5200); for (const i of [0, 4, 7, 12]) tono(ctx, mezcla, hz(K.armonia[0][1] + 12 + i), tf, 1.2, 'triangle', 0.07, 0.01);
    return { para() { try { tope.disconnect(); } catch {} } };
  }
  window.RitmoMina = { CANCIONES, compilar, programa };
})();
