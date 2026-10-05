// RLR · La Pinturería: la escalera de precios, igual para todos. Única fuente de verdad (el juego la pide al abrir la tienda).
// Cada nivel incluye los de abajo; subir cuesta solo la diferencia. Precios en pesos mexicanos, con impuestos incluidos.
export const NIVELES = [
  { n: 1, precio: 0, nombre: "Tu color", que: "El cuerpo de tu maquinita del color que quieras: 24 colores. Gratis, para todos." },
  { n: 2, precio: 0, nombre: "Cabina y orugas", que: "La cabina y las orugas también, del color que quieras. Gratis, para todos." },
  { n: 3, precio: 79, nombre: "Calcomanías", que: "48 calcomanías para el costado, y las de temporada: Día de Muertos, Navidad, fiestas patrias, amor, primavera y verano, que se quedan de recuerdo." },
  { n: 4, precio: 149, nombre: "Luces", que: "Faro de color y luz de piso que se ve en la oscuridad." },
  { n: 5, precio: 299, nombre: "Estela", que: "Deja estela al volar: chispas doradas, arcoíris, estrellas, corazones, burbujas, fuego o pétalos." },
  { n: 6, precio: 599, nombre: "Claxon, placa y título", que: "Un claxon con ocho melodías (tecla B, lo oyen los de cerca), tu nombre con placa (dorada, con corona, con marco o de neón) y un título antes del nombre: Don, Doña, Capitán, Ing., Leyenda…" },
  { n: 7, precio: 999, nombre: "Carrocería", que: "Cuatro carrocerías exclusivas: El Escarabajo, La Locomotora, El Submarino y El Tanque." },
  { n: 8, precio: 1999, nombre: "Mascota", que: "Una mascota que te sigue a todos lados: pájaro, perro, dron, mariposa, luciérnaga, gato o abeja." },
  { n: 9, precio: 3999, nombre: "Tu piedra", que: "Tu nombre grabado en una piedra del Jardín del Fondo, en cada mundo que termines." },
  { n: 10, precio: 9999, nombre: "Hecha a mano", que: "Una maquinita diseñada contigo, a mano, única en el mundo. Conversación, bocetos y dos o tres semanas." },
];
export const GRATIS = 2;                // los dos primeros niveles (los colores) son gratis para todos: la auditoría del 4 de octubre
export const MECENAS_MIN = 99;          // ✦ Mecenas: lo que quieras dar, desde aquí. No da nada más que el ✦ y las gracias.
export const FONDO_PRECIO = 19;         // Fondo común: la primera pintura de una maquinita nueva
export const TOPE_MES = 5000;           // tope de cuidado por maquinita cada 30 días
export const precioDe = (n) => (NIVELES.find((x) => x.n === n) || { precio: 0 }).precio;

// La pintura: qué puede traer según el nivel. Lo que no alcanza el nivel se descarta (también en el servidor).
export const COLORES = ["#ffd23f", "#ff6b5a", "#6ec3ff", "#6fdc7a", "#c05cff", "#ff9f40", "#f3e6d8", "#ff7ac8", "#ffffff", "#1b1b1b", "#e0483a", "#2f8a3a", "#2a6fa8", "#7426a8", "#b05e12", "#9a8774", "#00c2a8", "#f5e663", "#ff3d7f", "#3d5afe", "#8bc34a", "#795548", "#607d8b", "#c0a16b"];
export const CALCAS = ["", "⭐", "❤️", "⚡", "🔥", "🌈", "🌙", "☀️", "🌵", "🌸", "🍀", "🍉", "🌶️", "🦅", "🐺", "🦂", "🐢", "🐝", "🦋", "🐉", "🦈", "⚓", "🎸", "🎵", "🎲", "⚽", "🏀", "🏁", "🚀", "💎", "👑", "💀", "🤖", "👾", "🎯", "🧭", "⛏️", "🔱", "✝️", "☮️", "♾️", "🇲🇽", "🏳️‍🌈", "🍕", "🌮", "🥑", "🐾", "🧿", "✨"];
export const LUCES = ["#fff3b0", "#ff4d4d", "#4dff88", "#4da6ff", "#ff4df2", "#ffd23f", "#ffffff", "#9d4dff"];
export const ESTELAS = ["Ninguna", "Chispas doradas", "Arcoíris", "Estrellas", "Corazones", "Burbujas", "Fuego", "Pétalos"];
export const BOCINAS = ["Pip-pip", "Mariachi", "Tren", "Barco", "Risa", "Campanitas", "Cumbia", "Corneta"];
export const PLACAS = ["Normal", "Dorada", "Con corona", "Con marco", "Neón"];
export const CARROS = ["De fábrica", "El Escarabajo", "La Locomotora", "El Submarino", "El Tanque"];
export const MASCOTAS = ["Ninguna", "Pájaro", "Perro", "Dron", "Mariposa", "Luciérnaga", "Gato", "Abeja"];
export const TITULOS = ["", "Don", "Doña", "Capitán", "Capitana", "Ing.", "Dr.", "Dra.", "Maestro", "Maestra", "Jefe", "Jefa", "Minero", "Minera", "Leyenda"];
// Calcomanías de temporada (fechas en hora de Torreón, MM-DD): se pueden poner solo en su temporada y se quedan de recuerdo.
export const CALCAS_TEMPORADA = [
  { n: "Día de Muertos", de: "10-15", a: "11-03", l: ["🎃", "💀", "🕯️", "🌼", "🪦"] },
  { n: "Navidad", de: "12-01", a: "01-06", l: ["🎄", "🎅", "⛄", "🎁", "🔔"] },
  { n: "Amor y amistad", de: "02-01", a: "02-15", l: ["💘", "🌹", "💝", "🧸"] },
  { n: "Fiestas patrias", de: "09-01", a: "09-30", l: ["🎉", "🪅", "🎺", "🌮"] },
  { n: "Primavera", de: "03-15", a: "04-30", l: ["🌷", "🐣", "🌈", "🐞"] },
  { n: "Verano", de: "07-01", a: "08-31", l: ["🏖️", "🍦", "☀️", "🌊"] },
];
export const CALCAS_TODAS = CALCAS.concat(...CALCAS_TEMPORADA.map((x) => x.l));
const enFechas = (md, de, a) => (de <= a ? md >= de && md <= a : md >= de || md <= a);
// ¿Esta calcomanía (índice en CALCAS_TODAS) se puede poner hoy? Las de siempre, siempre; las de temporada, solo en su temporada.
export function calcaHoy(i, md) { if (i < CALCAS.length) return true; let k = CALCAS.length; for (const t of CALCAS_TEMPORADA) { if (i < k + t.l.length) return enFechas(md, t.de, t.a); k += t.l.length; } return false; }
export const temporadasHoy = (md) => CALCAS_TEMPORADA.filter((t) => enFechas(md, t.de, t.a)).map((t) => t.n);
const hex = (v, lista) => (typeof v === "string" && lista.includes(v.toLowerCase()) ? v.toLowerCase() : "");
const idx = (v, lista) => (Number.isInteger(v) && v >= 0 && v < lista.length ? v : 0);
// ── Piezas sueltas de sonido: se coleccionan una por una, cada una con su precio (fuera de la escalera de niveles).
export const MOTORES = [
  { i: 1, n: "Diésel clásico", d: "El motor de siempre, afinado: explosiones graves y parejas, con el soplido del escape.", precio: 39 },
  { i: 2, n: "V8 ronco", d: "Ocho cilindros que gruñen al acelerar y ronronean parados.", precio: 49 },
  { i: 3, n: "Eléctrico", d: "Casi silencio: un silbido limpio que sube con la velocidad.", precio: 59 },
  { i: 4, n: "Turbina", d: "Un reactor chiquito: aire que se enrosca y un agudo que se afina al acelerar.", precio: 79 },
  { i: 5, n: "De vapor", d: "Resoplidos que se aprietan al correr, como La Locomotora.", precio: 99 },
  { i: 6, n: "Nave", d: "Un zumbido de otro planeta que late despacio y se abre al volar.", precio: 149 },
];
export const CANCIONES = [
  { i: 1, n: "Vals de la mina", d: "Un vals lento de piano, a tres tiempos, que gira sin prisa.", precio: 39 },
  { i: 2, n: "Bolero de la Gasolinera", d: "Cuerdas pulsadas en menor, con mucho aire entre nota y nota.", precio: 39 },
  { i: 3, n: "Cumbia bajita", d: "Un bajo que camina y un güiro suave; alegre, sin gritar.", precio: 39 },
  { i: 4, n: "Nana de las estrellas", d: "Una caja de música pentatónica, para bajar de noche.", precio: 39 },
  { i: 5, n: "Jazz de medianoche", d: "Acordes de séptima, un bajo que pasea y escobillas.", precio: 39 },
];
export const PIEZAS = { motor: MOTORES, cancion: CANCIONES };
export function pieza(id) { const [tipo, i] = String(id || "").split(":"); const l = PIEZAS[tipo], x = l && l.find((y) => y.i === +i); return x ? { tipo, ...x } : null; }

export function filtrarPinta(p, nivel, piezas) {
  p = p && typeof p === "object" ? p : {};
  nivel = Math.max(GRATIS, nivel | 0);           // los colores son de todos
  piezas = Array.isArray(piezas) ? piezas : [];
  const q = {};
  if (piezas.includes("motor:" + (p.motor | 0))) q.motor = p.motor | 0;          // las piezas de sonido: solo las que se compraron
  if (piezas.includes("cancion:" + (p.cancion | 0))) q.cancion = p.cancion | 0;
  if (nivel >= 1) q.c1 = hex(p.c1, COLORES);
  if (nivel >= 2) { q.c2 = hex(p.c2, COLORES); q.c3 = hex(p.c3, COLORES); }
  if (nivel >= 3) q.calca = idx(p.calca, CALCAS_TODAS);                  // el 0 = ninguna
  if (nivel >= 4) q.luz = hex(p.luz, LUCES);
  if (nivel >= 5) q.estela = idx(p.estela, ESTELAS);
  if (nivel >= 6) { q.bocina = idx(p.bocina, BOCINAS); q.placa = idx(p.placa, PLACAS); q.titulo = idx(p.titulo, TITULOS); }
  if (nivel >= 7) q.carro = idx(p.carro, CARROS);
  if (nivel >= 8) q.mascota = idx(p.mascota, MASCOTAS);
  for (const k of Object.keys(q)) if (q[k] === "" || q[k] === 0) delete q[k];
  return q;
}

// ── El motor de confort (precio exacto por persona, siempre hacia abajo) ─────────────────────────────────────────────
// Lee cómo juega cada quien (tiempo, velocidad, pericia, cuántas veces abrió la tienda, qué pasó en sus experimentos) y
// decide qué nivel sugerirle y qué descuento darle. Seis experimentos: tres para tantear y tres para afinar; después se
// queda en su punto cómodo y se mueve despacio con lo que la economía de toda la gente va enseñando (desc0 global).
// La única regla fija: NUNCA se cobra más que el precio de lista. El motor solo baja.
export const DESC_MAX = 0.6, OFERTA_DIAS = 7, EXPERIMENTOS = 6;
export function senales(m) {
  const e = m.est || {}, t = m.tienda || {}, seg = Math.max(0, e.seg || 0);
  return {
    seg,
    dedicacion: Math.min(1, seg / 36000),                                   // 10 h de juego = 1
    expertiz: Math.min(1, (e.rec || 0) / 10000),                            // llegar al fondo = 1
    velocidad: seg > 600 ? Math.min(1, (e.tot || 0) / seg / 20000) : 0,     // dinero del juego por segundo jugado
    dias: Math.max(0, (Date.now() - (m.alta || Date.now())) / 86400000),
    vistas: t.vistas || 0,
    compras: (t.compras || []).filter((c) => c.monto > 0).length,
    nivel: t.nivel || 0,
  };
}
export function motorConfort(m, global) {
  const s = senales(m), t = m.tienda || {}, exp = (t.exp || []).filter((x) => x.r !== "abierto"), g = global || { desc0: 0 };
  const base = Math.max(1, Math.min(10, Math.round(1 + s.dedicacion * 3 + s.expertiz * 3 + s.velocidad * 2)));
  const nivel = Math.max(s.nivel + 1, Math.min(base, s.nivel + 3));          // lo que le queda: de uno a tres niveles arriba del suyo
  const n = exp.length, compradas = exp.filter((x) => x.r === "comprado"), ult = compradas[compradas.length - 1];
  let desc;
  if (n >= EXPERIMENTOS) desc = t.confort !== undefined ? t.confort : ult ? ult.desc : DESC_MAX;
  else if (ult) desc = Math.max(0, ult.desc - 0.1);                          // ya compró con un descuento: se tantea un poco menos
  else if (n < 3) desc = [0, 0.2, 0.4][n] + (g.desc0 || 0);                  // tanteo: lista, −20 %, −40 % (más lo que diga la economía general)
  else desc = [0.5, 0.6, 0.6][n - 3];                                        // no ha comprado: se afina hacia abajo
  if (s.seg < 1200 && !ult) desc = 0;                                         // a quien apenas empieza no se le experimenta
  desc = Math.max(0, Math.min(DESC_MAX, Math.round(desc * 20) / 20));
  return { nivel: Math.min(10, nivel), desc, n, s: { horas: Math.round(s.seg / 360) / 10, dedicacion: +s.dedicacion.toFixed(2), expertiz: +s.expertiz.toFixed(2), velocidad: +s.velocidad.toFixed(2), vistas: s.vistas } };
}

// ── El momento (todo en hora de Torreón) ──────────────────────────────────────────────────────────────────────────────
// El motor de confort decide el descuento de fondo de cada persona (vale siete días). Encima, el momento mueve el precio
// durante el día: hora, madrugada, festivos de México, su cumpleaños, los días antes de la quincena, el ánimo con el que
// está jugando. Igual que el motor, el momento SOLO BAJA. Nunca nada sube de la lista. Todo se calcula con la hora de
// Torreón: así «las 3:33 de la tarde» son las mismas para todos, estén donde estén.
export const ZONA = "America/Monterrey", AJUSTE_MAX = 0.25, GRATITUD_MIN = 33, GRATITUD_HORA = "15:33";
const DIAS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export function horaTorreon(ts = Date.now()) {
  const p = {}; for (const x of new Intl.DateTimeFormat("en-US", { timeZone: ZONA, hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short" }).formatToParts(new Date(ts))) p[x.type] = x.value;
  return { y: +p.year, mes: +p.month, dia: +p.day, h: +p.hour % 24, min: +p.minute, dow: DIAS.indexOf(p.weekday), md: p.month + "-" + p.day };
}
export const FESTIVOS = { "01-01": "Año Nuevo", "01-06": "Día de Reyes", "02-02": "Día de la Candelaria", "02-14": "Día del Amor y la Amistad", "02-24": "Día de la Bandera", "03-08": "Día de la Mujer", "04-30": "Día del Niño", "05-01": "Día del Trabajo", "05-05": "Cinco de Mayo", "05-10": "Día de las Madres", "05-15": "Día del Maestro", "09-15": "Grito de Independencia y aniversario de Torreón", "09-16": "Día de la Independencia", "10-12": "Día de la Raza", "11-01": "Día de Todos los Santos", "11-02": "Día de Muertos", "12-12": "Día de la Virgen de Guadalupe", "12-24": "Nochebuena", "12-25": "Navidad", "12-28": "Día de los Inocentes", "12-31": "Fin de año" };
const md2 = (m, d) => String(m).padStart(2, "0") + "-" + String(d).padStart(2, "0");
const nDow = (y, mes, dow, n) => { const d = new Date(Date.UTC(y, mes - 1, 1)), p = (dow - d.getUTCDay() + 7) % 7; return 1 + p + 7 * (n - 1); };    // el n-ésimo <dow> del mes
function pascua(y) { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1; return Date.UTC(y, mes - 1, dia); }
export function festivoDe(t) {
  if (FESTIVOS[t.md]) return FESTIVOS[t.md];
  if (t.mes === 2 && t.dia === nDow(t.y, 2, 1, 1)) return "Día de la Constitución";
  if (t.mes === 3 && t.dia === nDow(t.y, 3, 1, 3)) return "Natalicio de Benito Juárez";
  if (t.mes === 11 && t.dia === nDow(t.y, 11, 1, 3)) return "Día de la Revolución";
  if (t.mes === 6 && t.dia === nDow(t.y, 6, 0, 3)) return "Día del Padre";
  const hoy = Date.UTC(t.y, t.mes - 1, t.dia), p = pascua(t.y), dd = Math.round((hoy - p) / 86400000);
  if (dd === -3) return "Jueves Santo"; if (dd === -2) return "Viernes Santo"; if (dd === 0) return "Domingo de Pascua";
  return "";
}
export const cumpleOk = (md) => typeof md === "string" && /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(md) && +md.slice(3) <= [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][+md.slice(0, 2) - 1];
// ¿Es su cumpleaños, o anda cerca (tres días antes o después)? Para la gratitud y el gorrito.
export function cumpleCerca(md, t) { if (!cumpleOk(md)) return 9; const y = t.y, a = Date.UTC(y, t.mes - 1, t.dia), c = Date.UTC(y, +md.slice(0, 2) - 1, +md.slice(3)); const d = Math.round((a - c) / 86400000); return Math.abs(d) <= 3 ? d : Math.abs(d - 365) <= 3 ? d - 365 : Math.abs(d + 365) <= 3 ? d + 365 : 9; }
// El momento de esta persona ahora mismo. `animo`: 0 = tranquilo … 1 = a tope (lo mide el juego: cuánto está cavando,
// chocando y peleando en los últimos minutos). Devuelve el ajuste (fracción que se resta), de qué se compone, y las señales.
export function momento(ts, m, animo) {
  const t = horaTorreon(ts), tienda = (m && m.tienda) || {}, seg = ((m && m.est) || {}).seg || 0, fest = festivoDe(t), cumple = cumpleOk(tienda.cumple) && tienda.cumple === t.md;
  const partes = [];
  if (cumple) partes.push(["🎂 tu cumpleaños", 0.15]); else if (fest) partes.push([fest, 0.1]);
  if (t.h >= 19) partes.push(["noche tranquila", 0.05]); else if (t.h >= 6 && t.h < 11) partes.push(["precio de mañana", 0.03]);
  if ((t.dia >= 12 && t.dia <= 14) || t.dia >= 27) partes.push(["antes de la quincena", 0.05]);
  if (t.dow === 0 && !fest && !cumple) partes.push(["domingo", 0.03]);
  const an = Math.max(0, Math.min(1, Number(animo) || 0)), animoN = an < 0.3 ? "tranquilo" : an < 0.7 ? "concentrado" : "a tope";
  if (animoN === "tranquilo" && seg > 600) partes.push(["juegas tranquilo", 0.02]);
  const ajuste = Math.min(AJUSTE_MAX, Math.round(partes.reduce((a, p) => a + p[1], 0) * 100) / 100);
  return { ajuste, partes, madrugada: t.h < 6, fest, cumple, cerca: cumpleCerca(tienda.cumple, t), animo: animoN, hora: { h: t.h, min: t.min, md: t.md } };
}
// El precio exacto: lista × (1 − confort) × (1 − momento), redondeado a un número limpio. Nunca más que la lista, nunca menos de $1.
export const precioBonito = (x) => Math.max(1, x < 100 ? Math.round(x) : x < 1000 ? Math.round(x / 5) * 5 : Math.round(x / 10) * 10);
export function precioFinal(lista, desc, ajuste) { return Math.min(lista, precioBonito(lista * (1 - Math.max(0, Math.min(DESC_MAX, desc || 0))) * (1 - Math.max(0, Math.min(AJUSTE_MAX, ajuste || 0))))); }

// ── Referidos ─────────────────────────────────────────────────────────────────────────────────────────────────────────
// Decisión de Ricardo (4 de octubre): por cada persona nueva que entre con tu liga y abra su cuenta, $333 de saldo en
// La Pinturería. Sin límite. El saldo solo compra niveles (para ti o de regalo); nunca es dinero de vuelta ni Mecenas ni Fondo.
export const REFERIDO_PREMIO = 333;
