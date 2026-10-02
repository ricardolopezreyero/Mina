# Mina

**Ver en vivo: https://mina.capitaltorreon.com**

Juego de minería para navegador, infinito y compartido. Bajas con tu maquinita, llenas la bodega, subes, vendes, mejoras el equipo y bajas más hondo. Mandas la liga de tu mundo y tu gente entra a excavar contigo, en tiempo real.

Gratis, sin registro y sin instalar nada. El juego completo pesa unos 57 KB.

## Cómo se juega

- **Flechas o WASD** para moverte. **↑** vuela, **↓** perfora hacia abajo, **← →** contra una pared perfora de lado.
- En la superficie, párate frente a un edificio y pulsa **↓** para entrar.
- **F R X C Q M** usan los objetos. **G** deja una señal, **T** pasa combustible, **P** pausa, **Esc** abre el menú.
- **Barra espaciadora** (pasando los 50 m de altura): la maquinita sigue subiendo sola hasta el espacio.
- **E** pide la grúa a la Gasolinera mientras subes. La rueda o el trackpad mueven la vista; cualquier flecha la regresa.
- Para jugar acompañado: botón **Invitar** (liga y código QR).
- El sonido se maneja con la bocina de arriba a la derecha.
- Tu maquinita es tuya: entra contigo a cualquier mundo y a cualquier equipo.

## Qué hay en el repositorio

| Archivo | Qué es |
|---|---|
| `publico/index.html`, `publico/juego.js` | Todo el juego. Sin librerías, imágenes ni audios |
| `publico/mina.jpg` | Imagen de vista previa de la liga. Se regenera capturando `/?foto=1` a 1200 × 630 |
| `src/mundo.js` | El servidor: un Durable Object de Cloudflare por mundo |
| `wrangler.jsonc` | Configuración del Worker y del dominio |
| `docs/Documento_Maestro_Mina_v6_2026-10-02_0132.md` | Qué está construido, con qué números y qué falta |
| `Prompt_Maestro_Mina_v4_2026-10-01_2336.md` | El diseño completo |
| `sonidos-fuente/` | El pedido exacto de sonidos y música para ElevenLabs (aún sin generar) |

## Probar y publicar

```bash
npx wrangler dev
```

```bash
npx wrangler deploy
```

Para pruebas desde la consola del navegador existe `window.__mina` (estado, `avanza(segundos)`, `usar(objeto)`, `abrir(menú)`).

<!-- RLR · Ricardo López Reyero -->
