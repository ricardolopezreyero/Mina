// ─────────────────────────────────────────────────────────────────────────────
// Mina · el mundo compartido — Ricardo López Reyero (RLR)
// Un Durable Object por mundo: es la única verdad sobre el terreno cavado y
// sobre quién está jugando. El terreno no se guarda: se calcula con la semilla;
// aquí solo vive un bit por celda cavada (60 KB para los 10 km de profundidad).
// ─────────────────────────────────────────────────────────────────────────────
import { DurableObject } from "cloudflare:workers";

const _RLR = "Ricardo López Reyero";
const _k = "EYE", _rev = 181218; // RLR · sello de autoría

const W = 96, H = 5000, BYTES = (W * H) / 8;
const ZX0 = 39, ZX1 = 68;            // suelo firme bajo los edificios (filas 0 y 1)
const ALFA = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // sin 0/O ni 1/I
const MAX_CONECTADOS = 10, MAX_MAQUINITAS = 30;
const DIA = 86400000, CADUCA = 180 * DIA;
const MUNDOS_POR_DIA = 20;

const CFG_BASE = {
  modo: "clasico", comb: 1, caida: 1, lava: 1, gas: 1, verGas: 2,
  pierde: 2, rescates: 3, nombre: "", puerta: 0, reminTodos: 1, regalos: 1, pleitos: 1,
};

const json = (o, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });

// Mandar nunca debe tumbar al mundo: un socket que se está cerrando solo devuelve false.
const crudo = (o) => typeof o === "string" || o instanceof ArrayBuffer || ArrayBuffer.isView(o);
const manda = (ws, o) => { try { ws.send(crudo(o) ? o : JSON.stringify(o)); return true; } catch { return false; } };

const entero = (v, min, max, def) => {
  v = Math.floor(Number(v));
  return Number.isFinite(v) && v >= min && v <= max ? v : def;
};
const limpio = (s, n) =>
  String(s ?? "").replace(/[\u0000-\u001f<>&"'`\\]/g, "").replace(/\s+/g, " ").trim().slice(0, n);

function nuevoId() {
  const b = crypto.getRandomValues(new Uint8Array(8));
  let s = "";
  for (const x of b) s += ALFA[x & 31];
  return s;
}

function cfgLimpia(c, antes) {
  c = c || {};
  const modo = ["paseo", "clasico", "rudo", "medida"].includes(c.modo) ? c.modo : antes.modo;
  return {
    modo,
    comb: entero(c.comb, 0, 1, antes.comb),
    caida: entero(c.caida, 0, 2, antes.caida),
    lava: entero(c.lava, 0, 2, antes.lava),
    gas: entero(c.gas, 0, 2, antes.gas),
    verGas: entero(c.verGas, 0, 2, antes.verGas),
    pierde: entero(c.pierde, 0, 3, antes.pierde),
    rescates: entero(c.rescates, -1, 3, antes.rescates),
    nombre: limpio(c.nombre, 24) || antes.nombre,
    puerta: entero(c.puerta, 0, 1, antes.puerta),
    reminTodos: entero(c.reminTodos, 0, 1, antes.reminTodos),
    regalos: entero(c.regalos, 0, 1, antes.regalos),
    pleitos: entero(c.pleitos, 0, 1, antes.pleitos ?? 1),
  };
}

// RLR · la maquinita
// Cada maquinita es de su dueño y vive aquí, fuera de los mundos: entra a cualquiera con todo lo que
// trae y sobrevive aunque un mundo se borre. Solo puede estar en un mundo a la vez.
export class Maquina extends DurableObject {
  async entrar({ mundo, k, n, mo, est }) {
    let m = await this.ctx.storage.get("m");
    if (!m) {
      if (!n) return null;                                   // todavía no existe: hay que bautizarla
      m = { n, mo: mo || 0, est: est || null, v: (est && est.v) || 0, alta: Date.now() };
    } else if (m.mundo && m.mundo !== mundo) {
      // Estaba en otro mundo: aquel la suelta y entrega lo último que supo de ella.
      try {
        const r = await this.env.MUNDO.get(this.env.MUNDO.idFromName(m.mundo)).soltar(k);
        if (r && r.est && (r.est.v || 0) >= (m.v || 0)) { m.est = r.est; m.v = r.est.v || 0; }
      } catch {}
    }
    m.mundo = mundo; m.vista = Date.now();
    await this.ctx.storage.put("m", m);
    return { n: m.n, mo: m.mo, est: m.est };
  }

  // Rebautizar: el nombre y el modelo son de la maquinita, no del mundo.
  async renombrar(n, mo) {
    const m = await this.ctx.storage.get("m");
    if (!m) return false;
    m.n = n; m.mo = mo;
    await this.ctx.storage.put("m", m);
    return true;
  }

  // Nunca se pisa un estado nuevo con uno viejo, ni se acepta el de un mundo donde ya no está.
  async guardar(est, mundo) {
    const m = await this.ctx.storage.get("m");
    if (!m || !est || typeof est !== "object") return false;
    if (m.mundo && mundo && m.mundo !== mundo) return false;
    if ((est.v || 0) < (m.v || 0)) return false;
    m.est = est; m.v = est.v || 0; m.vista = Date.now();
    await this.ctx.storage.put("m", m);
    return true;
  }
}

// RLR · el mundo
export class Mundo extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.m = null;          // meta del mundo (null = sin leer, false = no existe)
    this.dug = null;        // bits de celdas cavadas
    this.jug = [];          // maquinitas registradas
    this.pos = new Map();   // última posición conocida de cada conectado
    this.sucio = { meta: false, dug: false, jug: new Set(), maq: new Set() };
    this.maqT = new Map();    // cuándo se guardó por última vez cada maquinita en su propio objeto
    this.creados = new Map(); // portero: mundos creados hoy por visitante (solo en memoria)
    this.fotoT = new Map();   // cuándo subió cada quien su última imagen de liga
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("p", "q"));
  }

  // ── Portero: tope de mundos nuevos por visitante al día (no guarda nada en disco)
  async permiso(quien) {
    const hoy = Math.floor(Date.now() / DIA);
    if (this.hoy !== hoy) { this.hoy = hoy; this.creados.clear(); }
    const n = (this.creados.get(quien) || 0) + 1;
    this.creados.set(quien, n);
    return n <= MUNDOS_POR_DIA;
  }

  // Un mundo nuevo. Con «base» (un archivo guardado) nace con esa semilla, esas reglas, esos túneles y esa colección.
  async crear(id, base) {
    if (await this.ctx.storage.get("meta")) return false;
    const seed = base ? base.seed : crypto.getRandomValues(new Uint32Array(1))[0];
    const dueno = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
    const meta = { seed, remin: 0, reminAt: 0, cfg: { ...CFG_BASE }, creado: Date.now(), visto: Date.now(), n: 0, dueno, creador: -1, id };
    const dug = new Uint8Array(BYTES);
    if (base) { meta.remin = base.remin; meta.cfg = cfgLimpia(base.cfg, CFG_BASE); meta.col = base.col; dug.set(base.dug.subarray(0, BYTES)); }
    await this.ctx.storage.put({ meta, dug });
    await this.ctx.storage.setAlarm(Date.now() + DIA);   // si nadie llega a bautizarse, se borra en un día
    this.m = null;
    return dueno;
  }

  async cargar() {
    if (this.m !== null) return this.m;
    const meta = await this.ctx.storage.get("meta");
    if (!meta) { this.m = false; return false; }
    const dug = await this.ctx.storage.get("dug");
    // Los mundos de cuando el fondo estaba a 1 km guardaban menos celdas: se conserva lo cavado y se agranda.
    if (dug instanceof Uint8Array && dug.length === BYTES) this.dug = dug;
    else { this.dug = new Uint8Array(BYTES); if (dug instanceof Uint8Array) this.dug.set(dug.subarray(0, BYTES)); }
    this.jug = [];
    const lista = await this.ctx.storage.list({ prefix: "j:" });
    for (const [k, v] of lista) this.jug[Number(k.slice(2))] = v;
    this.m = meta;
    return meta;
  }

  conectados() {
    const s = new Set();
    for (const ws of this.ctx.getWebSockets()) {
      const a = ws.deserializeAttachment();
      if (a) s.add(a.i);
    }
    return s;
  }

  // Para la vista previa de la liga: cómo se llama el mundo y cuántas maquinitas tiene.
  // Con «j» (el número de una maquinita) devuelve también su ficha: la liga de un jugador presume lo suyo.
  async ficha(j) {
    const m = await this.cargar();
    if (!m) return null;
    const p = Number.isInteger(j) && this.jug[j] ? this.jug[j] : null;
    let rec = 0; for (const x of this.jug) if (x && (x.rec || 0) > rec) rec = x.rec;
    return { n: m.cfg.nombre || "", j: this.jug.filter(Boolean).length, og: m.og || 0, rec, col: (m.col || []).length,
      p: p ? { n: p.n, rec: p.rec || 0, tot: p.tot || 0, og: p.og || 0 } : null };
  }

  // La imagen de la liga (JPEG que dibujó el juego): la del mundo, o la de una maquinita.
  async imagen(j) {
    if (!(await this.cargar())) return null;
    return (await this.ctx.storage.get(j === null ? "og:m" : "og:j:" + j)) || null;
  }

  // Mundos anteriores a la llave de dueño: el creador es la primera maquinita.
  creador() { const m = this.m; return m.dueno ? m.creador : 0; }

  publico(i, on) {
    const j = this.jug[i];
    return { i, n: j.n, m: j.m, rec: j.rec || 0, tot: j.tot || 0, on: on ? 1 : 0 };
  }

  difundir(msg, menos) {
    const s = crudo(msg) ? msg : JSON.stringify(msg);
    for (const ws of this.ctx.getWebSockets()) {
      if (ws === menos || !ws.deserializeAttachment()) continue;
      manda(ws, s);
    }
  }

  socketDe(i) {
    for (const ws of this.ctx.getWebSockets()) {
      const a = ws.deserializeAttachment();
      if (a && a.i === i) return ws;
    }
    return null;
  }

  async programar() {
    const m = this.m;
    if (!m) return;
    let cuando = Math.max(Date.now() + 3600000, this.jug.length ? m.visto + CADUCA : m.creado + DIA);
    // Lo cavado se guarda en 2 s como mucho; lo demás puede esperar 5. Si el mundo se reinicia antes, los navegadores lo vuelven a mandar al reconectar.
    if (this.sucio.meta || this.sucio.dug || this.sucio.jug.size || this.sucio.maq.size) cuando = Math.min(cuando, Date.now() + (this.sucio.dug ? 2000 : 5000));
    if (m.reminAt) cuando = Math.min(cuando, m.reminAt);
    const actual = await this.ctx.storage.getAlarm();
    if (actual === null || cuando < actual || actual < Date.now()) await this.ctx.storage.setAlarm(cuando);
  }

  // Guardado por lotes: una fila por cosa que cambió, nunca una por celda.
  maquina(k) { return this.env.MAQUINA.get(this.env.MAQUINA.idFromName(k)); }

  // La maquinita se guarda en su propio objeto cada 15 s como mucho, y siempre al salir.
  async guardarMaquinas(ya) {
    const ahora = Date.now();
    for (const i of [...this.sucio.maq]) {
      const j = this.jug[i];
      if (!j || !j.est) { this.sucio.maq.delete(i); continue; }
      if (!ya && ahora - (this.maqT.get(i) || 0) < 15000) continue;
      this.sucio.maq.delete(i); this.maqT.set(i, ahora);
      try { await this.maquina(j.k).guardar(j.est, this.m.id); } catch { this.sucio.maq.add(i); }
    }
  }

  // Otro mundo recibió a esta maquinita: aquí se le suelta y se entrega lo último que se supo.
  async soltar(k) {
    if (!(await this.cargar())) return null;
    const i = this.jug.findIndex((j) => j && j.k === k);
    if (i < 0) return null;
    const ws = this.socketDe(i);
    if (ws) { manda(ws, '{"t":"otra"}'); ws.serializeAttachment(null); try { ws.close(4000, "otra"); } catch {} this.pos.delete(i); this.difundir({ t: "sale", i }); }
    this.sucio.maq.delete(i);
    return { est: this.jug[i].est || null };
  }

  async guardar() {
    const o = {};
    if (this.sucio.meta) o.meta = this.m;
    if (this.sucio.dug) o.dug = this.dug;
    for (const i of this.sucio.jug) o["j:" + i] = this.jug[i];
    this.sucio = { meta: false, dug: false, jug: new Set(), maq: this.sucio.maq };
    if (Object.keys(o).length) await this.ctx.storage.put(o);
    await this.guardarMaquinas(false);
  }

  async fetch(request) {
    const id = new URL(request.url).pathname.split("/").pop();
    if (/^[2-9A-HJ-NP-Z]{8}$/.test(id)) this.idVisto = id;        // mundos anteriores no guardaban su propio nombre
    if (request.headers.get("Upgrade") !== "websocket") return new Response("Se esperaba websocket", { status: 426 });
    const [cliente, servidor] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(servidor);
    return new Response(null, { status: 101, webSocket: cliente });
  }

  // RLR · mensajes del juego
  async webSocketMessage(ws, msg) {
    const m = await this.cargar();
    const att = ws.deserializeAttachment();

    // Posición: 6 bytes binarios → se reenvía con el número de maquinita (7 bytes)
    if (typeof msg !== "string") {
      if (!att) return;
      // Imagen de la liga: 2 = la del mundo, 3 = la de esta maquinita. Solo JPEG, con tope de peso y de frecuencia.
      if (msg.byteLength > 8) {
        const f = new Uint8Array(msg), yo = m && this.jug[att.i];
        if (!yo || (f[0] !== 2 && f[0] !== 3) || f.length < 2000 || f.length > 300000 || f[1] !== 0xff || f[2] !== 0xd8 || f[3] !== 0xff) return;
        const llave = att.i + ":" + f[0], ahora = Date.now();
        if (ahora - (this.fotoT.get(llave) || 0) < 12000) return;
        this.fotoT.set(llave, ahora);
        await this.ctx.storage.put(f[0] === 2 ? "og:m" : "og:j:" + att.i, f.slice(1));
        if (f[0] === 2) { m.og = (m.og || 0) + 1; this.sucio.meta = true; } else { yo.og = (yo.og || 0) + 1; this.sucio.jug.add(att.i); }
        await this.programar();
        return;
      }
      if (msg.byteLength !== 8) return;
      const e = new Uint8Array(msg), s = new Uint8Array(9);
      s[0] = 1; s[1] = att.i; s.set(e.subarray(1), 2);
      this.pos.set(att.i, s);
      this.difundir(s, ws);
      return;
    }
    if (msg.length > 24000) return;
    let d;
    try { d = JSON.parse(msg); } catch { return; }
    if (!d || typeof d.t !== "string") return;

    if (d.t === "hola") return this.hola(ws, d);
    if (!m || !att) return;
    const i = att.i, yo = this.jug[i];
    if (!yo) return;

    switch (d.t) {
      case "cava": {
        if (!Array.isArray(d.c) || d.c.length > 30) return;
        const si = [], no = [];
        for (const c of d.c) {
          const idx = entero(c, 0, W * H - 1, -1);
          if (idx < 0) continue;
          const x = idx % W, y = (idx - x) / W;
          const firme = y < 2 && x >= ZX0 && x <= ZX1;
          if (firme || (this.dug[idx >> 3] & (1 << (idx & 7)))) { no.push(idx); continue; }
          this.dug[idx >> 3] |= 1 << (idx & 7);
          si.push(idx);
        }
        if (si.length) { this.sucio.dug = true; this.difundir({ t: "cava", i, c: si }, ws); }
        if (no.length) manda(ws, { t: "no", c: no });
        break;
      }
      case "est": {
        if (!d.e || typeof d.e !== "object") return;
        yo.est = d.e;
        this.sucio.maq.add(i);
        const rec = entero(d.rec, 0, H * 2, yo.rec || 0), tot = Number.isFinite(d.tot) && d.tot >= 0 ? d.tot : yo.tot || 0;
        if (rec !== yo.rec || tot !== yo.tot) {
          yo.rec = rec; yo.tot = tot;
          this.difundir({ t: "j", i, rec, tot }, ws);
        }
        this.sucio.jug.add(i);
        break;
      }
      case "golpe": {            // un pleito: se le avisa a la maquinita alcanzada; ella calcula su daño
        if (m.cfg.pleitos === 0) return;
        const otro = this.socketDe(entero(d.a, 0, MAX_MAQUINITAS, -1));
        if (otro && otro !== ws) manda(otro, { t: "golpe", i, q: entero(d.q, 1, 1000, 20), k: entero(d.k, 0, 3, 0), v: d.v ? 1 : 0 });
        return;
      }
      case "nombre": {           // rebautizar la maquinita o cambiarle el modelo
        const n = limpio(d.n, 14), mo = entero(d.m, 0, 7, yo.m);
        if (n.length < 2 || (n === yo.n && mo === yo.m)) return;
        try { if (!(await this.maquina(yo.k).renombrar(n, mo))) return; } catch { return; }
        yo.n = n; yo.m = mo;
        this.sucio.jug.add(i);
        this.difundir({ t: "nom", i, n, m: mo });
        break;
      }
      case "aviso":
        this.difundir({ t: "aviso", i, x: limpio(d.x, 90) }, ws);
        return;
      case "senal":
        this.difundir({ t: "senal", i, x: Number(d.x) || 0, y: Number(d.y) || 0 }, ws);
        return;
      case "fuel": {
        const otro = this.socketDe(entero(d.a, 0, MAX_MAQUINITAS, -1)), q = entero(d.q, 1, 50, 5);
        if (!otro || otro === ws || !manda(otro, { t: "fuel", i, q })) manda(ws, { t: "devuelve", fuel: q });
        return;
      }
      case "regalo": {
        const q = Number(d.q) > 0 ? Math.floor(Number(d.q)) : 0;
        const otro = m.cfg.regalos ? this.socketDe(entero(d.a, 0, MAX_MAQUINITAS, -1)) : null;
        if (!otro || otro === ws || !q || !manda(otro, { t: "regalo", i, q })) manda(ws, { t: "devuelve", d: q });
        return;
      }
      case "col": {              // un objeto de la colección del mundo: es de todos y no se pierde al remineralizar
        const k = entero(d.k, 0, 98, -1);
        if (k < 0) return;
        m.col = m.col || [];
        if (m.col.includes(k)) return;
        m.col.push(k);
        this.sucio.meta = true;
        this.difundir({ t: "col", k, i }, ws);
        break;
      }
      case "cfg":
        if (i !== this.creador()) return;
        m.cfg = cfgLimpia(d.cfg, m.cfg);
        this.sucio.meta = true;
        this.difundir({ t: "cfg", cfg: m.cfg, i });
        break;
      case "remin":
        if (m.reminAt || (!m.cfg.reminTodos && i !== this.creador())) return;
        m.reminAt = Date.now() + 10000;
        await this.ctx.storage.put("meta", m);
        this.difundir({ t: "cuenta", s: 10, i });
        break;
      case "borrar":
        if (i !== this.creador()) return;
        this.difundir({ t: "borrado" });
        for (const s of this.ctx.getWebSockets()) { try { s.close(4001, "borrado"); } catch {} }
        await this.ctx.storage.deleteAlarm();
        await this.ctx.storage.deleteAll();
        this.m = false;
        return;
      default:
        return;
    }
    await this.programar();
  }

  async hola(ws, d) {
    const m = this.m;
    const fin = (o) => { manda(ws, o); try { ws.close(4002, o.t); } catch {} };
    if (!m) return fin({ t: "noexiste" });
    const k = limpio(d.k, 64);
    if (k.length < 16) return fin({ t: "noexiste" });
    let i = this.jug.findIndex((j) => j && j.k === k);
    const previo = ws.deserializeAttachment();
    if (previo && previo.i !== i) { ws.serializeAttachment(null); this.pos.delete(previo.i); this.difundir({ t: "sale", i: previo.i }, ws); }
    // el tope de conectados se revisa antes de registrar a nadie
    if ((i < 0 || !this.conectados().has(i)) && this.conectados().size >= MAX_CONECTADOS) return fin({ t: "lleno" });
    if (!m.id) { m.id = this.idVisto || ""; this.sucio.meta = true; }

    // La maquinita vive en su propio objeto. Si este mundo la conocía de antes (versión anterior), se muda allá.
    const viejo0 = i >= 0 ? this.jug[i] : null, n = limpio(d.n, 14);
    let r = null;
    try {
      r = await this.maquina(k).entrar({ mundo: m.id, k, n: n.length >= 2 ? n : (viejo0 ? viejo0.n : ""), mo: n.length >= 2 ? entero(d.m, 0, 7, 0) : (viejo0 ? viejo0.m : 0), est: viejo0 ? viejo0.est : null });
    } catch { try { ws.close(1011, "reintenta"); } catch {} return; }      // el navegador vuelve a intentar solo
    if (!r) {
      manda(ws, { t: "nuevo", nombre: m.cfg.nombre, puerta: m.cfg.puerta, hay: this.jug.filter(Boolean).length });
      return;
    }
    i = this.jug.findIndex((j) => j && j.k === k);            // se vuelve a buscar: mientras se esperaba pudo entrar alguien más
    let estrena = false;
    if (i < 0) {
      estrena = this.jug.length > 0 && this.jug.length < 10;   // maquinita nueva en un mundo que ya tiene gente: todos ganan
      if (m.cfg.puerta && this.jug.length) return fin({ t: "cerrado" });
      if (this.jug.length >= MAX_MAQUINITAS) return fin({ t: "lleno" });
      i = this.jug.length;
      this.jug[i] = { k, n: r.n, m: r.mo, est: r.est, rec: 0, tot: 0, alta: Date.now() };
      m.n = this.jug.length;
      await this.ctx.storage.put({ ["j:" + i]: this.jug[i], meta: m });
    }
    const yo = this.jug[i];
    yo.n = r.n; yo.m = r.mo; yo.est = r.est;
    if (r.est) { yo.rec = entero(r.est.rec, 0, H * 2, yo.rec || 0); yo.tot = Number.isFinite(r.est.tot) ? Math.floor(r.est.tot) : yo.tot || 0; }
    const on = this.conectados();

    // La misma maquinita en otra pestaña: se queda la más reciente.
    const viejo = this.socketDe(i);
    if (viejo && viejo !== ws) { manda(viejo, '{"t":"otra"}'); viejo.serializeAttachment(null); try { viejo.close(4000, "otra"); } catch {} }

    ws.serializeAttachment({ i });
    on.add(i);
    if (m.dueno && m.creador !== i && d.d === m.dueno) m.creador = i;
    m.visto = Date.now();
    this.sucio.meta = true;

    // Solo viaja hasta la última celda cavada: un mundo nuevo pesa casi nada.
    let hasta = BYTES; while (hasta > 0 && !this.dug[hasta - 1]) hasta--;
    let b = "";
    for (let x = 0; x < hasta; x += 8192) b += String.fromCharCode.apply(null, this.dug.subarray(x, Math.min(hasta, x + 8192)));
    manda(ws, {
      t: "mundo", i, seed: m.seed, remin: m.remin, cfg: m.cfg, creador: i === this.creador() ? 1 : 0,
      est: this.jug[i].est, cuenta: m.reminAt ? Math.max(0, Math.ceil((m.reminAt - Date.now()) / 1000)) : 0,
      jug: this.jug.map((j, x) => (j ? this.publico(x, on.has(x)) : null)).filter(Boolean),
      dug: btoa(b), col: m.col || [],
    });
    for (const [x, s] of this.pos) if (x !== i && on.has(x)) manda(ws, s);
    this.difundir({ t: "entra", j: this.publico(i, true), nuevo: estrena ? 1 : 0 }, ws);
    await this.programar();
  }

  async webSocketClose(ws, code) {
    try { ws.close(code > 1000 && code < 5000 && code !== 1005 && code !== 1006 ? code : 1000); } catch {}
    const att = ws.deserializeAttachment();
    const m = await this.cargar();
    if (!m || !att) return;
    // Si la maquinita ya entró por otra pestaña, este cierre no la saca del mundo.
    const otro = this.ctx.getWebSockets().some((s) => s !== ws && s.deserializeAttachment()?.i === att.i);
    if (!otro) {
      this.pos.delete(att.i);
      this.difundir({ t: "sale", i: att.i }, ws);
    }
    m.visto = Date.now();
    this.sucio.meta = true;
    await this.guardar();
    await this.guardarMaquinas(true);
    await this.programar();
  }

  async webSocketError(ws) { return this.webSocketClose(ws, 1011); }

  async alarm() {
    const m = await this.cargar();
    if (!m) return;
    const ahora = Date.now();
    if (m.reminAt && ahora >= m.reminAt - 50) {
      // Remineralizar: semilla nueva para la capa y se borran los bits de lo cavado.
      m.remin++; m.reminAt = 0;
      this.dug.fill(0);
      this.sucio.meta = this.sucio.dug = true;
      this.difundir({ t: "remin", remin: m.remin });
    }
    await this.guardar();
    const caduco = this.jug.length ? ahora - m.visto >= CADUCA : ahora - m.creado >= DIA;
    if (!this.ctx.getWebSockets().length && caduco) {
      await this.ctx.storage.deleteAll();
      this.m = false;
      return;
    }
    await this.programar();
  }
}

// RLR · puerta de entrada
export default {
  async fetch(request, env) {
    const u = new URL(request.url);

    if (u.pathname === "/api/mundo" && request.method === "POST") {
      const quien = request.headers.get("CF-Connecting-IP") || "local";
      const portero = env.MUNDO.get(env.MUNDO.idFromName("~portero"));
      if (!(await portero.permiso(quien))) return json({ error: "limite" }, 429);
      // Si viene un archivo guardado, se revisa y el mundo nace igual a como se guardó.
      let base = null;
      if ((request.headers.get("content-type") || "").includes("json")) {
        try {
          const a = (await request.json()).archivo;
          if (!a || a.formato !== "mina-mundo" || typeof a.dug !== "string" || a.dug.length > BYTES * 1.4) return json({ error: "archivo" }, 400);
          const bin = atob(a.dug), dug = new Uint8Array(Math.min(BYTES, bin.length));
          for (let k = 0; k < dug.length; k++) dug[k] = bin.charCodeAt(k);
          base = { seed: entero(a.seed, -2147483648, 4294967295, 1), remin: entero(a.remin, 0, 1e9, 0), cfg: a.cfg, col: (Array.isArray(a.col) ? a.col : []).map((k) => entero(k, 0, 98, -1)).filter((k) => k >= 0).slice(0, 99), dug };
        } catch { return json({ error: "archivo" }, 400); }
      }
      for (let n = 0; n < 5; n++) {
        const id = nuevoId();
        const d = await env.MUNDO.get(env.MUNDO.idFromName(id)).crear(id, base);
        if (d) return json({ id, d });
      }
      return json({ error: "reintenta" }, 503);
    }

    // La imagen de la liga: /og/m/ID.jpg es la del mundo; /og/m/ID/3.jpg, la de la maquinita 3. Si aún no hay, va la de todos.
    const og = u.pathname.match(/^\/og\/m\/([2-9A-HJ-NP-Z]{8})(?:\/(\d{1,2}))?\.jpg$/i);
    if (og && request.method === "GET") {
      let f = null;
      try { f = await env.MUNDO.get(env.MUNDO.idFromName(og[1].toUpperCase())).imagen(og[2] === undefined ? null : Number(og[2])); } catch {}
      if (!f) return env.ASSETS.fetch(new Request(new URL("/mina.jpg", request.url), request));
      return new Response(f, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=300" } });
    }

    // La liga de un mundo lleva su nombre, sus hitos y su imagen en la vista previa (WhatsApp, iMessage…): se nota quién invita.
    // Con ?j=3 presume a la maquinita 3 de ese mundo.
    const liga = u.pathname.match(/^\/m\/([2-9A-HJ-NP-Z]{8})\/?$/i);
    if (liga && request.method === "GET") {
      const pagina = await env.ASSETS.fetch(new Request(new URL("/", request.url), request));
      const id = liga[1].toUpperCase(), j = /^\d{1,2}$/.test(u.searchParams.get("j") || "") ? Number(u.searchParams.get("j")) : -1;
      let info = null;
      try { info = await env.MUNDO.get(env.MUNDO.idFromName(id)).ficha(j); } catch {}
      if (!info) return pagina;
      const miles = (n) => Math.round(n).toLocaleString("es-MX"), p = info.p;
      const dinero = (n) => (n >= 1e9 ? (n / 1e9).toFixed(1) + " mil M" : n >= 1e6 ? (n / 1e6).toFixed(1) + " M" : miles(n));
      const mundo = info.n || "Un mundo de Mina";
      const titulo = p ? (p.rec ? p.n + " · " + miles(p.rec) + " m bajo tierra en Mina" : p.n + " te invita a excavar en Mina") : mundo + " · entra a excavar conmigo en Mina";
      const hitos = [info.j > 1 ? info.j + " maquinitas" : "", info.rec ? "ya vamos en " + miles(info.rec) + " m" : "", info.col ? info.col + " de 99 objetos de la colección" : ""].filter(Boolean).join(" · ");
      const texto = p ? (p.tot ? "Lleva $" + dinero(p.tot) + " ganados en " + mundo : "Acaba de abrir " + mundo) + ". Entra y alcánzala: gratis, sin registro, en el mismo mundo."
        : (hitos ? hitos[0].toUpperCase() + hitos.slice(1) + ". " : "") + "Entras y ya estás jugando: un mundo compartido en tiempo real, gratis y sin registro.";
      const base = u.origin + "/og/m/" + id, imagen = p && p.og ? base + "/" + j + ".jpg?v=" + p.og : info.og ? base + ".jpg?v=" + info.og : u.origin + "/mina.jpg";
      const pon = (v) => ({ element(e) { e.setAttribute("content", v); } });
      return new HTMLRewriter()
        .on('meta[property="og:title"]', pon(titulo))
        .on('meta[property="og:description"]', pon(texto))
        .on('meta[property="og:image"]', pon(imagen))
        .on('meta[property="og:url"]', pon(u.origin + "/m/" + id + (p ? "?j=" + j : "")))
        .transform(pagina);
    }

    const ws = u.pathname.match(/^\/ws\/([2-9A-HJ-NP-Z]{8})$/);
    if (ws) return env.MUNDO.get(env.MUNDO.idFromName(ws[1])).fetch(request);

    if (u.pathname.startsWith("/api/") || u.pathname.startsWith("/ws/") || u.pathname.startsWith("/og/")) return json({ error: "no" }, 404);
    return env.ASSETS.fetch(request);
  },
};
