// ─────────────────────────────────────────────────────────────────────────────
// Mina · el filtro del chat y de los nombres — Ricardo López Reyero (RLR)
// Lo que se escribe en Mina lo leen otras personas, muchas de 13 a 18 años. Antes de guardar o repartir un mensaje del chat,
// el nombre de una maquinita o el de un mundo, las palabras ofensivas se tapan con «•••». No intenta adivinar intenciones:
// solo tapa insultos fuertes, palabras sexuales y ofensas contra grupos de personas. Lo demás lo atienden los reportes
// (Reportar en el chat) y la moderación (/moderacion). Las palabras se comparan ya sin acentos, en minúsculas, con los
// números que imitan letras traducidos (p0t0 → poto) y con las letras que se estiran varias veces juntadas (puuuto → puto).
// Para agregar una palabra: escríbela tal cual en EXACTAS (la palabra completa) o en RAICES (todo lo que empiece así).
// ─────────────────────────────────────────────────────────────────────────────
const _RLR = "Ricardo López Reyero", _k = "EYE", _rev = 181218;

// La palabra completa (así no se tapan palabras inocentes que se le parecen: «Maricela», «vergüenza», «computadora»)
const EXACTAS = [
  // insultos fuertes
  "pendejo", "pendeja", "pendejos", "pendejas", "pendejada", "pendejadas", "culero", "culera", "culeros", "culeras",
  "cabron", "cabrona", "cabrones", "cabronas", "chinga", "chingas", "chingate", "chinguen", "chingues", "chingatumadre",
  "hijueputa", "hdp", "ctm", "ptm", "mamon", "mamona", "malparido", "malparida", "conchetumare",
  // sexuales
  "verga", "vergas", "vergazo", "vergota", "panocha", "pucha", "chichis", "coger", "cogida", "cogiendo", "porno", "xxx",
  "puto", "puta", "putos", "putas", "putita", "putito", "putazo", "putiza", "putero",
  // contra grupos de personas
  "joto", "jotos", "maricon", "maricones", "marica", "maricas", "mayate", "mayates", "sudaca", "sudacas",
  // inglés
  "fuck", "fucks", "fucked", "fucking", "fucker", "motherfucker", "shit", "bitch", "bitches", "cunt", "cunts", "whore", "whores",
  "slut", "sluts", "dick", "dicks", "pussy", "cock", "asshole", "assholes", "nigger", "niggers", "nigga", "niggas", "fag", "fags",
  "faggot", "faggots", "retard", "retarded", "porn",
];
// Todo lo que empiece así
const RAICES = ["pendej", "culer", "motherfuck", "fuck", "chingatumadr", "hijodeput", "hijoeput", "nigger", "faggot", "asshole", "pinchepu"];

const LEET = { 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", 7: "t", "@": "a", $: "s" };
// la forma con la que se compara: minúsculas, sin acentos, sin lo que no sea letra, y lo estirado (3 o más iguales) en una sola
export function norma(w) {
  return String(w || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[0134578@$]/g, (c) => LEET[c] || c).replace(/[^a-z]/g, "").replace(/(.)\1{2,}/g, "$1");
}
const EXACTA = new Set(EXACTAS.map(norma).filter(Boolean)), RAIZ = RAICES.map(norma);
export const ofensiva = (w) => { const n = norma(w); return n.length > 1 && (EXACTA.has(n) || RAIZ.some((r) => n.startsWith(r))); };

// Tapa cada palabra ofensiva del texto. Una «palabra» incluye letras, números y los separadores con los que se disfrazan (p.u.t.o).
export function filtrar(texto) {
  const t = String(texto ?? "");
  return t.replace(/[\p{L}\p{N}@$*._-]+/gu, (w) => (ofensiva(w) ? "•••" : w));
}
