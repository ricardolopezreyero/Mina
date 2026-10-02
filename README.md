# Mina

**Ver en vivo: https://mina.capitaltorreon.com**

Juego de minería para navegador, infinito y compartido. Bajas con tu maquinita, llenas la bodega, subes, vendes, mejoras el equipo y bajas más hondo. Mandas la liga de tu mundo y tu gente entra a excavar contigo, en tiempo real.

Gratis, sin registro y sin instalar nada. Toda la descarga pesa unos 44 KB.

## Cómo se juega

- **Flechas o WASD** para moverte. **↑** vuela, **↓** perfora hacia abajo, **← →** contra una pared perfora de lado.
- En la superficie, párate frente a un edificio y pulsa **↓** para entrar.
- **F R X C Q M** usan los objetos. **G** deja una señal, **T** pasa combustible, **P** pausa, **Esc** abre el menú.
- **E** pide la grúa a la Gasolinera mientras subes. La rueda o el trackpad mueven la vista; cualquier flecha la regresa.
- Para jugar acompañado: Menú → Mundo → **Copiar la liga**.

## Qué hay en el repositorio

| Archivo | Qué es |
|---|---|
| `publico/index.html`, `publico/juego.js` | Todo el juego. Sin librerías, imágenes ni audios |
| `src/mundo.js` | El servidor: un Durable Object de Cloudflare por mundo |
| `wrangler.jsonc` | Configuración del Worker y del dominio |
| `docs/Documento_Maestro_Mina_v3_2026-10-02_0047.md` | Qué está construido, con qué números y qué falta |
| `Prompt_Maestro_Mina_v4_2026-10-01_2336.md` | El diseño completo |

## Probar y publicar

```bash
npx wrangler dev
```

```bash
npx wrangler deploy
```

Para pruebas desde la consola del navegador existe `window.__mina` (estado, `avanza(segundos)`, `usar(objeto)`, `abrir(menú)`).

<!-- RLR · Ricardo López Reyero -->
