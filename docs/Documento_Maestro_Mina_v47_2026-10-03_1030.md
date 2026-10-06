# DOCUMENTO MAESTRO · «Mina» · v47

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
- **Liga de un mundo**: `mina.capitaltorreon.com/` + 8 caracteres (sin 0/O ni 1/I), por ejemplo `mina.capitaltorreon.com/QSAHAZ3F`. La forma de antes, con `/m/`, sigue sirviendo (ver 9.34).

### 4.2 Qué guarda cada mundo

| Qué | Tamaño |
|---|---|
| Semilla, número de remineralización, reglas, fecha de última visita | una fila |
| Bits de celdas cavadas | 6 KB, una fila |
| Cada maquinita: llave, nombre, modelo, estado completo, récord y total | una fila por maquinita |

Se guarda por lotes cada 8 segundos mientras haya cambios, y al salir alguien. Un mundo no se borra nunca por sí solo (ver 9.21): solo si quien lo creó lo desecha para todos.

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
- **Mundo sin bautizar**: ya no existe el caso. El mundo se registra hasta que el visitante mueve algo, y nace con su maquinita ya bautizada (ver 9.16 y 9.21).

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

### 9.9 La colección del mundo: 99 objetos, en equipo

Ricardo pidió coleccionables: unos 99 objetos, tres de cada uno, repartidos a distintas alturas y en distintas partes del mapa, que valgan muy distinto (más entre más hondo), que desde el principio se vean todos apagados y se vayan encendiendo, y que la colección sea **del mapa y en equipo**.

| Tema | Cómo quedó |
|---|---|
| Cuántos | 33 objetos distintos × 3 = **99**. Cada objeto tiene su franja de 300 m; sus tres copias quedan a distinta altura y en distinta columna. Ninguno cae dentro del agua ni dentro de un lugar, y si un túnel ya pasó por su celda, se recorre. |
| Cómo se ven | Un medallón dorado con su figura. Se recogen perforándolos. Las explosiones no los destruyen. |
| Lo que pagan [N] | De $500 (la Bota de minero, arriba) a $500 millones (el Dragón dormido, al fondo): cada objeto vale 1.54 veces el anterior. El tercero de cada uno paga doble. |
| De quién es | Del mundo. El servidor guarda cuáles se han encontrado (`meta.col`) y se lo dice a todos: lo que encuentra cualquiera se enciende para todos. No se pierde al remineralizar. |
| La vitrina | Menú → Colección: los 33 desde el principio, apagados y con «???»; al encontrar uno se enciende con su nombre y sus tres focos (1, 2 o 3). Cada uno dice su franja de profundidad y su valor, para saber dónde buscar. |
| A la vista | El panel del viaje dice «Colección 12 de 99»; un clic abre la vitrina. |
| Logros | Coleccionista (el primero), Media vitrina (50 entre todos) y Vitrina completa (los 99). |

Los 33, de arriba al fondo: Bota de minero, Linterna vieja, Pico oxidado, Radio de la Compañía, Caracola, Ancla, Brújula, Hongo luminoso, Vela eterna, Llave de hierro, Ánfora, Mapa del tesoro, Murciélago de obsidiana, Máscara ritual, Bola de cristal, Anillo perdido, Urna, Amuleto, Cabeza de piedra, Arco antiguo, Espadas cruzadas, Violín, Reloj de arena, Campana de bronce, Corona, Copa de oro, Colmillo de dragón, Huevo de dragón, Fósil viviente, Fragmento de cometa, Piedra del volcán, Estrella caída y Dragón dormido.

Las figuras son emojis del sistema: se ven un poco distintas en Mac, Windows y teléfono.

### 9.10 Cruzar la lava

Ricardo recordaba del original que, al atravesar lava, todo se ponía rojo, el radiador aventaba el calor y luego salías del otro lado. Antes aquí la lava desaparecía al empezar a perforarla y el golpe llegaba al final, sin nada en medio.

- La lava se queda a la vista mientras la cortas: se va abriendo y brilla cada vez más.
- Toda la pantalla se pone al rojo conforme avanzas, con un resplandor alrededor de la maquinita.
- El radiador saca vapor por atrás todo el tiempo; entre mejor radiador, más vapor.
- Al salir del otro lado: una bocanada de vapor con su siseo, el golpe al casco de siempre, y el rojo se va en poco más de un segundo.
- Cortar lava dura al menos 0.6 s (1.6 veces lo que la tierra), para que el efecto se alcance a ver aun con el mejor taladro.

### 9.11 La piedra se perfora, si el taladro alcanza

Ricardo pidió poder atravesar las piedras desde cierto taladro, tardando entre 0.6 y 1.5 s según el taladro, y que la piedra sea más dura y de otro color conforme se baja. (En el original la piedra nunca se perfora; aquí sí, a propósito.)

| Piedra | Dónde | Taladro mínimo [N] |
|---|---|---|
| Gris | Corteza (210 a 1,000 m) | Colmillo de Rubí ($20 mil) |
| Azulada | Acuífero (1 a 2 km) | Broca de Obsidiana Viva ($2 M) |
| Morada | Cavernas (2 a 4 km) | Barrena de Plasma ($10 M) |
| Índigo | Cristalera (4 a 8 km) | Aguja de Antimateria ($100 M) |
| Negra | Zona de presión (8 a 10 km) | Devoradora de Mundos ($1,000 M) |

- Con el taladro mínimo tarda 1.5 s; cada nivel de sobra quita 0.3 s, hasta 0.6 s con tres niveles de más.
- Mientras se perfora, la piedra se queda a la vista, se agrieta y se desvanece.
- Si el taladro no alcanza, rebota como antes y un letrero dice qué taladro pide. La dinamita la sigue volando.
- El ratón sobre una piedra dice si tu taladro la pasa y en cuánto; la pestaña Taladro del Taller lista qué pide cada piedra.

### 9.12 Pleitos, mapa, archivo del mundo y algo que ver cada 600 a 900 m

Ricardo pidió: que las maquinitas se puedan atacar (en el aire rebotan; en tierra pelean según taladro y escudo, y la que pierde vuelve arriba), poder ver los caminos ya abiertos, guardar el mundo en un archivo y seguir jugándolo, que no pasen más de 600 a 900 m entre una cosa entretenida y la siguiente, y más personalidad en las zonas.

**Pleitos.**

- En el aire: si dos maquinitas se tocan, rebotan. Sin daño.
- Bajo tierra, tocando suelo: empujar el taladro contra otra (← → a su lado, o ↓ encima) le pega cada 0.4 s. El golpe es la cuarta parte de la potencia del taladro de quien ataca [N]; lo que aguanta es el casco de la otra. Recibir un golpe empuja hacia atrás, así que se puede huir.
- Quien pierde vuelve a la superficie con su carga y su dinero completos y el casco reparado. El Elevador lo regresa a donde estaba.
- En el pueblo (la superficie) no hay pleitos. Quien creó el mundo puede apagarlos en Menú → Mundo; en modo Paseo vienen apagados.
- El servidor solo pasa el aviso del golpe; el daño lo calcula quien lo recibe.

**Mapa.** Menú → Mapa: el mundo entero (3 px por celda de ancho, 1 px por cada 2 celdas de alto), con los túneles abiertos en claro, las zonas por color, los lugares descubiertos con su nombre, y un punto por cada maquinita.

**Archivo del mundo.** Menú → Mundo → Guardar archivo descarga un `.json` (formato `mina-mundo`, versión 1) con semilla, remineralizaciones, reglas, la colección y todo lo cavado. Pesa unos 80 KB con el mundo muy cavado. En «Mis mundos», «Abrir un mundo guardado» crea un mundo **nuevo e idéntico** a partir del archivo (el original no se toca). La maquinita no va en el archivo: es del jugador y entra con él.

**Once rincones nuevos.** Con los cuatro lugares grandes son quince; la distancia entre uno y el siguiente va de 340 a 980 m.

| A los | Rincón | Qué tiene |
|---|---|---|
| 350 m | ⛺ El Campamento abandonado | Tienda, carrito, lámpara y cofres. |
| 700 m | 🦖 El Fósil gigante | Un esqueleto de 21 celdas de largo: cada hueso es un hallazgo. |
| 1,040 m | 💧 El Acuífero | (ya estaba) |
| 1,700 m | 🌊 El Río subterráneo | Cruza todo el mundo; peces y perlas en el lecho. |
| 2,300 m | 🍄 El Bosque de hongos | Hongos gigantes que brillan; reliquias en el piso. |
| 2,950 m | 💎 La Gruta de Cristal | (ya estaba) |
| 3,700 m | ⚙️ El Cementerio de maquinitas | Maquinitas viejas y sus cofres. |
| 4,400 m | ♨️ Las Aguas termales | El agua repara el casco gratis. |
| 5,100 m | 🗿 Los Guardianes | Cabezas de piedra con ofrendas a sus pies. |
| 5,580 m | 🏛️ La Ciudad Perdida | (ya estaba) |
| 6,400 m | 🦋 El Jardín de cristal | Columnas de cristal del mejor mineral de la zona. |
| 7,200 m | 🌋 El Lago de lava | Pilares sobre la lava, cada uno con una reliquia. |
| 8,000 m | 🏦 La Bóveda de la Compañía | Un cuarto de ladrillo lleno de cofres. |
| 8,800 m | 🐉 El Nido del dragón | Un dragón dormido y huevos de $60 M. |
| 9,780 m | ❤️ El Corazón de la Tierra | (ya estaba) |

Cada uno da bono al descubrirlo y queda en El Elevador. Las paredes de los rincones son 45 % mineral del mejor de su zona.

**Personalidad de las zonas.** Junto a la profundidad dice la zona. Al entrar por primera vez a una zona sale un letrero que la presenta y dice qué taladro pide su piedra. En los túneles flota algo distinto en cada una: polvo en la Corteza, gotas en el Acuífero, esporas en las Cavernas, destellos en la Cristalera y brasas en la Zona de presión.

Sin probar: un pleito entre dos personas reales (se probó con una maquinita simulada).

### 9.13 La Báscula: todo a la vista y una venta que se disfruta

Ricardo pidió que lo que va a vender se vea completo en una pantalla (el total quedaba abajo, tras un scroll) y que el efecto de vender sea más lento y más rico, con el dinero moviéndose y al final «jalándose» a la cartera.

- **Dos columnas.** Cada mineral en una casilla compacta: color, nombre y cantidad, precio por pieza y subtotal. Catorce minerales distintos caben sin scroll.
- **Total y botón fijos abajo**, siempre a la vista: «125 piezas · se vende en $65.08 M» y «Vender toda la carga».
- **La venta, paso a paso:** el total arranca en cero; cada casilla se enciende, suelta una moneda que vuela al total y el total sube girando, con una nota cada vez más aguda. Los bonos (viaje perfecto, catálogo) entran al final con su campana. Luego el total se va hacia la cartera, la cartera sube girando con lluvia de monedas, y cierra la caja registradora.
- **Cuánto dura:** entre 3 y 7 s según cuántos minerales distintos traigas (6.5 s con catorce). Antes duraba 0.7 s.
- El dinero ya es tuyo desde el clic; lo que tarda es solo lo que se ve. Si cierras a media venta no se pierde nada.
- Con la bodega vacía, La Báscula muestra tu última venta.

### 9.14 Ojo de minero, pleitos con todo y crear mundo desde archivo

**Detalles que solo un minero notaría** (pedido: «que diga: qué bien pensada está»):

| Detalle | Qué es en una mina de verdad | Cómo quedó |
|---|---|---|
| Pintas junto al mineral | El oro va con el cuarzo y la pirita; el cobre se delata con malaquita verde y azurita; el hierro, con óxido; el diamante sale en «tierra azul» (kimberlita). | La tierra pegada a esos minerales lleva vetillas blancas con cubitos dorados, manchas verdes y azules, manchas de óxido o un tono azul. Sirve para prospectar: la roca avisa antes de llegar. |
| Estratos y fallas | Las capas de roca tienen echado (inclinación) y las fallas las desplazan. | Líneas de capa que bajan hacia la derecha en todo el mundo, cortadas y desplazadas por dos fallas (columnas 31 y 67). |
| Ademe | Las galerías se sostienen con marcos de madera y llevan riel; los tiros llevan escalera. | Lo que cava el equipo se adema solo: marcos cada tres celdas y riel en las galerías, escalera en los tiros. Las cuevas naturales no. |
| Estalactitas | Solo crecen en techos de cuevas naturales. | En los techos de las cuevas que nadie cavó. |
| Geodas | Piedras comunes por fuera, con cristales adentro. | Una de cada catorce piedras; se reconoce por un brillo morado en una grieta. Solo el taladro la abre y paga (más entre más honda); la dinamita la destruye. |
| Grisú | El gas de mina; la flama de la lámpara de seguridad se pone azul cuando lo hay. | El aviso ahora dice «Grisú: la flama se puso azul» y el faro de la maquinita se pone azul. |
| ¡Fuego en el barreno! | El grito antes de tronar. | Sale al usar dinamita o plástico. |
| El terrero | El cerro donde se tira el tepetate (roca sin valor). | En la superficie, a la izquierda del pueblo; crece con el total de celdas cavadas por el equipo y el ratón dice cuántas van. |
| Santa Bárbara | Patrona de los mineros; su nicho está a la entrada de muchas minas. | Un nicho con veladora junto a la Gasolinera. Al pasar por primera vez, un mensaje. |
| El malacate | Así se llama el aparato que sube y baja la jaula. | El Elevador lo nombra así. |
| La báscula pesa | Se vende por peso. | La venta muestra los kilos de cada mineral y el total. |
| Fechas | 11 de julio, Día del Minero en México; 4 de diciembre, Santa Bárbara. | Ese día, un saludo al entrar. |

**Pleitos con todo.** Mientras dura el contacto salen chispas sin parar, las dos maquinitas vibran y sacan sus rotorcitos, y cada golpe deja un anillo, un temblor y el número de daño sobre la rival. Cuatro clases de golpe [N]: de frente (normal), por la espalda (+50 %), desde arriba (+50 %) y taladro contra taladro (la mitad, con campanazo, y las dos salen rebotadas). Quien gana recibe su celebración y lleva la cuenta de pleitos ganados.

**Crear mundo.** «Crear mundo nuevo» ofrece dos caminos: de cero, o cargar un archivo de mundo. Cargar siempre crea un mundo nuevo con su propia liga; nunca reemplaza uno existente. Así se comparte un mundo: se manda el archivo y quien lo recibe lo carga. La maquinita no va en el archivo: se mueve con su liga o su código QR.

### 9.15 La tierra: 512 celdas distintas, armadas por un algoritmo

Ricardo pidió que la roca se vea más real sin dejar de ser caricatura: más contrastes, colores, fisuras, que cada pedazo sea más único y que haya patrones. Dio «100 tipos» como referencia y aceptó que fuera un algoritmo.

Cada celda de tierra sale de tres cosas:

1. **La zona** (8 paletas, por profundidad): el color de base.
2. **El tipo de roca del lugar** (4): tierra, arenisca (más clara, con láminas finas que siguen el echado), lutita (más oscura, partida en bloques) y conglomerado (guijarros de colores pegados). No van celda por celda: forman **capas** de 3 a 6 celdas de grueso que bajan hacia la derecha y se cortan en las mismas dos fallas que los estratos (`litoDe`, ruido suave estirado a lo largo del echado).
3. **Una de 16 variantes**, elegida por la posición: cada una con sus manchas suaves, su grano, de una a tres piedritas, a veces una fisura con su filo de luz, y de vez en cuando una rareza (un caracol fósil en la Corteza, brillitos de mica, un nódulo oscuro, esquirlas de cristal en las zonas hondas, una vetilla).

Son 8 × 4 × 16 = **512 celdas distintas**, y encima siguen yendo los estratos y las pintas junto al mineral. Solo se fabrican las que entran a la pantalla: unas 70 a la vez.

Cambio de fondo: la piedra, la lava, los minerales y los tesoros ahora se dibujan **encima** de la tierra de su celda (antes cada uno traía su propio fondo, siempre igual), así que un mineral dentro de una capa de arenisca se ve sobre arenisca.

---

### 9.16 Entrar es jugar: icono, aplicación, imágenes de liga y cero clics

**Entrada instantánea.** Nadie llena nada para empezar.

- **Visitante nuevo en el inicio:** el mundo nace en su propio navegador (semilla local) y ya puede moverse; medido en local, el juego está corriendo a los 63 ms de abrir la página. En cuanto toca una tecla o la pantalla, el mundo se registra en el servidor con esa misma semilla (`POST /api/mundo` con el archivo del mundo), recibe su liga y lo que ya cavó viaja con él. Así no se crean mundos vacíos por visitas que no juegan.
- **La maquinita nace bautizada:** nombre de mina al azar (La Chispa, El Topo, La Bonanza, El Malacate…) y modelo al azar. El nombre y el modelo se cambian en Menú → Mundo (mensaje `nombre`; el mundo avisa a todos con `nom`). Si el mundo se llamaba «Mundo de <nombre viejo>», se renombra solo. La pantalla de bautizo ya no existe.
- **Quien llega por una liga** entra directo, con su maquinita ya bautizada.
- **Quien regresa** al inicio entra a su último mundo sin tocar nada. La lista de mundos vive en `/?mundos` (Menú → Mundo → Mis mundos).

**La copia de este equipo.** Cada 4 segundos, y al salir, el navegador guarda el mundo (`mina_copia_<ID>`: semilla, túneles, colección, reglas) y la maquinita (`mina_est`), los dos marcados con la llave de la maquinita. Con esa copia el juego abre al instante sin esperar al servidor; cuando el servidor contesta, se concilia: las celdas de aquí que el mundo no tenía se le mandan, y si la maquinita avanzó más en otro equipo (versión mayor) manda la del mundo. Se guardan los cuatro mundos más recientes.

**Sin internet.** Perder la señal ya no detiene el juego: sale un aviso discreto («Sin señal · sigues jugando, se guarda al volver») y todo sigue. Al volver se manda lo cavado, lo encontrado y el estado. Probado con el servidor apagado: la aplicación abre, arranca con la copia y se puede cavar.

**Aplicación instalable.** `manifest.webmanifest`, iconos (32, 180, 192, 512 y 512 enmascarable; se generan con `diseno-fuente/Icono_Mina_v1_*.py`) y `sw.js`, que guarda la página, el juego y los iconos. Con señal siempre pide lo más nuevo (así llega cada versión) y solo usa lo guardado si la red tarda más de 2.5 s o no hay. Menú → Opciones explica cómo instalarla en cada equipo y trae el botón cuando el navegador lo permite.

**Controles táctiles (primera versión).** La palanca aparece donde se pone el dedo: arrastrar mueve, soltar detiene; un toque frente a un edificio entra. En teléfonos el tablero se dibuja 20 % más chico.

**Imágenes de liga (1200×630).**

| Liga | Imagen | Cómo se hace |
|---|---|---|
| El inicio | `mina.jpg`, igual para todos | Escena fija (`/?foto=1`) fotografiada con Chrome sin ventana |
| El mundo `/ID` | Nombre del mundo, hasta 5 maquinitas con su nombre, lo más hondo, km de túneles, colección | La dibuja el juego (`fotoLiga(true)`) y la sube al mundo |
| El jugador `/ID?j=N` | Su maquinita, rango, metros, dinero ganado, logros o altura | `fotoLiga(false)` |

El juego las vuelve a subir solo cuando algo que enseñan cambió (un récord, alguien nuevo, otro objeto), como mucho cada 2.5 minutos, o al abrir Invitar. Viajan por el mismo WebSocket (primer byte 2 = mundo, 3 = jugador), solo JPEG, hasta 300 KB, y el mundo las sirve en `/og/m/ID.jpg` y `/og/m/ID/N.jpg`; si aún no hay, sale la del inicio. La liga lleva además título y texto con los hitos. Menú → Invitar enseña cómo se ven las dos.

**Límites que conviene saber.** WhatsApp guarda la vista previa de una liga la primera vez que la ve; una liga ya mandada puede seguir enseñando la imagen vieja. La imagen la dibuja el navegador de un jugador del mundo: quien esté dentro del mundo puede subir otra imagen JPEG en su lugar. Los controles táctiles no se han probado en un teléfono real.

### 9.17 El diseño de la tierra, de regreso; y tres sorpresas

**Lo que se quitó (solo dibujo; nada de lo demás cambió).** Ricardo pidió regresar el aspecto de la tierra y de los túneles a como estaba antes de las iteraciones 21 y 22:

- Fuera los ademes de madera, los rieles y las escaleras en los túneles cavados, y las estalactitas oscuras de las cuevas.
- Fuera las vetillas blancas de cuarzo, las manchas de malaquita, óxido y tierra azul, las líneas de estratos y las dos fallas.
- La tierra vuelve a su dibujo anterior: un café por zona, grano, dos vetas tenues y tres piedritas. Se conservan dieciséis acomodos por zona y un matiz apenas visible por capa (4 a 6 %, antes 13 a 18 %), sin láminas, bloques, guijarros, fisuras ni rarezas.
- Se quedan: las geodas, la flama azul junto al grisú, el terrero, el nicho de Santa Bárbara y las plantitas de las cuevas naturales.

**Tres sorpresas**, una en cada tercio del mundo, para quien se detiene:

| Dónde | Qué pasa | Cómo está hecho |
|---|---|---|
| El Bosque de hongos (2,300 m) | Cada hongo gigante canta una nota del acorde que la música lleva en ese instante (el más grande, la más grave). Al tocar uno se enciende, suelta esporas y los otros cuatro le contestan, del más cercano al más lejano. Tocar los cinco seguidos (16 s) hace que el bosque toque una frase entera; la primera vez regala $1 M. | `cantarHongos`, `acordeAhora` (la música anota qué acorde programó), `HONGOS`, `hongo.luz` |
| La Ciudad Perdida (5,580 m) | Sobre la pirámide hay un mural pintado «hace miles de años»: LOS QUE VENDRÁN. Retrata a las maquinitas de ese mundo, cada una con su modelo y su nombre, entre manos pintadas, sol y luna. Debajo, 33 círculos: los objetos de la colección que el equipo ya encontró van llenos. Si entra alguien nuevo o alguien se rebautiza, el mural cambia. | `mural()` (lienzo aparte, se repinta solo cuando cambia su firma), `MURAL` |
| El Jardín de cristal (6,400 m) | Las mariposas de vidrio andan sueltas. Si te quedas quieto 1.4 s, se juntan encima de ti y escriben el nombre de tu maquinita; al moverte, se sueltan. | `poblarJardin` (el nombre se dibuja en un lienzo chico y cada punto es una mariposa), `mariposas` |

Cada una avisa con una tarjeta la primera vez (`S.fl.hongos`, `S.fl.coro`, `S.fl.mural`, `S.fl.mariposas`). La Ayuda solo dice que hay tres lugares con sorpresa, sin decir cuáles.

### 9.18 Top 20 mundial y público

**La tabla.** Menú → 🏆 Top 20: las veinte maquinitas que más dinero han ganado, entre todos los mundos. Cada renglón lleva solo el lugar, la maquinita, su nombre y su total, con la cifra completa (no abreviada) para que se vea subir. Con la tabla abierta se pregunta cada 4 s y los números ruedan hasta su nuevo valor. Quien no está en la tabla ve cuánto le falta para entrar. Arriba a la derecha, durante el juego, sale «🏆 Lugar N del mundo», y una tarjeta avisa al entrar al Top 20 o al subir de lugar.

**Cómo se arma.** Un solo objeto en el servidor para todo el juego (`Tabla`, instancia `mundial`). Cada mundo le avisa cuánto lleva cada maquinita: a los 3 s como mucho si su total cambió, y cada 20 s mientras juega para que conste que está en vivo (60 s sin aviso = «descansando»). La tabla guarda 100 y enseña 20; las maquinitas que están lejos de las 100 no avisan. La maquinita se reconoce por una huella de su llave (SHA-256, 16 caracteres): la llave nunca sale del mundo. `GET /api/tabla` devuelve la lista.

**Mirar sin jugar.** A la maquinita que está jugando se le puede ir a ver con «👁 Ver jugar». Cada mundo tiene una ficha de 12 caracteres al azar, distinta de su liga; la liga para mirar es `/ver/FICHA?j=N`. El servidor traduce la ficha a su mundo en un directorio que solo él conoce (`/ws/ver/FICHA`), así que quien mira nunca recibe la liga del mundo: ni en la dirección ni en ningún mensaje. Su conexión va marcada como de observador: recibe el mundo y todo lo que pasa en él, pero nada de lo que mande se atiende (probado: un «hola» o un «cava» desde esa conexión no hacen nada). Caben 30 mirando por mundo.

Quien mira ve el juego completo sin tablero, con una barra arriba: a quién ve, a qué profundidad va, cuánto lleva, cuántos más miran, «Otra ▶» para cambiar de maquinita (también ← →), «🏆 Top 20» y «⛏️ Jugar yo». A quien juega le sale «👁 N personas te miran».

**Control del mundo.** Menú → Mundo → «Dejar que nos vean jugar» (Sí por omisión, solo lo cambia quien creó el mundo). En «No», se despide a quien esté mirando y la tabla deja de ofrecer el botón. Ahí mismo está «Copiar liga para mirar», para mandarla a quien quieras aunque no estés en el Top 20.

**Límite que conviene saber.** El total lo reporta el navegador de cada jugador (pendiente desde el principio: el servidor confía en el dinero que le dicen). Alguien con conocimientos puede inflar su número y aparecer en la tabla. Mientras se juegue entre conocidos no pasa nada; antes de abrirlo al público hay que hacer que el servidor lleve la cuenta, o al menos poder borrar un renglón de la tabla.

### 9.19 Diez mejoras más por pieza, Remineralizadora al 5 % y el mundo que da la vuelta

**El Taller.** Cada pieza pasa de 16 a 26 mejoras. Las diez nuevas cuestan $6,000 M, $15,000 M, $40,000 M, $100,000 M, $250,000 M, $600,000 M, $1.5 T, $4 T, $10 T y $25 T (T = billón, un millón de millones).

| Pieza | Antes (nivel 16) | Ahora (nivel 26) | Nota |
|---|---|---|---|
| Taladro | 470 de potencia | 1,900 | Con 1,900 se llega al tope de velocidad (0.07 s por celda) en el fondo del mundo |
| Casco | 3,200 de vida | 45,000 | |
| Motor | 2,200 caballos | 80,000 | Crece más rápido que las demás: con el último ya se levanta la última bodega llena de Osmio |
| Tanque | 1,600 litros | 16,000 | |
| Radiador | 98 % | 99.8 % | Nunca llega a 100 |
| Bodega | 1,050 espacios | 6,000 | |

**La Remineralizadora** ya no es gratis la primera vez ni depende del mejor mineral vendido: cuesta el **5 % de todo lo que la maquinita ha ganado en su vida** (`S.tot`), con un mínimo de $500. Como el total nunca baja, el precio sube para siempre. La pantalla dice cuánto llevas ganado y cuánto te falta.

**El mundo da la vuelta.** La columna que sigue a la última es la primera: si sales por la derecha entras por la izquierda y al revés, volando o perforando. `celda()` y `cavar()` envuelven la columna, así que también los choques, los túneles y las explosiones cruzan la orilla. `darVuelta()` corre después de cada paso de física: recorre a la maquinita 96 columnas, con todo y la perforación que llevaba a medias, y brinca la cámara. La primera vez sale una tarjeta que lo explica. La cámara no gira: al cruzar, la vista salta al otro lado.

### 9.20 La regla de profundidad al mirar, y una revisión de fluidez y memoria

**Mirar con la rueda.** Mientras se mueve la vista con la rueda o el trackpad:

- A la izquierda sale una **regla**: va de la superficie a tu récord, con una marca blanca y su letrero («3,400 m · Cavernas») para lo que estás viendo, un punto amarillo donde quedó tu maquinita y los iconos de los lugares que ya descubriste. Un clic en la regla lleva la vista a esa profundidad.
- El letrero de abajo también dice a qué profundidad va la vista.
- **Solo se mira lo ya explorado:** la vista no baja más allá de tu récord de profundidad ni sube más allá de tu mayor altura (mínimo 40 m). Así no se adelantan las sorpresas de abajo ni las del cielo. Quien mira a otro jugador tiene como tope el récord de ese jugador.

**Fluidez y memoria: lo que se midió** (ventana de 1400×800 a doble densidad, celdas de 88 px).

| Qué | Medición |
|---|---|
| Calcular y mandar a dibujar un cuadro | 0.3 a 1.2 ms según el lugar (hay 8 a 16 ms por cuadro) |
| Basura por cuadro | 0 a 3 KB |
| Memoria del programa (sin imágenes) | 5.8 MB |
| Guardar la copia local con un mundo muy cavado | 0.64 ms |
| Dibujar una imagen de liga | 1.5 ms |
| Fabricar una celda nueva | 0.01 a 0.06 ms; el primer cuadro en una zona nueva, 5 a 7 ms |

El cálculo no es el cuello de botella. Lo que sí crecía sin tope era la memoria de imágenes guardadas, y eso es lo que se cambió:

- **Celdas dibujadas:** al pasar de 280 se sueltan las de zonas lejanas. Un recorrido completo dejaba 449 (14 MB) y podía llegar a unas 1,000; ahora se queda entre 160 y 320.
- **El mural** (7.6 MB) y **el cielo estrellado** se sueltan al alejarse y se vuelven a pintar al regresar.
- **Las mariposas** del Jardín solo se mueven cuando se pueden ver (antes seguían calculándose a kilómetros).
- **Las partículas** se limpian en su lugar, sin crear un arreglo nuevo en cada cuadro.
- **Guardar la copia local** se hace cuando el navegador tiene un respiro, y **las imágenes de liga** se dibujan cuando la maquinita está quieta en el pueblo, no a media bajada.
- **Medidor:** Menú → Opciones dice, del último minuto jugado, cuántos cuadros salieron lentos, cuánto tardó el peor y cuánta memoria ocupan las celdas. Sirve para saber con datos cómo va en cada equipo.

**Lo que quedó pendiente entonces** (aligerar a la tarjeta de video) se hizo después, y mejor que con un atlas: ver 9.22.

### 9.21 Los mundos son para siempre, y su terreno queda fijo

**El problema que había.** El terreno de un mundo no estaba guardado: cada vez que alguien entraba, el juego lo volvía a calcular con la semilla y con el generador de la versión de ese día. Cada vez que el generador cambió (más tesoros, menos gas, lugares nuevos), los mundos ya creados cambiaron con él. Y los mundos caducaban: 180 días sin visitas, o un día si nadie se había bautizado.

**Cómo queda.**

- **El terreno se fabrica una sola vez, al nacer el mundo, y se guarda completo:** las 480,000 celdas (96 × 5,000), una por una, con sus geodas, más la celda donde está cada uno de los 99 objetos de la colección. Desde entonces el juego lo lee tal cual y ya no usa el generador para ese mundo. Aunque el juego cambie en dos años, el mundo es el mismo.
- **Dónde vive:** en el mundo (comprimido pesa unos 150 KB), en cada equipo que lo ha abierto (guardado por su huella, para abrir sin pedirlo otra vez, incluso sin internet) y, completo, en el archivo de «Guardar archivo» (unos 690 KB de JSON).
- **Nadie lo puede cambiar:** un mundo que ya tiene terreno rechaza cualquier otro (probado).
- **Los mundos de antes** quedan fijos la primera vez que alguien entra con esta versión: su navegador fabrica el terreno con el generador de hoy (el mismo que ya estaban viendo) y lo entrega.
- **Remineralizar** sigue creando terreno nuevo: lo entrega quien remineralizó y queda fijo otra vez.
- **Una huella** (16 caracteres) identifica cada terreno. Si un navegador trae un terreno distinto del que tiene el mundo, manda el del mundo.
- **Los mundos no caducan.** Se quitó el borrado automático. Un mundo solo desaparece si quien lo creó elige «Desechar este mundo» → «borrarlo para todos».

**Lo que hace que una partida sea «exactamente la misma» en dos años:** el terreno (fijo), lo cavado (un bit por celda), la colección, las reglas, y la maquinita con todo lo suyo, que vive aparte y tampoco caduca.

**Lo que no queda congelado.** El dibujo, los sonidos, los precios y las reglas del juego son código: si cambian, cambian para todos los mundos. Para que el terreno guardado siga significando lo mismo hay una regla al programar: a las listas de minerales y hallazgos solo se les agrega al final, nunca se insertan ni se reordenan (cada celda guarda el número del mineral). El terreno lleva además la versión del generador con que nació (`GEN = 1`, `mundoGen`), para que una novedad futura pueda aplicarse solo a mundos nuevos.

**Piezas.** Juego: `base` y `geodas` (terreno cargado), `terrenoProcedural`, `empacar`/`desempacar`, `huellaMapa`, `conMapa`, `traerMapa`, `ponerTerreno`, `subirMapa`, `cambiarMapa`, caché `mina-mapas`. Mundo: `mapaValido`, `recibirMapa`, `mapa()`, `GET /api/mapa/ID` y `/api/mapa/ver/FICHA`, mensaje binario 4, campos `mapaR` y `mapaH`.

**Costo.** Cada mundo ocupa entre 0.2 y 0.8 MB guardado (terreno, túneles e imágenes de liga). Mil mundos son menos de 1 GB.

### 9.22 El terreno en bloques, y el tiempo real entre dos maquinitas

**El dibujo del terreno.** Antes, cada cuadro armaba la pantalla celda por celda: la tierra, el mineral encima, hasta cinco sombras de orilla y el destello. Con unas 600 celdas a la vista eran alrededor de 1,500 órdenes de dibujo por cuadro, cada una con su propia imagen.

La idea original era un «atlas» (todas las celdas en una sola imagen grande). Eso solo ahorra cambios de imagen: las 1,500 órdenes siguen ahí. Se hizo algo mejor:

- **El terreno se compone una sola vez en bloques de 4 × 4 celdas** (`bloque`, `pintarBloque`): tierra, mineral, piedra, lava, sombras, pasto y plantas quedan ya pintados en el bloque.
- **Cada cuadro solo estampa los bloques que se ven:** unas 60 estampas en vez de 1,500 órdenes.
- **Al cavar una celda** se repinta su bloque y los de las celdas vecinas a las que les cambia la sombra (`ensuciar`, desde `ponerCavada`). Son 16 celdas: no se nota.
- **Lo que se mueve va encima,** con listas que cada bloque guarda: destellos de mineral, resplandor y burbujas de la lava, burbujas del gas y la superficie del agua.
- **La memoria está acotada:** solo existen los bloques que caben en pantalla y seis más; los que salen de la vista se sueltan y su lienzo se reutiliza.

| Medición (ventana de 1400×800 a doble densidad) | Antes | Ahora |
|---|---|---|
| Órdenes de dibujo del terreno por cuadro | ~1,500 | ~60 |
| Cálculo por cuadro, parado o a paso normal | 0.5 a 1.2 ms | 0.2 a 0.5 ms |
| Cálculo por cuadro, bajando en picada (bloques nuevos en cada cuadro) | ~1.05 ms | ~1.0 ms |
| Bloques vivos, tope | — | 60 |
| Imágenes guardadas del terreno | 10 a 14 MB | unos 40 MB |

El costo es memoria: los bloques ocupan alrededor de una pantalla y media de imagen. En un teléfono son unos 15 MB; en una ventana grande de alta densidad, unos 50. Se cambia memoria por trabajo de la tarjeta de video en cada cuadro, que es lo que más pesa en los teléfonos.

**Dos maquinitas cerca.** La posición de cada maquinita viajaba 15 veces por segundo y las demás la dibujaban unas 135 milésimas atrás. Ahora:

- **30 veces por segundo** cuando hay otra maquinita a la vista (o alguien mirando); **10** cuando las demás andan lejos, donde no hace falta.
- **El retraso se ajusta a cada maquinita** según el ritmo con que llegan sus posiciones (`o.iv`, `o.ret`): unas 80 milésimas a 30 por segundo.

| Posiciones por segundo | Retraso con que se dibuja | Variación |
|---|---|---|
| 30 (cerca) | 80 ms | 3.3 ms |
| 15 (como estaba) | 134 ms | 6.9 ms |
| 10 (lejos) | 190 ms | 14 ms |

Medido en local, sin la latencia de internet. En la red real hay que sumar el viaje de ida y vuelta al servidor.

**Sin medir todavía:** el efecto en una pantalla real y en un teléfono real. Para eso está el medidor de Menú → Opciones (cuadros lentos del último minuto).

### 9.23 El chat del mundo

Como en las partidas de StarCraft: lo que alguien escribe sale abajo un momento, y el chat completo se abre de izquierda a derecha con todo lo dicho.

**Cómo se usa.**

- **Enter** (o el botón 💬 Chat, arriba a la derecha) abre el chat con el cursor listo. Se escribe abajo y la conversación crece hacia arriba.
- **Enter** manda. **Enter con la caja vacía** regresa al juego dejando el chat a la vista. **Esc** lo cierra.
- Con el chat **cerrado**, cada mensaje sale abajo durante diez segundos («Ricardo: Hola a todos») y el botón lleva la cuenta de los no leídos.
- Con el chat **abierto**, el tablero de la izquierda se recorre a la derecha para no quedar tapado, y el juego sigue corriendo.

**Lo que trae.**

- **Burbujas** con el icono de la maquinita, su nombre y la hora. Las propias van a la derecha. Mensajes seguidos de la misma maquinita se agrupan.
- **Cien colores**, uno por número de maquinita en el mundo (el orden en que entró por primera vez). El color es de la maquinita en ese mundo y no cambia aunque salga y vuelva; en otro mundo le toca el del lugar en que entró allá. Por eso caben **100 maquinitas por mundo** (antes 30).
- **Emojis**: los del teclado, más una fila de diez para un toque.
- **Ligas**: lo que empieza con http, https o www se vuelve liga y abre en otra pestaña.
- **El texto se puede seleccionar y copiar.** No hay botones de copiar.
- **Se guarda todo** en el mundo, mensaje por mensaje (tabla `chat`). Al entrar llegan los últimos 60; al subir hasta arriba se piden los anteriores de 50 en 50. Letreros de «Hoy», «Ayer» y fecha separan los días.
- **Quién está conectado** va en el encabezado, cada quien con su color. Las entradas, salidas y descubrimientos salen como notas chicas en medio de la conversación (solo durante la sesión; no se guardan).
- **Quien mira** un mundo puede leer el chat y su historial, pero no escribir.

**Cuidados.**

- El texto nunca se interpreta como código: se escribe tal cual. Se le quitan los caracteres de control y las marcas invisibles que voltean el texto.
- Máximo 300 caracteres por mensaje, y seis mensajes cada diez segundos por maquinita.
- Se guardan los últimos 20,000 mensajes de cada mundo.
- No hay moderación: nadie puede borrar un mensaje ni silenciar a alguien. Para jugar entre conocidos alcanza; antes de abrir el juego al público hace falta.

**Más gente a la vez.** Conectadas al mismo tiempo caben **40** (antes 10). Para que aguante, el mundo ya no le manda todas las posiciones a todos: a quien está cerca le llegan todas; a quien anda lejos, una de cada cinco. Prueba en local con 38 maquinitas simuladas mandando 30 posiciones por segundo, todas juntas: un mensaje de chat tardó entre 4 y 20 ms en llegar. Repartidas por el mundo, cada una recibió 185 posiciones por segundo en vez de 1,110. Sin probar todavía con 40 personas reales ni en el servidor de producción.

**Piezas.** Mundo: `textoChat`, mensajes `chat`, `chatAntes`, `chatMas`, `chatNo`, tabla SQL `chat`. Juego: `colorDe`, `agregarChat`, `ponerChat`, `chatViejos`, `conLigas`, `nodoChat`, `abrirChat`, `#chat`, `#chatVivo`.

### 9.24 El reloj de cada maquinita, y la tabla crece a 33

**El reloj.** Cada maquinita lleva la cuenta de los segundos que ha estado jugando en toda su vida (`S.seg`). Viaja con ella de mundo en mundo, igual que su dinero.

- **Cuándo suma:** con el juego a la vista y la maquinita activa. Cuenta también el tiempo en los menús (comprar es jugar).
- **Cuándo no suma:** con la pestaña oculta, en pausa (tecla P), o tras dos minutos sin tocar nada con la maquinita quieta. Si va subiendo sola al espacio, sí cuenta aunque no se toque nada.
- **Cómo se lee:** de segundos a años, con las tres unidades más grandes que le toquen: «59 min 59 s», «3 h 12 min 5 s», «1 d 1 h 1 min», «1 sem 1 d 2 h», «1 mes 2 sem 2 d», «1 año 3 meses 1 sem». Un mes son 30 días y un año, 365.
- **Dónde se ve:** en la tabla mundial, en Menú → Estadísticas («Tiempo jugando») y en Menú → Mundo, junto a tu maquinita.

**La tabla.** Pasa de 20 a **33** maquinitas. Cada renglón lleva el dinero ganado y, debajo, el tiempo jugado. En las maquinitas que están jugando en ese momento, el reloj corre segundo a segundo con la tabla abierta.

**De dónde parte.** El reloj empieza a contar con esta versión: no hay forma de saber cuánto jugó cada maquinita antes. Las que no han vuelto a entrar salen sin tiempo.

**Límite.** Igual que el dinero, el tiempo lo reporta el navegador de cada jugador; el servidor le cree.

### 9.25 Las teclas, en español

Criterio de Ricardo: el juego es para gente que habla español, y cada tecla debe entenderse sin aprendérsela. Cada tecla es la inicial de lo que hace.

| Tecla | Qué hace | Antes era |
|---|---|---|
| **R** | Reserva (tanque de reserva) | F |
| **N** | Nanobots | R |
| **D** | Dinamita | X |
| **P** | Plástico (explosivo plástico) | C |
| **Q** | Cuántico (teletransportador) | Q |
| **T** | Transmisor | M |
| **C** | Chat: abre y cierra, con el cursor listo | Enter (sigue funcionando) |
| **S** | Señal | G |
| **A** | Ayudar: pasa 5 litros a la maquinita de junto | T |
| **G** | Grúa | E |
| **M** | Menú (también Esc) | solo Esc |
| Flechas | Moverse | flechas o W A S D |

Las seis primeras y la C las pidió Ricardo; S, A, G y M se cambiaron con el mismo criterio.

**Lo que se quitó por necesidad.**

- **W A S D para moverse:** la D es Dinamita y la S es Señal, así que el movimiento queda solo en las flechas.
- **La tecla de pausa:** la P ahora es Plástico. Para descansar se abre el menú (M o Esc): con el menú abierto la maquinita no gasta ni se mueve, igual que con la pausa.

**Letras amarillas.** El botón del chat lleva una **C** amarilla a la izquierda de la burbuja, igual que las letras de los objetos de abajo; también el encabezado del chat. El botón del menú lleva su **M** y la grúa su **G**.

### 9.26 Puro teclado: el chat y los edificios

Ricardo viene de StarCraft y quiere poder jugar casi sin ratón. Las teclas son las mismas en Windows y en Mac: no se usa ninguna combinación.

**El chat.**

| Tecla | Dónde | Qué hace |
|---|---|---|
| **C** (o Enter) | Jugando | Abre el chat con el cursor en la caja |
| **Enter** | Escribiendo | Manda el mensaje y deja el cursor listo para otro |
| **Enter** con la caja vacía | Escribiendo | Cierra el chat |
| **Esc** | Donde sea | Cierra el chat; lo que estaba escrito se queda para después |
| **Tab** | Escribiendo | Regresa al juego dejando el chat a la vista |
| **↑ ↓**, RePág, AvPág | Escribiendo | Recorren la conversación |
| **C** | Jugando, con el chat a la vista | Lo cierra |
| **Enter** | Jugando, con el chat a la vista | Regresa el cursor a la caja |

El ciclo completo queda así: C, escribir, Enter, Enter. Debajo de la caja hay un renglón con estas teclas en amarillo, y el botón de cerrar dice «Esc».

**Los edificios y el menú.**

| Tecla | Qué hace |
|---|---|
| **Enter** | Lo principal de cada edificio: cargar en la Gasolinera, vender en la Báscula, comprar la siguiente mejora en el Taller, reparar en el Almacén. En el Elevador pone el cursor en los metros |
| **← →** | Cambian de pestaña (pieza en el Taller, pestaña en el menú) o de cantidad en el Almacén |
| **↑ ↓** | Recorren la lista |
| **R N D P Q T** | En el Almacén, compran ese objeto: la misma letra con que se usa |
| **Esc** o **M** | Cierran |
| **I** | Abre Invitar |

Cada menú lleva al pie un renglón con sus teclas, y los botones principales traen su letra.

**Lo que se dejó fuera a propósito:** remineralizar no tiene tecla. Cuesta el 5 % de todo lo ganado y no debe dispararse con un Enter de más.

**Lo que todavía pide ratón:** mirar alrededor (rueda) y la regla de profundidad, las opciones de sonido, y los botones secundarios dentro de los menús (aunque Tab y Enter del navegador los alcanzan).

### 9.27 El cierre: el Jardín del Fondo

**Lo que pidió Ricardo.** Un cierre real para el fondo del mundo: sin guerra ni pleitos, con un mensaje de abundancia («hay para todos, todo está bien»), que aparezca al quitar la roca, como un lienzo que se va descubriendo, y que dé todavía una hora de juego.

**Cómo quedó.** Los últimos 240 m del mundo (de 9,760 a 10,000 m; 11,520 celdas) guardan un jardín pintado detrás de la roca.

- **Se descubre quitando roca.** Ahí abajo, una celda abierta no deja un hueco oscuro: deja ver el pedazo de jardín que le toca. Es el único lugar del mundo donde el fondo es otro.
- **La primera ventana es el Corazón.** La caverna del Corazón de la Tierra ya está abierta, así que al llegar se ve a través de ella un cielo dorado: el Corazón es el sol de ese jardín. De entrada va a la vista alrededor de la cuarta parte.
- **Entre todos.** El avance es del mundo, no de cada quien. Arriba al centro dice «El Jardín del Fondo · 37 % a la vista», y hay avisos al 40, 60, 80 y 95 %.
- **Las últimas celdas** (cuando faltan 40 o menos) quedan marcadas con un aro amarillo, para que nadie se quede buscando una piedra perdida.
- **Para llegar al 100 %** hay que quitar todo: tierra, mineral, piedra, lava, gas, los objetos de la colección que haya ahí y el Corazón mismo.

**Qué hay pintado** (de arriba abajo, 96 × 120 celdas, todo dibujado por código):

| Franja | Qué se ve |
|---|---|
| Arriba | La noche, estrellas, y las raíces de todo lo de arriba colgando, cada una con una lucecita en la punta |
| El sol | El Corazón, con sus rayos; amanecer, nubes, parvadas y globos de papel que suben |
| El mensaje | **HAY PARA TODOS** en letras de diez celdas de alto, y debajo «Siempre hubo. Todo está bien.» |
| La sierra | Dos sierras, cascadas, un arcoíris que nace de una de ellas |
| El valle | Árboles con fruta, milpas, flores, casitas con su lumbre, dos ríos |
| El centro | Un árbol enorme con faroles y, debajo, una mesa larga ya puesta. Junto a ella, las maquinitas de ese mundo, cada una con su nombre |
| El lago | Trajineras, peces que brincan, el reflejo del sol |

**El final.** Al quitar la última piedra:

1. El jardín cobra vida: pájaros que cruzan, pétalos que caen, luciérnagas entre las raíces, destellos en el lago, los rayos del sol girando despacio.
2. La música cambia a una pieza en tono mayor, que solo suena ahí.
3. Sale el jardín entero a pantalla completa: baja despacio desde las raíces hasta el lago (15 s) y luego se aleja para verse todo de una vez. Cualquier tecla regresa al juego; después, la tecla **V** lo vuelve a mostrar estando en el jardín.
4. A cada maquinita le toca su parte: $1,000 M, una vez por mundo. También a quien no estaba conectado: la recibe al volver a bajar.
5. Queda el logro «Hay para todos», y el mundo apunta cuándo se completó y quién quitó la última piedra.

**Decisiones.**

- **El mundo no se alargó.** Ricardo propuso llevarlo a 10,060 o 10,330 m. El terreno de cada mundo quedó fijo a 10,000 m (9.21), así que el cierre se hizo dentro de lo que ya existe y sirve también para los mundos ya creados.
- **Remineralizar vuelve a cubrir el jardín.** Se puede descubrir otra vez, y se celebra otra vez, pero el regalo es uno por mundo.
- **Con explosivos se va más rápido.** A taladro, quitar todo toma alrededor de una hora con equipo medio; con explosivo plástico (25 celdas cada uno) se puede en mucho menos.

**Piezas.** `EDEN0`, `armarEden` (unas 450 piezas con su recuadro; cada bloque del terreno dibuja solo las que le tocan, 0.04 a 0.2 ms por bloque), `pintarEden`, `medirEden`, `jardinDelFondo`, `finDelMundo`, `vidaEden`, `verJardin`. Mundo: mensaje `fin`, campo `fin` en la meta.

**Sin probar con personas:** el recorrido completo de una hora y el cierre con varios jugadores conectados a la vez. Se probó cavando por código y con un solo jugador.

### 9.28 Bajar rápido también bajo el agua

Antes, al entrar al agua (el Acuífero, el Río, las Aguas termales) la caída se frenaba de golpe a 5 celdas por segundo y la picada no funcionaba ahí: 152 m de agua tomaban 14 segundos.

- **Con ↓, bajo el agua los rotorcitos empujan hacia abajo** y se cruza a la misma velocidad que en el aire. Los mismos 152 m toman 0.7 s viniendo en picada.
- **Sin tocar nada**, el agua sigue sosteniendo a la maquinita como antes (se flota), solo que ahora frena suave en vez de en seco.
- **Bajo el agua no hay golpe de caída**: el agua amortigua.
- Se ven los rotorcitos y más burbujas mientras se baja así; las demás maquinitas también lo ven.

### 9.29 Las franjas de 3,333 m y 6,666 m

Dos franjas que cruzan el mundo de orilla a orilla (y empatan en la orilla, porque el mundo da la vuelta), para que se note por dónde se va pasando sin que ningún letrero lo diga. Primero se pusieron a 333 y 666 m; Ricardo pidió moverlas a 3,333 y 6,666 m.

| Profundidad | Qué hay | Valor de la franja |
|---|---|---|
| **3,333 m** (filas 1665 a 1667) | En la fila del centro, tres de **ónix**, tres de **topacio**, tres de **jade imperial** y una celda de tierra, repetido ocho veces. Arriba y abajo, una piedra sobre cada celda de tierra | $216 M |
| **6,666 m** (filas 3332 a 3334) | Una trenza de **amatista**, **tanzanita** y **alejandrita** que sube y baja entre tres filas, con piedras en los huecos de la trenza | $832 M |

- **Minerales del lugar:** ónix, topacio y jade son los tres de las Cavernas; amatista, tanzanita y alejandrita, los tres de la Cristalera.
- **Marco:** dos filas de pura tierra arriba y dos abajo de cada franja, para que resalte entre el mineral al azar.
- **Las piedras no cierran el paso:** siempre queda tierra entre una y otra.
- **En todos los mundos**, también los ya creados: `franjas()` se aplica al cargar el terreno, siempre igual. Lo que ya estaba cavado no se toca. Es la única excepción a «el terreno de un mundo creado no se mueve» (9.21), hecha a pedido de Ricardo.
- **A 333 y 666 m** el terreno volvió a ser el de siempre. Solo los mundos creados o remineralizados durante la hora en que estuvieron ahí las conservan, porque nacieron con ellas.

### 9.30 Subir sola, también desde abajo

«Subir sola» (la maquinita sigue subiendo sin sostener la tecla) solo funcionaba pasando los 50 m de altura. Ahora funciona en cualquier parte, también dentro de un tiro a kilómetros de profundidad.

- **Cómo se activa:** dos toques seguidos a **↑**, o la barra espaciadora.
- **Hasta dónde sube:** hasta que topa con techo (se suelta sola tras medio segundo sin avanzar). Si no hay techo, sigue hasta el espacio.
- **Cómo se suelta:** con **↓** o con la barra espaciadora. También se suelta sola si el combustible baja del 12 %.
- Mientras sube se puede dirigir con ← →.
- Para bajar no hay equivalente: hay que sostener ↓, a propósito.

### 9.31 El gran final: todos los minerales caen

Tres cosas más para el cierre, pedidas por Ricardo al llegar él mismo a la última celda.

**Más luz.** En el jardín, la oscuridad de la profundidad se va quitando conforme se descubre: con el 70 % a la vista ya no hay sombra, y el cuadro se ve con sus colores.

**Flechas a las últimas celdas.** Cuando faltan 33 celdas o menos, cada una que no está en pantalla se señala con una flecha amarilla en la orilla y los metros que hay hasta ella. Las que están en pantalla ya traían su aro. El Corazón de la Tierra cuenta como celda del jardín y se quita con el taladro (los explosivos no lo tocan). Cuelga en medio de su caverna, sin piso a un lado, así que antes solo se alcanzaba parándose encima: era la celda que Ricardo no encontraba. Ahora, cuando faltan 33 o menos, esas celdas se quitan de cualquier lado, también volando y hacia arriba, con solo empujar contra ellas; una tarjeta lo explica.

**El final, rehecho a pedido de Ricardo (9.32).** La lluvia de minerales original (todo para quien quitaba la última piedra, 16 segundos) se reemplazó por el final de abajo.

### 9.32 El final: la unión, el reparto y el camino de luz

**El Corazón es lo último.** No se puede explotar ni perforar de lado. Se abre solo cuando todo lo demás del jardín ya está a la vista, y solo desde arriba: hay que pararse encima y perforar hacia abajo. Para Ricardo simboliza la unión con el Corazón. Cuando solo falta él, una tarjeta lo dice.

**Tres tiempos** (todas las maquinitas conectadas los viven juntas, cada quien en su pantalla):

1. **La unión** (6 s). Cada maquinita conectada baja volando hasta su retrato junto a la mesa (el retrato la espera, transparente) y se une con él: destello y campana.
2. **El torbellino** (33 s; antes era una lluvia de 4 minutos, ver 9.40). Todos los minerales que quedaban en el mundo entero bajan a la vez y se arremolinan en un tornado rapidísimo sobre cada maquinita, hasta entrar en ella. La cartera de cada una sube a la vista durante esos 33 s. Abajo al centro corre la cuenta regresiva.
3. **El camino de luz.** En fila, una cada 2.4 s (con mucha gente la fila se aprieta para que la última arranque a más tardar 10 s después de la primera), cada maquinita baja al lago y sube por los peldaños de luz que deja el sol en el agua; mientras sube se hace chica y transparente, con una frase de piano ascendente, y al final desaparece con una campana. Después sale el jardín entero a pantalla completa y cada quien vuelve a empezar en la superficie.

Los retratos de la mesa ya no se pintan después: las maquinitas se fueron.

**El reparto, en partes iguales.** El mundo (no el navegador) hace la cuenta: el valor de todos los minerales que quedaban se divide entre todas las maquinitas registradas en el mundo en ese momento. Las conectadas lo reciben durante la lluvia; las que no estaban, al volver a entrar, con una tarjeta que explica quién perforó el Corazón y cuánto le tocó. Cada maquinita cobra una sola vez por cierre. Además sigue el regalo de $1,000 M por completar el jardín, una vez por mundo.

**El mundo queda de pura tierra.** Los tesoros, los huesos y la colección siguen donde estaban. Para que vuelva a haber mineral, la Remineralizadora.

**Mientras dura el final** la maquinita no se mueve (la lleva el final); el chat y el menú sí funcionan. Dura unos 54 s con una maquinita, y como mucho 10 s más con muchas.

**Piezas.** Juego: `contarMinerales`, `vaciarMinerales`, `finDelMundo(quien, fin)`, `posCeremonia`, `pasoCeremonia`, `dibujarCeremonia`, `lluviaDeMinerales` (destinos por maquinita), `CER` (tiempos), regla del Corazón en `perforar`. Mundo: mensaje `fin` con `{ i, r, n, total, parte }`, guardado en `m.fin` y enviado en el saludo.

**Probado en local** con dos maquinitas (una real y una simulada): reparto calculado por el mundo, unión, lluvia, camino de luz en fila, regreso a la superficie y retratos borrados. **Sin probar:** con varias personas reales a la vez, y el cobro al volver de quien no estaba.

### 9.33 Mirar o jugar: el público, las solicitudes y sacar a alguien

**Topes.** Juegan hasta 40 maquinitas a la vez (100 registradas por mundo). Mirando: sin tope (antes 30).

**Quien mira** (liga `/ver/…`, desde el Top 33 o la que manda un jugador):

- Arriba tiene una fila con las maquinitas que están jugando, cada una con su color: **un clic** y la vista se va con ella, como seleccionar una base en StarCraft. También un clic sobre la maquinita en el mundo, o ← →.
- Abajo ve **el teclado de esa maquinita**: se encienden las teclas que va apretando (flechas, barra y las letras R N D P Q T C S A G M). Las teclas viajan con la posición (2 bytes más; el servidor acepta el paquete viejo y el nuevo).
- **Pedir jugar aquí** (tecla **J**, un clic): manda una solicitud con la maquinita de su equipo (o con una nueva, ya bautizada). Ve el estado: esperando, «quien creó el mundo no está conectado», aceptado o rechazado. Si lo aceptan, entra a jugar solo.

**Quien creó el mundo:**

- Le llegan los avisos: «Lupita empezó a mirar tu mundo» (solo aviso) y «Lupita quiere jugar en tu mundo · pulsa J» (eso sí lo decide).
- **Tecla J** (o clic en el renglón «🙋 1 quiere jugar» de la lista de arriba, o Menú → Mundo → Público y solicitudes) abre el panel: quién quiere jugar (Aceptar / Rechazar; **Enter** acepta la primera), quién juega y quién mira (**Sacar**, un clic), y la lista de sacados (**Perdonar**).
- **Sacar** saca al instante y no deja volver: a una maquinita por su llave, y a quien mira por una huella de su dirección de internet (nunca se guarda la dirección). Una maquinita sacada aparece como «fue sacada del mundo».

**Decisiones.**

- **La liga del mundo sigue siendo una invitación:** quien entra con ella juega sin pedir permiso, porque se la mandó quien ya juega ahí. Lo que necesita aceptación es entrar a jugar desde la vista de observador, que es pública.
- **Puerta cerrada:** si el mundo tiene la puerta cerrada, quien llega con la liga ya no ve «cerró la puerta»: entra a mirar y su solicitud sale sola.
- **La dirección de internet solo frena a quien llega nuevo.** En una casa o en una red de celular varias personas comparten dirección; por eso no saca a las maquinitas que ya juegan en el mundo, ni a quien aceptaste.
- **Si el mundo no tiene dueño registrado** (mundos muy viejos), las solicitudes se aceptan solas.

**Piezas.** Mundo: etiqueta `ip:` en cada socket, `huellaIp`, `baneado`, `avisarDueno` (mensaje `publico`), `pedir`, `ordenDueno` (`acepto`, `rechazo`, `sacar`, `perdonar`), `m.ok` (aceptados), `m.ban`. Juego: `mascaraTeclas`, `pintarTecladoVer`, `pedirJugar`, `recibirPublico`, `htmlPublico`, menú `pub`, `#verQuien`, `#verTeclado`, `#verPedir`.

**Probado en local:** pedir, aceptar, rechazar, sacar a quien mira y que no pueda volver, sacar a una maquinita mientras juega y que no pueda volver, perdonar, que el dueño no quede sacado aunque comparta dirección, y las teclas de tres jugadores simulados en el teclado de quien mira.

### 9.34 La liga del mundo, más corta

La liga de un mundo pasa de `mina.capitaltorreon.com/m/QSAHAZ3F` a **`mina.capitaltorreon.com/QSAHAZ3F`**: el dominio y las 8 letras.

- **Todo lo que genera ligas** usa la forma nueva: Invitar, el código QR (al ser más corta, el QR queda más simple), «Copiar mi liga», la liga de la maquinita, Compartir, la foto para presumir y la vista previa de WhatsApp (`og:url`).
- **Las ligas de antes siguen sirviendo:** quien abra una con `/m/` entra igual, y la dirección se acomoda sola a la forma nueva. También funciona escrita en minúsculas.
- **El Worker atiende ahora todas las rutas** (`run_worker_first: true`) para poder poner la vista previa de cada mundo en la ruta corta; lo que no es un mundo se sirve como antes.

### 9.35 Pedir jugar: entrar mirando de inmediato y jugar en cuanto te aceptan

**Lo que vive quien pide jugar.**

1. **Entra de inmediato a mirar.** Desde el Top 33 hay ahora dos botones por jugador en vivo: «👁 Ver» y «🙋 Jugar». «Jugar» abre la vista de observador y manda la solicitud sola. También con **J** desde la vista de observador, o llegando con la liga a un mundo con la puerta cerrada.
2. **Una tarjeta clara abajo**, con su maquinita, dice en qué va:
   - «Ya le avisamos a Ricardo que quieres jugar» + «Mientras decide, mira la partida… En cuanto diga que sí, entras solo con La Chispa, sin recargar nada», con un reloj de cuánto lleva esperando.
   - Si el dueño no está conectado: «Tu solicitud está lista. Ricardo no está conectado ahora; en cuanto entre le llega». Cuando el dueño entra, la tarjeta cambia sola.
   - «Ya no» (o Esc) cancela la solicitud.
   - Rechazado: «Esta vez no te aceptaron», con «Pedir otra vez».
3. **Al aceptarlo, pasa a jugar sin recargar la página:** la tarjeta se pone verde («¡Ricardo te aceptó! Entrando a jugar con La Chispa…»), se cierra la conexión de observador y entra al mismo mundo con su maquinita. El terreno ya estaba cargado, así que es instantáneo. Aparece en la superficie con una tarjeta de bienvenida, y en «Mis mundos» queda apuntado ese mundo.

**Robustez.** Si la conexión de quien espera se cae y vuelve, la solicitud se manda otra vez sola; si mientras tanto ya lo habían aceptado, el mundo lo deja pasar de inmediato (la aceptación queda guardada en el mundo, `m.ok`). Esto se encontró probando: con la pestaña en segundo plano, el navegador puede reconectar y la aceptación se perdía.

**Para el dueño:** si tiene la pestaña de Mina escondida, el título cambia a «🙋 (1) quiere jugar · Mina» para que lo note.

**Piezas.** Juego: `pasarAJugar`, `pintarEspera`, `yaNoPido`, `#verEspera`. Mundo: `avisarPidiendo` (al entrar y al salir quien creó el mundo).

**Probado en local** con un dueño simulado: entra a mirar, «no está conectado», el dueño entra (la tarjeta cambia), acepta, y la pestaña pasa a jugar con su maquinita sin recargar.

### 9.36 Limpieza: una sola imagen en Invitar, sin contratos y con números legibles

- **Invitar** enseña una sola vista previa (la del mundo), debajo del código QR y los botones. La de la maquinita sigue existiendo para su liga, solo ya no se muestra ahí.
- **Las imágenes de liga ya no enciman textos:** cada cifra se achica lo necesario para caber en su columna; el botón de abajo y la dirección del sitio solo se ponen si caben completos (si no, queda nada más el dominio). El llamado de la liga de la maquinita se acortó a «¿Me alcanzas?».
- **Fuera «🏆 Lugar 1 del mundo»** de la lista de jugadores de arriba a la derecha (Ricardo: «es mucho ego, no agrega valor»). El lugar sigue en el Top 33 y en la tarjeta que avisa cuando subes.
- **Objetos de abajo más compactos:** la letra amarilla arriba, el emoji y la cantidad debajo, uno sobre otro; el nombre queda en el letrero al pasar el ratón.
- **Fuera los contratos** (la pestaña, el renglón de abajo a la izquierda y sus pagos). `evento()` y `surtirContratos()` quedan vacías.
- **El icono del menú** (tres rayas) se dibuja con CSS y queda centrado con el título.
- **Números con comas** en Estadísticas (10,000 m · 2,889 piezas · 1,859 explosivos…), en la profundidad de la esquina, en los récords de la lista de jugadores y en Mundo.

### 9.37 El manifiesto

Menú → **Manifiesto** (la última pestaña): una carta de Ricardo, escrita a partir de su dictado y ajustada en su voz. Dice de dónde nació el juego (*Motherload*, que jugó de niño durante decenas de horas), qué se propuso (quedarse con lo bueno, multiplicarlo y darle sentido e historia), que aquí se juega acompañado, que hasta el fondo hay algo esperando, y que ojalá sea un regalo.

Firma: **Ing. Ricardo López Reyero** · Torreón, Coahuila, México · 2 de octubre de 2026 · 8:12 p. m. · 21 °C.

El nombre lleva a **ricardolopezreyero.com** (en otra pestaña, para no perder la partida), pero se ve exactamente igual que el resto del texto: mismo color, sin subrayado y sin la manita al pasar el ratón.

El README abre con un resumen del manifiesto.

### 9.38 El mapa: solo lo descubierto, todos en vivo, y un mapa de un lado como el chat

**Lo que pidió Ricardo (ordenado).**

1. En el mapa se ve **en vivo** dónde está cada jugador.
2. Un **mapa de un lado**, que se abre de izquierda a derecha igual que el chat: si el chat está abierto, el mapa sale encima; si no, sale solo.
3. **Solo se ve lo descubierto**; todo lo demás queda como «no descubierto».
4. **Sin nombres encima del mapa**, porque estorban la vista; los nombres van al lado.
5. Mejorar los dos mapas: el del menú y el de un lado.

**Cómo quedó.**

- **Una sola imagen del mundo** (96 × 5,000, un píxel por celda) para los dos mapas. Se ve lo cavado, lo que alcanzó a ver la lámpara alrededor (2 celdas), los lugares ya descubiertos completos (el lago del Acuífero, la Gruta, la Ciudad…) y la superficie. Lo demás va en un tono oscuro con un tramado suave: no descubierto. Los minerales que ya se vieron aparecen con su color. La imagen se rehace cuando cambia el terreno, a lo mucho cada segundo y medio (unos 22 ms).
- **Cada maquinita en vivo**, con su color del chat; la tuya en amarillo con un pulso. Si una queda fuera de la ventana, una flechita en la orilla dice hacia dónde está.
- **El mapa de un lado (tecla M o el botón 🗺️ Mapa):**
  - Arriba, quién está jugando y a qué profundidad («Don Pepita · 1,201 m»). Un clic en un nombre lleva el mapa hasta esa maquinita; «◎ Volver a mí» lo regresa.
  - A la izquierda, una tira con el mundo entero, la marca de cada quien y un rectángulo con la zona que estás viendo; un clic en la tira lleva ahí.
  - Al centro, la zona alrededor de tu maquinita (o de la que estés mirando, si eres observador). Te sigue sola; la rueda del ratón la recorre.
  - Los lugares descubiertos aparecen solo con su icono, sin nombre.
  - Se cierra con M o Esc. El tablero de la izquierda se recorre para no quedar tapado, igual que con el chat.
- **El mapa del menú:** el mundo completo con la misma imagen, ahora un píxel por fila (antes medio: se perdían túneles), las maquinitas en vivo, y a la derecha, fuera del mapa, la profundidad y los nombres de los lugares descubiertos («❔ sin descubrir» los demás).

**Teclas.** **M** pasa a ser el mapa (la tecla que se espera en un juego) y el menú se abre con **Esc**. El botón del menú dice «Esc · Menú».

### 9.39 Entrar con Google: una maquinita y todos los mundos que quieras

**Lo que pidió Ricardo (ordenado).**

1. Traer el login de Google del proyecto de ping pong, que es muy sencillo.
2. Que jugar siga sin pedir login: quien entra al inicio ya está jugando en el menor tiempo posible.
3. Cuando quieras guardar tu mundo y tu maquinita, ahí te pide entrar con Google para ligar tu correo.
4. Con cuenta: **una sola maquinita** y **todos los mundos que quieras**, y la gente puede entrar a ellos.
5. Si ya aceptaste a alguien en un mundo, queda aceptado: aunque vuelva en un mes, entra y juega sin volver a pedirlo. Los permisos duran hasta que el dueño los quita.
6. No tocar nada de lo que ya funciona; solo agregar esto.

**Cómo quedó.**

- **El inicio no cambió.** Sin login se juega igual que antes, al instante. El botón de Google ni siquiera se carga hasta que se va a usar.
- **Dónde se entra:** Menú → Mundo (la primera tarjeta, «Guarda tu maquinita y tus mundos») y la pantalla de Mis mundos. Es el botón oficial de Google, con el mismo identificador de app que el ping pong.
- **Una sola invitación**: a los 10 minutos de juego real aparece una vez una tarjeta que sugiere guardar con Google. No vuelve a salir.
- **La primera vez que entras**, tu cuenta se queda con la maquinita de ese equipo y con todos sus mundos.
- **En otro equipo**, al entrar, ese equipo pasa a jugar con la maquinita de tu cuenta y ves todos tus mundos.
  - Si la maquinita de ese equipo apenas nació (sin dinero y menos de 5 minutos de juego), se cambia sola.
  - Si ya traía avance, se te pregunta con cuál sigues. Se enseñan las dos con su dinero, su récord y su tiempo jugado. Cada cuenta lleva una sola.
- **Tus mundos viajan con la cuenta**, junto con las llaves de dueño de los que creaste. Así, en cualquier equipo sigues siendo quien manda en ellos.
  - Desechar un mundo lo quita en todos tus equipos.
  - Si vuelves a entrar a ese mundo después, regresa a la lista.
- **Cerrar sesión** (en la misma tarjeta): tu maquinita y tus mundos quedan guardados en la cuenta y ese equipo empieza de cero. Sirve para una computadora prestada.
- **Los permisos ya duraban para siempre**: una maquinita que jugó en un mundo, o a la que aceptaron, entra cuando quiera. Con la cuenta, eso te sigue a cualquier equipo, porque es la misma maquinita.
- **Nuevo: quitar el permiso.** En el panel de la dueña (tecla **J**):
  - «Quitar permiso» junto a quien está jugando.
  - Una lista **🔑 Tienen permiso** con quienes ya jugaron ahí. Si son más de 6, se pliega.
  - Una lista **🔒 Sin permiso** con «Devolver permiso».
  - A quien le quitas el permiso sale del mundo y ve «Ya no tienes permiso en este mundo», con un botón para mirar y volver a pedirlo.
  - «Sacar» sigue igual: saca y no deja ni mirar.

**Cómo está amarrado.**

- **Un Durable Object nuevo, `Cuenta`**, uno por persona, nombrado por su identificador de Google (migración v4; los otros tres no se tocaron). Guarda:
  - el correo, el nombre y la foto;
  - la llave de su única maquinita;
  - sus mundos, con las llaves de dueño;
  - los mundos desechados, para que no revivan;
  - las sesiones de cada equipo, solo como huella.
- **El servidor no le cree al navegador**: le pregunta a Google (`oauth2.googleapis.com/tokeninfo`), igual que el ping pong. Revisa:
  - que el pase sea para la app de Mina;
  - que lo haya emitido Google;
  - que siga vigente;
  - que el correo esté confirmado.
- **Rutas:**
  - `GET /api/cuenta/cliente`: el identificador de Google.
  - `POST /api/cuenta/google`: entrar.
  - `POST /api/cuenta/sync`: ponerse al corriente.
  - `POST /api/cuenta/maquina`: elegir la maquinita de este equipo.
  - `POST /api/cuenta/salir`: cerrar sesión.
- **La sesión de cada equipo** se guarda en ese equipo (`mina_cuenta`). Hay hasta 20 por cuenta.
- **Ponerse al corriente:** cada cambio a la lista de mundos se manda a los 2.5 s. Al abrir el juego se pide lo de la cuenta sin estorbar el arranque.
- **El permiso** vive en el mundo: `m.ok` (aceptados) y `m.rev` (a quienes se lo quitaron). Una maquinita en `m.rev` no entra a jugar aunque la puerta esté abierta. Antes de revisarla no se mueve de mundo.
- **El identificador de Google** está en `wrangler.jsonc` (`GOOGLE_CLIENT_ID`). Si algún día se usa uno propio de Mina, se cambia solo ahí.

**Probado.**

- **En local:** 27 pruebas automáticas, todas bien. Se probó entrar desde dos equipos con la misma cuenta, juntar y desechar mundos, que no revivan, elegir maquinita, cerrar sesión, y quitar, pedir, aceptar y devolver permisos.
  - En la computadora de pruebas sirve un pase falso. Solo funciona con `MINA_PRUEBA` en `.dev.vars`, que nunca se publica, y desde la misma máquina.
  - En el navegador local se probaron el login simulado, el cambio de equipo, la pantalla para elegir maquinita, cerrar sesión y el panel de permisos. La tarjeta se revisó también a ancho de teléfono.
- **En vivo:** 12 pruebas en un mundo desechable, ya borrado. El pase falso no sirve, los pases y sesiones inventados se rechazan, y quitar, pedir, aceptar y conservar permisos funciona. El botón de Google carga en Mis mundos.

**Lo que no pude probar.** No pude entrar con una cuenta real de Google: el navegador de pruebas bloquea la ventana de Google cuando la abro yo. Puede que el identificador del ping pong todavía no tenga autorizado el dominio de Mina. En ese caso, en Google Cloud Console → Credenciales → ese cliente de OAuth → «Orígenes autorizados de JavaScript» hay que agregar `https://mina.capitaltorreon.com`.

**De paso.** En pantallas angostas, la liga de «Invita a tu gente» se encimaba con su botón. Ahora las ligas largas parten renglón.

### 9.40 El final, mucho más rápido: un torbellino de 33 segundos

**Lo que pidió Ricardo.** El final era demasiado lento: 4 minutos de lluvia. Quiere que en 33 segundos bajen todos los minerales del mapa al mismo tiempo, en un torbellino rapidísimo que se va a cada uno de los jugadores, y que luego sigan con el camino.

**Cómo quedó.**

- **33 segundos** (`CER.lluvia = 33`). El final completo pasó de más de 4 minutos y medio a unos 54 segundos con una maquinita.
- **Todo baja a la vez.** En los primeros 2.5 s nacen piezas de golpe por todos lados: desde arriba de la pantalla y desde las dos orillas. Luego siguen llegando hasta 4 s antes del final, para que todas entren a tiempo.
- **Un tornado sobre cada maquinita.**
  - Cada pieza entra a un embudo que es ancho arriba y tiene la punta en la maquinita.
  - Gira cada vez más rápido mientras el embudo se cierra: de 7 a 29 vueltas en radianes por segundo, unas 4.6 vueltas por segundo al final.
  - Todas giran hacia el mismo lado, como un solo remolino, y el embudo se mece un poco.
  - Encima se ven unos anillos de aire girando, y cada maquinita brilla mientras recibe.
  - Con varias maquinitas, las piezas se reparten por turno entre ellas.
- **Viento**: un silbido que sube y otro que baja al arrancar el torbellino. Las monedas suenan mientras las piezas entran.
- **En pantalla** van hasta 1,600 piezas a la vez. Con «Partículas: pocas» son 700 y con «ninguna», 300.
- **El camino de luz** arranca 1 s después. Con mucha gente, la fila se aprieta: la última maquinita sale a más tardar 10 s después de la primera (antes eran 2.4 s por cada una, hasta 94 s con 40).
- La tarjeta de la unión dice ahora que los minerales «bajan ahora mismo en un torbellino de 33 segundos».

**Probado.** En local, avanzando el reloj del juego a mano, con 3 maquinitas:
- el torbellino termina a los 33 s sin piezas sueltas;
- el camino de luz sigue, y todo el final cierra a los 54 s;
- cada cuadro tarda en promedio 1.5 ms con 1,500 piezas en pantalla.

No se pudo ver el movimiento en vivo porque el navegador de pruebas está oculto y no dibuja cuadros solo.

### 9.41 El celular, pensado desde el dedo

**Lo que dijo Ricardo (3 de octubre).** En computadora todo funciona perfecto, pero en celular no le gustó nada: todo chiquito, sin zoom con uno o dos dedos, controles muy sensibles (lo mató tres veces rápido porque vuela, cae y se estrella), tableros encimados. Pidió repensar el juego para celular desde el origen, en el mismo archivo: dimensiones, controles y acomodo. «Busca mejorar la usabilidad».

**Qué es «celular».** Pantalla táctil con lado corto de hasta 820 px (teléfonos y tabletas chicas): `body.movil`. Las tabletas grandes usan el tablero de computadora, con el dedo. Toda pantalla táctil lleva `body.tactil`: desaparecen las letras de teclado y las pistas de teclas en botones, menús, chat y mapa. Se decide en `medirMovil()` (al abrir, al cambiar de tamaño y al primer toque).

**Dimensiones.** En el celular manda el lado corto de la pantalla: caben 9, 12 o 16 celdas a lo ancho según Acercamiento (antes se dividía el ancho entre 26, 32 o 40: en un teléfono salían celdas de 12 px). En un iPhone normal la celda mide unos 31 px y se ven 12 columnas por 26 filas: se ve lo que hay abajo al bajar.

**La pinza.** Dos dedos acercan o alejan la vista de forma continua (de 0.6× a 2.2× sobre el acercamiento elegido), y arrastrando con los dos se recorre el mundo (vista libre, con la regla de profundidad). Al soltar queda guardado (`op.lupa`); cambiar el Acercamiento en Opciones lo regresa a 1×. Con dos dedos la palanca se suelta sola.

**La palanca, menos sensible.** Sigue apareciendo donde se pone el dedo, pero más grande (136 px, recorrido de 52 px) y con zona muerta de 20 px (antes 14). Y la regla nueva: **un solo eje a la vez, el que más se empuja.** Para cambiar de eje hay que empujar claramente hacia el otro (1.35 veces más). Así, caminar de lado ya no despega sin querer, que era lo que lo mataba. Volando (eje vertical hacia arriba) sí se puede ir en diagonal. Hacia abajo solo perfora, sin lados.

**Aterrizaje suave.** Cuando la maquinita viene cayendo sin tocar nada y el piso está cerca, los rotorcitos frenan solos para llegar sin golpe (`pisoAbajo`, hasta 16 celdas; frena cuando la distancia de frenado alcanza al piso, apuntando a una velocidad de llegada sin daño). Gasta combustible como volar; con sobrepeso frena lo que puede, igual que la hélice. Opción nueva en Opciones: «Aterrizaje suave»: Automático (sí con el dedo, no con teclado), Siempre, Nunca. Probado: caída de 14 celdas, 0 de daño con la ayuda y 6 sin ella.

**«⬆ Subir sola».** Botón abajo a la izquierda, solo en el celular, cuando está bajo tierra: la maquinita se queda subiendo sin sostener el dedo (lo que en teclado es doble ↑ o barra). Otro toque, o empujar hacia abajo, la suelta.

**El tablero del celular.** Las orillas para los tableros y el centro libre para la tierra; botones de 44 px o más; todo respeta las zonas seguras del teléfono (`env(safe-area-inset-*)`).
- Arriba a la izquierda: dos barras con icono (⛽ combustible, 🛡️ casco) y debajo la profundidad y el dinero. El velocímetro, más chico, abajo de eso.
- Arriba a la derecha: cuatro botones redondeados solo con icono: 🔊 💬 🗺️ ☰. El de sonido abre un panel con apagar, volumen y tipos de sonido. Invitar vive en el menú (Mundo) y en el panel de Invitar.
- Debajo de los botones solo se enlistan las otras maquinitas conectadas (hasta 3); la tuya ya está a la izquierda.
- Abajo a la izquierda: «⬆ Subir sola», la grúa y una píldora con el viaje: 📦 cuántas piezas, en cuánto se vende y, bajo tierra, si el combustible alcanza para subir. Un toque la despliega seis segundos; otro abre la bodega.
- Abajo a la derecha: los objetos en columna, solo los que traes, de 56 px, con la dinamita cerca del pulgar. Quien empieza no ve ninguno.
- Las tarjetas de aviso van arriba, a lo ancho; los avisos chicos, al centro abajo; las metas del tutorial, abajo a la izquierda.
- Acostado: los objetos en fila, las metas y tarjetas a la derecha.
- Los menús ocupan toda la pantalla, con botones de 40 px por lo menos y filas que parten renglón.
- Las pistas hablan de toques: «Toca para entrar a la Gasolinera», «un dedo vuelve a tu maquinita».

**Lo que no cambió.** En computadora todo sigue igual (`movil` falso): mismo tablero, mismos tamaños, mismas teclas. El aterrizaje suave está apagado ahí salvo que se pida.

**Probado.** En el navegador de pruebas emulando un iPhone (375 × 812, puntero grueso): tablero sin encimados ni desbordes, botones de 44 px, 12 columnas; palanca con toques simulados (zona muerta, derecha, diagonal que no despega, arriba, diagonal volando, abajo); pinza de 31 a 69 px por celda y vista libre; aterrizaje suave con y sin ayuda; «Subir sola» aparece bajo tierra y enciende el crucero; menú a pantalla completa con la opción nueva. Lo que no se pudo probar: un teléfono real en la mano (la sensación de la palanca, el peso del dedo sobre la maquinita, Safari con su barra). El trabajador de servicio sube a `mina-24` para que los teléfonos tomen la versión nueva.

### 9.42 Pulir el celular: alineaciones y suavidad

**Lo que pidió Ricardo.** Madurar cada píxel de la vista del celular: alineaciones, la apertura de los menús, el cambio de opciones; en celular todo debe sentirse suave y bien hecho.

**Recorrido.** Se revisó pantalla por pantalla con una maquinita recién nacida (como la ve quien entra por primera vez) y con una avanzada: tablero, tarjeta de bienvenida, Gasolinera, Taller, Almacén, Invitar, las pestañas del menú (Opciones, Mundo, Top 33, Estadísticas), el chat, el mapa de un lado, el panel de sonido y Mis mundos.

**Lo que se afinó.**
- **Arriba, todo a la misma altura:** las dos barras (22 px + 4 de aire) suman 48 px, igual que los cuatro botones, que crecieron a 48 px. Las orillas van todas a 8 px (tablero, tarjetas, metas, chat en vivo).
- **Los menús son una hoja que sube desde abajo**, con asa arriba: corta si el contenido es corto (Gasolinera, Báscula), completa si es largo (menú, Taller, Almacén, Top). Entra con un fundido y un deslizamiento de 0.22 s; se cierra igual (antes aparecían y desaparecían de golpe). **Tocar fuera de la hoja la cierra.** Las pantallas de inicio van completas y sin asa.
- **Cambiar de pestaña** hace entrar el contenido con un fundido corto; los repintados en vivo (mapa, cifras) no parpadean.
- **Cambiar el Acercamiento** ya no brinca: la vista se acerca o aleja en un cuarto de segundo (`animarLupa`). El tamaño del texto también cambia suave.
- **Los toques se sienten:** botones del tablero, objetos, Subir sola, grúa, píldora, pestañas y botones de menú se encogen un poco al pulsar.
- **La palanca** aparece y se va con un fundido; **el tablero** entra con un fundido al empezar; las tarjetas bajan desde arriba y los avisos suben desde abajo.
- **Filas de los menús:** en el Almacén y el Taller el texto ocupa el renglón completo y el precio con su botón van juntos abajo a la derecha (antes el texto quedaba en una columna angosta); en el Top 33 el nombre y el dinero caben en un renglón; en las opciones el selector se queda a la derecha y es el texto el que parte renglón; «tecla R» ya no se menciona con el dedo.
- **El panel de sonido** queda por encima de las tarjetas.
- La pinza responde cada 50 ms (antes 70).

**Probado** emulando un iPhone: todas las pantallas de arriba, en capturas. Sigue sin probarse en un teléfono real.

### 9.43 Con el dedo, las caídas no quitan casco

**Lo que dijo Ricardo (4 de octubre, con dos videos).** Mejoró mucho, pero el casco al inicio no aguanta nada y los controles siguen sensibles. Que los controles se queden como están, pero que en celular los golpes hacia abajo no quiten casco; o que la opción venga apagada y se pueda encender. En los videos se estrella a 4 m, a 28 m, al bajar de 151 m: con 10 de casco, una caída de 40 celdas quita 7.

**Cómo quedó.** `golpesDeCaida()`: con el dedo las caídas **no quitan casco** (solo se siente un temblor y un golpe sordo si fue de 5 celdas o más); con teclado siguen como siempre. Opción nueva en Opciones → «Golpes de caída»: Automático (no con el dedo, sí con teclado), Siempre, Nunca. El aterrizaje suave sigue encendido con el dedo (frena antes del piso, se ve y gasta combustible), pero ya no es lo que te salva. Los controles no se tocaron. La tarjeta de bienvenida y la Ayuda lo dicen.

**Probado** (física avanzada a mano, caída de 40 celdas): Automático con el dedo 0 de daño; Siempre 7; Nunca 0; con aterrizaje suave 0.

### 9.44 Amarrar con el dedo: dos empujones y sigue sola

**Lo que pidió Ricardo.** Traer al celular lo de la computadora: dar dos o tres veces hacia arriba y que quede «amarrada» subiendo; y lo mismo hacia abajo.

**Cómo quedó.** Dos empujones seguidos de la palanca en la misma dirección vertical (el segundo en menos de medio segundo después de soltar el primero, ya sea regresando al centro o levantando el dedo) amarran: hacia arriba sube sola (el mismo crucero del doble ↑ del teclado, que se detiene solo al topar techo o con poco combustible); hacia abajo perfora sola hacia abajo (`amarreAba`), hasta que se toca la pantalla, se empuja hacia arriba, se acaba el combustible o se llega al fondo. **Un toque en la pantalla suelta cualquiera de los dos.** Lo amarrado se suelta también al abrir un menú. La pista de abajo lo dice («Subiendo sola · un toque la suelta», «Perforando sola hacia abajo · un toque la suelta»). Un empujón lento (más de medio segundo entre uno y otro) no amarra. El botón «⬆ Subir sola» sigue ahí. `vigilarAmarre()`, `amarrar(d)`.

**Probado** con toques simulados: amarra arriba y abajo, se mantiene al soltar el dedo, un toque suelta, lo lento no amarra; con la física avanzada a mano, perfora sola 20 celdas y luego sube sola.

### 9.45 Al terminar el mundo: volver a arrancar

**Lo que pidió Ricardo.** Cuando ya terminaste el juego, un botón para volver a arrancar o reiniciar el mundo que te ponga arriba, con dos opciones: desde cero o manteniendo las mejoras.

**Cómo quedó.** Al cerrar el jardín entero (después de la ceremonia) sale la pantalla «🌅 Terminaste este mundo» con tres caminos: **Mundo nuevo con mis mejoras** (semilla nueva; la maquinita entra como está: dinero, equipo y objetos), **Mundo nuevo desde cero** (semilla nueva y maquinita de fábrica: $20, equipo básico, sin objetos; se quedan logros, tiempo jugado, récord y estadísticas; pide confirmar) y **Seguir en este mundo**. Mientras el mundo esté terminado, la misma pantalla está en Menú → Mundo («🔄 Volver a arrancar»). El estado nuevo lleva la versión siguiente (`S.v + 1`) para que el servidor lo acepte. `pantallaReinicio`, `nuevoMundoTras(desdeCero)`, `reinicioPend`.

**Probado** en local: desde cero deja $20, equipo 000000 y versión 559 (venía de 557), crea un mundo nuevo y pone la maquinita en la superficie; el tiempo jugado se conserva.

### 9.46 El login pasa a login.capitaltorreon.com

**Lo que pidió Ricardo.** Un solo login para todos los servicios de CapitalTorreon, sin agregar un origen autorizado en Google por cada microservicio.

**Cómo quedó.** Existe `login.capitaltorreon.com` (repo `login-capitaltorreon`): Google solo autoriza ese origen. Mina ya no carga el botón de Google: el botón «Entrar con Google» manda a `login.capitaltorreon.com/?volver=<esta página>`; se vuelve con `#sesion=<pase>` (un JWT ES256 de 30 días) y el juego lo manda a `/api/cuenta/google` como `credential`. El mundo lo verifica solo con la llave pública del login (`src/verificar.js`), sin llamar a nadie; si no es un pase de la casa, sigue el camino viejo (tokeninfo). Probado de punta a punta en vivo con la cuenta de Ricardo: entra, vuelve a Mis mundos con «Guardado en tu cuenta».

### 9.47 La Pinturería: monetización ética (ver `docs/ADN_Monetizacion_Mina_v1_2026-10-04_1130.md`)

**Lo que pidió Ricardo.** Monetizar de forma ética, hermosa y que agregue valor: personalización de la maquinita con dinero real, unos diez escalones de precio, que la monetización se adapte a cada persona sin empujar, nada de anuncios, que quede en el ADN del juego. «Puedes jugar increíble por años sin pagar un peso».

**El razonamiento** está completo en el documento del ADN: por qué no se hacen precios distintos por persona (mundo compartido, confianza, leer sin permiso) y cómo se logra lo mismo con una escalera pública de 10 niveles, el rango que la persona elige a la vista, probarse todo gratis, tres invitaciones en la vida de una maquinita, el Fondo común y pruebas solo de presentación, nunca de precio.

**Cómo quedó.**
- **La Pinturería** es una camioneta rosa en la superficie (x = 33, a la izquierda de la Gasolinera), con letrero como los demás edificios. Se entra como a cualquier edificio y también desde Menú → Mundo → «Pintar mi maquinita».
- **La escalera:** 10 niveles ($19 → $9,999 MXN), cada uno incluye los de abajo; subir cuesta la diferencia. Única fuente: `src/tienda.js` (el juego la pide con `POST /api/tienda`). Aparte: ✦ Mecenas (desde $99, solo da el ✦), Fondo común ($19 por maquinita nueva) y regalar un nivel a alguien del mundo.
- **La pintura** (`miPinta`, `o.p`): `c1 c2 c3` colores, `calca` (48 emojis), `luz` (faro y luz de piso), `estela` (5), `bocina` (6 melodías, tecla **B**; todos tienen el pip-pip), `placa` (dorada, corona, marco), `carro` (Escarabajo, Locomotora, Submarino), `mascota` (pájaro, perro, dron, mariposa, luciérnaga). Se dibuja en `dibMaq(…, pinta)`; la estela en `estela()`; el claxon en `claxon()`.
- **El servidor manda:** la pintura vive en la `Maquina` (`m.pinta`) y la valida `filtrarPinta(p, nivel)`; lo comprado en `m.tienda = { nivel, mecenas, compras[] }`; el mundo la reparte en `publico()` y en el mensaje `pinta`. Probado: una maquinita sin nivel que manda colores recibe `{}` de vuelta.
- **Pagos:** `POST /api/tienda/pagar` (requiere la sesión de la cuenta y que la maquinita sea la de esa cuenta) crea una sesión de Stripe Checkout con el precio del servidor; al volver con `?compra=<sesión>`, `POST /api/tienda/confirmar` le pregunta a Stripe y entrega una sola vez por sesión. Tope de cuidado $5,000 por maquinita cada 30 días. La llave `STRIPE_SECRET_KEY` se liga desde la bóveda (Secrets Store). Sin llave: la tienda deja probar todo y dice «los pagos se abren pronto». En local, `POST /api/tienda/prueba` (solo con `MINA_PRUEBA`) entrega niveles sin pagar para probar.
- **Las piedras con nombre** (nivel 9): al terminar un mundo, los nombres de quienes tienen nivel 9 se guardan en `m.piedras` y se dibujan a la orilla izquierda del lago del Jardín.
- **Invitaciones:** `invitarPintureria()`, tres en la vida de la maquinita (20 min, 3 h, 10 h de juego), solo en la superficie, nunca si ya abrió la tienda. El Manifiesto trae la sección «Cómo se sostiene Mina».

### 9.48 El pleito, delicioso: las dos vidas a la vista y todo el salón se entera

**Lo que pidió Ricardo.** Que la batalla entre mineros sea lo más deliciosa y bonita posible, con todos los efectos cuidados; que de verdad se vayan a pelear y se peleen cómodamente; que se vea de los dos lados cuánta vida les queda; y que, si hay gente en el salón o mirando, salga un aviso de que empezó un pleito para irse a verlo.

**Cómo quedó.**
- **El pleito existe como tal en el mundo.** Al primer golpe entre dos, el servidor manda `pleito { a, b, x, y }` a todos (también a quien mira); al perder uno, `pleitoFin { g, p }`. Cada maquinita en pleito manda `vida { v, mx }` (a lo mucho cada 120 ms) y el mundo la reparte.
- **Las dos vidas a la vista, para los dos:** la barra `#pleito` arriba al centro, con los dos nombres, las dos vidas con números, el ⚔️ latiendo en medio; la barra que recibe el golpe tiembla y cambia de color (verde, amarillo, rojo parpadeante). Entra con animación y se va a los 6 s sin golpes.
- **Sobre las maquinitas** se dibuja la vida de cada quien mientras dura el pleito: la ven los dos, los que pasan y quien mira.
- **Golpes más justos y más tensos:** cada golpe quita entre el 5 % y el 16 % del casco de quien lo recibe (el taladro sigue contando, pero ni un golpe decide ni el pleito se eterniza: 6 a 20 golpes, de 2 a 8 s). Más chispas y esquirlas de metal en los dos lados; a quien pega también le vibra un poco la pantalla.
- **Arranque con campana:** «⚔️ ¡Pleito!» flota sobre la maquinita, suena una campana grave y la pantalla tiembla.
- **El salón se entera:** a todos les llega una tarjeta «⚔️ ¡Pleito! X contra Y, a 1,200 m» y una nota en el chat. Los jugadores lo encuentran en el mapa (M): los que pelean llevan un aro rojo latiendo y un ⚔️. Quien mira recibe en su barra un botón rojo «⚔️ Ver el pleito: X contra Y» que lo lleva con uno de los dos, y ve la barra de las dos vidas. Al terminar, tarjeta y nota: «🏆 X ganó el pleito»; el que perdió «vuelve a la superficie con todo lo suyo».
- Perder sigue sin costar nada.

**Probado.** En local: con cuatro conexiones (quien pega, quien recibe, un tercero y un observador) llegan `pleito`, `golpe`, `vida` y `pleitoFin` a quien corresponde, el segundo golpe no vuelve a anunciar, y en el navegador la barra de arriba muestra las dos vidas y el daño entra con tope. No se pudo probar con dos personas reales peleando.

### 9.49 Capturas de pantalla guardadas en la cuenta, por mundo

**Lo que pidió Ricardo.** Un botón para capturar lo que se está viendo (la gente descubre cosas y quiere guardarlas); que las capturas se guarden en Cloudflare, anexadas a la cuenta, en una carpeta por mundo; que se avise que quedó guardada con un botón para ir a verla; que funcione igual en computadora, celular y iPad, y que desde cualquier equipo se vean las de todos los demás.

**Cómo quedó.**
- **Botón 📸 Foto** arriba (tecla **F**; en el celular, el icono). Destello blanco y clic de cámara. Se captura el lienzo del juego (sin tableros), a 1,600 px de ancho como mucho, JPEG al 86 %, con pie de foto: «Mina · nombre del mundo · profundidad · fecha y hora».
- **Con cuenta:** sube por `POST /api/capturas/subir` (cuerpo JPEG; cabeceras `x-sesion`, `x-mundo`, `x-metros`, `x-nombre`) a **R2** (`mina-capturas`, llave `cap/<cuenta>/<mundo>/<id>.jpg`) y la lista queda en la `Cuenta` (`c.capturas`, hasta 800: id, mundo, fecha, metros, peso, nombre del mundo). Tarjeta «📸 Captura guardada en tu cuenta» con el botón **«Ver mis capturas»**; si no se toca, se cierra sola.
- **Sin cuenta:** se descarga al equipo, con una tarjeta que invita a entrar con Google.
- **El historial:** Menú → **📸 Capturas**: carpetas por mundo (con su portada y cuántas hay), la galería de cada mundo, y cada captura en grande con Descargar y Borrar. Es la misma lista desde cualquier equipo porque vive en la cuenta. Las imágenes se sirven en `/capturas/<cuenta>/<mundo>/<id>.jpg` (liga impredecible, cacheable un año).
- Las tarjetas ahora aceptan un botón (`tarjeta(…, boton)`).

**Probado** en local: subir (240 KB, 1600 × 1200), listar, carpetas, galería, vista grande con pie, borrar; sin sesión responde 401; sin cuenta descarga.

### 9.50 Los objetos de La Pinturería, al máximo: piezas que dan gusto coleccionar

**Lo que pidió Ricardo.** Dedicarle trabajo de verdad a lo visual: que cada objeto comprable sea bonito, coleccionable, que la gente lo quiera y lo quiera acumular, y que comprarlo ponga a la persona un poco más contenta. Calidad máxima.

**Cómo quedó (todo dibujado por código, en `dibMaq`, `dibMascota` y `dibujarEstelas`).**
- **Pintura con laca:** cualquier maquinita pintada lleva un brillo diagonal y una franja de luz sobre el lomo, como laca recién puesta.
- **Carrocerías:** *El Escarabajo*, lomo de catarina con raya central, lunares con brillo y una defensa cromada con degradado de cromo. *La Locomotora*, caldera con bandas de latón y tapa, chimenea con copa que **humea** (tres bocanadas que suben y se desvanecen), campana de latón y quitapiedras al frente. *El Submarino*, remaches a lo largo, dos ojos de buey con aro de latón y vidrio con reflejo, periscopio con lente, aleta dorsal y una **hélice que gira**.
- **Mascotas, en vez de emojis:** un pájaro naranja de panza clara que **aletea** y se mece; un perro café que **corre** (patas alternadas, oreja caída, cola que se menea) al nivel del piso; un dron con dos rotores girando y una luz roja que parpadea; una mariposa con alas en degradado rosa-naranja-amarillo que **se abren y cierran**; una luciérnaga que **late** y deja chispitas detrás.
- **Estelas con figura propia:** chispas doradas con halo; cinta de arcoíris (segmentos que recorren el matiz); estrellas de cinco puntas blancas con borde dorado que giran; corazones con brillo; burbujas que suben con su reflejo. Sistema propio (`huellas`), hasta 240 a la vez.
- **Calcomanías troqueladas:** la calcomanía va sobre un cuadrito blanco con borde y sombra, un poco ladeado, como las de verdad.
- **Luces:** el faro echa un **haz hacia adelante** con degradado y un halo, además de la luz de piso.
- **Placas:** la dorada es texto con degradado de oro; la corona es una **corona dibujada** con tres joyas; el marco es una **placa de metal** con degradado y cuatro remaches, con el borde del color de la maquinita.

**Probado** en local con una hoja de muestra (cinco maquinitas con combinaciones distintas) y en vuelo con las tres estelas. No cuesta cuadros: todo son trazos, sin sombras difuminadas.

### 9.51 El motor de confort: el precio exacto de cada quien, sin cobrar nunca de más

**Lo que pidió Ricardo.** Un motor dinámico que decida el precio exacto para cada persona leyéndolo todo (tiempo de uso, velocidad, pericia, los primeros tres experimentos y los tres siguientes), que calibre hasta un punto cómodo y que ese punto se mueva con la economía que percibimos de la gente.

**La única regla fija: el motor solo baja.** Los precios de lista son públicos e iguales para todos; lo que cambia por persona es el descuento. Así nadie paga más que otro por lo mismo y la tienda puede decirlo con todas sus letras.

**Cómo quedó.**
- **Señales** (`senales` en `src/tienda.js`, de lo que la maquinita ya guarda): segundos jugados, récord de profundidad, dinero por segundo, días de vida, veces que abrió la tienda, compras y nivel.
- **Decisión** (`motorConfort`): nivel sugerido (uno a tres arriba del suyo) y descuento. Seis experimentos de siete días cada uno: lista, −20 %, −40 % y luego −50 %, −60 %, −60 % si no compra; si compra, el siguiente tanteo es diez puntos menos. A quien lleva menos de veinte minutos no se le experimenta. Tras el sexto se queda en su punto cómodo (último descuento con el que compró, o −60 %).
- **Economía percibida** (`Tabla.economia`): el promedio de descuento de las compras reales (con diez o más) menos diez puntos, entre 0 y 30 %, es el arranque de todos.
- **Dónde vive:** `Maquina.oferta` abre, vence y cierra experimentos (`t.exp`), `entregar` cierra el abierto como «comprado» y guarda `t.confort`; `/api/tienda` devuelve `oferta`; `/pagar` aplica el descuento solo a compras propias (regalos y Fondo a lista) y lo manda en el metadato de Stripe; `/confirmar` lo anota en la tabla mundial.
- **Lo que ve la persona:** «$2,000 de lista · 40 % menos, tu precio · vale hasta el 11 de octubre. Mina ajusta descuentos según cómo juega cada quien; nunca cobra más que el precio de lista».

**Probado** con ocho pruebas unitarias del motor y, en el servidor local con ganchos de prueba, la secuencia completa: lista → 20 % → 40 %, compra con 40 % → siguiente 30 % y nivel 10, oferta estable entre aperturas y con vencimiento a siete días; la tienda muestra el precio tachado y el personal. En vivo, `/api/tienda` ya devuelve `oferta`. Falta lo de siempre: una compra real para cerrar el ciclo con Stripe.

### 9.52 El momento: hora, festivos, cumpleaños, ánimo y quincena, en hora de Torreón

**Lo que pidió Ricardo.** Que el motor tome en cuenta también la hora del día, la madrugada, los festivos, el ánimo (qué tan fuerte le está dando a la maquinita), y que el precio se mueva durante el día. Y el cumpleaños como momento de gratitud: una invitación a donar que se manda a las 3:33 pm, hora de Torreón, por correo o celular. Todo en hora de Torreón, siempre.

**Cómo quedó.**
- `momento(ts, m, animo)` en `src/tienda.js`: hora de Torreón (`America/Monterrey`, sin horario de verano), festivos fijos y movibles (`festivoDe`, con Pascua calculada), cumpleaños, quincena, ánimo. Devuelve el ajuste (tope 25 %) y sus partes con nombre. `precioFinal` = lista × (1 − confort) × (1 − momento), redondeado limpio, nunca más que la lista.
- El juego mide el ánimo (`animoReciente`: celdas cavadas en tres minutos, explosiones y pleitos en diez) y lo manda al abrir la tienda y al pagar. Solo sirve para bajar y para el tono.
- `/api/tienda` devuelve `momento`, `cumple`, `gratitud`; `/pagar` recalcula el momento en el servidor y manda `ajuste` y las partes al nombre del cobro de Stripe; `/api/tienda/cumple` guarda día y mes en la maquinita y, con cuenta, en la tabla mundial (`cumples`) para el correo.
- Gorrito de fiesta (`p.cu`) en la pintura pública de la maquinita el día de su cumpleaños; el nombre sube para dejarle sitio.
- La tarjeta de las 3:33 (hora de Torreón, calculada en el navegador) con botón «Sí, quiero dar las gracias», una vez al año; la sección «🎂 Gracias de cumpleaños» (desde $33, fichas $33/$99/$333/$999) tres días antes y después del cumpleaños; la liga del correo `?gracias=cumple` abre ahí.
- Cron `33 21 * * *` (= 15:33 Torreón) → `correosDeCumple`: Resend desde `hola@capitaltorreon.com`, uno por persona y año, con la llave `RESEND_API_KEY` ligada de la bóveda.

**Probado** en local: el momento en tres instantes (cumpleaños de noche tranquilo = 22 %; madrugada del 12 de diciembre a tope = Guadalupe 10 % + quincena 5 %, con aviso de madrugada; Navidad por la mañana = 13 %), festivos movibles de 2026 (Revolución 16 de noviembre, Viernes Santo 3 de abril, Día del Padre 21 de junio), el cumpleaños guardado hoy (gorrito en la maquinita, sección de gratitud, precio de lista $6,000 → $3,490 con 30 % del motor + 15 % cumpleaños + 2 % tranquilo), y la ruta del cron (local sin llave). **No probado:** el envío real del correo (sale a las 3:33 pm de Torreón solo a quien tenga cumpleaños registrado con cuenta) y el cobro real.

### 9.53 Compartir en el ADN: quién invita, WhatsApp primero, la cita del mundo y los momentos

**Lo que pidió Ricardo.** Que compartir esté en el ADN del juego y que la gente común quiera pasarle la liga al que sigue; solidificar cómo se comparte, cómo se invita a entrar al mapa, y cómo se ponen de acuerdo para volver.

**Cómo quedó** (el razonamiento completo está en `docs/ADN_Compartir_Mina_v1_2026-10-04_1540.md`).
- `?de=<i>` en la liga: el servidor apunta `j.de` al registrar una maquinita nueva; `publico()` lo incluye; `entra` lleva `primera`. Quien invita recibe «💛 … entró con tu liga» (`S.st.traidos`), el chat anota «la trajo …», y el panel J muestra «Quién trajo a quién». Logros `padrino` (10) y `pueblo` (33).
- Vista previa: `ficha()` devuelve `on` (conectados) y `cita`; con `?de=` el título dice quién invita y cuántos excavan ahora; la descripción abre con la cita.
- Invitar: mensaje editable (`#msjInv`, `mensajeInvitacion()`), botón WhatsApp (`wa.me/?text=`), `Compartir…` con la hoja del sistema, copiar liga (con `de`), QR con `de`.
- Cita: mensajes `cita {h}` (cualquiera; una cada 20 s; de −1 h a +30 días) y `voy {si}`; `m.cita = {h, i, voy[]}`; `citaViva()` la olvida a las tres horas; viaja en el mensaje `mundo` y en `cita`. Píldora en `#tabla` (clic = voy / ya no voy). Todo en hora de Torreón (`horaCitaTx`, fichas construidas con `Date.UTC(..., H + 6)`).
- Momentos: `tarjetaCompartir()` (una cada 20 min salvo hitos), `invitarGente()` (solo en el mundo, 5 min, superficie, una vez por mundo), hallazgos con `q ≥ 50,000`, logros de hito, pantalla de reinicio.

**Probado** en local: cita propuesta y píldora «hoy a las 8 pm · 1 va · voy ✓», mensaje de WhatsApp con la cita y la liga con `?de=2`, llegada de una maquinita con `de` (atribución guardada, tarjeta 💛, contador `traidos`), panel «Quién trajo a quién», vista previa con `?de=0` («Ricardo te invita a Mundo de Ricardo · 2 excavando ahora» y la cita en la descripción).

### 9.54 Referidos: $333 de saldo por cada persona que abra su cuenta con tu liga

**Lo que pidió Ricardo.** Premio digital de alto valor por cada referido: $333 de la tienda por cada persona nueva que entre con tu liga y haga login, sin límite, con un panel que diga cuántos usaron tu liga y cuánta gente metiste a Mina. «En producto y que quede perfecto».

**Cómo quedó.**
- La maquinita que nace con `?de=` guarda `m.padrino` (la llave de quien invitó); el mundo le anota a quien invitó `ref.llegaron`, y la vista previa con `?de=` le anota `ref.clics`.
- Al abrir cuenta nueva (`/api/cuenta/google` con `r.nueva`): `padrinoDe()` → `marcarPadrinoPagado()` → `acreditarReferido()` en la maquinita del padrino (`m.saldo += 333`, `ref.cuentas`, `ref.ganado`, `ref.lista`, sin repetir la misma cuenta) → aviso en vivo por el mundo donde esté (`Mundo.avisarMaquina` → mensaje `ref`).
- `vistaTienda` devuelve `saldo`, `padrino` y `ref`; `/api/tienda/pagar` con `saldo:1`: si el saldo alcanza, `usarSaldo` + `entregar` al instante (sin Stripe, con `sid` propio); si no, Stripe cobra el resto con `metadata.saldo` y `/confirmar` descuenta lo reservado. El tope de cuidado solo mira el dinero real. Gancho local: `/api/tienda/prueba {exp:"referido"}`.
- Cliente: panel «💛 Tus referidos» arriba del menú Invitar (cuatro cajas: abrieron tu liga, entraron, abrieron cuenta, tu saldo; ganado y gastado; lista plegable), cinta de saldo en la tienda, casilla «Usar mi saldo» y botón «Pagar con mi saldo» cuando alcanza, mensaje de WhatsApp con la línea del premio, bienvenida del invitado con botón «Abrir mi cuenta», tarjeta en vivo «abrió su cuenta: +$333», fila de Menú → Mundo.

**Probado** en local, de punta a punta: una maquinita nueva entra con `?de=`, abre cuenta (pase de prueba) → quien invitó recibe las dos tarjetas (entró con tu liga / abrió su cuenta +$333), el panel marca 1 entró · 1 cuenta · $333; con once referidos ($3,663) el nivel 10 ($3,490) se paga completo con saldo, sin tarjeta, y quedan $173.

### 9.55 El garaje: varias maquinitas por persona, y la auditoría del login

**Lo que pidió Ricardo.** Revisar que el login (botón, sección, conexión) esté bien puesto y guarde todo sin fallos; y que una persona pueda tener varias maquinitas y varios mundos, «sumamente bien resuelto».

**La auditoría del login (lo que ya estaba y se comprobó).**
- El botón: `htmlCuenta()` monta el botón de Google en Mis mundos, en Menú → Mundo y ahora en el garaje; `botonGoogle` manda a login.capitaltorreon.com con la liga de regreso; el pase vuelve en `#sesion=` y nunca viaja en la dirección; `alEntrarGoogle` lo manda a `/api/cuenta/google`, que lo verifica con la llave pública de la casa (`verificarPase`).
- Entra sola: si la casa ya reconoce a la persona (`LoginCT.pase()`), Mina entra sin tocar nada (`yaCasa`); al cerrar sesión se sale también de la casa.
- Lo que se guarda y cuándo: el estado de cada maquinita (dinero, equipo, objetos, carga, récords, logros, tiempo, contratos) viaja al mundo cada 30 s de juego, al ocultar la pestaña y al cerrarla (`enviarEst`), y el mundo lo pasa a su objeto `Maquina`; nombre y modelo en `Maquina`; la lista de mundos y las llaves de dueño en `Cuenta` (`sync` a los 2.5 s de cada cambio); capturas en `Cuenta` + R2; compras, pintura, saldo, referidos y cumpleaños en `Maquina`; preferencias (texto, contraste, movimiento, sonido) en la casa vía `data-prefs`.
- Lo que se corrigió: la regla «cada cuenta lleva una sola maquinita» (al entrar con otra maquinita en el equipo, una se quedaba fuera); el aviso «tu cuenta cambió de maquinita» que empujaba a todos los equipos a la misma; y la tienda solo aceptaba pagar con la maquinita «oficial» de la cuenta.

**El garaje.**
- `Cuenta.maqs = [{k, h}]` (hasta 50) con `c.k` como la última usada; `garajeDe` migra las cuentas viejas; `meter`, `garaje(t)` (fichas con `resumen`: nombre, modelo, dinero, récord, tiempo, nivel de pintura, saldo, mundo), `maquina(t, k, accion)` con `usar` / `agregar` / `nueva` / `quitar` (nunca la última). `sync` y `entrar` reciben el garaje local del equipo. `esMia(c, k)` sustituye a `c.k === d.k` en la tienda y el cumpleaños.
- Cliente: `garaje` local (`mina_garaje`), `anotarGaraje`, `cambiarMaquina(k, n, m)` (manda el estado de la actual, limpia la copia local, avisa a la cuenta y vuelve a entrar al mismo mundo), `pantallaGaraje(desde)` (lista con fichas y «en uso», Jugar con esta, Quitar, Nueva maquinita con nombre y modelo, traer por código, botón de Google si no hay cuenta). Entradas: Menú → Mundo → «Mi garaje» y Mis mundos → «🚜 Mi garaje».
- Reglas: un equipo con cuenta sigue con su maquinita si está en el garaje (ya no se le impone la última usada); al entrar con otra maquinita en el equipo, las dos quedan en el garaje y solo se elige con cuál seguir; en un mismo mundo se puede jugar con cualquiera de ellas (cada una es una maquinita más del mundo).

**Probado** en local: garaje con la maquinita en uso y su ficha; crear «La Segunda» (modelo 5) → vuelve a entrar al mismo mundo con $20 y la vieja aparece en la lista del mundo; la cuenta guarda dos; volver a «El Jale» recupera sus $5,000, nivel 10 de pintura y saldo; pagar con una maquinita del garaje que no es la última usada pasa la verificación de cuenta, y con una ajena no.

### 9.56 La auditoría de lo monetizable: colores gratis, lo de pago más ancho

**Lo que pidió Ricardo.** Auditar todo lo que se monetiza, dejar gratis el 20 % que causa fricción, y ampliar y mejorar lo que sí se cobra para no perder rentabilidad.

**Cómo quedó** (el razonamiento, en el ADN de monetización, sección 6e).
- `GRATIS = 2` en `src/tienda.js`: niveles 1 y 2 con precio 0; `filtrarPinta` usa `max(2, nivel)`; `/pagar` compara contra `max(GRATIS, actual)`. Cliente: `nivelMio()` = `max(2, pagado)`, `nivelPagado()` para lo real; la escalera dice «Gratis»; la carpeta abre en tu color si no te has pintado.
- Se quitó la pregunta de rango y el Fondo común (UI y tipo de pago; `tomarRegalo` queda inerte con fondo 0).
- Catálogo ampliado en los dos lados (hay una prueba, `catalogo.mjs`, que compara el `TC` del cliente con `src/tienda.js`): `CALCAS` con el 0 vacío (ya no se perdía la ⭐) + `CALCAS_TEMPORADA` (seis temporadas, 26 calcas) y `CALCAS_TODAS`; `calcaHoy(i, md)` y `temporadasHoy(md)`; `ponerPinta` rechaza una calca de temporada fuera de fecha y conserva la anterior. `ESTELAS` + Fuego/Pétalos, `BOCINAS` + Cumbia/Corneta, `PLACAS` + Neón, `CARROS` + El Tanque, `MASCOTAS` + Gato/Abeja, `TITULOS` (15, nivel 6, campo `titulo`).
- Dibujo nuevo en `dibMaq` (casco del tanque con placas, remaches, torreta, cañón y banderín; placa de neón con sombra del color de la maquinita; título antes del nombre), `dibMascota` (gato, abeja), `estela`/`dibujarEstelas` (fuego que sube y se apaga, pétalos que caen meciéndose), `CLAXON` (cumbia, corneta).
- Regalar: acción `regalar(i)` desde el panel J (botón 🎁 por persona) que abre la carpeta del siguiente nivel de esa maquinita con «¿Es un regalo?» puesto; sección «🎁 Regalar» en la tienda.
- Nota: el índice de las calcomanías se corrió uno (el 0 pasó a ser «ninguna»); no había compras del nivel 3 en vivo, así que nadie pierde su calca.

### 9.57 Sonido premium: seis voces de motor, cinco canciones y la placa mejor hecha

**Lo que pidió Ricardo.** Voces distintas para el motor, deliciosas y que no cansen, con un precio distinto cada una para coleccionarlas; cinco canciones de fondo a $39; y la placa de mejor calidad.

**Cómo quedó.**
- `MOTORES` y `CANCIONES` en `src/tienda.js` (`PIEZAS`, `pieza(id)`); `filtrarPinta(p, nivel, piezas)` solo deja `motor`/`cancion` comprados; `Maquina` guarda `t.piezas`; `/pagar` con `tipo: "pieza"` (una vez, propia, a lista; el saldo la paga; Stripe cobra el resto con `metadata.pieza`); `/confirmar` y `/prueba` la entregan.
- Cliente: `armarMotor(tipo)` (siete voces: fábrica + seis), `ponerMotor` (la anterior se apaga suave y se desconecta), `oirMotor` (acelerón de 3 s con el canal del motor encendido aunque esté apagado en opciones), `sonarLazos` llama `lazo.motor.ajustar(...)`. `CANC` (cinco definiciones), `componerCancion`, `cancionActiva`, `oirCancion` (10 s de prueba), `componer` usa la canción si hay. Sección «🔊 Sonidos · piezas sueltas» en la tienda (`htmlSonidos`), acciones `tOir`/`tUsar`/`tComprar`, `usarPieza` (guarda en la pintura y enciende el canal del motor).
- Placa: marco de acero cepillado (bisel, borde del color, tornillos con ranura, nombre grabado), corona con banda, perlas y destellos, dorada con contorno café y laca, neón con halo doble y parpadeo.

### 9.58 El QR a un clic

**Lo que pidió Ricardo.** Que el botón de compartir esté lo más a la mano posible: un clic y sale el modal con el código QR del mundo donde estás y la liga para copiar; copiar solo con el botón (nunca en automático, para no pisar lo que la persona traiga copiado), con aviso de «copiada», y la ✕ arriba a la derecha.

**Cómo quedó.** Invitar (botón y tecla I) abre el menú `qr`: QR grande (`.qr.grande`, 360 px) de `ligaInvitacion()` (lleva `?de=`), la liga en texto, «📋 Copiar la liga» (aviso y sonido al copiar), «📲 WhatsApp» y «Más formas de invitar…» (el panel completo con referidos, mensaje y cita). Cabecera con ✕ (`header button.x`, 44 px). Menú → Mundo sigue llevando al panel completo.

### 9.59 Metiches: ver lo que ve otro jugador

**Lo que pidió Ricardo.** Poder seleccionar a otro jugador y ver exactamente lo que él ve, mientras sigo siendo jugador; que los dos entiendan que pueden hacerlo.

**Cómo quedó.** `seguir(i)` / `dejarDeSeguir()` (`sigo`): la cámara toma la posición de la otra maquinita en vez de la mía; mi maquinita se queda quieta; cualquier flecha o toque en el lienzo regresa. Las filas de la tabla de arriba a la derecha son clicables (`data-ver`), la que sigo lleva marco, y arriba una píldora «👁 Viendo lo que ve … · toca para volver». Mensaje `mira {a}` al servidor (uno cada 0.6 s), que se lo pasa solo a quien es mirado: tarjeta «👀 … está viendo lo que tú ves. Tú también puedes…»; al dejar de mirar, aviso. Ayuda en el manual.

### 9.60 El escaparate en 3D de verdad

**Lo que pidió Ricardo.** Que el escaparate de La Pinturería fuera un 3D correcto, con lógica de minería: botones para prender el taladro y las hélices y ver lo que la maquinita sabe hacer.

**Cómo quedó.** `publico/escaparate.js` sobre Three.js r158 (`publico/three.min.js`, servido desde el propio sitio y en la caché del service worker: funciona sin internet). Se carga la primera vez que se abre la tienda (`cargarEscaparate`); si no hay WebGL, queda el escaparate 2D. La maquinita en volumen: carrocería según `carro` (de fábrica, Escarabajo, Locomotora, Submarino, Tanque) con laca (`MeshPhysicalMaterial` con clearcoat cuando está pintada), cabina de vidrio con piloto, orugas de verdad (banda hueca en forma de estadio, ruedas y rodillos dentro, tacos que recorren el perímetro), taladro al frente con rosca, dos mástiles con rotores, faro con luz de verdad (`SpotLight` + luz de piso del color elegido), calcomanía troquelada, el letrero del nombre con su placa dibujado por el mismo `dibMaq` del juego (como sprite), la mascota como sprite animado con `dibMascota`, y la estela como partículas al volar. Tarima con aro de latón, sombras suaves, luz cálida. Gira sola y se arrastra con el dedo o el ratón. Botones **⛏️ Taladro** (la broca gira, salen chispas, las orugas avanzan, el taladro baja) y **🚁 Hélices** (los mástiles se extienden, los rotores giran, la maquinita se eleva y se mece, levanta polvo y deja estela).

### 9.61 Comercio o batalla

**Lo que pidió Ricardo.** Antes del primer pleito, un menú: ¿comercial o batalla? Comercial = darse dinero y objetos; batalla = pelear. Lo que elijan se queda, y se puede cambiar después.

**Cómo quedó.** Por pareja de maquinitas y por mundo: `m.rel["a|b"]` en la meta del mundo (mensaje `rel {a, modo}`, lo manda cualquiera de los dos; se difunde a todos y viaja en `mundo`). El servidor no pasa ningún `golpe` si la pareja no está en batalla, y el cliente también lo ignora. En el contacto bajo tierra: sin modo → se abre el menú «¿Cómo se llevan?» (una vez cada 3 s); con comercio → se abre el intercambio (una vez cada 4 s); con batalla → el pleito de siempre. Intercambio: `dar {a, d, o}` (solo con comercio acordado; el servidor valida y se lo entrega al otro; quien da descuenta en el momento; queda nota en el chat). Panel J: botones 🤝 / ⚔️ para elegir o cambiar, y «🤝 Dar» cuando hay comercio. Tarjeta al otro cuando alguien elige o cambia.

### 9.62 Metiches, la experiencia completa

**Lo que pidió Ricardo.** Cuidar cada detalle de ver en vivo a la otra persona, para una sensación de unión que no hayan sentido antes; mejorar lo que existe y hacer algo original.

**Cómo quedó.**
- La luz y la oscuridad son de quien se sigue; el servidor manda todas sus posiciones a quien lo mira (`jug.mira`).
- **Su panel, en vivo:** quien es mirado manda cada 2 s `yo {d, f, fm, v, vm, c, cm, z}` (dinero, combustible y tanque, casco y máximo, carga y bodega, dónde anda); el servidor lo reparte solo a quienes lo miran (`yoDe`). Abajo, `#sigoHud`: nombre, zona, cuatro barras, y **sus teclas** encendidas conforme las aprieta (la máscara de teclas ya viajaba en el paquete de posición solo para observadores; ahora también cuando te miran jugadores: `miradoPor`).
- **Se oye su taladro** (más bajito) cuando está perforando (`fl & 4`).
- **Reacciones:** 👋 👍 ❤️ 🔥 😂 🎉 (`rx {a, e}`, una cada 0.7 s): flotan sobre la maquinita mirada con el nombre de quien las manda, con chispas; quien las recibe oye un aviso.
- **Tab** pasa a la siguiente maquinita conectada; **V** sigue a la más cercana (o deja de seguir); si quien sigues sale del mundo, vuelves a tu maquinita con aviso.

### 9.63 El espejo: ver los menús de quien sigues

**Lo que pidió Ricardo.** Al seguir a alguien, ver también lo que hace en el sistema: los modales, la configuración, a quién saca o mete, qué compra; todo menos su chat. Y ver exactamente dónde pica, con un retardo de 1.25 s para seguir el flujo.

**Cómo quedó.** Quien es mirado (`miradoPor` > 0) transmite `ui`: el HTML de `#caja` cada vez que cambia (un `MutationObserver`, con tope de uno cada 1.2 s y 150 KB), `clic {a, v, n}` antes de ejecutar cada acción de un botón `[data-a]`, y `cierra` cuando el velo se apaga. El servidor lo reparte solo a quienes lo miran. El que sigue lo reproduce en `#veloEspejo` / `#espejo` (misma caja, sin eventos de puntero, con la banda «👁 X está aquí»): el HTML se sanea (fuera scripts, iframes, atributos on*, ids y ligas), y una cola lo reproduce en orden: un `clic` resalta el botón (`.espClic`) y detiene la cola 1.25 s. Si abro mi propio menú, el espejo se oculta; al cambiar de maquinita o dejar de seguir, se limpia. El chat vive fuera de `#caja`, así que nunca viaja.

### 9.64 La guía de estilos y el kit de marca

**Lo que pidió Ricardo.** Todos los elementos para que un amigo empiece a publicar videos en TikTok: el círculo (foto de perfil), ícono, favicon, logotipo, tipografía, imágenes para redes verticales y horizontales, para el grupo y la comunidad de WhatsApp (círculo negro o blanco con el ícono gris, o en tierra/café), en una guía de estilos en `mina.capitaltorreon.com/guía-estilos`, con un botón de descarga bajo cada imagen y todo en un zip. «Piensa más allá».

**Cómo quedó.** `publico/guia-estilos/`: página propia (colores y letra de Mina, A−/A+, sin dependencias) que arma sus tarjetas con `kit.json`; 89 piezas en 11 carpetas y `Mina_Kit_de_Marca_v1_2026-10-05_1045.zip` (13.4 MB).
- **Decisión de marca:** la tipografía es **Inter** (libre, SIL OFL; se reparte en el kit). El juego sigue con la letra del sistema; Inter es su equivalente en todos lados y con ella están hechas todas las piezas. El logotipo: MINA en Inter Black, amarillo `#FFD23F`, contorno café `#2A1A14` y un escalón café abajo, junto a la maquinita con el taladro hacia abajo.
- **Las piezas:** ícono (1024/512/192, cuadrado y enmascarable), favicon (ico + 16–180), logotipo (horizontal, vertical, con lema, palabra, una tinta), la maquinita (poses, gris, 8 modelos, 4 carrocerías), **perfil** (9 fondos × cuadrado y círculo: atardecer, tierra, café, negro, blanco, a color y en gris), vertical 9:16 (portada, fondos, cierre, marco transparente, zonas seguras), horizontal (portada, miniatura y banner de YouTube, X, Facebook, liga), cuadrado y 4:5, video (cintillos, marca de agua, QR), tipografía y color.
- **Para TikTok:** cinco pasos, biografía, liga, etiquetas, textos e ideas de video listos para copiar; el tono (lo que Mina dice y lo que no).
- **De dónde sale el arte:** del propio juego. `diseno-fuente/kit-captura/cdp.mjs` maneja Chrome sin ventana por su protocolo de depuración, abre `?foto`, monta una escena por formato (`trabajos.mjs`: tiro, túneles, cuatro maquinitas, dónde cae el título) y exporta el lienzo; `Kit_de_Marca_Mina_v1_….py` (PIL) compone títulos, perfiles, cierres, marcos, QR, paleta, miniaturas y el zip.
- **Convivencia con el juego:** el service worker deja pasar `/guia-estilos` (y sus alias) directo a la red; si un equipo con la copia vieja guardada recibe el juego en esa dirección, la página suelta el service worker y se recarga sola, y `juego.js` no arranca ahí. El Worker redirige `/guía-estilos`, `/guia-de-estilos`, `/guia`, `/marca` y `/kit`.

### 9.65 Arte con gemas, el generador y el brochure

Lo que se hizo el 5 de octubre de 2026 para que Mina salga al mundo: material para publicar cientos de cosas sin depender de nadie.

- **Las 22 gemas, sueltas.** Cada mineral del juego se exportó sin fondo, derecho y centrado (512 × 512), con la misma función `gema()` que lo dibuja bajo tierra. Están en `kit/12-gemas/` y en la guía, cada una con su nombre, su precio y desde qué metros aparece.
- **El generador** (`publico/guia-estilos/arte.js`, sección `#arte` de la guía). Acomoda las gemas en una figura simétrica alrededor de la palabra MINA y, si se quiere, pone el cintillo con la liga. Ocho figuras (mandala, corona de las 22, sol, espiral, caleidoscopio, rombos, panal y flor), nueve juegos de gemas (las 22, uno por zona, joyas, oro y rubí, hielo), siete fondos y cuatro formatos (9:16, 4:5, cuadrado y 16:9). El botón **Generar** saca una nueva cada vez; lo que se deje «Al azar» lo decide la semilla. Se baja en PNG, o **veinte de un jalón** en un zip que se arma en el navegador. La misma semilla con la misma figura, gemas y fondo repite la imagen.
- **Decisiones de las figuras.** La corona usa las 22: once por anillo de un lado y su reflejo del otro, así cada dos anillos están todas y la imagen es simétrica de izquierda a derecha. La espiral son anillos de 24 que se van girando medio paso, con los colores recorridos para que se vean los brazos. En el panal no entran las barras (platino, paladio, rodio, osmio): acostadas se volvían rayas.
- **Las seis para empezar** (`kit/13-arte/`, 1080 × 1920): Corona de las 22, Mandala de joyas, Espiral del acuífero, Panal de gemas, Caleidoscopio de jade y Sol de oro y rubí. Salen del mismo generador (`diseno-fuente/kit-captura/arte.mjs` con `arte-seis.json`), así que cualquiera se rehace con su semilla.
- **El brochure** (`publico/guia-estilos/brochure/`): seis hojas tamaño carta. 1 portada; 2 qué es (la superficie con sus edificios numerados); 3 cómo se juega (la pantalla explicada con números, La Báscula y El Taller); 4 con tu gente (el QR para invitar, el teléfono y lo que se puede hacer juntos); 5 el mundo (Acuífero, Gruta de Cristal, Ciudad Perdida, los 22 minerales y las cinco zonas); 6 La Pinturería, tres pasos para empezar y el QR. La misma página es la versión en línea y de ahí sale el PDF.
- **Las capturas son del juego de verdad**: un mundo nuevo en local, con la escena acomodada (túneles, compañeros y dinero puestos para la foto) y la pantalla fotografiada tal cual. En la captura del QR, el código y la liga se cambiaron por los del inicio del juego, para que quien lo escanee desde el PDF llegue a Mina y no a un mundo que no existe.
- **La liga fija del PDF**: `https://mina.capitaltorreon.com/guia-estilos/Mina_Brochure.pdf`. No lleva fecha en el nombre a propósito: es la que se manda por WhatsApp y debe seguir sirviendo cuando el brochure se rehaga. La copia fechada va dentro del zip (`14-brochure/`).
- **El peso manda.** Cloudflare no sirve archivos de más de 25 MiB. Con el arte en PNG el zip del kit se pasaba, así que dentro del zip el arte va en JPG y en la página cada imagen se baja en PNG (y las seis juntas en `Mina_Arte_con_Gemas_…zip`). El generador del kit se detiene con un aviso si algún zip se pasa.
- **Qué falta**: el brochure dice lo que el juego hace hoy; si cambian los precios, los niveles o los lugares, se rehacen las capturas y el PDF (pasos en el README). No hay versión en inglés.

### 9.66 La guía, más simple: cinco ligas y el ícono de cada red

Ricardo vio que el menú de la guía traía catorce ligas y que los botones A−/A+ las tapaban, y pidió el ícono de cada red social arriba de cada diseño.

- **El menú** quedó en cinco: Empezar, Arte con gemas, Brochure, Por red y La marca. Los botones A−/A+ ya no flotan encima: van en su propio lugar y la tira de ligas se recorre sola en el teléfono.
- **El orden de la página** ahora va de lo que se publica a lo que se usa para armar: primero empezar, arte y brochure; luego la franja **Para cada red** (qué va en cada red, foto de perfil, vertical, cuadrado, horizontal y piezas para video); al final la franja **La marca** (logotipo, ícono, maquinita, color y tipografía) y el zip.
- **Los íconos de red** (TikTok, Instagram, YouTube, Facebook, X, LinkedIn, WhatsApp y Mensajes) son dibujos propios y sencillos, hechos en el código de la página: una ficha del color de la red con su figura en blanco. Salen en tres lugares: arriba de cada tarjeta, según para qué red sirve esa pieza (regla `redesDe()` por carpeta y nombre de archivo); bajo el título de cada sección, con nombre; y en la tabla «Qué va en cada red», que además liga cada archivo con su sección. En el generador, al cambiar el formato cambian las redes.
- Las piezas de marca (logotipo, ícono, maquinita, color, tipografía y gemas sueltas) no llevan ícono de red: sirven en cualquiera.
- En el pie se aclara que los nombres y logotipos de las redes son de sus dueños.

### 9.67 El generador de arte, dentro del juego, y seis imágenes más

A Ricardo le gustaron las imágenes de gemas y pidió dos cosas: otras seis, y que cualquier jugador pueda hacer las suyas desde el juego.

- **Menú → 💎 Arte** (pestaña 13 del menú). Al abrirla ya hay una imagen hecha. **Generar otra** saca una nueva, siempre distinta; **Descargar** la baja en PNG; en el teléfono, **Compartir** la manda con la hoja del sistema, junto con la liga del mundo. Tres formatos: vertical, cuadrada y horizontal.
- **Un solo programa.** El juego no trae copia del generador: carga `/guia-estilos/arte.js` la primera vez que alguien abre la pestaña, y de ahí mismo las 22 gemas, la palabra MINA y el cintillo. Lo que se mejore en la guía mejora en el juego.
- **Sin internet también**, después de la primera vez: el service worker guarda ese programa y esas 24 imágenes en un almacén aparte (`mina-arte`) que no se borra al cambiar de versión. Versión del service worker: `mina-44`.
- **Que la imagen no cambie sola.** El menú se repinta seguido (llega alguien, cambia el dinero). La imagen vive en un lienzo propio (`arte.lienzo`) que se vuelve a colgar en cada repintado; solo cambia cuando se pide otra o se cambia el formato.
- **Decisión:** «Generar» no descarga sola. Bajaría un archivo por cada clic aunque la imagen no guste; por eso son dos botones juntos.
- **Las otras seis** (`kit/13-arte/`, ahora doce): Rombos de la corteza, Flor de la cristalera, Espiral de joyas, Mandala del atardecer, Mandala de la corteza y Corona de medianoche. Con ellas ya hay una de cada figura. La lista completa está en `diseno-fuente/kit-captura/arte-lista.json`.
- **Kit v3:** 124 piezas. Para no pasar de 25 MiB, dentro del zip el arte va en JPG de calidad 88 y ya no se repite el zip de las fuentes; el zip del arte usa los PNG ya optimizados.
- **Qué falta:** quien mira a otro jugador (el espejo de menús) ve el cuadro de la imagen vacío, porque el espejo copia el texto del menú y no los lienzos.

### 9.68 La guía del creador: 60 vetas de contenido

**Lo que pidió Ricardo.** Un PDF de consejos para quien crea contenido sobre Mina: que platique el juego, las reglas y el multijugador con tips y frases «muy del estilo de Mina», que le dé temas a la persona, que venda el juego, que esté arriba en la guía de estilos y que se pueda imprimir. Unos 60 temas, tres por hoja, más portada, manifiesto, introducción, conclusión y contraportada.

**Cómo quedó.** `publico/guia-estilos/creador/`: 28 hojas tamaño carta. La misma página es la versión en línea y de ahí sale el PDF.
- **El nombre:** «Guía del creador · 60 vetas de contenido». Una veta es un tema del que sale un video.
- **Cada veta trae cuatro partes:** la idea (qué hay en el juego, con sus números), «Di esto» (la frase), «Graba» (la toma que no puede faltar) y un consejo. Más el formato (corto, serie, reto o directo), dos casillas (grabado, publicado) y renglones para notas.
- **Diez capítulos de seis vetas:** Empieza aquí, Las reglas de la mina, Minerales y dinero, El mundo hacia abajo, Con tu gente, En batalla, Mirar y ser visto, Mundos para siempre, Hazla tuya y Oficio de creador.
- **Las hojas de alrededor:** portada (las 22 gemas en rueda y un 60 al centro), el manifiesto del juego tal cual más la invitación a publicar, ocho razones por las que Mina funciona en video, cómo usar la guía, frases para abrir y cerrar, un mes de videos (treinta vetas en orden), la lista de antes de publicar con lo que Mina sí dice y no dice, el cierre y la contraportada con el QR.
- **Lo que se le dice al creador:** cero anuncios, publicar no cuesta ni pide permiso y lo que gane con sus videos es suyo; el juego es fácil de narrar; sirve en amistoso y en batalla; trae liga para mirar; los mundos duran años exactamente como se dejaron.
- **Papel blanco, a propósito:** es para imprimir. Tinta café, amarillo solo en rellenos, sin fondos oscuros.
- **Cada dato sale del juego:** $20 y 3 litros al empezar, bodega de 7, precios de minerales y hallazgos, bonos de Doña Chela, rangos, lugares y rincones, $500 por maquinita nueva, 99 medallones, modos Paseo/Clásico/Rudo, 40 jugadores, $333 de saldo por referido. Si el juego cambia, se corrige `vetas.js` y se rehace el PDF.
- **No cuenta el final.** Varias vetas piden expresamente no contarlo.
- **La liga fija:** `https://mina.capitaltorreon.com/guia-estilos/Mina_Guia_del_Creador.pdf`.
- **En la guía de estilos:** es el primer botón de arriba, la primera liga del menú y la primera sección.
- **El peso:** con las piezas grandes del kit los dos PDF pesaban el doble. Ahora el brochure y esta guía usan copias chicas de gemas, maquinitas, palabra y QR (`brochure/img/`, las hace `brochure-imagenes.py`): el brochure bajó de 5.8 a 3 MB y el zip del kit quedó en 20 MB. Kit v4: 125 piezas.
- **Qué falta:** que Ricardo lea las 60 frases y cambie las que no suenen a él; versión en inglés no hay.

### 9.69 El generador, ahora con movimiento: GIF en bucle

**Lo que pidió Ricardo.** Que al generador de arte se le pueda prender una palanca para que las joyas se muevan y se baje un GIF, muy simétrico y buscando el bucle perfecto, con opción de que dure menos. Opción secundaria: de inicio sigue saliendo la imagen quieta.

**Cómo quedó.**
- **La palanca «Con movimiento (GIF)»** está en el generador de la guía y en Menú → 💎 Arte del juego, apagada de inicio. Al prenderla, la misma imagen (misma semilla) cobra vida en la vista previa y el botón de descarga pasa a «Descargar este GIF».
- **El bucle no tiene corte, por construcción.** Todo movimiento es una función del tiempo t, de 0 a 1, que en 1 vale lo mismo que en 0. No se «busca» el empate: no puede no empatar. Medido en las pruebas: la diferencia entre el último cuadro y el primero es igual a la de dos cuadros vecinos cualesquiera.
- **Cinco movimientos:** *giro* (cada anillo avanza un paso de su propia simetría, los vecinos en sentido contrario: al terminar, cada gema está donde había otra igual), *latido* (dos golpes, como corazón, y la onda sale del centro), *ola* (los anillos se acercan y se alejan), *vaivén* (cada gema se mece, las vecinas al revés) y *cascada* (un brillo baja por los dos lados a la vez). Todos respetan la simetría de la figura en cada cuadro. El polvo de luz parpadea.
- **El giro solo donde se puede.** Cada figura dice cuánto puede girar cada anillo sin que se note (`w`). La corona, los rombos y el panal no giran; la espiral solo con dos o tres colores. Si se pide giro y no se puede, sale ola.
- **En la guía se elige** el movimiento, la duración (2, 3, 4 o 6 segundos) y el tamaño (Ligero 324 de ancho a 15 cuadros por segundo; Normal 432 y Grande 540, a 20). En el juego es fijo: Normal, 3 segundos.
- **El GIF se arma en el navegador, sin librerías** (`arte.js`): paleta de 255 colores por corte de mediana sobre seis cuadros del bucle, un color transparente para lo que no cambió entre cuadros, y compresión LZW propia. Tarda menos de un segundo. Verificado abriéndolo con otro programa (PIL): 60 cuadros, 50 ms, repetición infinita.
- **Peso:** de 1 a 6 MB en tamaño Normal; el giro pesa más porque cambia toda la imagen.
- **Las imágenes quietas no cambiaron:** se separó la escena (lo que decide la semilla) de los dos pintores, y las doce del kit salen idénticas pixel por pixel.
- **Dónde sirve el GIF:** WhatsApp, Mensajes, X y Facebook. TikTok, Reels y Shorts piden video; el generador lo dice y cambia los íconos de red al prender la palanca.
- **DeepSeek:** Ricardo pidió usarlo. No se usó: es un modelo de texto y no dibuja, y su llave vive en la bóveda, donde solo la lee un Worker. Queda como decisión abierta si se quiere una caja «descríbelo con palabras» que elija figura, gemas, fondo y movimiento.
- **Qué falta:** bajar el mismo bucle como video (MP4) para TikTok y Reels.

### 9.70 La galería

**Lo que pidió Ricardo.** Una página «Galería» con unas 50 imágenes y unos 50 GIF hechos con el generador, todo vertical, en unas cuatro columnas hacia abajo, con scroll prácticamente infinito, filtro de todo / imágenes / GIF, descarga en cada pieza y siempre con MINA y la liga del juego.

**Cómo quedó.** `mina.capitaltorreon.com/galeria` (también `/galería`; la página vive en `publico/guia-estilos/galeria/`).
- **Las cien escogidas:** 50 imágenes y 50 GIF. Se generaron 150 candidatas con parejas de gemas y fondo que se llevan bien, se revisaron en hojas de contacto y se quitaron las vacías y las repetidas. Hay de las ocho figuras y de los cinco movimientos.
- **No hay archivos guardados.** Cada pieza es una receta en `lista.js` (figura, gemas, fondo, semilla, movimiento) y se pinta en el momento con el mismo `arte.js` del generador. Cien PNG y cien GIF de verdad pesarían unos 300 MB en el repositorio y en cada publicación; así la página pesa unos cuantos KB y las piezas no se pueden desactualizar respecto al generador.
- **No se acaba.** Después de las cien, la página sigue haciendo piezas nuevas con semillas al azar mientras se baja, y avisa: «De aquí en adelante, recién hechas». Esas son distintas en cada visita.
- **Cuidado con el equipo de quien la ve:** las imágenes se pintan una sola vez, de una en una, y se quedan como foto ligera; los GIF solo se mueven mientras están a la vista (24 cuadros por segundo) y al salir se apagan y sueltan su memoria. Probada con 220 piezas: unos 50 MB de memoria.
- **Descargar:** cada pieza tiene su botón. La imagen baja en PNG de 1080 × 1920; el GIF se arma en ese instante (432 × 768, 3 segundos) y enseña el avance.
- **Publicidad siempre:** cada pieza lleva MINA y la liga; el encabezado tiene «Jugar Mina gratis» y «Hacer la mía», que lleva al generador.
- **Dónde se enlaza:** primera liga del menú de la guía de estilos, un atajo arriba, el texto del generador y Menú → 💎 Arte del juego.
- **Rutas:** el Worker redirige `/galeria` y `/galería`; el service worker (`mina-46`) y la guardia de `index.html` ya dejan pasar esa dirección.
- **DeepSeek:** se volvió a pedir. Sigue sin aplicar: no dibuja, y la galería sale del generador.
- **Qué falta:** si se quieren las cien como archivos (para mandar un zip, por ejemplo), se sacan con `arte.mjs` y `gif.mjs` a partir de `lista.js`.

### 9.71 La Pinturería, al final de la calle

**Lo que dijo Ricardo.** Con La Pinturería al principio «parece que les queremos vender» antes de dejar jugar. Primero debe ir Santa Bárbara, luego la Gasolinera y lo demás, y La Pinturería hasta el final. Y que su nombre se vea completo en la imagen de la maquinita de La Pinturería.

- **El orden nuevo, de izquierda a derecha:** el terrero, Santa Bárbara, Gasolinera, La Báscula, El Taller, El Almacén, Remineralizadora, El Elevador y La Pinturería (de la columna 33 a la 70).
- **El suelo firme** se alargó hasta la columna 73 (`ZX1`, en el juego y en el servidor) para que la camioneta quede sobre piso que no se perfora. Vale también en los mundos ya guardados: si alguien había cavado ahí, las dos primeras filas vuelven a ser firmes.
- **Los avisos** que decían «a la izquierda de la Gasolinera» ahora dicen «al final de la calle».
- **El nombre en el escaparate 3D** salía cortado por abajo: el letrero se dibujaba en un lienzo de 220 de alto y el nombre caía justo en la orilla. Ahora mide 272 y la cámara deja más aire arriba. Probado con «Ricardo» y con «La Valenciana».
- **Qué quedó viejo:** la captura de la superficie del brochure, las escenas del kit de marca donde sale la camioneta junto al tiro, y el orden que dice la veta 6 de la guía del creador. Muestran la calle anterior.

### 9.72 La galería en /galeria, GIF más largos y una pasada de mejoras

**Lo que dijo Ricardo.** Le encantó la galería y el scroll sin fin. Pidió: quitar «guia-estilos» de la dirección y dejarla en `/galeria`, ligas a la galería desde varios lados, que el GIF dure más («lo siento muy corto»), y mejoras de claridad, calidad y estructura a partir de una captura.

- **La dirección:** `mina.capitaltorreon.com/galeria`, a secas. La página pasó a `publico/galeria.html` y sus recetas a `publico/galeria-lista.js`. Las direcciones de antes, con acento, con diagonal o con mayúsculas redirigen ahí (301).
- **Ligas a la galería:** en la guía de estilos (primera liga del menú, atajo de arriba, una franja amarilla en Arte con gemas, el texto del generador y el pie), en el brochure y la guía del creador en línea, y en el juego (Menú → 💎 Arte y Menú → Ayuda).
- **GIF más largos.** De inicio duran 6 segundos (antes 3); en el generador se elige 3, 6, 9 o 12. Para que un bucle largo no sea uno corto repetido, el movimiento principal se repite cada 3 segundos y se le suma un **acento** que pasa una sola vez por bucle: al giro, un latido desde el centro y un vaivén de velocidad; al latido, un brillo que baja por los dos lados; a la ola, ese mismo brillo; a la cascada, anillos que respiran; al vaivén, un latido. Sigue cerrando sin corte: todo son ciclos enteros.
- **Peso de los GIF largos:** de 3 a 9.5 MB a 6 segundos en tamaño Normal (el giro es el más pesado). Para contenerlo, los cuadros por segundo bajan con la duración: 20 hasta 4 s, 16.7 hasta 8 s y 12.5 después. Se probó un acercamiento suave de toda la figura y se quitó: cambiaba todos los pixeles en cada cuadro y duplicaba el peso.
- **Más nitidez en la galería.** Cada pieza se pinta al tamaño real que ocupa en la pantalla de quien mira, contando pantallas de doble densidad (antes siempre a 432 de ancho: en una pantalla grande se veía suave). Las imágenes llegan hasta 1080 de ancho y los GIF en vivo hasta 648.
- **Verla en grande.** Un toque en cualquier pieza la abre a pantalla completa, con su botón de descarga, flechas para pasar a la siguiente (también con ← →) y Esc para cerrar.
- **Mejor orden.** Imagen y GIF ya no alternan de uno en uno (con cuatro columnas quedaban columnas enteras de un solo tipo); ahora van en un patrón de ocho que mezcla en 2, 3 y 4 columnas.
- **Memoria.** Ricardo llegó a más de dos mil piezas en una visita. Ahora las que quedan a más de cinco pantallas sueltan su foto y se repintan al volver (misma receta, misma imagen). Probado con 280 piezas: 10 MB.
- **Detalles:** la corona ya no dice «Corona de las 22 · Las 22»; el contador usa separador de miles; botón «↑ Arriba» al bajar mucho; «Jugar gratis» siempre a la vista en la barra.
- **Se quitaron** los tres GIF de muestra de la guía (10 MB): la galería los reemplaza con ventaja.

### 9.73 Galería: 33 fijas y, después, piezas que no se repiten nunca

**Lo que dijo Ricardo.** Las primeras 33 fijas; todas las demás siempre diferentes: si entra en un mes, en un año, si entra otra persona o si sigue bajando. «Que nunca puedas ver algo que ya había existido, más que las primeras 33.» Pidió revisar las semillas.

**Lo que se encontró al revisar.** Las piezas de después de las cien salían de un número entre 1 y 999,999 y de unas 60 combinaciones de figura, gemas y fondo. Con suficientes visitas se habrían repetido: bastaban unos cuantos miles de piezas vistas entre todos para que alguna coincidiera.

**Cómo quedó.**
- **33 fijas:** 17 imágenes y 16 GIF de las cien escogidas (`galeria-lista.js`). Son las mismas y en el mismo orden para todos.
- **La semilla lleva el reloj.** Cada pieza única nace con una semilla hecha del instante exacto (milisegundos desde el 1 de enero de 2026) y, pegados, 12 bits al azar. Como el tiempo no regresa, una semilla que ya salió no puede volver a salir, ni mañana ni en un año. Los 12 bits cubren el caso de dos personas en el mismo milisegundo. Dentro de una misma visita el contador siempre avanza.
- **Más que una semilla distinta: una pieza distinta.** Para que la diferencia se vea y no sea solo un número, el generador tiene un modo «única» (semillas de 4,294,967,296 en adelante, con un azar de 64 bits): de la semilla salen la figura, una **mezcla propia de 3 a 6 gemas** de entre las 22 (dos vistosas seguro y a lo mucho una barra), un **fondo de cualquier tono** del círculo de color, el **tamaño de las gemas**, cuántos lados tiene la figura (de 5 a 14), si apunta con pico o con valle y el movimiento. La figura de sol queda fuera de las únicas porque con mezclas al azar sale vacía.
- **Se pueden recuperar.** La pieza es su semilla: quien la anote y la escriba en el generador de la guía (con todo en «Al azar») la vuelve a ver idéntica. Lo que no pasa es que la galería la vuelva a sacar sola.
- **Lo de antes no cambió.** Las semillas chicas dan exactamente lo de siempre; comprobado con las doce del kit, pixel por pixel.
- **Probado:** dos visitas seguidas: las 33 primeras idénticas, y de ahí en adelante ninguna semilla en común.
- **Los límites, dichos con honestidad:** si un equipo tiene el reloj muy mal puesto, su semilla podría caer en un instante pasado; aun así tendría que coincidir también en los 12 bits. Y dos piezas únicas pueden parecerse (misma figura, tonos cercanos), pero no ser la misma.

### 9.74 Gameplay: el juego se filma solo

**Lo que pidió Ricardo.** Una categoría después de Galería, «Gameplay»: tomas de 6 segundos de juego que queden como GIF, en distintos lugares, siempre perforando, pasando por distintos elementos, ganando puntos y descubriendo secretos. Unas 33 por lo pronto y, si se puede, por semilla y creadas en el navegador.

**Cómo quedó.** `mina.capitaltorreon.com/gameplay`.
- **No hay videos.** Lo que se ve es el juego de verdad, corriendo en el navegador de quien mira: la misma física, el mismo taladro y el mismo dibujo. Seis segundos de juego se filman en una o dos décimas de segundo.
- **El modo cine** (`/?foto=cine`, al final de `juego.js`). El juego recibe una receta por mensaje, monta un mundo de esa semilla, pone la maquinita en un buen punto, le da el equipo que corresponde a esa profundidad (el menor taladro con el que cada celda tarda dos décimas o menos) y la deja jugar con un **piloto**: parado y sin perforar, suma el valor de lo que hay hacia abajo y hacia cada lado, y se va por donde hay más. No sube. La dificultad va en «Paseo» para que nada la mate a media toma.
- **Cinco clases de toma:** *calle* (los primeros metros, junto al pueblo), *veta* (la columna con más mineral cerca de una profundidad), *tesoro* (igual, pero buscando cofres, huesos y reliquias), *lugar* (los tres grandes y los once rincones; el Corazón no, para no contar el final) y *franja* (las dos filas de gemas escondidas a 3,332 y 6,666 m).
- **El rótulo, dentro de la imagen:** MINA y la liga arriba a la izquierda, siempre; arriba a la derecha lo ganado en la toma, que va subiendo; abajo, el lugar y los metros. El corte entre el final y el principio se funde a negro tres décimas.
- **Aislado a propósito.** El juego corre en marcos con `sandbox="allow-scripts"`: sin acceso al almacenamiento ni a la sesión del sitio, y además el modo cine no escribe, no se conecta y no sube nada. Ver gameplay no puede alterar la partida de nadie.
- **Cámara y proyectores.** Un marco escondido saca las fotos y los GIF; hasta ocho más (cuatro en celular) se ponen encima de las tomas más cercanas al centro de la pantalla y las juegan en vivo. Cada motor usa unos 10 MB.
- **Las 33 fijas:** se filmaron 40 candidatas y se revisaron. Hay calle, los tres lugares grandes, los once rincones, las dos franjas, cuatro de tesoros y vetas de todas las zonas, de 90 a 9,300 m.
- **Después, únicas.** La semilla es el instante en que nace la toma más 12 bits al azar; de sus dos mitades salen por separado el azar de la toma y el mundo donde ocurre. No se repiten.
- **Descarga:** GIF de 432 × 768, 6 segundos, 100 cuadros, unos 10 MB, armado en el navegador en menos de un segundo con el mismo armador de la galería (`ArteMina.armador`).
- **Un tropiezo que conviene recordar:** «gameplay» son ocho letras válidas para una liga de mundo, así que el Worker y el juego la tomaban por un mundo. El Worker ahora la sirve antes de esa regla, y el service worker y la guardia de `index.html` la dejan pasar.
- **Ligas:** Galería y Gameplay se enlazan entre sí en la barra; además están en la guía de estilos (menú, atajos, franja y pie) y en el juego (Menú → Arte y Ayuda).
- **Qué falta:** el GIF pesa 10 MB porque la cámara se mueve y cambia toda la imagen en cada cuadro; el video (MP4) pesaría veinte veces menos y es lo que piden TikTok y Reels. El piloto casi siempre baja derecho: se le pueden enseñar más jugadas (volar, usar dinamita, entrar a un edificio).

### 9.76 Galería: modo limpio (5-oct-2026)

**Qué pidió Ricardo:** un ojito para dejar la galería limpia —solo las imágenes y los GIF, sin botones de descargar ni letreros— y poder grabar la pantalla haciendo scroll.

**Cómo quedó:** el botón **👁 Limpio** de la barra (o abrir `/galeria?limpio`) esconde el encabezado, la barra, los pies de cada pieza, las etiquetas IMAGEN/GIF, el aviso de «únicas» y el botón de subir; quedan solo las piezas sobre fondo oscuro. El filtro escogido (Todo, Imágenes o GIF) se respeta, la pieza que estaba arriba se queda en su lugar, el scroll sin fin sigue, un clic ya no abre la vista en grande y el puntero se esconde si no se mueve. Se sale con **Esc**, con **doble clic** o por la esquina de arriba a la derecha (un ojo que solo aparece al pasar el puntero). Pantalla completa quedó para después.

### 9.75 Ritmo: gameplays con música (5-oct-2026)

**Qué pidió Ricardo:** gameplays con sonido y con ritmo, «como una canción clásica, alegre»; unas tres canciones; sincronizar el sonido con la maquinita, con el movimiento y con el mineral; escenas completas de 8 a 12 segundos; con su propia categoría y su propio creador. Es un anuncio: nadie juega así de parejo y está bien. Son la primera pieza del «video del día» (1. un ritmo · 2. un GIF · 3. una foto · 4. cierre).

**Dónde está:** [mina.capitaltorreon.com/ritmo](https://mina.capitaltorreon.com/ritmo) — `publico/ritmo.html` (la página y el creador) y `publico/ritmo.js` (las canciones y el sonido). En el juego, el modo cine ganó la toma `l: 'ritmo'`.

**Las canciones** (dominio público; tocadas por un sintetizador propio, sin archivos de audio):

| Canción | Autor | Tempo | Dura | Celdas | Lugar de fábrica |
|---|---|---|---|---|---|
| Himno a la alegría | Beethoven | 192 | 11.75 s | 31 | La Corteza, 300 m |
| Can-can (el tema y, de remate, sus últimos cuatro compases una octava arriba) | Offenbach | 176 | 10.6 s | 49 | Las Cavernas, 2,600 m |
| Pequeña serenata nocturna (los dos últimos compases son un remate nuestro) | Mozart | 144 | 11.75 s | 45 | La Cristalera, 4,600 m |
| Marcha turca (la primera frase) | Mozart | 132 | 9.0 s | 41 | La Cristalera, 4,600 m |
| Guillermo Tell (el galope del final) | Rossini | 152 | 8.5 s | 43 | Las Cavernas, 2,600 m |
| La primavera (los dos temas del principio) | Vivaldi | 126 | 11.5 s | 46 | La Corteza, 300 m |
| Minueto en sol (compases 1 a 4 y 13 a 16) | Bach (Petzold) | 152 | 10.8 s | 43 | El Acuífero, 1,400 m |
| En la gruta del rey de la montaña (dos vueltas; la segunda, una octava arriba y cerrando en si) | Grieg | 192 | 11.75 s | 61 | La Zona de presión, 8,600 m |
| Jesús, alegría de los hombres (la última nota baja a sol para cerrar) | Bach | 240 | 9.5 s | 30 | La Cristalera, 4,600 m |

**Las seis últimas** se agregaron el mismo día en una segunda vuelta (commit #107), cada una con una sola toma fija. Para ellas el acompañamiento aprendió acordes menores, compás de tres y anacrusa (`ana`), y el camino puede ser de 3 celdas de ancho (`ancho`). En las canciones en menor las gemas se cuentan desde su relativo mayor; las notas fuera de la escala son diamantes. Agregar una canción es un renglón en `CANCIONES`.

**Dos versiones completas** (commit #108; Ricardo pidió «toda la canción completa» de las dos que más le gustaron):

| Versión completa | Dura | Celdas | Cómo está armada |
|---|---|---|---|
| En la gruta del rey de la montaña | 1:40 | 601 | Como la pieza de Grieg: el tema de 4 compases 18 veces, en tres ciclos (si, si, fa♯, fa♯, si, si); el segundo y el tercero una octava arriba, el tercero con la melodía doblada. Acelera de 138 a 270 y crece: empieza con puro bajo y va sumando bombo, palmadas y volumen. El bajo es de pedal (quintas sin tercera), como el original. **El final es un arreglo nuestro** (golpes, una escala que sube corriendo y el último si). La frase en fa♯ está escrita de memoria. Baja 300 m y junta $700 M. |
| Jesús, alegría de los hombres | 57 s | 213 | El tema entero de ocho compases, tres veces: como empieza, una octava arriba y de regreso con la octava doblada, frenando al final. **No es el movimiento completo de Bach**: falta el coral, que no se puede escribir de memoria con seguridad. Cabe en un reel de 60 s. |

Para las largas: `bpm` puede ser un mapa `[[tiempo, bpm], …]` (`relojDe` lo integra), `crece` y `doblaDesde`; `programa` va programando los sonidos tres segundos por delante en vez de todos de golpe; en el juego, `cineDirector` pasa a la cuenta lo ganado cuando la bodega se va a llenar (si no, a media canción las gemas ya no se cobrarían); el video baja a 5 Mbps. Medido en los dos videos grabados: imagen y sonido a 17 milésimas, igual al principio que al final (no se desfasa con el tiempo).

**Cómo se sincroniza.** `RitmoMina.compilar(clave)` saca de la misma partitura dos cosas con los mismos tiempos: lo que suena y los `pasos` que sigue la maquinita (`{ t: segundo exacto, g: gema o −1 }`). Cada nota es una celda con su gema, según su grado en la escala: do rubí, re topacio, mi oro, fa esmeralda, sol aguamarina, la zafiro, si amatista. Lo que una nota dura de más, y los silencios, son celdas de tierra: el taladro no para. En el juego, `cineRitmo` limpia una caja de tierra y traza el camino en serpiente (4 celdas de ancho: tres de lado y una hacia abajo), y `cineDirector` perfora cada celda **en el tiempo que falta para su nota** (`yo.perf.dur = nota − ahora`). Por eso llega siempre a tiempo y no acumula desfase. Con la última gema cae la última nota: chispas, onda, lo ganado en grande y «Juega gratis · mina.capitaltorreon.com».

**El reloj.** El juego corre en un marco del mismo sitio (`/?foto=cine`; ahí el juego usa un `localStorage` de mentiras, no se conecta y no guarda) y en cada cuadro pregunta `parent.__ritmoReloj()`: en qué segundo va la canción según el reloj del audio. Si se atrasa, se pone al corriente sin pintar; si el reloj regresa, la toma vuelve a empezar.

**El video.** `MediaRecorder` sobre `lienzo.captureStream(30)` + la misma mezcla que se oye. MP4 (H.264 + AAC) de 720 × 1280 y unos 10 MB en Chrome y Safari; WebM en Firefox. Se graba en tiempo real: tarda lo que dura la canción.

**Lo que se midió.** Llegada a cada celda contra su nota, dentro del juego: 8 milésimas como máximo (un paso de física). Las 1,007 notas de las once piezas, afinadas (se comprobó el tono de cada una en el audio ya armado). En el archivo grabado: la imagen queda a entre −15 y +6 milésimas del sonido en promedio; volumen pico 0.92, medio 0.15–0.17. Celular de 390 px: sin desbordes.

**Lo que no se pudo probar:** escucharlo (las pruebas son sin bocinas: se midió, no se oyó) y grabar en Safari de iPhone.

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
