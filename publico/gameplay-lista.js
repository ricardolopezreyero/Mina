/* RLR · Ricardo López Reyero — Gameplay de Mina: las 33 tomas fijas, escogidas entre lo que filma el propio juego.
   Cada renglón es una receta: s = semilla · l = clase de toma (calle, veta, tesoro, lugar, franja) · d = metros · k = cuál lugar.
   El juego (en su modo cine) monta un mundo de esa semilla, pone la maquinita ahí y la deja jugar sola seis segundos.
   Después de estas 33 ya no hay lista: cada toma nace de una semilla nueva que no se repite (ver gameplay.html). */
'use strict';
window.GAMEPLAY = [
  { s: 20261005, l: "calle" },      // La superficie · 0 m
  { s: 20284762, l: "lugar", k: 1 },      // La Gruta de Cristal · 3,016 m
  { s: 20466899, l: "veta", d: 520 },      // La Corteza · 564 m
  { s: 20316438, l: "lugar", k: 6 },      // El Río subterráneo · 1,700 m
  { s: 20300600, l: "lugar", k: 4 },      // El Campamento abandonado · 358 m
  { s: 20356033, l: "lugar", k: 11 },      // El Jardín de cristal · 6,408 m
  { s: 20490656, l: "veta", d: 1100 },      // El Acuífero · 1,100 m
  { s: 20546089, l: "veta", d: 6500 },      // La Cristalera · 6,520 m
  { s: 20308519, l: "lugar", k: 5 },      // El Fósil gigante · 700 m
  { s: 20379790, l: "lugar", k: 14 },      // El Nido del dragón · 8,812 m
  { s: 20403547, l: "tesoro", d: 120 },      // La Corteza · 140 m
  { s: 20530251, l: "veta", d: 4100 },      // La Cristalera · 4,104 m
  { s: 20276843, l: "lugar", k: 0 },      // El Acuífero · 1,114 m
  { s: 20332276, l: "lugar", k: 8 },      // El Cementerio de maquinitas · 3,710 m
  { s: 20458980, l: "veta", d: 350 },      // La Corteza · 362 m
  { s: 20561927, l: "veta", d: 8700 },      // La Zona de presión · 8,704 m
  { s: 20292681, l: "lugar", k: 2 },      // La Ciudad Perdida · 5,636 m
  { s: 20411466, l: "tesoro", d: 400 },      // La Corteza · 400 m
  { s: 20506494, l: "veta", d: 2100 },      // Las Cavernas · 2,140 m
  { s: 20340195, l: "lugar", k: 9 },      // Las Aguas termales · 4,404 m
  { s: 20482737, l: "veta", d: 800 },      // La Corteza · 848 m
  { s: 20387709, l: "franja", d: 3332 },      // La franja de gemas · 3,326 m
  { s: 20363952, l: "lugar", k: 12 },      // El Lago de lava · 7,202 m
  { s: 20324357, l: "lugar", k: 7 },      // El Bosque de hongos · 2,312 m
  { s: 20419385, l: "tesoro", d: 900 },      // La Corteza · 900 m
  { s: 20554008, l: "veta", d: 8100 },      // La Zona de presión · 8,144 m
  { s: 20348114, l: "lugar", k: 10 },      // Los Guardianes · 5,110 m
  { s: 20435223, l: "tesoro", d: 4600 },      // La Cristalera · 4,608 m
  { s: 20514413, l: "veta", d: 2700 },      // Las Cavernas · 2,748 m
  { s: 20371871, l: "lugar", k: 13 },      // La Bóveda de la Compañía · 8,004 m
  { s: 20538170, l: "veta", d: 5300 },      // La Cristalera · 5,336 m
  { s: 20395628, l: "franja", d: 6666 },      // La franja de gemas · 6,660 m
  { s: 20569846, l: "veta", d: 9300 },      // La Zona de presión · 9,308 m
];
