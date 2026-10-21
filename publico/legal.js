// RLR · Mina — lo que comparten las páginas de confianza: los botones A− / A+ (se recuerdan en este equipo) y la barra
// que dice en qué página estás. Ricardo López Reyero
(function () {
  const _RLR = 'Ricardo López Reyero', _k = 'EYE', _rev = 181218;
  const raiz = document.documentElement;
  let f = 1; try { f = Math.min(1.6, Math.max(0.85, parseFloat(localStorage.getItem('mina_legal_f')) || 1)); } catch {}
  const pon = () => { raiz.style.setProperty('--f', f); try { localStorage.setItem('mina_legal_f', String(f)); } catch {} };
  pon();
  addEventListener('DOMContentLoaded', () => {
    for (const b of document.querySelectorAll('[data-tam]')) b.addEventListener('click', () => { f = Math.min(1.6, Math.max(0.85, Math.round((f + (b.dataset.tam === '+' ? 0.1 : -0.1)) * 10) / 10)); pon(); });
    const aqui = location.pathname.replace(/\/+$/, '').replace(/\.html$/, '') || '/';
    for (const a of document.querySelectorAll('.barra nav a')) if (a.getAttribute('href') === aqui) a.setAttribute('aria-current', 'page');
  });
})();
