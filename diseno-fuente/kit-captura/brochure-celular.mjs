const PREP = `
window.__b = (() => {
  const cava = (a, b, c, d) => { for (let x = a; x <= c; x++) for (let y = b; y <= d; y++) ponerCavada(y * W + x); };
  const mineral = (x, y, k) => { const i = y * W + x; base[i] = 10 + k; mapa[i] = 255; };
  const gente = (l) => { otros.clear(); l.forEach((o, k) => otros.set(k + 50, { i: k + 50, on: 1, fl: 0, p: {}, ...o })); pintarTabla(); };
  const ir = (x, y) => { yo.x = x; yo.y = y; yo.vx = yo.vy = 0; yo.perf = null; yo.vuela = false; vis.x = x; vis.y = y; S.x = x; S.y = y; };
  return { cava, mineral, gente, ir };
})(); 'ok'`;
export default async ({ ir, ev, foto, dormir, cmd }) => {
  await ir('http://localhost:8791/', 6500);
  await ev(PREP);
  console.log(await ev(`JSON.stringify({ movil: typeof movil !== 'undefined' && movil, tactil: typeof tactil !== 'undefined' && tactil, cls: document.body.className, w: innerWidth, h: innerHeight })`));
  await foto('11-celular-superficie');
  await ev(`S.fuel = tanque(); S.d = 2350; S.carga[0] = 2; S.carga[1] = 1; S.carga[3] = 2; S.rec = 16;
    __b.cava(24, 0, 24, 8); __b.cava(21, 3, 23, 3); __b.cava(25, 5, 27, 5); __b.cava(22, 8, 23, 8); __b.cava(25, 8, 26, 8);
    __b.mineral(26, 9, 3); __b.mineral(25, 9, 3); __b.mineral(22, 6, 1); __b.mineral(27, 7, 2); __b.mineral(23, 10, 4);
    __b.ir(25.5, 8.6); pintarHud(true); 'ok'`);
  await dormir(900);
  await ev(`document.querySelector('#avisos').innerHTML = ''; __b.gente([{ n: 'Sofi', m: 7, x: 23.5, y: 5.6 }, { n: 'Luis', m: 2, x: 24.5, y: 6.4, fl: 3 }, { n: 'Javier', m: 3, x: 22.5, y: 8.6, fl: 1 }]); 'ok'`); await dormir(80);
  await ev(`[...document.querySelectorAll('div,section,article')].filter((e) => e.children.length <= 4 && /^.{0,6}Tu maquinita se llama/.test(e.textContent.trim())).forEach((e) => e.remove()); 'ok'`); await dormir(120);
  await foto('12-celular-excavando');
};
