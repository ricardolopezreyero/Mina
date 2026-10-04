// RLR · La Pinturería: la escalera de precios, igual para todos. Única fuente de verdad (el juego la pide al abrir la tienda).
// Cada nivel incluye los de abajo; subir cuesta solo la diferencia. Precios en pesos mexicanos, con impuestos incluidos.
export const NIVELES = [
  { n: 1, precio: 19, nombre: "Un color", que: "El cuerpo de tu maquinita del color que quieras: 24 colores." },
  { n: 2, precio: 39, nombre: "Dos colores", que: "La cabina y las orugas también, del color que quieras." },
  { n: 3, precio: 79, nombre: "Calcomanías", que: "48 calcomanías para el costado." },
  { n: 4, precio: 149, nombre: "Luces", que: "Faro de color y luz de piso que se ve en la oscuridad." },
  { n: 5, precio: 299, nombre: "Estela", que: "Deja estela al volar: chispas doradas, arcoíris, estrellas, corazones o burbujas." },
  { n: 6, precio: 599, nombre: "Claxon y placa", que: "Un claxon con seis melodías (tecla B, lo oyen los de cerca) y tu nombre con placa: dorada, con corona o con marco." },
  { n: 7, precio: 999, nombre: "Carrocería", que: "Tres carrocerías exclusivas: El Escarabajo, La Locomotora y El Submarino." },
  { n: 8, precio: 1999, nombre: "Mascota", que: "Una mascota que te sigue a todos lados: pájaro, perro, dron, mariposa o luciérnaga." },
  { n: 9, precio: 3999, nombre: "Tu piedra", que: "Tu nombre grabado en una piedra del Jardín del Fondo, en cada mundo que termines." },
  { n: 10, precio: 9999, nombre: "Hecha a mano", que: "Una maquinita diseñada contigo, a mano, única en el mundo. Conversación, bocetos y dos o tres semanas." },
];
export const MECENAS_MIN = 99;          // ✦ Mecenas: lo que quieras dar, desde aquí. No da nada más que el ✦ y las gracias.
export const FONDO_PRECIO = 19;         // Fondo común: la primera pintura de una maquinita nueva
export const TOPE_MES = 5000;           // tope de cuidado por maquinita cada 30 días
export const precioDe = (n) => (NIVELES.find((x) => x.n === n) || { precio: 0 }).precio;

// La pintura: qué puede traer según el nivel. Lo que no alcanza el nivel se descarta (también en el servidor).
export const COLORES = ["#ffd23f", "#ff6b5a", "#6ec3ff", "#6fdc7a", "#c05cff", "#ff9f40", "#f3e6d8", "#ff7ac8", "#ffffff", "#1b1b1b", "#e0483a", "#2f8a3a", "#2a6fa8", "#7426a8", "#b05e12", "#9a8774", "#00c2a8", "#f5e663", "#ff3d7f", "#3d5afe", "#8bc34a", "#795548", "#607d8b", "#c0a16b"];
export const CALCAS = ["⭐", "❤️", "⚡", "🔥", "🌈", "🌙", "☀️", "🌵", "🌸", "🍀", "🍉", "🌶️", "🦅", "🐺", "🦂", "🐢", "🐝", "🦋", "🐉", "🦈", "⚓", "🎸", "🎵", "🎲", "⚽", "🏀", "🏁", "🚀", "💎", "👑", "💀", "🤖", "👾", "🎯", "🧭", "⛏️", "🔱", "✝️", "☮️", "♾️", "🇲🇽", "🏳️‍🌈", "🍕", "🌮", "🥑", "🐾", "🧿", "✨"];
export const LUCES = ["#fff3b0", "#ff4d4d", "#4dff88", "#4da6ff", "#ff4df2", "#ffd23f", "#ffffff", "#9d4dff"];
export const ESTELAS = ["Ninguna", "Chispas doradas", "Arcoíris", "Estrellas", "Corazones", "Burbujas"];
export const BOCINAS = ["Pip-pip", "Mariachi", "Tren", "Barco", "Risa", "Campanitas"];
export const PLACAS = ["Normal", "Dorada", "Con corona", "Con marco"];
export const CARROS = ["De fábrica", "El Escarabajo", "La Locomotora", "El Submarino"];
export const MASCOTAS = ["Ninguna", "Pájaro", "Perro", "Dron", "Mariposa", "Luciérnaga"];
const hex = (v, lista) => (typeof v === "string" && lista.includes(v.toLowerCase()) ? v.toLowerCase() : "");
const idx = (v, lista) => (Number.isInteger(v) && v >= 0 && v < lista.length ? v : 0);
export function filtrarPinta(p, nivel) {
  p = p && typeof p === "object" ? p : {};
  const q = {};
  if (nivel >= 1) q.c1 = hex(p.c1, COLORES);
  if (nivel >= 2) { q.c2 = hex(p.c2, COLORES); q.c3 = hex(p.c3, COLORES); }
  if (nivel >= 3) q.calca = idx(p.calca, CALCAS.concat([""]));          // el último índice (48) = ninguna
  if (nivel >= 4) q.luz = hex(p.luz, LUCES);
  if (nivel >= 5) q.estela = idx(p.estela, ESTELAS);
  if (nivel >= 6) { q.bocina = idx(p.bocina, BOCINAS); q.placa = idx(p.placa, PLACAS); }
  if (nivel >= 7) q.carro = idx(p.carro, CARROS);
  if (nivel >= 8) q.mascota = idx(p.mascota, MASCOTAS);
  for (const k of Object.keys(q)) if (q[k] === "" || q[k] === 0) delete q[k];
  if (q.calca === 48) delete q.calca;
  return q;
}
