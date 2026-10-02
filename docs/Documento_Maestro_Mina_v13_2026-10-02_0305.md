# DOCUMENTO MAESTRO · «Mina» · v13

**Ver en vivo: https://mina.capitaltorreon.com**

Este documento dice qué quedó construido, con qué números, cómo está amarrado por dentro y qué falta. El diseño completo (minerales, mejoras con historia, capas hasta el kilómetro 1,000,000, gamificación, opciones) está en [`Prompt_Maestro_Mina_v4_2026-10-01_2336.md`](../Prompt_Maestro_Mina_v4_2026-10-01_2336.md); aquí no se repite, solo se precisa.

Origen de cada número: **[O]** del juego original (wiki de Motherload) · **[V]** del original sin confirmar · **[N]** nuestro, por calibrar.

---

## 1. El juego en una página

Bajas con tu maquinita, llenas la bodega, subes, vendes, cargas combustible, mejoras el equipo y bajas más hondo. El mundo es compartido: mandas una liga y tu gente entra al mismo mundo, cada quien con su maquinita bautizada, y se ven excavar en tiempo real.

- **Capa 1 (0 a 1 km)**: 96 celdas de ancho × 500 de hondo, 2 m por celda.
- **10 minerales**, de Hierro ($30) a Amazonita ($500,000), y **4 hallazgos**.
- **6 piezas de equipo × 6 niveles**, cada una con nombre e historia.
- **6 objetos**: tanque de reserva, nanobots, dinamita, explosivo plástico y dos teletransportadores.
- **5 edificios**: Gasolinera, La Báscula, El Taller, El Almacén y la Remineralizadora.
- **Peligros**: piedra desde 210 m, lava desde 410 m, gas invisible desde 650 m.
- **3 modos**: Paseo (nada mata), Clásico y Rudo, más ajuste fino de cada causa de muerte.

---

## 2. Qué está construido y qué no

### Construido y probado en local

| Parte | Estado |
|---|---|
| Mundo por semilla, 96 × 500, generado al vuelo | Hecho |
| Física: caminar, volar según peso, perforar abajo y a los lados, daño por caída | Hecho |
| Los 10 minerales, los 4 hallazgos, veta madre con pitido de proximidad | Hecho |
| Las 6 piezas con sus 36 niveles, precios y efectos | Hecho |
| Los 6 objetos con sus teclas | Hecho |
| Los 5 edificios; la venta con contador que sube | Hecho |
| Piedra, lava y gas con las fórmulas del original | Hecho |
| Mensajes y bonos por profundidad (11 marcas, 3 bonos) | Hecho |
| Contratos: 8 de tutorial en orden y después 3 rotando | Hecho |
| Rangos (10), logros (38, dos secretos), catálogo con premio de 5 %, viaje perfecto, estadísticas | Hecho |
| Siguiente meta siempre visible (mejora más cercana, bono, récord) | Hecho |
| Mundos compartidos: crear, bautizar, entrar por liga, verse en tiempo real | Hecho |
| Guardado en el mundo: túneles y maquinitas sobreviven a cerrar y volver | Hecho |
| «Mis mundos», desechar, código de maquinita para otro dispositivo | Hecho |
| Tabla del mundo, avisos en vivo, señal (G), pasar combustible (T), regalar dinero | Hecho |
| Remineralizar con cuenta regresiva y rescate de quien está abajo | Hecho |
| Dificultad: 3 modos, 8 ajustes finos, 4 opciones del mundo | Hecho |
| Opciones personales: volumen, texto A−/A+, contraste, daltónicos, temblor, partículas, acercamiento, nombres, ahorro | Hecho |
| Reconexión automática; lo cavado sin conexión se reenvía al volver | Hecho y probado en vivo |

### Lo que falta del producto mínimo

| Falta | Por qué importa |
|---|---|
| **Simulador de economía** | Sin él, las metas de ritmo (sección 10 del prompt) no están comprobadas. Los números [N] son los de partida. |
| **Verificar contra el original** | No se jugó Motherload ni se vieron videos. Quedan [V]: taladro y tanque de fábrica, consumo al perforar, dureza de la tierra, mezcla del terreno. |
| **El servidor no revisa el dinero** | Hoy confía en lo que reporta cada navegador (dinero, equipo, carga). Solo es la verdad del terreno y de quién cavó primero. Entre familia no importa; con una tabla mundial sí. |
| **Fondo común y estación siguiente** | La capa 2 no existe todavía; al tocar fondo solo aparece el mensaje. |
| **Controles táctiles** | En teléfono se ve, pero no se puede jugar. |
| Música, cambio de teclas, logros de equipo más allá de «Cuadrilla» | Menores. |
| Prueba con 10 jugadores a la vez | Solo se probó con 3 conexiones. |

### Para después del producto mínimo

Capas 2 a 21 y generadas, mejoras legendarias, contrato del día, racha de días, mineral en demanda, tabla mundial, compartir récord, pinturas, guardián de capa, retos contra reloj.

---

## 3. Los números que usa el juego

### 3.1 Terreno [N]

Cada celda se decide con un número al azar fijo, calculado con la semilla del mundo y su posición.

| Tipo de celda | Probabilidad |
|---|---|
| Hallazgo | 0.06 % en cualquier profundidad (unos 34 por capa) |
| Hueco | 5 % |
| Mineral | 14 % |
| Piedra | desde 210 m: 2 %, sube parejo hasta 15 % en el fondo |
| Lava | desde 410 m: 1 %, sube hasta 5 % |
| Gas | 650 a 680 m: 1 %. Desde 680 m: 8 %, sube hasta 45 % a los 960 m |
| Tierra | el resto |

- **Qué mineral toca**: cada uno empieza a aparecer en su profundidad mínima [O], llega a su máximo en su profundidad «común» [O] y después se va apagando hasta 20 % de su peso, para dejarle lugar a los más valiosos. Pesos de partida: 10, 8, 6, 5, 5, 4.5, 4, 3.5, 3, 2.5.
- **Veta madre**: una por cada 150 m de capa, racimo de 3 × 3 del mejor mineral que ya aparece a esa profundidad. Pita al acercarse a menos de 9 celdas.
- La primera fila siempre es tierra. Las dos filas bajo los edificios (columnas 39 a 63) son indestructibles [O].
- Conteo real de un mundo de prueba: 30,320 de tierra, 6,774 de mineral (323 amazonitas; todo el mineral del mundo suma unos $210 millones), 3,206 de piedra, 818 de lava, 4,401 de gas, 34 hallazgos.

### 3.2 Física [N salvo lo marcado]

| Cosa | Valor |
|---|---|
| Paso de la física | Fijo, de 1/120 de segundo exacto |
| Gravedad | 14 celdas/s² |
| Velocidad de lado | 5 celdas/s con motor de fábrica, +1 por cada 30 caballos |
| Velocidad de subida | 6 celdas/s, +1 por cada 20 caballos |
| Empuje al volar | 26 × (1 − peso ÷ peso máximo); con sobrepeso solo frena la caída [O] |
| Peso máximo | caballos × 29.5 kg; la maquinita pesa 1,980 kg [O] |
| Tiempo por celda | 0.6 s × (20 ÷ potencia) × (1 + 4 × profundidad ÷ 1,000 m) |
| Daño por caída | la tabla del original [O], medida por la velocidad del golpe |
| Lava | 58 o 41 de daño [O] × (1 − radiador) |
| Gas | (metros − 410) ÷ 2.05 × (1 − radiador) [O]; además revienta 3 × 3 celdas |
| Consumo | 5 L/min parado, 8 caminando, 17 volando [O], 20 perforando [V] |
| Parado en la superficie | no gasta [N]: nadie explota por leer un letrero |
| Inicio | $20 [O] y 3 litros |
| Entrar a túneles y tiros | La maquinita se acomoda sola si el hueco está a la altura de su centro |
| Hoyo de una celda | Sin soltar la tecla, se cruza; al detenerse con el centro encima, resbala y cae |
| Sin dinero y con menos de 3 litros | La Gasolinera fía 5 litros |

### 3.3 Ritmo medido en la prueba

- Con taladro de fábrica: 10 celdas en 6 s en la superficie.
- Con Broca Dorada y tanque «Barril»: de 0 a 218 m en 45 s de perforación.
- Primer viaje: 2 piezas de hierro, $60, más $150 de contratos.

---

## 4. Mundos compartidos: cómo está amarrado

### 4.1 Piezas

- **Página**: `publico/index.html` + `publico/juego.js`. Nada más.
- **Servidor**: un Worker de Cloudflare (`src/mundo.js`) con un Durable Object por mundo. El objeto «portero» limita a 20 mundos nuevos por visitante al día; no guarda nada en disco.
- **Liga de un mundo**: `mina.capitaltorreon.com/m/` + 8 caracteres (sin 0/O ni 1/I).

### 4.2 Qué guarda cada mundo

| Qué | Tamaño |
|---|---|
| Semilla, número de remineralización, reglas, fecha de última visita | una fila |
| Bits de celdas cavadas | 6 KB, una fila |
| Cada maquinita: llave, nombre, modelo, estado completo, récord y total | una fila por maquinita |

Se guarda por lotes cada 8 segundos mientras haya cambios, y al salir alguien. Un mundo sin visitas en 180 días se borra solo.

### 4.3 Mensajes

Del navegador al mundo:

| Mensaje | Para qué |
|---|---|
| `hola` | Entrar con la llave; con nombre y modelo si es bautizo |
| posición (6 bytes) | Hasta 10 por segundo, solo si se movió y hay alguien más conectado |
| `cava` | Lista de celdas que cava (una al perforar, varias al explotar) |
| `est` | Estado completo de mi maquinita, cuando cambia |
| `aviso`, `senal` | Avisos en vivo y la señal de «¡aquí!» |
| `fuel`, `regalo` | Pasar combustible o dinero a otra maquinita |
| `cfg`, `remin`, `borrar` | Reglas del mundo, remineralizar, borrar (los dos primeros según permisos) |

Del mundo al navegador: `mundo` (todo el estado al entrar), `nuevo` (pide bautizo), `cava`, `no` (esa celda ya era de otro), `entra`, `sale`, `j` (récord de alguien), `cuenta`, `remin`, `cfg`, y los de rechazo: `noexiste`, `cerrado`, `lleno`, `otra`, `borrado`.

### 4.4 Casos resueltos

- **Dos van por la misma celda**: gana el primero que llega al servidor; el otro entra al hueco sin premio y sin castigo.
- **Misma maquinita en dos pestañas**: se queda la más reciente.
- **Remineralizar con alguien abajo**: sube a la superficie con su carga intacta (probado).
- **Volver después**: la maquinita reaparece donde quedó; si el mundo cambió y ese lugar ya es tierra, reaparece en la superficie.
- **Desconexión**: reintenta sola a 0.5, 1, 2, 4 y 8 segundos; a los 3 segundos congela el juego y avisa. Lo que se cavó sin conexión se guarda y se reenvía al volver.
- **Premio por una celda que otro cavó antes**: si el aviso del mundo llega tarde, el premio se deshace (se quita la pieza o el dinero del hallazgo).
- **Quedar dentro de la tierra** (el terreno cambió): la maquinita sale sola a la superficie.
- **Remineralizar** se cobra hasta que el mundo confirma; la cuenta regresiva se guarda al momento.
- **Mundo sin bautizar**: se borra solo en un día (así las visitas de robots no dejan mundos vacíos por 180 días).

### 4.5 Pruebas de aceptación (sección 7.6 del prompt)

| # | Prueba | Resultado |
|---|---|---|
| 1 | Abrir sin mundos: bautizo y a jugar | Pasa en local |
| 2 | Abrir la liga en otro navegador y verse | Pasa |
| 3 | Uno cava, el otro lo ve | Pasa |
| 4 | Misma celda: solo uno la recibe | Pasa (el servidor rechazó la repetida) |
| 5 | Cerrar y volver: todo igual | Pasa (recarga); falta la de «al día siguiente» |
| 6 | Cortar la conexión | Pasa en vivo: reconecta sola y lo cavado mientras tanto llega al mundo |
| 7 | Diez jugadores a 60 cuadros | **Sin probar** (se probó con 3) |
| 8 | Remineralizar con alguien abajo | Pasa |
| 9 | Dos mundos, terrenos distintos | Pasa por construcción (semilla al azar); sin comparar a ojo |
| 10 | Desechar | Borrar el mundo para todos pasa; las ventanas de confirmación no se probaron |

### 4.6 Costo

Mensajes por hora de juego de una persona: unos 5,000 si juega sola y unos 41,000 si hay alguien más en el mundo (por la posición, 10 por segundo). Cloudflare cuenta 20 mensajes como una solicitud.

| Plan | Qué cabe |
|---|---|
| Gratuito (100,000 solicitudes y 100,000 escrituras al día) | Unas 400 horas-jugador al día jugando solos, o unas 49 acompañados. El tope de escrituras alcanza para unas 70 horas-mundo al día. |
| De paga ($5 al mes) | Cada hora-jugador acompañada cuesta unas tres diezmilésimas de dólar. |

---

## 5. Ligereza: los topes y lo medido

| Tope (sección 9 del prompt) | Medido |
|---|---|
| Descarga inicial ≤ 150 KB comprimida | **56.9 KB** (la imagen de vista previa de la liga, 231 KB, no la baja el juego: solo la piden WhatsApp y similares) |
| 3 solicitudes o menos | **2** |
| Trabajo por cuadro < 4 ms | **0.35 a 0.62 ms** de dibujo en un lienzo de 2800 × 1600; la física no llega a 0.01 ms |
| Guardado de una capa: 6 KB | 6,000 bytes |
| Sin librerías, imágenes, audios ni fuentes | Cumple |
| Procesador en 0 % sin actividad | El ciclo se detiene en menús y pausa; queda un reloj de 1 segundo |
| De abrir a jugar < 2 s; 60 cuadros en laptop de 2015; memoria < 60 MB; red < 2 KB/s | **Sin medir** |

Dos diferencias con el prompt, las dos a favor de la ligereza:

- El terreno **no** se pinta por bloques guardados: se dibuja celda por celda cada cuadro. Tarda 0.68 ms y ahorra unos 40 MB de memoria.
- El mapa de la capa sí vive en memoria como caché (48 KB), pero se calcula solo conforme se ve.

---

## 6. Plan de construcción

| Etapa | Qué entrega | Condición de salida |
|---|---|---|
| 1 | Capa 1 + mundos compartidos + opciones + gamificación | **Hecha.** Faltan las pruebas 6, 7 y 10 |
| 2 | Simulador de economía y calibración; verificar contra el original | Se cumplen las metas de ritmo |
| 3 | Controles táctiles; el servidor revisa dinero y compras | Se juega en teléfono; nadie puede inventarse dinero |
| 4 | Capa 2 (Acuífero): fondo común, estación, elevador, 3 minerales, 18 mejoras | El paso de capa funciona y conviene bajar |
| 5 | Capas 3 a 21 y generadas | Se cruza el kilómetro 1,000,000 |
| 6 | Para que vuelvan: contrato del día, tabla mundial, compartir récord | — |

---

## 7. El motor de tiempo y de dibujo (tercera iteración)

**Meta:** que cada pantalla reciba el máximo de cuadros que puede mostrar y que todos vean excavar a los demás al mismo ritmo.

| Parte | Cómo funciona |
|---|---|
| Física | Pasos fijos de 1/120 s. El resultado no depende de la pantalla (antes el daño por caída cambiaba con el refresco). |
| Dibujo | Corre al ritmo de cada pantalla (60, 90, 120, 144…) y coloca la maquinita entre los dos últimos pasos de física. |
| Refresco de la pantalla | Se mide solo: los primeros cuadros se dibujan ligeros para ver el ritmo real, y se sigue midiendo por si el jugador cambia de pantalla. |
| Nitidez adaptable | Tres escalones (100 %, 75 %, 50 %). Si el equipo no alcanza el refresco de su pantalla, baja la nitidez antes que la fluidez; cuando sobra, la vuelve a subir. |
| Tope a mano | Opciones → Cuadros por segundo: lo máximo, 60 o 30. Ahí mismo se ve el refresco medido, los cuadros reales y la señal. |
| Demás jugadores | Cada posición se guarda con su hora de llegada y se dibuja unos 135 ms atrás, entre dos posiciones reales: movimiento continuo aunque los mensajes lleguen disparejos. Se envía 15 veces por segundo, o 8 si la conexión va lenta. |
| Señal | Un eco cada 5 s mide el retraso y detecta conexiones muertas (3 ecos sin respuesta: se reconecta). |
| Lo que hacen los demás | Sus perforaciones sueltan tierra y suenan según la distancia; sus explosiones tiemblan y truenan si están cerca. |
| Perforar | Con la tecla apretada, al terminar una celda arranca la siguiente en el mismo paso, sin parones. |
| Cámara | Sigue a la maquinita; la rueda o el trackpad la mueven para mirar alrededor y cualquier flecha la regresa. |

Medido: dibujar un cuadro a 2800 × 1600 toma 0.35 ms en la superficie y 0.62 ms bajo tierra. En la prueba de dos jugadores, 138 posiciones seguidas del otro avanzaron sin un solo retroceso.

**Sin probar con cuadros reales:** el panel de pruebas sigue oculto. El ritmo real a 120 Hz se confirma jugando; Opciones muestra los números.

### Lo demás de esta iteración

- **Gráficos**: tierra con textura y piedritas, bordes sombreados hacia los túneles, fondo de túnel con textura, cada mineral con su forma (rocas, pepitas, barras, cristales, gemas, diamantes, racimos) y destellos, lava que pulsa, luz propia de la maquinita que se oscurece con la profundidad, cielo con sol, nubes y cerros en tres planos, y los cinco edificios dibujados con detalle. Todo sigue pintado por código: la descarga creció a unos 44 KB.
- **Grúa**: mientras subes aparece el precio; la tecla E te deja en la Gasolinera. Cuesta $0.75 por metro y por tonelada [N] (distancia en línea recta, peso de la maquinita más la carga), mínimo $10.
- **Avisos**: compactos y en la columna derecha, bajo la tabla; el centro de la pantalla queda libre.
- **Maquinita**: en Menú → Mundo se ve su estado completo y se copia su liga. La llave va después del `#`, así el navegador nunca la manda al servidor dentro de la dirección.
- **Quién manda en el mundo**: quien lo crea recibe una llave de dueño; antes mandaba el primero en bautizarse.
- **Teclas**: dejar apretada una tecla de objeto ya no la dispara treinta veces por segundo.

---

## 8. Cuarta iteración: la maquinita es del jugador, sonido, cielo, letreros y QR

### 8.1 La maquinita vive fuera de los mundos

Antes cada maquinita pertenecía a un mundo. Ahora es **del jugador**:

- Cada maquinita tiene su propio lugar en el servidor (un objeto `Maquina` por llave). Guarda nombre, modelo y todo su estado: equipo, dinero, objetos, récords, logros y contratos.
- **Entra a cualquier mundo con todo lo que trae.** En un mundo nuevo ya no se bautiza otra vez: llega la misma, parada en la superficie.
- **No se pierde aunque un mundo se borre o caduque.**
- **Está en un solo mundo a la vez.** Si se abre en otro mundo o en otro equipo, el anterior la suelta y entrega lo último que supo de ella; esa pantalla avisa «Tu maquinita se abrió en otro lado».
- **Nunca se pisa un estado nuevo con uno viejo**: cada guardado lleva un número de versión y el servidor rechaza los atrasados y los de un mundo donde ya no está.
- Se guarda en su objeto cada 15 s como mucho y siempre al salir; el mundo conserva además su copia cada 5 s.
- **Mudanza automática**: las maquinitas de la versión anterior se pasan solas a su nuevo lugar la primera vez que entran, con todo lo que tenían (probado).
- La liga y el QR de la maquinita la llevan a otro equipo. La llave va después del `#`: nunca viaja en la dirección que ve el servidor.

Falta para la visión completa: varias maquinitas por persona, comprarlas, diseñarlas y cambiarles el nombre.

### 8.2 Sonido

- Nueve tipos, cada uno con su canal y su interruptor: música, taladro, hélice, motor (viene apagado), minerales y dinero, golpes/explosiones/daño, avisos y logros, lo que hacen los demás, viento y cueva. (Eran siete: en la séptima iteración se separaron taladro, hélice y motor; ver 9.2.)
- Arriba a la derecha: bocina (apagar), − y + (volumen) y «♪ Sonidos» (elegir tipos). Todo queda guardado en el navegador.
- Motor, hélice, taladro, viento y cueva son sonidos continuos que suben y bajan con lo que hace la maquinita. La música se compone sola según la zona: superficie, mina, fondo, cielo y espacio.
- **Todo está fabricado por código**, sin archivos. El pedido exacto para reemplazarlo por sonidos grabados con ElevenLabs está en `sonidos-fuente/`; no se generó porque el permiso para usar la llave de la bóveda fue negado en esta sesión.
- **Nadie lo ha oído todavía**: se comprobó que nada truena y que los controles funcionan, no cómo suena.

### 8.3 Hacia arriba: 1,000 km de cielo

- Ya no hay techo a 28 m. Se puede volar hasta **1,000 km**.
- La velocidad de subida crece con la altura: 6 celdas/s en el suelo más 1 por cada 140 celdas de altura. Medido con motor «Mamut»: 3 km en 1 min 55 s, 12 km en 4 min 13 s, **100 km (el espacio) en 8 min 48 s**, y unos 14 minutos hasta los 1,000 km.
- Combustible: el gasto baja con la altura (ver 9.1); con un tanque «Cisterna» de 40 L se llega a los 1,000 km y se regresa.
- El cielo cambia con la altura: atardecer hasta los 3 km, azul profundo a los 12, estrellas desde los 15, negro a los 100. El sol pasa de cálido y difuso a blanco con destellos. Desde arriba se ve la curva del planeta con su atmósfera, y la Luna asoma al llegar al espacio y crece hasta llenar la vista.
- Bonos por altura: $500 a 1 km, $2,000 a 3 km, $10,000 a 12 km, $250,000 a 100 km y $5,000,000 a 1,000 km [N]. Tres logros nuevos.
- Bajar: en caída libre desde lo más alto son unos 7 minutos y el golpe hace 8 de daño; la grúa también funciona desde el cielo.

### 8.4 Letreros y compartir

- Cada edificio lleva un letrero con su nombre y, debajo, lo que se hace ahí: «Rellena tu combustible», «Vende tu mineral», «Mejora tu maquinita», «Repara y compra objetos», «Vuelve a llenar de mineral el mundo».
- Botón **Invitar** arriba a la derecha: código QR del mundo, liga y copiar. El QR lo genera el propio juego (sin librerías); se comparó módulo por módulo contra una librería de referencia y el navegador lo leyó de vuelta.

---

## 9. Quinta iteración: entender lo que recoges y que se comparta solo

**Criterio que dio Ricardo para lo no decidido:** elegir lo mejor a largo plazo para que la gente quede encantada y el juego se comparta, con muchos detalles bien pensados y nada exagerado.

| Detalle | Qué hace |
|---|---|
| Letrero flotante al recoger | Sobre la celda sale «+ Oro · $250» con el color del mineral. Con la bodega llena avisa qué pieza se perdió. Los hallazgos muestran lo que pagaron. |
| Valor de la carga | El medidor de bodega dice cuánto vale lo que llevas: «📦 5/7 · $410». |
| El ratón dice qué es | Al pasar el cursor por una celda aparece su nombre, valor y peso. Lo que aún no descubres sale como «Mineral sin descubrir». |
| Vista previa de la liga | Al pegar la liga de un mundo en WhatsApp o iMessage aparece una imagen del juego y el nombre del mundo: «Mundo de Ricardo · entra a excavar conmigo en Mina», con cuántas maquinitas hay. |
| Foto para presumir | Menú → Estadísticas, o Invitar: una imagen cuadrada con tu maquinita, tu rango, tus récords y el QR de tu mundo. En teléfono se comparte; en computadora se descarga. |
| Llegó alguien nuevo | Cuando una maquinita nueva entra a un mundo con gente, cada quien recibe $500 [N] (las primeras 9). Logro «Anfitrión» a las tres. |

La imagen de vista previa sale del propio juego: `…/?foto=1` dibuja una escena de muestra sin conectarse, y se captura con Chrome sin ventana a 1200 × 630.

---

### 9.1 Sexta iteración: el gas ya no mata «sin razón» y al espacio se llega sin parar

Salió de un video de Ricardo: a 704 m una bolsa de gas lo explotó y el juego no le dijo por qué.

| Cambio | Cómo quedó |
|---|---|
| El gas se insinúa | En modo Clásico las bolsas de gas sueltan burbujitas verdes. «Ver el gas» ahora tiene tres valores: completo (Paseo), se insinúa (Clásico) y no (Rudo). Los mundos Clásicos ya creados se pasan solos a «se insinúa». |
| «Huele a gas» | Si hay una bolsa pegada a la maquinita (abajo o a los lados) sale el aviso con un siseo. |
| Hasta dónde aguantas | En las metas, desde los 560 m de récord: «Tu equipo aguanta el gas hasta 683 m»; en rojo si ya estás más abajo. El Taller lo dice también en Casco y Radiador. |
| La explosión explica | La tarjeta dice la causa, los números («el gas pegó 83 y tu casco aguanta 80») y qué hacer. Sale de inmediato aunque haya otros avisos en fila. |
| Combustible en el cielo | El gasto baja con la altura (dividido entre 1 + altura ÷ 1,200 m) [N]. Medido con motor «Toro» y tanque «Cisterna» de 40 L: 3 km gastan 19.5 L, el espacio 29 L y los 1,000 km 30 L; el regreso en caída libre, 2 L. Con el tanque de fábrica se llega a 600 m. |
| Subir sin sostener la tecla | Pasando los 50 m de altura, la barra espaciadora deja a la maquinita subiendo sola. Se suelta con la barra, con ↓, al llegar arriba o al 12 % de combustible. |

### 9.2 Séptima iteración: sonido rehecho, el viaje abajo a la izquierda y peligros con cariño

Salió de otro video de Ricardo y de sus palabras: no le gustó el sonido de la excavadora ni la música; al excavar salían «rayitas negras»; abajo a la izquierda había demasiado texto; y a la lava, al gas y a todo lo que daña «le faltaba cariño».

| Cambio | Cómo quedó |
|---|---|
| Taladro, hélice y motor separados | Cada uno con su canal e interruptor en «♪ Sonidos». **El motor viene apagado** (también para quien ya jugaba). |
| Taladro nuevo | Tierra que se muele (grano que vibra suave y un fondo grave) y el zumbido de la broca. El tono sube mientras muerde cada celda y se aclara contra el mineral. Cada celda arranca con un «mordisco». |
| Hélice nueva | El aire que corta cada aspa (unas 20 por segundo) y el zumbido del rotor; al soltar la tecla el rotor se va frenando. El dibujo de las aspas gira al mismo ritmo. |
| Motor nuevo | Explosiones lentas y graves con el soplido del escape; las vueltas suben al avanzar, perforar o volar. |
| Sincronía | Los sonidos continuos se ajustan **en cada cuadro** (antes, 15 veces por segundo): arrancan y callan con la acción. |
| Música nueva | Un piano suave que improvisa sobre cuatro acordes por zona, con pocas notas, eco de cueva y silencios: toca de 10 a 15 acordes y deja de 16 a 34 segundos solo el ambiente. Nunca repite la misma tonada. |
| Eco | Un eco fabricado (sin archivos) le da aire a la música, a las campanas y a las explosiones. |
| Mezcla medida | Como no se puede oír, se midió cada sonido fuera de línea (`__mina.sonido`): taladro, hélice y música quedaron a un volumen parecido; daño, mineral y clic, por encima; la cueva, muy abajo. |
| Rayitas negras | Era un error del dibujo del taladro: se pintaba suelta la última raya en lugar del contorno. Corregido. |
| El viaje | Abajo a la izquierda: «Llevas 34 de 120», «Se vende en $19,450» y, bajo tierra, «Subir gasta ≈ 12 L · traes 28» (en rojo si no alcanza o si vas muy pesado). Debajo, el botón de la **grúa** con su precio (tecla E), siempre que estés bajo tierra o volando alto. |
| Contratos | Abajo queda uno solo, en una línea; todos están en Menú → Contratos. |
| Lava | Una poza de roca fundida con orilla de basalto; las pozas vecinas se unen. Resplandor que late e ilumina alrededor, una burbuja que crece y revienta, y brasas que suben. |
| Gas | Burbujas verdes con brillo y un vaho tenue; cuando se ve completo, una grieta que resplandece en verde. |
| Los golpes se entienden | Letrero «−35 de casco» sobre la maquinita, las orillas de la pantalla enrojecen un instante y la barra del casco parpadea. |
| Explosiones | Fogonazo, anillo que se abre y humo, en dinamita, gas, lava y al explotar la maquinita (también las de los demás). |
| Números a la vista | El ratón sobre lava o gas dice cuánto casco quita y cuánto traes. La primera vez que hay lava o gas cerca, una tarjeta lo explica con números. |

Sigue pendiente lo mismo del sonido: **nadie lo ha oído**; lo grabado con ElevenLabs espera el permiso de Ricardo.

### 9.3 Octava iteración: en qué gastar, comprar de a muchos, menos gas y la subida como viaje

Lo pidió Ricardo con tres capturas: quería comprar 50 de un jalón, iconos, más nubes y toda una secuencia al subir, «bajarle dos rayitas» al gas («no queremos matar a la maquinita») y mucho más en qué gastar («ya tienes demasiado dinero»).

| Cambio | Cómo quedó |
|---|---|
| 60 mejoras nuevas | Cada pieza pasó de 6 a **16 mejoras**, cada una con nombre e historia. Precios nuevos [N]: 2, 5, 10, 25, 50, 100, 250, 500, 1,000 y 2,500 millones. |
| Lo que dan [N] | Taladro hasta 470 de potencia · Casco hasta 3,200 de vida · Motor hasta 2,200 caballos · Tanque hasta 1,600 L · Radiador hasta 98 % · Bodega hasta 1,050 espacios. |
| Para que siga siendo manejable | La fuerza del motor crece completa (levanta 29.5 kg por caballo), pero la velocidad crece cada vez menos pasando los 210 caballos (`brio`). Ninguna celda se perfora en menos de 0.07 s. |
| El Taller | Cada pestaña lleva icono y avance («🛡️ Casco 7/16»). Se ven todas las compras hechas y **las diez que siguen**; la lista abre en lo que traes puesto. |
| El Almacén | «Comprar de a 1, 5, 10, 50 o 100». Cada cosa con su icono: 🛠️ reparar, 🛢️ reserva, 🤖 nanobots, 🧨 dinamita, 💣 plástico, 🌀 cuántico, 🛸 transmisor. Los iconos también van en la barra de objetos. |
| Dinero | De un millón a un billón se escribe en millones: «$2,500 M» (antes «$2.5 B»). |
| Gas | Las bolsas pasaron de hasta **45 %** de las celdas a entre **1 % y 6 %** (medido: 1.5 % a 700 m, 5.5 % a 960 m). El golpe bajó 40 % (un punto cada 3.4 m bajo los 410 m; antes cada 2.05). Aplica a todos los mundos, también a los ya creados. |
| Nubes | Tres capas; la de cerca pasa a tres cuartos de tu velocidad. Hay nubes de los 100 m a los 17 km y se tiñen con el atardecer. Rayitas de aire cuando vas rápido (se acaban al salir del aire). |
| La subida, en orden | Tarde dorada → el Sol baja, enrojece y se mete (9 km) → hora azul → noche con estrellas y Vía Láctea (25 km) → estrellas fugaces (30 a 200 km) → aurora al cruzar al espacio (70 a 430 km) → la Luna crece desde los 100 km → **el Sol vuelve a salir** por la orilla del planeta (430 a 900 km) y el planeta se ilumina otra vez. |
| Lo que te cruzas | Una parvada (200 m a 1 km), un avión con su estela (8 a 15 km), un globo meteorológico (23 a 41 km), la estación en órbita (320 a 520 km). De noche se ven allá abajo las luces de la Gasolinera. |
| Mensajes nuevos | A 30 km (Doña Chela, $30,000), 400 km (la estación «Lupita», $1 M) y 650 km (amanecer, $2 M). Los mensajes ya dados se cuentan por la altura récord, para no repetir bonos. |

### 9.4 Novena iteración: el mundo llega a 10,000 m, con cuatro lugares en el camino

Ricardo llegó al fondo y pidió ampliar a 10 km «con todo lo que hemos planeado», simple, para gozar: bajar, ganar, subir, vender, comprar. Con 3 o 4 «experiencias» en el camino, más tesoros, explosivos que se puedan usar volando y poder ver qué lleva en la bodega.

**Cómo se hizo.** Un solo tablero de 96 × 5,000 celdas (2 m por celda), no capas separadas: es lo más simple y deja todo continuo. El servidor guarda un bit por celda cavada: 60 KB por mundo (antes 6 KB). Los mundos ya creados conservan sus túneles: su registro se agranda al cargar. Al entrar solo viaja hasta la última celda cavada, así que un mundo nuevo sigue pesando casi nada.

| Zona | De – a | Minerales nuevos (valor · kg) |
|---|---|---|
| Corteza | 0 – 1 km | Los 10 de siempre |
| Acuífero | 1 – 2 km | Aguamarina $700 mil · 100 — Zafiro $1 M · 110 — Perla negra $1.5 M · 60 |
| Cavernas | 2 – 4 km | Ónix $2 M · 130 — Topacio $3 M · 130 — Jade imperial $4 M · 140 |
| Cristalera | 4 – 8 km | Amatista $6 M · 150 — Tanzanita $8 M · 150 — Alejandrita $12 M · 160 |
| Zona de presión | 8 – 10 km | Paladio $16 M · 180 — Rodio $24 M · 190 — Osmio $40 M · 220 |

Los nombres y las zonas son los del prompt maestro (sección 6.5). Los valores **no** siguen el × 10 por capa de aquel plan: suben más despacio [N] para que las 60 mejoras del Taller (hasta $2,500 M) duren todo el viaje y las cifras no se disparen. Cada zona tiene su color de tierra.

| Lugar | Dónde | Qué es | Bono |
|---|---|---|---|
| 💧 El Acuífero | 1,040 a 1,240 m | Un estrato inundado con un lago enorme. En el agua se flota (la gravedad baja a 30 % y nadie se estrella), no hay lava ni gas, hay peces, columnas de roca con mineral y perlas gigantes en el lecho ($400 mil cada una). | $1 M |
| 💎 La Gruta de Cristal | 2,950 a 3,030 m | Una cueva de 76 × 38 celdas. Sus paredes son 82 % mineral precioso (oro, platino, rubí, diamante, amazonita, ónix, topacio y jade): unas 500 piezas. Estalactitas y estalagmitas de cristal. | $10 M |
| 🏛️ La Ciudad Perdida | 5,580 a 5,650 m | Una caverna con cinco casas de ladrillo antiguo (hasta cuatro pisos, con tesoros en cada piso), antorchas y una pirámide con el Ídolo de oro ($25 M) en su cámara. | $50 M |
| ❤️ El Corazón de la Tierra | 9,770 a 9,890 m | Una geoda cuya pared es 90 % paladio, rodio y osmio (la veta madre). Al centro late el Corazón: se oye y se ve latir al acercarse. Vale $2,500 M. Los explosivos no lo destruyen. | $500 M |

| Cambio | Cómo quedó |
|---|---|
| El Elevador | Edificio nuevo en la superficie (un castillete de mina). Baja al instante a los lugares descubiertos y al punto donde te recogió la grúa, el teletransportador o el rescate. Cobra $50 por metro. De los lugares sin descubrir dice a qué profundidad «hay algo». |
| Más tesoros | Los hallazgos enterrados pasaron de 0.06 % a 0.16 % de las celdas. Valen más entre más hondo: a 10 km, mil veces lo que en la Corteza (un cofre, $5 M). |
| Piedra, lava y gas hondos | Bajo el primer kilómetro: piedra 11 %, lava 3 %, gas 3.5 %. El golpe del gas crece despacio (un punto cada 20 m). La Corteza quedó igual. |
| Taladro | El tiempo por celda crece hasta × 5 al primer kilómetro, como antes, y de ahí solo × 11 a los 10 km. |
| Explosivos | Dinamita y explosivo plástico se usan donde sea: volando, topando con piedra o a media perforación. |
| La bodega a la vista | El panel del viaje lista lo que llevas, mineral por mineral. Un clic abre la pestaña Bodega. |
| Historia y rangos | Nueve mensajes nuevos (hasta $1,000 M de bono al tocar los 10,000 m) y nueve rangos nuevos, hasta «Leyenda de las Profundidades». |

Sin medir todavía: cuánto tarda un jugador real en bajar los 10 km y si los valores hondos dejan la economía pareja. La prueba fue juego simulado con el equipo al máximo.

### 9.5 Décima iteración: pantalla más limpia, el espacio con más vida y detalles hacia abajo

Ricardo subió hasta los 66 km, le encantaron el avión, la aurora y las estrellas fugaces, y pidió: quitar de arriba los avisos del gas y de «ya te alcanza», pasar el récord abajo a la izquierda, hacer más discreto el letrero de «subiendo sola», dos parvadas de nueve aves de distinto tipo que crucen de izquierda a derecha, que el planeta se vea cada vez más chico y la Luna más grande, que las constelaciones se vean mejor y cambie el ángulo, y planear detalles así también hacia abajo.

| Cambio | Cómo quedó |
|---|---|
| Arriba al centro | Solo aparece el nombre del lugar donde estás y, si lo hay, el aviso rojo de gas peligroso. Se quitaron «ya te alcanza», «tu equipo aguanta el gas» (sigue en el Taller) y el bono siguiente. |
| Récord | Pasó al panel del viaje, abajo a la izquierda: «Récord 1,000 m · Leyenda de la Corteza». Al pasar el ratón dice el rango que sigue. |
| Letreros de ayuda | «Subiendo sola», «barra espaciadora» y «vista libre» van chicos y abajo. Solo la invitación a entrar a un edificio sigue destacada. |
| Dos parvadas | Nueve halcones (chicos, rojizos, aleteo rápido) cerca de los 400 m y nueve águilas (grandes, cabeza y cola blancas, planeando) cerca de los 2.2 km. Vuelan en V de izquierda a derecha. |
| El planeta se achica | A 60 km ya se ve la curva; a 300 km es un domo; a 1,000 km, una bola completa. Tiene textura (desierto, cañones, nubes, polos), gira despacio, de noche se oscurece y al amanecer queda iluminado solo del lado del Sol. La vista se inclina: el planeta se va quedando abajo a la derecha. |
| La Luna | Crece desde que sale (no solo desde los 100 km) y tiene más detalle: mares, 60 cráteres y un cráter joven con rayos. |
| El cielo gira | El cielo estrellado entero gira con la altura y con el tiempo. Desde los 45 km se van trazando cinco constelaciones (Orión, la Osa Mayor, Casiopea, la Cruz del Sur y el Escorpión). Desde los 110 km asoma un cometa con sus dos colas. |
| Más encuentros | Un satélite chico a los 180 km, antes de la estación de los 408 km. |
| Hacia abajo: bichos | Al abrir una cueva natural, a veces sale lo que vivía ahí: murciélagos en la Corteza (buscan tu túnel y se van hacia arriba), luciérnagas en el Acuífero y las Cavernas, mariposas de cristal en la Cristalera y brasas en la Zona de presión. Cada 40 s como mucho. |
| Hacia abajo: lo que crece | En el piso de las cuevas que nadie cavó: hongos en la Corteza, algas en el agua, hongos que brillan en las Cavernas, cristales en la Cristalera y grietas de brasa al fondo. |
| «El Güero» | La maquinita 22 de la historia está en la Gruta de Cristal. Al acercarte te habla, te da $5 M y diez nanobots, y queda un logro secreto. |

**Plan hacia abajo (lo que sigue, sin construir todavía):** un fósil gigante cruzando varias celdas cerca de los 700 m; rieles y un carrito de mina viejo en la Corteza; un río subterráneo que cruza el Acuífero; la maquinita 9 de la historia varada cerca del Corazón; raíces y topos en los primeros metros; un eco distinto por zona en el sonido.

### 9.6 Undécima iteración: la bajada también se siente

Ricardo pidió que al planear hacia abajo salgan hélices chiquitas hacia arriba, revisar el sonido de la caída, un velocímetro a la izquierda, que ↓ aumente mucho la velocidad, que se vea la resistencia del aire y que el sonido cambie con la velocidad.

| Cambio | Cómo quedó |
|---|---|
| Planear | Al caer sin tocar nada salen tres rotorcitos, todos hacia arriba, y suenan (agudos y bajito). Los demás jugadores también los ven. |
| Caer en picada | Con ↓ en el aire se guardan los rotores, la gravedad se triplica y el tope de velocidad también [N]. Con ↑ se frena, como antes. También sirve al caer por un túnel. |
| Resistencia del aire | Al soltar ↓ la velocidad no se corta de golpe: baja poco a poco hasta la de planeo. El aire es más delgado arriba, así que se cae más rápido alto y más lento cerca del suelo. |
| Se ve | Bajo la maquinita se forman arcos blancos desde los 216 km/h; pasando de 1,440 km/h se ponen al rojo y queda una estela naranja hacia arriba. Sin aire (arriba de 90 km) no hay nada de esto. |
| Velocímetro | Aparece a la izquierda al volar o caer: aguja, km/h, flecha de subida o bajada, «planeando» o «en picada» y el número de Mach. La escala se aprieta para caber de 0 a 100,000 km/h. |
| Barrera del sonido | Al pasar de Mach 1 dentro del aire: trueno, anillo blanco y letrero. |
| El viento en tres voces | Brisa (grave y suave, hasta unos 290 km/h), ráfaga (silba y viene por rachas) y rugido (trueno grave con siseo, desde unos 1,100 km/h). Se relevan solas según la velocidad. En el espacio hay silencio. Medido: el volumen medio sube de 0.008 a 0.052 entre planear despacio y la picada más rápida. |

Medido en la simulación: planeando a 3 km se va a 531 km/h; en picada, a 1,380 (Mach 1.1). Volver desde 100 km toma 169 s planeando y 71 s en picada.

### 9.7 El Elevador con dos opciones

Ricardo pidió poder escribir a cuántos metros quiere bajar, además de elegir un lugar. El menú quedó en dos columnas:

- **A un lugar** (izquierda): donde te recogió la grúa y los lugares descubiertos, como antes.
- **A los metros que quieras** (derecha): un número y una barra que se mueven juntos, de 10 en 10 m, con el precio al momento ($50 por metro). El tope es el récord del jugador: no se puede aparecer más abajo de donde ya se llegó [N]. Enter también baja.

El elevador llega por su tiro, bajo el edificio (columna 66). Si a esa profundidad hay túnel cerca, te deja ahí; si hay roca, abre un hueco de una celda, de preferencia en tierra o piedra y sin llevarse mineral ni tesoros. Si cae en una cueva o en un lugar, te baja hasta el piso (hasta 30 celdas).

### 9.8 Error corregido: un tramo del túnel se cerraba al reconectar

**Qué pasó.** Ricardo iba bajando y se le cerró un tramo del túnel por donde venía. No era intencional.

**Por qué.** El mundo guarda lo cavado por lotes (cada 5 s). Cada vez que se publica una versión nueva, el mundo se reinicia y pierde lo que tuviera sin guardar: hasta 5 s de túnel, unas 10 celdas a ese ritmo de perforación. Al reconectarse, el navegador **aceptaba sin más lo que tenía el mundo** y borraba de su propia memoria esas celdas. Lo mismo pasaba si la señal se moría sin avisar: lo cavado hasta que el juego notaba el corte (hasta 15 s) se mandaba a una conexión muerta y se perdía. Esa noche se publicó tres veces mientras él jugaba.

**Cómo quedó.**

- Al reconectar, el navegador compara: toda celda que él ya tenía cavada y el mundo no, la conserva y se la vuelve a mandar. Solo una remineralización cierra túneles.
- El mundo ahora guarda lo cavado en 2 s como mucho (antes 5).

**Probado.** En local: 12 celdas cavadas con la conexión «muerta», corte y reconexión: las 12 siguieron abiertas y, al recargar la página, el mundo ya las tenía. En producción, con un mundo desechable: lo cavado se conserva tras reconectar y tras dejar el mundo solo 100 s.

**Lo que no se recupera:** el tramo que ya se había cerrado antes de esta corrección. Y quien tenga abierta la versión anterior puede perder hasta 5 s de túnel una vez más, al publicarse esta.

---

## 10. Revisión de código del 2 de octubre

Se revisó todo el código buscando fallas y se corrigieron estas:

| Dónde | Qué pasaba | Cómo quedó |
|---|---|---|
| Movimiento | La maquinita se quedaba colgada de la orilla de un hoyo y no podía perforar ni caer | Resbala al hueco y cae |
| Movimiento | Entrar a un túnel lateral desde un tiro pedía puntería de centésimas | Se acomoda sola |
| Movimiento | Un cuadro lento podía dar un paso de física largo o negativo | Pasos fijos; nunca negativos |
| Ciclo | Abrir y cerrar un menú muy rápido podía dejar dos ciclos corriendo | Cada ciclo lleva número; el viejo se apaga |
| Pantalla | Los medidores se repintaban 8 veces por segundo y los clics en los objetos se perdían | Solo se repinta lo que cambió |
| Pantalla | Con tres avisos a la vez, el primero desaparecía sin leerse | Tarjetas en fila |
| Red | Lo cavado sin conexión se perdía y la maquinita quedaba dentro de la tierra | Se reenvía; red de seguridad |
| Red | Quien estaba quieto era invisible para quien acababa de entrar | Todos mandan su posición al entrar alguien |
| Red | Remineralizar, regalar o cambiar reglas sin conexión cobraba sin hacer nada | Solo con conexión; se cobra al confirmar |
| Red | Dos jugadores con buen taladro podían recibir la misma pieza | El premio tardío se deshace |
| Servidor | Un envío a un socket cerrándose podía tumbar el manejo del mensaje | Envíos protegidos |
| Servidor | La cuenta regresiva y las maquinitas nuevas tardaban hasta 8 s en guardarse | Se guardan al momento |
| Guardado | Un estado viejo o incompleto podía trabar el juego al cargar | Se endereza al cargar |
| Tutorial | «Carga combustible» no se podía cumplir con el tanque lleno | Entrar con el tanque lleno cuenta |
| Reglas | En Paseo, sin dinero y sin combustible no había salida | Combustible fiado |
| Contratos | «Sin daño» seguía marcado como dañado hasta la siguiente venta | Se limpia al empezar un viaje con la bodega vacía |
| Entrada | Una liga mal escrita creaba un mundo nuevo en silencio | Avisa que está incompleta |

Prueba automática: un jugador simulado con teclas al azar durante 40 y 60 minutos de juego (hasta el fondo, con explosivos) sin una sola falla de estas: números inválidos, quedar dentro de la tierra, salir del mundo, bodega rebasada.

**Lo que no se pudo probar:** el juego con cuadros reales y teclado real. El panel de pruebas estaba oculto y el navegador no dibuja cuadros así; todo el movimiento se probó avanzando la física por código.

---

## 11. Decisiones que te tocan

1. **Parado en la superficie no se gasta combustible.** Lo puse porque un jugador nuevo explotaba leyendo la bienvenida. El original sí gasta. Recomiendo dejarlo.
2. **Se entra a los edificios con ↓**, no al pasar. Con cinco edificios seguidos, entrar al pasar estorbaba. Recomiendo dejarlo.
3. **Las maquinitas se atraviesan** y **la dificultad es del mundo**, como quedó en el prompt.
4. **El servidor confía en el dinero que reporta cada navegador.** Recomiendo corregirlo antes de cualquier tabla mundial (etapa 3).
5. **Abundancia de amazonita**: salen unas 320 por mundo, casi todas en los últimos 250 m. Sin la estación siguiente que cobre $50 millones, el final de la capa 1 queda sobrado de dinero. Se ajusta con el simulador.

<!-- RLR · Ricardo López Reyero -->
