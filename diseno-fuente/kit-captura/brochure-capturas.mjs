// Las capturas del brochure, sacadas del juego de verdad (mundo nuevo en local), con la escena acomodada.
const PREP = `
window.__b = (() => {
  const cava = (a, b, c, d) => { for (let x = a; x <= c; x++) for (let y = b; y <= d; y++) ponerCavada(y * W + x); };
  const mineral = (x, y, k) => { const i = y * W + x; base[i] = 10 + k; mapa[i] = 255; };
  const gente = (l) => { otros.clear(); l.forEach((o, k) => otros.set(k + 50, { i: k + 50, on: 1, fl: 0, p: {}, ...o })); pintarTabla(); };
  const ir = (x, y) => { yo.x = x; yo.y = y; yo.vx = yo.vy = 0; yo.perf = null; yo.vuela = false; vis.x = x; vis.y = y; S.x = x; S.y = y; };
  return { cava, mineral, gente, ir };
})(); 'ok'`;
export default async ({ ir, ev, foto, dormir, cmd, tecla }) => {
  await ir('http://localhost:8791/', 6000);
  await ev(PREP);
  await ev(`op.zoom = 0; medir(); __b.ir(44.2, INICIO_Y); 'ok'`); await dormir(900);
  await foto('01-superficie');
  // excavando con el equipo
  await ev(`S.fuel = tanque(); S.d = 2350; S.carga[0] = 2; S.carga[1] = 1; S.carga[3] = 2; S.rec = 16;
    __b.cava(24, 0, 24, 8); __b.cava(19, 3, 23, 3); __b.cava(25, 5, 28, 5); __b.cava(20, 8, 23, 8); __b.cava(25, 8, 27, 8);
    __b.mineral(27, 9, 3); __b.mineral(26, 9, 3); __b.mineral(22, 6, 1); __b.mineral(29, 7, 2); __b.mineral(21, 9, 0); __b.mineral(25, 10, 4);
    
    __b.ir(27.5, 8.6); pintarHud(true); 'ok'`);
  await dormir(700);
  await cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 }); await dormir(200); await ev(`document.querySelector('#avisos').innerHTML = ''; __b.gente([{ n: 'Sofi', m: 7, x: 23.5, y: 5.6 }, { n: 'Luis', m: 2, x: 24.5, y: 2.2, fl: 3 }, { n: 'Javier', m: 3, x: 22.5, y: 8.6, fl: 1 }]); 'ok'`); await dormir(60);
  await foto('02-excavando');
  await cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 }); await dormir(900);
  console.log(await ev(`JSON.stringify({y: yo.y, x: yo.x, carga: S.carga.slice(0,6), fuel: S.fuel, otros: otros.size})`));
  // el mapa de lado
  await ev(`abrirMapa(); 'ok'`); await dormir(900); await foto('03-mapa'); await ev(`document.querySelector('#mapaX').click(); 'ok'`); await dormir(300);
  // arriba: la Báscula, el Taller, la Pinturería y el QR
  await ev(`__b.ir(45.5, INICIO_Y); S.carga[0] = 3; S.carga[1] = 2; S.carga[2] = 1; S.carga[3] = 1; 'ok'`); await dormir(900);
  await ev(`abrir('bas'); 'ok'`); await dormir(700); await foto('04-bascula'); await ev(`cerrar(); 'ok'`); await dormir(300);
  await ev(`S.d = 6200; __b.ir(50.5, INICIO_Y); 'ok'`); await dormir(600); await ev(`abrir('tal'); 'ok'`); await dormir(700); await foto('05-taller'); await ev(`cerrar(); 'ok'`); await dormir(300);
  await ev(`__b.ir(33.5, INICIO_Y); 'ok'`); await dormir(600); await ev(`abrir('pin'); 'ok'`); await dormir(4500); await foto('06-pintureria'); await ev(`cerrar(); 'ok'`); await dormir(400);
  await ev(`__b.ir(43.5, INICIO_Y); 'ok'`); await dormir(500); await ev(`abrir('qr'); 'ok'`); await dormir(900); await ev(`(() => { const l = 'https://mina.capitaltorreon.com', q = document.querySelector('#qrLienzo'); pintarQR(q, l, 8); q.closest('.cuerpo').querySelector('code').textContent = l; })(); 'ok'`); await dormir(300); await foto('07-invitar'); await ev(`cerrar(); 'ok'`); await dormir(300);
  // más hondo: el Acuífero y la Gruta de Cristal
  for (const [n, x, y] of [['08-acuifero', 48.5, 553.6], ['09-gruta', 48.5, 1493.6], ['10-ciudad', 37.5, 2813.6]]) {
    await ev(`S.fuel = tanque(); S.vida = vidaMax(); __b.ir(${x}, ${y}); pintarHud(true); 'ok'`); await dormir(1500); await foto(n);
    console.log(n, await ev(`JSON.stringify({ y: yo.y, vida: S.vida, fuel: S.fuel })`));
  }
};
