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
op = { vol: 0.7, temblor: 1, part: 2, texto: 1, contraste: 0, dalton: 0, nombres: 1, zoom: 1, fps: 0, ...op };
if (![0, 30, 60].includes(op.fps)) op.fps = 0;

function leer(k, def) { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } }
function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

function nuevoEstado() {
  return {
    d: 20, eq: [0, 0, 0, 0, 0, 0], carga: Array(10).fill(0), obj: [0, 0, 0, 0, 0, 0],
    fuel: 3, vida: 10, x: INICIO_X, y: INICIO_Y, rec: 0, tot: 0, msj: 0, rango: 0, resc: 0, reminGratis: 1, mejor: -1,
    st: { viajes: 0, cavadas: 0, rec: Array(10).fill(0), vend: Array(10).fill(0), hall: [0, 0, 0, 0], muertes: 0, expl: 0, remin: 0, comb: 0, mejorViaje: 0, gruas: 0 },
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
  for (const k of ['viajes', 'cavadas', 'muertes', 'expl', 'remin', 'comb', 'mejorViaje', 'gruas']) s.st[k] = num(s.st[k], 0);
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
function veta(b) { return [3 + Math.floor(azar(b, 0, 11) * (W - 6)), Math.min(H - 3, b * 75 + 8 + Math.floor(azar(b, 1, 12) * 60))]; }

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
  boom: (v = 1) => { ruido(0.5, 0.4 * v); tono(90, 0.4, 'sine', 0.2 * v, 30); },
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
  while (c.children.length < 3 && colaTarjetas.length) {
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
    if (tiempo - tTaladro > 0.08) { tTaladro = tiempo; tono(60 + Math.random() * 40, 0.05, 'sawtooth', 0.022); }
    if (e >= 1) { yo.perf = null; yo.vx = yo.vy = 0; llegar(p); if (!yo.renace) seguirPerforando(p); }
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
    else if (izq && !der && (toca < 0 || yo.x - HW - 0.16 <= cx)) perforar(cx - 1, cy);
    else if (der && !izq && (toca > 0 || yo.x + HW + 0.16 >= cx + 1)) perforar(cx + 1, cy);
  }
}
// Con la tecla apretada, al terminar una celda arranca la siguiente en el mismo paso: sin parones.
function seguirPerforando(p) {
  if (S.fuel <= 0 || teclas.arr) return;
  const { izq, der, aba } = teclas;
  if (aba && !izq && !der) perforar(p.tx, p.ty + 1);
  else if (solida(p.tx, p.ty + 1)) { if (izq && !der) { yo.dir = -1; perforar(p.tx - 1, p.ty); } else if (der && !izq) { yo.dir = 1; perforar(p.tx + 1, p.ty); } }
}
let tTaladro = 0;
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
  const f = (yo.dir > 0 ? 1 : 0) | (yo.vuela ? 2 : 0) | (yo.perf ? 4 : 0) | (menu || pausa ? 8 : 0) | (yo.perf && yo.perf.ty > Math.floor(yo.perf.oy) ? 16 : 0);
  const k = x + ',' + y + ',' + f;
  if (k === ultPos) return; ultPos = k;
  bufPos[0] = 1; bufPos[1] = x & 255; bufPos[2] = x >> 8; bufPos[3] = y & 255; bufPos[4] = y >> 8; bufPos[5] = f;
  ws.send(bufPos);
}
function hola(extra) { enviar({ t: 'hola', k: miK, ...(extra || {}), ...(duenos[mundoId] ? { d: duenos[mundoId] } : {}) }); }
function conectar() {
  ws = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws/' + mundoId);
  ws.binaryType = 'arraybuffer';
  ws.onopen = () => { reintento = 500; red.sinEco = 0; hola(bautizo); };
  ws.onmessage = (e) => {
    if (typeof e.data !== 'string') return recibePos(new Uint8Array(e.data));
    if (e.data === 'q') { const v = performance.now() - red.pingT; red.rtt = red.rtt ? red.rtt * 0.7 + v * 0.3 : v; red.sinEco = 0; return; }
    let d; try { d = JSON.parse(e.data); } catch { return; }
    recibir(d);
  };
  ws.onclose = alCerrar;
}
function alCerrar(e) {
  conectado = false;
  if (e.code >= 4000 && e.code <= 4002) return;
  tCaido = tCaido || Date.now();
  setTimeout(() => { if (!conectado && listo) { $('#aviso-red').style.display = 'block'; detener(); } }, 3000);
  setTimeout(conectar, reintento); reintento = Math.min(8000, reintento * 2);
}
// Una conexión puede morir sin avisar: si el mundo deja de contestar el eco, se tira y se vuelve a conectar.
function latir() {
  if (!ws || ws.readyState !== 1) return;
  if (red.sinEco >= 3) { const v = ws; v.onclose = v.onmessage = null; try { v.close(); } catch {} red.sinEco = 0; return alCerrar({ code: 4999 }); }
  red.pingT = performance.now(); red.sinEco++; ws.send('p');
  red.lenta = ws.bufferedAmount > 4096 || red.rtt > 350;
  red.retraso = Math.max(110, Math.min(260, (red.lenta ? 250 : 135) + red.rtt * 0.15));
}
function recibePos(b) {
  if (b[0] !== 1 || b.length < 7) return;
  const o = otros.get(b[1]); if (!o) return;
  // Cada posición se guarda con su hora de llegada; se dibuja un instante atrás, entre dos posiciones reales.
  const t = performance.now(), x = (b[2] | b[3] << 8) / 256, y = (b[4] | b[5] << 8) / 64 - 40, fl = b[6];
  const q = o.b || (o.b = []), u = q[q.length - 1];
  if (u && t - u.t > 400) q.push({ t: t - 66, x: u.x, y: u.y, fl: u.fl });      // estuvo quieta: que no se deslice desde lejos
  q.push({ t, x, y, fl }); if (q.length > 24) q.shift();
  o.on = 1; if (o.x === undefined) { o.x = x; o.y = y; o.fl = fl; }
}
// Lo que hacen los demás se ve y se oye, según qué tan cerca esté.
function efectoAjeno(c) {
  const i0 = c[c.length >> 1], x = i0 % W + 0.5, y = Math.floor(i0 / W) + 0.5, lejos = Math.hypot(x - yo.x, y - yo.y);
  if (lejos > 34) return;
  if (c.length >= 5) { chispas(x, y, '#ffb347', 30, 9); temblar(Math.max(0, 10 - lejos * 0.6)); if (lejos < 26) son.boom(Math.max(0.12, 1 - lejos / 26)); }
  else { chispas(x, y, '#a9744f', 6, 3); if (lejos < 12) tono(170 + Math.random() * 60, 0.05, 'triangle', 0.035 * (1 - lejos / 12)); }
}
const red = { rtt: 0, lenta: false, retraso: 135, pingT: 0, sinEco: 0 };
const duenos = leer('mina_duenos', {});
const nombreDe = (i) => (i === miI ? miNombre : otros.get(i)?.n || 'Alguien');
function recibir(d) {
  switch (d.t) {
    case 'nuevo':
      if ($('#nom') && !llaveAntes) return;        // ya está escribiendo su nombre: no se le borra
      pantallaBautizo(d);
      if (llaveAntes) { miK = llaveAntes; llaveAntes = ''; const n = $('#caja .nota'); if (n) n.textContent = 'Ese código no es de una maquinita de este mundo. Revísalo o bautiza una nueva.'; }
      return;
    case 'noexiste': quitarMundo(mundoId); return pantallaFinal('Este mundo no existe', 'Puede que lo hayan borrado o que la liga esté incompleta.');
    case 'cerrado': return pantallaFinal('Este mundo cerró la puerta', 'Quien lo creó ya no admite maquinitas nuevas.');
    case 'lleno': return pantallaFinal('Este mundo está lleno', 'Hay un tope de 10 jugadores a la vez.');
    case 'otra': detener(); return pantallaFinal('Tu maquinita se abrió en otro lado', 'Está en otra pestaña o en otro dispositivo, con todo lo que trae. Aquí puedes volver a tomarla cuando quieras.');
    case 'borrado': quitarMundo(mundoId); detener(); return pantallaFinal('Este mundo fue borrado', 'Quien lo creó lo desechó.');
    case 'mundo': return iniciarMundo(d);
    case 'cava': for (const i of d.c) ponerCavada(i); return efectoAjeno(d.c);
    case 'no': return noFueMia(d.c);
    case 'entra': otros.set(d.j.i, { ...otros.get(d.j.i), ...d.j }); aviso(d.j.n + ' entró al mundo'); ultPos = ''; enviarPos(); return pintarTabla();   // que el recién llegado me vea aunque yo esté quieto
    case 'sale': { const o = otros.get(d.i); if (o) { o.on = 0; o.x = undefined; o.b = []; aviso(o.n + ' salió'); } return pintarTabla(); }
    case 'j': { const o = otros.get(d.i); if (o) { o.rec = d.rec; o.tot = d.tot; } return pintarTabla(); }
    case 'aviso': return aviso(nombreDe(d.i) + ' ' + d.x);
    case 'senal': senales.push({ x: d.x, y: d.y, t: 10, n: nombreDe(d.i) }); son.bip(); return aviso(nombreDe(d.i) + ' marcó un punto');
    case 'fuel': if (S.fuel <= 0 && d.q > 0) tarjeta('Saliste de la reserva', nombreDe(d.i) + ' te pasó combustible.'); S.fuel = Math.min(tanque(), S.fuel + d.q); son.compra(); sucio = true; return aviso(nombreDe(d.i) + ' te pasó ' + d.q + ' litros');
    case 'regalo': S.d += d.q; son.compra(); sucio = true; return tarjeta('🎁 ' + nombreDe(d.i) + ' te regaló ' + fmt(d.q));
    case 'devuelve': sucio = true; if (d.d) S.d += d.d; if (d.fuel) S.fuel = Math.min(tanque(), S.fuel + d.fuel); return aviso('No se pudo entregar: esa maquinita no está conectada.');
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
  if (primera) { medir(); vis.x = ant.x = yo.x; vis.y = ant.y = yo.y; camX = Math.max(0, Math.min(W - cols, yo.x - cols / 2)); camY = Math.max(-filas * 0.68, yo.y - filas * 0.5); }
  ultPos = '';
  $('#aviso-red').style.display = 'none';
  if (menu === 'inicio') { menu = null; $('#velo').classList.remove('on'); }
  document.body.classList.add('jugando');
  surtirContratos(); pintarHud(true); pintarTabla(); arrancar();
  if (!d.est) tarjeta('¡Bienvenido, ' + miNombre + '!', 'Flechas o WASD para moverte. Primero: carga combustible en la Gasolinera (↓ para entrar).', 'msj', 9000);
}

/* ════════ Dibujo ════════ RLR */
// Todo se dibuja en píxeles reales de la pantalla: T es cuántos píxeles mide una celda.
const lienzo = $('#c'), g = lienzo.getContext('2d', { alpha: false });
let DPR = 1, RES = 1, T = 40, cols = 32, filas = 20, camX = 0, camY = -12, reloj = 0;
let panX = 0, panY = 0, vistaLibre = false;       // vista libre con la rueda o el trackpad
const vis = { x: INICIO_X, y: INICIO_Y };         // dónde se dibuja mi maquinita (entre dos pasos de física)
const tiles = new Map(), casas = new Map();
const TIERRA = [['#8f5d3b', '#7b4e31', '#a06c48', '#6b422a'], ['#7d4c31', '#6b3f28', '#8d5a3c', '#5a3421'], ['#6c3f2b', '#5b3222', '#7c4b35', '#4b291c'], ['#57322b', '#472621', '#673c34', '#3a1f1b']];
const HUECO = [['#2c1b13', '#33211a', '#24150f'], ['#27170f', '#2e1c15', '#1f120c'], ['#22130e', '#291813', '#1a0e0a'], ['#1d100d', '#241512', '#150b09']];
const azarDe = (s) => () => (s = (s * 9301 + 49297) % 233280) / 233280;
function mezcla(hex, k) {            // k < 0 oscurece, k > 0 aclara
  const n = parseInt(hex.slice(1), 16), m = k < 0 ? 0 : 255, a = Math.abs(k);
  const c = (v) => Math.round(v + (m - v) * a);
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}
function medir() {
  DPR = Math.min(2.5, window.devicePixelRatio || 1);
  RES = Math.max(0.75, DPR * NITIDEZ[rit.niv]);
  const w = Math.max(1, Math.round(innerWidth * RES)), h = Math.max(1, Math.round(innerHeight * RES));
  if (lienzo.width !== w) lienzo.width = w;
  if (lienzo.height !== h) lienzo.height = h;
  T = Math.max(Math.round(12 * RES), Math.round(w / [26, 32, 40][op.zoom]));
  cols = w / T; filas = h / T;                    // lo que de verdad cabe, aunque la ventana sea angosta
  tiles.clear(); casas.clear();
  if (listo && !corriendo) dibujar();
}

/* ── Celdas ── */
function tierra(q, zona, r) {
  const B = TIERRA[zona], u = T / 16;
  q.fillStyle = B[0]; q.fillRect(0, 0, T, T);
  for (let i = 0; i < 34; i++) { q.fillStyle = B[1 + (i % 3)]; q.globalAlpha = 0.35 + r() * 0.5; q.fillRect(Math.floor(r() * 16) * u, Math.floor(r() * 16) * u, u * (1 + Math.floor(r() * 2)), u); }
  q.globalAlpha = 0.12; q.fillStyle = '#000'; q.fillRect(0, (3 + r() * 9) * u, T, u * 0.7); q.fillStyle = '#fff'; q.fillRect(0, (2 + r() * 11) * u, T, u * 0.5);
  q.globalAlpha = 1;
  for (let i = 0; i < 3; i++) {                   // piedritas
    const x = (2 + r() * 12) * u, y = (2 + r() * 12) * u, a = (0.7 + r() * 0.9) * u;
    q.fillStyle = B[3]; q.beginPath(); q.ellipse(x, y, a * 1.3, a, r() * 3, 0, 7); q.fill();
    q.fillStyle = '#ffffff22'; q.beginPath(); q.ellipse(x - a * 0.3, y - a * 0.3, a * 0.6, a * 0.4, 0, 0, 7); q.fill();
  }
}
function poligono(q, x, y, a, n, r, ach = 1) {
  q.beginPath();
  for (let i = 0; i < n; i++) { const an = (i / n) * 6.283 + 0.3, d = a * (0.72 + r() * 0.36); q[i ? 'lineTo' : 'moveTo'](x + Math.cos(an) * d * ach, y + Math.sin(an) * d); }
  q.closePath();
}
const FORMA = ['roca', 'pepita', 'pepita', 'pepita', 'barra', 'cristal', 'gema', 'gema', 'diamante', 'racimo'];
function gema(q, i, x, y, a, r) {
  const col = MIN[i].col, osc = mezcla(col, -0.42), cla = mezcla(col, 0.55), f = FORMA[i], u = T / 16;
  q.lineWidth = Math.max(1, u * 0.45); q.strokeStyle = mezcla(col, -0.68); q.lineJoin = 'round';
  if (i >= 5) { q.shadowColor = col; q.shadowBlur = u * (i === 5 || i === 9 ? 5 : 2.5); }
  if (f === 'roca' || f === 'pepita') {
    const s = r() * 1000 | 0, r1 = azarDe(s + 1), r2 = azarDe(s + 1);
    poligono(q, x, y, a, f === 'roca' ? 6 : 8, r1, 1.15); q.fillStyle = col; q.fill(); q.stroke();
    q.save(); poligono(q, x, y, a, f === 'roca' ? 6 : 8, r2, 1.15); q.clip();
    q.fillStyle = osc; q.fillRect(x - a * 1.5, y + a * 0.15, a * 3, a * 1.5);
    q.fillStyle = cla; q.beginPath(); q.ellipse(x - a * 0.3, y - a * 0.35, a * 0.55, a * 0.3, -0.5, 0, 7); q.fill();
    if (i === 0) { q.fillStyle = '#b5532a'; q.fillRect(x + a * 0.1, y - a * 0.1, u, u); q.fillRect(x - a * 0.6, y + a * 0.3, u, u); }
    if (i === 1) { q.fillStyle = '#4fb39a'; q.fillRect(x + a * 0.2, y + a * 0.2, u, u); }
    q.restore();
  } else if (f === 'barra') {
    q.save(); q.translate(x, y); q.rotate((r() - 0.5) * 0.9);
    q.fillStyle = col; q.beginPath(); q.rect(-a * 1.1, -a * 0.5, a * 2.2, a); q.fill(); q.stroke();
    q.fillStyle = cla; q.fillRect(-a * 1.1, -a * 0.5, a * 2.2, a * 0.32); q.fillStyle = osc; q.fillRect(a * 0.75, -a * 0.5, a * 0.35, a);
    q.restore();
  } else if (f === 'cristal') {
    q.save(); q.translate(x, y); q.rotate((r() - 0.5) * 1.2);
    const w = a * 0.55, h = a * 1.25;
    q.beginPath(); q.moveTo(0, -h); q.lineTo(w, -h * 0.5); q.lineTo(w, h * 0.6); q.lineTo(0, h); q.lineTo(-w, h * 0.6); q.lineTo(-w, -h * 0.5); q.closePath();
    q.fillStyle = col; q.fill(); q.stroke(); q.shadowBlur = 0;
    q.fillStyle = cla; q.beginPath(); q.moveTo(0, -h); q.lineTo(-w, -h * 0.5); q.lineTo(-w, h * 0.6); q.lineTo(0, h); q.fill();
    q.fillStyle = '#ffffffcc'; q.fillRect(-w * 0.55, -h * 0.45, w * 0.3, h * 0.5);
    q.restore();
  } else if (f === 'gema') {
    const w = a * (i === 7 ? 0.95 : 1.15), h = a * 0.9, c = a * 0.38;
    const oct = (k) => { q.beginPath(); q.moveTo(x - w * k + c * k, y - h * k); q.lineTo(x + w * k - c * k, y - h * k); q.lineTo(x + w * k, y - h * k + c * k); q.lineTo(x + w * k, y + h * k - c * k); q.lineTo(x + w * k - c * k, y + h * k); q.lineTo(x - w * k + c * k, y + h * k); q.lineTo(x - w * k, y + h * k - c * k); q.lineTo(x - w * k, y - h * k + c * k); q.closePath(); };
    oct(1); q.fillStyle = osc; q.fill(); q.stroke(); q.shadowBlur = 0;
    oct(0.62); q.fillStyle = col; q.fill();
    q.fillStyle = cla; q.beginPath(); q.moveTo(x - w * 0.62 + c * 0.62, y - h * 0.62); q.lineTo(x + w * 0.2, y - h * 0.62); q.lineTo(x - w * 0.62, y + h * 0.1); q.lineTo(x - w * 0.62, y - h * 0.62 + c * 0.62); q.fill();
  } else if (f === 'diamante') {
    q.beginPath(); q.moveTo(x - a, y - a * 0.3); q.lineTo(x - a * 0.5, y - a * 0.85); q.lineTo(x + a * 0.5, y - a * 0.85); q.lineTo(x + a, y - a * 0.3); q.lineTo(x, y + a); q.closePath();
    q.fillStyle = col; q.fill(); q.stroke(); q.shadowBlur = 0;
    q.fillStyle = '#fff'; q.beginPath(); q.moveTo(x - a * 0.5, y - a * 0.85); q.lineTo(x, y - a * 0.3); q.lineTo(x - a, y - a * 0.3); q.fill();
    q.fillStyle = osc; q.beginPath(); q.moveTo(x + a, y - a * 0.3); q.lineTo(x, y + a); q.lineTo(x + a * 0.2, y - a * 0.3); q.fill();
    q.strokeStyle = '#ffffff99'; q.lineWidth = Math.max(1, u * 0.25); q.beginPath(); q.moveTo(x - a, y - a * 0.3); q.lineTo(x + a, y - a * 0.3); q.stroke();
  } else {                                          // racimo de cristales
    for (let k = 0; k < 5; k++) {
      const an = -1.57 + (k - 2) * 0.5 + (r() - 0.5) * 0.2, l = a * (0.9 + r() * 0.7), w = a * 0.3;
      q.beginPath(); q.moveTo(x - Math.sin(an) * -w, y + a * 0.6 + Math.cos(an) * -w * 0.2); q.lineTo(x + Math.cos(an) * l, y + a * 0.6 + Math.sin(an) * l); q.lineTo(x + Math.sin(an) * -w, y + a * 0.6 - Math.cos(an) * -w * 0.2); q.closePath();
      q.fillStyle = k % 2 ? cla : col; q.fill(); q.stroke();
    }
    q.shadowBlur = 0; q.fillStyle = '#36e0c8'; q.beginPath(); q.ellipse(x, y + a * 0.65, a * 0.7, a * 0.25, 0, 0, 7); q.fill();
  }
  q.shadowBlur = 0;
}
function tile(tipo, zona, vr) {
  const key = tipo * 100 + zona * 10 + vr; let c = tiles.get(key);
  if (c) return c;
  c = document.createElement('canvas'); c.width = c.height = T;
  const q = c.getContext('2d'), r = azarDe(key * 7919 + 13), u = T / 16;
  if (tipo === 0) {                                 // fondo de túnel y de cueva
    const B = HUECO[zona]; q.fillStyle = B[0]; q.fillRect(0, 0, T, T);
    for (let i = 0; i < 16; i++) { q.fillStyle = B[1 + (i % 2)]; q.fillRect(Math.floor(r() * 16) * u, Math.floor(r() * 16) * u, u * (1 + Math.floor(r() * 3)), u); }
  } else if (tipo === 5) {                          // suelo firme: placas remachadas
    q.fillStyle = '#5a5653'; q.fillRect(0, 0, T, T);
    q.fillStyle = '#6e6966'; q.fillRect(0, 0, T, u * 1.2); q.fillRect(0, 0, u * 1.2, T);
    q.fillStyle = '#3d3a38'; q.fillRect(0, T - u * 1.2, T, u * 1.2); q.fillRect(T - u * 1.2, 0, u * 1.2, T);
    q.fillStyle = '#2e2b2a'; for (const [a, b] of [[3, 3], [13, 3], [3, 13], [13, 13]]) { q.beginPath(); q.arc(a * u, b * u, u * 0.8, 0, 7); q.fill(); }
    q.fillStyle = '#ffffff18'; q.fillRect(u * 4, u * 7, u * 8, u * 0.6);
  } else {
    tierra(q, zona, r);
    if (tipo === 2) {                               // piedra
      const s = r() * 1000 | 0;
      poligono(q, T / 2, T / 2, u * 7.2, 9, azarDe(s)); q.fillStyle = '#77726d'; q.fill(); q.lineWidth = u * 0.5; q.strokeStyle = '#3b3836'; q.stroke();
      q.save(); poligono(q, T / 2, T / 2, u * 7.2, 9, azarDe(s)); q.clip();
      q.fillStyle = '#56524e'; q.fillRect(0, T * 0.58, T, T); q.fillStyle = '#9a948e'; q.beginPath(); q.ellipse(T * 0.4, T * 0.32, u * 3.6, u * 1.8, -0.4, 0, 7); q.fill();
      q.strokeStyle = '#3b383699'; q.lineWidth = u * 0.4; q.beginPath(); q.moveTo(T * 0.55, T * 0.3); q.lineTo(T * 0.62, T * 0.52); q.lineTo(T * 0.5, T * 0.7); q.stroke();
      q.restore();
    } else if (tipo === 3) {                        // lava
      q.fillStyle = '#a82408'; q.fillRect(0, 0, T, T);
      for (let i = 0; i < 12; i++) { q.fillStyle = ['#e2470f', '#ff7a1a', '#ffb321', '#ffe27a'][i % 4]; q.beginPath(); q.ellipse(r() * T, r() * T, u * (1 + r() * 3), u * (0.8 + r() * 1.6), r() * 3, 0, 7); q.fill(); }
      q.fillStyle = '#4a1005'; for (let i = 0; i < 6; i++) q.fillRect(r() * T, r() * T, u * (1 + r() * 2), u * 0.8);
    } else if (tipo === 4) {                        // gas (solo cuando se puede ver)
      q.fillStyle = '#7dff6b44'; q.fillRect(0, 0, T, T);
      for (let i = 0; i < 6; i++) { q.strokeStyle = '#c9ffb8'; q.lineWidth = u * 0.5; q.beginPath(); q.arc(r() * T, r() * T, u * (0.8 + r() * 1.8), 0, 7); q.stroke(); }
    } else if (tipo >= 10 && tipo < 20) {           // mineral: tres piezas con la forma propia de cada uno
      const i = tipo - 10;
      for (const [a, b] of [[4.6, 5], [11.2, 6.6], [7.4, 11.6]]) gema(q, i, (a + (r() - 0.5) * 1.6) * u, (b + (r() - 0.5) * 1.6) * u, (2.5 + r() * 0.8) * u, r);
      if (op.dalton) { q.fillStyle = '#000c'; q.fillRect(u * 3, u * 4.5, u * 10, u * 7); q.fillStyle = '#fff'; q.font = `bold ${u * 6}px system-ui`; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(MIN[i].s, T / 2, T / 2 + u * 0.2); }
    } else if (tipo >= 20) {                        // hallazgo
      const k = tipo - 20; q.shadowColor = '#ffe9a8'; q.shadowBlur = u * 3; q.lineWidth = u * 0.5; q.strokeStyle = '#2a1a14';
      if (k === 0) { q.fillStyle = '#f3ead8'; q.beginPath(); q.roundRect(u * 3.5, u * 7, u * 9, u * 2, u); q.fill(); q.stroke(); for (const [a, b] of [[3.2, 6.6], [3.2, 9.4], [12.8, 6.6], [12.8, 9.4]]) { q.beginPath(); q.arc(a * u, b * u, u * 1.5, 0, 7); q.fill(); q.stroke(); } }
      else if (k === 1) { q.fillStyle = '#8a5a22'; q.beginPath(); q.roundRect(u * 3, u * 6, u * 10, u * 7, u); q.fill(); q.stroke(); q.fillStyle = '#b07a2a'; q.beginPath(); q.roundRect(u * 3, u * 4, u * 10, u * 3.5, [u * 3, u * 3, 0, 0]); q.fill(); q.stroke(); q.shadowBlur = 0; q.fillStyle = '#ffd23f'; q.fillRect(u * 3, u * 8.4, u * 10, u * 0.9); q.fillRect(u * 7.2, u * 7.6, u * 1.6, u * 2.6); }
      else if (k === 2) { q.fillStyle = '#e8e0d0'; q.beginPath(); q.arc(u * 8, u * 7, u * 4.2, 0, 7); q.fill(); q.stroke(); q.beginPath(); q.roundRect(u * 5.8, u * 9.6, u * 4.4, u * 3.4, u * 0.8); q.fill(); q.stroke(); q.shadowBlur = 0; q.fillStyle = '#2a1a14'; q.beginPath(); q.ellipse(u * 6.4, u * 7, u * 1.1, u * 1.4, 0, 0, 7); q.ellipse(u * 9.6, u * 7, u * 1.1, u * 1.4, 0, 0, 7); q.fill(); q.fillRect(u * 7.6, u * 9, u * 0.8, u * 1.2); }
      else { q.fillStyle = '#ffd23f'; q.beginPath(); q.moveTo(u * 8, u * 2); q.lineTo(u * 12, u * 6); q.lineTo(u * 10, u * 13.5); q.lineTo(u * 6, u * 13.5); q.lineTo(u * 4, u * 6); q.closePath(); q.fill(); q.stroke(); q.shadowBlur = 0; q.fillStyle = '#fff6c9'; q.beginPath(); q.moveTo(u * 8, u * 2); q.lineTo(u * 9.2, u * 6); q.lineTo(u * 6.2, u * 6); q.fill(); q.fillStyle = '#e0483a'; q.beginPath(); q.arc(u * 8, u * 9, u * 1.3, 0, 7); q.fill(); }
      q.shadowBlur = 0;
    }
  }
  return tiles.set(key, c), c;
}

/* ── Edificios: se pintan una vez en su propio lienzo ── */
function casa(e) {
  let c = casas.get(e.id); if (c) return c;
  const u = T / 16, Wc = Math.ceil(58 * u), Hc = Math.ceil(60 * u);
  c = document.createElement('canvas'); c.width = Wc; c.height = Hc;
  const q = c.getContext('2d'), P = Hc;            // P = piso
  const caja = (x, y, w, h, col, borde = '#00000055') => { q.fillStyle = col; q.fillRect(x * u, y * u, w * u, h * u); if (borde) { q.strokeStyle = borde; q.lineWidth = Math.max(1, u * 0.5); q.strokeRect(x * u, y * u, w * u, h * u); } };
  const letrero = (x, y, w, h, fondo, tinta) => { caja(x, y, w, h, fondo, '#000000aa'); q.fillStyle = tinta; q.font = `900 ${u * (e.n.length > 12 ? 3.3 : 4.2)}px system-ui`; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(e.n.toUpperCase(), (x + w / 2) * u, (y + h / 2 + 0.2) * u); };
  const y0 = 60;                                    // todo se mide hacia arriba desde el piso
  q.fillStyle = '#00000033'; q.beginPath(); q.ellipse(29 * u, P - u * 0.6, 27 * u, 2 * u, 0, 0, 7); q.fill();
  if (e.id === 'gas') {
    caja(31, y0 - 30, 20, 30, '#e9e2d3'); caja(31, y0 - 33, 20, 4, '#b8362b');                         // caseta
    caja(34, y0 - 24, 7, 8, '#7fd0ee'); q.fillStyle = '#ffffff88'; q.fillRect(34.6 * u, (y0 - 23.4) * u, 2 * u, 6.8 * u);
    caja(43, y0 - 16, 6, 16, '#3a2d28'); q.fillStyle = '#ffd23f'; q.fillRect(47.6 * u, (y0 - 8) * u, 0.9 * u, 0.9 * u);
    caja(8, y0 - 36, 2.6, 36, '#8d8a86'); caja(24.4, y0 - 36, 2.6, 36, '#8d8a86');                       // postes
    caja(3, y0 - 43, 31, 7, '#e0483a'); caja(3, y0 - 38.4, 31, 1.6, '#ffffff', null);                   // techo
    caja(10, y0 - 4, 14, 4, '#9a9692');                                                                // isla
    caja(12.5, y0 - 22, 9, 18, '#d83c2f'); caja(13.6, y0 - 20.5, 6.8, 5.5, '#12261c'); q.fillStyle = '#6fdc7a'; q.font = `700 ${u * 3}px monospace`; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText('$1', 17 * u, (y0 - 17.6) * u);
    caja(13.6, y0 - 13.5, 6.8, 2, '#f3e6d8', null);
    q.strokeStyle = '#1b1b1b'; q.lineWidth = u * 0.9; q.beginPath(); q.moveTo(21.5 * u, (y0 - 18) * u); q.bezierCurveTo(27 * u, (y0 - 20) * u, 27 * u, (y0 - 6) * u, 22.4 * u, (y0 - 9) * u); q.stroke();
    caja(21.2, y0 - 11, 2.4, 4, '#2b2b2b', null);
    letrero(4, y0 - 52, 29, 7.5, '#fff7e6', '#b8362b');
  } else if (e.id === 'bas') {
    caja(7, y0 - 32, 44, 32, '#d2a94c'); q.fillStyle = '#5b3d17'; q.beginPath(); q.moveTo(4 * u, (y0 - 32) * u); q.lineTo(29 * u, (y0 - 42) * u); q.lineTo(54 * u, (y0 - 32) * u); q.closePath(); q.fill();
    q.fillStyle = '#fdfaf0'; q.beginPath(); q.arc(29 * u, (y0 - 22) * u, 7.5 * u, 0, 7); q.fill(); q.strokeStyle = '#2a1a14'; q.lineWidth = u; q.stroke();   // carátula
    q.lineWidth = u * 0.5; for (let i = 0; i < 9; i++) { const a = Math.PI + (i / 8) * Math.PI; q.beginPath(); q.moveTo((29 + Math.cos(a) * 5.6) * u, (y0 - 22 + Math.sin(a) * 5.6) * u); q.lineTo((29 + Math.cos(a) * 6.8) * u, (y0 - 22 + Math.sin(a) * 6.8) * u); q.stroke(); }
    q.strokeStyle = '#e0483a'; q.lineWidth = u * 0.9; q.beginPath(); q.moveTo(29 * u, (y0 - 22) * u); q.lineTo(33.4 * u, (y0 - 26.4) * u); q.stroke(); q.fillStyle = '#2a1a14'; q.beginPath(); q.arc(29 * u, (y0 - 22) * u, u, 0, 7); q.fill();
    caja(24, y0 - 13, 10, 13, '#3a2d28'); caja(10, y0 - 14, 8, 7, '#ffe9a8'); caja(40, y0 - 14, 8, 7, '#ffe9a8');
    caja(3, y0 - 4, 52, 4, '#2b2b2b'); for (let i = 0; i < 9; i++) { q.fillStyle = '#ffd23f'; q.beginPath(); q.moveTo((4 + i * 6) * u, y0 * u); q.lineTo((7 + i * 6) * u, y0 * u); q.lineTo((9 + i * 6) * u, (y0 - 4) * u); q.lineTo((6 + i * 6) * u, (y0 - 4) * u); q.fill(); }
    letrero(13, y0 - 53, 32, 7.5, '#ffd23f', '#2a1a14');
  } else if (e.id === 'tal') {
    caja(5, y0 - 36, 48, 36, '#5f7f99'); caja(3, y0 - 40, 52, 5, '#3f5a70');
    caja(9, y0 - 26, 26, 26, '#c9ced3'); q.fillStyle = '#8f979e'; for (let i = 0; i < 8; i++) q.fillRect(9 * u, (y0 - 26 + i * 3.2) * u, 26 * u, u * 0.7);   // cortina
    caja(9, y0 - 5, 26, 5, '#2b2b2b', null); caja(40, y0 - 17, 9, 17, '#2f3d4a'); caja(40, y0 - 30, 9, 8, '#ffe9a8');
    q.fillStyle = '#ffd23f'; q.beginPath(); for (let i = 0; i < 16; i++) { const a = (i / 16) * 6.283, d = i % 2 ? 5.4 : 4; q.lineTo((22 + Math.cos(a) * d) * u, (y0 - 15 + Math.sin(a) * d) * u); } q.closePath(); q.fill(); q.strokeStyle = '#2a1a14'; q.lineWidth = u * 0.5; q.stroke();   // engrane
    q.fillStyle = '#c9ced3'; q.beginPath(); q.arc(22 * u, (y0 - 15) * u, 1.8 * u, 0, 7); q.fill(); q.stroke();
    q.strokeStyle = '#2b2b2b'; q.lineWidth = u * 0.9; q.beginPath(); q.moveTo(10 * u, (y0 - 40) * u); q.lineTo(10 * u, (y0 - 46) * u); q.stroke(); q.fillStyle = '#e0483a'; q.beginPath(); q.arc(10 * u, (y0 - 46.5) * u, 1.2 * u, 0, 7); q.fill();   // antena
    letrero(15, y0 - 52, 28, 7.5, '#6ec3ff', '#12222e');
  } else if (e.id === 'alm') {
    caja(6, y0 - 30, 36, 30, '#7c9a78'); q.fillStyle = '#3d5a3b'; q.beginPath(); q.moveTo(3 * u, (y0 - 30) * u); q.lineTo(24 * u, (y0 - 42) * u); q.lineTo(45 * u, (y0 - 30) * u); q.closePath(); q.fill();
    q.fillStyle = '#fff'; q.beginPath(); q.arc(24 * u, (y0 - 33.5) * u, 4.2 * u, 0, 7); q.fill(); q.fillStyle = '#2f9e44'; q.fillRect(23 * u, (y0 - 36.5) * u, 2 * u, 6 * u); q.fillRect(21 * u, (y0 - 34.5) * u, 6 * u, 2 * u);
    caja(19, y0 - 16, 10, 16, '#3a2d28'); caja(9, y0 - 22, 8, 9, '#ffe9a8'); q.fillStyle = '#7a5218'; q.fillRect(9 * u, (y0 - 18) * u, 8 * u, u * 0.7); caja(31, y0 - 22, 8, 9, '#ffe9a8'); q.fillStyle = '#7a5218'; q.fillRect(31 * u, (y0 - 18) * u, 8 * u, u * 0.7);
    for (const [x, y, s] of [[43, 9, 9], [46.5, 17, 8], [50, 8, 6]]) { caja(x, y0 - y, s, s, '#a8742e'); q.strokeStyle = '#5b3d17'; q.lineWidth = u * 0.6; q.beginPath(); q.moveTo(x * u, (y0 - y) * u); q.lineTo((x + s) * u, (y0 - y + s) * u); q.moveTo((x + s) * u, (y0 - y) * u); q.lineTo(x * u, (y0 - y + s) * u); q.stroke(); }
    letrero(8, y0 - 53, 32, 7.5, '#6fdc7a', '#12261c');
  } else {                                           // remineralizadora
    caja(6, y0 - 8, 12, 8, '#3a2d28'); caja(40, y0 - 8, 12, 8, '#3a2d28');
    const gr = q.createLinearGradient(18 * u, 0, 40 * u, 0); gr.addColorStop(0, '#5a2a86'); gr.addColorStop(0.45, '#b06cf0'); gr.addColorStop(1, '#4a2070');
    q.fillStyle = gr; q.beginPath(); q.roundRect(18 * u, (y0 - 36) * u, 22 * u, 36 * u, [8 * u, 8 * u, 0, 0]); q.fill(); q.strokeStyle = '#1e0d2e'; q.lineWidth = u * 0.6; q.stroke();
    q.fillStyle = '#2a1340'; for (const y of [10, 20, 30]) q.fillRect(18 * u, (y0 - y) * u, 22 * u, u * 1.2);
    q.strokeStyle = '#8d8a86'; q.lineWidth = u * 2; q.beginPath(); q.moveTo(18 * u, (y0 - 16) * u); q.lineTo(12 * u, (y0 - 16) * u); q.lineTo(12 * u, y0 * u); q.moveTo(40 * u, (y0 - 16) * u); q.lineTo(46 * u, (y0 - 16) * u); q.lineTo(46 * u, y0 * u); q.stroke();
    q.shadowColor = '#e9b8ff'; q.shadowBlur = u * 5; q.fillStyle = '#e9b8ff'; q.beginPath(); q.moveTo(29 * u, (y0 - 47) * u); q.lineTo(33 * u, (y0 - 41) * u); q.lineTo(29 * u, (y0 - 35) * u); q.lineTo(25 * u, (y0 - 41) * u); q.closePath(); q.fill(); q.shadowBlur = 0;
    q.fillStyle = '#fff'; q.beginPath(); q.moveTo(29 * u, (y0 - 47) * u); q.lineTo(30.6 * u, (y0 - 41) * u); q.lineTo(27 * u, (y0 - 41) * u); q.fill();
    caja(24, y0 - 13, 10, 13, '#1e0d2e');
    letrero(3, y0 - 58, 52, 7, '#c05cff', '#1e0d2e');
  }
  return casas.set(e.id, c), c;
}

/* ── La maquinita ── */
function dibMaq(q, px, py, t, modelo, dir, vuela, perfDir, nombre, estado, mundoX = px / t) {
  const [c1, c2] = MODELOS[modelo] || MODELOS[0], w = t * 0.74, h = t * 0.8, x = px - w / 2, y = py - h / 2, lw = Math.max(1, t * 0.03);
  q.lineJoin = 'round';
  if (perfDir) {                                     // taladro girando
    const z = (reloj * 9) % 1, base = '#d7dbe0', raya = '#7f8791';
    q.save();
    if (perfDir === 2) q.translate(px, y + h * 0.92); else { q.translate(px + perfDir * w * 0.46, py + h * 0.12); q.rotate(-perfDir * Math.PI / 2); }
    const bw = w * 0.3, l = t * 0.36;
    q.beginPath(); q.moveTo(-bw, 0); q.lineTo(bw, 0); q.lineTo(0, l); q.closePath(); q.fillStyle = base; q.fill(); q.save(); q.clip();
    q.strokeStyle = raya; q.lineWidth = t * 0.05; for (let i = -1; i < 4; i++) { const yy = (i + z) * l * 0.34; q.beginPath(); q.moveTo(-bw, yy); q.lineTo(bw, yy + l * 0.22); q.stroke(); }
    q.restore(); q.strokeStyle = '#2b2b2b'; q.lineWidth = lw; q.stroke(); q.restore();
  }
  if (vuela) {                                       // hélice
    q.fillStyle = '#555'; q.fillRect(px - t * 0.02, y - t * 0.1, t * 0.04, t * 0.16);
    q.globalAlpha = 0.6; q.fillStyle = '#e8eef2'; q.beginPath(); q.ellipse(px, y - t * 0.1, w * (0.35 + 0.35 * Math.abs(Math.sin(reloj * 45))), t * 0.035, 0, 0, 7); q.fill(); q.globalAlpha = 1;
  }
  // orugas
  q.fillStyle = '#26221f'; q.beginPath(); q.roundRect(x - t * 0.03, y + h * 0.7, w + t * 0.06, h * 0.3, h * 0.15); q.fill();
  q.fillStyle = '#6f6a66'; for (let i = 0; i < 3; i++) { q.beginPath(); q.arc(x + w * (0.17 + i * 0.33), y + h * 0.85, h * 0.085, 0, 7); q.fill(); }
  q.fillStyle = '#4a4543'; const paso = w / 5, corre = ((mundoX * t * 0.9) % paso + paso) % paso;
  for (let i = -1; i < 6; i++) { const tx = x + i * paso + corre; if (tx > x - t * 0.02 && tx < x + w) { q.fillRect(tx, y + h * 0.71, t * 0.03, h * 0.05); q.fillRect(x + w - (tx - x) - t * 0.03, y + h * 0.95, t * 0.03, h * 0.05); } }
  // escape
  q.fillStyle = '#4a4543'; q.fillRect(px - dir * w * 0.42 - t * 0.03, y + h * 0.08, t * 0.06, h * 0.2);
  // cuerpo
  const gr = q.createLinearGradient(0, y + h * 0.14, 0, y + h * 0.76); gr.addColorStop(0, mezcla(c1, 0.25)); gr.addColorStop(0.5, c1); gr.addColorStop(1, c2);
  q.fillStyle = gr; q.beginPath(); q.roundRect(x, y + h * 0.16, w, h * 0.6, t * 0.12); q.fill(); q.strokeStyle = mezcla(c2, -0.5); q.lineWidth = lw; q.stroke();
  q.fillStyle = mezcla(c2, -0.25); q.fillRect(x + w * 0.06, y + h * 0.6, w * 0.88, h * 0.05);
  if (modelo % 4 === 1) { q.fillStyle = '#ffffffcc'; q.fillRect(x + w * 0.06, y + h * 0.5, w * 0.88, h * 0.05); }
  else if (modelo % 4 === 2) { q.fillStyle = '#1b120e99'; for (let i = 0; i < 4; i++) q.fillRect(px - dir * w * (0.08 + i * 0.09) - t * 0.015, y + h * 0.26, t * 0.03, h * 0.28); }
  else if (modelo % 4 === 3) { q.fillStyle = '#ffffffcc'; q.beginPath(); q.arc(px - dir * w * 0.22, y + h * 0.42, h * 0.09, 0, 7); q.fill(); }
  // cabina
  const cx = px + dir * w * 0.14, cy = y + h * 0.36;
  q.fillStyle = '#9fe3ff'; q.beginPath();
  if (modelo >= 4) q.roundRect(cx - w * 0.2, cy - h * 0.2, w * 0.4, h * 0.3, t * 0.05); else q.arc(cx, cy, w * 0.2, Math.PI, 0);
  q.closePath(); q.fill(); q.strokeStyle = '#1b3a4a'; q.stroke();
  q.fillStyle = '#ffffffaa'; q.beginPath(); q.ellipse(cx - w * 0.07, cy - h * 0.1, w * 0.05, h * 0.05, -0.6, 0, 7); q.fill();
  q.fillStyle = '#24323a'; q.beginPath(); q.arc(cx + dir * w * 0.02, cy - h * 0.03, w * 0.055, 0, 7); q.fill();     // piloto
  // faro
  q.fillStyle = '#fff3b0'; q.beginPath(); q.arc(px + dir * w * 0.44, y + h * 0.5, h * 0.06, 0, 7); q.fill();
  if (nombre) {
    q.font = `700 ${Math.max(10 * RES, t * 0.27)}px system-ui`; q.textAlign = 'center'; q.textBaseline = 'bottom';
    const tx = estado ? nombre + ' · ' + estado : nombre;
    q.lineWidth = Math.max(2, t * 0.07); q.strokeStyle = '#000c'; q.strokeText(tx, px, y - t * 0.16); q.fillStyle = '#fff'; q.fillText(tx, px, y - t * 0.16);
  }
}

/* ── El cuadro completo ── */
function cielo(w, oy) {
  const gr = g.createLinearGradient(0, oy - 15 * T, 0, oy);
  gr.addColorStop(0, '#22407a'); gr.addColorStop(0.45, '#5f83bd'); gr.addColorStop(0.82, '#f0a868'); gr.addColorStop(1, '#fbd590');
  g.fillStyle = gr; g.fillRect(0, 0, w, oy);
  const sx = w * 0.7 - camX * T * 0.03, sy = oy - 7 * T, sol = g.createRadialGradient(sx, sy, T * 0.4, sx, sy, T * 5);
  sol.addColorStop(0, '#fff8d8'); sol.addColorStop(0.2, '#ffe9a8cc'); sol.addColorStop(1, '#ffe9a800');
  g.fillStyle = sol; g.fillRect(sx - T * 5, sy - T * 5, T * 10, T * 10);
  g.fillStyle = '#ffffff'; g.globalAlpha = 0.32;
  for (let i = 0; i < 5; i++) {                     // nubes que derivan
    const x = (((i * 0.21 + reloj * 0.0035 * (1 + (i % 3) * 0.5)) % 1.3) - 0.15) * w - camX * T * 0.06, y = oy - (5.5 + ((i * 37) % 7)) * T, s = T * (0.7 + (i % 3) * 0.3);
    g.beginPath(); g.ellipse(x, y, s * 1.6, s * 0.45, 0, 0, 7); g.ellipse(x - s * 0.8, y + s * 0.12, s, s * 0.35, 0, 0, 7); g.ellipse(x + s * 0.9, y + s * 0.15, s * 1.1, s * 0.32, 0, 0, 7); g.fill();
  }
  g.globalAlpha = 1;
  for (const [col, alto, f, k] of [['#c79a78', 2.6, 0.004, 0.12], ['#a8734f', 1.9, 0.0065, 0.25], ['#86573b', 1.2, 0.011, 0.45]]) {   // cerros en tres planos
    g.fillStyle = col; g.beginPath(); g.moveTo(0, oy);
    for (let x = 0; x <= w + 60; x += 60) { const m = (x + camX * T * k) / RES; g.lineTo(x, oy - T * alto * (0.55 + 0.3 * Math.sin(m * f) + 0.15 * Math.sin(m * f * 2.7 + 1))); }
    g.lineTo(w + 60, oy); g.fill();
  }
}
function dibujar() {
  const w = lienzo.width, h = lienzo.height;
  g.setTransform(1, 0, 0, 1, 0, 0);
  let sx = 0, sy = 0;
  if (temblor > 0.3) { sx = (Math.random() - 0.5) * temblor * RES; sy = (Math.random() - 0.5) * temblor * RES; }
  const ox = Math.round(-camX * T + sx), oy = Math.round(-camY * T + sy);
  if (oy > 0) cielo(w, oy);
  const x0 = Math.max(0, Math.floor(camX)), x1 = Math.min(W - 1, Math.ceil(camX + cols));
  const y0 = Math.max(0, Math.floor(camY)), y1 = Math.min(H - 1, Math.ceil(camY + filas));
  const fino = Math.max(1, Math.round(T * 0.07)), grueso = Math.max(2, Math.round(T * 0.13));
  for (let y = y0; y <= y1; y++) {
    const m = (y + 1) * 2, zona = m < 210 ? 0 : m < 410 ? 1 : m < 650 ? 2 : 3, py = oy + y * T;
    for (let x = x0; x <= x1; x++) {
      let t = celda(x, y); const px = ox + x * T;
      if (t === 0) {
        g.drawImage(tile(0, zona, (x * 5 + y * 3) & 1), px, py);
        if (y > 0 && celda(x, y - 1) !== 0) { g.fillStyle = '#00000055'; g.fillRect(px, py, T, grueso); }             // sombra del techo
        continue;
      }
      if (t === 4 && !cfg.verGas) t = 1;
      g.drawImage(tile(t, zona, t === 1 ? (x * 7 + y * 13) & 3 : 0), px, py);
      if (t === 3) { g.fillStyle = `rgba(255,205,90,${0.1 + 0.1 * Math.sin(reloj * 3 + x * 1.7 + y)})`; g.fillRect(px, py, T, T); }
      else if (t >= 10) {                            // destello
        const s = Math.sin(reloj * 1.9 + ((x * 73 + y * 151) % 97));
        if (s > 0.9) { const k = (s - 0.9) * 10, bx = px + T * (0.25 + ((x * 31 + y * 17) % 50) / 100), by = py + T * (0.25 + ((x * 13 + y * 29) % 50) / 100), l = T * 0.16 * k; g.fillStyle = '#fff'; g.fillRect(bx - l, by - fino / 2, l * 2, fino); g.fillRect(bx - fino / 2, by - l, fino, l * 2); }
      }
      // bordes: lo que da al túnel se sombrea, y arriba se ilumina
      if (y === 0) { if (t !== 5) { g.fillStyle = '#5c9e3a'; g.fillRect(px, py, T, grueso); g.fillStyle = '#7cc24e'; g.fillRect(px, py, T, fino); } }
      else if (celda(x, y - 1) === 0) { g.fillStyle = '#ffffff26'; g.fillRect(px, py, T, fino); }
      if (y < H - 1 && celda(x, y + 1) === 0) { g.fillStyle = '#00000059'; g.fillRect(px, py + T - grueso, T, grueso); }
      if (x > 0 && celda(x - 1, y) === 0) { g.fillStyle = '#00000038'; g.fillRect(px, py, fino, T); }
      if (x < W - 1 && celda(x + 1, y) === 0) { g.fillStyle = '#00000038'; g.fillRect(px + T - fino, py, fino, T); }
    }
  }
  // orillas y fondo del mundo
  g.fillStyle = '#120c09';
  if (ox > 0) g.fillRect(0, Math.max(0, oy), ox, h);
  if (ox + W * T < w) g.fillRect(ox + W * T, Math.max(0, oy), w, h);
  if (oy + H * T < h) g.fillRect(0, oy + H * T, w, h);
  // edificios
  if (oy > -T) for (const e of EDIF) {
    const u = T / 16, c = casa(e), bx = ox + e.x * T + Math.round(1.5 * T - c.width / 2), by = oy - c.height;
    if (bx > w || bx + c.width < 0) continue;
    g.drawImage(c, bx, by);
    if (e.id === 'rem') { g.fillStyle = `rgba(233,184,255,${0.18 + 0.16 * Math.sin(reloj * 2.4)})`; g.beginPath(); g.arc(bx + 29 * u, by + 19 * u, 7 * u, 0, 7); g.fill(); }
    if (e.id === 'gas' && Math.sin(reloj * 4) > 0) { g.fillStyle = '#6fdc7a'; g.fillRect(bx + 14 * u, by + 46.5 * u, u, u); }
    if (pistaDe === e) { g.strokeStyle = '#ffd23f'; g.lineWidth = Math.max(2, u * 0.9); g.setLineDash([u * 2, u * 1.5]); g.lineDashOffset = -reloj * u * 8; g.strokeRect(bx + 2 * u, by + 2 * u, c.width - 4 * u, c.height - 3 * u); g.setLineDash([]); }
  }
  // señales
  for (const s of senales) {
    const px = ox + s.x * T, py = oy + s.y * T, r = T * (0.6 + (reloj * 2 % 1) * 0.6);
    g.strokeStyle = '#ffd23f'; g.lineWidth = Math.max(2, T * 0.07); g.beginPath(); g.arc(px, py, r, 0, 7); g.stroke();
    g.fillStyle = '#ffd23f'; g.font = `800 ${Math.max(10 * RES, T * 0.3)}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'bottom'; g.fillText('¡Aquí! · ' + s.n, px, py - T);
  }
  // las demás maquinitas y la mía
  for (const o of otros.values()) {
    if (!o.on || o.x === undefined) continue;
    dibMaq(g, ox + o.x * T, oy + o.y * T, T, o.m, o.fl & 1 ? 1 : -1, o.fl & 2, o.fl & 4 ? (o.fl & 16 ? 2 : o.fl & 1 ? 1 : -1) : 0, op.nombres ? o.n : '', o.fl & 8 ? 'en pausa' : '', o.x);
  }
  const p = yo.perf, mx = ox + vis.x * T, my = oy + vis.y * T;
  dibMaq(g, mx, my, T, miModelo, yo.dir, yo.vuela, p ? (p.ty > Math.floor(p.oy) ? 2 : p.tx < Math.floor(p.ox) ? -1 : 1) : 0, op.nombres ? miNombre : '', '', vis.x);
  const lado = Math.max(1, Math.round(T * 0.09));
  for (const q of parts) { g.globalAlpha = Math.min(1, q.t * 2); g.fillStyle = q.col; g.fillRect(ox + q.x * T, oy + q.y * T, lado * (q.g || 1), lado * (q.g || 1)); }
  g.globalAlpha = 1;
  // bajo tierra oscurece poco a poco; la maquinita lleva su luz
  if (vis.y > 0.5 && oy < h) {
    const a = Math.min(0.62, 0.14 + (vis.y / H) * 0.6), luz = g.createRadialGradient(mx, my, T * 2, mx, my, T * 11);
    luz.addColorStop(0, 'rgba(10,5,3,0)'); luz.addColorStop(1, `rgba(10,5,3,${a})`);
    g.fillStyle = luz; g.fillRect(0, Math.max(0, oy), w, h);
  }
}

/* ════════ Ciclo del juego ════════ RLR */
// La física corre a pasos fijos de 1/120 s. El dibujo corre al ritmo de cada pantalla
// (60, 90, 120, 144…) y coloca la maquinita entre los dos últimos pasos, así el movimiento
// se ve parejo en cualquier refresco.
const DT = 1 / 120;
const PAUSA = {};
const NITIDEZ = [1, 0.75, 0.5];          // escalones de nitidez: se baja solo si la máquina no alcanza el refresco de su pantalla
const RITMOS = [30, 48, 50, 60, 72, 75, 90, 100, 120, 144, 165, 240];
const rit = { hz: 60, fps: 60, niv: NITIDEZ.length - 1, sonda: true, d: [], lento: 0, bien: 0, veto: 0, sube: 0 };
const ant = { x: INICIO_X, y: INICIO_Y };
let ult = 0, acum = 0, tHud = 0, tPos = 0, tBip = 0, cicloId = 0;

function medirRitmo(ms) {
  const d = rit.d; d.push(ms); if (d.length < 40) return;
  const o = d.slice().sort((a, b) => a - b), rapido = o[Math.floor(o.length * 0.15)], medio = d.reduce((a, b) => a + b, 0) / d.length;
  d.length = 0;
  let hz = 1000 / rapido; hz = RITMOS.reduce((a, b) => (Math.abs(b - hz) < Math.abs(a - hz) ? b : a));
  // Los primeros cuadros se dibujan ligeros para medir el refresco real de la pantalla; luego se sube a toda la nitidez.
  if (rit.sonda) { rit.sonda = false; rit.hz = hz; rit.fps = 1000 / medio; rit.niv = 0; medir(); return; }
  // el refresco de la pantalla es el ritmo más rápido que se ha visto; se olvida poco a poco por si cambia de pantalla
  rit.hz = hz >= rit.hz ? hz : (++rit.sube > 6 ? (rit.sube = 0, hz) : rit.hz);
  if (hz >= rit.hz) rit.sube = 0;
  rit.fps = 1000 / medio;
  if (op.fps) return;                                // con tope elegido a mano no se ajusta nada
  const ahora = performance.now();
  if (rit.fps < rit.hz * 0.82) { rit.bien = 0; if (++rit.lento >= 3 && rit.niv < NITIDEZ.length - 1) { rit.niv++; rit.lento = 0; rit.veto = ahora + 25000; medir(); } }
  else { rit.lento = 0; if (++rit.bien >= 14 && rit.niv > 0 && ahora > rit.veto) { rit.niv--; rit.bien = 0; rit.veto = ahora + 60000; medir(); } }
}
function ciclo(t, id) {
  if (!corriendo || id !== cicloId) return;
  requestAnimationFrame((x) => ciclo(x, id));
  if (op.fps && t - ult < 1000 / op.fps - 2) return;      // tope de cuadros elegido por el jugador
  let d = (t - ult) / 1000; ult = t;
  if (!(d > 0)) return;
  if (d < 0.2) medirRitmo(d * 1000);
  if (d > 0.1) d = 0.1;
  reloj += d; acum += d;
  let n = 0;
  while (acum >= DT) {
    ant.x = yo.x; ant.y = yo.y;
    fisica(DT); tiempo += DT; acum -= DT;
    if (++n >= 14) { acum = 0; break; }                    // si la máquina se atrasa, no se intenta alcanzar: se suelta
  }
  const a = acum / DT, salto = Math.abs(yo.x - ant.x) > 1.5 || Math.abs(yo.y - ant.y) > 1.5;
  vis.x = salto ? yo.x : ant.x + (yo.x - ant.x) * a; vis.y = salto ? yo.y : ant.y + (yo.y - ant.y) * a;
  animar(d);
  dibujar();
  if ((tPos += d) >= (red.lenta ? 0.125 : 0.066)) { tPos = 0; enviarPos(); }
  if ((tHud += d) > 0.12) { tHud = 0; cadaTanto(); }
  // la veta madre se busca con el oído
  if ((tBip -= d) < 0 && yo.y > 0) {
    const b = Math.floor(yo.y / 75); let m = 99;
    for (const k of [b - 1, b, b + 1]) { if (k < 0) continue; const [vx, vy] = veta(k); if (celda(vx, vy) >= 10) m = Math.min(m, Math.hypot(vx + 0.5 - yo.x, vy + 0.5 - yo.y)); }
    if (m < 9) { son.bip(); tBip = 0.12 + m * 0.11; } else tBip = 0.5;
  }
}
// Todo lo que se mueve en pantalla y no es mi física: las demás maquinitas, partículas y la cámara.
function animar(d) {
  const ahora = performance.now() - red.retraso;
  for (const o of otros.values()) {
    const b = o.b; if (!o.on || !b || !b.length) continue;
    while (b.length > 2 && b[1].t <= ahora) b.shift();
    const A = b[0], B = b[1];
    if (!B || ahora <= A.t) { o.x = A.x; o.y = A.y; o.fl = A.fl; continue; }
    const k = Math.min(1, (ahora - A.t) / (B.t - A.t)), lejos = Math.abs(B.x - A.x) > 3 || Math.abs(B.y - A.y) > 3;
    o.x = lejos ? B.x : A.x + (B.x - A.x) * k; o.y = lejos ? B.y : A.y + (B.y - A.y) * k; o.fl = B.fl;
    if (o.fl & 4 && Math.random() < d * 20) chispas(o.x + (o.fl & 16 ? 0 : o.fl & 1 ? 0.5 : -0.5), o.y + (o.fl & 16 ? 0.5 : 0), '#a9744f', 1, 3);
  }
  for (const q of parts) { q.x += q.vx * d; q.y += q.vy * d; q.vy += 9 * d; q.t -= d; }
  if (parts.length) parts = parts.filter((q) => q.t > 0);
  for (const s of senales) s.t -= d;
  if (senales.length) senales = senales.filter((s) => s.t > 0);
  temblor *= Math.pow(0.002, d);
  if (S && S.vida / vidaMax() < 0.3 && Math.random() < d * 12) parts.push({ x: vis.x, y: vis.y - 0.3, vx: (Math.random() - 0.5) * 0.6, vy: -1.5 - Math.random(), t: 0.9, col: '#55504d', g: 2 });
  // cámara: sigue a la maquinita; la rueda o el trackpad la separan y cualquier flecha la regresa
  if (!vistaLibre) { const k = Math.pow(0.0005, d); panX *= k; panY *= k; }
  const minX = 0, maxX = Math.max(0, W - cols), minY = -filas * 0.68, maxY = Math.max(minY, H + 2 - filas);
  let cx = vis.x - cols / 2 + panX, cy = Math.max(minY, vis.y - filas * 0.5) + panY;
  if (cols >= W) cx = (W - cols) / 2; else if (cx < minX) { panX += minX - cx; cx = minX; } else if (cx > maxX) { panX += maxX - cx; cx = maxX; }
  if (cy < minY) { panY += minY - cy; cy = minY; } else if (cy > maxY) { panY += maxY - cy; cy = maxY; }
  const s = 1 - Math.pow(0.00004, d);
  camX += (cx - camX) * s; camY += (cy - camY) * s;
}
function arrancar() {
  if (corriendo || !listo || menu || pausa || !conectado) return;   // con la pestaña oculta el navegador ya no llama al ciclo
  corriendo = true; ult = performance.now(); acum = 0; ant.x = yo.x; ant.y = yo.y;
  const id = ++cicloId; requestAnimationFrame((x) => ciclo(x, id));
  if (pistaDe === PAUSA) pistaDe = undefined;
}
function detener() { corriendo = false; for (const k in teclas) teclas[k] = false; }

let pistaDe = null, tAlarma = 0, estabaAbajo = false, tTabla = 0, tGrua = -9;
function pista(x) { const p = $('#pista'); if (p._t !== x) { p._t = x; p.textContent = x; p.style.display = x ? 'block' : 'none'; } }
// La grúa te deja en la Gasolinera. Cobra por lo lejos que estás y por lo que pesas.
function costoGrua() { return Math.max(10, Math.round(0.75 * Math.hypot(yo.x - 41.5, yo.y + HH) * 2 * (1980 + kgCarga()) / 1000)); }
function grua() {
  if (!S || yo.y <= 1) return;
  if (yo.perf) return aviso('Termina de perforar para pedir la grúa.');
  const c = costoGrua();
  if (S.d < c) { son.no(); return aviso('La grúa cuesta ' + fmt(c) + ' y traes ' + fmt(S.d) + '.'); }
  S.d -= c; S.st.gruas++; son.tele(); chispas(yo.x, yo.y, '#ffd23f', 30, 8);
  yo.x = 41.5; yo.y = INICIO_Y; yo.vx = yo.vy = 0; yo.suelo = true; vistaLibre = false; tGrua = -9;
  tarjeta('🚁 Grúa · ' + fmt(c), 'Te dejó en la Gasolinera.'); difundir('pidió la grúa'); sucio = true; pintarHud(true);
}
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
  pistaDe = e;
  pista(vistaLibre ? '🖱  Vista libre · pulsa una flecha para volver a tu maquinita' : e ? '↓  Entrar a ' + e.n : '');
  // la grúa se ofrece mientras vas subiendo
  if (yo.y > 1 && (teclas.arr || yo.vy < -1)) tGrua = tiempo;
  const c = costoGrua(), ver = yo.y > 1 && tiempo - tGrua < 3.5, gr = $('#grua');
  const txt = ver ? `🚁 Grúa a la Gasolinera · <b>${fmt(c)}</b> · tecla E${S.d < c ? ' · no te alcanza' : ''}` : '';
  if (gr._h !== txt) { gr._h = txt; gr.innerHTML = txt; gr.style.display = txt ? 'block' : 'none'; }
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
  const l = [{ n: miNombre, m: miModelo, rec: S.rec, on: 1, yo: 1, y: prof() }, ...[...otros.values()].map((o) => ({ ...o, y: o.on && o.y !== undefined ? Math.max(0, Math.round((o.y + HH) * 2)) : null }))];
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
  const cm = $('#miMaq'); if (cm) dibMaq(cm.getContext('2d'), 80, 86, 132, miModelo, 1, false, 0, '', '');
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
  ligaMaq(v, el) {
    const liga = location.origin + '/m/' + mundoId + '#maquinita=' + miK;
    const hecho = () => { el.textContent = '¡Liga copiada!'; }, aMano = () => window.prompt('Copia la liga de tu maquinita:', liga);
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(liga).then(hecho, aMano); else aMano();
    return 'no';
  },
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
      chk('nombres', 'Mostrar los nombres de las maquinitas') +
      `<label class="op"><span>Cuadros por segundo</span><select data-a="op" data-k="fps">${[[0, 'Lo máximo de tu pantalla'], [60, '60'], [30, '30 (ahorra batería)']].map(([v, t]) => `<option value="${v}" ${op.fps == v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <p class="nota">Tu pantalla refresca a <b>${rit.hz} Hz</b> y el juego está mostrando <b>${Math.round(Math.min(rit.fps, rit.hz))} cuadros por segundo</b>, con nitidez al ${Math.round(NITIDEZ[rit.niv] * 100)} %. Señal con el mundo: ${red.rtt ? Math.round(red.rtt) + ' ms' : 'midiendo…'}. El juego se ajusta solo: si tu equipo no alcanza el refresco de su pantalla, baja la nitidez antes que la fluidez.</p>`;
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
      `<h4>Mi maquinita</h4><div class="maq"><canvas id="miMaq" width="160" height="160"></canvas><div>
        <b>${esc(miNombre)}</b> · ${RANGOS[S.rango][1]}
        <small>${fmt(S.d)} · récord ${S.rec} m · ${S.log.length} logros · ${S.st.viajes} viajes</small>
        <small>Combustible ${S.fuel.toFixed(1)} / ${tanque()} L · casco ${Math.ceil(S.vida)} / ${vidaMax()} · bodega ${nCarga()} / ${bodega()}</small>
        <small>${PZ.map((z, i) => z.n + ': <b style="display:inline">' + z.niv[S.eq[i]][0] + '</b>').join(' · ')}</small>
        <small>Objetos: ${OBJ.map((o, i) => S.obj[i] ? CORTO[i] + ' ×' + S.obj[i] : '').filter(Boolean).join(' · ') || 'ninguno'}</small></div></div>
      <p class="nota">Tu maquinita se guarda en este mundo con todo lo que trae. Para seguir con ella en otra computadora o en el teléfono, abre allá su liga. <b>No la compartas:</b> quien la abra maneja tu maquinita.</p>
      <div class="fila"><div class="t"><small>Código: <code>${esc(miK)}</code></small></div><button data-a="ligaMaq">Copiar la liga de mi maquinita</button></div>
      <div class="fila"><div class="t"></div><button class="s" data-a="mundos">Mis mundos</button><button class="mal" data-a="desechar">Desechar este mundo</button></div>`;
  } else {
    h += `<p><b>Moverte:</b> flechas o WASD. <b>↑</b> vuela. <b>↓</b> perfora hacia abajo. <b>← →</b> contra una pared, perfora de lado. Nunca se perfora hacia arriba.</p>
      <p><b>El ciclo:</b> baja, llena la bodega, sube, vende en La Báscula, carga combustible y mejora tu equipo en El Taller. En la superficie, párate frente a un edificio y pulsa ↓.</p>
      <p><b>Objetos:</b> F tanque de reserva · R nanobots · X dinamita · C explosivo plástico · Q teletransportador · M transmisor.</p>
      <p><b>Acompañado:</b> G deja una señal que todos ven · T le pasa 5 litros a la maquinita que tengas junto · P pausa tu maquinita.</p>
      <p><b>Grúa:</b> mientras subes, la tecla E te lleva a la Gasolinera. Cobra según lo lejos que estés y lo que peses.</p>
      <p><b>Mirar alrededor:</b> la rueda del mouse o dos dedos en el trackpad mueven la vista; cualquier flecha la regresa a tu maquinita.</p>
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
  if (e.repeat && !MAPA[k]) return;                 // dejar apretada una tecla no la dispara treinta veces por segundo
  if (k === 'Escape') { if (menu && menu !== 'inicio') cerrar(); else if (listo && !menu) abrir('menu'); return; }
  if (!listo || menu) return;
  if (k === 'p') {
    pausa = !pausa;
    if (pausa) { detener(); pistaDe = PAUSA; pista('⏸  Pausa · tu maquinita no gasta · pulsa P para seguir'); ultPos = ''; enviarPos(); }
    else { pista(''); arrancar(); }
    return;
  }
  if (pausa) return;
  if (MAPA[k]) {
    e.preventDefault();
    if (MAPA[k] === 'aba' && !e.repeat && pistaDe && pistaDe.id && yo.suelo && yo.y < 0) return abrir(pistaDe.id);
    teclas[MAPA[k]] = true; vistaLibre = false; return;
  }
  const i = 'frxcqm'.indexOf(k);
  if (i >= 0) return usar(i);
  if (k === 'g') { enviar({ t: 'senal', x: yo.x, y: yo.y }); senales.push({ x: yo.x, y: yo.y, t: 10, n: miNombre }); son.bip(); }
  if (k === 't') pasarCombustible();
  if (k === 'e') grua();
});
// La rueda o el trackpad mueven la vista para mirar alrededor; cualquier flecha la regresa a la maquinita.
addEventListener('wheel', (e) => {
  if (!listo || menu) return;
  e.preventDefault();
  const k = (e.deltaMode === 1 ? 32 : 1) * RES / T;
  panX = Math.max(-W, Math.min(W, panX + e.deltaX * k)); panY = Math.max(-H, Math.min(H, panY + e.deltaY * k)); vistaLibre = true;
}, { passive: false });
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
    if (d.d) { duenos[d.id] = d.d; escribir('mina_duenos', duenos); }
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
  const entra = () => { if (nom.value.trim().length < 2) return; audio(); bautizo = { n: nom.value.trim(), m: modelo }; hola(bautizo); };
  be.onclick = entra; nom.onkeydown = (e) => { if (e.key === 'Enter') entra(); };
  $('#bCod').onclick = () => { const c = $('#cod').value.trim(); if (c.length >= 16 && c !== miK) { llaveAntes = miK; miK = c; hola(); } };
  nom.focus();
}
function entrar(id) {
  mundoId = id;
  const m = mundos.find((x) => x.id === id);
  miK = ligaMaquinita || (m ? m.k : llave());
  inicio('<header><h2>Entrando al mundo…</h2></header><div class="cuerpo"><p class="nota">' + esc(id) + '</p></div>');
  conectar();
}

addEventListener('resize', medir);
document.addEventListener('visibilitychange', () => { if (document.hidden) { for (const k in teclas) teclas[k] = false; if (sucio) enviarEst(); } });
addEventListener('pagehide', () => enviarEst());
setInterval(() => {                       // lo poco que corre aunque el juego esté detenido
  if (sucio && conectado) enviarEst();
  if (++latido % (document.hidden ? 25 : 5) === 0) latir();
  const c = $('#cuenta');
  if (cuentaFin) { const s = Math.ceil((cuentaFin - Date.now()) / 1000); c.style.display = 'block'; c.textContent = s > 0 ? `🌋 Remineralizando en ${s}…` : '🌋'; if (s < -3) cuentaFin = 0; }
  else c.style.display = 'none';
}, 1000);

// La liga de una maquinita trae su llave después del #: el navegador nunca la manda al servidor en la dirección.
const ligaMaquinita = (location.hash.match(/maquinita=([0-9a-zA-Z]{16,64})/) || [])[1] || '';
if (location.hash) history.replaceState(null, '', location.pathname);
aplicarOp();
{
  const r = location.pathname.match(/^\/m\/([2-9A-HJ-NP-Z]{8})\/?$/i);
  if (r) entrar(r[1].toUpperCase());
  else if (location.pathname.length > 1) pantallaFinal('Esta liga está incompleta', 'La liga de un mundo termina en 8 letras y números. Pídela otra vez o entra a tus mundos.');
  else if (!mundos.length) crearMundo();
  else pantallaMundos();
}
// Para pruebas: window.__mina
window.__mina = { get S() { return S; }, avanza(seg) { for (let i = 0, n = Math.round(seg * 120); i < n; i++) { tiempo += DT; ant.x = yo.x; ant.y = yo.y; fisica(DT); if (i % 14 === 0) cadaTanto(); } vis.x = yo.x; vis.y = yo.y; }, rit, red, animar, grua, costoGrua, dibujar, llegar, danar, get e() { return { corriendo, menu, pausa, listo, conectado, tiempo, perf: yo.perf, renace: yo.renace }; }, yo, otros, celda, gen, get cfg() { return cfg; }, usar, abrir, cerrar, teclas, enviarEst, veta, LOGROS };
/* RLR · Ricardo López Reyero · fin */
