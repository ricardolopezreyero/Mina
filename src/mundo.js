// ─────────────────────────────────────────────────────────────────────────────
// Mina · el mundo compartido — Ricardo López Reyero (RLR)
// Un Durable Object por mundo: es la única verdad sobre el terreno cavado y
// sobre quién está jugando. Aquí vive el mundo entero y para siempre: su terreno
// completo, celda por celda (se fabrica una sola vez, al nacer, y ya no depende de
// que el juego cambie), un bit por celda cavada, sus reglas y su colección.
// Un mundo solo se borra si quien lo creó pide borrarlo.
// ─────────────────────────────────────────────────────────────────────────────
import { DurableObject } from "cloudflare:workers";
import { verificarPase } from "./verificar.js";      // el pase del Login de CapitalTorreon (login.capitaltorreon.com)
import { NIVELES, MECENAS_MIN, FONDO_PRECIO, TOPE_MES, precioDe, filtrarPinta, motorConfort, OFERTA_DIAS, EXPERIMENTOS, momento, precioFinal, cumpleOk, cumpleCerca, horaTorreon, GRATITUD_MIN, GRATITUD_HORA, REFERIDO_PREMIO } from "./tienda.js";      // La Pinturería: precios y pintura
// Un secreto de la bóveda (Secrets Store) llega como objeto con .get(); en local, como texto de .dev.vars. Sin él: "".
async function secreto(v) { if (!v) return ""; if (typeof v === "string") return v; try { return (await v.get()) || ""; } catch { return ""; } }

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
  // El Fondo común: pinturas ya pagadas que esperan a maquinitas nuevas (hay para todos).
  async fondo() { return (await this.ctx.storage.get("fondo")) || 0; }
  async sumarFondo(n) { const f = ((await this.ctx.storage.get("fondo")) || 0) + n; await this.ctx.storage.put("fondo", f); return f; }
  // La economía que vamos percibiendo: con qué descuento compra la gente. De ahí sale el descuento con el que arrancan
  // los experimentos de cada quien (desc0): si todos compran solo con rebaja, se arranca más abajo; si compran a lista, en cero.
  async economia() { const e = (await this.ctx.storage.get("eco")) || { n: 0, suma: 0 }; return { desc0: e.n >= 10 ? Math.max(0, Math.min(0.3, Math.round((e.suma / e.n - 0.1) * 20) / 20)) : 0, n: e.n }; }
  // Los cumpleaños de quien los dio con su cuenta: para el correo de gratitud de las 3:33 pm (hora de Torreón). Nada más.
  async ponerCumple(k, dato) { const c = (await this.ctx.storage.get("cumples")) || {}; if (dato) c[k] = dato; else delete c[k]; await this.ctx.storage.put("cumples", c); return 1; }
  async cumplesDe(md, y) { const c = (await this.ctx.storage.get("cumples")) || {}; return Object.entries(c).filter(([, d]) => d.md === md && d.y !== y).map(([k, d]) => ({ k, ...d })); }
  async felicitado(k, y) { const c = (await this.ctx.storage.get("cumples")) || {}; if (c[k]) { c[k].y = y; await this.ctx.storage.put("cumples", c); } }
  async anotarCompra(desc) { const e = (await this.ctx.storage.get("eco")) || { n: 0, suma: 0 }; e.n++; e.suma += desc; await this.ctx.storage.put("eco", e); }
  async tomarRegalo() { const f = (await this.ctx.storage.get("fondo")) || 0; if (f <= 0) return 0; await this.ctx.storage.put("fondo", f - 1); return 1; }
}

// RLR · la maquinita
// Cada maquinita es de su dueño y vive aquí, fuera de los mundos: entra a cualquiera con todo lo que
// trae y sobrevive aunque un mundo se borre. Solo puede estar en un mundo a la vez.
export class Maquina extends DurableObject {
  async entrar({ mundo, k, n, mo, est, padrino }) {
    let m = await this.ctx.storage.get("m"), regalo = 0;
    if (!m) {
      if (!n) return null;                                   // todavía no existe: hay que bautizarla
      m = { n, mo: mo || 0, est: est || null, v: (est && est.v) || 0, alta: Date.now(), ...(padrino && padrino !== k ? { padrino } : {}) };      // nació con la liga de alguien: su padrino
      // Si alguien pagó adelante (Fondo común), la maquinita nueva nace con su primera pintura.
      try { regalo = await this.env.TABLA.get(this.env.TABLA.idFromName("mundial")).tomarRegalo(); } catch {}
      if (regalo) m.tienda = { nivel: 1, mecenas: 0, compras: [{ sid: "fondo-" + Date.now(), tipo: "nivel", n: 1, monto: 0, de: "fondo", h: Date.now() }] };
    } else if (m.mundo && m.mundo !== mundo) {
      // Estaba en otro mundo: aquel la suelta y entrega lo último que supo de ella.
      try {
        const r = await this.env.MUNDO.get(this.env.MUNDO.idFromName(m.mundo)).soltar(k);
        if (r && r.est && (r.est.v || 0) >= (m.v || 0)) { m.est = r.est; m.v = r.est.v || 0; }
      } catch {}
    }
    m.mundo = mundo; m.vista = Date.now();
    await this.ctx.storage.put("m", m);
    const t = this.tiendaDe(m);
    return { n: m.n, mo: m.mo, est: m.est, p: this.pintaPublica(m), nv: t.nivel, me: t.mecenas > 0 ? 1 : 0, regalo };
  }
  // La pintura que ven todos: lo del nivel comprado y, el día de su cumpleaños (hora de Torreón), un gorrito de fiesta (cu).
  pintaPublica(m) { const t = this.tiendaDe(m), p = filtrarPinta(m.pinta, t.nivel); if (cumpleOk(t.cumple) && t.cumple === horaTorreon().md) p.cu = 1; return p; }
  async ponerCumple(md) { const m = await this.ctx.storage.get("m"); if (!m) return null; const t = this.tiendaDe(m); if (md) t.cumple = md; else delete t.cumple; await this.ctx.storage.put("m", m); return { cumple: t.cumple || "", p: this.pintaPublica(m), nv: t.nivel, me: t.mecenas > 0 ? 1 : 0 }; }

  // ── Referidos: el saldo y las cuentas viven en la maquinita de quien invita (una por persona).
  refDe(m) { return m.ref || (m.ref = { clics: 0, llegaron: 0, cuentas: 0, ganado: 0, gastado: 0, lista: [] }); }
  async anotarRef(tipo) { const m = await this.ctx.storage.get("m"); if (!m || !["clics", "llegaron"].includes(tipo)) return; const r = this.refDe(m); r[tipo]++; await this.ctx.storage.put("m", m); }
  async acreditarReferido({ n, de }) {
    const m = await this.ctx.storage.get("m"); if (!m) return null;
    const r = this.refDe(m); if (r.lista.some((x) => x.de === de)) return { saldo: m.saldo || 0, cuentas: r.cuentas, repetido: 1 };
    r.cuentas++; r.ganado += REFERIDO_PREMIO; m.saldo = (m.saldo || 0) + REFERIDO_PREMIO;
    r.lista = r.lista.concat({ n: n || "", de, h: Date.now(), monto: REFERIDO_PREMIO }).slice(-1000);
    await this.ctx.storage.put("m", m);
    return { saldo: m.saldo, cuentas: r.cuentas, n: m.n, mundo: m.mundo || "" };
  }
  async padrinoDe() { const m = await this.ctx.storage.get("m"); return m ? { padrino: m.padrino || "", pagado: m.padrinoPagado ? 1 : 0 } : null; }
  async marcarPadrinoPagado() { const m = await this.ctx.storage.get("m"); if (!m) return; m.padrinoPagado = 1; await this.ctx.storage.put("m", m); }
  // Gastar saldo: se descuenta lo que haya (nunca más de lo que hay); devuelve cuánto se usó.
  async usarSaldo(monto) { const m = await this.ctx.storage.get("m"); if (!m) return 0; const usa = Math.max(0, Math.min(m.saldo || 0, monto | 0)); if (usa) { m.saldo -= usa; this.refDe(m).gastado += usa; await this.ctx.storage.put("m", m); } return usa; }
  // ── La Pinturería: lo comprado y la pintura son de la maquinita (y la maquinita, de su cuenta).
  tiendaDe(m) { return m.tienda || (m.tienda = { nivel: 0, mecenas: 0, compras: [] }); }
  gastado30(t) { const h = Date.now() - 30 * 86400000; return t.compras.filter((c) => c.h > h).reduce((a, c) => a + (c.monto || 0), 0); }      // solo dinero real: el saldo de referidos no cuenta para el tope
  vistaTienda(m) { const t = this.tiendaDe(m), r = this.refDe(m); return { nivel: t.nivel, mecenas: t.mecenas, compras: t.compras.length, gastado30: this.gastado30(t), pinta: this.pintaPublica(m), saldo: m.saldo || 0, padrino: m.padrino ? 1 : 0, ref: { clics: r.clics, llegaron: r.llegaron, cuentas: r.cuentas, ganado: r.ganado, gastado: r.gastado, lista: r.lista.slice(-60).reverse().map((x) => ({ n: x.n, h: x.h, monto: x.monto })) } }; }
  async tienda() { const m = await this.ctx.storage.get("m"); return m ? this.vistaTienda(m) : { nivel: 0, mecenas: 0, compras: 0, gastado30: 0, pinta: {}, saldo: 0, padrino: 0, ref: { clics: 0, llegaron: 0, cuentas: 0, ganado: 0, gastado: 0, lista: [] } }; }
  async cerrarExperimento() { const m = await this.ctx.storage.get("m"); if (!m) return null; const t = this.tiendaDe(m), o = (t.exp || [])[t.exp.length - 1]; if (o && o.r === "abierto") { o.r = "ignorado"; await this.ctx.storage.put("m", m); } return o; }
  async ponerSenales(seg, rec, tot) { const m = await this.ctx.storage.get("m"); if (!m) return null; m.est = { ...(m.est || {}), seg, rec, tot }; await this.ctx.storage.put("m", m); return 1; }
  // La oferta de esta maquinita: el experimento abierto (nivel sugerido y descuento), o uno nuevo si el anterior venció.
  async oferta(global, abrir) {
    const m = await this.ctx.storage.get("m"); if (!m) return null;
    const t = this.tiendaDe(m); t.exp = t.exp || [];
    let o = t.exp[t.exp.length - 1], cambio = false;
    if (o && o.r === "abierto" && Date.now() - o.h > OFERTA_DIAS * 86400000) { o.r = o.vistas ? "ignorado" : "sinver"; cambio = true; o = null; }
    if (!o || o.r !== "abierto") {
      const c = motorConfort(m, global);
      o = { n: t.exp.filter((x) => x.r !== "abierto").length + 1, nivel: c.nivel, desc: c.desc, h: Date.now(), vistas: 0, r: "abierto", s: c.s };
      t.exp = t.exp.concat(o).slice(-24); cambio = true;
    }
    if (abrir) { o.vistas++; t.vistas = (t.vistas || 0) + 1; cambio = true; }
    if (cambio) await this.ctx.storage.put("m", m);
    return { nivel: o.nivel, desc: o.desc, hasta: o.h + OFERTA_DIAS * 86400000, n: o.n, de: EXPERIMENTOS, s: o.s, cumple: t.cumple || "", seg: (m.est || {}).seg || 0, gratitud: t.gratitud || 0 };
  }
  // Entregar una compra: una sola vez por sesión de pago; el nivel solo sube.
  async entregar({ sid, tipo, nivel, monto, de, desc, motivo, saldo }) {
    const m = await this.ctx.storage.get("m"); if (!m) return null;
    const t = this.tiendaDe(m); let nuevo = 0;
    if (!t.compras.some((c) => c.sid === sid)) {
      nuevo = 1;
      t.compras = t.compras.concat({ sid, tipo, n: nivel || 0, monto: monto || 0, de: de || "", h: Date.now(), ...(motivo ? { motivo } : {}), ...(saldo ? { saldo } : {}) }).slice(-200);
      if (motivo === "gratitud") t.gratitud = Date.now();
      if (tipo === "nivel") t.nivel = Math.max(t.nivel, nivel || 0);
      if (tipo === "nivel" && desc !== undefined && desc !== null) {           // el experimento abierto se cierra como comprado; ese descuento es su punto cómodo
        t.exp = t.exp || []; const o = t.exp[t.exp.length - 1]; if (o && o.r === "abierto") { o.r = "comprado"; o.desc = desc; o.hc = Date.now(); }
        t.confort = desc;
      }
      if (tipo === "mecenas") t.mecenas = (t.mecenas || 0) + (monto || 0);
      await this.ctx.storage.put("m", m);
    }
    return { ...this.vistaTienda(m), nuevo };
  }
  // La pintura: se guarda solo lo que el nivel comprado permite.
  async ponerPinta(p) { const m = await this.ctx.storage.get("m"); if (!m) return null; const t = this.tiendaDe(m); m.pinta = filtrarPinta(p, t.nivel); await this.ctx.storage.put("m", m); return { p: this.pintaPublica(m), nv: t.nivel, me: t.mecenas > 0 ? 1 : 0 }; }

  // Lo que la cuenta enseña de ella: nombre, modelo, cuánto ha ganado, hasta dónde bajó y cuánto ha jugado.
  async resumen() {
    const m = await this.ctx.storage.get("m");
    if (!m) return null;
    const e = m.est || {};
    return { n: m.n, m: m.mo || 0, tot: Number.isFinite(e.tot) ? Math.floor(e.tot) : 0, rec: entero(e.rec, 0, H * 2, 0), seg: entero(e.seg, 0, 4e9, 0), mundo: m.mundo || "", nv: (m.tienda && m.tienda.nivel) || 0, saldo: m.saldo || 0, vista: m.vista || 0 };
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
const esMia = (c, k) => !!c && !!k && (c.k === k || (Array.isArray(c.maqs) && c.maqs.some((x) => x.k === k)));      // una maquinita del garaje de la cuenta
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
  // El garaje: todas las maquinitas de la cuenta. `k` es la que se usó por última vez (la que toma un equipo nuevo).
  garajeDe(c) { if (!Array.isArray(c.maqs)) c.maqs = c.k ? [{ k: c.k, h: c.alta || Date.now() }] : []; return c.maqs; }
  meter(c, k) { const g = this.garajeDe(c); if (llaveOk(k) && !g.some((x) => x.k === k) && g.length < 50) g.push({ k, h: Date.now() }); }
  vista(c) { return { k: c.k, maqs: this.garajeDe(c).map((x) => x.k), email: c.email, nombre: c.nombre, foto: c.foto, mundos: c.mundos, duenos: c.duenos }; }
  // El garaje con sus fichas: nombre, modelo, dinero, récord, tiempo, nivel de pintura y en qué mundo anda cada maquinita.
  async garaje(t) {
    const c = await this.sesion(t); if (!c) return null;
    const g = this.garajeDe(c), fichas = await Promise.all(g.map(async (x) => { try { const r = await this.env.MAQUINA.get(this.env.MAQUINA.idFromName(x.k)).resumen(); return { k: x.k, h: x.h, ...(r || { n: "", m: 0, tot: 0, rec: 0, seg: 0, vacia: 1 }) }; } catch { return { k: x.k, h: x.h, n: "", m: 0, tot: 0, rec: 0, seg: 0 }; } }));
    return { k: c.k, maqs: fichas };
  }
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
    this.garajeDe(c); if (nueva) this.meter(c, d.k);
    for (const k of Array.isArray(d.garaje) ? d.garaje.slice(0, 50) : []) if (nueva || k === c.k) this.meter(c, k);
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
    for (const k of Array.isArray(d.garaje) ? d.garaje.slice(0, 50) : []) this.meter(c, k);      // las maquinitas que este equipo ya tenía en su garaje
    await this.ctx.storage.put("c", c);
    return this.vista(c);
  }
  // El garaje cambia: «usar» (pasa a ser la de ahora, y entra al garaje si no estaba), «agregar» (entra sin cambiar la de
  // ahora), «nueva» (una recién creada), «quitar» (sale del garaje; nunca la última).
  async maquina(t, k, accion) {
    const c = await this.sesion(t);
    if (!c || !llaveOk(k)) return null;
    const g = this.garajeDe(c);
    if (accion === "quitar") { if (g.length <= 1) return { ...this.vista(c), error: "ultima" }; c.maqs = g.filter((x) => x.k !== k); if (c.k === k) c.k = c.maqs[0].k; }
    else if (accion === "agregar") this.meter(c, k);
    else { this.meter(c, k); c.k = k; }
    c.visto = Date.now();
    await this.ctx.storage.put("c", c);
    return this.vista(c);
  }
  // Las capturas de pantalla: la lista vive aquí (la imagen, en R2). Por cuenta, con su mundo, su profundidad y su fecha.
  async agregarCaptura(t, cap) { const c = await this.sesion(t); if (!c) return null; c.capturas = (c.capturas || []).concat(cap).slice(-800); await this.ctx.storage.put("c", c); return { sub: c.sub, n: c.capturas.length }; }
  async capturas(t) { const c = await this.sesion(t); return c ? { sub: c.sub, capturas: c.capturas || [], mundos: c.mundos || [] } : null; }
  async quitarCaptura(t, id) { const c = await this.sesion(t); if (!c) return null; c.capturas = (c.capturas || []).filter((x) => x.id !== id); await this.ctx.storage.put("c", c); return { sub: c.sub }; }
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
  // El pase de la casa (login.capitaltorreon.com): se verifica aquí mismo con su llave pública.
  if (cred.split(".").length === 3 && cred.startsWith("eyJ")) { try { const c = JSON.parse(atob(cred.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))); if (c.iss === "https://login.capitaltorreon.com") { const q = await verificarPase(cred); return q && /^\d{1,40}$/.test(q.sub || "") ? { sub: q.sub, email: limpio(q.email, 120), nombre: limpio(q.name, 60), foto: /^https:\/\/[a-z0-9.-]+\.googleusercontent\.com\/[^\s"'<>]*$/.test(q.picture || "") ? String(q.picture).slice(0, 400) : "" } : null; } } catch {} }
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
    // Cuenta nueva de una maquinita que nació con la liga de alguien: a ese alguien le entran $333 de saldo, una sola vez.
    if (r.nueva && llaveOk(r.k)) {
      try {
        const maqDe = (k) => env.MAQUINA.get(env.MAQUINA.idFromName(k)), pd = await maqDe(r.k).padrinoDe();
        if (pd && pd.padrino && !pd.pagado && pd.padrino !== r.k && llaveOk(pd.padrino)) {
          await maqDe(r.k).marcarPadrinoPagado();
          const a = await maqDe(pd.padrino).acreditarReferido({ n: (r.maq && r.maq.n) || "", de: await sha(g.sub) });
          if (a && !a.repetido && a.mundo) { try { await env.MUNDO.get(env.MUNDO.idFromName(a.mundo)).avisarMaquina(pd.padrino, { t: "ref", n: (r.maq && r.maq.n) || "alguien", saldo: a.saldo, cuentas: a.cuentas, premio: REFERIDO_PREMIO }); } catch {} }
          r.padrinoPremiado = 1;
        }
      } catch {}
    }
    if (llaveOk(d.k) && d.k !== r.k) r.aqui = await resumen(d.k);      // este equipo traía otra maquinita: se enseñan las dos
    return json(r);
  }
  const ses = String(d.ses || ""), punto = ses.lastIndexOf("."), sub = ses.slice(0, punto), t = ses.slice(punto + 1);
  if (punto < 1 || !/^[0-9A-Za-z]{1,40}$/.test(sub) || !/^[0-9a-f]{48}$/.test(t)) return json({ error: "sesion" }, 401);
  const c = cuenta(sub);
  if (u.pathname === "/api/cuenta/sync") { const r = await c.sync(t, d); return r ? json(r) : json({ error: "sesion" }, 401); }
  if (u.pathname === "/api/cuenta/maquina") { const r = await c.maquina(t, d.k, ["usar", "agregar", "nueva", "quitar"].includes(d.accion) ? d.accion : "usar"); if (!r) return json({ error: "sesion" }, 401); r.maq = await resumen(r.k); return json(r); }
  if (u.pathname === "/api/cuenta/garaje") { const r = await c.garaje(t); return r ? json(r) : json({ error: "sesion" }, 401); }
  if (u.pathname === "/api/cuenta/salir") { await c.salir(t); return json({ ok: 1 }); }
  return json({ error: "no" }, 404);
}

// RLR · La Pinturería (ver docs/ADN_Monetizacion_Mina): se juega completo gratis; aquí solo se vende cómo se ve la maquinita.
// Precios iguales para todos y en un solo lugar (src/tienda.js). Subir de nivel cuesta la diferencia. Tope de cuidado por
// maquinita cada 30 días. Para comprar hay que entrar con la cuenta, y la maquinita debe ser la de esa cuenta.
async function tiendaApi(u, request, env) {
  if (request.method !== "POST") return json({ error: "no" }, 404);
  let d; try { d = await request.json(); } catch { return json({ error: "datos" }, 400); }
  if (!d || typeof d !== "object") return json({ error: "datos" }, 400);
  const llaveOk = (k) => typeof k === "string" && /^[0-9a-zA-Z]{16,64}$/.test(k);
  const maq = (k) => env.MAQUINA.get(env.MAQUINA.idFromName(k));
  const tabla = () => env.TABLA.get(env.TABLA.idFromName("mundial"));
  const stripe = await secreto(env.STRIPE_SECRET_KEY);
  if (u.pathname === "/api/tienda") {
    const mio = llaveOk(d.k) ? await maq(d.k).tienda() : { nivel: 0, mecenas: 0, compras: 0, gastado30: 0, pinta: {} };
    let fondo = 0, eco = { desc0: 0 }, oferta = null; try { fondo = await tabla().fondo(); eco = await tabla().economia(); } catch {}
    if (llaveOk(d.k)) { try { oferta = await maq(d.k).oferta(eco, true); } catch {} }
    // el momento (hora de Torreón): lo que hoy, a esta hora y con este ánimo, baja el precio. Solo baja.
    const mom = momento(Date.now(), { tienda: { cumple: oferta && oferta.cumple }, est: { seg: oferta ? oferta.seg : 0 } }, d.animo);
    return json({ niveles: NIVELES, referidoPremio: REFERIDO_PREMIO, mecenasMin: MECENAS_MIN, gratitudMin: GRATITUD_MIN, gratitudHora: GRATITUD_HORA, fondoPrecio: FONDO_PRECIO, tope: TOPE_MES, fondo, pagos: stripe ? 1 : 0, mio, oferta, momento: mom, cumple: (oferta && oferta.cumple) || "", gratitud: (oferta && oferta.gratitud) || 0 });
  }
  // El cumpleaños (día y mes, nada más): para el gorrito ese día y, si entró con su cuenta, el correo de gratitud a las 3:33 pm.
  if (u.pathname === "/api/tienda/cumple") {
    if (!llaveOk(d.k)) return json({ error: "datos" }, 400);
    const md = d.md ? String(d.md) : ""; if (md && !cumpleOk(md)) return json({ error: "fecha" }, 400);
    const r = await maq(d.k).ponerCumple(md); if (!r) return json({ error: "maquina" }, 404);
    let correo = 0;
    const ses = String(d.ses || ""), punto = ses.lastIndexOf("."), sub = ses.slice(0, punto), tk = ses.slice(punto + 1);
    if (punto > 0 && /^[0-9A-Za-z]{1,40}$/.test(sub) && /^[0-9a-f]{48}$/.test(tk)) {
      const c = await env.CUENTA.get(env.CUENTA.idFromName("g:" + sub)).sesion(tk);
      if (c && esMia(c, d.k) && c.email) { try { await tabla().ponerCumple(d.k, md ? { md, correo: c.email, nombre: c.nombre || "", mundo: /^[2-9A-HJ-NP-Z]{8}$/.test(String(d.mundo || "")) ? d.mundo : "" } : null); correo = md ? 1 : 0; } catch {} }
    }
    return json({ ok: 1, cumple: r.cumple, p: r.p, correo });
  }
  // Solo en la computadora de pruebas (MINA_PRUEBA en .dev.vars, nunca publicado): entregar un nivel sin pagar, para probar la tienda.
  if (u.pathname === "/api/tienda/prueba") {
    if (env.MINA_PRUEBA !== "1" || !["::1", "127.0.0.1"].includes(request.headers.get("CF-Connecting-IP")) || !llaveOk(d.k)) return json({ error: "no" }, 404);
    if (d.exp === "cerrar") { const o = await maq(d.k).cerrarExperimento(); return json({ ok: 1, cerrado: o }); }      // cerrar el experimento abierto como ignorado (solo pruebas)
    if (d.exp === "referido") { const a = await maq(d.k).acreditarReferido({ n: d.n || "Prueba", de: "prueba-" + Date.now() }); return json({ ok: 1, a }); }
    if (d.exp === "momento") return json({ ok: 1, momento: momento(d.ts || Date.now(), { tienda: { cumple: d.cumple }, est: { seg: d.seg || 0 } }, d.animo) });
    if (d.exp === "senales") { const m = await env.MAQUINA.get(env.MAQUINA.idFromName(d.k)).ponerSenales(d.seg, d.rec, d.tot); return json({ ok: 1, m }); }
    const e = await maq(d.k).entregar({ sid: "prueba-" + Date.now(), tipo: d.tipo === "mecenas" ? "mecenas" : "nivel", nivel: entero(d.nivel, 0, 10, 0), monto: entero(d.monto, 0, 1e6, 0), de: "prueba", desc: d.desc });
    return e ? json({ ok: 1, mio: e }) : json({ error: "maquina" }, 404);
  }
  if (u.pathname === "/api/tienda/pagar") {
    const ses = String(d.ses || ""), punto = ses.lastIndexOf("."), sub = ses.slice(0, punto), tk = ses.slice(punto + 1);
    if (punto < 1 || !/^[0-9A-Za-z]{1,40}$/.test(sub) || !/^[0-9a-f]{48}$/.test(tk)) return json({ error: "cuenta" }, 401);
    const c = await env.CUENTA.get(env.CUENTA.idFromName("g:" + sub)).sesion(tk);
    if (!c || !llaveOk(d.k) || !esMia(c, d.k)) return json({ error: "cuenta" }, 401);
    let volver = u.origin + "/"; try { const x = new URL(String(d.volver || ""), u.origin); if (x.origin === u.origin) volver = x.origin + x.pathname; } catch {}
    const tipo = d.tipo === "mecenas" ? "mecenas" : d.tipo === "fondo" ? "fondo" : "nivel";
    let monto = 0, nombre = "", para = d.k, nivel = 0, cantidad = 1, desc = 0, ajuste = 0, momentoTx = "", motivo = "";
    if (tipo === "nivel") {
      nivel = entero(d.nivel, 1, 10, 0); if (!nivel) return json({ error: "datos" }, 400);
      // regalo: la maquinita número i de un mundo (su llave la da el mundo, nunca el navegador)
      if (Number.isInteger(d.paraI) && d.paraI >= 0 && /^[2-9A-HJ-NP-Z]{8}$/.test(String(d.mundo || ""))) { const k2 = await env.MUNDO.get(env.MUNDO.idFromName(d.mundo)).llaveDe(d.paraI); if (llaveOk(k2) && k2 !== d.k) para = k2; else return json({ error: "regalo" }, 400); }
      const actual = (await maq(para).tienda()).nivel;
      if (nivel <= actual) return json({ error: "ya", actual }, 400);
      monto = precioDe(nivel) - precioDe(actual);
      // el precio exacto de esta persona: su descuento del motor de confort (solo para ella, nunca arriba de lista; los regalos van a lista)
      if (para === d.k) {
        let eco = { desc0: 0 }; try { eco = await tabla().economia(); } catch {}
        const o = await maq(d.k).oferta(eco, false), mom = momento(Date.now(), { tienda: { cumple: o && o.cumple }, est: { seg: o ? o.seg : 0 } }, d.animo);
        desc = o && o.desc > 0 ? o.desc : 0; ajuste = mom.ajuste; monto = precioFinal(monto, desc, ajuste);
        if (mom.partes.length) momentoTx = mom.partes.map((p) => p[0]).join(", ");
      }
      nombre = `Mina · La Pinturería · nivel ${nivel} «${NIVELES[nivel - 1].nombre}»` + (para !== d.k ? " · regalo" : "") + (actual ? ` (solo la diferencia desde el nivel ${actual})` : "") + (desc || ajuste ? ` · tu precio (${Math.round((1 - monto / (precioDe(nivel) - precioDe(actual))) * 100)} % menos${momentoTx ? ": " + momentoTx : ""})` : "");
    } else if (tipo === "mecenas") {
      // La gratitud de cumpleaños: cerca de su cumpleaños (tres días antes o después) se puede dar desde $33.
      if (d.motivo === "gratitud") { const o = await maq(d.k).oferta({ desc0: 0 }, false); if (o && cumpleCerca(o.cumple, horaTorreon()) !== 9) motivo = "gratitud"; }
      monto = entero(d.monto, motivo ? GRATITUD_MIN : MECENAS_MIN, 100000, 0); if (!monto) return json({ error: "datos" }, 400);
      nombre = motivo ? "Mina · 🎂 Gracias de cumpleaños · para quien hace Mina" : "Mina · ✦ Mecenas · gracias por sostener el juego";
    } else {
      cantidad = entero(d.cantidad, 1, 200, 0); if (!cantidad) return json({ error: "datos" }, 400);
      monto = FONDO_PRECIO * cantidad; nombre = `Mina · Fondo común · la primera pintura de ${cantidad} ${cantidad === 1 ? "maquinita nueva" : "maquinitas nuevas"}`;
    }
    const mio = await maq(d.k).tienda();
    // El saldo de referidos paga niveles (propios o de regalo). Si alcanza, se entrega aquí mismo; si no, Stripe cobra el resto.
    let usaSaldo = 0;
    if (tipo === "nivel" && d.saldo && (mio.saldo || 0) > 0) {
      usaSaldo = Math.min(mio.saldo, monto);
      if (usaSaldo >= monto) {
        const usado = await maq(d.k).usarSaldo(monto); if (usado < monto) return json({ error: "saldo" }, 400);
        const e = await maq(para).entregar({ sid: "saldo-" + Date.now() + "-" + hex(crypto.getRandomValues(new Uint8Array(4))), tipo, nivel, monto: 0, saldo: monto, de: sub, desc: para === d.k ? desc : undefined });
        if (!e) return json({ error: "maquina" }, 404);
        return json({ ok: 1, saldo: 1, tipo, nivel, regalo: para !== d.k ? 1 : 0, usado: monto, mio: await maq(d.k).tienda() });
      }
    }
    const cobra = monto - usaSaldo;
    if (!stripe) return json({ error: "pronto" }, 503);      // con tarjeta solo cuando hay con qué cobrar; el saldo ya se atendió arriba
    if ((mio.gastado30 || 0) + cobra > TOPE_MES) return json({ error: "tope", gastado: mio.gastado30 }, 400);      // el tope de cuidado: solo el dinero real
    const f = new URLSearchParams();
    f.set("mode", "payment"); f.set("success_url", volver + "?compra={CHECKOUT_SESSION_ID}"); f.set("cancel_url", volver + "?tienda=" + (nivel || 1));
    f.set("line_items[0][quantity]", "1"); f.set("line_items[0][price_data][currency]", "mxn"); f.set("line_items[0][price_data][unit_amount]", String(cobra * 100)); f.set("line_items[0][price_data][product_data][name]", nombre);
    f.set("metadata[k]", d.k); f.set("metadata[para]", para); f.set("metadata[tipo]", tipo); f.set("metadata[nivel]", String(nivel)); f.set("metadata[cantidad]", String(cantidad)); f.set("metadata[monto]", String(monto)); f.set("metadata[de]", sub); f.set("metadata[desc]", String(desc)); f.set("metadata[ajuste]", String(ajuste)); if (motivo) f.set("metadata[motivo]", motivo); if (usaSaldo) f.set("metadata[saldo]", String(usaSaldo));
    f.set("locale", "es-419"); if (c.email) f.set("customer_email", c.email);
    let r, sesion; try { r = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { authorization: "Bearer " + stripe, "content-type": "application/x-www-form-urlencoded" }, body: f }); sesion = await r.json(); } catch { return json({ error: "stripe" }, 502); }
    if (!r.ok || !sesion.url) return json({ error: "stripe" }, 502);
    return json({ url: sesion.url, monto: cobra, saldo: usaSaldo });
  }
  // Al volver de pagar: se le pregunta a Stripe si de verdad se pagó, y entonces se entrega (una sola vez por sesión).
  if (u.pathname === "/api/tienda/confirmar") {
    if (!stripe) return json({ error: "pronto" }, 503);
    const sid = String(d.sid || ""); if (!/^cs_[A-Za-z0-9_]{10,200}$/.test(sid)) return json({ error: "datos" }, 400);
    let r, sesion; try { r = await fetch("https://api.stripe.com/v1/checkout/sessions/" + sid, { headers: { authorization: "Bearer " + stripe } }); sesion = await r.json(); } catch { return json({ error: "stripe" }, 502); }
    if (!r.ok || sesion.payment_status !== "paid" || !sesion.metadata) return json({ error: "nopagado" }, 402);
    const md = sesion.metadata, tipo = md.tipo, monto = entero(md.monto, 0, 1e6, 0), nivel = entero(md.nivel, 0, 10, 0), cantidad = entero(md.cantidad, 0, 200, 0);
    if (!llaveOk(md.k)) return json({ error: "datos" }, 400);
    const para = llaveOk(md.para) ? md.para : md.k;
    let e = null;
    const desc = Math.max(0, Math.min(0.6, Number(md.desc) || 0));
    if (tipo === "nivel") {
      const conSaldo = entero(md.saldo, 0, 1e6, 0), usado = conSaldo ? await maq(md.k).usarSaldo(conSaldo) : 0;      // lo que se reservó de saldo se descuenta al confirmar
      e = await maq(para).entregar({ sid, tipo, nivel, monto: monto - conSaldo, saldo: usado, de: md.de, desc: para === md.k ? desc : undefined }); if (e && e.nuevo && para === md.k) { try { await tabla().anotarCompra(desc); } catch {} }
    }
    else if (tipo === "mecenas") e = await maq(md.k).entregar({ sid, tipo, monto, de: md.de, motivo: md.motivo === "gratitud" ? "gratitud" : "" });
    else if (tipo === "fondo") { e = await maq(md.k).entregar({ sid, tipo, monto, de: md.de }); if (e && e.nuevo) await tabla().sumarFondo(Math.max(1, cantidad)); }
    if (!e) return json({ error: "maquina" }, 404);
    return json({ ok: 1, tipo, nivel, regalo: para !== md.k ? 1 : 0, cantidad, monto, motivo: md.motivo || "", mio: await maq(md.k).tienda() });
  }
  return json({ error: "no" }, 404);
}

// RLR · las capturas de pantalla: se guardan en R2 por cuenta y por mundo; la lista, en la cuenta. Se ven desde cualquier equipo.
async function capturasApi(u, request, env) {
  const sesionDe = (ses) => { const punto = ses.lastIndexOf("."), sub = ses.slice(0, punto), tk = ses.slice(punto + 1); if (punto < 1 || !/^[0-9A-Za-z]{1,40}$/.test(sub) || !/^[0-9a-f]{48}$/.test(tk)) return null; return { sub, tk, c: env.CUENTA.get(env.CUENTA.idFromName("g:" + sub)) }; };
  if (u.pathname === "/api/capturas/subir" && request.method === "POST") {
    const s = sesionDe(request.headers.get("x-sesion") || ""); if (!s) return json({ error: "cuenta" }, 401);
    const mundo = (request.headers.get("x-mundo") || "").toUpperCase(); if (!/^[2-9A-HJ-NP-Z]{8}$/.test(mundo)) return json({ error: "mundo" }, 400);
    let nombre = ""; try { nombre = limpio(decodeURIComponent(request.headers.get("x-nombre") || ""), 24); } catch {}
    const metros = entero(request.headers.get("x-metros"), -100000, 100000, 0);
    const cuerpo = new Uint8Array(await request.arrayBuffer());
    if (cuerpo.length < 400 || cuerpo.length > 1600000 || cuerpo[0] !== 0xff || cuerpo[1] !== 0xd8) return json({ error: "imagen" }, 400);      // solo JPEG, con tope de peso
    const id = hex(crypto.getRandomValues(new Uint8Array(8)));
    const r = await s.c.agregarCaptura(s.tk, { id, mundo, h: Date.now(), m: metros, kb: Math.round(cuerpo.length / 1024), n: nombre });
    if (!r) return json({ error: "cuenta" }, 401);
    await env.CAPTURAS.put(`cap/${s.sub}/${mundo}/${id}.jpg`, cuerpo, { httpMetadata: { contentType: "image/jpeg", cacheControl: "public, max-age=31536000, immutable" } });
    return json({ ok: 1, id, url: `/capturas/${s.sub}/${mundo}/${id}.jpg`, total: r.n });
  }
  if (request.method !== "POST") return json({ error: "no" }, 404);
  let d; try { d = await request.json(); } catch { return json({ error: "datos" }, 400); }
  const s = sesionDe(String((d && d.ses) || "")); if (!s) return json({ error: "cuenta" }, 401);
  if (u.pathname === "/api/capturas") { const r = await s.c.capturas(s.tk); return r ? json({ sub: r.sub, capturas: r.capturas, mundos: r.mundos.map((m) => ({ id: m.id, nombre: m.nombre })) }) : json({ error: "cuenta" }, 401); }
  if (u.pathname === "/api/capturas/borrar") {
    const id = String(d.id || ""), mundo = String(d.mundo || "").toUpperCase();
    if (!/^[0-9a-f]{16}$/.test(id) || !/^[2-9A-HJ-NP-Z]{8}$/.test(mundo)) return json({ error: "datos" }, 400);
    const r = await s.c.quitarCaptura(s.tk, id); if (!r) return json({ error: "cuenta" }, 401);
    await env.CAPTURAS.delete(`cap/${s.sub}/${mundo}/${id}.jpg`);
    return json({ ok: 1 });
  }
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

  // La cita, si sigue vigente (hasta tres horas después de la hora); si ya pasó, se olvida.
  citaViva(m) { if (m.cita && m.cita.h > Date.now() - 3 * 3600000) return m.cita; if (m.cita) { m.cita = null; this.sucio.meta = true; } return null; }
  // Para la vista previa de la liga: cómo se llama el mundo y cuántas maquinitas tiene.
  // Con «j» (el número de una maquinita) devuelve también su ficha: la liga de un jugador presume lo suyo.
  async ficha(j, clic) {
    const m = await this.cargar();
    if (!m) return null;
    const p = Number.isInteger(j) && this.jug[j] ? this.jug[j] : null;
    if (clic && p) { try { await this.maquina(p.k).anotarRef("clics"); } catch {} }      // alguien abrió la liga con ?de=: cuenta como clic para quien invita
    let rec = 0; for (const x of this.jug) if (x && (x.rec || 0) > rec) rec = x.rec;
    const cita = this.citaViva(m);
    return { n: m.cfg.nombre || "", j: this.jug.filter(Boolean).length, on: this.conectados().size, og: m.og || 0, rec, col: (m.col || []).length, cita: cita ? { h: cita.h, voy: (cita.voy || []).length } : null,
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
    return { i, n: j.n, m: j.m, rec: j.rec || 0, tot: j.tot || 0, on: on ? 1 : 0, p: j.p || {}, me: j.me || 0, ...(j.de >= 0 ? { de: j.de } : {}), alta: j.alta || 0 };
  }
  // Para regalar: la llave de la maquinita número i (nunca sale al navegador; la usa la tienda del lado del servidor).
  async llaveDe(i) { await this.cargar(); const j = this.jug[i]; return j ? j.k : ""; }

  difundir(msg, menos) {
    const s = crudo(msg) ? msg : JSON.stringify(msg);
    for (const ws of this.ctx.getWebSockets()) {
      if (ws === menos || !ws.deserializeAttachment()) continue;
      manda(ws, s);
    }
  }

  // Un aviso a una maquinita por su llave, si está conectada aquí (por ejemplo: «alguien que trajiste abrió su cuenta»).
  async avisarMaquina(k, msg) { const i = this.jug.findIndex((j) => j && j.k === k); if (i < 0) return 0; const ws = this.socketDe(i); if (!ws) return 0; manda(ws, msg); return 1; }
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
        const a = entero(d.a, 0, MAX_MAQUINITAS, -1), otro = this.socketDe(a);
        if (!otro || otro === ws || !this.jug[a]) return;
        manda(otro, { t: "golpe", i, q: entero(d.q, 1, 1000, 20), k: entero(d.k, 0, 3, 0), v: d.v ? 1 : 0 });
        // El pleito como tal: al primer golpe entre dos, todo el mundo (también quien mira) se entera; al ganar, también.
        this.peleas = this.peleas || new Map();
        const llave = Math.min(i, a) + "|" + Math.max(i, a), ahora = Date.now(), p = this.peleas.get(llave);
        if (d.v) { this.peleas.delete(llave); this.difundir({ t: "pleitoFin", g: a, p: i }); return; }
        if (!p || ahora - p.h > 6000) { const xy = this.xy.get(i) || this.xy.get(a) || [48, 0], x = entero(d.x, 0, W, xy[0]), y = entero(d.y, -100000, H, xy[1]); this.difundir({ t: "pleito", a: i, b: a, x: Math.round(x), y: Math.round(y) }); }
        this.peleas.set(llave, { h: ahora });
        return;
      }
      case "vida": {             // en un pleito, cada quien dice cuánta vida le queda: lo ven los dos y quien mira
        const ahora = Date.now(); if (ahora - (yo.vidaT || 0) < 120) return; yo.vidaT = ahora;
        this.difundir({ t: "vida", i, v: entero(d.v, 0, 1e6, 0), mx: entero(d.mx, 1, 1e6, 1) }, ws);
        return;
      }
      case "cita": {             // «nos vemos a las…»: cualquiera propone (o quita) la hora; quien la propone ya va
        const h = entero(d.h, 0, 4102444800000, 0), ahora = Date.now();
        if (h && (h < ahora - 3600000 || h > ahora + 30 * DIA)) return;
        if (h && (yo.citaT || 0) > ahora - 20000) return;        // una propuesta cada 20 s por maquinita
        yo.citaT = ahora;
        m.cita = h ? { h, i, voy: [i] } : null;
        this.sucio.meta = true;
        this.difundir({ t: "cita", cita: m.cita });
        break;
      }
      case "voy": {              // confirmar (o desconfirmar) que uno va a la cita
        if (!m.cita) return;
        const voy = new Set(m.cita.voy || []); if (d.si) voy.add(i); else voy.delete(i);
        m.cita.voy = [...voy]; this.sucio.meta = true;
        this.difundir({ t: "cita", cita: m.cita });
        break;
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
      case "pinta": {            // la pintura de la maquinita: la valida su propio objeto contra el nivel comprado
        let r = null; try { r = await this.maquina(yo.k).ponerPinta(d.p); } catch { return; }
        if (!r) return; yo.p = r.p; yo.nv = r.nv; yo.me = r.me; this.sucio.jug.add(i);
        this.difundir({ t: "pinta", i, p: r.p, me: r.me });
        break;
      }
      case "bocina": {           // el claxon: lo oyen los demás, a lo mucho uno por segundo
        const ahora = Date.now(); if (ahora - (yo.bocT || 0) < 900) return; yo.bocT = ahora;
        this.difundir({ t: "bocina", i, b: entero(d.b, 0, 5, 0) }, ws);
        break;
      }
      case "acepto": case "rechazo": case "sacar": case "perdonar": case "quitar": case "devolver":
        if (i !== this.creador()) return;
        await this.ordenDueno(d, i);
        return;
      case "fin": {              // el Jardín del Fondo quedó completo: los minerales que quedaban se reparten en partes iguales entre todas las maquinitas del mundo
        if (!m.fin || m.fin.r !== m.remin) {
          const n = Math.max(1, this.jug.filter(Boolean).length), total = Number.isFinite(d.total) && d.total >= 0 ? Math.min(d.total, 1e16) : 0;
          m.fin = { h: Date.now(), i, r: m.remin, n, total, parte: Math.floor(total / n) };
          m.piedras = this.jug.filter((j) => j && (j.nv || 0) >= 9).map((j) => j.n).slice(0, 40);      // las piedras con nombre del Jardín (nivel 9 de La Pinturería)
        }
        m.sinMineral = m.remin; this.sucio.meta = true;      // queda de pura tierra hasta remineralizar
        this.difundir({ ...m.fin, t: "fin", piedras: m.piedras || [] });               // a todos, también a quien perforó el Corazón: así todos arrancan con el mismo reparto
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
    const deI = entero(d.de, 0, MAX_MAQUINITAS - 1, -1), padrinoK = i < 0 && deI >= 0 && this.jug[deI] && this.jug[deI].k !== k ? this.jug[deI].k : "";
    let r = null;
    try {
      r = await this.maquina(k).entrar({ mundo: m.id, k, n: n.length >= 2 ? n : (viejo0 ? viejo0.n : ""), mo: n.length >= 2 ? entero(d.m, 0, 7, 0) : (viejo0 ? viejo0.m : 0), est: viejo0 ? viejo0.est : null, padrino: padrinoK });
    } catch { try { ws.close(1011, "reintenta"); } catch {} return; }      // el navegador vuelve a intentar solo
    if (!r) {
      manda(ws, { t: "nuevo", nombre: m.cfg.nombre, puerta: m.cfg.puerta, hay: this.jug.filter(Boolean).length });
      return;
    }
    i = this.jug.findIndex((j) => j && j.k === k);            // se vuelve a buscar: mientras se esperaba pudo entrar alguien más
    let estrena = false, primera = false;
    if (i < 0) {
      primera = true;
      estrena = this.jug.length > 0 && this.jug.length < 10;   // maquinita nueva en un mundo que ya tiene gente: todos ganan
      if (m.cfg.puerta && this.jug.length && !(m.ok || []).includes(k)) return fin({ t: "cerrado", ver: m.cfg.mirar !== 0 ? m.ver || "" : "" });      // con la puerta cerrada se entra a mirar, y desde ahí se pide permiso
      if (this.jug.length >= MAX_MAQUINITAS) return fin({ t: "lleno" });
      i = this.jug.length;
      const de = entero(d.de, 0, MAX_MAQUINITAS - 1, -1);          // llegó con la liga de alguien: queda apuntado quién la trajo
      this.jug[i] = { k, n: r.n, m: r.mo, est: r.est, rec: 0, tot: 0, alta: Date.now(), ...(de >= 0 && de < i && this.jug[de] ? { de } : {}) };
      if (padrinoK) { try { await this.maquina(padrinoK).anotarRef("llegaron"); } catch {} }
      m.n = this.jug.length;
      await this.ctx.storage.put({ ["j:" + i]: this.jug[i], meta: m });
    }
    const yo = this.jug[i];
    yo.n = r.n; yo.m = r.mo; yo.est = r.est; yo.p = r.p || {}; yo.nv = r.nv || 0; yo.me = r.me || 0;
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
      dug: btoa(b), col: m.col || [], chat: this.chatUltimos(60), fin: m.fin || null, sinMineral: m.sinMineral ?? -1, mapa: this.mapaDe(m), pid: yo.pid, ver: m.cfg.mirar === 0 ? "" : m.ver, obs: this.ctx.getWebSockets("mira").length, regalo: r.regalo ? 1 : 0, piedras: m.piedras || [], cita: this.citaViva(m),
    });
    for (const [x, s] of this.pos) if (x !== i && on.has(x)) manda(ws, s);
    this.avisarTabla(i, true, true);
    if (i === this.creador()) { this.avisarDueno(); this.avisarPidiendo(); }      // llegó quien decide: se le muestran las solicitudes y a quien espera se le avisa
    this.difundir({ t: "entra", j: this.publico(i, true), nuevo: estrena ? 1 : 0, primera: primera ? 1 : 0 }, ws);      // primera: nunca había entrado (aunque ya no haya bono)
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
// RLR · A las 3:33 de la tarde, hora de Torreón, a quien cumple años hoy y dio su correo le llega un correo cortito:
// felicidades y, si Mina le ha dado buenos ratos, una liga para dar las gracias. Uno al año, y solo si lo pidió con su cuenta.
async function correosDeCumple(env) {
  const t = horaTorreon(), tabla = env.TABLA.get(env.TABLA.idFromName("mundial")), llave = await secreto(env.RESEND_API_KEY);
  if (!llave) return { error: "sin llave" };
  const lista = await tabla.cumplesDe(t.md, t.y); let enviados = 0;
  for (const c of lista) {
    const liga = "https://mina.capitaltorreon.com/" + (c.mundo || "") + "?gracias=cumple", nombre = (c.nombre || "").split(" ")[0] || "";
    const html = `<div style="background:#fff;color:#1b1b1b;font:16px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:28px 22px;max-width:520px;margin:0 auto">
      <p style="font-size:28px;margin:0 0 10px">🎂</p>
      <p style="margin:0 0 14px"><b>Feliz cumpleaños${nombre ? ", " + nombre : ""}.</b></p>
      <p style="margin:0 0 14px">Hoy tu maquinita trae gorrito de fiesta en Mina. Si el juego te ha dado buenos ratos, hoy es buen día para darle las gracias a quien lo hace: lo que tú quieras, desde $33. No cambia nada en el juego y no hace ninguna falta; es solo gratitud.</p>
      <p style="margin:22px 0"><a href="${liga}" style="background:#1b1b1b;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;display:inline-block">Sí, quiero dar las gracias</a></p>
      <p style="margin:0;color:#777;font-size:13px">Mina · CapitalTorreon · este correo llega una vez al año, a las 3:33 de la tarde, hora de Torreón. Si no quieres recibirlo, quita tu cumpleaños en La Pinturería.</p></div>`;
    try {
      const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: "Bearer " + llave, "content-type": "application/json" }, body: JSON.stringify({ from: "Mina <hola@capitaltorreon.com>", to: c.correo, subject: "🎂 Feliz cumpleaños" + (nombre ? ", " + nombre : "") + " · Mina", html, text: `Feliz cumpleaños${nombre ? ", " + nombre : ""}. Si Mina te ha dado buenos ratos, hoy es buen día para dar las gracias (desde $33, nada obligatorio): ${liga}` }) });
      if (r.ok) { enviados++; await tabla.felicitado(c.k, t.y); }
    } catch {}
  }
  return { hoy: t.md, candidatos: lista.length, enviados };
}

export default {
  // El cron corre a las 21:33 UTC = 3:33 pm en Torreón (Coahuila no cambia de horario).
  async scheduled(ev, env, ctx) { ctx.waitUntil(correosDeCumple(env)); },
  async fetch(request, env) {
    const u = new URL(request.url);
    // Solo en pruebas locales: disparar el correo de cumpleaños a mano.
    if (u.pathname === "/api/tienda/cron" && env.MINA_PRUEBA === "1" && ["::1", "127.0.0.1"].includes(request.headers.get("CF-Connecting-IP"))) return json(await correosDeCumple(env));

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
      const id = liga[1].toUpperCase(), num = (q) => (/^\d{1,2}$/.test(u.searchParams.get(q) || "") ? Number(u.searchParams.get(q)) : -1), j = num("j"), de = num("de");
      let info = null, quien = null;
      try { info = await env.MUNDO.get(env.MUNDO.idFromName(id)).ficha(j >= 0 ? j : de, j < 0 && de >= 0); } catch {}
      if (!info) return pagina;
      if (j < 0 && de >= 0 && info.p) { quien = info.p; info.p = null; }      // ?de=3: la liga del mundo, pero se dice quién invita
      const miles = (n) => Math.round(n).toLocaleString("es-MX"), p = info.p;
      const dinero = (n) => (n >= 1e9 ? (n / 1e9).toFixed(1) + " mil M" : n >= 1e6 ? (n / 1e6).toFixed(1) + " M" : miles(n));
      const mundo = info.n || "Un mundo de Mina", ahora = info.on ? (info.on === 1 ? "1 excavando ahora" : info.on + " excavando ahora") : "";
      const horaCita = (h) => { const t = horaTorreon(h), hoy = horaTorreon(); const hh = t.h % 12 || 12, mm = t.min ? ":" + String(t.min).padStart(2, "0") : "", ap = t.h < 12 ? " am" : " pm"; return (t.md === hoy.md ? "hoy" : t.dia + "/" + t.mes) + " a las " + hh + mm + ap + " (hora de Torreón)"; };
      const titulo = p ? (p.rec ? p.n + " · " + miles(p.rec) + " m bajo tierra en Mina" : p.n + " te invita a excavar en Mina")
        : quien ? quien.n + " te invita a " + mundo + (ahora ? " · " + ahora : "") : mundo + (ahora ? " · " + ahora : " · entra a excavar conmigo en Mina");
      const hitos = [info.j > 1 ? info.j + " maquinitas" : "", info.rec ? "ya vamos en " + miles(info.rec) + " m" : "", info.col ? info.col + " de 99 objetos de la colección" : ""].filter(Boolean).join(" · ");
      const cita = info.cita ? "Nos vemos " + horaCita(info.cita.h) + (info.cita.voy > 1 ? ", ya van " + info.cita.voy : "") + ". " : "";
      const texto = p ? (p.tot ? "Lleva $" + dinero(p.tot) + " ganados en " + mundo : "Acaba de abrir " + mundo) + ". Entra y alcánzala: gratis, sin registro, en el mismo mundo."
        : cita + (hitos ? hitos[0].toUpperCase() + hitos.slice(1) + ". " : "") + "Entras y ya estás jugando: un mundo compartido en tiempo real, gratis y sin registro.";
      const base = u.origin + "/og/m/" + id, imagen = p && p.og ? base + "/" + j + ".jpg?v=" + p.og : info.og ? base + ".jpg?v=" + info.og : u.origin + "/mina.jpg";
      const pon = (v) => ({ element(e) { e.setAttribute("content", v); } });
      return new HTMLRewriter()
        .on('meta[property="og:title"]', pon(titulo))
        .on('meta[property="og:description"]', pon(texto))
        .on('meta[property="og:image"]', pon(imagen))
        .on('meta[property="og:url"]', pon(u.origin + "/" + id + (p ? "?j=" + j : de >= 0 ? "?de=" + de : "")))
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
    // La Pinturería: catálogo, pagar y confirmar
    if (u.pathname === "/api/tienda" || u.pathname.startsWith("/api/tienda/")) return tiendaApi(u, request, env);
    // Las capturas de pantalla: subir, listar, borrar; y la imagen misma
    if (u.pathname === "/api/capturas" || u.pathname.startsWith("/api/capturas/")) return capturasApi(u, request, env);
    const cap = u.pathname.match(/^\/capturas\/([0-9A-Za-z]{1,40})\/([2-9A-HJ-NP-Z]{8})\/([0-9a-f]{16})\.jpg$/);
    if (cap && request.method === "GET") {
      const o = await env.CAPTURAS.get(`cap/${cap[1]}/${cap[2]}/${cap[3]}.jpg`);
      if (!o) return json({ error: "no" }, 404);
      return new Response(o.body, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=31536000, immutable" } });
    }

    if (u.pathname.startsWith("/api/") || u.pathname.startsWith("/ws/") || u.pathname.startsWith("/og/")) return json({ error: "no" }, 404);
    return env.ASSETS.fetch(request);
  },
};
