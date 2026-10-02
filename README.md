# Mina

**Ver en vivo: https://mina.capitaltorreon.com**

Juego de minería para navegador, infinito y compartido. Bajas con tu maquinita, llenas la bodega, subes, vendes, mejoras el equipo y bajas más hondo. Mandas la liga de tu mundo y tu gente entra a excavar contigo, en tiempo real.

Gratis, sin registro y sin instalar nada. El juego completo pesa unos 57 KB.

## Cómo se juega

- **Flechas o WASD** para moverte. **↑** vuela, **↓** perfora hacia abajo, **← →** contra una pared perfora de lado.
- En la superficie, párate frente a un edificio y pulsa **↓** para entrar.
- **F R X C Q M** usan los objetos. **G** deja una señal, **T** pasa combustible, **P** pausa, **Esc** abre el menú.
- **Barra espaciadora** (pasando los 50 m de altura): la maquinita sigue subiendo sola hasta el espacio.
- De regreso planea sola con sus rotorcitos; con **↓** cae en picada y con **↑** frena. El velocímetro de la izquierda dice a cuánto vas.
- Abajo a la izquierda está tu viaje: cuánto llevas, en cuánto se vende y si el combustible alcanza para subir. Ahí mismo, la **grúa** a la Gasolinera (tecla **E**).
- La rueda o el trackpad mueven la vista; cualquier flecha la regresa.
- El mundo baja hasta los **10,000 m**, con cuatro lugares por descubrir. **El Elevador** (último edificio) te regresa a ellos y al punto donde te recogió la grúa.
- Los explosivos (**X** y **C**) se usan donde sea, también volando.
- **Pleitos**: en el aire las maquinitas rebotan; bajo tierra se pelean a taladro contra casco. La que pierde vuelve arriba sin perder nada.
- **Mapa y archivo**: Menú → Mapa muestra los túneles abiertos; Menú → Mundo guarda el mundo en un archivo que se puede volver a abrir.
- **La colección**: 99 medallones enterrados (33 objetos, tres de cada uno). Los junta todo el equipo y se encienden en Menú → Colección.
- Para jugar acompañado: botón **Invitar** (liga y código QR).
- El sonido se maneja con la bocina de arriba a la derecha: música, taladro, hélice y motor tienen cada uno su interruptor (el motor viene apagado).
- Tu maquinita es tuya: entra contigo a cualquier mundo y a cualquier equipo.

## Qué hay en el repositorio

| Archivo | Qué es |
|---|---|
| `publico/index.html`, `publico/juego.js` | Todo el juego. Sin librerías, imágenes ni audios |
| `publico/mina.jpg` | Imagen de vista previa de la liga. Se regenera capturando `/?foto=1` a 1200 × 630 |
| `src/mundo.js` | El servidor: un Durable Object de Cloudflare por mundo |
| `wrangler.jsonc` | Configuración del Worker y del dominio |
| `docs/Documento_Maestro_Mina_v19_2026-10-02_0338.md` | Qué está construido, con qué números y qué falta |
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
