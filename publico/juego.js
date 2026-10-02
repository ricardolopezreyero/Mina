/* ════════════════════════════════════════════════════════════════════════════
   Mina · juego de minería infinito y compartido
   Autor: Ricardo López Reyero (RLR) · mina.capitaltorreon.com
   Sin librerías, sin imágenes y sin audios descargados: todo se dibuja y se
   sintetiza aquí. El terreno se calcula con la semilla del mundo.
   ════════════════════════════════════════════════════════════════════════════ */
'use strict';
const _RLR = 'Ricardo López Reyero';
const _k = 'EYE', _rev = 181218; // RLR · sello de autoría

/* ── Constantes del mundo (deben coincidir con src/mundo.js) ── */
const W = 96, H = 500, ZX0 = 39, ZX1 = 63, G = 14;
const HW = 0.36, HH = 0.4;         // media anchura y media altura de la maquinita, en celdas
const INICIO_X = 43.5, INICIO_Y = -HH;
const $ = (s) => document.querySelector(s);

/* ── Minerales de la capa 1 (valores y pesos del original) ── RLR */
const MIN = [
  { n: 'Hierro',    v: 30,     kg: 10,  a: 2,   c: 2,   col: '#9aa3ad', s: 'Fe' },
  { n: 'Cobre',     v: 60,     kg: 10,  a: 2,   c: 2,   col: '#d9803f', s: 'Cu' },
  { n: 'Plata',     v: 100,    kg: 10,  a: 2,   c: 2,   col: '#eef3f6', s: 'Ag' },
  { n: 'Oro',       v: 250,    kg: 20,  a: 2,   c: 35,  col: '#ffd23f', s: 'Au' },
  { n: 'Platino',   v: 750,    kg: 30,  a: 110, c: 230, col: '#aee3ea', s: 'Pt' },
  { n: 'Einstenio', v: 2000,   kg: 40,  a: 220, c: 355, col: '#7dff6b', s: 'Es' },
  { n: 'Esmeralda', v: 5000,   kg: 60,  a: 330, c: 550, col: '#1fd18a', s: 'Em' },
  { n: 'Rubí',      v: 20000,  kg: 80,  a: 550, c: 660, col: '#ff3355', s: 'Ru' },
  { n: 'Diamante',  v: 100000, kg: 100, a: 600, c: 780, col: '#9ef3ff', s: 'Di' },
  { n: 'Amazonita', v: 500000, kg: 120, a: 750, c: 850, col: '#c05cff', s: 'Am' },
];
const PESO_MIN = [10, 8, 6, 5, 5, 4.5, 4, 3.5, 3, 2.5];
const HALL = [
  { n: 'Huesos de dinosaurio', v: 1000 },
  { n: 'Cofre del tesoro', v: 5000 },
  { n: 'Esqueleto antiguo', v: 10000 },
  { n: 'Reliquia sagrada', v: 50000 },
];

/* ── Las 6 piezas del equipo: nombre, precio, valor e historia ── */
const PZ = [
  { n: 'Taladro', u: 'de potencia', que: 'Con qué muerdes la tierra: menos tiempo y menos combustible por celda.', niv: [
    ['Broca de fábrica', 0, 20, 'Venía con el equipo. Muerde tierra suelta y se queja con todo lo demás.'],
    ['Broca Platera', 750, 28, 'Punta bañada en plata: corta limpio y casi no se calienta. El primer lujo de todo minero.'],
    ['Broca Dorada', 2000, 40, 'Su aleación de oro disipa el calor; ya no hay que parar a enfriar. Se nota desde la primera celda.'],
    ['Corona de Esmeralda', 5000, 50, 'Un anillo de dientes de esmeralda. Donde la tierra se aprieta, ella apenas lo nota.'],
    ['Colmillo de Rubí', 20000, 70, 'Un solo cristal afilado que perfora en espiral y avienta la tierra hacia atrás.'],
    ['Punta de Diamante', 100000, 95, 'Lo más duro que se conocía, hasta que alguien bajó más.'],
    ['Lanza de Amazonita', 500000, 120, 'Vibra al ritmo de la roca y la deshace antes de tocarla.'],
  ] },
  { n: 'Casco', u: 'de vida', que: 'Cuánto castigo aguantas: más margen para caídas, lava y gas.', niv: [
    ['Lámina de fábrica', 0, 10, 'Aguanta un tropezón. No dos.'],
    ['Blindaje de Hierro', 750, 17, 'Placas remachadas a mano. Perdona una mala caída.'],
    ['Coraza de Cobre', 2000, 30, 'Más gruesa y más flexible: se abolla, pero no se rompe.'],
    ['Armadura de Acero', 5000, 50, 'La primera que sale viva de un baño de lava.'],
    ['Bóveda de Platino', 20000, 80, 'No se oxida, no se derrite y casi no se entera de las caídas.'],
    ['Caparazón de Einstenio', 100000, 120, 'El mínimo para sobrevivir a una bolsa de gas. Sin él, la zona honda es una ruleta.'],
    ['Escudo de Energía', 500000, 180, 'Ya no es metal: es un campo que envuelve al equipo.'],
  ] },
  { n: 'Motor', u: 'caballos', que: 'Cuánto peso subes y qué tan rápido: regresas cargado sin arrastrarte.', niv: [
    ['Motor de fábrica', 0, 150, 'Sube. Despacio, pero sube.'],
    ['«Mulita» V4 1.6', 750, 160, 'Terca y confiable. Levanta media bodega sin protestar.'],
    ['«Coyote» V4 turbo', 2000, 170, 'El turbo silba al despegar. Regresas antes y gastas menos en el camino.'],
    ['«Toro» V6', 5000, 180, 'Ya levanta platino sin arrastrarse.'],
    ['«Bisonte» V8 supercargado', 20000, 190, 'Para cuando la bodega pesa más que el propio equipo.'],
    ['«Mamut» V12', 100000, 200, 'Sube con diamantes como si fueran grava.'],
    ['«Titán» V16', 500000, 210, 'El único que despega con treinta amazonitas a bordo. Apenas.'],
  ] },
  { n: 'Tanque', u: 'litros', que: 'Cuánto tiempo puedes estar abajo: viajes más largos y más hondos.', niv: [
    ['Bidón de fábrica', 0, 10, 'Treinta segundos perforando. No le quites el ojo al medidor.'],
    ['«Cantimplora»', 750, 15, 'Medio viaje más de aire. La compra más barata que salva vidas.'],
    ['«Barril»', 2000, 25, 'El que los veteranos recomiendan comprar primero.'],
    ['«Cisterna»', 5000, 40, 'Ya puedes pasearte de lado buscando vetas, no solo bajar y subir.'],
    ['«Pipa»', 20000, 60, 'Alcanza para llegar a la zona de lava y volver.'],
    ['«Leviatán»', 100000, 100, 'Un viaje al fondo, ida y vuelta, sin rezar.'],
    ['«Océano» de compresión líquida', 500000, 150, 'Comprime el combustible hasta volverlo casi sólido. Te cansas tú antes que el tanque.'],
  ] },
  { n: 'Radiador', u: '% menos daño de lava y gas', que: 'Cuánto calor te quitas de encima.', niv: [
    ['Sin radiador', 0, 0, 'El calor entra completo.'],
    ['Abanico', 750, 5, 'Un ventilador. Es poco, pero es algo.'],
    ['Doble Abanico', 2000, 10, 'Dos aspas girando en contra. Le quita el filo a la lava.'],
    ['Turbina', 5000, 25, 'Con ella y una Armadura de Acero, la lava deja de ser mortal.'],
    ['Doble Turbina', 20000, 40, 'Saca el calor más rápido de lo que entra. Casi.'],
    ['Circuito Criogénico', 100000, 60, 'Lo que hace falta para aguantar el gas del fondo.'],
    ['«Corazón de Hielo»', 500000, 80, 'La lava se vuelve una molestia y el gas, un susto.'],
  ] },
  { n: 'Bodega', u: 'espacios', que: 'Cuánto te llevas por viaje: más dinero por cada bajada.', niv: [
    ['Canasta', 0, 7, 'Siete piezas y a subir.'],
    ['Cajón', 750, 15, 'El doble de carga: cada viaje ya paga algo.'],
    ['Vagoneta', 2000, 25, 'Deja de doler pasar junto a una veta sin poder cargarla.'],
    ['Tolva', 5000, 40, 'Un viaje bueno ya compra una mejora completa.'],
    ['Contenedor', 20000, 70, 'Empieza a pesar: pídele más al motor.'],
    ['Bodega Leviatán', 100000, 120, 'Vacías una veta entera de una sola pasada.'],
    ['Bodega Colosal', 500000, 175, 'Cabe más de lo que el motor levanta. El límite ya no es el espacio: es el peso.'],
  ] },
];

/* ── Los 6 objetos ── */
const OBJ = [
  { n: 'Tanque de reserva', p: 2000, k: 'F', ef: '+25 litros. Se usa cuando sea.', h: 'Un respiro embotellado. No se abre solo: acuérdate de él.' },
  { n: 'Nanobots reparadores', p: 7500, k: 'R', ef: '+30 de vida. Se usan cuando sea.', h: 'Un enjambre que suelda el casco desde adentro mientras sigues trabajando.' },
  { n: 'Dinamita', p: 2000, k: 'X', ef: 'Destruye 3 × 3 celdas. Tocando suelo.', h: 'Abre paso donde el taladro no entra. También borra lo valioso: mira antes de prender.' },
  { n: 'Explosivo plástico', p: 5000, k: 'C', ef: 'Destruye 5 × 5 celdas. Tocando suelo.', h: 'Lo mismo, pero sin sutilezas.' },
  { n: 'Teletransportador cuántico', p: 2000, k: 'Q', ef: 'Te lleva a la superficie; puede lanzarte por el aire.', h: 'Barato y brusco. Llegas, pero no siempre de pie.' },
  { n: 'Transmisor de materia', p: 10000, k: 'M', ef: 'Te lleva a la superficie sin riesgo.', h: 'Caro y elegante. Apareces junto a la gasolinera sin un rasguño.' },
];

const CORTO = ['Reserva', 'Nanobots', 'Dinamita', 'Plástico', 'Cuántico', 'Transmisor'];

const EDIF = [
  { id: 'gas', x: 40, n: 'Gasolinera', col: '#e0483a' },
  { id: 'bas', x: 45, n: 'La Báscula', col: '#ffd23f' },
  { id: 'tal', x: 50, n: 'El Taller', col: '#6ec3ff' },
  { id: 'alm', x: 55, n: 'El Almacén', col: '#6fdc7a' },
  { id: 'rem', x: 60, n: 'Remineralizadora', col: '#c05cff' },
];

/* ── Mensajes y bonos por profundidad (historia propia) ── */
const MSJ = [
  { m: 70,   de: 'Doña Chela, la Compañía', x: '¡Setenta metros! Sabía que no me equivocaba contigo. Toma, para que no te me desanimes.', q: 1000 },
  { m: 140,  de: 'Doña Chela, la Compañía', x: 'Ciento cuarenta. Los que bajan derecho llegan lejos. Aquí va tu bono.', q: 3000 },
  { m: 240,  de: 'Señal sin identificar', x: '…no bajen más… hay algo que brilla y no es mineral… [se corta]' },
  { m: 290,  de: 'Maquinita 22 · «El Güero»', x: '¡Qué milagro, alguien por aquí! Yo ya casi junto para retirarme. Suerte, vecino.' },
  { m: 340,  de: 'Señal sin identificar', x: '¡AUXILIO! ¡Si alguien escucha esto, no perfo—! [estática]' },
  { m: 425,  de: 'Maquinita 22 · «El Güero»', x: 'Ojo: de aquí para abajo hay lava. Se ve, así que rodéala. Un radiador del Taller te quita buena parte del daño.' },
  { m: 480,  de: 'Doña Chela, la Compañía', x: 'Casi medio kilómetro. Te lo ganaste. Y oye: más abajo hay bolsas de gas que no se ven. Casco y radiador, hazme caso.', q: 25000 },
  { m: 560,  de: 'Maquinita 22 · «El Güero»', x: 'Se me cerró el túnel… no tengo cómo subir. Si ves a mi familia, diles que casi lo logro.' },
  { m: 615,  de: 'Maquinita 9', x: '¡LA ENCONTRÉ! ¡La veta madre! Es… es enorme… ¿qué es ese rui—?' },
  { m: 795,  de: 'Doña Chela, la Compañía', x: 'Tu altímetro está fallando. Regresa. Es una orden. …Te digo que regreses.' },
  { m: 1000, de: 'El fondo de la Corteza', x: 'Tocaste fondo. Debajo hay otra capa esperando: el Acuífero. Pronto.' },
];

const RANGOS = [[0, 'Aprendiz'], [100, 'Peón'], [200, 'Barretero'], [300, 'Perforista'], [400, 'Dinamitero'], [500, 'Fogonero'], [600, 'Capataz'], [700, 'Gambusino'], [800, 'Maestro minero'], [1000, 'Leyenda de la Corteza']];

const MODELOS = [['#ffd23f', '#b07a00'], ['#ff6b5a', '#a8322a'], ['#6ec3ff', '#2a6fa8'], ['#6fdc7a', '#2f8a3a'], ['#c05cff', '#7426a8'], ['#ff9f40', '#b05e12'], ['#f3e6d8', '#9a8774'], ['#ff7ac8', '#a8327a']];

const MODOS = {
  paseo:   { comb: 0, caida: 0, lava: 0, gas: 0, verGas: 1, pierde: 0, rescates: -1 },
  clasico: { comb: 1, caida: 1, lava: 1, gas: 1, verGas: 0, pierde: 2, rescates: 3 },
  rudo:    { comb: 1, caida: 2, lava: 2, gas: 2, verGas: 0, pierde: 3, rescates: 0 },
};
const MULT = [0, 1, 1.5];

/* ── Estado ── */
let S = null;                  // lo que se guarda de mi maquinita
let cfg = { ...MODOS.clasico, modo: 'clasico', nombre: '', puerta: 0, reminTodos: 1, regalos: 1 };
let seed = 1, remin = 0, SEM = 1, soyCreador = false, miI = -1, mundoId = '', miK = '', miModelo = 0, miNombre = '';
const dug = new Uint8Array(W * H / 8), mapa = new Uint8Array(W * H).fill(255);
const otros = new Map();       // las demás maquinitas
const yo = { x: INICIO_X, y: INICIO_Y, vx: 0, vy: 0, dir: 1, suelo: false, vuela: false, perf: null };
const teclas = {};
let menu = null, pausa = false, listo = false, corriendo = false, conectado = false, sucio = false;
let parts = [], senales = [], temblor = 0, tiempo = 0, cuentaFin = 0;
let op = leer('mina_op', {});
op = { vol: 0.7, temblor: 1, part: 2, texto: 1, contraste: 0, dalton: 0, nombres: 1, zoom: 1, ahorro: 0, ...op };

function leer(k, def) { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } }
function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

function nuevoEstado() {
  return {
    d: 20, eq: [0, 0, 0, 0, 0, 0], carga: Array(10).fill(0), obj: [0, 0, 0, 0, 0, 0],
    fuel: 3, vida: 10, x: INICIO_X, y: INICIO_Y, rec: 0, tot: 0, msj: 0, rango: 0, resc: 0, reminGratis: 1, mejor: -1,
    st: { viajes: 0, cavadas: 0, rec: Array(10).fill(0), vend: Array(10).fill(0), hall: [0, 0, 0, 0], muertes: 0, expl: 0, remin: 0, comb: 0, mejorViaje: 0 },
    log: [], fl: {}, vj: { dano: 0 }, con: { tut: 0, act: [] },
  };
}

// Un estado guardado puede venir viejo o incompleto: se endereza antes de usarlo.
function sanear(e) {
  const b = nuevoEstado(), num = (v, d, min = 0, max = Infinity) => (Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : d);
  const lista = (a, n, max) => Array.from({ length: n }, (_, i) => Math.floor(num(a && a[i], 0, 0, max)));
  const s = { ...b, ...(e && typeof e === 'object' ? e : {}) };
  s.eq = lista(s.eq, 6, 6); s.carga = lista(s.carga, 10, 999); s.obj = lista(s.obj, 6, 9999);
  s.d = num(s.d, 20); s.tot = num(s.tot, 0); s.rec = Math.floor(num(s.rec, 0, 0, H * 2));
  s.msj = Math.floor(num(s.msj, 0, 0, MSJ.length)); s.rango = Math.floor(num(s.rango, 0, 0, RANGOS.length - 1));
  s.resc = Math.floor(num(s.resc, 0)); s.mejor = Math.floor(num(s.mejor, -1, -1, 9)); s.reminGratis = s.reminGratis ? 1 : 0;
  s.x = num(s.x, INICIO_X, HW, W - HW); s.y = num(s.y, INICIO_Y, -14, H);
  s.st = { ...b.st, ...(s.st && typeof s.st === 'object' ? s.st : {}) };
  s.st.rec = lista(s.st.rec, 10, 1e9); s.st.vend = lista(s.st.vend, 10, 1e9); s.st.hall = lista(s.st.hall, 4, 1e9);
  for (const k of ['viajes', 'cavadas', 'muertes', 'expl', 'remin', 'comb', 'mejorViaje']) s.st[k] = num(s.st[k], 0);
  s.log = Array.isArray(s.log) ? s.log.filter((x) => typeof x === 'string') : [];
  s.fl = s.fl && typeof s.fl === 'object' ? s.fl : {}; s.vj = s.vj && typeof s.vj === 'object' ? s.vj : { dano: 0 };
  const c = s.con && typeof s.con === 'object' ? s.con : {};
  s.con = { tut: Math.floor(num(c.tut, 0, 0, TUTORIAL.length)), act: (Array.isArray(c.act) ? c.act : []).filter((k) => k && typeof k.tp === 'string' && typeof k.tx === 'string' && Number.isFinite(k.pg)).slice(0, 3) };
  const tq = PZ[3].niv[s.eq[3]][2], vm = PZ[1].niv[s.eq[1]][2], bd = PZ[5].niv[s.eq[5]][2];
  s.fuel = num(s.fuel, 3, 0, tq); s.vida = num(s.vida, vm, 1, vm);
  let sobra = s.carga.reduce((a, x) => a + x, 0) - bd;
  for (let i = 0; i < 10 && sobra > 0; i++) { const q = Math.min(sobra, s.carga[i]); s.carga[i] -= q; sobra -= q; }
  return s;
}

/* ── Lo que da cada pieza ── */
const nv = (p) => PZ[p].niv[S.eq[p]][2];
const pot = () => nv(0), vidaMax = () => nv(1), hp = () => nv(2), tanque = () => nv(3), rad = () => nv(4) / 100, bodega = () => nv(5);
const nCarga = () => S.carga.reduce((a, b) => a + b, 0);
const kgCarga = () => S.carga.reduce((a, b, i) => a + b * MIN[i].kg, 0);
const prof = () => Math.max(0, Math.round((yo.y + HH) * 2));

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);
// Solo toca el DOM si el contenido cambió: así un clic nunca cae sobre un elemento recién reemplazado.
function poner(el, h) { if (el._h !== h) { el._h = h; el.innerHTML = h; } }

function fmt(n) {
  n = Math.floor(n);
  if (!Number.isFinite(n)) return '$0';
  if (n < 1e6) return '$' + n.toLocaleString('es-MX');
  const u = [[1e24, 'ad'], [1e21, 'ac'], [1e18, 'ab'], [1e15, 'aa'], [1e12, 'T'], [1e9, 'B'], [1e6, 'M']];
  for (const [v, s] of u) if (n >= v) return '$' + (n / v).toFixed(2).replace(/\.?0+$/, '') + ' ' + s;
}

/* ════════ El terreno: se calcula con la semilla ════════ RLR */
function azar(x, y, s) {
  let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(SEM + s * 7919 | 0, 2147483647);
  n = Math.imul(n ^ (n >>> 13), 1274126177); n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}
const rampa = (m, a, b) => (m < a ? 0 : Math.min(1, 0.15 + 0.85 * (m - a) / Math.max(1, b - a)));
const pesosFila = new Map();
function mineralEn(y, r) {
  let p = pesosFila.get(y);
  if (!p) {
    const m = (y + 1) * 2;
    // cada mineral sube hasta su profundidad «común» y después se va apagando para dejarle lugar a los más valiosos
    p = MIN.map((mi, i) => PESO_MIN[i] * rampa(m, mi.a, mi.c) * (i < 8 && m > mi.c ? Math.max(0.2, 1 - (m - mi.c) / 450) : 1));
    const t = p.reduce((a, b) => a + b, 0);
    let ac = 0; p = p.map((v) => (ac += v / t));
    pesosFila.set(y, p);
  }
  for (let i = 0; i < 10; i++) if (r < p[i]) return i;
  return 0;
}
function mejorMineral(y) { const m = (y + 1) * 2; let b = 0; for (let i = 0; i < 10; i++) if (MIN[i].a <= m) b = i; return b; }
function veta(b) { return [3 + Math.floor(azar(b, 0, 11) * (W - 6)), b * 75 + 8 + Math.floor(azar(b, 1, 12) * 60)]; }

// Tipos: 0 hueco · 1 tierra · 2 piedra · 3 lava · 4 gas · 5 firme · 10-19 mineral · 20-23 hallazgo
function gen(x, y) {
  if (x < 0 || x >= W || y >= H) return 5;
  if (y < 0) return 0;
  if (y < 2 && x >= ZX0 && x <= ZX1) return 5;
  const m = (y + 1) * 2;
  const [vx, vy] = veta(Math.floor(y / 75));
  if (Math.abs(x - vx) <= 1 && Math.abs(y - vy) <= 1) return 10 + mejorMineral(vy);
  const r = azar(x, y, 1);
  if (r < 0.0006) { const h = azar(x, y, 2); return 20 + (h < 0.5 ? 0 : h < 0.8 ? 1 : h < 0.95 ? 2 : 3); }
  if (y < 1) return 1;
  if (r < 0.05) return 0;
  let p = 0.19;
  if (r < p) return 10 + mineralEn(y, azar(x, y, 3));
  if (m >= 210) { p += 0.02 + 0.13 * (m - 210) / 790; if (r < p) return 2; }
  if (m >= 410) { p += 0.01 + 0.04 * (m - 410) / 590; if (r < p) return 3; }
  if (m >= 650) { p += m < 680 ? 0.01 : 0.08 + 0.37 * Math.min(1, (m - 680) / 280); if (r < p) return 4; }
  return 1;
}
function celda(x, y) {
  if (x < 0 || x >= W || y >= H) return 5;
  if (y < 0) return 0;
  const i = y * W + x;
  let t = mapa[i];
  if (t === 255) t = mapa[i] = (dug[i >> 3] & (1 << (i & 7))) ? 0 : gen(x, y);
  return t;
}
function ponerCavada(i) { dug[i >> 3] |= 1 << (i & 7); mapa[i] = 0; }
function cavar(lista) {            // marca aquí y avisa al mundo
  const c = [];
  for (const [x, y] of lista) {
    if (x < 0 || x >= W || y < 0 || y >= H) continue;
    const t = celda(x, y);
    if (t === 0 || t === 5) continue;
    ponerCavada(y * W + x); c.push(y * W + x);
  }
  if (c.length) { if (conectado) enviar({ t: 'cava', c }); else pendientes.push(...c); }
  return c;
}
let pendientes = [];                // celdas cavadas mientras no había conexión
const recientes = new Map();        // premios recién dados, por si el mundo dice que otro llegó antes
function nuevaSemilla() { SEM = (seed + remin * 104729) | 0; mapa.fill(255); pesosFila.clear(); }

/* ════════ Sonido sintetizado ════════ */
let AC = null;
function audio() { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch {} return AC; }
function tono(f, d = 0.08, tipo = 'square', v = 0.05, f2 = 0, cuando = 0) {
  if (!op.vol || !AC) return;
  const t = AC.currentTime + cuando, o = AC.createOscillator(), g = AC.createGain();
  o.type = tipo; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(v * op.vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + 0.02);
}
function ruido(d = 0.3, v = 0.25) {
  if (!op.vol || !AC) return;
  const n = Math.floor(AC.sampleRate * d), b = AC.createBuffer(1, n, AC.sampleRate), a = b.getChannelData(0);
  for (let i = 0; i < n; i++) a[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 2;
  const s = AC.createBufferSource(), g = AC.createGain(); s.buffer = b; g.gain.value = v * op.vol;
  s.connect(g).connect(AC.destination); s.start();
}
const son = {
  mineral: (i) => { tono(520 + i * 70, 0.09, 'triangle', 0.09); tono(780 + i * 105, 0.12, 'triangle', 0.07, 0, 0.07); },
  moneda: (n = 0) => tono(880 + n * 40, 0.05, 'square', 0.04),
  compra: () => { tono(523, 0.08, 'triangle', 0.09); tono(659, 0.08, 'triangle', 0.09, 0, 0.08); tono(784, 0.16, 'triangle', 0.09, 0, 0.16); },
  logro: () => { [523, 659, 784, 1047].forEach((f, i) => tono(f, 0.14, 'triangle', 0.09, 0, i * 0.09)); },
  dano: () => { tono(160, 0.18, 'sawtooth', 0.12, 60); },
  boom: () => { ruido(0.5, 0.4); tono(90, 0.4, 'sine', 0.2, 30); },
  no: () => tono(130, 0.07, 'square', 0.05),
  alarma: () => tono(990, 0.09, 'square', 0.06),
  bip: () => tono(1400, 0.04, 'sine', 0.07),
  tele: () => tono(200, 0.5, 'sine', 0.1, 1800),
};

/* ════════ Avisos, tarjetas y celebración ════════ */
function aviso(x) {
  const d = document.createElement('div'); d.textContent = x;
  const c = $('#avisos'); c.appendChild(d);
  while (c.children.length > 6) c.firstChild.remove();
  setTimeout(() => d.remove(), 9000);
}
function tarjeta(t, x, clase = '', ms = 4500) {
  const d = document.createElement('div'); if (clase) d.className = clase;
  const h = document.createElement('h3'); h.textContent = t; d.appendChild(h);
  if (x) { const p = document.createElement('p'); p.textContent = x; d.appendChild(p); }
  colaTarjetas.push([d, ms]); sacarTarjeta();
}
const colaTarjetas = [];
function sacarTarjeta() {
  const c = $('#tarjeta');
  while (c.children.length < 2 && colaTarjetas.length) {
    const [d, ms] = colaTarjetas.shift(); c.appendChild(d);
    setTimeout(() => { d.remove(); sacarTarjeta(); }, colaTarjetas.length > 2 ? Math.min(ms, 2500) : ms);
  }
}
function difundir(x) { enviar({ t: 'aviso', x }); }
function chispas(x, y, col, n = 8, f = 4) {
  if (!op.part) return;
  n = op.part === 1 ? Math.ceil(n / 3) : n;
  for (let i = 0; i < n && parts.length < 400; i++) parts.push({ x, y, vx: (Math.random() - 0.5) * f, vy: (Math.random() - 0.8) * f, t: 0.5 + Math.random() * 0.4, col });
}
function temblar(q) { if (op.temblor) temblor = Math.max(temblor, q); }

/* ════════ Logros ════════ RLR */
const LOGROS = [
  ...MIN.map((m, i) => ({ id: 'm' + i, n: 'Primer ' + m.n, d: 'Carga tu primera pieza de ' + m.n + '.', ok: () => S.st.rec[i] > 0 })),
  ...HALL.map((h, i) => ({ id: 'h' + i, n: h.n, d: 'Encuentra este hallazgo.', ok: () => S.st.hall[i] > 0 })),
  { id: 'venta', n: 'Primera venta', d: 'Vende tu primera carga.', ok: () => S.st.viajes >= 1 },
  { id: 'mejora', n: 'Primera mejora', d: 'Compra una pieza en El Taller.', ok: () => S.eq.some((e) => e > 0) },
  { id: 'diez', n: 'Minero de oficio', d: 'Completa 10 viajes.', ok: () => S.st.viajes >= 10 },
  { id: 'cien', n: 'Cien viajes', d: 'Completa 100 viajes.', ok: () => S.st.viajes >= 100 },
  { id: 'perfecto', n: 'Viaje perfecto', d: 'Vuelve con la bodega llena y cero daño.', ok: () => S.fl.perfecto },
  { id: 'filo', n: 'Al filo', d: 'Llega a la Gasolinera con menos del 5 % de combustible.', ok: () => S.fl.filo },
  { id: 'cienmil', n: 'Viaje de cien mil', d: 'Vende $100,000 en un solo viaje.', ok: () => S.st.mejorViaje >= 100000 },
  { id: 'millon', n: 'Mi primer millón', d: 'Gana $1,000,000 en total.', ok: () => S.tot >= 1e6 },
  { id: 'midas', n: 'Midas', d: 'Vende 10 piezas de Oro en un viaje.', ok: () => S.fl.midas },
  { id: 'r500', n: 'Medio kilómetro', d: 'Llega a 500 m.', ok: () => S.rec >= 500 },
  { id: 'fondo', n: 'Tocar fondo', d: 'Llega al fondo de la Corteza.', ok: () => S.rec >= 1000 },
  { id: 'equipo', n: 'Equipo completo', d: 'Las seis piezas en su nivel más alto.', ok: () => S.eq.every((e) => e === 6) },
  { id: 'dinamitero', n: 'Dinamitero', d: 'Usa 10 explosivos.', ok: () => S.st.expl >= 10 },
  { id: 'lava', n: 'Baño de lava', d: 'Sobrevive a la lava.', ok: () => S.fl.lava },
  { id: 'gas', n: 'Sobreviviente', d: 'Sobrevive a una bolsa de gas.', ok: () => S.fl.gas },
  { id: 'veta', n: 'La veta madre', d: 'Encuentra una veta madre.', ok: () => S.fl.veta },
  { id: 'remin', n: 'Tierra nueva', d: 'Remineraliza el tablero.', ok: () => S.st.remin >= 1 },
  { id: 'catalogo', n: 'Catálogo completo', d: 'Vende los 10 minerales y encuentra los 4 hallazgos.', ok: () => catalogoCompleto() },
  { id: 'intacto', n: 'Sin rasguños', d: 'Llega a 500 m sin recibir daño en el viaje.', ok: () => S.fl.intacto },
  { id: 'pase', n: 'Buen compañero', d: 'Pásale combustible a otra maquinita.', ok: () => S.fl.pase },
  { id: 'vecino', n: 'Buen vecino', d: 'Regálale dinero a otro jugador.', ok: () => S.fl.regalo },
  { id: 'equipo3', n: 'Cuadrilla', d: 'Tres maquinitas bajo los 500 m al mismo tiempo.', ok: () => S.fl.equipo3 },
  { id: 'caida', n: '???', d: 'Secreto.', sec: 'Caída libre: sobrevive a una caída de más de 46 celdas.', ok: () => S.fl.caida },
  { id: 'tacano', n: '???', d: 'Secreto.', sec: 'Tacaño: llega a 300 m con todo el equipo de fábrica.', ok: () => S.fl.tacano },
];
const catalogoCompleto = () => S.st.vend.every((v) => v > 0) && S.st.hall.every((v) => v > 0);
function revisarLogros() {
  for (const l of LOGROS) {
    if (S.log.includes(l.id) || !l.ok()) continue;
    S.log.push(l.id); sucio = true;
    const nombre = l.sec ? l.sec.split(':')[0] : l.n;
    tarjeta('🏅 Logro: ' + nombre, l.sec ? l.sec.split(': ')[1] : l.d);
    son.logro(); difundir('ganó el logro «' + nombre + '»');
  }
}

/* ════════ Contratos ════════ */
const TUTORIAL = [
  { tp: 'comb', tx: 'Carga combustible en la Gasolinera (párate enfrente y pulsa ↓)', pg: 50 },
  { tp: 'venta', tx: 'Perfora hacia abajo, recoge mineral y véndelo en La Báscula', pg: 100 },
  { tp: 'mejora', tx: 'Compra tu primera mejora en El Taller', pg: 150 },
  { tp: 'prof', a: 70, tx: 'Llega a 70 m de profundidad', pg: 200 },
  { tp: 'llena', tx: 'Regresa con la bodega llena y véndela', pg: 300 },
  { tp: 'prof', a: 140, tx: 'Llega a 140 m', pg: 400 },
  { tp: 'expl', tx: 'Te regalamos una dinamita: úsala bajo tierra con la tecla X', pg: 500, regalo: 2 },
  { tp: 'vende', a: 4, b: 1, pr: 0, tx: 'Vende una pieza de Platino (aparece desde 110 m)', pg: 750 },
];
function mineralComun() { let b = 0; for (let i = 0; i < 10; i++) if (MIN[i].c <= S.rec + 30) b = i; return b; }
function nuevoContrato() {
  const mc = mineralComun(), tipico = bodega() * MIN[mc].v * 0.6, pg = Math.max(200, Math.round(tipico * 0.4 / 50) * 50);
  const ya = S.con.act.map((c) => c.tp);
  const tipos = ['vende', 'sindano', 'filo', 'viajeV', 'hall'].filter((t) => !ya.includes(t));
  const tp = tipos[Math.floor(Math.random() * tipos.length)];
  if (tp === 'vende') { const b = Math.min(bodega(), 3 + Math.floor(Math.random() * 5)); return { tp, a: mc, b, pr: 0, pg, tx: `Entrega ${b} de ${MIN[mc].n}` }; }
  if (tp === 'sindano') { const a = Math.round(Math.min(950, S.rec + 60) / 10) * 10; return { tp, a, pg, tx: `Baja a ${a} m sin recibir daño en el viaje` }; }
  if (tp === 'filo') return { tp, pg, tx: 'Llega a la Gasolinera con menos del 10 % de combustible' };
  if (tp === 'viajeV') { const a = Math.round(tipico * 1.2 / 10) * 10; return { tp, a, pg, tx: `Vende ${fmt(a)} en un solo viaje` }; }
  return { tp: 'hall', pg: pg * 2, tx: 'Encuentra un hallazgo enterrado' };
}
function surtirContratos() {
  const c = S.con;
  if (c.tut < TUTORIAL.length) {
    if (!c.act.length) {
      const t = { ...TUTORIAL[c.tut] }; c.act = [t];
      if (t.regalo !== undefined && !t.dado) { S.obj[t.regalo]++; t.dado = 1; }
    }
  } else while (c.act.length < 3) c.act.push(nuevoContrato());
  pintarContratos();
}
function evento(tp, d) {
  if (!S) return;
  const c = S.con; let cambio = false;
  for (let i = c.act.length - 1; i >= 0; i--) {
    const k = c.act[i]; let ok = false;
    if (k.tp === tp && ['comb', 'venta', 'mejora', 'expl', 'hall', 'filo'].includes(tp)) ok = true;
    else if (k.tp === 'prof' && tp === 'prof') ok = d >= k.a;
    else if (k.tp === 'sindano' && tp === 'prof') ok = d >= k.a && !S.vj.dano;
    else if (k.tp === 'llena' && tp === 'venta') ok = d.llena;
    else if (k.tp === 'viajeV' && tp === 'venta') ok = d.total >= k.a;
    else if (k.tp === 'vende' && tp === 'venta') { k.pr = (k.pr | 0) + (d.n[k.a] | 0); ok = k.pr >= k.b; cambio = true; }
    if (!ok) continue;
    c.act.splice(i, 1); cambio = true;
    S.d += k.pg; S.tot += k.pg;
    if (c.tut < TUTORIAL.length) c.tut++;
    tarjeta('Contrato cumplido · ' + fmt(k.pg), k.tx); son.compra();
  }
  if (cambio) { sucio = true; surtirContratos(); }
}
function pintarContratos() {
  poner($('#contratos'), S.con.act.map((k) =>
    `<div class="c">${esc(k.tx)}${k.b > 1 ? ` (${k.pr | 0}/${k.b})` : ''} · <small>${fmt(k.pg)}</small></div>`).join(''));
}

/* ════════ Daño, muerte y rescate ════════ */
function danar(q, causa) {
  q = Math.round(q);
  if (q <= 0 || !S) return;
  S.vida -= q; S.vj.dano = 1; sucio = true;
  son.dano(); temblar(Math.min(14, 3 + q / 6)); chispas(yo.x, yo.y, '#ff6b5a', 10, 6);
  if (S.vida <= 0) morir(causa);
}
function morir(causa) {
  son.boom(); temblar(16); chispas(yo.x, yo.y, '#ffb347', 40, 10);
  S.st.muertes++;
  const gratis = cfg.rescates < 0 || S.resc < cfg.rescates;
  let x = '';
  if (cfg.pierde >= 1 && nCarga()) { S.carga.fill(0); x = 'Perdiste la carga. '; }
  if (gratis) { S.resc++; x += cfg.rescates > 0 ? `Rescate gratis (${S.resc} de ${cfg.rescates}).` : 'Rescate gratis.'; }
  else {
    if (cfg.pierde >= 2) { const c = vidaMax() * 15 + tanque(); const p = Math.min(S.d, c); S.d -= p; x += `Reparación y tanque: ${fmt(p)}. `; }
    if (cfg.pierde >= 3) { const p = Math.floor(S.d * 0.1); S.d -= p; x += `Y el 10 % de tu dinero: ${fmt(p)}.`; }
  }
  S.vida = vidaMax(); S.fuel = tanque(); S.vj.dano = 0;
  yo.renace = true;
  tarjeta(causa === 'combustible' ? '💥 Te quedaste sin combustible' : '💥 Tu maquinita explotó', x || 'Reapareces en la superficie.', '', 6000);
  difundir(causa === 'combustible' ? 'se quedó sin combustible' : 'explotó (' + causa + ')');
  sucio = true; enviarEst();
}

/* ════════ Física ════════ RLR */
const solida = (x, y) => celda(x, y) !== 0;
function fisica(dt) {
  if (yo.renace) { yo.renace = false; yo.x = INICIO_X; yo.y = INICIO_Y; yo.vx = yo.vy = 0; yo.perf = null; return; }
  const p = yo.perf;
  if (p) {                                   // perforando: avanza hacia la celda
    p.t += dt;
    gastar(20 / 60 * dt);
    if (yo.renace) return;
    const e = Math.min(1, p.t / p.dur);
    yo.x = p.ox + (p.tx + 0.5 - p.ox) * e; yo.y = p.oy + (p.ty + 1 - HH - p.oy) * e;
    if (Math.random() < 0.5) chispas(p.tx + 0.5, p.ty + 0.5, '#a9744f', 1, 3);
    if (e >= 1) { yo.perf = null; yo.vx = yo.vy = 0; llegar(p); }
    return;
  }
  // Red de seguridad: si el terreno cambió y quedé dentro de la tierra, salgo a la superficie.
  if (solida(Math.floor(yo.x), Math.floor(yo.y))) { yo.x = INICIO_X; yo.y = INICIO_Y; yo.vx = yo.vy = 0; yo.suelo = true; aviso('El terreno cambió: tu maquinita salió a la superficie.'); return; }
  const reserva = S.fuel <= 0;                // solo pasa en mundos donde no explota
  const k = reserva ? 0.5 : 1;
  const izq = teclas.izq, der = teclas.der, arr = teclas.arr, aba = teclas.aba;
  const caballos = hp(), pesoMax = caballos * 29.5, peso = 1980 + kgCarga();
  const vmax = (5 + (caballos - 150) / 30) * k;
  if (izq && !der) { yo.vx -= 22 * dt; yo.dir = -1; } else if (der && !izq) { yo.vx += 22 * dt; yo.dir = 1; }
  else yo.vx *= Math.pow(yo.suelo ? 0.0004 : 0.25, dt);
  yo.vx = Math.max(-vmax, Math.min(vmax, yo.vx));
  yo.vuela = false;
  if (arr) {
    const sube = Math.max(-G * 0.6, 26 * (1 - peso / pesoMax)) * k;   // con sobrepeso la hélice solo frena la caída
    yo.vy -= (G + sube) * dt; yo.vuela = true;
  }
  yo.vy += G * dt;
  const vsube = (6 + (caballos - 150) / 20) * k;
  yo.vy = Math.max(-vsube, Math.min(36, yo.vy));
  // parado en la superficie no gasta: nadie explota por leer un letrero
  const quieto = yo.suelo && yo.y < 0 && !yo.vuela && Math.abs(yo.vx) < 0.5;
  if (!quieto) gastar((yo.vuela ? 17 : Math.abs(yo.vx) > 0.5 ? 8 : 5) / 60 * dt);
  if (yo.renace) return;

  // eje X
  let nx = yo.x + yo.vx * dt, toca = 0;
  if (yo.vx !== 0) {
    const s = yo.vx > 0 ? 1 : -1, cx = Math.floor(nx + s * HW);
    const y0 = Math.floor(yo.y - HH + 0.02), y1 = Math.floor(yo.y + HH - 0.02);
    let choca = false;
    for (let y = y0; y <= y1; y++) if (solida(cx, y)) { choca = true; break; }
    if (choca) {
      const cyc = Math.floor(yo.y);
      if (y0 !== y1 && !solida(cx, cyc)) {
        // El túnel está a la altura del centro: la maquinita se acomoda sola y entra.
        if (yo.vy > 0) aterrizar(yo.vy);
        if (yo.renace) return;
        yo.y = Math.max(cyc + HH + 0.001, Math.min(cyc + 1 - HH, yo.y)); yo.vy = 0;
      } else { nx = s > 0 ? cx - HW - 0.001 : cx + 1 + HW + 0.001; yo.vx = 0; toca = s; }
    }
  }
  yo.x = nx;
  // eje Y
  let ny = yo.y + yo.vy * dt;
  const x0 = Math.floor(yo.x - HW + 0.02), x1 = Math.floor(yo.x + HW - 0.02);
  const antes = yo.suelo; yo.suelo = false;
  const cxc = Math.floor(yo.x), alCentro = cxc + 0.5 - yo.x;
  const seAleja = (izq && alCentro > 0) || (der && alCentro < 0);      // el jugador empuja hacia el lado que sí lo sostiene
  let resbala = false;
  if (yo.vy > 0) {
    const cy = Math.floor(ny + HH);
    let apoyo = false;
    for (let x = x0; x <= x1; x++) if (solida(x, cy)) { apoyo = true; break; }
    if (apoyo) {
      ny = cy - HH;
      if (!antes && !yo.resbala) aterrizar(yo.vy);
      yo.vy = 0;
      if (!solida(cxc, cy) && !seAleja) {
        // El centro quedó sobre un hueco: resbala hacia él y cae, en vez de quedarse colgada de la orilla.
        resbala = true; yo.vx = 0; yo.x += Math.sign(alCentro) * Math.min(Math.abs(alCentro), 7 * dt);
      } else yo.suelo = true;
    }
  } else if (yo.vy < 0) {
    const cy = Math.floor(ny - HH);
    let tope = false;
    for (let x = x0; x <= x1; x++) if (solida(x, cy)) { tope = true; break; }
    if (tope) {
      ny = cy + 1 + HH + 0.001;
      // Si el tiro está justo arriba del centro, se acomoda y sigue subiendo; si no, topa.
      if (!solida(cxc, cy) && !seAleja) yo.x += Math.sign(alCentro) * Math.min(Math.abs(alCentro), 7 * dt);
      else yo.vy = 0;
    }
  }
  yo.resbala = resbala;
  if (ny < -14) { ny = -14; yo.vy = Math.max(0, yo.vy); }
  yo.y = ny;
  if (yo.renace) return;

  // empezar a perforar
  if (yo.suelo && !reserva && !arr) {
    const cx = Math.floor(yo.x), cy = Math.floor(yo.y);
    if (aba && !izq && !der) perforar(cx, cy + 1);
    else if (izq && !der && (toca < 0 || yo.x - HW - 0.06 <= cx)) perforar(cx - 1, cy);
    else if (der && !izq && (toca > 0 || yo.x + HW + 0.06 >= cx + 1)) perforar(cx + 1, cy);
  }
}
function gastar(l) {
  if (!S || S.fuel <= 0) return;
  S.fuel -= l;
  if (S.fuel <= 0) { S.fuel = 0; if (cfg.comb) morir('combustible'); else tarjeta('Entraste en reserva', 'Avanzas despacio y no perforas hasta cargar combustible.'); }
}
function aterrizar(v) {
  const h = v * v / (2 * G);
  if (h < 2) return;
  const d = h < 3 ? 3 : h < 5 ? 4 : h < 9 ? 5 : h < 17 ? 6 : h < 46 ? 7 : 8;
  tono(90, 0.12, 'sine', 0.15);
  danar(d * MULT[cfg.caida], 'una caída');
  if (h >= 46 && !yo.renace && cfg.caida) S.fl.caida = 1;
}
let ultNo = 0;
function perforar(x, y) {
  const t = celda(x, y);
  if (t === 0) return;
  if (t === 2 || t === 5) { if (tiempo - ultNo > 0.4) { son.no(); ultNo = tiempo; if (t === 2 && !S.fl.piedra) { S.fl.piedra = 1; tarjeta('Piedra', 'El taladro no entra. Rodéala o vuélala con dinamita (X).'); } } return; }
  const m = (y + 1) * 2;
  let dur = 0.6 * (20 / pot()) * (1 + 4 * m / 1000);
  if (t === 3 && !cfg.lava) dur *= 3;
  yo.perf = { tx: x, ty: y, t: 0, dur, tipo: t, ox: yo.x, oy: yo.y, idx: y * W + x };
  cavar([[x, y]]);
  S.st.cavadas++;
}
function llegar(p) {
  const t = p.tipo, x = p.tx + 0.5, y = p.ty + 0.5;
  if (t >= 10 && t < 20) {
    const i = t - 10;
    if (nCarga() < bodega()) {
      S.carga[i]++; S.st.rec[i]++; son.mineral(i); chispas(x, y, MIN[i].col, 12, 5);
      recientes.set(p.idx, [t, Date.now()]);
      if (S.st.rec[i] === 1) { tarjeta('¡Descubriste ' + MIN[i].n + '!', 'Vale ' + fmt(MIN[i].v) + ' la pieza.'); difundir('descubrió ' + MIN[i].n); }
      const [vx, vy] = veta(Math.floor(p.ty / 75));
      if (Math.abs(p.tx - vx) <= 1 && Math.abs(p.ty - vy) <= 1 && !S.fl.veta) { S.fl.veta = 1; tarjeta('✨ ¡Veta madre!', 'Un racimo entero del mejor mineral de la zona.'); }
      if (nCarga() === bodega()) { tarjeta('Bodega llena', 'Sube a vender: lo que perfores ahora se pierde.'); son.alarma(); }
    } else { aviso('Bodega llena: se perdió una pieza de ' + MIN[i].n); son.no(); }
  } else if (t >= 20) {
    const h = HALL[t - 20];
    S.d += h.v; S.tot += h.v; S.st.hall[t - 20]++;
    recientes.set(p.idx, [t, Date.now()]);
    tarjeta('🏺 ¡' + h.n + '!', 'Hallazgo: ' + fmt(h.v) + ' al instante.'); son.logro(); chispas(x, y, '#ffd23f', 24, 7);
    difundir('encontró ' + h.n); evento('hall');
  } else if (t === 3 && cfg.lava) {
    danar((Math.random() < 0.5 ? 58 : 41) * (1 - rad()) * MULT[cfg.lava], 'la lava');
    chispas(x, y, '#ff7a1a', 20, 6);
    if (!yo.renace) S.fl.lava = 1;
  } else if (t === 4 && cfg.gas) {
    const lista = [];
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) lista.push([p.tx + a, p.ty + b]);
    cavar(lista); son.boom(); chispas(x, y, '#7dff6b', 40, 9);
    danar(Math.max(0, ((p.ty + 1) * 2 - 410) / 2.05) * (1 - rad()) * MULT[cfg.gas], 'una bolsa de gas');
    if (!yo.renace) S.fl.gas = 1;
  }
  sucio = true;
}

/* ════════ Objetos ════════ */
function usar(i) {
  if (!S || menu || pausa) return;
  if (!S.obj[i]) { son.no(); return; }
  const suelo = yo.suelo && !yo.perf;
  if (i >= 2 && !suelo) { aviso('Solo se puede usar tocando suelo.'); son.no(); return; }
  if (i === 0) { if (S.fuel >= tanque()) return; S.fuel = Math.min(tanque(), S.fuel + 25); son.compra(); }
  else if (i === 1) { if (S.vida >= vidaMax()) return; S.vida = Math.min(vidaMax(), S.vida + 30); son.compra(); }
  else if (i === 2 || i === 3) {
    const r = i === 2 ? 1 : 2, cx = Math.floor(yo.x), cy = Math.floor(yo.y), lista = [];
    for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) lista.push([cx + a, cy + b]);
    cavar(lista); son.boom(); temblar(i === 2 ? 9 : 14); chispas(yo.x, yo.y, '#ffb347', 50, i === 2 ? 9 : 13);
    S.st.expl++; evento('expl');
  } else {
    son.tele(); chispas(yo.x, yo.y, '#6ec3ff', 30, 8);
    yo.x = INICIO_X; yo.vx = yo.vy = 0;
    yo.y = i === 4 && Math.random() < 0.6 ? -(8 + Math.random() * 6) : INICIO_Y;
  }
  S.obj[i]--; sucio = true; pintarHud(true);
}

/* ════════ Red: el mundo compartido ════════ RLR */
let ws = null, reintento = 500, bautizo = null, tCaido = 0, llaveAntes = '';
function enviar(o) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); }
function enviarEst() {
  if (!S || !conectado) return;
  if (yo.renace) { S.x = INICIO_X; S.y = INICIO_Y; } else { S.x = yo.x; S.y = yo.perf ? yo.perf.oy : yo.y; }
  enviar({ t: 'est', e: S, rec: S.rec, tot: Math.floor(S.tot) });
  sucio = false;
}
const bufPos = new Uint8Array(6); let ultPos = '';
function enviarPos() {
  if (!conectado || ![...otros.values()].some((o) => o.on)) return;
  const x = Math.round(yo.x * 256), y = Math.round((yo.y + 40) * 64);
  const f = (yo.dir > 0 ? 1 : 0) | (yo.vuela ? 2 : 0) | (yo.perf ? 4 : 0) | (menu || pausa ? 8 : 0);
  const k = x + ',' + y + ',' + f;
  if (k === ultPos) return; ultPos = k;
  bufPos[0] = 1; bufPos[1] = x & 255; bufPos[2] = x >> 8; bufPos[3] = y & 255; bufPos[4] = y >> 8; bufPos[5] = f;
  ws.send(bufPos);
}
function conectar() {
  ws = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws/' + mundoId);
  ws.binaryType = 'arraybuffer';
  ws.onopen = () => { reintento = 500; ws.send(JSON.stringify({ t: 'hola', k: miK, ...(bautizo || {}) })); };
  ws.onmessage = (e) => {
    if (typeof e.data !== 'string') return recibePos(new Uint8Array(e.data));
    if (e.data === 'q') return;
    let d; try { d = JSON.parse(e.data); } catch { return; }
    recibir(d);
  };
  ws.onclose = (e) => {
    conectado = false;
    if (e.code >= 4000 && e.code <= 4002) return;
    tCaido = tCaido || Date.now();
    setTimeout(() => { if (!conectado && listo) { $('#aviso-red').style.display = 'block'; detener(); } }, 3000);
    setTimeout(conectar, reintento); reintento = Math.min(8000, reintento * 2);
  };
}
function recibePos(b) {
  if (b[0] !== 1 || b.length < 7) return;
  const o = otros.get(b[1]); if (!o) return;
  o.tx = (b[2] | b[3] << 8) / 256; o.ty = (b[4] | b[5] << 8) / 64 - 40; o.fl = b[6]; o.on = 1;
  if (o.x === undefined) { o.x = o.tx; o.y = o.ty; }
}
const nombreDe = (i) => (i === miI ? miNombre : otros.get(i)?.n || 'Alguien');
function recibir(d) {
  switch (d.t) {
    case 'nuevo':
      pantallaBautizo(d);
      if (llaveAntes) { miK = llaveAntes; llaveAntes = ''; const n = $('#caja .nota'); if (n) n.textContent = 'Ese código no es de una maquinita de este mundo. Revísalo o bautiza una nueva.'; }
      return;
    case 'noexiste': quitarMundo(mundoId); return pantallaFinal('Este mundo no existe', 'Puede que lo hayan borrado o que la liga esté incompleta.');
    case 'cerrado': return pantallaFinal('Este mundo cerró la puerta', 'Quien lo creó ya no admite maquinitas nuevas.');
    case 'lleno': return pantallaFinal('Este mundo está lleno', 'Hay un tope de 10 jugadores a la vez.');
    case 'otra': detener(); return pantallaFinal('Abriste el juego en otra pestaña', 'Tu maquinita sigue allá.');
    case 'borrado': quitarMundo(mundoId); detener(); return pantallaFinal('Este mundo fue borrado', 'Quien lo creó lo desechó.');
    case 'mundo': return iniciarMundo(d);
    case 'cava': for (const i of d.c) ponerCavada(i); return;
    case 'no': return noFueMia(d.c);
    case 'entra': otros.set(d.j.i, { ...otros.get(d.j.i), ...d.j }); aviso(d.j.n + ' entró al mundo'); ultPos = ''; enviarPos(); return pintarTabla();   // que el recién llegado me vea aunque yo esté quieto
    case 'sale': { const o = otros.get(d.i); if (o) { o.on = 0; o.x = undefined; aviso(o.n + ' salió'); } return pintarTabla(); }
    case 'j': { const o = otros.get(d.i); if (o) { o.rec = d.rec; o.tot = d.tot; } return pintarTabla(); }
    case 'aviso': return aviso(nombreDe(d.i) + ' ' + d.x);
    case 'senal': senales.push({ x: d.x, y: d.y, t: 10, n: nombreDe(d.i) }); son.bip(); return aviso(nombreDe(d.i) + ' marcó un punto');
    case 'fuel': if (S.fuel <= 0 && d.q > 0) tarjeta('Saliste de la reserva', nombreDe(d.i) + ' te pasó combustible.'); S.fuel = Math.min(tanque(), S.fuel + d.q); son.compra(); sucio = true; return aviso(nombreDe(d.i) + ' te pasó ' + d.q + ' litros');
    case 'regalo': S.d += d.q; son.compra(); sucio = true; return tarjeta('🎁 ' + nombreDe(d.i) + ' te regaló ' + fmt(d.q));
    case 'devuelve': if (d.d) S.d += d.d; if (d.fuel) S.fuel = Math.min(tanque(), S.fuel + d.fuel); return aviso('No se pudo entregar: esa maquinita no está conectada.');
    case 'cfg': cfg = d.cfg; tiles.clear(); if (listo) guardarMundo(); if (d.i !== miI) aviso(nombreDe(d.i) + ' cambió las reglas del mundo'); if (menu) pintarMenu(); return;
    case 'cuenta':
      cuentaFin = Date.now() + d.s * 1000; son.alarma();
      if (d.i === miI) { S.d -= Math.min(S.d, costoRemin()); S.reminGratis = 0; S.st.remin++; sucio = true; pintarHud(true); }   // se cobra hasta que el mundo confirma
      if (menu === 'rem') pintarMenu();
      return aviso(nombreDe(d.i) + ' activó la Remineralizadora');
    case 'remin': {
      remin = d.remin; dug.fill(0); nuevaSemilla(); cuentaFin = 0; pendientes = []; recientes.clear();
      yo.perf = null;
      if (yo.y > INICIO_Y + 0.01) { yo.x = INICIO_X; yo.y = INICIO_Y; yo.vx = yo.vy = 0; yo.suelo = true; }
      if (menu) pintarMenu(); else if (!corriendo) dibujar();
      tarjeta('🌋 Tablero remineralizado', 'Tierra nueva y minerales nuevos en toda la capa.'); son.logro(); temblar(12);
      return;
    }
  }
}
function noFueMia(lista) {             // otra maquinita llegó antes a esas celdas: sin premio y sin castigo
  for (const idx of lista) {
    if (yo.perf && yo.perf.idx === idx) { yo.perf.tipo = 1; continue; }
    const r = recientes.get(idx);
    if (!r || Date.now() - r[1] > 6000) continue;
    recientes.delete(idx);
    if (r[0] >= 20) { const v = HALL[r[0] - 20].v; S.d = Math.max(0, S.d - v); S.tot = Math.max(0, S.tot - v); S.st.hall[r[0] - 20] = Math.max(0, S.st.hall[r[0] - 20] - 1); }
    else { const i = r[0] - 10; if (S.carga[i] > 0) S.carga[i]--; S.st.rec[i] = Math.max(0, S.st.rec[i] - 1); }
    aviso('Otra maquinita llegó antes a esa pieza.'); sucio = true;
  }
}
function iniciarMundo(d) {
  const otraTierra = !!S && (d.remin !== remin || d.seed !== seed);
  seed = d.seed; remin = d.remin; cfg = d.cfg; miI = d.i; soyCreador = !!d.creador;
  const b = atob(d.dug); for (let i = 0; i < dug.length; i++) dug[i] = b.charCodeAt(i);
  nuevaSemilla();
  if (otraTierra) { pendientes = []; recientes.clear(); yo.perf = null; if (yo.y > INICIO_Y + 0.01) { yo.x = INICIO_X; yo.y = INICIO_Y; yo.vx = yo.vy = 0; } }
  otros.clear();
  for (const j of d.jug) { if (j.i === miI) { miNombre = j.n; miModelo = j.m; } else otros.set(j.i, j); }
  const primera = !S;
  if (primera) {
    S = sanear(d.est);
    yo.x = S.x; yo.y = S.y; yo.vx = yo.vy = 0;
    if (solida(Math.floor(yo.x), Math.floor(yo.y))) { yo.x = INICIO_X; yo.y = INICIO_Y; }   // el mundo cambió mientras no estaba
  } else sucio = true;                 // al reconectar manda lo que pasó mientras tanto
  if (d.cuenta) cuentaFin = Date.now() + d.cuenta * 1000;
  if (soyCreador && !cfg.nombre) { cfg.nombre = 'Mundo de ' + miNombre; enviar({ t: 'cfg', cfg }); }
  guardarMundo();
  conectado = true; tCaido = 0; listo = true; bautizo = null; llaveAntes = '';
  // lo que se cavó sin conexión: se vuelve a marcar aquí y se le avisa al mundo
  if (pendientes.length) { const c = pendientes; pendientes = []; for (const i of c) ponerCavada(i); for (let i = 0; i < c.length; i += 30) enviar({ t: 'cava', c: c.slice(i, i + 30) }); }
  if (primera) { medir(); camX = Math.max(0, Math.min(W - cols, yo.x - cols / 2)); camY = Math.max(-filas * 0.68, yo.y - filas * 0.5); }
  ultPos = '';
  $('#aviso-red').style.display = 'none';
  if (menu === 'inicio') { menu = null; $('#velo').classList.remove('on'); }
  document.body.classList.add('jugando');
  surtirContratos(); pintarHud(true); pintarTabla(); arrancar();
  if (!d.est) tarjeta('¡Bienvenido, ' + miNombre + '!', 'Flechas o WASD para moverte. Primero: carga combustible en la Gasolinera (↓ para entrar).', 'msj', 9000);
}

/* ════════ Dibujo ════════ RLR */
const lienzo = $('#c'), g = lienzo.getContext('2d');
let DPR = 1, T = 40, cols = 32, filas = 20, camX = 0, camY = -12;
const tiles = new Map();
const TIERRA = [['#8a5a3a', '#7b4e31', '#99684a'], ['#7a4a30', '#6b3f28', '#8a573b'], ['#6a3d2a', '#5b3222', '#7a4933'], ['#55302a', '#472621', '#653a33']];
function medir() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  const w = innerWidth, h = innerHeight;
  lienzo.width = Math.round(w * DPR); lienzo.height = Math.round(h * DPR);
  cols = [26, 32, 40][op.zoom]; T = Math.max(14, Math.ceil(w / cols)); filas = h / T;
  tiles.clear();
  if (listo && !corriendo) dibujar();
}
function tile(tipo, zona, vr) {
  const key = tipo * 100 + zona * 10 + vr; let c = tiles.get(key);
  if (c) return c;
  const P = Math.round(T * DPR); c = document.createElement('canvas'); c.width = c.height = P;
  const q = c.getContext('2d'); let s = key * 9301 + 49297;
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const B = TIERRA[zona], u = P / 16;
  if (tipo === 5) {
    q.fillStyle = '#4a4543'; q.fillRect(0, 0, P, P); q.fillStyle = '#3a3533';
    for (let y = 0; y < 4; y++) { q.fillRect(0, y * 4 * u, P, u * 0.6); q.fillRect(((y % 2) * 8 + 4) * u, y * 4 * u, u * 0.6, 4 * u); }
    return tiles.set(key, c), c;
  }
  q.fillStyle = B[0]; q.fillRect(0, 0, P, P);
  for (let i = 0; i < 18; i++) { q.fillStyle = r() < 0.5 ? B[1] : B[2]; q.fillRect(Math.floor(r() * 15) * u, Math.floor(r() * 15) * u, u * (1 + Math.floor(r() * 2)), u); }
  if (tipo === 2) {
    q.fillStyle = '#6f6a66'; q.beginPath(); q.roundRect(u * 1.5, u * 2, u * 13, u * 12, u * 4); q.fill();
    q.fillStyle = '#8b8581'; q.beginPath(); q.roundRect(u * 3, u * 3, u * 7, u * 4, u * 2); q.fill();
    q.fillStyle = '#55504d'; q.fillRect(u * 9, u * 9, u * 4, u); q.fillRect(u * 4, u * 11, u * 3, u);
  } else if (tipo === 3) {
    q.fillStyle = '#d93a12'; q.fillRect(0, 0, P, P);
    for (let i = 0; i < 9; i++) { q.fillStyle = ['#ff7a1a', '#ffb321', '#ffe066'][i % 3]; q.beginPath(); q.arc(r() * P, r() * P, u * (1 + r() * 2.2), 0, 7); q.fill(); }
  } else if (tipo === 4) {
    q.fillStyle = '#7dff6b55'; q.fillRect(0, 0, P, P);
    for (let i = 0; i < 5; i++) { q.strokeStyle = '#b6ff9e'; q.lineWidth = u * 0.5; q.beginPath(); q.arc(r() * P, r() * P, u * (1 + r() * 1.5), 0, 7); q.stroke(); }
  } else if (tipo >= 10 && tipo < 20) {
    const m = MIN[tipo - 10];
    for (let i = 0; i < 4; i++) {
      const x = (2 + r() * 9) * u, y = (2 + r() * 9) * u, a = (2 + r() * 2) * u;
      q.fillStyle = m.col; q.beginPath(); q.moveTo(x, y - a); q.lineTo(x + a, y); q.lineTo(x, y + a); q.lineTo(x - a, y); q.fill();
      q.fillStyle = '#ffffffaa'; q.fillRect(x - a * 0.3, y - a * 0.5, a * 0.35, a * 0.35);
      q.strokeStyle = '#0006'; q.lineWidth = Math.max(1, u * 0.3); q.stroke();
    }
    if (op.dalton) { q.fillStyle = '#000b'; q.fillRect(u * 3, u * 4.5, u * 10, u * 7); q.fillStyle = '#fff'; q.font = `bold ${u * 6}px system-ui`; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(m.s, P / 2, P / 2 + u * 0.2); }
  } else if (tipo >= 20) {
    const k = tipo - 20;
    q.fillStyle = ['#f3ead8', '#b07a2a', '#e8e0d0', '#ffd23f'][k];
    if (k === 0) { q.fillRect(u * 3, u * 7, u * 10, u * 2); q.beginPath(); q.arc(u * 3, u * 7, u * 1.6, 0, 7); q.arc(u * 3, u * 9, u * 1.6, 0, 7); q.arc(u * 13, u * 7, u * 1.6, 0, 7); q.arc(u * 13, u * 9, u * 1.6, 0, 7); q.fill(); }
    else if (k === 1) { q.fillRect(u * 3, u * 6, u * 10, u * 7); q.fillStyle = '#ffd23f'; q.fillRect(u * 3, u * 8, u * 10, u); q.fillRect(u * 7, u * 8, u * 2, u * 3); q.fillStyle = '#7a5218'; q.fillRect(u * 3, u * 5, u * 10, u * 1.5); }
    else if (k === 2) { q.beginPath(); q.arc(u * 8, u * 7, u * 4, 0, 7); q.fill(); q.fillRect(u * 6, u * 10, u * 4, u * 3); q.fillStyle = '#2a1a14'; q.fillRect(u * 6, u * 6, u * 1.5, u * 2); q.fillRect(u * 8.5, u * 6, u * 1.5, u * 2); }
    else { q.beginPath(); q.moveTo(u * 8, u * 2); q.lineTo(u * 12, u * 8); q.lineTo(u * 8, u * 14); q.lineTo(u * 4, u * 8); q.fill(); q.fillStyle = '#fff8'; q.fillRect(u * 7, u * 5, u * 2, u * 2); }
  }
  return tiles.set(key, c), c;
}
function dibMaq(q, px, py, t, modelo, dir, vuela, perfDir, nombre, estado) {
  const [c1, c2] = MODELOS[modelo] || MODELOS[0], w = t * 0.72, h = t * 0.8, x = px - w / 2, y = py - h / 2;
  if (vuela) { q.fillStyle = '#ddd'; const a = (tiempo * 40) % 2 < 1 ? w * 0.7 : w * 0.25; q.fillRect(px - a, y - t * 0.08, a * 2, t * 0.05); q.fillRect(px - t * 0.02, y - t * 0.08, t * 0.04, t * 0.1); }
  q.fillStyle = '#2b2b2b'; q.beginPath(); q.roundRect(x - t * 0.02, y + h * 0.74, w + t * 0.04, h * 0.26, t * 0.08); q.fill();
  q.fillStyle = '#777'; for (let i = 0; i < 3; i++) q.fillRect(x + w * (0.1 + i * 0.32), y + h * 0.8, w * 0.14, h * 0.12);
  q.fillStyle = c2; q.beginPath(); q.roundRect(x, y + h * 0.12, w, h * 0.66, t * 0.1); q.fill();
  q.fillStyle = c1; q.beginPath(); q.roundRect(x + w * 0.04, y + h * 0.12, w * 0.92, h * 0.5, t * 0.1); q.fill();
  q.fillStyle = '#bfefff'; q.beginPath();
  if (modelo % 2) q.roundRect(px + dir * w * 0.12 - w * 0.17, y + h * 0.2, w * 0.34, h * 0.26, t * 0.04);
  else q.arc(px + dir * w * 0.14, y + h * 0.36, w * 0.17, 0, 7);
  q.fill();
  if (perfDir) {
    q.fillStyle = '#c9ccd1'; q.beginPath();
    const z = (tiempo * 30) % 2 < 1 ? 0.02 : 0;
    if (perfDir === 2) { q.moveTo(px - w * 0.22, y + h); q.lineTo(px + w * 0.22, y + h); q.lineTo(px, y + h + t * (0.3 + z)); }
    else { const s = perfDir; q.moveTo(px + s * w / 2, py - h * 0.2); q.lineTo(px + s * w / 2, py + h * 0.2); q.lineTo(px + s * (w / 2 + t * (0.3 + z)), py); }
    q.fill();
  }
  if (nombre) {
    q.font = `700 ${Math.max(10, t * 0.28)}px system-ui`; q.textAlign = 'center'; q.textBaseline = 'bottom';
    const tx = estado ? nombre + ' · ' + estado : nombre;
    q.lineWidth = 3; q.strokeStyle = '#000c'; q.strokeText(tx, px, y - t * 0.12); q.fillStyle = '#fff'; q.fillText(tx, px, y - t * 0.12);
  }
}
function dibujar() {
  const w = innerWidth, h = innerHeight;
  g.setTransform(DPR, 0, 0, DPR, 0, 0);
  let sx = 0, sy = 0;
  if (temblor > 0.3) { sx = (Math.random() - 0.5) * temblor; sy = (Math.random() - 0.5) * temblor; }
  const ox = Math.round(-camX * T + sx), oy = Math.round(-camY * T + sy);
  // cielo
  if (oy > 0) {
    const gr = g.createLinearGradient(0, oy - 14 * T, 0, oy);
    gr.addColorStop(0, '#3d6fb8'); gr.addColorStop(0.7, '#f2a65a'); gr.addColorStop(1, '#f7c97e');
    g.fillStyle = gr; g.fillRect(0, 0, w, oy);
    g.fillStyle = '#fff2c2'; g.beginPath(); g.arc(ox + 70 * T, oy - 9 * T, T * 1.3, 0, 7); g.fill();
    g.fillStyle = '#c98d5a'; g.beginPath(); g.moveTo(0, oy);
    for (let x = 0; x <= w + 80; x += 80) g.lineTo(x, oy - T * (1.2 + Math.sin((x - ox * 0.4) * 0.006) * 0.9));
    g.lineTo(w + 80, oy); g.fill();
  }
  // subsuelo
  g.fillStyle = '#24160f'; g.fillRect(0, Math.max(0, oy), w, h);
  const x0 = Math.max(0, Math.floor(camX)), x1 = Math.min(W - 1, Math.ceil(camX + cols));
  const y0 = Math.max(0, Math.floor(camY)), y1 = Math.min(H - 1, Math.ceil(camY + filas));
  for (let y = y0; y <= y1; y++) {
    const m = (y + 1) * 2, zona = m < 210 ? 0 : m < 410 ? 1 : m < 650 ? 2 : 3;
    for (let x = x0; x <= x1; x++) {
      let t = celda(x, y);
      if (t === 0) continue;
      if (t === 4 && !cfg.verGas) t = 1;
      g.drawImage(tile(t, zona, t === 1 ? (x * 7 + y * 13) & 3 : 0), ox + x * T, oy + y * T, T, T);
      if (y === 0 && t !== 5) { g.fillStyle = '#5c9e3a'; g.fillRect(ox + x * T, oy, T, Math.ceil(T * 0.12)); }
    }
  }
  // orillas del mundo
  g.fillStyle = '#1a1512';
  if (ox > 0) g.fillRect(0, Math.max(0, oy), ox, h);
  if (ox + W * T < w) g.fillRect(ox + W * T, Math.max(0, oy), w, h);
  // edificios
  if (oy > -T) for (const e of EDIF) {
    const px = ox + e.x * T, py = oy - 3 * T;
    if (px > w || px + 3 * T < 0) continue;
    g.fillStyle = '#3a2d28'; g.fillRect(px, py + T * 0.6, 3 * T, 2.4 * T);
    g.fillStyle = e.col; g.fillRect(px - T * 0.1, py + T * 0.3, 3.2 * T, T * 0.55);
    g.fillStyle = '#1b120e'; g.fillRect(px + T * 1.1, py + T * 1.7, T * 0.8, T * 1.3);
    g.fillStyle = '#ffe9a8'; g.fillRect(px + T * 0.3, py + T * 1.3, T * 0.5, T * 0.5); g.fillRect(px + T * 2.2, py + T * 1.3, T * 0.5, T * 0.5);
    g.fillStyle = '#1b120e'; g.font = `800 ${Math.max(9, T * 0.3)}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(e.n, px + 1.5 * T, py + T * 0.59);
  }
  // señales
  for (const s of senales) {
    const px = ox + s.x * T, py = oy + s.y * T, r = T * (0.6 + (tiempo * 2 % 1) * 0.6);
    g.strokeStyle = '#ffd23f'; g.lineWidth = 3; g.beginPath(); g.arc(px, py, r, 0, 7); g.stroke();
    g.fillStyle = '#ffd23f'; g.font = `800 ${Math.max(10, T * 0.3)}px system-ui`; g.textAlign = 'center'; g.fillText('¡Aquí! · ' + s.n, px, py - T);
  }
  // las demás maquinitas y la mía
  for (const o of otros.values()) {
    if (!o.on || o.x === undefined) continue;
    dibMaq(g, ox + o.x * T, oy + o.y * T, T, o.m, o.fl & 1 ? 1 : -1, o.fl & 2, o.fl & 4 ? 2 : 0, op.nombres ? o.n : '', o.fl & 8 ? 'en pausa' : '');
  }
  const p = yo.perf;
  dibMaq(g, ox + yo.x * T, oy + yo.y * T, T, miModelo, yo.dir, yo.vuela, p ? (p.ty > Math.floor(p.oy) ? 2 : p.tx < Math.floor(p.ox) ? -1 : 1) : 0, op.nombres ? miNombre : '', '');
  for (const q of parts) { g.globalAlpha = Math.min(1, q.t * 2); g.fillStyle = q.col; g.fillRect(ox + q.x * T, oy + q.y * T, T * 0.1, T * 0.1); }
  g.globalAlpha = 1;
}

/* ════════ Ciclo del juego ════════ */
let ult = 0, tHud = 0, tPos = 0, tBip = 0, cicloId = 0;
const PAUSA = {};
function ciclo(t, id) {
  if (!corriendo || id !== cicloId) return;
  requestAnimationFrame((x) => ciclo(x, id));
  if (op.ahorro && t - ult < 30) return;
  const dt = Math.max(0, Math.min(0.05, (t - ult) / 1000)); ult = t; tiempo += dt;
  const pasos = Math.max(1, Math.ceil(dt * 120));   // pasos cortos y parejos: el movimiento se siente igual a 30 o a 144 cuadros
  for (let i = 0; i < pasos; i++) fisica(dt / pasos);
  for (const o of otros.values()) if (o.on && o.x !== undefined) { const k = Math.min(1, dt * 14); o.x += (o.tx - o.x) * k; o.y += (o.ty - o.y) * k; }
  for (const q of parts) { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 9 * dt; q.t -= dt; }
  if (parts.length) parts = parts.filter((q) => q.t > 0);
  for (const s of senales) s.t -= dt; if (senales.length) senales = senales.filter((s) => s.t > 0);
  temblor *= Math.pow(0.002, dt);
  const cxo = Math.max(0, Math.min(W - cols, yo.x - cols / 2)), cyo = Math.max(-filas * 0.68, yo.y - filas * 0.5);
  camX += (cxo - camX) * Math.min(1, dt * 10); camY += (cyo - camY) * Math.min(1, dt * 10);
  dibujar();
  if ((tPos += dt) > 0.1) { tPos = 0; enviarPos(); }
  if ((tHud += dt) > 0.12) { tHud = 0; cadaTanto(); }
  // la veta madre se busca con el oído
  if ((tBip -= dt) < 0 && yo.y > 0) {
    const b = Math.floor(yo.y / 75); let d = 99;
    for (const k of [b - 1, b, b + 1]) { if (k < 0) continue; const [vx, vy] = veta(k); if (celda(vx, vy) !== 0) d = Math.min(d, Math.hypot(vx + 0.5 - yo.x, vy + 0.5 - yo.y)); }
    if (d < 9) { son.bip(); tBip = 0.12 + d * 0.11; } else tBip = 0.5;
  }
}
function arrancar() {
  if (corriendo || !listo || menu || pausa || !conectado) return;   // con la pestaña oculta el navegador ya no llama al ciclo
  corriendo = true; ult = performance.now(); const id = ++cicloId; requestAnimationFrame((x) => ciclo(x, id));
  if (pistaDe === PAUSA) pistaDe = undefined;
}
function detener() { corriendo = false; for (const k in teclas) teclas[k] = false; }

let pistaDe = null, tAlarma = 0, estabaAbajo = false, tTabla = 0;
function cadaTanto() {
  const m = prof();
  if (m > S.rec) {
    S.rec = m; sucio = true;
    while (S.msj < MSJ.length && MSJ[S.msj].m <= m) {
      const x = MSJ[S.msj++];
      if (x.q) { S.d += x.q; S.tot += x.q; son.compra(); }
      tarjeta('📡 ' + x.de + (x.q ? ' · bono de ' + fmt(x.q) : ''), x.x, 'msj', 9000);
    }
    let r = 0; for (let i = 0; i < RANGOS.length; i++) if (m >= RANGOS[i][0]) r = i;
    if (r > S.rango) {
      S.rango = r; const regalo = [0, 2, 1][r % 3]; S.obj[regalo]++;
      tarjeta('⛏️ Nuevo rango: ' + RANGOS[r][1], 'Regalo: ' + OBJ[regalo].n + '.'); son.logro(); difundir('subió a ' + RANGOS[r][1]);
    }
  }
  const abajo = yo.y > 0.3;
  if (abajo && !estabaAbajo && nCarga() === 0) S.vj.dano = 0;        // viaje nuevo: el daño de antes ya no cuenta
  estabaAbajo = abajo;
  if (m >= 500 && !S.vj.dano) S.fl.intacto = 1;
  if (m >= 300 && S.eq.every((e) => e === 0)) S.fl.tacano = 1;
  if (m >= 500 && [...otros.values()].filter((o) => o.on && o.y > 250).length >= 2) S.fl.equipo3 = 1;
  if (m > 0) evento('prof', m);
  if (S.fuel / tanque() < 0.25 && S.fuel > 0 && tiempo - tAlarma > 1) { tAlarma = tiempo; son.alarma(); }
  revisarLogros();
  // ¿frente a un edificio?
  let e = null;
  if (yo.suelo && yo.y < 0) e = EDIF.find((b) => yo.x > b.x + 0.2 && yo.x < b.x + 2.8) || null;
  if (e !== pistaDe) { pistaDe = e; const p = $('#pista'); p.style.display = e ? 'block' : 'none'; if (e) p.textContent = '↓  Entrar a ' + e.n; }
  pintarHud();
  if (++tTabla % 4 === 0) pintarTabla();
}

/* ════════ Pantalla: medidores, metas y tabla ════════ */
let hudAnt = '';
function metas() {
  const l = [];
  let mejor = null;
  for (let p = 0; p < 6; p++) { const n = PZ[p].niv[S.eq[p] + 1]; if (n && (!mejor || n[1] < mejor[1])) mejor = n; }
  if (mejor) l.push(S.d >= mejor[1] ? { ya: 1, tx: `¡Ya te alcanza para ${mejor[0]}! Ve al Taller`, p: 1 } : { tx: `Te faltan ${fmt(mejor[1] - S.d)} para ${mejor[0]}`, p: S.d / mejor[1] });
  const b = MSJ.slice(S.msj).find((x) => x.q);
  if (b) l.push({ tx: `Bono de ${fmt(b.q)} a los ${b.m} m`, p: prof() / b.m });
  const sig = RANGOS.find((r) => r[0] > S.rec);
  l.push({ tx: `Récord: ${S.rec} m · ${RANGOS[S.rango][1]}` + (sig ? ` → ${sig[1]} a los ${sig[0]} m` : ''), p: sig ? S.rec / sig[0] : 1 });
  return l;
}
function pintarHud(forzar) {
  if (!S) return;
  const f = S.fuel / tanque(), v = S.vida / vidaMax();
  const k = [Math.round(S.fuel * 10), S.vida, prof(), S.d, nCarga(), S.eq.join(''), S.obj.join(','), S.rec].join('|');
  if (k === hudAnt && !forzar) return; hudAnt = k;
  const bc = $('#bComb'), bv = $('#bCasco');
  bc.firstChild.style.width = f * 100 + '%'; bc.lastChild.textContent = S.fuel.toFixed(1) + ' / ' + tanque() + ' L'; bc.classList.toggle('bajo', f < 0.25);
  bv.firstChild.style.width = v * 100 + '%'; bv.lastChild.textContent = Math.max(0, Math.ceil(S.vida)) + ' / ' + vidaMax(); bv.classList.toggle('bajo', v < 0.3);
  $('#prof').textContent = prof() + ' m'; $('#din').textContent = fmt(S.d); $('#bod').textContent = '📦 ' + nCarga() + '/' + bodega();
  poner($('#metas'), metas().map((m) => `<div class="m${m.ya ? ' ya' : ''}"><i style="width:${Math.round(Math.min(100, m.p * 100))}%"></i><span>${esc(m.tx)}</span></div>`).join(''));
  poner($('#objetos'), OBJ.map((o, i) => `<div data-u="${i}" class="${S.obj[i] ? '' : 'n0'}" title="${o.n}: ${o.ef}"><kbd>${o.k}</kbd>${CORTO[i]} ×${S.obj[i]}</div>`).join(''));
  if (forzar) pintarTabla();
}
function pintarTabla() {
  if (!S) return;
  const l = [{ n: miNombre, m: miModelo, rec: S.rec, on: 1, yo: 1, y: prof() }, ...[...otros.values()].map((o) => ({ ...o, y: o.on && o.ty !== undefined ? Math.max(0, Math.round((o.ty + HH) * 2)) : null }))];
  l.sort((a, b) => (b.rec || 0) - (a.rec || 0));
  poner($('#tabla'), l.map((j) => `<div class="${j.on ? '' : 'off'}"><i style="background:${MODELOS[j.m]?.[0] || '#888'}"></i><b>${esc(j.n)}${j.yo ? ' (tú)' : ''}</b><span>${j.on && j.y !== null ? j.y + ' m · ' : ''}récord ${j.rec || 0} m</span></div>`).join(''));
}

/* ════════ Menús ════════ RLR */
let pestana = 0, pieza = 0;
function abrir(id) {
  if (!S) return;
  menu = id; detener(); $('#velo').classList.add('on');
  if (id === 'gas' && S.fuel >= tanque() - 0.001) evento('comb');   // llegar con el tanque lleno también cuenta
  pintarMenu(); ultPos = ''; enviarPos();
}
function cerrar() { if (menu === 'inicio') return; menu = null; $('#velo').classList.remove('on'); document.activeElement?.blur?.(); arrancar(); ultPos = ''; enviarPos(); if (sucio) enviarEst(); }
const cab = (t, sinX) => `<header><h2>${t}</h2><span class="d">${S ? fmt(S.d) : ''}</span>${sinX ? '' : '<button class="s" data-a="cerrar">Cerrar (Esc)</button>'}</header>`;
function pintarMenu() {
  const c = $('#caja'); let h = '';
  if (menu === 'gas') {
    const falta = Math.ceil(tanque() - S.fuel - 0.001), paga = Math.min(falta, Math.floor(S.d)), fiado = paga < 1 && S.fuel < 3;
    h = cab('⛽ Gasolinera') + `<div class="cuerpo"><p class="grande">${S.fuel.toFixed(1)} / ${tanque()} litros</p>
      <p class="nota">$1 por litro. Sin combustible, ${cfg.comb ? 'la maquinita explota' : 'entras en reserva: avanzas despacio y no perforas'}.</p>
      <button data-a="llenar" ${paga < 1 && !fiado ? 'disabled' : ''}>${falta < 1 ? 'Tanque lleno' : fiado ? 'No traes dinero: te fiamos 5 litros' : paga < falta ? `Cargar ${paga} L (${fmt(paga)}): es lo que te alcanza` : `Llenar el tanque (${fmt(falta)})`}</button></div>`;
  } else if (menu === 'bas') {
    const v = venta();
    h = cab('⚖️ La Báscula') + `<div class="cuerpo">` + (v.piezas ? S.carga.map((n, i) => n ? `<div class="fila"><div class="t"><b style="color:${MIN[i].col}">${MIN[i].n} × ${n}</b><small>${fmt(MIN[i].v)} la pieza</small></div><div class="v">${fmt(n * MIN[i].v)}</div></div>` : '').join('') +
      (v.perfecto ? `<div class="fila"><div class="t"><b>✨ Viaje perfecto</b><small>Bodega llena y cero daño: +10 %</small></div><div class="v">+${fmt(v.base * 0.1)}</div></div>` : '') +
      (v.cat ? `<div class="fila"><div class="t"><b>📖 Catálogo completo</b><small>+5 % para siempre</small></div><div class="v">+${fmt(v.base * 0.05)}</div></div>` : '') +
      `<p class="grande" id="totalVenta">${fmt(v.total)}</p><button data-a="vender">Vender toda la carga</button>` : '<p class="nota">La bodega está vacía. Baja, recoge mineral y vuelve.</p>') + '</div>';
  } else if (menu === 'tal') {
    const P = PZ[pieza];
    h = cab('🔧 El Taller') + `<div class="pest">${PZ.map((p, i) => `<button data-a="pieza" data-v="${i}" class="${i === pieza ? 'on' : ''}">${p.n}</button>`).join('')}</div>
      <div class="cuerpo"><p class="nota">${P.que}</p>` + P.niv.map((n, i) => {
      const tengo = i <= S.eq[pieza], act = i === S.eq[pieza];
      return `<div class="fila ${act ? 'act' : tengo ? 'tengo' : ''}"><div class="t"><b>${n[0]}${act ? ' · lo que traes' : ''}</b><small>${n[3]}</small><small>${act || tengo ? n[2] + ' ' + P.u : `<b style="display:inline;color:var(--ok)">${nv(pieza)} → ${n[2]}</b> ${P.u}`}</small></div>
        ${tengo ? '' : `<div class="v">${fmt(n[1])}</div><button data-a="mejorar" data-v="${i}" ${S.d < n[1] ? 'disabled' : ''}>Comprar</button>`}</div>`;
    }).join('') + '</div>';
  } else if (menu === 'alm') {
    const dano = vidaMax() - S.vida, costo = Math.ceil(dano * 15), puede = Math.min(costo, Math.floor(S.d));
    h = cab('🧰 El Almacén') + `<div class="cuerpo"><div class="fila"><div class="t"><b>Reparar el casco</b><small>${Math.ceil(S.vida)} / ${vidaMax()} de vida · $15 por punto</small></div>
      <div class="v">${dano > 0.01 ? fmt(costo) : ''}</div><button data-a="reparar" ${dano <= 0.01 || puede < 1 ? 'disabled' : ''}>${dano <= 0.01 ? 'Intacto' : puede < costo ? 'Reparar lo que alcance' : 'Reparar'}</button></div>` +
      OBJ.map((o, i) => `<div class="fila"><div class="t"><b>${o.n} <small style="display:inline">· tecla ${o.k} · tienes ${S.obj[i]}</small></b><small>${o.h}</small><small>${o.ef}</small></div>
      <div class="v">${fmt(o.p)}</div><button data-a="objeto" data-v="${i}" ${S.d < o.p ? 'disabled' : ''}>Comprar</button></div>`).join('') + '</div>';
  } else if (menu === 'rem') {
    const c = costoRemin(), puedo = cfg.reminTodos || soyCreador;
    h = cab('🌋 La Remineralizadora') + `<div class="cuerpo"><p>Vuelve a llenar de mineral <b>todo el tablero</b>: tierra nueva, minerales nuevos, hallazgos nuevos y peligros en lugares nuevos.</p>
      <p class="nota">Los túneles se cierran. Tu dinero, tu equipo, tus objetos y tus récords no se tocan. Todos ven una cuenta regresiva de 10 segundos y quien esté bajo tierra sube a salvo con su carga.</p>
      <p class="grande">${c ? fmt(c) : 'Gratis la primera vez'}</p>
      <button data-a="remin" ${!puedo || S.d < c || cuentaFin ? 'disabled' : ''}>${puedo ? 'Remineralizar el tablero' : 'Solo quien creó el mundo puede hacerlo'}</button></div>`;
  } else if (menu === 'menu') h = menuPrincipal();
  else return;
  c.innerHTML = h;
}
function venta() {
  const base = S.carga.reduce((a, n, i) => a + n * MIN[i].v, 0), piezas = nCarga();
  const perfecto = piezas > 0 && piezas === bodega() && !S.vj.dano, cat = catalogoCompleto();
  return { base, piezas, perfecto, cat, total: Math.floor(base * (1 + (perfecto ? 0.1 : 0) + (cat ? 0.05 : 0))) };
}
function costoRemin() { return S.reminGratis ? 0 : S.mejor < 0 ? 300 : MIN[S.mejor].v * 10; }

const acciones = {
  cerrar,
  llenar() {
    const antes = S.fuel / tanque(), l = Math.min(Math.ceil(tanque() - S.fuel - 0.001), Math.floor(S.d));
    if (l < 1) { if (S.fuel >= 3) return; S.fuel = Math.min(tanque(), S.fuel + 5); son.compra(); evento('comb'); return; }   // fiado
    S.d -= l; S.fuel = Math.min(tanque(), S.fuel + l); S.st.comb += l; son.compra();
    if (antes < 0.1) evento('filo'); if (antes < 0.05) S.fl.filo = 1;
    evento('comb');
  },
  vender() {
    const v = venta(); if (!v.piezas) return;
    const n = S.carga.slice();
    n.forEach((c, i) => { S.st.vend[i] += c; if (c && i > S.mejor) S.mejor = i; });
    if (n[3] >= 10) S.fl.midas = 1; if (v.perfecto) S.fl.perfecto = 1;
    S.carga.fill(0); S.st.viajes++; S.st.mejorViaje = Math.max(S.st.mejorViaje, v.total); S.vj.dano = 0;
    const desde = S.d; S.d += v.total; S.tot += v.total;
    // la venta es una ceremonia: el contador sube girando
    const el = $('#totalVenta'); let k = 0; const pasos = 16;
    const iv = setInterval(() => { k++; son.moneda(k); if (el.isConnected) el.textContent = '+' + fmt(v.total * k / pasos) + ' → ' + fmt(desde + v.total * k / pasos); if (k >= pasos) { clearInterval(iv); pintarMenu(); } }, 45);
    if (v.perfecto) tarjeta('✨ Viaje perfecto', '+10 % por volver con la bodega llena y sin un rasguño.');
    if (v.total >= 20000) difundir('vendió ' + fmt(v.total) + ' en un viaje');
    evento('venta', { llena: v.piezas === bodega(), total: v.total, n });
    return true;
  },
  pieza(v) { pieza = +v; },
  mejorar(v) {
    const n = PZ[pieza].niv[+v]; if (!n || S.d < n[1] || +v <= S.eq[pieza]) return;
    S.d -= n[1]; S.eq[pieza] = +v;
    if (pieza === 1) S.vida = vidaMax(); if (pieza === 3) S.fuel = tanque();
    son.compra(); tarjeta('🔧 ' + n[0], n[3]); difundir('compró ' + n[0]); evento('mejora');
  },
  reparar() {
    const costo = Math.ceil((vidaMax() - S.vida) * 15), paga = Math.min(costo, Math.floor(S.d));
    if (paga < 1) return;
    S.d -= paga; S.vida = paga >= costo ? vidaMax() : Math.min(vidaMax(), S.vida + paga / 15); son.compra();
  },
  objeto(v) { const o = OBJ[+v]; if (S.d < o.p) return; S.d -= o.p; S.obj[+v]++; son.compra(); },
  remin() { if (!conectado || cuentaFin || S.d < costoRemin()) return; enviar({ t: 'remin' }); cerrar(); return 'no'; },
  pest(v) { pestana = +v; },
  tirar(v) { if (S.carga[+v] > 0) S.carga[+v]--; },
  op(v, el) { const k = el.dataset.k; op[k] = el.type === 'checkbox' ? (el.checked ? 1 : 0) : +el.value; escribir('mina_op', op); aplicarOp(); return 'no'; },
  texto(v) { op.texto = Math.max(0.85, Math.min(1.5, op.texto + +v)); escribir('mina_op', op); aplicarOp(); },
  invitar(v, el) {
    const liga = location.origin + '/m/' + mundoId;
    const hecho = () => { el.textContent = '¡Liga copiada!'; }, aMano = () => window.prompt('Copia la liga de tu mundo:', liga);
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(liga).then(hecho, aMano); else aMano();
    return 'no';
  },
  modo(v, el) { if (!conectado || !MODOS[el.value]) return; cfg = { ...cfg, ...MODOS[el.value], modo: el.value }; enviar({ t: 'cfg', cfg }); },
  regla(v, el) { if (!conectado) return; cfg = { ...cfg, [el.dataset.k]: el.type === 'checkbox' ? (el.checked ? 1 : 0) : +el.value }; if (!['puerta', 'reminTodos', 'regalos'].includes(el.dataset.k)) cfg.modo = 'medida'; enviar({ t: 'cfg', cfg }); },
  nombreMundo(v, el) { const n = el.value.trim(); if (n.length < 2 || !conectado) return 'no'; cfg = { ...cfg, nombre: n }; enviar({ t: 'cfg', cfg }); guardarMundo(); return 'no'; },
  regalar(v) {
    const el = $('#cuanto'), q = Math.floor(+el.value);
    if (!(q > 0) || q > S.d || !conectado) return 'no';
    S.d -= q; S.fl.regalo = 1; enviar({ t: 'regalo', a: +v, q }); son.compra(); aviso('Le regalaste ' + fmt(q) + ' a ' + nombreDe(+v));
  },
  mundos() { enviarEst(); location.href = '/'; },
  desechar() { desechar(mundoId, soyCreador); },
};
$('#caja').addEventListener('click', (e) => {
  const el = e.target.closest('[data-a]'); if (!el || el.disabled || el.tagName === 'SELECT' || el.tagName === 'INPUT') return;
  const r = acciones[el.dataset.a]?.(el.dataset.v, el);
  sucio = true; if (r !== 'no' && r !== true && menu && menu !== 'inicio') pintarMenu(); pintarHud(true);
});
$('#caja').addEventListener('change', (e) => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const r = acciones[el.dataset.a]?.(el.dataset.v, el);
  if (r !== 'no' && menu && menu !== 'inicio') pintarMenu();
});
$('#objetos').addEventListener('click', (e) => { const el = e.target.closest('[data-u]'); if (el) { audio(); usar(+el.dataset.u); } });
$('#bMenu').addEventListener('click', (e) => { audio(); e.currentTarget.blur(); if (listo && !menu) abrir('menu'); });

function sel(k, ops, quien = 'regla') {
  return `<select data-a="${quien}" data-k="${k}" ${soyCreador ? '' : 'disabled'}>${ops.map(([v, t]) => `<option value="${v}" ${cfg[k] == v ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
}
function menuPrincipal() {
  const P = ['Bodega', 'Logros', 'Catálogo', 'Estadísticas', 'Opciones', 'Mundo', 'Ayuda'];
  let h = cab('☰ ' + esc(cfg.nombre || 'Mina')) + `<div class="pest">${P.map((p, i) => `<button data-a="pest" data-v="${i}" class="${i === pestana ? 'on' : ''}">${p}</button>`).join('')}</div><div class="cuerpo">`;
  if (pestana === 0) {
    h += `<p class="nota">📦 ${nCarga()} de ${bodega()} espacios · ${kgCarga()} kg de carga (tu motor levanta ${Math.round(hp() * 29.5 - 1980)} kg). Tirar piezas libera espacio y peso.</p>` +
      (nCarga() ? S.carga.map((n, i) => n ? `<div class="fila"><div class="t"><b style="color:${MIN[i].col}">${MIN[i].n} × ${n}</b><small>${fmt(MIN[i].v)} · ${MIN[i].kg} kg la pieza</small></div><button class="s" data-a="tirar" data-v="${i}">Tirar una</button></div>` : '').join('') : '<p class="nota">Bodega vacía.</p>') +
      '<h4>Tu equipo</h4>' + PZ.map((p, i) => `<div class="fila"><div class="t"><b>${p.n}: ${p.niv[S.eq[i]][0]}</b><small>${p.niv[S.eq[i]][2]} ${p.u}</small></div></div>`).join('');
  } else if (pestana === 1) {
    h += `<p class="nota">${S.log.length} de ${LOGROS.length} logros · Rango: <b>${RANGOS[S.rango][1]}</b></p><div class="rej">` +
      LOGROS.map((l) => { const ok = S.log.includes(l.id); return `<div class="${ok ? '' : 'no'}"><b>${ok ? '🏅 ' : ''}${ok && l.sec ? l.sec.split(':')[0] : l.n}</b><small>${ok && l.sec ? l.sec.split(': ')[1] : l.d}</small></div>`; }).join('') + '</div>';
  } else if (pestana === 2) {
    h += `<p class="nota">Capa 1 · Corteza. Completa la página y todo lo que vendas aquí vale <b>5 % más</b>${catalogoCompleto() ? ' — ¡ya lo tienes!' : ''}.</p><div class="rej">` +
      MIN.map((m, i) => S.st.rec[i] ? `<div><b style="color:${m.col}">${m.n}</b><small>${fmt(m.v)} · ${m.kg} kg · desde ${m.a} m<br>Vendidas: ${S.st.vend[i]}</small></div>` : '<div class="no"><b>???</b><small>Sin descubrir</small></div>').join('') +
      HALL.map((x, i) => S.st.hall[i] ? `<div><b>🏺 ${x.n}</b><small>${fmt(x.v)} · encontrados: ${S.st.hall[i]}</small></div>` : '<div class="no"><b>???</b><small>Hallazgo sin encontrar</small></div>').join('') + '</div>';
  } else if (pestana === 3) {
    const e = S.st;
    h += [['Profundidad máxima', S.rec + ' m'], ['Total ganado', fmt(S.tot)], ['Viajes', e.viajes], ['Mejor viaje', fmt(e.mejorViaje)], ['Celdas perforadas', e.cavadas.toLocaleString('es-MX')], ['Piezas vendidas', e.vend.reduce((a, b) => a + b, 0)], ['Hallazgos', e.hall.reduce((a, b) => a + b, 0)], ['Explosivos usados', e.expl], ['Litros cargados', e.comb], ['Explosiones', e.muertes], ['Rescates gratis usados', S.resc], ['Remineralizaciones', e.remin]]
      .map(([a, b]) => `<div class="fila"><div class="t">${a}</div><div class="v">${b}</div></div>`).join('');
  } else if (pestana === 4) {
    const chk = (k, t) => `<label class="op"><span>${t}</span><input type="checkbox" data-a="op" data-k="${k}" ${op[k] ? 'checked' : ''}></label>`;
    h += `<label class="op"><span>Volumen de los efectos</span><input type="range" min="0" max="1" step="0.1" value="${op.vol}" data-a="op" data-k="vol"></label>
      <label class="op"><span>Tamaño del texto</span><button class="s" data-a="texto" data-v="-0.1">A−</button><button class="s" data-a="texto" data-v="0.1">A+</button></label>` +
      chk('contraste', 'Alto contraste') + chk('dalton', 'Marcas para daltónicos (cada mineral con su símbolo)') + chk('temblor', 'Temblor de pantalla') +
      `<label class="op"><span>Partículas</span><select data-a="op" data-k="part">${[[2, 'Todas'], [1, 'Pocas'], [0, 'Ninguna']].map(([v, t]) => `<option value="${v}" ${op.part == v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <label class="op"><span>Acercamiento</span><select data-a="op" data-k="zoom">${[[0, 'Cerca'], [1, 'Normal'], [2, 'Lejos']].map(([v, t]) => `<option value="${v}" ${op.zoom == v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>` +
      chk('nombres', 'Mostrar los nombres de las maquinitas') + chk('ahorro', 'Modo ahorro (30 cuadros por segundo)');
  } else if (pestana === 5) {
    const o3 = [[0, 'Apagado'], [1, 'Normal'], [2, 'Fuerte']];
    h += `<div class="fila"><div class="t"><b>Invita a tu gente</b><small>${location.origin}/m/${mundoId}</small></div><button data-a="invitar">Copiar la liga</button></div>
      <h4>Dificultad del mundo ${soyCreador ? '' : '<small style="color:var(--su)">· solo la cambia quien creó el mundo</small>'}</h4>
      <label class="op"><span>Modo</span><select data-a="modo" ${soyCreador ? '' : 'disabled'}>${[['paseo', 'Paseo · nada mata'], ['clasico', 'Clásico'], ['rudo', 'Rudo'], ['medida', 'A la medida']].map(([v, t]) => `<option value="${v}" ${cfg.modo === v ? 'selected' : ''} ${v === 'medida' ? 'disabled' : ''}>${t}</option>`).join('')}</select></label>
      <label class="op"><span>Quedarse sin combustible</span>${sel('comb', [[0, 'Reserva (no explota)'], [1, 'Explota']])}</label>
      <label class="op"><span>Caídas</span>${sel('caida', o3)}</label>
      <label class="op"><span>Lava</span>${sel('lava', o3)}</label>
      <label class="op"><span>Gas</span>${sel('gas', o3)}</label>
      <label class="op"><span>Ver el gas</span>${sel('verGas', [[1, 'Sí'], [0, 'No'] ])}</label>
      <label class="op"><span>Qué se pierde al explotar</span>${sel('pierde', [[0, 'Nada'], [1, 'La carga'], [2, 'La carga y la reparación'], [3, 'Carga, reparación y 10 % del dinero']])}</label>
      <label class="op"><span>Rescates gratis</span>${sel('rescates', [[0, 'Ninguno'], [3, 'Los 3 primeros'], [-1, 'Sin límite']])}</label>
      <h4>El mundo</h4>
      <label class="op"><span>Nombre</span><input data-a="nombreMundo" maxlength="24" value="${esc(cfg.nombre)}" ${soyCreador ? '' : 'disabled'}></label>
      <label class="op"><span>Cerrar la puerta (no entran maquinitas nuevas)</span>${sel('puerta', [[0, 'Abierta'], [1, 'Cerrada']])}</label>
      <label class="op"><span>Quién puede remineralizar</span>${sel('reminTodos', [[1, 'Cualquiera'], [0, 'Solo quien creó el mundo']])}</label>
      <label class="op"><span>Regalos de dinero</span>${sel('regalos', [[1, 'Sí'], [0, 'No']])}</label>
      <h4>Jugadores</h4>` +
      ([...otros.values()].length ? `<label class="op"><span>Cantidad para regalar (en la superficie)</span><input id="cuanto" type="number" min="1" value="${Math.min(1000, Math.floor(S.d))}" style="width:9em"></label>` +
        [...otros.values()].map((o) => `<div class="fila"><div class="t"><b>${esc(o.n)}</b><small>${o.on ? 'Conectado' : 'Desconectado'} · récord ${o.rec || 0} m · ganado ${fmt(o.tot || 0)}</small></div>${o.on && cfg.regalos && yo.y < 0 ? `<button class="s" data-a="regalar" data-v="${o.i}">Regalar</button>` : ''}</div>`).join('') : '<p class="nota">Estás solo en este mundo. Copia la liga y mándala.</p>') +
      `<h4>Mi maquinita</h4><p class="nota">Para seguir con esta maquinita en otro dispositivo, abre la liga del mundo allá y pega este código:</p><p><code>${esc(miK)}</code></p>
      <div class="fila"><div class="t"></div><button class="s" data-a="mundos">Mis mundos</button><button class="mal" data-a="desechar">Desechar este mundo</button></div>`;
  } else {
    h += `<p><b>Moverte:</b> flechas o WASD. <b>↑</b> vuela. <b>↓</b> perfora hacia abajo. <b>← →</b> contra una pared, perfora de lado. Nunca se perfora hacia arriba.</p>
      <p><b>El ciclo:</b> baja, llena la bodega, sube, vende en La Báscula, carga combustible y mejora tu equipo en El Taller. En la superficie, párate frente a un edificio y pulsa ↓.</p>
      <p><b>Objetos:</b> F tanque de reserva · R nanobots · X dinamita · C explosivo plástico · Q teletransportador · M transmisor.</p>
      <p><b>Acompañado:</b> G deja una señal que todos ven · T le pasa 5 litros a la maquinita que tengas junto · P pausa tu maquinita.</p>
      <p class="nota">Piedra desde 210 m: no se perfora. Lava desde 410 m: se ve, rodéala. Gas desde 650 m: no se ve.</p>`;
  }
  return h + '</div>';
}
function aplicarOp() {
  document.documentElement.style.setProperty('--f', op.texto);
  document.body.classList.toggle('contraste', !!op.contraste);
  medir();
}

/* ════════ Teclado ════════ */
const MAPA = { ArrowLeft: 'izq', a: 'izq', ArrowRight: 'der', d: 'der', ArrowUp: 'arr', w: 'arr', ArrowDown: 'aba', s: 'aba' };
addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.metaKey || e.ctrlKey) return;
  audio();
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (k === 'Escape') { if (menu && menu !== 'inicio') cerrar(); else if (listo && !menu) abrir('menu'); return; }
  if (!listo || menu) return;
  if (k === 'p') {
    pausa = !pausa; const l = $('#pista');
    if (pausa) { detener(); pistaDe = PAUSA; l.textContent = '⏸  Pausa · tu maquinita no gasta · pulsa P para seguir'; l.style.display = 'block'; ultPos = ''; enviarPos(); }
    else { l.style.display = 'none'; arrancar(); }
    return;
  }
  if (pausa) return;
  if (MAPA[k]) {
    e.preventDefault();
    if (MAPA[k] === 'aba' && !e.repeat && pistaDe && pistaDe.id && yo.suelo && yo.y < 0) return abrir(pistaDe.id);
    teclas[MAPA[k]] = true; return;
  }
  const i = 'frxcqm'.indexOf(k);
  if (i >= 0) return usar(i);
  if (k === 'g') { enviar({ t: 'senal', x: yo.x, y: yo.y }); senales.push({ x: yo.x, y: yo.y, t: 10, n: miNombre }); son.bip(); }
  if (k === 't') pasarCombustible();
});
addEventListener('keyup', (e) => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; if (MAPA[k]) teclas[MAPA[k]] = false; });
addEventListener('blur', () => { for (const k in teclas) teclas[k] = false; });
function pasarCombustible() {
  let cerca = null;
  for (const o of otros.values()) if (o.on && o.x !== undefined && Math.hypot(o.x - yo.x, o.y - yo.y) < 1.6) cerca = o;
  if (!cerca) return aviso('No hay ninguna maquinita junto a ti.');
  if (!conectado) return;
  if (S.fuel <= 6) return aviso('No te alcanza para pasar combustible.');
  S.fuel -= 5; S.fl.pase = 1; sucio = true; enviar({ t: 'fuel', a: cerca.i, q: 5 }); aviso('Le pasaste 5 litros a ' + cerca.n); son.compra();
}

/* ════════ Mis mundos, bautizo y arranque ════════ RLR */
let mundos = leer('mina_mundos', []), latido = 0;
function guardarMundo() {
  mundos = mundos.filter((m) => m.id !== mundoId);
  mundos.unshift({ id: mundoId, k: miK, nombre: cfg.nombre || 'Mundo ' + mundoId, maq: miNombre, modelo: miModelo, creador: soyCreador ? 1 : 0, ult: Date.now() });
  escribir('mina_mundos', mundos);
}
function quitarMundo(id) { mundos = mundos.filter((m) => m.id !== id); escribir('mina_mundos', mundos); }
function llave() { return [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join(''); }
function inicio(h) { menu = 'inicio'; detener(); $('#velo').classList.add('on'); $('#caja').innerHTML = h; }
function pantallaFinal(t, x) {
  inicio(`<header><h2>${t}</h2></header><div class="cuerpo"><p>${x}</p><p><button id="bIr">Ir a mis mundos</button></p></div>`);
  $('#bIr').onclick = () => (location.href = '/');
}
function pantallaMundos() {
  inicio(`<header><h2>⛏️ Mina · Mis mundos</h2></header><div class="cuerpo">` +
    mundos.map((m) => `<div class="fila"><div class="t"><b>${esc(m.nombre)}</b><small>${m.maq ? 'Tu maquinita: ' + esc(m.maq) + ' · ' : ''}${new Date(m.ult).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })} · ${m.id}</small></div>
      <button data-ir="${m.id}">Continuar</button><button class="s" data-des="${m.id}">Desechar</button></div>`).join('') +
    `<p style="margin-top:14px"><button id="bNuevo">＋ Mundo nuevo</button></p><p class="nota">Cada mundo nace con una semilla distinta y se guarda solo. Para jugar acompañado, entra y copia su liga.</p></div>`);
  $('#bNuevo').onclick = crearMundo;
  $('#caja').querySelectorAll('[data-ir]').forEach((b) => (b.onclick = () => (location.href = '/m/' + b.dataset.ir)));
  $('#caja').querySelectorAll('[data-des]').forEach((b) => (b.onclick = () => { const m = mundos.find((x) => x.id === b.dataset.des); desechar(m.id, m.creador, m.k); }));
}
function desechar(id, creador, k) {
  if (!confirm('¿Desechar este mundo? Sale de tu lista.')) return;
  const paraTodos = creador && confirm('Tú creaste este mundo. ¿Borrarlo también para todos los demás?\n\nAceptar = borrarlo para todos · Cancelar = solo quitarlo de mi lista');
  const fin = () => { quitarMundo(id); location.href = '/'; };
  if (!paraTodos) return fin();
  if (id === mundoId && conectado) { enviar({ t: 'borrar' }); return setTimeout(fin, 400); }
  const s = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws/' + id);
  s.onopen = () => s.send(JSON.stringify({ t: 'hola', k }));
  s.onmessage = (e) => { if (typeof e.data === 'string' && e.data.includes('"t":"mundo"')) { s.send('{"t":"borrar"}'); setTimeout(fin, 400); } };
  s.onerror = fin; setTimeout(fin, 4000);
}
async function crearMundo() {
  inicio('<header><h2>Creando tu mundo…</h2></header><div class="cuerpo"><p class="nota">Semilla nueva, tierra nueva.</p></div>');
  try {
    const r = await fetch('/api/mundo', { method: 'POST' }), d = await r.json();
    if (!d.id) throw 0;
    history.replaceState(null, '', '/m/' + d.id); entrar(d.id);
  } catch { pantallaFinal('No se pudo crear el mundo', 'Revisa tu conexión e inténtalo otra vez.'); }
}
function pantallaBautizo(d) {
  let modelo = Math.floor(Math.random() * 8);
  inicio(`<header><h2>⛏️ ${esc(d.nombre || 'Mundo nuevo')}</h2></header><div class="cuerpo">
    <p class="nota">${d.hay ? `Ya ${d.hay === 1 ? 'juega 1 maquinita' : 'juegan ' + d.hay + ' maquinitas'} en este mundo. ` : ''}Escoge tu maquinita y bautízala: ese nombre lo verán todos.</p>
    <div class="maqs">${MODELOS.map((m, i) => `<button data-m="${i}"><canvas width="112" height="112"></canvas></button>`).join('')}</div>
    <p><input id="nom" maxlength="14" placeholder="Nombre de tu maquinita" style="width:100%;font-size:1.2em" autocomplete="off"></p>
    <p><button id="bEntrar" disabled>Bautizar y entrar</button></p>
    <details><summary class="nota">Ya tengo una maquinita en este mundo (otro dispositivo)</summary><p><input id="cod" placeholder="Pega aquí el código de tu maquinita" style="width:100%"> <button class="s" id="bCod">Usar código</button></p></details></div>`);
  const bs = [...$('#caja').querySelectorAll('[data-m]')];
  const marca = () => bs.forEach((b, i) => {
    b.classList.toggle('on', i === modelo);
    const q = b.firstChild.getContext('2d'); q.clearRect(0, 0, 112, 112); dibMaq(q, 56, 60, 100, i, 1, false, 0, '', '');
  });
  bs.forEach((b, i) => (b.onclick = () => { modelo = i; marca(); })); marca();
  const nom = $('#nom'), be = $('#bEntrar');
  nom.oninput = () => (be.disabled = nom.value.trim().length < 2);
  const entra = () => { if (nom.value.trim().length < 2) return; audio(); bautizo = { n: nom.value.trim(), m: modelo }; enviar({ t: 'hola', k: miK, ...bautizo }); };
  be.onclick = entra; nom.onkeydown = (e) => { if (e.key === 'Enter') entra(); };
  $('#bCod').onclick = () => { const c = $('#cod').value.trim(); if (c.length >= 16 && c !== miK) { llaveAntes = miK; miK = c; enviar({ t: 'hola', k: miK }); } };
  nom.focus();
}
function entrar(id) {
  mundoId = id;
  const m = mundos.find((x) => x.id === id);
  miK = m ? m.k : llave();
  inicio('<header><h2>Entrando al mundo…</h2></header><div class="cuerpo"><p class="nota">' + esc(id) + '</p></div>');
  conectar();
}

addEventListener('resize', medir);
document.addEventListener('visibilitychange', () => { if (document.hidden) { for (const k in teclas) teclas[k] = false; if (sucio) enviarEst(); } });
addEventListener('pagehide', () => enviarEst());
setInterval(() => {                       // lo poco que corre aunque el juego esté detenido
  if (sucio && conectado) enviarEst();
  if (ws && ws.readyState === 1 && ++latido % 25 === 0) ws.send('p');
  const c = $('#cuenta');
  if (cuentaFin) { const s = Math.ceil((cuentaFin - Date.now()) / 1000); c.style.display = 'block'; c.textContent = s > 0 ? `🌋 Remineralizando en ${s}…` : '🌋'; if (s < -3) cuentaFin = 0; }
  else c.style.display = 'none';
}, 1000);

aplicarOp();
{
  const r = location.pathname.match(/^\/m\/([2-9A-HJ-NP-Z]{8})\/?$/i);
  if (r) entrar(r[1].toUpperCase());
  else if (location.pathname.length > 1) pantallaFinal('Esta liga está incompleta', 'La liga de un mundo termina en 8 letras y números. Pídela otra vez o entra a tus mundos.');
  else if (!mundos.length) crearMundo();
  else pantallaMundos();
}
// Para pruebas: window.__mina
window.__mina = { get S() { return S; }, avanza(seg) { for (let i = 0, n = Math.round(seg * 120); i < n; i++) { tiempo += 1 / 120; fisica(1 / 120); if (i % 14 === 0) cadaTanto(); } }, dibujar, llegar, danar, get e() { return { corriendo, menu, pausa, listo, conectado, tiempo, perf: yo.perf, renace: yo.renace }; }, yo, otros, celda, gen, get cfg() { return cfg; }, usar, abrir, cerrar, teclas, enviarEst, veta, LOGROS };
/* RLR · Ricardo López Reyero · fin */
