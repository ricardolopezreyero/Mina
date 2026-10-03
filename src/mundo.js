// ─────────────────────────────────────────────────────────────────────────────
// Mina · el mundo compartido — Ricardo López Reyero (RLR)
// Un Durable Object por mundo: es la única verdad sobre el terreno cavado y
// sobre quién está jugando. Aquí vive el mundo entero y para siempre: su terreno
// completo, celda por celda (se fabrica una sola vez, al nacer, y ya no depende de
// que el juego cambie), un bit por celda cavada, sus reglas y su colección.
// Un mundo solo se borra si quien lo creó pide borrarlo.
// ─────────────────────────────────────────────────────────────────────────────
import { DurableObject } from "cloudflare:workers";

const _RLR = "Ricardo López Reyero";
const _k = "EYE", _rev = 181218; // RLR · sello de autoría

const W = 96, H = 5000, BYTES = (W * H) / 8;
const ZX0 = 39, ZX1 = 68;            // suelo firme bajo los edificios (filas 0 y 1)
const ALFA = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // sin 0/O ni 1/I
// Cada maquinita tiene su número en el mundo (el orden en que entró) y con él su color en el chat: hay 100 colores, así que
// caben 100 maquinitas por mundo. A la vez pueden estar conectadas 40.
const MAX_CONECTADOS = 40, MAX_MAQUINITAS = 100;
const CHAT_LARGO = 300, CHAT_GUARDA = 20000;
// El texto del chat: una sola línea, sin caracteres de control ni marcas invisibles que voltean el texto; los emojis pasan enteros.
function textoChat(s) {
  const t = String(s ?? "").replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028-\u202e\u2066-\u2069]/g, " ").replace(/\s+/g, " ").trim();
  return Array.from(t).slice(0, CHAT_LARGO).join("");
}
const DIA = 86400000;
// El terreno completo de un mundo: 4 bytes de encabezado («MN», versión del formato, versión del generador), una celda por
// byte (96 × 5,000) y la posición de los 99 objetos de la colección (4 bytes cada una).
const NCOL = 99, MAPA_BYTES = 4 + W * H + NCOL * 4;
function mapaValido(u) {
  if (!(u instanceof Uint8Array) || u.length !== MAPA_BYTES || u[0] !== 77 || u[1] !== 78) return false;
  for (let i = 4, fin = 4 + W * H; i < fin; i++) if (u[i] > 49 || u[i] === 8) return false;
  const d = new DataView(u.buffer, u.byteOffset + 4 + W * H);
  for (let k = 0; k < NCOL; k++) if (d.getUint32(k * 4, true) >= W * H) return false;
  return true;
}
// La misma huella que calcula el juego: con ella un navegador sabe si el terreno que tiene es el del mundo.
function huellaMapa(u) {
  let a = 0x811c9dc5, b = 0x9e3779b9;
  for (let i = 0; i < u.length; i++) { const v = u[i]; a = Math.imul(a ^ v, 16777619); b = Math.imul(b + v, 0x85ebca6b) ^ (b >>> 13); }
  return (a >>> 0).toString(16).padStart(8, "0") + (b >>> 0).toString(16).padStart(8, "0");
}
const comprimir = async (u) => new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer());
const MUNDOS_POR_DIA = 20;

const CFG_BASE = {
  modo: "clasico", comb: 1, caida: 1, lava: 1, gas: 1, verGas: 2,
  pierde: 2, rescates: 3, nombre: "", puerta: 0, reminTodos: 1, regalos: 1, pleitos: 1, mirar: 1,
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

// Una ficha de 12 letras para mirar un mundo sin conocer su liga: no se deduce del mundo ni lleva a él.
function fichaNueva() {
  const b = crypto.getRandomValues(new Uint8Array(12));
  let s = "";
  for (const x of b) s += ALFA[x & 31];
  return s;
}
// Quien entra se reconoce por una huella de su dirección de internet (nunca se guarda la dirección): así quien creó el mundo
// puede sacar a alguien aunque no tenga maquinita, y que no vuelva a entrar.
async function huellaIp(ip) {
  const h = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("mina-ip:" + (ip || ""))));
  return [...h.subarray(0, 8)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
// La maquinita en la tabla mundial se reconoce por una huella de su llave: la llave nunca sale de aquí.
async function huella(k) {
  const h = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("mina:" + k)));
  return [...h.subarray(0, 8)].map((b) => b.toString(16).padStart(2, "0")).join("");
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
    mirar: entero(c.mirar, 0, 1, antes.mirar ?? 1),
  };
}

// RLR · la tabla mundial
// Un solo objeto para todo el juego. Guarda las 100 maquinitas que más han ganado (se enseñan 33) y el directorio de
// fichas para mirar: ficha → mundo. La liga del mundo nunca sale de aquí hacia quien mira.
const TABLA_MAX = 100, TABLA_VE = 33, VIVO_MS = 60000;
export class Tabla extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.top = null; this.sucio = false; this.fichas = new Set();
  }
  async cargar() { if (!this.top) this.top = (await this.ctx.storage.get("top")) || []; return this.top; }

  async registrar(ver, mundo) {
    if (!ver || !mundo || this.fichas.has(ver)) return;
    if (this.fichas.size > 5000) this.fichas.clear();
    this.fichas.add(ver);
    await this.ctx.storage.put("v:" + ver, mundo);
  }
  async mundoDe(ver) { return (await this.ctx.storage.get("v:" + ver)) || null; }
  async olvidar(ver) { this.fichas.delete(ver); await this.ctx.storage.delete("v:" + ver); }

  // Un mundo avisa cuánto lleva una de sus maquinitas. Devuelve el corte: con menos que eso no hace falta volver a avisar.
  async reportar(r) {
    const top = await this.cargar(), lleno = top.length >= TABLA_MAX, corte = lleno ? top[top.length - 1].tot : 0;
    if (r.ver && r.mundo) await this.registrar(r.ver, r.mundo);
    let e = top.find((x) => x.p === r.p);
    if (!e) {
      if (!(r.tot > 0) || (lleno && r.tot <= corte)) return corte;
      e = { p: r.p }; top.push(e);
    }
    e.n = r.n; e.m = r.m; e.tot = r.tot; e.seg = Math.max(e.seg || 0, r.seg || 0); e.t = r.vivo ? Date.now() : 0; e.ver = r.ver || ""; e.i = r.i;
    top.sort((a, b) => b.tot - a.tot);
    if (top.length > TABLA_MAX) top.length = TABLA_MAX;
    this.sucio = true;
    if ((await this.ctx.storage.getAlarm()) === null) await this.ctx.storage.setAlarm(Date.now() + 5000);
    return top.length >= TABLA_MAX ? top[top.length - 1].tot : 0;
  }
  async lista() {
    const top = await this.cargar(), ahora = Date.now();
    return {
      top: top.slice(0, TABLA_VE).map((e) => { const vivo = ahora - e.t < VIVO_MS; return { p: e.p, n: e.n, m: e.m, tot: e.tot, seg: e.seg || 0, vivo: vivo ? 1 : 0, ver: vivo ? e.ver : "", i: e.i }; }),
      corte: top.length >= TABLA_VE ? top[TABLA_VE - 1].tot : 0,
    };
  }
  async alarm() { if (this.sucio && this.top) { this.sucio = false; await this.ctx.storage.put("top", this.top); } }
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

  // Lo que la cuenta enseña de ella: nombre, modelo, cuánto ha ganado, hasta dónde bajó y cuánto ha jugado.
  async resumen() {
    const m = await this.ctx.storage.get("m");
    if (!m) return null;
    const e = m.est || {};
    return { n: m.n, m: m.mo || 0, tot: Number.isFinite(e.tot) ? Math.floor(e.tot) : 0, rec: entero(e.rec, 0, H * 2, 0), seg: entero(e.seg, 0, 4e9, 0) };
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

// RLR · la cuenta
// Jugar nunca pide nada. Quien quiere guardar su maquinita y sus mundos entra con Google: su correo queda ligado a una sola
// maquinita y a todos los mundos que quiera, y desde cualquier equipo los recupera. Un objeto por persona, nombrado por su
// identificador de Google. La sesión de cada equipo se guarda solo como huella.
const MUNDOS_CUENTA = 500, SESIONES = 20;
const hex = (u) => [...u].map((b) => b.toString(16).padStart(2, "0")).join("");
const sha = async (s) => hex(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("mina-ses:" + s)))).slice(0, 40);
const llaveOk = (k) => typeof k === "string" && /^[0-9a-zA-Z]{16,64}$/.test(k);
const idOk = (id) => typeof id === "string" && /^[2-9A-HJ-NP-Z]{8}$/.test(id);
export class Cuenta extends DurableObject {
  // Junta lo que trae este equipo con lo guardado: de cada mundo gana lo más reciente, y uno desechado no revive
  // salvo que se vuelva a entrar a él después.
  juntar(c, mundos, duenos, quitar) {
    const fuera = c.fuera || {}, ahora = Date.now();
    for (const id of Array.isArray(quitar) ? quitar.slice(0, MUNDOS_CUENTA) : []) if (idOk(id)) fuera[id] = ahora;
    const l = new Map((c.mundos || []).map((x) => [x.id, x]));
    for (const x of Array.isArray(mundos) ? mundos.slice(0, MUNDOS_CUENTA) : []) {
      if (!x || !idOk(x.id)) continue;
      const m = { id: x.id, nombre: limpio(x.nombre, 24) || "Mundo " + x.id, maq: limpio(x.maq, 14), modelo: entero(x.modelo, 0, 7, 0), creador: x.creador ? 1 : 0, ult: entero(x.ult, 0, 9e15, 0) };
      const a = l.get(m.id);
      if (!a || m.ult >= a.ult) l.set(m.id, { ...m, creador: m.creador || (a ? a.creador : 0) });
    }
    for (const [id, t] of Object.entries(fuera)) { const x = l.get(id); if (x && x.ult <= t) l.delete(id); else if (x) delete fuera[id]; }
    c.mundos = [...l.values()].sort((a, b) => b.ult - a.ult).slice(0, MUNDOS_CUENTA);
    c.fuera = Object.fromEntries(Object.entries(fuera).sort((a, b) => b[1] - a[1]).slice(0, MUNDOS_CUENTA));
    c.duenos = c.duenos || {};
    for (const [id, d] of Object.entries(duenos && typeof duenos === "object" ? duenos : {}).slice(0, MUNDOS_CUENTA)) if (idOk(id) && /^[0-9a-f]{32}$/.test(d)) c.duenos[id] = d;
  }
  vista(c) { return { k: c.k, email: c.email, nombre: c.nombre, foto: c.foto, mundos: c.mundos, duenos: c.duenos }; }
  async sesion(t) {
    const c = await this.ctx.storage.get("c");
    return c && t && (c.ses || []).includes(await sha(t)) ? c : null;
  }
  // Entró con Google: si la cuenta es nueva, su maquinita es la de este equipo; si ya existía, la cuenta conserva la suya.
  async entrar(g, d) {
    let c = await this.ctx.storage.get("c");
    const nueva = !c;
    if (!c) c = { sub: g.sub, k: "", mundos: [], duenos: {}, fuera: {}, ses: [], alta: Date.now() };
    if (!c.k && llaveOk(d.k)) c.k = d.k;
    c.email = g.email; c.nombre = g.nombre; c.foto = g.foto; c.visto = Date.now();
    this.juntar(c, d.mundos, d.duenos, d.quitar);
    const t = hex(crypto.getRandomValues(new Uint8Array(24)));
    c.ses = [...(c.ses || []), await sha(t)].slice(-SESIONES);
    await this.ctx.storage.put("c", c);
    return { ...this.vista(c), ses: g.sub + "." + t, nueva: nueva ? 1 : 0 };
  }
  async sync(t, d) {
    const c = await this.sesion(t);
    if (!c) return null;
    this.juntar(c, d.mundos, d.duenos, d.quitar); c.visto = Date.now();
    await this.ctx.storage.put("c", c);
    return this.vista(c);
  }
  // La única maquinita de la cuenta pasa a ser otra (la de este equipo, si así lo eligió quien entró).
  async maquina(t, k) {
    const c = await this.sesion(t);
    if (!c || !llaveOk(k)) return null;
    c.k = k; c.visto = Date.now();
    await this.ctx.storage.put("c", c);
    return this.vista(c);
  }
  async salir(t) {
    const c = await this.sesion(t);
    if (!c) return false;
    const h = await sha(t);
    c.ses = c.ses.filter((x) => x !== h);
    await this.ctx.storage.put("c", c);
    return true;
  }
}

// Google dice quién es: se pregunta a Google por el pase que entregó su botón y se revisa que sea para Mina, vigente y con
// el correo confirmado. En la computadora de pruebas (solo ahí: con MINA_PRUEBA en .dev.vars, que nunca se publica, y
// desde la misma máquina) sirve un pase falso para probar sin Google.
async function verificarGoogle(cred, ids, env, request) {
  if (env.MINA_PRUEBA === "1" && ["::1", "127.0.0.1"].includes(request.headers.get("CF-Connecting-IP")) && cred.startsWith("prueba:")) {
    const [, sub, email] = cred.split(":");
    return /^[0-9a-z]{1,40}$/i.test(sub || "") ? { sub, email: limpio(email, 120) || sub + "@prueba.mx", nombre: "Prueba " + sub, foto: "" } : null;
  }
  if (cred.length < 100 || cred.length > 4096) return null;
  let p;
  try { const r = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(cred)); if (!r.ok) return null; p = await r.json(); } catch { return null; }
  if (!p || !ids.includes(p.aud) || !["accounts.google.com", "https://accounts.google.com"].includes(p.iss)) return null;
  if (String(p.email_verified) !== "true" || !(Number(p.exp) * 1000 > Date.now()) || !/^\d{1,40}$/.test(p.sub || "")) return null;
  const foto = /^https:\/\/[a-z0-9.-]+\.googleusercontent\.com\/[^\s"'<>]*$/.test(p.picture || "") ? String(p.picture).slice(0, 400) : "";
  return { sub: p.sub, email: limpio(p.email, 120), nombre: limpio(p.name, 60), foto };
}
const ID_GOOGLE = "977641517971-23ouv33lu4s8ejrm6m4mgvuqcvpa9ucf.apps.googleusercontent.com";
async function cuentaApi(u, request, env) {
  const ids = String(env.GOOGLE_CLIENT_ID || ID_GOOGLE).split(",").map((x) => x.trim()).filter(Boolean);
  if (u.pathname === "/api/cuenta/cliente" && request.method === "GET") return json({ id: ids[0] });
  if (request.method !== "POST") return json({ error: "no" }, 404);
  let d;
  try { d = await request.json(); } catch { return json({ error: "datos" }, 400); }
  if (!d || typeof d !== "object") return json({ error: "datos" }, 400);
  const cuenta = (sub) => env.CUENTA.get(env.CUENTA.idFromName("g:" + sub));
  const resumen = async (k) => { if (!llaveOk(k)) return null; try { return await env.MAQUINA.get(env.MAQUINA.idFromName(k)).resumen(); } catch { return null; } };
  if (u.pathname === "/api/cuenta/google") {
    const g = await verificarGoogle(String(d.credential || ""), ids, env, request);
    if (!g) return json({ error: "google" }, 401);
    const r = await cuenta(g.sub).entrar(g, d);
    r.maq = await resumen(r.k);
    if (llaveOk(d.k) && d.k !== r.k) r.aqui = await resumen(d.k);      // este equipo traía otra maquinita: se enseñan las dos
    return json(r);
  }
  const ses = String(d.ses || ""), punto = ses.lastIndexOf("."), sub = ses.slice(0, punto), t = ses.slice(punto + 1);
  if (punto < 1 || !/^[0-9A-Za-z]{1,40}$/.test(sub) || !/^[0-9a-f]{48}$/.test(t)) return json({ error: "sesion" }, 401);
  const c = cuenta(sub);
  if (u.pathname === "/api/cuenta/sync") { const r = await c.sync(t, d); return r ? json(r) : json({ error: "sesion" }, 401); }
  if (u.pathname === "/api/cuenta/maquina") { const r = await c.maquina(t, d.k); if (!r) return json({ error: "sesion" }, 401); r.maq = await resumen(r.k); return json(r); }
  if (u.pathname === "/api/cuenta/salir") { await c.salir(t); return json({ ok: 1 }); }
  return json({ error: "no" }, 404);
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
    this.tablaT = new Map();  // cuándo y con cuánto se avisó por última vez de cada maquinita a la tabla mundial
    this.chatT = new Map();   // cuándo escribió cada quien, para que nadie inunde el chat
    this.xy = new Map();      // dónde anda cada maquinita conectada: las posiciones se reparten según la cercanía
    this.paso = new Map();
    // El chat del mundo se guarda completo, mensaje por mensaje.
    ctx.storage.sql.exec("CREATE TABLE IF NOT EXISTS chat (id INTEGER PRIMARY KEY AUTOINCREMENT, h INTEGER, i INTEGER, n TEXT, m INTEGER, x TEXT)");
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
    const o = { meta, dug };
    if (base && base.mapa && mapaValido(base.mapa)) { meta.mapaR = meta.remin; meta.mapaH = huellaMapa(base.mapa); o.mapa = await comprimir(base.mapa); }      // nace con su terreno completo
    await this.ctx.storage.put(o);
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
      if (a && a.i !== undefined) s.add(a.i);
    }
    return s;
  }

  // ── La tabla mundial y quienes miran
  tabla() { return this.env.TABLA.get(this.env.TABLA.idFromName("mundial")); }

  // Avisa a la tabla cuánto lleva una maquinita. Si cambió, a los 3 s como mucho; si no, cada 20 s para que conste que sigue
  // jugando. Las que están lejos del tablero no avisan (el corte se vuelve a preguntar cada 10 minutos).
  avisarTabla(i, vivo, ya) {
    const m = this.m, j = this.jug[i];
    if (!m || !j || !j.pid || !(j.tot > 0)) return;
    const ahora = Date.now(), tot = j.tot || 0, u = this.tablaT.get(i) || { t: 0, tot: -1 };
    if (this.corte !== undefined && tot < this.corte && ahora - (this.corteT || 0) < 600000) return;
    if (!ya && ahora - u.t < (tot !== u.tot ? 3000 : 20000)) return;
    this.tablaT.set(i, { t: ahora, tot });
    const mira = m.cfg.mirar !== 0 && m.ver && m.id;
    this.ctx.waitUntil(this.tabla().reportar({ p: j.pid, n: j.n, m: j.m, tot, seg: j.seg || 0, vivo: vivo ? 1 : 0, i, ver: mira ? m.ver : "", mundo: mira ? m.id : "" })
      .then((c) => { this.corte = c; this.corteT = Date.now(); }, () => {}));
  }
  // ── El público: quién mira, quién pide jugar, a quién sacaron
  ipDe(ws) { const t = this.ctx.getTags(ws).find((x) => x.startsWith("ip:")); return t ? t.slice(3) : ""; }
  baneado(k, ip) { const b = (this.m && this.m.ban) || []; return b.some((x) => (k && x.k === k) || (ip && x.ip === ip)); }
  // A quien creó el mundo le llega, cada vez que algo cambia, quién está mirando, quién quiere jugar y a quién sacó.
  avisarDueno(menos) {
    const m = this.m; if (!m) return;
    const ds = this.socketDe(this.creador()); if (!ds) return;
    const mira = [], sol = [];
    for (const s of this.ctx.getWebSockets("mira")) {
      if (s === menos) continue;
      const a = s.deserializeAttachment(); if (!a) continue;
      const x = { sid: a.sid, n: a.n || "", m: a.m || 0 };
      if (mira.length < 200) mira.push(x);
      if (a.sol) sol.push({ ...x, h: a.sol.h });
    }
    const rev = (m.rev || []).map((k) => this.jug.findIndex((j) => j && j.k === k)).filter((x) => x >= 0);
    manda(ds, { t: "publico", mira, nm: this.ctx.getWebSockets("mira").length - (menos ? 1 : 0), sol, ban: (m.ban || []).map((b) => ({ n: b.n, h: b.h })), rev });
  }
  // A quienes esperan respuesta se les dice si quien creó el mundo está conectado (cambia cuando entra o sale).
  avisarPidiendo(menos) {
    const d = this.creador(), s0 = d >= 0 ? this.socketDe(d) : null, en = !!s0 && s0 !== menos, n = (this.jug[d] && this.jug[d].n) || "";
    for (const s of this.ctx.getWebSockets("mira")) { const a = s.deserializeAttachment(); if (a && a.sol) manda(s, { t: "pidiendo", dueno: en ? 1 : 0, n }); }
  }
  // Quien mira pide entrar a jugar con su maquinita. Si ya es de este mundo, entra; si no, espera a que lo acepten.
  async pedir(ws, a, d) {
    const m = this.m, k = limpio(d.k, 64);
    if (k.length < 16) return;
    if (this.baneado(k, this.ipDe(ws))) { manda(ws, { t: "baneado" }); try { ws.close(4002, "baneado"); } catch {} return; }
    a.n = limpio(d.n, 14) || a.n || ""; a.m = entero(d.m, 0, 7, a.m || 0);
    const yaEs = this.jug.some((j) => j && j.k === k) && !(m.rev || []).includes(k), dueno = this.creador();
    if (yaEs || dueno < 0 || (m.ok || []).includes(k)) { ws.serializeAttachment(a); manda(ws, { t: "aceptado", id: m.id }); return; }
    if (this.jug.filter(Boolean).length >= MAX_MAQUINITAS) { manda(ws, { t: "lleno" }); return; }
    a.sol = { k, h: Date.now() }; ws.serializeAttachment(a);
    manda(ws, { t: "pidiendo", dueno: this.socketDe(dueno) ? 1 : 0, n: (this.jug[dueno] && this.jug[dueno].n) || "" });
    this.avisarDueno();
  }
  async ordenDueno(d, yoI) {
    const m = this.m, obs = (sid) => this.ctx.getWebSockets("mira").find((s) => { const a = s.deserializeAttachment(); return a && a.sid === sid; });
    if (d.t === "acepto" || d.t === "rechazo") {
      const s = obs(String(d.sid || "")); const a = s && s.deserializeAttachment(); if (!a || !a.sol) return;
      if (d.t === "acepto") { m.ok = (m.ok || []).filter((x) => x !== a.sol.k).concat(a.sol.k).slice(-300); m.rev = (m.rev || []).filter((x) => x !== a.sol.k); this.sucio.meta = true; manda(s, { t: "aceptado", id: m.id }); }
      else manda(s, { t: "rechazado" });
      delete a.sol; s.serializeAttachment(a);
    } else if (d.t === "sacar") {
      const ban = (b) => { m.ban = (m.ban || []).concat({ ...b, h: Date.now() }).slice(-300); this.sucio.meta = true; };
      if (d.sid) {                                       // alguien que mira
        const s = obs(String(d.sid)); if (!s) return; const a = s.deserializeAttachment() || {};
        ban({ n: a.n || "Alguien que miraba", ip: this.ipDe(s), k: a.sol ? a.sol.k : "" });
        manda(s, { t: "baneado" }); s.serializeAttachment(null); try { s.close(4002, "baneado"); } catch {}
        this.contarMirones(s);
      } else {                                           // una maquinita del mundo
        const x = entero(d.i, 0, MAX_MAQUINITAS, -1), j = this.jug[x]; if (!j || x === yoI) return;
        const s = this.socketDe(x);
        ban({ n: j.n, k: j.k, ip: s ? this.ipDe(s) : "" });
        m.ok = (m.ok || []).filter((y) => y !== j.k);
        if (s) { manda(s, { t: "baneado" }); s.serializeAttachment(null); try { s.close(4002, "baneado"); } catch {} }
        this.pos.delete(x); this.xy.delete(x);
        this.difundir({ t: "sale", i: x, sacada: 1 });
      }
    } else if (d.t === "perdonar") {
      const x = entero(d.x, 0, 1000, -1); if (!m.ban || !m.ban[x]) return;
      m.ban.splice(x, 1); this.sucio.meta = true;
    } else if (d.t === "quitar" || d.t === "devolver") {
      // El permiso de una maquinita del mundo dura para siempre, hasta que quien lo creó se lo quita. Sin permiso puede mirar y volver a pedirlo.
      const x = entero(d.i, 0, MAX_MAQUINITAS, -1), j = this.jug[x]; if (!j || x === yoI) return;
      m.rev = (m.rev || []).filter((y) => y !== j.k); m.ok = (m.ok || []).filter((y) => y !== j.k);
      if (d.t === "devolver") m.ok = m.ok.concat(j.k).slice(-300);
      else {
        m.rev = m.rev.concat(j.k).slice(-300);
        const s = this.socketDe(x);
        if (s) { manda(s, { t: "revocado", ver: m.cfg.mirar !== 0 ? m.ver || "" : "" }); s.serializeAttachment(null); try { s.close(4002, "revocado"); } catch {} this.pos.delete(x); this.xy.delete(x); this.difundir({ t: "sale", i: x }); }
      }
      this.sucio.meta = true;
    }
    this.avisarDueno();
    await this.programar();
  }

  contarMirones(menos) {
    let n = 0;
    for (const ws of this.ctx.getWebSockets("mira")) if (ws !== menos) n++;
    this.difundir({ t: "obs", n }, menos);
  }

  // ── El chat
  chatUltimos(n) { return this.ctx.storage.sql.exec("SELECT id, h, i, n, m, x FROM chat ORDER BY id DESC LIMIT ?", n).toArray().reverse(); }
  chatMas(ws, d) {
    const antes = entero(d.id, 1, 1e12, 0);
    if (antes) manda(ws, { t: "chatMas", l: this.ctx.storage.sql.exec("SELECT id, h, i, n, m, x FROM chat WHERE id < ? ORDER BY id DESC LIMIT 50", antes).toArray().reverse() });
  }

  // ── El terreno guardado
  mapaDe(m) { return m.mapaH && m.mapaR === m.remin ? { r: m.remin, h: m.mapaH } : null; }
  async mapa() {
    const m = await this.cargar();
    if (!m || !this.mapaDe(m)) return null;
    const z = await this.ctx.storage.get("mapa");
    return z ? { h: m.mapaH, r: m.mapaR, z } : null;
  }
  // Un mundo que todavía no tiene guardado su terreno (los de antes, o tras remineralizar) lo recibe de la primera maquinita
  // que lo fabrica. Queda fijo: ya nadie lo puede cambiar.
  async recibirMapa(u, r) {
    const m = this.m;
    if (!m || r !== m.remin || this.mapaDe(m) || this.guardandoMapa || !mapaValido(u)) return;
    this.guardandoMapa = true;
    try {
      const h = huellaMapa(u), z = await comprimir(u);
      if (r !== m.remin) return;
      m.mapaR = r; m.mapaH = h;
      await this.ctx.storage.put({ mapa: z, meta: m });
      this.difundir({ t: "mapa", r, h });
    } finally { this.guardandoMapa = false; }
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
    // Los mundos no caducan: la alarma solo sirve para guardar lo pendiente y para la cuenta de la Remineralizadora.
    let cuando = Infinity;
    // Lo cavado se guarda en 2 s como mucho; lo demás puede esperar 5. Si el mundo se reinicia antes, los navegadores lo vuelven a mandar al reconectar.
    if (this.sucio.meta || this.sucio.dug || this.sucio.jug.size || this.sucio.maq.size) cuando = Math.min(cuando, Date.now() + (this.sucio.dug ? 2000 : 5000));
    if (m.reminAt) cuando = Math.min(cuando, m.reminAt);
    if (cuando === Infinity) return;
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
    const ip = await huellaIp(request.headers.get("CF-Connecting-IP"));
    // Quien mira entra por su ficha: recibe el mundo y lo que pasa en él, pero nada de lo que mande se atiende,
    // y en ningún mensaje viaja la liga del mundo.
    if (new URL(request.url).searchParams.get("mira") === "1") {
      const m = await this.cargar();
      this.ctx.acceptWebSocket(servidor, ["mira", "ip:" + ip]);
      servidor.serializeAttachment({ o: 1, sid: fichaNueva().slice(0, 8), n: "", m: 0 });
      const fin = (o) => { manda(servidor, o); servidor.serializeAttachment(null); try { servidor.close(4002, o.t); } catch {} };
      if (!m) fin({ t: "noexiste" });
      else if (m.cfg.mirar === 0) fin({ t: "nomira" });
      else if (this.baneado("", ip)) fin({ t: "baneado" });
      else {                                                  // mirando caben todos los que quieran
        const on = this.conectados();
        let hasta = BYTES; while (hasta > 0 && !this.dug[hasta - 1]) hasta--;
        let b = "";
        for (let x = 0; x < hasta; x += 8192) b += String.fromCharCode.apply(null, this.dug.subarray(x, Math.min(hasta, x + 8192)));
        manda(servidor, { t: "mira", chat: this.chatUltimos(60), sinMineral: m.sinMineral ?? -1, mapa: this.mapaDe(m), seed: m.seed, remin: m.remin, cfg: m.cfg, jug: this.jug.map((j, x) => (j ? this.publico(x, on.has(x)) : null)).filter(Boolean), dug: btoa(b), col: m.col || [] });
        for (const [x, s] of this.pos) if (on.has(x)) manda(servidor, s);
        this.contarMirones(); this.avisarDueno();
      }
      return new Response(null, { status: 101, webSocket: cliente });
    }
    this.ctx.acceptWebSocket(servidor, ["ip:" + ip]);
    return new Response(null, { status: 101, webSocket: cliente });
  }

  // RLR · mensajes del juego
  async webSocketMessage(ws, msg) {
    const m = await this.cargar();
    const att = ws.deserializeAttachment();
    if ((att && att.o) || this.ctx.getTags(ws).includes("mira")) {             // quien mira no puede hacer nada… salvo leer el chat hacia atrás
      if (m && att && typeof msg === "string" && msg.length < 400) {
        let d; try { d = JSON.parse(msg); } catch { return; }
        if (!d) return;
        if (d.t === "chatAntes") this.chatMas(ws, d);
        else if (d.t === "soy") { att.n = limpio(d.n, 14); att.m = entero(d.m, 0, 7, 0); ws.serializeAttachment(att); this.avisarDueno(); }
        else if (d.t === "pido") await this.pedir(ws, att, d);
        else if (d.t === "nopido") { delete att.sol; ws.serializeAttachment(att); this.avisarDueno(); }
      }
      return;
    }

    // Posición: 6 bytes binarios → se reenvía con el número de maquinita (7 bytes)
    if (typeof msg !== "string") {
      if (!att) return;
      // Imagen de la liga: 2 = la del mundo, 3 = la de esta maquinita. Solo JPEG, con tope de peso y de frecuencia.
      if (msg.byteLength > 16) {
        const f = new Uint8Array(msg), yo = m && this.jug[att.i];
        if (yo && f[0] === 4 && f.length === MAPA_BYTES + 5) return this.recibirMapa(f.slice(5), new DataView(f.buffer, f.byteOffset).getUint32(1, true));      // el terreno completo
        if (!yo || (f[0] !== 2 && f[0] !== 3) || f.length < 2000 || f.length > 300000 || f[1] !== 0xff || f[2] !== 0xd8 || f[3] !== 0xff) return;
        const llave = att.i + ":" + f[0], ahora = Date.now();
        if (ahora - (this.fotoT.get(llave) || 0) < 12000) return;
        this.fotoT.set(llave, ahora);
        await this.ctx.storage.put(f[0] === 2 ? "og:m" : "og:j:" + att.i, f.slice(1));
        if (f[0] === 2) { m.og = (m.og || 0) + 1; this.sucio.meta = true; } else { yo.og = (yo.og || 0) + 1; this.sucio.jug.add(att.i); }
        await this.programar();
        return;
      }
      if (msg.byteLength !== 8 && msg.byteLength !== 10) return;
      const e = new Uint8Array(msg), s = new Uint8Array(msg.byteLength + 1);
      s[0] = 1; s[1] = att.i; s.set(e.subarray(1), 2);
      this.pos.set(att.i, s);
      // A quien está cerca le llegan todas (para verse en tiempo real); a quien anda lejos, una de cada cinco: le basta para
      // saber por dónde vas. Así un mundo con mucha gente repartida no se satura.
      const dv = new DataView(e.buffer), x = dv.getUint16(1, true) / 256, y = dv.getInt32(3, true) / 64;
      this.xy.set(att.i, [x, y]);
      const n = ((this.paso.get(att.i) || 0) + 1) % 5; this.paso.set(att.i, n);
      for (const o of this.ctx.getWebSockets()) {
        if (o === ws) continue;
        const a = o.deserializeAttachment(); if (!a) continue;
        if (n && a.i !== undefined) { const r = this.xy.get(a.i); if (r && (Math.abs(r[0] - x) > 40 || Math.abs(r[1] - y) > 28)) continue; }
        manda(o, s);
      }
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
        yo.seg = entero(d.e.seg, 0, 4e9, yo.seg || 0);        // segundos que esta maquinita lleva jugando, en toda su vida
        if (rec !== yo.rec || tot !== yo.tot) {
          yo.rec = rec; yo.tot = tot;
          this.difundir({ t: "j", i, rec, tot }, ws);
        }
        this.sucio.jug.add(i);
        this.avisarTabla(i, true);
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
        this.avisarTabla(i, true, true);
        break;
      }
      case "chat": {
        const x = textoChat(d.x);
        if (!x) return;
        const ahora = Date.now(), r = this.chatT.get(i) || [];
        while (r.length && ahora - r[0] > 10000) r.shift();
        if (r.length >= 6 || (r.length && ahora - r[r.length - 1] < 400)) { manda(ws, { t: "chatNo" }); return; }      // seis mensajes cada diez segundos, como mucho
        r.push(ahora); this.chatT.set(i, r);
        const id = this.ctx.storage.sql.exec("INSERT INTO chat (h, i, n, m, x) VALUES (?, ?, ?, ?, ?) RETURNING id", ahora, i, yo.n, yo.m, x).one().id;
        this.difundir({ t: "chat", id, h: ahora, i, n: yo.n, m: yo.m, x });
        if (id % 500 === 0) this.ctx.storage.sql.exec("DELETE FROM chat WHERE id <= ?", id - CHAT_GUARDA);
        return;
      }
      case "chatAntes":
        this.chatMas(ws, d);
        return;
      case "acepto": case "rechazo": case "sacar": case "perdonar": case "quitar": case "devolver":
        if (i !== this.creador()) return;
        await this.ordenDueno(d, i);
        return;
      case "fin": {              // el Jardín del Fondo quedó completo: los minerales que quedaban se reparten en partes iguales entre todas las maquinitas del mundo
        if (!m.fin || m.fin.r !== m.remin) {
          const n = Math.max(1, this.jug.filter(Boolean).length), total = Number.isFinite(d.total) && d.total >= 0 ? Math.min(d.total, 1e16) : 0;
          m.fin = { h: Date.now(), i, r: m.remin, n, total, parte: Math.floor(total / n) };
        }
        m.sinMineral = m.remin; this.sucio.meta = true;      // queda de pura tierra hasta remineralizar
        this.difundir({ ...m.fin, t: "fin" });               // a todos, también a quien perforó el Corazón: así todos arrancan con el mismo reparto
        break;
      }
        break;
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
        if (m.cfg.mirar === 0) {                 // se cerró a quienes miran: se les despide y la tabla deja de ofrecer la ficha
          for (const s of this.ctx.getWebSockets("mira")) { manda(s, { t: "nomira" }); try { s.close(4002, "nomira"); } catch {} }
        }
        for (const x of this.conectados()) this.avisarTabla(x, true, true);
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
        if (m.ver) { try { await this.tabla().olvidar(m.ver); } catch {} }
        this.ctx.storage.sql.exec("DELETE FROM chat");
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
    // A una maquinita sacada no la deja volver su llave. La dirección de internet solo frena a quien llega nuevo: en una casa
    // o en una red de celular varias personas comparten dirección, y no se debe sacar a las que ya juegan aquí.
    if (this.baneado(k, this.jug.some((j) => j && j.k === k) || (m.ok || []).includes(k) ? "" : this.ipDe(ws))) return fin({ t: "baneado" });      // a quien aceptaste no lo frena la dirección
    let i = this.jug.findIndex((j) => j && j.k === k);
    if (i >= 0 && (m.rev || []).includes(k)) return fin({ t: "revocado", ver: m.cfg.mirar !== 0 ? m.ver || "" : "" });      // le quitaron el permiso: puede mirar y volver a pedirlo
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
      if (m.cfg.puerta && this.jug.length && !(m.ok || []).includes(k)) return fin({ t: "cerrado", ver: m.cfg.mirar !== 0 ? m.ver || "" : "" });      // con la puerta cerrada se entra a mirar, y desde ahí se pide permiso
      if (this.jug.length >= MAX_MAQUINITAS) return fin({ t: "lleno" });
      i = this.jug.length;
      this.jug[i] = { k, n: r.n, m: r.mo, est: r.est, rec: 0, tot: 0, alta: Date.now() };
      m.n = this.jug.length;
      await this.ctx.storage.put({ ["j:" + i]: this.jug[i], meta: m });
    }
    const yo = this.jug[i];
    yo.n = r.n; yo.m = r.mo; yo.est = r.est;
    if (!yo.pid) { yo.pid = await huella(k); this.sucio.jug.add(i); }
    // La ficha para mirar este mundo: nace una vez y se apunta en el directorio de la tabla.
    if (!m.ver) m.ver = fichaNueva();
    if (!m.verReg && m.id) { m.verReg = 1; try { await this.tabla().registrar(m.ver, m.id); } catch { m.verReg = 0; } }
    if (r.est) { yo.rec = entero(r.est.rec, 0, H * 2, yo.rec || 0); yo.tot = Number.isFinite(r.est.tot) ? Math.floor(r.est.tot) : yo.tot || 0; yo.seg = entero(r.est.seg, 0, 4e9, yo.seg || 0); }
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
      dug: btoa(b), col: m.col || [], chat: this.chatUltimos(60), fin: m.fin || null, sinMineral: m.sinMineral ?? -1, mapa: this.mapaDe(m), pid: yo.pid, ver: m.cfg.mirar === 0 ? "" : m.ver, obs: this.ctx.getWebSockets("mira").length,
    });
    for (const [x, s] of this.pos) if (x !== i && on.has(x)) manda(ws, s);
    this.avisarTabla(i, true, true);
    if (i === this.creador()) { this.avisarDueno(); this.avisarPidiendo(); }      // llegó quien decide: se le muestran las solicitudes y a quien espera se le avisa
    this.difundir({ t: "entra", j: this.publico(i, true), nuevo: estrena ? 1 : 0 }, ws);
    await this.programar();
  }

  async webSocketClose(ws, code) {
    try { ws.close(code > 1000 && code < 5000 && code !== 1005 && code !== 1006 ? code : 1000); } catch {}
    const att = ws.deserializeAttachment();
    const m = await this.cargar();
    if (m && this.ctx.getTags(ws).includes("mira")) { this.contarMirones(ws); this.avisarDueno(ws); return; }
    if (!m || !att) return;
    // Si la maquinita ya entró por otra pestaña, este cierre no la saca del mundo.
    const otro = this.ctx.getWebSockets().some((s) => s !== ws && s.deserializeAttachment()?.i === att.i);
    if (!otro) {
      this.pos.delete(att.i); this.xy.delete(att.i);
      this.difundir({ t: "sale", i: att.i }, ws);
      this.avisarTabla(att.i, false, true);
      if (att.i === this.creador()) this.avisarPidiendo(ws);
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
      m.remin++; m.reminAt = 0; m.mapaH = "";      // el terreno nuevo lo entrega quien remineralizó, y queda fijo otra vez
      this.dug.fill(0);
      this.sucio.meta = this.sucio.dug = true;
      this.difundir({ t: "remin", remin: m.remin });
    }
    await this.guardar();      // un mundo nunca se borra solo: únicamente cuando quien lo creó pide borrarlo
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
          let mapa = null;                    // el terreno completo, si el archivo lo trae
          if (typeof a.mapa === "string" && a.mapa.length < MAPA_BYTES * 1.4) {
            const bm = atob(a.mapa);
            if (bm.length === MAPA_BYTES) { mapa = new Uint8Array(MAPA_BYTES); for (let k = 0; k < MAPA_BYTES; k++) mapa[k] = bm.charCodeAt(k); }
          }
          const bin = atob(a.dug), dug = new Uint8Array(Math.min(BYTES, bin.length));
          for (let k = 0; k < dug.length; k++) dug[k] = bin.charCodeAt(k);
          base = { seed: entero(a.seed, -2147483648, 4294967295, 1), remin: entero(a.remin, 0, 1e9, 0), cfg: a.cfg, col: (Array.isArray(a.col) ? a.col : []).map((k) => entero(k, 0, 98, -1)).filter((k) => k >= 0).slice(0, 99), dug, mapa };
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
    const liga = u.pathname.match(/^\/(?:m\/)?([2-9A-HJ-NP-Z]{8})\/?$/i);      // mina.capitaltorreon.com/QSAHAZ3F (y la de antes, con /m/)
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
        .on('meta[property="og:url"]', pon(u.origin + "/" + id + (p ? "?j=" + j : "")))
        .transform(pagina);
    }

    // El terreno completo de un mundo, comprimido. No cambia nunca (salvo al remineralizar, que le cambia la huella):
    // el navegador lo guarda y no lo vuelve a pedir. Quien mira lo pide con su ficha.
    const mp = u.pathname.match(/^\/api\/mapa\/(?:([2-9A-HJ-NP-Z]{8})|ver\/([2-9A-HJ-NP-Z]{12}))$/);
    if (mp && request.method === "GET") {
      const id = mp[1] || (await env.TABLA.get(env.TABLA.idFromName("mundial")).mundoDe(mp[2]));
      let r = null;
      if (id) { try { r = await env.MUNDO.get(env.MUNDO.idFromName(id)).mapa(); } catch {} }
      if (!r) return json({ error: "no" }, 404);
      const fijo = u.searchParams.get("h") === r.h;
      return new Response(r.z, { encodeBody: "manual", headers: { "content-type": "application/octet-stream", "content-encoding": "gzip", "cache-control": fijo ? "public, max-age=31536000, immutable" : "no-store", "x-mapa": r.r + "." + r.h } });
    }

    // La tabla mundial: las 33 maquinitas que más han ganado.
    if (u.pathname === "/api/tabla" && request.method === "GET") {
      const t = await env.TABLA.get(env.TABLA.idFromName("mundial")).lista();
      return new Response(JSON.stringify(t), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
    }
    // Mirar un mundo por su ficha: aquí se traduce a su mundo, y quien mira nunca ve cuál es.
    const mira = u.pathname.match(/^\/ws\/ver\/([2-9A-HJ-NP-Z]{12})$/);
    if (mira) {
      const id = await env.TABLA.get(env.TABLA.idFromName("mundial")).mundoDe(mira[1]);
      if (!id) return json({ error: "no" }, 404);
      return env.MUNDO.get(env.MUNDO.idFromName(id)).fetch(new Request(new URL("/ws/" + id + "?mira=1", request.url), request));
    }

    const ws = u.pathname.match(/^\/ws\/([2-9A-HJ-NP-Z]{8})$/);
    if (ws) return env.MUNDO.get(env.MUNDO.idFromName(ws[1])).fetch(new Request(new URL(u.pathname, request.url), request));      // sin parámetros: nadie se cuela como observador ni al revés

    // La cuenta (entrar con Google, ponerse al corriente, salir). Jugar nunca la pide.
    if (u.pathname.startsWith("/api/cuenta/")) return cuentaApi(u, request, env);

    if (u.pathname.startsWith("/api/") || u.pathname.startsWith("/ws/") || u.pathname.startsWith("/og/")) return json({ error: "no" }, 404);
    return env.ASSETS.fetch(request);
  },
};
