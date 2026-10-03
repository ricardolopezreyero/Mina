# Mina

**Ver en vivo: https://mina.capitaltorreon.com**

Juego de minería para navegador, infinito y compartido. Bajas con tu maquinita, llenas la bodega, subes, vendes, mejoras el equipo y bajas más hondo. Mandas la liga de tu mundo y tu gente entra a excavar contigo, en tiempo real.

Gratis y sin registro: entras y ya estás jugando, sin llenar nada. Se puede instalar como aplicación y sigue funcionando sin internet.

## Cómo se juega

- **Las flechas** para moverte. **↑** vuela, **↓** perfora hacia abajo, **← →** contra una pared perfora de lado.
- En la superficie, párate frente a un edificio y pulsa **↓** para entrar.
- Las teclas son la inicial, en español, de lo que hacen: **R** Reserva, **N** Nanobots, **D** Dinamita, **P** Plástico, **Q** Cuántico, **T** Transmisor, **C** Chat, **S** Señal, **A** Ayudar (pasa 5 litros), **G** Grúa, **M** Menú (también **Esc**).
- **Dos toques a ↑** (o la barra espaciadora): la maquinita se queda subiendo sola, desde donde sea, hasta que topa con techo o hasta el espacio. Se suelta con **↓**.
- De regreso planea sola con sus rotorcitos; con **↓** cae en picada y con **↑** frena. El velocímetro de la izquierda dice a cuánto vas.
- Abajo a la izquierda está tu viaje: cuánto llevas, en cuánto se vende y si el combustible alcanza para subir. Ahí mismo, la **grúa** a la Gasolinera (tecla **G**).
- La rueda o el trackpad mueven la vista; cualquier flecha la regresa.
- El mundo baja hasta los **10,000 m**, con cuatro lugares por descubrir. **El Elevador** (último edificio) te regresa a ellos y al punto donde te recogió la grúa.
- Los explosivos (**D** y **P**) se usan donde sea, también volando.
- **Pleitos**: en el aire las maquinitas rebotan; bajo tierra se pelean a taladro contra casco. La que pierde vuelve arriba sin perder nada.
- **Mapa y archivo**: Menú → Mapa muestra los túneles abiertos; Menú → Mundo guarda el mundo en un archivo que se puede volver a abrir.
- **La colección**: 99 medallones enterrados (33 objetos, tres de cada uno). Los junta todo el equipo y se encienden en Menú → Colección.
- Para jugar acompañado: botón **Invitar** (liga y código QR).
- **Dos ligas, cada una con su imagen** al mandarla por WhatsApp: la del mundo (sus hitos y su gente) y la tuya (presume tu maquinita).
- **En el teléfono**: arrastra el dedo para moverte; un toque frente a un edificio entra.
- **El cierre**: los últimos 240 m guardan un jardín pintado detrás de la roca. Se descubre entre todos, celda por celda. Al quitar la última piedra, todos los minerales del mundo caen hasta la maquinita que lo logró, y el jardín cobra vida.
- **Los mundos son para siempre**: cada uno se guarda completo (terreno, túneles, reglas y colección) y no se borra nunca, salvo que quien lo creó lo deseche. Con su liga se vuelve a entrar cuando sea, exactamente donde se dejó.
- **El mundo da la vuelta**: lo que sale por la orilla derecha entra por la izquierda, y al revés.
- **El Taller** tiene 26 mejoras por pieza, hasta $25 billones. **La Remineralizadora** cuesta el 5 % de todo lo ganado.
- **Con puro teclado**: en el chat, **Enter** manda, **Enter** vacío o **Esc** cierra y **Tab** regresa al juego; en los edificios, **Enter** hace lo principal, **← →** cambian de pestaña y **↑ ↓** recorren.
- **Chat del mundo** (tecla **C**): se abre de izquierda a derecha con todo lo dicho, que queda guardado. Cada maquinita tiene su color; el texto se puede copiar y las ligas se abren con un clic.
- **Top 33 mundial** (Menú → Top 33): las 33 maquinitas que más han ganado en todos los mundos y cuánto tiempo lleva jugando cada una, en vivo. A la que esté jugando se le puede ir a ver, con una liga de observador que no revela la del mundo.
- **Sin internet** se sigue jugando; al volver la señal, todo se manda al mundo.
- El sonido se maneja con la bocina de arriba a la derecha: música, taladro, hélice y motor tienen cada uno su interruptor (el motor viene apagado).
- Tu maquinita es tuya: entra contigo a cualquier mundo y a cualquier equipo.

## Qué hay en el repositorio

| Archivo | Qué es |
|---|---|
| `publico/index.html`, `publico/juego.js` | Todo el juego. Sin librerías, imágenes ni audios |
| `publico/mina.jpg` | Imagen de vista previa de la liga. Se regenera capturando `/?foto=1` a 1200 × 630 |
| `src/mundo.js` | El servidor: un Durable Object de Cloudflare por mundo |
| `wrangler.jsonc` | Configuración del Worker y del dominio |
| `publico/sw.js`, `publico/manifest.webmanifest`, `publico/iconos/` | La aplicación instalable: lo que se guarda en el equipo para abrir sin internet, y sus iconos |
| `diseno-fuente/` | El programa que dibuja el icono en todos sus tamaños |
| `docs/Documento_Maestro_Mina_v37_2026-10-02_1935.md` | Qué está construido, con qué números y qué falta |
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
