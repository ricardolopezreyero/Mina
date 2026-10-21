# PROMPT MAESTRO · «Mina» · v2

Juego de minería para navegador inspirado en Motherload (XGen Studios, 2004), pero **infinito**.

- Repositorio: https://github.com/ricardolopezreyero/Mina (público, vacío hoy)
- Carpeta local: `/Users/ricardolopezreyero/Desktop/HTML/Mina`
- Dominio final: `mina.capitaltorreon.com`
- Condiciones fijas: 100 % navegador, 100 % gratis, sin registro, sin instalar nada.

---

## 0. Qué quiero en esta etapa

**SOLO el documento maestro. NO escribas código del juego todavía.**

Este prompt ya trae la investigación y el diseño de partida. Tu trabajo es:

1. **Verificar** lo que aquí va marcado como «por verificar» (juega el original en CrazyGames y mira partidas en YouTube para lo que la wiki no dice).
2. **Completar** las listas que aquí se dejan con regla y ejemplos (nombres de minerales y de equipo por capa).
3. **Calibrar** los números marcados como «nuestros» con un simulador de economía. Ese simulador es lo único que puedes programar en esta etapa.
4. **Entregar** el documento maestro, guardado en la carpeta local y subido al repositorio.

Regla de oro: **no supongas nada**. Si un dato no está aquí ni lo pudiste verificar, anótalo en la lista de dudas con tu recomendación; no lo inventes en silencio.

Cada número de este prompt lleva su origen:

- **[O]** dato del juego original, confirmado en la wiki de Motherload. No se cambia.
- **[V]** dato del original que recuerdo pero no pude confirmar. Por verificar.
- **[N]** número nuestro, de diseño. Es valor de partida y se calibra.

---

## 1. La idea en una frase

Bajas con tu equipo minero, llenas la bodega, subes, vendes, cargas combustible, mejoras el equipo y bajas más hondo. **Nunca se acaba**: siempre hay un mineral más valioso abajo y una mejora más cara arriba.

**Lo que más me importa** (dale el mayor peso):

> El jugador debe estar siempre «picado»: exprimiendo cada litro de combustible y cada espacio de bodega, con una compra a la vista que casi le alcanza, y con una razón clara para bajar un poco más. Los precios existen para sostener esa tensión para siempre.

---

## 2. Cómo se mide la profundidad

- Unidad: **metros y kilómetros** (el original usa pies).
- El mundo se divide en **capas**. Cada capa mide **500 celdas de hondo por 32 de ancho** [N] (el original mide 592 × 32 [O]).
- **Capa 1 = de 0 a 1 km** (2 m por celda). **Esta capa es el producto mínimo viable.**
- Cada capa siguiente **duplica** la profundidad: capa 2 va de 1 a 2 km, capa 3 de 2 a 4 km, capa 4 de 4 a 8 km… La capa *k* (k ≥ 2) va de 2^(k−2) km a 2^(k−1) km. Siempre son 500 celdas; lo que cambia es cuántos metros cuenta el altímetro por celda.
- Con esa regla, **el kilómetro 1,000,000 se alcanza dentro de la capa 21**. Después de la 21 el juego sigue igual, sin tope.
- Para convertir las profundidades del original a la capa 1: metros = pies × 0.137 (los 7,300 pies del original equivalen a nuestros 1,000 m).

---

## 3. CAPA 1 — el producto mínimo viable, completo

Réplica fiel de la mecánica del original. Todo lo de esta sección debe funcionar perfecto antes de pensar en la capa 2.

### 3.1 Movimiento y física

- Vista lateral. El equipo se mueve con flechas o WASD [O].
- Perfora **hacia abajo, a la izquierda y a la derecha**. **Nunca hacia arriba** [O].
- Solo perfora hacia los lados si está parado sobre suelo firme [O].
- Vuela hacia arriba con su hélice; no perfora mientras vuela [O].
- El peso frena el vuelo: a más carga, sube más lento, hasta que la hélice solo alcanza a frenar la caída [O].
- La tierra se endurece con la profundidad; un taladro mejor lo compensa [O]. La curva exacta de dureza no está documentada: **por verificar en video** y, si no se puede, calibrar con esta meta [N]: con taladro de serie una celda de superficie tarda ~0.6 s; con el taladro tope una celda del fondo tarda ~0.5 s; con taladro de serie en el fondo, ~3 s.
- Bajar de la superficie al fondo con todo el equipo tope toma 8–9 minutos en el original [O]. Úsalo como referencia de ritmo.

### 3.2 Minerales (los 10, completos)

Se venden en la Procesadora. Cada pieza ocupa 1 espacio de bodega [O]. Una celda con mineral nunca esconde gas [O]. Si la bodega está llena, el mineral perforado **se pierde** [O]. El jugador puede tirar piezas desde el inventario para liberar espacio y peso [O].

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

Las profundidades son las del original convertidas a metros [O]. «Común» = cuando ya se ven dos en una misma pantalla. Hay mucho azar: de vez en cuando aparece uno fuera de su zona [O]. Los minerales baratos siguen apareciendo abajo, cada vez en menor proporción.

### 3.3 Hallazgos especiales (los 4)

Muy raros: 1 o 2 por cada 140 m de descenso. **No dependen de la profundidad** (uno valioso puede salir cerca de la superficie). **Pagan al instante** al perforarlos y no ocupan bodega [O].

| Nuestro nombre | En el original | Paga [O] |
|---|---|---|
| Huesos de dinosaurio | Dinosaur Bones | $1,000 |
| Cofre del tesoro | Treasure | $5,000 |
| Esqueleto antiguo | Martian Skeleton | $10,000 |
| Reliquia sagrada | Religious Artifact | $50,000 |

### 3.4 Combustible

- Precio: **$1 por litro** en la gasolinera [O].
- Consumo: ~5 L/min parado, ~17 L/min volando hacia arriba sin carga, más al perforar [O]. El tanque de serie dura ~30 segundos perforando [O] (equivale a ~20 L/min [N], por verificar).
- **Sin combustible, el equipo explota al instante** [O].
- El consumo se detiene con el juego en pausa y dentro de los edificios [O].
- El jugador empieza con **$20 y el tanque casi vacío**: lo primero que hace es cargar [O].

### 3.5 Casco y daño

- La vida no se regenera sola. Reparar cuesta **$15 por punto** [O]. Comprar un casco nuevo lo deja lleno; comprar un tanque nuevo lo deja lleno [O].
- **Daño por caída** [O] (el original lo calcula por velocidad de impacto; tope por velocidad terminal):

| Altura de caída | Daño |
|---|---|
| menos de 2 celdas | 0 |
| 2 a 3 celdas | 3 |
| 3 a 5 celdas | 4 |
| 5 a 9 celdas | 5 |
| 9 a 17 celdas | 6 |
| 17 a 46 celdas | 7 |
| más de 46 celdas | 8 |

- **Piedra**: aparece desde ~210 m y cada vez más. **No se puede perforar**; se rodea o se vuela con explosivos [O].
- **Lava**: desde ~410 m. **Se ve**, así que se puede evitar. Perforarla hace **58 o 41 de daño** (dos valores posibles), reducido por el radiador [O].
- **Gas**: desde ~650 m, rarísimo hasta ~680 m, donde aumenta de golpe; casi inevitable entre 890 y 960 m [O]. **Es invisible**: se ve igual que la tierra. Al perforarlo explota en verde [O].
  - Daño del gas = (profundidad en metros − 410) ÷ 2.05 × (1 − eficacia del radiador) [O, convertido]. Ejemplos sin radiador: 117 a 650 m, 213 a 850 m, 287 en el fondo.
- Los explosivos eliminan piedra, lava y gas **sin dañar al jugador**, pero también destruyen minerales y hallazgos [O].
- **Sismo**: cada vez que el jugador entra a un edificio hay una probabilidad muy baja (0.5 % [N]) de sismo. La pantalla tiembla, aparece un signo de admiración rojo y **el subsuelo se regenera**: se cierran los túneles y reaparecen minerales [O]. En el original pasa una vez cada varias horas.

### 3.6 Mejoras del equipo minero (6 categorías × 6 niveles)

Se compran en el Taller. Se puede comprar cualquier nivel sin pasar por los anteriores [O]. Precios y valores del original [O]; los dos renglones marcados [N] son añadidos nuestros para que las seis categorías tengan seis niveles.

**Taladro** — qué tan rápido perfora

| Nivel | Nombre | Precio | Potencia |
|---|---|---|---|
| 0 | De serie | — | 20 [V] |
| 1 | de Plata | $750 | 28 |
| 2 | de Oro | $2,000 | 40 |
| 3 | de Esmeralda | $5,000 | 50 |
| 4 | de Rubí | $20,000 | 70 |
| 5 | de Diamante | $100,000 | 95 |
| 6 | de Amazonita | $500,000 | 120 |

**Casco** — puntos de vida

| Nivel | Nombre | Precio | Vida |
|---|---|---|---|
| 0 | De serie | — | 10 |
| 1 | de Hierro | $750 | 17 |
| 2 | de Cobre | $2,000 | 30 |
| 3 | de Acero | $5,000 | 50 |
| 4 | de Platino | $20,000 | 80 |
| 5 | de Einstenio | $100,000 | 120 |
| 6 | Escudo de energía | $500,000 | 180 |

**Motor** — cuánto peso levanta y qué tan rápido se mueve

| Nivel | Nombre | Precio | Caballos |
|---|---|---|---|
| 0 | De serie | — | 150 |
| 1 | V4 1.6 | $750 | 160 |
| 2 | V4 2.0 turbo | $2,000 | 170 |
| 3 | V6 3.8 | $5,000 | 180 |
| 4 | V8 5.0 supercargado | $20,000 | 190 |
| 5 | V12 6.0 | $100,000 | 200 |
| 6 | V16 7.0 | $500,000 | 210 |

El equipo solo pesa 1,980 kg [O]. Con el mejor motor, despegar con 5,800 kg totales es muy difícil y con 6,200 kg es imposible [O]. Regla de partida [N]: peso máximo que puede subir = caballos × 29.5 kg.

**Tanque** — litros de combustible

| Nivel | Nombre | Precio | Litros |
|---|---|---|---|
| 0 | Micro | — | 10 [V] |
| 1 | Mediano | $750 | 15 |
| 2 | Grande | $2,000 | 25 |
| 3 | Gigante | $5,000 | 40 |
| 4 | Titánico | $20,000 | 60 |
| 5 | Leviatán | $100,000 | 100 |
| 6 | de Compresión líquida | $500,000 | 150 |

**Radiador** — reduce el daño de lava y gas

| Nivel | Nombre | Precio | Reducción |
|---|---|---|---|
| 0 | De serie | — | 0 % |
| 1 | Ventilador simple [N] | $750 | 5 % |
| 2 | Doble ventilador | $2,000 | 10 % |
| 3 | Turbina simple | $5,000 | 25 % |
| 4 | Doble turbina | $20,000 | 40 % |
| 5 | Enfriamiento criogénico | $100,000 | 60 % |
| 6 | Triple turbina de freón | $500,000 | 80 % |

**Bodega** — cuántas piezas carga

| Nivel | Nombre | Precio | Espacios |
|---|---|---|---|
| 0 | Micro | — | 7 |
| 1 | Mediana | $750 | 15 |
| 2 | Grande | $2,000 | 25 |
| 3 | Gigante | $5,000 (la wiki dice $50,000; parece errata, verificar) | 40 |
| 4 | Titánica | $20,000 | 70 |
| 5 | Leviatán | $100,000 | 120 |
| 6 | Colosal [N] | $500,000 | 175 |

Orden en que conviene comprar en el original [O]: primero tanque, luego taladro; casco y radiador importan hasta que aparecen la lava y el gas; el motor importa cuando la carga ya pesa.

### 3.7 Objetos consumibles (los 6)

Se compran en la Estación de reparación. **No pesan y no hay límite** de cuántos llevar [O].

| Objeto | Efecto [O] | Precio [O] | Tecla [O] | Cuándo se puede usar [O] |
|---|---|---|---|---|
| Tanque de reserva | +25 litros | $2,000 | F | Siempre, incluso volando o perforando |
| Nanobots reparadores | +30 de vida | $7,500 | R | Siempre |
| Dinamita | Destruye 3 × 3 celdas alrededor | $2,000 | X | Solo tocando suelo |
| Explosivo plástico | Destruye 5 × 5 celdas alrededor | $5,000 | C | Solo tocando suelo |
| Teletransportador cuántico | Lleva a la superficie, pero puede lanzarte por el aire (5 a 9 de daño por caída) | $2,000 | Q | Solo tocando suelo |
| Transmisor de materia | Lleva a la superficie sin riesgo, junto a la gasolinera | $10,000 | M | Solo tocando suelo |

El tanque de reserva **no se usa solo**: si el jugador no lo activa a tiempo, explota igual [O].

### 3.8 La superficie

De izquierda a derecha [O]:

1. **Gasolinera** — carga combustible.
2. **Procesadora de minerales** — vende toda la carga de un clic.
3. **Taller de mejoras** — las 6 categorías de equipo.
4. **Estación de reparación** — repara el casco y vende los 6 objetos.

El suelo bajo los edificios es indestructible, ni con explosivos [O]. En el original hay además un punto de guardado flotante entre la Procesadora y el Taller [O]; nosotros **guardamos solos** cada vez que el jugador entra a un edificio [N].

### 3.9 Mensajes y bonos por profundidad

En el original un jefe de la compañía manda transmisiones al cruzar ciertas profundidades por primera vez; cuentan la historia y pagan bonos [O]. Las nuestras llevan texto propio, en las mismas marcas:

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

Los dos primeros bonos valen más que todo lo que se saca al principio: **premian bajar derecho** en vez de entretenerse arriba [O]. Consérvalo.

### 3.10 Pantalla, controles y detalles

- Medidores siempre visibles: combustible, casco, profundidad, dinero, bodega (usados/total) [O].
- Avisos: combustible bajo (sonido insistente), bodega llena, daño recibido [V].
- Inventario: lista de minerales cargados con opción de tirar piezas [O].
- Pausa. El combustible no corre en pausa [O].
- Sonidos propios: taladro, motor, venta, compra, explosión, alarma.
- Controles del producto mínimo: teclado. Controles táctiles: etapa posterior.

### 3.11 Morir y guardar

- En el original, morir te regresa al último guardado y el subsuelo se reinicia [O].
- Nuestra regla [N]: al morir reapareces en la superficie, **pierdes toda la carga** y pagas reparación completa y tanque lleno. Conservas dinero restante, equipo y objetos.
- Se guarda en el navegador: dinero, equipo, objetos, récords **y los túneles cavados** (semilla del mundo + celdas modificadas).

### 3.12 Lo que el original tiene y NO entra al producto mínimo

- **Jefe final**: en el fondo del original hay una pelea en dos fases (1,000 y 2,000 de vida) que solo se gana con explosivos, y paga $28,500,000 [O]. Nuestro juego no tiene final. Queda como decisión pendiente si cada capa tendrá un guardián.
- **Planos antiguos** (edición de paga): mejoras secretas enterradas — tanque que se recarga con gas, motor con teletransporte ilimitado, radiador que gana dinero con la lava, taladro que perfora piedra, bodega infinita, casco que se regenera [O]. Buena idea para capas 2 en adelante.
- **Retos contra reloj** (edición de paga): 12 retos del tipo «5 de hierro en 1 minuto» [O]. Etapa posterior.
- Puntuación: el original lleva puntos aparte del dinero [O]. Nosotros usamos **profundidad máxima** y **total ganado** como récords.

---

## 4. EL JUEGO INFINITO — capas 2 en adelante

> **Esta es la diferencia con el original y lo que más quiero cuidar: nunca se detiene la escalera de minerales más preciosos y equipo más caro.**

### 4.1 Regla general: cada capa es el juego completo otra vez, un escalón arriba

Cada capa trae:

- **10 minerales nuevos**, con la misma escalera de valores de la capa 1.
- **6 niveles nuevos de cada una de las 6 mejoras** (36 compras por capa).
- **Los 6 objetos consumibles** en versión de esa capa.
- **Su propia estación** con los 4 edificios, en el techo de la capa.
- **Los mismos peligros** de la capa 1 en la misma proporción (piedra desde el 21 % de la capa, lava desde el 41 %, gas desde el 65 %) **más un peligro nuevo** propio de la capa.
- Los mismos bonos por profundidad, al 7 %, 14 % y 48 % de la capa.

### 4.2 Cómo crecen los números [N]

| Qué | Crece por capa | Por qué ese número |
|---|---|---|
| Todo el dinero: valor de minerales, hallazgos, precios de mejoras y objetos, reparación, bonos | **× 10,000** | El mineral más caro de una capa vale lo mismo que la grava de la siguiente; así no conviene quedarse atrás |
| Potencia del taladro y dureza de la tierra | × 6 | 120 ÷ 20 |
| Vida del casco y todo daño (caída, lava, gas) | × 18 | 180 ÷ 10 |
| Litros del tanque y consumo de combustible | × 15 | 150 ÷ 10 |
| Espacios de bodega y tamaño de cada pieza de mineral | × 25 | 175 ÷ 7 |
| Caballos del motor y peso de todo | × 1.4 | 210 ÷ 150 |
| Precio del litro de combustible | × 667 | Para que llenar el tanque cueste × 10,000 |

Consecuencia buscada: **quien llega a una capa nueva con el equipo tope de la anterior está exactamente igual que al empezar el juego con equipo de serie.** Vuelve a sentir el tanque corto, la bodega chica y el taladro lento, y vuelve a tener 36 compras por delante.

Radiador: su porcentaje solo cuenta contra el calor de su propia capa. Un radiador de una capa anterior vale 0 % en la nueva.

Ejemplo, capa 2: minerales de $300,000 a $5,000 millones; mejoras de $7.5 millones a $5,000 millones.

### 4.3 Cómo se pasa de una capa a la siguiente [N]

1. El jugador toca el fondo de la capa por primera vez.
2. Se desbloquea en su estación la opción **«Construir la estación de la capa siguiente»**.
3. Cuesta **100 veces la mejora más cara de la capa** ($50 millones en la capa 1). Es el gran gasto de fin de capa: da uso a todo el dinero que sobra cuando ya se compró todo.
4. Ya construida, un **elevador gratuito** conecta todas las estaciones. Los teletransportadores llevan a la estación de la capa donde estás.

### 4.4 Las primeras 21 capas, hasta el millón de kilómetros [N]

Propuesta de partida. El documento maestro puede mejorarla, pero debe entregar la tabla completa.

| Capa | Nombre | De – a (km) | Peligro nuevo |
|---|---|---|---|
| 1 | Corteza | 0 – 1 | Piedra, lava y gas (el juego base) |
| 2 | Acuífero | 1 – 2 | Celdas inundadas: frenan y duplican el gasto de combustible |
| 3 | Cavernas | 2 – 4 | Grava que se derrumba cuando le quitas el apoyo |
| 4 | Cristalera | 4 – 8 | Cristal que pide dos pasadas de taladro; geodas que sueltan 3 piezas |
| 5 | Zona de presión | 8 – 16 | Daño lento y constante si el casco es débil para la zona |
| 6 | Horno | 16 – 32 | Calor ambiente: daño por tiempo sin radiador de la capa |
| 7 | Campo magnético | 32 – 64 | Vetas que jalan al equipo y desvían el control |
| 8 | Fosa oscura | 64 – 128 | Solo se ve un círculo de luz; bengala como objeto nuevo |
| 9 | Nido | 128 – 256 | Criaturas que recorren los túneles y dañan al tocar |
| 10 | Zona sísmica | 256 – 512 | Sismos mientras estás abajo: se cierran túneles |
| 11 | Mar de magma | 512 – 1,024 | Lava que fluye por los túneles abiertos |
| 12 | Vacíos | 1,024 – 2,048 | Cavernas enormes: caídas largas |
| 13 | Zona radiactiva | 2,048 – 4,096 | Las vetas más ricas dañan al acercarse |
| 14 | Hielo profundo | 4,096 – 8,192 | Túneles que se vuelven a congelar |
| 15 | Gravedad pesada | 8,192 – 16,384 | Volar cuesta el doble |
| 16 | Tormenta eléctrica | 16,384 – 32,768 | Descargas que roban combustible |
| 17 | Antimateria | 32,768 – 65,536 | Bolsas que borran 5 × 5 celdas con todo y minerales |
| 18 | Laberinto | 65,536 – 131,072 | Murallas indestructibles con pasos obligados |
| 19 | Tiempo roto | 131,072 – 262,144 | Celdas que se regeneran en segundos |
| 20 | Núcleo exterior | 262,144 – 524,288 | Tres peligros anteriores combinados |
| 21 | Núcleo | 524,288 – 1,048,576 | Aquí se cruza el **kilómetro 1,000,000** |
| 22 + | Generadas | sigue duplicando | Combinación de 2 o 3 peligros anteriores, elegida por la semilla |

### 4.5 Nombres

- **Minerales**: 10 por capa. Capas 2 a 7: gemas y metales reales cada vez más raros. Capas 8 a 14: elementos y materiales exóticos. Capas 15 a 21: materia inventada. Capa 22 en adelante: generador automático (raíz + terminación + número romano). **El documento maestro debe listar los 210 nombres de las capas 1 a 21.**
- **Mejoras**: misma lógica del original, donde el equipo lleva el nombre del mineral de su nivel. El documento debe listar las 36 de cada capa, de la 1 a la 3, y dar la regla para las demás.

### 4.6 Números enormes

A × 10,000 por capa, el dinero rebasa lo que un número normal soporta alrededor de la capa 77. El juego debe guardar las cantidades como **mantisa + exponente** para no tener tope, y mostrarlas abreviadas: K, M, B, T y después aa, ab, ac…

---

## 5. Metas de ritmo — lo que mantiene picado al jugador [N]

El simulador de economía debe comprobar que se cumplen en la capa 1 y que la regla del 4.2 las conserva en las siguientes. **Si no se cumplen, ajusta solo los números [N]; los [O] no se tocan.**

- Un viaje (bajar, llenar, subir, vender) dura de 2 a 4 minutos al inicio y hasta 8 en el fondo.
- La primera mejora llega en 3 viajes o menos.
- En promedio hay una compra cada 1 a 3 viajes. **Nunca más de 5 viajes sin poder comprar nada.**
- Siempre hay al menos **dos compras deseables compitiendo** por el mismo dinero.
- Con el tanque del nivel adecuado, el jugador llega a su frontera y regresa con 10 a 20 % de combustible: justo, pero posible.
- Con la bodega del nivel adecuado, se llena antes de que se acabe el combustible.
- Después de comprar todo, reunir para la estación siguiente toma de 5 a 8 viajes al fondo.
- Una capa completa toma de 2 a 3 horas la primera vez.
- En pantalla siempre hay una **«siguiente meta»**: cuánto falta para la próxima mejora, para el próximo bono y para el récord de profundidad.
- **Catálogo de minerales y hallazgos**: se va llenando conforme se descubren. Los huecos invitan a seguir bajando.

---

## 6. Aspecto y límite legal

- Aspecto **lo más parecido posible al original**: vista lateral, tierra por celdas, cielo y superficie con edificios, subsuelo en tonos café rojizo.
- Los gráficos del producto mínimo pueden ser sencillos. **Primero que se juegue bien; después se pule.**
- Menús y tiendas pueden apoyarse en el sistema de diseño de SuperLeads.
- **Copiamos la MECÁNICA, no el material.** Nombre propio, gráficos propios, sonidos propios, textos propios, personajes propios. Nada extraído del juego original.

---

## 7. Qué debe traer el documento maestro

1. Resumen del juego en una página.
2. Reglas completas de la capa 1 con todas sus tablas, ya verificadas.
3. Generación del mundo: probabilidad de cada tipo de celda (hueco, tierra, cada mineral, piedra, lava, gas, hallazgo) según la profundidad. La wiki no la documenta: sácala de video y calíbrala.
4. Física: velocidades, aceleración de vuelo según peso, gravedad, dureza de la tierra.
5. El juego infinito: fórmulas del punto 4, tabla de las 21 capas, los 210 minerales, las mejoras de las capas 1 a 3.
6. Resultado del simulador de economía contra las metas del punto 5.
7. Propuesta técnica sencilla: página estática, sin dependencias, mundo generado por semilla y cargado por tramos, guardado en el navegador, publicación en `mina.capitaltorreon.com`.
8. Plan de construcción por etapas, cada una jugable y comprobable. La primera etapa es la capa 1 completa.
9. Lista de datos que no se pudieron verificar y decisiones que me tocan a mí, cada una con tu recomendación.

Al terminar: guarda el documento en la carpeta local, súbelo al repositorio y dame el resumen con las decisiones pendientes. **No construyas el juego hasta que yo apruebe el documento.**

---

## Fuentes de la investigación

- Wiki de Motherload (motherload.fandom.com): páginas Motherload, Minerals, Artifacts, Autobuy 2000, Emendation Station 3500, Damage, Propellent Vendor 12000, Marsquake, Transmissions, Ending, Ancient Blueprints, Challenge, Shops, Stone, Quantum Teleporter, Matter Transmitter, Reserve Fuel Tank, Dynamite, Plastic Explosive.
- Reseña de jayisgames.com.
- El juego sigue disponible en crazygames.com/game/motherload.
