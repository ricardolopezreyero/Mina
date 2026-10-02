# DOCUMENTO MAESTRO · «Mina» · v2

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
| Paso de la física | Fijo, de 1/120 de segundo como máximo: se mueve igual a 30 que a 144 cuadros |
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
| Descarga inicial ≤ 150 KB comprimida | **31.5 KB** (página 2.9 + juego 28.6) |
| 3 solicitudes o menos | **2** |
| Trabajo por cuadro < 4 ms | **0.68 ms** de dibujo en un lienzo de 2048 × 1536; la física no llega a 0.01 ms |
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

## 7. Revisión de código del 2 de octubre

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

## 8. Decisiones que te tocan

1. **Parado en la superficie no se gasta combustible.** Lo puse porque un jugador nuevo explotaba leyendo la bienvenida. El original sí gasta. Recomiendo dejarlo.
2. **Se entra a los edificios con ↓**, no al pasar. Con cinco edificios seguidos, entrar al pasar estorbaba. Recomiendo dejarlo.
3. **Las maquinitas se atraviesan** y **la dificultad es del mundo**, como quedó en el prompt.
4. **El servidor confía en el dinero que reporta cada navegador.** Recomiendo corregirlo antes de cualquier tabla mundial (etapa 3).
5. **Abundancia de amazonita**: salen unas 320 por mundo, casi todas en los últimos 250 m. Sin la estación siguiente que cobre $50 millones, el final de la capa 1 queda sobrado de dinero. Se ajusta con el simulador.

<!-- RLR · Ricardo López Reyero -->
