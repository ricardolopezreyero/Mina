# Sonidos de Mina · lo que se le pide a ElevenLabs · v1

**Estado:** estos sonidos todavía NO están generados. Hoy el juego suena con sonidos fabricados por código (sin archivos). Este documento es el pedido exacto para reemplazarlos por sonidos grabados de calidad.

- Efectos y ambientes: `POST /v1/sound-generation`, modelo `eleven_text_to_sound_v2`, salida `mp3_44100_128`.
- Música: `POST /v1/music`, modelo `music_v1`, `force_instrumental: true`.
- Los textos van en inglés porque así responde mejor el modelo.
- De cada sonido se piden **dos variantes** y se elige una. Las que no se usen se guardan aquí para no volver a gastar créditos.
- Regla de mezcla: **un sonido por momento**. Nada de fanfarrias encimadas.
- Todo sin voz humana.

---

## 1. Minerales y dinero

| Archivo | Cuándo suena | Texto exacto | Segundos | Influencia |
|---|---|---|---|---|
| `mineral` | Al cargar una pieza. El juego le sube el tono según el mineral (10 notas de una escala pentatónica) | Single bright satisfying metallic ore pickup chime, one clean bell-like ding with a tiny rock crumble underneath, short, dry, no reverb, retro mining game collect sound | 0.6 | 0.7 |
| `gema` | Encima de `mineral`, del Einstenio en adelante | Sparkling crystal gem pickup, one glassy shimmering chime with a short magical twinkle tail, bright and rewarding, clean, dry | 0.9 | 0.7 |
| `hallazgo` | Al encontrar huesos, cofre, esqueleto o reliquia | Treasure discovery sound, an old wooden chest creaks open, then a rising golden sparkle and a short triumphant chime, rewarding, no voice | 2.0 | 0.6 |
| `bodega_llena` | Bodega llena | Two short low metallic clunks of a cargo hold latch closing, a friendly warning, dry, game notification | 0.7 | 0.7 |
| `moneda` | Cada paso del contador de la venta (16 seguidas, cada una más aguda) | Single small coin clink, one bright short metal coin tick, dry, very short | 0.5 | 0.8 |
| `venta` | Al terminar la venta y en cada bono | Old cash register cha-ching with coins pouring into a metal tray, satisfying sale sound, short, clean, no voice | 1.6 | 0.6 |
| `compra` | Al comprar una mejora o un objeto | Mechanical upgrade being installed: quick ratchet wrench turns, a pneumatic hiss, then a bright confirming chime, satisfying, short | 1.6 | 0.6 |
| `combustible` | Cargar combustible, tanque de reserva, pasar litros | Fuel pump filling a metal tank, thick liquid glugging and gushing, ending with a pump handle click, short | 1.8 | 0.6 |
| `reparar` | Reparar el casco y nanobots | Quick welding sparks and two hammer taps on metal, then a short positive chime, repair complete sound | 1.4 | 0.6 |

## 2. Motor, hélice y taladro (continuos, en bucle perfecto: `loop: true`)

Desde el 2 de octubre cada uno tiene su propio canal e interruptor en el juego, y el motor viene apagado.

| Archivo | Cuándo suena | Texto exacto | Segundos |
|---|---|---|---|
| `motor` | Siempre, bajito; sube al avanzar | Seamless loop of a small diesel tracked mining vehicle engine idling and rolling on dirt, steady low rumble with soft track clatter, constant, no variation | 6 |
| `helice` | Al volar; el juego le sube el tono con la velocidad | Seamless loop of a small helicopter propeller and thruster hovering, steady rhythmic rotor chop with airy whoosh, constant intensity | 6 |
| `taladro` | Al perforar | Seamless loop of a heavy industrial drill grinding through dirt and gravel, steady gritty mechanical grinding with crumbling earth, constant intensity | 6 |

Sueltos de este grupo:

| Archivo | Cuándo suena | Texto exacto | Segundos | Influencia |
|---|---|---|---|---|
| `golpe` | Al caer | Heavy tracked vehicle landing on dirt, deep soft thud with small pebbles scattering, short, dry | 0.6 | 0.7 |
| `piedra` | Taladro contra piedra | Drill bit hitting solid rock and bouncing off, sharp metallic clank with a few sparks, short, dry | 0.5 | 0.7 |

## 3. Explosiones y daño

| Archivo | Cuándo suena | Texto exacto | Segundos | Influencia |
|---|---|---|---|---|
| `explosion` | Dinamita | Dynamite explosion underground, punchy deep boom with rocks and dirt debris falling, short tail, no voice | 1.8 | 0.6 |
| `explosion_grande` | Explosivo plástico | Massive plastic explosive blast inside a mine, huge sub-bass boom followed by a crumbling rock avalanche, powerful | 2.6 | 0.6 |
| `gas` | Bolsa de gas | Sudden natural gas pocket bursting, sharp hissing whoosh that ignites into a fiery explosion pop, dangerous, short | 1.6 | 0.6 |
| `lava` | Al perforar lava | Metal vehicle plunging into molten lava, loud searing sizzle and bubbling hiss, short | 1.5 | 0.6 |
| `dano` | Cualquier daño | Heavy metal hull impact, dull crunching clang of a vehicle taking damage, short, dry | 0.7 | 0.7 |
| `muerte` | La maquinita explota | Mining vehicle exploding, big fiery explosion with shattering metal parts scattering and clattering down, dramatic, no voice | 2.6 | 0.6 |
| `remin` | Remineralizar | Deep earth rumble as crystals and minerals grow rapidly underground, low rumbling quake with rising glittering crystalline chimes | 3.0 | 0.5 |

## 4. Avisos y logros

| Archivo | Cuándo suena | Texto exacto | Segundos | Influencia |
|---|---|---|---|---|
| `logro` | Logro nuevo | Short triumphant achievement fanfare, bright brass stab with sparkling bells, rewarding game unlock sound, no voice | 1.8 | 0.6 |
| `rango` | Rango nuevo | Rank up fanfare, ascending heroic brass with a timpani hit ending in a shimmering chime, short, proud, no voice | 2.2 | 0.6 |
| `contrato` | Contrato cumplido | A rubber stamp thumps on paper, followed by a short bright positive two-note chime, contract completed | 1.2 | 0.6 |
| `radio` | Mensaje de la Compañía | Incoming radio transmission, short burst of static crackle with a two-tone walkie-talkie beep, retro comms, no voice | 1.0 | 0.6 |
| `descubre` | Mineral nuevo descubierto | New discovery reveal, soft rising whoosh into a single bright wonder chime, magical and curious, short | 1.3 | 0.6 |
| `alarma` | Combustible bajo | Low fuel warning, two short urgent electronic beeps from a vehicle dashboard, clean, dry | 0.7 | 0.7 |
| `bip` | Veta madre cerca (se repite más rápido al acercarse) | Tiny short high metal detector beep, single clean blip, dry | 0.5 | 0.8 |
| `clic` | Botones y menús | Soft chunky mechanical button click, short, dry, satisfying user interface sound | 0.5 | 0.8 |
| `teleport` | Teletransportadores | Sci-fi teleport, rising electric energy charge whoosh that snaps into a bright zap, short | 1.4 | 0.6 |
| `grua` | Grúa a la Gasolinera | Rescue helicopter quick fly-by with a winch cable reeling fast, a whoosh, short | 1.8 | 0.6 |
| `espacio` | Al cruzar los 100 km y los 1,000 km | Awe-inspiring cosmic milestone, deep warm synth swell rising into an ethereal shimmering pad chord, vast and beautiful, no voice | 3.5 | 0.5 |

## 5. Lo que hacen los demás

Usan los mismos archivos de taladro y explosión, más bajitos según la distancia. Propios:

| Archivo | Cuándo suena | Texto exacto | Segundos | Influencia |
|---|---|---|---|---|
| `entra` | Alguien entra al mundo | Friendly player joined notification, two soft ascending marimba notes, warm, short | 0.7 | 0.7 |
| `senal` | Alguien marca un punto | Sonar style ping, single clear bright ping with a short echo, attention marker | 0.9 | 0.7 |

## 6. Viento y cueva (bucles, `loop: true`)

| Archivo | Dónde suena | Texto exacto | Segundos |
|---|---|---|---|
| `amb_superficie` | Superficie | Seamless loop of a calm desert evening ambience, soft warm wind, distant faint crickets, peaceful, no music | 12 |
| `amb_mina` | Bajo tierra; sube con la profundidad | Seamless loop of deep underground mine cave ambience, low airy drone, occasional distant water drips and faint rock creaks, dark and spacious, no music | 12 |
| `amb_altura` | Volando alto y cayendo; más fuerte con la velocidad | Seamless loop of strong high altitude wind rushing past, steady airy whoosh, no gusts, no music | 8 |
| `amb_espacio` | Sobre los 100 km | Seamless loop of deep space ambience, very low soft cosmic hum with a faint ethereal shimmer, vast and calm, no music | 12 |

## 7. Música (instrumental, para repetirse)

| Archivo | Dónde suena | Texto exacto | Duración |
|---|---|---|---|
| `musica_superficie` | Superficie y edificios | Instrumental warm frontier desert sunset theme for a cozy mining game: gentle fingerpicked acoustic guitar, soft harmonica accents, light hand percussion, warm upright bass, hopeful and relaxed, 92 bpm, loops seamlessly, no vocals | 75 s |
| `musica_mina` | De 0 a 650 m | Instrumental underground mining exploration music: mysterious but cozy, soft marimba and kalimba arpeggios, deep warm sub bass pulses, subtle echoing percussion like distant pickaxes, airy pads, steady 100 bpm, hypnotic, loops seamlessly, no vocals | 90 s |
| `musica_fondo` | De 650 m al fondo | Instrumental dark tense deep cave music: low ominous drones, slow heartbeat-like bass drum, sparse eerie glassy bells, distant metallic echoes, a growing sense of heat and danger, 70 bpm, loops seamlessly, no vocals | 90 s |
| `musica_cielo` | De 400 m a 40 km de altura | Instrumental light airy flying theme: soft plucked strings and gentle flute over warm pads, a feeling of rising above the clouds at golden hour, calm and uplifting, 84 bpm, loops seamlessly, no vocals | 75 s |
| `musica_espacio` | Sobre los 40 km | Instrumental ethereal space ambient music: slowly evolving warm synth pads, shimmering glassy arpeggios, deep soft bass, a sense of awe floating above the planet with the Moon ahead, cinematic and peaceful, 60 bpm, loops seamlessly, no vocals | 90 s |

---

## Qué se hace con lo que llegue

1. Recortar el silencio inicial de cada efecto para que suene al instante.
2. Nivelar: efectos a −1 dB de pico; bucles y música más bajos.
3. Los bucles se empalman cola con cabeza para que no se note la vuelta.
4. Efectos y bucles en mono a 64 kbps, juntos en dos archivos; la música en estéreo a 96 kbps, un archivo por zona.
5. **Nada de esto entra en la descarga inicial**: el juego arranca con sus sonidos por código y cambia a los grabados cuando terminan de bajar. La música solo baja la de la zona donde está el jugador.

Peso estimado: efectos y bucles ≈ 0.9 MB; música ≈ 1 MB por zona.

<!-- RLR · Ricardo López Reyero -->
