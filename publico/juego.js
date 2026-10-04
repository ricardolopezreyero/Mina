/* ════════════════════════════════════════════════════════════════════════════
   Mina · juego de minería infinito y compartido
   Autor: Ricardo López Reyero (RLR) · mina.capitaltorreon.com
   Sin librerías, sin imágenes y sin audios descargados: todo se dibuja y se
   sintetiza aquí. El terreno de cada mundo se fabrica una vez con su semilla y queda guardado.
   ════════════════════════════════════════════════════════════════════════════ */
'use strict';
const _RLR = 'Ricardo López Reyero';
const _k = 'EYE', _rev = 181218; // RLR · sello de autoría

/* ── Constantes del mundo (deben coincidir con src/mundo.js) ── */
const W = 96, H = 5000, ZX0 = 39, ZX1 = 68, G = 14;     // 10,000 m de profundidad (2 m por celda)
const HW = 0.36, HH = 0.4;         // media anchura y media altura de la maquinita, en celdas
const INICIO_X = 43.5, INICIO_Y = -HH;
const TECHO = -500000.5;           // 1,000 km de cielo (2 m por celda)
const $ = (s) => document.querySelector(s);

/* ── Minerales: los 10 de la Corteza (valores y pesos del original) y los 12 de las zonas hondas ── RLR */
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
  // Acuífero (1 a 2 km)
  { n: 'Aguamarina',    v: 700000,   kg: 100, a: 1010, c: 1300, col: '#4fd6d0', s: 'Aq' },
  { n: 'Zafiro',        v: 1000000,  kg: 110, a: 1200, c: 1600, col: '#3f6dff', s: 'Za' },
  { n: 'Perla negra',   v: 1500000,  kg: 60,  a: 1500, c: 1900, col: '#8a86a8', s: 'Pn' },
  // Cavernas (2 a 4 km)
  { n: 'Ónix',          v: 2000000,  kg: 130, a: 2000, c: 2500, col: '#4a4a58', s: 'On' },
  { n: 'Topacio',       v: 3000000,  kg: 130, a: 2600, c: 3200, col: '#ff9a2e', s: 'To' },
  { n: 'Jade imperial', v: 4000000,  kg: 140, a: 3200, c: 3800, col: '#8fd6a0', s: 'Ja' },
  // Cristalera (4 a 8 km)
  { n: 'Amatista',      v: 6000000,  kg: 150, a: 4000, c: 4800, col: '#9a4fe0', s: 'At' },
  { n: 'Tanzanita',     v: 8000000,  kg: 150, a: 5200, c: 6000, col: '#5b5bff', s: 'Tz' },
  { n: 'Alejandrita',   v: 12000000, kg: 160, a: 6400, c: 7200, col: '#ff5fa2', s: 'Al' },
  // Zona de presión (8 a 10 km)
  { n: 'Paladio',       v: 16000000, kg: 180, a: 8000, c: 8400, col: '#e9eef2', s: 'Pd' },
  { n: 'Rodio',         v: 24000000, kg: 190, a: 8600, c: 9000, col: '#ffd9e8', s: 'Rh' },
  { n: 'Osmio',         v: 40000000, kg: 220, a: 9200, c: 9600, col: '#6fa8ff', s: 'Os' },
];
const PESO_MIN = [10, 8, 6, 5, 5, 4.5, 4, 3.5, 3, 2.5, 3, 2.6, 2.2, 3, 2.6, 2.2, 3, 2.6, 2.2, 3, 2.6, 2.2];
const HALL = [
  { n: 'Huesos de dinosaurio', v: 1000 },
  { n: 'Cofre del tesoro', v: 5000 },
  { n: 'Esqueleto antiguo', v: 10000 },
  { n: 'Reliquia sagrada', v: 50000 },
  { n: 'Perla gigante', v: 400000, fijo: 1 },              // solo en el lecho del Acuífero
  { n: 'Ídolo de oro', v: 25000000, fijo: 1 },             // solo en la pirámide de la Ciudad Perdida
  { n: 'Corazón de la Tierra', v: 2500000000, fijo: 1 },   // solo uno, a 9,830 m
  { n: 'Huevo de dragón', v: 60000000, fijo: 1 },          // solo en el Nido del dragón
];
// Un hallazgo vale más entre más hondo: a 1 km lo de siempre; a 10 km, mil veces más.
const valorHall = (k, y) => (HALL[k].fijo ? HALL[k].v : Math.round(HALL[k].v * Math.max(1, ((y + 1) / 500) ** 3) / 1000) * 1000);

/* ── Los cuatro lugares del camino a los 10 km. x, y: dónde te deja El Elevador ── */
const LUGARES = [
  { ic: '💧', n: 'El Acuífero', m: 1040, x: 48, y: 556, q: 1e6, tx: 'Un lago enterrado. Aquí se flota: el agua te sostiene y nada quema. En el lecho hay perlas.' },
  { ic: '💎', n: 'La Gruta de Cristal', m: 2950, x: 48, y: 1495, q: 1e7, tx: 'Una cueva enorme con las paredes forradas de metales preciosos. Llévate lo que puedas cargar.' },
  { ic: '🏛️', n: 'La Ciudad Perdida', m: 5580, x: 37, y: 2815, q: 5e7, tx: 'Alguien vivió aquí. Las casas siguen de pie y cada una guarda sus tesoros.' },
  { ic: '❤️', n: 'El Corazón de la Tierra', m: 9780, x: 40, y: 4915, q: 5e8, tx: 'Late despacio. A su alrededor, la veta madre: la más rica que existe. Y detrás de la roca, algo más.' },
  // Los rincones: más chicos que los cuatro grandes. t = de qué está hecho; cx, cy, rx, ry = dónde y de qué tamaño.
  { ic: '⛺', n: 'El Campamento abandonado', m: 350, t: 'camp', cx: 30, cy: 175, rx: 11, ry: 4, q: 5e3, tx: 'Alguien acampó aquí hace años. Dejó su carrito, su lámpara y varios cofres.' },
  { ic: '🦖', n: 'El Fósil gigante', m: 700, t: 'fosil', cx: 60, cy: 350, rx: 11, ry: 3, q: 5e4, tx: 'Un animal enorme, enterrado entero. Cada hueso es un hallazgo.' },
  { ic: '🌊', n: 'El Río subterráneo', m: 1700, t: 'rio', cx: 48, cy: 850, rx: 46, ry: 4, q: 2e6, tx: 'Cruza el mundo de lado a lado. Trae peces y, en el lecho, perlas.' },
  { ic: '🍄', n: 'El Bosque de hongos', m: 2300, t: 'hongos', cx: 40, cy: 1150, rx: 16, ry: 7, q: 5e6, tx: 'Hongos más altos que tu maquinita, y brillan. Entre sus raíces hay reliquias.' },
  { ic: '⚙️', n: 'El Cementerio de maquinitas', m: 3700, t: 'cemen', cx: 55, cy: 1850, rx: 15, ry: 6, q: 2e7, tx: 'Aquí se quedaron las que bajaron antes que tú. Sus cofres siguen llenos.' },
  { ic: '♨️', n: 'Las Aguas termales', m: 4400, t: 'termas', cx: 35, cy: 2200, rx: 14, ry: 6, q: 3e7, tx: 'Agua tibia que sale de la roca. Métete: repara el casco sin cobrar.' },
  { ic: '🗿', n: 'Los Guardianes', m: 5100, t: 'guard', cx: 60, cy: 2550, rx: 15, ry: 6, q: 4e7, tx: 'Cabezas de piedra que cuidan la entrada de la ciudad. A sus pies dejaron ofrendas.' },
  { ic: '🦋', n: 'El Jardín de cristal', m: 6400, t: 'jardin', cx: 40, cy: 3200, rx: 17, ry: 8, q: 8e7, tx: 'Cristales que crecen como plantas, y mariposas que parecen de vidrio.' },
  { ic: '🌋', n: 'El Lago de lava', m: 7200, t: 'lava', cx: 52, cy: 3600, rx: 18, ry: 7, q: 1.2e8, tx: 'Sobre cada pilar hay una reliquia. Vuela de uno a otro y no toques el lago.' },
  { ic: '🏦', n: 'La Bóveda de la Compañía', m: 8000, t: 'boveda', cx: 34, cy: 4000, rx: 11, ry: 4, q: 2e8, tx: 'Doña Chela nunca dijo que existía. Está llena de cofres.' },
  { ic: '🐉', n: 'El Nido del dragón', m: 8800, t: 'nido', cx: 56, cy: 4400, rx: 16, ry: 7, q: 3e8, tx: 'Duerme. Sus huevos valen una fortuna. No hagas ruido… o sí: no despierta.' },
];
const RINCONES = LUGARES.map((L, i) => ({ ...L, i })).filter((L) => L.t);
for (const R of RINCONES) { LUGARES[R.i].x = R.t === 'boveda' ? R.cx + 1 : R.cx; LUGARES[R.i].y = R.t === 'boveda' ? R.cy + 1 : R.t === 'fosil' ? R.cy - 1 : R.cy - 1; }
const ZONA_N = ['La Corteza', 'La Corteza', 'La Corteza', 'La Corteza', 'El Acuífero', 'Las Cavernas', 'La Cristalera', 'La Zona de presión'];
const ZONA_TX = { 4: 'Roca azulada y húmeda. Aquí empiezan la aguamarina, el zafiro y la perla negra.', 5: 'Roca morada y cuevas con hongos que brillan. Ónix, topacio y jade.', 6: 'Roca índigo, llena de cristales. Amatista, tanzanita y alejandrita.', 7: 'Roca negra y brasas. Lo más duro y lo más valioso: paladio, rodio y osmio.' };
/* ── La colección del mundo: 33 objetos, tres de cada uno (99 en total), repartidos de arriba al fondo.
   Es del mundo y es de todos: lo que encuentra cualquiera se enciende en la vitrina de todos. ── */
const COLEC = [['🥾', 'Bota de minero'], ['🔦', 'Linterna vieja'], ['⛏️', 'Pico oxidado'], ['📻', 'Radio de la Compañía'], ['🐚', 'Caracola'], ['⚓', 'Ancla'], ['🧭', 'Brújula'], ['🍄', 'Hongo luminoso'], ['🕯️', 'Vela eterna'], ['🗝️', 'Llave de hierro'], ['🏺', 'Ánfora'],
  ['📜', 'Mapa del tesoro'], ['🦇', 'Murciélago de obsidiana'], ['🎭', 'Máscara ritual'], ['🔮', 'Bola de cristal'], ['💍', 'Anillo perdido'], ['⚱️', 'Urna'], ['🧿', 'Amuleto'], ['🗿', 'Cabeza de piedra'], ['🏹', 'Arco antiguo'], ['⚔️', 'Espadas cruzadas'], ['🎻', 'Violín'],
  ['⌛', 'Reloj de arena'], ['🔔', 'Campana de bronce'], ['👑', 'Corona'], ['🏆', 'Copa de oro'], ['🦷', 'Colmillo de dragón'], ['🥚', 'Huevo de dragón'], ['🧬', 'Fósil viviente'], ['☄️', 'Fragmento de cometa'], ['🌋', 'Piedra del volcán'], ['🌟', 'Estrella caída'], ['🐉', 'Dragón dormido']];
const NCOL = COLEC.length * 3, FRANJA = Math.floor((H - 20) / COLEC.length);            // cada objeto vive en su franja de unos 300 m
// Lo que paga cada uno: de $500 el de arriba a $500 millones el del fondo. Se buscan por coleccionarlos, pero entre más hondo, más valen.
const valorCol = (k) => { const v = 500 * Math.pow(1e6, k / (COLEC.length - 1)), u = Math.pow(10, Math.floor(Math.log10(v)) - 1); return Math.round(v / u) * u; };
const hallados = new Uint8Array(NCOL), colec = new Map();        // cuáles ya encontró el equipo · en qué celda está cada uno
const nHallados = () => hallados.reduce((a, b) => a + b, 0);
const AGUA0 = 520, AGUA1 = 620;                  // las filas inundadas del Acuífero (1,040 a 1,240 m)

/* ── Las 6 piezas del equipo: nombre, precio, valor e historia. Veintiséis mejoras por pieza, de $750 a $25 billones ── */
const PZ = [
  { n: 'Taladro', ic: '🔩', u: 'de potencia', que: 'Con qué muerdes la tierra: menos tiempo y menos combustible por celda.', niv: [
    ['Broca de fábrica', 0, 20, 'Venía con el equipo. Muerde tierra suelta y se queja con todo lo demás.'],
    ['Broca Platera', 750, 28, 'Punta bañada en plata: corta limpio y casi no se calienta. El primer lujo de todo minero.'],
    ['Broca Dorada', 2000, 40, 'Su aleación de oro disipa el calor; ya no hay que parar a enfriar. Se nota desde la primera celda.'],
    ['Corona de Esmeralda', 5000, 50, 'Un anillo de dientes de esmeralda. Donde la tierra se aprieta, ella apenas lo nota.'],
    ['Colmillo de Rubí', 20000, 70, 'Un solo cristal afilado que perfora en espiral y avienta la tierra hacia atrás.'],
    ['Punta de Diamante', 100000, 95, 'Lo más duro que se conocía, hasta que alguien bajó más.'],
    ['Lanza de Amazonita', 500000, 120, 'Vibra al ritmo de la roca y la deshace antes de tocarla.'],
    ['Broca de Obsidiana Viva', 2000000, 140, 'Vidrio volcánico que se afila solo: entre más perfora, más corta.'],
    ['Taladro Sónico', 5000000, 160, 'No toca la roca: le canta en la nota exacta y la roca se rinde.'],
    ['Barrena de Plasma', 10000000, 185, 'Un hilo de sol en la punta. La tierra no se rompe: se aparta.'],
    ['Colmillo de Neutronio', 25000000, 210, 'Una cucharada pesa lo que un cerro. Nada de lo que hay abajo le hace cosquillas.'],
    ['Taladro de Gravedad', 50000000, 240, 'Dobla el suelo hacia adentro y lo deja caer por su propio peso.'],
    ['Aguja de Antimateria', 100000000, 275, 'Lo que toca deja de existir. Úsese lejos de la Gasolinera.'],
    ['Broca Cuántica', 250000000, 315, 'Perfora la celda antes de que decidas perforarla.'],
    ['Lanza de Estrella', 500000000, 360, 'Forjada con el núcleo de una estrella apagada. Todavía está tibia.'],
    ['Devoradora de Mundos', 1000000000, 410, 'Los mineros viejos dicen que no hay que encenderla viendo hacia arriba.'],
    ['La Última Broca', 2500000000, 470, 'Después de esta no hay otra. Eso dijeron también de la anterior.'],
    ['La Penúltima Broca', 6000000000, 540, 'Resultó que sí había otra. El Taller pide una disculpa y cobra igual.'],
    ['Broca de Materia Oscura', 15000000000, 620, 'No se ve, no se toca y nadie sabe qué es. Perfora de maravilla.'],
    ['Colmillo de Agujero Negro', 40000000000, 710, 'La roca no se rompe: se cae hacia adentro de la punta y ya no vuelve.'],
    ['Taladro del Tiempo', 100000000000, 810, 'Llega a la celda un instante antes que tú y te la deja abierta.'],
    ['Aguja de Cuerdas', 250000000000, 920, 'Desafina las cuerdas de las que está hecha la roca. La roca se deshace sola.'],
    ['Broca Supernova', 600000000000, 1050, 'Cada giro es una estrella que estalla en chiquito. Úsese con lentes oscuros.'],
    ['Lanza del Vacío', 1500000000000, 1200, 'Donde apunta, deja de haber algo. Ni polvo queda.'],
    ['Devoradora de Galaxias', 4000000000000, 1370, 'La hermana mayor de la Devoradora de Mundos. Come más y pregunta menos.'],
    ['Broca del Big Bang', 10000000000000, 1560, 'Gira desde el principio del universo. Nadie la ha visto detenerse.'],
    ['La de Veras Última', 25000000000000, 1900, 'Ahora sí no hay otra. El Taller lo firmó ante notario.'],
  ] },
  { n: 'Casco', ic: '🛡️', u: 'de vida', que: 'Cuánto castigo aguantas: más margen para caídas, lava y gas.', niv: [
    ['Lámina de fábrica', 0, 10, 'Aguanta un tropezón. No dos.'],
    ['Blindaje de Hierro', 750, 17, 'Placas remachadas a mano. Perdona una mala caída.'],
    ['Coraza de Cobre', 2000, 30, 'Más gruesa y más flexible: se abolla, pero no se rompe.'],
    ['Armadura de Acero', 5000, 50, 'La primera que sale viva de un baño de lava.'],
    ['Bóveda de Platino', 20000, 80, 'No se oxida, no se derrite y casi no se entera de las caídas.'],
    ['Caparazón de Einstenio', 100000, 120, 'El mínimo para sobrevivir a una bolsa de gas. Sin él, la zona honda es una ruleta.'],
    ['Escudo de Energía', 500000, 180, 'Ya no es metal: es un campo que envuelve al equipo.'],
    ['Coraza de Obsidiana', 2000000, 250, 'Negra, lisa y fría. La lava la reconoce como pariente y la deja pasar.'],
    ['Blindaje Reactivo', 5000000, 340, 'Cada golpe lo endurece. A la tercera explosión ya es otro casco.'],
    ['Campo Deflector', 10000000, 450, 'Desvía el golpe antes de que llegue. Se siente como un empujón amable.'],
    ['Armadura de Neutronio', 25000000, 600, 'Tan densa que las bolsas de gas le rebotan.'],
    ['Doble Escudo de Energía', 50000000, 800, 'Dos campos, uno dentro del otro. Si cae el primero, el segundo ni se entera.'],
    ['Escudo de Plasma', 100000000, 1050, 'Una burbuja de fuego frío. La lava se evapora antes de tocarte.'],
    ['Escudo Gravitacional', 250000000, 1400, 'Curva el espacio alrededor del equipo: los golpes dan la vuelta.'],
    ['Escudo de Fase', 500000000, 1850, 'Por un instante la maquinita no está ahí. El golpe pasa de largo.'],
    ['Escudo Estelar', 1000000000, 2400, 'El mismo campo que protege a una estrella de sí misma.'],
    ['Égida', 2500000000, 3200, 'El escudo del que hablan los mitos. Resulta que sí existía.'],
    ['Manto de Aurora', 6000000000, 4200, 'La misma luz que cuida al planeta del Sol, puesta alrededor de tu maquinita.'],
    ['Coraza de Materia Oscura', 15000000000, 5500, 'Los golpes no la encuentran. Tú tampoco, pero ahí está.'],
    ['Escudo de Horizonte', 40000000000, 7200, 'Como el borde de un agujero negro: lo que entra no llega a tocarte.'],
    ['Armadura del Tiempo', 100000000000, 9400, 'El golpe te da ayer, cuando no estabas.'],
    ['Capullo de Cuerdas', 250000000000, 12000, 'Tejido con las cuerdas más finas del universo. No se rompe: se afina.'],
    ['Escudo Supernova', 600000000000, 15500, 'Devuelve cada golpe con intereses.'],
    ['Burbuja de Vacío', 1500000000000, 20000, 'Entre tú y el peligro pone un tramo de nada. La nada no pasa el daño.'],
    ['Coraza Galáctica', 4000000000000, 26000, 'Cien mil millones de soles haciendo guardia.'],
    ['Escudo del Big Bang', 10000000000000, 34000, 'Aguantó la explosión más grande que ha habido. Una bolsa de gas le da ternura.'],
    ['Intocable', 25000000000000, 45000, 'El Taller garantiza que nada te toca. La garantía no cubre regaños de Doña Chela.'],
  ] },
  { n: 'Motor', ic: '⚙️', u: 'caballos', que: 'Cuánto peso subes y qué tan rápido: regresas cargado sin arrastrarte.', niv: [
    ['Motor de fábrica', 0, 150, 'Sube. Despacio, pero sube.'],
    ['«Mulita» V4 1.6', 750, 160, 'Terca y confiable. Levanta media bodega sin protestar.'],
    ['«Coyote» V4 turbo', 2000, 170, 'El turbo silba al despegar. Regresas antes y gastas menos en el camino.'],
    ['«Toro» V6', 5000, 180, 'Ya levanta platino sin arrastrarse.'],
    ['«Bisonte» V8 supercargado', 20000, 190, 'Para cuando la bodega pesa más que el propio equipo.'],
    ['«Mamut» V12', 100000, 200, 'Sube con diamantes como si fueran grava.'],
    ['«Titán» V16', 500000, 210, 'El único que despega con treinta amazonitas a bordo. Apenas.'],
    ['«Coloso» V20', 2000000, 250, 'Veinte cilindros. El piso de la Gasolinera tiembla cuando lo enciendes.'],
    ['«Trueno» de doble turbina', 5000000, 300, 'Se oye después de que ya pasaste.'],
    ['«Ciclón» eléctrico', 10000000, 370, 'Silencioso y con toda la fuerza desde el primer instante.'],
    ['«Cometa» de hidrógeno', 25000000, 460, 'Deja una estela de vapor. Sube cargado como si bajara vacío.'],
    ['«Volcán» de fusión', 50000000, 580, 'Un sol chiquito bajo el cofre. La bodega llena ya no es tema.'],
    ['«Pegaso» iónico', 100000000, 740, 'Empuja con luz. Los viajes al espacio se vuelven paseo.'],
    ['«Dragón» de plasma', 250000000, 950, 'Ruge azul. Levanta lo que la bodega más grande pueda cargar.'],
    ['«Atlas» antigravedad', 500000000, 1250, 'No levanta el peso: lo convence de que no pesa.'],
    ['«Fénix» de antimateria', 1000000000, 1650, 'Un gramo de combustible, un año de trabajo.'],
    ['«Infinito»', 2500000000, 2200, 'Nadie sabe cómo funciona. Funciona.'],
    ['«Infinito y Medio»', 6000000000, 3200, 'Los matemáticos protestaron. El motor arrancó de todos modos.'],
    ['«Sombra» de materia oscura', 15000000000, 4800, 'Empuja con algo que nadie ha visto. La maquinita tampoco pregunta.'],
    ['«Horizonte»', 40000000000, 7200, 'Se cae hacia arriba. Así de simple.'],
    ['«Mañana»', 100000000000, 11000, 'Llegas antes de salir. La Báscula ya te estaba esperando.'],
    ['«Arpa» de cuerdas', 250000000000, 16000, 'Toca una nota y el peso se queda atrás, escuchando.'],
    ['«Supernova»', 600000000000, 23000, 'Un estallido continuo, muy bien educado, bajo el cofre.'],
    ['«Vacío» cuántico', 1500000000000, 32000, 'Saca la fuerza de la nada. Literalmente.'],
    ['«Vía Láctea»', 4000000000000, 44000, 'Gira con toda la galaxia. Solo hay que agarrarse.'],
    ['«Génesis»', 10000000000000, 60000, 'El primer empujón que hubo, todavía con fuerza.'],
    ['«Porque Sí»', 25000000000000, 80000, 'No tiene explicación ni la necesita. Sube lo que sea, a donde sea.'],
  ] },
  { n: 'Tanque', ic: '⛽', u: 'litros', que: 'Cuánto tiempo puedes estar abajo: viajes más largos y más hondos.', niv: [
    ['Bidón de fábrica', 0, 10, 'Treinta segundos perforando. No le quites el ojo al medidor.'],
    ['«Cantimplora»', 750, 15, 'Medio viaje más de aire. La compra más barata que salva vidas.'],
    ['«Barril»', 2000, 25, 'El que los veteranos recomiendan comprar primero.'],
    ['«Cisterna»', 5000, 40, 'Ya puedes pasearte de lado buscando vetas, no solo bajar y subir.'],
    ['«Pipa»', 20000, 60, 'Alcanza para llegar a la zona de lava y volver.'],
    ['«Leviatán»', 100000, 100, 'Un viaje al fondo, ida y vuelta, sin rezar.'],
    ['«Océano» de compresión líquida', 500000, 150, 'Comprime el combustible hasta volverlo casi sólido. Te cansas tú antes que el tanque.'],
    ['«Mar» presurizado', 2000000, 200, 'Doscientos litros donde antes cabían diez.'],
    ['«Abismo»', 5000000, 260, 'El medidor tarda tanto en bajar que se te olvida que existe.'],
    ['«Glaciar» criogénico', 10000000, 330, 'Combustible congelado en bloques. Se derrite conforme lo pides.'],
    ['«Nube» de gas denso', 25000000, 420, 'Pesa menos lleno que el anterior vacío.'],
    ['«Manantial»', 50000000, 520, 'Recupera el vapor del escape y lo vuelve a quemar.'],
    ['«Galaxia»', 100000000, 650, 'Ida y vuelta a la Luna con lo que sobra de la mañana.'],
    ['«Pozo sin Fondo»', 250000000, 800, 'Le echas y le echas. Tarda en llenarse; tarda más en vaciarse.'],
    ['«Agujero Blanco»', 500000000, 1000, 'Mil litros. La Gasolinera te manda felicitación en Navidad.'],
    ['«Eterno»', 1000000000, 1250, 'Los mineros lo heredan a sus nietos todavía a medio tanque.'],
    ['«Big Bang»', 2500000000, 1600, 'Todo el combustible del principio del universo, en un tanque.'],
    ['«Otro Big Bang»', 6000000000, 2000, 'Resulta que hubo dos. Este es el segundo, sin estrenar.'],
    ['«Niebla» de materia oscura', 15000000000, 2500, 'Combustible que no se ve. El medidor lo cuenta de memoria.'],
    ['«Singularidad»', 40000000000, 3200, 'Todo el combustible en un punto. Un punto muy, muy lleno.'],
    ['«Ayer»', 100000000000, 4000, 'Se llena con lo que no gastaste ayer. No lo pienses mucho.'],
    ['«Sinfonía»', 250000000000, 5000, 'Cada cuerda del universo guarda una gota.'],
    ['«Enana Blanca»', 600000000000, 6400, 'Una estrella exprimida. Una cucharada mueve a la maquinita un mes.'],
    ['«Mar del Vacío»', 1500000000000, 8000, 'El vacío no está vacío. El Taller encontró cómo ordeñarlo.'],
    ['«Andrómeda»', 4000000000000, 10000, 'Diez mil litros. La Gasolinera le pone tu nombre a una bomba.'],
    ['«Multiverso»', 10000000000000, 12500, 'Cuando se acaba, toma prestado del tanque de otra maquinita igualita, en otro universo.'],
    ['«Ya Estuvo»', 25000000000000, 16000, 'Dieciséis mil litros. Si te lo acabas, cuéntanos cómo.'],
  ] },
  { n: 'Radiador', ic: '❄️', u: '% menos daño de lava y gas', que: 'Cuánto calor te quitas de encima.', niv: [
    ['Sin radiador', 0, 0, 'El calor entra completo.'],
    ['Abanico', 750, 5, 'Un ventilador. Es poco, pero es algo.'],
    ['Doble Abanico', 2000, 10, 'Dos aspas girando en contra. Le quita el filo a la lava.'],
    ['Turbina', 5000, 25, 'Con ella y una Armadura de Acero, la lava deja de ser mortal.'],
    ['Doble Turbina', 20000, 40, 'Saca el calor más rápido de lo que entra. Casi.'],
    ['Circuito Criogénico', 100000, 60, 'Lo que hace falta para aguantar el gas del fondo.'],
    ['«Corazón de Hielo»', 500000, 80, 'La lava se vuelve una molestia y el gas, un susto.'],
    ['«Escarcha»', 2000000, 83, 'Una capa de hielo fino sobre el casco que nunca se derrite.'],
    ['«Ventisca»', 5000000, 86, 'Sopla nieve hacia afuera. La lava se apaga a un metro de ti.'],
    ['«Iceberg»', 10000000, 88, 'Nueve décimas partes del frío van escondidas adentro.'],
    ['«Nitrógeno Líquido»', 25000000, 90, 'Baña el casco en un frío que humea. Del calor solo pasa una décima parte.'],
    ['«Polo Sur»', 50000000, 92, 'Lleva puesto un invierno entero.'],
    ['«Helio Superfluido»', 100000000, 94, 'Un líquido que sube por las paredes y se lleva el calor con él.'],
    ['«Cero Absoluto»', 250000000, 95, 'Más frío no se puede. Eso creían.'],
    ['«Bajo Cero Absoluto»', 500000000, 96, 'Los físicos dicen que es imposible. El Taller lo vende igual.'],
    ['«Noche del Espacio»', 1000000000, 97, 'El frío que hay entre las estrellas, enlatado.'],
    ['«Corazón de Cometa»', 2500000000, 98, 'Hielo con más años que el Sol. La lava le hace los mandados.'],
    ['«Nevada de Plutón»', 6000000000, 98.3, 'Nieve de nitrógeno traída del borde del sistema solar.'],
    ['«Sombra Fría»', 15000000000, 98.6, 'Materia oscura helada. No se ve el frío, pero se siente.'],
    ['«Aliento de Agujero Negro»', 40000000000, 98.8, 'Lo más frío que existe: ni el calor se le escapa.'],
    ['«Invierno de Ayer»', 100000000000, 99, 'Manda el calor al pasado. Allá que se las arreglen.'],
    ['«Cuerda Helada»', 250000000000, 99.2, 'Una sola cuerda del universo, quieta. Lo demás se enfría de verla.'],
    ['«Ceniza de Supernova»', 600000000000, 99.4, 'Lo que queda cuando una estrella se apaga del todo.'],
    ['«Vacío Perfecto»', 1500000000000, 99.5, 'Sin nada que caliente, nada se calienta.'],
    ['«Noche entre Galaxias»', 4000000000000, 99.6, 'El lugar más solo y más frío que hay. Enlatado, como el otro.'],
    ['«Antes del Big Bang»', 10000000000000, 99.7, 'De cuando todavía no existía el calor.'],
    ['«Paleta de Hielo»', 25000000000000, 99.8, 'El Taller se quedó sin nombres serios. Enfría más que todos los anteriores.'],
  ] },
  { n: 'Bodega', ic: '📦', u: 'espacios', que: 'Cuánto te llevas por viaje: más dinero por cada bajada.', niv: [
    ['Canasta', 0, 7, 'Siete piezas y a subir.'],
    ['Cajón', 750, 15, 'El doble de carga: cada viaje ya paga algo.'],
    ['Vagoneta', 2000, 25, 'Deja de doler pasar junto a una veta sin poder cargarla.'],
    ['Tolva', 5000, 40, 'Un viaje bueno ya compra una mejora completa.'],
    ['Contenedor', 20000, 70, 'Empieza a pesar: pídele más al motor.'],
    ['Bodega Leviatán', 100000, 120, 'Vacías una veta entera de una sola pasada.'],
    ['Bodega Colosal', 500000, 175, 'Cabe más de lo que el motor levanta. El límite ya no es el espacio: es el peso.'],
    ['Bodega Titánica', 2000000, 220, 'Hay eco adentro.'],
    ['Bodega de Doble Fondo', 5000000, 270, 'Por fuera parece igual. Por dentro, nadie le encuentra el final.'],
    ['Tren de Vagonetas', 10000000, 330, 'Seis carros enganchados que te siguen como patitos.'],
    ['Bodega Plegable', 25000000, 400, 'Se dobla sobre sí misma. No preguntes dónde queda lo que guardas.'],
    ['Silo Compresor', 50000000, 480, 'Aprieta el mineral hasta que cabe el doble.'],
    ['Bodega de Bolsillo', 100000000, 570, 'Un cuarto entero que cabe en la palma de la mano.'],
    ['Almacén Dimensional', 250000000, 670, 'La carga viaja por otra dimensión y te alcanza en la Báscula.'],
    ['Bodega Agujero Negro', 500000000, 780, 'Todo cabe. Sacarlo era otra historia, pero la Báscula ya aprendió.'],
    ['Arca', 1000000000, 900, 'Cabe una veta madre con todo y sus alrededores.'],
    ['Bodega Sin Fin', 2500000000, 1050, 'El letrero dice «cupo limitado». Nadie ha encontrado el límite.'],
    ['Bodega Sin Fin, ampliada', 6000000000, 1250, 'Le encontraron el límite. Lo movieron más lejos.'],
    ['Costal de Materia Oscura', 15000000000, 1500, 'La carga se guarda donde nadie la ve. La Báscula sí la encuentra, descuida.'],
    ['Bodega Horizonte', 40000000000, 1800, 'Lo que entraba ya no salía. La Báscula ya aprendió a sacarlo.'],
    ['Bodega de Ayer', 100000000000, 2150, 'Guardas hoy en el espacio que te sobró ayer.'],
    ['Baúl de Cuerdas', 250000000000, 2550, 'Dobla el espacio once veces. En cada doblez cabe una veta.'],
    ['Bodega Nebulosa', 600000000000, 3000, 'Del tamaño de una nube de estrellas, plegada con paciencia.'],
    ['Almacén del Vacío', 1500000000000, 3600, 'Todo ese espacio que hay entre los átomos, por fin aprovechado.'],
    ['Bodega Galáctica', 4000000000000, 4300, 'Aquí cabría el pueblo entero, con todo y Gasolinera.'],
    ['Arca del Big Bang', 10000000000000, 5100, 'En esto venía empacado el universo.'],
    ['Bodega «Échale»', 25000000000000, 6000, 'Seis mil espacios. Tú échale; ya veremos cómo lo subes.'],
  ] },
];

/* ── Los 6 objetos ── */
const OBJ = [
  { n: 'Tanque de reserva', ic: '🛢️', p: 2000, k: 'R', ef: '+25 litros. Se usa cuando sea.', h: 'Un respiro embotellado. No se abre solo: acuérdate de él.' },
  { n: 'Nanobots reparadores', ic: '🤖', p: 7500, k: 'N', ef: '+30 de vida. Se usan cuando sea.', h: 'Un enjambre que suelda el casco desde adentro mientras sigues trabajando.' },
  { n: 'Dinamita', ic: '🧨', p: 2000, k: 'D', ef: 'Destruye 3 × 3 celdas a tu alrededor. Se usa donde sea: también volando.', h: 'Abre paso donde el taladro no entra. También borra lo valioso: mira antes de prender.' },
  { n: 'Explosivo plástico', ic: '💣', p: 5000, k: 'P', ef: 'Destruye 5 × 5 celdas a tu alrededor. Se usa donde sea.', h: 'Lo mismo, pero sin sutilezas.' },
  { n: 'Teletransportador cuántico', ic: '🌀', p: 2000, k: 'Q', ef: 'Te lleva a la superficie; puede lanzarte por el aire.', h: 'Barato y brusco. Llegas, pero no siempre de pie.' },
  { n: 'Transmisor de materia', ic: '🛸', p: 10000, k: 'T', ef: 'Te lleva a la superficie sin riesgo.', h: 'Caro y elegante. Apareces junto a la gasolinera sin un rasguño.' },
];

const CORTO = ['Reserva', 'Nanobots', 'Dinamita', 'Plástico', 'Cuántico', 'Transmisor'];

const EDIF = [
  { id: 'pin', x: 33, n: 'La Pinturería', h: 'Pinta y personaliza tu maquinita', col: '#ff7ac8', tinta: '#2a1a14' },
  { id: 'gas', x: 40, n: 'Gasolinera', h: 'Rellena tu combustible', col: '#e0483a', tinta: '#fff7e6' },
  { id: 'bas', x: 45, n: 'La Báscula', h: 'Vende tu mineral', col: '#ffd23f', tinta: '#2a1a14' },
  { id: 'tal', x: 50, n: 'El Taller', h: 'Mejora tu maquinita', col: '#6ec3ff', tinta: '#12222e' },
  { id: 'alm', x: 55, n: 'El Almacén', h: 'Repara y compra objetos', col: '#6fdc7a', tinta: '#12261c' },
  { id: 'rem', x: 60, n: 'Remineralizadora', h: 'Vuelve a llenar de mineral el mundo', col: '#c05cff', tinta: '#1e0d2e' },
  { id: 'ele', x: 65, n: 'El Elevador', h: 'Baja a donde ya llegaste', col: '#ff9f40', tinta: '#2a1a14' },
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
  { m: 1000, de: 'El fondo de la Corteza', x: 'Aquí terminaba el mapa. Debajo se oye agua: sigue bajando.' },
  { m: 1100, de: 'Doña Chela, la Compañía', x: '¿Agua? ¿Allá abajo? No te lo creo. Tráeme una perla y te creo.', q: 1000000 },
  { m: 2000, de: 'Maquinita 22 · «El Güero»', x: '…¿hola? ¡Sigo vivo! Quedé atrapado en las Cavernas. Si bajas a los tres mil, busca la gruta que brilla.' },
  { m: 3100, de: 'Doña Chela, la Compañía', x: 'La Gruta de Cristal… mi abuelo juraba que existía. Llévate lo que puedas cargar.', q: 10000000 },
  { m: 4000, de: 'Señal sin identificar', x: 'Aquí empieza la Cristalera. Más abajo hay muros tallados. Alguien vivió aquí.' },
  { m: 5700, de: 'Doña Chela, la Compañía', x: 'Una ciudad entera bajo tierra. Y nosotros creyendo que éramos los primeros.', q: 50000000 },
  { m: 8000, de: 'Maquinita 9', x: 'La presión… el casco cruje. Pero lo vi: late. Hay algo que late allá abajo.', q: 100000000 },
  { m: 9900, de: 'El Corazón de la Tierra', x: 'Llegaste. Late despacio, como si te hubiera estado esperando.', q: 500000000 },
  { m: 10000, de: 'El fondo del mundo', x: 'Diez kilómetros. Debajo ya no hay roca. Pero fíjate en lo que quedó detrás de la que quitaste: quítenla toda.', q: 1000000000 },
];

// Lo que pasa al volar hacia arriba: mensajes y bonos por altura.
const ALTURAS = [
  { m: 1000,    de: 'Doña Chela, la Compañía', x: '¿A dónde vas? La mina está para abajo… aunque la vista ha de estar bonita. Toma, para el combustible.', q: 500 },
  { m: 3000,    de: 'Doña Chela, la Compañía', x: 'Tres mil metros. Desde ahí la Gasolinera ha de verse como un botón.', q: 2000 },
  { m: 12000,   de: 'Torre de control', x: 'Maquinita sin identificar: vuela usted más alto que los aviones. Buen viaje.', q: 10000 },
  { m: 30000,   de: 'Doña Chela, la Compañía', x: 'Ya se te hizo de noche allá arriba, ¿verdad? Dicen que desde ahí se ven todas las estrellas. Me cuentas cuando bajes.', q: 30000 },
  { m: 100000,  de: 'Doña Chela, la Compañía', x: 'Cruzaste la línea del espacio. Nadie de la Compañía había llegado ahí. Eres astronauta.', q: 250000 },
  { m: 400000,  de: 'Estación orbital «Lupita»', x: 'Aquí la estación. Te estamos viendo por la ventana: una maquinita con orugas, en órbita. Nadie nos lo va a creer.', q: 1000000 },
  { m: 650000,  de: 'Doña Chela, la Compañía', x: 'Dicen que donde andas ya está amaneciendo, y aquí apenas va a dar la medianoche. Qué cosa.', q: 2000000 },
  { m: 1000000, de: 'Señal muy lejana', x: 'Mil kilómetros. La Luna llena toda la ventana. Muy pocos llegan hasta aquí.', q: 5000000 },
];
const fmtAlto = (m) => (m < 1000 ? m + ' m' : m < 100000 ? (m / 1000).toFixed(1) + ' km' : Math.round(m / 1000).toLocaleString('es-MX') + ' km');

const RANGOS = [[0, 'Aprendiz'], [100, 'Peón'], [200, 'Barretero'], [300, 'Perforista'], [400, 'Dinamitero'], [500, 'Fogonero'], [600, 'Capataz'], [700, 'Gambusino'], [800, 'Maestro minero'], [1000, 'Leyenda de la Corteza'], [1500, 'Buzo del Acuífero'], [2000, 'Pescador de perlas'], [3000, 'Explorador de las Cavernas'], [4000, 'Cristalero'], [5600, 'Arqueólogo'], [7000, 'Maestro de la Cristalera'], [8000, 'Domador de la presión'], [9000, 'Guardián del Corazón'], [10000, 'Leyenda de las Profundidades']];

const MODELOS = [['#ffd23f', '#b07a00'], ['#ff6b5a', '#a8322a'], ['#6ec3ff', '#2a6fa8'], ['#6fdc7a', '#2f8a3a'], ['#c05cff', '#7426a8'], ['#ff9f40', '#b05e12'], ['#f3e6d8', '#9a8774'], ['#ff7ac8', '#a8327a']];

const MODOS = {
  paseo:   { comb: 0, caida: 0, lava: 0, gas: 0, verGas: 1, pierde: 0, rescates: -1, pleitos: 0 },
  clasico: { comb: 1, caida: 1, lava: 1, gas: 1, verGas: 2, pierde: 2, rescates: 3, pleitos: 1 },
  rudo:    { comb: 1, caida: 2, lava: 2, gas: 2, verGas: 0, pierde: 3, rescates: 0, pleitos: 1 },
};
const MULT = [0, 1, 1.5];

/* ── Estado ── */
let S = null;                  // lo que se guarda de mi maquinita
let cfg = { ...MODOS.clasico, modo: 'clasico', nombre: '', puerta: 0, reminTodos: 1, regalos: 1 };
let seed = 1, remin = 0, SEM = 1, soyCreador = false, miI = -1, mundoId = '', miK = '', miModelo = 0, miNombre = '';
const dug = new Uint8Array(W * H / 8), mapa = new Uint8Array(W * H).fill(255);
// ── El terreno de un mundo se fabrica UNA sola vez, al nacer, y se guarda completo (en el mundo y en este equipo).
//    Desde entonces el juego lo lee tal cual: aunque el generador cambie con los años, un mundo ya creado no se mueve.
//    Formato: «MN», versión del formato, versión del generador; una celda por byte (9 = piedra con geoda); y la celda
//    donde está cada uno de los 99 objetos de la colección. Ojo: los minerales y hallazgos se identifican por su número
//    (10 + índice, 40 + índice): a esas listas solo se les puede agregar al final, nunca insertar ni reordenar.
const GEN = 3, NB = W * H, MAPA_BYTES = 4 + NB + NCOL * 4;
const base = new Uint8Array(NB), geodas = new Uint8Array(NB / 8);
let mapaHash = '', mapaDe = '', mapaOk = -1, mundoGen = GEN, mapaTurno = 0, mapaEspera = null, pediRemin = false;
function huellaMapa(u) {
  let a = 0x811c9dc5, b = 0x9e3779b9;
  for (let i = 0; i < u.length; i++) { const v = u[i]; a = Math.imul(a ^ v, 16777619); b = Math.imul(b + v, 0x85ebca6b) ^ (b >>> 13); }
  return (a >>> 0).toString(16).padStart(8, '0') + (b >>> 0).toString(16).padStart(8, '0');
}
// Dos franjas con sentido, de orilla a orilla, para que se note por dónde vas sin que nadie lo diga.
// · 3,333 m: tres de ónix, tres de topacio, tres de jade (los tres de las Cavernas), y así toda la fila; arriba y abajo,
//   una piedra entre cada grupo.
// · 6,666 m: una trenza de amatista, tanzanita y alejandrita (las tres de la Cristalera) que sube y baja, con piedras en
//   los huecos de la trenza.
// Se ponen siempre igual, también en los mundos que nacieron antes de que existieran. Lo ya cavado no se toca.
function franjas() {
  const pon = (x, y, t) => { const i = y * W + x; if (base[i] === 5) return; base[i] = t; geodas[i >> 3] &= ~(1 << (i & 7)); };
  for (let x = 0; x < W; x++) {
    const k = x % 12, hueco = k % 4 === 3;
    pon(x, 1665, hueco ? 2 : 1); pon(x, 1666, hueco ? 1 : 10 + [13, 14, 15][k >> 2]); pon(x, 1667, hueco ? 2 : 1);
    const z = x % 4, gema = 10 + [16, 17, 18][x % 3];
    pon(x, 3332, z === 1 ? gema : z === 3 ? 2 : 1); pon(x, 3333, z % 2 === 0 ? gema : 1); pon(x, 3334, z === 3 ? gema : z === 1 ? 2 : 1);
    for (const y of [1663, 1664, 1668, 1669, 3330, 3331, 3335, 3336]) pon(x, y, 1);      // dos filas de pura tierra arriba y abajo: así la franja resalta
  }
}
function empacar() {
  const u = new Uint8Array(MAPA_BYTES), d = new DataView(u.buffer); u[0] = 77; u[1] = 78; u[2] = 1; u[3] = mundoGen;
  for (let i = 0; i < NB; i++) u[4 + i] = base[i] === 2 && (geodas[i >> 3] & (1 << (i & 7))) ? 9 : base[i];
  for (const [pos, id] of colec) d.setUint32(4 + NB + id * 4, pos, true);
  return u;
}
function desempacar(u) {
  if (!u || u.length !== MAPA_BYTES || u[0] !== 77 || u[1] !== 78) return false;
  mundoGen = u[3]; geodas.fill(0); colec.clear();
  for (let i = 0; i < NB; i++) { const t = u[4 + i]; if (t === 9) { base[i] = 2; geodas[i >> 3] |= 1 << (i & 7); } else base[i] = t; }
  const d = new DataView(u.buffer, u.byteOffset + 4 + NB); for (let id = 0; id < NCOL; id++) colec.set(d.getUint32(id * 4, true), id);
  franjas(); mapa.fill(255); bloques.clear(); return true;
}
// El terreno también se guarda en este equipo, por su huella: la siguiente vez abre sin pedir nada, incluso sin internet.
async function leerMapaLocal(h) { try { const c = await caches.open('mina-mapas'), r = await c.match('/mapa-local/' + h); return r ? new Uint8Array(await r.arrayBuffer()) : null; } catch { return null; } }
async function guardarMapaLocal(h, u) {
  try { const c = await caches.open('mina-mapas'); await c.put('/mapa-local/' + h, new Response(u, { headers: { 'content-type': 'application/octet-stream' } })); const ks = await c.keys(); for (const k of ks.slice(0, Math.max(0, ks.length - 8))) c.delete(k); } catch {}
}
async function traerMapa(m) {
  let u = await leerMapaLocal(m.h); if (u && u.length === MAPA_BYTES) return u;
  try {
    const r = await fetch((soloVer ? '/api/mapa/ver/' + verFicha : '/api/mapa/' + mundoId) + '?r=' + m.r + '&h=' + m.h); if (!r.ok) return null;
    u = new Uint8Array(await r.arrayBuffer()); if (u.length !== MAPA_BYTES || huellaMapa(u) !== m.h) return null;
    guardarMapaLocal(m.h, u); return u;
  } catch { return null; }
}
// Antes de entrar a un mundo se consigue su terreno. Lo que llegue mientras tanto espera su turno.
async function conMapa(d, sigue) {
  const turno = ++mapaTurno;
  if (d.mapa && d.mapa.h !== mapaHash) { mapaEspera = mapaEspera || []; d.blob = await traerMapa(d.mapa); if (turno !== mapaTurno) return; }
  sigue(d);
  const q = mapaEspera; mapaEspera = null; if (q) for (const x of q) recibir(x);
}
// El terreno que toca usar al entrar: el guardado si llegó; el que ya está cargado si es el mismo; y solo si el mundo todavía
// no tiene el suyo (mundos de antes, o recién remineralizado) se fabrica aquí.
function ponerTerreno(d) {
  if (d.blob && desempacar(d.blob)) { mapaHash = d.mapa.h; mapaDe = seed + '|' + remin; }
  else if (!(mapaHash && mapaDe === seed + '|' + remin)) terrenoProcedural();
  if (d.mapa) mapaOk = remin;
}
function subirMapa() {
  if (soloVer || !ws || ws.readyState !== 1) return;
  const b = empacar(), u = new Uint8Array(b.length + 5); u[0] = 4; new DataView(u.buffer).setUint32(1, remin, true); u.set(b, 5); ws.send(u);
}
async function cambiarMapa(m) {              // el mundo fijó un terreno distinto del que fabricó este equipo: manda el del mundo
  const turno = ++mapaTurno, u = await traerMapa(m);
  if (turno !== mapaTurno || !u || m.r !== remin || !desempacar(u)) return;
  mapaHash = m.h; mapaDe = seed + '|' + remin; dugCambios++; if (!corriendo && listo) dibujar();
}
const otros = new Map();       // las demás maquinitas
const yo = { x: INICIO_X, y: INICIO_Y, vx: 0, vy: 0, dir: 1, suelo: false, vuela: false, perf: null };
const teclas = {};
let menu = null, pausa = false, listo = false, corriendo = false, conectado = false, sucio = false;
let parts = [], senales = [], temblor = 0, tiempo = 0, cuentaFin = 0;
let op = leer('mina_op', {});
op = { vol: 0.7, temblor: 1, part: 2, texto: 1, contraste: 0, dalton: 0, nombres: 1, zoom: 1, fps: 0, mudo: 0, ...op };
op.son = { musica: 1, taladro: 1, helice: 1, motor: 0, tesoro: 1, peligro: 1, avisos: 1, otros: 1, ambiente: 1, ...(op.son || {}) };
if ((op.sv | 0) < 2) { op.son.motor = 0; op.son.taladro = op.son.helice = 1; op.sv = 2; }      // el motor quedó aparte y apagado; taladro y hélice, cada uno con su interruptor
if (![0, 30, 60].includes(op.fps)) op.fps = 0;

function leer(k, def) { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } }
function escribir(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

function nuevoEstado() {
  return {
    d: 20, eq: [0, 0, 0, 0, 0, 0], carga: Array(MIN.length).fill(0), obj: [0, 0, 0, 0, 0, 0],
    fuel: 3, vida: 10, x: INICIO_X, y: INICIO_Y, rec: 0, tot: 0, msj: 0, rango: 0, resc: 0, reminGratis: 1, mejor: -1, alt: 0, msjA: 0, v: 0, mu: '', seg: 0,
    st: { viajes: 0, cavadas: 0, rec: Array(MIN.length).fill(0), vend: Array(MIN.length).fill(0), hall: Array(HALL.length).fill(0), muertes: 0, expl: 0, remin: 0, comb: 0, mejorViaje: 0, gruas: 0, amigos: 0 },
    log: [], fl: {}, vj: { dano: 0 }, con: { tut: 0, act: [] }, lug: [0, 0, 0, 0], ult: null,
  };
}

// Un estado guardado puede venir viejo o incompleto: se endereza antes de usarlo.
function sanear(e) {
  const b = nuevoEstado(), num = (v, d, min = 0, max = Infinity) => (Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : d);
  const lista = (a, n, max) => Array.from({ length: n }, (_, i) => Math.floor(num(a && a[i], 0, 0, max)));
  const s = { ...b, ...(e && typeof e === 'object' ? e : {}) };
  s.eq = lista(s.eq, 6, 99).map((e, i) => Math.min(e, PZ[i].niv.length - 1)); s.carga = lista(s.carga, MIN.length, 9999); s.obj = lista(s.obj, 6, 9999);
  s.d = num(s.d, 20); s.tot = num(s.tot, 0); s.rec = Math.floor(num(s.rec, 0, 0, H * 2));
  s.msj = Math.floor(num(s.msj, 0, 0, MSJ.length)); s.rango = Math.floor(num(s.rango, 0, 0, RANGOS.length - 1));
  s.resc = Math.floor(num(s.resc, 0)); s.mejor = Math.floor(num(s.mejor, -1, -1, MIN.length - 1)); s.reminGratis = s.reminGratis ? 1 : 0;
  s.seg = num(s.seg, 0, 0, 4e9);              // segundos jugados en toda la vida de la maquinita
  s.x = num(s.x, INICIO_X, HW, W - HW); s.y = num(s.y, INICIO_Y, TECHO, H);
  s.alt = Math.floor(num(s.alt, 0, 0, -TECHO * 2)); s.msjA = ALTURAS.filter((x) => x.m <= s.alt).length; s.v = Math.floor(num(s.v, 0)); s.mu = typeof s.mu === 'string' ? s.mu : '';
  s.st = { ...b.st, ...(s.st && typeof s.st === 'object' ? s.st : {}) };
  s.st.rec = lista(s.st.rec, MIN.length, 1e9); s.st.vend = lista(s.st.vend, MIN.length, 1e9); s.st.hall = lista(s.st.hall, HALL.length, 1e9);
  s.lug = lista(s.lug, LUGARES.length, 1); s.ult = s.ult && Number.isFinite(s.ult.x) && Number.isFinite(s.ult.y) && typeof s.ult.mu === 'string' ? { x: s.ult.x, y: s.ult.y, mu: s.ult.mu, r: s.ult.r | 0 } : null;
  for (const k of ['viajes', 'cavadas', 'muertes', 'expl', 'remin', 'comb', 'mejorViaje', 'gruas', 'amigos', 'traidos', 'col']) s.st[k] = num(s.st[k], 0);
  s.log = Array.isArray(s.log) ? s.log.filter((x) => typeof x === 'string') : [];
  s.fl = s.fl && typeof s.fl === 'object' ? s.fl : {}; s.vj = s.vj && typeof s.vj === 'object' ? s.vj : { dano: 0 };
  const c = s.con && typeof s.con === 'object' ? s.con : {};
  s.con = { tut: Math.floor(num(c.tut, 0, 0, TUTORIAL.length)), act: (Array.isArray(c.act) ? c.act : []).filter((k) => k && typeof k.tp === 'string' && typeof k.tx === 'string' && Number.isFinite(k.pg)).slice(0, 3) };
  const tq = PZ[3].niv[s.eq[3]][2], vm = PZ[1].niv[s.eq[1]][2], bd = PZ[5].niv[s.eq[5]][2];
  s.fuel = num(s.fuel, 3, 0, tq); s.vida = num(s.vida, vm, 1, vm);
  let sobra = s.carga.reduce((a, x) => a + x, 0) - bd;
  for (let i = 0; i < MIN.length && sobra > 0; i++) { const q = Math.min(sobra, s.carga[i]); s.carga[i] -= q; sobra -= q; }
  return s;
}

/* ── Lo que da cada pieza ── */
const nv = (p) => PZ[p].niv[S.eq[p]][2];
const pot = () => nv(0), vidaMax = () => nv(1), hp = () => nv(2), tanque = () => nv(3), rad = () => nv(4) / 100, bodega = () => nv(5);
const brio = () => { const c = hp(); return Math.min(c - 150, 60) + 2.5 * Math.sqrt(Math.max(0, c - 210)); };     // lo que el motor aporta a la velocidad
const nCarga = () => S.carga.reduce((a, b) => a + b, 0);
const valorCarga = () => S.carga.reduce((a, b, i) => a + b * MIN[i].v, 0);
const kgCarga = () => S.carga.reduce((a, b, i) => a + b * MIN[i].kg, 0);
const prof = () => Math.max(0, Math.round((yo.y + HH) * 2));
const altura = () => Math.max(0, Math.round(-(yo.y + HH) * 2));     // metros sobre el suelo
const donde = (y) => (y < -1.5 ? '↑ ' + fmtAlto(Math.round(-(y + HH) * 2)) : Math.max(0, Math.round((y + HH) * 2)).toLocaleString('es-MX') + ' m');

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);
// Solo toca el DOM si el contenido cambió: así un clic nunca cae sobre un elemento recién reemplazado.
function poner(el, h) { if (el._h !== h) { el._h = h; el.innerHTML = h; } }

function fmt(n) {
  n = Math.floor(n);
  if (!Number.isFinite(n)) return '$0';
  if (n < 1e6) return '$' + n.toLocaleString('es-MX');
  if (n < 1e12) return '$' + (n / 1e6).toLocaleString('es-MX', { maximumFractionDigits: n < 1e8 ? 2 : n < 1e9 ? 1 : 0 }) + ' M';
  const u = [[1e24, 'ad'], [1e21, 'ac'], [1e18, 'ab'], [1e15, 'aa'], [1e12, 'T']];
  for (const [v, s] of u) if (n >= v) return '$' + (n / v).toFixed(2).replace(/\.?0+$/, '') + ' ' + s;
}

/* ════════ El generador: fabrica el terreno de un mundo nuevo a partir de su semilla ════════ RLR */
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
    const m = (y + 1) * 2, hondo = m > 1000, piso = hondo ? Math.max(0.004, 0.2 - (m - 1000) / 4500) : 0.2;
    // cada mineral sube hasta su profundidad «común» y después se va apagando para dejarle lugar a los más valiosos
    p = MIN.map((mi, i) => PESO_MIN[i] * rampa(m, mi.a, mi.c) * ((i < 8 || hondo) && m > mi.c ? Math.max(piso, 1 - (m - mi.c) / (i < 8 ? 450 : 1600)) : 1));
    const t = p.reduce((a, b) => a + b, 0);
    let ac = 0; p = p.map((v) => (ac += v / t));
    pesosFila.set(y, p);
  }
  for (let i = 0; i < MIN.length; i++) if (r < p[i]) return i;
  return 0;
}
function mejorMineral(y) { const m = (y + 1) * 2; let b = 0; for (let i = 0; i < MIN.length; i++) if (MIN[i].a <= m) b = i; return b; }
function veta(b) { return [3 + Math.floor(azar(b, 0, 11) * (W - 6)), Math.min(H - 3, b * 75 + 8 + Math.floor(azar(b, 1, 12) * 60))]; }

// Tipos: 0 hueco · 1 tierra · 2 piedra · 3 lava · 4 gas · 5 firme · 6 agua · 7 ladrillo antiguo · 10-39 mineral · 40-49 hallazgo · 50 objeto de la colección
const ondula = (x, y, k) => 0.1 * Math.sin(x * 0.41 + k) * Math.sin(y * 0.53 + k * 1.7) + 0.06 * Math.sin(x * 0.93 + y * 0.71 + k);
const elip = (x, y, cx, cy, rx, ry, k) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ondula(x, y, k);
// En qué lugar está una celda (-1 si en ninguno). Con «orilla» también cuenta la pared que lo envuelve.
function lugarDe(x, y, orilla) {
  if (y < AGUA0) { for (const R of RINCONES) if (R.cy < AGUA0 && y >= R.cy - R.ry * 1.25 - 1 && y <= R.cy + R.ry * 1.25 + 1) return enRincon(R, x, y, orilla) ? R.i : -1; return -1; }
  if (y < AGUA1) return 0;
  if (y > 1470 && y < 1520) return elip(x, y, 48, 1495, 38, 19, 1) < (orilla ? 1.4 : 1) ? 1 : -1;
  if (y >= 2790 && y <= 2826) return x >= 10 && x <= 86 ? 2 : -1;
  if (y > 4880 && y < 4950) return elip(x, y, 48, 4915, 34, 24, 3) < (orilla ? 1.45 : 1) ? 3 : -1;
  for (const R of RINCONES) if (y >= R.cy - R.ry * 1.25 - 1 && y <= R.cy + R.ry * 1.25 + 1) return enRincon(R, x, y, orilla) ? R.i : -1;
  return -1;
}
const cauce = (R, x) => R.cy + Math.round(2 * Math.sin(x * 0.15));
function enRincon(R, x, y, orilla) {
  if (R.t === 'rio') return x > 1 && x < W - 2 && Math.abs(y - cauce(R, x)) <= (orilla ? 2 : 1);
  if (R.t === 'fosil' || R.t === 'boveda') return Math.abs(x - R.cx) <= R.rx && Math.abs(y - R.cy) <= R.ry;
  return elip(x, y, R.cx, R.cy, R.rx, R.ry, R.i) < (orilla ? 1.35 : 1);
}
const pisoR = (R, x) => R.cy + R.ry * Math.sqrt(Math.max(0, 1 - ((x - R.cx) / R.rx) ** 2));       // más o menos dónde queda el piso de un rincón
// Lo que hay en cada celda de un rincón; -1 = la tierra de siempre.
function genRincon(R, x, y) {
  const t = R.t, dx = x - R.cx, dy = y - R.cy;
  if (t === 'rio') { if (x <= 1 || x >= W - 2) return -1; const c = cauce(R, x); return Math.abs(y - c) <= 1 ? 6 : y === c + 2 && azar(x, y, 51) < 0.12 ? 44 : -1; }
  if (t === 'fosil') {
    if (dx >= 8 && dx <= 10 && Math.abs(dy) <= 1) return dx === 9 && dy === 0 ? 42 : 40;      // el cráneo
    if (dy === 0 && dx >= -10 && dx < 8) return 40;                                            // el espinazo y la cola
    return dy > 0 && dy <= 3 - (Math.abs(dx - 1) > 3 ? 1 : 0) && dx >= -4 && dx <= 6 && dx % 2 === 0 ? 40 : -1;      // las costillas
  }
  if (t === 'boveda') { const ax = Math.abs(dx), ay = Math.abs(dy); if (ax > 11 || ay > 4) return -1; if (ax === 11 || ay === 4) return 7; return dx % 2 === 0 && dy % 2 === 0 ? 41 : 0; }
  const d = elip(x, y, R.cx, R.cy, R.rx, R.ry, R.i);
  if (d >= 1.35) return -1;
  if (d >= 1) return azar(x, y, 52) < 0.45 ? 10 + mejorMineral(y) : -1;                        // paredes ricas en lo mejor de la zona
  const piso = elip(x, y + 1, R.cx, R.cy, R.rx, R.ry, R.i) >= 1, r = azar(x, y, 53);
  if (t === 'termas') return y > R.cy ? 6 : 0;
  if (t === 'lava') return y > R.cy + 1 ? (((x % 7) + 7) % 7 === 3 ? 1 : 3) : y === R.cy + 1 && ((x % 7) + 7) % 7 === 3 ? 43 : 0;      // pilares con una reliquia encima
  if (t === 'jardin') { const gx = x >> 1; return azar(gx, 5, 54) < 0.3 && y > pisoR(R, x) - 2 - azar(gx, 6, 54) * 6 ? 10 + mejorMineral(y) : 0; }
  if (piso) { const p = { camp: [0.28, 41], hongos: [0.14, 43], cemen: [0.3, 41], guard: [0.25, 43], nido: [0.35, 47] }[t]; if (p && r < p[0]) return p[1]; }
  return 0;
}
const PRECIOSOS = [3, 3, 4, 7, 7, 8, 8, 9, 9, 13, 13, 14, 14, 15];      // lo que forra la Gruta: oro, platino, rubí, diamante, amazonita, ónix, topacio y jade
// Lo que hay en cada celda de un lugar; -1 = «aquí la tierra es la de siempre».
function genLugar(x, y) {
  if (y < AGUA0) { for (const R of RINCONES) if (R.cy < AGUA0 && y >= R.cy - R.ry * 1.25 - 1 && y <= R.cy + R.ry * 1.25 + 1) return genRincon(R, x, y); return -1; }
  if (y < AGUA1) {                                   // El Acuífero: un lago con columnas de roca; en el lecho, perlas
    const d = elip(x, y, 48, 572, 41, 23, 2);
    if (d < 1) {
      const gx = x >> 2, lecho = 572 + 23 * Math.sqrt(Math.max(0, 1 - ((x - 48) / 41) ** 2));
      return azar(gx, 7, 23) < 0.28 && y > lecho - 3 - azar(gx, 8, 23) * 15 ? -1 : 6;
    }
    if (d < 1.22 && y > 572) { const r = azar(x, y, 24); if (r < 0.2) return 44; if (r < 0.5) return r < 0.32 ? 22 : 20; }
    return -1;
  }
  if (y > 1470 && y < 1520) {                        // La Gruta de Cristal: hueca, con estalactitas de cristal y paredes de metales preciosos
    const d = elip(x, y, 48, 1495, 38, 19, 1);
    if (d >= 1.4) return -1;
    const joya = () => 10 + PRECIOSOS[Math.floor(azar(x, y, 27) * PRECIOSOS.length)];
    if (d >= 1) return azar(x, y, 26) < 0.82 ? joya() : 1;
    const gx = x >> 1, r = azar(gx, 3, 25), alto = 19 * Math.sqrt(Math.max(0, 1 - ((x - 48) / 38) ** 2)), l = 2 + azar(gx, 4, 25) * 8;
    return r < 0.1 ? (y < 1495 - alto + l ? joya() : 0) : r < 0.2 ? (y > 1495 + alto - l ? joya() : 0) : 0;
  }
  if (y >= 2790 && y <= 2826 && x >= 10 && x <= 86) {    // La Ciudad Perdida: casas de ladrillo con tesoros y una pirámide al centro
    const s = 2826 - y, a = Math.abs(x - 48);
    if (s === 0) return 7;
    if (a <= 9) {
      if (s > 18 || a > (18 - s) / 2) return 0;
      if (a <= 1 && s <= 3) return a === 0 && s === 1 ? 45 : 0;          // la cámara del ídolo
      return (a === 4 || a === 6) && s === 2 ? 41 : 7;
    }
    const b = Math.floor((x - 10) / 9), lx = (x - 10) % 9, alto = 4 * (1 + Math.floor(azar(b, 1, 31) * 4));
    if ((b >= 3 && b <= 5) || b > 7 || lx < 1 || lx > 7 || s > alto) return 0;
    if (s % 4 === 0) return lx === 4 && s < alto ? 0 : 7;                // losas, con un hueco para subir
    if (lx === 1 || lx === 7) return lx === 7 && s <= 2 ? 0 : 7;         // muros, con su puerta
    return s % 4 === 1 && (lx === 2 || lx === 6) && azar(x, y, 32) < 0.75 ? 40 + [1, 3, 2, 1][Math.floor(azar(x, y, 33) * 4)] : 0;
  }
  if (y > 4880 && y < 4950) {                        // El Corazón de la Tierra: una geoda de la veta madre con el corazón al centro
    const d = elip(x, y, 48, 4915, 34, 24, 3);
    if (d >= 1.45) return -1;
    if (d >= 1) return azar(x, y, 28) < 0.9 ? 29 + Math.floor(azar(x, y, 29) * 3) : 1;
    const h = Math.hypot(x - 48, y - 4915);
    return h < 0.5 ? 46 : h < 2.4 ? 31 : 0;
  }
  for (const R of RINCONES) if (y >= R.cy - R.ry * 1.25 - 1 && y <= R.cy + R.ry * 1.25 + 1) return genRincon(R, x, y);
  return -1;
}
function gen(x, y) {
  if (x < 0 || x >= W || y >= H) return 5;
  if (y < 0) return 0;
  if (y < 2 && x >= ZX0 && x <= ZX1) return 5;
  const m = (y + 1) * 2, agua = y >= AGUA0 && y < AGUA1;
  if (y >= 165) { const t = genLugar(x, y); if (t >= 0) return t; }
  const [vx, vy] = veta(Math.floor(y / 75));
  if (Math.abs(x - vx) <= 1 && Math.abs(y - vy) <= 1) return 10 + mejorMineral(vy);
  const r = azar(x, y, 1);
  if (r < 0.0016) { const h = azar(x, y, 2); return 40 + (h < 0.5 ? 0 : h < 0.8 ? 1 : h < 0.95 ? 2 : 3); }       // tesoros enterrados
  if (y < 1) return 1;
  if (r < 0.05) return agua ? 6 : 0;
  let p = 0.19;
  if (r < p) return 10 + mineralEn(y, azar(x, y, 3));
  if (m >= 210) { p += m > 1000 ? 0.11 : 0.02 + 0.13 * (m - 210) / 790; if (r < p) return 2; }      // piedra: hasta 15 % al fondo de la Corteza; más abajo, 11 %
  if (agua) return 1;                                // en el Acuífero no hay lava ni gas
  if (m >= 410) { p += m > 1000 ? 0.03 : 0.01 + 0.04 * (m - 410) / 590; if (r < p) return 3; }       // lava: hasta 5 % al fondo de la Corteza; más abajo, 3 %
  if (m >= 650) { p += m > 1000 ? 0.035 : 0.01 + 0.05 * Math.min(1, Math.max(0, m - 680) / 280); if (r < p) return 4; }     // gas: de 1 % a 6 % en la Corteza (eran hasta 45 %); más abajo, 3.5 %
  return 1;
}
const vacia = (y) => (y >= AGUA0 && y < AGUA1 ? 6 : 0);       // lo que queda al cavar: aire, o agua en el Acuífero
function celda(x, y) {
  if (y >= H) return 5;
  if (y < 0) return 0;
  if (x < 0) x += W; else if (x >= W) x -= W;      // el mundo da la vuelta: la columna que sigue a la última es la primera
  if (x < 0 || x >= W) return 5;
  const i = y * W + x;
  let t = mapa[i];
  if (t === 255) {
    if (dug[i >> 3] & (1 << (i & 7))) t = vacia(y);
    else { const co = colec.get(i); t = co !== undefined && !hallados[co] ? 50 : base[i]; }      // un objeto de la colección que nadie ha encontrado, o lo que el terreno guardado dice
    mapa[i] = t;
  }
  return t;
}
const hueca = (x, y) => { const t = celda(x, y); return t === 0 || t === 6; };
function ponerCavada(i) {
  dugCambios++; dug[i >> 3] |= 1 << (i & 7);
  const x = i % W, y = (i - x) / W; mapa[i] = vacia(y);
  // se repinta el bloque de la celda y los de sus cuatro vecinas, que cambian de sombra
  ensuciar(x, y); ensuciar((x + W - 1) % W, y); ensuciar((x + 1) % W, y); if (y > 0) ensuciar(x, y - 1); if (y < H - 1) ensuciar(x, y + 1);
}
function cavar(lista) {            // marca aquí y avisa al mundo
  const c = [];
  for (let [x, y] of lista) {
    if (x < 0) x += W; else if (x >= W) x -= W;
    if (x < 0 || x >= W || y < 0 || y >= H) continue;
    const t = celda(x, y);
    if (t === 0 || t === 5 || t === 6) continue;
    if (lista.length > 1 && (t === 50 || t === 46)) continue;       // las explosiones no destruyen la colección ni el Corazón
    ponerCavada(y * W + x); c.push(y * W + x);
  }
  if (c.length) { if (conectado) enviar({ t: 'cava', c }); else pendientes.push(...c); }
  return c;
}
let pendientes = [];                // celdas cavadas mientras no había conexión
const recientes = new Map();        // premios recién dados, por si el mundo dice que otro llegó antes
function nuevaSemilla() { SEM = (seed + remin * 104729) | 0; mapa.fill(255); pesosFila.clear(); litos.fill(255); bloques.clear(); }
// Fabricar el terreno completo con el generador de esta versión. Solo pasa cuando nace un mundo, cuando se remineraliza,
// o la primera vez que se abre un mundo de antes de que el terreno se guardara.
function terrenoProcedural() {
  // dónde quedó cada objeto de la colección: tres por franja, a distintas alturas y en distintas columnas, fuera de los lugares
  colec.clear();
  for (let id = 0; id < NCOL; id++) {
    const k = Math.floor(id / 3), j = id % 3; let x = 3 + Math.floor(azar(id, 2, 42) * (W - 6)), y = 10 + k * FRANJA + Math.floor((j + 0.15 + 0.7 * azar(id, 1, 41)) * FRANJA / 3);
    if (y >= AGUA0 && y < AGUA1) y += AGUA1 - AGUA0;                      // ninguno dentro del agua
    const cavada = () => { const i = y * W + x; return !hallados[id] && (dug[i >> 3] & (1 << (i & 7))); };       // si ahí ya pasó un túnel, se recorre: ninguno queda imposible
    for (let n = 0; n < 80 && (lugarDe(x, y, true) >= 0 || colec.has(y * W + x) || cavada()); n++) { y++; x = 3 + (x + 7) % (W - 6); }
    colec.set(y * W + x, id);
  }
  geodas.fill(0);
  for (let y = 0, i = 0; y < H; y++) for (let x = 0; x < W; x++, i++) { const t = gen(x, y); base[i] = t; if (t === 2 && azar(x, y, 61) < 0.07) geodas[i >> 3] |= 1 << (i & 7); }
  franjas(); mundoGen = GEN; mapa.fill(255); bloques.clear();
  const u = empacar(); mapaHash = huellaMapa(u); mapaDe = seed + '|' + remin; guardarMapaLocal(mapaHash, u);
}

/* ════════ Sonido ════════ RLR */
// Todo se sintetiza aquí, sin descargar un solo archivo. Cada tipo de sonido tiene su propio canal y su
// interruptor en la bocina de arriba a la derecha. El motor viene apagado: es un fondo continuo y cansa.
const TIPOS = [['musica', 'Música', 0.6], ['taladro', 'Taladro', 0.9], ['helice', 'Hélice', 0.8], ['motor', 'Motor', 0.7], ['tesoro', 'Minerales y dinero', 1], ['peligro', 'Golpes, explosiones y daño', 1], ['avisos', 'Avisos y logros', 0.9], ['otros', 'Lo que hacen los demás', 0.7], ['ambiente', 'Viento y cueva', 0.7]];
const MOJADO = { musica: 0.55, tesoro: 0.16, avisos: 0.14, peligro: 0.1, ambiente: 0.25, otros: 0.2 };     // cuánto de cada canal pasa por el eco
let AC = null, maestro = null, ruidoBuf = null, eco = null;
const bus = {}, lazo = {};
function audio() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return AC; }
  try { AC = new (window.AudioContext || window.webkitAudioContext)(); montar(); volumenes(); } catch { AC = null; }
  return AC;
}
function montar() {            // canales, eco y sonidos continuos sobre el contexto AC
  const comp = AC.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(AC.destination);
  maestro = AC.createGain(); maestro.gain.value = 0; maestro.connect(comp);
  // eco de cueva: una respuesta fabricada (ruido que se apaga y se oscurece) le da aire a la música y a las campanas
  const sr = AC.sampleRate, n = Math.floor(sr * 2.6), ir = AC.createBuffer(2, n, sr);
  for (let c = 0; c < 2; c++) { const a = ir.getChannelData(c); let lp = 0; for (let i = 0; i < n; i++) { const k = i / n; lp += (Math.random() * 2 - 1 - lp) * (0.5 - 0.42 * k); a[i] = lp * Math.pow(1 - k, 2.4) * Math.min(1, i / (sr * 0.012)); } }
  eco = AC.createConvolver(); eco.buffer = ir; const ge = AC.createGain(); ge.gain.value = 0.8; eco.connect(ge).connect(maestro);
  for (const [id] of TIPOS) { bus[id] = AC.createGain(); bus[id].gain.value = 0; bus[id].connect(maestro); if (MOJADO[id]) { const s = AC.createGain(); s.gain.value = MOJADO[id]; bus[id].connect(s).connect(eco); } }
  ruidoBuf = AC.createBuffer(1, sr * 2, sr);
  const a = ruidoBuf.getChannelData(0); for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1;
  armarLazos();
}
function volumenes() {
  pintarBocina();
  if (!AC) return;
  const t = AC.currentTime;
  maestro.gain.setTargetAtTime(op.mudo ? 0 : op.vol, t, 0.05);
  for (const [id, , niv] of TIPOS) bus[id].gain.setTargetAtTime(op.son[id] ? niv : 0, t, 0.05);
}
// ── voces básicas
function tono(f, d = 0.08, tipo = 'square', v = 0.05, f2 = 0, cuando = 0, b = 'avisos') {
  if (!AC || op.mudo || !op.son[b]) return;
  const t = AC.currentTime + cuando, o = AC.createOscillator(), g = AC.createGain();
  o.type = tipo; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g).connect(bus[b]); o.start(t); o.stop(t + d + 0.03);
}
function ruido(d = 0.3, v = 0.25, b = 'peligro', fc = 0, tipoF = 'lowpass', q = 0.7, cuando = 0, f2 = 0) {
  if (!AC || op.mudo || !op.son[b]) return;
  const t = AC.currentTime + cuando, s = AC.createBufferSource(), g = AC.createGain();
  s.buffer = ruidoBuf; s.loop = true;
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  if (fc) { const f = AC.createBiquadFilter(); f.type = tipoF; f.frequency.setValueAtTime(fc, t); if (f2) f.frequency.exponentialRampToValueAtTime(f2, t + d); f.Q.value = q; s.connect(f).connect(g); } else s.connect(g);
  g.connect(bus[b]); s.start(t, Math.random()); s.stop(t + d + 0.03);
}
// campana: tres parciales que se apagan; sirve para minerales y logros
function campana(f, d = 0.5, v = 0.08, b = 'tesoro', cuando = 0) {
  tono(f, d, 'sine', v, 0, cuando, b); tono(f * 2.01, d * 0.6, 'sine', v * 0.35, 0, cuando, b); tono(f * 3.02, d * 0.35, 'sine', v * 0.15, 0, cuando, b);
}
// cuerda pulsada: triángulo con un filtro que se cierra
function cuerda(f, d = 0.5, v = 0.07, b = 'musica', cuando = 0) {
  if (!AC || op.mudo || !op.son[b]) return;
  const t = AC.currentTime + cuando, o = AC.createOscillator(), o2 = AC.createOscillator(), fl = AC.createBiquadFilter(), g = AC.createGain();
  o.type = 'triangle'; o2.type = 'sawtooth'; o.frequency.value = f; o2.frequency.value = f * 1.003;
  fl.type = 'lowpass'; fl.frequency.setValueAtTime(Math.min(6000, f * 7), t); fl.frequency.exponentialRampToValueAtTime(Math.max(200, f * 1.2), t + d * 0.8);
  const g2 = AC.createGain(); g2.gain.value = 0.25;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(fl); o2.connect(g2).connect(fl); fl.connect(g).connect(bus[b]); o.start(t); o2.start(t); o.stop(t + d + 0.03); o2.stop(t + d + 0.03);
}
// colchón: dos ondas suaves apenas desafinadas, entrada y salida lentas
function colchon(f, d = 4, v = 0.03, b = 'musica', cuando = 0) {
  if (!AC || op.mudo || !op.son[b]) return;
  const t = AC.currentTime + cuando, fl = AC.createBiquadFilter(), g = AC.createGain();
  fl.type = 'lowpass'; fl.frequency.value = Math.min(1100, f * 3); fl.Q.value = 0.4;
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + d * 0.4); g.gain.linearRampToValueAtTime(0.0001, t + d);
  for (const des of [-5, 4]) { const o = AC.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = des; o.connect(fl); o.start(t); o.stop(t + d + 0.05); }
  fl.connect(g).connect(bus[b]);
}
// piano de fieltro: golpe suave y una cola larga que se va oscureciendo
function piano(f, d = 3.5, v = 0.06, cuando = 0, b = 'musica') {
  if (!AC || op.mudo || !op.son[b]) return;
  const t = AC.currentTime + cuando, g = AC.createGain(), fl = AC.createBiquadFilter();
  fl.type = 'lowpass'; fl.frequency.setValueAtTime(Math.min(4200, f * 6), t); fl.frequency.exponentialRampToValueAtTime(Math.max(260, f * 1.5), t + d * 0.7);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.014); g.gain.exponentialRampToValueAtTime(v * 0.34, t + 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  for (const [k, a, tipo] of [[1, 1, 'sine'], [2, 0.3, 'sine'], [3, 0.09, 'sine'], [1.002, 0.3, 'triangle']]) { const o = AC.createOscillator(), go = AC.createGain(); o.type = tipo; o.frequency.value = f * k; go.gain.value = a; o.connect(go).connect(fl); o.start(t); o.stop(t + d + 0.05); }
  fl.connect(g).connect(bus[b]);
}
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
const nota = (base, semis) => base * Math.pow(2, semis / 12);
const son = {
  // minerales y dinero
  mineral: (i) => { campana(nota(392, PENTA[i % 10] + (i >= 10 ? 5 : 0)), 0.45, 0.14); ruido(0.06, 0.07, 'tesoro', 2600, 'bandpass', 1); if (i >= 5) for (let k = 0; k < 3; k++) campana(nota(1568, PENTA[(i + k * 2) % 10]), 0.22, 0.03, 'tesoro', 0.07 + k * 0.06); },
  moneda: (n = 0) => campana(1175 + n * 55, 0.09, 0.05),
  venta: () => { ruido(0.12, 0.12, 'tesoro', 3200, 'bandpass', 2); campana(1319, 0.5, 0.09, 'tesoro', 0.05); campana(1976, 0.7, 0.08, 'tesoro', 0.16); },
  compra: () => { for (let k = 0; k < 4; k++) ruido(0.035, 0.12, 'tesoro', 1800 + k * 250, 'bandpass', 3, k * 0.06); [523, 659, 784].forEach((f, k) => campana(f, 0.4, 0.08, 'tesoro', 0.28 + k * 0.08)); },
  combustible: () => { for (let k = 0; k < 5; k++) tono(150 - k * 12, 0.12, 'sine', 0.12, 80, k * 0.11, 'tesoro'); ruido(0.6, 0.05, 'tesoro', 500, 'lowpass', 1); },
  // avisos y logros
  logro: () => { [523, 659, 784, 1047].forEach((f, k) => campana(f, 0.5, 0.08, 'avisos', k * 0.09)); campana(2093, 0.9, 0.035, 'avisos', 0.4); },
  rango: () => { for (const f of [262, 330, 392]) cuerda(f, 0.9, 0.09, 'avisos'); tono(98, 0.5, 'sine', 0.2, 60, 0, 'avisos'); [523, 659, 784, 1047, 1319].forEach((f, k) => campana(f, 0.6, 0.06, 'avisos', 0.25 + k * 0.08)); },
  contrato: () => { tono(140, 0.12, 'sine', 0.2, 70, 0, 'avisos'); campana(784, 0.3, 0.08, 'avisos', 0.1); campana(1047, 0.5, 0.08, 'avisos', 0.22); },
  radio: () => { ruido(0.22, 0.07, 'avisos', 2200, 'bandpass', 2.5); tono(880, 0.07, 'square', 0.035, 0, 0.2, 'avisos'); tono(1175, 0.09, 'square', 0.035, 0, 0.29, 'avisos'); },
  descubre: () => { tono(330, 0.35, 'sine', 0.06, 990, 0, 'avisos'); campana(1319, 0.8, 0.08, 'avisos', 0.3); },
  no: () => tono(130, 0.07, 'square', 0.05),
  alarma: () => { tono(990, 0.09, 'square', 0.05); tono(990, 0.09, 'square', 0.05, 0, 0.16); },
  bip: () => tono(1480, 0.05, 'sine', 0.08),
  clic: () => ruido(0.035, 0.3, 'avisos', 2400, 'bandpass', 2),
  tele: () => { tono(180, 0.5, 'sine', 0.1, 1900, 0, 'avisos'); ruido(0.5, 0.06, 'avisos', 600, 'bandpass', 1, 0, 5000); campana(1760, 0.5, 0.05, 'avisos', 0.45); },
  grua: () => { for (let k = 0; k < 9; k++) ruido(0.07, 0.11, 'avisos', 220, 'bandpass', 1.2, k * 0.085); tono(300, 0.8, 'sawtooth', 0.03, 900, 0, 'avisos'); },
  remin: () => { ruido(2.4, 0.3, 'peligro', 140, 'lowpass', 0.8); tono(48, 2.2, 'sine', 0.25, 34, 0, 'peligro'); for (let k = 0; k < 10; k++) campana(nota(523, PENTA[k]), 0.5, 0.05, 'avisos', 0.6 + k * 0.14); },
  espacio: () => { for (const [f, k] of [[131, 0], [196, 0.3], [294, 0.6], [440, 0.9]]) colchon(f, 5, 0.05, 'avisos', k); campana(1760, 2, 0.04, 'avisos', 1.5); },
  // golpes, explosiones y daño
  dano: () => { tono(170, 0.24, 'sawtooth', 0.3, 55, 0, 'peligro'); ruido(0.14, 0.4, 'peligro', 900, 'lowpass', 1); },
  boom: (v = 1, b = 'peligro') => { ruido(0.9, 0.5 * v, b, 900, 'lowpass', 0.6, 0, 90); tono(95, 0.55, 'sine', 0.3 * v, 28, 0, b); ruido(0.5, 0.12 * v, b, 2500, 'bandpass', 0.8, 0.12); },
  gas: () => { ruido(0.25, 0.2, 'peligro', 5000, 'highpass', 0.7); son.boom(0.9); },
  huele: () => ruido(0.55, 0.06, 'peligro', 5200, 'highpass', 0.7),
  lava: () => { ruido(0.9, 0.22, 'peligro', 3500, 'bandpass', 0.9, 0, 1200); tono(120, 0.3, 'sine', 0.12, 60, 0, 'peligro'); },
  golpe: () => { tono(95, 0.14, 'sine', 0.2, 45, 0, 'peligro'); ruido(0.08, 0.1, 'peligro', 500, 'lowpass', 1); },
  // taladro: el mordisco con que arranca cada celda y el rebote contra la piedra
  muerde: (duro) => { ruido(0.09, 0.2, 'taladro', duro ? 1900 : 800, 'bandpass', 0.9, 0, duro ? 900 : 260); tono(duro ? 120 : 84, 0.08, 'sine', 0.14, 46, 0, 'taladro'); },
  choque: () => { campana(2400, 0.25, 0.14, 'peligro'); campana(3300, 0.18, 0.08, 'peligro', 0.02); ruido(0.12, 0.3, 'peligro', 4200, 'bandpass', 2); tono(140, 0.12, 'sine', 0.2, 60, 0, 'peligro'); },
  piedra: () => { campana(1900, 0.12, 0.1, 'taladro'); ruido(0.05, 0.25, 'taladro', 3000, 'bandpass', 3); },
  // los demás
  entra: () => { cuerda(659, 0.3, 0.07, 'otros'); cuerda(880, 0.45, 0.07, 'otros', 0.12); },
  foto: () => { ruido(0.05, 0.3, 'avisos', 3500, 'bandpass', 2); tono(2600, 0.05, 'square', 0.04, 0, 0.06, 'avisos'); },
  pleito: (v = 1) => { tono(110, 0.5, 'sawtooth', 0.12 * v, 55, 0, 'peligro'); campana(880, 0.6, 0.1 * v, 'avisos', 0.05); campana(1175, 0.8, 0.1 * v, 'avisos', 0.25); ruido(0.3, 0.12 * v, 'peligro', 3000, 'bandpass', 1.4, 0.1); },
  chat: () => { campana(1175, 0.16, 0.03, 'otros'); campana(1568, 0.24, 0.025, 'otros', 0.07); },
  senal: () => { campana(1568, 0.7, 0.07, 'otros'); campana(1568, 0.5, 0.025, 'otros', 0.28); },
};

// ── sonidos continuos: se arman una vez y después solo se les mueve el volumen y el tono, cuadro por cuadro
function armarLazos() {
  const fuente = () => { const s = AC.createBufferSource(); s.buffer = ruidoBuf; s.loop = true; s.start(0, Math.random()); return s; };
  const salida = (b) => { const g = AC.createGain(); g.gain.value = 0; g.connect(bus[b]); return g; };
  const gan = (v) => { const g = AC.createGain(); g.gain.value = v; return g; };
  const osc = (tipo, hz) => { const o = AC.createOscillator(); o.type = tipo; o.frequency.value = hz; o.start(); return o; };
  const filtro = (tipo, hz, q = 0.7) => { const f = AC.createBiquadFilter(); f.type = tipo; f.frequency.value = hz; f.Q.value = q; return f; };
  const vaiven = (hz, hondo, destino, tipo = 'sine') => { const l = osc(tipo, hz), a = gan(hondo); l.connect(a).connect(destino.gain); return l; };   // un oscilador lento que mece el volumen, sin cortes bruscos
  // taladro: tierra que se muele (grano que vibra y un fondo grave) y el zumbido de la broca
  { const g = salida('taladro'), grano = gan(0.6), fG = filtro('bandpass', 520, 1.1), fondo = gan(0.85), o1 = osc('sawtooth', 100), o2 = osc('sawtooth', 100.7), fO = filtro('lowpass', 600, 1.4), gO = gan(0.085);
    fuente().connect(fG).connect(filtro('lowpass', 1150, 0.5)).connect(grano).connect(g); const l1 = vaiven(27, 0.28, grano); vaiven(6.1, 0.16, grano);
    fuente().connect(filtro('lowpass', 170)).connect(fondo).connect(g);
    o1.connect(fO); o2.connect(fO); fO.connect(gO).connect(g);
    lazo.taladro = { g, fG, o1, o2, l1 }; }
  // hélice: el aire que corta cada aspa y el zumbido del rotor
  { const g = salida('helice'), aire = gan(0.5), fA = filtro('lowpass', 750, 0.5), z = osc('triangle', 80), fZ = filtro('lowpass', 280), gZ = gan(0.1);
    fuente().connect(fA).connect(aire).connect(g); const l = vaiven(20, 0.4, aire), l2 = vaiven(40, 0.1, aire);
    z.connect(fZ).connect(gZ).connect(g);
    lazo.helice = { g, fA, l, l2, z }; }
  // motor: explosiones lentas y graves, con el soplido del escape
  { const g = salida('motor'), o = osc('sawtooth', 30), o2 = osc('triangle', 15), f = filtro('lowpass', 180, 1.2), cuerpo = gan(0.5), esc = gan(0.22);
    o.connect(f); o2.connect(f); f.connect(cuerpo).connect(g);
    fuente().connect(filtro('bandpass', 140, 1.4)).connect(esc).connect(g); const l = vaiven(30, 0.2, esc, 'sawtooth');
    lazo.motor = { g, o, o2, l }; }
  // viento
  { const f = filtro('lowpass', 500, 0.5), g = salida('ambiente'); fuente().connect(f).connect(g); lazo.viento = { g, f }; }
  // ráfaga: el aire ya silba y viene por rachas
  { const f = filtro('bandpass', 1100, 0.8), g = salida('ambiente'), m = gan(0.8); fuente().connect(f).connect(m).connect(g); vaiven(0.7, 0.2, m); lazo.rafaga = { g, f }; }
  // rugido: a toda velocidad el aire truena en grave y sisea en agudo
  { const g = salida('ambiente'), grave = gan(5), agudo = gan(0.05); fuente().connect(filtro('lowpass', 210)).connect(grave).connect(g); fuente().connect(filtro('highpass', 3200)).connect(agudo).connect(g); vaiven(11, 1.2, grave); lazo.rugido = { g }; }
  // cueva: un aire hondo que respira
  { const g = salida('ambiente'), t = gan(0.6), f = filtro('lowpass', 210, 0.6); fuente().connect(f).connect(t).connect(g); vaiven(0.11, 0.3, t); const o = osc('sine', 55), go = gan(0.35); o.connect(go).connect(t); lazo.cueva = { g }; }
}
function sonarLazos(quieto) {
  if (!AC || !lazo.motor) return;
  const t = AC.currentTime;
  const pon = (p, v, c = 0.03) => { if (p._v === undefined || Math.abs(p._v - v) > Math.abs(v) * 0.01 + 1e-5) { p._v = v; p.setTargetAtTime(v, t, c); } };
  if (quieto || !S) { for (const k in lazo) pon(lazo[k].g.gain, 0, 0.04); return; }
  const alto = Math.max(0, -(yo.y + HH)), km = alto / 500, vel = Math.abs(yo.vx), cae = Math.max(0, yo.vy), sube = Math.max(0, -yo.vy), p = yo.perf, v = yo.vuela, niv = Math.min(8, S.eq[0]);
  // taladro: suena exactamente mientras perfora; el tono sube mientras muerde cada celda y se aclara contra el mineral
  pon(lazo.taladro.g.gain, p ? 0.145 : 0, p ? 0.012 : 0.035);
  if (p) { const e = Math.min(1, p.t / p.dur), duro = (p.tipo >= 10 && p.tipo < 40) || p.tipo === 2, f = (92 + niv * 8) * (0.88 + 0.3 * e) * (duro ? 1.12 : 1); pon(lazo.taladro.o1.frequency, f, 0.02); pon(lazo.taladro.o2.frequency, f * 1.007, 0.02); pon(lazo.taladro.fG.frequency, 420 + 260 * e + (duro ? 520 : 0), 0.03); pon(lazo.taladro.l1.frequency, 23 + niv * 2 + 6 * e); }
  // hélice: prende con la tecla y, al soltarla, el rotor se va frenando
  const pl = yo.planea, aspas = v ? 20 + Math.min(9, sube * 0.6) : pl ? 30 + Math.min(14, cae * 0.2) : 12;      // al planear giran los rotorcitos: más agudos y más bajito
  pon(lazo.helice.g.gain, v ? 0.17 : pl ? 0.08 : 0, v ? 0.02 : 0.1);
  pon(lazo.helice.l.frequency, aspas, v ? 0.05 : 0.15); pon(lazo.helice.l2.frequency, aspas * 2, v ? 0.05 : 0.15); pon(lazo.helice.z.frequency, aspas * 4, v ? 0.05 : 0.15); pon(lazo.helice.fA.frequency, v ? 650 + Math.min(650, sube * 40) : 1150, 0.1);
  // motor: las vueltas siguen a lo que le pides
  const vueltas = 30 + vel * 3.2 + (p ? 9 : 0) + (v ? 7 : 0);
  pon(lazo.motor.g.gain, 0.045 + Math.min(0.02, vel * 0.004)); pon(lazo.motor.o.frequency, vueltas, 0.08); pon(lazo.motor.o2.frequency, vueltas / 2, 0.08); pon(lazo.motor.l.frequency, vueltas, 0.08);
  // El viento: brisa, ráfaga y rugido se van relevando según la velocidad. En el espacio no hay aire: se cae en silencio.
  const rapidez = cae + sube, den = yo.y < 1 ? Math.max(0, 1 - km / 90) : yo.suelo ? 0 : 0.5;
  pon(lazo.viento.g.gain, den * (0.03 + 0.1 * tope(rapidez / 40) + Math.min(0.03, alto / 60000)) * (1 - 0.6 * suave(60, 200, rapidez)), 0.2); pon(lazo.viento.f.frequency, 380 + Math.min(900, rapidez * 10), 0.1);
  pon(lazo.rafaga.g.gain, den * 0.15 * suave(25, 90, rapidez) * (1 - 0.5 * suave(250, 600, rapidez)), 0.2); pon(lazo.rafaga.f.frequency, 800 + Math.min(1700, rapidez * 4), 0.1);
  pon(lazo.rugido.g.gain, den * 0.3 * suave(150, 500, rapidez), 0.25);
  pon(lazo.cueva.g.gain, yo.y > 2 ? 0.022 + Math.min(0.02, yo.y / 20000) : 0, 0.5);
}
// una gota que cae en algún lugar de la cueva, de vez en cuando
let tGota = 0;
function gotear(d) { if (yo.y > 6 && (tGota -= d) < 0) { tGota = 5 + Math.random() * 9; const f = 1300 + Math.random() * 900; tono(f, 0.09, 'sine', 0.022, f * 0.55, 0, 'ambiente'); tono(f * 1.5, 0.12, 'sine', 0.012, f * 0.9, 0.07, 'ambiente'); } }

// ── música: un piano suave que improvisa despacio sobre cuatro acordes, con mucho aire y silencios largos.
// Nunca repite la misma tonada: cada acorde elige una frase al azar entre varias, y a veces no toca nada.
const ZONAS = {     // raíz en Hz, segundos por tiempo, octava de la melodía, probabilidad de que un acorde quede en silencio, acordes en semitonos sobre la raíz
  superficie: { raiz: 146.83, paso: 0.8, oct: 2, calla: 0.2, cola: 3.2, ac: [[0, 4, 7, 14], [-3, 0, 4, 7], [5, 9, 12, 16], [7, 12, 14, 19]] },
  mina:       { raiz: 110, paso: 0.92, oct: 2, bajo: 1, calla: 0.25, cola: 3.8, ac: [[0, 3, 7, 14], [-4, 0, 3, 7], [3, 7, 10, 17], [-2, 2, 5, 10]] },
  fondo:      { raiz: 82.41, paso: 1.2, oct: 2, bajo: 1, calla: 0.4, cola: 5, ac: [[0, 3, 7, 14], [-4, 0, 3, 7], [5, 8, 12, 15], [7, 10, 14, 17]] },
  cielo:      { raiz: 196, paso: 0.95, oct: 2, calla: 0.25, cola: 4, ac: [[0, 4, 7, 11], [2, 6, 9, 14], [-3, 0, 4, 7], [5, 9, 12, 16]] },
  jardin:     { raiz: 196, paso: 0.72, oct: 2, calla: 0.08, cola: 3.6, ac: [[0, 4, 7, 12], [5, 9, 12, 16], [-3, 0, 4, 9], [7, 11, 14, 19]] },      // con el jardín completo, la música se abre en mayor
  espacio:    { raiz: 130.81, paso: 1.5, oct: 2, calla: 0.35, cola: 7, ac: [[0, 4, 7, 14], [-3, 0, 4, 11], [5, 9, 12, 16], [7, 11, 14, 16]] },
};
// cada frase: [tiempo dentro del acorde (0 a 8), cuál nota del acorde, octava de más]
const FRASES = [
  [[0, 2, 0], [1.5, 3, 0], [3, 1, 0], [5, 2, 0]],
  [[1, 0, 1], [2, 1, 0], [2.5, 2, 0], [4.5, 3, 0]],
  [[0.5, 3, 0], [2, 2, 0], [4, 1, 0], [6, 0, 0], [7, 1, 0]],
  [[0, 0, 0], [0.5, 1, 0], [1, 2, 0], [1.5, 3, 0], [4, 2, 0]],
  [[2, 2, 0], [6, 3, 0]],
  [[1, 1, 1], [3, 0, 1], [3.5, 1, 1], [6, 2, 0]],
  [[0, 3, 0], [3, 2, 0], [4, 3, 0], [5, 0, 1]],
  [[4, 1, 0], [5, 2, 0], [6, 3, 0], [7, 2, 0]],
];
const musica = { t: 0, n: 0, quedan: 0, z: '', ult: -1, acs: [] };
// El acorde que está sonando en este momento (o el primero de la zona, si la música está callada).
function acordeAhora() {
  const a = AC ? AC.currentTime : 0; let m = null;
  for (const c of musica.acs) if (c.t <= a + 0.05 && a - c.t < 12) m = c;
  if (m) return m;
  const z = ZONAS[zonaMusical()]; return { ac: z.ac[0], base: z.raiz * z.oct };
}
function zonaMusical() { const km = Math.max(0, -(yo.y + HH)) / 500; return km > 40 ? 'espacio' : km > 0.4 ? 'cielo' : yo.y < 2 ? 'superficie' : yo.y < 325 ? 'mina' : edenVivo && yo.y > EDEN0 - 6 ? 'jardin' : 'fondo'; }
function componer(adelante = 0.8) {           // se llama varias veces por segundo y deja programado el acorde que sigue
  if (!AC || !S || op.mudo || !op.son.musica || (document.hidden && adelante < 1)) { musica.t = 0; return; }
  const ahora = AC.currentTime;
  if (musica.t < ahora) musica.t = ahora + 0.4;
  while (musica.t < ahora + adelante) {
    const zn = zonaMusical();
    if (zn !== musica.z) { musica.z = zn; musica.n = 0; musica.quedan = 10 + Math.floor(Math.random() * 6); }
    else if (musica.quedan <= 0) { musica.quedan = 10 + Math.floor(Math.random() * 6); musica.n = 0; musica.t += 16 + Math.random() * 18; continue; }     // la pieza termina y deja un rato solo la cueva
    const z = ZONAS[zn], ac = z.ac[musica.n % z.ac.length], c = musica.t - ahora, ultimo = musica.quedan === 1;
    musica.acs.push({ t: musica.t, ac, base: z.raiz * z.oct }); if (musica.acs.length > 3) musica.acs.shift();
    piano(nota(z.raiz * (z.bajo || 0.5), ac[0]), z.cola * 1.7, 0.06, c);                                     // bajo
    for (let k = 1; k < 4; k++) colchon(nota(z.raiz, ac[k]), z.paso * 9.5, 0.011, 'musica', c);        // colchón
    let f = Math.floor(Math.random() * FRASES.length); if (f === musica.ult) f = (f + 1) % FRASES.length; musica.ult = f;
    if (ultimo) piano(nota(z.raiz * z.oct, ac[2]), z.cola * 1.4, 0.05, c + z.paso * 2);        // el último acorde se despide con una sola nota
    else if (Math.random() > z.calla) for (const [b, i, o] of FRASES[f]) piano(nota(z.raiz * z.oct * (o ? 2 : 1), ac[i]), z.cola, 0.034 + Math.random() * 0.022, c + b * z.paso + Math.random() * 0.03);
    musica.t += z.paso * 8; musica.n++; musica.quedan--;
  }
}

// ── la bocina: apagar, bajar, subir y elegir qué tipos se oyen
function pintarBocina() {
  const b = $('#bSon'); if (!b) return;
  b.textContent = op.mudo || op.vol === 0 ? '🔇' : op.vol < 0.4 ? '🔉' : '🔊';
  b.title = op.mudo ? 'Encender el sonido' : 'Apagar el sonido';
  $('#bVol').textContent = Math.round(op.vol * 100) + ' %';
  const p = $('#panSon');
  if (p.style.display === 'block') poner(p, (movil ? `<div class="vol"><button class="s" data-v="mudo">${op.mudo ? '🔇 Encender' : '🔊 Apagar'}</button><button class="s" data-v="-">−</button><b>${Math.round(op.vol * 100)} %</b><button class="s" data-v="+">+</button></div>` : '') + TIPOS.map(([id, n]) => `<label><input type="checkbox" data-t="${id}" ${op.son[id] ? 'checked' : ''}> ${n}</label>`).join(''));
}
function sonidoUI() {
  const cambia = (f) => { audio(); f(); escribir('mina_op', op); volumenes(); son.clic(); };
  $('#bSon').onclick = (e) => { e.currentTarget.blur(); if (movil) { const p = $('#panSon'); p.style.display = p.style.display === 'block' ? 'none' : 'block'; p._h = ''; pintarBocina(); } else cambia(() => { op.mudo = op.mudo ? 0 : 1; }); };
  $('#panSon').onclick = (e) => { const v = e.target.dataset.v; if (!v) return; cambia(() => { if (v === 'mudo') op.mudo = op.mudo ? 0 : 1; else { op.vol = Math.max(0, Math.min(1, Math.round((op.vol + (v === '+' ? 0.1 : -0.1)) * 10) / 10)); op.mudo = 0; } }); $('#panSon')._h = ''; pintarBocina(); };
  $('#bMenos').onclick = (e) => { e.currentTarget.blur(); cambia(() => { op.vol = Math.max(0, Math.round((op.vol - 0.1) * 10) / 10); op.mudo = 0; }); };
  $('#bMas').onclick = (e) => { e.currentTarget.blur(); cambia(() => { op.vol = Math.min(1, Math.round((op.vol + 0.1) * 10) / 10); op.mudo = 0; }); };
  $('#bTipos').onclick = (e) => { e.currentTarget.blur(); const p = $('#panSon'); p.style.display = p.style.display === 'block' ? 'none' : 'block'; p._h = ''; pintarBocina(); };
  $('#panSon').onchange = (e) => { const t = e.target.dataset.t; if (t) cambia(() => { op.son[t] = e.target.checked ? 1 : 0; }); };
  pintarBocina();
}

/* ════════ Avisos, tarjetas y celebración ════════ */
function aviso(x) {
  const d = document.createElement('div'); d.textContent = x;
  const c = $('#avisos'); c.appendChild(d);
  while (c.children.length > 6) c.firstChild.remove();
  setTimeout(() => d.remove(), 9000);
}
function tarjeta(t, x, clase = '', ms = 4500, urgente = false, boton = null) {
  const d = document.createElement('div'); if (clase) d.className = clase;
  const h = document.createElement('h3'); h.textContent = t; d.appendChild(h);
  if (x) { const p = document.createElement('p'); p.textContent = x; d.appendChild(p); }
  if (boton) { const b = document.createElement('button'); b.className = 's'; b.textContent = boton.t; b.onclick = (e) => { e.stopPropagation(); audio(); d.remove(); boton.f(); }; d.appendChild(b); }
  if (urgente) { const c = $('#tarjeta'); while (c.children.length >= 3) c.firstChild.remove(); colaTarjetas.unshift([d, ms]); } else colaTarjetas.push([d, ms]);
  sacarTarjeta();
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
let flot = [];
function flota(x, y, txt, col = '#fff') { flot.push({ x, y, txt, col, t: 1.7 }); if (flot.length > 14) flot.shift(); }
function temblar(q) { if (op.temblor) temblor = Math.max(temblor, q); }
let faroCol = '#fff3b0';        // la lámpara de mi maquinita: se pone azul cuando hay grisú al lado
let ondas = [], golpeFx = 0, bichos = [], tBicho = -99, calorFx = 0;
const natural = (x, y) => { if (x < 0 || x >= W || y < 1 || y >= H) return false; const i = y * W + x; return !(dug[i >> 3] & (1 << (i & 7))) && celda(x, y) === 0; };
function soltarBichos(x, y) {
  const k = [0, 0, 0, 0, 1, 1, 2, 3][zonaDe((y + 1) * 2)];           // 0 murciélagos · 1 luciérnagas · 2 mariposas de cristal · 3 brasas
  for (let i = 0; i < (k === 0 ? 7 : 10); i++) bichos.push({ x: x + 0.5 + (Math.random() - 0.5) * 0.6, y: y + 0.5 + (Math.random() - 0.5) * 0.6, vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 2, t: (k === 0 ? 4 : 7) + Math.random() * 2, k, f: Math.random() * 6 });
  tBicho = tiempo;
  if (k === 0) for (let i = 0; i < 4; i++) tono(3000 + Math.random() * 900, 0.045, 'sine', 0.03, 2300, i * 0.07 + Math.random() * 0.03, 'ambiente');
  else campana(k === 3 ? 660 : 1568, 0.6, 0.025, 'ambiente');
}
function onda(x, y, r, col = '#ffe2a8', d = 0.5) { if (op.part) ondas.push({ x, y, r, col, t: 0, d }); }
function humo(x, y, n = 10) {
  if (!op.part) return;
  for (let i = 0; i < n && parts.length < 400; i++) parts.push({ x: x + (Math.random() - 0.5) * 1.4, y: y + (Math.random() - 0.5) * 1.4, vx: (Math.random() - 0.5) * 1.2, vy: -0.5 - Math.random() * 1.2, t: 0.9 + Math.random() * 0.9, col: Math.random() < 0.5 ? '#4a4441' : '#6b6360', g: 2 + (Math.random() * 2 | 0), gr: -0.6 });
}

/* ════════ El Jardín del Fondo ════════ RLR */
// El cierre del mundo. Los últimos 240 m (de 9,760 a 10,000) guardan otra cosa detrás de la roca: cada celda que se quita ahí
// no deja un hueco oscuro, deja ver un pedazo de un jardín pintado, con su cielo de adentro, su sol (el Corazón de la Tierra)
// y un mensaje. Se descubre entre todos, celda por celda. Cuando no queda nada que quitar, el jardín cobra vida.
// El jardín se pinta por código, pieza por pieza; cada bloque del terreno dibuja solo las piezas que le tocan.
const EDEN0 = 4880, EDEN_H = H - EDEN0, EDEN_N = W * EDEN_H, EDEN_SOL = [48.5, 35.5];
let edenE = null, edenFirma = '', edenPct = 0, edenVivo = false, edenT = -9, edenFaltan = [], edenQuedan = EDEN_N;
const edenSuelo = (x) => 91 + 1.6 * Math.sin(x * 0.21 + 1.3) + 1.1 * Math.sin(x * 0.07 + 0.4), edenLago = (x) => 109.6 + 0.9 * Math.sin(x * 0.17 + 2);
const edenGente = () => [{ i: miI, n: miNombre, m: miModelo }, ...[...otros.values()].map((o) => ({ i: o.i, n: o.n, m: o.m }))].filter((j) => j.n).sort((a, b) => a.i - b.i).slice(0, 12);
function armarEden() {
  const E = [], r = azarDe((seed >>> 0) % 233280), R = (a, b) => a + r() * (b - a), de = (l) => l[Math.floor(r() * l.length)];
  const pon = (x0, y0, x1, y1, f) => E.push([x0, y0, x1, y1, f]);
  const bola = (q, x, y, rad) => { q.beginPath(); q.arc(x, y, rad, 0, 7); q.fill(); };
  const brillo = (q, x, y, rad, col) => { const g = q.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(${col},.95)`); g.addColorStop(0.3, `rgba(${col},.45)`); g.addColorStop(1, `rgba(${col},0)`); q.fillStyle = g; q.fillRect(x - rad, y - rad, rad * 2, rad * 2); };
  const [SX, SY] = EDEN_SOL;
  // ── el cielo de adentro: noche arriba, donde cuelgan las raíces; amanecer a la altura del Corazón; día claro hacia abajo
  pon(0, 0, 96, 120, (q) => { const g = q.createLinearGradient(0, 0, 0, 96); [[0, '#120d30'], [0.1, '#2a1b5e'], [0.2, '#6b3a8c'], [0.29, '#e58f6a'], [0.37, '#ffd9a0'], [0.5, '#c4e9f6'], [0.72, '#8fd3f0'], [0.88, '#dcf1f6'], [1, '#dcf1f6']].forEach(([k, c]) => g.addColorStop(k, c)); q.fillStyle = g; q.fillRect(0, 0, 96, 120); });
  pon(SX - 44, SY - 44, SX + 44, SY + 44, (q) => { const g = q.createRadialGradient(SX, SY, 0, SX, SY, 44); g.addColorStop(0, 'rgba(255,250,225,1)'); g.addColorStop(0.09, 'rgba(255,238,180,.95)'); g.addColorStop(0.3, 'rgba(255,214,140,.5)'); g.addColorStop(1, 'rgba(255,214,140,0)'); q.fillStyle = g; q.fillRect(SX - 44, SY - 44, 88, 88); });
  pon(SX - 46, SY - 46, SX + 46, SY + 46, (q) => { q.fillStyle = 'rgba(255,244,205,.075)'; for (let k = 0; k < 18; k++) { const a = k * 0.349 + 0.1, l = 30 + (k % 3) * 8; q.beginPath(); q.moveTo(SX, SY); q.lineTo(SX + Math.cos(a - 0.05) * l, SY + Math.sin(a - 0.05) * l); q.lineTo(SX + Math.cos(a + 0.05) * l, SY + Math.sin(a + 0.05) * l); q.fill(); } });
  // estrellas, arriba
  for (let k = 0; k < 180; k++) { const x = R(0, 96), y = R(0, 26) * R(0.3, 1), t = R(0.05, 0.15), a = (1 - y / 27) * R(0.5, 1), c = r() < 0.25 ? '255,236,170' : '255,255,255'; pon(x - 0.5, y - 0.5, x + 0.5, y + 0.5, (q) => { q.fillStyle = `rgba(${c},${a.toFixed(2)})`; bola(q, x, y, t); if (t > 0.12) { q.fillRect(x - t * 3, y - t * 0.2, t * 6, t * 0.4); q.fillRect(x - t * 0.2, y - t * 3, t * 0.4, t * 6); } }); }
  // las raíces de todo lo de arriba, con una lucecita en cada punta
  for (let k = 0; k < 30; k++) {
    const x0 = 1.5 + k * 3.2 + R(-1, 1), largo = R(4, 16), pts = [[x0, -0.5]]; let x = x0;
    for (let y = 1.2; y < largo; y += 1.2) { x += R(-0.7, 0.7); pts.push([x, y]); }
    const fin = pts[pts.length - 1], col = de(['255,226,140', '255,170,190', '170,235,255', '200,255,170']), xs = pts.map((p) => p[0]);
    pon(Math.min(...xs) - 1.6, -1, Math.max(...xs) + 1.6, largo + 1.6, (q) => {
      q.lineCap = q.lineJoin = 'round';
      for (const [c, d] of [['#2a1a10', 0], ['#6a4526', -0.12]]) { q.strokeStyle = c; for (let i = 1; i < pts.length; i++) { q.lineWidth = Math.max(0.1, (0.75 - 0.6 * i / pts.length) * (d ? 0.45 : 1)); q.beginPath(); q.moveTo(pts[i - 1][0] + d, pts[i - 1][1]); q.lineTo(pts[i][0] + d, pts[i][1]); q.stroke(); } }
      brillo(q, fin[0], fin[1] + 0.2, 1.3, col); q.fillStyle = '#fffbe8'; bola(q, fin[0], fin[1] + 0.2, 0.16);
    });
  }
  // un arcoíris que nace de la cascada
  pon(0, 60, 54, 100, (q) => { q.lineWidth = 0.62; ['255,90,90', '255,160,70', '255,225,90', '120,215,120', '90,180,255', '150,120,240'].forEach((c, k) => { q.strokeStyle = `rgba(${c},.34)`; q.beginPath(); q.arc(22, 99, 32 - k * 0.62, Math.PI, Math.PI * 2); q.stroke(); }); });
  // nubes
  for (let k = 0; k < 17; k++) { const x = R(3, 93), y = R(22, 58), t = R(1.4, 3), n = 4 + Math.floor(r() * 3), ps = Array.from({ length: n }, (_, i) => [x + (i - n / 2) * t * 0.72, y + R(-0.3, 0.3) * t, t * R(0.6, 1)]); if (Math.hypot(x - SX, y - SY) < 9) continue; pon(x - t * 3.5, y - t * 1.6, x + t * 3.5, y + t * 1.6, (q) => { q.fillStyle = y < 38 ? 'rgba(255,214,190,.72)' : 'rgba(255,255,255,.82)'; for (const [a, b, c] of ps) { q.beginPath(); q.ellipse(a, b, c * 1.25, c * 0.7, 0, 0, 7); q.fill(); } q.fillStyle = 'rgba(255,255,255,.5)'; for (const [a, b, c] of ps) { q.beginPath(); q.ellipse(a - c * 0.2, b - c * 0.25, c * 0.7, c * 0.32, 0, 0, 7); q.fill(); } }); }
  // globos de papel que suben con su velita
  for (let k = 0; k < 18; k++) { const x = R(4, 92), y = R(18, 60), t = R(0.5, 0.95), c = de(['#ff9a3d', '#ffb347', '#ff7a59', '#ffd166']); pon(x - 2, y - 2, x + 2, y + 2.4, (q) => { brillo(q, x, y, t * 2.2, '255,190,90'); q.fillStyle = c; q.beginPath(); q.moveTo(x - t * 0.5, y + t * 0.75); q.quadraticCurveTo(x - t * 0.95, y - t * 0.3, x - t * 0.5, y - t * 0.8); q.quadraticCurveTo(x, y - t * 1.1, x + t * 0.5, y - t * 0.8); q.quadraticCurveTo(x + t * 0.95, y - t * 0.3, x + t * 0.5, y + t * 0.75); q.closePath(); q.fill(); q.fillStyle = '#fff4c2'; q.fillRect(x - t * 0.3, y + t * 0.45, t * 0.6, t * 0.3); }); }
  // parvadas
  for (let f = 0; f < 6; f++) { const cx = R(8, 88), cy = R(26, 57), n = 4 + Math.floor(r() * 5), bs = Array.from({ length: n }, (_, i) => [cx + (i - n / 2) * 1.5 + R(-0.4, 0.4), cy + Math.abs(i - n / 2) * 0.7 + R(-0.3, 0.3), R(0.35, 0.6)]); pon(cx - 8, cy - 2, cx + 8, cy + 6, (q) => { q.strokeStyle = 'rgba(40,44,70,.7)'; q.lineWidth = 0.1; q.lineCap = 'round'; for (const [a, b, t] of bs) { q.beginPath(); q.moveTo(a - t, b - t * 0.4); q.quadraticCurveTo(a - t * 0.4, b - t * 0.7, a, b); q.quadraticCurveTo(a + t * 0.4, b - t * 0.7, a + t, b - t * 0.4); q.stroke(); } }); }
  // ── el mensaje
  pon(1, 58, 95, 80, (q) => {
    const F = 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
    q.textAlign = 'center'; q.textBaseline = 'alphabetic'; q.lineJoin = 'round';
    q.font = '900 10.5px ' + F; const k = Math.min(1, 88 / q.measureText('HAY PARA TODOS').width);
    q.save(); q.translate(48, 71.4); q.scale(k, k);
    for (const [a, c] of [[3, 'rgba(255,190,90,.16)'], [2.1, 'rgba(255,180,80,.2)'], [1.4, 'rgba(255,170,70,.28)']]) { q.strokeStyle = c; q.lineWidth = a; q.strokeText('HAY PARA TODOS', 0, 0); }
    q.strokeStyle = '#b5651d'; q.lineWidth = 0.75; q.strokeText('HAY PARA TODOS', 0, 0);
    const g = q.createLinearGradient(0, -8, 0, 0); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe9a8'); q.fillStyle = g; q.fillText('HAY PARA TODOS', 0, 0); q.restore();
    q.font = '800 3.5px ' + F; q.strokeStyle = 'rgba(30,90,130,.85)'; q.lineWidth = 0.42; q.strokeText('Siempre hubo. Todo está bien.', 48, 77.4); q.fillStyle = '#ffffff'; q.fillText('Siempre hubo. Todo está bien.', 48, 77.4);
  });
  // ── la tierra: sierra lejana, sierra cercana con sus cascadas, el valle, los ríos y el lago
  const sierra = (base, alt, f, fase) => { const p = []; for (let x = -1; x <= 97; x += 1.5) p.push([x, base - alt * (0.55 + 0.3 * Math.sin(x * f + fase) + 0.15 * Math.sin(x * f * 2.7 + fase * 2))]); return p; };
  const s1 = sierra(88, 7.5, 0.33, 1), s2 = sierra(92, 6, 0.19, 4);
  pon(0, 78, 96, 96, (q) => { q.fillStyle = '#93addb'; q.beginPath(); q.moveTo(-1, 97); for (const [x, y] of s1) q.lineTo(x, y); q.lineTo(97, 97); q.fill(); q.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 1; i < s1.length - 1; i++) if (s1[i][1] < s1[i - 1][1] && s1[i][1] < s1[i + 1][1]) { const [x, y] = s1[i]; q.beginPath(); q.moveTo(x, y); q.lineTo(x - 1.5, y + 1.5); q.lineTo(x - 0.4, y + 1.1); q.lineTo(x + 0.3, y + 1.7); q.lineTo(x + 1.5, y + 1.4); q.fill(); } });
  pon(0, 84, 96, 100, (q) => { const g = q.createLinearGradient(0, 84, 0, 98); g.addColorStop(0, '#6fb58c'); g.addColorStop(1, '#8fd08a'); q.fillStyle = g; q.beginPath(); q.moveTo(-1, 100); for (const [x, y] of s2) q.lineTo(x, y); q.lineTo(97, 100); q.fill(); });
  pon(0, 88, 96, 120, (q) => { const g = q.createLinearGradient(0, 89, 0, 112); g.addColorStop(0, '#a6e08e'); g.addColorStop(0.5, '#7fcb78'); g.addColorStop(1, '#5fb26a'); q.fillStyle = g; q.beginPath(); q.moveTo(-1, 121); for (let x = -1; x <= 97; x += 1) q.lineTo(x, edenSuelo(x)); q.lineTo(97, 121); q.fill();
    q.fillStyle = 'rgba(255,255,255,.1)'; for (let k = 0; k < 4; k++) { q.beginPath(); q.moveTo(-1, 121); for (let x = -1; x <= 97; x += 1) q.lineTo(x, 96 + k * 3.4 + 1.3 * Math.sin(x * 0.16 + k * 1.9)); q.lineTo(97, 121); q.fill(); } });
  const rios = [[30, 40], [70, 60]], rioX = (k, y) => rios[k][0] + (rios[k][1] - rios[k][0]) * Math.pow(tope((y - 90) / 20), 1.4) + Math.sin(y * 0.55 + k * 2) * 1.1;
  for (let k = 0; k < 2; k++) {
    const x0 = rios[k][0], cima = s2.reduce((a, p) => (Math.abs(p[0] - x0) < Math.abs(a[0] - x0) ? p : a), s2[0]);
    pon(x0 - 2, cima[1] - 1, x0 + 2, 94, (q) => { const g = q.createLinearGradient(0, cima[1], 0, 93); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(160,225,250,.95)'); q.fillStyle = g; q.beginPath(); q.moveTo(x0 - 0.35, cima[1] + 0.6); q.lineTo(x0 + 0.35, cima[1] + 0.6); q.lineTo(x0 + 0.9, 93); q.lineTo(x0 - 0.9, 93); q.fill(); q.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 5; i++) bola(q, x0 + (i - 2) * 0.5, 93.1, 0.5); });
    pon(Math.min(...rios[k]) - 4, 91, Math.max(...rios[k]) + 4, 112, (q) => { q.lineCap = 'round'; for (const [c, a] of [['#57b9de', 1.7], ['#8fdcf5', 0.9]]) { q.strokeStyle = c; q.lineWidth = a; q.beginPath(); for (let y = 92.5; y <= 111; y += 0.6) q.lineTo(rioX(k, y), y); q.stroke(); } });
  }
  pon(0, 107, 96, 120, (q) => { const g = q.createLinearGradient(0, 108, 0, 120); g.addColorStop(0, '#86daf2'); g.addColorStop(1, '#3f97cc'); q.fillStyle = g; q.beginPath(); q.moveTo(-1, 121); for (let x = -1; x <= 97; x += 1) q.lineTo(x, edenLago(x)); q.lineTo(97, 121); q.fill();
    q.fillStyle = 'rgba(255,246,200,.5)'; for (let i = 0; i < 16; i++) { const y = 110.4 + i * 0.6, a = 4.2 - i * 0.2; q.fillRect(48.5 - a / 2 + Math.sin(i * 1.7) * 0.7, y, a, 0.16); } });
  // dónde hay tierra firme para sembrar: ni en el lago ni en los ríos ni bajo el árbol grande
  const lugar = (x, y) => y > edenSuelo(x) + 1.2 && y < edenLago(x) - 0.9 && Math.abs(x - rioX(0, y)) > 1.8 && Math.abs(x - rioX(1, y)) > 1.8 && !(Math.abs(x - 48) < 10.5 && y > 100);
  const sembrar = () => { for (let n = 0; n < 60; n++) { const x = R(1, 95), y = R(92, 109); if (lugar(x, y)) return [x, y]; } return null; };
  // milpas
  for (let k = 0; k < 6; k++) { const p = sembrar(); if (!p) continue; const [x, y] = p; pon(x - 2.4, y - 1.4, x + 2.4, y + 0.6, (q) => { q.lineCap = 'round'; for (let f = 0; f < 3; f++) for (let i = 0; i < 9; i++) { const a = x - 2 + i * 0.5 + f * 0.15, b = y - f * 0.42; q.strokeStyle = '#3f9148'; q.lineWidth = 0.1; q.beginPath(); q.moveTo(a, b); q.lineTo(a, b - 0.6); q.stroke(); q.fillStyle = '#ffd85a'; bola(q, a, b - 0.62, 0.09); } }); }
  // flores, a montones
  const FLOR = ['#ff9a1f', '#ff9a1f', '#ffb52e', '#ff5fa2', '#ffffff', '#b98cff', '#ffe14d', '#ff6b5a'];
  for (let gk = 0; gk < 22; gk++) { const p = sembrar(); if (!p) continue; const fs = []; for (let i = 0; i < 20; i++) { const x = p[0] + R(-2.6, 2.6), y = p[1] + R(-1.1, 1.1); if (lugar(x, y - 0.5) || y > edenSuelo(x) + 0.6 && y < edenLago(x) - 0.3) fs.push([x, y, R(0.09, 0.17), de(FLOR)]); } pon(p[0] - 3, p[1] - 1.5, p[0] + 3, p[1] + 1.5, (q) => { for (const [x, y, t, c] of fs) { q.fillStyle = '#4a9e52'; q.fillRect(x - 0.02, y, 0.04, t * 2); q.fillStyle = c; bola(q, x, y, t); q.fillStyle = 'rgba(255,255,255,.6)'; bola(q, x - t * 0.3, y - t * 0.3, t * 0.35); } }); }
  // casitas con su lumbre
  for (let k = 0; k < 7; k++) { const p = sembrar(); if (!p) continue; const [x, y] = p, s = 0.7 + (y - 92) / 26, c = de(['#f6e7c8', '#ffd7b0', '#fbe3a8', '#f2c6b4']); pon(x - 1.6 * s, y - 3.4 * s, x + 2.2 * s, y + 0.2, (q) => { q.fillStyle = c; q.fillRect(x - 1.1 * s, y - 1.3 * s, 2.2 * s, 1.3 * s); q.fillStyle = '#d9603a'; q.beginPath(); q.moveTo(x - 1.4 * s, y - 1.25 * s); q.lineTo(x, y - 2.3 * s); q.lineTo(x + 1.4 * s, y - 1.25 * s); q.fill(); q.fillStyle = '#8a5a36'; q.fillRect(x - 0.22 * s, y - 0.75 * s, 0.44 * s, 0.75 * s); q.fillStyle = '#ffd76a'; q.fillRect(x + 0.45 * s, y - 0.95 * s, 0.4 * s, 0.4 * s); q.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 3; i++) bola(q, x + 0.7 * s + i * 0.25 * s, y - (2.3 + i * 0.5) * s, (0.2 + i * 0.09) * s); }); }
  // árboles con fruta
  const VERDE = ['#3f9b52', '#56b765', '#2f8546', '#7cc86a'], FRUTA = ['#ff5a4d', '#ffb02e', '#ffe14d', '#ff7ac8', '#ff8a3d'], arboles = [];
  for (let k = 0; k < 95; k++) { const p = sembrar(); if (p) arboles.push(p); }
  arboles.sort((a, b) => a[1] - b[1]);
  for (const [x, y] of arboles) { const s = 0.75 + (y - 92) / 22, f = de(FRUTA), cs = Array.from({ length: 3 }, () => [x + R(-0.55, 0.55) * s, y - (1.25 + R(0, 0.6)) * s, R(0.62, 0.95) * s, de(VERDE)]), fr = Array.from({ length: 6 }, () => [x + R(-0.9, 0.9) * s, y - (1.1 + R(0, 0.9)) * s]); pon(x - 1.7 * s, y - 2.9 * s, x + 1.7 * s, y + 0.2, (q) => { q.fillStyle = 'rgba(0,0,0,.12)'; q.beginPath(); q.ellipse(x, y, 0.9 * s, 0.2 * s, 0, 0, 7); q.fill(); q.fillStyle = '#6b4a2a'; q.fillRect(x - 0.13 * s, y - 1.1 * s, 0.26 * s, 1.1 * s); for (const [a, b, c, d] of cs) { q.fillStyle = d; bola(q, a, b, c); } q.fillStyle = 'rgba(255,255,255,.14)'; bola(q, cs[0][0] - 0.2 * s, cs[0][1] - 0.25 * s, 0.4 * s); q.fillStyle = f; for (const [a, b] of fr) bola(q, a, b, 0.12 * s); }); }
  // el árbol grande, con faroles, y la mesa larga puesta debajo: hay lugar para todos
  { const hojas = Array.from({ length: 22 }, () => [48 + R(-8.5, 8.5), 95.6 + R(-2.6, 2.4), R(2, 3.3), de(VERDE)]).sort((a, b) => a[1] - b[1]), faroles = Array.from({ length: 13 }, (_, i) => [40.4 + i * 1.27, 99.4 + R(0, 1.3), de(['255,200,90', '255,150,170', '170,230,255', '255,235,150'])]);
    pon(37, 90, 59, 107, (q) => {
      q.fillStyle = 'rgba(0,0,0,.14)'; q.beginPath(); q.ellipse(48, 106.4, 9.5, 0.8, 0, 0, 7); q.fill();
      q.fillStyle = '#6b4a2a'; q.beginPath(); q.moveTo(46.3, 106.3); q.quadraticCurveTo(47.4, 102, 46.9, 97); q.lineTo(49.1, 97); q.quadraticCurveTo(48.6, 102, 49.7, 106.3); q.fill();
      q.strokeStyle = '#6b4a2a'; q.lineWidth = 0.5; q.lineCap = 'round'; for (const [a, b] of [[43, 96.5], [53, 96.3], [45.5, 95], [50.8, 94.8]]) { q.beginPath(); q.moveTo(48, 99); q.lineTo(a, b); q.stroke(); }
      for (const [a, b, c, d] of hojas) { q.fillStyle = d; bola(q, a, b, c); }
      q.fillStyle = 'rgba(255,255,255,.1)'; for (const [a, b, c] of hojas) bola(q, a - c * 0.25, b - c * 0.3, c * 0.5);
      for (const [a, b, c] of faroles) { q.strokeStyle = 'rgba(60,40,20,.6)'; q.lineWidth = 0.05; q.beginPath(); q.moveTo(a, 97.5); q.lineTo(a, b); q.stroke(); brillo(q, a, b + 0.25, 0.9, c); q.fillStyle = `rgb(${c})`; q.beginPath(); q.ellipse(a, b + 0.25, 0.2, 0.27, 0, 0, 7); q.fill(); }
    });
    pon(40, 104, 56, 107, (q) => { q.fillStyle = '#7a5230'; for (const x of [41.4, 45.6, 50.4, 54.6]) q.fillRect(x - 0.1, 105.6, 0.2, 0.8); q.fillStyle = '#c08a52'; q.beginPath(); q.roundRect(40.8, 105.1, 14.4, 0.62, 0.2); q.fill(); q.fillStyle = '#e0b07a'; q.fillRect(40.9, 105.1, 14.2, 0.16);
      for (let i = 0; i < 12; i++) { const x = 41.6 + i * 1.16; q.fillStyle = '#ffffff'; q.beginPath(); q.ellipse(x, 105.12, 0.3, 0.1, 0, 0, 7); q.fill(); q.fillStyle = FRUTA[i % 5]; bola(q, x, 105, 0.13); }
      q.fillStyle = '#8a5a36'; q.fillRect(41, 106.25, 14, 0.14); });
  }
  // las piedras con nombre (La Pinturería, nivel 9): a la orilla izquierda del lago, grabadas para siempre
  edenPiedras.slice(0, 12).forEach((nom, k) => { const x = 5 + (k % 6) * 3.6, y = 109.4 - Math.floor(k / 6) * 2.2; pon(x - 1.8, y - 1.3, x + 1.8, y + 0.8, (q) => { q.fillStyle = 'rgba(0,0,0,.12)'; q.beginPath(); q.ellipse(x, y + 0.55, 1.7, 0.25, 0, 0, 7); q.fill(); q.fillStyle = '#9a9590'; q.beginPath(); q.roundRect(x - 1.5, y - 0.9, 3, 1.45, 0.45); q.fill(); q.fillStyle = '#b8b3ad'; q.beginPath(); q.roundRect(x - 1.3, y - 0.8, 2.6, 0.5, 0.3); q.fill(); q.fillStyle = '#2a1a14'; q.font = '800 0.4px system-ui'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(String(nom).slice(0, 12), x, y + 0.05); q.fillStyle = '#ffd23f'; q.font = '0.3px system-ui'; q.fillText('★', x, y - 0.52); }); });
  // las maquinitas de este mundo, descansando junto a la mesa, cada una con su nombre
  if (sinMineral !== remin) { const g = edenGente(), n = g.length, paso = Math.min(1.9, 17 / Math.max(1, n)), x0 = 48 - ((n - 1) * paso) / 2;
    g.forEach((j, k) => { const x = x0 + k * paso, y = 107.6; pon(x - 2.2, y - 1.2, x + 2.2, y + 1.9, (q) => { const m = q.getTransform(); q.save(); q.setTransform(1, 0, 0, 1, 0, 0); dibMaq(q, x * m.a + m.e, y * m.d + m.f, 1.5 * m.a, j.m, k % 2 ? -1 : 1, false, 0, '', '', 0.4, pintaDe(j.i)); q.restore(); q.font = `800 ${n > 6 ? 0.36 : 0.42}px system-ui,sans-serif`; q.textAlign = 'center'; q.textBaseline = 'top'; q.lineJoin = 'round'; q.strokeStyle = 'rgba(20,60,30,.85)'; q.lineWidth = 0.12; const yn = y + 0.72 + (n > 6 && k % 2 ? 0.5 : 0); q.strokeText(j.n, x, yn); q.fillStyle = '#fff'; q.fillText(j.n, x, yn); }); }); }
  // trajineras en el lago
  for (let k = 0; k < 7; k++) { const x = 7 + k * 13.5 + R(-3, 3), y = R(112, 118), c = de(['#ff5a4d', '#ffb02e', '#3fb7a0', '#ff7ac8', '#6a8dff']), c2 = de(['#ffe14d', '#ffffff', '#ff9a1f']); if (Math.abs(x - 48.5) < 4 && y < 114) continue; pon(x - 2.2, y - 2, x + 2.2, y + 1.2, (q) => { q.fillStyle = 'rgba(20,70,110,.25)'; q.beginPath(); q.ellipse(x, y + 0.45, 1.9, 0.25, 0, 0, 7); q.fill(); q.fillStyle = c; q.beginPath(); q.moveTo(x - 1.8, y - 0.15); q.lineTo(x + 1.8, y - 0.15); q.lineTo(x + 1.45, y + 0.35); q.lineTo(x - 1.45, y + 0.35); q.fill(); q.strokeStyle = '#7a5230'; q.lineWidth = 0.08; for (const a of [-1, 1]) { q.beginPath(); q.moveTo(x + a, y - 0.15); q.lineTo(x + a, y - 1.1); q.stroke(); } q.strokeStyle = c2; q.lineWidth = 0.36; q.beginPath(); q.arc(x, y - 1.05, 1.02, Math.PI, Math.PI * 2); q.stroke(); q.fillStyle = c; for (let i = 0; i < 6; i++) bola(q, x + Math.cos(Math.PI + (i + 0.5) * 0.524) * 1.02, y - 1.05 + Math.sin(Math.PI + (i + 0.5) * 0.524) * 1.02, 0.12); }); }
  // peces que brincan
  for (let k = 0; k < 8; k++) { const x = R(4, 92), y = R(112.5, 118.5); pon(x - 1.5, y - 1.6, x + 1.5, y + 0.5, (q) => { q.strokeStyle = 'rgba(255,255,255,.6)'; q.lineWidth = 0.06; for (const a of [0.7, 1.1]) { q.beginPath(); q.ellipse(x, y, a, a * 0.22, 0, 0, 7); q.stroke(); } q.fillStyle = de(['#ff9a3d', '#ffd166', '#ff7a59']); q.save(); q.translate(x + 0.2, y - 0.8); q.rotate(-0.7); q.beginPath(); q.ellipse(0, 0, 0.36, 0.16, 0, 0, 7); q.moveTo(-0.3, 0); q.lineTo(-0.62, -0.2); q.lineTo(-0.62, 0.2); q.fill(); q.restore(); }); }
  // mariposas
  for (let k = 0; k < 30; k++) { const p = sembrar(); if (!p) continue; const x = p[0], y = p[1] - R(0.6, 3), c = de(['#ffffff', '#ffe14d', '#ff9a1f', '#8fd0ff', '#ff7ac8']), a = R(-0.6, 0.6); pon(x - 0.5, y - 0.5, x + 0.5, y + 0.5, (q) => { q.fillStyle = c; q.save(); q.translate(x, y); q.rotate(a); q.beginPath(); q.ellipse(-0.17, 0, 0.17, 0.25, -0.5, 0, 7); q.ellipse(0.17, 0, 0.17, 0.25, 0.5, 0, 7); q.fill(); q.fillStyle = '#3a2a1e'; q.fillRect(-0.025, -0.2, 0.05, 0.4); q.restore(); }); }
  return E;
}
function pintarEden(q, bx, by) {              // el pedazo de jardín que le toca a un bloque (ya recortado a sus celdas abiertas)
  const firma = seed + '|' + (sinMineral === remin ? 'fin' : edenGente().map((j) => j.n + j.m + JSON.stringify(pintaDe(j.i) || '')).join(',')) + '|' + edenPiedras.join(',');
  if (!edenE || firma !== edenFirma) { edenFirma = firma; edenE = armarEden(); }
  const x0 = bx * BL, y0 = by * BL - EDEN0, x1 = x0 + BL, y1 = y0 + BL;
  q.setTransform(T, 0, 0, T, -x0 * T, -y0 * T);
  for (const e of edenE) if (e[0] < x1 && e[2] > x0 && e[1] < y1 && e[3] > y0) { q.save(); e[4](q); q.restore(); }
  q.setTransform(1, 0, 0, 1, 0, 0);
}
// Cuánto del jardín está a la vista: las celdas abiertas entre todas las del fondo.
function medirEden() {
  let n = 0; const f = [];
  for (let y = EDEN0; y < H; y++) for (let x = 0; x < W; x++) { if (hueca(x, y)) n++; else if (f.length < 80) f.push(x, y); }
  edenQuedan = EDEN_N - n; edenFaltan = edenQuedan <= 40 ? f : []; return n / EDEN_N;
}
// Cuando faltan 33 celdas o menos, cada una que no está en pantalla se señala con una flecha en la orilla, con los metros que hay hasta ella.
function flechasEden(ox, oy) {
  if (!edenFaltan.length || edenQuedan > 33) return;
  const w = lienzo.width, h = lienzo.height, mx = ox + vis.x * T, my = oy + vis.y * T, m = T * 0.9;
  g.font = `800 ${Math.max(11 * RES, T * 0.26)}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  for (let i = 0; i < edenFaltan.length; i += 2) {
    const cx = edenFaltan[i] + 0.5, cy = edenFaltan[i + 1] + 0.5, px = ox + cx * T, py = oy + cy * T;
    if (px > -T && px < w + T && py > -T && py < h + T) continue;              // la que se ve ya trae su aro
    const dx = px - mx, dy = py - my, k = Math.min((dx > 0 ? w - m - mx : m - mx) / (dx || 1e-9), (dy > 0 ? h - m - my : m - my) / (dy || 1e-9)), ex = mx + dx * k, ey = my + dy * k, an = Math.atan2(dy, dx);
    g.save(); g.translate(ex, ey); g.rotate(an); g.fillStyle = '#ffd23f'; g.strokeStyle = '#2a1a14'; g.lineWidth = Math.max(2, T * 0.05);
    g.beginPath(); g.moveTo(T * 0.45, 0); g.lineTo(-T * 0.25, -T * 0.3); g.lineTo(-T * 0.1, 0); g.lineTo(-T * 0.25, T * 0.3); g.closePath(); g.fill(); g.stroke(); g.restore();
    const tx = Math.round(Math.hypot(cx - vis.x, cy - vis.y) * 2) + ' m'; g.lineWidth = Math.max(3, T * 0.08); g.strokeStyle = '#000c'; g.strokeText(tx, ex - Math.cos(an) * T * 0.9, ey - Math.sin(an) * T * 0.9); g.fillStyle = '#ffd23f'; g.fillText(tx, ex - Math.cos(an) * T * 0.9, ey - Math.sin(an) * T * 0.9);
  }
}
function jardinDelFondo() {
  const p = medirEden(), clave = mundoId + '|' + remin; edenPct = p; edenVivo = p >= 1;
  if (soloVer || !mundoId) return;
  if (S.fl.edenM !== clave) { S.fl.edenM = clave; S.fl.edenH = 0; }
  if (p < 1 && edenQuedan === 1 && celda(48, 4915) === 46 && S.fl.edenC !== mundoId + '|' + remin) { S.fl.edenC = mundoId + '|' + remin; sucio = true; son.descubre(); tarjeta('❤️ Solo falta el Corazón', 'Todo lo demás ya está a la vista. Párate encima del Corazón y perfóralo hacia abajo: es la unión, y ahí empieza el final.', 'msj', 16000, true); }
  if (p < 1 && edenQuedan <= 33 && !S.fl.edenU) { S.fl.edenU = 1; sucio = true; tarjeta('🎯 Las últimas ' + edenQuedan, 'Las flechas amarillas te llevan a cada una. Estas ya se quitan de cualquier lado, también volando y hacia arriba: empuja contra ellas. El Corazón también cuenta: se quita con el taladro, los explosivos no lo tocan.', 'msj', 14000, true); }
  if (yo.y >= EDEN0 && !S.fl.eden1) { S.fl.eden1 = 1; sucio = true; son.descubre(); tarjeta('🌱 Hay algo detrás de la roca', 'Aquí abajo, cada celda que quitas no deja un hueco: deja ver un pedazo de otra cosa. Quítenla toda, entre todos, y verán qué es.', 'msj', 14000, true); }
  const hito = [[0.95, 'Casi. Las últimas celdas quedan marcadas con un aro amarillo.'], [0.8, 'Falta poco. Lo que queda suele ser roca dura: con taladro bueno o con dinamita.'], [0.6, 'Ya asoman letras. Sigan quitando.'], [0.4, 'Ya se alcanza a ver el cielo de adentro.']].find(([h]) => p >= h);
  if (hito && p < 1 && (S.fl.edenH || 0) < hito[0]) { S.fl.edenH = hito[0]; sucio = true; son.logro(); tarjeta(`🌱 El Jardín del Fondo · ${Math.floor(p * 100)} % a la vista`, hito[1], 'msj', 10000); }
  if (p >= 1 && !(S.fl.edenF && S.fl.edenF[clave]) && !esperaFin) {     // se avisa al mundo; él reparte en partes iguales y le avisa a todos
    esperaFin = true; const total = contarMinerales().total;
    if (conectado) { enviar({ t: 'fin', total }); setTimeout(() => { if (!(S.fl.edenF && S.fl.edenF[clave])) finDelMundo(miI, solo(total)); }, 5000); }
    else finDelMundo(miI, solo(total));
  }
}
// El cierre: ya no queda nada que quitar. El jardín cobra vida y a cada maquinita le toca su parte, porque hay para todos.
// Al quitar la última piedra, todos los minerales que quedaban en el mundo se desprenden y caen hasta la maquinita que lo
// logró: el mundo queda de pura tierra (los tesoros, los huesos y la colección se quedan donde estaban) y ella se queda con
// todo. Para volver a tener mineral hay que remineralizar.
let lluvia = null, sinMineral = -1, esperaFin = false, ceremonia = null;
function contarMinerales() {
  let total = 0, n = 0; const cuenta = new Map();
  for (let i = 0; i < NB; i++) { const t = base[i]; if (t >= 10 && t < 10 + MIN.length && !(dug[i >> 3] & (1 << (i & 7)))) { total += MIN[t - 10].v; n++; cuenta.set(t - 10, (cuenta.get(t - 10) || 0) + 1); } }
  return { total, n, cuenta };
}
function vaciarMinerales() {
  const r = contarMinerales(); sinMineral = remin;
  for (let i = 0; i < NB; i++) { const t = base[i]; if (t >= 10 && t < 10 + MIN.length) base[i] = 1; }
  mapa.fill(255); bloques.clear(); tiles.clear(); edenE = null;
  return r;
}
// ── El final, en tres tiempos:
//    1. La unión (6 s): cada maquinita conectada baja hasta su retrato junto a la mesa y se une con él.
//    2. El torbellino (33 s): todos los minerales que quedaban en el mundo bajan a la vez y se arremolinan, rapidísimo,
//       alrededor de cada maquinita hasta entrar en ella. Se reparten en partes iguales entre todas las maquinitas del
//       mundo; las que no estaban reciben la suya al volver.
//    3. El camino de luz: en fila, una tras otra, bajan al lago y suben por los peldaños de luz que deja el sol en el agua,
//       hasta desaparecer. Con mucha gente la fila se aprieta: nunca tarda más de 10 s en arrancar la última. Después, el
//       jardín entero a pantalla completa, y cada quien vuelve a empezar en la superficie.
const CER = { union: 6, lluvia: 33, sepa: 2.4, baja: 2.6, sube: 4.6 };
const retrato = (k, n) => { const paso = Math.min(1.9, 17 / Math.max(1, n)); return [48 - ((n - 1) * paso) / 2 + k * paso, EDEN0 + 107.6]; };
const PELDANO0 = [48.5, EDEN0 + 119.2], PELDANO1 = [48.5, EDEN0 + 110.5];
// Si el mundo no contesta, el reparto se hace aquí, entre las maquinitas que este equipo conoce.
const solo = (total) => { const n = otros.size + 1; return { r: remin, total, n: Math.max(n, miI + 1), parte: Math.floor(total / n), i: miI }; };
function finDelMundo(quien, fin) {
  const clave = mundoId + '|' + remin, F = S.fl.edenF || (S.fl.edenF = {}), P = S.fl.edenP || (S.fl.edenP = {});
  F[clave] = 1; esperaFin = false;
  const botin = vaciarMinerales(), gente = edenGente();
  const parte = soloVer || miI >= (fin.n || 1) || P[clave] ? 0 : Math.floor(fin.parte || 0); if (parte) P[clave] = 1;
  const regalo = soloVer || F[mundoId] ? 0 : 1e9; if (!soloVer) F[mundoId] = 1; if (regalo) { S.d += regalo; S.tot += regalo; }
  // quiénes participan: las maquinitas conectadas, cada una con su retrato
  const part = gente.map((j, k) => ({ ...j, k, mio: !soloVer && j.i === miI, a: retrato(k, gente.length) })).filter((j) => j.mio || otros.get(j.i)?.on);
  for (const j of part) { const o = j.mio ? yo : otros.get(j.i); j.d = o && o.x !== undefined ? [o.x, o.y] : [j.a[0], j.a[1] - 6]; }
  ceremonia = { t0: performance.now(), part, ids: new Set(part.map((j) => j.i)), sonadas: new Set(), fin: false, sepa: Math.min(CER.sepa, 10 / Math.max(1, part.length - 1)) };
  ceremonia.tFin = CER.union + CER.lluvia + 1 + Math.max(0, part.length - 1) * ceremonia.sepa + CER.baja + CER.sube + 1.5;
  if (botin.n) lluvia = { t0: performance.now() + CER.union * 1000, ult: performance.now(), dur: CER.lluvia, p: [], tipos: [...botin.cuenta.keys()], llegan: 0, sonados: 0, tSon: 0, total: parte, mio: parte > 0, d0: S.d, tot0: S.tot };
  edenVivo = true; musica.z = ''; musica.quedan = 0; yo.perf = null; crucero = false;
  for (const [f, k] of [[262, 0], [330, 0.25], [392, 0.5], [523, 0.8], [659, 1.15], [784, 1.5], [1047, 2]]) piano(f, 5, 0.08, k, 'avisos');
  const nGente = Math.max(1, fin.n || 1);
  tarjeta('❤️ La unión', `${quien === miI ? 'Perforaste el Corazón.' : nombreDe(quien) + ' perforó el Corazón.'} Todos los minerales que quedaban en el mundo (${botin.n.toLocaleString('es-MX')} piezas, ${fmt(fin.total || botin.total)}) bajan ahora mismo en un torbellino de 33 segundos, repartidos en partes iguales entre las ${nGente} maquinitas de este mundo.${parte ? ' Tu parte: ' + fmt(parte) + '.' : ''}${regalo ? ' Y el regalo del jardín: ' + fmt(regalo) + '.' : ''} Hay para todos.`, 'msj', 30000, true);
  sucio = true; pintarHud(true);
}
// Dónde va cada maquinita, qué tan grande y qué tan visible, a cada momento del final.
function posCeremonia(j, t) {
  const C = ceremonia, suave = (k) => k * k * (3 - 2 * k), mezcla2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  if (t < CER.union) { const k = suave(tope(t / CER.union)); const p = mezcla2(j.d, j.a, k); p[1] -= Math.sin(k * Math.PI) * 3; return { p, esc: 1 + 0.5 * k, alfa: 1, vuela: 1 }; }
  const t0 = CER.union + CER.lluvia + 1 + C.part.indexOf(j) * C.sepa;
  if (t < t0) return { p: [j.a[0], j.a[1] + Math.sin(t * 2 + j.k) * 0.05], esc: 1.5, alfa: 1, vuela: 0 };
  if (t < t0 + CER.baja) { const k = suave((t - t0) / CER.baja); return { p: mezcla2(j.a, PELDANO0, k), esc: 1.5, alfa: 1, vuela: 2 }; }
  if (t < t0 + CER.baja + CER.sube) { const k = (t - t0 - CER.baja) / CER.sube, p = mezcla2(PELDANO0, PELDANO1, suave(k)); p[1] -= Math.abs(Math.sin(k * Math.PI * 8)) * 0.25; return { p, esc: 1.5 - 1.2 * k, alfa: k < 0.65 ? 1 : 1 - (k - 0.65) / 0.35, vuela: 0, sube: k }; }
  return null;
}
// Lo que hace el final en cada cuadro: mover la cámara, sonar, y terminar.
function pasoCeremonia() {
  const C = ceremonia, t = (performance.now() - C.t0) / 1000, mia = C.part.find((j) => j.mio);
  let foco = [48, EDEN0 + 104];
  if (t < CER.union && mia) foco = posCeremonia(mia, t).p;
  else if (t > CER.union + CER.lluvia) foco = [48.5, EDEN0 + 112];
  yo.vx = yo.vy = 0; yo.perf = null;
  if (!soloVer) { yo.x = ant.x = vis.x = vis.x + (foco[0] - vis.x) * 0.08; yo.y = ant.y = vis.y = vis.y + (foco[1] - vis.y) * 0.08; }
  else { vis.x += (foco[0] - vis.x) * 0.08; vis.y += (foco[1] - vis.y) * 0.08; yo.x = vis.x; yo.y = vis.y; }
  for (const j of C.part) {                                   // sonidos: la unión, y cada maquinita que sube por la luz
    const t0 = CER.union + CER.lluvia + 1 + C.part.indexOf(j) * C.sepa;
    if (t >= CER.union && !C.sonadas.has('u' + j.i)) { C.sonadas.add('u' + j.i); campana(880 + j.k * 60, 1.2, 0.06, 'avisos'); if (op.part) chispas(j.a[0], j.a[1], '#ffe9a8', 26, 6); }
    if (t >= t0 + CER.baja && !C.sonadas.has('s' + j.i)) { C.sonadas.add('s' + j.i); [523, 659, 784, 1047, 1319].forEach((f, k) => piano(f * Math.pow(2, (j.k % 3) / 12), 3, 0.06, k * 0.55, 'avisos')); }
    if (t >= t0 + CER.baja + CER.sube && !C.sonadas.has('f' + j.i)) { C.sonadas.add('f' + j.i); campana(1568, 2, 0.05, 'avisos'); campana(2093, 2.4, 0.03, 'avisos', 0.2); if (op.part) chispas(PELDANO1[0], PELDANO1[1], '#ffffff', 30, 5); }
  }
  const rest = CER.union + CER.lluvia - t;
  pista(t < CER.union ? '❤️ La unión' : rest > 0 ? `💎 Llegan los minerales · ${Math.floor(rest / 60)}:${String(Math.floor(rest % 60)).padStart(2, '0')}` : '✨ El camino de luz', true);
  if (t >= C.tFin && !C.fin) {
    C.fin = true; ceremonia = null; lluvia = null; pista('');
    if (!soloVer) {                                            // de vuelta a la superficie, para empezar otra vez
      yo.x = ant.x = vis.x = INICIO_X; yo.y = ant.y = vis.y = INICIO_Y; yo.vx = yo.vy = 0; S.x = INICIO_X; S.y = INICIO_Y; sucio = true; enviarEst();
      camX = Math.max(0, Math.min(W - cols, yo.x - cols / 2)); camY = Math.max(-filas * 0.68, yo.y - filas * 0.5);
      reinicioPend = true; verJardin();
      tarjeta('🌅 Volviste a empezar', 'El mundo quedó de pura tierra; los tesoros, los huesos y la colección siguen donde estaban. Cuando quieras que vuelva a haber mineral, la Remineralizadora.', 'msj', 20000, true);
    }
  }
}
function dibujarCeremonia(ox, oy) {
  const C = ceremonia, t = (performance.now() - C.t0) / 1000;
  for (const j of C.part) {
    if (t < CER.union) { g.globalAlpha = 0.35 + 0.25 * Math.sin(t * 4); dibMaq(g, ox + j.a[0] * T, oy + j.a[1] * T, T * 1.5, j.m, j.k % 2 ? -1 : 1, false, 0, '', '', j.a[0], pintaDe(j.i)); g.globalAlpha = 1; }      // el retrato, esperándola
    const e = posCeremonia(j, t); if (!e) continue;
    const px = ox + e.p[0] * T, py = oy + e.p[1] * T;
    if (e.sube !== undefined || (t >= CER.union && t < CER.union + 0.8)) {            // luz al unirse y al subir
      const rr = T * (1.6 + (e.sube || 0) * 1.5), gl = g.createRadialGradient(px, py, 0, px, py, rr); gl.addColorStop(0, `rgba(255,244,205,${0.55 * e.alfa})`); gl.addColorStop(1, 'rgba(255,244,205,0)');
      g.globalCompositeOperation = 'lighter'; g.fillStyle = gl; g.fillRect(px - rr, py - rr, rr * 2, rr * 2); g.globalCompositeOperation = 'source-over';
    }
    g.globalAlpha = e.alfa; dibMaq(g, px, py, T * e.esc, j.m, j.k % 2 ? -1 : 1, e.vuela, 0, op.nombres && e.alfa > 0.6 ? j.n : '', '', e.p[0], pintaDe(j.i)); g.globalAlpha = 1;
  }
}
// El torbellino: los minerales nacen de golpe por todos lados (el mundo entero baja a la vez), entran a un embudo sobre cada
// maquinita, giran cada vez más rápido mientras se cierra y entran en ella. Todas giran hacia el mismo lado, como un solo
// remolino. En pantalla van hasta 1,600 piezas a la vez (700 con «Partículas: pocas», 300 con «ninguna»).
function lluviaDeMinerales(ox, oy) {
  const L = lluvia, ahora = performance.now(), t = (ahora - L.t0) / 1000, w = lienzo.width, h = lienzo.height, d = Math.min(0.05, (ahora - L.ult) / 1000); L.ult = ahora;
  if (t < 0) return;
  const destinos = ceremonia ? ceremonia.part.map((j) => [ox + j.a[0] * T, oy + j.a[1] * T]) : [[ox + vis.x * T, oy + vis.y * T]];
  if (!destinos.length) destinos.push([ox + 48 * T, oy + (EDEN0 + 105) * T]);
  if (!L.viento) { L.viento = 1; ruido(2.6, 0.07, 'avisos', 240, 'bandpass', 1.1, 0, 1900); ruido(3.4, 0.05, 'avisos', 1900, 'bandpass', 0.9, 2.3, 380); }
  const cupo = [300, 700, 1600][op.part] ?? 1600;
  if (t < L.dur - 4.4) {                                  // de golpe los primeros 2.5 s; luego siguen llegando hasta 4 s antes del final
    L.acc = (L.acc || 0) + d * (t < 2.5 ? 2600 : 560);
    while (L.acc >= 1 && L.p.length < cupo) {
      L.acc--;
      const lado = Math.random(), x0 = lado < 0.6 ? Math.random() * w : lado < 0.8 ? -T * (1 + Math.random() * 4) : w + T * (1 + Math.random() * 4), y0 = lado < 0.6 ? -T - Math.random() * h * 0.35 : Math.random() * h * 0.75;
      L.p.push({ x0, y0, x: x0, y: y0, tg: (L.n = (L.n || 0) + 1) % destinos.length, e: 0, ta: 0.45 + Math.random() * 0.5, ts: 1.3 + Math.random() * 1.6, r0: T * (1.5 + Math.random() * 2.5), th: Math.random() * 6.283, c: MIN[L.tipos[Math.floor(Math.random() * L.tipos.length)]].col, r: T * (0.09 + Math.random() * 0.1), a: Math.random() * 6 });
    }
    if (L.p.length >= cupo) L.acc = 0;
  }
  if (t < L.dur - 1) {                                    // el remolino de aire sobre cada maquinita
    g.lineWidth = Math.max(1.5, T * 0.05);
    for (const [mx, my] of destinos) for (let k = 0; k < 4; k++) { const rr = T * (0.6 + k * 0.85), giro = reloj * (13 - k * 2.5); g.strokeStyle = `rgba(255,255,255,${0.3 - k * 0.06})`; g.beginPath(); g.ellipse(mx + Math.sin(reloj * 3 + rr / T) * rr * 0.18, my - rr * 2.1, rr, rr * 0.3, 0, giro, giro + 3.9); g.stroke(); }
    g.globalCompositeOperation = 'lighter';           // cada maquinita brilla mientras los recibe
    for (const [mx, my] of destinos) { const rr = T * (1.2 + 0.15 * Math.sin(reloj * 9)), gl = g.createRadialGradient(mx, my, 0, mx, my, rr); gl.addColorStop(0, 'rgba(255,244,205,.45)'); gl.addColorStop(1, 'rgba(255,244,205,0)'); g.fillStyle = gl; g.fillRect(mx - rr, my - rr, rr * 2, rr * 2); }
    g.globalCompositeOperation = 'source-over';
  }
  for (const q of L.p) {
    const [mx, my] = destinos[q.tg % destinos.length];
    q.e += d; q.a += d * 9;
    const s = Math.max(0, (q.e - q.ta) / q.ts), rad = q.r0 * Math.max(0, 1 - s);
    q.th += d * (7 + 22 * Math.min(1, s));               // gira cada vez más rápido mientras el embudo se cierra
    const ex = mx + Math.cos(q.th) * rad + Math.sin(reloj * 3 + rad / T) * rad * 0.18, ey = my - rad * 2.1 + Math.sin(q.th) * rad * 0.3;      // un tornado: ancho arriba, la punta en la maquinita
    if (q.e < q.ta) { const k = q.e / q.ta, kk = k * k * (3 - 2 * k); q.x = q.x0 + (ex - q.x0) * kk; q.y = q.y0 + (ey - q.y0) * kk; } else { q.x = ex; q.y = ey; }
    if (s >= 1) { q.fin = 1; L.llegan++; continue; }
    const r = q.r * (s > 0.88 ? 1 - (s - 0.88) * 5 : 1);
    g.save(); g.translate(q.x, q.y); g.rotate(q.a); g.strokeStyle = '#0006'; g.lineWidth = Math.max(1, T * 0.03); g.fillStyle = q.c; g.beginPath(); g.moveTo(0, -r * 1.4); g.lineTo(r, 0); g.lineTo(0, r * 1.4); g.lineTo(-r, 0); g.closePath(); g.fill(); g.stroke(); g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.moveTo(0, -r * 1.4); g.lineTo(r * 0.5, -r * 0.3); g.lineTo(-r * 0.5, -r * 0.3); g.fill(); g.restore();
  }
  if (L.p.length) { let n = 0; for (let i = 0; i < L.p.length; i++) if (!L.p[i].fin) L.p[n++] = L.p[i]; L.p.length = n; }
  if (L.llegan > L.sonados && ahora - L.tSon > 70) { L.tSon = ahora; L.sonados = L.llegan; son.moneda(Math.min(24, L.llegan % 25)); }
  const k = Math.min(1, t / L.dur), suave = 1 - Math.pow(1 - k, 3);
  if (L.mio) { S.d = L.d0 + Math.floor(L.total * suave); S.tot = L.tot0 + Math.floor(L.total * suave); }
  if (k >= 1) { lluvia = null; if (L.mio) { S.d = L.d0 + L.total; S.tot = L.tot0 + L.total; sucio = true; son.venta(); pintarHud(true); } }
}
// El jardín entero, a pantalla completa: baja despacio desde las raíces hasta el lago y al final se aleja para verse todo de
// una vez. Sale solo al quitar la última piedra, y después con la tecla V estando en el jardín.
let cine = null;
function verJardin() {
  if (cine || !S) return;
  const px = Math.max(6, Math.min(24, Math.ceil(Math.min(2300, innerWidth * (window.devicePixelRatio || 1)) / W)));
  edenFirma = seed + '|' + edenGente().map((j) => j.n + j.m).join(','); edenE = armarEden();
  const c = document.createElement('canvas'); c.width = W * px; c.height = EDEN_H * px;
  const q = c.getContext('2d'); q.setTransform(px, 0, 0, px, 0, 0); for (const e of edenE) { q.save(); e[4](q); q.restore(); }
  const d = document.createElement('div'); d.id = 'cine';
  d.innerHTML = `<small>El Jardín del Fondo · ${esc(cfg.nombre || 'Mina')} · cualquier tecla para volver</small>`; d.prepend(c);
  document.body.appendChild(d); requestAnimationFrame(() => d.classList.add('on'));
  cine = { d, c, t0: performance.now(), dur: 26000 };
  d.addEventListener('pointerdown', cerrarCine);
  const paso = (t) => { if (!cine) return; cuadroCine(t - cine.t0); if (t - cine.t0 > cine.dur) return cerrarCine(); requestAnimationFrame(paso); };
  cuadroCine(0); requestAnimationFrame(paso);
}
function cuadroCine(ms) {
  const c = cine.c, A = innerWidth, B = innerHeight, sA = A / c.width, sB = Math.min(B / c.height, A / c.width), suave = (k) => k * k * (3 - 2 * k);
  const baja = suave(tope((ms - 1200) / 15000)), aleja = suave(tope((ms - 17000) / 3500));       // 15 s bajando, 3.5 s alejándose, y el resto quieto
  const yBaja = -Math.max(0, c.height * sA - B) * baja, sc = sA + (sB - sA) * aleja;
  const x = (A - c.width * sc) / 2 * aleja, y = yBaja * (1 - aleja) + (B - c.height * sc) / 2 * aleja;
  c.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${sc.toFixed(5)})`;
}
function cerrarCine() { if (!cine) return; const d = cine.d; cine = null; d.classList.remove('on'); setTimeout(() => d.remove(), 600); if (reinicioPend) { reinicioPend = false; pantallaReinicio(); } }
// Al terminar el mundo: volver a arrancar. Un mundo nuevo, con la maquinita como está (sus mejoras, su dinero, sus objetos)
// o desde cero (maquinita nueva: $20 y equipo de fábrica; se quedan los logros, el tiempo jugado y la colección del mundo).
// También desde Menú → Mundo, mientras el mundo esté terminado.
let reinicioPend = false;
function pantallaReinicio() {
  inicio(`<header><h2>🌅 Terminaste este mundo</h2></header><div class="cuerpo">
    <p class="nota">Quedó de pura tierra; los tesoros, los huesos y la colección siguen ahí, y con la Remineralizadora vuelve a tener mineral. O arranca uno nuevo, desde arriba:</p>
    <div class="fila"><div class="ic">🚀</div><div class="t"><b>Mundo nuevo con mis mejoras</b><small>Semilla nueva. Tu maquinita entra como está: ${fmt(S.d)}, su equipo y sus objetos.</small></div><button id="bConMejoras">Arrancar</button></div>
    <div class="fila"><div class="ic">🌱</div><div class="t"><b>Mundo nuevo desde cero</b><small>Semilla nueva y maquinita de fábrica: $20, equipo básico, sin objetos. Se quedan tus logros y tu tiempo jugado.</small></div><button class="s" id="bDesdeCero">Arrancar</button></div>
    <div class="fila"><div class="ic">🏡</div><div class="t"><b>Seguir en este mundo</b><small>Tal como está, en la superficie.</small></div><button class="s" id="bSeguir">Seguir</button></div>
    <div class="fila"><div class="ic">👥</div><div class="t"><b>Trae a alguien</b><small>Un mundo se disfruta más acompañado. Manda la liga: quien entra ya está jugando.</small></div><button class="s" id="bTrae">${tactil ? '📤 Compartir' : '📲 WhatsApp'}</button></div></div>`);
  $('#bTrae').onclick = () => compartirInvitacion();
  $('#bConMejoras').onclick = () => nuevoMundoTras(false);
  $('#bDesdeCero').onclick = () => { if (confirm('¿Empezar desde cero? Tu maquinita vuelve a $20 y equipo de fábrica; pierdes dinero, mejoras y objetos. Los logros y el tiempo jugado se quedan.')) nuevoMundoTras(true); };
  $('#bSeguir').onclick = () => { cerrar(); };
}
function nuevoMundoTras(desdeCero) {
  if (desdeCero) { const viejo = S; S = sanear(null); S.v = (viejo.v || 0) + 1; S.seg = viejo.seg || 0; S.log = viejo.log || []; S.fl = viejo.fl || {}; S.st = { ...S.st, ...viejo.st }; S.rec = viejo.rec || 0; S.rango = viejo.rango || 0; }
  enviarEst(); guardarCopia();
  crearMundo();
}
// Con el jardín completo, vive: pájaros que cruzan, pétalos que caen, luciérnagas entre las raíces, destellos en el lago y el sol girando despacio.
function vidaEden(ox, oy, y0, y1) {
  const X = (x) => ox + x * T, Y = (y) => oy + (EDEN0 + y) * T, ve = (y) => EDEN0 + y >= y0 - 2 && EDEN0 + y <= y1 + 2;
  if (edenFaltan.length) { g.strokeStyle = '#ffd23f'; g.lineWidth = Math.max(2, T * 0.06); for (let i = 0; i < edenFaltan.length; i += 2) { const k = 0.5 + 0.5 * Math.sin(reloj * 5 + i); g.globalAlpha = 0.5 + 0.5 * k; g.beginPath(); g.arc(ox + (edenFaltan[i] + 0.5) * T, oy + (edenFaltan[i + 1] + 0.5) * T, T * (0.7 + 0.25 * k), 0, 7); g.stroke(); } g.globalAlpha = 1; }
  if (!edenVivo) return;
  if (ve(EDEN_SOL[1]) || ve(EDEN_SOL[1] - 20) || ve(EDEN_SOL[1] + 20)) { g.save(); g.translate(X(EDEN_SOL[0]), Y(EDEN_SOL[1])); g.rotate(reloj * 0.05); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,236,170,${0.05 + 0.02 * Math.sin(reloj * 0.8)})`; for (let k = 0; k < 12; k++) { const a = k * 0.5236; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a - 0.07) * T * 34, Math.sin(a - 0.07) * T * 34); g.lineTo(Math.cos(a + 0.07) * T * 34, Math.sin(a + 0.07) * T * 34); g.fill(); } g.restore(); }
  g.lineCap = 'round';
  for (let k = 0; k < 12; k++) {          // pájaros
    const y = 26 + k * 2.6 + Math.sin(reloj * 0.6 + k) * 1.4; if (!ve(y)) continue;
    const x = ((reloj * (1.4 + (k % 4) * 0.35) + k * 17.3) % 108) - 6, t = T * 0.42, al = Math.sin(reloj * 7 + k * 2) * 0.5;
    g.strokeStyle = 'rgba(40,44,70,.8)'; g.lineWidth = Math.max(1.5, T * 0.08); g.beginPath(); g.moveTo(X(x) - t, Y(y) - t * (0.3 + al)); g.quadraticCurveTo(X(x) - t * 0.4, Y(y) - t * 0.5, X(x), Y(y)); g.quadraticCurveTo(X(x) + t * 0.4, Y(y) - t * 0.5, X(x) + t, Y(y) - t * (0.3 + al)); g.stroke();
  }
  for (let k = 0; k < 46; k++) {          // pétalos
    const y = (reloj * (0.9 + (k % 5) * 0.22) + k * 7.31) % 120; if (!ve(y)) continue;
    const x = ((k * 37.7) % 96) + Math.sin(reloj * 0.9 + k) * 1.6; g.fillStyle = ['rgba(255,190,215,.85)', 'rgba(255,255,255,.85)', 'rgba(255,214,120,.85)'][k % 3];
    g.beginPath(); g.ellipse(X(x), Y(y), T * 0.11, T * 0.06, reloj * 1.5 + k, 0, 7); g.fill();
  }
  g.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 26; k++) {          // luciérnagas entre las raíces
    const y = 2 + ((k * 5.3) % 20) + Math.sin(reloj * 0.7 + k * 1.3) * 0.8; if (!ve(y)) continue;
    const x = ((k * 23.9) % 96) + Math.cos(reloj * 0.5 + k) * 1.2, a = 0.35 + 0.65 * Math.abs(Math.sin(reloj * 1.6 + k * 2.1)), rr = T * 0.3, gl = g.createRadialGradient(X(x), Y(y), 0, X(x), Y(y), rr);
    gl.addColorStop(0, `rgba(255,255,220,${a})`); gl.addColorStop(0.3, `rgba(220,255,150,${a * 0.6})`); gl.addColorStop(1, 'rgba(220,255,150,0)'); g.fillStyle = gl; g.fillRect(X(x) - rr, Y(y) - rr, rr * 2, rr * 2);
  }
  g.fillStyle = '#fff';
  for (let k = 0; k < 34; k++) {          // destellos en el lago
    const y = 110.5 + ((k * 3.7) % 9); if (!ve(y)) continue;
    const s = Math.sin(reloj * 2.2 + k * 1.9); if (s < 0.6) continue;
    const x = (k * 29.3) % 96, l = T * 0.2 * (s - 0.6) * 2.5, f = Math.max(1, T * 0.035); g.globalAlpha = 0.8; g.fillRect(X(x) - l, Y(y) - f / 2, l * 2, f); g.fillRect(X(x) - f / 2, Y(y) - l, f, l * 2);
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}

/* ════════ Tres sorpresas para quien se detiene ════════ RLR */
// ── 1. El Bosque de hongos canta. Cada hongo gigante da una nota del acorde que está sonando en la música en ese instante
//    (el más grande, la más grave). Al tocar uno, los demás le contestan del más cercano al más lejano, cada vez más bajito.
//    Tocar los cinco seguidos hace que el bosque entero toque una frase.
const HONGOS = [[-10, 2.6, '120,255,220', 3, '#78ffdc'], [-5, 3.6, '255,140,220', 1, '#ff8cdc'], [0, 4.4, '120,255,220', 0, '#78ffdc'], [6, 3.2, '190,140,255', 2, '#be8cff'], [11, 2.4, '120,255,220', 4, '#78ffdc']];      // dónde, qué tan alto, su luz, qué nota del acorde, sus esporas
const R_HONGOS = RINCONES.find((R) => R.t === 'hongos'), R_JARDIN = RINCONES.find((R) => R.t === 'jardin');
const hongo = { luz: [-99, -99, -99, -99, -99], dentro: -1, serie: [] };
const copaDe = (k) => { const [dx, tam] = HONGOS[k]; return [R_HONGOS.cx + dx + 0.5, Math.floor(pisoR(R_HONGOS, R_HONGOS.cx + dx)) + 1 - tam * 0.8, tam]; };
function cantarHongos() {
  let cual = -1;
  for (let k = 0; k < 5; k++) { const [cx, cy, tam] = copaDe(k); if (Math.abs(yo.x - cx) < tam * 0.5 && Math.abs(yo.y - cy) < tam * 0.3 + 0.45) cual = k; }
  if (cual === hongo.dentro) return;
  hongo.dentro = cual; if (cual < 0) return;
  const A = acordeAhora(), f = (k) => nota(A.base, HONGOS[k][3] < 4 ? A.ac[HONGOS[k][3]] : A.ac[0] + 12), [cx, cy] = copaDe(cual);
  piano(f(cual), 3.4, 0.11, 0, 'ambiente'); campana(f(cual) * 2, 1.5, 0.02, 'ambiente');
  hongo.luz[cual] = tiempo; chispas(cx, cy - 0.4, HONGOS[cual][4], 16, 2.2);
  for (let k = 0; k < 5; k++) if (k !== cual) { const lejos = Math.abs(k - cual); piano(f(k), 2.6, 0.045 / lejos, 0.26 * lejos, 'ambiente'); hongo.luz[k] = tiempo + 0.26 * lejos; }
  const ser = hongo.serie.filter((x) => tiempo - x[1] < 16 && x[0] !== cual); ser.push([cual, tiempo]); hongo.serie = ser;
  if (ser.length === 5) {                            // los cinco seguidos: el bosque toca una frase entera
    hongo.serie = [];
    for (const [b, i, o] of FRASES[3].concat(FRASES[5])) piano(nota(A.base * (o ? 2 : 1), A.ac[i]), 4, 0.07, 0.9 + b * 0.42, 'ambiente');
    for (let k = 0; k < 5; k++) { hongo.luz[k] = tiempo + 0.9 + k * 0.2; const [x, y] = copaDe(k); chispas(x, y - 0.4, HONGOS[k][4], 22, 3); }
    flota(yo.x, yo.y - 1.2, '🎶 el bosque te contestó', '#78ffdc');
    if (!S.fl.coro) { S.fl.coro = 1; S.d += 1e6; S.tot += 1e6; sucio = true; tarjeta('🎶 El bosque entero cantó · ' + fmt(1e6), 'Tocaste los cinco hongos seguidos. Cantan siempre con el acorde que lleve la música: nunca suena dos veces igual.', 'msj', 12000, true); difundir('hizo cantar al Bosque de hongos'); }
  } else if (!S.fl.hongos) { S.fl.hongos = 1; sucio = true; tarjeta('🍄 Los hongos cantan', 'Cada uno da una nota del acorde que está sonando en la música, y los demás le contestan. Prueba a tocar los cinco seguidos.', 'msj', 11000); }
}
// ── 2. El Jardín de cristal te reconoce. Sus mariposas de vidrio andan sueltas; si te quedas quieto, se juntan encima de ti
//    y escriben el nombre de tu maquinita. En cuanto te mueves, se sueltan.
const jardin = { m: [], nom: null, quieto: 0, forma: false };
function poblarJardin() {
  if (jardin.nom === miNombre) return;
  jardin.nom = miNombre;
  const c = document.createElement('canvas'); c.width = 170; c.height = 14;
  const q = c.getContext('2d', { willReadFrequently: true }); q.font = '900 11px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif'; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(miNombre, 85, 7.5);
  const im = q.getImageData(0, 0, 170, 14).data; let pts = [];
  for (let y = 0; y < 14; y++) for (let x = 0; x < 170; x++) if (im[(y * 170 + x) * 4 + 3] > 120) pts.push([(x - 85) * 0.2, (y - 7) * 0.2]);
  while (pts.length > 320) pts = pts.filter((_, i) => i % 2 === 0);
  const R = R_JARDIN, r = azarDe(4242);
  jardin.m = pts.map((p) => { const a = r() * 6.283, d = Math.sqrt(r()) * 0.82, hx = R.cx + 0.5 + Math.cos(a) * R.rx * d, hy = R.cy - Math.abs(Math.sin(a)) * R.ry * d * 0.8 + 1; return { x: hx, y: hy, vx: 0, vy: 0, hx, hy, p, f: r() * 6.283, c: Math.floor(r() * 3) }; });
}
function mariposas(d, dentro) {
  if (!jardin.m.length) return;
  const quieto = dentro && Math.hypot(yo.vx, yo.vy) < 0.35 && !yo.perf;
  jardin.quieto = quieto ? jardin.quieto + d : 0;
  const forma = jardin.quieto > 1.4;
  if (forma && !jardin.forma) [0, 4, 7, 12, 16].forEach((sm, k) => campana(nota(1047, sm), 0.9, 0.02, 'ambiente', k * 0.09));       // se juntan con un arpegio de vidrio
  jardin.forma = forma;
  if (forma && jardin.quieto > 3.4 && !S.fl.mariposas) { S.fl.mariposas = 1; sucio = true; tarjeta('🦋 Las mariposas te reconocieron', 'Te quedaste quieto y escribieron el nombre de tu maquinita. Si lo cambias, lo escriben de nuevo.', 'msj', 12000, true); }
  const k = forma ? 16 : 1.6, fr = Math.pow(forma ? 0.02 : 0.3, d);
  for (const b of jardin.m) {
    b.f += d * (forma ? 5 : 11);
    const tx = forma ? yo.x + b.p[0] : b.hx + Math.sin(b.f * 0.21) * 1.6, ty = forma ? yo.y - 3 + b.p[1] : b.hy + Math.cos(b.f * 0.17) * 0.9;
    b.vx = (b.vx + (tx - b.x) * k * d + (forma ? 0 : (Math.random() - 0.5) * 5 * d)) * fr; b.vy = (b.vy + (ty - b.y) * k * d + (forma ? 0 : (Math.random() - 0.5) * 5 * d)) * fr;
    b.x += b.vx * d * (forma ? 6 : 1); b.y += b.vy * d * (forma ? 6 : 1);
  }
}
// ── 3. El mural de la Ciudad Perdida. Lo pintaron hace miles de años y enseña a «los que vendrán»: las maquinitas de este
//    mundo, cada una con su modelo y su nombre, y los objetos de la colección que el equipo ya encontró. Si llega alguien nuevo
//    o alguien cambia de nombre, el mural ya lo sabía.
const MURAL = { x: 35, y: 2791.6, an: 26, al: 9.4 };
let muralC = null, muralF = '';
function mural() {
  const gente = [{ i: miI, n: miNombre, m: miModelo }, ...[...otros.values()].map((o) => ({ i: o.i, n: o.n, m: o.m }))].sort((a, b) => a.i - b.i).slice(0, 8);
  const tipos = COLEC.map((_, k) => hallados[k * 3] + hallados[k * 3 + 1] + hallados[k * 3 + 2]).join('');
  const firma = T + '|' + gente.map((j) => j.n + j.m).join(',') + '|' + tipos;
  if (firma === muralF && muralC) return muralC;
  muralF = firma;
  const c = muralC = document.createElement('canvas'), A = MURAL.an * T, B = MURAL.al * T; c.width = Math.ceil(A); c.height = Math.ceil(B);
  const q = c.getContext('2d'), u = T, r = azarDe(2815), ROJO = '#a8432a', OCRE = '#d9a04a', CAL = '#eadfc8';
  q.lineCap = q.lineJoin = 'round';
  const letras = (txt, x, y, tam, col, sep = 0.12) => { q.font = `800 ${tam}px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif`; q.textBaseline = 'middle'; q.textAlign = 'left'; q.fillStyle = col; const an = [...txt].map((l) => q.measureText(l).width + tam * sep); let px = x - an.reduce((a, b) => a + b, 0) / 2; [...txt].forEach((l, k) => { q.fillText(l, px, y + (r() - 0.5) * tam * 0.08); px += an[k]; }); };
  const mano = (x, y, t, col, gi) => { q.save(); q.translate(x, y); q.rotate(gi); q.fillStyle = col; q.beginPath(); q.ellipse(0, 0, t * 0.5, t * 0.55, 0, 0, 7); q.fill(); q.strokeStyle = col; q.lineWidth = t * 0.2; for (const [a, l] of [[-1.15, 0.85], [-0.45, 1.25], [0, 1.4], [0.42, 1.3], [0.85, 1.05]]) { q.beginPath(); q.moveTo(Math.sin(a) * t * 0.35, -Math.cos(a) * t * 0.35); q.lineTo(Math.sin(a) * t * l, -Math.cos(a) * t * l); q.stroke(); } q.restore(); };
  // manos a los lados, como en las cuevas de verdad
  for (const [x, y, gi, col] of [[1.3, 2.2, -0.3, ROJO], [2.6, 4.6, 0.2, OCRE], [1.4, 6.8, -0.1, ROJO], [24.7, 2.3, 0.3, ROJO], [23.5, 4.7, -0.25, OCRE], [24.6, 6.9, 0.15, ROJO]]) mano(x * u, y * u, u * 0.62, col, gi);
  // el sol en espiral y la luna
  q.strokeStyle = OCRE; q.lineWidth = u * 0.13; q.beginPath(); for (let a = 0; a < 16; a += 0.3) q.lineTo(5 * u + Math.cos(a) * a * u * 0.045, 1.5 * u + Math.sin(a) * a * u * 0.045); q.stroke();
  for (let k = 0; k < 10; k++) { const a = k * 0.628; q.beginPath(); q.moveTo(5 * u + Math.cos(a) * u * 0.95, 1.5 * u + Math.sin(a) * u * 0.95); q.lineTo(5 * u + Math.cos(a) * u * 1.25, 1.5 * u + Math.sin(a) * u * 1.25); q.stroke(); }
  q.fillStyle = CAL; q.beginPath(); q.arc(21 * u, 1.5 * u, u * 0.7, 0, 7); q.fill(); q.globalCompositeOperation = 'destination-out'; q.beginPath(); q.arc(21.35 * u, 1.35 * u, u * 0.6, 0, 7); q.fill(); q.globalCompositeOperation = 'source-over';
  letras('LOS QUE VENDRÁN', 13 * u, 1.5 * u, u * 0.78, CAL, 0.22);
  // las maquinitas del mundo, pintadas con tierra roja: cada una con su forma y su nombre
  const n = gente.length, tam = Math.min(2.5, 17 / n), paso = Math.min(3.4, 19 / n), x0 = 13 - ((n - 1) * paso) / 2;
  gente.forEach((j, k) => {
    const t = Math.ceil(tam * u * 1.3), m = document.createElement('canvas'); m.width = m.height = t; const mq = m.getContext('2d');
    dibMaq(mq, t / 2, t / 2, tam * u, j.m, k % 2 ? -1 : 1, false, 0, '', '', 0.4);
    mq.globalCompositeOperation = 'source-atop'; mq.globalAlpha = 0.8; mq.fillStyle = k % 2 ? OCRE : ROJO; mq.fillRect(0, 0, t, t);
    q.drawImage(m, (x0 + k * paso) * u - t / 2, 4.1 * u - t / 2);
    letras(j.n.toUpperCase(), (x0 + k * paso) * u, (4.1 + tam * 0.62) * u, u * Math.min(0.42, (paso * 1.5) / Math.max(4, j.n.length)), CAL, 0.08);
  });
  // la tierra en zigzag, y debajo los 33 objetos de la colección: hueco el que falta, lleno el que ya apareció
  q.strokeStyle = ROJO; q.lineWidth = u * 0.11; q.beginPath(); for (let x = 3.6; x <= 22.4; x += 0.5) q.lineTo(x * u, (6.55 + ((x * 2) & 1 ? 0.22 : 0)) * u); q.stroke();
  COLEC.forEach((_, k) => { const x = (4.2 + k * 0.55) * u, y = 7.35 * u, v = +tipos[k]; q.strokeStyle = OCRE; q.lineWidth = u * 0.06; q.beginPath(); q.arc(x, y, u * 0.16, 0, 7); q.stroke(); if (v) { q.fillStyle = v === 3 ? CAL : OCRE; q.beginPath(); q.arc(x, y, u * (v === 3 ? 0.17 : 0.11), 0, 7); q.fill(); } });
  // y al fondo de todo, el corazón: hasta allá van a llegar
  q.fillStyle = ROJO; const hx = 13 * u, hy = 8.55 * u, ht = u * 0.42; q.beginPath(); q.moveTo(hx, hy + ht); q.bezierCurveTo(hx - ht * 2, hy - ht * 0.4, hx - ht * 0.8, hy - ht * 1.5, hx, hy - ht * 0.5); q.bezierCurveTo(hx + ht * 0.8, hy - ht * 1.5, hx + ht * 2, hy - ht * 0.4, hx, hy + ht); q.fill();
  q.fillStyle = OCRE; for (let k = 0; k < 4; k++) q.fillRect(hx - u * 0.05, (7.72 + k * 0.1) * u, u * 0.1, u * 0.05);
  // los siglos: la pintura se descascara
  q.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 900; i++) { q.globalAlpha = 0.25 + r() * 0.6; const t = u * (0.03 + r() * 0.1); q.fillRect(r() * A, r() * B, t * (1 + r() * 3), t); }
  q.globalAlpha = 1; q.globalCompositeOperation = 'source-over';
  return c;
}

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
  { id: 'equipo', n: 'Equipo completo', d: 'Las seis piezas en la mejora de medio millón, o mejor.', ok: () => S.eq.every((e) => e >= 6) },
  { id: 'leyenda', n: 'Equipo de leyenda', d: 'Las seis piezas en su última mejora.', ok: () => S.eq.every((e, i) => e === PZ[i].niv.length - 1) },
  { id: 'dinamitero', n: 'Dinamitero', d: 'Usa 10 explosivos.', ok: () => S.st.expl >= 10 },
  { id: 'lava', n: 'Baño de lava', d: 'Sobrevive a la lava.', ok: () => S.fl.lava },
  { id: 'gas', n: 'Sobreviviente', d: 'Sobrevive a una bolsa de gas.', ok: () => S.fl.gas },
  { id: 'veta', n: 'La veta madre', d: 'Encuentra una veta madre.', ok: () => S.fl.veta },
  { id: 'remin', n: 'Tierra nueva', d: 'Remineraliza el tablero.', ok: () => S.st.remin >= 1 },
  { id: 'catalogo', n: 'Catálogo completo', d: 'Vende todos los minerales y encuentra todos los hallazgos.', ok: () => catalogoCompleto() },
  ...LUGARES.map((L, i) => ({ id: 'lug' + i, n: L.n, d: 'Descubre este lugar.', ok: () => S.lug[i] })),
  { id: 'guero', n: '???', d: 'Secreto.', sec: 'Vecino: encuentra a «El Güero».', ok: () => S.fl.guero },
  { id: 'col1', n: 'Coleccionista', d: 'Encuentra un objeto de la colección del mundo.', ok: () => (S.st.col || 0) >= 1 },
  { id: 'col33', n: 'Media vitrina', d: 'Que el equipo junte 50 objetos de la colección.', ok: () => nHallados() >= 50 },
  { id: 'col99', n: 'Vitrina completa', d: 'Que el equipo junte los 99 objetos de la colección.', ok: () => nHallados() >= NCOL },
  { id: 'pleito', n: 'Taladro bravo', d: 'Gana un pleito contra otra maquinita.', ok: () => (S.st.pleitos || 0) >= 1 },
  { id: 'diezkm', n: 'Diez kilómetros', d: 'Llega al fondo del mundo: 10,000 m.', ok: () => S.rec >= 9990 },
  { id: 'jardin', n: 'Hay para todos', d: 'Descubran completo el Jardín del Fondo: quiten toda la roca de los últimos 240 m.', ok: () => S.fl.edenF && Object.keys(S.fl.edenF).length > 0 },
  { id: 'intacto', n: 'Sin rasguños', d: 'Llega a 500 m sin recibir daño en el viaje.', ok: () => S.fl.intacto },
  { id: 'anfitrion', n: 'Anfitrión', d: 'Tres maquinitas nuevas llegan a un mundo donde estás.', ok: () => (S.st.amigos || 0) >= 3 },
  { id: 'padrino', n: 'Padrino', d: 'Diez personas entran a Mina con tu liga.', ok: () => (S.st.traidos || 0) >= 10 },
  { id: 'pueblo', n: 'Fundaste un pueblo', d: 'Treinta y tres personas entran a Mina con tu liga.', ok: () => (S.st.traidos || 0) >= 33 },
  { id: 'pase', n: 'Buen compañero', d: 'Pásale combustible a otra maquinita.', ok: () => S.fl.pase },
  { id: 'vecino', n: 'Buen vecino', d: 'Regálale dinero a otro jugador.', ok: () => S.fl.regalo },
  { id: 'nubes', n: 'Sobre las nubes', d: 'Vuela a 3,000 m de altura.', ok: () => S.alt >= 3000 },
  { id: 'astronauta', n: 'Astronauta', d: 'Llega al espacio: 100 km de altura.', ok: () => S.alt >= 100000 },
  { id: 'luna', n: 'A la Luna', d: 'Vuela 1,000 km hacia arriba.', ok: () => S.alt >= 1000000 },
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
    if (['r500', 'fondo', 'diezkm', 'anfitrion', 'padrino', 'pueblo'].includes(l.id)) tarjetaCompartir('🏅 Logro: ' + nombre, (l.sec ? l.sec.split(': ')[1] : l.d) + ' Presúmelo.', `🏅 «${nombre}» en Mina: ${l.d.replace(/\.$/, '')}.${S.rec ? ' Voy a ' + num(S.rec) + ' m bajo tierra.' : ''}\nEntra a mi mundo y alcánzame: gratis, sin registro.\n${ligaInvitacion()}`, 14000, true);
    else tarjeta('🏅 Logro: ' + nombre, l.sec ? l.sec.split(': ')[1] : l.d);
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
  { tp: 'expl', tx: 'Te regalamos una dinamita: úsala bajo tierra con la tecla D', pg: 500, regalo: 2 },
  { tp: 'vende', a: 4, b: 1, pr: 0, tx: 'Vende una pieza de Platino (aparece desde 110 m)', pg: 750 },
];
function mineralComun() { let b = 0; for (let i = 0; i < MIN.length; i++) if (MIN[i].c <= S.rec + 30) b = i; return b; }
function nuevoContrato() {
  const mc = mineralComun(), tipico = bodega() * MIN[mc].v * 0.6, pg = Math.max(200, Math.round(tipico * 0.4 / 50) * 50);
  const ya = S.con.act.map((c) => c.tp);
  const tipos = ['vende', 'sindano', 'filo', 'viajeV', 'hall'].filter((t) => !ya.includes(t));
  const tp = tipos[Math.floor(Math.random() * tipos.length)];
  if (tp === 'vende') { const b = Math.min(bodega(), 3 + Math.floor(Math.random() * 5)); return { tp, a: mc, b, pr: 0, pg, tx: `Entrega ${b} de ${MIN[mc].n}` }; }
  if (tp === 'sindano') { const a = Math.round(Math.min(H * 2 - 50, S.rec + 60) / 10) * 10; return { tp, a, pg, tx: `Baja a ${a} m sin recibir daño en el viaje` }; }
  if (tp === 'filo') return { tp, pg, tx: 'Llega a la Gasolinera con menos del 10 % de combustible' };
  if (tp === 'viajeV') { const a = Math.round(tipico * 1.2 / 10) * 10; return { tp, a, pg, tx: `Vende ${fmt(a)} en un solo viaje` }; }
  return { tp: 'hall', pg: pg * 2, tx: 'Encuentra un hallazgo enterrado' };
}
// Los contratos se quitaron (Ricardo: «solo agregan complejidad»). Las funciones quedan vacías por si algo las llama.
function surtirContratos() { poner($('#contratos'), ''); }
function surtirContratosAntes() {
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
  return;
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
    tarjeta('Contrato cumplido · ' + fmt(k.pg), k.tx); son.contrato();
  }
  if (cambio) { sucio = true; surtirContratos(); }
}
function pintarContratos() {       // abajo a la izquierda va uno solo; los demás están en Menú → Contratos
  const a = S.con.act, k = a[0];
  poner($('#contratos'), k ? `<div class="c" title="Ver los contratos">📋 ${esc(k.tx)}${k.b > 1 ? ` (${k.pr | 0}/${k.b})` : ''} · <small>${fmt(k.pg)}</small>${a.length > 1 ? ` <em>+${a.length - 1}</em>` : ''}</div>` : '');
}

/* ════════ Daño, muerte y rescate ════════ */
function danar(q, causa) {
  q = Math.round(q);
  if (q <= 0 || !S) return;
  ultGolpe = { q, m: prof() };
  S.vida -= q; S.vj.dano = 1; sucio = true;
  son.dano(); temblar(Math.min(14, 3 + q / 6)); chispas(yo.x, yo.y, '#ff6b5a', 10, 6);
  golpeFx = Math.min(1, 0.45 + q / vidaMax()); flota(yo.x, yo.y - 1.3, '−' + q + ' de casco', '#ff8a7a');
  const b = $('#bCasco'); b.classList.remove('golpe'); void b.offsetWidth; b.classList.add('golpe');
  if (S.vida <= 0) morir(causa);
}
let ultGolpe = { q: 0, m: 0 };
function morir(causa) {
  if (causa === 'pleito') {          // perder un pleito no cuesta nada: vuelves arriba con todo, y el casco reparado
    son.boom(); temblar(12); chispas(yo.x, yo.y, '#ffb347', 40, 10); onda(yo.x, yo.y, 4, '#ffd9a0', 0.6); recordar();
    S.vida = vidaMax(); yo.renace = true; S.st.perdidos = (S.st.perdidos || 0) + 1;
    tarjeta('⚔️ ' + rival + ' te ganó el pleito', 'Vuelves a la superficie con tu carga y tu dinero completos. El Elevador te regresa a donde estabas.', '', 10000, true);
    enviar({ t: 'golpe', a: rivalI, q: 1, v: 1 });        // que quien ganó lo celebre (y el mundo se entera de quién ganó)
    peleas.delete(miI); peleas.delete(rivalI); pintarPleito();
    difundir('perdió un pleito contra ' + rival); sucio = true; enviarEst(); return;
  }
  const tenia = vidaMax(), dondeFue = donde(yo.y); recordar();
  son.boom(); temblar(16); chispas(yo.x, yo.y, '#ffb347', 40, 10); onda(yo.x, yo.y, 4.5, '#ffd9a0', 0.7); humo(yo.x, yo.y, 18);
  S.st.muertes++; ritmoFuerte.push(Date.now());
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
  const gas = causa === 'una bolsa de gas', sg = gasSeguro();
  const titulo = causa === 'combustible' ? '💥 Te quedaste sin combustible' : gas ? '💥 Te explotó una bolsa de gas' : causa === 'la lava' ? '💥 La lava fundió tu maquinita' : causa === 'una caída' ? '💥 Te estrellaste' : '💥 Tu maquinita explotó';
  const porque = gas ? `A ${ultGolpe.m} m el gas pegó ${ultGolpe.q} y tu casco aguanta ${tenia}. Con lo que traes aguantas el gas hasta ${sg < 650 ? 'ninguna profundidad' : sg + ' m'}: mejora casco y radiador en El Taller, o vuela con dinamita la tierra que burbujea. `
    : causa === 'combustible' ? `Fue a ${dondeFue}. Regresa antes de que el medidor se ponga rojo, o lleva un tanque de reserva (tecla R). `
    : causa === 'la lava' ? `La lava pegó ${ultGolpe.q} y tu casco aguanta ${tenia}. Rodéala, vuélala con dinamita o compra radiador. ` : '';
  tarjeta(titulo, porque + 'La grúa de rescate te dejó en la superficie. ' + x, '', 14000, true);
  difundir(causa === 'combustible' ? 'se quedó sin combustible' : 'explotó (' + causa + ')');
  sucio = true; enviarEst();
}

/* ════════ Física ════════ RLR */
const solida = (x, y) => { const t = celda(x, y); return t !== 0 && t !== 6; };
// Al cruzar la orilla, la maquinita aparece del otro lado con todo y lo que venía haciendo.
function darVuelta() {
  const d = yo.x < 0 ? W : yo.x >= W ? -W : 0; if (!d) return;
  yo.x += d; ant.x += d; vis.x += d; if (yo.perf) { yo.perf.ox += d; yo.perf.tx += d; }
  camX = Math.max(0, Math.min(W - cols, yo.x - cols / 2)); panX = 0;
  campana(880, 0.5, 0.03, 'otros'); campana(1320, 0.6, 0.02, 'otros', 0.07);
  if (S && !S.fl.vuelta) { S.fl.vuelta = 1; sucio = true; tarjeta('🌎 El mundo da la vuelta', 'Saliste por un lado y entraste por el otro. Todo está conectado: también los túneles y las explosiones.', 'msj', 10000); }
}
function fisica(dt) {
  if (ceremonia) return;                         // durante el final, la maquinita la lleva el final
  if (yo.renace) { yo.renace = false; yo.x = INICIO_X; yo.y = INICIO_Y; yo.vx = yo.vy = 0; yo.perf = null; return; }
  const p = yo.perf;
  if (p) {                                   // perforando: avanza hacia la celda
    p.t += dt;
    gastar(20 / 60 * dt);
    if (yo.renace) return;
    const e = Math.min(1, p.t / p.dur);
    yo.x = p.ox + (p.tx + 0.5 - p.ox) * e; yo.y = p.oy + (p.ty + 1 - HH - p.oy) * e;
    if (Math.random() < 0.5) chispas(p.tx + 0.5, p.ty + 0.5, p.tipo === 3 ? '#ff9a3a' : p.tipo === 2 ? '#c9c5bc' : p.tipo >= 10 && p.tipo < 40 ? MIN[p.tipo - 10].col : '#a9744f', 1, 3);
    if (e >= 1) { yo.perf = null; yo.vx = yo.vy = 0; llegar(p); if (!yo.renace) seguirPerforando(p); }
    return;
  }
  // Red de seguridad: si el terreno cambió y quedé dentro de la tierra, salgo a la superficie.
  if (solida(Math.floor(yo.x), Math.floor(yo.y))) { yo.x = INICIO_X; yo.y = INICIO_Y; yo.vx = yo.vy = 0; yo.suelo = true; aviso('El terreno cambió: tu maquinita salió a la superficie.'); return; }
  const reserva = S.fuel <= 0;                // solo pasa en mundos donde no explota
  const k = reserva ? 0.5 : 1;
  const agua = celda(Math.floor(yo.x), Math.floor(yo.y)) === 6, Gf = agua ? G * 0.3 : G;     // en el agua todo pesa menos
  yo.agua = agua;
  // Subir sola: se queda subiendo sin sostener la tecla, en el cielo o dentro de un tiro. Se suelta con ↓, con la barra
  // espaciadora, o sola si topa con techo (medio segundo sin avanzar hacia arriba).
  if (crucero) { if (yo.y < cruY - 0.01) { cruY = yo.y; cruT = 0; } else if ((cruT += dt) > 0.5) crucero = false; }
  if (crucero && (teclas.aba || yo.y <= TECHO + 1)) crucero = false;
  if (crucero && S.fuel / tanque() < 0.12) { crucero = false; tarjeta('Combustible bajo', yo.y < -25 ? 'Dejaste de subir sola. Déjate caer: allá arriba casi no se gasta.' : 'Dejaste de subir sola: queda poco combustible.'); }
  if (amarreAba && (teclas.arr || yo.y >= H - 2 || S.fuel <= 0)) amarreAba = false;
  const izq = teclas.izq, der = teclas.der, arr = teclas.arr || crucero, aba = teclas.aba || amarreAba;
  const caballos = hp(), pesoMax = caballos * 29.5, peso = 1980 + kgCarga();
  const alto = Math.max(0, -(yo.y + HH));        // celdas sobre el suelo
  const vmax = (5 + brio() / 30) * k * (agua ? 0.7 : 1);
  if (izq && !der) { yo.vx -= 22 * dt; yo.dir = -1; } else if (der && !izq) { yo.vx += 22 * dt; yo.dir = 1; }
  else yo.vx *= Math.pow(yo.suelo ? 0.0004 : 0.25, dt);
  yo.vx = Math.max(-vmax, Math.min(vmax, yo.vx));
  yo.vuela = false;
  if (arr) {
    const sube = Math.max(-Gf * 0.6, 26 * (1 - peso / pesoMax)) * k * (1 + alto / 1500);   // con sobrepeso la hélice solo frena la caída
    yo.vy -= (Gf + sube) * dt; yo.vuela = true;
  }
  yo.vy += Gf * dt;
  // Aterrizaje suave: en pantalla táctil (o si se pide en Opciones), cuando viene cayendo sin tocar nada y el piso está cerca,
  // los rotorcitos frenan solos para llegar sin golpe. Gasta como volar; con sobrepeso frenan lo que pueden.
  yo.frena = false;
  if (!arr && !aba && !yo.suelo && !agua && yo.vy > 2 && cfg.caida && !yo.renace && aterrizajeSuave()) {
    const freno = 26 * (1 - peso / pesoMax) * k;
    if (freno > 0.5) {
      const piso = pisoAbajo(16), vOk = Math.sqrt(2 * G * 1.5);
      if (piso < 16 && (yo.vy * yo.vy - vOk * vOk) / (2 * freno) > piso - 0.35) { yo.vy -= (Gf + freno) * dt; yo.vuela = true; yo.frena = true; }
    }
  }
  // Sin tocar nada, la maquinita planea: saca sus rotorcitos y el aire la frena. Con ↓ los guarda y cae en picada, tres veces más rápido.
  const picada = aba && !arr && !yo.suelo;          // también bajo el agua: ahí los rotorcitos empujan hacia abajo
  if (picada) yo.vy += G * 2 * dt;
  // Al espacio (100 km) se llega en unos 10 minutos y a los 1,000 km en unos 15: la velocidad crece con la altura.
  const vsube = (6 + brio() / 20) * k + alto / 140, vcae = agua && !picada ? 5 : (36 + alto / 40) * (picada ? 3 : 1);     // el aire es más delgado arriba: se cae más rápido. El agua frena… salvo que bajes con ↓: entonces se cruza a la misma velocidad que el aire
  if (yo.vy > vcae) yo.vy = vcae + (yo.vy - vcae) * Math.exp(-(agua ? 6 : 2.2) * dt);      // la resistencia del aire: al soltar ↓ la velocidad baja poco a poco
  if (yo.vy < -vsube) yo.vy = -vsube;
  yo.picada = picada && yo.vy > 3; yo.planea = !yo.suelo && !yo.vuela && !picada && !agua && yo.vy > 3;
  // parado en la superficie no gasta: nadie explota por leer un letrero
  const quieto = yo.suelo && yo.y < 0 && !yo.vuela && Math.abs(yo.vx) < 0.5;
  // El aire se adelgaza con la altura: arriba el motor casi no gasta. Con un tanque mediano se llega al espacio.
  if (!quieto) gastar((yo.vuela ? 17 : Math.abs(yo.vx) > 0.5 ? 8 : 5) / 60 * dt / (1 + alto / 600));
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
  if (ny < TECHO) { ny = TECHO; yo.vy = Math.max(0, yo.vy); }
  yo.y = ny;
  if (yo.renace) return;

  // Entre maquinitas: en el aire rebotan y no pasa nada; en tierra, bajo la superficie, se pelean a taladro.
  yo.ataca = 0;
  for (const o of otros.values()) {
    if (!o.on || o.x === undefined || (o.fl & 8)) continue;
    const dx = o.x - yo.x, dy = o.y - yo.y, s = dx > 0 ? 1 : -1;
    if (Math.abs(dx) > 1.2 || Math.abs(dy) > 1.2) continue;
    if (!yo.suelo && Math.abs(dx) < 0.76 && Math.abs(dy) < 0.8) {               // rebote
      yo.vx = -s * (3.5 + Math.abs(yo.vx) * 0.6); yo.vy = (dy > 0 ? -1 : 1) * Math.max(3, Math.abs(yo.vy) * 0.6);
      if (tiempo - tChoque > 0.25) { tChoque = tiempo; son.golpe(); chispas((yo.x + o.x) / 2, (yo.y + o.y) / 2, '#ffffff', 8, 5); }
    } else if (cfg.pleitos !== 0 && yo.suelo && yo.y > 0.5 && !yo.perf) {
      const lado = Math.abs(dy) < 0.6 && Math.abs(dx) < 1.1 && ((izq && dx < 0) || (der && dx > 0)), abajo = aba && Math.abs(dx) < 0.6 && dy > 0 && dy < 1.15;
      if (!lado && !abajo) continue;
      yo.ataca = abajo ? 2 : s; yo.pelea = tiempo;
      if (lado) { yo.vx = 0; if (Math.abs(dx) < 0.74) yo.x = o.x - s * 0.74; }  // no se enciman: quedan taladro contra casco
      const cx = yo.x + (lado ? s * 0.55 : 0), cy = yo.y + (abajo ? 0.55 : 0.1);
      // Qué clase de golpe es: 0 de frente · 1 por la espalda (pega 50 % más) · 2 desde arriba (50 % más) · 3 taladro contra taladro (la mitad, y los dos salen rebotados)
      const suTaladro = (o.fl & 4) && !(o.fl & 16), meMira = (o.fl & 1 ? 1 : -1) === -s, k = abajo ? 2 : suTaladro && meMira ? 3 : !meMira ? 1 : 0;
      if (Math.random() < dt * 45) chispas(cx, cy, k === 3 ? '#ffffff' : '#ffd76a', 1, 7);          // chispas todo el tiempo que dura el contacto
      if (tiempo - tAtaque > 0.4) {
        tAtaque = tiempo; const q = Math.round(pot() * [1, 1.5, 1.5, 0.5][k]);
        enviar({ t: 'golpe', a: o.i, q, k, x: Math.round(yo.x), y: Math.round(yo.y) }); enviarVida();
        rival = o.n; rivalI = o.i; if (!enPleito(miI)) { peleas.set(miI, { con: o.i, h: tiempo }); peleas.set(o.i, { con: miI, h: tiempo }); ritmoFuerte.push(Date.now()); } else { peleas.get(miI).h = tiempo; (peleas.get(o.i) || {}).h = tiempo; }
        chispas(cx, cy, '#fff3b0', 16, 8); chispas(cx, cy, '#ff9a3a', 8, 5); chispas(cx, cy, '#d7dbe0', 6, 9); onda(cx, cy, k === 3 ? 1.6 : 0.9, '#fff3b0', 0.3); temblar(k === 3 ? 6 : 3); golpeFx = Math.max(golpeFx, 0.15);
        flota(o.x, o.y - 1.25, '−' + Math.max(1, Math.round(q * 0.25)) + ['', ' · ¡por la espalda!', ' · ¡desde arriba!', ' · ¡choque de taladros!'][k], k === 3 ? '#ffffff' : '#ffd76a');
        if (k === 3) { son.choque(); yo.vx = -s * 6; yo.vy = -3; } else son.piedra();
      }
    }
  }
  // empezar a perforar
  if (yo.suelo && !reserva && !arr && !yo.ataca) {
    const cx = Math.floor(yo.x), cy = Math.floor(yo.y);
    if (aba && !izq && !der) perforar(cx, cy + 1);
    else if (izq && !der && (toca < 0 || yo.x - HW - 0.16 <= cx)) perforar(cx - 1, cy);
    else if (der && !izq && (toca > 0 || yo.x + HW + 0.16 >= cx + 1)) perforar(cx + 1, cy);
  }
  // Las últimas celdas del Jardín del Fondo (y el Corazón, que cuelga en medio de su caverna) se quitan de cualquier lado,
  // también volando y hacia arriba: basta con empujar contra ellas. Si no, alguna queda imposible de alcanzar.
  else if (!yo.perf && !reserva && !yo.ataca && yo.y > EDEN0 - 2 && edenQuedan <= 33) {
    const cx = Math.floor(yo.x), cy = Math.floor(yo.y), ultima = (x, y) => y >= EDEN0 && y < H && solida(x, y) && celda(x, y) !== 46;
    if (der && !izq && yo.x + HW + 0.2 >= cx + 1 && ultima(cx + 1, cy)) perforar(cx + 1, cy);
    else if (izq && !der && yo.x - HW - 0.2 <= cx && ultima(cx - 1, cy)) perforar(cx - 1, cy);
    else if (arr && !izq && !der && yo.y - HH - 0.2 <= cy && ultima(cx, cy - 1)) perforar(cx, cy - 1);
    else if (aba && !izq && !der && ultima(cx, cy + 1)) perforar(cx, cy + 1);
  }
}
// Con la tecla apretada, al terminar una celda arranca la siguiente en el mismo paso: sin parones.
function seguirPerforando(p) {
  if (S.fuel <= 0 || teclas.arr) return;
  const { izq, der, aba } = teclas;
  if (aba && !izq && !der) perforar(p.tx, p.ty + 1);
  else if (solida(p.tx, p.ty + 1)) { if (izq && !der) { yo.dir = -1; perforar(p.tx - 1, p.ty); } else if (der && !izq) { yo.dir = 1; perforar(p.tx + 1, p.ty); } }
}
// Hasta qué profundidad aguanta una bolsa de gas lo que traes puesto (el gas empieza a los 650 m).
const GAS_K = 3.4;        // cada cuántos metros bajo los 410 sube un punto el golpe del gas (era 2.05: pegaba 65 % más)
const golpeGas = (m) => Math.max(0, (Math.min(m, 1000) - 410) / GAS_K + Math.max(0, m - 1000) / 20);
function gasSeguro() {
  if (!cfg.gas) return 99999;
  const x = vidaMax() / ((1 - rad()) * MULT[cfg.gas]), tope = 590 / GAS_K;
  return Math.floor(x <= tope ? 410 + GAS_K * x : 1000 + 20 * (x - tope));
}
const danoLava = () => [41, 58].map((q) => Math.round(q * (1 - rad()) * MULT[cfg.lava]));
const danoGas = (y) => Math.round(golpeGas((y + 1) * 2) * (1 - rad()) * MULT[cfg.gas]);
const pistaGas = () => cfg.verGas === 2 || (cfg.modo === 'clasico' && !cfg.verGas);     // el gas se insinúa con burbujas
function gastar(l) {
  if (!S || S.fuel <= 0) return;
  S.fuel -= l;
  if (S.fuel <= 0) { S.fuel = 0; if (cfg.comb) morir('combustible'); else tarjeta('Entraste en reserva', 'Avanzas despacio y no perforas hasta cargar combustible.'); }
}
const aterrizajeSuave = () => op.suave === 1 || (op.suave !== 0 && tactil);
// Con el dedo, las caídas no quitan casco (Ricardo, 4-oct: con 10 de casco cada golpe lo dejaba en 3 y no había forma de jugar).
// Se puede encender en Opciones → Golpes de caída. Con teclado siguen como siempre.
const golpesDeCaida = () => op.golpes === 1 || (op.golpes !== 0 && !tactil);
function pisoAbajo(n) {                       // celdas libres bajo las ruedas, hasta n
  const x0 = Math.floor(yo.x - HW + 0.02), x1 = Math.floor(yo.x + HW - 0.02), pie = yo.y + HH, y0 = Math.floor(pie);
  for (let y = y0; y < y0 + n; y++) for (let x = x0; x <= x1; x++) if (solida(x, y)) return Math.max(0, y - pie);
  return n;
}
function aterrizar(v) {
  if (yo.agua) return;                         // el agua amortigua: bajo el agua no hay golpe de caída
  const h = v * v / (2 * G);
  if (h < 2) return;
  const d = h < 3 ? 3 : h < 5 ? 4 : h < 9 ? 5 : h < 17 ? 6 : h < 46 ? 7 : 8;
  if (!golpesDeCaida()) { if (h >= 5) { temblar(Math.min(6, h / 6)); ruido(0.12, 0.08, 'peligro', 220, 'lowpass', 0.7); } return; }      // aterriza sin daño: solo se siente el golpe
  son.golpe();
  danar(d * MULT[cfg.caida], 'una caída');
  if (h >= 46 && !yo.renace && cfg.caida) S.fl.caida = 1;
}
let ultNo = 0, tMuerde = 0, tAvisoPiedra = -9, tChoque = -9, tAtaque = -9, rival = '', rivalI = -1;
/* ════════ El pleito ════════ RLR */
// Taladro contra casco, bajo tierra. Los dos ven las dos vidas; todo el mundo se entera de que empezó y de quién ganó;
// quien mira puede irse a verlo. Perder no cuesta nada: vuelves arriba con todo.
const peleas = new Map();          // i → { con, h }: quién pelea con quién y desde cuándo (lo sabe todo el mundo)
let tVida = -9;
const enPleito = (i) => { const p = peleas.get(i); return p && tiempo - p.h < 6; };
function enviarVida(ya) { if (!S || !conectado) return; if (!ya && tiempo - tVida < 0.15) return; tVida = tiempo; enviar({ t: 'vida', v: Math.max(0, Math.ceil(S.vida)), mx: vidaMax() }); }
function empezarPleito(d) {
  const mio = d.a === miI || d.b === miI, otro = d.a === miI ? d.b : d.a;
  peleas.set(d.a, { con: d.b, h: tiempo }); peleas.set(d.b, { con: d.a, h: tiempo });
  if (mio && !soloVer) { rival = nombreDe(otro); rivalI = otro; yo.pelea = tiempo; son.pleito(); temblar(5); flota(yo.x, yo.y - 1.6, '⚔️ ¡Pleito!', '#ff6b5a'); enviarVida(true); pintarPleito(); return; }
  // los demás: aviso para irse a ver
  son.pleito(0.5);
  const na = nombreDe(d.a), nb = nombreDe(d.b), dnd = donde(d.y);
  notaChat('⚔️ Pleito: ' + na + ' contra ' + nb + ', a ' + dnd);
  tarjeta('⚔️ ¡Pleito! ' + na + ' contra ' + nb, 'A ' + dnd + '. ' + (soloVer ? 'Toca «Ver el pleito» en la barra de arriba para irte a verlo.' : 'Pulsa M: en el mapa se ven con ⚔️.'), 'msj', 9000, true);
  if (soloVer) pintarVer();
}
function terminarPleito(d) {
  peleas.delete(d.g); peleas.delete(d.p);
  if (d.g === miI || d.p === miI) { pintarPleito(); if (soloVer) pintarVer(); return; }      // los dos ya tienen su tarjeta
  notaChat('🏆 ' + nombreDe(d.g) + ' le ganó el pleito a ' + nombreDe(d.p));
  tarjeta('🏆 ' + nombreDe(d.g) + ' ganó el pleito', nombreDe(d.p) + ' vuelve a la superficie con todo lo suyo.', 'msj', 8000);
  if (soloVer) pintarVer();
}
// La barra de arriba: mi vida y la de mi rival (o, si estoy mirando, las de los dos que pelean)
function pintarPleito() {
  const el = $('#pleito');
  let a = null, b = null;
  if (!soloVer && S && rivalI >= 0 && enPleito(miI)) { a = { n: miNombre, v: S.vida, mx: vidaMax() }; const o = otros.get(rivalI); b = { n: rival, v: o && o.vida !== undefined ? o.vida : null, mx: o && o.mx || 1 }; }
  else if (soloVer && veo >= 0 && enPleito(veo)) { const o = otros.get(veo), p = peleas.get(veo), r = otros.get(p.con); a = { n: o?.n || '', v: o?.vida ?? null, mx: o?.mx || 1 }; b = { n: r?.n || '', v: r?.vida ?? null, mx: r?.mx || 1 }; }
  if (!a) { el.classList.remove('on'); return; }
  el.classList.add('on');
  for (const [lado, d] of [['.yo', a], ['.el', b]]) {
    const L = el.querySelector(lado), bar = L.querySelector('.barra'), f = d.v === null ? 1 : Math.max(0, Math.min(1, d.v / Math.max(1, d.mx)));
    L.querySelector('b').textContent = d.n; bar.firstChild.style.width = f * 100 + '%'; bar.lastChild.textContent = d.v === null ? '…' : Math.ceil(d.v) + ' / ' + d.mx;
    bar.classList.toggle('poca', f < 0.5 && f >= 0.25); bar.classList.toggle('casi', f < 0.25);
    if (L._f !== undefined && f < L._f) { bar.classList.remove('golpe'); void bar.offsetWidth; bar.classList.add('golpe'); } L._f = f;
  }
}
// La vida sobre la maquinita, durante el pleito (la ven todos)
function barraVida(px, py, v, mx, col) {
  const an = T * 1.5, al = Math.max(4, T * 0.11), x = px - an / 2, y = py - T * 0.95, f = v === null ? 1 : Math.max(0, Math.min(1, v / Math.max(1, mx)));
  g.fillStyle = '#000b'; g.beginPath(); g.roundRect(x - 2, y - 2, an + 4, al + 4, 3); g.fill();
  g.fillStyle = '#2a0b08'; g.fillRect(x, y, an, al);
  g.fillStyle = f < 0.25 ? '#ff6b5a' : f < 0.5 ? '#ffd23f' : col || '#6fdc7a'; g.fillRect(x, y, an * f, al);
}
// La piedra: cinco durezas según la zona. Cada una pide un taladro mínimo (nivel de la pieza) y tiene su color.
const PIEDRA = [[4, 'gris', ['#77726d', '#56524e', '#9a948e', '#3b3836']], [7, 'azulada', ['#5f8196', '#456275', '#8fb0c4', '#26383f']], [9, 'morada', ['#7d6796', '#5d4a74', '#a995c2', '#33263f']], [12, 'índigo', ['#4d5aa3', '#39437d', '#7f8cd6', '#1d2247']], [15, 'negra', ['#3d3438', '#2a2226', '#6b565c', '#120c0e']]];
const durezaDe = (m) => (m < 1000 ? 0 : m < 2000 ? 1 : m < 4000 ? 2 : m < 8000 ? 3 : 4);
// Cuánto tarda tu taladro en una piedra a esa profundidad: 1.5 s si apenas le alcanza, 0.6 s si le sobran tres niveles. 0 = no entra.
// Una de cada catorce piedras es una geoda: por fuera igual a las demás, salvo un brillo en una grieta. Solo el taladro la abre.
const esGeoda = (x, y) => { const i = y * W + ((x % W) + W) % W; return !!(geodas[i >> 3] & (1 << (i & 7))); };
const tiempoPiedra = (m) => { const sobra = S.eq[0] - PIEDRA[durezaDe(m)][0]; return sobra < 0 ? 0 : 1.5 - 0.9 * Math.min(1, sobra / 3); };
function perforar(x, y) {
  const t = celda(x, y);
  if (t === 0 || t === 6) return;
  if (t === 46) {                                   // el Corazón se abre al final, y solo desde arriba: es la unión
    medirEden();
    if (edenQuedan > 1 || y !== Math.floor(yo.y) + 1) { if (tiempo - ultNo > 1.2) { ultNo = tiempo; son.latido ? son.latido() : son.piedra(); flota(x + 0.5, y - 0.2, edenQuedan > 1 ? '❤️ El Corazón se abre al final: quita primero todo lo demás' : '❤️ Párate encima del Corazón y perfora hacia abajo', '#ff9a8a'); } return; }
  }
  const tp = t === 2 ? tiempoPiedra((y + 1) * 2) : 0;
  if (t === 5 || (t === 2 && !tp)) {
    if (tiempo - ultNo > 0.4) {
      son.piedra(); ultNo = tiempo;
      if (t === 2) { const D = PIEDRA[durezaDe((y + 1) * 2)], falta = PZ[0].niv[D[0]][0]; if (tiempo - tAvisoPiedra > 6) { tAvisoPiedra = tiempo; flota(x + 0.5, y - 0.1, 'Piedra ' + D[1] + ' · pide ' + falta, '#d9dde4'); }
        if (!S.fl.piedra) { S.fl.piedra = 1; tarjeta('Piedra', `Tu taladro no entra. Rodéala, vuélala con dinamita (D) o consigue ${falta} en El Taller: con ese ya la perforas.`, '', 9000); } }
    }
    return;
  }
  const m = (y + 1) * 2;
  let dur = Math.max(0.07, 0.6 * (20 / pot()) * (1 + 4 * Math.min(m, 1000) / 1000 + Math.max(0, m - 1000) / 1500));
  if (t === 2) dur = tp;                             // la piedra tarda lo suyo, sin importar la profundidad dentro de su zona
  if (t === 3) { dur = Math.max(0.6, dur * (cfg.lava ? 1.6 : 3)); son.lava(); }          // cortar lava toma su tiempo: al menos 0.6 s, para que se vea
  yo.perf = { tx: x, ty: y, t: 0, dur, tipo: t, ox: yo.x, oy: yo.y, idx: y * W + (x + W) % W };
  cavar([[x, y]]); if (tiempo - tMuerde > 0.11) { tMuerde = tiempo; son.muerde((t >= 10 && t < 40) || t === 2); }
  S.st.cavadas++; if (ritmo.length < 600) ritmo.push(Date.now());
}
function llegar(p) {
  const t = p.tipo, x = p.tx + 0.5, y = p.ty + 0.5;
  if (t >= 10 && t < 40) {
    const i = t - 10;
    if (nCarga() < bodega()) {
      S.carga[i]++; S.st.rec[i]++; son.mineral(i); chispas(x, y, MIN[i].col, 12, 5);
      flota(x, p.ty - 0.15, '+ ' + MIN[i].n + ' · ' + fmt(MIN[i].v), MIN[i].col);
      recientes.set(p.idx, [t, Date.now()]);
      if (S.st.rec[i] === 1) { son.descubre(); tarjeta('¡Descubriste ' + MIN[i].n + '!', (i === 3 ? 'No es pirita: es oro de verdad. ' : '') + 'Vale ' + fmt(MIN[i].v) + ' la pieza.'); difundir('descubrió ' + MIN[i].n); }
      const [vx, vy] = veta(Math.floor(p.ty / 75));
      if (Math.abs(p.tx - vx) <= 1 && Math.abs(p.ty - vy) <= 1 && !S.fl.veta) { S.fl.veta = 1; tarjeta('✨ ¡Veta madre!', 'Un racimo entero del mejor mineral de la zona.'); }
      if (nCarga() === bodega()) { tarjeta('Bodega llena', 'Sube a vender: lo que perfores ahora se pierde.'); son.alarma(); }
    } else { flota(x, p.ty - 0.15, 'Bodega llena · se perdió ' + MIN[i].n, '#ff8a7a'); son.no(); }
  } else if (t === 2 && esGeoda(p.tx, p.ty)) {
    const v = Math.round(3000 * Math.max(1, ((p.ty + 1) / 500) ** 3) / 100) * 100;
    S.d += v; S.tot += v; S.st.geodas = (S.st.geodas || 0) + 1;
    flota(x, p.ty - 0.15, '+ ' + fmt(v) + ' · Geoda', '#d9b8ff'); son.mineral(6); chispas(x, y, '#c9a0ff', 22, 7); chispas(x, y, '#ffffff', 8, 5);
    if (S.st.geodas === 1) tarjeta('💜 ¡Una geoda!', 'Piedra por fuera, cristales por dentro. Se reconocen por el brillo morado en una grieta. Solo se abren con taladro: la dinamita las hace polvo.', '', 10000);
  } else if (t === 50) {
    const id = colec.get(p.idx), k = Math.floor(id / 3);
    if (id !== undefined && !hallados[id]) {
      hallados[id] = 1; enviar({ t: 'col', k: id });
      const van = hallados[k * 3] + hallados[k * 3 + 1] + hallados[k * 3 + 2], v = valorCol(k) * (van === 3 ? 2 : 1);
      S.d += v; S.tot += v; S.st.col = (S.st.col || 0) + 1;
      flota(x, p.ty - 0.15, '+ ' + fmt(v) + ' · ' + COLEC[k][1], '#ffe9a8'); recientes.set(p.idx, [50, Date.now(), v]);
      tarjeta(`${COLEC[k][0]} ${COLEC[k][1]} · ${van} de 3`, (van === 3 ? '¡Los tres! Paga doble: ' : 'Para la colección del mundo: ') + fmt(v) + `. El equipo lleva ${nHallados()} de ${NCOL}.`, '', 9000);
      son.logro(); chispas(x, y, '#ffe9a8', 30, 7); onda(x, y, 2, '#ffe9a8', 0.5); difundir(`encontró ${COLEC[k][0]} ${COLEC[k][1]} (${van} de 3)`); pintarHud(true);
    }
  } else if (t >= 40) {
    const h = HALL[t - 40], v = valorHall(t - 40, p.ty);
    S.d += v; S.tot += v; S.st.hall[t - 40]++;
    flota(x, p.ty - 0.15, '+ ' + fmt(v) + ' · ' + h.n, '#ffd23f');
    recientes.set(p.idx, [t, Date.now(), v]);
    if (h.q >= 5e4) tarjetaCompartir('🏺 ¡' + h.n + '!', 'Hallazgo: ' + fmt(v) + ' al instante. Cuéntalo.', `🏺 Encontré ${h.n} a ${num(Math.round(p.ty))} m bajo tierra en Mina.\nEntra a mi mundo y baja conmigo: cada quien con su maquinita, gratis y sin registro.\n${ligaInvitacion()}`, 14000, true); else tarjeta('🏺 ¡' + h.n + '!', 'Hallazgo: ' + fmt(v) + ' al instante.'); son.logro(); chispas(x, y, '#ffd23f', 24, 7);
    if (t === 46) { onda(x, y, 7, '#ff8a5a', 1.2); temblar(12); son.espacio(); }
    difundir('encontró ' + h.n); evento('hall');
  } else if (t === 3 && cfg.lava) {
    danar((Math.random() < 0.5 ? 58 : 41) * (1 - rad()) * MULT[cfg.lava], 'la lava');
    ruido(0.8, 0.16, 'peligro', 4200, 'highpass', 0.7, 0, 9000); chispas(x, y, '#ff7a1a', 20, 6); onda(x, y, 1.3, '#ffb347', 0.35);
    if (op.part) for (let i = 0; i < 16; i++) parts.push({ x: yo.x + (Math.random() - 0.5) * 0.6, y: yo.y - 0.2, vx: (Math.random() - 0.5) * 3, vy: -1.5 - Math.random() * 2.5, t: 0.7 + Math.random() * 0.6, col: '#f3ead8', g: 2, gr: -1.5 });      // el radiador avienta el calor
    if (!yo.renace) S.fl.lava = 1;
  } else if (t === 4 && cfg.gas) {
    const lista = [];
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) lista.push([p.tx + a, p.ty + b]);
    cavar(lista); son.gas(); chispas(x, y, '#7dff6b', 40, 9); onda(x, y, 2.6, '#b6ff9e'); humo(x, y, 10);
    danar(danoGas(p.ty), 'una bolsa de gas');
    if (!yo.renace) S.fl.gas = 1;
  }
  if (tiempo - tBicho > 40 && bichos.length < 20 && p.ty > 20 && Math.random() < 0.6) for (const [a, b] of [[0, 1], [-1, 0], [1, 0], [0, -1]]) if (natural(p.tx + a, p.ty + b)) { soltarBichos(p.tx + a, p.ty + b); break; }
  sucio = true;
}

/* ════════ Objetos ════════ */
function usar(i) {
  if (!S || menu || pausa) return;
  if (!S.obj[i]) { son.no(); return; }
  if (i >= 4 && yo.perf) { aviso('Termina de perforar para teletransportarte.'); son.no(); return; }
  if (i === 0) { if (S.fuel >= tanque()) return; S.fuel = Math.min(tanque(), S.fuel + 25); son.combustible(); }
  else if (i === 1) { if (S.vida >= vidaMax()) return; S.vida = Math.min(vidaMax(), S.vida + 30); son.compra(); }
  else if (i === 2 || i === 3) {
    const r = i === 2 ? 1 : 2, cx = Math.floor(yo.x), cy = Math.floor(yo.y), lista = [];
    for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) if (celda(cx + a, cy + b) !== 46) lista.push([cx + a, cy + b]);
    flota(yo.x, yo.y - 1.2, '¡Fuego en el barreno!', '#ffd9a0'); cavar(lista); son.boom(); temblar(i === 2 ? 9 : 14); chispas(yo.x, yo.y, '#ffb347', 50, i === 2 ? 9 : 13); onda(yo.x, yo.y, i === 2 ? 2.4 : 3.9); humo(yo.x, yo.y, i === 2 ? 10 : 18);
    S.st.expl++; evento('expl');
  } else {
    recordar(); son.tele(); chispas(yo.x, yo.y, '#6ec3ff', 30, 8);
    yo.x = INICIO_X; yo.vx = yo.vy = 0;
    yo.y = i === 4 && Math.random() < 0.6 ? -(8 + Math.random() * 6) : INICIO_Y;
  }
  S.obj[i]--; sucio = true; pintarHud(true);
}

/* ════════ Red: el mundo compartido ════════ RLR */
let ws = null, reintento = 500, bautizo = null, tCaido = 0, llaveAntes = '';
// Mirar sin jugar: se entra por una ficha (no por la liga del mundo), se ve todo en vivo y no se manda nada.
let soloVer = false, verFicha = '', veo = -1, verFallos = 0, miPid = '', miVer = '', mirones = 0, finMundo = null;
function enviar(o) { if (!soloVer && ws && ws.readyState === 1) ws.send(JSON.stringify(o)); }
function enviarEst() {
  if (!S || !conectado) return;
  if (yo.renace) { S.x = INICIO_X; S.y = INICIO_Y; } else { S.x = yo.x; S.y = yo.perf ? yo.perf.oy : yo.y; }
  S.v = (S.v || 0) + 1; S.mu = mundoId;          // el servidor nunca pisa un estado nuevo con uno viejo
  enviar({ t: 'est', e: S, rec: S.rec, tot: Math.floor(S.tot) });
  sucio = false;
}
const bufPos = new Uint8Array(10), datoPos = new DataView(bufPos.buffer); let ultPos = '';
// Qué teclas está apretando (o apretó hace un instante): ← → ↑ ↓, barra, y las letras de acción. Viajan en 16 bits.
const TECLAS_VER = ['izq', 'der', 'arr', 'aba', ' ', 'r', 'n', 'd', 'p', 'q', 't', 'c', 's', 'a', 'g', 'm'];
const apretadas = new Map();
addEventListener('keydown', (e) => { if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') apretadas.set(e.key.length === 1 ? e.key.toLowerCase() : e.key, performance.now()); }, true);
addEventListener('keyup', (e) => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, t = apretadas.get(k); if (t) apretadas.set(k, -t); }, true);
function mascaraTeclas() {
  const ahora = performance.now(); let b = 0;
  TECLAS_VER.forEach((k, i) => { if (i < 4 ? teclas[k] : (() => { const t = apretadas.get(k); return t > 0 || (t < 0 && ahora + t < 320); })()) b |= 1 << i; });
  return b;
}
function enviarPos() {
  if (!conectado || soloVer || !(mirones || [...otros.values()].some((o) => o.on))) return;
  const x = Math.round(yo.x * 256), y = Math.round(yo.y * 64);
  const f = (yo.dir > 0 ? 1 : 0) | (yo.vuela ? 2 : 0) | (yo.planea || (yo.agua && yo.picada) ? 32 : 0) | (tiempo - (yo.pelea || -9) < 0.7 ? 64 : 0) | (yo.perf || yo.ataca ? 4 : 0) | (menu || pausa ? 8 : 0) | ((yo.perf && yo.perf.ty > Math.floor(yo.perf.oy)) || yo.ataca === 2 ? 16 : 0);
  const tk = mirones ? mascaraTeclas() : 0, k = x + ',' + y + ',' + f + ',' + tk;
  if (k === ultPos) return; ultPos = k;
  bufPos[0] = 1; datoPos.setUint16(1, x, true); datoPos.setInt32(3, y, true); bufPos[7] = f; datoPos.setUint16(8, tk, true);
  ws.send(bufPos);
}
const dePend = +(location.search.match(/[?&]de=(\d{1,2})/) || [])[1]; const vengoDe = Number.isFinite(dePend) ? dePend : -1;      // ?de=3: llegué con la liga de la maquinita 3
function hola(extra) { enviar({ t: 'hola', k: miK, ...(extra || {}), ...(vengoDe >= 0 ? { de: vengoDe } : {}), ...(duenos[mundoId] ? { d: duenos[mundoId] } : {}) }); }
/* ════════ Compartir: el ADN de invitar ════════ RLR */
// La liga del mundo lleva quién la manda (?de=): quien llega ve quién lo invitó, y quien invitó se entera de que llegó.
let cita = null, tCompartirCard = 0, bienvenidaDe = 0;
const ligaInvitacion = () => location.origin + '/' + mundoId + (miI >= 0 ? '?de=' + miI : '');
const horaCitaTx = (h) => { const t = new Date(h), T = horaTorreon(), p = {}; for (const x of new Intl.DateTimeFormat('en-US', { timeZone: 'America/Monterrey', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(t)) p[x.type] = x.value; const H = +p.hour % 24, M = +p.minute, hoy = p.month + '-' + p.day === T.md; const man = (() => { const d = new Date(Date.UTC(T.y, T.mes - 1, T.dia + 1)); return String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0') === p.month + '-' + p.day; })(); const hl = t.getHours(), ml = t.getMinutes(), local = hl !== H || ml !== M ? ` (${hl % 12 || 12}${ml ? ':' + String(ml).padStart(2, '0') : ''} ${hl < 12 ? 'am' : 'pm'} en tu reloj)` : ''; return (hoy ? 'hoy' : man ? 'mañana' : 'el ' + +p.day + ' de ' + MESES[+p.month - 1]) + ' a las ' + (H % 12 || 12) + (M ? ':' + String(M).padStart(2, '0') : '') + (H < 12 ? ' am' : ' pm') + ' hora de Torreón' + local; };
function mensajeInvitacion() {
  const n = [...otros.values()].length + 1, nombre = cfg.nombre ? '«' + cfg.nombre + '»' : 'mi mundo de Mina';
  const donde = S && S.rec >= 50 ? `Voy a ${num(S.rec)} m bajo tierra en ${nombre}` : `Acabo de abrir ${nombre}`;
  return `🚜 Ven a excavar conmigo en Mina.\n${donde}${n > 1 ? ' y ya somos ' + n : ''}. Entras y ya estás jugando: gratis, sin registro, en el cel o en la compu, cada quien con su maquinita en el mismo mundo.` + (cita ? `\n🕘 Nos vemos ${horaCitaTx(cita.h)}.` : '') + `\n${ligaInvitacion()}`;
}
const textoInv = () => ($('#msjInv') && $('#msjInv').value.trim()) || mensajeInvitacion();
function porWhatsApp(texto) { window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank', 'noopener'); }
// Compartir por donde la persona prefiera: en el teléfono, la hoja del sistema (WhatsApp, Mensajes, lo que tenga); si no, WhatsApp web.
function compartirInvitacion(texto) {
  const t = texto || mensajeInvitacion(); subirFotos(true);
  if (navigator.share && tactil) navigator.share({ text: t }).catch(() => {}); else porWhatsApp(t);
}
// Una tarjeta con botón para compartir: a lo más una cada 20 minutos, salvo los hitos (que se piden).
function tarjetaCompartir(titulo, texto, mensaje, ms = 14000, siempre = false) {
  if (!siempre && Date.now() - tCompartirCard < 20 * 60000) return; tCompartirCard = Date.now();
  tarjeta(titulo, texto, 'msj', ms, false, { t: tactil ? '📤 Compartir' : '📲 Mandar por WhatsApp', f: () => compartirInvitacion(mensaje) });
}
// Si llevas cinco minutos jugando y en este mundo nunca ha entrado nadie más: una sola vez, en la superficie, con calma.
function invitarGente() {
  if (!S || !listo || soloVer || menu || otros.size || yo.y > 2 || !yo.suelo || Date.now() - tInicioMundo < 300000) return;
  S.fl.inv = S.fl.inv || {}; if (S.fl.inv[mundoId]) return; S.fl.inv[mundoId] = 1; sucio = true;
  tarjetaCompartir('👥 Aquí cabe más gente', 'Este mundo es tuyo solo. Manda la liga a alguien: entra sin registro, con su propia maquinita, y cada maquinita nueva le da $500 a todos. El mundo se queda tal cual cuando se van: vuelven cuando quieran.', null, 16000, true);
}
let tInicioMundo = Date.now();
function conectar() {
  ws = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + (soloVer ? '/ws/ver/' + verFicha : '/ws/' + mundoId));
  ws.binaryType = 'arraybuffer';
  ws.onopen = () => { reintento = 500; red.sinEco = 0; if (!soloVer) hola(bautizo); };
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
  if (soloVer && !listo && ++verFallos >= 3) return pantallaFinal('Esta transmisión ya no existe', 'La liga para mirar dejó de servir, o el mundo se cerró a quienes miran.');
  tCaido = tCaido || Date.now();
  setTimeout(() => { if (!conectado && listo) $('#aviso-red').style.display = 'block'; }, 3000);      // sin señal se sigue jugando: todo queda en este equipo y se manda al volver
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
  if (b[0] !== 1 || b.length < 9) return;
  const o = otros.get(b[1]); if (!o) return;
  // Cada posición se guarda con su hora de llegada; se dibuja un instante atrás, entre dos posiciones reales.
  const dato = new DataView(b.buffer, b.byteOffset), t = performance.now(), x = dato.getUint16(2, true) / 256, y = dato.getInt32(4, true) / 64, fl = b[8];
  const q = o.b || (o.b = []), u = q[q.length - 1];
  if (u && t - u.t < 300) o.iv = o.iv ? o.iv * 0.85 + (t - u.t) * 0.15 : t - u.t;      // cada cuánto llegan sus posiciones: de eso depende qué tan «en vivo» se le puede dibujar
  if (u && t - u.t > 400) q.push({ t: t - 66, x: u.x, y: u.y, fl: u.fl });      // estuvo quieta: que no se deslice desde lejos
  q.push({ t, x, y, fl }); if (q.length > 24) q.shift();
  o.on = 1; if (o.x === undefined) { o.x = x; o.y = y; o.fl = fl; }
  if (b.length >= 11) { o.tk = dato.getUint16(9, true); o.tkT = t; }
}
// Lo que hacen los demás se ve y se oye, según qué tan cerca esté.
function efectoAjeno(c) {
  const i0 = c[c.length >> 1], x = i0 % W + 0.5, y = Math.floor(i0 / W) + 0.5, lejos = Math.hypot(x - yo.x, y - yo.y);
  if (lejos > 34) return;
  if (c.length >= 5) { chispas(x, y, '#ffb347', 30, 9); onda(x, y, c.length > 12 ? 3.9 : 2.4); humo(x, y, 8); temblar(Math.max(0, 10 - lejos * 0.6)); if (lejos < 26) son.boom(Math.max(0.12, 1 - lejos / 26), 'otros'); }
  else { chispas(x, y, '#a9744f', 6, 3); if (lejos < 12) ruido(0.07, 0.07 * (1 - lejos / 12), 'otros', 900, 'bandpass', 1); }
}
const red = { rtt: 0, lenta: false, retraso: 135, pingT: 0, sinEco: 0 };
const duenos = leer('mina_duenos', {});
const nombreDe = (i) => (i === miI ? miNombre : otros.get(i)?.n || 'Alguien');
function recibir(d) {
  if (mapaEspera && d.t !== 'mundo' && d.t !== 'mira') { mapaEspera.push(d); return; }
  switch (d.t) {
    case 'nuevo': {            // el mundo no conoce esta maquinita: nace aquí mismo, ya bautizada, sin preguntar nada
      const antes = leer('mina_maq_antes', null);
      if (antes && antes.k && antes.k !== miK) {       // …salvo que haya pegado un código que no era de ninguna: regresa a la suya
        escribir('mina_maq', antes); localStorage.removeItem('mina_maq_antes'); escribir('mina_nota', 'Ese código no es de ninguna maquinita. Sigues con la tuya.');
        return location.reload();
      }
      bautizo = bautizo || (maqLocal && maqLocal.n ? { n: maqLocal.n, m: maqLocal.m | 0 } : nombreNuevo());
      return hola(bautizo);
    }
    case 'pinta': { if (d.i === miI) { miPinta = d.p || {}; miMe = d.me | 0; } else { const o = otros.get(d.i); if (o) { o.p = d.p || {}; o.me = d.me | 0; } } edenE = null; if (menu === 'pin') pintarMenu(); return; }
    case 'bocina': { const o = otros.get(d.i); if (!o || !o.on || o.x === undefined) return; const dist = Math.hypot(o.x - yo.x, o.y - yo.y); if (dist < 40) claxon(d.b | 0, Math.max(0.15, 1 - dist / 40), 'otros'); return; }
    case 'nom': {              // alguien rebautizó su maquinita o le cambió el modelo
      if (d.i === miI) {
        const viejo = miNombre; miNombre = d.n; miModelo = d.m; guardarMundo(); dugCambios++;
        if (soyCreador && cfg.nombre === 'Mundo de ' + viejo) { cfg = { ...cfg, nombre: 'Mundo de ' + d.n }; enviar({ t: 'cfg', cfg }); }
      } else { const o = otros.get(d.i); if (o) { o.n = d.n; o.m = d.m; } }
      edenE = null; bloques.clear();
      pintarTabla(); if (menu === 'menu' && document.activeElement?.tagName !== 'INPUT') pintarMenu();
      return;
    }
    case 'revocado': {        // quien creó el mundo le quitó el permiso: puede mirar y volver a pedirlo
      inicio(`<header><h2>🔒 Ya no tienes permiso en este mundo</h2></header><div class="cuerpo"><p>Quien lo creó te quitó el permiso para jugar aquí. Tu maquinita sigue siendo tuya, con todo lo que trae, y entra a cualquier otro mundo.</p><p>${d.ver ? '<button id="bMirar">👁 Mirar y pedir permiso</button> ' : ''}<button class="s" id="bIr">Ir a mis mundos</button></p></div>`);
      if ($('#bMirar')) $('#bMirar').onclick = () => (location.href = '/ver/' + d.ver);
      $('#bIr').onclick = () => (location.href = '/?mundos');
      return;
    }
    case 'noexiste': quitarMundo(mundoId); if (deCasa) return location.replace('/'); return pantallaFinal('Este mundo no existe', 'Puede que lo hayan borrado o que la liga esté incompleta.');
    case 'mira': return conMapa(d, iniciarVer);
    case 'fin': if (d.piedras) edenPiedras = d.piedras; if (!S || d.r !== remin) return; if (!(S.fl.edenF && S.fl.edenF[mundoId + '|' + remin]) && !ceremonia) finDelMundo(d.i, d); else if (sinMineral !== remin) vaciarMinerales(); return;
    case 'chat': if (d.id && typeof d.x === 'string') agregarChat(d); return;
    case 'chatMas': return chatViejos(d.l);
    case 'chatNo': return aviso('Vas muy rápido: espera un momento para escribir otra vez.');
    case 'mapa': mapaOk = d.r; if (d.r === remin && d.h !== mapaHash) cambiarMapa(d); return;
    case 'nomira': detener(); return pantallaFinal('Este mundo no admite observadores', 'Quien lo creó prefirió jugar sin público.');
    case 'obs': mirones = d.n | 0; ultPos = ''; if (soloVer) pintarVer(); else { enviarPos(); pintarTabla(); } return;      // que quien llega a mirar me vea aunque esté quieto
    case 'cerrado': if (d.ver) { location.href = '/ver/' + d.ver + '?pedir=1'; return; } return pantallaFinal('Este mundo cerró la puerta', 'Quien lo creó ya no admite maquinitas nuevas.');      // con la puerta cerrada se entra a mirar y desde ahí se pide permiso
    case 'baneado': detener(); quitarMundo(mundoId); return pantallaFinal('Ya no puedes entrar a este mundo', 'Quien lo creó te sacó. Tu maquinita sigue siendo tuya: puedes jugar en tus otros mundos o crear uno nuevo.');
    case 'publico': return recibirPublico(d);
    case 'pidiendo': if (pido === 'aceptado') return; pido = d.dueno ? 'espera' : 'ausente'; pidoDe = d.n || ''; pidoT = pidoT || Date.now(); return pintarVer();
    case 'aceptado': pido = 'aceptado'; pintarVer(); son.logro(); if (document.hidden) document.title = '🎉 ¡Te aceptaron! · Mina'; setTimeout(() => pasarAJugar(d.id), 1600); return;
    case 'rechazado': pido = 'no'; pidoT = 0; return pintarVer();
    case 'lleno': return pantallaFinal('Este mundo está lleno', soloVer ? 'Este mundo ya tiene sus 100 maquinitas: no caben más. Puedes seguir mirando.' : 'Caben 100 maquinitas por mundo y 40 jugando a la vez.');
    case 'otra': detener(); return pantallaFinal('Tu maquinita se abrió en otro lado', 'Está en otra pestaña o en otro dispositivo, con todo lo que trae. Aquí puedes volver a tomarla cuando quieras.');
    case 'borrado': quitarMundo(mundoId); detener(); return pantallaFinal('Este mundo fue borrado', 'Quien lo creó lo desechó.');
    case 'mundo': return conMapa(d, iniciarMundo);
    case 'cava': for (const i of d.c) ponerCavada(i); return efectoAjeno(d.c);
    case 'no': return noFueMia(d.c);
    case 'entra':
      otros.set(d.j.i, { ...otros.get(d.j.i), ...d.j });
      if (d.nuevo) { S.d += 500; S.tot += 500; S.st.amigos = (S.st.amigos || 0) + 1; sucio = true; }
      if (d.primera && d.j.de === miI) { S.st.traidos = (S.st.traidos || 0) + 1; sucio = true; son.logro(); tarjeta('💛 ' + d.j.n + ' entró con tu liga', `Ya trajiste a ${S.st.traidos} ${S.st.traidos === 1 ? 'persona' : 'personas'} a excavar.` + (d.nuevo ? ' +$500 para cada quien.' : ''), 'msj', 9000); pintarHud(true); }
      else if (d.nuevo) { tarjeta('🎉 Llegó ' + d.j.n, 'Maquinita nueva en el mundo: +$500 para cada quien.' + (d.j.de >= 0 ? ' La trajo ' + nombreDe(d.j.de) + '.' : '')); pintarHud(true); }
      else aviso(d.j.n + ' entró al mundo');
      notaChat(d.j.n + (d.nuevo ? ' llegó al mundo por primera vez' + (d.j.de >= 0 ? ' (la trajo ' + nombreDe(d.j.de) + ')' : '') : ' entró')); pintarChatQuien(); if (d.nuevo) { edenE = null; bloques.clear(); }
      son.entra(); ultPos = ''; enviarPos(); return pintarTabla();   // que el recién llegado me vea aunque yo esté quieto
    case 'sale': { const o = otros.get(d.i); if (o) { o.on = 0; o.x = undefined; o.b = []; aviso(o.n + (d.sacada ? ' fue sacada del mundo' : ' salió')); notaChat(o.n + (d.sacada ? ' fue sacada del mundo' : ' salió')); pintarChatQuien(); } return pintarTabla(); }
    case 'j': { const o = otros.get(d.i); if (o) { o.rec = d.rec; o.tot = d.tot; } return pintarTabla(); }
    case 'cita': { const antes = cita; cita = d.cita; if (cita && (!antes || antes.h !== cita.h)) { notaChat(nombreDe(cita.i) + ' propuso juntarse ' + horaCitaTx(cita.h)); if (cita.i !== miI) tarjeta('🕘 Nos vemos ' + horaCitaTx(cita.h), nombreDe(cita.i) + ' propone la hora. Arriba a la derecha dices si vas.', 'msj', 10000); } else if (!cita && antes) notaChat('se quitó la cita'); pintarTabla(); if (menu === 'inv') pintarMenu(); return; }
    case 'pleito': return empezarPleito(d);
    case 'pleitoFin': return terminarPleito(d);
    case 'vida': { const o = otros.get(d.i); if (o) { o.vida = d.v; o.mx = d.mx; o.vidaH = tiempo; } pintarPleito(); return; }
    case 'col': if (d.k >= 0 && d.k < NCOL) { hallados[d.k] = 1; dugCambios++; mapa.fill(255); bloques.clear(); pintarHud(true); if (menu === 'menu') pintarMenu(); } return;
    case 'golpe': {            // otra maquinita me alcanzó con su taladro: pega según su taladro y la clase de golpe; lo que aguanto es mi casco
      if (!S) return;
      if (d.v) {               // …o me avisa que le gané
        S.st.pleitos = (S.st.pleitos || 0) + 1; sucio = true; son.rango(); temblar(6);
        for (const c of ['#ffd23f', '#6ec3ff', '#ff6b5a', '#6fdc7a']) chispas(yo.x, yo.y - 0.3, c, 14, 9);
        onda(yo.x, yo.y, 3, '#ffd23f', 0.7); flota(yo.x, yo.y - 1.4, '🏆 ¡Ganaste!', '#ffd23f');
        peleas.delete(miI); peleas.delete(d.i); pintarPleito();
        return tarjeta('🏆 Le ganaste el pleito a ' + nombreDe(d.i), 'Se fue a la superficie. Llevas ' + S.st.pleitos + (S.st.pleitos === 1 ? ' pleito ganado.' : ' pleitos ganados.'), '', 8000, true);
      }
      if (cfg.pleitos === 0 || yo.y <= 0.5 || yo.renace) return;
      const o = otros.get(d.i), k = d.k | 0, dir = o && o.x !== undefined ? Math.sign(yo.x - o.x || 1) : 1;
      rival = nombreDe(d.i); rivalI = d.i; yo.pelea = tiempo;
      if (!enPleito(miI)) { peleas.set(miI, { con: d.i, h: tiempo }); peleas.set(d.i, { con: miI, h: tiempo }); } else { peleas.get(miI).h = tiempo; (peleas.get(d.i) || {}).h = tiempo; }
      yo.vx += dir * (k === 3 ? 7 : 4); if (k !== 2) yo.vy -= 2;
      chispas(yo.x - dir * 0.4, yo.y, '#ffd76a', 14, 8); chispas(yo.x - dir * 0.4, yo.y, '#ffffff', 6, 5); chispas(yo.x - dir * 0.4, yo.y, '#d7dbe0', 8, 10);
      if (k === 3) { son.choque(); onda(yo.x - dir * 0.5, yo.y, 1.6, '#ffffff', 0.3); }
      // Cada golpe quita entre el 5 % y el 16 % del casco de quien lo recibe: ni un solo golpe decide, ni el pleito se eterniza
      { const mx = vidaMax(), q = Math.max(Math.ceil(mx * 0.05), Math.min(Math.ceil(mx * 0.16), Math.round(Math.min(900, d.q | 0) * 0.25))); danar(q, 'pleito'); enviarVida(true); pintarPleito(); return; }
    }
    case 'aviso': notaChat(nombreDe(d.i) + ' ' + d.x); return aviso(nombreDe(d.i) + ' ' + d.x);
    case 'senal': senales.push({ x: d.x, y: d.y, t: 10, n: nombreDe(d.i) }); son.senal(); return aviso(nombreDe(d.i) + ' marcó un punto');
    case 'fuel': if (S.fuel <= 0 && d.q > 0) tarjeta('Saliste de la reserva', nombreDe(d.i) + ' te pasó combustible.'); S.fuel = Math.min(tanque(), S.fuel + d.q); son.combustible(); sucio = true; return aviso(nombreDe(d.i) + ' te pasó ' + d.q + ' litros');
    case 'regalo': S.d += d.q; son.compra(); sucio = true; return tarjeta('🎁 ' + nombreDe(d.i) + ' te regaló ' + fmt(d.q));
    case 'devuelve': sucio = true; if (d.d) S.d += d.d; if (d.fuel) S.fuel = Math.min(tanque(), S.fuel + d.fuel); return aviso('No se pudo entregar: esa maquinita no está conectada.');
    case 'cfg': cfg = d.cfg; dugCambios++; tiles.clear(); bloques.clear(); if (listo) guardarMundo(); if (d.i !== miI) aviso(nombreDe(d.i) + ' cambió las reglas del mundo'); if (menu) pintarMenu(); return;
    case 'cuenta':
      cuentaFin = Date.now() + d.s * 1000; son.alarma();
      if (d.i === miI) { S.d -= Math.min(S.d, costoRemin()); S.reminGratis = 0; S.st.remin++; sucio = true; pediRemin = true; pintarHud(true); }   // se cobra hasta que el mundo confirma
      if (menu === 'rem') pintarMenu();
      return aviso(nombreDe(d.i) + ' activó la Remineralizadora');
    case 'remin': {
      remin = d.remin; dug.fill(0); nuevaSemilla(); terrenoProcedural(); cuentaFin = 0; pendientes = []; recientes.clear();
      // El terreno nuevo se le entrega al mundo para que quede fijo: lo manda quien remineralizó; si no llega, cualquiera.
      { const r = remin; if (pediRemin) { pediRemin = false; subirMapa(); } setTimeout(() => { if (remin === r && mapaOk !== r) subirMapa(); }, 3000 + Math.random() * 3000); }
      yo.perf = null;
      if (yo.y > INICIO_Y + 0.01) { yo.x = INICIO_X; yo.y = INICIO_Y; yo.vx = yo.vy = 0; yo.suelo = true; }
      if (menu) pintarMenu(); else if (!corriendo) dibujar();
      tarjeta('🌋 Tablero remineralizado', 'Tierra nueva y minerales nuevos en toda la capa.'); son.remin(); temblar(12);
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
    if (r[0] === 50) { const v = r[2] || 0; S.d = Math.max(0, S.d - v); S.tot = Math.max(0, S.tot - v); }
    else if (r[0] >= 40) { const v = r[2] || 0; S.d = Math.max(0, S.d - v); S.tot = Math.max(0, S.tot - v); S.st.hall[r[0] - 40] = Math.max(0, S.st.hall[r[0] - 40] - 1); }
    else { const i = r[0] - 10; if (S.carga[i] > 0) S.carga[i]--; S.st.rec[i] = Math.max(0, S.st.rec[i] - 1); }
    aviso('Otra maquinita llegó antes a esa pieza.'); sucio = true;
  }
}
function iniciarMundo(d, local) {
  const otraTierra = !!S && (d.remin !== remin || d.seed !== seed);
  // Al reconectar no se pierde ni una celda. Lo que este navegador ya había cavado y el mundo no tiene (se cortó la señal,
  // o el mundo se reinició antes de guardar) se conserva aquí y se le vuelve a mandar. Solo una remineralización cierra túneles.
  const mias = S && !otraTierra ? dug.slice() : null, faltan = [];
  seed = d.seed; remin = d.remin; cfg = d.cfg; miI = d.i; soyCreador = !!d.creador;
  if (!local) { miPid = d.pid || ''; miVer = d.ver || ''; mirones = d.obs | 0; finMundo = d.fin || null; }
  if (d.sinMineral === remin) vaciarMinerales();                 // en este mundo ya cayeron todos los minerales: queda pura tierra
  if (!local && d.fin && d.fin.r === remin && d.fin.parte > 0 && miI < (d.fin.n || 0) && S && !(S.fl.edenP && S.fl.edenP[mundoId + '|' + remin])) {      // no estabas cuando se repartieron: aquí está tu parte
    (S.fl.edenP || (S.fl.edenP = {}))[mundoId + '|' + remin] = 1; (S.fl.edenF || (S.fl.edenF = {}))[mundoId + '|' + remin] = 1;
    S.d += d.fin.parte; S.tot += d.fin.parte; sucio = true; son.venta();
    setTimeout(() => tarjeta('💎 Tu parte del Jardín del Fondo', `Mientras no estabas, ${nombreDe(d.fin.i)} perforó el Corazón y todos los minerales del mundo se repartieron en partes iguales entre las ${d.fin.n} maquinitas. La tuya: ${fmt(d.fin.parte)}.`, 'msj', 20000, true), 1500);
  }
  edenE = null; edenT = -9;
  const b = atob(d.dug); for (let i = 0; i < dug.length; i++) dug[i] = b.charCodeAt(i);
  const misCol = mias ? hallados.slice() : null; hallados.fill(0); for (const k of d.col || []) if (k >= 0 && k < NCOL) hallados[k] = 1;
  if (misCol) for (let k = 0; k < NCOL; k++) if (misCol[k] && !hallados[k]) { hallados[k] = 1; enviar({ t: 'col', k }); }      // lo que encontré sin señal también cuenta
  if (mias) for (let i = 0; i < dug.length; i++) { const f = mias[i] & ~dug[i]; if (f) { dug[i] |= f; for (let k = 0; k < 8; k++) if (f & (1 << k)) faltan.push(i * 8 + k); } }
  nuevaSemilla(); ponerTerreno(d);
  if (otraTierra) { pendientes = []; recientes.clear(); yo.perf = null; if (yo.y > INICIO_Y + 0.01) { yo.x = INICIO_X; yo.y = INICIO_Y; yo.vx = yo.vy = 0; } }
  otros.clear();
  for (const j of d.jug) { if (j.i === miI) { miNombre = j.n; miModelo = j.m; miPinta = j.p || {}; miMe = j.me | 0; miDe = j.de >= 0 ? j.de : -1; } else otros.set(j.i, j); }
  if (d.piedras) edenPiedras = d.piedras;
  if (d.regalo) setTimeout(() => tarjeta('🎁 Alguien pagó tu primera pintura', 'Hay para todos. Pásate a La Pinturería (la camioneta rosa, a la izquierda de la Gasolinera) y elige tu color.', 'msj', 14000), 2500);
  const primera = !S;
  if (primera) {
    S = sanear(d.est);
    if (S.mu && S.mu !== mundoId) { S.x = INICIO_X; S.y = INICIO_Y; }     // viene de otro mundo: llega a la superficie de este
    yo.x = S.x; yo.y = S.y; yo.vx = yo.vy = 0;
    if (solida(Math.floor(yo.x), Math.floor(yo.y))) { yo.x = INICIO_X; yo.y = INICIO_Y; }   // el mundo cambió mientras no estaba
  } else {
    // Si esta maquinita avanzó más en otro equipo, manda lo que el mundo sabe de ella; si no, lo de aquí es lo más nuevo.
    if (d.est && (d.est.v | 0) > (S.v | 0)) {
      S = sanear(d.est); if (S.mu && S.mu !== mundoId) { S.x = INICIO_X; S.y = INICIO_Y; }
      yo.x = S.x; yo.y = S.y; yo.vx = yo.vy = 0; yo.perf = null;
      if (solida(Math.floor(yo.x), Math.floor(yo.y))) { yo.x = INICIO_X; yo.y = INICIO_Y; }
    }
    sucio = true;                      // al reconectar manda lo que pasó mientras tanto
  }
  if (d.cuenta) cuentaFin = Date.now() + d.cuenta * 1000;
  if (soyCreador && (!cfg.nombre || (cfg.modo === 'clasico' && !cfg.verGas))) { cfg.nombre = cfg.nombre || 'Mundo de ' + miNombre; if (cfg.modo === 'clasico') cfg.verGas = 2; enviar({ t: 'cfg', cfg }); }
  if (!local) { guardarMundo(); bautizo = null; llaveAntes = ''; try { localStorage.removeItem('mina_maq_antes'); } catch {} }
  conectado = !local; tCaido = 0; listo = true; dugCambios++;
  // lo que el mundo no tenía se le manda de nuevo (ya incluye lo cavado sin conexión)
  pendientes = [];
  for (let i = 0; i < faltan.length; i += 30) enviar({ t: 'cava', c: faltan.slice(i, i + 30) });
  if (!local && !d.mapa) subirMapa();              // el mundo todavía no tenía guardado su terreno: se le entrega y queda fijo
  if (primera) { medir(); vis.x = ant.x = yo.x; vis.y = ant.y = yo.y; camX = Math.max(0, Math.min(W - cols, yo.x - cols / 2)); camY = Math.max(-filas * 0.68, yo.y - filas * 0.5); }
  ultPos = '';
  $('#aviso-red').style.display = 'none';
  if (menu === 'inicio') { menu = null; $('#velo').classList.remove('on'); }
  document.body.classList.add('jugando');
  surtirContratos(); pintarHud(true); pintarTabla(); if (!local) ponerChat(d.chat); arrancar();
  { const f = new Date(), hoy = f.getDate() + '/' + (f.getMonth() + 1); if (primera && hoy === '11/7') tarjeta('⛏️ ¡Feliz Día del Minero!', 'Hoy, 11 de julio, México celebra a su gente de mina. Buen turno.', 'msj', 10000); if (primera && hoy === '4/12') tarjeta('🕯️ Día de Santa Bárbara', 'Hoy, 4 de diciembre, las minas festejan a su patrona.', 'msj', 10000); }
  if (primera) { tInicioMundo = Date.now(); cita = d.cita || null; }
  if (!local && vengoDe >= 0 && vengoDe !== miI && !bienvenidaDe && otros.get(vengoDe)) { bienvenidaDe = 1; const q = otros.get(vengoDe); setTimeout(() => tarjeta('🚜 ' + q.n + ' te invitó a este mundo', (q.on ? 'Está jugando ahora mismo' + (q.y !== undefined ? ', a ' + num(Math.max(0, Math.round(q.y))) + ' m' : '') : 'Ahora no está, pero el mundo sigue tal cual') + '. Cada quien baja con su maquinita; se ven en el mapa (M) y se hablan por el chat (C).', 'msj', 14000), 1200); }
  if (primera && !d.est) tarjeta('⛏️ Tu maquinita se llama ' + miNombre, (tactil ? 'Pon el dedo donde sea y arrástralo: abajo perfora, a los lados camina, arriba vuela. Dos empujones seguidos hacia arriba o hacia abajo y sigue sola. Las caídas no te lastiman. Con dos dedos acercas la vista.' : 'Usa las flechas para moverte.') + ' Primero: carga combustible en la Gasolinera (' + (tactil ? 'un toque' : '↓') + ' para entrar). El nombre se cambia en Menú → Mundo.', 'msj', 11000);
  if (primera) { const n = leer('mina_nota', ''); if (n) { try { localStorage.removeItem('mina_nota'); } catch {} aviso(n); } }
}

/* ════════ Dibujo ════════ RLR */
// Todo se dibuja en píxeles reales de la pantalla: T es cuántos píxeles mide una celda.
const lienzo = $('#c'), g = lienzo.getContext('2d', { alpha: false });
let DPR = 1, RES = 1, T = 40, cols = 32, filas = 20, camX = 0, camY = -12, reloj = 0, lupa = Math.max(0.6, Math.min(2.2, +op.lupa || 1));
let panX = 0, panY = 0, vistaLibre = false;       // vista libre con la rueda o el trackpad
const vis = { x: INICIO_X, y: INICIO_Y };         // dónde se dibuja mi maquinita (entre dos pasos de física)
const tiles = new Map(), casas = new Map();
// ── Bloques. El terreno casi nunca cambia, así que no se arma en cada cuadro: se compone una vez en bloques de 4 × 4 celdas
//    (tierra, mineral, sombras de orilla, plantas) y cada cuadro solo estampa los bloques que se ven: unas 60 estampas en vez
//    de unas 1,500 órdenes de dibujo. Cuando se cava una celda, se repinta su bloque (y el de junto, si le cambia la sombra).
//    Lo que se mueve (destellos, lava, burbujas de gas, la superficie del agua) se pinta encima con las listas de cada bloque.
const BL = 4, BW = W / BL, bloques = new Map(), bloquesLibres = [];
let cuadroN = 0, bloquesTope = 120;
function ensuciar(x, y) { const b = bloques.get((y >> 2) * BW + (x >> 2)); if (b) b.sucio = true; }
function bloque(bx, by) {
  const k = by * BW + bx; let b = bloques.get(k);
  if (!b) {
    b = bloquesLibres.pop();
    if (!b || b.c.width !== BL * T) { const c = document.createElement('canvas'); c.width = c.height = BL * T; b = { c, q: c.getContext('2d', { alpha: false }), lava: [], gas: [], brillo: [], agua: [], u: 0, sucio: true }; }
    b.sucio = true; bloques.set(k, b);
  }
  if (b.sucio) pintarBloque(b, bx, by);
  b.u = cuadroN; return b;
}
function pintarBloque(b, bx, by) {
  const q = b.q, fino = Math.max(1, Math.round(T * 0.07)), grueso = Math.max(2, Math.round(T * 0.13));
  b.lava.length = b.gas.length = b.brillo.length = b.agua.length = 0; b.sucio = false;
  const eden = by * BL >= EDEN0;
  if (eden) {                                  // el Jardín del Fondo: se recorta a las celdas ya abiertas de este bloque y ahí se pinta
    let n = 0; q.save(); q.beginPath();
    for (let j = 0; j < BL; j++) for (let i = 0; i < BL; i++) if (hueca(bx * BL + i, by * BL + j)) { q.rect(i * T, j * T, T, T); n++; }
    if (n) { q.clip(); pintarEden(q, bx, by); }
    q.restore();
  }
  for (let j = 0; j < BL; j++) {
    const y = by * BL + j, m = (y + 1) * 2, zona = zonaDe(m), py = j * T;
    for (let i = 0; i < BL; i++) {
      const x = bx * BL + i, px = i * T; let t = celda(x, y);
      if (t === 0 || t === 6) {
        if (eden) continue;                         // ahí ya está pintado el jardín
        const lug = y >= 165 ? lugarDe(x, y) : -1;
        q.drawImage(tile(t, zona, ((x * 5 + y * 3) & 1) + (lug > 0 ? lug * 2 : 0)), px, py);
        if (y > 0 && !hueca(x, y - 1)) { q.fillStyle = '#00000055'; q.fillRect(px, py, T, grueso); }             // sombra del techo
        const ci = y * W + x;                          // en el piso de las cuevas que nadie cavó crece algo, según la zona
        if (y > 2 && lug < 2 && ((x * 31 + y * 17) & 3) < 2 && !(dug[ci >> 3] & (1 << (ci & 7))) && solida(x, y + 1)) q.drawImage(sprite('f' + (t === 6 ? 4 : zona < 4 ? 0 : zona === 4 ? 5 : zona) + ((x + y) & 1)), px, py);
        if (t === 6 && celda(x, y - 1) === 0) b.agua.push(x, y);      // la superficie del agua se mueve: va encima, en cada cuadro
        continue;
      }
      const esGas = t === 4, gasOculto = esGas && cfg.verGas !== 1;
      if (gasOculto) t = 1;
      const vt = litoDe(x, y) * 16 + h16(x, y);
      const vr = t === 1 ? vt : t === 3 ? (celda(x, y - 1) === 3 ? 1 : 0) | (celda(x + 1, y) === 3 ? 2 : 0) | (celda(x, y + 1) === 3 ? 4 : 0) | (celda(x - 1, y) === 3 ? 8 : 0) | (((x * 7 + y * 13) & 3) << 4) : t === 7 ? (x * 7 + y * 13) & 3 : t === 50 ? Math.floor(colec.get(y * W + x) / 3) : t >= 10 && y >= 165 && lugarDe(x, y) > (t >= 40 ? 0 : 2) ? 1 : 0;
      if (t !== 1 && t !== 5 && t !== 7 && !(t >= 10 && t !== 50 && vr)) q.drawImage(tile(1, zona, vt), px, py);       // la tierra de la celda, debajo de lo que tenga
      q.drawImage(tile(t, zona, vr), px, py);
      if (t === 2 && esGeoda(x, y)) q.drawImage(sprite('geo'), px, py);
      if (t === 3) b.lava.push(x, y); else if (esGas) b.gas.push(x, y); else if (t >= 10) b.brillo.push(x, y);
      // bordes: lo que da al túnel se sombrea, y arriba se ilumina
      if (y === 0) { if (t !== 5) { q.fillStyle = '#5c9e3a'; q.fillRect(px, py, T, grueso); q.fillStyle = '#7cc24e'; q.fillRect(px, py, T, fino); } }
      else if (hueca(x, y - 1)) { q.fillStyle = '#ffffff26'; q.fillRect(px, py, T, fino); }
      if (y < H - 1 && hueca(x, y + 1)) { q.fillStyle = '#00000059'; q.fillRect(px, py + T - grueso, T, grueso); }
      if (x > 0 && hueca(x - 1, y)) { q.fillStyle = '#00000038'; q.fillRect(px, py, fino, T); }
      if (x < W - 1 && hueca(x + 1, y)) { q.fillStyle = '#00000038'; q.fillRect(px + T - fino, py, fino, T); }
    }
  }
}
const TIERRA = [['#8f5d3b', '#7b4e31', '#a06c48', '#6b422a'], ['#7d4c31', '#6b3f28', '#8d5a3c', '#5a3421'], ['#6c3f2b', '#5b3222', '#7c4b35', '#4b291c'], ['#57322b', '#472621', '#673c34', '#3a1f1b'],
  ['#4f6470', '#43565f', '#5d7480', '#36464e'], ['#5a4a5e', '#4b3d50', '#6a586f', '#3b2f40'], ['#3c4466', '#313856', '#495278', '#262b45'], ['#3a2a2c', '#2f2123', '#4a3436', '#221718']];
const HUECO = [['#2c1b13', '#33211a', '#24150f'], ['#27170f', '#2e1c15', '#1f120c'], ['#22130e', '#291813', '#1a0e0a'], ['#1d100d', '#241512', '#150b09'],
  ['#101c24', '#15242e', '#0b151b'], ['#1a1220', '#211828', '#120c17'], ['#0f1224', '#15182e', '#090b18'], ['#120a0b', '#190e10', '#0a0506']];
const zonaDe = (m) => (m < 210 ? 0 : m < 410 ? 1 : m < 650 ? 2 : m < 1000 ? 3 : m < 2000 ? 4 : m < 4000 ? 5 : m < 8000 ? 6 : 7);
const azarDe = (s) => () => (s = (s * 9301 + 49297) % 233280) / 233280;
function mezcla(hex, k) {            // k < 0 oscurece, k > 0 aclara
  const n = parseInt(hex.slice(1), 16), m = k < 0 ? 0 : 255, a = Math.abs(k);
  const c = (v) => Math.round(v + (m - v) * a);
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}
// El acercamiento cambia suave: la lupa arranca donde estaba la vista y llega a 1 en un cuarto de segundo.
let lupaAnim = 0;
function animarLupa(desde) {
  const t0 = performance.now(), id = ++lupaAnim, de = Math.max(0.3, Math.min(3, desde));
  const paso = () => { if (id !== lupaAnim) return; const k = Math.min(1, (performance.now() - t0) / 260), e = 1 - Math.pow(1 - k, 3); lupa = de + (1 - de) * e; medir(); if (k < 1) requestAnimationFrame(paso); else lupa = 1; };
  lupa = de; paso();
}
function medir() {
  DPR = Math.min(2.5, window.devicePixelRatio || 1);
  RES = Math.max(0.75, DPR * NITIDEZ[rit.niv]);
  const w = Math.max(1, Math.round(innerWidth * RES)), h = Math.max(1, Math.round(innerHeight * RES));
  if (lienzo.width !== w) lienzo.width = w;
  if (lienzo.height !== h) lienzo.height = h;
  // En el celular manda el lado corto de la pantalla: caben 9, 12 o 16 celdas a lo ancho (y la pinza acerca o aleja desde ahí).
  // En una computadora, 26, 32 o 40 a lo ancho.
  T = movil ? Math.max(Math.round(10 * RES), Math.round(Math.min(w, h) / [9, 12, 16][op.zoom] * lupa)) : Math.max(Math.round(12 * RES), Math.round(w / [26, 32, 40][op.zoom]));
  cols = w / T; filas = h / T;                    // lo que de verdad cabe, aunque la ventana sea angosta
  tiles.clear(); casas.clear(); sprites.clear(); bloques.clear(); bloquesLibres.length = 0;
  bloquesTope = (Math.ceil(cols / BL) + 1) * (Math.ceil(filas / BL) + 1) + 6;        // lo que cabe en pantalla y unos pocos más
  if (listo && !corriendo) dibujar();
}

/* ── Celdas ── */
// ── La tierra. El dibujo es el de siempre (un color de base por zona, grano, dos vetas tenues y tres piedritas) con dieciséis
//    acomodos distintos. El tipo de roca del lugar solo le da un matiz apenas visible, en capas anchas, para que no se vea
//    un tapete repetido sin volverse una colcha de cafés.
const LITO = [['#000000', 0, 'tierra'], ['#e6c592', 0.05, 'arenisca'], ['#1c1524', 0.06, 'lutita'], ['#a86f55', 0.04, 'conglomerado']];
const litos = new Uint8Array(W * H).fill(255), liso = (t) => t * t * (3 - 2 * t);
const h16 = (x, y) => ((Math.imul(x, 73856093) ^ Math.imul(y, 19349663)) >>> 3) & 15;
function litoDe(x, y) {
  const i = y * W + x; if (litos[i] !== 255) return litos[i];
  const u = x * 0.05, v = (y - 0.12 * x - (x > 30 ? 1.3 : 0) + (x > 66 ? 0.9 : 0)) * 0.17, iu = Math.floor(u), iv = Math.floor(v), fu = liso(u - iu), fv = liso(v - iv);
  const n = (azar(iu, iv, 71) * (1 - fu) + azar(iu + 1, iv, 71) * fu) * (1 - fv) + (azar(iu, iv + 1, 71) * (1 - fu) + azar(iu + 1, iv + 1, 71) * fu) * fv;
  return (litos[i] = n < 0.3 ? 3 : n < 0.44 ? 1 : n < 0.62 ? 0 : 2);
}
function tierra(q, zona, r, lito = 0) {
  const u = T / 16, tin = LITO[lito], B = TIERRA[zona].map((c) => (tin[1] ? entre(c, tin[0], tin[1]) : c));
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
const FORMA = ['roca', 'pepita', 'pepita', 'pepita', 'barra', 'cristal', 'gema', 'gema', 'diamante', 'racimo', 'gema', 'diamante', 'perla', 'roca', 'cristal', 'gema', 'racimo', 'diamante', 'gema', 'barra', 'barra', 'barra'];
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
    if (i === 13) { q.fillStyle = '#ffffffb0'; q.fillRect(x - a * 1.3, y - a * 0.12, a * 2.6, u * 0.6); }
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
  } else if (f === 'perla') {
    q.beginPath(); q.arc(x, y, a * 0.95, 0, 7); q.fillStyle = col; q.fill(); q.stroke(); q.shadowBlur = 0;
    q.fillStyle = osc; q.beginPath(); q.arc(x + a * 0.2, y + a * 0.25, a * 0.6, 0, 7); q.fill(); q.fillStyle = '#ffffffdd'; q.beginPath(); q.arc(x - a * 0.35, y - a * 0.35, a * 0.28, 0, 7); q.fill();
  } else {                                          // racimo de cristales
    for (let k = 0; k < 5; k++) {
      const an = -1.57 + (k - 2) * 0.5 + (r() - 0.5) * 0.2, l = a * (0.9 + r() * 0.7), w = a * 0.3;
      q.beginPath(); q.moveTo(x - Math.sin(an) * -w, y + a * 0.6 + Math.cos(an) * -w * 0.2); q.lineTo(x + Math.cos(an) * l, y + a * 0.6 + Math.sin(an) * l); q.lineTo(x + Math.sin(an) * -w, y + a * 0.6 - Math.cos(an) * -w * 0.2); q.closePath();
      q.fillStyle = k % 2 ? cla : col; q.fill(); q.stroke();
    }
    q.shadowBlur = 0; q.fillStyle = i === 9 ? '#36e0c8' : osc; q.beginPath(); q.ellipse(x, y + a * 0.65, a * 0.7, a * 0.25, 0, 0, 7); q.fill();
  }
  q.shadowBlur = 0;
}
function vacio(q, zona, r) {         // el fondo de un túnel o de una cueva
  const B = HUECO[zona], u = T / 16; q.fillStyle = B[0]; q.fillRect(0, 0, T, T);
  for (let i = 0; i < 16; i++) { q.fillStyle = B[1 + (i % 2)]; q.fillRect(Math.floor(r() * 16) * u, Math.floor(r() * 16) * u, u * (1 + Math.floor(r() * 3)), u); }
}
function tile(tipo, zona, vr) {
  const key = tipo * 1000 + zona * 100 + vr; let c = tiles.get(key);
  if (c) return c;
  // Las celdas dibujadas se guardan para no repintarlas, pero no para siempre: al pasar de 280 se sueltan las de zonas lejanas.
  if (tiles.size > 200) for (const k of tiles.keys()) if (Math.abs((Math.floor(k / 100) % 10) - zona) > 1) tiles.delete(k);
  c = document.createElement('canvas'); c.width = c.height = T;
  const q = c.getContext('2d'), r = azarDe(key * 7919 + 13), u = T / 16;
  if (tipo === 0) {                                 // fondo de túnel y de cueva
    vacio(q, zona, r);
    const lug = vr >> 1;                            // dentro de un lugar, el fondo cuenta dónde estás
    if (lug === 1 && (vr & 1)) for (let i = 0; i < 2; i++) { const x = (2 + r() * 9) * u, w = (2 + r() * 2.5) * u; q.globalAlpha = 0.2; q.fillStyle = ['#b06cf0', '#4fd6d0', '#ff9a2e'][Math.floor(r() * 3)]; q.beginPath(); q.moveTo(x, T); q.lineTo(x + w, T); q.lineTo(x + w / 2 + (r() - 0.5) * u * 3, T - (5 + r() * 8) * u); q.fill(); q.globalAlpha = 1; }
    else if (lug === 2) { q.globalAlpha = 0.11; q.strokeStyle = '#d9b877'; q.lineWidth = Math.max(1, u * 0.5); q.beginPath(); q.moveTo(0, u * 0.3); q.lineTo(T, u * 0.3); q.moveTo(0, T / 2); q.lineTo(T, T / 2); q.moveTo(T * (vr & 1 ? 0.3 : 0.7), 0); q.lineTo(T * (vr & 1 ? 0.3 : 0.7), T / 2); q.moveTo(T * (vr & 1 ? 0.8 : 0.2), T / 2); q.lineTo(T * (vr & 1 ? 0.8 : 0.2), T); q.stroke(); q.globalAlpha = 1; }
    else if (lug === 3) { q.fillStyle = 'rgba(255,60,40,0.1)'; q.fillRect(0, 0, T, T); if (vr & 1) { q.globalAlpha = 0.22; q.strokeStyle = '#ff8a5a'; q.lineWidth = Math.max(1, u * 0.5); q.beginPath(); q.moveTo(r() * T, 0); q.lineTo(r() * T, T / 2); q.lineTo(r() * T, T); q.stroke(); q.globalAlpha = 1; } }
  } else if (tipo === 6) {                          // agua del Acuífero
    q.fillStyle = '#0f3d5c'; q.fillRect(0, 0, T, T);
    for (let i = 0; i < 7; i++) { q.fillStyle = i % 2 ? '#14517a' : '#0b3049'; q.globalAlpha = 0.5; q.fillRect(Math.floor(r() * 12) * u, Math.floor(r() * 16) * u, u * (3 + Math.floor(r() * 3)), u); }
    const yy = (3 + r() * 10) * u; q.globalAlpha = 0.16; q.strokeStyle = '#9fe0ff'; q.lineWidth = Math.max(1, u * 0.5); q.beginPath(); q.moveTo(u * 2, yy); q.quadraticCurveTo(T * 0.5, yy - u * 1.6, T - u * 2, yy); q.stroke(); q.globalAlpha = 1;
  } else if (tipo === 7) {                          // ladrillo antiguo de la Ciudad Perdida
    const L = [[0, 0, 8], [8.6, 0, 7.4], [-4, 8.3, 8], [4.6, 8.3, 8], [13.2, 8.3, 4]];
    q.fillStyle = '#5c4728'; q.fillRect(0, 0, T, T);
    for (const [a, b, w] of L) { q.fillStyle = '#a3875a'; q.fillRect(a * u + u * 0.3, b * u + u * 0.3, w * u - u * 0.6, u * 7.1); q.fillStyle = '#c2a674'; q.fillRect(a * u + u * 0.3, b * u + u * 0.3, w * u - u * 0.6, u * 0.9); q.fillStyle = '#8a7046'; q.fillRect(a * u + u * 0.3, b * u + u * 6.5, w * u - u * 0.6, u * 0.9); }
    q.fillStyle = '#7a6240'; for (let i = 0; i < 7; i++) q.fillRect(Math.floor(r() * 15) * u, Math.floor(r() * 15) * u, u, u);
    if (vr === 3) { q.strokeStyle = '#5c4728'; q.lineWidth = u * 0.7; q.beginPath(); q.arc(4 * u, 4 * u, 2.1 * u, 0.4, 5.6); q.stroke(); q.beginPath(); q.arc(4 * u, 4 * u, 0.7 * u, 0, 7); q.stroke(); }
  } else if (tipo === 5) {                          // suelo firme: placas remachadas
    q.fillStyle = '#5a5653'; q.fillRect(0, 0, T, T);
    q.fillStyle = '#6e6966'; q.fillRect(0, 0, T, u * 1.2); q.fillRect(0, 0, u * 1.2, T);
    q.fillStyle = '#3d3a38'; q.fillRect(0, T - u * 1.2, T, u * 1.2); q.fillRect(T - u * 1.2, 0, u * 1.2, T);
    q.fillStyle = '#2e2b2a'; for (const [a, b] of [[3, 3], [13, 3], [3, 13], [13, 13]]) { q.beginPath(); q.arc(a * u, b * u, u * 0.8, 0, 7); q.fill(); }
    q.fillStyle = '#ffffff18'; q.fillRect(u * 4, u * 7, u * 8, u * 0.6);
  } else {
    // Solo la tierra pinta fondo; lo demás (piedra, lava, mineral, tesoros) va transparente y se dibuja encima de la tierra de su celda.
    if (tipo >= 10 && tipo !== 50 && vr) vacio(q, zona, r); else if (tipo === 1) tierra(q, zona, r, vr >> 4);        // dentro de un lugar, tesoros y cristales van sobre el hueco, no sobre tierra
    if (tipo === 2) {                               // piedra
      const s = r() * 1000 | 0;
      const C = PIEDRA[[0, 0, 0, 0, 1, 2, 3, 4][zona]][2];           // gris en la Corteza; más abajo, más dura y de otro color
      poligono(q, T / 2, T / 2, u * 7.2, 9, azarDe(s)); q.fillStyle = C[0]; q.fill(); q.lineWidth = u * 0.5; q.strokeStyle = C[3]; q.stroke();
      q.save(); poligono(q, T / 2, T / 2, u * 7.2, 9, azarDe(s)); q.clip();
      q.fillStyle = C[1]; q.fillRect(0, T * 0.58, T, T); q.fillStyle = C[2]; q.beginPath(); q.ellipse(T * 0.4, T * 0.32, u * 3.6, u * 1.8, -0.4, 0, 7); q.fill();
      q.strokeStyle = C[3] + '99'; q.lineWidth = u * 0.4; q.beginPath(); q.moveTo(T * 0.55, T * 0.3); q.lineTo(T * 0.62, T * 0.52); q.lineTo(T * 0.5, T * 0.7); q.stroke();
      q.restore();
    } else if (tipo === 3) {                        // lava: una poza de roca fundida con orilla de basalto; las pozas vecinas se unen (vr dice de qué lados)
      const fuera = u * 5, m = u * 1.6, x0 = vr & 8 ? -fuera : m, y0 = vr & 1 ? -fuera : m, x1 = vr & 2 ? T + fuera : T - m, y1 = vr & 4 ? T + fuera : T - m;
      const poza = (e) => { q.beginPath(); q.roundRect(x0 - e, y0 - e, x1 - x0 + e * 2, y1 - y0 + e * 2, u * 3.6 + e); };
      poza(u * 1.2); q.fillStyle = '#24100a'; q.fill();                           // basalto quemado
      poza(u * 0.4); q.fillStyle = '#6a1c08'; q.fill();
      poza(0); q.fillStyle = '#f2601a'; q.fill(); q.save(); q.clip();
      const gr = q.createRadialGradient(T / 2, T / 2, u, T / 2, T / 2, T * 0.75); gr.addColorStop(0, '#ffb53a'); gr.addColorStop(1, 'rgba(255,150,40,0)'); q.fillStyle = gr; q.fillRect(0, 0, T, T);
      q.fillStyle = '#ffe58a'; q.beginPath(); q.ellipse(T * (0.3 + r() * 0.25), T * (0.28 + r() * 0.16), u * (2 + r()), u * 0.85, -0.6 + r() * 0.7, 0, 7); q.fill();
      q.fillStyle = '#cf3f0d'; q.beginPath(); q.ellipse(T * (0.5 + r() * 0.2), T * (0.6 + r() * 0.14), u * (1.8 + r()), u * 0.75, r() * 0.9, 0, 7); q.fill();
      q.restore();
    } else if (tipo === 4) {                        // gas a la vista: una grieta que resplandece en verde
      const grieta = () => { q.beginPath(); q.moveTo(u * 4, u * 3.5); q.lineTo(u * 7.2, u * 6.6); q.lineTo(u * 6.2, u * 9.4); q.lineTo(u * 10.4, u * 12.6); q.moveTo(u * 7.2, u * 6.6); q.lineTo(u * 11.6, u * 5.4); };
      q.lineCap = q.lineJoin = 'round'; q.shadowColor = '#7dff6b'; q.shadowBlur = u * 4;
      grieta(); q.strokeStyle = '#0f2109'; q.lineWidth = u * 2.4; q.stroke();
      q.shadowBlur = 0; grieta(); q.strokeStyle = '#8dff74'; q.lineWidth = u * 0.8; q.stroke();
    } else if (tipo >= 10 && tipo < 40) {           // mineral: tres piezas con la forma propia de cada uno
      const i = tipo - 10;
      for (const [a, b] of [[4.6, 5], [11.2, 6.6], [7.4, 11.6]]) gema(q, i, (a + (r() - 0.5) * 1.6) * u, (b + (r() - 0.5) * 1.6) * u, (2.5 + r() * 0.8) * u, r);
      if (op.dalton) { q.fillStyle = '#000c'; q.fillRect(u * 3, u * 4.5, u * 10, u * 7); q.fillStyle = '#fff'; q.font = `bold ${u * 6}px system-ui`; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(MIN[i].s, T / 2, T / 2 + u * 0.2); }
    } else if (tipo === 50) {                       // objeto de la colección: un medallón dorado con su figura
      q.shadowColor = '#ffe9a8'; q.shadowBlur = u * 4; q.fillStyle = '#3a2a14'; q.beginPath(); q.arc(T / 2, T / 2, u * 6, 0, 7); q.fill();
      q.shadowBlur = 0; q.lineWidth = u * 0.9; q.strokeStyle = '#ffd23f'; q.stroke(); q.lineWidth = u * 0.3; q.strokeStyle = '#fff6c9'; q.beginPath(); q.arc(T / 2, T / 2, u * 5.2, 3.6, 5.2); q.stroke();
      q.font = `${u * 7.4}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText(COLEC[vr][0], T / 2, T / 2 + u * 0.4);
    } else if (tipo >= 40) {                        // hallazgo
      const k = tipo - 40; q.shadowColor = '#ffe9a8'; q.shadowBlur = u * 3; q.lineWidth = u * 0.5; q.strokeStyle = '#2a1a14';
      if (k === 0) { q.fillStyle = '#f3ead8'; q.beginPath(); q.roundRect(u * 3.5, u * 7, u * 9, u * 2, u); q.fill(); q.stroke(); for (const [a, b] of [[3.2, 6.6], [3.2, 9.4], [12.8, 6.6], [12.8, 9.4]]) { q.beginPath(); q.arc(a * u, b * u, u * 1.5, 0, 7); q.fill(); q.stroke(); } }
      else if (k === 1) { q.fillStyle = '#8a5a22'; q.beginPath(); q.roundRect(u * 3, u * 6, u * 10, u * 7, u); q.fill(); q.stroke(); q.fillStyle = '#b07a2a'; q.beginPath(); q.roundRect(u * 3, u * 4, u * 10, u * 3.5, [u * 3, u * 3, 0, 0]); q.fill(); q.stroke(); q.shadowBlur = 0; q.fillStyle = '#ffd23f'; q.fillRect(u * 3, u * 8.4, u * 10, u * 0.9); q.fillRect(u * 7.2, u * 7.6, u * 1.6, u * 2.6); }
      else if (k === 2) { q.fillStyle = '#e8e0d0'; q.beginPath(); q.arc(u * 8, u * 7, u * 4.2, 0, 7); q.fill(); q.stroke(); q.beginPath(); q.roundRect(u * 5.8, u * 9.6, u * 4.4, u * 3.4, u * 0.8); q.fill(); q.stroke(); q.shadowBlur = 0; q.fillStyle = '#2a1a14'; q.beginPath(); q.ellipse(u * 6.4, u * 7, u * 1.1, u * 1.4, 0, 0, 7); q.ellipse(u * 9.6, u * 7, u * 1.1, u * 1.4, 0, 0, 7); q.fill(); q.fillRect(u * 7.6, u * 9, u * 0.8, u * 1.2); }
      else if (k === 3) { q.fillStyle = '#ffd23f'; q.beginPath(); q.moveTo(u * 8, u * 2); q.lineTo(u * 12, u * 6); q.lineTo(u * 10, u * 13.5); q.lineTo(u * 6, u * 13.5); q.lineTo(u * 4, u * 6); q.closePath(); q.fill(); q.stroke(); q.shadowBlur = 0; q.fillStyle = '#fff6c9'; q.beginPath(); q.moveTo(u * 8, u * 2); q.lineTo(u * 9.2, u * 6); q.lineTo(u * 6.2, u * 6); q.fill(); q.fillStyle = '#e0483a'; q.beginPath(); q.arc(u * 8, u * 9, u * 1.3, 0, 7); q.fill(); }
      else if (k === 4) { q.fillStyle = '#cdb9a0'; q.beginPath(); q.ellipse(u * 8, u * 10.5, u * 5.5, u * 3.2, 0, 0, Math.PI); q.fill(); q.stroke(); q.fillStyle = '#e6d6c0'; q.beginPath(); q.ellipse(u * 8, u * 9.5, u * 5.5, u * 4.4, 0, Math.PI, Math.PI * 2); q.fill(); q.stroke(); q.shadowColor = '#fff'; q.shadowBlur = u * 4; q.fillStyle = '#fdfdff'; q.beginPath(); q.arc(u * 8, u * 9.6, u * 2.4, 0, 7); q.fill(); q.shadowBlur = 0; q.fillStyle = '#b8c8ff'; q.beginPath(); q.arc(u * 8.7, u * 10.3, u * 1.2, 0, 7); q.fill(); q.fillStyle = '#fff'; q.beginPath(); q.arc(u * 7.2, u * 8.8, u * 0.7, 0, 7); q.fill(); }
      else if (k === 5) { q.fillStyle = '#ffd23f'; q.beginPath(); q.roundRect(u * 5, u * 7.5, u * 6, u * 6.5, u); q.fill(); q.stroke(); q.beginPath(); q.arc(u * 8, u * 5.2, u * 3, 0, 7); q.fill(); q.stroke(); q.shadowBlur = 0; q.fillStyle = '#2a1a14'; q.fillRect(u * 6.6, u * 4.6, u * 0.9, u * 0.9); q.fillRect(u * 8.6, u * 4.6, u * 0.9, u * 0.9); q.fillRect(u * 7, u * 6.4, u * 2, u * 0.5); q.fillStyle = '#e0483a'; q.beginPath(); q.arc(u * 8, u * 10.5, u * 1.1, 0, 7); q.fill(); q.fillStyle = '#fff6c9'; q.fillRect(u * 5.6, u * 8, u * 0.8, u * 4); }
      else if (k === 7) { const gh = q.createRadialGradient(u * 6.5, u * 6.5, u, u * 8, u * 8.5, u * 6); gh.addColorStop(0, '#fff3c4'); gh.addColorStop(0.5, '#e0a43a'); gh.addColorStop(1, '#8a4a16'); q.fillStyle = gh; q.beginPath(); q.ellipse(u * 8, u * 8.6, u * 4, u * 5.2, 0, 0, 7); q.fill(); q.stroke(); q.shadowBlur = 0; q.fillStyle = '#7a1f1466'; for (const [a, b] of [[6.5, 7], [9.5, 9], [7.5, 11], [9, 5.5]]) { q.beginPath(); q.arc(a * u, b * u, u * 0.7, 0, 7); q.fill(); } }
      else { q.shadowColor = '#ff5a3a'; q.shadowBlur = u * 6; q.fillStyle = '#ff3d3d'; q.strokeStyle = '#7a0f14'; q.beginPath(); q.moveTo(u * 8, u * 14); q.bezierCurveTo(u * 1, u * 9, u * 2, u * 2.5, u * 8, u * 5.5); q.bezierCurveTo(u * 14, u * 2.5, u * 15, u * 9, u * 8, u * 14); q.fill(); q.stroke(); q.shadowBlur = 0; q.fillStyle = '#ff9a7a'; q.beginPath(); q.moveTo(u * 8, u * 5.5); q.lineTo(u * 5, u * 8); q.lineTo(u * 8, u * 14); q.fill(); q.fillStyle = '#fff'; q.beginPath(); q.ellipse(u * 5.2, u * 6, u * 1.2, u * 0.7, -0.6, 0, 7); q.fill(); }
      q.shadowBlur = 0;
    }
  }
  return tiles.set(key, c), c;
}
// Figuras chicas que se pintan una vez y se estampan muchas: el resplandor de la lava y las burbujas.
const sprites = new Map(), calor = [], gases = [], V4 = [[0, -1], [1, 0], [0, 1], [-1, 0]];
function sprite(id) {
  let c = sprites.get(id); if (c) return c;
  c = document.createElement('canvas'); const q = c.getContext('2d');
  if (id === 'res') {
    const n = c.width = c.height = Math.ceil(T * 2.5), m = n / 2, gr = q.createRadialGradient(m, m, T * 0.2, m, m, m);
    gr.addColorStop(0, 'rgba(255,170,60,0.55)'); gr.addColorStop(0.45, 'rgba(255,110,30,0.2)'); gr.addColorStop(1, 'rgba(255,90,20,0)'); q.fillStyle = gr; q.fillRect(0, 0, n, n);
  } else if (id === 'cor') {                         // el Corazón de la Tierra, grande y sin fondo
    const n = c.width = c.height = Math.ceil(T * 3), u = n / 16;
    q.shadowColor = '#ff5a3a'; q.shadowBlur = u * 1.6; q.fillStyle = '#ff3d3d'; q.strokeStyle = '#7a0f14'; q.lineWidth = u * 0.4; q.lineJoin = 'round';
    q.beginPath(); q.moveTo(u * 8, u * 14); q.bezierCurveTo(u * 1, u * 9, u * 2, u * 2.5, u * 8, u * 5.5); q.bezierCurveTo(u * 14, u * 2.5, u * 15, u * 9, u * 8, u * 14); q.fill(); q.stroke(); q.shadowBlur = 0;
    q.fillStyle = '#ff9a7a'; q.beginPath(); q.moveTo(u * 8, u * 5.5); q.lineTo(u * 5, u * 8); q.lineTo(u * 8, u * 14); q.fill(); q.fillStyle = '#c81e2a'; q.beginPath(); q.moveTo(u * 8, u * 5.5); q.lineTo(u * 11.5, u * 8.5); q.lineTo(u * 8, u * 14); q.fill();
    q.fillStyle = '#fff'; q.beginPath(); q.ellipse(u * 5.2, u * 6, u * 1.2, u * 0.7, -0.6, 0, 7); q.fill();
  } else if (id === 'geo') { const u = T / 16; c.width = c.height = T; q.shadowColor = '#c9a0ff'; q.shadowBlur = u * 2.5; q.fillStyle = '#b48cf0'; q.beginPath(); q.moveTo(u * 9, u * 6); q.lineTo(u * 10.4, u * 8.2); q.lineTo(u * 9.4, u * 10.6); q.lineTo(u * 8.4, u * 8.4); q.fill(); q.fillStyle = '#fff'; q.fillRect(u * 9.1, u * 7.4, u * 0.6, u * 0.6);
  } else if (id[0] === 'f') {                        // lo que crece en el piso de las cuevas naturales
    const z = +id[1], v = +id[2], u = T / 16; c.width = c.height = T;
    const hongo = (x, a, copa, tallo) => { q.fillStyle = tallo; q.fillRect((x - 0.4) * u, (16 - a) * u, u * 0.8, a * u); q.fillStyle = copa; q.beginPath(); q.ellipse(x * u, (16 - a) * u, u * (1.1 + a * 0.16), u * (0.7 + a * 0.08), 0, Math.PI, Math.PI * 2); q.fill(); };
    if (z === 0) { hongo(v ? 4 : 11, 3, '#a8734f', '#d9c7b0'); hongo(v ? 6.5 : 8.5, 2, '#8a5c3e', '#d9c7b0'); }
    else if (z === 4) { q.strokeStyle = '#3fbf8a'; q.lineWidth = u * 0.8; q.lineCap = 'round'; for (const [x, a, k] of v ? [[4, 9, 1], [7, 6, -1], [12, 8, 1]] : [[5, 7, -1], [10, 10, 1]]) { q.beginPath(); q.moveTo(x * u, 16 * u); q.quadraticCurveTo((x + k * 2) * u, (16 - a / 2) * u, x * u, (16 - a) * u); q.stroke(); } }
    else if (z === 5) { q.shadowColor = '#5cffd9'; q.shadowBlur = u * 3; hongo(v ? 5 : 10, 5, '#5cffd9', '#bafff0'); hongo(v ? 8 : 6.5, 3, '#39d6c0', '#bafff0'); hongo(v ? 11.5 : 13, 2, '#5cffd9', '#bafff0'); }
    else if (z === 6) { q.shadowColor = '#8f9bff'; q.shadowBlur = u * 2.5; for (const [x, a, an] of v ? [[5, 6, -0.3], [8, 9, 0.1], [11, 5, 0.4]] : [[6, 8, -0.15], [10, 6, 0.35]]) { q.fillStyle = '#8f9bff'; q.beginPath(); q.moveTo((x - 1.2) * u, 16 * u); q.lineTo((x + an * a) * u, (16 - a) * u); q.lineTo((x + 1.2) * u, 16 * u); q.fill(); q.fillStyle = '#dfe3ff'; q.beginPath(); q.moveTo((x - 1.2) * u, 16 * u); q.lineTo((x + an * a) * u, (16 - a) * u); q.lineTo((x - 0.2) * u, 16 * u); q.fill(); } }
    else { q.shadowColor = '#ff7a3a'; q.shadowBlur = u * 3; q.strokeStyle = '#ffb347'; q.lineWidth = u * 0.7; q.beginPath(); q.moveTo((v ? 3 : 6) * u, 15.6 * u); q.lineTo(7 * u, 15 * u); q.lineTo(9 * u, 15.7 * u); q.lineTo((v ? 13 : 11) * u, 15.2 * u); q.stroke(); }
  } else if (id === 'vaho') {
    const n = c.width = c.height = Math.ceil(T * 1.6), m = n / 2, gr = q.createRadialGradient(m, m, 0, m, m, m);
    gr.addColorStop(0, 'rgba(120,255,100,0.5)'); gr.addColorStop(1, 'rgba(120,255,100,0)'); q.fillStyle = gr; q.fillRect(0, 0, n, n);
  } else {
    const n = c.width = c.height = Math.max(8, Math.ceil(T * 0.5)), m = n / 2, lava = id === 'bl';
    q.beginPath(); q.arc(m, m, m * 0.8, 0, 7); q.fillStyle = lava ? '#ffd76a' : 'rgba(150,255,130,0.38)'; q.fill(); q.lineWidth = Math.max(1, n * 0.09); q.strokeStyle = lava ? '#fff3c4' : '#b9ffa6'; q.stroke();
    q.fillStyle = '#ffffffd0'; q.beginPath(); q.arc(m * 0.7, m * 0.66, m * 0.2, 0, 7); q.fill();
  }
  return sprites.set(id, c), c;
}

/* ── Edificios: se pintan una vez en su propio lienzo ── */
function casa(e) {
  let c = casas.get(e.id); if (c) return c;
  const u = T / 16, Wc = Math.ceil(78 * u), Hc = Math.ceil(76 * u);
  c = document.createElement('canvas'); c.width = Wc; c.height = Hc;
  const q = c.getContext('2d'), P = Hc;            // P = piso
  const caja = (x, y, w, h, col, borde = '#00000055') => { q.fillStyle = col; q.fillRect(x * u, y * u, w * u, h * u); if (borde) { q.strokeStyle = borde; q.lineWidth = Math.max(1, u * 0.5); q.strokeRect(x * u, y * u, w * u, h * u); } };
  const letrero = () => {};                         // el letrero se pinta al final, igual para todos
  const y0 = 76;                                    // todo se mide hacia arriba desde el piso
  q.fillStyle = '#3a2d28'; q.fillRect(24 * u, 16 * u, 1.6 * u, 30 * u); q.fillRect(52.4 * u, 16 * u, 1.6 * u, 30 * u);   // postes del letrero
  q.translate(10 * u, 0);
  q.fillStyle = '#00000033'; q.beginPath(); q.ellipse(29 * u, P - u * 0.6, 27 * u, 2 * u, 0, 0, 7); q.fill();
  if (e.id === 'pin') {                              // La Pinturería: una camioneta rosa con toldo de rayas, latas de colores y una brocha
    q.fillStyle = '#ff7ac8'; q.beginPath(); q.roundRect(4 * u, (y0 - 30) * u, 50 * u, 24 * u, [6 * u, 10 * u, 2 * u, 2 * u]); q.fill(); q.strokeStyle = '#8a3a6a'; q.lineWidth = u * 0.6; q.stroke();
    q.fillStyle = '#ffffff'; q.fillRect(4 * u, (y0 - 19) * u, 50 * u, 3 * u);                                                   // la raya blanca
    caja(38, y0 - 27, 12, 9, '#9fe3ff'); caja(8, y0 - 27, 26, 9, '#fff7e6');                                                     // parabrisas y ventana de la tienda
    ['#ffd23f', '#6ec3ff', '#6fdc7a', '#c05cff', '#ff9f40', '#ff6b5a', '#f3e6d8'].forEach((c, i) => { q.fillStyle = c; q.fillRect((9 + i * 3.5) * u, (y0 - 25) * u, 2.2 * u, 5 * u); q.fillStyle = '#2b2b2b'; q.fillRect((9 + i * 3.5) * u, (y0 - 25.6) * u, 2.2 * u, 0.7 * u); });   // las latas
    for (let i = 0; i < 8; i++) { q.fillStyle = i % 2 ? '#ffffff' : '#ff6b5a'; q.beginPath(); q.moveTo((5 + i * 6.1) * u, (y0 - 33) * u); q.lineTo((11.1 + i * 6.1) * u, (y0 - 33) * u); q.lineTo((8 + i * 6.1) * u, (y0 - 29.5) * u); q.closePath(); q.fill(); }   // el toldo
    for (const x of [12, 46]) { q.fillStyle = '#2b2b2b'; q.beginPath(); q.arc(x * u, (y0 - 4.5) * u, 4.5 * u, 0, 7); q.fill(); q.fillStyle = '#8d8a86'; q.beginPath(); q.arc(x * u, (y0 - 4.5) * u, 2 * u, 0, 7); q.fill(); }   // las llantas
    q.fillStyle = '#5b3d17'; q.fillRect(27.6 * u, (y0 - 43) * u, 1.8 * u, 10 * u); q.fillStyle = '#ffd23f'; q.fillRect(25.5 * u, (y0 - 49) * u, 6 * u, 7 * u); q.fillStyle = '#ff7ac8'; q.fillRect(25.5 * u, (y0 - 49) * u, 6 * u, 2.6 * u);   // la brocha, con la punta rosa
    letrero();
  } else if (e.id === 'gas') {
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
  } else if (e.id === 'ele') {                       // castillete de mina: torre, rueda y jaula
    q.strokeStyle = '#5b3d17'; q.lineWidth = u * 2; q.lineCap = 'round';
    q.beginPath(); q.moveTo(14 * u, y0 * u); q.lineTo(24 * u, (y0 - 44) * u); q.moveTo(44 * u, y0 * u); q.lineTo(34 * u, (y0 - 44) * u); q.moveTo(20 * u, (y0 - 18) * u); q.lineTo(38 * u, (y0 - 18) * u); q.moveTo(22.5 * u, (y0 - 32) * u); q.lineTo(35.5 * u, (y0 - 32) * u); q.moveTo(17 * u, (y0 - 12) * u); q.lineTo(36 * u, (y0 - 31) * u); q.stroke();
    q.lineCap = 'butt'; caja(21, y0 - 47, 16, 4, '#3a2d28');
    q.strokeStyle = '#2b2b2b'; q.lineWidth = u * 1.4; q.beginPath(); q.arc(29 * u, (y0 - 51) * u, 4.6 * u, 0, 7); q.stroke();
    q.lineWidth = u * 0.6; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; q.beginPath(); q.moveTo((29 + Math.cos(a) * 4.6) * u, (y0 - 51 + Math.sin(a) * 4.6) * u); q.lineTo((29 - Math.cos(a) * 4.6) * u, (y0 - 51 - Math.sin(a) * 4.6) * u); q.stroke(); }
    q.beginPath(); q.moveTo(29 * u, (y0 - 46) * u); q.lineTo(29 * u, (y0 - 16) * u); q.stroke();           // el cable
    caja(23, y0 - 16, 12, 16, '#ff9f40'); caja(25, y0 - 13, 8, 10, '#2a1a14'); q.fillStyle = '#ffe9a8'; q.fillRect(25.6 * u, (y0 - 12.4) * u, 6.8 * u, 3 * u);     // la jaula
    caja(46, y0 - 14, 9, 14, '#6e6966'); caja(48, y0 - 11, 5, 5, '#12261c'); q.fillStyle = '#6fdc7a'; q.fillRect(49 * u, (y0 - 10) * u, u, u); q.fillStyle = '#e0483a'; q.fillRect(51 * u, (y0 - 10) * u, u, u);   // el tablero
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
  // Letrero: arriba el nombre, abajo qué se hace ahí. Que nadie tenga que adivinar.
  q.setTransform(1, 0, 0, 1, 0, 0);
  const lx = 3 * u, ly = 1.5 * u, lw = 72 * u, lh = 16 * u;
  const cabe = (txt, peso, tam, ancho) => { do { q.font = `${peso} ${tam}px system-ui`; tam *= 0.94; } while (q.measureText(txt).width > ancho && tam > u * 2); };
  q.shadowColor = '#0008'; q.shadowBlur = u * 2; q.shadowOffsetY = u * 0.8;
  q.fillStyle = '#1b120e'; q.beginPath(); q.roundRect(lx, ly, lw, lh, u * 2.6); q.fill();
  q.shadowBlur = 0; q.shadowOffsetY = 0; q.shadowColor = 'transparent';
  q.strokeStyle = e.col; q.lineWidth = u * 1.1; q.stroke();
  q.fillStyle = e.col; q.beginPath(); q.roundRect(lx + u * 1.6, ly + u * 1.6, lw - u * 3.2, u * 7.2, [u * 1.6, u * 1.6, 0, 0]); q.fill();
  q.fillStyle = '#ffffff40'; q.fillRect(lx + u * 1.6, ly + u * 1.6, lw - u * 3.2, u * 1.4);
  q.textAlign = 'center'; q.textBaseline = 'middle';
  q.fillStyle = e.tinta; cabe(e.n.toUpperCase(), 900, u * 5.6, lw - u * 8); q.fillText(e.n.toUpperCase(), lx + lw / 2, ly + u * 5.5);
  q.fillStyle = '#f3e6d8'; cabe(e.h, 700, u * 3.5, lw - u * 6); q.fillText(e.h, lx + lw / 2, ly + u * 12.2);
  q.fillStyle = '#ffe9a8'; for (let i = 0; i < 11; i++) { q.beginPath(); q.arc(lx + u * 4 + i * (lw - u * 8) / 10, ly, u * 0.75, 0, 7); q.fill(); }
  return casas.set(e.id, c), c;
}

/* ── La maquinita ── */
const rgba = (hx, a) => { const n = parseInt(hx.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
function dibMaq(q, px, py, t, modelo, dir, vuela, perfDir, nombre, estado, mundoX = px / t, pinta = null) {
  const P = pinta || {}, M = MODELOS[modelo] || MODELOS[0], c1 = P.c1 || M[0], c2 = P.c2 || M[1], carro = P.carro | 0, w = t * 0.74, h = t * 0.8, x = px - w / 2, y = py - h / 2, lw = Math.max(1, t * 0.03);
  if (P.luz) { const gl = q.createRadialGradient(px, y + h * 0.95, 0, px, y + h * 0.95, w * 0.95); gl.addColorStop(0, rgba(P.luz, 0.5)); gl.addColorStop(1, rgba(P.luz, 0)); q.fillStyle = gl; q.fillRect(px - w, y + h * 0.5, w * 2, h * 0.85); }      // luz de piso
  q.lineJoin = 'round';
  if (perfDir) {                                     // taladro girando
    const z = (reloj * 9) % 1, base = '#d7dbe0', raya = '#7f8791';
    q.save();
    if (perfDir === 2) q.translate(px, y + h * 0.92); else { q.translate(px + perfDir * w * 0.46, py + h * 0.12); q.rotate(-perfDir * Math.PI / 2); }
    const bw = w * 0.3, l = t * 0.36, cono = () => { q.beginPath(); q.moveTo(-bw, 0); q.lineTo(bw, 0); q.lineTo(0, l); q.closePath(); };
    cono(); q.fillStyle = base; q.fill(); q.save(); q.clip();
    q.strokeStyle = raya; q.lineWidth = t * 0.05; for (let i = -1; i < 4; i++) { const yy = (i + z) * l * 0.34; q.beginPath(); q.moveTo(-bw, yy); q.lineTo(bw, yy + l * 0.22); q.stroke(); }
    q.restore(); cono(); q.strokeStyle = '#2b2b2b'; q.lineWidth = lw; q.stroke(); q.restore();
  }
  if (vuela === 2) {                                 // planeando: tres rotorcitos, todos hacia arriba, que frenan la caída
    for (const [dx, al, f] of [[-0.27, 0.13, 0], [0, 0.2, 2], [0.27, 0.13, 4]]) {
      q.fillStyle = '#555'; q.fillRect(px + w * dx - t * 0.015, y + h * 0.16 - t * al, t * 0.03, t * al);
      q.globalAlpha = 0.65; q.fillStyle = '#e8eef2'; q.beginPath(); q.ellipse(px + w * dx, y + h * 0.16 - t * al, w * (0.1 + 0.13 * Math.abs(Math.sin(reloj * 80 + f))), t * 0.026, 0, 0, 7); q.fill(); q.globalAlpha = 1;
    }
  } else if (vuela) {                                // hélice
    q.fillStyle = '#555'; q.fillRect(px - t * 0.02, y - t * 0.1, t * 0.04, t * 0.16);
    q.globalAlpha = 0.6; q.fillStyle = '#e8eef2'; q.beginPath(); q.ellipse(px, y - t * 0.1, w * (0.35 + 0.35 * Math.abs(Math.sin(reloj * 63))), t * 0.035, 0, 0, 7); q.fill(); q.globalAlpha = 1;
  }
  // orugas
  q.fillStyle = '#26221f'; q.beginPath(); q.roundRect(x - t * 0.03, y + h * 0.7, w + t * 0.06, h * 0.3, h * 0.15); q.fill();
  q.fillStyle = P.c3 || '#6f6a66'; for (let i = 0; i < 3; i++) { q.beginPath(); q.arc(x + w * (0.17 + i * 0.33), y + h * 0.85, h * 0.085, 0, 7); q.fill(); }
  q.fillStyle = '#4a4543'; const paso = w / 5, corre = ((mundoX * t * 0.9) % paso + paso) % paso;
  for (let i = -1; i < 6; i++) { const tx = x + i * paso + corre; if (tx > x - t * 0.02 && tx < x + w) { q.fillRect(tx, y + h * 0.71, t * 0.03, h * 0.05); q.fillRect(x + w - (tx - x) - t * 0.03, y + h * 0.95, t * 0.03, h * 0.05); } }
  // escape
  q.fillStyle = '#4a4543'; q.fillRect(px - dir * w * 0.42 - t * 0.03, y + h * 0.08, t * 0.06, h * 0.2);
  // cuerpo
  const gr = q.createLinearGradient(0, y + h * 0.14, 0, y + h * 0.76); gr.addColorStop(0, mezcla(c1, 0.25)); gr.addColorStop(0.5, c1); gr.addColorStop(1, c2);
  q.fillStyle = gr; q.beginPath();
  if (carro === 1) { q.moveTo(x, y + h * 0.76); q.lineTo(x, y + h * 0.5); q.quadraticCurveTo(x, y + h * 0.08, px, y + h * 0.08); q.quadraticCurveTo(x + w, y + h * 0.08, x + w, y + h * 0.5); q.lineTo(x + w, y + h * 0.76); q.closePath(); }      // El Escarabajo: lomo redondo
  else if (carro === 2) q.roundRect(x, y + h * 0.24, w, h * 0.52, t * 0.04);      // La Locomotora: caja recta; la caldera y la chimenea van aparte
  else if (carro === 3) q.roundRect(x - t * 0.03, y + h * 0.14, w + t * 0.06, h * 0.62, h * 0.31);      // El Submarino: cápsula
  else q.roundRect(x, y + h * 0.16, w, h * 0.6, t * 0.12);
  q.fill(); q.strokeStyle = mezcla(c2, -0.5); q.lineWidth = lw; q.stroke();
  if (P.c1) {                                        // pintura de La Pinturería: un brillo de laca sobre el lomo
    q.save(); q.beginPath(); if (carro === 1) { q.moveTo(x, y + h * 0.76); q.lineTo(x, y + h * 0.5); q.quadraticCurveTo(x, y + h * 0.08, px, y + h * 0.08); q.quadraticCurveTo(x + w, y + h * 0.08, x + w, y + h * 0.5); q.lineTo(x + w, y + h * 0.76); q.closePath(); } else if (carro === 2) q.roundRect(x, y + h * 0.24, w, h * 0.52, t * 0.04); else if (carro === 3) q.roundRect(x - t * 0.03, y + h * 0.14, w + t * 0.06, h * 0.62, h * 0.31); else q.roundRect(x, y + h * 0.16, w, h * 0.6, t * 0.12); q.clip();
    const br = q.createLinearGradient(x, y, x + w * 0.6, y + h * 0.7); br.addColorStop(0, 'rgba(255,255,255,.38)'); br.addColorStop(0.35, 'rgba(255,255,255,.1)'); br.addColorStop(0.5, 'rgba(255,255,255,0)'); q.fillStyle = br; q.fillRect(x, y, w, h);
    q.fillStyle = 'rgba(255,255,255,.28)'; q.beginPath(); q.roundRect(x + w * 0.1, y + h * (carro === 1 ? 0.14 : 0.2), w * 0.55, h * 0.07, h * 0.035); q.fill(); q.restore();
  }
  if (carro === 1) {                                 // El Escarabajo: lomo de catarina con lunares brillantes, defensa cromada y faro redondo con aro
    q.fillStyle = mezcla(c2, -0.55); q.fillRect(px - t * 0.012, y + h * 0.1, t * 0.024, h * 0.56);          // la raya del lomo
    for (const [a, b, r] of [[-0.3, 0.3, 0.05], [-0.12, 0.19, 0.045], [0.1, 0.3, 0.05], [0.27, 0.22, 0.04], [0.02, 0.5, 0.035]]) { q.fillStyle = mezcla(c2, -0.55); q.beginPath(); q.arc(px + a * w, y + h * b, w * r, 0, 7); q.fill(); q.fillStyle = 'rgba(255,255,255,.35)'; q.beginPath(); q.arc(px + a * w - w * r * 0.3, y + h * b - w * r * 0.3, w * r * 0.35, 0, 7); q.fill(); }
    const cr = q.createLinearGradient(0, y + h * 0.66, 0, y + h * 0.76); cr.addColorStop(0, '#f4f6f8'); cr.addColorStop(0.5, '#9aa3ab'); cr.addColorStop(1, '#e8ecef'); q.fillStyle = cr; q.beginPath(); q.roundRect(x - t * 0.04, y + h * 0.66, w + t * 0.08, h * 0.09, h * 0.045); q.fill();   // la defensa cromada
  } else if (carro === 2) {                          // La Locomotora: caldera con bandas de latón, chimenea que humea, campana y quitapiedras
    const bx = px + dir * w * 0.28, cal = q.createLinearGradient(0, y + h * 0.28, 0, y + h * 0.72); cal.addColorStop(0, mezcla(c1, 0.3)); cal.addColorStop(0.5, c1); cal.addColorStop(1, mezcla(c2, -0.2));
    q.fillStyle = cal; q.beginPath(); q.roundRect(bx - w * 0.2, y + h * 0.28, w * 0.4, h * 0.44, h * 0.22); q.fill(); q.strokeStyle = mezcla(c2, -0.5); q.stroke();
    q.fillStyle = '#e2b24a'; for (const k of [-0.1, 0.1]) q.fillRect(bx + k * w - t * 0.012, y + h * 0.28, t * 0.024, h * 0.44);           // bandas de latón
    q.fillStyle = '#d9d2c4'; q.beginPath(); q.arc(bx + dir * w * 0.2, y + h * 0.5, h * 0.1, 0, 7); q.fill(); q.strokeStyle = '#2b2b2b'; q.stroke();   // la tapa de la caldera
    q.fillStyle = '#2b2b2b'; q.fillRect(bx - t * 0.045, y + h * 0.02, t * 0.09, h * 0.28); q.beginPath(); q.roundRect(bx - t * 0.075, y - h * 0.02, t * 0.15, h * 0.08, t * 0.02); q.fill();   // chimenea con copa
    for (let k = 0; k < 3; k++) { const f = ((reloj * 0.9 + k * 0.33) % 1); q.globalAlpha = 0.35 * (1 - f); q.fillStyle = '#e8e4dc'; q.beginPath(); q.arc(bx - dir * f * w * 0.5, y - h * 0.08 - f * h * 0.5, t * (0.05 + f * 0.09), 0, 7); q.fill(); } q.globalAlpha = 1;   // el humo
    q.fillStyle = '#e2b24a'; q.beginPath(); q.arc(bx - dir * w * 0.22, y + h * 0.2, h * 0.055, Math.PI, 0); q.fill(); q.fillRect(bx - dir * w * 0.22 - t * 0.008, y + h * 0.1, t * 0.016, h * 0.1);   // la campana
    q.strokeStyle = '#2b2b2b'; q.lineWidth = Math.max(1, t * 0.025); q.beginPath(); for (let k = 0; k < 4; k++) { q.moveTo(px + dir * w * (0.44 + k * 0.03), y + h * 0.62); q.lineTo(px + dir * w * (0.5 + k * 0.03), y + h * 0.78); } q.stroke();   // quitapiedras
  } else if (carro === 3) {                          // El Submarino: remaches, ojos de buey con vidrio, periscopio, aleta y hélice que gira
    q.fillStyle = mezcla(c2, -0.5); for (let k = 0; k < 9; k++) { q.beginPath(); q.arc(x + w * (0.08 + k * 0.105), y + h * 0.62, t * 0.012, 0, 7); q.fill(); }     // remaches
    for (const k of [-0.28, -0.06]) { const ox2 = px + dir * k * w, oy2 = y + h * 0.42; q.fillStyle = '#e2b24a'; q.beginPath(); q.arc(ox2, oy2, w * 0.095, 0, 7); q.fill(); const vd = q.createRadialGradient(ox2 - w * 0.03, oy2 - w * 0.03, 0, ox2, oy2, w * 0.075); vd.addColorStop(0, '#dff6ff'); vd.addColorStop(1, '#3a8fb8'); q.fillStyle = vd; q.beginPath(); q.arc(ox2, oy2, w * 0.072, 0, 7); q.fill(); q.fillStyle = 'rgba(255,255,255,.55)'; q.beginPath(); q.ellipse(ox2 - w * 0.025, oy2 - w * 0.03, w * 0.025, w * 0.014, -0.7, 0, 7); q.fill(); }   // ojos de buey
    q.fillStyle = '#7f8791'; q.fillRect(px - dir * w * 0.18 - t * 0.016, y - h * 0.02, t * 0.032, h * 0.2); q.fillRect(px - dir * w * 0.18 - (dir > 0 ? t * 0.016 : t * 0.07), y - h * 0.02, t * 0.086, t * 0.035); q.fillStyle = '#9fe3ff'; q.fillRect(px - dir * w * 0.18 + (dir > 0 ? t * 0.05 : -t * 0.07), y - h * 0.015, t * 0.02, t * 0.025);   // periscopio con lente
    q.fillStyle = mezcla(c2, -0.3); q.beginPath(); q.moveTo(px - dir * w * 0.3, y + h * 0.16); q.lineTo(px - dir * w * 0.42, y + h * 0.02); q.lineTo(px - dir * w * 0.46, y + h * 0.18); q.closePath(); q.fill();   // aleta
    q.save(); q.translate(px - dir * w * 0.52, y + h * 0.45); q.fillStyle = '#c9ced3'; for (let k = 0; k < 3; k++) { q.rotate(2.094); q.beginPath(); q.ellipse(0, -h * 0.07 * (0.3 + 0.7 * Math.abs(Math.sin(reloj * 9 + k))), h * 0.03, h * 0.08, 0, 0, 7); q.fill(); } q.restore();   // la hélice
  }
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
  if (P.calca !== undefined && TC.CALCAS[P.calca]) {                                   // la calcomanía: troquelada en blanco, un poco ladeada, como las de verdad
    const sx = px - dir * w * 0.24, sy = y + h * 0.46, r = h * 0.19; q.save(); q.translate(sx, sy); q.rotate(-0.14 * dir);
    q.fillStyle = 'rgba(0,0,0,.28)'; q.beginPath(); q.roundRect(-r + t * 0.015, -r + t * 0.02, r * 2, r * 2, r * 0.45); q.fill();
    q.fillStyle = '#fff'; q.beginPath(); q.roundRect(-r, -r, r * 2, r * 2, r * 0.45); q.fill(); q.strokeStyle = '#d8d2c6'; q.lineWidth = Math.max(1, t * 0.015); q.stroke();
    q.font = `${h * 0.27}px system-ui,"Apple Color Emoji","Segoe UI Emoji"`; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillStyle = '#000'; q.fillText(TC.CALCAS[P.calca], 0, h * 0.015); q.restore();
  }
  // faro
  if (P.luz) {                                       // luz de La Pinturería: el faro echa un haz hacia adelante y brilla
    const fx = px + dir * w * 0.44, fy = y + h * 0.5, hz = q.createLinearGradient(fx, fy, fx + dir * w * 1.9, fy); hz.addColorStop(0, rgba(P.luz, 0.32)); hz.addColorStop(1, rgba(P.luz, 0));
    q.fillStyle = hz; q.beginPath(); q.moveTo(fx, fy - h * 0.05); q.lineTo(fx + dir * w * 1.9, fy - h * 0.55); q.lineTo(fx + dir * w * 1.9, fy + h * 0.55); q.lineTo(fx, fy + h * 0.05); q.closePath(); q.fill();
    const ha = q.createRadialGradient(fx, fy, 0, fx, fy, h * 0.22); ha.addColorStop(0, rgba(P.luz, 0.9)); ha.addColorStop(1, rgba(P.luz, 0)); q.fillStyle = ha; q.fillRect(fx - h * 0.22, fy - h * 0.22, h * 0.44, h * 0.44);
  }
  q.fillStyle = P.luz || (q === g ? faroCol : '#fff3b0'); q.beginPath(); q.arc(px + dir * w * 0.44, y + h * 0.5, h * 0.06, 0, 7); q.fill(); if (q === g) faroCol = '#fff3b0';
  if (P.cu) {                                        // 🎂 gorrito de fiesta: solo el día de su cumpleaños
    const gx = px - dir * w * 0.12, gy = y - h * 0.02, gh = t * 0.34, gw = t * 0.22;
    q.save(); q.translate(gx, gy); q.rotate(-dir * 0.18);
    q.fillStyle = '#ff7ac8'; q.beginPath(); q.moveTo(-gw / 2, 0); q.lineTo(gw / 2, 0); q.lineTo(0, -gh); q.closePath(); q.fill();
    q.fillStyle = '#ffd23f'; for (const [a, b] of [[-0.12, -0.3], [0.1, -0.55], [-0.04, -0.78]]) { q.beginPath(); q.arc(a * gw * 2, b * gh, t * 0.025, 0, 7); q.fill(); }
    q.fillStyle = '#6ec3ff'; q.beginPath(); q.arc(0, -gh, t * 0.045, 0, 7); q.fill(); q.restore();
  }
  if (P.mascota) dibMascota(q, P.mascota, px - dir * w * 0.98, y + (P.mascota === 2 ? h * 0.62 : -h * 0.05), t, dir, reloj + px * 0.013);
  if (nombre) {
    const placa = P.placa | 0, tx = estado ? nombre + ' · ' + estado : nombre, ty = y - t * (P.cu ? 0.46 : 0.16), tam = Math.max(10 * RES, t * 0.27);      // con gorrito de cumpleaños, el nombre sube
    q.font = `700 ${tam}px system-ui`; q.textAlign = 'center'; q.textBaseline = 'bottom';
    const an = q.measureText(tx).width;
    if (placa === 3) {                               // con marco: una placa de metal con remaches
      const a2 = an + t * 0.34, al = tam * 1.4, mx = px - a2 / 2, my = ty - al - t * 0.02, mg = q.createLinearGradient(0, my, 0, my + al); mg.addColorStop(0, '#3a3f45'); mg.addColorStop(1, '#15181b');
      q.fillStyle = mg; q.beginPath(); q.roundRect(mx, my, a2, al, t * 0.06); q.fill(); q.strokeStyle = c1; q.lineWidth = Math.max(1, t * 0.035); q.stroke();
      q.fillStyle = '#c9ced3'; for (const [a, b] of [[0.08, 0.3], [0.92, 0.3], [0.08, 0.7], [0.92, 0.7]]) { q.beginPath(); q.arc(mx + a2 * a, my + al * b, t * 0.018, 0, 7); q.fill(); }
    }
    if (placa === 2) {                               // con corona: una corona de oro con sus joyas, sobre el nombre
      const cw = tam * 0.9, ch = tam * 0.62, cx2 = px, cy2 = ty - tam * 1.08; q.fillStyle = '#ffd23f'; q.beginPath(); q.moveTo(cx2 - cw / 2, cy2); q.lineTo(cx2 - cw / 2, cy2 - ch * 0.75); q.lineTo(cx2 - cw * 0.25, cy2 - ch * 0.35); q.lineTo(cx2, cy2 - ch); q.lineTo(cx2 + cw * 0.25, cy2 - ch * 0.35); q.lineTo(cx2 + cw / 2, cy2 - ch * 0.75); q.lineTo(cx2 + cw / 2, cy2); q.closePath(); q.fill(); q.strokeStyle = '#8a5a00'; q.lineWidth = Math.max(1, t * 0.02); q.stroke();
      for (const [a, c] of [[-0.3, '#ff5a7a'], [0, '#6ec3ff'], [0.3, '#6fdc7a']]) { q.fillStyle = c; q.beginPath(); q.arc(cx2 + a * cw, cy2 - ch * 0.22, tam * 0.08, 0, 7); q.fill(); }
    }
    q.lineWidth = Math.max(2, t * 0.07); q.strokeStyle = '#000c'; q.strokeText(tx, px, ty);
    if (placa === 1) { const og = q.createLinearGradient(0, ty - tam, 0, ty); og.addColorStop(0, '#fff2b0'); og.addColorStop(0.45, '#ffd23f'); og.addColorStop(0.55, '#d99a1a'); og.addColorStop(1, '#ffe27a'); q.fillStyle = og; } else q.fillStyle = '#fff';
    q.fillText(tx, px, ty);
  }
}

// Las mascotas de La Pinturería, dibujadas y vivas: un pájaro que aletea, un perro que corre, un dron que zumba, una mariposa y una luciérnaga.
function dibMascota(q, k, mx, my, t, dir, r) {
  q.save(); q.translate(mx, my + (k === 2 ? 0 : Math.sin(r * 3.1) * t * 0.07)); if (dir < 0) q.scale(-1, 1);
  const u = t * 0.42, lw = Math.max(1, t * 0.02); q.lineWidth = lw; q.lineJoin = 'round';
  if (k === 1) {                                                        // pájaro naranja con panza clara
    const al = Math.sin(r * 16);
    q.fillStyle = '#ffb347'; q.beginPath(); q.ellipse(0, 0, u * 0.42, u * 0.3, 0, 0, 7); q.fill(); q.strokeStyle = '#8a4b12'; q.stroke();
    q.fillStyle = '#ffe3b0'; q.beginPath(); q.ellipse(u * 0.05, u * 0.08, u * 0.24, u * 0.16, 0, 0, 7); q.fill();
    q.fillStyle = '#ff9a3a'; q.beginPath(); q.ellipse(-u * 0.05, -u * 0.05 - al * u * 0.12, u * 0.26, u * 0.11, -0.4 - al * 0.5, 0, 7); q.fill(); q.stroke();      // el ala
    q.fillStyle = '#ff9a3a'; q.beginPath(); q.moveTo(-u * 0.4, 0); q.lineTo(-u * 0.62, -u * 0.12); q.lineTo(-u * 0.6, u * 0.1); q.closePath(); q.fill();        // la cola
    q.fillStyle = '#ffd23f'; q.beginPath(); q.moveTo(u * 0.4, -u * 0.04); q.lineTo(u * 0.6, u * 0.02); q.lineTo(u * 0.4, u * 0.08); q.closePath(); q.fill();      // el pico
    q.fillStyle = '#1b120e'; q.beginPath(); q.arc(u * 0.24, -u * 0.09, u * 0.045, 0, 7); q.fill();
  } else if (k === 2) {                                                 // perro café que corre
    const p = Math.sin(r * 14);
    q.fillStyle = '#b07a4a'; q.beginPath(); q.roundRect(-u * 0.42, -u * 0.22, u * 0.78, u * 0.36, u * 0.16); q.fill(); q.strokeStyle = '#5b3d17'; q.stroke();
    q.beginPath(); q.arc(u * 0.42, -u * 0.26, u * 0.22, 0, 7); q.fill(); q.stroke();                                                                    // cabeza
    q.fillStyle = '#7a5230'; q.beginPath(); q.ellipse(u * 0.3, -u * 0.3, u * 0.08, u * 0.17, 0.5, 0, 7); q.fill();                                       // oreja caída
    q.fillStyle = '#1b120e'; q.beginPath(); q.arc(u * 0.5, -u * 0.3, u * 0.035, 0, 7); q.fill(); q.beginPath(); q.arc(u * 0.63, -u * 0.2, u * 0.045, 0, 7); q.fill();   // ojo y nariz
    q.strokeStyle = '#5b3d17'; q.lineWidth = lw * 2.2; q.lineCap = 'round'; for (const [bx, f] of [[-0.3, 1], [-0.12, -1], [0.12, 1], [0.3, -1]]) { q.beginPath(); q.moveTo(bx * u, u * 0.1); q.lineTo(bx * u + f * p * u * 0.12, u * 0.36); q.stroke(); }   // patas
    q.beginPath(); q.moveTo(-u * 0.42, -u * 0.14); q.lineTo(-u * 0.62, -u * 0.34 + p * u * 0.1); q.stroke();                                              // la cola, meneándose
  } else if (k === 3) {                                                 // dron con dos rotores y luz que parpadea
    q.fillStyle = '#4a4f55'; q.beginPath(); q.roundRect(-u * 0.22, -u * 0.1, u * 0.44, u * 0.2, u * 0.06); q.fill(); q.strokeStyle = '#1b1b1b'; q.stroke();
    q.fillStyle = '#2b2b2b'; q.fillRect(-u * 0.5, -u * 0.05, u, u * 0.04);
    for (const bx of [-0.46, 0.46]) { q.fillStyle = '#9aa3ab'; q.fillRect(bx * u - u * 0.015, -u * 0.18, u * 0.03, u * 0.14); q.globalAlpha = 0.65; q.fillStyle = '#e8eef2'; q.beginPath(); q.ellipse(bx * u, -u * 0.18, u * (0.1 + 0.16 * Math.abs(Math.sin(r * 70 + bx))), u * 0.025, 0, 0, 7); q.fill(); q.globalAlpha = 1; }
    q.fillStyle = Math.sin(r * 6) > 0 ? '#ff3d3d' : '#5a1010'; q.beginPath(); q.arc(u * 0.14, 0, u * 0.045, 0, 7); q.fill(); q.fillStyle = '#9fe3ff'; q.beginPath(); q.arc(-u * 0.1, 0, u * 0.05, 0, 7); q.fill();
  } else if (k === 4) {                                                 // mariposa con alas degradadas que se abren y cierran
    const ab = 0.35 + 0.65 * Math.abs(Math.sin(r * 9)), ala = (sx) => { const gw = q.createLinearGradient(0, -u * 0.4, 0, u * 0.3); gw.addColorStop(0, '#ff7ac8'); gw.addColorStop(0.6, '#ff9f40'); gw.addColorStop(1, '#ffd23f'); q.fillStyle = gw; q.save(); q.scale(sx * ab, 1); q.beginPath(); q.ellipse(u * 0.26, -u * 0.12, u * 0.26, u * 0.2, 0.4, 0, 7); q.fill(); q.beginPath(); q.ellipse(u * 0.2, u * 0.16, u * 0.17, u * 0.13, -0.3, 0, 7); q.fill(); q.strokeStyle = '#7a2a5a'; q.lineWidth = lw; q.beginPath(); q.ellipse(u * 0.26, -u * 0.12, u * 0.26, u * 0.2, 0.4, 0, 7); q.stroke(); q.fillStyle = 'rgba(255,255,255,.5)'; q.beginPath(); q.arc(u * 0.3, -u * 0.14, u * 0.06, 0, 7); q.fill(); q.restore(); };
    ala(1); ala(-1);
    q.strokeStyle = '#3a2a22'; q.lineWidth = lw * 2; q.lineCap = 'round'; q.beginPath(); q.moveTo(0, -u * 0.2); q.lineTo(0, u * 0.22); q.stroke(); q.lineWidth = lw; q.beginPath(); q.moveTo(0, -u * 0.2); q.lineTo(-u * 0.12, -u * 0.38); q.moveTo(0, -u * 0.2); q.lineTo(u * 0.12, -u * 0.38); q.stroke();
  } else if (k === 5) {                                                 // luciérnaga: brilla a pulsos y deja chispitas
    const pulso = 0.6 + 0.4 * Math.sin(r * 4), gl = q.createRadialGradient(0, 0, 0, 0, 0, u * 0.7); gl.addColorStop(0, `rgba(255,240,120,${0.9 * pulso})`); gl.addColorStop(0.4, `rgba(255,230,90,${0.35 * pulso})`); gl.addColorStop(1, 'rgba(255,240,120,0)'); q.fillStyle = gl; q.fillRect(-u * 0.7, -u * 0.7, u * 1.4, u * 1.4);
    q.fillStyle = '#3a2a22'; q.beginPath(); q.ellipse(0, 0, u * 0.14, u * 0.08, 0, 0, 7); q.fill(); q.fillStyle = '#fff7b0'; q.beginPath(); q.ellipse(-u * 0.08, 0, u * 0.08, u * 0.06, 0, 0, 7); q.fill();
    q.globalAlpha = 0.5; q.fillStyle = '#ffffff'; q.beginPath(); q.ellipse(u * 0.02, -u * 0.1, u * 0.14, u * 0.05, -0.4 + Math.sin(r * 30) * 0.4, 0, 7); q.fill(); q.globalAlpha = 1;
    for (let k2 = 0; k2 < 3; k2++) { const f = (r * 0.7 + k2 * 0.33) % 1; q.globalAlpha = 0.8 * (1 - f); q.fillStyle = '#fff2a0'; q.beginPath(); q.arc(-u * (0.25 + f * 0.7), u * 0.1 + Math.sin(r * 5 + k2) * u * 0.15, u * 0.035, 0, 7); q.fill(); } q.globalAlpha = 1;
  }
  q.restore();
}
// Las estelas de La Pinturería: cada una con su propia figura (estrellas de cinco puntas, cinta de arcoíris, corazones, burbujas, chispas doradas con halo).
const huellas = [];
function dibujarEstelas(ox, oy, dt) {
  for (let i = huellas.length - 1; i >= 0; i--) {
    const e = huellas[i]; e.t -= dt; if (e.t <= 0) { huellas.splice(i, 1); continue; }
    e.x += e.vx * dt; e.y += e.vy * dt; e.rot += dt * e.giro; const k = e.t / e.t0, px = ox + e.x * T, py = oy + e.y * T, r = e.r * T * (e.tipo === 5 ? 1 + (1 - k) * 0.6 : 0.5 + k * 0.5);
    g.save(); g.translate(px, py); g.globalAlpha = Math.min(1, k * 1.6);
    if (e.tipo === 1) { const gl = g.createRadialGradient(0, 0, 0, 0, 0, r * 2.2); gl.addColorStop(0, 'rgba(255,230,120,.9)'); gl.addColorStop(1, 'rgba(255,200,40,0)'); g.fillStyle = gl; g.fillRect(-r * 2.2, -r * 2.2, r * 4.4, r * 4.4); g.rotate(e.rot); g.fillStyle = '#fff3b0'; g.beginPath(); for (let a = 0; a < 4; a++) { g.moveTo(0, 0); g.lineTo(Math.cos(a * 1.571) * r * 1.8, Math.sin(a * 1.571) * r * 1.8); g.lineTo(Math.cos(a * 1.571 + 0.785) * r * 0.35, Math.sin(a * 1.571 + 0.785) * r * 0.35); } g.closePath(); g.fill(); }       // chispa dorada con halo
    else if (e.tipo === 2) { g.fillStyle = e.col; g.beginPath(); g.roundRect(-r * 1.6, -r * 0.5, r * 3.2, r, r * 0.5); g.fill(); }       // cinta de arcoíris
    else if (e.tipo === 3) { g.rotate(e.rot); g.fillStyle = '#ffffff'; g.beginPath(); for (let a = 0; a < 5; a++) { const an = -1.571 + a * 1.2566, an2 = an + 0.628; g.lineTo(Math.cos(an) * r * 1.4, Math.sin(an) * r * 1.4); g.lineTo(Math.cos(an2) * r * 0.6, Math.sin(an2) * r * 0.6); } g.closePath(); g.fill(); g.strokeStyle = '#ffd23f'; g.lineWidth = Math.max(1, r * 0.2); g.stroke(); }       // estrella de cinco puntas
    else if (e.tipo === 4) { g.rotate(e.rot * 0.3); g.fillStyle = '#ff5e9a'; g.beginPath(); g.moveTo(0, r * 1.2); g.bezierCurveTo(-r * 1.9, -r * 0.3, -r * 0.9, -r * 1.6, 0, -r * 0.5); g.bezierCurveTo(r * 0.9, -r * 1.6, r * 1.9, -r * 0.3, 0, r * 1.2); g.fill(); g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.ellipse(-r * 0.6, -r * 0.6, r * 0.3, r * 0.18, -0.6, 0, 7); g.fill(); }       // corazón con brillo
    else { g.strokeStyle = 'rgba(200,235,255,.9)'; g.lineWidth = Math.max(1, r * 0.18); g.beginPath(); g.arc(0, 0, r * 1.2, 0, 7); g.stroke(); g.fillStyle = 'rgba(200,235,255,.18)'; g.fill(); g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.ellipse(-r * 0.45, -r * 0.5, r * 0.32, r * 0.18, -0.7, 0, 7); g.fill(); }       // burbuja
    g.restore();
  }
}
/* ── El cuadro completo ── */
// Subir es un viaje con su orden: tarde dorada, atardecer, hora azul, noche de estrellas, estrellas fugaces,
// aurora al cruzar al espacio, la estación en órbita, la Luna que crece y, al final, el Sol que vuelve a salir
// por la orilla del planeta. Cada fila: kilómetros de altura y cuatro colores, de arriba al horizonte.
const CIELOS = [
  [0, '#22407a', '#5f83bd', '#f0a868', '#fbd590'],       // tarde dorada
  [1.5, '#1d3774', '#6a74b4', '#f08f5e', '#ffc66e'],     // atardecer
  [5, '#141d52', '#553f86', '#d8585a', '#ff9450'],       // el Sol toca el horizonte
  [10, '#080e30', '#1c2462', '#553a80', '#c2567a'],      // hora azul
  [25, '#02030f', '#060b28', '#0d1742', '#2b3a7c'],      // noche
  [100, '#000004', '#000008', '#020818', '#0b1d4a'],     // espacio
  [450, '#000003', '#000005', '#00040e', '#071634'],
  [700, '#000003', '#000006', '#030a1e', '#16356e'],     // amanece sobre el planeta
  [1000, '#000002', '#000004', '#020716', '#1b3f8a'],
];
const tope = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const suave = (a, b, x) => { const t = tope((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const azar01 = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
function entre(a, b, k) {          // color entre dos colores
  const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16), c = (s) => Math.round(((x >> s) & 255) + (((y >> s) & 255) - ((x >> s) & 255)) * k);
  return `rgb(${c(16)},${c(8)},${c(0)})`;
}
let lunaC = null, planetaC = null;
function luna() {
  if (lunaC) return lunaC;
  const L = 512, m = L / 2; lunaC = document.createElement('canvas'); lunaC.width = lunaC.height = L;
  const q = lunaC.getContext('2d'), r = azarDe(77), gr = q.createRadialGradient(m * 0.78, m * 0.75, m * 0.08, m, m, m * 0.98);
  gr.addColorStop(0, '#f6f3ec'); gr.addColorStop(0.7, '#cbc7be'); gr.addColorStop(1, '#8e8a84');
  q.fillStyle = gr; q.beginPath(); q.arc(m, m, m * 0.97, 0, 7); q.fill(); q.save(); q.clip();
  q.fillStyle = '#00000026'; for (const [x, y, a, b, t] of [[0.6, 0.42, 0.19, 0.13, 0.5], [0.36, 0.62, 0.13, 0.1, -0.3], [0.44, 0.3, 0.1, 0.07, 0.2], [0.68, 0.66, 0.09, 0.06, 0.8]]) { q.beginPath(); q.ellipse(x * L, y * L, a * L, b * L, t, 0, 7); q.fill(); }     // los mares
  for (let i = 0; i < 60; i++) { const x = L * (0.06 + r() * 0.88), y = L * (0.06 + r() * 0.88), a = L * (0.008 + r() * r() * 0.05); q.fillStyle = '#00000020'; q.beginPath(); q.arc(x, y, a, 0, 7); q.fill(); q.strokeStyle = '#ffffff38'; q.lineWidth = Math.max(1, a * 0.14); q.beginPath(); q.arc(x + a * 0.08, y + a * 0.08, a, 0.6, 2.6); q.stroke(); q.strokeStyle = '#00000030'; q.beginPath(); q.arc(x, y, a, 3.6, 5.6); q.stroke(); }
  q.strokeStyle = '#ffffff22'; q.lineWidth = 2; for (let i = 0; i < 9; i++) { const a = i * 0.7; q.beginPath(); q.moveTo(L * 0.3, L * 0.78); q.lineTo(L * (0.3 + Math.cos(a) * 0.22), L * (0.78 + Math.sin(a) * 0.22)); q.stroke(); }      // los rayos de un cráter joven
  q.restore();
  return lunaC;
}
// El planeta visto desde arriba: desierto con manchas, cañones y nubes delgadas.
function planeta() {
  if (planetaC) return planetaC;
  const L = 512, m = L / 2; planetaC = document.createElement('canvas'); planetaC.width = planetaC.height = L;
  const q = planetaC.getContext('2d'), r = azarDe(912);
  q.beginPath(); q.arc(m, m, m, 0, 7); q.clip(); q.fillStyle = '#9a6a48'; q.fillRect(0, 0, L, L);
  for (let i = 0; i < 70; i++) { q.fillStyle = ['#7d5236', '#b07e56', '#6b4630', '#c2946a', '#8a5c3e'][i % 5]; q.globalAlpha = 0.25 + r() * 0.35; q.beginPath(); q.ellipse(r() * L, r() * L, L * (0.03 + r() * 0.12), L * (0.015 + r() * 0.05), r() * 3, 0, 7); q.fill(); }
  q.globalAlpha = 0.5; q.strokeStyle = '#5a3a26'; q.lineWidth = 2; for (let i = 0; i < 7; i++) { let x = r() * L, y = r() * L; q.beginPath(); q.moveTo(x, y); for (let k = 0; k < 6; k++) { x += (r() - 0.3) * L * 0.07; y += (r() - 0.5) * L * 0.06; q.lineTo(x, y); } q.stroke(); }
  q.fillStyle = '#fff'; for (let i = 0; i < 26; i++) { q.globalAlpha = 0.16 + r() * 0.2; q.beginPath(); q.ellipse(r() * L, r() * L, L * (0.04 + r() * 0.1), L * (0.006 + r() * 0.016), (r() - 0.5) * 0.7, 0, 7); q.fill(); }
  q.globalAlpha = 0.6; q.fillStyle = '#f4efe6'; q.beginPath(); q.ellipse(m, L * 0.02, L * 0.3, L * 0.07, 0, 0, 7); q.fill(); q.beginPath(); q.ellipse(m, L * 0.98, L * 0.26, L * 0.06, 0, 0, 7); q.fill();      // los polos
  return planetaC;
}
// Constelaciones: estrellas (x, y) y los trazos que las unen. Se dibujan sobre el cielo, que gira despacio.
const CONSTELA = [
  { x: 0.34, y: -0.3, e: [[-1, -2], [1, -2.1], [-0.5, 0], [0, 0.1], [0.5, 0.2], [-0.9, 2.1], [1.1, 2]], t: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6]] },      // Orión
  { x: -0.42, y: -0.36, e: [[-3, 0], [-2, -0.4], [-1, -0.3], [0, 0], [0.3, 0.9], [1.6, 1], [1.9, 0.1]], t: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] },             // la Osa Mayor
  { x: -0.05, y: -0.62, e: [[-2, 0], [-1, 1], [0, 0.2], [1, 1.1], [2, 0]], t: [[0, 1], [1, 2], [2, 3], [3, 4]] },                                                                // Casiopea
  { x: 0.58, y: 0.22, e: [[0, -1.4], [0, 1.6], [-1, 0.1], [1.1, -0.1]], t: [[0, 1], [2, 3]] },                                                                                  // la Cruz del Sur
  { x: -0.5, y: 0.2, e: [[-2, -1.5], [-1.6, -0.6], [-1, 0], [-0.4, 0.6], [0.3, 1.3], [1.2, 1.6], [2, 1.2], [2.2, 0.4]], t: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]] },   // el Escorpión
];
// El cielo estrellado se pinta una sola vez, a media resolución y en un cuadro más grande que la pantalla para poder girarlo.
function estrellas(lado) {
  const n = Math.ceil(lado / 2); let c = sprites.get('cielo'); if (c && c.width === n) return c;
  c = document.createElement('canvas'); c.width = c.height = n;
  const q = c.getContext('2d'), r = azarDe(4211), u = Math.max(1, RES * 0.6);
  q.save(); q.translate(n * 0.5, n * 0.5); q.rotate(-0.5);
  const via = q.createLinearGradient(0, -n * 0.13, 0, n * 0.13); via.addColorStop(0, 'rgba(150,160,255,0)'); via.addColorStop(0.5, 'rgba(175,180,255,0.17)'); via.addColorStop(1, 'rgba(150,160,255,0)');
  q.fillStyle = via; q.fillRect(-n, -n * 0.13, n * 2, n * 0.26);
  q.fillStyle = '#fff'; for (let i = 0; i < 1400; i++) { q.globalAlpha = 0.15 + r() * 0.5; q.fillRect((r() - 0.5) * n * 1.5, (r() + r() + r() - 1.5) * n * 0.07, u, u); }
  q.fillStyle = '#1a1030'; q.globalAlpha = 0.22; for (let i = 0; i < 9; i++) { q.beginPath(); q.ellipse((r() - 0.5) * n * 1.2, (r() - 0.5) * n * 0.05, n * (0.02 + r() * 0.05), n * 0.012, r(), 0, 7); q.fill(); }      // las nubes oscuras de la Vía Láctea
  q.restore();
  for (let i = 0; i < 1500; i++) {
    const x = r() * n, y = r() * n, t = r();
    q.globalAlpha = 0.3 + r() * 0.7; q.fillStyle = t > 0.93 ? '#ffd9b0' : t > 0.86 ? '#b9d2ff' : '#fff';
    if (t > 0.975) { q.beginPath(); q.arc(x, y, u * 1.3, 0, 7); q.fill(); } else q.fillRect(x, y, t > 0.8 ? u * 1.5 : u, t > 0.8 ? u * 1.5 : u);
  }
  return sprites.set('cielo', c), c;
}
function cielo(w, h, oy) {
  const alto = Math.max(0, -(vis.y + HH)), km = alto * 2 / 1000, fondo = Math.min(oy, h);
  let i = 0; while (i < CIELOS.length - 2 && km > CIELOS[i + 1][0]) i++;
  const A = CIELOS[i], B = CIELOS[i + 1], k = tope((km - A[0]) / (B[0] - A[0]));
  const gr = g.createLinearGradient(0, fondo - 15 * T, 0, fondo);
  gr.addColorStop(0, entre(A[1], B[1], k)); gr.addColorStop(0.45, entre(A[2], B[2], k)); gr.addColorStop(0.82, entre(A[3], B[3], k)); gr.addColorStop(1, entre(A[4], B[4], k));
  g.fillStyle = gr; g.fillRect(0, 0, w, fondo);
  // dónde queda el horizonte en la pantalla: el suelo si está a la vista; si no, la orilla del planeta
  const lejos = oy > h, s = tope(Math.log10(Math.max(km, 3) / 3) / Math.log10(1000 / 3));
  const base = lejos ? h - h * 0.06 * tope((oy - h) / (h * 0.5)) - h * 0.34 * s : oy;
  // Entre más alto, más chico el planeta (a 60 km ya se nota la curva; a 300 km es un domo; a 1,000 km, una bola) y más a la derecha: la vista se va inclinando.
  const R = w * 60 * Math.pow(0.002, s), cxP = w * (0.5 + 0.2 * suave(60, 1000, km)), cyP = base + R, orilla = (x) => cyP - Math.sqrt(Math.max(0, R * R - (x - cxP) * (x - cxP)));
  const noche = suave(4, 12, km) * (1 - suave(450, 800, km)), aire = tope(1 - km / 90), sube = -yo.vy;
  // 1 · estrellas: asoman en la hora azul; en el aire titilan, en el espacio no. El cielo entero gira despacio
  //     con la altura y con el tiempo, y ya en el espacio se dibujan las constelaciones y asoma un cometa.
  const est = suave(7, 28, km);
  if (est > 0.01) {
    const lado = Math.ceil(Math.hypot(w, h)) + 4, m = lado / 2, u = lado * 0.021, lin = suave(45, 160, km);
    g.save(); g.translate(w / 2, h * 0.45); g.rotate(-0.3 + 1.1 * s + reloj * 0.0018);
    g.globalAlpha = est * (0.62 + 0.38 * suave(40, 200, km)); g.drawImage(estrellas(lado), -m, -m, lado, lado);
    g.fillStyle = '#fff';
    for (let n = 0; n < 46; n++) { const b = 0.5 + 0.5 * Math.sin(reloj * (1.3 + n % 5) + n * 2.4); g.globalAlpha = est * (1 - (0.75 * aire + 0.15) * b); const t = Math.max(1, Math.round(RES * (n % 9 ? 1.4 : 2.4))); g.fillRect((azar01(n * 1.7) - 0.5) * lado, (azar01(n * 5.9) - 0.5) * lado, t, t); }
    for (const c of CONSTELA) {
      const px = (i) => c.x * m + c.e[i][0] * u, py = (i) => c.y * m + c.e[i][1] * u;
      if (lin > 0.01) { g.globalAlpha = est * lin * 0.3; g.strokeStyle = '#bcd0ff'; g.lineWidth = Math.max(1, RES * 0.8); g.beginPath(); for (const [a, b] of c.t) { g.moveTo(px(a), py(a)); g.lineTo(px(b), py(b)); } g.stroke(); }
      g.globalAlpha = est * (0.75 + 0.25 * lin); g.fillStyle = '#fff'; for (let i = 0; i < c.e.length; i++) { g.beginPath(); g.arc(px(i), py(i), Math.max(1.2, RES * (1.1 + 0.5 * lin)), 0, 7); g.fill(); }
    }
    const com = suave(110, 220, km);
    if (com > 0.01) {                               // el cometa: cabeza brillante y dos colas que apuntan lejos del Sol
      const cx = -m * 0.05, cy = -m * 0.3, l = lado * 0.11;
      for (const [an, k, col] of [[-2.5, 1, '190,225,255'], [-2.2, 0.7, '255,240,210']]) { const ex = cx + Math.cos(an) * l * k, ey = cy + Math.sin(an) * l * k, cl = g.createLinearGradient(cx, cy, ex, ey); cl.addColorStop(0, `rgba(${col},${0.55 * com})`); cl.addColorStop(1, `rgba(${col},0)`); g.globalAlpha = est; g.fillStyle = cl; g.beginPath(); g.moveTo(cx, cy); g.lineTo(ex + Math.sin(an) * l * 0.16 * k, ey - Math.cos(an) * l * 0.16 * k); g.lineTo(ex - Math.sin(an) * l * 0.16 * k, ey + Math.cos(an) * l * 0.16 * k); g.fill(); }
      const cab = g.createRadialGradient(cx, cy, 0, cx, cy, T * 0.55); cab.addColorStop(0, `rgba(255,255,255,${com})`); cab.addColorStop(0.3, `rgba(190,230,255,${0.6 * com})`); cab.addColorStop(1, 'rgba(190,230,255,0)'); g.fillStyle = cab; g.fillRect(cx - T, cy - T, T * 2, T * 2);
    }
    g.restore(); g.globalAlpha = 1;
  }
  // 2 · estrellas fugaces: se queman justo donde vas pasando, entre los 30 y los 200 km
  const fug = suave(25, 45, km) * (1 - suave(140, 220, km));
  if (fug > 0.02) {
    const c = reloj / 2.7, n = Math.floor(c), f = (c - n) / 0.24;
    if (f < 1) {
      const a = azar01(n * 7.13), dx = (a > 0.5 ? -1 : 1) * w * 0.17, dy = h * 0.1, x = w * (0.12 + 0.76 * a) + dx * f, y = fondo * (0.06 + 0.5 * azar01(n * 3.7)) + dy * f;
      const ln = g.createLinearGradient(x, y, x - dx * 0.55, y - dy * 0.55); ln.addColorStop(0, `rgba(255,255,255,${fug * (1 - f * f)})`); ln.addColorStop(1, 'rgba(255,255,255,0)');
      g.strokeStyle = ln; g.lineWidth = Math.max(1.5, RES * 1.6); g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.lineTo(x - dx * 0.55, y - dy * 0.55); g.stroke();
    }
  }
  // 3 · el Sol de la tarde: baja, enrojece y se mete tras el horizonte
  const e = km < 9 ? 1 - Math.pow(tope(Math.log(1 + km) / Math.log(10)), 1.4) : -0.5 * tope((km - 9) / 4);
  const disco = (x, y, r, centro, tinte, a) => { const sol = g.createRadialGradient(x, y, r * 0.05, x, y, r); sol.addColorStop(0, centro); sol.addColorStop(0.16, tinte); sol.addColorStop(1, 'rgba(255,220,170,0)'); g.globalAlpha = a; g.fillStyle = sol; g.fillRect(x - r, y - r, r * 2, r * 2); g.globalAlpha = 1; };
  if (e > -0.5) {
    const baja = 1 - Math.max(0, e), sx = w * (0.7 + 0.1 * baja) - camX * T * 0.03, alta = Math.min(oy - 7 * T, h * 0.3), sy = base + (alta - base) * e - (e < 0 ? e * T * 4 : 0);
    const brasa = suave(0.55, 0, e) * (1 - suave(9, 15, km));                // el resplandor del ocaso sobre el horizonte
    if (brasa > 0.01) { const rr = w * 0.5, gl = g.createRadialGradient(sx, base, 0, sx, base, rr); gl.addColorStop(0, `rgba(255,130,60,${0.5 * brasa})`); gl.addColorStop(1, 'rgba(255,90,60,0)'); g.fillStyle = gl; g.fillRect(sx - rr, base - rr, rr * 2, rr); }
    disco(sx, sy, T * (5 + 2.5 * baja), entre('#ffffff', '#ffe2b0', baja), entre('#ffe9a8', '#ff6a2a', Math.pow(baja, 1.5)), 0.95);
  }
  // 4 · aurora: cortinas verdes y violetas al cruzar la línea del espacio
  const aur = suave(70, 110, km) * (1 - suave(260, 430, km));
  if (aur > 0.01) {
    let c = sprites.get('aurora');
    if (!c) { c = document.createElement('canvas'); c.width = 64; c.height = 256; const q = c.getContext('2d'), v = q.createLinearGradient(0, 0, 0, 256); v.addColorStop(0, 'rgba(150,90,255,0)'); v.addColorStop(0.35, 'rgba(120,130,255,0.35)'); v.addColorStop(0.75, 'rgba(70,255,150,0.8)'); v.addColorStop(1, 'rgba(70,255,150,0)'); q.fillStyle = v; q.fillRect(0, 0, 64, 256); q.globalCompositeOperation = 'destination-in'; const m = q.createLinearGradient(0, 0, 64, 0); m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(0.5, '#000'); m.addColorStop(1, 'rgba(0,0,0,0)'); q.fillStyle = m; q.fillRect(0, 0, 64, 256); sprites.set('aurora', c); }
    g.globalCompositeOperation = 'lighter';
    for (let n = 0; n < 16; n++) {
      const x = w * (n / 15) + Math.sin(reloj * 0.35 + n * 1.9) * w * 0.03, an = w * (0.13 + 0.05 * Math.sin(reloj * 0.6 + n)), al = h * (0.36 + 0.14 * Math.sin(reloj * 0.45 + n * 0.8));
      if (Math.abs(x - cxP) > R * 0.96) continue;
      const ch = Math.min(1, R / (w * 0.9)); g.globalAlpha = aur * (0.3 + 0.25 * Math.sin(reloj * 0.8 + n * 2.3)); g.drawImage(c, x - an * ch / 2, orilla(x) - al * ch * 0.92, an * ch, al * ch);
    }
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  }
  // 5 · la Luna: sale al anochecer y crece hasta llenar la vista a los 1,000 km
  const la = suave(10, 30, km);
  if (la > 0) { const cre = Math.pow(s, 2.2), r = h * (0.03 + 0.31 * cre); g.globalAlpha = la; g.drawImage(luna(), w * (0.26 + 0.08 * cre) - r, h * (0.28 + 0.12 * cre) - r, r * 2, r * 2); g.globalAlpha = 1; }
  // 6 · el Sol vuelve a salir por la orilla del planeta, blanco y nítido como se ve en el espacio
  const alba = suave(380, 520, km);
  if (alba > 0.01) {
    const sal = suave(430, 900, km), ox0 = cxP + R * 0.64, oy0 = cyP - R * 0.77, sx = ox0 + sal * w * 0.06, sy = oy0 + T * 1.6 - sal * h * 0.28, rr = w * 0.4;
    const gl = g.createRadialGradient(ox0, oy0, 0, ox0, oy0, rr); gl.addColorStop(0, `rgba(255,190,120,${0.6 * alba * (1 - sal * 0.5)})`); gl.addColorStop(0.5, `rgba(120,160,255,${0.2 * alba})`); gl.addColorStop(1, 'rgba(120,160,255,0)');
    g.fillStyle = gl; g.fillRect(ox0 - rr, oy0 - rr, rr * 2, rr * 2);
    disco(sx, sy, T * 3.2, '#ffffff', '#ffffff', 1);
    g.strokeStyle = `rgba(255,255,255,${0.5 * sal})`; g.lineWidth = Math.max(1, RES); g.beginPath(); for (const [a, b] of [[1, 0], [0, 1], [0.7, 0.7], [0.7, -0.7]]) { g.moveTo(sx - a * T * 3.4, sy - b * T * 3.4); g.lineTo(sx + a * T * 3.4, sy + b * T * 3.4); } g.stroke();
  }
  // 7 · nubes: tres capas; las de cerca pasan casi a tu velocidad, así se siente que subes
  const tinte = km < 5 ? entre('#ffffff', '#ffc9a4', suave(0.8, 5, km)) : entre('#ffc9a4', '#6f6590', suave(5, 11, km));
  const capa = (p, tam, hueco, a0, id) => {
    const paso = hueco * T, corre = alto * T * p, hy = h * 0.62;
    g.fillStyle = tinte;
    for (let n = Math.max(1, Math.floor((corre - (h - hy) - paso) / paso)); n * paso - corre < hy + paso; n++) {
      const dens = suave(0.04, 0.3, n * paso / (T * p) / 500) * (1 - suave(9, 17, n * paso / (T * p) / 500)); if (dens < 0.02) continue;
      for (let j = 0; j < (id === 2 ? 2 : 3); j++) {
        const r = azar01(n * 12.9898 + j * 78.233 + id * 37.719); if (r > dens * 0.8) continue;
        const t = T * tam * (0.7 + azar01(n * 5.3 + j * 2.1 + id) * 0.8);
        const x = (((r * 7.31 + j * 0.37 + reloj * 0.006 * (1 + id) * (j === 1 ? -0.6 : 1)) % 1) + 1) % 1 * (w + t * 6) - t * 3 - camX * T * 0.04 * (id + 1);
        const y = hy - (n * paso - corre) + (azar01(n * 3.1 + j * 1.3) - 0.5) * paso * 0.6;
        g.globalAlpha = a0 * dens;
        g.beginPath(); g.ellipse(x, y, t * 1.6, t * 0.42, 0, 0, 7); g.ellipse(x - t * 0.8, y + t * 0.12, t, t * 0.34, 0, 0, 7); g.ellipse(x + t * 0.9, y + t * 0.15, t * 1.1, t * 0.3, 0, 0, 7); g.ellipse(x + t * 0.15, y - t * 0.24, t * 0.8, t * 0.36, 0, 0, 7); g.fill();
      }
    }
    g.globalAlpha = 1;
  };
  if (km < 18) { capa(0.1, 0.8, 5, 0.34, 0); capa(0.3, 1.3, 6, 0.42, 1); }
  // 8 · el paisaje lejano: cerros cuando estás cerca; desde muy alto, la curva del planeta
  const dia = 1 - noche * 0.8;
  if (lejos) {
    const pl = g.createRadialGradient(cxP, cyP, R * 0.6, cxP, cyP, R);
    pl.addColorStop(0, '#5a3a26'); pl.addColorStop(0.9, '#8a5c3e'); pl.addColorStop(1, '#b9835a');
    g.fillStyle = pl; g.beginPath(); g.arc(cxP, cyP, R, 0, 7); g.fill();
    const tex = suave(25, 110, km);
    if (tex > 0.01) { g.save(); g.beginPath(); g.arc(cxP, cyP, R, 0, 7); g.clip(); g.translate(cxP, cyP); g.rotate(reloj * 0.004); g.globalAlpha = tex; g.drawImage(planeta(), -R, -R, R * 2, R * 2); g.restore(); g.globalAlpha = 1; }
    const borde = g.createRadialGradient(cxP, cyP, R * 0.55, cxP, cyP, R); borde.addColorStop(0, 'rgba(0,0,0,0)'); borde.addColorStop(1, 'rgba(10,5,20,0.45)'); g.fillStyle = borde; g.beginPath(); g.arc(cxP, cyP, R, 0, 7); g.fill();      // el planeta es redondo: la orilla se oscurece
    if (noche > 0.01 || alba > 0.01) {              // la noche; al amanecer queda iluminado solo el lado del Sol
      const dx = R * 0.64, dy = -R * 0.77, som = g.createLinearGradient(cxP + dx, cyP + dy, cxP - dx, cyP - dy);
      som.addColorStop(0, `rgba(6,4,12,${0.82 * noche * (1 - alba)})`); som.addColorStop(0.45, `rgba(6,4,12,${0.82 * Math.max(noche, alba * 0.75)})`); som.addColorStop(1, `rgba(6,4,12,${0.82 * Math.max(noche, alba * 0.9)})`);
      g.fillStyle = som; g.beginPath(); g.arc(cxP, cyP, R, 0, 7); g.fill();
    }
    const azul = tope((km - 6) / 30) * (0.55 + 0.45 * dia + 0.5 * alba);
    for (let n = 0; n < 4 && azul > 0; n++) { g.strokeStyle = `rgba(130,195,255,${Math.min(0.6, azul * (0.42 - n * 0.1))})`; g.lineWidth = Math.min(T * (0.12 + n * 0.16), R * 0.02 * (1 + n)); g.beginPath(); g.arc(cxP, cyP, R + g.lineWidth / 2, 0, 7); g.stroke(); }
    const pueblo = noche * suave(1.5, 6, km) * (1 - suave(250, 500, km));          // de noche, las luces de la Gasolinera allá abajo
    if (pueblo > 0.02) { const px = cxP, py = base + T * (0.5 + 0.4 * (1 - s)), rr = T * (2.2 - 1.4 * s), lz = g.createRadialGradient(px, py, 0, px, py, rr); lz.addColorStop(0, `rgba(255,210,120,${0.85 * pueblo})`); lz.addColorStop(0.25, `rgba(255,170,80,${0.35 * pueblo})`); lz.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = lz; g.fillRect(px - rr, py - rr, rr * 2, rr * 2); }
  }
  const ca = 1 - tope((km - 2) / 6);
  if (ca > 0) {
    g.globalAlpha = ca;
    const sombra = suave(0.5, 6, km) * 0.75;
    for (const [col, alt, f, kk] of [['#c79a78', 2.6, 0.004, 0.12], ['#a8734f', 1.9, 0.0065, 0.25], ['#86573b', 1.2, 0.011, 0.45]]) {
      g.fillStyle = entre(col, '#2b1a2a', sombra); g.beginPath(); g.moveTo(0, base + T * 3);
      for (let x = 0; x <= w + 60; x += 60) { const m = (x + camX * T * kk) / RES; g.lineTo(x, base - T * alt * (lejos ? 0.5 : 1) * (0.55 + 0.3 * Math.sin(m * f) + 0.15 * Math.sin(m * f * 2.7 + 1))); }
      g.lineTo(w + 60, base + T * 3); g.fill();
    }
    g.globalAlpha = 1;
  }
  if (km < 18) capa(0.75, 2, 9, 0.5, 2);
  // 9 · lo que te cruzas en el camino. Cada cosa vive a su altura y pasa por la pantalla mientras la rebasas.
  const cruza = (kmAhi, ancho) => { const d = Math.log(Math.max(km, 1e-4) / kmAhi) / ancho; return d > -1 && d < 1 ? h * (0.5 + d * 0.62) : null; };
  const ave = (x, y, t, b, c1, c2, c3, c4) => {     // b: de -0.4 (alas abajo) a 1 (alas arriba)
    g.fillStyle = c2; g.beginPath(); g.moveTo(x + t * 0.35, y - t * 0.05); g.lineTo(x - t * 0.75, y - t * 1.25 * b - t * 0.1); g.lineTo(x - t * 0.45, y); g.fill();                 // el ala de atrás
    g.fillStyle = c4; g.beginPath(); g.moveTo(x - t * 0.7, y - t * 0.04); g.lineTo(x - t * 1.3, y - t * 0.18); g.lineTo(x - t * 1.3, y + t * 0.2); g.lineTo(x - t * 0.7, y + t * 0.08); g.fill();   // la cola
    g.fillStyle = c1; g.beginPath(); g.ellipse(x, y, t * 0.8, t * 0.24, 0, 0, 7); g.fill();
    g.fillStyle = c3; g.beginPath(); g.arc(x + t * 0.78, y - t * 0.06, t * 0.22, 0, 7); g.fill();
    g.fillStyle = '#e8b23a'; g.beginPath(); g.moveTo(x + t * 0.95, y - t * 0.12); g.lineTo(x + t * 1.24, y + t * 0.02); g.lineTo(x + t * 0.95, y + t * 0.07); g.fill();
    g.fillStyle = c1; g.beginPath(); g.moveTo(x + t * 0.45, y); g.lineTo(x - t * 0.55, y - t * 1.45 * b - t * 0.12); g.lineTo(x - t * 0.3, y + t * 0.08); g.fill();                    // el ala de adelante
  };
  const V = [[0, 0], [-1, 0.6], [-1, -0.6], [-2, 1.2], [-2, -1.2], [-3, 1.8], [-3, -1.8], [-4, 2.4], [-4, -2.4]], ocaso = suave(1, 6, km) * 0.8;
  const parvada = (kmAhi, ancho, t, vel, fase, aleteo, planeo, c1, c2, c3, c4) => {
    const y0 = cruza(kmAhi, ancho); if (y0 === null) return;
    const x0 = ((reloj * vel + fase) % 1.6 - 0.3) * w, tinta = (c) => entre(c, '#1a1218', ocaso);
    V.forEach(([a, b], i) => ave(x0 + a * t * 2.5, y0 + b * t * 1.5 + Math.sin(reloj * 1.3 + i) * t * 0.25, t, planeo + (1 - planeo) * Math.sin(reloj * aleteo + i * 0.9), tinta(c1), tinta(c2), tinta(c3), tinta(c4)));
  };
  parvada(0.4, 0.75, T * 0.3, 0.05, 0.2, 8, 0.25, '#8a4a2a', '#6b3620', '#9a5a36', '#6b3620');        // nueve halcones: chicos, rojizos, de aleteo rápido
  parvada(2.2, 0.55, T * 0.46, 0.032, 0.9, 2.2, 0.6, '#3a2a22', '#2a1d17', '#f4f1ea', '#f4f1ea');      // nueve águilas: grandes, de cabeza y cola blancas, casi siempre planeando
  let y;
  y = cruza(11, 0.3);
  if (y !== null) {                                   // un avión con su estela
    const x = ((reloj * 0.045) % 1.7 - 0.35) * w, l = w * 0.45, st = g.createLinearGradient(x, 0, x - l, 0); st.addColorStop(0, 'rgba(255,225,205,0.8)'); st.addColorStop(1, 'rgba(255,225,205,0)');
    g.fillStyle = st; g.fillRect(x - l, y - T * 0.07, l, T * 0.14);
    g.fillStyle = '#1a1420'; g.beginPath(); g.ellipse(x + T * 0.3, y, T * 0.55, T * 0.09, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(x + T * 0.45, y); g.lineTo(x + T * 0.05, y - T * 0.5); g.lineTo(x - T * 0.1, y - T * 0.5); g.lineTo(x + T * 0.15, y); g.lineTo(x - T * 0.1, y + T * 0.5); g.lineTo(x + T * 0.05, y + T * 0.5); g.fill();
  }
  y = cruza(31, 0.28);
  if (y !== null) {                                   // un globo meteorológico
    const x = w * 0.3 + Math.sin(reloj * 0.4) * T * 0.6;
    g.strokeStyle = '#c9c5bc88'; g.lineWidth = Math.max(1, RES); g.beginPath(); g.moveTo(x, y + T * 0.7); g.lineTo(x + Math.sin(reloj) * T * 0.1, y + T * 1.9); g.stroke();
    const gb = g.createRadialGradient(x - T * 0.25, y - T * 0.25, T * 0.05, x, y, T * 0.75); gb.addColorStop(0, '#ffffff'); gb.addColorStop(1, '#8e94b8'); g.fillStyle = gb; g.beginPath(); g.ellipse(x, y, T * 0.68, T * 0.75, 0, 0, 7); g.fill();
    g.fillStyle = '#d8d2c4'; g.fillRect(x - T * 0.12 + Math.sin(reloj) * T * 0.1, y + T * 1.9, T * 0.24, T * 0.2);
  }
  y = cruza(180, 0.2);
  if (y !== null) {                                   // un satélite
    const x = w * (0.12 + 0.5 * (y / h)), u = T * 0.11;
    g.save(); g.translate(x, y); g.rotate(0.5);
    g.fillStyle = '#2b4f9e'; g.fillRect(-u * 5, -u * 1.1, u * 3.4, u * 2.2); g.fillRect(u * 1.6, -u * 1.1, u * 3.4, u * 2.2); g.fillStyle = '#d9b877'; g.fillRect(-u * 1.5, -u * 1.5, u * 3, u * 3);
    g.strokeStyle = '#d9dde4'; g.lineWidth = Math.max(1, u * 0.3); g.beginPath(); g.arc(0, -u * 2.6, u * 1.2, 0.3, 2.84); g.stroke();
    if (Math.sin(reloj * 4) > 0.5) { g.fillStyle = '#6fdc7a'; g.beginPath(); g.arc(0, u * 1.9, u * 0.4, 0, 7); g.fill(); }
    g.restore();
  }
  y = cruza(408, 0.24);
  if (y !== null) {                                   // la estación en órbita
    const x = w * (0.88 - 0.5 * (y / h)), u = T * 0.16;
    g.save(); g.translate(x, y); g.rotate(-0.18);
    g.fillStyle = '#2b4f9e'; g.strokeStyle = '#9fb6e6'; g.lineWidth = Math.max(1, u * 0.12);
    for (const a of [-1, 1]) for (const b of [-1, 1]) { g.fillRect(a * u * 4.2 - (a < 0 ? u * 4 : 0), b * u * 1.7 - u * 0.9, u * 4, u * 1.8); g.strokeRect(a * u * 4.2 - (a < 0 ? u * 4 : 0), b * u * 1.7 - u * 0.9, u * 4, u * 1.8); }
    g.fillStyle = '#d9dde4'; g.fillRect(-u * 8.4, -u * 0.25, u * 16.8, u * 0.5); g.fillRect(-u * 2.6, -u * 0.9, u * 5.2, u * 1.8); g.fillStyle = '#f4f1ea'; g.fillRect(-u * 0.8, -u * 2.6, u * 1.6, u * 5.2);
    if (Math.sin(reloj * 5) > 0.3) { g.fillStyle = '#ff5a4a'; g.beginPath(); g.arc(0, -u * 2.8, u * 0.35, 0, 7); g.fill(); }
    g.restore();
  }
  // 10 · el aire que pasa: rayitas que corren más entre más rápido vas (en el espacio ya no hay aire)
  const rafaga = aire * tope((Math.abs(sube) - 9) / 50) * 0.3;
  if (rafaga > 0.01 && lejos) {
    g.strokeStyle = '#fff'; g.lineWidth = Math.max(1, RES); g.globalAlpha = rafaga; g.beginPath();
    const largo = T * Math.min(5, Math.abs(sube) * 0.07), dir = sube > 0 ? 1 : -1;
    for (let n = 0; n < 18; n++) { const x = azar01(n * 9.7) * w, yy = ((azar01(n * 3.3) + dir * reloj * (0.9 + azar01(n) * 0.9)) % 1 + 1) % 1 * (h + largo) - largo; g.moveTo(x, yy); g.lineTo(x, yy + largo); }
    g.stroke(); g.globalAlpha = 1;
  }
}
function dibujar() {
  const w = lienzo.width, h = lienzo.height;
  g.setTransform(1, 0, 0, 1, 0, 0);
  let sx = 0, sy = 0;
  if (temblor > 0.3) { sx = (Math.random() - 0.5) * temblor * RES; sy = (Math.random() - 0.5) * temblor * RES; }
  const ox = Math.round(-camX * T + sx), oy = Math.round(-camY * T + sy);
  if (oy > 0) cielo(w, h, oy);
  const x0 = Math.max(0, Math.floor(camX)), x1 = Math.min(W - 1, Math.ceil(camX + cols));
  const y0 = Math.max(0, Math.floor(camY)), y1 = Math.min(H - 1, Math.ceil(camY + filas));
  const fino = Math.max(1, Math.round(T * 0.07)), grueso = Math.max(2, Math.round(T * 0.13)), insinua = pistaGas();
  calor.length = gases.length = 0; cuadroN++;
  const gasVisible = cfg.verGas === 1 || insinua, T4 = BL * T;
  for (let by = y0 >> 2, by1 = y1 >> 2; by <= by1; by++) for (let bx = x0 >> 2, bx1 = x1 >> 2; bx <= bx1; bx++) {
    const b = bloque(bx, by);
    g.drawImage(b.c, ox + bx * T4, oy + by * T4);
    const L = b.lava, G = b.gas, A = b.agua, M = b.brillo;
    for (let i = 0; i < L.length; i += 2) calor.push(ox + L[i] * T, oy + L[i + 1] * T, L[i], L[i + 1]);
    if (gasVisible) for (let i = 0; i < G.length; i += 2) gases.push(ox + G[i] * T, oy + G[i + 1] * T, G[i], G[i + 1]);
    if (A.length) { g.fillStyle = '#bfe9ff77'; for (let i = 0; i < A.length; i += 2) g.fillRect(ox + A[i] * T, oy + A[i + 1] * T + Math.round(Math.sin(reloj * 2 + A[i] * 0.9) * fino), T, fino * 2); }
    for (let i = 0; i < M.length; i += 2) {                       // destello
      const x = M[i], y = M[i + 1], s = Math.sin(reloj * 1.9 + ((x * 73 + y * 151) % 97));
      if (s > 0.9) { const k = (s - 0.9) * 10, cx = ox + x * T + T * (0.25 + ((x * 31 + y * 17) % 50) / 100), cy = oy + y * T + T * (0.25 + ((x * 13 + y * 29) % 50) / 100), l = T * 0.16 * k; g.fillStyle = '#fff'; g.fillRect(cx - l, cy - fino / 2, l * 2, fino); g.fillRect(cx - fino / 2, cy - l, fino, l * 2); }
    }
  }
  if (y1 >= EDEN0) vidaEden(ox, oy, y0, y1);
  if (yo.y > EDEN0 - 60) flechasEden(ox, oy);
  if (lluvia) lluviaDeMinerales(ox, oy);
  // Los bloques que ya no se ven se sueltan en cuanto sobran: repintar uno cuesta casi nada, y así la memoria no crece.
  if (bloques.size > bloquesTope) for (const [k, v] of bloques) if (v.u !== cuadroN) { bloques.delete(k); if (bloquesLibres.length < 8) bloquesLibres.push(v); }
  // lo que vive en cada lugar
  for (const R of RINCONES) {
    if (y1 < R.cy - R.ry - 6 || y0 > R.cy + R.ry + 2) continue;
    const X = (cx) => ox + (cx + 0.5) * T, Y = (cx) => oy + (Math.floor(pisoR(R, cx)) + 1) * T, figura = (em, cx, tam, dy = 0) => { g.font = `${T * tam}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'bottom'; g.fillText(em, X(cx), Y(cx) + dy); };
    g.fillStyle = '#fff';
    if (R.t === 'camp') { figura('⛺', R.cx + 5, 2.2); figura('🛒', R.cx - 3, 1.1); figura('🏮', R.cx + 1, 1); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.7 + 0.2 * Math.sin(reloj * 7); g.drawImage(sprite('res'), X(R.cx + 1) - T * 1.25, Y(R.cx + 1) - T * 1.9); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; }
    else if (R.t === 'hongos') for (let k = 0; k < 5; k++) {      // hongos gigantes: tallo, copa y su luz, que se enciende cuando cantan
      const [dx, tam, col] = HONGOS[k], canta = tiempo >= hongo.luz[k] ? Math.exp(-1.6 * (tiempo - hongo.luz[k])) : 0;
      const x = X(R.cx + dx), yb = Y(R.cx + dx), al = T * tam, an = al * 0.5;
      g.fillStyle = '#e9e2d3'; g.fillRect(x - al * 0.06, yb - al * 0.8, al * 0.12, al * 0.8);
      const gl = g.createRadialGradient(x, yb - al * 0.8, 0, x, yb - al * 0.8, an * 1.5); gl.addColorStop(0, `rgba(${col},${Math.min(1, 0.45 + 0.12 * Math.sin(reloj * 1.7 + dx) + 0.55 * canta)})`); gl.addColorStop(0.5, `rgba(${col},${0.5 * canta})`); gl.addColorStop(1, `rgba(${col},0)`); g.globalCompositeOperation = 'lighter'; g.fillStyle = gl; g.fillRect(x - an * 1.5, yb - al * 0.8 - an * 1.5, an * 3, an * 3); g.globalCompositeOperation = 'source-over';
      g.fillStyle = `rgb(${col})`; g.beginPath(); g.ellipse(x, yb - al * 0.8, an, al * 0.3, 0, Math.PI, Math.PI * 2); g.fill(); g.fillStyle = '#ffffffaa'; for (const [a, b] of [[-0.5, 0.12], [0.1, 0.2], [0.5, 0.1]]) { g.beginPath(); g.arc(x + a * an, yb - al * 0.8 - b * al, al * 0.035, 0, 7); g.fill(); }
    }
    else if (R.t === 'cemen') [[-9, 1, 0.3], [-3, 5, -0.5], [4, 2, 0.15], [10, 7, -0.25]].forEach(([dx, mo, gi]) => { g.save(); g.translate(X(R.cx + dx), Y(R.cx + dx) - T * 0.42); g.rotate(gi); g.globalAlpha = 0.55; dibMaq(g, 0, 0, T, mo, gi > 0 ? 1 : -1, 0, 0, '', ''); g.restore(); });
    else if (R.t === 'termas') { g.fillStyle = '#ffffff'; for (let n = 0; n < 12; n++) { const sx = R.cx - 11 + n * 2, f = (reloj * 0.35 + n * 0.37) % 1; g.globalAlpha = 0.22 * Math.sin(Math.PI * f); g.beginPath(); g.arc(X(sx) + Math.sin(reloj + n) * T * 0.3, oy + (R.cy + 1 - f * 4) * T, T * (0.25 + 0.5 * f), 0, 7); g.fill(); } g.globalAlpha = 1; }
    else if (R.t === 'guard') for (const dx of [-10, -4, 3, 9]) figura('🗿', R.cx + dx, 3 + (dx & 1) * 0.6);
    else if (R.t === 'jardin') {                      // las mariposas de vidrio: sueltas, o escribiendo tu nombre
      poblarJardin();
      const t = T * (jardin.forma ? 0.075 : 0.085), COL = ['#9fdcff', '#d6b8ff', '#ffffff'];
      g.globalCompositeOperation = 'lighter'; g.globalAlpha = jardin.forma ? 0.95 : 0.8;
      for (let k = 0; k < 3; k++) {
        g.fillStyle = COL[k]; g.beginPath();
        for (const b of jardin.m) { if (b.c !== k) continue; const px = ox + b.x * T, py = oy + b.y * T, al = 0.35 + 0.65 * Math.abs(Math.sin(b.f)); g.moveTo(px, py); g.ellipse(px - t * 0.8, py, t * al, t * 1.15, -0.4, 0, 7); g.moveTo(px, py); g.ellipse(px + t * 0.8, py, t * al, t * 1.15, 0.4, 0, 7); }
        g.fill();
      }
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    }
    else if (R.t === 'nido') { figura('🐉', R.cx - 1, 5.5 + 0.12 * Math.sin(reloj * 1.2), T * 0.6); g.globalAlpha = 0.5 + 0.5 * Math.sin(reloj * 1.2); g.font = `800 ${T * 0.5}px system-ui`; g.fillStyle = '#cfe6ff'; g.fillText('z z z', X(R.cx + 3), Y(R.cx - 1) - T * (4.6 + ((reloj * 0.3) % 1))); g.globalAlpha = 1; }
    else if (R.t === 'boveda') { g.font = `800 ${T * 0.42}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffd23f'; g.fillText('COMPAÑÍA MINERA · BÓVEDA 7', X(R.cx), oy + (R.cy - R.ry + 0.5) * T); }
    else if (R.t === 'fosil' && S && !S.lug[R.i]) { /* nada: los huesos se ven solos */ }
    else if (R.t === 'rio') for (let n = 0; n < 9; n++) {         // los peces del río
      const fx = ((reloj * (0.6 + 0.2 * (n % 3)) + n * 11) % (W - 6)) + 3, fy = cauce(R, Math.floor(fx)) + 0.5 + 0.5 * Math.sin(reloj + n);
      if (celda(Math.floor(fx), Math.floor(fy)) !== 6) continue;
      const px = ox + fx * T, py = oy + fy * T, t = T * 0.17; g.fillStyle = ['#ffb347', '#7fe3e0', '#ffe27a'][n % 3];
      g.beginPath(); g.ellipse(px, py, t * 1.5, t * 0.75, 0, 0, 7); g.moveTo(px - t * 1.2, py); g.lineTo(px - t * 2.4, py - t * 0.8); g.lineTo(px - t * 2.4, py + t * 0.8); g.fill();
    }
  }
  if (y1 >= AGUA0 && y0 < AGUA1) for (let n = 0; n < 12; n++) {           // los peces del lago
    const a = reloj * (0.05 + 0.02 * (n % 4)) + n * 1.9, fx = 48 + 33 * Math.sin(a), fy = 572 + 15 * Math.sin(a * 0.63 + n);
    if (celda(Math.floor(fx), Math.floor(fy)) !== 6) continue;
    const px = ox + fx * T, py = oy + fy * T, d = Math.cos(a) > 0 ? 1 : -1, t = T * (0.16 + 0.05 * (n % 3)), cola = Math.sin(reloj * 9 + n) * t * 0.3;
    g.fillStyle = ['#ffb347', '#7fe3e0', '#ffe27a', '#ff8a9a'][n % 4];
    g.beginPath(); g.ellipse(px, py, t * 1.5, t * 0.75, 0, 0, 7); g.moveTo(px - d * t * 1.2, py); g.lineTo(px - d * t * 2.4, py - t * 0.8 + cola); g.lineTo(px - d * t * 2.4, py + t * 0.8 + cola); g.fill();
    g.fillStyle = '#12222e'; g.beginPath(); g.arc(px + d * t * 0.8, py - t * 0.15, t * 0.17, 0, 7); g.fill();
  }
  if (S && y1 >= MURAL.y && y0 <= MURAL.y + MURAL.al) { g.globalAlpha = 0.8; g.drawImage(mural(), ox + MURAL.x * T, oy + MURAL.y * T); g.globalAlpha = 1; }
  else if (muralC && (y0 > MURAL.y + 200 || y1 < MURAL.y - 200)) { muralC = null; muralF = ''; }      // lejos del mural, su lienzo se suelta
  if (camY > 120 && sprites.has('cielo')) { sprites.delete('cielo'); sprites.delete('aurora'); }                // bajo tierra no hacen falta las estrellas      // el mural de los que vendrán
  if (y1 >= 2800 && y0 <= 2826) {                  // las antorchas de la Ciudad Perdida
    const res = sprite('res');
    for (const b of [0, 1, 2, 6, 7]) {
      const px = ox + (10 + 9 * b + 8.5) * T, py = oy + 2823.4 * T, f = Math.sin(reloj * 11 + b * 2) * T * 0.04;
      g.fillStyle = '#5b3d17'; g.fillRect(px - T * 0.05, py, T * 0.1, T * 2.6);
      g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.75 + 0.2 * Math.sin(reloj * 9 + b); g.drawImage(res, px - T * 1.25, py - T * 1.35); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      g.fillStyle = '#ffd76a'; g.beginPath(); g.ellipse(px + f, py - T * 0.12, T * 0.13, T * 0.26, 0, 0, 7); g.fill(); g.fillStyle = '#fff6c9'; g.beginPath(); g.ellipse(px + f, py - T * 0.06, T * 0.06, T * 0.13, 0, 0, 7); g.fill();
    }
  }
  if (y1 >= 4900 && y0 <= 4930 && celda(48, 4915) === 46) {      // el Corazón late
    const px = ox + 48.5 * T, py = oy + 4915.5 * T, lat = Math.exp(-3.5 * Math.max(0, tiempo - tLatido)), rr = T * (7 + 3 * lat), gl = g.createRadialGradient(px, py, 0, px, py, rr);
    gl.addColorStop(0, `rgba(255,90,60,${0.5 + 0.4 * lat})`); gl.addColorStop(0.4, `rgba(255,60,40,${0.2 + 0.2 * lat})`); gl.addColorStop(1, 'rgba(255,60,40,0)');
    g.globalCompositeOperation = 'lighter'; g.fillStyle = gl; g.fillRect(px - rr, py - rr, rr * 2, rr * 2); g.globalCompositeOperation = 'source-over';
    const t = T * (2.6 + 0.4 * lat); g.drawImage(sprite('cor'), px - t / 2, py - t / 2, t, t);          // el corazón, grande, encima de su celda
  }
  // lava: un resplandor que late y una burbuja que crece y revienta
  if (calor.length) {
    const res = sprite('res'), bur = sprite('bl');
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < calor.length; i += 4) { g.globalAlpha = 0.34 + 0.16 * Math.sin(reloj * 2.2 + calor[i + 2] * 1.7 + calor[i + 3] * 0.9); g.drawImage(res, calor[i] - T * 0.75, calor[i + 1] - T * 0.75); }
    g.globalCompositeOperation = 'source-over';
    for (let i = 0; i < calor.length; i += 4) {
      const x = calor[i + 2], y = calor[i + 3], s = (reloj * 0.42 + ((x * 37 + y * 91) % 100) / 100) % 1, k = T * (0.1 + 0.2 * s);
      g.globalAlpha = Math.min(1, s * 4, (1 - s) * 6); g.drawImage(bur, calor[i] + T * (0.3 + ((x * 13 + y * 7) % 40) / 100) - k / 2, calor[i + 1] + T * (0.32 + ((x * 29 + y * 17) % 36) / 100) - k / 2, k, k);
    }
    g.globalAlpha = 1;
  }
  // gas: burbujas verdes que suben despacio
  if (gases.length) {
    const bur = sprite('bg'), vaho = sprite('vaho');
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < gases.length; i += 4) { g.globalAlpha = 0.2 + 0.1 * Math.sin(reloj * 1.3 + gases[i + 2] * 2.1 + gases[i + 3]); g.drawImage(vaho, gases[i] - T * 0.3, gases[i + 1] - T * 0.2); }
    g.globalCompositeOperation = 'source-over';
    for (let i = 0; i < gases.length; i += 4) for (let k = 0; k < 3; k++) {
      const x = gases[i + 2], y = gases[i + 3], s = (reloj * (0.3 + k * 0.07) + ((x * 37 + y * 91 + k * 53) % 100) / 100) % 1, r = T * (0.105 + 0.035 * k) * (0.7 + 0.5 * s);
      g.globalAlpha = Math.min(1, s * 5, (1 - s) * 4) * 0.95;
      g.drawImage(bur, gases[i] + T * (0.22 + ((x * 13 + y * 7 + k * 41) % 56) / 100) + Math.sin(reloj * 2 + k + x) * T * 0.03 - r, gases[i + 1] + T * (0.86 - 0.7 * s) - r, r * 2, r * 2);
    }
    g.globalAlpha = 1;
  }
  // orillas y fondo del mundo
  g.fillStyle = '#120c09';
  if (ox > 0) g.fillRect(0, Math.max(0, oy), ox, h);
  if (ox + W * T < w) g.fillRect(ox + W * T, Math.max(0, oy), w, h);
  if (oy + H * T < h) g.fillRect(0, oy + H * T, w, h);
  if (oy > -T && oy < h + 6 * T) {
    // El terrero: ahí se tira el tepetate. Crece con todo lo que ha cavado el equipo.
    const al = T * Math.min(2.4, 0.3 + 0.5 * Math.log10(1 + cavadasMundo / 40)), tx = ox + 30 * T, an = T * 6;
    g.fillStyle = '#6b5a4c'; g.beginPath(); g.moveTo(tx, oy); g.quadraticCurveTo(tx + an * 0.3, oy - al * 1.25, tx + an * 0.55, oy - al); g.quadraticCurveTo(tx + an * 0.8, oy - al * 0.8, tx + an, oy); g.fill();
    g.fillStyle = '#857362'; for (let n = 0; n < 9; n++) { const fx = 0.12 + 0.76 * azar01(n * 3.1), fy = azar01(n * 7.7) * 0.7 * Math.sin(Math.PI * fx); g.beginPath(); g.arc(tx + an * fx, oy - al * fy - T * 0.06, T * (0.06 + 0.05 * azar01(n)), 0, 7); g.fill(); }
    // El nicho de Santa Bárbara, patrona de los mineros, con su veladora
    const nx = ox + 37.6 * T, u = T / 16;
    g.fillStyle = '#e9e2d3'; g.beginPath(); g.roundRect(nx - u * 5, oy - u * 15, u * 10, u * 15, [u * 5, u * 5, 0, 0]); g.fill(); g.fillStyle = '#2f5fb0'; g.beginPath(); g.roundRect(nx - u * 3.4, oy - u * 12.6, u * 6.8, u * 10, [u * 3.4, u * 3.4, 0, 0]); g.fill();
    g.fillStyle = '#f3ead8'; g.beginPath(); g.arc(nx, oy - u * 9, u * 1.3, 0, 7); g.fill(); g.fillStyle = '#b8362b'; g.beginPath(); g.moveTo(nx - u * 2, oy - u * 3); g.lineTo(nx, oy - u * 8); g.lineTo(nx + u * 2, oy - u * 3); g.fill();
    g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(nx, oy - u * 9, u * 2, Math.PI * 1.15, Math.PI * 1.85); g.lineWidth = Math.max(1, u * 0.4); g.strokeStyle = '#ffd23f'; g.stroke();
    g.fillStyle = '#fff6c9'; g.fillRect(nx + u * 2.2, oy - u * 4.5, u * 1.1, u * 2.5); g.fillStyle = '#ffb347'; g.beginPath(); g.ellipse(nx + u * 2.75 + Math.sin(reloj * 9) * u * 0.15, oy - u * 5.3, u * 0.5, u * 0.9, 0, 0, 7); g.fill();
    g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.35 + 0.1 * Math.sin(reloj * 8); g.drawImage(sprite('res'), nx + u * 2.75 - T * 0.75, oy - u * 5.3 - T * 0.75, T * 1.5, T * 1.5); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  }
  // edificios
  if (oy > -T && oy < h + 80 * T / 16) for (const e of EDIF) {
    const u = T / 16, c = casa(e), bx = ox + e.x * T + Math.round(1.5 * T - c.width / 2), by = oy - c.height;
    if (bx > w || bx + c.width < 0) continue;
    g.drawImage(c, bx, by);
    if (e.id === 'rem') { g.fillStyle = `rgba(233,184,255,${0.18 + 0.16 * Math.sin(reloj * 2.4)})`; g.beginPath(); g.arc(bx + 39 * u, by + 35 * u, 7 * u, 0, 7); g.fill(); }
    if (e.id === 'gas' && Math.sin(reloj * 4) > 0) { g.fillStyle = '#6fdc7a'; g.fillRect(bx + 24 * u, by + 62.6 * u, u, u); }
    { const k = Math.floor(reloj * 3) % 11; g.fillStyle = '#fff'; g.beginPath(); g.arc(bx + 7 * u + k * 6.4 * u, by + 1.5 * u, u * 0.9, 0, 7); g.fill(); }      // un foco que recorre el letrero
    if (pistaDe === e) { g.strokeStyle = '#ffd23f'; g.lineWidth = Math.max(2, u * 0.9); g.setLineDash([u * 2, u * 1.5]); g.lineDashOffset = -reloj * u * 8; g.strokeRect(bx + 2 * u, by + 2 * u, c.width - 4 * u, c.height - 3 * u); g.setLineDash([]); }
  }
  // señales
  for (const s of senales) {
    const px = ox + s.x * T, py = oy + s.y * T, r = T * (0.6 + (reloj * 2 % 1) * 0.6);
    g.strokeStyle = '#ffd23f'; g.lineWidth = Math.max(2, T * 0.07); g.beginPath(); g.arc(px, py, r, 0, 7); g.stroke();
    g.fillStyle = '#ffd23f'; g.font = `800 ${Math.max(10 * RES, T * 0.3)}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'bottom'; g.fillText('¡Aquí! · ' + s.n, px, py - T);
  }
  for (const b of bichos) {
    if (!hueca(Math.floor(b.x), Math.floor(b.y))) continue;                   // dentro de la roca no se ven
    const px = ox + b.x * T, py = oy + b.y * T, a = Math.min(1, b.t), al = Math.sin(b.f * (b.k === 0 ? 26 : 16));
    g.globalAlpha = a;
    if (b.k === 0) { const t = T * 0.2; g.fillStyle = '#1b1320'; g.beginPath(); g.ellipse(px, py, t * 0.35, t * 0.5, 0, 0, 7); g.moveTo(px, py - t * 0.2); g.lineTo(px - t * 1.5, py - t * (0.4 + al * 0.9)); g.lineTo(px - t * 0.8, py + t * 0.25); g.lineTo(px, py + t * 0.15); g.lineTo(px + t * 0.8, py + t * 0.25); g.lineTo(px + t * 1.5, py - t * (0.4 + al * 0.9)); g.fill(); }
    else if (b.k === 2) { const t = T * 0.14; g.fillStyle = b.f % 2 < 1 ? '#8fd0ff' : '#c9a0ff'; g.beginPath(); g.ellipse(px - t * 0.8, py, t * 0.8 * Math.abs(al), t * 1.1, -0.4, 0, 7); g.ellipse(px + t * 0.8, py, t * 0.8 * Math.abs(al), t * 1.1, 0.4, 0, 7); g.fill(); g.fillStyle = '#fff'; g.fillRect(px - 1, py - t * 0.6, 2, t * 1.2); }
    else { const col = b.k === 1 ? '190,255,120' : '255,150,60', rr = T * (0.22 + 0.05 * al), gl = g.createRadialGradient(px, py, 0, px, py, rr); gl.addColorStop(0, `rgba(255,255,255,${0.9})`); gl.addColorStop(0.25, `rgba(${col},0.75)`); gl.addColorStop(1, `rgba(${col},0)`); g.globalCompositeOperation = 'lighter'; g.fillStyle = gl; g.fillRect(px - rr, py - rr, rr * 2, rr * 2); g.globalCompositeOperation = 'source-over'; }
  }
  g.globalAlpha = 1;
  if (y1 >= 1476 && y0 <= 1518) {                 // «El Güero» sigue en la Gruta de Cristal, esperando a que alguien baje
    const [gx, gy] = guero(); dibMaq(g, ox + gx * T, oy + gy * T, T, 6, -1, false, 0, op.nombres ? '«El Güero» · maquinita 22' : '', '', gx);
    if (S && !S.fl.guero) { g.fillStyle = '#ffd23f'; g.font = `900 ${T * 0.5}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'bottom'; g.fillText('!', ox + gx * T, oy + (gy - 0.95 + Math.sin(reloj * 4) * 0.06) * T); }
  }
  // las demás maquinitas y la mía
  for (const o of otros.values()) {
    if (!o.on || o.x === undefined || (ceremonia && ceremonia.ids.has(o.i))) continue;
    dibMaq(g, ox + o.x * T, oy + o.y * T, T, o.m, o.fl & 1 ? 1 : -1, o.fl & 2 ? 1 : o.fl & 96 ? 2 : 0, o.fl & 4 ? (o.fl & 16 ? 2 : o.fl & 1 ? 1 : -1) : 0, op.nombres ? (o.me ? '✦ ' : '') + o.n : '', o.fl & 8 ? 'en pausa' : '', o.x, o.p || null);
    if (enPleito(o.i)) barraVida(ox + o.x * T, oy + o.y * T, o.vida ?? null, o.mx || 1, colorTx(o.i));
    estela(o.p, o.x, o.y, (o.fl & 2) || (o.fl & 96));
  }
  const p = yo.perf, mx = ox + vis.x * T, my = oy + vis.y * T;
  if (p && p.tipo === 2) {                         // la piedra que estás perforando se queda a la vista y se va desmoronando
    const e = Math.min(1, p.t / p.dur), lx = ox + p.tx * T, ly = oy + p.ty * T;
    g.globalAlpha = 1 - e * 0.9; g.drawImage(tile(2, zonaDe((p.ty + 1) * 2), 0), lx, ly); g.globalAlpha = 1;
    g.strokeStyle = '#000a'; g.lineWidth = Math.max(1, T * 0.04); g.beginPath();
    for (let n = 0; n < 5; n++) if (e > n * 0.18) { const a = n * 1.3 + 0.4; g.moveTo(lx + T / 2, ly + T / 2); g.lineTo(lx + T / 2 + Math.cos(a) * T * 0.2, ly + T / 2 + Math.sin(a) * T * 0.25); g.lineTo(lx + T / 2 + Math.cos(a + 0.4) * T * 0.42, ly + T / 2 + Math.sin(a + 0.4) * T * 0.42); }
    g.stroke();
  }
  if (p && p.tipo === 3) {                         // la lava que estás cortando sigue ahí, cada vez más abierta y más brillante
    const e = Math.min(1, p.t / p.dur), lx = ox + p.tx * T, ly = oy + p.ty * T;
    g.globalAlpha = 1 - e * 0.85; g.drawImage(tile(3, zonaDe((p.ty + 1) * 2), 0), lx, ly); g.globalAlpha = 1;
    g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.5 + 0.5 * e; const res = sprite('res'); g.drawImage(res, lx - T * 1.25, ly - T * 1.25, T * 3.5, T * 3.5); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  }
  const enPelea = tiempo - (yo.pelea || -9) < 0.7, bx = enPelea ? Math.sin(reloj * 70) * T * 0.035 : 0;       // en pelea la maquinita vibra y saca los rotorcitos
  faroCol = tiempo - tGas < 3 ? '#6fc3ff' : '#fff3b0';
  if (ceremonia) dibujarCeremonia(ox, oy);
  if (!soloVer && !ceremonia) dibMaq(g, mx + bx, my, T, miModelo, yo.dir, yo.vuela ? 1 : yo.planea || enPelea || (yo.agua && yo.picada) ? 2 : 0, p ? (p.ty > Math.floor(p.oy) ? 2 : p.tx < Math.floor(p.ox) ? -1 : 1) : yo.ataca || 0, op.nombres ? (miMe ? '✦ ' : '') + miNombre : '', '', vis.x, pintaVista());
  if (!soloVer && !ceremonia) estela(pintaVista(), vis.x, vis.y, yo.vuela || yo.planea || Math.abs(yo.vx) + Math.abs(yo.vy) > 5);
  if (!soloVer && !ceremonia && enPleito(miI)) barraVida(mx + bx, my, S.vida, vidaMax(), '#ffd23f');
  if (huellas.length) dibujarEstelas(ox, oy, Math.min(0.05, (performance.now() - (dibujarEstelas.t || performance.now())) / 1000)); dibujarEstelas.t = performance.now();
  // el aire como resistencia: al caer rápido se forma un arco bajo la maquinita; muy rápido se pone al rojo y deja estela
  const dens = vis.y < 0 ? Math.max(0, 1 + (vis.y + HH) / 45000) : 0;
  if (yo.vy > 30 && dens > 0.02) {
    const f = tope((yo.vy - 30) / 140) * dens, cal = tope((yo.vy - 200) / 500) * dens;
    g.globalCompositeOperation = 'lighter';
    if (cal > 0.02) { const l = T * (2 + 5 * cal), est = g.createLinearGradient(0, my, 0, my - l); est.addColorStop(0, `rgba(255,150,60,${0.55 * cal})`); est.addColorStop(1, 'rgba(255,120,40,0)'); g.fillStyle = est; g.beginPath(); g.moveTo(mx - T * 0.42, my); g.lineTo(mx - T * 0.12, my - l); g.lineTo(mx + T * 0.12, my - l); g.lineTo(mx + T * 0.42, my); g.fill(); }
    g.strokeStyle = `rgba(255,${Math.round(255 - 110 * cal)},${Math.round(255 - 190 * cal)},${0.15 + 0.5 * f})`;
    for (let n = 0; n < 3; n++) { g.lineWidth = Math.max(1, T * (0.075 - n * 0.02)); g.beginPath(); g.arc(mx, my - T * 0.12, T * (0.72 + 0.2 * f + n * 0.16) + Math.sin(reloj * 40 + n) * T * 0.02, 0.17 * Math.PI, 0.83 * Math.PI); g.stroke(); }
    g.globalCompositeOperation = 'source-over';
  }
  const lado = Math.max(1, Math.round(T * 0.09));
  for (const q of parts) {                           // chispas cuadradas; el humo, en bolitas suaves
    g.fillStyle = q.col;
    if (q.g) { g.globalAlpha = Math.min(0.5, q.t * 0.7); g.beginPath(); g.arc(ox + q.x * T, oy + q.y * T, lado * q.g * 0.75, 0, 7); g.fill(); }
    else { g.globalAlpha = Math.min(1, q.t * 2); g.fillRect(ox + q.x * T, oy + q.y * T, lado, lado); }
  }
  for (const o of ondas) {                           // ondas de choque: un fogonazo y un anillo que se abre
    const k = o.t / o.d, r = o.r * T * (1 - (1 - k) * (1 - k)), px = ox + o.x * T, py = oy + o.y * T;
    if (k < 0.3) { g.globalAlpha = (0.3 - k) * 2.2; g.fillStyle = '#fff6dc'; g.beginPath(); g.arc(px, py, r, 0, 7); g.fill(); }
    g.globalAlpha = (1 - k) * 0.9; g.strokeStyle = o.col; g.lineWidth = Math.max(1, T * 0.22 * (1 - k)); g.beginPath(); g.arc(px, py, r, 0, 7); g.stroke();
  }
  g.globalAlpha = 1;
  // bajo tierra oscurece poco a poco; la maquinita lleva su luz
  if (vis.y > 0.5 && oy < h) {
    const a = Math.min(0.62, 0.14 + (vis.y / 500) * 0.6) * (vis.y >= 165 && lugarDe(Math.floor(vis.x), Math.floor(vis.y)) >= 0 ? 0.5 : 1) * (vis.y > EDEN0 - 8 ? Math.max(0, 1 - edenPct * 1.4) : 1), luz = g.createRadialGradient(mx, my, T * 2, mx, my, T * 11);      // en el jardín, entre más se descubre, más luz
    luz.addColorStop(0, 'rgba(10,5,3,0)'); luz.addColorStop(1, `rgba(10,5,3,${a})`);
    g.fillStyle = luz; g.fillRect(0, Math.max(0, oy), w, h);
  }
  if (flot.length) {                                // lo que vas recogiendo, con su valor
    g.font = `800 ${Math.max(12 * RES, T * 0.32)}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = Math.max(3, T * 0.09); g.strokeStyle = '#000d'; g.lineJoin = 'round';
    for (const f of flot) { g.globalAlpha = Math.min(1, f.t * 1.5); g.strokeText(f.txt, ox + f.x * T, oy + f.y * T); g.fillStyle = f.col; g.fillText(f.txt, ox + f.x * T, oy + f.y * T); }
    g.globalAlpha = 1;
  }
  if (calorFx > 0.02) {                             // al cruzar lava todo se pone al rojo; al salir del otro lado se va enfriando
    g.fillStyle = `rgba(255,45,10,${0.3 * calorFx})`; g.fillRect(0, 0, w, h);
    const rr = T * (3 + 3 * calorFx), br = g.createRadialGradient(mx, my, 0, mx, my, rr); br.addColorStop(0, `rgba(255,170,60,${0.6 * calorFx})`); br.addColorStop(1, 'rgba(255,90,20,0)');
    g.globalCompositeOperation = 'lighter'; g.fillStyle = br; g.fillRect(mx - rr, my - rr, rr * 2, rr * 2); g.globalCompositeOperation = 'source-over';
  }
  if (golpeFx > 0.02) {                             // un golpe enrojece las orillas de la pantalla un instante
    const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.hypot(w, h) * 0.55);
    v.addColorStop(0, 'rgba(255,40,20,0)'); v.addColorStop(1, `rgba(255,40,20,${0.5 * golpeFx})`); g.fillStyle = v; g.fillRect(0, 0, w, h);
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
const rit = { hz: 60, fps: 60, niv: NITIDEZ.length - 1, sonda: true, d: [], lento: 0, bien: 0, veto: 0, sube: 0, peor: 0, lentos: 0, n: 0, t0: 0, ult: null };
const ant = { x: INICIO_X, y: INICIO_Y };
let mapaCuadro = 0, ult = 0, acum = 0, tHud = 0, tPos = 0, tBip = 0, cicloId = 0, tCerca = 0, hayCerca = false;

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
  if (d < 0.2) {
    medirRitmo(d * 1000);
    // Cuenta de cuadros lentos por minuto: los que tardaron más del doble de lo que dura un refresco de esta pantalla.
    const ms = d * 1000; rit.n++; if (ms > rit.peor) rit.peor = ms; if (ms > 2000 / rit.hz + 2) rit.lentos++;
    if (t - rit.t0 > 60000) { if (rit.t0) rit.ult = { peor: rit.peor, lentos: rit.lentos, n: rit.n }; rit.t0 = t; rit.peor = rit.lentos = rit.n = 0; }
  }
  if (d > 0.1) d = 0.1;
  reloj += d; acum += d;
  let n = 0;
  while (acum >= DT) {
    ant.x = yo.x; ant.y = yo.y;
    fisica(DT); darVuelta(); tiempo += DT; acum -= DT;
    if (++n >= 14) { acum = 0; break; }                    // si la máquina se atrasa, no se intenta alcanzar: se suelta
  }
  const a = acum / DT, salto = Math.abs(yo.x - ant.x) > 1.5 || Math.abs(yo.y - ant.y) > 1.5;
  vis.x = salto ? yo.x : ant.x + (yo.x - ant.x) * a; vis.y = salto ? yo.y : ant.y + (yo.y - ant.y) * a;
  animar(d);
  dibujar();
  if (mapaL.abierto && (++mapaCuadro & 1)) pintarMapaLat();
  sonarLazos(false); gotear(d);                            // el sonido sigue a la maquinita cuadro por cuadro
  // La posición se manda 30 veces por segundo cuando hay alguien cerca (o mirando), para que se vea en tiempo real,
  // y 10 cuando los demás andan lejos, donde no hace falta.
  if ((tCerca += d) > 0.3) { tCerca = 0; hayCerca = mirones > 0; if (!hayCerca) for (const o of otros.values()) if (o.on && o.x !== undefined && Math.abs(o.x - yo.x) < 30 && Math.abs(o.y - yo.y) < 18) { hayCerca = true; break; } }
  if ((tPos += d) >= (red.lenta ? 0.125 : hayCerca ? 0.033 : 0.1)) { tPos = 0; enviarPos(); }
  if (Math.abs(yo.y - R_HONGOS.cy) < 14) cantarHongos();
  if (jardin.m.length && Math.abs(camY + filas / 2 - R_JARDIN.cy) < 60) mariposas(d, Math.abs(yo.y - R_JARDIN.cy) < 14 && enRincon(R_JARDIN, Math.floor(yo.x), Math.floor(yo.y), true));      // solo se mueven cuando se pueden ver
  if ((tHud += d) > 0.12) { tHud = 0; cadaTanto(); }
  // la veta madre se busca con el oído
  if ((tBip -= d) < 0 && yo.y > 0) {
    const b = Math.floor(yo.y / 75); let m = 99;
    for (const k of [b - 1, b, b + 1]) { if (k < 0) continue; const [vx, vy] = veta(k); if (celda(vx, vy) >= 10) m = Math.min(m, Math.hypot(vx + 0.5 - yo.x, vy + 0.5 - yo.y)); }
    if (m < 9) { son.bip(); tBip = 0.12 + m * 0.11; } else tBip = 0.5;
  }
}
// Todo lo que se mueve en pantalla y no es mi física: las demás maquinitas, partículas y la cámara.
// Quien mira no tiene maquinita: la cámara va con la que eligió ver, y lo demás (el mundo, las otras, las chispas) corre igual.
function cicloVer(t, id) {
  if (!corriendo || id !== cicloId) return;
  requestAnimationFrame((x) => cicloVer(x, id));
  let d = (t - ult) / 1000; ult = t;
  if (!(d > 0)) return;
  if (d > 0.1) d = 0.1;
  reloj += d; tiempo += d;
  const o = otros.get(veo);
  if (!ceremonia && o && o.on && o.x !== undefined) { const lejos = Math.abs(o.x - yo.x) > 12 || Math.abs(o.y - yo.y) > 12; yo.x = vis.x = o.x; yo.y = vis.y = o.y; if (lejos) { camX = Math.max(0, Math.min(W - cols, o.x - cols / 2)); camY = o.y - filas * 0.5; } }
  animar(d); dibujar(); gotear(d); pintarTecladoVer(); if (mapaL.abierto && (++mapaCuadro & 1)) pintarMapaLat();
  if ((tHud += d) > 0.25) { tHud = 0; pintarVer(); if (yo.y > EDEN0 - 60 && tiempo - edenT > 1) { edenT = tiempo; jardinDelFondo(); } }
}
function iniciarVer(d) {
  const primera = !listo;
  seed = d.seed; remin = d.remin; cfg = d.cfg; miI = -1; soyCreador = false; miNombre = ''; mundoId = '';
  const b = atob(d.dug); for (let i = 0; i < dug.length; i++) dug[i] = b.charCodeAt(i);
  hallados.fill(0); for (const k of d.col || []) if (k >= 0 && k < NCOL) hallados[k] = 1;
  nuevaSemilla(); ponerTerreno(d); if (d.sinMineral === remin) vaciarMinerales(); otros.clear();
  for (const j of d.jug) otros.set(j.i, j);
  if (!S) { S = sanear(null); S.fuel = tanque(); S.vida = vidaMax(); }
  if (!otros.has(veo)) veo = ([...otros.values()].find((o) => o.on) || [...otros.values()].sort((a, b) => (b.tot || 0) - (a.tot || 0))[0] || { i: -1 }).i;
  conectado = true; listo = true; verFallos = 0; tCaido = 0;
  if (primera) { medir(); yo.x = vis.x = ant.x = INICIO_X; yo.y = vis.y = ant.y = INICIO_Y; camX = Math.max(0, Math.min(W - cols, yo.x - cols / 2)); camY = Math.max(-filas * 0.68, yo.y - filas * 0.5); }
  if (menu === 'inicio') { menu = null; $('#velo').classList.remove('on'); }
  document.body.classList.add('viendo');
  ponerChat(d.chat); pintarVer(); arrancar();
  enviarVer({ t: 'soy', n: (maqLocal && maqLocal.n) || '', m: (maqLocal && maqLocal.m) | 0 });
  if (primera && /[?&]pedir=1/.test(location.search)) pedirJugar();
  // Si la conexión se cayó mientras esperaba, la solicitud se vuelve a mandar sola; si ya lo habían aceptado, el mundo lo deja pasar de inmediato.
  else if (!primera && (pido === 'espera' || pido === 'ausente' || pido === 'enviando') && maqLocal && maqLocal.k) enviarVer({ t: 'pido', k: maqLocal.k, n: maqLocal.n, m: maqLocal.m | 0 });
}
function enviarVer(o) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); }
// Pedir entrar a jugar desde la vista de observador: va con la maquinita de este equipo (o con una nueva, ya bautizada).
let pido = '', pidoDe = '', pidoT = 0;
function pedirJugar() {
  if (!soloVer || pido === 'espera' || pido === 'ausente' || pido === 'aceptado' || pido === 'enviando') return;
  pidoT = Date.now();
  if (!maqLocal || !maqLocal.k) { const b = nombreNuevo(); maqLocal = { k: llave(), n: b.n, m: b.m }; }
  if (!maqLocal.n) { const b = nombreNuevo(); maqLocal.n = b.n; maqLocal.m = b.m; }
  escribir('mina_maq', maqLocal); pido = 'enviando'; pintarVer();
  enviarVer({ t: 'pido', k: maqLocal.k, n: maqLocal.n, m: maqLocal.m | 0 });
}
function yaNoPido() { if (pido !== 'espera' && pido !== 'ausente') return; enviarVer({ t: 'nopido' }); pido = ''; pidoT = 0; pintarVer(); }
// Aceptado: de mirar a jugar sin recargar la página. Se cierra la conexión de observador y se entra al mismo mundo con la
// maquinita de este equipo; el terreno ya está cargado, así que es instantáneo.
function pasarAJugar(id) {
  const v = ws; if (v) { v.onclose = v.onmessage = null; try { v.close(); } catch {} }
  detener(); soloVer = false; verFicha = ''; pido = ''; pidoT = 0; pintarEspera(); document.body.classList.remove('viendo'); document.title = 'Mina · excava con tus amigos';
  S = null; listo = false; conectado = false; otros.clear(); chat.l = []; mirones = 0; ceremonia = null; lluvia = null;
  mundoId = id; history.replaceState(null, '', '/' + id);
  miK = maqLocal.k; bautizo = maqLocal.n ? { n: maqLocal.n, m: maqLocal.m | 0 } : nombreNuevo();
  conectar();
  setTimeout(() => { if (S) tarjeta('⛏️ ¡Ya estás jugando con ' + (maqLocal.n || 'tu maquinita') + '!', 'Apareces en la superficie. Primero carga combustible en la Gasolinera (↓ para entrar) y baja. El chat se abre con C.', 'msj', 12000, true); }, 1500);
}
// Mientras espera respuesta: una tarjeta clara abajo, con su maquinita, el tiempo que lleva y cómo cancelar.
function pintarEspera() {
  const el = $('#verEspera'); if (!soloVer || !pido) { if (el._h) { el._h = ''; el.innerHTML = ''; } el.className = ''; return; }
  const quien = esc(pidoDe || 'quien creó el mundo'), mia = esc((maqLocal && maqLocal.n) || 'tu maquinita'), seg = pidoT ? Math.floor((Date.now() - pidoT) / 1000) : 0, reloj = Math.floor(seg / 60) + ':' + String(seg % 60).padStart(2, '0');
  const E = {
    enviando: ['', '🙋 Mandando tu solicitud…', 'Un momento.', ''],
    espera: ['', `🙋 Ya le avisamos a ${quien} que quieres jugar`, `Mientras decide, mira la partida: arriba eliges a quién seguir. En cuanto diga que sí, entras solo con <b>${mia}</b>, sin recargar nada.`, `<small class="reloj">Esperando su respuesta<i>.</i><i>.</i><i>.</i> ${reloj}</small><button class="s" data-a="yaNo">Ya no</button>`],
    ausente: ['', '🙋 Tu solicitud está lista', `${quien.charAt(0).toUpperCase() + quien.slice(1)} no está conectado ahora. En cuanto entre le llega, y si dice que sí entras solo con <b>${mia}</b>. Mientras, sigue mirando.`, `<small class="reloj">Esperando ${reloj}</small><button class="s" data-a="yaNo">Ya no</button>`],
    aceptado: ['ok', `🎉 ¡${quien.charAt(0).toUpperCase() + quien.slice(1)} te aceptó!`, `Entrando a jugar con <b>${mia}</b>…`, ''],
    no: ['no', 'Esta vez no te aceptaron', 'Puedes seguir mirando, o pedirlo otra vez más tarde.', '<button data-a="otraVez"><kbd>J</kbd>Pedir otra vez</button><button class="s" data-a="cerrarEspera">Cerrar</button>'],
  }[pido];
  if (!E) return;
  const h = `<canvas width="72" height="72"></canvas><div><b>${E[1]}</b><span>${E[2]}</span><div class="pie">${E[3]}</div></div>`;
  el.className = 'on ' + E[0];
  if (el._h !== h) { el._h = h; el.innerHTML = h; dibMaq(el.querySelector('canvas').getContext('2d'), 36, 39, 62, (maqLocal && maqLocal.m) | 0, 1, pido === 'aceptado' ? 1 : 0, 0, '', ''); }
}
$('#verEspera').addEventListener('click', (e) => { const b = e.target.closest('[data-a]'); if (!b) return; audio(); const a = b.dataset.a; if (a === 'yaNo') yaNoPido(); else if (a === 'otraVez') { pido = ''; pedirJugar(); } else if (a === 'cerrarEspera') { pido = ''; pintarVer(); } });
// El teclado de la maquinita que estás mirando: se encienden las teclas que va apretando.
let tkVisto = -1;
function pintarTecladoVer() {
  const o = otros.get(veo), tk = o && o.on && performance.now() - (o.tkT || 0) < 1500 ? o.tk | 0 : 0;
  if (tk === tkVisto) return; tkVisto = tk;
  $('#verTeclado').querySelectorAll('[data-b]').forEach((el) => el.classList.toggle('on', !!(tk & (1 << +el.dataset.b))));
}
// Un clic en una maquinita (en el mundo o en la lista de arriba) y la vista se va con ella.
lienzo.addEventListener('click', (e) => { if (e.pointerType !== 'touch') elegirVisto(e.clientX, e.clientY); });      // con el dedo llega desde la palanca (un toque corto)
function elegirVisto(cx, cy) {
  if (!soloVer || !listo) return;
  const wx = camX + (cx * RES) / T, wy = camY + (cy * RES) / T;
  let mejor = null, dm = 2.2; for (const o of otros.values()) { if (!o.on || o.x === undefined) continue; const dd = Math.hypot(o.x - wx, o.y - wy); if (dd < dm) { dm = dd; mejor = o; } }
  if (mejor) { veo = mejor.i; tkVisto = -1; pintarVer(); }
}
// La barra de quien mira: a quién ve, cuánto lleva, cuántos más miran, y cómo cambiar de maquinita o ponerse a jugar.
function pintarVer() {
  const o = otros.get(veo), vivos = [...otros.values()].filter((x) => x.on).length;
  poner($('#verDatos'), o ? `<b>${o.on ? '<span class="vivo">● EN VIVO</span>' : '○ No está jugando ahora'} · ${esc(o.n)}</b><small>${o.on && o.y !== undefined ? donde(o.y) + ' · ' : ''}${dineroLargo(o.tot || 0)} ganados · ${esc(cfg.nombre || 'un mundo de Mina')}${mirones > 1 ? ' · 👁 ' + mirones + ' mirando' : ''}</small>` : '<b>Este mundo está vacío</b>');
  const l = [...otros.values()].filter((x) => x.on).sort((a, b) => a.i - b.i);
  const pl = [...peleas.entries()].find(([i, p]) => tiempo - p.h < 6 && otros.get(i)?.on);
  poner($('#verQuien'), (pl && !enPleito(veo) ? `<button id="verPelea" data-veo="${pl[0]}">⚔️ Ver el pleito: ${esc(nombreDe(pl[0]))} contra ${esc(nombreDe(pl[1].con))}</button>` : '') + (l.length ? l.map((x) => `<button class="s${x.i === veo ? ' on' : ''}" data-veo="${x.i}" style="--c:${colorTx(x.i)}"><i></i>${esc(x.n)}</button>`).join('') : '<small>Nadie está jugando ahora mismo</small>'));
  const P = { '': '<kbd>J</kbd>🙋 Pedir jugar aquí', enviando: '🙋 Mandando…', espera: '⏳ Solicitud enviada', ausente: '⏳ Solicitud enviada', aceptado: '🎉 ¡Aceptado!', no: '<kbd>J</kbd>🙋 Pedir otra vez' };
  poner($('#verPedir'), P[pido] ?? P['']); $('#verPedir').disabled = pido === 'espera' || pido === 'ausente' || pido === 'enviando' || pido === 'aceptado';
  pintarEspera();
}
function verOtra(paso) {
  const l = [...otros.values()].filter((o) => o.on).sort((a, b) => a.i - b.i); if (!l.length) return;
  const k = l.findIndex((o) => o.i === veo); veo = l[(k + paso + l.length) % l.length].i; pintarVer();
}
const num = (n) => Math.round(n || 0).toLocaleString('es-MX');      // todo número entero, con sus comas
const dineroLargo = (n) => '$' + Math.floor(n || 0).toLocaleString('es-MX');
// El tiempo que una maquinita lleva jugando: de segundos a años, con las unidades más grandes que le toquen.
const UNIDADES = [[31536000, 'año', 'años'], [2592000, 'mes', 'meses'], [604800, 'sem', 'sem'], [86400, 'd', 'd'], [3600, 'h', 'h'], [60, 'min', 'min'], [1, 's', 's']];
function tiempoLargo(seg) {
  seg = Math.max(0, Math.floor(seg || 0)); if (!seg) return '0 s';
  const p = []; let desde = -1;
  for (let k = 0; k < UNIDADES.length && p.length < 3; k++) { const [u, uno, varios] = UNIDADES[k], n = Math.floor(seg / u); if (n && desde < 0) desde = k; if (n) { p.push(n + ' ' + (n === 1 ? uno : varios)); seg -= n * u; } if (desde >= 0 && k - desde >= 2) break; }
  return p.join(' ');
}

/* ════════ El chat del mundo ════════ RLR */
// Como en las partidas de antes: lo que alguien escribe sale abajo un momento, y el chat completo se abre de izquierda a
// derecha con todo lo dicho, guardado en el mundo. Cada maquinita tiene su color, el de su número en este mundo (el orden
// en que entró): hay cien, y no cambia aunque salga y vuelva a entrar.
const colorDe = (i) => { const k = (((i | 0) % 100) + 100) % 100, c = k % 3; return [(k * 137.508) % 360, [78, 62, 88][c], [66, 74, 60][c]]; };
const colorTx = (i) => { const [h, sa, l] = colorDe(i); return `hsl(${h.toFixed(0)} ${sa}% ${l}%)`; };
const colorFondo = (i) => { const [h, sa] = colorDe(i); return `hsl(${h.toFixed(0)} ${Math.round(sa * 0.62)}% 21% / .94)`; };
const chat = { l: [], abierto: false, sinLeer: 0, nuevos: 0, completo: false, pidiendo: false };
const iconos = [];
function iconoMaq(m) { m = m | 0; if (!iconos[m]) { const c = document.createElement('canvas'); c.width = c.height = 60; dibMaq(c.getContext('2d'), 30, 32, 54, m, 1, false, 0, '', ''); iconos[m] = c.toDataURL(); } return iconos[m]; }
// El texto se escribe tal cual (nunca como código) y lo que parezca una liga se vuelve liga.
function conLigas(x) {
  let h = '', k = 0, m; const re = /((?:https?:\/\/|www\.)[^\s<>"']+)/gi;
  while ((m = re.exec(x))) {
    const u = m[1].replace(/[.,;:!?)\]]+$/, ''); if (u.length < 5) continue;
    h += esc(x.slice(k, m.index)) + `<a href="${esc(/^www\./i.test(u) ? 'https://' + u : u)}" target="_blank" rel="noopener noreferrer nofollow">${esc(u)}</a>`;
    k = m.index + u.length; re.lastIndex = k;
  }
  return h + esc(x.slice(k));
}
const horaChat = (h) => new Date(h).toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });
const diaChat = (h) => { const d = new Date(h), hoy = new Date(), ay = new Date(Date.now() - 864e5); return d.toDateString() === hoy.toDateString() ? 'Hoy' : d.toDateString() === ay.toDateString() ? 'Ayer' : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: d.getFullYear() === hoy.getFullYear() ? undefined : 'numeric' }); };
function nodoChat(m, ant) {
  const f = document.createDocumentFragment(), d = document.createElement('div');
  if (m.nota) { d.className = 'cn'; d.textContent = m.nota; f.appendChild(d); return f; }
  const otroDia = !ant || !ant.h || new Date(ant.h).toDateString() !== new Date(m.h).toDateString();
  if (otroDia) { const s = document.createElement('div'); s.className = 'cn dia'; s.textContent = diaChat(m.h); f.appendChild(s); }
  const mio = !soloVer && m.i === miI, junto = !otroDia && ant && !ant.nota && ant.i === m.i && m.h - ant.h < 120000;
  d.className = 'cm' + (mio ? ' mio' : '') + (junto ? ' junto' : '');
  d.style.setProperty('--c', colorTx(m.i)); d.style.setProperty('--b', colorFondo(m.i));
  d.innerHTML = (junto ? '' : `<img class="av" src="${iconoMaq(m.m)}" alt="">`) + `<div class="bu">${junto ? '' : `<b>${esc(m.n)}</b>`}<span class="tx">${conLigas(m.x)}</span><small>${horaChat(m.h)}</small></div>`;
  f.appendChild(d); return f;
}
const chatAbajo = () => { const L = $('#chatLista'); return L.scrollHeight - L.scrollTop - L.clientHeight < 70; };
const chatAlFondo = () => { const L = $('#chatLista'); L.scrollTop = L.scrollHeight; chat.nuevos = 0; $('#chatNuevos').style.display = 'none'; };
function pintarChatBoton() { poner($('#bChat'), '<kbd>C</kbd>💬<span> Chat</span>' + (chat.sinLeer ? `<i>${chat.sinLeer > 99 ? '99+' : chat.sinLeer}</i>` : '')); const v = $('#verChat'); if (v) poner(v, '<kbd>C</kbd>💬' + (chat.sinLeer ? `<i>${chat.sinLeer}</i>` : '')); }
// Un mensaje (o una nota chica: quién entró, quién descubrió qué) se agrega al final.
function agregarChat(m) {
  const ant = chat.l[chat.l.length - 1], abajo = chatAbajo(), mio = !m.nota && !soloVer && m.i === miI;
  chat.l.push(m); $('#chatMsgs').appendChild(nodoChat(m, ant));
  const vacio = $('#chatVacio'); if (vacio) vacio.remove();
  if (m.nota) { if (abajo) chatAlFondo(); return; }
  if (chat.abierto) { if (abajo || mio) chatAlFondo(); else { chat.nuevos++; const b = $('#chatNuevos'); b.textContent = '↓ ' + chat.nuevos + (chat.nuevos === 1 ? ' mensaje nuevo' : ' mensajes nuevos'); b.style.display = 'block'; } }
  else {
    // con el chat cerrado, el mensaje sale abajo un momento, como en las partidas de antes
    const v = $('#chatVivo'), d = document.createElement('div');
    d.innerHTML = `<b style="color:${colorTx(m.i)}">${esc(m.n)}:</b> ${conLigas(m.x)}`; v.appendChild(d); while (v.children.length > 5) v.firstChild.remove(); setTimeout(() => d.remove(), 10000);
    if (!mio) { chat.sinLeer++; pintarChatBoton(); }
  }
  if (!mio) son.chat();
}
function notaChat(x) { if (listo) agregarChat({ nota: x, h: Date.now() }); }
// Al entrar (o al reconectar) llega lo último que se dijo; lo que ya se tenía no se repite.
function ponerChat(l) {
  if (!Array.isArray(l)) return;
  const ult = chat.l.reduce((a, m) => (m.id > a ? m.id : a), 0);
  if (!ult) {
    chat.l = []; const c = $('#chatMsgs'); c.innerHTML = l.length ? '' : `<p id="chatVacio" class="cn">Aquí todavía no ha escrito nadie. Di hola 👋</p>`;
    let ant = null; for (const m of l) { c.appendChild(nodoChat(m, ant)); chat.l.push(m); ant = m; }
    chat.completo = l.length < 60; chatAlFondo();
  } else for (const m of l) if (m.id > ult) agregarChat(m);
  $('#chatIn').disabled = soloVer; $('#chatIn').placeholder = soloVer ? 'Estás mirando: entra a jugar para escribir' : 'Escribe y pulsa Enter…';
  pintarChatQuien();
}
function chatViejos(l) {                           // historial hacia atrás, al subir hasta arriba
  chat.pidiendo = false; if (!Array.isArray(l) || !l.length) { chat.completo = true; return; }
  if (l.length < 50) chat.completo = true;
  const L = $('#chatLista'), h0 = L.scrollHeight, f = document.createDocumentFragment(); let ant = null;
  for (const m of l) { f.appendChild(nodoChat(m, ant)); ant = m; }
  const pri = chat.l.find((m) => m.id), dia = $('#chatMsgs .cn.dia');       // si el día continúa, sobra el letrero de fecha que encabezaba lo ya cargado
  if (pri && dia && new Date(pri.h).toDateString() === new Date(l[l.length - 1].h).toDateString()) dia.remove();
  $('#chatMsgs').prepend(f); chat.l = l.concat(chat.l); L.scrollTop += L.scrollHeight - h0;
}
function pintarChatQuien() {
  if (!S) return;
  const l = (soloVer ? [] : [{ i: miI, n: miNombre }]).concat([...otros.values()].filter((o) => o.on));
  poner($('#chatQuien'), l.length ? l.map((j) => `<span><i style="background:${colorTx(j.i)}"></i>${esc(j.n)}</span>`).join('') : 'Nadie conectado');
}
function abrirChat(foco) {
  if (!listo) return;
  chat.abierto = true; chat.sinLeer = 0; document.body.classList.add('chat'); $('#chatVivo').innerHTML = ''; pintarChatBoton(); pintarChatQuien(); chatAlFondo();
  if (foco && !soloVer) { for (const k in teclas) teclas[k] = false; $('#chatIn').focus(); }
}
function cerrarChat() { chat.abierto = false; document.body.classList.remove('chat'); $('#chatIn').blur(); }
$('#bChat').addEventListener('click', (e) => { audio(); e.currentTarget.blur(); if (chat.abierto) cerrarChat(); else abrirChat(true); });
$('#chatX').addEventListener('click', cerrarChat);
$('#chatNuevos').addEventListener('click', chatAlFondo);
$('#chatForm').addEventListener('submit', (e) => {
  e.preventDefault(); const el = $('#chatIn'), x = el.value.trim();
  if (!x) return cerrarChat();                       // Enter con la caja vacía cierra el chat: C, escribir, Enter, Enter… y de vuelta al juego
  if (soloVer) return;
  if (!conectado) { el.placeholder = 'Sin señal: en cuanto vuelva podrás escribir'; return; }
  if (Date.now() - (chat.tEnv || 0) < 450) return;      // un respiro entre mensajes: el texto se queda en la caja
  chat.tEnv = Date.now(); audio(); enviar({ t: 'chat', x }); el.value = '';
});
$('#chatIn').addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarChat();                                             // Esc cierra, aunque haya algo escrito (se queda para después)
  else if (e.key === 'Tab') { e.preventDefault(); e.currentTarget.blur(); }         // Tab: de vuelta al juego, con el chat a la vista
  else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); $('#chatLista').scrollTop += (e.key.endsWith('Up') ? -1 : 1) * (e.key.startsWith('Page') ? 320 : 90); }      // las flechas recorren la conversación
});
$('#chatEmo').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b || soloVer) return;
  const el = $('#chatIn'), a = el.selectionStart ?? el.value.length, z = el.selectionEnd ?? a;
  el.value = (el.value.slice(0, a) + b.textContent + el.value.slice(z)).slice(0, 300); el.focus(); el.selectionStart = el.selectionEnd = a + b.textContent.length;
});
$('#chatLista').addEventListener('scroll', (e) => {
  const L = e.currentTarget; if (chatAbajo()) { chat.nuevos = 0; $('#chatNuevos').style.display = 'none'; }
  if (L.scrollTop < 60 && !chat.completo && !chat.pidiendo && ws && ws.readyState === 1) { const p = chat.l.find((m) => m.id); if (p) { chat.pidiendo = true; ws.send(JSON.stringify({ t: 'chatAntes', id: p.id })); } }
});

/* ════════ El público y las solicitudes ════════ RLR */
// A quien creó el mundo le llegan: quién está mirando (solo se le avisa) y quién pide entrar a jugar (eso sí lo decide).
let publico = { mira: [], nm: 0, sol: [], ban: [], rev: [] }, verPermisos = false;
$('#caja').addEventListener('toggle', (e) => { if (e.target.id === 'permisos') verPermisos = e.target.open; }, true);      // la lista abierta sigue abierta aunque llegue alguien
const solVistas = new Set(); let miraAntes = 0;
function recibirPublico(d) {
  const nuevas = d.sol.filter((x) => !solVistas.has(x.sid));
  for (const x of d.sol) solVistas.add(x.sid);
  if (nuevas.length && document.hidden) document.title = '🙋 (' + d.sol.length + ') quiere jugar · Mina';
  if (nuevas.length) { son.entra(); tarjeta('🙋 ' + (nuevas.length === 1 ? (nuevas[0].n || 'Alguien') + ' quiere jugar en tu mundo' : nuevas.length + ' quieren jugar en tu mundo'), 'Estaba mirando y pidió entrar con su maquinita. Pulsa J para aceptar o rechazar.', 'msj', 12000, true); }
  if (d.nm > miraAntes) { const x = d.mira[d.mira.length - 1]; aviso('👁 ' + (x && x.n ? x.n : 'Alguien') + ' empezó a mirar tu mundo'); }
  miraAntes = d.nm; publico = d;
  pintarTabla(); if (menu === 'pub') pintarMenu();
}
function htmlPublico() {
  const fila = (ic, n, sub, botones) => `<div class="fila"><div class="ic">${ic}</div><div class="t"><b>${n}</b><small>${sub}</small></div>${botones}</div>`;
  const hace = (h) => { const m = Math.max(0, Math.round((Date.now() - h) / 60000)); return m < 1 ? 'hace un momento' : 'hace ' + m + ' min'; };
  const jugando = [...otros.values()].filter((o) => o.on);
  let h = soyCreador ? '<p class="nota">Mirar es libre: cualquiera con la liga para mirar entra sin pedir nada, y aquí solo se te avisa. Para <b>jugar</b> hay que pedirlo, y tú decides. Quien entra con la liga del mundo que tú mandas ya viene invitado. Quien ya jugó aquí conserva su permiso para siempre, hasta que tú se lo quites. «Quitar permiso» lo deja mirar y volver a pedirlo; «Sacar» lo saca al instante y no lo deja volver, ni a jugar ni a mirar.</p>'
    : '<p class="nota">Solo quien creó el mundo acepta solicitudes y saca jugadores.</p>';
  h += `<h4>🙋 Quieren jugar (${publico.sol.length})</h4>` + (publico.sol.length ? publico.sol.map((x, k) => fila('🙋', esc(x.n || 'Alguien'), 'Pidió entrar ' + hace(x.h), soyCreador ? `<button data-a="acepto" data-v="${x.sid}">${k === 0 ? '<kbd>Enter</kbd>' : ''}Aceptar</button><button class="s" data-a="rechazo" data-v="${x.sid}">Rechazar</button>` : '')).join('') : '<p class="nota">Nadie por ahora. Cuando alguien que está mirando pida jugar, te llega un aviso.</p>');
  h += `<h4>⛏️ Jugando ahora (${jugando.length + 1})</h4>` + fila('⭐', esc(miNombre) + ' (tú)', 'Quien creó el mundo', '') + jugando.map((o) => fila('⛏️', `<span style="color:${colorTx(o.i)}">${esc(o.n)}</span>`, o.y !== undefined ? donde(o.y) : 'conectada', soyCreador ? `<button class="s" data-a="quitarP" data-v="${o.i}">Quitar permiso</button><button class="s mal" data-a="sacarJ" data-v="${o.i}">Sacar</button>` : '')).join('');
  h += `<h4>👁 Mirando (${publico.nm || mirones})</h4>` + (publico.mira.length ? publico.mira.map((x) => fila('👁', esc(x.n || 'Alguien'), x.n ? 'Tiene maquinita' : 'Sin maquinita', soyCreador ? `<button class="s mal" data-a="sacarM" data-v="${x.sid}">Sacar</button>` : '')).join('') : `<p class="nota">${mirones ? mirones + ' mirando.' : 'Nadie está mirando ahora.'}</p>`);
  // Quién trajo a quién: el árbol de invitaciones de este mundo (lo que hace que un mundo crezca).
  const todos = [{ i: miI, n: miNombre, de: miDe }, ...[...otros.values()]], conDe = todos.filter((o) => o.de >= 0), trajo = (i) => conDe.filter((o) => o.de === i).length;
  if (conDe.length) {
    const nom2 = (i) => (i === miI ? esc(miNombre) + ' (tú)' : `<span style="color:${colorTx(i)}">${esc(nombreDe(i))}</span>`);
    const ranking = [...new Set(conDe.map((o) => o.de))].map((i) => [i, trajo(i)]).sort((a, b) => b[1] - a[1]);
    h += `<h4>💛 Quién trajo a quién (${conDe.length})</h4>` + ranking.map(([i, n]) => fila('💛', nom2(i), 'trajo a ' + conDe.filter((o) => o.de === i).map((o) => nombreDe(o.i)).join(', '), `<small>${n}</small>`)).join('');
  }
  // Los permisos duran para siempre: quien ya jugó aquí entra cuando quiera hasta que se lo quiten. Una lista larga se pliega.
  const rev = new Set(publico.rev || []), nom = (o) => `<span style="color:${colorTx(o.i)}">${esc(o.n)}</span>`;
  if (soyCreador) {
    const conPermiso = [...otros.values()].filter((o) => !o.on && !rev.has(o.i)), filas = conPermiso.map((o) => fila('🔑', nom(o), 'Ya jugó aquí: entra cuando quiera, sin volver a pedirlo', `<button class="s" data-a="quitarP" data-v="${o.i}">Quitar permiso</button>`)).join('');
    if (conPermiso.length) h += `<h4>🔑 Tienen permiso (${conPermiso.length})</h4>` + (conPermiso.length > 6 ? `<details id="permisos" ${verPermisos ? 'open' : ''}><summary class="nota">Ver las ${conPermiso.length}</summary>${filas}</details>` : filas);
    const sinPermiso = [...rev].map((i) => otros.get(i)).filter(Boolean);
    if (sinPermiso.length) h += `<h4>🔒 Sin permiso (${sinPermiso.length})</h4>` + sinPermiso.map((o) => fila('🔒', nom(o), 'Puede mirar y volver a pedirlo', `<button class="s" data-a="devolverP" data-v="${o.i}">Devolver permiso</button>`)).join('');
  }
  if (soyCreador && publico.ban.length) h += `<h4>🚫 Sacados (${publico.ban.length})</h4>` + publico.ban.map((b, k) => fila('🚫', esc(b.n || 'Alguien'), 'Sacado ' + hace(b.h), `<button class="s" data-a="perdonar" data-v="${k}">Perdonar</button>`)).join('');
  return h;
}

/* ════════ Capturas ════════ RLR */
// Un botón (📸, tecla F) guarda lo que estás viendo, con un pie de foto (mundo, profundidad, fecha). Con cuenta se queda en
// Mina, en la carpeta de ese mundo, y se ve desde cualquier equipo; sin cuenta, se descarga.
let fotoOcupada = false, capturas = { lista: [], mundos: {}, sub: '', cargada: 0, cargando: 0, mundo: '', grande: null };
const metrosTx = (m) => (m > 0 ? m.toLocaleString('es-MX') + ' m' : m < 0 ? Math.abs(m).toLocaleString('es-MX') + ' m de altura' : 'superficie');
const nombreFoto = () => { const f = new Date(), p2 = (n) => String(n).padStart(2, '0'); return `Mina_${(cfg.nombre || mundoId || 'captura').replace(/[^\wáéíóúñÁÉÍÓÚÑ]+/g, '_')}_${f.getFullYear()}-${p2(f.getMonth() + 1)}-${p2(f.getDate())}_${p2(f.getHours())}${p2(f.getMinutes())}.jpg`; };
function lienzoCaptura() {
  const k = Math.min(1, 1600 / lienzo.width), c = document.createElement('canvas'); c.width = Math.round(lienzo.width * k); c.height = Math.round(lienzo.height * k);
  const q = c.getContext('2d'); q.drawImage(lienzo, 0, 0, c.width, c.height);
  const f = new Date(), y = soloVer ? (otros.get(veo)?.y ?? 0) : yo.y, tx = 'Mina · ' + (cfg.nombre || 'Mundo ' + mundoId) + ' · ' + donde(y) + ' · ' + f.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + f.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  const tam = Math.max(12, Math.round(c.width / 70)); q.font = `700 ${tam}px system-ui`; q.textAlign = 'left'; q.textBaseline = 'bottom'; q.lineJoin = 'round'; q.lineWidth = tam * 0.3; q.strokeStyle = '#000b'; q.strokeText(tx, tam, c.height - tam * 0.8); q.fillStyle = '#fff'; q.fillText(tx, tam, c.height - tam * 0.8);
  return c;
}
async function tomarFoto() {
  if (!listo || fotoOcupada) return; fotoOcupada = true;
  const fl = $('#flash'); fl.classList.remove('on'); void fl.offsetWidth; fl.classList.add('on'); son.foto();
  try {
    if (!corriendo) dibujar();                                                       // con un menú abierto se captura lo que hay detrás, fresco
    const c = lienzoCaptura(), blob = await new Promise((ok) => c.toBlob(ok, 'image/jpeg', 0.86));
    if (!cuenta || !mundoId) {                                                       // sin cuenta: se descarga, y se invita a guardarla en Mina
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombreFoto(); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      tarjeta('📸 Captura descargada', 'Con tu cuenta, las capturas se quedan en Mina, por mundo, y las ves desde cualquier equipo.', 'msj', 9000, false, cuenta ? null : { t: 'Entrar con Google', f: () => irAlLogin('') });
      return;
    }
    const r = await fetch('/api/capturas/subir', { method: 'POST', headers: { 'content-type': 'image/jpeg', 'x-sesion': cuenta.ses, 'x-mundo': mundoId, 'x-metros': String(Math.round(prof())), 'x-nombre': encodeURIComponent(cfg.nombre || '') }, body: blob }), d = await r.json();
    if (!d.ok) throw d.error;
    capturas.cargada = 0;
    tarjeta('📸 Captura guardada en tu cuenta', (cfg.nombre || 'Mundo ' + mundoId) + ' · ' + donde(yo.y) + ' · la ves desde cualquier equipo.', 'msj', 9000, false, { t: 'Ver mis capturas', f: () => { capturas.mundo = mundoId; capturas.grande = null; pestana = 12; if (menu === 'menu') pintarMenu(); else abrir('menu'); } });
  } catch (e) {
    if (e === 'cuenta') { cuenta = null; try { localStorage.removeItem('mina_cuenta'); } catch {} }
    tarjeta('📸 No se pudo guardar la captura', { cuenta: 'Tu sesión venció: vuelve a entrar con Google.', imagen: 'La imagen salió vacía o muy pesada. Inténtalo otra vez.', mundo: 'Todavía no hay mundo que guardar: en cuanto nazca, vuelve a intentarlo.' }[e] || 'Se fue la conexión. Inténtalo otra vez.', 'msj', 8000);
  } finally { fotoOcupada = false; }
}
async function cargarCapturas() {
  if (!cuenta) return; capturas.cargando = 1; capturas.error = 0;
  try { const r = await fetch('/api/capturas', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ses: cuenta.ses }) }), d = await r.json(); if (!d.capturas) throw 0; capturas.lista = d.capturas.slice().reverse(); capturas.sub = d.sub; capturas.mundos = Object.fromEntries((d.mundos || []).map((m) => [m.id, m.nombre])); capturas.cargada = 1; }
  catch { capturas.error = 1; }
  capturas.cargando = 0; if (menu === 'menu' && pestana === 12) pintarMenu();
}
const urlCaptura = (c) => `/capturas/${capturas.sub}/${c.mundo}/${c.id}.jpg`;
function htmlCapturas() {
  if (!cuenta) return `<div class="fila"><div class="ic">📸</div><div class="t"><b>Tus capturas, por mundo, desde cualquier equipo</b><small>Pulsa 📸 (tecla F) y lo que estás viendo se guarda en tu cuenta, en la carpeta de ese mundo. Sin cuenta, la captura se descarga a tu equipo.</small></div><button data-a="capEntrar">Entrar con Google</button></div>`;
  if (!capturas.cargada) { if (!capturas.cargando && !capturas.error) cargarCapturas(); return capturas.error ? '<p class="nota">No se pudieron cargar tus capturas. Revisa tu conexión.</p><p><button class="s" data-a="capRecargar">Intentar otra vez</button></p>' : '<p class="nota">Abriendo tus capturas…</p>'; }
  const L = capturas.lista, nombreM = (id) => capturas.mundos[id] || (id === mundoId && cfg.nombre) || 'Mundo ' + id;
  if (!L.length) return '<p class="nota">Todavía no hay capturas. Pulsa 📸 (tecla F) cuando veas algo que quieras guardar: queda aquí, en la carpeta de ese mundo, y la ves desde cualquier equipo.</p>';
  if (capturas.grande) { const c = capturas.grande; return `<p><button class="s" data-a="capVolver">← Volver</button> <a class="boton s" href="${urlCaptura(c)}" download="${esc(nombreFoto())}" target="_blank" rel="noopener">Descargar</a> <button class="s mal" data-a="capBorrar" data-v="${c.id}" data-m="${c.mundo}">Borrar</button></p><img class="capGrande" src="${urlCaptura(c)}" alt=""><p class="nota">${esc(nombreM(c.mundo))} · ${metrosTx(c.m)} · ${new Date(c.h).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}</p>`; }
  if (!capturas.mundo || !L.some((c) => c.mundo === capturas.mundo)) {
    const por = new Map(); for (const c of L) { if (!por.has(c.mundo)) por.set(c.mundo, []); por.get(c.mundo).push(c); }
    return `<p class="nota">${L.length} ${L.length === 1 ? 'captura' : 'capturas'} en ${por.size} ${por.size === 1 ? 'mundo' : 'mundos'}. Se guardan en tu cuenta y se ven desde cualquier equipo.</p><div class="carpetas">` + [...por.entries()].map(([id, l]) => `<button class="carpeta" data-a="capMundo" data-v="${id}"><img src="${urlCaptura(l[0])}" alt="" loading="lazy"><b>${esc(nombreM(id))}</b><small>${l.length} ${l.length === 1 ? 'captura' : 'capturas'}${id === mundoId ? ' · este mundo' : ''}</small></button>`).join('') + '</div>';
  }
  const l = L.filter((c) => c.mundo === capturas.mundo);
  return `<p><button class="s" data-a="capMundo" data-v="">← Todos los mundos</button> &nbsp;<b>${esc(nombreM(capturas.mundo))}</b> · ${l.length} ${l.length === 1 ? 'captura' : 'capturas'}</p><div class="galeria">` + l.map((c) => `<button class="cap" data-a="capVer" data-v="${c.id}"><img src="${urlCaptura(c)}" alt="" loading="lazy"><small>${metrosTx(c.m)} · ${new Date(c.h).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</small></button>`).join('') + '</div>';
}
$('#bFoto').addEventListener('click', (e) => { audio(); e.currentTarget.blur(); tomarFoto(); });

/* ════════ La Pinturería ════════ RLR */
// Mina se juega completo gratis; aquí solo se vende cómo se ve la maquinita (docs/ADN_Monetizacion_Mina). Los precios vienen
// del servidor y son iguales para todos; probarse todo es gratis; subir de nivel cuesta la diferencia. Las listas de abajo son
// copia de src/tienda.js: el servidor valida, esto solo dibuja.
const TC = { COLORES: ['#ffd23f', '#ff6b5a', '#6ec3ff', '#6fdc7a', '#c05cff', '#ff9f40', '#f3e6d8', '#ff7ac8', '#ffffff', '#1b1b1b', '#e0483a', '#2f8a3a', '#2a6fa8', '#7426a8', '#b05e12', '#9a8774', '#00c2a8', '#f5e663', '#ff3d7f', '#3d5afe', '#8bc34a', '#795548', '#607d8b', '#c0a16b'], CALCAS: ['⭐', '❤️', '⚡', '🔥', '🌈', '🌙', '☀️', '🌵', '🌸', '🍀', '🍉', '🌶️', '🦅', '🐺', '🦂', '🐢', '🐝', '🦋', '🐉', '🦈', '⚓', '🎸', '🎵', '🎲', '⚽', '🏀', '🏁', '🚀', '💎', '👑', '💀', '🤖', '👾', '🎯', '🧭', '⛏️', '🔱', '✝️', '☮️', '♾️', '🇲🇽', '🏳️‍🌈', '🍕', '🌮', '🥑', '🐾', '🧿', '✨'], LUCES: ['#fff3b0', '#ff4d4d', '#4dff88', '#4da6ff', '#ff4df2', '#ffd23f', '#ffffff', '#9d4dff'], ESTELAS: ['Ninguna', 'Chispas doradas', 'Arcoíris', 'Estrellas', 'Corazones', 'Burbujas'], BOCINAS: ['Pip-pip', 'Mariachi', 'Tren', 'Barco', 'Risa', 'Campanitas'], PLACAS: ['Normal', 'Dorada', 'Con corona', 'Con marco'], CARROS: ['De fábrica', 'El Escarabajo', 'La Locomotora', 'El Submarino'], MASCOTAS: ['Ninguna', 'Pájaro', 'Perro', 'Dron', 'Mariposa', 'Luciérnaga'], MASC_EMOJI: ['', '🐦', '🐕', '🛸', '🦋', ''] };
const NIVEL_CLAVE = { c1: 1, c2: 2, c3: 2, calca: 3, luz: 4, estela: 5, bocina: 6, placa: 6, carro: 7, mascota: 8 };
let miPinta = {}, miMe = 0, miDe = -1, edenPiedras = [], tiendaAnimT = 0, tBocina = 0, estelaN = 0;
let tienda = { niveles: [], mio: { nivel: 0, mecenas: 0, pinta: {} }, fondo: 0, pagos: 0, cargada: 0, cargando: 0, nivelVista: 0, prueba: null, regaloA: -1, mecenasMonto: 99, fondoN: 3, mecenasMin: 99, gratitudMin: 33, gratitudHora: '15:33', fondoPrecio: 19, tope: 5000, error: '', momento: null, cumple: '', gratitud: 0, gracias: 0 };
// El ánimo con el que estás jugando, para el momento del precio: cuánto cavaste en los últimos tres minutos y cuántos golpes
// fuertes (explosiones, pleitos) en los últimos diez. 0 = tranquilo … 1 = a tope. Solo sirve para bajar el precio y para el tono.
const ritmo = [], ritmoFuerte = [];
function animoReciente() { const a = Date.now(); while (ritmo.length && a - ritmo[0] > 180000) ritmo.shift(); while (ritmoFuerte.length && a - ritmoFuerte[0] > 600000) ritmoFuerte.shift(); return Math.min(1, ritmo.length / 150 + ritmoFuerte.length * 0.25); }
// La hora de Torreón, en el navegador: para la tarjeta de las 3:33 y para decir «hoy» igual que el servidor.
function horaTorreon() { const p = {}; for (const x of new Intl.DateTimeFormat('en-US', { timeZone: 'America/Monterrey', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date())) p[x.type] = x.value; return { y: +p.year, mes: +p.month, dia: +p.day, h: +p.hour % 24, min: +p.minute, md: p.month + '-' + p.day }; }
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const cumpleTexto = (md) => md ? +md.slice(3) + ' de ' + MESES[+md.slice(0, 2) - 1] : '';
// Cuántos días faltan (−) o pasaron (+) de su cumpleaños, si anda a tres días; 9 si no.
function cumpleCerca(md) { if (!md) return 9; const t = horaTorreon(), hoy = Date.UTC(t.y, +t.md.slice(0, 2) - 1, +t.md.slice(3)), c = Date.UTC(t.y, +md.slice(0, 2) - 1, +md.slice(3)), d = Math.round((hoy - c) / 86400000); return Math.abs(d) <= 3 ? d : Math.abs(d - 365) <= 3 ? d - 365 : Math.abs(d + 365) <= 3 ? d + 365 : 9; }
const pintaDe = (i) => (i === miI ? miPinta : (otros.get(i)?.p || null));
const pintaVista = () => (menu === 'pin' && tienda.prueba ? tienda.prueba : miPinta);
const nivelMio = () => tienda.mio.nivel | 0;
const pesos = (n) => '$' + Math.round(n).toLocaleString('es-MX');
const precioBonito = (x) => Math.max(1, x < 100 ? Math.round(x) : x < 1000 ? Math.round(x / 5) * 5 : Math.round(x / 10) * 10);      // igual que en el servidor
async function cargarTienda() {
  tienda.cargando = 1;
  try {
    const r = await fetch('/api/tienda', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ k: miK, animo: animoReciente() }) }), d = await r.json();
    if (!d.niveles) throw 0;
    tienda = { ...tienda, ...d, cargada: 1, error: '' }; miPinta = d.mio.pinta || {}; miMe = d.mio.mecenas > 0 ? 1 : 0;
  } catch { tienda.error = 'No se pudo abrir la tienda. Revisa tu conexión e inténtalo otra vez.'; }
  tienda.cargando = 0;
  if (menu === 'pin') pintarMenu();
}
// La carpeta en la que abre: la del nivel que ya es tuyo; si no tienes ninguno, la del rango que elegiste.
function nivelPorRango() { if (nivelMio()) return nivelMio(); let n = 1; for (const x of tienda.niveles) if (x.precio <= (op.rango || 0)) n = x.n; return n; }
function htmlTienda() {
  const L = tienda.niveles, mio = nivelMio();
  let h = cab('🎨 La Pinturería') + '<div class="cuerpo tienda">';
  h += '<div class="promesa"><b>Mina se juega completo gratis.</b> Nada de aquí hace falta para bajar, ganar ni terminar. Esto es solo para que tu maquinita se vea como tú. Pruébate lo que quieras: probar no cuesta.</div>';
  if (tienda.error) h += `<p class="nota">${tienda.error}</p>`;
  if (!tienda.cargada) return h + '<p class="nota">Abriendo la tienda…</p></div>';
  if (op.rango === undefined) h += `<h4>¿Qué rango te acomoda?</h4><p class="nota">Solo para abrir la tienda en tu carpeta. Lo cambias cuando quieras, y los precios son los mismos para todos.</p><div class="chips">${[[0, 'Solo mirar 👀'], [79, 'Hasta $79'], [599, 'Hasta $599'], [1999, 'Hasta $1,999'], [99999, 'El que haga falta']].map(([v, t]) => `<button class="s" data-a="tRango" data-v="${v}">${t}</button>`).join('')}</div>`;
  const nv = tienda.nivelVista || nivelPorRango(); tienda.nivelVista = nv; const N = L[nv - 1], tuyo = nv <= mio;
  h += `<div class="escalera">${L.map((x) => `<button data-a="tNivel" data-v="${x.n}" class="${x.n === nv ? 'on' : ''}${x.n <= mio ? ' mio' : ''}" title="${esc(x.nombre)}"><b>${x.n}</b><small>${pesos(x.precio)}</small></button>`).join('')}</div>`;
  h += `<div class="carpeta"><div><div class="vista"><canvas id="pintaMaq" width="420" height="340"></canvas><small>${esc(miNombre)}</small></div>${tuyo ? '<p class="nota">Lo que cambies aquí se guarda al momento y lo ven todos.</p>' : '<p class="nota">Lo que cambies aquí se ve, pero no se guarda hasta que el nivel sea tuyo.</p>'}</div><div>`;
  h += `<h4>Nivel ${N.n} · ${esc(N.nombre)} · ${pesos(N.precio)}${tuyo ? ' · <span style="color:var(--ok)">tuyo</span>' : ''}</h4><p class="nota">${esc(N.que)}${N.n > 1 ? ' Incluye todo lo de los niveles anteriores.' : ''}</p>`;
  h += editorNivel(nv) + (tuyo ? '' : htmlPago(nv)) + '</div></div>';
  const cerca = cumpleCerca(tienda.cumple), hoyCumple = cerca === 0, gracias = tienda.gracias || cerca !== 9;
  if (gracias) h += `<div class="aparte gracias"><h4>🎂 ${hoyCumple ? '¡Feliz cumpleaños!' : 'Gracias de cumpleaños'}</h4><p class="nota">${hoyCumple ? 'Hoy tu maquinita trae gorrito de fiesta. ' : ''}Si Mina te ha dado buenos ratos, estos días puedes darle las gracias a quien lo hace: lo que tú quieras, desde ${pesos(tienda.gratitudMin)}. No cambia nada en el juego y no hace ninguna falta. Es solo gratitud, y llega a quien hace Mina, en CapitalTorreon.${tienda.gratitud ? ' Ya diste las gracias. De corazón.' : ''}</p>
    <div class="chips">${[33, 99, 333, 999].map((v) => `<button class="s${tienda.mecenasMonto === v ? ' on' : ''}" data-a="tGracias" data-v="${v}">${pesos(v)}</button>`).join('')}</div>
    <div class="fila"><div class="t"><label class="op"><span>O la cantidad que quieras (pesos)</span><input id="tGra" type="number" min="${tienda.gratitudMin}" step="1" value="${Math.max(tienda.gratitudMin, tienda.mecenasMonto)}" inputmode="numeric"></label></div><button class="s" data-a="tGraciasDar">🎂 Dar las gracias</button></div></div>`;
  h += `<div class="aparte"><h4>✦ Mecenas</h4><p class="nota">Lo que quieras dar, desde ${pesos(tienda.mecenasMin)}. No da nada más que un ✦ junto a tu nombre y nuestras gracias: es para quien quiere que Mina siga existiendo.${tienda.mio.mecenas ? ` Ya diste ${pesos(tienda.mio.mecenas)}. Gracias.` : ''}</p>
    <div class="fila"><div class="t"><label class="op"><span>Cantidad (pesos)</span><input id="tMec" type="number" min="${tienda.mecenasMin}" step="1" value="${tienda.mecenasMonto}" inputmode="numeric"></label></div><button class="s" data-a="tMecenas">✦ Dar</button></div>
    <h4>🎁 Fondo común</h4><p class="nota">Paga la primera pintura (${pesos(tienda.fondoPrecio)}) de las siguientes maquinitas nuevas que lleguen a Mina. Quien llega la recibe con un «alguien pagó tu primera pintura: hay para todos».${tienda.fondo ? ` Ahora mismo hay <b>${tienda.fondo}</b> esperando.` : ''}</p>
    <div class="fila"><div class="t"><label class="op"><span>Maquinitas</span><input id="tFondo" type="number" min="1" max="200" step="1" value="${tienda.fondoN}" inputmode="numeric"></label></div><button class="s" data-a="tFondo">🎁 Pagar adelante</button></div>
    <h4>🎂 Tu cumpleaños</h4><p class="nota">${tienda.cumple ? `Lo tenemos: <b>${cumpleTexto(tienda.cumple)}</b>. Ese día tu maquinita trae gorrito de fiesta y el precio de la tienda baja 15 %${cuenta ? ', y a las 3:33 de la tarde (hora de Torreón) te llega un correo para dar las gracias, si quieres' : ''}.` : `Día y mes, nada más. Ese día tu maquinita trae gorrito de fiesta, la tienda baja 15 %${cuenta ? ', y a las 3:33 de la tarde (hora de Torreón) te llega un correo cortito' : ''}. Lo quitas cuando quieras.`}</p>
    <div class="fila"><div class="t" style="display:flex;gap:6px;flex-wrap:wrap"><select id="tCumD">${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}" ${tienda.cumple && +tienda.cumple.slice(3) === i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}</select><select id="tCumM">${MESES.map((m, i) => `<option value="${i + 1}" ${tienda.cumple && +tienda.cumple.slice(0, 2) === i + 1 ? 'selected' : ''}>${m}</option>`).join('')}</select></div><button class="s" data-a="tCumple">${tienda.cumple ? 'Cambiar' : 'Guardar'}</button>${tienda.cumple ? '<button class="s" data-a="tCumpleQuitar">Quitar</button>' : ''}</div>
    <h4>Cómo se sostiene Mina</h4><p class="nota">Sin anuncios, sin cajas sorpresa, sin prisas inventadas, sin ventajas compradas. Mismo precio para todos; subir de nivel cuesta solo la diferencia; tope de ${pesos(tienda.tope)} por maquinita cada 30 días; devoluciones sin preguntas durante 15 días (contacto@ingenieriadigital.mx). Si un día esto deja de ser cierto, está mal y se quita. <a href="#" data-a="tManifiesto">Leer el manifiesto</a>.</p></div>`;
  return h + '</div>';
}
function htmlPago(nv) {
  const L = tienda.niveles, mio = nivelMio(), precio = L[nv - 1].precio - (mio ? L[mio - 1].precio : 0), vivos = [...otros.values()].filter((o) => o.on);
  const o = tienda.oferta, M = tienda.momento, propio = tienda.regaloA < 0, desc = o && o.desc > 0 && propio ? o.desc : 0, ajuste = M && propio ? M.ajuste : 0;
  const tuPrecio = Math.min(precio, Math.max(1, precioBonito(precio * (1 - desc) * (1 - ajuste)))), menos = Math.round((1 - tuPrecio / precio) * 100);
  let h = `<div class="pago"><p class="grande">${pesos(tuPrecio)} <small style="font-size:.5em;color:var(--su)">pesos${mio ? ' · solo la diferencia desde tu nivel ' + mio : ''}</small></p>`;
  if (tuPrecio < precio) {
    const partes = (M && propio ? M.partes : []).map(([n, f]) => `${esc(n)} −${Math.round(f * 100)} %`);
    h += `<p class="nota"><s>${pesos(precio)} de lista</s> · <b style="display:inline;color:var(--ok)">${menos} % menos, tu precio</b>` +
      (desc ? ` · ${Math.round(desc * 100)} % por cómo juegas, vale hasta el ${new Date(o.hasta).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}` : '') +
      (partes.length ? ` · hoy: ${partes.join(', ')}` : '') + `. El precio se mueve con la hora del día (hora de Torreón) y solo baja: nunca más que la lista.</p>`;
  }
  if (M && propio && M.madrugada) h += '<p class="nota">🌙 Es de madrugada en Torreón. No hay prisa: tu precio te espera igual mañana, y si compras hoy tienes 15 días para cambiar de idea.</p>';
  else if (M && propio && M.animo === 'a tope') h += '<p class="nota">⛏️ Vas a tope. Sigue en lo tuyo: esto te espera aquí, con calma.</p>';
  if (!tienda.pagos) return h + '<p class="nota">Los pagos se abren en unos días. Mientras, pruébatelo todo.</p></div>';
  if (vivos.length) h += `<label class="op"><span>¿Es un regalo?</span><select data-a="tPara">${[[-1, 'No, es para mí']].concat(vivos.map((o) => [o.i, 'Para ' + o.n])).map(([v, t]) => `<option value="${v}" ${v === tienda.regaloA ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>${tienda.regaloA >= 0 ? '<p class="nota">Si quien lo recibe ya tiene un nivel, se cobra solo la diferencia.</p>' : ''}`;
  if (!cuenta) h += '<p class="nota">Para comprar hay que entrar con tu cuenta: así lo comprado se queda contigo en cualquier equipo.</p><div class="fila"><div class="t"></div><button data-a="tEntrar">Entrar con Google</button></div>';
  else h += `<label class="op"><span>Soy mayor de edad, o tengo permiso de quien paga</span><input type="checkbox" id="tMayor"></label><div class="fila"><div class="t"><small>Pago seguro con tarjeta, en la página de Stripe. El comprobante te llega por correo.</small></div><button data-a="tPagar" data-v="${nv}">Pagar ${pesos(tuPrecio)}</button></div>`;
  return h + '</div>';
}
function editorNivel(nv) {
  const P = pintaVista();
  const sw = (k, lista, actual, nada) => `<div class="muestras">${lista.map((c) => `<button class="sw${actual === c ? ' on' : ''}" style="background:${c}" data-a="tPon" data-k="${k}" data-v="${c}" title="${c}"></button>`).join('')}<button class="s" data-a="tPon" data-k="${k}" data-v="">${nada}</button></div>`;
  const ops = (k, lista, actual) => `<div class="ops">${lista.map((n, i) => `<button class="${(actual | 0) === i ? 'on' : ''}" data-a="tPon" data-k="${k}" data-v="${i}">${n}</button>`).join('')}</div>`;
  switch (nv) {
    case 1: return '<h4>Color del cuerpo</h4>' + sw('c1', TC.COLORES, P.c1, 'El de fábrica');
    case 2: return '<h4>Color de la cabina</h4>' + sw('c2', TC.COLORES, P.c2, 'El de fábrica') + '<h4>Color de las orugas</h4>' + sw('c3', TC.COLORES, P.c3, 'El de fábrica');
    case 3: return `<h4>Calcomanía</h4><div class="muestras calcas">${TC.CALCAS.map((e, i) => `<button class="${P.calca === i ? 'on' : ''}" data-a="tPon" data-k="calca" data-v="${i}">${e}</button>`).join('')}<button class="s" data-a="tPon" data-k="calca" data-v="">Ninguna</button></div>`;
    case 4: return '<h4>Luz del faro y luz de piso</h4>' + sw('luz', TC.LUCES, P.luz, 'Sin luz') + '<p class="nota">Se nota de verdad bajo tierra, en lo oscuro.</p>';
    case 5: return '<h4>Estela al volar</h4>' + ops('estela', TC.ESTELAS, P.estela);
    case 6: return '<h4>Claxon (tecla B)</h4>' + ops('bocina', TC.BOCINAS, P.bocina) + '<p><button class="s" data-a="tProbarBocina">🔊 Oír el claxon</button></p><h4>Placa con tu nombre</h4>' + ops('placa', TC.PLACAS, P.placa);
    case 7: return '<h4>Carrocería</h4>' + ops('carro', TC.CARROS, P.carro);
    case 8: return '<h4>Mascota</h4>' + ops('mascota', TC.MASCOTAS, P.mascota) + '<p class="nota">Te sigue a todos lados. No hace nada más que acompañarte.</p>';
    case 9: return '<p>Tu nombre queda grabado en una piedra del Jardín del Fondo, en cada mundo que termines con esta maquinita. Lo ve todo el que llegue al fondo, para siempre.</p>' + (nv <= nivelMio() ? '<p class="nota">Ya es tuyo: en el próximo mundo que termines, ahí estará tu piedra.</p>' : '');
    case 10: return '<p>Una maquinita diseñada contigo, a mano: una conversación, bocetos, y se dibuja en el juego solo para ti. Única en el mundo. Dos o tres semanas.</p>' + (nv <= nivelMio() ? '<p class="nota"><b>Ya es tuya.</b> Escríbenos a <a href="mailto:contacto@ingenieriadigital.mx?subject=Mi%20maquinita%20hecha%20a%20mano">contacto@ingenieriadigital.mx</a> con el nombre de tu maquinita y empezamos.</p>' : '');
  }
  return '';
}
// Cambiar algo: si el nivel es tuyo se guarda y lo ven todos; si no, solo se prueba en la vista.
function ponerPinta(k, v) {
  const num = ['calca', 'estela', 'bocina', 'placa', 'carro', 'mascota'].includes(k), val = v === '' ? undefined : num ? +v : v;
  if (NIVEL_CLAVE[k] <= nivelMio()) {
    const p = { ...(tienda.prueba || miPinta) }; if (val === undefined) delete p[k]; else p[k] = val;
    for (const c of Object.keys(p)) if (NIVEL_CLAVE[c] > nivelMio()) delete p[c];      // lo que se estaba probando y no es tuyo se queda fuera
    miPinta = p; tienda.prueba = null; if (conectado) enviar({ t: 'pinta', p }); son.clic();
  } else { const p = { ...(tienda.prueba || miPinta) }; if (val === undefined) delete p[k]; else p[k] = val; tienda.prueba = p; }
}
async function ponerCumple(md) {
  try {
    const r = await fetch('/api/tienda/cumple', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ k: miK, md, ses: cuenta ? cuenta.ses : '', mundo: mundoId }) }), d = await r.json();
    if (!d.ok) throw 0;
    tienda.cumple = d.cumple; if (d.p) { miPinta = d.p; if (conectado) enviar({ t: 'pinta', p: miPinta }); } son.clic();
    tarjeta(md ? '🎂 Guardado' : 'Cumpleaños quitado', md ? `El ${cumpleTexto(md)} tu maquinita trae gorrito de fiesta${d.correo ? ' y te llega un correo a las 3:33 de la tarde, hora de Torreón' : ''}.` : 'Ya no guardamos tu fecha.', 'msj', 7000);
    if (menu === 'pin') { tienda.cargada = 0; await cargarTienda(); }
  } catch { tarjeta('La Pinturería', 'No se pudo guardar tu cumpleaños. Inténtalo otra vez.', 'msj', 6000); }
}
function irAlLogin(extra) { if (listo && !soloVer) { enviarEst(); guardarCopia(); } location.href = LOGIN_CT + '/?volver=' + encodeURIComponent(location.origin + '/' + mundoId + (extra || '')); }
async function pagar(o) {
  if (o.tipo === 'nivel' && !$('#tMayor')?.checked) { aviso('Marca primero que eres mayor de edad o tienes permiso de quien paga.'); return; }
  if (!cuenta) return irAlLogin('?tienda=' + tienda.nivelVista);
  if (o.tipo !== 'nivel' && !confirm(`Vas a ${o.motivo === 'gratitud' ? 'dar las gracias con' : 'pagar'} ${pesos(o.tipo === 'mecenas' ? o.monto : o.cantidad * tienda.fondoPrecio)} con tarjeta, en la página de Stripe. ¿Eres mayor de edad o tienes permiso de quien paga?`)) return;
  if (listo && !soloVer) { enviarEst(); guardarCopia(); }
  try {
    const r = await fetch('/api/tienda/pagar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ses: cuenta.ses, k: miK, mundo: mundoId, volver: location.origin + '/' + mundoId, animo: animoReciente(), ...o }) }), d = await r.json();
    if (d.url) { location.href = d.url; return; }
    const msj = { pronto: 'Los pagos se abren en unos días. Mientras, pruébatelo todo.', cuenta: 'Tu sesión venció: vuelve a entrar con Google.', tope: `Este mes ya diste mucho (${pesos(d.gastado || 0)}). Gracias de corazón; vuelve el mes que entra.`, ya: 'Ese nivel ya es de esa maquinita.', regalo: 'No encontré a quién regalárselo: tiene que estar jugando en este mundo.', stripe: 'La página de pago no contestó. Inténtalo otra vez.' }[d.error] || 'No se pudo abrir el pago.';
    tarjeta('La Pinturería', msj, 'msj', 9000);
    if (d.error === 'cuenta') { cuenta = null; try { localStorage.removeItem('mina_cuenta'); } catch {} pintarMenu(); }
  } catch { tarjeta('La Pinturería', 'Se fue la conexión. Inténtalo otra vez.', 'msj', 6000); }
}
// Al volver de pagar: el mundo le pregunta a Stripe y, si se pagó, entrega. Una sola vez por sesión de pago.
async function confirmarCompra(sid) {
  try {
    const r = await fetch('/api/tienda/confirmar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sid }) }), d = await r.json();
    if (!d.ok) { tarjeta('La Pinturería', d.error === 'nopagado' ? 'El pago no se completó; no se cobró nada.' : 'No pude confirmar el pago. Si ya te cobraron, escríbenos a contacto@ingenieriadigital.mx y lo arreglamos en el momento.', 'msj', 14000); return; }
    tienda.mio = d.mio; miMe = d.mio.mecenas > 0 ? 1 : 0; son.logro();
    if (d.tipo === 'nivel' && !d.regalo) { tienda.nivelVista = d.nivel; tienda.prueba = null; tarjeta('🎨 ¡Listo! El nivel ' + d.nivel + ' es tuyo', 'Gracias. Deja tu maquinita como tú quieras: se abre La Pinturería.', 'msj', 12000); setTimeout(() => { if (listo && !menu) abrir('pin'); }, 1400); }
    else if (d.tipo === 'nivel') tarjeta('🎁 Regalo entregado', 'El nivel ' + d.nivel + ' ya es de esa maquinita. Qué bonito gesto.', 'msj', 10000);
    else if (d.tipo === 'mecenas' && d.motivo === 'gratitud') { tienda.gratitud = Date.now(); tarjeta('🎂 Gracias a ti', 'Qué bonito gesto en tu cumpleaños. Que Mina te siga dando buenos ratos. Ya tienes tu ✦ junto al nombre.', 'msj', 12000); }
    else if (d.tipo === 'mecenas') tarjeta('✦ Gracias, mecenas', 'Con esto Mina sigue existiendo. Ya tienes tu ✦ junto al nombre.', 'msj', 10000);
    else tarjeta('🎁 Pagaste adelante', 'Las siguientes ' + d.cantidad + ' maquinitas nuevas llegan con su primera pintura. Hay para todos.', 'msj', 10000);
  } catch { tarjeta('La Pinturería', 'No pude confirmar el pago: no hay conexión. Vuelve a abrir esta misma liga más tarde y se confirma solo.', 'msj', 12000); }
}
// Al volver de pagar o de entrar con la cuenta: ?compra=<sesión de Stripe> y ?tienda=<nivel> (se leen antes de limpiar la liga).
const compraPend = (location.search.match(/[?&]compra=(cs_[A-Za-z0-9_]{10,200})/) || [])[1] || '', graciasPend = /[?&]gracias=cumple/.test(location.search) ? 1 : 0, tiendaPend = +(location.search.match(/[?&]tienda=(\d{1,2})/) || [])[1] || (graciasPend ? 1 : 0);
let compraHecha = 0, tiendaAbierta = 0;
if (graciasPend) tienda.gracias = 1;
if (compraPend || tiendaPend || graciasPend) history.replaceState(null, '', location.pathname);
function pendientesTienda() {
  if (!listo || soloVer || !conectado) return;
  if (compraPend && !compraHecha) { compraHecha = 1; confirmarCompra(compraPend); }
  if (tiendaPend && !tiendaAbierta && !menu) { tiendaAbierta = 1; tienda.nivelVista = tiendaPend; abrir('pin'); if (graciasPend) setTimeout(() => $('.gracias')?.scrollIntoView({ behavior: 'smooth' }), 700); }
}
// El día de tu cumpleaños: la felicitación al entrar y, a las 3:33 de la tarde (hora de Torreón), la invitación a dar las gracias. Una vez cada una, al año.
function diaDeCumple() {
  if (!S || !listo || soloVer || !miPinta.cu || compraPend) return;
  const t = horaTorreon(), y = String(t.y);
  if (leer('mina_cumple_hola', '') !== y) { escribir('mina_cumple_hola', y); son.logro(); tarjeta('🎂 ¡Feliz cumpleaños, ' + miNombre + '!', 'Hoy tu maquinita trae gorrito de fiesta, y La Pinturería te baja 15 % todo el día. Que sea un gran día.', 'msj', 12000); }
  if ((t.h > 15 || (t.h === 15 && t.min >= 33)) && leer('mina_cumple_gracias', '') !== y && !menu) {
    escribir('mina_cumple_gracias', y);
    tarjeta('🎂 Son las 3:33 en Torreón', 'Si Mina te ha dado buenos ratos, hoy es buen día para darle las gracias a quien lo hace. Lo que tú quieras, desde $33. Nada obligatorio.', 'msj', 20000, false, { t: 'Sí, quiero dar las gracias', f: () => { tienda.gracias = 1; tienda.mecenasMonto = 33; abrir('pin'); setTimeout(() => $('.gracias')?.scrollIntoView({ behavior: 'smooth' }), 700); } });
  }
}
// Tres invitaciones en la vida de una maquinita (20 min, 3 h y 10 h de juego), solo en la superficie y con calma, y ninguna
// si ya abrió la tienda. La camioneta en la superficie es la invitación permanente y callada.
function invitarPintureria() {
  if (!S || !listo || soloVer || menu || op.tiendaVista || compraPend || tiendaPend || yo.y > 2 || !yo.suelo) return;
  const n = op.tiendaInv | 0;
  if (n >= 3 || (S.seg || 0) < [1200, 10800, 36000][n] || Date.now() - (op.tiendaInvT || 0) < 7 * 86400000) return;
  op.tiendaInv = n + 1; op.tiendaInvT = Date.now(); escribir('mina_op', op);
  tarjeta('🎨 Tu maquinita se puede pintar', 'En La Pinturería (la camioneta rosa, a la izquierda de la Gasolinera) o en Menú → Mundo. Nada de eso hace falta para jugar: es solo para que se vea como tú.', 'msj', 12000);
}
// La estela: una chispita por cuadro (de dos) detrás de quien vuela con estela.
function estela(P, x, y, mueve) {
  if (!P || !P.estela || !mueve || !op.part || (++estelaN & 1) || huellas.length > 240) return;
  const tipo = P.estela, az = (a) => (Math.random() - 0.5) * a;
  huellas.push({ x: x + az(0.5), y: y + 0.3 + az(0.3), vx: az(0.6), vy: tipo === 5 ? -0.9 - Math.random() * 0.6 : 0.3 + az(0.5), t0: 0, t: 0, rot: Math.random() * 6.3, giro: az(5), r: tipo === 2 ? 0.1 : 0.09 + Math.random() * 0.07, tipo, col: `hsl(${(reloj * 240) % 360},95%,62%)` });
  const e = huellas[huellas.length - 1]; e.t0 = e.t = tipo === 5 ? 1.6 : 0.9 + Math.random() * 0.5;
}
// El claxon (tecla B): todos tienen el pip-pip; con el nivel 6 se elige la melodía. Lo oyen los de cerca.
const CLAXON = [[[880, 0.08, 0], [880, 0.08, 0.14]], [[523, 0.12, 0], [659, 0.12, 0.12], [784, 0.12, 0.24], [1047, 0.3, 0.36]], [[220, 0.6, 0], [277, 0.6, 0], [330, 0.6, 0]], [[98, 1.1, 0], [123, 1.1, 0]], [[784, 0.09, 0], [659, 0.09, 0.1], [523, 0.09, 0.2], [440, 0.14, 0.3], [784, 0.09, 0.5], [659, 0.09, 0.6], [523, 0.09, 0.7], [440, 0.14, 0.8]], [[1319, 0.5, 0], [1568, 0.5, 0.15], [2093, 0.8, 0.3]]];
function claxon(b, vol = 1, bus = 'avisos') { for (const [f, d, c] of CLAXON[b] || CLAXON[0]) { if (b === 5) campana(f, d, 0.08 * vol, bus, c); else tono(f, d, b === 2 || b === 3 ? 'sawtooth' : 'square', (b === 3 ? 0.12 : 0.07) * vol, 0, c, bus); } }
function tocarClaxon() { const t = performance.now(); if (t - tBocina < 900 || !listo || soloVer) return; tBocina = t; const b = nivelMio() >= 6 ? (miPinta.bocina | 0) : 0; claxon(b); if (conectado) enviar({ t: 'bocina', b }); }

/* ════════ Manifiesto ════════ RLR */
// La carta de quien hizo el juego. Su nombre lleva a ricardolopezreyero.com, pero se ve igual que el resto del texto.
const MANIFIESTO = `<article class="manifiesto">
  <h3>Manifiesto</h3>
  <p>Este juego está hecho con todo el cariño con el que se puede hacer un juego.</p>
  <p>Nació de <i>Motherload</i>, un juego que jugué de niño durante decenas de horas. Todavía me acuerdo de lo que disfrutaba y de lo que no. Me quedé con lo bueno, lo multipliqué, y le di al juego mucho más sentido y una historia que contar.</p>
  <p>Aquí no se excava solo: se baja con amigos, en el mismo mundo y al mismo tiempo. Cada lugar guarda algo, cada metro tiene su razón de ser, y hasta el fondo, debajo de todo, hay algo esperándote.</p>
  <p>Ojalá sea un regalo para ti. Disfrútalo sin prisa, y si te gusta, compártelo con alguien que quieras: se disfruta más acompañado.</p>
  <p>Y si llegas al final, que te deje un buen mensaje y un buen sabor de boca.</p>
  <h3>Cómo se sostiene Mina</h3>
  <p>Mina se juega completo gratis, para siempre. Lo único que se vende es cómo se ve tu maquinita, en La Pinturería: colores, calcomanías, luces, una estela, un claxon, una mascota, tu nombre en una piedra del Jardín. Nada de eso te hace bajar más rápido ni ganar más. Sin anuncios, sin cajas sorpresa, sin prisas inventadas. Mismo precio para todos, y subir de nivel cuesta solo la diferencia. Si un día esto deja de ser cierto, está mal y se quita.</p>
  <p class="firma">Con mucho cariño,<br><b>Ing. <a href="https://ricardolopezreyero.com" target="_blank" rel="noopener">Ricardo López Reyero</a></b><br><small>Torreón, Coahuila, México · 2 de octubre de 2026 · 8:12 p. m. · 21 °C</small></p>
</article>`;

/* ════════ La tabla mundial ════════ RLR */
// Las veinte maquinitas que más han ganado, en todos los mundos. Con la tabla abierta se pregunta cada 4 s y los números
// ruedan hasta su nuevo valor; jugando, cada minuto, para saber en qué lugar vas.
const tablaM = { l: [], corte: 0, t: 0, pedido: 0, lugar: 0, antes: new Map() };
const topAbierta = () => menu === 'top' || (menu === 'menu' && pestana === 10);
async function pedirTop() {
  tablaM.pedido = Date.now();
  try {
    const d = await (await fetch('/api/tabla', { cache: 'no-store' })).json(); if (!Array.isArray(d.top)) return;
    const lugar = miPid ? d.top.findIndex((e) => e.p === miPid) + 1 : 0, antes = leer('mina_lugar', 0);
    if (!soloVer && lugar && (!antes || lugar < antes)) { son.rango(); tarjeta('🏆 Lugar ' + lugar + ' del mundo', (antes ? 'Subiste del ' + antes + ' al ' + lugar : 'Entraste al Top 33') + ' entre todas las maquinitas de Mina. Menú → Top 33.', 'msj', 12000, true); }
    if (!soloVer && miPid && lugar !== antes) escribir('mina_lugar', lugar);
    tablaM.l = d.top; tablaM.corte = d.corte || 0; tablaM.t = Date.now(); tablaM.lugar = lugar;
    if (topAbierta()) pintarMenu();
    if (!soloVer) pintarTabla();
  } catch {}
}
function htmlTop() {
  let h = '<p class="nota">Las 33 maquinitas que más dinero han ganado, entre todos los mundos de Mina, y el tiempo que cada una lleva jugando. Se mueve en vivo: si alguien está jugando, ves cómo suben su cuenta y su reloj, y puedes ir a verla jugar.</p>';
  if (!tablaM.t) return h + '<p class="nota">Cargando la tabla…</p>';
  h += tablaM.l.map((e, k) => `<div class="fila top${e.p === miPid ? ' yo' : ''}"><div class="lug">${k < 3 ? ['🥇', '🥈', '🥉'][k] : k + 1}</div><canvas width="72" height="72" data-mo="${e.m | 0}"></canvas>
    <div class="t"><b>${esc(e.n)}${e.p === miPid ? ' (tú)' : ''}</b><small>${e.vivo ? '<span class="vivo">● jugando ahora</span>' : 'descansando'}</small></div>
    <div class="tv"><span class="v" data-p="${e.p}" data-tot="${e.tot}">${dineroLargo(tablaM.antes.get(e.p) ?? e.tot)}</span>${e.seg || e.vivo ? `<small class="tt" data-seg="${Math.floor(e.seg || 0)}" data-vivo="${e.vivo ? 1 : 0}">⏱ ${tiempoLargo(e.seg)}</small>` : ''}</div>
    ${e.vivo && e.ver && e.p !== miPid ? `<a class="boton s" href="/ver/${e.ver}?j=${e.i | 0}" ${soloVer ? '' : 'target="_blank" rel="noopener"'}>👁 Ver</a><a class="boton" href="/ver/${e.ver}?j=${e.i | 0}&pedir=1" ${soloVer ? '' : 'target="_blank" rel="noopener"'} title="Entras mirando de inmediato y le avisamos a quien creó ese mundo que quieres jugar">🙋 Jugar</a>` : ''}</div>`).join('') || '<p class="nota">Todavía no hay nadie. La primera venta abre la tabla.</p>';
  if (!soloVer && S && miPid && !tablaM.lugar) h += `<p class="nota" style="margin-top:10px">Tú llevas <b>${dineroLargo(S.tot)}</b>. ${tablaM.l.length >= 33 ? 'Te faltan ' + dineroLargo(Math.max(1, tablaM.corte - S.tot + 1)) + ' para entrar a la tabla.' : 'Vende una carga y apareces aquí.'}</p>`;
  return h;
}
// Después de pintar la tabla: las maquinitas en chiquito y los números que cambiaron, rodando hasta su nuevo valor.
function animarTop(c) {
  c.querySelectorAll('canvas[data-mo]').forEach((x) => dibMaq(x.getContext('2d'), 36, 39, 62, +x.dataset.mo, 1, false, 0, '', ''));
  c.querySelectorAll('.v[data-p]').forEach((el) => {
    const p = el.dataset.p, a = tablaM.antes.get(p), b = +el.dataset.tot; tablaM.antes.set(p, b);
    if (a === undefined || a === b) return;
    el.classList.add('sube'); const t0 = performance.now();
    const paso = () => { if (!el.isConnected) return; const k = Math.min(1, (performance.now() - t0) / 1600); el.textContent = dineroLargo(a + (b - a) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(paso); else el.classList.remove('sube'); };
    paso();
  });
}

function animar(d) {
  if (ceremonia) pasoCeremonia();
  const ya = performance.now();
  for (const o of otros.values()) {
    const b = o.b; if (!o.on || !b || !b.length) continue;
    // Cada maquinita se dibuja un instante atrás, entre dos posiciones reales. Ese instante se ajusta a su ritmo:
    // unas 80 milésimas cuando está cerca y manda 30 por segundo; más si su señal viene lenta o espaciada.
    const meta = red.lenta ? 250 : Math.max(75, Math.min(260, (o.iv || 66) * 1.7 + 22 + red.rtt * 0.1));
    o.ret = o.ret ? o.ret + (meta - o.ret) * Math.min(1, d * 1.5) : meta;
    const ahora = ya - o.ret;
    while (b.length > 2 && b[1].t <= ahora) b.shift();
    const A = b[0], B = b[1];
    if (!B || ahora <= A.t) { o.x = A.x; o.y = A.y; o.fl = A.fl; continue; }
    const k = Math.min(1, (ahora - A.t) / (B.t - A.t)), lejos = Math.abs(B.x - A.x) > 3 || Math.abs(B.y - A.y) > 3;
    o.x = lejos ? B.x : A.x + (B.x - A.x) * k; o.y = lejos ? B.y : A.y + (B.y - A.y) * k; o.fl = B.fl;
    if (o.fl & 64 && Math.random() < d * 30) chispas(o.x + (o.fl & 1 ? 0.5 : -0.5), o.y + 0.1, '#ffd76a', 1, 7);       // las que se están peleando sueltan chispas
    if (o.fl & 4 && Math.random() < d * 20) chispas(o.x + (o.fl & 16 ? 0 : o.fl & 1 ? 0.5 : -0.5), o.y + (o.fl & 16 ? 0.5 : 0), '#a9744f', 1, 3);
  }
  for (const q of parts) { q.x += q.vx * d; q.y += q.vy * d; q.vy += (q.gr ?? 9) * d; q.t -= d; }
  if (vis.y > 12 && op.part === 2 && !yo.agua && Math.random() < d * 5) {       // cada zona tiene su aire: polvo, gotas, esporas, destellos, brasas
    const ax = vis.x + (Math.random() - 0.5) * 16, ay = vis.y + (Math.random() - 0.5) * 9, z = zonaDe((ay + 1) * 2);
    if (celda(Math.floor(ax), Math.floor(ay)) === 0) parts.push(z < 4 ? { x: ax, y: ay, vx: (Math.random() - 0.5) * 0.3, vy: 0.2, t: 1.6, col: '#c9a37e', gr: 0.2 } : z === 4 ? { x: ax, y: Math.floor(ay) + 0.05, vx: 0, vy: 0.5, t: 0.9, col: '#9fdcff', gr: 9 } : z === 5 ? { x: ax, y: ay, vx: (Math.random() - 0.5) * 0.4, vy: -0.4, t: 2.2, col: '#7dffe0', gr: -0.1 } : z === 6 ? { x: ax, y: ay, vx: 0, vy: 0, t: 0.5, col: '#dfe6ff', gr: 0 } : { x: ax, y: ay, vx: (Math.random() - 0.5) * 0.5, vy: -0.8, t: 1.4, col: '#ff9a4a', gr: -0.5 });
  }
  if (yo.agua && op.part && Math.random() < d * (yo.picada ? 40 : 7)) parts.push({ x: vis.x + (Math.random() - 0.5) * 0.5, y: vis.y - 0.3, vx: (Math.random() - 0.5) * 0.3, vy: -1 - Math.random(), t: 1 + Math.random() * 0.6, col: '#bfe9ff', g: 1, gr: -1 });
  { const pf = yo.perf, enLava = pf && pf.tipo === 3, meta = enLava ? 0.35 + 0.65 * Math.min(1, pf.t / pf.dur) : 0;
    calorFx += (meta - calorFx) * (1 - Math.exp(-(enLava ? 10 : 2) * d));
    if (enLava && op.part && Math.random() < d * (14 + 30 * rad())) {      // el radiador va sacando el calor por atrás: entre mejor radiador, más vapor
      const dx = pf.tx + 0.5 - pf.ox, dy = pf.ty + 0.5 - pf.oy;
      parts.push({ x: vis.x - Math.sign(dx) * 0.3 + (Math.random() - 0.5) * 0.3, y: vis.y - 0.25, vx: -Math.sign(dx) * (1.5 + Math.random() * 2) + (Math.random() - 0.5), vy: (dy > 0.5 ? -3 : -1) - Math.random() * 1.5, t: 0.5 + Math.random() * 0.5, col: Math.random() < 0.5 ? '#ffd9a0' : '#f3ead8', g: 2, gr: -1.5 });
    } }
  for (const b of bichos) {                         // los murciélagos buscan tu túnel y se van hacia arriba; los demás te rondan un rato
    b.t -= d; b.f += d;
    if (b.k === 0) { b.vx += ((vis.x - b.x) * 5 + (Math.random() - 0.5) * 30) * d; b.vy += (-7 - b.vy) * 2 * d; b.vx *= Math.pow(0.2, d); }
    else { b.vx += ((vis.x + Math.sin(b.f * 0.9) * 2.2 - b.x) * 1.6 + (Math.random() - 0.5) * 8) * d; b.vy += ((vis.y - 0.6 + Math.cos(b.f * 0.7) * 1.6 - b.y) * 1.6 + (Math.random() - 0.5) * 8 - (b.k === 3 ? 3 : 0)) * d; b.vx *= Math.pow(0.3, d); b.vy *= Math.pow(0.3, d); }
    b.x += b.vx * d; b.y += b.vy * d;
  }
  if (bichos.length) bichos = bichos.filter((b) => b.t > 0 && b.y > 0);
  for (const o of ondas) o.t += d;
  if (ondas.length) ondas = ondas.filter((o) => o.t < o.d);
  golpeFx *= Math.pow(0.02, d);
  if (calor.length && op.part && Math.random() < d * 2.5) {       // brasas que suben de la lava
    const i = (Math.random() * calor.length / 4 | 0) * 4;
    parts.push({ x: calor[i + 2] + 0.25 + Math.random() * 0.5, y: calor[i + 3] + 0.25, vx: (Math.random() - 0.5) * 0.5, vy: -0.7 - Math.random() * 0.8, t: 0.8 + Math.random() * 0.6, col: Math.random() < 0.5 ? '#ffb347' : '#ffe27a', gr: -0.4 });
  }
  if (parts.length) { let n = 0; for (let i = 0; i < parts.length; i++) if (parts[i].t > 0) parts[n++] = parts[i]; parts.length = n; }      // se compacta en su lugar: sin arreglos nuevos en cada cuadro
  for (const f of flot) { f.t -= d; f.y -= d * 0.7; }
  if (flot.length) flot = flot.filter((f) => f.t > 0);
  for (const s of senales) s.t -= d;
  if (senales.length) senales = senales.filter((s) => s.t > 0);
  temblor *= Math.pow(0.002, d);
  if (S && S.vida / vidaMax() < 0.3 && Math.random() < d * 12) parts.push({ x: vis.x, y: vis.y - 0.3, vx: (Math.random() - 0.5) * 0.6, vy: -1.5 - Math.random(), t: 0.9, col: '#55504d', g: 2 });
  // cámara: sigue a la maquinita; la rueda o el trackpad la separan y cualquier flecha la regresa
  if (!vistaLibre) { const k = Math.pow(0.0005, d); panX *= k; panY *= k; }
  const minX = 0, maxX = Math.max(0, W - cols);
  let minY = TECHO - filas, maxY = H + 2 - filas;
  if (vistaLibre && S) {               // con la rueda solo se mira lo ya explorado: hasta el récord de profundidad y, hacia arriba, hasta la mayor altura alcanzada
    const rec = soloVer ? (otros.get(veo)?.rec || 0) : S.rec, alt = soloVer ? 1e9 : Math.max(S.alt, 40);
    maxY = Math.min(maxY, Math.max(vis.y, rec / 2 - HH) - filas * 0.5); minY = Math.max(minY, Math.min(vis.y, -alt / 2 - HH) - filas * 0.5);
  }
  let cx = vis.x - cols / 2 + panX, cy = vis.y - filas * 0.5 + panY;
  if (cols >= W) cx = (W - cols) / 2; else if (cx < minX) { panX += minX - cx; cx = minX; } else if (cx > maxX) { panX += maxX - cx; cx = maxX; }
  if (cy < minY) { panY += minY - cy; cy = minY; } else if (cy > maxY) { panY += maxY - cy; cy = maxY; }
  const s = 1 - Math.pow(0.00004, d);
  camX += (cx - camX) * s; camY += (cy - camY) * s;
  if (!vistaLibre) camY = Math.max(cy - filas * 0.3, Math.min(cy + filas * 0.3, camY));
  pintarRegla();
}
// La regla de la izquierda, mientras se mira con la rueda: de la superficie a tu récord, con la marca de dónde va la vista,
// el punto donde está tu maquinita y los lugares que ya descubriste. Un clic en ella lleva la vista a esa profundidad.
let reglaF = '', reglaVis = false;
function pintarRegla() {
  const ver = !!(vistaLibre && listo && !menu && S);
  if (ver !== reglaVis) { reglaVis = ver; document.body.classList.toggle('libre', ver); }
  if (!ver) return;
  const rec = Math.max(20, soloVer ? (otros.get(veo)?.rec || 0) : S.rec), via = $('#reglaVia'), h = via.clientHeight || 1;
  const f = rec + '|' + (soloVer ? '' : S.lug.join(''));
  if (f !== reglaF) {
    reglaF = f;
    $('#reglaAb').textContent = (soloVer ? '' : 'tu récord · ') + rec.toLocaleString('es-MX') + ' m';
    $('#reglaLug').innerHTML = soloVer ? '' : LUGARES.map((L, i) => (S.lug[i] && L.m <= rec ? `<span style="top:${(L.m / rec * 100).toFixed(2)}%" title="${L.n} · ${L.m.toLocaleString('es-MX')} m">${L.ic}</span>` : '')).join('');
  }
  const m = (camY + filas / 2 + HH) * 2, k = Math.max(0, Math.min(1, m / rec));
  $('#reglaVer').style.transform = `translateY(${(k * h).toFixed(1)}px)`;
  poner($('#reglaTx'), m < -3 ? '↑ ' + fmtAlto(Math.round(-m)) : Math.max(0, Math.round(m)).toLocaleString('es-MX') + ' m' + (m > 0 ? ' · ' + ZONA_N[zonaDe(Math.max(1, m))].replace(/^(La|El|Las) /, '') : ''));
  $('#reglaYo').style.transform = `translateY(${(Math.max(0, Math.min(1, (vis.y + HH) * 2 / rec)) * h).toFixed(1)}px)`;
}
function arrancar() {
  if (corriendo || !listo || menu || pausa) return;   // con la pestaña oculta el navegador ya no llama al ciclo
  corriendo = true; ult = performance.now(); acum = 0; ant.x = yo.x; ant.y = yo.y;
  const id = ++cicloId; requestAnimationFrame((x) => (soloVer ? cicloVer : ciclo)(x, id));
  if (pistaDe === PAUSA) pistaDe = undefined;
}
function detener() { corriendo = false; for (const k in teclas) teclas[k] = false; amarreAba = false; sonarLazos(true); }

const raton = { x: -1, y: -1, t: 0 };
addEventListener('mousemove', (e) => { raton.x = e.clientX; raton.y = e.clientY; raton.t = performance.now(); });
function queEs() {
  const o = $('#ojo'); let txt = '';
  if (!menu && raton.x >= 0 && performance.now() - raton.t < 5000 && camY + raton.y * RES / T < 0 && camY + raton.y * RES / T > -2.6) {
    const wx = camX + raton.x * RES / T;
    if (wx > 30 && wx < 36) txt = `El terrero · aquí se tira el tepetate, la roca sin valor. El equipo lleva ${cavadasMundo.toLocaleString('es-MX')} celdas cavadas`;
    else if (Math.abs(wx - 37.6) < 0.5) txt = 'Nicho de Santa Bárbara, patrona de los mineros';
  }
  if (!txt && !menu && raton.x >= 0 && performance.now() - raton.t < 5000) {
    const t = celda(Math.floor(camX + raton.x * RES / T), Math.floor(camY + raton.y * RES / T));
    if (t >= 10 && t < 40) { const m = MIN[t - 10]; txt = S.st.rec[t - 10] ? `${m.n} · ${fmt(m.v)} · ${m.kg} kg` : 'Mineral sin descubrir'; }
    else if (t === 50) txt = 'Un objeto para la colección';
    else if (t >= 40) txt = t === 46 ? 'Late…' : 'Algo enterrado…';
    else if (t === 6) txt = 'Agua · aquí flotas';
    else if (t === 7) txt = 'Ladrillo antiguo · se perfora';
    else if (t === 2) { const my = (Math.floor(camY + raton.y * RES / T) + 1) * 2, D = PIEDRA[durezaDe(my)], tp = tiempoPiedra(my); txt = 'Piedra ' + D[1] + (tp ? ' · tu taladro la pasa en ' + tp.toFixed(1) + ' s' : ' · pide ' + PZ[0].niv[D[0]][0]); }
    else if (t === 3) { const [a, b] = danoLava(); txt = cfg.lava ? `Lava · perforarla quita de ${a} a ${b} de casco · traes ${Math.ceil(S.vida)}` : 'Lava · en este mundo no quema'; }
    else if (t === 4 && (cfg.verGas === 1 || pistaGas())) txt = cfg.gas ? `Bolsa de gas · si la perforas explota y quita ${danoGas(Math.floor(camY + raton.y * RES / T))} de casco · traes ${Math.ceil(S.vida)}` : 'Bolsa de gas · en este mundo no explota';
  }
  if (o._t !== txt) { o._t = txt; o.textContent = txt; o.style.display = txt ? 'block' : 'none'; }
  if (txt) { o.style.left = raton.x + 16 + 'px'; o.style.top = raton.y + 18 + 'px'; }
}
let cavadasMundo = 0;       // celdas cavadas en todo el mundo: de eso depende el tamaño del terrero
let cruY = 0, cruT = 0, tArr = -9;
function subirSola() { crucero = true; cruY = yo.y + 1; cruT = 0; son.clic(); }
let tGas = -9, crucero = false, tLatido = -9, tMach = -99, eraSonico = false, tTermas = -9;
let pistaDe = null, tAlarma = 0, estabaAbajo = false, tTabla = 0;
function pista(x, discreta) { const p = $('#pista'); if (p._t !== x) { p._t = x; p.textContent = x; p.style.display = x ? 'block' : 'none'; p.classList.toggle('dis', !!discreta); } }
// La grúa te deja en la Gasolinera. Cobra por lo lejos que estás y por lo que pesas.
function costoGrua() { return Math.max(10, Math.round(0.75 * Math.hypot(yo.x - 41.5, yo.y + HH) * 2 * (1980 + kgCarga()) / 1000)); }
// Dónde está parado «El Güero»: sobre el piso de la Gruta, del lado derecho.
function guero() { let y = 1495; while (y < 1520 && !solida(60, y + 1)) y++; return [60.5, y + 1 - HH]; }
function recordar() { const p = yo.perf, y = p ? p.oy : yo.y; if (y > 2) S.ult = { x: p ? p.ox : yo.x, y, mu: mundoId, r: remin }; }
function grua() {
  if (!S || (yo.y <= 1 && yo.y > -20)) return;
  if (yo.perf) return aviso('Termina de perforar para pedir la grúa.');
  const c = costoGrua();
  if (S.d < c) { son.no(); return aviso('La grúa cuesta ' + fmt(c) + ' y traes ' + fmt(S.d) + '.'); }
  recordar(); S.d -= c; S.st.gruas++; son.grua(); chispas(yo.x, yo.y, '#ffd23f', 30, 8);
  yo.x = 41.5; yo.y = INICIO_Y; yo.vx = yo.vy = 0; yo.suelo = true; vistaLibre = false;
  tarjeta('🚁 Grúa · ' + fmt(c), 'Te dejó en la Gasolinera. Con El Elevador regresas al punto donde te recogió.'); difundir('pidió la grúa'); sucio = true; pintarHud(true);
}
function cadaTanto() {
  const m = prof();
  if (yo.y > EDEN0 - 60 && tiempo - edenT > 1) { edenT = tiempo; jardinDelFondo(); }
  if (m > S.rec) {
    S.rec = m; sucio = true;
    while (S.msj < MSJ.length && MSJ[S.msj].m <= m) {
      const x = MSJ[S.msj++];
      if (x.q) { S.d += x.q; S.tot += x.q; son.venta(); }
      son.radio();
      tarjeta('📡 ' + x.de + (x.q ? ' · bono de ' + fmt(x.q) : ''), x.x, 'msj', 9000);
    }
    let r = 0; for (let i = 0; i < RANGOS.length; i++) if (m >= RANGOS[i][0]) r = i;
    if (r > S.rango) {
      S.rango = r; const regalo = [0, 2, 1][r % 3]; S.obj[regalo]++;
      tarjeta('⛏️ Nuevo rango: ' + RANGOS[r][1], 'Regalo: ' + OBJ[regalo].n + '.'); son.rango(); difundir('subió a ' + RANGOS[r][1]);
    }
  }
  const al = altura();
  if (al > S.alt) {
    S.alt = al; sucio = true;
    while (S.msjA < ALTURAS.length && ALTURAS[S.msjA].m <= al) {
      const x = ALTURAS[S.msjA++];
      S.d += x.q; S.tot += x.q; if (x.m >= 100000) son.espacio(); else son.radio();
      tarjeta('📡 ' + x.de + ' · bono de ' + fmt(x.q), x.x, 'msj', 10000); difundir('voló a ' + fmtAlto(x.m) + ' de altura');
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
  pista(amarreAba ? 'Perforando sola hacia abajo · un toque la suelta' : yo.frena ? 'Aterrizaje suave: frenando sola' : crucero ? (tactil ? 'Subiendo sola · un toque la suelta' : 'Subiendo sola · barra espaciadora o ↓ para soltar') : yo.planea && yo.y < -40 ? '↓ caer en picada · ↑ frenar' : yo.picada ? 'En picada · suelta ↓ para planear' : teclas.arr && yo.vuela && !yo.suelo && !tactil ? 'Doble ↑ o barra espaciadora: seguir subiendo sin sostener la tecla' : vistaLibre ? 'Vista libre · ' + donde(camY + filas / 2) + (tactil ? ' · un dedo vuelve a tu maquinita' : ' · pulsa una flecha para volver a tu maquinita') : e ? (tactil ? 'Toca para entrar a ' : '↓  Entrar a ') + e.n + ' · ' + e.h.toLowerCase() : '', !e);      // solo la invitación a entrar a un edificio va destacada
  // los lugares: al entrar por primera vez se celebra y queda apuntado en El Elevador
  const lg = yo.y >= 165 ? lugarDe(Math.floor(yo.x), Math.floor(yo.y), true) : -1;
  if (lg >= 0 && !S.lug[lg]) {
    const L = LUGARES[lg]; S.lug[lg] = 1; S.d += L.q; S.tot += L.q; sucio = true; son.espacio();
    tarjeta(`${L.ic} Descubriste ${L.n} · bono de ${fmt(L.q)}`, L.tx + ' Ya puedes volver aquí desde El Elevador.', 'msj', 14000, true); difundir('descubrió ' + L.n); pintarHud(true);
  }
  if (yo.agua && lg >= 0 && LUGARES[lg].t === 'termas' && S.vida < vidaMax()) { S.vida = Math.min(vidaMax(), S.vida + vidaMax() * 0.04); sucio = true; if (tiempo - tTermas > 2.5) { tTermas = tiempo; flota(yo.x, yo.y - 0.9, '♨ el agua repara el casco', '#bfe9ff'); } }
  if (!S.fl.mural && yo.y > MURAL.y - 1 && yo.y < MURAL.y + MURAL.al + 2 && yo.x > MURAL.x - 2 && yo.x < MURAL.x + MURAL.an + 2) {
    S.fl.mural = 1; sucio = true; son.descubre();
    tarjeta('🖐️ El mural de «Los que vendrán»', 'Lo pintaron hace miles de años. Y ahí está ' + miNombre + ', con su nombre' + (otros.size ? ', junto a las demás maquinitas de este mundo' : '') + '. Abajo, los objetos de la colección que ya aparecieron.', 'msj', 14000, true);
  }
  { const z = zonaDe(prof()); if (z >= 4 && z > (S.zmax || 3)) { S.zmax = z; sucio = true; son.espacio(); tarjeta('⬇ ' + ZONA_N[z], ZONA_TX[z] + ' La piedra de aquí pide ' + PZ[0].niv[PIEDRA[z - 3][0]][0] + '.', 'msj', 12000, true); } }
  if (yo.y > 1470 && yo.y < 1520 && !S.fl.guero) {
    const [gx, gy] = guero();
    if (Math.hypot(yo.x - gx, yo.y - gy) < 2.6) {
      S.fl.guero = 1; S.d += 5e6; S.tot += 5e6; S.obj[1] += 10; sucio = true; son.logro();
      tarjeta('📡 Maquinita 22 · «El Güero»', '¡Sabía que alguien iba a bajar! Aquí sigo desde que se me cerró el túnel. Toma: cinco millones y mis nanobots. Yo me quedo: mira nada más qué vista.', 'msj', 15000, true); difundir('encontró a «El Güero»'); pintarHud(true);
    }
  }
  if (yo.y > 4860 && tiempo - tLatido > 1.15 && celda(48, 4915) === 46) {
    const cerca = 1 - Math.hypot(yo.x - 48.5, yo.y - 4915.5) / 45;
    if (cerca > 0) { tLatido = tiempo; tono(52, 0.22, 'sine', 0.28 * cerca, 34, 0, 'ambiente'); tono(48, 0.2, 'sine', 0.2 * cerca, 32, 0.24, 'ambiente'); }
  }
  // la primera vez que hay lava o gas cerca, se explica con números
  if (yo.y > 0 && (!S.fl.vioLava || !S.fl.vioGas)) {
    const cx = Math.floor(yo.x), cy = Math.floor(yo.y);
    for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) {
      const t = celda(cx + a, cy + b);
      if (t === 3 && !S.fl.vioLava && cfg.lava) { S.fl.vioLava = 1; sucio = true; const [p, q] = danoLava(); tarjeta('🌋 Lava', `Se ve y se puede rodear. Perforarla quita de ${p} a ${q} de casco (traes ${Math.ceil(S.vida)}). El radiador del Taller la enfría.`, '', 9000); }
      if (t === 4 && !S.fl.vioGas && cfg.gas && (cfg.verGas === 1 || pistaGas())) { S.fl.vioGas = 1; sucio = true; tarjeta('🫧 Bolsa de gas', `Esas burbujas verdes son gas: si perforas ahí, explota. Aquí pega ${danoGas(cy + b)} y tu casco aguanta ${vidaMax()}. Rodéala o vuélala con dinamita (X).`, '', 10000); }
    }
  }
  // huele a gas: hay una bolsa pegada a la maquinita
  if (yo.y > 0 && cfg.gas && pistaGas() && tiempo - tGas > 2.5) {
    const cx = Math.floor(yo.x), cy = Math.floor(yo.y);
    if ([[0, 1], [-1, 0], [1, 0]].some(([a, b]) => celda(cx + a, cy + b) === 4)) { tGas = tiempo; flota(yo.x, yo.y - 0.9, '⚠ Grisú: la flama se puso azul', '#9fd8ff'); son.huele(); }
  }
  pintarVel();
  // la barrera del sonido: al pasar de 343 m/s dentro del aire, truena
  const sonico = Math.hypot(yo.vx, yo.vy) * 2 >= 343 && yo.y < -10 && altura() < 85000;
  if (sonico && !eraSonico && tiempo - tMach > 12) { tMach = tiempo; onda(yo.x, yo.y, 5, '#ffffff', 0.6); son.boom(0.45); temblar(5); flota(yo.x, yo.y - 1.4, 'Mach 1 · rompiste la barrera del sonido', '#ffffff'); }
  eraSonico = sonico;
  pintarHud(); queEs();
  if (++tTabla % 4 === 0) pintarTabla();
  if (tTabla % 40 === 1) { let n = 0; for (let i = 0; i < dug.length; i++) { let b = dug[i]; while (b) { n += b & 1; b >>= 1; } } cavadasMundo = n; }
  if (yo.suelo && yo.y < 0 && Math.abs(yo.x - 37.6) < 0.9 && !S.fl.nicho) { S.fl.nicho = 1; sucio = true; son.descubre(); tarjeta('🕯️ Santa Bárbara', 'El nicho de la patrona de los mineros. Aquí se encomienda uno antes de bajar. Que salgas con bien.', 'msj', 9000); }
}

/* ════════ Pantalla: medidores, metas y tabla ════════ */
let hudAnt = '';
function metas() {             // arriba al centro: solo dónde estás y, si lo hay, un peligro inmediato
  const l = [], lg = yo.y >= 165 ? lugarDe(Math.floor(yo.x), Math.floor(yo.y), true) : -1;
  if (lg >= 0) l.push({ ya: 1, tx: LUGARES[lg].ic + ' ' + LUGARES[lg].n, p: 1 });
  if (yo.y >= EDEN0 - 4) l.push({ ya: 1, tx: edenPct >= 1 ? '🌳 El Jardín del Fondo · completo · V para verlo entero' : `🌱 El Jardín del Fondo · ${Math.floor(edenPct * 100)} % a la vista` + (edenQuedan <= 300 ? ` · faltan ${edenQuedan} ${edenQuedan === 1 ? 'celda' : 'celdas'}` : ''), p: 1 });
  if (cfg.gas && S.rec >= 560) { const sg = gasSeguro(); if (prof() > sg) l.push({ mal: 1, tx: `⚠ A esta profundidad una bolsa de gas te explota. Tu equipo la aguanta hasta ${sg < 650 ? 'ninguna' : sg + ' m'}`, p: 1 }); }
  return l;
}
function pintarHud(forzar) {
  if (!S) return;
  const f = S.fuel / tanque(), v = S.vida / vidaMax();
  const k = [Math.round(S.fuel * 10), S.vida, prof(), altura() > 40, S.d, nCarga(), S.eq.join(''), S.obj.join(','), S.rec, crucero ? 1 : 0, viajeAbierto ? 1 : 0, yo.perf ? 1 : 0, yo.agua ? 1 : 0].join('|');
  if (k === hudAnt && !forzar) return; hudAnt = k;
  const bc = $('#bComb'), bv = $('#bCasco');
  bc.firstChild.style.width = f * 100 + '%'; bc.lastChild.textContent = S.fuel.toFixed(1) + ' / ' + tanque() + ' L'; bc.classList.toggle('bajo', f < 0.25);
  bv.firstChild.style.width = v * 100 + '%'; bv.lastChild.textContent = Math.max(0, Math.ceil(S.vida)) + ' / ' + vidaMax(); bv.classList.toggle('bajo', v < 0.3);
  $('#prof').textContent = donde(yo.y) + (yo.y > 105 ? ' · ' + ZONA_N[zonaDe(prof())].replace(/^(La|El|Las) /, '') : ''); $('#din').textContent = fmt(S.d - porCobrar);
  pintarViaje();
  poner($('#metas'), metas().map((m) => `<div class="m${m.ya ? ' ya' : ''}${m.mal ? ' mal' : ''}"><i style="width:${Math.round(Math.min(100, m.p * 100))}%"></i><span>${esc(m.tx)}</span></div>`).join(''));
  poner($('#objetos'), OBJ.map((o, i) => `<div data-u="${i}" class="${S.obj[i] ? '' : 'n0'}" title="${o.k} · ${o.n}: ${o.ef}"><kbd>${o.k}</kbd><i>${o.ic}</i><small>${S.obj[i].toLocaleString('es-MX')}</small></div>`).join(''));
  if (forzar) pintarTabla();
}
// Lo que cuesta volver volando a la superficie, a ojo: la subida derecha, con lo que pesas.
function costoSubir() {
  const cab = hp(), empuje = 26 * (1 - (1980 + kgCarga()) / (cab * 29.5));
  if (empuje <= 0.4) return Infinity;
  const v = 6 + brio() / 20;
  return 17 / 60 * ((yo.y + HH) / v * 1.15 + v / empuje * 0.5 + 1);
}
// El viaje, abajo a la izquierda: cuánto llevas, en cuánto se vende, si te alcanza para subir, y la grúa.
let viajeAbierto = false, viajeT = 0;
function pintarViaje() {
  const n = nCarga(), bd = bodega(), abajo = yo.y > 2.5, lejos = abajo || yo.y < -20;
  let h;
  if (movil && !viajeAbierto) {                 // en el celular, una píldora: qué llevas, en cuánto se vende y si alcanza para subir
    const c = abajo ? costoSubir() : 0, mal = c > S.fuel;
    h = `<div class="pill"><span>📦 ${n}/${bd}</span><b>${fmt(venta().total)}</b>${abajo ? `<span class="${mal ? 'mal' : ''}">⛽ ${c === Infinity ? 'muy pesado' : '≈ ' + Math.ceil(c) + ' L'}</span>` : ''}</div>`;
  } else h = `<div class="l"><span>Llevas</span><b>${n} de ${bd}${n >= bd ? ' · llena' : ''}</b></div><div class="bar${n >= bd ? ' llena' : ''}"><i style="width:${Math.round(n / bd * 100)}%"></i></div><div class="l"><span>Se vende en</span><b>${fmt(venta().total)}</b></div>` + (n ? `<div class="bod">${S.carga.map((c, i) => [c, i]).filter((a) => a[0]).reverse().map(([c, i]) => `<span title="${MIN[i].n} · ${fmt(MIN[i].v)} la pieza"><i style="background:${MIN[i].col}"></i>${MIN[i].n} ${c}</span>`).join('')}</div>` : '');
  if (abajo && h.indexOf('class="pill"') < 0) { const c = costoSubir(), mal = c > S.fuel; h += `<div class="l${mal ? ' mal' : ''}"><span>Subir gasta</span><b>${c === Infinity ? 'vas muy pesado' : '≈ ' + Math.ceil(c) + ' L · ' + (mal ? 'no te alcanza' : 'traes ' + Math.floor(S.fuel))}</b></div>`; }
  const sig = RANGOS.find((r) => r[0] > S.rec);
  if (h.indexOf('class="pill"') < 0) h += `<div class="l rec col" title="Ver la colección del mundo"><span>Colección</span><b>${nHallados()} de ${NCOL}</b></div>`;
  if (h.indexOf('class="pill"') < 0) h += `<div class="l rec" title="${sig ? 'Sigue: ' + sig[1] + ' a los ' + sig[0].toLocaleString('es-MX') + ' m' : 'Llegaste al último rango'}"><span>Récord</span><b>${S.rec.toLocaleString('es-MX')} m · ${RANGOS[S.rango][1]}</b></div>`;
  const vj = $('#vjDatos'), modo = h.indexOf('class="pill"') < 0 ? 1 : 0; if (vj._modo !== modo) { vj._modo = modo; vj.classList.remove('entra'); void vj.offsetWidth; vj.classList.add('entra'); }
  poner(vj, h);
  const b = $('#bGrua'), c = lejos ? costoGrua() : 0;
  poner(b, lejos ? `<span>🚁 Grúa · <b>${fmt(c)}</b>${S.d < c ? ' · no alcanza' : ''}</span><kbd>G</kbd>` : '');      // en un solo renglón, para que quepan los números
  b.style.display = lejos ? 'flex' : 'none'; b.classList.toggle('no', S.d < c);
  // «Subir sola», solo en el celular: con el dedo no hay doble ↑ ni barra espaciadora
  const bs = $('#bSube'), ver = movil && !soloVer && !yo.perf && !yo.agua && (yo.y > 6 || crucero);
  bs.style.display = ver ? 'block' : 'none';
  if (ver) { poner(bs, crucero ? '⏹ Dejar de subir' : '⬆ Subir sola'); bs.classList.toggle('on', crucero); }
}
// El velocímetro, a la izquierda: aparece al volar o caer. La escala se aprieta al crecer para que quepa de 0 a 100,000 km/h.
function pintarVel() {
  const el = $('#vel'), v = Math.hypot(yo.vx, yo.vy) * 2, ver = !menu && !yo.perf && !yo.suelo && (yo.y < -10 || Math.abs(yo.vy) > 10);
  if (el._v !== ver) { el._v = ver; el.style.display = ver ? 'block' : 'none'; }
  if (!ver) return;
  const kmh = v * 3.6, enAire = yo.y < 0 && altura() < 85000;
  $('#velAg').style.transform = `rotate(${(-90 + 180 * Math.min(1, Math.log10(1 + kmh / 20) / 3.7)).toFixed(1)}deg)`;
  $('#velN').textContent = (yo.vy > 0.5 ? '↓ ' : yo.vy < -0.5 ? '↑ ' : '') + Math.round(kmh).toLocaleString('es-MX');
  $('#velU').textContent = 'km/h' + (yo.picada ? ' · en picada' : yo.planea ? ' · planeando' : '') + (enAire && v >= 300 ? ' · Mach ' + (v / 343).toFixed(1) : '');
}
function pintarTabla() {
  if (!S) return;
  const l = [{ n: miNombre, m: miModelo, rec: S.rec, on: 1, yo: 1, me: miMe, y: donde(yo.y) }, ...[...otros.values()].map((o) => ({ ...o, y: o.on && o.y !== undefined ? donde(o.y) : null }))];
  l.sort((a, b) => (b.on || 0) - (a.on || 0) || (b.rec || 0) - (a.rec || 0));        // primero quienes están jugando
  const mas = l.length - 8; if (mas > 0) { const yoJ = l.findIndex((j) => j.yo); l.length = 8; if (yoJ >= 8) l[7] = { n: miNombre, m: miModelo, rec: S.rec, on: 1, yo: 1, y: donde(yo.y) }; }
  poner($('#tabla'), (movil ? l.filter((j) => !j.yo && j.on).slice(0, 3) : l).map((j) => `<div class="${j.on ? '' : 'off'}"><i style="background:${MODELOS[j.m]?.[0] || '#888'}"></i><b>${j.me ? '✦ ' : ''}${esc(j.n)}${j.yo ? ' (tú)' : ''}</b><span>${j.on && j.y !== null ? j.y + ' · ' : ''}récord ${num(j.rec)} m</span></div>`).join('') + (mas > 0 && !movil ? `<div class="off"><b>y ${mas} más</b></div>` : '') +
(soyCreador && publico.sol.length ? `<div class="mund pub" data-pub="1">🙋 ${publico.sol.length === 1 ? '1 quiere jugar' : publico.sol.length + ' quieren jugar'} · <kbd>J</kbd></div>` : '') + (mirones ? `<div class="mund pub" data-pub="1">👁 ${mirones === 1 ? '1 persona te mira' : mirones + ' personas te miran'}</div>` : '') + (cita ? `<div class="mund cita" data-cita="1">🕘 ${horaCitaTx(cita.h).replace(' hora de Torreón', '').replace(/ \(.*\)$/, '')} · ${(cita.voy || []).length === 1 ? '1 va' : (cita.voy || []).length + ' van'} · ${(cita.voy || []).includes(miI) ? 'voy ✓' : '¿vas?'}</div>` : ''));
}

/* ════════ Código QR ════════ RLR */
// Generador propio, sin librerías: modo de bytes, corrección M, versiones 1 a 10 (hasta 213 caracteres).
const QR_V = [0, [26, 10, 1, 16], [44, 16, 1, 28], [70, 26, 1, 44], [100, 18, 2, 32], [134, 24, 2, 43], [172, 16, 4, 27], [196, 18, 4, 31], [242, 22, 2, 38, 2, 39], [292, 22, 3, 36, 2, 37], [346, 26, 4, 43, 1, 44]];
const QR_AL = [0, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
function qr(texto) {
  const datos = [...new TextEncoder().encode(texto)];
  let v = 1; const cabe = (n) => { const d = QR_V[n]; return d[2] * d[3] + (d[4] || 0) * (d[5] || 0); };
  while (v <= 10 && datos.length > Math.floor((cabe(v) * 8 - 4 - (v < 10 ? 8 : 16)) / 8)) v++;
  if (v > 10) return null;
  const d = QR_V[v], total = cabe(v), n = 17 + v * 4;
  // 1. bits: modo, cuenta, datos, terminador y relleno
  const bits = []; const mete = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); };
  mete(4, 4); mete(datos.length, v < 10 ? 8 : 16); for (const b of datos) mete(b, 8);
  mete(0, Math.min(4, total * 8 - bits.length)); while (bits.length % 8) bits.push(0);
  const cw = []; for (let i = 0; i < bits.length; i += 8) cw.push(bits.slice(i, i + 8).reduce((a, b) => a * 2 + b, 0));
  for (let i = 0; cw.length < total; i++) cw.push(i % 2 ? 0x11 : 0xec);
  // 2. Reed-Solomon sobre GF(256)
  const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  for (let i = 0, x = 1; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  const mul = (a, b) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);
  let gen = [1]; for (let i = 0; i < d[1]; i++) { const g = new Array(gen.length + 1).fill(0); for (let j = 0; j < gen.length; j++) { g[j] ^= gen[j]; g[j + 1] ^= mul(gen[j], EXP[i]); } gen = g; }
  const ecc = (blo) => { const r = new Array(d[1]).fill(0); for (const b of blo) { const f = b ^ r.shift(); r.push(0); for (let j = 0; j < d[1]; j++) r[j] ^= mul(gen[j + 1], f); } return r; };
  const bloques = [], ecs = []; let p = 0;
  for (let g = 2; g < d.length; g += 2) for (let i = 0; i < d[g]; i++) { const b = cw.slice(p, p + d[g + 1]); p += d[g + 1]; bloques.push(b); ecs.push(ecc(b)); }
  const fin = [];
  for (let i = 0; i < Math.max(...bloques.map((b) => b.length)); i++) for (const b of bloques) if (i < b.length) fin.push(b[i]);
  for (let i = 0; i < d[1]; i++) for (const e of ecs) fin.push(e[i]);
  // 3. matriz: patrones fijos
  const M = Array.from({ length: n }, () => new Int8Array(n).fill(-1)), fijo = Array.from({ length: n }, () => new Uint8Array(n));
  const pon = (x, y, val) => { if (x >= 0 && y >= 0 && x < n && y < n) { M[y][x] = val ? 1 : 0; fijo[y][x] = 1; } };
  const ojo = (cx, cy) => { for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) { const m = Math.max(Math.abs(x), Math.abs(y)); pon(cx + x, cy + y, m !== 2 && m !== 4); } };
  ojo(3, 3); ojo(n - 4, 3); ojo(3, n - 4);
  for (let i = 8; i < n - 8; i++) { pon(i, 6, i % 2 === 0); pon(6, i, i % 2 === 0); }
  const al = QR_AL[v];
  for (const ay of al) for (const ax of al) { if ((ax === 6 && ay === 6) || (ax === 6 && ay === n - 7) || (ax === n - 7 && ay === 6)) continue; for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) pon(ax + x, ay + y, Math.max(Math.abs(x), Math.abs(y)) !== 1); }
  pon(8, n - 8, 1);
  // se reservan los lugares del formato (y de la versión, de la 7 en adelante)
  for (let i = 0; i < 9; i++) { if (!fijo[8][i]) pon(i, 8, 0); if (!fijo[i][8]) pon(8, i, 0); }
  for (let i = 0; i < 8; i++) { pon(n - 1 - i, 8, 0); if (i < 7) pon(8, n - 1 - i, 0); }
  if (v >= 7) {
    let r = v; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >> 11) * 0x1f25);
    const info = (v << 12) | r;
    for (let i = 0; i < 18; i++) { const b = (info >> i) & 1, a = n - 11 + (i % 3), c = Math.floor(i / 3); pon(a, c, b); pon(c, a, b); }
  }
  // 4. datos en zigzag
  let k = 0; const nb = fin.length * 8;
  for (let x = n - 1, sube = true; x > 0; x -= 2, sube = !sube) {
    if (x === 6) x--;
    for (let i = 0; i < n; i++) { const y = sube ? n - 1 - i : i; for (const xx of [x, x - 1]) if (!fijo[y][xx]) { M[y][xx] = k < nb ? (fin[k >> 3] >> (7 - (k & 7))) & 1 : 0; k++; } }
  }
  // 5. la máscara que menos castigo recibe
  const MASC = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0, (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0, (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0, (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0, (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0];
  const arma = (m) => {
    const R = M.map((f, y) => Array.from(f, (val, x) => (fijo[y][x] ? val : val ^ (MASC[m](x, y) ? 1 : 0))));
    let f = m | (0 << 3), r = f; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >> 9) * 0x537);   // nivel M = 00
    const fmt = ((f << 10) | r) ^ 0x5412;
    for (let i = 0; i < 15; i++) {
      const b = (fmt >> i) & 1;
      if (i < 6) R[i][8] = b; else if (i < 8) R[i + 1][8] = b; else R[8][i === 8 ? 7 : 14 - i] = b;      // junto al ojo de arriba a la izquierda
      if (i < 8) R[8][n - 1 - i] = b; else R[n - 15 + i][8] = b;                                            // repartido en los otros dos
    }
    return R;
  };
  const castigo = (R) => {
    let s = 0;
    for (let y = 0; y < n; y++) for (const lin of [R[y], R.map((f) => f[y])]) {
      let c = 1; for (let x = 1; x <= n; x++) { if (x < n && lin[x] === lin[x - 1]) c++; else { if (c >= 5) s += c - 2; c = 1; } }
      const t = lin.join(''); for (let i = 0; i + 11 <= n; i++) { const u = t.substr(i, 11); if (u === '10111010000' || u === '00001011101') s += 40; }
    }
    for (let y = 0; y < n - 1; y++) for (let x = 0; x < n - 1; x++) if (R[y][x] === R[y][x + 1] && R[y][x] === R[y + 1][x] && R[y][x] === R[y + 1][x + 1]) s += 3;
    const osc = R.reduce((a, f) => a + f.reduce((b, c) => b + c, 0), 0);
    return s + Math.floor(Math.abs(osc * 20 - n * n * 10) / (n * n)) * 10;
  };
  let mejor = null, minimo = Infinity;
  for (let m = 0; m < 8; m++) { const R = arma(m), c = castigo(R); if (c < minimo) { minimo = c; mejor = R; mejor.mascara = m; } }
  return mejor;
}
function fotoRecord() {
  const c = document.createElement('canvas'), L = 1080; c.width = c.height = L;
  const q = c.getContext('2d'), piso = 600;
  const gr = q.createLinearGradient(0, 0, 0, piso); gr.addColorStop(0, '#22407a'); gr.addColorStop(0.5, '#5f83bd'); gr.addColorStop(0.86, '#f0a868'); gr.addColorStop(1, '#fbd590');
  q.fillStyle = gr; q.fillRect(0, 0, L, piso);
  const sol = q.createRadialGradient(820, 250, 20, 820, 250, 330); sol.addColorStop(0, '#fff8d8'); sol.addColorStop(0.2, '#ffe9a8cc'); sol.addColorStop(1, '#ffe9a800'); q.fillStyle = sol; q.fillRect(480, 0, 600, piso);
  for (const [col, alt, f] of [['#c79a78', 150, 0.006], ['#a8734f', 105, 0.011], ['#86573b', 62, 0.019]]) { q.fillStyle = col; q.beginPath(); q.moveTo(0, piso); for (let x = 0; x <= L; x += 30) q.lineTo(x, piso - alt * (0.55 + 0.3 * Math.sin(x * f) + 0.15 * Math.sin(x * f * 2.7 + 1))); q.lineTo(L, piso); q.fill(); }
  const lado = 120;                                  // el suelo, con lo mejor que has descubierto
  let mejor = 0; for (let i = 0; i < MIN.length; i++) if (S.st.rec[i]) mejor = i;
  for (let y = 0; y < 4; y++) for (let x = 0; x < 9; x++) {
    const r = azar(x + 500, y + 700, 5), tipo = y > 0 && r < 0.3 ? 10 + Math.max(0, mejor - Math.floor(r * 13)) : 1;
    q.drawImage(tile(1, zonaDe(S.rec), ((x + y) & 3) * 16 + h16(x, y)), x * lado, piso + y * lado, lado, lado); if (tipo !== 1) q.drawImage(tile(tipo, zonaDe(S.rec), 0), x * lado, piso + y * lado, lado, lado);
  }
  q.fillStyle = '#5c9e3a'; q.fillRect(0, piso, L, 14); q.fillStyle = '#7cc24e'; q.fillRect(0, piso, L, 6);
  q.fillStyle = '#00000059'; q.fillRect(0, piso + 14, L, L);
  dibMaq(q, 300, piso - 150, 380, miModelo, 1, false, 0, '', '', 0.4, miPinta);
  q.textBaseline = 'alphabetic'; q.lineJoin = 'round';
  const texto = (s, x, y, tam, col = '#fff', peso = 900, al = 'left') => { q.font = `${peso} ${tam}px system-ui`; q.textAlign = al; q.lineWidth = tam * 0.16; q.strokeStyle = '#000b'; q.strokeText(s, x, y); q.fillStyle = col; q.fillText(s, x, y); };
  texto('MINA', 60, 130, 110, '#ffd23f');
  texto(miNombre, 60, 205, 56);
  texto(RANGOS[S.rango][1], 60, 258, 36, '#f3e6d8', 700);
  const cifras = [[S.rec + ' m', 'bajo tierra']]; if (S.alt >= 1000) cifras.push([fmtAlto(S.alt), 'de altura']); cifras.push([fmt(S.tot), 'ganados']);
  cifras.forEach(([a, b], i) => { texto(a, 60, piso + 150 + i * 135, 86, '#ffd23f'); texto(b, 60, piso + 192 + i * 135, 34, '#f3e6d8', 700); });
  const liga = location.origin + '/' + mundoId, cq = document.createElement('canvas');
  if (pintarQR(cq, liga, 8)) { q.fillStyle = '#fff'; q.beginPath(); q.roundRect(L - 372, piso + 100, 312, 312, 18); q.fill(); q.imageSmoothingEnabled = false; q.drawImage(cq, L - 360, piso + 112, 288, 288); q.imageSmoothingEnabled = true; }
  texto('Entra a mi mundo', L - 216, piso + 78, 36, '#fff', 800, 'center');
  texto(location.host, L - 216, piso + 452, 26, '#f3e6d8', 700, 'center');
  return c;
}
// Las imágenes de la liga (1200×630: lo que enseña WhatsApp al mandarla). La del mundo lleva sus hitos y a su gente;
// la de la maquinita, lo suyo. Las dibuja el juego y el mundo las guarda.
function fotoLiga(deMundo) {
  const c = document.createElement('canvas'), A = 1200, B = 630; c.width = A; c.height = B;
  const q = c.getContext('2d'), piso = 322;
  const gente = [{ n: miNombre, m: miModelo, rec: S.rec }, ...[...otros.values()].map((o) => ({ n: o.n, m: o.m, rec: o.rec || 0 }))].sort((a, b) => b.rec - a.rec);
  const hondo = deMundo ? gente[0].rec : S.rec, zona = zonaDe(Math.max(60, hondo));
  const gr = q.createLinearGradient(0, 0, 0, piso); gr.addColorStop(0, '#22407a'); gr.addColorStop(0.5, '#5f83bd'); gr.addColorStop(0.86, '#f0a868'); gr.addColorStop(1, '#fbd590');
  q.fillStyle = gr; q.fillRect(0, 0, A, piso);
  const sol = q.createRadialGradient(960, 150, 14, 960, 150, 300); sol.addColorStop(0, '#fff8d8'); sol.addColorStop(0.2, '#ffe9a8cc'); sol.addColorStop(1, '#ffe9a800'); q.fillStyle = sol; q.fillRect(560, 0, 640, piso);
  for (const [col, alt, f] of [['#c79a78', 96, 0.006], ['#a8734f', 66, 0.011], ['#86573b', 40, 0.019]]) { q.fillStyle = col; q.beginPath(); q.moveTo(0, piso); for (let x = 0; x <= A; x += 30) q.lineTo(x, piso - alt * (0.55 + 0.3 * Math.sin(x * f) + 0.15 * Math.sin(x * f * 2.7 + 1))); q.lineTo(A, piso); q.fill(); }
  const lado = 104; let mejor = 0; for (let i = 0; i < MIN.length; i++) if (S.st.rec[i]) mejor = i;
  for (let y = 0; y < 3; y++) for (let x = 0; x < 12; x++) {
    const r = azar(x + 500, y + 700, 5), tipo = r < 0.2 ? 10 + Math.max(0, mejor - Math.floor(r * 30)) : 1;
    q.drawImage(tile(1, zona, ((x + y) & 3) * 16 + h16(x, y)), x * lado, piso + y * lado, lado, lado); if (tipo !== 1) q.drawImage(tile(tipo, zona, 0), x * lado, piso + y * lado, lado, lado);
  }
  q.fillStyle = '#5c9e3a'; q.fillRect(0, piso, A, 12); q.fillStyle = '#7cc24e'; q.fillRect(0, piso, A, 5);
  const som = q.createLinearGradient(0, piso + 12, 0, B); som.addColorStop(0, '#00000052'); som.addColorStop(1, '#000000a0'); q.fillStyle = som; q.fillRect(0, piso + 12, A, B);
  q.textBaseline = 'alphabetic'; q.lineJoin = 'round';
  const texto = (t, x, y, tam, col = '#fff', peso = 900, al = 'left') => { q.font = `${peso} ${tam}px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif`; q.textAlign = al; q.lineWidth = tam * 0.17; q.strokeStyle = '#000c'; q.strokeText(t, x, y); q.fillStyle = col; q.fillText(t, x, y); };
  const miles = (n) => Math.round(n).toLocaleString('es-MX'), mundo = cfg.nombre || 'Mundo de ' + miNombre;
  texto('MINA', 46, 112, 104, '#ffd23f');
  let cifras, llamado;
  if (deMundo) {
    texto(mundo, 50, 172, 48);
    const n = Math.min(5, gente.length), tam = [300, 232, 200, 172, 150][n - 1], paso = tam * 1.27, x0 = A - 70 - tam / 2 - (n - 1) * paso;
    gente.slice(0, n).forEach((j, k) => { const x = x0 + k * paso; dibMaq(q, x, piso - tam * 0.395, tam, j.m, k % 2 ? -1 : 1, false, 0, '', '', 0.4); if (n > 1) texto(j.n, x, piso + 52, 29, '#fff', 800, 'center'); });
    cifras = [[miles(hondo) + ' m', 'lo más hondo'], [(cavadasMundo * 2 / 1000).toFixed(1) + ' km', 'de túneles'], [nHallados() + ' / 99', 'de la colección']];
    llamado = gente.length > 1 ? `Somos ${gente.length} maquinitas · entra y juega` : 'Entra a excavar conmigo';
  } else {
    texto(miNombre, 50, 176, 60); texto(RANGOS[S.rango][1] + ' · ' + mundo, 50, 222, 30, '#f3e6d8', 700);
    dibMaq(q, 950, piso - 300 * 0.395, 300, miModelo, -1, false, 0, '', '', 0.4, miPinta);
    cifras = [[miles(S.rec) + ' m', 'bajo tierra'], [fmt(S.tot), 'ganados'], S.alt >= 1000 ? [fmtAlto(S.alt), 'de altura'] : [S.log.length + '', S.log.length === 1 ? 'logro' : 'logros']];
    llamado = '¿Me alcanzas?';
  }
  const y1 = piso + (deMundo && gente.length > 1 ? 156 : 134), col = (A - 100) / 3, cabe = 330;
  const fuente = (peso, tam) => `${peso} ${tam}px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif`;
  cifras.forEach(([a, b], i) => {                    // la cifra se achica lo necesario para no invadir la columna de junto
    q.font = fuente(900, 84); const tam = Math.min(84, Math.floor(84 * cabe / Math.max(1, q.measureText(a).width)));
    texto(a, 50 + i * col, y1, tam, '#ffd23f'); texto(b, 53 + i * col, y1 + 44, 33, '#f3e6d8', 700);
  });
  q.font = fuente(900, 34); const an = q.measureText('▶  ' + llamado).width + 56;
  q.fillStyle = '#ffd23f'; q.beginPath(); q.roundRect(46, B - 86, an, 60, 30); q.fill(); q.lineWidth = 4; q.strokeStyle = '#2a1a14'; q.stroke();
  q.fillStyle = '#1b120e'; q.textAlign = 'left'; q.fillText('▶  ' + llamado, 74, B - 44);
  const libre = A - 46 - (46 + an + 30);             // la dirección va a la derecha solo si cabe completa; si no, nada más el dominio
  q.font = fuente(700, 26); const pie = q.measureText('Gratis · sin registro · ' + location.host).width <= libre ? 'Gratis · sin registro · ' + location.host : location.host;
  if (q.measureText(pie).width <= libre) texto(pie, A - 46, B - 44, 26, '#f3e6d8', 700, 'right');
  return c;
}
// Se suben solas cuando algo que enseñan cambió (un récord, alguien nuevo, otro objeto de la colección), sin estorbar el juego.
let fotoFirma = leer('mina_foto', {}), fotoT = 0;
function subirFotos(ya) {
  if (!conectado || !S || !ws || ws.readyState !== 1 || !mundoId) return;
  const ahora = Date.now(); if (ahora - fotoT < (ya ? 13000 : 150000)) return;
  if (!ya && corriendo && !(yo.suelo && yo.y < 0 && Math.abs(yo.vx) < 0.5)) return;      // dibujar las imágenes de liga espera a que la maquinita esté quieta en el pueblo
  if (fotoFirma.id !== mundoId) fotoFirma = { id: mundoId };
  const hondo = Math.max(S.rec, ...[...otros.values()].map((o) => o.rec || 0));
  const firmas = { 2: [cfg.nombre, miNombre, [...otros.values()].map((o) => o.n + o.m).join(','), Math.floor(hondo / 50), nHallados(), Math.floor(cavadasMundo / 400)].join('|'),
    3: [miNombre, miModelo, cfg.nombre, S.rec, Math.floor(Math.log10(1 + S.tot) * 10), S.rango, S.log.length].join('|') };
  for (const tipo of [2, 3]) {
    if (fotoFirma[tipo] === firmas[tipo]) continue;
    fotoFirma[tipo] = firmas[tipo]; fotoT = ahora; escribir('mina_foto', fotoFirma);
    const manda = (calidad) => fotoLiga(tipo === 2).toBlob(async (b) => {
      if (!b) return; if (b.size > 290000) return calidad > 0.6 ? manda(0.55) : 0;
      const u = new Uint8Array(b.size + 1); u[0] = tipo; u.set(new Uint8Array(await b.arrayBuffer()), 1);
      if (ws && ws.readyState === 1) ws.send(u);
    }, 'image/jpeg', calidad);
    manda(0.86);
  }
}
function pintarQR(lienzoQR, texto, lado = 8) {
  const R = qr(texto); if (!R) return false;
  const n = R.length, m = 4, q = lienzoQR.getContext('2d');
  lienzoQR.width = lienzoQR.height = (n + m * 2) * lado;
  q.fillStyle = '#fff'; q.fillRect(0, 0, lienzoQR.width, lienzoQR.height); q.fillStyle = '#000';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (R[y][x]) q.fillRect((x + m) * lado, (y + m) * lado, lado, lado);
  return true;
}

/* ════════ Menús ════════ RLR */
let mapaMenuT = 0, pestana = 0, pieza = 0, cuantos = 1, eleM = 0, ultVenta = 0, porCobrar = 0;      // porCobrar: lo vendido que todavía va «en camino» a la cartera
function abrir(id) {
  if (!S || (soloVer && id !== 'top')) return;
  son.clic();
  menu = id; detener(); $('#velo').classList.add('on'); $('#velo').classList.remove('inicio'); $('#caja').classList.toggle('alta', id === 'menu' || id === 'tal' || id === 'alm' || id === 'top' || id === 'pub' || id === 'pin');
  if (id === 'gas' && S.fuel >= tanque() - 0.001) evento('comb');   // llegar con el tanque lleno también cuenta
  pintarMenu(); ultPos = ''; enviarPos();
}
function cerrar() { if (menu === 'inicio') return; if (menu === 'pin') tienda.prueba = null; menu = null; $('#velo').classList.remove('on'); document.activeElement?.blur?.(); arrancar(); ultPos = ''; enviarPos(); if (sucio) enviarEst(); }
const cab = (t, sinX) => `<header><h2>${t}</h2><span class="d">${S && !soloVer ? fmt(S.d) : ''}</span>${sinX ? '' : '<button class="s" data-a="cerrar">Cerrar' + (tactil ? '' : ' (Esc)') + '</button>'}</header>`;
function pintarMenu() {
  const c = $('#caja'); let h = '';
  if (menu === 'gas') {
    const falta = Math.ceil(tanque() - S.fuel - 0.001), paga = Math.min(falta, Math.floor(S.d)), fiado = paga < 1 && S.fuel < 3;
    h = cab('⛽ Gasolinera') + `<div class="cuerpo"><p class="grande">${S.fuel.toFixed(1)} / ${tanque()} litros</p>
      <p class="nota">$1 por litro. Sin combustible, ${cfg.comb ? 'la maquinita explota' : 'entras en reserva: avanzas despacio y no perforas'}.</p>
      <button data-a="llenar" ${paga < 1 && !fiado ? 'disabled' : ''}><kbd>Enter</kbd>${falta < 1 ? 'Tanque lleno' : fiado ? 'No traes dinero: te fiamos 5 litros' : paga < falta ? `Cargar ${paga} L (${fmt(paga)}): es lo que te alcanza` : `Llenar el tanque (${fmt(falta)})`}</button></div>`;
  } else if (menu === 'bas') {
    // Todo lo que vas a vender cabe en una pantalla: dos columnas arriba y, siempre a la vista abajo, el total y el botón.
    const v = venta(), linea = (cls, punto, nombre, sub, monto, dato) => `<div class="vi ${cls}" data-q="${dato}"><i style="background:${punto}"></i><span><b>${nombre}</b><small>${sub}</small></span><u>${monto}</u></div>`;
    h = cab('⚖️ La Báscula') + (v.piezas ? `<div class="cuerpo"><div class="vende">` +
      S.carga.map((n, i) => n ? linea('', MIN[i].col, `${MIN[i].n} × ${n}`, fmt(MIN[i].v) + ' la pieza · ' + (n * MIN[i].kg).toLocaleString('es-MX') + ' kg', fmt(n * MIN[i].v), n * MIN[i].v) : '').join('') +
      (v.perfecto ? linea('bono', '#ffd23f', '✨ Viaje perfecto', 'Bodega llena y cero daño: +10 %', '+' + fmt(v.base * 0.1), v.base * 0.1) : '') +
      (v.cat ? linea('bono', '#ffd23f', '📖 Catálogo completo', '+5 % para siempre', '+' + fmt(v.base * 0.05), v.base * 0.05) : '') +
      `</div></div><footer class="pie"><div><small>${v.piezas} ${v.piezas === 1 ? 'pieza' : 'piezas'} · ${kgCarga().toLocaleString('es-MX')} kg en la báscula · se vende en</small><b id="totalVenta">${fmt(v.total)}</b></div><button id="bVender" data-a="vender"><kbd>Enter</kbd>Vender toda la carga</button></footer>`
      : `<div class="cuerpo">${ultVenta ? `<p class="nota">Tu última venta</p><p class="grande">${fmt(ultVenta)}</p>` : ''}<p class="nota">La bodega está vacía. Baja, recoge mineral y vuelve.</p></div>`);
  } else if (menu === 'tal') {
    const P = PZ[pieza];
    const hasta = Math.min(P.niv.length, S.eq[pieza] + 11);          // todo lo que ya compraste y las diez que siguen
    h = cab('🔧 El Taller') + `<div class="pest">${PZ.map((p, i) => `<button data-a="pieza" data-v="${i}" class="${i === pieza ? 'on' : ''}">${p.ic} ${p.n} <small>${S.eq[i]}/${p.niv.length - 1}</small></button>`).join('')}</div>
      <div class="cuerpo"><p class="nota">${P.que}${pieza === 0 ? ' La piedra también se perfora: la ' + PIEDRA.map((D, i) => D[1] + ' (' + ['Corteza', 'Acuífero', 'Cavernas', 'Cristalera', 'fondo'][i] + ') desde <b>' + P.niv[D[0]][0] + '</b>').join(', la ') + '. Con el taladro justo tarda 1.5 s; con tres niveles de sobra, 0.6 s.' : ''}${(pieza === 1 || pieza === 4) && cfg.gas ? ` Con lo que traes, aguantas una bolsa de gas hasta <b>${gasSeguro() < 650 ? 'ninguna profundidad' : gasSeguro() >= H * 2 ? 'el fondo' : gasSeguro() + ' m'}</b> (el gas empieza a los 650 m).` : ''}</p>` + P.niv.slice(0, hasta).map((n, i) => {
      const tengo = i <= S.eq[pieza], act = i === S.eq[pieza];
      return `<div class="fila ${act ? 'act' : tengo ? 'tengo' : ''}"><div class="t"><b>${n[0]}${act ? ' · lo que traes' : ''}</b><small>${n[3]}</small><small>${act || tengo ? n[2] + ' ' + P.u : `<b style="display:inline;color:var(--ok)">${nv(pieza)} → ${n[2]}</b> ${P.u}`}</small></div>
        ${tengo ? '<div class="v ya">✓</div>' : `<div class="v">${fmt(n[1])}</div><button data-a="mejorar" data-v="${i}" ${S.d < n[1] ? 'disabled' : ''}>${i === S.eq[pieza] + 1 && S.d >= n[1] ? '<kbd>Enter</kbd>' : ''}Comprar</button>`}</div>`;
    }).join('') + (hasta < P.niv.length ? `<p class="nota">Hay ${P.niv.length - hasta} ${P.niv.length - hasta === 1 ? 'mejora' : 'mejoras'} más allá. Se van asomando conforme compras.</p>` : S.eq[pieza] === P.niv.length - 1 ? '<p class="nota">Tienes lo mejor que existe… en esta capa.</p>' : '') + '</div>';
  } else if (menu === 'alm') {
    const dano = vidaMax() - S.vida, costo = Math.ceil(dano * 15), puede = Math.min(costo, Math.floor(S.d));
    h = cab('🧰 El Almacén') + `<div class="cuerpo"><div class="fila"><div class="ic">🛠️</div><div class="t"><b>Reparar el casco</b><small>${Math.ceil(S.vida)} / ${vidaMax()} de vida · $15 por punto</small></div>
      <div class="v">${dano > 0.01 ? fmt(costo) : ''}</div><button data-a="reparar" ${dano <= 0.01 || puede < 1 ? 'disabled' : ''}>${dano > 0.01 && puede >= 1 ? '<kbd>Enter</kbd>' : ''}${dano <= 0.01 ? 'Intacto' : puede < costo ? 'Reparar lo que alcance' : 'Reparar'}</button></div>
      <div class="cant"><span>Comprar de a</span>${[1, 5, 10, 50, 100].map((q) => `<button class="s${q === cuantos ? ' on' : ''}" data-a="cuantos" data-v="${q}">${q}</button>`).join('')}</div>` +
      OBJ.map((o, i) => `<div class="fila"><div class="ic">${o.ic}</div><div class="t"><b>${o.n} <small style="display:inline">${tactil ? '' : '· tecla ' + o.k + ' '}· tienes ${S.obj[i]}</small></b><small>${o.h}</small><small>${o.ef}</small></div>
      <div class="v">${fmt(o.p * cuantos)}</div><button data-a="objeto" data-v="${i}" ${S.d < o.p * cuantos ? 'disabled' : ''}><kbd>${o.k}</kbd>Comprar${cuantos > 1 ? ' ' + cuantos : ''}</button></div>`).join('') + '</div>';
  } else if (menu === 'ele') {
    const u = ultimoPunto(), fila = (ic, n, sub, m, v) => `<div class="fila"><div class="ic">${ic}</div><div class="t"><b>${n}</b><small>${sub}</small></div><div class="v">${fmt(costoEle(m))}</div><button data-a="bajar" data-v="${v}" ${S.d >= costoEle(m) ? '' : 'disabled'}>Bajar</button></div>`;
    const tope = Math.floor(S.rec / 10) * 10, def = Math.max(10, Math.min(tope, eleM || tope));
    h = cab('🛗 El Elevador') + `<div class="cuerpo"><p class="nota">El malacate te baja en un instante: a un lugar que ya descubriste o a los metros que tú digas. Cobra $50 por metro. Para subir, la grúa (tecla G).</p><div class="dos"><div>
      <h4>A un lugar</h4>` +
      (u ? fila('📍', 'Donde te quedaste', `A ${Math.round((u.y + HH) * 2).toLocaleString('es-MX')} m: donde te recogió la grúa o el rescate.`, (u.y + HH) * 2, 'u') : '<div class="fila tengo"><div class="ic">📍</div><div class="t"><b>Donde te quedaste</b><small>Cuando la grúa te suba desde abajo, aquí aparecerá ese punto para regresar.</small></div></div>') +
      LUGARES.map((L, i) => [L, i]).sort((a, b) => a[0].m - b[0].m).map(([L, i]) => S.lug[i] ? fila(L.ic, L.n, L.tx, L.m, i) : `<div class="fila tengo"><div class="ic">❔</div><div class="t"><b>Lugar sin descubrir</b><small>Dicen que hay algo cerca de los ${L.m.toLocaleString('es-MX')} m.</small></div></div>`).join('') +
      `</div><div><h4>A los metros que quieras</h4>` + (tope >= 10 ? `<p class="nota">Tan abajo como ya hayas llegado: tu récord es de ${S.rec.toLocaleString('es-MX')} m. Si ahí no hay túnel, el elevador abre un hueco.</p>
        <div class="metros"><input id="eleM" type="number" inputmode="numeric" min="10" max="${tope}" step="10" value="${def}"><span>m</span></div>
        <input id="eleR" type="range" min="10" max="${tope}" step="10" value="${def}">
        <div class="fila"><div class="t"><b id="eleP" class="v">${fmt(costoEle(def))}</b><small>$50 por metro</small></div><button id="eleB" data-a="bajarA" ${S.d >= costoEle(def) ? '' : 'disabled'}>Bajar</button></div>` : '<p class="nota">Todavía no has bajado. Perfora un poco y aquí podrás elegir a cuántos metros volver.</p>') + '</div></div></div>';
  } else if (menu === 'rem') {
    const c = costoRemin(), puedo = cfg.reminTodos || soyCreador;
    h = cab('🌋 La Remineralizadora') + `<div class="cuerpo"><p>Vuelve a llenar de mineral <b>todo el tablero</b>: tierra nueva, minerales nuevos, hallazgos nuevos y peligros en lugares nuevos.</p>
      <p class="nota">Los túneles se cierran. Tu dinero, tu equipo, tus objetos y tus récords no se tocan. Todos ven una cuenta regresiva de 10 segundos y quien esté bajo tierra sube a salvo con su carga.</p>
      <p class="grande">${fmt(c)}</p>
      <p class="nota">Cuesta el <b>5 % de todo lo que has ganado</b> (llevas ${fmt(S.tot)}). Entre más ganes, más cuesta.${S.d < c ? ' Te faltan ' + fmt(c - S.d) + '.' : ''}</p>
      <button data-a="remin" ${!puedo || S.d < c || cuentaFin ? 'disabled' : ''}>${puedo ? 'Remineralizar el tablero' : 'Solo quien creó el mundo puede hacerlo'}</button></div>`;
  } else if (menu === 'inv') {
    const liga = location.origin + '/' + mundoId;
    const T = horaTorreon(), aLas = (dias, H) => Date.UTC(T.y, T.mes - 1, T.dia + dias, H + 6), chipsCita = [[aLas(0, 20), 'Hoy 8 pm'], [aLas(0, 21), 'Hoy 9 pm'], [aLas(1, 20), 'Mañana 8 pm'], [aLas(1, 21), 'Mañana 9 pm']].filter(([h]) => h > Date.now());
    h = cab('👥 Invita a tu gente') + `<div class="cuerpo" style="text-align:center"><p>Quien abra tu liga entra a <b>${esc(cfg.nombre || 'este mundo')}</b> con su propia maquinita, sin registro, y ve que lo invitaste tú. Cada maquinita nueva da $500 a todos.</p>
      <textarea id="msjInv" rows="4" style="width:100%;box-sizing:border-box;font:inherit;background:#0006;color:#fff;border:1px solid var(--borde);border-radius:10px;padding:8px">${esc(mensajeInvitacion())}</textarea>
      <p><button data-a="wa" style="background:#25d366;color:#07301c">📲 Mandar por WhatsApp</button> ${navigator.share ? '<button data-a="compartir">📤 Compartir…</button>' : ''} <button class="s" data-a="invitar">Copiar la liga</button></p>
      <h4>🕘 ¿A qué hora nos juntamos?</h4>${cita ? `<p>Nos vemos <b>${horaCitaTx(cita.h)}</b> · ${(cita.voy || []).length === 1 ? 'va 1' : 'van ' + (cita.voy || []).length}${(cita.voy || []).includes(miI) ? ' (tú vas)' : ''}. Va en el mensaje y en la vista previa de la liga.</p><p><button class="s" data-a="voy" data-v="${(cita.voy || []).includes(miI) ? 0 : 1}">${(cita.voy || []).includes(miI) ? 'Ya no voy' : 'Voy'}</button> <button class="s" data-a="citaQuitar">Quitar la cita</button></p>` : '<p class="nota">Para ponerse de acuerdo: la hora se ve arriba a la derecha, va en el mensaje y en la vista previa de la liga, y cada quien dice si va. Todo en hora de Torreón.</p>'}
      <div class="chips" style="justify-content:center">${chipsCita.map(([h, t]) => `<button class="s" data-a="cita" data-v="${h}">${t}</button>`).join('')}<input id="citaOtra" type="datetime-local" style="font:inherit;background:#0006;color:#fff;border:1px solid var(--borde);border-radius:8px;padding:4px 6px"><button class="s" data-a="citaOtra">Otra hora</button></div>
      <h4>Código QR</h4><a href="${liga}" target="_blank" rel="noopener" title="Abrir la liga"><canvas id="qrLienzo" class="qr" data-t="${ligaInvitacion()}"></canvas></a>
      <p><code>${liga}</code></p>
      <p><button class="s" data-a="presumir">Copiar mi liga (presume tu maquinita)</button> <button class="s" data-a="menu" data-v="foto">📸 Foto para presumir</button></p>
      <p class="nota">Con el teléfono: apunta la cámara al código y se abre el mundo. Quien entra ya está jugando: no hay registro ni nada que llenar. El mundo se queda tal cual cuando se van; con la misma liga vuelven cuando quieran.</p>
      <p class="nota" style="margin-top:14px">Así se ve la liga del mundo cuando la mandas por WhatsApp. Se actualiza sola con cada récord.</p><div id="ligaAqui" data-m="1"></div>
</div>`;
  } else if (menu === 'foto') {
    h = cab('📸 Presume tu maquinita') + `<div class="cuerpo" style="text-align:center"><div id="fotoAqui"></div>
      <p><button data-a="compartirFoto">${navigator.canShare ? 'Compartir la foto' : 'Descargar la foto'}</button> <button class="s" data-a="presumir">Copiar mi liga</button> <button class="s" data-a="invitar">Copiar la liga del mundo</button></p>
      <p class="nota">La foto lleva tu maquinita, tus récords y el código QR de este mundo: quien lo escanee entra a excavar contigo.</p></div>`;
  } else if (menu === 'qrmaq') {
    const liga = location.origin + '/' + mundoId + '#maquinita=' + miK;
    h = cab('Tu maquinita en otro equipo') + `<div class="cuerpo" style="text-align:center"><p>Abre este código en tu otro equipo y <b>${esc(miNombre)}</b> llega con todo lo que trae.</p>
      <a href="${esc(liga)}" target="_blank" rel="noopener" title="Abrir la liga"><canvas id="qrLienzo" class="qr" data-t="${esc(liga)}"></canvas></a>
      <p><button data-a="ligaMaq">Copiar la liga de mi maquinita</button></p>
      <p class="nota"><b>No lo compartas ni lo enseñes en pantalla:</b> quien lo abra maneja tu maquinita. Para invitar gente usa el botón Invitar.</p></div>`;
  } else if (menu === 'pin') {
    if (!op.tiendaVista) { op.tiendaVista = 1; escribir('mina_op', op); }
    if (!tienda.cargada && !tienda.cargando) cargarTienda();
    c.classList.add('alta'); h = htmlTienda();
  } else if (menu === 'pub') h = cab('👥 Tu mundo y su público') + '<div class="cuerpo">' + htmlPublico() + '</div>';
  else if (menu === 'top') h = cab('🏆 Top 33 mundial') + '<div class="cuerpo">' + htmlTop() + '</div>';
  else if (menu === 'menu') h = menuPrincipal();
  else return;
  const sube = c.querySelector('.cuerpo')?.scrollTop || 0, misma = c._m === menu + pieza; c._m = menu + pieza;
  c.innerHTML = h + (tactil || !listo ? '' : `<div class="tecl">${TECLAS_MENU[menu] ? TECLAS_MENU[menu] + ' · ' : ''}<kbd>↑</kbd> <kbd>↓</kbd> recorren · <kbd>Esc</kbd> cierra</div>`);
  const cu = c.querySelector('.cuerpo'), act = menu === 'tal' && c.querySelector('.fila.act');
  if (cu && !misma && movil) cu.classList.add('entra');
  if (cu) { if (misma) cu.scrollTop = sube; else if (act) cu.scrollTop = Math.max(0, act.offsetTop - cu.offsetTop - 70); }
  const mp = $('#mapa'); if (mp) {
    pintarMapa(mp); c.querySelector('.cuerpo').scrollTop = Math.max(0, mp.offsetTop + Math.max(0, yo.y) / (mp.height / mp.clientHeight) - 220);
    clearInterval(mapaMenuT); mapaMenuT = setInterval(() => { const m2 = $('#mapa'); if (!m2 || menu !== 'menu' || pestana !== 2) return clearInterval(mapaMenuT); pintarMapa(m2); }, 300);      // en vivo mientras esté abierto
  }
  const cm = $('#miMaq'); if (cm) dibMaq(cm.getContext('2d'), 80, 86, 132, miModelo, 1, false, 0, '', '', 0.6, miPinta);
  const gb = $('#gBoton'); if (gb) botonGoogle(gb);
  const lc = $('#caja [data-login-ct]'); if (lc && window.LoginCT) LoginCT.montar(lc);
  const pm = $('#pintaMaq'); if (pm) {                 // la maquinita, en vivo, con lo que se esté probando
    const dib = () => { const q = pm.getContext('2d'); q.clearRect(0, 0, pm.width, pm.height); dibMaq(q, pm.width / 2, pm.height * 0.58, pm.width * 0.6, miModelo, 1, false, 0, miNombre, '', reloj * 0.4, pintaVista()); };
    dib(); clearInterval(tiendaAnimT); tiendaAnimT = setInterval(() => { if (menu !== 'pin' || !pm.isConnected) return clearInterval(tiendaAnimT); reloj += 0.05; dib(); }, 50);
  }
  if (topAbierta()) { animarTop(c); if (Date.now() - tablaM.pedido > 3500) pedirTop(); }
  const ql = $('#qrLienzo'); if (ql) pintarQR(ql, ql.dataset.t, 8);
  const fa = $('#fotoAqui'); if (fa) { const f = fotoRecord(); f.className = 'foto'; fa.appendChild(f); }
  for (const id of ['#ligaAqui']) { const la = $(id); if (la) { const f = fotoLiga(!!la.dataset.m); f.className = 'foto'; f.style.width = 'min(100%,520px)'; f.style.height = 'auto'; la.appendChild(f); subirFotos(true); } }
  c.querySelectorAll('#modelos canvas').forEach((x, i) => dibMaq(x.getContext('2d'), 56, 60, 100, i, 1, false, 0, '', ''));
}
// El mapa: 3 px por celda a lo ancho y 1 px por cada 2 celdas a lo alto (10 km caben en 2,500 px).
// ── El mapa: una imagen del mundo de 96 × 5,000 (un píxel por celda) donde solo se ve lo descubierto: lo cavado y lo que
//    alcanza a ver la lámpara alrededor (2 celdas), los lugares ya descubiertos completos y la superficie. Lo demás queda
//    como «no descubierto». Se rehace cuando cambia el terreno, a lo mucho una vez por segundo y medio.
let mapaImg = null, mapaImgQ = null, mapaImgD = null, mapaFirma = '', mapaT = -9999;
const visto = new Uint8Array(W * H);
const rgbDe = (hex, k = 0) => { const n = parseInt(hex.slice(1), 16), m = k < 0 ? 0 : 255, a = Math.abs(k), c = (v) => Math.round(v + (m - v) * a); return [c(n >> 16), c((n >> 8) & 255), c(n & 255)]; };
function zonaLugar(i) {                     // filas donde vive cada lugar, para encenderlo completo al descubrirlo
  const L = LUGARES[i]; if (L.t) return [Math.floor(L.cy - L.ry * 1.25 - 1), Math.ceil(L.cy + L.ry * 1.25 + 1)];
  return [[AGUA0 - 2, AGUA1 + 3], [1468, 1522], [2788, 2827], [4878, 4952]][i];
}
function armarMapa() {
  const firma = dugCambios + '|' + remin + '|' + (S ? S.lug.join('') : '') + '|' + cfg.verGas;
  if (mapaImg && (firma === mapaFirma || performance.now() - mapaT < 1500)) return mapaImg;
  mapaFirma = firma; mapaT = performance.now();
  if (!mapaImg) { mapaImg = document.createElement('canvas'); mapaImg.width = W; mapaImg.height = H; mapaImgQ = mapaImg.getContext('2d'); mapaImgD = mapaImgQ.createImageData(W, H); }
  visto.fill(0); visto.fill(1, 0, W * 2);
  for (let i = 0; i < dug.length; i++) { const b = dug[i]; if (!b) continue; for (let k = 0; k < 8; k++) if (b & (1 << k)) { const c = i * 8 + k, x = c % W, y = (c - x) / W; for (let yy = Math.max(0, y - 2); yy <= Math.min(H - 1, y + 2); yy++) for (let dx = -2; dx <= 2; dx++) visto[yy * W + ((x + dx + W) % W)] = 1; } }
  if (S) LUGARES.forEach((L, i) => { if (!S.lug[i]) return; const [a, b] = zonaLugar(i); for (let y = Math.max(0, a); y <= Math.min(H - 1, b); y++) for (let x = 0; x < W; x++) if (!visto[y * W + x] && lugarDe(x, y, true) === i) visto[y * W + x] = 1; });
  const px = mapaImgD.data, Z = TIERRA.map((t) => rgbDe(t[0], -0.3)), PZ2 = PIEDRA.map((p) => rgbDe(p[2][0], -0.15)), MC = MIN.map((m) => rgbDe(m.col));
  const HUECO_C = [236, 226, 206], AGUA_C = [74, 152, 206], LAVA_C = [255, 122, 40], GAS_C = [126, 214, 120], FIRME_C = [62, 60, 62], LADR_C = [166, 96, 72], ORO_C = [255, 210, 63], EDEN_C = [150, 214, 140];
  for (let y = 0, i = 0; y < H; y++) {
    const z = zonaDe((y + 1) * 2), dirt = Z[z], piedra = PZ2[durezaDe((y + 1) * 2)];
    for (let x = 0; x < W; x++, i++) {
      let c;
      if (!visto[i]) { const f = ((x >> 2) + (y >> 2)) & 1; px[i * 4] = f ? 26 : 21; px[i * 4 + 1] = f ? 20 : 16; px[i * 4 + 2] = f ? 16 : 13; px[i * 4 + 3] = 255; continue; }      // no descubierto
      const t = celda(x, y);
      c = t === 0 ? (y >= EDEN0 ? EDEN_C : HUECO_C) : t === 6 ? AGUA_C : t === 2 ? piedra : t === 3 ? LAVA_C : t === 4 ? (cfg.verGas === 1 ? GAS_C : dirt) : t === 5 ? FIRME_C : t === 7 ? LADR_C : t >= 10 && t < 10 + MIN.length ? MC[t - 10] : t >= 40 ? ORO_C : dirt;
      px[i * 4] = c[0]; px[i * 4 + 1] = c[1]; px[i * 4 + 2] = c[2]; px[i * 4 + 3] = 255;
    }
  }
  mapaImgQ.putImageData(mapaImgD, 0, 0);
  return mapaImg;
}
// Dónde va cada maquinita: con el juego corriendo, su posición dibujada; con un menú abierto, la última que llegó.
const posDe = (o) => { const b = o.b && o.b[o.b.length - 1]; return o.x !== undefined ? [o.x, o.y] : b ? [b.x, b.y] : null; };
function quienesEnMapa() {
  const l = [];
  if (!soloVer && S) l.push({ i: miI, n: miNombre, p: [vis.x, vis.y], yo: 1 });
  for (const o of otros.values()) { if (!o.on) continue; const p = posDe(o); if (p) l.push({ i: o.i, n: o.n, p }); }
  return l;
}
// Una ventana del mapa: filas y0 a y0 + filas, en el rectángulo (0, 0, cw, ch). Encima, cada maquinita con su color.
function dibujarMapa(q, cw, ch, y0, filas, conIconos) {
  const img = armarMapa(), k = ch / filas;
  q.imageSmoothingEnabled = false;
  q.fillStyle = '#5f83bd'; if (y0 < 0) q.fillRect(0, 0, cw, Math.min(ch, -y0 * k));      // el cielo
  const a = Math.max(0, Math.floor(y0)), b = Math.min(H, Math.ceil(y0 + filas));
  if (b > a) q.drawImage(img, 0, a, W, b - a, 0, (a - y0) * k, cw, (b - a) * k);
  if (b < y0 + filas) { q.fillStyle = '#0b0807'; q.fillRect(0, (b - y0) * k, cw, ch); }
  if (conIconos && S) { q.font = `${Math.max(12, Math.round(cw / 26))}px system-ui,"Apple Color Emoji","Segoe UI Emoji"`; q.textAlign = 'center'; q.textBaseline = 'middle'; LUGARES.forEach((L, i) => { if (!S.lug[i]) return; const y = (L.y - y0) * k; if (y > -10 && y < ch + 10) q.fillText(L.ic, (L.x + 0.5) / W * cw, y); }); }
  for (const j of quienesEnMapa().sort((u, v) => (u.yo ? 1 : 0) - (v.yo ? 1 : 0))) {     // yo, encima de todos
    const x = (((j.p[0] % W) + W) % W) / W * cw, yy = (j.p[1] - y0) * k, y = Math.max(7, Math.min(ch - 7, yy)), r = j.yo ? 6 : 5;
    q.fillStyle = j.yo ? '#ffd23f' : colorTx(j.i); q.strokeStyle = '#000'; q.lineWidth = 2;
    if (yy < 0 || yy > ch) { q.beginPath(); const s = yy < 0 ? -1 : 1; q.moveTo(x, y + s * r); q.lineTo(x - r, y - s * r * 0.6); q.lineTo(x + r, y - s * r * 0.6); q.closePath(); q.fill(); q.stroke(); }      // fuera de la ventana: una flechita en la orilla
    else { q.beginPath(); q.arc(x, y, r, 0, 7); q.fill(); q.stroke(); if (enPleito(j.i)) { q.strokeStyle = 'rgba(255,107,90,' + (0.5 + 0.5 * Math.sin(performance.now() / 160)) + ')'; q.lineWidth = 3; q.beginPath(); q.arc(x, y, r + 5, 0, 7); q.stroke(); q.font = `${Math.max(12, r * 2.4)}px system-ui,"Apple Color Emoji","Segoe UI Emoji"`; q.textAlign = 'center'; q.textBaseline = 'middle'; q.fillText('⚔️', x, y - r - 11); } if (j.yo) { q.strokeStyle = 'rgba(255,210,63,' + (0.5 + 0.5 * Math.sin(performance.now() / 260)) + ')'; q.lineWidth = 2; q.beginPath(); q.arc(x, y, r + 4, 0, 7); q.stroke(); } }
  }
}
// El mapa del menú: el mundo completo de arriba abajo, con la profundidad y los lugares a la derecha (fuera del mapa).
function pintarMapa(cv) {
  const A = 4, an = W * A, ex = 330, alto = H;
  if (cv.width !== an + ex) { cv.width = an + ex; cv.height = alto; }
  const q = cv.getContext('2d'); q.clearRect(0, 0, cv.width, cv.height);
  dibujarMapa(q, an, alto, 0, H, false);
  q.font = '600 13px system-ui'; q.textBaseline = 'middle'; q.textAlign = 'left';
  for (let m = 0; m <= 10000; m += 500) { const y = Math.min(alto - 8, Math.max(8, m / 2)); q.fillStyle = '#ffffff1f'; q.fillRect(0, m / 2, an, 1); q.fillStyle = '#c9b29c'; q.fillText(m.toLocaleString('es-MX') + ' m', an + 8, y); }
  LUGARES.forEach((L, i) => { const y = Math.min(alto - 8, L.y); if (S.lug[i]) { q.fillStyle = '#ffd23f'; q.fillText(L.ic + ' ' + L.n, an + 78, y); q.fillStyle = '#ffd23f66'; q.fillRect(an - 6, y - 1, 6, 2); } else { q.fillStyle = '#ffffff44'; q.fillText('❔ sin descubrir', an + 78, y); } });
}

// ── El mapa de un lado: se abre de izquierda a derecha como el chat (y encima de él, si está abierto). Arriba, quién está
//    jugando y a qué profundidad; a la izquierda, todo el mundo en una tira con la marca de cada quien; al centro, la zona
//    alrededor de tu maquinita (o de la que estés mirando), sin nombres encima para que no estorben.
const mapaL = { abierto: false, y0: 0, libre: false };
function abrirMapa() { if (!listo) return; mapaL.abierto = true; mapaL.libre = false; document.body.classList.add('mapa'); pintarMapaLat(true); }
function cerrarMapa() { mapaL.abierto = false; document.body.classList.remove('mapa'); }
function pintarMapaLat(ya) {
  if (!mapaL.abierto || !S) return;
  const vista = $('#mapaVista'), tira = $('#mapaTira'), dpr = Math.min(2, window.devicePixelRatio || 1);
  const cw = vista.clientWidth, ch = vista.clientHeight, tw = tira.clientWidth; if (!cw || !ch) return;
  if (vista.width !== Math.round(cw * dpr) || vista.height !== Math.round(ch * dpr)) { vista.width = Math.round(cw * dpr); vista.height = Math.round(ch * dpr); }
  if (tira.width !== Math.round(tw * dpr) || tira.height !== Math.round(ch * dpr)) { tira.width = Math.round(tw * dpr); tira.height = Math.round(ch * dpr); }
  const filas = ch / 1.15;                                    // poco más de una fila por píxel: así ningún túnel se pierde
  const sig = soloVer ? otros.get(veo) : null, ty = soloVer ? (sig && posDe(sig) ? posDe(sig)[1] : 0) : vis.y;
  if (!mapaL.libre) { const meta = ty - filas / 2; mapaL.y0 = ya ? meta : mapaL.y0 + (meta - mapaL.y0) * 0.12; }
  mapaL.y0 = Math.max(-filas * 0.25, Math.min(H - filas * 0.75, mapaL.y0));
  const q = vista.getContext('2d'); q.setTransform(dpr, 0, 0, dpr, 0, 0); dibujarMapa(q, cw, ch, mapaL.y0, filas, true);
  // la tira: el mundo entero y dónde anda cada quien
  const t = tira.getContext('2d'), k = ch / H; t.setTransform(dpr, 0, 0, dpr, 0, 0); t.imageSmoothingEnabled = true;
  t.drawImage(armarMapa(), 0, 0, W, H, 0, 0, tw, ch);
  t.strokeStyle = '#fff'; t.lineWidth = 1.5; t.strokeRect(1, Math.max(0, mapaL.y0) * k, tw - 2, Math.max(4, filas * k));
  for (const j of quienesEnMapa()) { t.fillStyle = j.yo ? '#ffd23f' : colorTx(j.i); t.fillRect(0, Math.max(0, Math.min(ch - 3, j.p[1] * k - 1.5)), tw, 3); }
  // quién está jugando y dónde
  const l = quienesEnMapa();
  poner($('#mapaQuien'), l.map((j) => `<button class="s" data-mi="${j.i}" style="--c:${j.yo ? '#ffd23f' : colorTx(j.i)}"><i></i>${esc(j.n)}${j.yo ? ' (tú)' : ''}<small>${donde(j.p[1])}</small></button>`).join('') + (mapaL.libre ? '<button data-mi="centrar">◎ Volver a mí</button>' : ''));
}
$('#mapaX').addEventListener('click', () => { audio(); cerrarMapa(); });
$('#bMapa').addEventListener('click', (e) => { audio(); e.currentTarget.blur(); if (mapaL.abierto) cerrarMapa(); else abrirMapa(); });
$('#mapaQuien').addEventListener('click', (e) => {
  const b = e.target.closest('[data-mi]'); if (!b) return;
  if (b.dataset.mi === 'centrar') { mapaL.libre = false; return; }
  const j = quienesEnMapa().find((x) => String(x.i) === b.dataset.mi); if (!j) return;
  if (j.yo) { mapaL.libre = false; return; }
  mapaL.libre = true; mapaL.y0 = j.p[1] - $('#mapaVista').clientHeight / 1.15 / 2;
});
$('#mapaVista').addEventListener('wheel', (e) => { e.preventDefault(); e.stopPropagation(); mapaL.libre = true; mapaL.y0 += (e.deltaMode === 1 ? 30 : 1) * e.deltaY * 0.9; }, { passive: false });
$('#mapaTira').addEventListener('click', (e) => { const r = e.currentTarget.getBoundingClientRect(); mapaL.libre = true; mapaL.y0 = (e.clientY - r.top) / r.height * H - $('#mapaVista').clientHeight / 1.15 / 2; });
setInterval(() => { if (mapaL.abierto && !corriendo) pintarMapaLat(); }, 250);      // con el juego detenido (un menú abierto) también se mueve

// El mundo en un archivo:// El mundo en un archivo: semilla, reglas, todo lo cavado y la colección. Con él se puede abrir una copia idéntica cuando sea.
function archivoDelMundo(conTerreno) {
  let fin = dug.length; while (fin > 0 && !dug[fin - 1]) fin--;
  let b = ''; for (let i = 0; i < fin; i += 8192) b += String.fromCharCode.apply(null, dug.subarray(i, Math.min(fin, i + 8192)));
  return { formato: 'mina-mundo', version: 1, guardado: new Date().toISOString(), nombre: cfg.nombre || 'Mundo', seed, remin, cfg, col: [...hallados].map((v, i) => (v ? i : -1)).filter((i) => i >= 0), ancho: W, alto: H, dug: btoa(b),
    ...(conTerreno ? { gen: mundoGen, mapa: (() => { const u = empacar(); let t = ''; for (let i = 0; i < u.length; i += 8192) t += String.fromCharCode.apply(null, u.subarray(i, Math.min(u.length, i + 8192))); return btoa(t); })() } : { terreno: mapaHash ? { r: remin, h: mapaHash } : null, sinMineral }) };
}
function venta() {
  const base = S.carga.reduce((a, n, i) => a + n * MIN[i].v, 0), piezas = nCarga();
  const perfecto = piezas > 0 && piezas === bodega() && !S.vj.dano, cat = catalogoCompleto();
  return { base, piezas, perfecto, cat, total: Math.floor(base * (1 + (perfecto ? 0.1 : 0) + (cat ? 0.05 : 0))) };
}
const costoEle = (m) => Math.max(500, Math.round(m * 50));
function ultimoPunto() { const u = S.ult; return u && u.mu === mundoId && u.r === remin && !solida(Math.floor(u.x), Math.floor(u.y)) ? u : null; }
// Remineralizar cuesta el 5 % de todo lo que esta maquinita ha ganado en su vida: entre más llevas, más cuesta, para siempre.
function costoRemin() { return Math.max(500, Math.ceil(S.tot * 0.05)); }

const acciones = {
  cerrar,
  llenar() {
    const antes = S.fuel / tanque(), l = Math.min(Math.ceil(tanque() - S.fuel - 0.001), Math.floor(S.d));
    if (l < 1) { if (S.fuel >= 3) return; S.fuel = Math.min(tanque(), S.fuel + 5); son.combustible(); evento('comb'); return; }   // fiado
    S.d -= l; S.fuel = Math.min(tanque(), S.fuel + l); S.st.comb += l; son.combustible();
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
    // La venta es una ceremonia, sin prisa: cada renglón se cobra con su moneda, el total va creciendo,
    // entran los bonos y al final todo el dinero se va a la cartera.
    ultVenta = v.total; porCobrar = v.total;
    const caja = $('#caja'), filas = [...caja.querySelectorAll('.vi')], tot = $('#totalVenta'), cartera = caja.querySelector('header .d'), boton = $('#bVender');
    if (boton) { boton.disabled = true; boton.textContent = 'Vendiendo…'; }
    if (tot) tot.textContent = fmt(0);
    const vivo = () => tot && tot.isConnected, espera = (ms) => new Promise((r) => setTimeout(r, ms));
    const rodar = async (el, a, b, ms, tic) => { const t0 = performance.now(); let n = 0; while (performance.now() - t0 < ms) { const k = (performance.now() - t0) / ms; if (el && el.isConnected) el.textContent = fmt(a + (b - a) * (1 - Math.pow(1 - k, 2))); if (tic && n++ % 2 === 0) son.moneda(Math.min(24, Math.floor(k * 24))); await espera(34); } if (el && el.isConnected) el.textContent = fmt(b); };
    const volar = (de, a, txt) => { if (!de || !a || !de.isConnected) return; const r1 = de.getBoundingClientRect(), r2 = a.getBoundingClientRect(), m = document.createElement('span'); m.className = 'moneda'; m.textContent = txt; m.style.left = r1.right - 40 + 'px'; m.style.top = r1.top + r1.height / 2 - 12 + 'px'; document.body.appendChild(m); requestAnimationFrame(() => { m.style.transform = `translate(${r2.left + r2.width / 2 - r1.right + 30}px, ${r2.top - r1.top}px) scale(0.6)`; m.style.opacity = '0.2'; }); setTimeout(() => m.remove(), 650); };
    (async () => {
      let suma = 0; const paso = Math.max(170, Math.min(520, 3200 / Math.max(1, filas.length)));
      for (let k = 0; k < filas.length; k++) {
        const f = filas[k], q = +f.dataset.q || 0, bono = f.classList.contains('bono');
        if (vivo()) { f.classList.add('cobrado'); volar(f, tot, bono ? '✨' : '🪙'); }
        if (bono) { await espera(260); campana(1319, 0.5, 0.09, 'tesoro'); campana(1976, 0.6, 0.07, 'tesoro', 0.1); } else son.moneda(Math.min(24, k * 2));
        await rodar(tot, suma, suma + q, paso * (bono ? 1.5 : 0.85), false); suma += q;
      }
      if (vivo()) { tot.textContent = fmt(v.total); tot.classList.add('listo'); }
      await espera(550);
      // …y se jala a la cartera
      if (vivo()) { volar(tot, cartera, '💰'); tot.classList.add('sefue'); }
      await Promise.all([rodar(cartera, desde, desde + v.total, 1500, true), (async () => { const t0 = performance.now(); while (performance.now() - t0 < 1500) { porCobrar = v.total * (1 - (performance.now() - t0) / 1500); pintarHud(true); await espera(60); } })()]);
      porCobrar = 0; pintarHud(true); son.venta(); tablaM.pedido = Date.now() - 54000;       // en unos segundos se pregunta la tabla: a ver en qué lugar quedaste
      if (cartera && cartera.isConnected) { cartera.classList.add('pum'); setTimeout(() => cartera.classList.remove('pum'), 500); }
      await espera(700);
      if (menu === 'bas') pintarMenu();
    })();
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
  bajar(v) {
    let x, y, m;
    if (v === 'u') { const u = ultimoPunto(); if (!u) return; x = u.x; y = u.y; m = (y + HH) * 2; }
    else { const L = LUGARES[+v]; if (!L || !S.lug[+v]) return; let lx = L.x, cy = L.y; if (solida(lx, cy)) { while (lx < L.x + 6 && (celda(lx, cy) >= 10 || celda(lx, cy) === 5)) lx++; if (solida(lx, cy)) cavar([[lx, cy]]); } while (cy < H - 1 && cy < L.y + 40 && !solida(lx, cy + 1)) cy++; x = lx + 0.5; y = cy + 1 - HH; m = L.m; }
    const c = costoEle(m);
    if (S.d < c || solida(Math.floor(x), Math.floor(y))) return;
    S.d -= c; yo.x = x; yo.y = y; yo.vx = yo.vy = 0; yo.perf = null; vistaLibre = false; son.tele(); sucio = true;
    cerrar(); chispas(x, y, '#ffb347', 30, 8); tarjeta('🛗 El Elevador · ' + fmt(c), 'Llegaste a ' + Math.round(m).toLocaleString('es-MX') + ' m.');
    return 'no';
  },
  // Bajar a los metros que el jugador escribió (nunca más abajo de su récord). El elevador llega por su tiro, bajo el edificio;
  // si a esa altura hay roca, abre un hueco: de preferencia donde ya hay túnel o tierra, sin llevarse mineral ni tesoros.
  bajarA() {
    const m = Math.max(10, Math.min(Math.floor(S.rec / 10) * 10, Math.round((+($('#eleM')?.value) || 0) / 10) * 10)), c = costoEle(m);
    if (!(S.rec >= 10) || S.d < c) return;
    const fila = Math.round(m / 2) - 1, cols = [66, 65, 67, 64, 68, 63, 69, 62, 70, 61, 71, 60, 72];
    let x = cols.find((cx) => !solida(cx, fila));
    if (x === undefined) { x = cols.find((cx) => { const t = celda(cx, fila); return t < 10 && t !== 5; }) ?? 66; if (celda(x, fila) === 5 || celda(x, fila) === 46) return; cavar([[x, fila]]); }
    let y = fila; for (let k = 0; k < 30 && y < H - 1 && !solida(x, y + 1); k++) y++;
    if (solida(x, y + 1) === false) y = fila;                         // no hay piso cerca: se queda en el hueco y planea
    eleM = m; S.d -= c; yo.x = x + 0.5; yo.y = y + 1 - HH; yo.vx = yo.vy = 0; yo.perf = null; vistaLibre = false; son.tele(); sucio = true;
    cerrar(); chispas(yo.x, yo.y, '#ffb347', 30, 8); tarjeta('🛗 El Elevador · ' + fmt(c), 'Llegaste a ' + m.toLocaleString('es-MX') + ' m.');
    return 'no';
  },
  objeto(v) { const o = OBJ[+v], c = o.p * cuantos; if (S.d < c) return; S.d -= c; S.obj[+v] += cuantos; son.compra(); },
  cuantos(v) { cuantos = +v; son.clic(); },
  remin() { if (!conectado || cuentaFin || S.d < costoRemin()) return; enviar({ t: 'remin' }); cerrar(); return 'no'; },
  pest(v) { pestana = +v; },
  menu(v) { menu = v; },
  async compartirFoto() {
    const blob = await new Promise((r) => fotoRecord().toBlob(r, 'image/png')), liga = location.origin + '/' + mundoId + '?j=' + miI;
    const f = new File([blob], 'mina-' + miNombre.replace(/[^\w]+/g, '-') + '.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [f] })) { try { await navigator.share({ files: [f], title: 'Mina', text: `Llevo ${S.rec} m bajo tierra en Mina. Entra a mi mundo: ${liga}` }); return 'no'; } catch {} }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = f.name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return 'no';
  },
  compartir() { subirFotos(true); navigator.share?.({ text: textoInv() }).catch(() => {}); return 'no'; },
  wa() { subirFotos(true); porWhatsApp(textoInv()); return 'no'; },
  cita(v) { if (!conectado) return 'no'; enviar({ t: 'cita', h: +v }); son.clic(); return 'no'; },
  citaOtra() { const el = $('#citaOtra'); if (!el || !el.value) { aviso('Elige fecha y hora (hora de Torreón).'); return 'no'; } const [f, hm] = el.value.split('T'), [y, m, d] = f.split('-').map(Number), [H, M] = hm.split(':').map(Number); const h = Date.UTC(y, m - 1, d, H + 6, M || 0); if (h < Date.now()) { aviso('Esa hora ya pasó.'); return 'no'; } if (conectado) enviar({ t: 'cita', h }); return 'no'; },
  citaQuitar() { if (conectado) enviar({ t: 'cita', h: 0 }); return 'no'; },
  voy(v) { if (conectado && cita) enviar({ t: 'voy', si: +v }); return 'no'; },
  tirar(v) { if (S.carga[+v] > 0) S.carga[+v]--; },
  op(v, el) { const k = el.dataset.k, antes = op[k]; op[k] = el.type === 'checkbox' ? (el.checked ? 1 : 0) : +el.value; if (k === 'zoom') { if (movil) animarLupa(lupa * [9, 12, 16][op.zoom] / [9, 12, 16][antes]); else lupa = 1; op.lupa = 1; } escribir('mina_op', op); aplicarOp(); return 'no'; },
  texto(v) { op.texto = Math.max(0.85, Math.min(1.5, op.texto + +v)); escribir('mina_op', op); aplicarOp(); },
  ligaMaq(v, el) {
    const liga = location.origin + '/' + mundoId + '#maquinita=' + miK;
    const hecho = () => { el.textContent = '¡Liga copiada!'; }, aMano = () => window.prompt('Copia la liga de tu maquinita:', liga);
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(liga).then(hecho, aMano); else aMano();
    return 'no';
  },
  nombreMaq(v, el) { const n = el.value.trim(); if (n.length >= 2 && n !== miNombre && conectado) enviar({ t: 'nombre', n, m: miModelo }); return 'no'; },
  modeloMaq(v) { if (!conectado || +v === miModelo) return 'no'; enviar({ t: 'nombre', n: miNombre, m: +v }); return 'no'; },
  // Traer aquí una maquinita de otro equipo: se guarda la llave de la actual por si el código no existe.
  usarCodigo() {
    const c = ($('#cod')?.value || '').trim(); if (!/^[0-9a-zA-Z]{16,64}$/.test(c) || c === miK) return 'no';
    enviarEst(); escribir('mina_maq_antes', maqLocal); escribir('mina_maq', { k: c }); try { localStorage.removeItem('mina_est'); } catch {}
    location.reload(); return 'no';
  },
  instalar() { if (instalar) { instalar.prompt(); instalar = null; } },
  acepto(v) { enviar({ t: 'acepto', sid: v }); },
  rechazo(v) { enviar({ t: 'rechazo', sid: v }); },
  sacarJ(v) { enviar({ t: 'sacar', i: +v }); const o = otros.get(+v); if (o) aviso('Sacaste a ' + o.n); },
  sacarM(v) { enviar({ t: 'sacar', sid: v }); aviso('Lo sacaste: ya no puede mirar ni entrar'); },
  perdonar(v) { enviar({ t: 'perdonar', x: +v }); },
  ligaVer(v, el) {
    const liga = location.origin + '/ver/' + miVer + '?j=' + miI;
    const hecho = () => { el.textContent = '¡Liga copiada!'; }, aMano = () => window.prompt('Copia la liga para mirar:', liga);
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(liga).then(hecho, aMano); else aMano();
    return 'no';
  },
  presumir(v, el) {
    const liga = location.origin + '/' + mundoId + '?j=' + miI; subirFotos(true);
    const hecho = () => { el.textContent = '¡Liga copiada!'; }, aMano = () => window.prompt('Copia tu liga:', liga);
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(liga).then(hecho, aMano); else aMano();
    return 'no';
  },
  invitar(v, el) {
    subirFotos(true);
    const liga = ligaInvitacion();
    const hecho = () => { el.textContent = '¡Liga copiada!'; }, aMano = () => window.prompt('Copia la liga de tu mundo:', liga);
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(liga).then(hecho, aMano); else aMano();
    return 'no';
  },
  modo(v, el) { if (!conectado || !MODOS[el.value]) return; cfg = { ...cfg, ...MODOS[el.value], modo: el.value }; enviar({ t: 'cfg', cfg }); },
  regla(v, el) { if (!conectado) return; cfg = { ...cfg, [el.dataset.k]: el.type === 'checkbox' ? (el.checked ? 1 : 0) : +el.value }; if (!['puerta', 'reminTodos', 'regalos', 'pleitos', 'mirar'].includes(el.dataset.k)) cfg.modo = 'medida'; enviar({ t: 'cfg', cfg }); },
  nombreMundo(v, el) { const n = el.value.trim(); if (n.length < 2 || !conectado) return 'no'; cfg = { ...cfg, nombre: n }; enviar({ t: 'cfg', cfg }); guardarMundo(); return 'no'; },
  regalar(v) {
    const el = $('#cuanto'), q = Math.floor(+el.value);
    if (!(q > 0) || q > S.d || !conectado) return 'no';
    S.d -= q; S.fl.regalo = 1; enviar({ t: 'regalo', a: +v, q }); son.compra(); aviso('Le regalaste ' + fmt(q) + ' a ' + nombreDe(+v));
  },
  guardarArchivo() {
    const f = new Date(), p2 = (n) => String(n).padStart(2, '0'), a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(archivoDelMundo(true))], { type: 'application/json' }));
    a.download = `Mina_${(cfg.nombre || 'Mundo').replace(/[^\wáéíóúñÁÉÍÓÚÑ]+/g, '_')}_v1_${f.getFullYear()}-${p2(f.getMonth() + 1)}-${p2(f.getDate())}_${p2(f.getHours())}${p2(f.getMinutes())}.json`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); aviso('Mundo guardado en tu carpeta de descargas.');
    return 'no';
  },
  mundos() { enviarEst(); guardarCopia(); location.href = '/?mundos'; },
  reiniciar() { pantallaReinicio(); return 'no'; },
  tRango(v) { op.rango = +v; escribir('mina_op', op); tienda.nivelVista = nivelPorRango(); },
  tNivel(v) { tienda.nivelVista = +v; },
  tPon(v, el) { ponerPinta(el.dataset.k, v); },
  tPara(v, el) { tienda.regaloA = +el.value; },
  tProbarBocina() { claxon(pintaVista().bocina | 0); return 'no'; },
  tEntrar() { irAlLogin('?tienda=' + tienda.nivelVista); return 'no'; },
  tPagar(v) { pagar({ tipo: 'nivel', nivel: +v, ...(tienda.regaloA >= 0 ? { paraI: tienda.regaloA } : {}) }); return 'no'; },
  tGracias(v) { tienda.mecenasMonto = +v; pintarMenu(); const el = $('#tGra'); if (el) el.value = +v; return 'no'; },
  tGraciasDar() { const m = Math.floor(+($('#tGra')?.value || 0)); if (!(m >= tienda.gratitudMin)) { aviso('Desde ' + pesos(tienda.gratitudMin) + '.'); return 'no'; } tienda.mecenasMonto = m; pagar({ tipo: 'mecenas', monto: m, motivo: 'gratitud' }); return 'no'; },
  tCumple() { const d = +($('#tCumD')?.value || 0), m = +($('#tCumM')?.value || 0); if (!(d >= 1 && d <= 31 && m >= 1 && m <= 12) || d > [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]) { aviso('Esa fecha no existe.'); return 'no'; } ponerCumple(String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0')); return 'no'; },
  tCumpleQuitar() { ponerCumple(''); return 'no'; },
  tMecenas() { const m = Math.floor(+($('#tMec')?.value || 0)); if (!(m >= tienda.mecenasMin)) { aviso('Desde ' + pesos(tienda.mecenasMin) + '.'); return 'no'; } tienda.mecenasMonto = m; pagar({ tipo: 'mecenas', monto: m }); return 'no'; },
  tFondo() { const n = Math.floor(+($('#tFondo')?.value || 0)); if (!(n >= 1 && n <= 200)) { aviso('Entre 1 y 200 maquinitas.'); return 'no'; } tienda.fondoN = n; pagar({ tipo: 'fondo', cantidad: n }); return 'no'; },
  tManifiesto() { pestana = 11; abrir('menu'); return 'no'; },
  capMundo(v) { capturas.mundo = v; capturas.grande = null; },
  capVer(v) { capturas.grande = capturas.lista.find((c) => c.id === v) || null; },
  capVolver() { capturas.grande = null; },
  capRecargar() { capturas.error = 0; cargarCapturas(); },
  capEntrar() { irAlLogin(''); return 'no'; },
  capBorrar(v, el) { if (!confirm('¿Borrar esta captura? No se puede recuperar.')) return 'no'; fetch('/api/capturas/borrar', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ses: cuenta.ses, id: v, mundo: el.dataset.m }) }).then(() => { capturas.lista = capturas.lista.filter((c) => c.id !== v); capturas.grande = null; if (menu === 'menu') pintarMenu(); }); return 'no'; },
  salirCuenta() { salirCuenta(); return 'no'; },
  quitarP(v) { enviar({ t: 'quitar', i: +v }); const o = otros.get(+v); if (o) aviso('Le quitaste el permiso a ' + o.n + ': puede mirar y volver a pedirlo'); },
  devolverP(v) { enviar({ t: 'devolver', i: +v }); const o = otros.get(+v); if (o) aviso(o.n + ' vuelve a tener permiso'); },
  desechar() { desechar(mundoId, soyCreador); },
};
$('#velo').addEventListener('click', (e) => { if (e.target === e.currentTarget && movil && menu && menu !== 'inicio') { audio(); cerrar(); } });
$('#caja').addEventListener('click', (e) => {
  const el = e.target.closest('[data-a]'); if (!el || el.disabled || el.tagName === 'SELECT' || el.tagName === 'INPUT') return;
  const r = acciones[el.dataset.a]?.(el.dataset.v, el);
  sucio = true; if (r !== 'no' && r !== true && menu && menu !== 'inicio') pintarMenu(); pintarHud(true);
});
// Los metros del elevador: el número y la barra se mueven juntos y el precio se actualiza al escribir.
$('#caja').addEventListener('input', (e) => {
  if (e.target.id !== 'eleM' && e.target.id !== 'eleR') return;
  const otro = $(e.target.id === 'eleM' ? '#eleR' : '#eleM'), m = Math.max(0, Math.min(+e.target.max, Math.round(+e.target.value || 0)));
  const m10 = Math.max(10, Math.round(m / 10) * 10);          // se baja de diez en diez metros
  otro.value = m; eleM = m10; $('#eleP').textContent = fmt(costoEle(m10)); $('#eleB').disabled = m < 10 || S.d < costoEle(m10);
});
$('#caja').addEventListener('keydown', (e) => {
  if (e.target.id !== 'eleM') return;
  if (e.key === 'Enter') { e.preventDefault(); acciones.bajarA(); pintarHud(true); } else if (e.key === 'Escape') cerrar();
});
$('#caja').addEventListener('change', (e) => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const r = acciones[el.dataset.a]?.(el.dataset.v, el);
  if (r !== 'no' && menu && menu !== 'inicio') pintarMenu();
});
$('#objetos').addEventListener('click', (e) => { const el = e.target.closest('[data-u]'); if (el) { audio(); usar(+el.dataset.u); } });
$('#reglaVia').addEventListener('click', (e) => {          // un clic en la regla lleva la vista a esa profundidad
  if (!listo || !S) return;
  const r = e.currentTarget.getBoundingClientRect(), rec = Math.max(20, soloVer ? (otros.get(veo)?.rec || 0) : S.rec), fila = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) * rec / 2 - HH;
  panY += fila - (camY + filas / 2); camY = fila - filas / 2; vistaLibre = true;
});
$('#verQuien').addEventListener('click', (e) => { const b = e.target.closest('[data-veo]'); if (b) { audio(); veo = +b.dataset.veo; tkVisto = -1; pintarVer(); } });
$('#verPedir').addEventListener('click', () => { audio(); pedirJugar(); });
$('#tabla').addEventListener('click', (e) => { if (e.target.closest('[data-pub]') && listo && !menu && !soloVer) { audio(); abrir('pub'); } if (e.target.closest('[data-cita]') && listo && !soloVer && cita && conectado) { audio(); const voy = (cita.voy || []).includes(miI); enviar({ t: 'voy', si: voy ? 0 : 1 }); aviso(voy ? 'Ya no vas a la cita' : 'Vas a la cita: ' + horaCitaTx(cita.h)); } });
$('#verChat').addEventListener('click', () => { audio(); if (chat.abierto) cerrarChat(); else abrirChat(); });
$('#verTop').addEventListener('click', () => { audio(); abrir('top'); });
$('#bGrua').addEventListener('click', (e) => { audio(); e.currentTarget.blur(); if (listo && !menu && !pausa) grua(); });
$('#vjDatos').addEventListener('click', (e) => {
  audio(); if (!listo || menu) return;
  if (movil && !viajeAbierto) { viajeAbierto = true; pintarHud(true); clearTimeout(viajeT); viajeT = setTimeout(() => { viajeAbierto = false; pintarHud(true); }, 6000); return; }      // primer toque: se despliega; el segundo abre la bodega
  pestana = e.target.closest('.col') ? 1 : 0; abrir('menu');
});
$('#bSube').addEventListener('click', (e) => { audio(); e.currentTarget.blur(); if (!listo || menu) return; if (crucero) crucero = false; else subirSola(); pintarHud(true); });

$('#bInv').addEventListener('click', (e) => { audio(); e.currentTarget.blur(); if (listo && !menu) abrir('inv'); });
$('#bMenu').addEventListener('click', (e) => { audio(); e.currentTarget.blur(); if (listo && !menu) abrir('menu'); });

function sel(k, ops, quien = 'regla') {
  return `<select data-a="${quien}" data-k="${k}" ${soyCreador ? '' : 'disabled'}>${ops.map(([v, t]) => `<option value="${v}" ${cfg[k] == v ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
}
function menuPrincipal() {
  const P = ['Bodega', 'Colección', 'Mapa', '', 'Logros', 'Catálogo', 'Estadísticas', 'Opciones', 'Mundo', 'Ayuda', '🏆 Top 33', 'Manifiesto', '📸 Capturas'];      // la 3 eran los contratos
  if (pestana === 3) pestana = 0;
  let h = cab('<span class="hamb"></span>' + esc(cfg.nombre || 'Mina')) + `<div class="pest">${P.map((p, i) => (p ? `<button data-a="pest" data-v="${i}" class="${i === pestana ? 'on' : ''}">${p}</button>` : '')).join('')}</div><div class="cuerpo">`;
  if (pestana === 0) {
    h += `<p class="nota">📦 ${nCarga()} de ${bodega()} espacios · ${kgCarga()} kg de carga (tu motor levanta ${Math.round(hp() * 29.5 - 1980)} kg). Tirar piezas libera espacio y peso.</p>` +
      (nCarga() ? S.carga.map((n, i) => n ? `<div class="fila"><div class="t"><b style="color:${MIN[i].col}">${MIN[i].n} × ${n}</b><small>${fmt(MIN[i].v)} · ${MIN[i].kg} kg la pieza</small></div><button class="s" data-a="tirar" data-v="${i}">Tirar una</button></div>` : '').join('') : '<p class="nota">Bodega vacía.</p>') +
      '<h4>Tu equipo</h4>' + PZ.map((p, i) => `<div class="fila"><div class="ic">${p.ic}</div><div class="t"><b>${p.n}: ${p.niv[S.eq[i]][0]}</b><small>${p.niv[S.eq[i]][2]} ${p.u}</small></div></div>`).join('');
  } else if (pestana === 1) {
    const n = nHallados();
    h += `<p class="nota">La colección es <b>de este mundo y de todos los que juegan en él</b>: lo que encuentra cualquiera se enciende aquí para todos. Son ${COLEC.length} objetos, tres de cada uno, enterrados de arriba al fondo. Entre más hondo, más vale; el tercero de cada uno paga doble.</p>
      <p class="grande">${n} de ${NCOL}</p><div class="vitrina">` +
      COLEC.map(([ic, nom], k) => { const c = hallados[k * 3] + hallados[k * 3 + 1] + hallados[k * 3 + 2], de = Math.round((10 + k * FRANJA) * 2 / 50) * 50, a = Math.round((10 + (k + 1) * FRANJA) * 2 / 50) * 50;
        return `<div class="${c ? (c === 3 ? 'ok' : '') : 'no'}"><i>${ic}</i><b>${c ? nom : '???'}</b><span>${[0, 1, 2].map((j) => `<u class="${j < c ? 'on' : ''}"></u>`).join('')}</span><small>${de.toLocaleString('es-MX')} a ${a.toLocaleString('es-MX')} m · ${fmt(valorCol(k))}</small></div>`; }).join('') + '</div>';
  } else if (pestana === 2) {
    h += `<p class="nota">El mundo de la superficie a los 10,000 m. Solo se ve lo que ya descubrió el equipo: los túneles en claro, lo que alcanzó a ver la lámpara y los lugares encontrados; lo demás queda oscuro, sin descubrir. Tú eres el punto amarillo y cada maquinita, el de su color, en vivo. El mapa de un lado se abre con <b>M</b>.</p><canvas id="mapa" class="mapa"></canvas>`;
  } else if (pestana === 3) {
    h += `<p class="nota">${S.con.tut < TUTORIAL.length ? 'Primeros pasos: cumple cada uno y llega el siguiente.' : 'Trabajos de la Compañía. Al cumplir uno se paga solo y llega otro.'}</p>` +
      S.con.act.map((k) => `<div class="fila"><div class="t"><b>${esc(k.tx)}</b>${k.b > 1 ? `<small>Llevas ${k.pr | 0} de ${k.b}</small>` : ''}</div><div class="v">${fmt(k.pg)}</div></div>`).join('');
  } else if (pestana === 4) {
    h += `<p class="nota">${S.log.length} de ${LOGROS.length} logros · Rango: <b>${RANGOS[S.rango][1]}</b></p><div class="rej">` +
      LOGROS.map((l) => { const ok = S.log.includes(l.id); return `<div class="${ok ? '' : 'no'}"><b>${ok ? '🏅 ' : ''}${ok && l.sec ? l.sec.split(':')[0] : l.n}</b><small>${ok && l.sec ? l.sec.split(': ')[1] : l.d}</small></div>`; }).join('') + '</div>';
  } else if (pestana === 5) {
    h += `<p class="nota">De la Corteza al Corazón de la Tierra. Completa la página y todo lo que vendas vale <b>5 % más</b>${catalogoCompleto() ? ' — ¡ya lo tienes!' : ''}.</p><div class="rej">` +
      MIN.map((m, i) => S.st.rec[i] ? `<div><b style="color:${m.col}">${m.n}</b><small>${fmt(m.v)} · ${m.kg} kg · desde ${m.a} m<br>Vendidas: ${S.st.vend[i]}</small></div>` : '<div class="no"><b>???</b><small>Sin descubrir</small></div>').join('') +
      HALL.map((x, i) => S.st.hall[i] ? `<div><b>🏺 ${x.n}</b><small>${fmt(x.v)} · encontrados: ${S.st.hall[i]}</small></div>` : '<div class="no"><b>???</b><small>Hallazgo sin encontrar</small></div>').join('') + '</div>';
  } else if (pestana === 6) {
    const e = S.st;
    h += `<p><button data-a="menu" data-v="foto">📸 Presume tu maquinita y tus récords</button></p>` + [['Tiempo jugando', tiempoLargo(S.seg)], ['Profundidad máxima', num(S.rec) + ' m'], ['Altura máxima', fmtAlto(S.alt)], ['Total ganado', fmt(S.tot)], ['Viajes', num(e.viajes)], ['Mejor viaje', fmt(e.mejorViaje)], ['Celdas perforadas', num(e.cavadas)], ['Piezas vendidas', num(e.vend.reduce((a, b) => a + b, 0))], ['Hallazgos', num(e.hall.reduce((a, b) => a + b, 0))], ['Explosivos usados', num(e.expl)], ['Litros cargados', num(e.comb)], ['Explosiones', num(e.muertes)], ['Rescates gratis usados', num(S.resc)], ['Remineralizaciones', num(e.remin)]]
      .map(([a, b]) => `<div class="fila"><div class="t">${a}</div><div class="v">${b}</div></div>`).join('');
  } else if (pestana === 7) {
    const chk = (k, t) => `<label class="op"><span>${t}</span><input type="checkbox" data-a="op" data-k="${k}" ${op[k] ? 'checked' : ''}></label>`;
    const enApp = matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone, iOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    h += `<div class="fila"><div class="ic">📲</div><div class="t"><b>Mina como aplicación</b><small>${enApp ? 'Ya la estás usando como aplicación.' : instalar ? 'Se instala en un toque y queda con su icono, como cualquier otra.' : iOS ? 'En iPhone o iPad: toca Compartir y luego «Agregar a inicio».' : 'En Chrome o Edge: el icono de instalar que sale en la barra de la dirección, o menú → «Instalar Mina». En Safari de Mac: Archivo → «Agregar al Dock».'} Sigue funcionando sin internet: lo que caves y ganes se queda en tu equipo y se manda al mundo cuando vuelve la señal.</small></div>${instalar && !enApp ? '<button data-a="instalar">Instalar</button>' : ''}</div>
      <p class="nota">El sonido se maneja con la bocina de arriba a la derecha: apagar, bajar, subir y elegir qué tipos se oyen.</p>
      <label class="op"><span>Tamaño del texto</span><button class="s" data-a="texto" data-v="-0.1">A−</button><button class="s" data-a="texto" data-v="0.1">A+</button></label>` +
      chk('contraste', 'Alto contraste') + chk('dalton', 'Marcas para daltónicos (cada mineral con su símbolo)') + chk('temblor', 'Temblor de pantalla') +
      `<label class="op"><span>Partículas</span><select data-a="op" data-k="part">${[[2, 'Todas'], [1, 'Pocas'], [0, 'Ninguna']].map(([v, t]) => `<option value="${v}" ${op.part == v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <label class="op"><span>Acercamiento</span><select data-a="op" data-k="zoom">${[[0, 'Cerca'], [1, 'Normal'], [2, 'Lejos']].map(([v, t]) => `<option value="${v}" ${op.zoom == v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>` +
      `<label class="op" title="Al caer sin tocar nada, los rotorcitos frenan solos antes del piso"><span>Aterrizaje suave${movil ? '' : ' (frena sola antes del piso)'}</span><select data-a="op" data-k="suave">${[[2, tactil ? 'Automático: sí, con el dedo' : 'Automático: no, con teclado'], [1, 'Siempre'], [0, 'Nunca']].map(([v, t]) => `<option value="${v}" ${(op.suave ?? 2) == v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>` +
      `<label class="op" title="Si las caídas quitan casco. Con el dedo vienen apagadas para poder jugar a gusto"><span>Golpes de caída${movil ? '' : ' (quitan casco)'}</span><select data-a="op" data-k="golpes">${[[2, tactil ? 'Automático: no, con el dedo' : 'Automático: sí, con teclado'], [1, 'Siempre'], [0, 'Nunca']].map(([v, t]) => `<option value="${v}" ${(op.golpes ?? 2) == v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>` +
      chk('nombres', 'Mostrar los nombres de las maquinitas') +
      `<label class="op"><span>Cuadros por segundo</span><select data-a="op" data-k="fps">${[[0, 'Lo máximo de tu pantalla'], [60, '60'], [30, '30 (ahorra batería)']].map(([v, t]) => `<option value="${v}" ${op.fps == v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <p class="nota">Tu pantalla refresca a <b>${rit.hz} Hz</b> y el juego está mostrando <b>${Math.round(Math.min(rit.fps, rit.hz))} cuadros por segundo</b>, con nitidez al ${Math.round(NITIDEZ[rit.niv] * 100)} %. Señal con el mundo: ${red.rtt ? Math.round(red.rtt) + ' ms' : 'midiendo…'}. El juego se ajusta solo: si tu equipo no alcanza el refresco de su pantalla, baja la nitidez antes que la fluidez.</p>
      <p class="nota">${rit.ult ? `En el último minuto de juego: <b>${rit.ult.lentos} de ${rit.ult.n.toLocaleString('es-MX')}</b> cuadros salieron lentos (${(rit.ult.lentos / Math.max(1, rit.ult.n) * 100).toFixed(2)} %) y el más lento tardó <b>${Math.round(rit.ult.peor)} ms</b> (lo ideal en tu pantalla: ${Math.round(1000 / rit.hz)} ms).` : 'Juega un minuto y aquí sale cuántos cuadros lentos hubo.'} El terreno está compuesto en ${bloques.size} bloques (${((bloques.size + bloquesLibres.length) * BL * BL * T * T * 4 / 1e6 + tiles.size * T * T * 4 / 1e6).toFixed(0)} MB de imágenes).</p>`;
  } else if (pestana === 8) {
    const o3 = [[0, 'Apagado'], [1, 'Normal'], [2, 'Fuerte']];
    h += htmlCuenta() + `<div class="fila"><div class="t"><b>Invita a tu gente</b><small>${mundoId ? location.origin + '/' + mundoId : 'Tu mundo se está creando…'}</small></div><button class="s" data-a="menu" data-v="inv">Ver código QR</button><button data-a="invitar">Copiar la liga</button></div>
      <h4>Dificultad del mundo ${soyCreador ? '' : '<small style="color:var(--su)">· solo la cambia quien creó el mundo</small>'}</h4>
      <label class="op"><span>Modo</span><select data-a="modo" ${soyCreador ? '' : 'disabled'}>${[['paseo', 'Paseo · nada mata'], ['clasico', 'Clásico'], ['rudo', 'Rudo'], ['medida', 'A la medida']].map(([v, t]) => `<option value="${v}" ${cfg.modo === v ? 'selected' : ''} ${v === 'medida' ? 'disabled' : ''}>${t}</option>`).join('')}</select></label>
      <label class="op"><span>Quedarse sin combustible</span>${sel('comb', [[0, 'Reserva (no explota)'], [1, 'Explota']])}</label>
      <label class="op"><span>Caídas</span>${sel('caida', o3)}</label>
      <label class="op"><span>Lava</span>${sel('lava', o3)}</label>
      <label class="op"><span>Gas</span>${sel('gas', o3)}</label>
      <label class="op"><span>Ver el gas</span>${sel('verGas', [[1, 'Sí, completo'], [2, 'Se insinúa con burbujas'], [0, 'No']])}</label>
      <label class="op"><span>Qué se pierde al explotar</span>${sel('pierde', [[0, 'Nada'], [1, 'La carga'], [2, 'La carga y la reparación'], [3, 'Carga, reparación y 10 % del dinero']])}</label>
      <label class="op"><span>Rescates gratis</span>${sel('rescates', [[0, 'Ninguno'], [3, 'Los 3 primeros'], [-1, 'Sin límite']])}</label>
      <h4>El mundo</h4>
      <label class="op"><span>Nombre</span><input data-a="nombreMundo" maxlength="24" value="${esc(cfg.nombre)}" ${soyCreador ? '' : 'disabled'}></label>
      <label class="op"><span>Cerrar la puerta (no entran maquinitas nuevas)</span>${sel('puerta', [[0, 'Abierta'], [1, 'Cerrada']])}</label>
      <label class="op"><span>Quién puede remineralizar</span>${sel('reminTodos', [[1, 'Cualquiera'], [0, 'Solo quien creó el mundo']])}</label>
      <label class="op"><span>Regalos de dinero</span>${sel('regalos', [[1, 'Sí'], [0, 'No']])}</label>
      <label class="op"><span>Pleitos entre maquinitas (bajo tierra)</span>${sel('pleitos', [[1, 'Sí'], [0, 'No']])}</label>
      <label class="op"><span>Dejar que nos vean jugar (observadores)</span><select data-a="regla" data-k="mirar" ${soyCreador ? '' : 'disabled'}><option value="1" ${cfg.mirar !== 0 ? 'selected' : ''}>Sí</option><option value="0" ${cfg.mirar === 0 ? 'selected' : ''}>No</option></select></label>
      ${cfg.mirar !== 0 && miVer ? `<div class="fila"><div class="t"><b>Liga para mirar</b><small>Quien la abra te ve jugar en vivo. No puede entrar a jugar ni conocer la liga de este mundo.${mirones ? ' Ahora mismo: 👁 ' + mirones + ' mirando.' : ''}</small></div><button class="s" data-a="ligaVer">Copiar liga para mirar</button></div>` : ''}
      <h4>Jugadores</h4><div class="fila"><div class="t"><b>Público y solicitudes</b><small>Quién mira, quién pide jugar${soyCreador ? ', y sacar a quien haga mala práctica' : ''}.</small></div><button data-a="menu" data-v="pub"><kbd>J</kbd>Abrir</button></div>` +
      ([...otros.values()].length ? `<label class="op"><span>Cantidad para regalar (en la superficie)</span><input id="cuanto" type="number" min="1" value="${Math.min(1000, Math.floor(S.d))}" style="width:9em"></label>` +
        [...otros.values()].map((o) => `<div class="fila"><div class="t"><b>${esc(o.n)}</b><small>${o.on ? 'Conectado' : 'Desconectado'} · récord ${num(o.rec)} m · ganado ${fmt(o.tot || 0)}</small></div>${o.on && cfg.regalos && yo.y < 0 ? `<button class="s" data-a="regalar" data-v="${o.i}">Regalar</button>` : ''}</div>`).join('') : '<p class="nota">Estás solo en este mundo. Copia la liga y mándala.</p>') +
      `<h4>Mi maquinita</h4><div class="maq"><canvas id="miMaq" width="160" height="160"></canvas><div>
        <b>${esc(miNombre)}</b> · ${RANGOS[S.rango][1]}
        <small>${fmt(S.d)} · récord ${num(S.rec)} m · ${S.log.length} logros · ${num(S.st.viajes)} viajes · ⏱ ${tiempoLargo(S.seg)} jugando</small>
        <small>Combustible ${S.fuel.toFixed(1)} / ${tanque()} L · casco ${Math.ceil(S.vida)} / ${vidaMax()} · bodega ${nCarga()} / ${bodega()}</small>
        <small>${PZ.map((z, i) => z.n + ': <b style="display:inline">' + z.niv[S.eq[i]][0] + '</b>').join(' · ')}</small>
        <small>Objetos: ${OBJ.map((o, i) => S.obj[i] ? CORTO[i] + ' ×' + S.obj[i] : '').filter(Boolean).join(' · ') || 'ninguno'}</small></div></div>
      <label class="op"><span>Nombre de tu maquinita</span><input data-a="nombreMaq" maxlength="14" value="${esc(miNombre)}" autocomplete="off"></label>
      <div class="maqs" id="modelos">${MODELOS.map((m, i) => `<button class="${i === miModelo ? 'on' : ''}" data-a="modeloMaq" data-v="${i}" title="Cambiar a este modelo"><canvas width="112" height="112"></canvas></button>`).join('')}</div>
      <details><summary class="nota">Ya tengo una maquinita en otro equipo y quiero usarla aquí</summary><p><input id="cod" placeholder="Pega aquí el código de tu maquinita" style="width:70%"> <button class="s" data-a="usarCodigo">Usar código</button></p></details>
      <p class="nota"><b>Tu maquinita es tuya.</b> Entra contigo a cualquier mundo con todo lo que trae, y no se pierde aunque un mundo se borre. Para seguir con ella en otra computadora o en el teléfono, entra allá con tu cuenta de Google, o abre su liga o su código QR. <b>No los compartas:</b> quien los abra maneja tu maquinita.</p>
      <div class="fila"><div class="t"><small>Código: <code>${esc(miK)}</code></small></div><button class="s" data-a="menu" data-v="qrmaq">Ver su código QR</button><button data-a="ligaMaq">Copiar su liga</button></div>
      <div class="fila"><div class="ic">🎨</div><div class="t"><b>Pintar mi maquinita</b><small>La Pinturería: colores, calcomanías, luces, estela, claxon, mascota… Se juega completo gratis; esto es solo para que se vea como tú.</small></div><button data-a="menu" data-v="pin">Abrir</button></div>
      <div class="fila"><div class="t"><b>Guardar este mundo en un archivo</b><small>Semilla, reglas, todos los túneles y la colección. Desde «Mis mundos» puedes abrirlo cuando quieras como un mundo nuevo, idéntico.</small></div><button data-a="guardarArchivo">💾 Guardar archivo</button></div>
      <div class="fila"><div class="ic">🌅</div><div class="t"><b>${(S.fl.edenF && S.fl.edenF[mundoId + '|' + remin]) || edenVivo ? 'Este mundo ya se terminó' : 'Volver a arrancar'}</b><small>Un mundo nuevo desde arriba: con tus mejoras o desde cero.</small></div><button data-a="reiniciar">🔄 Volver a arrancar</button></div>
      <div class="fila"><div class="t"></div><button class="s" data-a="mundos">Mis mundos · crear o cargar otro</button><button class="mal" data-a="desechar">Desechar este mundo</button></div>`;
  } else if (pestana === 10) {
    h += htmlTop();
  } else if (pestana === 11) {
    h += MANIFIESTO;
  } else if (pestana === 12) {
    h += htmlCapturas();
  } else {
    h += (tactil ? '<p><b>Con el dedo:</b> ponlo donde sea y arrástralo. Hacia abajo perfora, a los lados camina, hacia arriba vuela; al soltar se detiene. Un toque frente a un edificio entra. <b>Dos dedos</b> acercan o alejan la vista y la recorren. Las caídas no quitan casco (se encienden en Opciones → Golpes de caída) y la maquinita frena sola antes del piso (Aterrizaje suave). <b>Dos empujones seguidos</b> hacia arriba y sube sola; dos hacia abajo y perfora sola hacia abajo (también con el botón <b>⬆ Subir sola</b>). Un toque en la pantalla la suelta.</p>' : '') +
      `<p><b>Moverte:</b> con las flechas. <b>↑</b> vuela. <b>↓</b> perfora hacia abajo. <b>← →</b> contra una pared, perfora de lado. Nunca se perfora hacia arriba.</p>
      <p><b>El ciclo:</b> baja, llena la bodega, sube, vende en La Báscula, carga combustible y mejora tu equipo en El Taller. En la superficie, párate frente a un edificio y pulsa ↓.</p>
      <p><b>Las teclas son la inicial de lo que hacen:</b> <b>R</b> Reserva · <b>N</b> Nanobots · <b>D</b> Dinamita · <b>P</b> Plástico · <b>Q</b> Cuántico · <b>T</b> Transmisor · <b>C</b> Chat · <b>S</b> Señal · <b>A</b> Ayudar · <b>G</b> Grúa · <b>F</b> Foto (captura) · <b>M</b> Mapa · <b>Esc</b> Menú.</p>
      <p><b>El mapa (M):</b> se abre de un lado, como el chat (y encima de él si está abierto). Solo enseña lo que ya descubrió el equipo; lo demás queda oscuro. Arriba dice quién está jugando y a qué profundidad, y un clic en un nombre lleva el mapa hasta esa maquinita; a la izquierda, una tira con el mundo entero y la marca de cada quien. La rueda del ratón recorre el mapa.</p>
      <p><b>Objetos:</b> R tanque de reserva · N nanobots · D dinamita · P explosivo plástico · Q teletransportador cuántico · T transmisor. En El Almacén se compran de a 1, 5, 10, 50 o 100.</p>
      <p><b>El Taller:</b> cada pieza tiene veintiséis mejoras, de $750 a $25 billones ($25 T). Siempre ves las que ya compraste y las diez que siguen.</p>
      <p><b>Acompañado:</b> S deja una señal que todos ven · A ayuda a la maquinita que tengas junto: le pasa 5 litros · C abre el chat. Para descansar, abre el menú (Esc): con el menú abierto tu maquinita no gasta.</p>
      <p><b>Tu viaje:</b> abajo a la izquierda ves cuánto llevas, en cuánto se vende y si el combustible te alcanza para subir. Ahí mismo está la <b>grúa</b> (tecla G): te deja en la Gasolinera y cobra según lo lejos que estés y lo que peses.</p>
      <p><b>Bajo el agua:</b> el agua te sostiene y frena la caída, pero con <b>↓</b> los rotorcitos empujan hacia abajo y la cruzas tan rápido como el aire. Ahí abajo no hay golpe de caída.</p>
      <p><b>De regreso:</b> sin tocar nada, la maquinita planea con sus rotorcitos. Con <b>↓</b> los guarda y cae en picada, tres veces más rápido; con <b>↑</b> frena. El velocímetro de la izquierda dice a cuánto vas, y si pasas de Mach 1 dentro del aire, truena.</p>
      <p><b>Hacia arriba:</b> el cielo también se explora, y subir es todo un viaje: halcones y águilas, el atardecer, un avión, la noche con sus constelaciones, la aurora al entrar al espacio (100 km), un cometa, la estación, la Luna que crece y el planeta que se achica hasta que, cerca de los 1,000 km, el Sol vuelve a salir. Son unos 15 minutos de vuelo. Entre más alto, menos combustible se gasta; con un tanque «Cisterna» alcanza. Con <b>dos toques seguidos a ↑</b>, o con la barra espaciadora, la maquinita se queda subiendo sola, también dentro de un tiro: sigue hasta que topa con techo, o hasta el espacio si no hay. Se suelta con ↓ o con la barra.</p>
      <p><b>Lava y gas:</b> la lava (desde 410 m) se ve y se rodea. Las bolsas de gas (desde 650 m) se notan por unas burbujitas verdes y por el aviso «Huele a gas». Pon el ratón encima de cualquiera y te dice cuánto casco te quita. Vuélalas con dinamita o lleva casco y radiador suficientes: arriba, en las metas, dice hasta qué profundidad aguantas.</p>
      <p><b>Sonido:</b> la bocina de arriba a la derecha lo apaga, lo baja y lo sube; «♪ Sonidos» deja elegir qué se oye: música, taladro, hélice, motor (viene apagado) y lo demás, cada uno con su interruptor.</p>
      <p><b>Mirar alrededor:</b> la rueda del mouse o dos dedos en el trackpad mueven la vista; cualquier flecha la regresa a tu maquinita. Mientras miras, a la izquierda sale una regla con la profundidad de lo que ves, dónde quedó tu maquinita y los lugares que ya descubriste; un clic en la regla te lleva ahí. Solo se puede mirar lo ya explorado: hasta tu récord de profundidad y hasta tu mayor altura.</p>
      <p><b>La colección:</b> hay 99 objetos enterrados (33 distintos, tres de cada uno), cada uno en su franja de profundidad. Se ven como medallones dorados. Son del mundo: los junta el equipo entero y se van encendiendo en Menú → Colección. Las explosiones no los destruyen.</p>
      <p><b>Pleitos:</b> en el aire las maquinitas rebotan y no pasa nada. Bajo tierra, si empujas tu taladro contra otra (← → a su lado, o ↓ encima de ella), le pegas: tu taladro contra su casco. Por la espalda o desde arriba pega 50 % más; taladro contra taladro pega la mitad y los dos salen rebotados. La que pierde vuelve a la superficie sin perder nada. En el pueblo no hay pleitos, y quien creó el mundo puede apagarlos.</p>
      <p><b>Mapa y archivo:</b> Menú → Mapa muestra todos los túneles abiertos. Menú → Mundo → Guardar archivo descarga el mundo completo; desde «Mis mundos» se abre como una copia idéntica.</p>
      <p><b>Ojo de minero:</b> una de cada catorce piedras es una geoda: búscale el brillo morado. Cuando la flama de tu lámpara se pone azul, hay grisú al lado. Y tres lugares guardan una sorpresa para quien se detiene a mirar, a tocar o a quedarse quieto.</p>
      <p><b>El fondo:</b> los últimos 240 m guardan algo detrás de la roca. Cada celda que se quita ahí deja ver un pedazo. Se descubre entre todos, y al final, de pie sobre el Corazón, se perfora hacia abajo.</p>
      <p><b>Diez kilómetros:</b> debajo de la Corteza siguen el Acuífero, las Cavernas, la Cristalera y la Zona de presión, con doce minerales nuevos y cuatro lugares por descubrir. Cada lugar que encuentres queda apuntado en <b>El Elevador</b> (el último edificio), que también te regresa al punto donde te recogió la grúa.</p>
      <p><b>Sin internet y como aplicación:</b> Mina se puede instalar (Menú → Opciones) y abre aunque no haya señal. Lo que caves y ganes sin internet se queda en tu equipo y se manda al mundo cuando la señal vuelve. En pantallas táctiles, arrastra el dedo para moverte y da un toque frente a un edificio para entrar.</p>
      <p><b>Tu nombre y tus ligas:</b> la maquinita nace bautizada para que empieces a jugar sin llenar nada; el nombre y el modelo se cambian en Menú → Mundo. Hay dos ligas: la del mundo (invita a excavar) y la tuya (presume tu maquinita); cada una lleva su imagen al mandarla por WhatsApp.</p>
      <p><b>Con puro teclado:</b> <b>C</b> abre el chat; escribes y <b>Enter</b> manda; <b>Enter</b> con la caja vacía, o <b>Esc</b>, lo cierra; <b>Tab</b> te regresa al juego dejándolo a la vista y las flechas ↑ ↓ recorren la conversación. En los edificios, <b>Enter</b> hace lo principal (cargar, vender, comprar la siguiente mejora, reparar), <b>← →</b> cambian de pestaña o de cantidad, <b>↑ ↓</b> recorren y en El Almacén la letra de cada objeto lo compra. <b>I</b> abre Invitar.</p>
      <p><b>El chat:</b> pulsa <b>C</b> (o el botón 💬 Chat) y escribe. Se abre de izquierda a derecha con todo lo que se ha dicho en este mundo, que queda guardado. Con el chat cerrado, lo que alguien escriba sale abajo un momento. Enter con la caja vacía te regresa al juego con el chat a la vista; Esc lo cierra. Cada maquinita tiene su color, de los cien que hay, según el orden en que entró. El texto se puede seleccionar y copiar, y las ligas se abren con un clic.</p>
      <p><b>Jugar o mirar:</b> con la liga para mirar entra quien sea, sin pedir nada, y elige con un clic a qué maquinita seguir; ve lo que ella ve y las teclas que va apretando. Para entrar a jugar desde ahí se pulsa <b>J</b> (Pedir jugar aquí) y quien creó el mundo decide. A él le llegan los avisos; con <b>J</b> abre el panel del público, donde acepta, rechaza o saca a alguien en un clic. Juegan hasta 40 a la vez; mirando, sin límite.</p>
      <p><b>Top 33 y público:</b> Menú → Top 33 enseña las 33 maquinitas que más han ganado en todos los mundos y cuánto tiempo lleva jugando cada una, en vivo. A la que esté jugando se le puede ir a ver: quien mira entra con una liga propia, no puede jugar ni conoce la liga del mundo. Tu liga para que te vean está en Menú → Mundo, y ahí mismo quien creó el mundo puede cerrarlo al público.</p>
      <p><b>El mundo da la vuelta:</b> si sales por la orilla derecha entras por la izquierda, y al revés, perforando o volando. Todo está conectado.</p>
      <p><b>La Remineralizadora:</b> cuesta el 5 % de todo lo que has ganado en la vida de tu maquinita. Entre más llevas, más cuesta.</p>
      <p><b>Los mundos son para siempre:</b> cada mundo se guarda completo (su terreno celda por celda, sus túneles, sus reglas y su colección) y no se borra nunca, salvo que quien lo creó lo deseche para todos. Con su liga se vuelve a entrar mañana o en dos años, exactamente donde se dejó.</p>
      <p><b>Explosivos:</b> se usan donde sea, también volando: si topas con piedra al subir, D te abre paso.</p>
      <p><b>Piedra:</b> se perfora si tu taladro alcanza. Hay cinco durezas, cada una de un color, según la zona; el Taller dice qué taladro pide cada una. Con el justo tarda 1.5 s; con uno mejor, hasta 0.6 s.</p>
      <p class="nota">Piedra desde 210 m. Lava desde 410 m: se ve, rodéala. Gas desde 650 m: pocas bolsas, y se notan por sus burbujas.</p>`;
  }
  return h + '</div>';
}
function aplicarOp() {
  medirMovil();
  document.documentElement.style.setProperty('--f', op.texto * (!movil && Math.min(innerWidth, innerHeight) < 520 ? 0.8 : 1));      // en una ventana chica de computadora el tablero va más chico; el celular tiene su propio tablero
  document.body.classList.toggle('contraste', !!op.contraste);
  medir();
}

/* ════════ Teclado ════════ */
// Con un menú abierto también se juega sin ratón: Enter hace lo principal, ← → cambian de pestaña (o de cantidad en El Almacén),
// ↑ ↓ recorren la lista, y en El Almacén las letras de los objetos los compran. Esc cierra.
function tecladoMenu(e, k) {
  const c = $('#caja'), clic = (sel) => { const b = c.querySelector(sel); if (b && !b.disabled) b.click(); };
  if (k === 'ArrowUp' || k === 'ArrowDown') { const cu = c.querySelector('.cuerpo'); if (cu) { e.preventDefault(); cu.scrollTop += k === 'ArrowDown' ? 90 : -90; } return; }
  if (k === 'ArrowLeft' || k === 'ArrowRight') {
    const bs = [...c.querySelectorAll(menu === 'alm' ? '.cant button' : '.pest button')]; if (!bs.length) return;
    e.preventDefault(); const i = Math.max(0, bs.findIndex((b) => b.classList.contains('on'))); bs[(i + (k === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length].click(); return;
  }
  if (k === 'Enter') { e.preventDefault(); const P = { gas: '[data-a="llenar"]', bas: '#bVender', tal: '[data-a="mejorar"]:not(:disabled)', alm: '[data-a="reparar"]', pub: '[data-a="acepto"]' }[menu]; if (P) clic(P); else if (menu === 'ele') { const m = $('#eleM'); if (m) { m.focus(); m.select(); } } return; }      // remineralizar cuesta mucho: eso no va en una tecla
  if (menu === 'alm') { const i = 'rndpqt'.indexOf(k); if (i >= 0) clic(`[data-a="objeto"][data-v="${i}"]`); }
}
const TECLAS_MENU = { pub: '<kbd>Enter</kbd> acepta la primera solicitud', gas: '<kbd>Enter</kbd> carga', bas: '<kbd>Enter</kbd> vende', tal: '<kbd>←</kbd> <kbd>→</kbd> cambian de pieza · <kbd>Enter</kbd> compra la siguiente', alm: '<kbd>←</kbd> <kbd>→</kbd> cantidad · la letra de cada objeto lo compra · <kbd>Enter</kbd> repara', ele: '<kbd>Enter</kbd> para escribir los metros, y otra vez <kbd>Enter</kbd> para bajar', menu: '<kbd>←</kbd> <kbd>→</kbd> cambian de pestaña' };
// Las teclas son la inicial, en español, de lo que hacen: Reserva, Nanobots, Dinamita, Plástico, Transmisor (y Q de cuántico),
// Chat, Señal, Ayudar, Grúa, Mapa (el menú es Esc). Para moverse, las flechas. Por eso ya no hay W A S D: esas letras tienen dueño.
const MAPA = { ArrowLeft: 'izq', ArrowRight: 'der', ArrowUp: 'arr', ArrowDown: 'aba' };
addEventListener('keydown', (e) => {
  if (cine) { e.preventDefault(); return cerrarCine(); }      // cualquier tecla regresa del jardín entero al juego
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.metaKey || e.ctrlKey) return;
  audio(); nacer();
  if ((e.key === 'c' || e.key === 'C') && listo && !menu && !e.repeat) { e.preventDefault(); return chat.abierto ? cerrarChat() : abrirChat(true); }      // C abre y cierra el chat, con el cursor listo para escribir
  if (e.key === 'Enter' && listo && !menu) { e.preventDefault(); return abrirChat(true); }
  if ((e.key === 'm' || e.key === 'M') && listo && !menu && !e.repeat) { e.preventDefault(); return mapaL.abierto ? cerrarMapa() : abrirMapa(); }      // M abre y cierra el mapa
  if (e.key === 'Escape' && mapaL.abierto && !menu) return cerrarMapa();
  if (e.key === 'Escape' && chat.abierto && !menu) return cerrarChat();
  if (soloVer) {                                   // mirando: solo se cambia de maquinita o se cierra la tabla
    if (e.key === 'Escape' && !menu && (pido === 'espera' || pido === 'ausente')) return yaNoPido();
    if (e.key === 'Escape' && menu === 'top') cerrar(); else if (!menu && e.key === 'ArrowRight') verOtra(1); else if (!menu && e.key === 'ArrowLeft') verOtra(-1); else if (!menu && (e.key === 'j' || e.key === 'J')) pedirJugar();
    return;
  }
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (e.repeat && !MAPA[k]) return;                 // dejar apretada una tecla no la dispara treinta veces por segundo
  if (k === 'Escape') { if (menu && menu !== 'inicio') cerrar(); else if (listo && !menu) abrir('menu'); return; }      // Esc: el menú (y con el menú abierto, la maquinita descansa)
  if (menu && menu !== 'inicio') return tecladoMenu(e, k);
  if (!listo || menu) return;
  if (pausa) return;
  if (MAPA[k]) {
    e.preventDefault();
    if (MAPA[k] === 'aba' && !e.repeat && pistaDe && pistaDe.id && yo.suelo && yo.y < 0) return abrir(pistaDe.id);
    if (MAPA[k] === 'arr' && !e.repeat) { const t = performance.now(); if (t - tArr < 330 && !crucero) subirSola(); tArr = t; }      // dos toques seguidos a ↑: se queda subiendo sola
    teclas[MAPA[k]] = true; vistaLibre = false; return;
  }
  const i = 'rndpqt'.indexOf(k);                  // Reserva, Nanobots, Dinamita, Plástico, cuántiQo, Transmisor
  if (i >= 0) return usar(i);
  if (k === 's') { enviar({ t: 'senal', x: yo.x, y: yo.y }); senales.push({ x: yo.x, y: yo.y, t: 10, n: miNombre }); son.senal(); }      // Señal
  if (k === 'a') pasarCombustible();                // Ayudar: 5 litros a la maquinita de junto
  if (k === 'g') grua();                            // Grúa
  if (k === 'b') tocarClaxon();                     // Bocina (claxon)
  if (k === 'f') tomarFoto();                       // Foto: captura de lo que estás viendo
  if (k === 'i') abrir('inv');                      // Invitar
  if (k === 'j') abrir('pub');                      // Jugadores y público: solicitudes, quién mira, sacar
  if (k === 'v' && edenVivo && yo.y > EDEN0 - 6) verJardin();      // Ver el jardín entero
  if (k === ' ') { e.preventDefault(); if (crucero) crucero = false; else subirSola(); }
});
// La rueda o el trackpad mueven la vista para mirar alrededor; cualquier flecha la regresa a la maquinita.
addEventListener('wheel', (e) => {
  if (!listo || menu || (e.target.closest && e.target.closest('#chat'))) return;      // dentro del chat, la rueda recorre la conversación
  e.preventDefault();
  const k = (e.deltaMode === 1 ? 32 : 1) * RES / T;
  panX = Math.max(-W, Math.min(W, panX + e.deltaX * k)); panY = Math.max(-H, Math.min(H, panY + e.deltaY * k)); vistaLibre = true;
}, { passive: false });
addEventListener('keyup', (e) => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; if (MAPA[k]) teclas[MAPA[k]] = false; });
addEventListener('blur', () => { for (const k in teclas) teclas[k] = false; });

/* ════════ Dedo ════════ RLR */
// En pantallas táctiles la palanca aparece donde se pone el dedo: arrastrar mueve, soltar detiene.
// Un toque corto frente a un edificio entra en él. Los objetos, la grúa y el menú se tocan en su lugar de siempre.
let tactil = matchMedia('(pointer: coarse)').matches, movil = false;
// Celular: pantalla táctil y lado corto de hasta 820 px (teléfonos y tabletas chicas). Las tabletas grandes usan el tablero de computadora, con el dedo.
function medirMovil() { movil = tactil && Math.min(innerWidth, innerHeight) <= 820; document.body.classList.toggle('movil', movil); document.body.classList.toggle('tactil', tactil); }
const pal = $('#palanca'), dedo = { id: -1, x: 0, y: 0, t: 0, mov: false, eje: '', fue: { arr: false, aba: false }, fin: { arr: -1e9, aba: -1e9 } }, dedos = new Map();
// Amarrar: dos empujones seguidos hacia arriba (en menos de medio segundo) y la maquinita sube sola, como el doble ↑ del
// teclado; dos hacia abajo y perfora sola hacia abajo. Un toque en la pantalla la suelta.
let amarreAba = false;
function amarrar(d) {
  if (d === 'arr') { amarreAba = false; subirSola(); }
  else { crucero = false; amarreAba = true; son.clic(); }
  dedo.fin.arr = dedo.fin.aba = -1e9;
}
function vigilarAmarre() {
  const ahora = performance.now();
  for (const d of ['arr', 'aba']) {
    if (teclas[d] && !dedo.fue[d] && ahora - dedo.fin[d] < 480) amarrar(d);
    if (!teclas[d] && dedo.fue[d]) dedo.fin[d] = ahora;
    dedo.fue[d] = teclas[d];
  }
}
let pinza = null, lupaT = 0;
addEventListener('pointerdown', () => nacer(), true);
function soltarPalanca() { dedo.id = -1; dedo.eje = ''; pal.classList.remove('on'); teclas.izq = teclas.der = teclas.arr = teclas.aba = false; vigilarAmarre(); }
lienzo.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'touch') return;
  if (!tactil) { tactil = true; aplicarOp(); } audio();
  if (!listo || menu) return;
  dedos.set(e.pointerId, { x: e.clientX, y: e.clientY });
  try { lienzo.setPointerCapture(e.pointerId); } catch {}
  if (dedos.size === 2) {                                   // dos dedos: se suelta la palanca; la pinza acerca o aleja, y arrastrando se recorre la vista
    soltarPalanca();
    const [p1, p2] = [...dedos.values()];
    pinza = { d0: Math.max(20, Math.hypot(p1.x - p2.x, p1.y - p2.y)), lupa0: lupa, mx: (p1.x + p2.x) / 2, my: (p1.y + p2.y) / 2 };
    return;
  }
  if (dedos.size > 2) return;
  if (soloVer) { dedo.id = e.pointerId; dedo.x = e.clientX; dedo.y = e.clientY; dedo.t = performance.now(); dedo.mov = false; return; }
  if (pausa) { pausa = false; pista(''); arrancar(); }
  if (crucero || amarreAba) { crucero = false; amarreAba = false; dedo.fin.arr = dedo.fin.aba = -1e9; }      // un toque suelta lo amarrado
  dedo.id = e.pointerId; dedo.x = e.clientX; dedo.y = e.clientY; dedo.t = performance.now(); dedo.mov = false; dedo.eje = ''; vistaLibre = false;
  pal.style.left = e.clientX + 'px'; pal.style.top = e.clientY + 'px'; pal.firstChild.style.transform = ''; pal.classList.add('on');
});
lienzo.addEventListener('pointermove', (e) => {
  const f = dedos.get(e.pointerId); if (f) { f.x = e.clientX; f.y = e.clientY; }
  if (pinza && dedos.size >= 2) {
    const [p1, p2] = [...dedos.values()], d = Math.hypot(p1.x - p2.x, p1.y - p2.y), mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
    const nl = Math.max(0.6, Math.min(2.2, pinza.lupa0 * d / pinza.d0));
    if (movil && Math.abs(nl - lupa) > 0.012 && performance.now() - lupaT > 50) { lupa = nl; lupaT = performance.now(); medir(); }
    panX = Math.max(-W, Math.min(W, panX - (mx - pinza.mx) * RES / T)); panY = Math.max(-H, Math.min(H, panY - (my - pinza.my) * RES / T)); pinza.mx = mx; pinza.my = my; vistaLibre = true;
    return;
  }
  if (e.pointerId !== dedo.id) return;
  // La palanca: una zona muerta amplia y un solo eje a la vez, el que más se empuja. Para cambiar de eje hay que empujar
  // claramente hacia el otro (así, caminar de lado nunca despega sin querer). Volando sí se puede ir en diagonal.
  const dx = e.clientX - dedo.x, dy = e.clientY - dedo.y, ax = Math.abs(dx), ay = Math.abs(dy), r = Math.hypot(dx, dy), tope = movil ? 52 : 40, k = r > tope ? tope / r : 1, zona = movil ? 20 : 14;
  pal.firstChild.style.transform = `translate(${dx * k}px,${dy * k}px)`;
  if (r > zona) dedo.mov = true;
  if (r <= zona) dedo.eje = '';
  else if (!dedo.eje) dedo.eje = ax >= ay ? 'x' : 'y';
  else if (dedo.eje === 'x' && ay > ax * 1.35) dedo.eje = 'y';
  else if (dedo.eje === 'y' && ax > ay * 1.35) dedo.eje = 'x';
  const x = dedo.eje === 'x', y = dedo.eje === 'y', vuelo = y && dy < 0 && ax > ay * 0.5;
  teclas.izq = (x || vuelo) && dx < 0; teclas.der = (x || vuelo) && dx > 0; teclas.arr = y && dy < 0; teclas.aba = y && dy > 0;
  vigilarAmarre();
});
const soltarDedo = (e) => {
  dedos.delete(e.pointerId);
  if (pinza && dedos.size < 2) { pinza = null; op.lupa = +lupa.toFixed(2); escribir('mina_op', op); }
  if (e.pointerId !== dedo.id) return;
  if (soloVer) { const corto = !dedo.mov && performance.now() - dedo.t < 320 && Math.hypot(e.clientX - dedo.x, e.clientY - dedo.y) < 12; dedo.id = -1; if (corto) elegirVisto(e.clientX, e.clientY); return; }
  soltarPalanca();
  if (!dedo.mov && performance.now() - dedo.t < 320 && listo && !menu && pistaDe && pistaDe.id && yo.suelo && yo.y < 0) abrir(pistaDe.id);
};
lienzo.addEventListener('pointerup', soltarDedo); lienzo.addEventListener('pointercancel', soltarDedo);
for (const ev of ['touchstart', 'touchmove', 'touchend']) lienzo.addEventListener(ev, (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });      // sin lupa de iOS ni selección
lienzo.addEventListener('contextmenu', (e) => e.preventDefault());

/* ════════ La aplicación ════════ RLR */
// El trabajador de servicio guarda el juego en el equipo: instalado o no, abre aunque no haya internet.
let instalar = null;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); instalar = e; if (menu === 'menu' && pestana === 7) pintarMenu(); });
addEventListener('appinstalled', () => { instalar = null; tarjeta('📲 Mina quedó instalada', 'Ábrela desde su icono. Funciona aunque no haya internet.', 'msj', 8000); });
if ('serviceWorker' in navigator && !location.search.includes('foto')) addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
function pasarCombustible() {
  let cerca = null;
  for (const o of otros.values()) if (o.on && o.x !== undefined && Math.hypot(o.x - yo.x, o.y - yo.y) < 1.6) cerca = o;
  if (!cerca) return aviso('No hay ninguna maquinita junto a ti.');
  if (!conectado) return;
  if (S.fuel <= 6) return aviso('No te alcanza para pasar combustible.');
  S.fuel -= 5; S.fl.pase = 1; sucio = true; enviar({ t: 'fuel', a: cerca.i, q: 5 }); aviso('Le pasaste 5 litros a ' + cerca.n); son.combustible();
}

/* ════════ Mis mundos, bautizo y arranque ════════ RLR */
let mundos = leer('mina_mundos', []), latido = 0, maqLocal = leer('mina_maq', null);
function guardarMundo() {
  if (soloVer || !mundoId) return;
  maqLocal = { k: miK, n: miNombre, m: miModelo }; escribir('mina_maq', maqLocal);      // la maquinita de este navegador: la misma en todos los mundos
  mundos = mundos.filter((m) => m.id !== mundoId);
  mundos.unshift({ id: mundoId, k: miK, nombre: cfg.nombre || 'Mundo ' + mundoId, maq: miNombre, modelo: miModelo, creador: soyCreador ? 1 : 0, ult: Date.now() });
  escribir('mina_mundos', mundos); subirCuentaLuego();
}
function quitarMundo(id) {
  mundos = mundos.filter((m) => m.id !== id); escribir('mina_mundos', mundos); try { localStorage.removeItem('mina_copia_' + id); } catch {}
  if (cuenta) { quitarPend = [...new Set([...quitarPend, id])]; escribir('mina_quitar', quitarPend); subirCuentaLuego(); }
}

/* ════════ La cuenta: guardar la maquinita y los mundos con Google ════════ RLR */
// Jugar nunca pide nada. Quien quiere guardar su maquinita y sus mundos entra con Google cuando quiera: su correo queda ligado
// a una sola maquinita y a todos sus mundos, y en cualquier otro equipo, al entrar, los recupera tal cual. El botón de Google
// se carga solo cuando se va a usar: el inicio sigue siendo jugar al instante.
let cuenta = leer('mina_cuenta', null), quitarPend = leer('mina_quitar', []), subirCuentaT = 0, gsi = null, avisoOtraMaq = false;
const guardarCuenta = () => escribir('mina_cuenta', cuenta);
const datosCuenta = () => ({ mundos: mundos.map((m) => ({ id: m.id, nombre: m.nombre, maq: m.maq, modelo: m.modelo, creador: m.creador, ult: m.ult })), duenos, quitar: quitarPend });
function subirCuentaLuego() { if (!cuenta) return; clearTimeout(subirCuentaT); subirCuentaT = setTimeout(subirCuenta, 2500); }
async function subirCuenta() {
  if (!cuenta) return;
  clearTimeout(subirCuentaT);
  const enviado = Date.now(), q = quitarPend.slice();
  try {
    const r = await fetch('/api/cuenta/sync', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ses: cuenta.ses, ...datosCuenta() }) });
    if (r.status === 401) { cuenta = null; try { localStorage.removeItem('mina_cuenta'); } catch {} return; }      // la sesión ya no sirve: se sigue jugando igual
    const d = await r.json(); if (!Array.isArray(d.mundos)) return;
    quitarPend = quitarPend.filter((id) => !q.includes(id)); escribir('mina_quitar', quitarPend);
    deCuenta(d, enviado);
  } catch {}
}
// Lo que guarda la cuenta llega a este equipo: los mundos que faltaban y las llaves de dueño. Lo que cambió aquí mientras
// tanto se respeta.
function deCuenta(d, enviado) {
  const l = new Map(d.mundos.map((m) => [m.id, { ...(mundos.find((x) => x.id === m.id) || {}), ...m }]));
  for (const m of mundos) if (m.ult > enviado) l.set(m.id, m);
  mundos = [...l.values()].sort((a, b) => b.ult - a.ult); escribir('mina_mundos', mundos);
  if (d.duenos) { Object.assign(duenos, d.duenos); escribir('mina_duenos', duenos); }
  if (cuenta) {
    cuenta = { ...cuenta, email: d.email || cuenta.email, nombre: d.nombre || cuenta.nombre, foto: d.foto || cuenta.foto, k: d.k || cuenta.k }; guardarCuenta();
    if (cuenta.k && miK && cuenta.k !== miK && listo && !soloVer && !avisoOtraMaq) { avisoOtraMaq = true; tarjeta('Tu cuenta cambió de maquinita', 'La próxima vez que abras Mina entras con la de tu cuenta.', 'msj', 7000); }
  }
}
// Entrar: todo CapitalTorreon entra por login.capitaltorreon.com (un solo login para todos los servicios). Se va allá con la
// liga de regreso y se vuelve a esta misma página con #sesion=<pase>; el pase se manda al mundo, que lo verifica solo.
const LOGIN_CT = 'https://login.capitaltorreon.com';
function botonGoogle(caja) {
  caja.innerHTML = '<button class="gEntrar"><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"/><path fill="#FBBC05" d="M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.3 0 11.7-2.1 15.6-5.7l-7.7-6c-2.1 1.4-4.8 2.3-7.9 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>Entrar con Google</button>';
  caja.firstChild.onclick = () => { if (listo && !soloVer) { enviarEst(); guardarCopia(); } location.href = LOGIN_CT + '/?volver=' + encodeURIComponent(location.origin + location.pathname + (location.search.includes('mundos') ? '?mundos' : '')); };
}
// Al volver del login: el pase viene después del # y nunca viaja al servidor en la dirección.
const paseLogin = (location.hash.match(/sesion=([\w-]+\.[\w-]+\.[\w-]+)/) || [])[1] || '';
if (paseLogin) { try { localStorage.setItem('ct_sesion', paseLogin); } catch {} history.replaceState(null, '', location.pathname + location.search); setTimeout(() => alEntrarGoogle({ credential: paseLogin }), listo ? 0 : 1500); }
// Si la casa ya reconoce a esta persona (entró en otro servicio), Mina entra sola con ese mismo pase.
addEventListener('load', () => { if (!window.LoginCT) return; LoginCT.alPrefs(() => { op = { vol: 0.7, temblor: 1, part: 2, texto: 1, contraste: 0, dalton: 0, nombres: 1, zoom: 1, fps: 0, mudo: 0, ...leer('mina_op', {}) }; aplicarOp(); volumenes(); pintarBocina(); if (menu === 'menu') pintarMenu(); aviso('Tus preferencias llegaron de tu cuenta'); }); const yaCasa = () => { const p = LoginCT.pase(); if (!cuenta && p && !paseLogin) setTimeout(() => alEntrarGoogle({ credential: p }), listo ? 0 : 1500); }; yaCasa(); LoginCT.al(yaCasa); });
async function alEntrarGoogle(resp) {
  const k = miK || (maqLocal && maqLocal.k) || '';
  aviso('Entrando con Google…');
  try {
    const r = await fetch('/api/cuenta/google', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ credential: resp && resp.credential, k, n: miNombre, m: miModelo, ...datosCuenta() }) });
    const d = await r.json(); if (!r.ok || !d.ses) throw 0;
    quitarPend = []; escribir('mina_quitar', quitarPend);
    cuenta = { ses: d.ses, email: d.email, nombre: d.nombre, foto: d.foto, k: d.k, n: (d.maq && d.maq.n) || '', m: (d.maq && d.maq.m) | 0 }; guardarCuenta();
    deCuenta(d, Date.now());
    if (!d.k || d.k === k) {
      son.logro(); tarjeta('💾 Listo: todo queda guardado en tu cuenta', (d.email || '') + ' · tu maquinita y tus mundos, en cualquier equipo.', 'msj', 7000);
      if (menu === 'menu') pintarMenu(); else if (menu === 'inicio' && location.search.includes('mundos')) pantallaMundos();
      return;
    }
    const aqui = d.aqui;      // la cuenta ya tenía su maquinita y este equipo traía otra
    if (!aqui || ((aqui.tot || 0) <= 0 && (aqui.seg || 0) < 300)) return usarMaquinaCuenta(d);      // la de aquí apenas nació: sigue la de la cuenta
    elegirMaquina(d, k);
  } catch { tarjeta('No se pudo entrar', 'Google no contestó o se fue la conexión. Inténtalo otra vez.', 'msj', 6000); }
}
// Este equipo pasa a jugar con la maquinita de la cuenta y abre «Mis mundos», ya con todos los mundos de la cuenta.
function usarMaquinaCuenta(d) {
  if (listo && !soloVer) { enviarEst(); guardarCopia(); }
  maqLocal = { k: d.k, n: (d.maq && d.maq.n) || '', m: (d.maq && d.maq.m) | 0 }; escribir('mina_maq', maqLocal);
  try { localStorage.removeItem('mina_est'); localStorage.removeItem('mina_maq_antes'); } catch {}
  escribir('mina_nota', 'Entraste con tu cuenta: sigues con ' + (maqLocal.n || 'tu maquinita') + '.');
  location.href = '/?mundos';
}
function elegirMaquina(d, k) {
  const a = d.maq || { n: 'La de tu cuenta', tot: 0, rec: 0, seg: 0 }, b = d.aqui;
  const sub = (x) => `${fmt(x.tot || 0)} ganados · récord ${num(x.rec || 0)} m · ⏱ ${tiempoLargo(x.seg || 0)}`;
  if (listo && !soloVer) { enviarEst(); guardarCopia(); }
  inicio(`<header><h2>💾 ¿Con cuál maquinita sigues?</h2></header><div class="cuerpo">
    <p class="nota">Tu cuenta ya tiene su maquinita y en este equipo traes otra. Cada cuenta lleva una sola: la que no elijas se queda fuera de tu cuenta.</p>
    <div class="fila"><div class="ic">⭐</div><div class="t"><b>${esc(a.n)}</b><small>La de tu cuenta · ${sub(a)}</small></div><button id="bCuenta">Seguir con esta</button></div>
    <div class="fila"><div class="ic">⛏️</div><div class="t"><b>${esc(b.n)}</b><small>La de este equipo · ${sub(b)}</small></div><button class="s" id="bAqui">Quedarme con esta</button></div></div>`);
  $('#bCuenta').onclick = () => usarMaquinaCuenta(d);
  $('#bAqui').onclick = async (e) => {
    e.target.disabled = true;
    try {
      const r = await fetch('/api/cuenta/maquina', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ses: cuenta.ses, k }) }), x = await r.json();
      if (!r.ok || x.k !== k) throw 0;
      cuenta = { ...cuenta, k, n: b.n, m: b.m | 0 }; guardarCuenta();
      escribir('mina_nota', 'Listo: ' + b.n + ' es la maquinita de tu cuenta.'); location.reload();
    } catch { e.target.disabled = false; tarjeta('No se pudo guardar', 'Se fue la conexión. Inténtalo otra vez.', 'msj', 5000); }
  };
}
// Cerrar sesión: lo de la cuenta queda guardado en ella y este equipo empieza de cero (sirve en una computadora prestada).
async function salirCuenta() {
  if (!cuenta || !confirm('¿Cerrar sesión en este equipo?\n\nTu maquinita y tus mundos quedan guardados en tu cuenta. Este equipo empieza de cero, con una maquinita nueva.')) return;
  if (listo && !soloVer) { enviarEst(); guardarCopia(); }
  await subirCuenta();
  try { await fetch('/api/cuenta/salir', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ses: cuenta && cuenta.ses }) }); } catch {}
  try { for (const k of Object.keys(localStorage)) if (k.startsWith('mina_') && k !== 'mina_op') localStorage.removeItem(k); } catch {}
  if (window.LoginCT) return LoginCT.salir();      // sale también de la casa, para que no vuelva a entrar sola
  location.href = '/';
}
// La tarjeta de la cuenta: en Menú → Mundo y en «Mis mundos».
function htmlCuenta() {
  if (cuenta) return `<div class="fila cuentaG"><div class="ic">${cuenta.foto ? `<img src="${esc(cuenta.foto)}" alt="" referrerpolicy="no-referrer">` : '✅'}</div><div class="t"><b>Guardado en tu cuenta</b><small>${esc(cuenta.email || '')} · tu maquinita y tus mundos quedan a salvo y se recuperan en cualquier equipo. Toca tu foto para ir a los demás juegos y proyectos, o salir.</small></div><div data-login-ct></div></div>`;
  return `<div class="fila cuentaG"><div class="ic">💾</div><div class="t"><b>Guarda tu maquinita y tus mundos</b><small>Con tu correo de Google: los recuperas en cualquier equipo y retomas donde te quedaste. Jugar sigue sin pedir nada.</small></div><div class="gBoton" id="gBoton"></div></div>`;
}
// La copia de este equipo: el mundo (semilla, túneles, colección) y la maquinita. Con ella el juego abre al instante,
// sin esperar al servidor, y se puede seguir jugando sin internet; al volver la señal, lo de aquí se manda al mundo.
let dugCambios = 0, copiaDug = -1, copiaEst = '', tReloj = Date.now(), tEntrada = Date.now(), relojN = 0;
for (const ev of ['keydown', 'pointerdown', 'wheel', 'touchstart']) addEventListener(ev, () => { tEntrada = Date.now(); }, { passive: true, capture: true });
const ocio = window.requestIdleCallback ? (f) => requestIdleCallback(() => f(), { timeout: 3000 }) : (f) => setTimeout(f, 0);      // lo que no urge se hace entre cuadro y cuadro
function guardarCopia() {
  if (!listo || !S || !mundoId || !miK || miI < 0 || !miNombre) return;
  if (yo.renace) { S.x = INICIO_X; S.y = INICIO_Y; } else { S.x = yo.x; S.y = yo.perf ? yo.perf.oy : yo.y; }
  S.mu = mundoId;
  const e = JSON.stringify({ k: miK, e: S });
  if (e !== copiaEst) { copiaEst = e; try { localStorage.setItem('mina_est', e); } catch {} }
  if (copiaDug !== dugCambios) {
    copiaDug = dugCambios; escribir('mina_copia_' + mundoId, { ...archivoDelMundo(), k: miK, i: miI, n: miNombre, m: miModelo, creador: soyCreador ? 1 : 0 });
    for (const m of mundos.slice(4)) { try { localStorage.removeItem('mina_copia_' + m.id); } catch {} }      // solo los cuatro mundos más recientes
  }
}
async function abrirCopia(id) {
  const c = leer('mina_copia_' + id, null), e = leer('mina_est', null);
  if (!c || c.k !== miK || !e || e.k !== miK || !e.e || !Number.isFinite(c.seed) || typeof c.dug !== 'string' || !c.n || !c.cfg) return false;
  try { atob(c.dug); } catch { return false; }
  const tr = c.terreno && c.terreno.h ? c.terreno : null, blob = tr ? await leerMapaLocal(tr.h) : null;      // el terreno guardado en este equipo
  if (listo || S || mundoId !== id) return true;                   // el mundo contestó antes: ya está adentro
  iniciarMundo({ mapa: blob ? tr : null, blob, sinMineral: c.sinMineral, seed: c.seed, remin: c.remin | 0, cfg: c.cfg, i: c.i | 0, creador: c.creador ? 1 : 0, dug: c.dug, col: Array.isArray(c.col) ? c.col : [], est: e.e, jug: [{ i: c.i | 0, n: c.n, m: c.m | 0 }], cuenta: 0 }, true);
  return true;
}
// Nadie llena nada para empezar: la maquinita nace con nombre de mina y modelo al azar. Se cambian en Menú → Mundo.
const NOMBRES = ['La Chispa', 'El Topo', 'La Güera', 'Don Pepita', 'La Barretera', 'El Tepetate', 'La Valenciana', 'El Gambusino', 'La Veta', 'El Malacate', 'La Bonanza', 'El Socavón', 'La Pepita', 'El Barretero', 'La Rayadora', 'El Tiro', 'La Carbonera', 'El Jale'];
function nombreNuevo() { const r = crypto.getRandomValues(new Uint8Array(2)); return { n: NOMBRES[r[0] % NOMBRES.length], m: r[1] % MODELOS.length }; }
// El inicio para quien llega por primera vez: el mundo nace aquí mismo y ya se puede jugar. En cuanto mueve algo,
// el mundo se registra con esa misma semilla y recibe su liga; lo que ya cavó viaja con él.
let porNacer = false, naciendo = false, esperaNacer = 2000, deCasa = false;
function mundoAlInstante() {
  miK = (maqLocal && maqLocal.k) || llave();
  const e = leer('mina_est', null), b = maqLocal && maqLocal.n ? { n: maqLocal.n, m: maqLocal.m | 0 } : nombreNuevo();
  bautizo = b; maqLocal = { k: miK, n: b.n, m: b.m }; escribir('mina_maq', maqLocal);
  mundoId = ''; porNacer = true;
  iniciarMundo({ seed: crypto.getRandomValues(new Uint32Array(1))[0], remin: 0, cfg: { ...cfg }, i: 0, creador: 1, dug: '', col: [], est: e && e.k === miK ? e.e : null, jug: [{ i: 0, n: b.n, m: b.m }], cuenta: 0 }, true);
}
async function nacer() {
  if (!porNacer || naciendo) return; naciendo = true;
  try {
    const r = await fetch('/api/mundo', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ archivo: archivoDelMundo(true) }) }), d = await r.json();      // el mundo nace con su terreno completo
    if (!d.id) throw 0;
    porNacer = false; if (d.d) { duenos[d.id] = d.d; escribir('mina_duenos', duenos); }
    mundoId = d.id; history.replaceState(null, '', '/' + d.id); conectar();
  } catch { setTimeout(() => { naciendo = false; nacer(); }, esperaNacer); esperaNacer = Math.min(30000, esperaNacer * 2); return; }
  naciendo = false;
}
function llave() { return [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join(''); }
function inicio(h) { menu = 'inicio'; detener(); $('#velo').classList.add('on', 'inicio'); $('#caja').innerHTML = h; }
function pantallaFinal(t, x) {
  inicio(`<header><h2>${t}</h2></header><div class="cuerpo"><p>${x}</p><p><button id="bIr">Ir a mis mundos</button></p></div>`);
  $('#bIr').onclick = () => (location.href = '/?mundos');
}
function pantallaMundos() {
  const nota = leer('mina_nota', ''); if (nota) { try { localStorage.removeItem('mina_nota'); } catch {} }
  inicio(`<header><h2>⛏️ Mina · Mis mundos</h2></header><div class="cuerpo">` + (nota ? `<p class="nota" style="color:var(--ac)"><b>${esc(nota)}</b></p>` : '') + htmlCuenta() +
    (maqLocal && maqLocal.n ? `<p class="nota">Tu maquinita <b>${esc(maqLocal.n)}</b> entra contigo al mundo que elijas, con todo lo que trae.</p>` : '') +
    mundos.map((m) => `<div class="fila"><div class="t"><b>${esc(m.nombre)}</b><small>${m.maq ? 'Tu maquinita: ' + esc(m.maq) + ' · ' : ''}${new Date(m.ult).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })} · ${m.id}</small></div>
      <button data-ir="${m.id}">Continuar</button><button class="s" data-des="${m.id}">Desechar</button></div>`).join('') +
    `<p style="margin-top:14px"><button id="bNuevo">＋ Crear mundo nuevo</button></p><p class="nota">Cada mundo nace con una semilla distinta y se guarda solo, completo y para siempre: con su liga se vuelve a entrar cuando sea, tal como se dejó. Para jugar acompañado, entra y copia su liga.</p></div>`);
  $('#bNuevo').onclick = pantallaCrear;
  $('#caja').querySelectorAll('[data-ir]').forEach((b) => (b.onclick = () => (location.href = '/' + b.dataset.ir)));
  $('#caja').querySelectorAll('[data-des]').forEach((b) => (b.onclick = () => { const m = mundos.find((x) => x.id === b.dataset.des); desechar(m.id, m.creador, m.k || (maqLocal && maqLocal.k)); }));
  if ($('#gBoton')) botonGoogle($('#gBoton'));
  const lc = $('#caja [data-login-ct]'); if (lc && window.LoginCT) LoginCT.montar(lc);
}
// Crear un mundo: de cero, o a partir de un archivo que alguien guardó. Siempre nace un mundo nuevo con su propia liga; nada se reemplaza.
function pantallaCrear() {
  inicio(`<header><h2>⛏️ Crear mundo nuevo</h2>${mundos.length ? '<button class="s" id="bVolver">Volver</button>' : ''}</header><div class="cuerpo">
    <div class="fila"><div class="ic">🌱</div><div class="t"><b>De cero</b><small>Semilla nueva, tierra sin tocar. Nadie ha cavado aquí.</small></div><button id="bCero">Crear</button></div>
    <div class="fila"><div class="ic">📂</div><div class="t"><b>Cargar un archivo de mundo</b><small>El archivo que tú u otra persona guardó desde Menú → Mundo → Guardar archivo. Nace un mundo nuevo, con su propia liga, idéntico al guardado: sus túneles, sus reglas y su colección.</small></div><button id="bAbrir">Elegir archivo</button><input id="fArchivo" type="file" accept=".json,application/json" hidden></div>
    <p class="nota">Cargar un archivo nunca reemplaza un mundo que ya existe: siempre crea otro. Tu maquinita no va en el archivo: es tuya y entra contigo al mundo que abras. Para pasarla a otro equipo, usa su liga o su código QR (Menú → Mundo → Mi maquinita).</p></div>`);
  if ($('#bVolver')) $('#bVolver').onclick = pantallaMundos;
  $('#bCero').onclick = () => crearMundo();
  $('#bAbrir').onclick = () => $('#fArchivo').click();
  $('#fArchivo').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { const a = JSON.parse(await f.text()); if (a.formato !== 'mina-mundo' || !Number.isFinite(a.seed) || typeof a.dug !== 'string') throw 0; crearMundo(a); }
    catch { pantallaFinal('Ese archivo no es un mundo de Mina', 'Elige un archivo .json guardado desde Menú → Mundo → Guardar archivo.'); }
  };
}
function desechar(id, creador, k) {
  if (!confirm('¿Desechar este mundo? Sale de tu lista.')) return;
  const paraTodos = creador && confirm('Tú creaste este mundo. ¿Borrarlo también para todos los demás?\n\nAceptar = borrarlo para todos · Cancelar = solo quitarlo de mi lista');
  const fin = async () => { quitarMundo(id); if (cuenta) await subirCuenta(); location.href = '/?mundos'; };
  if (!paraTodos) return fin();
  if (id === mundoId && conectado) { enviar({ t: 'borrar' }); return setTimeout(fin, 400); }
  const s = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws/' + id);
  s.onopen = () => s.send(JSON.stringify({ t: 'hola', k }));
  s.onmessage = (e) => { if (typeof e.data === 'string' && e.data.includes('"t":"mundo"')) { s.send('{"t":"borrar"}'); setTimeout(fin, 400); } };
  s.onerror = fin; setTimeout(fin, 4000);
}
async function crearMundo(archivo) {
  inicio(archivo ? '<header><h2>Abriendo tu mundo guardado…</h2></header><div class="cuerpo"><p class="nota">Con sus túneles, sus reglas y su colección.</p></div>' : '<header><h2>Creando tu mundo…</h2></header><div class="cuerpo"><p class="nota">Semilla nueva, tierra nueva.</p></div>');
  try {
    const r = await fetch('/api/mundo', archivo ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ archivo }) } : { method: 'POST' }), d = await r.json();
    if (!d.id) throw 0;
    if (d.d) { duenos[d.id] = d.d; escribir('mina_duenos', duenos); }
    history.replaceState(null, '', '/' + d.id); entrar(d.id);
  } catch { pantallaFinal('No se pudo crear el mundo', 'Revisa tu conexión e inténtalo otra vez.'); }
}
function entrar(id) {
  mundoId = id;
  const m = mundos.find((x) => x.id === id);
  miK = ligaMaquinita || (maqLocal && maqLocal.k) || (m && m.k) || (mundos[0] && mundos[0].k) || llave();
  if (!ligaMaquinita && !(maqLocal && maqLocal.n)) bautizo = nombreNuevo();      // llega por una liga y no tiene maquinita: nace bautizada
  // Si este equipo ya conoce el mundo, abre al instante con su copia; el servidor se pone al corriente en cuanto contesta.
  inicio('<header><h2>Entrando al mundo…</h2></header><div class="cuerpo"><p class="nota" id="entrando">' + esc(id) + '</p></div>');
  setTimeout(() => { const n = $('#entrando'); if (n && !listo) n.textContent = 'No hay señal con el mundo y este equipo todavía no tiene copia de él. Sigo intentando: en cuanto conteste, entras.'; }, 6000);
  abrirCopia(id);
  conectar();
}

addEventListener('resize', aplicarOp);
document.addEventListener('visibilitychange', () => { if (!document.hidden && document.title !== 'Mina · excava con tus amigos' && !location.search.includes('foto')) document.title = 'Mina · excava con tus amigos'; if (document.hidden) { for (const k in teclas) teclas[k] = false; if (sucio) enviarEst(); guardarCopia(); } });
addEventListener('pagehide', () => { enviarEst(); guardarCopia(); });
setInterval(componer, 220);               // la música sigue aunque haya un menú abierto
setInterval(() => {                       // lo poco que corre aunque el juego esté detenido
  if (sucio && conectado) enviarEst();
  if (++latido % (document.hidden ? 25 : 5) === 0) latir();
  // El reloj de la maquinita: suma mientras se está jugando de verdad. No cuenta con la pestaña oculta, en pausa, ni tras
  // dos minutos sin tocar nada con la maquinita quieta.
  { const ahora = Date.now(), dt = Math.min(2, (ahora - tReloj) / 1000); tReloj = ahora;
    if (S && listo && !soloVer && !document.hidden && !pausa && (ahora - tEntrada < 120000 || yo.perf || Math.abs(yo.vx) + Math.abs(yo.vy) > 0.5)) { S.seg = (S.seg || 0) + dt; if (++relojN % 30 === 0) sucio = true; } }
  // en la tabla abierta, el reloj de quien está jugando corre cada segundo
  if (topAbierta()) document.querySelectorAll('#caja .tt[data-vivo="1"]').forEach((el) => { el.dataset.seg = +el.dataset.seg + 1; el.textContent = '⏱ ' + tiempoLargo(+el.dataset.seg); });
  if (soloVer && (pido === 'espera' || pido === 'ausente')) pintarEspera();
  if (peleas.size) { for (const [i, p] of peleas) if (tiempo - p.h > 6) peleas.delete(i); pintarPleito(); if (soloVer) pintarVer(); }
  pendientesTienda(); if (latido % 5 === 0) invitarPintureria(); if (latido % 7 === 0) diaDeCumple(); if (latido % 11 === 0) invitarGente();
  if (!cuenta && S && listo && !soloVer && S.seg > 600 && !leer('mina_invitoG', 0)) { escribir('mina_invitoG', 1); tarjeta('💾 ¿Guardamos tu maquinita?', 'Con tu correo de Google la recuperas en cualquier equipo, con todos tus mundos. Cuando quieras: Menú → Mundo.', 'msj', 9000); }
  if (latido % 4 === 0) ocio(guardarCopia);
  if (!document.hidden && listo && Date.now() - tablaM.pedido > (topAbierta() ? 4000 : 60000) && (topAbierta() || (!soloVer && conectado && (!tablaM.t || S.tot >= tablaM.corte)))) pedirTop();
  if (latido % 9 === 0 && !document.hidden) subirFotos(!!menu);
  const c = $('#cuenta');
  if (cuentaFin) { const s = Math.ceil((cuentaFin - Date.now()) / 1000); c.style.display = 'block'; c.textContent = s > 0 ? `🌋 Remineralizando en ${s}…` : '🌋'; if (s < -3) cuentaFin = 0; }
  else c.style.display = 'none';
}, 1000);

// La liga de una maquinita trae su llave después del #: el navegador nunca la manda al servidor en la dirección.
const ligaMaquinita = (location.hash.match(/maquinita=([0-9a-zA-Z]{16,64})/) || [])[1] || '';
if (location.hash) history.replaceState(null, '', location.pathname);
if (ligaMaquinita) { maqLocal = { k: ligaMaquinita }; escribir('mina_maq', maqLocal); }
else if (cuenta && cuenta.k && (!maqLocal || maqLocal.k !== cuenta.k)) {      // con cuenta, este equipo juega con la maquinita de la cuenta
  maqLocal = { k: cuenta.k, ...(cuenta.n ? { n: cuenta.n, m: cuenta.m | 0 } : {}) }; escribir('mina_maq', maqLocal);
  try { localStorage.removeItem('mina_est'); } catch {}
}
if (cuenta) setTimeout(subirCuenta, 2500);
aplicarOp(); sonidoUI();
{
  const r = location.pathname.match(/^\/(?:m\/)?([2-9A-HJ-NP-Z]{8})\/?$/i);      // la liga es el dominio y las 8 letras; la de antes, con /m/, sigue sirviendo
  if (r && location.pathname !== '/' + r[1].toUpperCase()) history.replaceState(null, '', '/' + r[1].toUpperCase() + location.search);
  const v = location.pathname.match(/^\/ver\/([2-9A-HJ-NP-Z]{12})\/?$/i);
  if (location.search.includes('foto')) escenaDeMuestra();
  else if (v) {
    soloVer = true; verFicha = v[1].toUpperCase(); veo = +(location.search.match(/[?&]j=(\d{1,2})/) || [])[1]; if (!(veo >= 0)) veo = -1;
    inicio('<header><h2>👁 Buscando la transmisión…</h2></header><div class="cuerpo"><p class="nota">Vas a ver jugar en vivo. No necesitas nada.</p></div>');
    conectar();
  }
  else if (r) entrar(r[1].toUpperCase());
  else if (location.pathname.length > 1) pantallaFinal('Esta liga está incompleta', 'La liga de un mundo termina en 8 letras y números. Pídela otra vez o entra a tus mundos.');
  else if (location.search.includes('mundos')) pantallaMundos();
  else if (mundos.length) { deCasa = true; history.replaceState(null, '', '/' + mundos[0].id); entrar(mundos[0].id); }      // el inicio es jugar: abre el último mundo
  else mundoAlInstante();
}
function escenaDeMuestra() {
  seed = 20261002; remin = 0; nuevaSemilla(); terrenoProcedural();
  S = sanear(null); S.eq = [3, 3, 3, 3, 3, 3]; S.rec = 96; S.st.rec[0] = S.st.rec[1] = S.st.rec[2] = S.st.rec[3] = 1; miNombre = 'Ricardo'; miModelo = 0; mundoId = 'MUESTRA2';
  // El título va sobre cielo limpio, a la izquierda; el pueblo queda a la derecha y las maquinitas se ven grandes.
  const cava = (a, b, c, d) => { for (let x = a; x <= c; x++) for (let y = b; y <= d; y++) ponerCavada(y * W + x); };
  cava(33, 0, 33, 2); cava(29, 2, 32, 2); cava(34, 2, 36, 2); cava(36, 3, 36, 4); cava(37, 4, 40, 4); cava(40, 5, 40, 5);
  yo.x = 40.5; yo.y = 5.6; yo.dir = 1; yo.perf = { tx: 40, ty: 6, t: 0.1, dur: 0.3, tipo: 1, ox: 40.5, oy: 5.6, idx: 0 }; vis.x = yo.x; vis.y = yo.y;
  otros.set(1, { i: 1, n: 'Sofi', m: 7, on: 1, x: 30.4, y: 2.6, fl: 0 }); otros.set(2, { i: 2, n: 'Luis', m: 2, on: 1, x: 43.4, y: -0.4, fl: 1 });
  flot = [{ x: 38.4, y: 3.5, txt: '+ Oro · $250', col: '#ffd23f', t: 1.2 }];
  op.zoom = 0; rit.niv = 0; rit.sonda = false; listo = true; medir();
  camX = 27.2; camY = -filas * 0.5; reloj = 2.2; dibujar();
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;left:3.6%;top:2.6%;font:900 min(13vw,156px)/0.9 system-ui;color:#ffd23f;-webkit-text-stroke:7px #2a1a14;paint-order:stroke fill;text-shadow:0 8px 0 #0006';
  d.innerHTML = 'MINA<div style="font:800 min(3.5vw,42px)/1.22 system-ui;color:#fff;-webkit-text-stroke:6px #2a1a14;paint-order:stroke fill;margin-top:16px;text-shadow:none">Entras y ya estás jugando.<br>Excava con tus amigos.</div>';
  document.body.appendChild(d);
}
// Para pruebas: window.__mina
window.__mina = { get S() { return S; },
  async sonido(fn, seg = 4, solo = null) {          // arma el sonido fuera de línea y devuelve pico, volumen medio y brillo por tramos
    const g0 = [AC, maestro, ruidoBuf, eco, { ...bus }, { ...lazo }], limpia = () => { for (const k in bus) delete bus[k]; for (const k in lazo) delete lazo[k]; };
    limpia(); AC = new OfflineAudioContext(1, 44100 * seg, 44100); montar(); maestro.gain.value = 1; for (const [id, , niv] of TIPOS) bus[id].gain.value = !solo || solo.includes(id) ? niv : 0;
    let b; try { fn(); b = (await AC.startRendering()).getChannelData(0); } finally { limpia(); [AC, maestro, ruidoBuf, eco] = g0; Object.assign(bus, g0[4]); Object.assign(lazo, g0[5]); musica.t = 0; musica.z = ''; }
    const tramo = (a, z) => { let p = 0, e = 0, c = 0; for (let i = a; i < z; i++) { const v = b[i]; p = Math.max(p, Math.abs(v)); e += v * v; if (i > a && (v > 0) !== (b[i - 1] > 0)) c++; } return [+p.toFixed(3), +Math.sqrt(e / (z - a)).toFixed(4), Math.round(c / 2 / ((z - a) / 44100))]; };
    const n = Math.min(8, Math.ceil(seg)), paso = Math.floor(b.length / n);
    return { todo: tramo(0, b.length), tramos: Array.from({ length: n }, (_, i) => tramo(i * paso, (i + 1) * paso)) };
  },
  son, sonarLazos, componer, piano, get op() { return op; },
  eden(px = 8) { edenFirma = ''; edenE = armarEden(); const c = document.createElement('canvas'); c.width = W * px; c.height = EDEN_H * px; const q = c.getContext('2d'); q.setTransform(px, 0, 0, px, 0, 0); for (const e of edenE) { q.save(); e[4](q); q.restore(); } return c; }, avanza(seg) { for (let i = 0, n = Math.round(seg * 120); i < n; i++) { tiempo += DT; ant.x = yo.x; ant.y = yo.y; fisica(DT); darVuelta(); if (i % 14 === 0) cadaTanto(); } vis.x = yo.x; vis.y = yo.y; }, rit, red, animar, grua, costoGrua, dibujar, llegar, danar, get e() { return { corriendo, menu, pausa, listo, conectado, tiempo, perf: yo.perf, renace: yo.renace }; }, yo, otros, celda, gen, get cfg() { return cfg; }, usar, abrir, cerrar, teclas, enviarEst, veta, LOGROS };
/* RLR · Ricardo López Reyero · fin */
