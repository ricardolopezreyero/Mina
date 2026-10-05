// Cada formato tiene su puesta en escena: dónde va el tiro, los túneles y cada maquinita.
const R = (x, y, extra = {}) => ({ x, y, n: 'Ricardo', m: 0, perf: 1, ...extra });
const SOFI = (x, y) => ({ n: 'Sofi', m: 7, x, y, fl: 0 }), LUIS = (x, y) => ({ n: 'Luis', m: 2, x, y, fl: 3 }), JAVI = (x, y) => ({ n: 'Javier', m: 3, x, y, fl: 1 });
const H = { cava: [[28, 0, 28, 8], [22, 3, 27, 3], [29, 5, 38, 5], [38, 6, 38, 7], [34, 7, 37, 7], [23, 8, 27, 8]], min: [[38, 8, 3], [35, 8, 3], [30, 7, 1], [25, 5, 2]],
  heroe: R(38.5, 7.6), otros: [SOFI(22.4, 3.6), LUIS(28.5, -1.0), JAVI(24.4, 8.6)], flot: [[36.2, 6.45, '+ Oro · $250']] };
const BAN = { ...H, otros: [SOFI(22.4, 3.6), { n: 'Luis', m: 2, x: 36.2, y: -0.4, fl: 1 }, JAVI(24.4, 8.6)] };
const V = { cava: [[28, 0, 28, 8], [25, 3, 27, 3], [29, 5, 32, 5], [29, 8, 33, 8]], min: [[32, 6, 3], [30, 6, 3], [26, 5, 1], [34, 7, 2]],
  heroe: R(32.5, 5.6), otros: [SOFI(25.4, 3.6), LUIS(28.5, -2.3), JAVI(32.4, 8.6)], flot: [[30.5, 4.3, '+ Oro · $250']] };
const C = { cava: [[28, 0, 28, 7], [24, 3, 27, 3], [29, 5, 33, 5]], min: [[33, 6, 3], [31, 6, 3], [26, 5, 1]],
  heroe: R(33.5, 5.6), otros: [SOFI(24.4, 3.6), LUIS(28.5, -2.3)], flot: [[31.4, 4.3, '+ Oro · $250']] };
const C45 = { ...C, cava: [...C.cava, [29, 8, 33, 8], [28, 8, 28, 8]], otros: [...C.otros, JAVI(32.4, 8.6)] };
const TIRA = { cava: [[28, 0, 28, 2], [22, 2, 27, 2], [29, 2, 36, 2]], min: [[36, 3, 3], [33, 3, 3]], heroe: R(36.5, 2.6), otros: [SOFI(22.4, 2.6), LUIS(28.5, -1.1)], flot: [] };
const TIERRA = { cava: [], heroe: { x: 80, y: -0.4, n: '', m: 0 }, otros: [], nombres: false };
const m = (e) => `__kit.montar(${JSON.stringify(e)}); 'ok'`;
const COLORES = [['#e0483a', '#1b1b1b'], ['#2a6fa8', '#1b1b1b'], ['#ffd23f', '#2a6fa8'], ['#2f8a3a', '#1b1b1b']];
export const trabajos = [
  ['_h', m(H)], ['escena-h-1920x1080', `__kit.escena(1920, 1080, 32, 36, 1)`], ['_ban', m(BAN)], ['escena-banner-2560x1440', `__kit.escena(2560, 1440, 40, 32.1, -1.25)`],
  ['_v', m(V)], ['escena-v-1080x1920', `__kit.escena(1080, 1920, 12, 30.5, 0.47)`],
  ['_c', m(C)], ['escena-c-1080x1080', `__kit.escena(1080, 1080, 14, 29.5, 1)`],
  ['_c45', m(C45)], ['escena-c45-1080x1350', `__kit.escena(1080, 1350, 14, 29.5, 1.25)`],
  ['_t', m(TIRA)], ['escena-x-1500x500', `__kit.escena(1500, 500, 25, 32.5, -1.43)`], ['escena-fb-1640x624', `__kit.escena(1640, 624, 27, 32.5, -1.1)`],
  ['_tierra', m(TIERRA)], ['tierra-v-1080x1920', `__kit.escena(1080, 1920, 12, 20, 40)`], ['tierra-h-1920x1080', `__kit.escena(1920, 1080, 24, 20, 40)`], ['tierra-c-1080x1080', `__kit.escena(1080, 1080, 9, 22, 36)`],
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => [`maq-${k}`, `__kit.maq(${k}, null, 600, '')`]),
  ['maq-0-perfora', `__kit.maq(0, null, 600, 'perfora')`], ['maq-0-vuela', `__kit.maq(0, null, 600, 'vuela')`], ['maq-0-lado', `__kit.maq(0, null, 600, 'lado')`],
  ...Array.from({ length: 22 }, (_, k) => [`gema-${String(k).padStart(2, '0')}`, `__kit.gemaPng(${k})`]), ['minerales.json', `__kit.minerales()`],
  ...[1, 2, 3, 4].map((k) => [`carro-${k}`, `__kit.maq(0, ${JSON.stringify({ carro: k, c1: COLORES[k - 1][0], c2: COLORES[k - 1][1] })}, 600, '')`]),
];
