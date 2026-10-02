# PROMPT MAESTRO · «Mina» · v4

Juego de minería para navegador inspirado en Motherload (XGen Studios, 2004), pero **infinito**, **compartido con amigos en tiempo real**, **ligerísimo** y **hecho para enganchar**.

- Repositorio: https://github.com/ricardolopezreyero/Mina (público, vacío hoy)
- Carpeta local: `/Users/ricardolopezreyero/Desktop/HTML/Mina`
- Dominio final: `mina.capitaltorreon.com`
- Condiciones fijas: 100 % navegador, 100 % gratis, sin registro, sin instalar nada.

---

## 0. Qué quiero en esta etapa

**SOLO el documento maestro. NO escribas código del juego todavía.**

Este prompt ya trae la investigación y el diseño de partida. Tu trabajo es:

1. **Verificar** lo marcado como «por verificar» (juega el original en CrazyGames y mira partidas en YouTube para lo que la wiki no dice).
2. **Completar** lo que aquí se deja con regla y ejemplos (historias de las mejoras de las capas 2 y 3, lista de logros, textos de contratos, mensajes entre el juego y el mundo compartido).
3. **Calibrar** los números marcados como «nuestros» con un simulador de economía. Ese simulador es lo único que puedes programar en esta etapa.
4. **Entregar** el documento maestro, guardado en la carpeta local y subido al repositorio.

**Producto mínimo viable** = la capa 1 completa (sección 3) + mundos compartidos (sección 7) + opciones y dificultad (sección 8) + los topes de ligereza (sección 9) + la gamificación 5.1 a 5.7 y 5.9.

Regla de oro: **no supongas nada**. Si un dato no está aquí ni lo pudiste verificar, anótalo en la lista de dudas con tu recomendación; no lo inventes en silencio.

Cada número lleva su origen:

- **[O]** dato del juego original, confirmado en la wiki de Motherload. No se cambia.
- **[V]** dato del original que no pude confirmar. Por verificar.
- **[N]** número nuestro, de diseño. Es valor de partida y se calibra.

---

## 1. Las seis ideas que mandan

Si algo de este documento choca con estas seis ideas, ganan ellas.

1. **Nunca se acaba.** Siempre hay un mineral más valioso abajo y una mejora más cara arriba.
2. **Engancha de forma espectacular.** El jugador siempre tiene una compra que casi le alcanza, una meta a la vista y una razón para hacer «un viaje más».
3. **Empieza fácil y sube muy poco a poco.** Los primeros metros y las primeras capas son amables. La dificultad crece de forma tan gradual que el jugador siente que él mejora, no que el juego lo castiga.
4. **Los números se mantienen con sentido.** El dinero crece **× 10 por capa**, no más. Nada de cifras absurdas.
5. **Se juega acompañado.** Mando una liga y mis hermanos entran al mismo mundo; nos vemos excavar en tiempo real. Tiene que funcionar bien desde la primera vez.
6. **Es ligerísimo.** El original era pesadísimo. El nuestro abre al instante y corre fluido en cualquier máquina.

---

## 2. Cómo se mide la profundidad

- Unidad: **metros y kilómetros** (el original usa pies).
- El mundo se divide en **capas**. Cada capa mide **500 celdas de hondo por 96 de ancho** [N].
- **El ancho son tres pantallas.** Una laptop de 15 pulgadas muestra unas 32 celdas de lado a lado; el mundo mide 96. Es tres veces más ancho que el original (592 × 32 [O]) para que varios jugadores quepan sin estorbarse. No crece más que eso: el juego es hacia abajo.
- **Capa 1 = de 0 a 1 km** (2 m por celda). **Esta capa es el producto mínimo viable.**
- Cada capa siguiente **duplica** la profundidad: capa 2 va de 1 a 2 km, capa 3 de 2 a 4 km, capa 4 de 4 a 8 km… Siempre son 500 celdas; cambia cuántos metros cuenta el altímetro por celda.
- **El kilómetro 1,000,000 se alcanza dentro de la capa 21.** Después el juego sigue igual, sin tope.
- Conversión del original a la capa 1: metros = pies × 0.137.

---

## 3. CAPA 1 — el producto mínimo viable, completo

Réplica fiel de la mecánica del original, con nombres, historia y gamificación propios. Todo lo de esta sección debe funcionar perfecto antes de pensar en la capa 2.

### 3.1 Movimiento y física

- Vista lateral. El equipo se mueve con flechas o WASD [O].
- Perfora **hacia abajo, a la izquierda y a la derecha**. **Nunca hacia arriba** [O].
- Solo perfora hacia los lados si está parado sobre suelo firme [O].
- Vuela hacia arriba con su hélice; no perfora mientras vuela [O].
- El peso frena el vuelo: a más carga, sube más lento, hasta que la hélice solo alcanza a frenar la caída [O].
- La tierra se endurece con la profundidad; un taladro mejor lo compensa [O]. La curva exacta no está documentada: **por verificar en video**. Meta de calibración [N]: con taladro de fábrica una celda de superficie tarda ~0.6 s; con el taladro tope una celda del fondo tarda ~0.5 s; con taladro de fábrica en el fondo, ~3 s.
- Bajar de la superficie al fondo con todo el equipo tope toma 8–9 minutos en el original [O].

### 3.2 Minerales (los 10, completos)

Se venden en la Báscula. Cada pieza ocupa 1 espacio de bodega [O]. Una celda con mineral nunca esconde gas [O]. Con la bodega llena, el mineral perforado **se pierde** [O]. El jugador puede tirar piezas desde el inventario [O].

| # | Nuestro nombre | En el original | Valor [O] | Peso [O] | Aparece desde | Común desde |
|---|---|---|---|---|---|---|
| 1 | Hierro | Ironium | $30 | 10 kg | 2 m | 2 m |
| 2 | Cobre | Bronzium | $60 | 10 kg | 2 m | 2 m |
| 3 | Plata | Silverium | $100 | 10 kg | 2 m | 2 m |
| 4 | Oro | Goldium | $250 | 20 kg | 2 m | 35 m |
| 5 | Platino | Platinium | $750 | 30 kg | 110 m | 230 m |
| 6 | Einstenio | Einsteinium | $2,000 | 40 kg | 220 m | 355 m |
| 7 | Esmeralda | Emerald | $5,000 | 60 kg | 330 m | 550 m |
| 8 | Rubí | Ruby | $20,000 | 80 kg | 550 m | 660 m |
| 9 | Diamante | Diamond | $100,000 | 100 kg | 600 m | 780 m |
| 10 | Amazonita | Amazonite | $500,000 | 120 kg | 750 m | 850 m |

«Común» = cuando ya se ven dos en una misma pantalla. Hay mucho azar: de vez en cuando aparece uno fuera de su zona [O]. Los baratos siguen apareciendo abajo, cada vez menos.

### 3.3 Hallazgos especiales (los 4)

Muy raros: 1 o 2 por cada 140 m de descenso. **No dependen de la profundidad.** **Pagan al instante** y no ocupan bodega [O].

| Nuestro nombre | En el original | Paga [O] |
|---|---|---|
| Huesos de dinosaurio | Dinosaur Bones | $1,000 |
| Cofre del tesoro | Treasure | $5,000 |
| Esqueleto antiguo | Martian Skeleton | $10,000 |
| Reliquia sagrada | Religious Artifact | $50,000 |

### 3.4 Combustible

- Precio: **$1 por litro** [O].
- Consumo: ~5 L/min parado, ~17 L/min volando hacia arriba sin carga, más al perforar [O]. El tanque de fábrica dura ~30 segundos perforando [O] (~20 L/min [V]).
- **Sin combustible, el equipo explota** [O]. Es ajustable por mundo (sección 8).
- El consumo se detiene en pausa y dentro de los edificios [O].
- El jugador empieza con **$20 y el tanque casi vacío**: lo primero que hace es cargar [O].

### 3.5 Casco y daño

- La vida no se regenera sola. Reparar cuesta **$15 por punto** [O]. Comprar casco nuevo lo deja lleno; comprar tanque nuevo lo deja lleno [O].
- **Daño por caída** [O]:

| Altura de caída | Daño |
|---|---|
| menos de 2 celdas | 0 |
| 2 a 3 celdas | 3 |
| 3 a 5 celdas | 4 |
| 5 a 9 celdas | 5 |
| 9 a 17 celdas | 6 |
| 17 a 46 celdas | 7 |
| más de 46 celdas | 8 |

- **Piedra**: desde ~210 m y cada vez más. **No se puede perforar**; se rodea o se vuela con explosivos [O].
- **Lava**: desde ~410 m. **Se ve**, así que se puede evitar. Perforarla hace **58 o 41 de daño**, reducido por el radiador [O].
- **Gas**: desde ~650 m, rarísimo hasta ~680 m, donde aumenta de golpe; casi inevitable entre 890 y 960 m [O]. **Es invisible.** Al perforarlo explota en verde [O].
  - Daño = (profundidad en metros − 410) ÷ 2.05 × (1 − reducción del radiador) [O, convertido]. Sin radiador: 117 a 650 m, 213 a 850 m, 287 en el fondo.
- Los explosivos eliminan piedra, lava y gas **sin dañar al jugador**, pero también destruyen minerales y hallazgos [O].

### 3.6 Mejoras del equipo minero — nombre, historia y efecto

Seis piezas, seis niveles cada una. Se compran en el Taller. Se puede comprar cualquier nivel sin pasar por los anteriores [O]. Precios y valores son los del original [O], salvo los dos renglones [N].

**Cada mejora debe mostrar en la tienda su nombre, su historia en una línea y su efecto en números («antes → después»).** La historia le dice al jugador qué va a cambiar en su siguiente viaje.

**TALADRO — con qué muerdes la tierra.** Más potencia = menos tiempo y menos combustible por celda.

| Nivel | Nombre | Precio | Potencia | Historia |
|---|---|---|---|---|
| 0 | Broca de fábrica | — | 20 [V] | Venía con el equipo. Muerde tierra suelta y se queja con todo lo demás. |
| 1 | Broca Platera | $750 | 28 | Punta bañada en plata: corta limpio y casi no se calienta. El primer lujo de todo minero. |
| 2 | Broca Dorada | $2,000 | 40 | Su aleación de oro disipa el calor; ya no hay que parar a enfriar. Se nota desde la primera celda. |
| 3 | Corona de Esmeralda | $5,000 | 50 | Un anillo de dientes de esmeralda. Donde la tierra se aprieta, ella apenas lo nota. |
| 4 | Colmillo de Rubí | $20,000 | 70 | Un solo cristal afilado que perfora en espiral y avienta la tierra hacia atrás. |
| 5 | Punta de Diamante | $100,000 | 95 | Lo más duro que se conocía, hasta que alguien bajó más. |
| 6 | Lanza de Amazonita | $500,000 | 120 | Vibra al ritmo de la roca y la deshace antes de tocarla. De la superficie al fondo en ocho minutos. |

**CASCO — cuánto castigo aguantas.** Más vida = más margen para caídas, lava y gas.

| Nivel | Nombre | Precio | Vida | Historia |
|---|---|---|---|---|
| 0 | Lámina de fábrica | — | 10 | Aguanta un tropezón. No dos. |
| 1 | Blindaje de Hierro | $750 | 17 | Placas remachadas a mano. Perdona una mala caída. |
| 2 | Coraza de Cobre | $2,000 | 30 | Más gruesa y más flexible: se abolla, pero no se rompe. |
| 3 | Armadura de Acero | $5,000 | 50 | La primera que sale viva de un baño de lava. |
| 4 | Bóveda de Platino | $20,000 | 80 | No se oxida, no se derrite y casi no se entera de las caídas. |
| 5 | Caparazón de Einstenio | $100,000 | 120 | El mínimo para sobrevivir a una bolsa de gas. Sin él, la zona honda es una ruleta. |
| 6 | Escudo de Energía | $500,000 | 180 | Ya no es metal: es un campo que envuelve al equipo. |

**MOTOR — cuánto peso subes y qué tan rápido.** Más caballos = regresas cargado sin arrastrarte.

| Nivel | Nombre | Precio | Caballos | Historia |
|---|---|---|---|---|
| 0 | Motor de fábrica | — | 150 | Sube. Despacio, pero sube. |
| 1 | «Mulita» V4 1.6 | $750 | 160 | Terca y confiable. Levanta media bodega sin protestar. |
| 2 | «Coyote» V4 turbo | $2,000 | 170 | El turbo silba al despegar. Regresas antes y gastas menos en el camino. |
| 3 | «Toro» V6 | $5,000 | 180 | Ya levanta platino sin arrastrarse. |
| 4 | «Bisonte» V8 supercargado | $20,000 | 190 | Para cuando la bodega pesa más que el propio equipo. |
| 5 | «Mamut» V12 | $100,000 | 200 | Sube con diamantes como si fueran grava. |
| 6 | «Titán» V16 | $500,000 | 210 | El único que despega con treinta amazonitas a bordo. Apenas. |

El equipo solo pesa 1,980 kg [O]. Con el mejor motor, despegar con 5,800 kg totales es muy difícil y con 6,200 kg imposible [O]. Regla de partida [N]: peso máximo que puede subir = caballos × 29.5 kg.

**TANQUE — cuánto tiempo puedes estar abajo.** Más litros = viajes más largos y más hondos.

| Nivel | Nombre | Precio | Litros | Historia |
|---|---|---|---|---|
| 0 | Bidón de fábrica | — | 10 [V] | Treinta segundos perforando. No le quites el ojo al medidor. |
| 1 | «Cantimplora» | $750 | 15 | Medio viaje más de aire. La compra más barata que salva vidas. |
| 2 | «Barril» | $2,000 | 25 | El que los veteranos recomiendan comprar primero. |
| 3 | «Cisterna» | $5,000 | 40 | Ya puedes pasearte de lado buscando vetas, no solo bajar y subir. |
| 4 | «Pipa» | $20,000 | 60 | Alcanza para llegar a la zona de lava y volver. |
| 5 | «Leviatán» | $100,000 | 100 | Un viaje al fondo, ida y vuelta, sin rezar. |
| 6 | «Océano» de compresión líquida | $500,000 | 150 | Comprime el combustible hasta volverlo casi sólido. Te cansas tú antes que el tanque. |

**RADIADOR — cuánto calor te quitas de encima.** Reduce el daño de lava y gas.

| Nivel | Nombre | Precio | Reducción | Historia |
|---|---|---|---|---|
| 0 | Sin radiador | — | 0 % | El calor entra completo. |
| 1 | Abanico [N] | $750 | 5 % | Un ventilador. Es poco, pero es algo. |
| 2 | Doble Abanico | $2,000 | 10 % | Dos aspas girando en contra. Le quita el filo a la lava. |
| 3 | Turbina | $5,000 | 25 % | Con ella y una Armadura de Acero, la lava deja de ser mortal. |
| 4 | Doble Turbina | $20,000 | 40 % | Saca el calor más rápido de lo que entra. Casi. |
| 5 | Circuito Criogénico | $100,000 | 60 % | Lo que hace falta para aguantar el gas del fondo. |
| 6 | «Corazón de Hielo» | $500,000 | 80 % | La lava se vuelve una molestia y el gas, un susto. |

**BODEGA — cuánto te llevas por viaje.** Más espacios = más dinero por cada bajada.

| Nivel | Nombre | Precio | Espacios | Historia |
|---|---|---|---|---|
| 0 | Canasta | — | 7 | Siete piezas y a subir. |
| 1 | Cajón | $750 | 15 | El doble de carga: cada viaje ya paga algo. |
| 2 | Vagoneta | $2,000 | 25 | Deja de doler pasar junto a una veta sin poder cargarla. |
| 3 | Tolva | $5,000 (la wiki dice $50,000; parece errata, verificar) | 40 | Un viaje bueno ya compra una mejora completa. |
| 4 | Contenedor | $20,000 | 70 | Empieza a pesar: pídele más al motor. |
| 5 | Bodega Leviatán | $100,000 | 120 | Vacías una veta entera de una sola pasada. |
| 6 | Bodega Colosal [N] | $500,000 | 175 | Cabe más de lo que el motor levanta. El límite ya no es el espacio: es el peso. |

Orden que conviene en el original [O]: primero tanque, luego taladro; casco y radiador importan cuando aparecen lava y gas; el motor, cuando la carga ya pesa. **El juego no debe decirle esto al jugador de golpe: que lo descubra, guiado por las historias.**

### 3.7 Objetos consumibles (los 6)

Se compran en el Almacén. **No pesan y no hay límite** [O].

| Objeto | Efecto [O] | Precio [O] | Tecla [O] | Cuándo [O] | Historia |
|---|---|---|---|---|---|
| Tanque de reserva | +25 litros | $2,000 | F | Siempre | Un respiro embotellado. No se abre solo: acuérdate de él. |
| Nanobots reparadores | +30 de vida | $7,500 | R | Siempre | Un enjambre que suelda el casco desde adentro mientras sigues trabajando. |
| Dinamita | Destruye 3 × 3 celdas | $2,000 | X | Tocando suelo | Abre paso donde el taladro no entra. También borra lo valioso: mira antes de prender. |
| Explosivo plástico | Destruye 5 × 5 celdas | $5,000 | C | Tocando suelo | Lo mismo, pero sin sutilezas. |
| Teletransportador cuántico | Lleva a la superficie; puede lanzarte por el aire (5–9 de daño) | $2,000 | Q | Tocando suelo | Barato y brusco. Llegas, pero no siempre de pie. |
| Transmisor de materia | Lleva a la superficie sin riesgo | $10,000 | M | Tocando suelo | Caro y elegante. Apareces junto a la gasolinera sin un rasguño. |

El tanque de reserva **no se usa solo**: si el jugador no lo activa a tiempo, explota igual [O].

### 3.8 La superficie

De izquierda a derecha:

1. **Gasolinera** — carga combustible [O].
2. **La Báscula** — compra toda la carga de un clic [O].
3. **El Taller** — las 6 piezas del equipo [O].
4. **El Almacén** — repara el casco y vende los 6 objetos [O].
5. **La Remineralizadora** — vuelve a llenar de mineral todo el tablero [N] (ver 3.9).

El suelo bajo los edificios es indestructible [O]. El juego **se guarda solo y todo el tiempo** dentro del mundo (sección 7) [N].

### 3.9 Remineralizar — volver a llenar el tablero [N]

El tablero de una capa es finito: tarde o temprano el jugador lo deja sin mineral. **Remineralizar lo llena otra vez, completo.**

- Se hace en la Remineralizadora, con confirmación.
- **En un mundo compartido** lo paga quien lo activa; todos ven una cuenta regresiva de 10 segundos y quien esté bajo tierra sube a la superficie con su carga intacta.
- **Regenera toda la capa**: tierra nueva, minerales nuevos, hallazgos nuevos, peligros en lugares nuevos. Los túneles se cierran.
- **No toca nada más**: dinero, equipo, objetos, récords, logros y estaciones se conservan.
- Costo: **10 piezas del mineral más valioso que el jugador haya vendido en esa capa** (si lo mejor que ha vendido es oro, cuesta $2,500; si es amazonita, $5 millones). **La primera vez es gratis.**
- Debe sentirse como un premio, no como un trámite: animación de la tierra rellenándose, vetas brillando un instante, sonido propio.
- Reemplaza al sismo del original, que regeneraba el subsuelo al azar y sin avisar [O]. Aquí lo decide el jugador.

### 3.10 Mensajes y bonos por profundidad

Transmisiones al cruzar cada marca por primera vez [O]. Texto e historia propios.

| Profundidad | Qué pasa |
|---|---|
| Inicio | Bienvenida: «carga combustible» |
| 70 m | Felicitación + **bono de $1,000** |
| 140 m | Felicitación + **bono de $3,000** |
| 240 m | Mensaje misterioso de otro minero |
| 290 m | Otro minero saluda |
| 340 m | Grito de auxilio |
| 425 m | Aviso: hay lava, compra radiador |
| 480 m | Felicitación + **bono de $25,000** + aviso de gas |
| 560 m | El otro minero queda atrapado |
| 615 m | Alguien encontró «la veta madre»… y grita |
| 795 m | El altímetro falla y te ordenan regresar |
| 1,000 m | Fondo de la capa 1 |

Los dos primeros bonos valen más que todo lo que se saca al principio: **premian bajar derecho** [O].

### 3.11 Pantalla, controles y guardado

- Medidores siempre visibles: combustible, casco, profundidad, dinero, bodega (usados/total) [O].
- Avisos: combustible bajo, bodega llena, daño recibido [V].
- Inventario con opción de tirar piezas [O].
- Pausa: en el original el combustible no corre en pausa [O]. Aquí el mundo compartido no se detiene, pero **tu maquinita sí**: se congela y no gasta (sección 7.3).
- Controles del producto mínimo: teclado. Táctiles: etapa posterior.
- **Todo se guarda en el mundo, no en el navegador**: los túneles y, de cada jugador, su dinero, equipo, objetos, carga, posición, récords y logros (sección 7). En el navegador solo quedan la llave de la maquinita, la lista «Mis mundos» y las opciones personales.

### 3.12 Lo que el original tiene y NO entra al producto mínimo

- **Jefe final** en dos fases que solo se vence con explosivos y paga $28,500,000 [O]. Nuestro juego no tiene final; queda pendiente decidir si cada capa tendrá un guardián.
- **Planos antiguos** (edición de paga): mejoras secretas enterradas — tanque que se recarga con gas, teletransporte ilimitado, radiador que gana dinero con la lava, taladro que perfora piedra, bodega infinita, casco que se regenera [O]. Entran como **mejoras legendarias** desde la capa 2.
- **Retos contra reloj** (edición de paga) [O]. Etapa posterior.

---

## 4. LA CURVA DE DIFICULTAD — fácil al principio, sube muy poco a poco [N]

> **Regla: una sola cosa nueva a la vez, y nunca antes de que la anterior ya sea rutina.**

### 4.1 Dentro de la capa 1

| Tramo | Qué aprende el jugador | Qué hay |
|---|---|---|
| 0 – 70 m | El ciclo: bajar, cargar, subir, vender, cargar combustible | Solo tierra y minerales baratos. **Nada hace daño salvo caer.** |
| 70 – 210 m | A elegir compras y a cuidar el tanque | Oro y platino. Los dos primeros bonos. |
| 210 – 410 m | A rodear obstáculos y a usar dinamita | Aparece la piedra. |
| 410 – 650 m | A leer el terreno y a valorar casco y radiador | Aparece la lava (se ve). |
| 650 – 1,000 m | A arriesgar con cabeza | Aparece el gas (no se ve). La zona más rica y más peligrosa. |

### 4.2 Red de protección del principiante

Estas son las reglas del modo **Clásico**. Los otros modos y el ajuste de cada causa de muerte están en la sección 8.

- **Los primeros 3 rescates son gratis**: si explota, reaparece en la superficie sin perder nada más que la carga.
- Después, en la capa 1: pierde la carga y paga reparación completa y tanque lleno. (El original regresa al último guardado [O]; esto es más amable.)
- Alarma de combustible al 25 %, con una flecha hacia arriba la primera vez.
- Los primeros contratos son el tutorial (ver 5.2): enseñan haciendo, sin pantallas de texto.

### 4.3 De capa en capa

- Cada capa agrega **un solo peligro nuevo**. En el primer 20 % de la capa no aparece; después aparece poco y va aumentando.
- El precio de cada mejora, medido en «piezas del mineral de su nivel», sube **muy despacio**: 30 piezas en la capa 2 y **2 piezas más por capa**, con tope de 60.
- El margen de combustible con el tanque adecuado baja de 20 % (capas 1–5) a 15 % (capas 6–10) y se queda en 10 % (capa 11 en adelante). Nunca menos.
- **Ninguna capa puede sentirse más de un 10 % más exigente que la anterior.** El simulador debe comprobarlo.

---

## 5. GAMIFICACIÓN — lo que deja al jugador enganchado [N]

> **Esta sección pesa tanto como la mecánica.** Un juego que funciona pero no engancha no me sirve.

Principios: metas cortas siempre a la vista, premios frecuentes y a veces inesperados, colecciones con huecos que piden llenarse, riesgo real de perder la carga, y celebrar cada avance con imagen y sonido.

### 5.1 Siguiente meta, siempre visible

En pantalla hay siempre tres barras de avance: **la mejora más cercana** («te faltan $120 para la Broca Platera»), **el siguiente bono de profundidad** y **tu récord de profundidad**. Al entrar al Taller, lo que casi alcanza se ve distinto de lo que está lejos.

### 5.2 Contratos

Tres contratos activos en el tablero de la estación. Al cumplir uno, paga y entra otro.

- Los **8 primeros van en orden fijo y son el tutorial**: cargar combustible → vender la primera carga → comprar la primera mejora → llegar a 70 m → regresar con la bodega llena → llegar a 140 m → usar una dinamita → vender un platino.
- Después rotan: «entrega 5 de platino», «baja a 300 m sin recibir daño», «regresa con menos del 10 % de combustible», «vende $50,000 en un solo viaje», «encuentra un hallazgo».
- Pago: entre 30 % y 50 % de lo que deja un viaje típico a la profundidad del jugador.

### 5.3 Rangos de minero

Un rango nuevo cada 100 m de récord en la capa 1. Subir de rango se celebra en pantalla y regala un objeto.

| Récord | Rango |
|---|---|
| 0 m | Aprendiz |
| 100 m | Peón |
| 200 m | Barretero |
| 300 m | Perforista |
| 400 m | Dinamitero |
| 500 m | Fogonero |
| 600 m | Capataz |
| 700 m | Gambusino |
| 800 m | Maestro minero |
| 1,000 m | Leyenda de la Corteza |

De la capa 2 en adelante: un rango por capa, con el nombre de la capa.

### 5.4 Logros con medalla

Al menos 30 en la capa 1. El documento maestro debe entregar la lista completa. Ejemplos:

- El primero de cada mineral (10) y de cada hallazgo (4).
- «Viaje perfecto»: bodega llena y cero daño.
- «Al filo»: llegar a la gasolinera con menos del 5 % de combustible.
- «Mi primer millón», «Equipo completo» (las seis piezas en nivel 6), «Tocar fondo».
- Secretos: no se anuncian hasta conseguirlos.

### 5.5 Catálogo

Una página por capa con sus minerales y hallazgos en silueta, que se revelan al descubrirlos, con cuántos ha vendido de cada uno. **Completar la página de una capa da +5 % permanente al precio de venta en esa capa.**

### 5.6 Premios dentro del viaje

- **Viaje perfecto**: bodega llena y cero daño = +10 % en esa venta.
- **Veta madre**: de vez en cuando (una por cada ~150 m de capa), un racimo de 3 × 3 del mejor mineral de la zona. El equipo emite un pitido que se acelera al acercarse: se busca con el oído.
- **Hallazgos**: los 4 del original, pagados al instante con celebración.
- **Mejoras legendarias** (capa 2 en adelante): los planos antiguos enterrados, una por capa.

### 5.7 Que se sienta

- La venta es una ceremonia: cada pieza cae en la báscula con su sonido y el contador de dinero sube girando.
- Mineral nuevo = tarjeta de «¡Descubriste…!» con su valor.
- Récord de profundidad = destello y aviso.
- Temblor de pantalla en explosiones y caídas; partículas al perforar; tono que sube al encadenar minerales.
- Página de estadísticas: profundidad máxima, total ganado, viajes, piezas por mineral, rescates.

### 5.8 Para que vuelvan (etapas posteriores al producto mínimo)

- **Contrato del día** y **racha de días** seguidos jugando.
- **Mineral en demanda**: cada día uno distinto se paga al doble.
- **Tabla mundial** de profundidad máxima.
- **Compartir récord** con imagen y liga.
- **Pinturas y adornos** para el equipo, que se ganan con logros.

### 5.9 Jugar acompañado

- **Tabla del mundo**: quién va más hondo y quién ha ganado más, siempre a la vista. Entre hermanos, esto engancha más que cualquier logro.
- **Avisos en vivo**: «Ana descubrió Diamante», «Luis llegó a 500 m», «Sofi compró la Punta de Diamante».
- **Señal**: una tecla deja una marca que todos ven durante 10 segundos («¡aquí hay algo!»).
- **Pasar combustible**: junto a otra maquinita, una tecla le pasa 5 litros. Rescatar a alguien que se quedó sin combustible vale un logro.
- **Fondo común** para la estación siguiente, con una barra que todos ven avanzar.
- **Logros de equipo**: «tres maquinitas bajo los 500 m al mismo tiempo», «el mundo completó el catálogo».

**Entra al producto mínimo:** 5.1 a 5.7 y 5.9. **Queda para después:** 5.8.

---

## 6. EL JUEGO INFINITO — capas 2 en adelante [N]

### 6.1 El dinero: × 10 por capa

Antes de fijar esto comparé tres opciones, viendo cuánto valdría el mineral más caro de cada capa:

| Crecimiento por capa | Capa 5 | Capa 10 | Capa 21 (km 1,000,000) |
|---|---|---|---|
| × 10,000 (versión anterior) | 5 seguido de 21 ceros | 5 seguido de 41 ceros | 5 seguido de 85 ceros |
| × 100 | 5 seguido de 13 ceros | 5 seguido de 23 ceros | 5 seguido de 45 ceros |
| **× 10 (elegido)** | **$5,000 millones** | 5 seguido de 14 ceros | 5 seguido de 25 ceros |

**Se queda × 10.** Durante las primeras capas —donde va a estar casi todo el mundo— las cifras son millones y miles de millones: se entienden. Como referencia, los juegos de este tipo suben el precio entre 7 % y 15 % por cada compra; nuestras mejoras suben × 2 o × 2.5 por nivel, tres niveles por capa.

Con un crecimiento tan suave, lo que evita que el jugador se quede a «ordeñar» una capa vieja es que **los tres mejores minerales de cada capa son la grava de la siguiente**: siempre conviene más bajar.

### 6.2 Qué trae cada capa nueva

- **3 minerales nuevos**, que valen 1, 2 y 5 veces la **unidad de la capa**. La unidad de la capa 2 es $1 millón y se multiplica por 10 en cada capa.
- En la capa se encuentran 6 minerales: los 3 nuevos y los 3 mejores de la capa anterior. Los nuevos aparecen al 15 %, 45 % y 75 % de la capa.
- **3 niveles nuevos de cada una de las 6 piezas** (18 compras por capa), con el nombre del mineral de su nivel y su historia.
- **Los 6 objetos** en versión de la capa.
- **Su propia estación**, con los 5 edificios, en el techo de la capa.
- Los peligros de la capa 1 en la misma proporción (piedra desde el 21 %, lava desde el 41 %, gas desde el 65 %) **más un peligro nuevo**.
- **3 bonos de profundidad**: al descubrir cada mineral nuevo, 10 piezas de ese mineral en efectivo.
- Una mejora legendaria enterrada, su página de catálogo, su rango y sus logros.

### 6.3 Precios en capas 2 en adelante

Todo se expresa en la **unidad de la capa (u)**: capa 2 = $1 millón, capa 3 = $10 millones, capa 4 = $100 millones…

| Qué | Precio |
|---|---|
| Minerales nuevos | 1 u, 2 u y 5 u |
| Mejora de primer, segundo y tercer nivel (cada pieza) | 30, 60 y 150 u en la capa 2. El «30» sube 2 por capa hasta 60 (ver 4.3) |
| Construir la estación siguiente | 500 u (100 piezas del mejor mineral) |
| Remineralizar | 10 piezas del mejor mineral vendido en la capa |
| Tanque de reserva / Dinamita / Teletransportador | 0.5 u |
| Explosivo plástico | 1.5 u |
| Nanobots | 2 u |
| Transmisor de materia | 3 u |
| Llenar el tanque del nivel adecuado | 1 u |
| Reparar por completo el casco del nivel adecuado | 2 u |

Ejemplo, capa 2: minerales de $1, $2 y $5 millones; mejoras de $30, $60 y $150 millones; estación siguiente, $500 millones.

La estación de la capa 2 cuesta **$50 millones** (100 amazonitas) y se desbloquea al tocar el fondo de la capa 1. Un **elevador gratuito** conecta todas las estaciones construidas. En un mundo compartido la estación se paga con un **fondo común**: cualquiera aporta y, al completarse, queda construida para todos.

### 6.4 Cómo crece el equipo y el terreno

- **Cada nivel nuevo mejora su pieza un 26 %; tres niveles = el doble.**
- **Cada capa exige el doble** que la anterior: tierra el doble de dura, daños al doble, consumo al doble, piezas de mineral del doble de tamaño y peso. Esa exigencia sube de forma continua a lo largo de la capa, no de golpe.
- Resultado: quien compra los tres niveles durante la capa llega a la siguiente **igual de fuerte que como terminó**. Quien se adelanta sin comprar, sufre. El equipo viejo nunca se vuelve inútil de un día para otro.
- Radiador: su reducción depende de cuántos niveles está por debajo del mejor radiador de la capa donde se usa: al día, 80 %; uno abajo, 60 %; dos, 40 %; tres, 25 %; cuatro, 10 %; cinco, 5 %; más, 0 %. (Es la misma escalera de la capa 1.)

### 6.5 Las 21 capas hasta el millón de kilómetros, con todos sus minerales

Notación: K = mil, M = millón, B = mil millones, T = billón (12 ceros); después aa (15 ceros), ab (18), ac (21), ad (24).

| Capa | Nombre | De – a (km) | Peligro nuevo | Minerales nuevos (1 u · 2 u · 5 u) | Unidad |
|---|---|---|---|---|---|
| 1 | Corteza | 0 – 1 | Piedra, lava y gas | Los 10 de la sección 3.2 | — |
| 2 | Acuífero | 1 – 2 | Celdas inundadas: frenan y gastan el doble | Aguamarina · Zafiro · Perla negra | 1 M |
| 3 | Cavernas | 2 – 4 | Grava que se derrumba al quitarle apoyo | Ónix · Topacio · Jade imperial | 10 M |
| 4 | Cristalera | 4 – 8 | Cristal que pide dos pasadas; geodas con 3 piezas | Amatista · Tanzanita · Alejandrita | 100 M |
| 5 | Zona de presión | 8 – 16 | Daño lento si el casco es débil | Paladio · Rodio · Osmio | 1 B |
| 6 | Horno | 16 – 32 | Calor ambiente sin radiador al día | Obsidiana · Ópalo de fuego · Corazón de magma | 10 B |
| 7 | Campo magnético | 32 – 64 | Vetas que jalan al equipo | Magnetita · Neodimio · Iridio | 100 B |
| 8 | Fosa oscura | 64 – 128 | Solo se ve un círculo de luz; bengalas | Azabache · Turmalina negra · Diamante negro | 1 T |
| 9 | Nido | 128 – 256 | Criaturas en los túneles | Ámbar · Marfil fósil · Huevo de cristal | 10 T |
| 10 | Zona sísmica | 256 – 512 | Sismos que cierran túneles | Tectita · Moldavita · Painita | 100 T |
| 11 | Mar de magma | 512 – 1,024 | Lava que fluye por los túneles | Peridoto · Benitoíta · Berilo rojo | 1 aa |
| 12 | Vacíos | 1,024 – 2,048 | Cavernas enormes, caídas largas | Piedra lunar · Pallasita · Fulgurita | 10 aa |
| 13 | Zona radiactiva | 2,048 – 4,096 | Las vetas ricas dañan al acercarse | Uranio · Plutonio · Californio | 100 aa |
| 14 | Hielo profundo | 4,096 – 8,192 | Túneles que se recongelan | Criolita · Zafiro de hielo · Hielo eterno | 1 ab |
| 15 | Gravedad pesada | 8,192 – 16,384 | Volar cuesta el doble | Tungsteno · Renio · Neutronio | 10 ab |
| 16 | Tormenta eléctrica | 16,384 – 32,768 | Descargas que roban combustible | Electro · Rayo fósil · Plasma cristalino | 100 ab |
| 17 | Antimateria | 32,768 – 65,536 | Bolsas que borran 5 × 5 celdas | Positronio · Antihierro · Antimateria estable | 1 ac |
| 18 | Laberinto | 65,536 – 131,072 | Murallas con pasos obligados | Oricalco · Adamante · Piedra filosofal | 10 ac |
| 19 | Tiempo roto | 131,072 – 262,144 | Celdas que se regeneran en segundos | Cronita · Arena del tiempo · Cristal eterno | 100 ac |
| 20 | Núcleo exterior | 262,144 – 524,288 | Tres peligros anteriores combinados | Níquel estelar · Hierro de estrella · Materia oscura | 1 ad |
| 21 | Núcleo | 524,288 – 1,048,576 | Aquí se cruza el **km 1,000,000** | Singularita · Corazón del mundo · **La Veta Madre** | 10 ad |
| 22 + | Generadas | sigue duplicando | 2 o 3 peligros anteriores, por semilla | Nombres generados (raíz + terminación + número romano) | × 10 |

Son 70 minerales con nombre hasta el millón de kilómetros. Propuesta de partida: el documento maestro puede mejorar nombres y peligros, pero debe entregar la tabla completa.

### 6.6 Nombres e historias de las mejoras en capas 2 en adelante

- Cada nivel lleva el nombre del mineral de su nivel: en la capa 2, «Broca de Aguamarina», «Broca de Zafiro», «Broca de Perla negra».
- Cada una lleva **su historia en una línea**, con el mismo tono de la sección 3.6: qué es y qué va a cambiar en el siguiente viaje.
- El documento maestro debe escribir a mano las 36 de las capas 2 y 3, y dar la regla para generar las demás.

### 6.7 Números grandes

Aun a × 10 por capa, quien llegue muy lejos verá cifras enormes; se muestran abreviadas con la notación de 6.5. **No hace falta ninguna librería de números gigantes**: a este ritmo, los números normales del navegador alcanzan hasta cerca de la capa 300. El documento maestro debe decir qué pasa en ese límite.

---

## 7. MUNDOS COMPARTIDOS — una liga, el mismo mundo, en tiempo real [N]

> **La imagen que manda:** le mando la liga a mi hermano y a mi hermana. Entran, bautizan su maquinita y los tres estamos excavando en el mismo mundo, viéndonos bajar en tiempo real, mientras platicamos por llamada. **Tiene que funcionar bien desde la primera vez.**

### 7.1 Qué es un mundo

- Cada mundo tiene un **identificador único** de 8 caracteres fáciles de leer (sin 0/O ni 1/I) y su propia liga: `mina.capitaltorreon.com/m/K7M2QX4P`.
- Cada mundo nace con una **semilla al azar**: no hay dos mundos iguales.
- **Todo lo que pasa se guarda en el mundo**: los túneles, los minerales ya tomados, las estaciones construidas y cada jugador con su maquinita, su dinero, su carga y su posición. Se puede volver mañana, pasado o en un mes con la misma liga, y todo sigue como se dejó.
- Hasta **10 jugadores conectados a la vez** y hasta 30 maquinitas registradas por mundo.

### 7.2 Entrar

- **Primera vez** (el navegador no tiene mundos): abrir `mina.capitaltorreon.com` crea un mundo nuevo y entra directo a bautizar la maquinita. Sin menús.
- **Si ya tiene mundos**: aparece «Mis mundos», con el último jugado arriba y tres acciones: **Continuar**, **Mundo nuevo** y **Desechar**.
- **Abrir la liga de un mundo** entra a ese mundo. Si el jugador es nuevo ahí, elige y bautiza su maquinita.
- **Elegir y bautizar**: 8 modelos de maquinita (cambian solo la apariencia) y un nombre obligatorio de 2 a 14 caracteres. El nombre flota sobre la maquinita y aparece en la tabla y en los avisos.
- **Sin registro.** El navegador guarda una llave secreta por mundo: misma computadora, misma maquinita. Para seguir en otro dispositivo, las opciones muestran el «código de mi maquinita». **La llave nunca viaja en la liga que se comparte.**
- **Invitar**: un botón copia la liga del mundo.

### 7.3 Lo que es de cada quien y lo que es de todos

| De cada jugador | De todos |
|---|---|
| Maquinita, nombre, las 6 piezas del equipo | El terreno: túneles, minerales, hallazgos, peligros |
| Dinero, carga, objetos, combustible, casco | Las estaciones construidas y el elevador |
| Contratos, logros, rango, catálogo, bonos de profundidad | La dificultad del mundo y sus reglas |
| Opciones personales | La tabla del mundo |

Reglas de convivencia:

- **El mineral es de quien lo perfora primero.** Los túneles de uno le sirven a todos.
- **Las maquinitas no chocan**: se atraviesan. En un túnel de una celda nadie le estorba a nadie.
- Los explosivos destruyen terreno para todos, pero **no dañan a otros jugadores**.
- **Regalar dinero**: en la estación, un jugador puede pasarle dinero a otro. Así el que llega tarde se empareja.
- **Pausa**: el mundo no se detiene. Dentro de un edificio el jugador está a salvo y no gasta. Con la pausa personal su maquinita se congela, no gasta y los demás la ven «en pausa».
- **Desconexión**: la maquinita desaparece del mundo a los 10 segundos y queda guardada donde estaba. Al volver, reaparece ahí. Si mientras tanto el mundo se remineralizó, reaparece en la superficie con su carga.
- Quien está en otra capa no se ve en pantalla, pero aparece en la tabla con su profundidad.

### 7.4 Desechar

- **Desechar** quita el mundo de «Mis mundos». Si quien desecha es quien lo creó, el juego pregunta si lo borra para todos.
- Un mundo sin visitas en 180 días se borra solo.
- Siempre se puede crear el siguiente: cada uno nace con otra semilla.

### 7.5 Cómo debe estar amarrado por dentro

- **Un servidor pequeño por mundo** (un Durable Object de Cloudflare por identificador). Ese servidor es **la única verdad** sobre el terreno y los jugadores.
- **El terreno no se guarda celda por celda.** Cada celda se calcula con la semilla; solo se guarda **qué celdas ya se cavaron**, a un bit por celda: 6 KB por capa.
- Cada jugador mueve su maquinita en su propio navegador, con respuesta inmediata, y le manda al mundo dos cosas: **su posición** (máximo 10 veces por segundo, solo si se movió) y **sus intenciones** («perforo esta celda», «vendo», «compro»). El mundo valida, aplica y avisa a los demás.
- **Dos jugadores sobre la misma celda**: gana el primero que llega al servidor; al otro se le corrige sin castigo.
- **Jugando solo no se transmite posición**, solo intenciones. La posición de un jugador solo se envía a quienes están en su misma capa.
- **Reconexión automática.** Al reconectar, el jugador recibe el estado completo de su capa.
- **Guardado por lotes** cada pocos segundos, una fila por capa; nunca una escritura por celda.
- Es un juego entre amigos: el servidor valida lo básico (que la celda exista, que no esté cavada, que el dinero alcance). No hace falta un sistema antitrampas.
- Protección mínima: tope de mundos nuevos por visitante al día, tope de tamaño de mensaje y nombres limpios de código.
- **Diseña para mundo compartido desde el primer día**: el juego siempre le habla a «un mundo» con los mismos mensajes. En la primera etapa de construcción ese mundo puede vivir dentro del navegador; en la siguiente se muda al servidor sin tocar el juego.
- **Costo**: el plan gratuito de Cloudflare da 100,000 solicitudes al día y cuenta cada 20 mensajes entrantes como una solicitud (2 millones de mensajes al día), 100,000 escrituras al día y 5 GB (verificado el 2026-10-01). El documento maestro debe calcular cuántas horas de juego diarias caben ahí y cuánto costaría rebasarlo.

### 7.6 Pruebas que debe pasar antes de darlo por bueno

1. Abrir sin mundos previos: bautizo y a jugar en menos de 2 segundos.
2. Copiar la liga y abrirla en otro navegador: tras el bautizo, las dos maquinitas se ven moverse.
3. Uno cava; el otro ve el túnel en menos de 0.3 segundos.
4. Dos jugadores van por la misma pieza de mineral: solo uno la recibe.
5. Cerrar todo y volver al día siguiente con la misma liga: el mundo y cada maquinita están como se dejaron.
6. Cortar el internet 10 segundos: reconecta solo y no se pierde nada.
7. Diez jugadores a la vez: 60 cuadros por segundo para todos.
8. Remineralizar con alguien bajo tierra: sube a salvo con su carga.
9. Dos mundos nuevos: terrenos distintos.
10. Desechar un mundo: sale de la lista; el siguiente se crea con otra semilla.

---

## 8. OPCIONES Y DIFICULTAD — a veces relajarse, a veces reto [N]

> **A veces quiero el juego para relajarme y a veces quiero que me exija.** La dificultad se elige, y cada causa de muerte se puede ajustar por separado.

### 8.1 Tres clases de opciones

| Clase | Quién las cambia | A quién afectan |
|---|---|---|
| **Del mundo** | Quien creó el mundo, al crearlo o después | A todos los que juegan en él |
| **Personales** | Cada jugador | Solo a su pantalla |
| **Fijas** | Nadie | — |

La dificultad es **del mundo**, no de cada jugador: todos comparten el mismo terreno y la misma economía, así que todos juegan con las mismas reglas. Cada cambio se anuncia a todos y aplica al instante.

### 8.2 Tres modos listos

| | **Paseo** (relajarse) | **Clásico** (por omisión) | **Rudo** (reto) |
|---|---|---|---|
| Quedarse sin combustible | No explota: entra en reserva, avanza a media velocidad y no perfora hasta cargar | Explota | Explota |
| Caídas | Sin daño | Daño normal | Daño × 1.5 |
| Lava | Sin daño; solo frena | Daño normal | Daño × 1.5 |
| Gas | Se ve y no daña | Invisible, daño normal | Invisible, daño × 1.5 |
| Peligro propio de cada capa | Apagado: queda de adorno | Normal | Reforzado |
| Al morir | No se muere | Pierde la carga y paga reparación y tanque | Pierde la carga, paga y pierde 10 % de su dinero |
| Rescates gratis | — | Los 3 primeros | Ninguno |
| Precios y valor de los minerales | Iguales | Iguales | Iguales |

**Los precios no cambian con el modo.** Lo que cambia es el riesgo, no la economía.

### 8.3 Ajuste fino: cada causa de muerte por separado

Quien creó el mundo puede mover cada una. Al tocar cualquiera, el modo pasa a llamarse **«A la medida»**.

| Ajuste | Valores |
|---|---|
| Quedarse sin combustible | Reserva (no explota) · Explota |
| Caídas | Apagado · Normal · Fuerte |
| Lava | Apagado · Normal · Fuerte |
| Gas | Apagado · Normal · Fuerte |
| Ver el gas | Sí · No |
| Peligro propio de cada capa (uno por capa construida) | Apagado · Normal · Fuerte |
| Qué se pierde al morir | Nada · La carga · La carga y la reparación · Carga, reparación y 10 % del dinero |
| Rescates gratis | Ninguno · 3 · Sin límite |

Cada peligro nuevo que traiga una capa futura **debe nacer con su propio ajuste** en esta lista.

### 8.4 Otras opciones del mundo

- Nombre del mundo.
- **Cerrar la puerta**: el mundo deja de admitir maquinitas nuevas.
- Quién puede remineralizar: cualquiera, o solo quien creó el mundo.
- Regalos de dinero entre jugadores: sí o no.

### 8.5 Opciones personales

- Volumen de efectos y de música, por separado.
- Temblor de pantalla: sí o no.
- Partículas: todas, pocas o ninguna.
- **Tamaño de texto (A− / A+)** y **alto contraste**.
- **Marcas para daltónicos**: cada mineral se distingue por su forma además de su color.
- Mostrar los nombres de las otras maquinitas.
- Acercamiento: tres niveles.
- Teclas.
- **Modo ahorro**: 30 cuadros por segundo, para máquinas viejas o batería baja.

### 8.6 Lo que NO se configura, y por qué

Valor de los minerales, precios, lo que hace cada mejora, tamaño del mundo y semilla. Razones:

- **Una sola economía.** Todo el ritmo de la sección 10 está calibrado sobre esos números; moverlos lo rompe.
- **Récords comparables.**
- **Menos pantallas.** Regla para aceptar una opción nueva: *solo existe si cambia cómo se siente jugar; si solo cambia números, no es una opción.*

Todas las opciones tienen un valor por omisión con el que el juego ya se disfruta: **nadie debe necesitar abrir las opciones para empezar.** La pantalla de opciones cabe completa sin desplazarse.

### 8.7 Récords

La tabla mundial (etapa posterior) lleva una lista por modo: Paseo, Clásico y Rudo. Los mundos «A la medida» tienen su tabla interna pero no entran a la mundial.

---

## 9. PROGRAMACIÓN LIGERA — abre al instante, corre en cualquier máquina [N]

> **El original era exageradamente pesado. Esto es lo contrario:** cada decisión técnica se toma eligiendo la opción más ligera que funcione.

### 9.1 Topes que se miden

| Qué | Tope |
|---|---|
| Descarga inicial completa (código, gráficos y sonido), comprimida | **150 KB** |
| Solicitudes para arrancar | 3 o menos |
| De abrir la liga a estar jugando | Menos de 2 segundos en conexión normal |
| Fluidez | 60 cuadros por segundo en una laptop de 2015 y en un teléfono de gama media |
| Trabajo por cuadro | Menos de 4 milisegundos |
| Memoria | Menos de 60 MB |
| Procesador cuando no pasa nada (tienda, pausa, pestaña oculta) | 0 % |
| Red por jugador, con 10 jugadores en la misma capa | Menos de 2 KB por segundo |
| Red jugando solo | Solo intenciones: casi nada |
| Guardado de una capa | 6 KB |

**Estos topes se verifican en cada etapa de construcción.** Una etapa que los rebasa no está terminada.

### 9.2 Cómo se logra

- **Sin frameworks ni librerías.** JavaScript directo y un solo lienzo 2D.
- **Cero imágenes descargadas**: los gráficos se dibujan por código al arrancar y se guardan en memoria.
- **Cero archivos de audio**: los sonidos se sintetizan en el navegador.
- **Tipografía del sistema**: ninguna fuente descargada.
- **El mundo no vive en memoria.** Cada celda se calcula con la semilla cuando entra a pantalla; solo se guardan los bits de lo cavado.
- **Solo se dibuja lo visible** (unas 700 celdas). El terreno se pinta una vez por bloques y solo se repinta el bloque que cambió.
- **El ciclo del juego se detiene** cuando no hay nada que animar.
- **Mensajes de red binarios**, de unos cuantos bytes.
- **Números normales del navegador**; ninguna librería de números gigantes (sección 6.7).
- **El servidor duerme** cuando nadie juega en el mundo; un mundo dormido no cuesta.
- Un medidor de peso que **falla la entrega** si la descarga rebasa el tope.

---

## 10. Metas de ritmo que el simulador debe comprobar [N]

**Si no se cumplen, ajusta solo los números [N]; los [O] no se tocan.**

- Un viaje dura de 2 a 4 minutos al inicio y hasta 8 en el fondo de una capa.
- La primera mejora llega en 3 viajes o menos.
- En promedio hay una compra cada 1 a 3 viajes. **Nunca más de 5 viajes sin poder comprar nada.**
- Siempre hay al menos **dos compras deseables compitiendo** por el mismo dinero.
- Con el tanque adecuado, el jugador llega a su frontera y regresa con el margen de la sección 4.3.
- Con la bodega adecuada, se llena antes de que se acabe el combustible.
- Después de comprar todo, reunir para la estación siguiente toma de 4 a 6 viajes.
- La capa 1 toma de 2 a 3 horas la primera vez; cada capa siguiente, de 2.5 a 3.5 horas.
- Bajar a una capa nueva deja más por viaje que quedarse en la anterior, desde el primer viaje.
- Ninguna capa es más de un 10 % más exigente que la anterior.
- Hay un premio (contrato, logro, rango, bono, hallazgo o veta madre) al menos cada 5 minutos de juego.

---

## 11. Aspecto y límite legal

- Aspecto **lo más parecido posible al original**: vista lateral, tierra por celdas, cielo y superficie con edificios, subsuelo en tonos café rojizo. Cada capa cambia de paleta según su nombre.
- Los gráficos del producto mínimo pueden ser sencillos. **Primero que se juegue y enganche; después se pule.**
- Menús y tiendas pueden apoyarse en el sistema de diseño de SuperLeads, sin descargar fuentes ni librerías: mandan los topes de la sección 9.
- **Copiamos la MECÁNICA, no el material.** Nombre, gráficos, sonidos, textos, personajes e historia propios. Nada extraído del juego original.

---

## 12. Qué debe traer el documento maestro

1. Resumen del juego en una página.
2. Reglas completas de la capa 1 con todas sus tablas, ya verificadas.
3. Generación del mundo: probabilidad de cada tipo de celda según la profundidad, para un mundo de 96 celdas de ancho. La wiki no la documenta: sácala de video y calíbrala.
4. Física: velocidades, vuelo según peso, gravedad, dureza de la tierra.
5. Curva de dificultad (sección 4) con sus números finales.
6. Gamificación (sección 5): lista completa de logros, textos de los contratos, premios de cada rango.
7. El juego infinito (sección 6): fórmulas, las 21 capas, nombres e historias de las mejoras de las capas 2 y 3.
8. **Mundos compartidos (sección 7)**: la lista exacta de mensajes entre el juego y el mundo, qué se guarda y cómo, qué pasa en cada caso de conflicto o desconexión, y el cálculo de costo.
9. **Opciones y dificultad (sección 8)**: la pantalla de opciones dibujada, con cada valor por omisión.
10. **Programación ligera (sección 9)**: cómo se cumple cada tope y cómo se mide.
11. Resultado del simulador de economía contra las metas de la sección 10.
12. Plan de construcción por etapas, cada una jugable, comprobable y dentro de los topes de peso. Las pruebas de la sección 7.6 son la condición de salida de la etapa de mundos compartidos.
13. Datos sin verificar y decisiones que me tocan a mí, cada una con tu recomendación.

Al terminar: guarda el documento en la carpeta local, súbelo al repositorio y dame el resumen con las decisiones pendientes. **No construyas el juego hasta que yo apruebe el documento.**

---

## Fuentes

- Wiki de Motherload (motherload.fandom.com): Motherload, Minerals, Artifacts, Autobuy 2000, Emendation Station 3500, Damage, Propellent Vendor 12000, Marsquake, Transmissions, Ending, Ancient Blueprints, Challenge, Shops, Stone y las páginas de cada objeto.
- Reseña de jayisgames.com.
- «The Math of Idle Games», Kongregate (crecimiento de precios en juegos de progreso).
- Documentación de Cloudflare Durable Objects: precios y límites (consultada el 2026-10-01).
- El original sigue disponible en crazygames.com/game/motherload.
