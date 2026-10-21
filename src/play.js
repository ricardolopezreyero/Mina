// ─────────────────────────────────────────────────────────────────────────────
// Mina · el cobro con Google Play — Ricardo López Reyero (RLR)
// Dentro de la app de Android (Google Play) lo digital se cobra con Google Play Billing, no con Stripe. El juego pide la
// compra con la Digital Goods API; Google entrega un «token» de compra; aquí se le pregunta a Google si ese token es una
// compra real y pagada, y solo entonces se entrega (una sola vez por pedido). La verdad de lo comprado sigue viviendo
// en la maquinita (src/mundo.js): Google solo cobra.
//
// Productos (los mismos nombres en la consola de Play; ver Mina_Android/productos-play.csv):
//   nivel_3 … nivel_10   un nivel de La Pinturería, el siguiente al que se tiene (en la app se sube un nivel a la vez,
//                        porque Google cobra precios fijos y no «la diferencia»)
//   pieza_motor_1 …      una pieza de sonido
//   mecenas_99 …         apoyo a quien hace Mina, en montos fijos
// Todos son «consumibles» para Google: así se pueden volver a comprar (regalos) y la cuenta la lleva Mina.
//
// Para verificar hace falta una cuenta de servicio de Google Cloud con acceso a la API de Google Play Developer, ligada a
// la app en Play Console. Su archivo JSON vive en la bóveda (Secrets Store) como PLAY_CUENTA_SERVICIO. Sin él, aquí se
// contesta «pronto» y la app no cobra.
// ─────────────────────────────────────────────────────────────────────────────
import { NIVELES, GRATIS, PIEZAS, MECENAS_MIN } from "./tienda.js";

const _RLR = "Ricardo López Reyero", _k = "EYE", _rev = 181218;
export const PAQUETE = "mx.capitaltorreon.mina";
export const MECENAS_MONTOS = [99, 199, 499, 999];

// El catálogo de productos de Play, derivado del de La Pinturería: [id, tipo, precio, nombre para la consola, descripción]
export function productosPlay() {
  const l = [];
  for (const n of NIVELES) if (n.n > GRATIS) l.push({ id: "nivel_" + n.n, tipo: "nivel", nivel: n.n, precio: n.precio - (NIVELES.find((x) => x.n === n.n - 1) || { precio: 0 }).precio, nombre: `Nivel ${n.n} · ${n.nombre}`, de: n.que });
  for (const tipo of Object.keys(PIEZAS)) for (const p of PIEZAS[tipo]) l.push({ id: `pieza_${tipo}_${p.i}`, tipo: "pieza", pieza: `${tipo}:${p.i}`, precio: p.precio, nombre: `${tipo === "motor" ? "Motor" : "Canción"} · ${p.n}`, de: p.d });
  for (const m of MECENAS_MONTOS) if (m >= MECENAS_MIN) l.push({ id: "mecenas_" + m, tipo: "mecenas", monto: m, precio: m, nombre: `✦ Mecenas · $${m}`, de: "Apoyo a quien hace Mina. No da nada más que un ✦ junto a tu nombre y nuestras gracias." });
  return l;
}
export const productoPlay = (id) => productosPlay().find((p) => p.id === id) || null;

// ── Hablar con Google: un pase de acceso firmado con la llave de la cuenta de servicio (dura una hora; se guarda en memoria)
let paseCache = { t: 0, v: "" };
const b64url = (u) => btoa(String.fromCharCode(...new Uint8Array(u))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function paseGoogle(cuentaJson) {
  if (paseCache.v && Date.now() < paseCache.t) return paseCache.v;
  const c = JSON.parse(cuentaJson), ahora = Math.floor(Date.now() / 1000), enc = new TextEncoder();
  const cab = b64url(enc.encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const cuerpo = b64url(enc.encode(JSON.stringify({ iss: c.client_email, scope: "https://www.googleapis.com/auth/androidpublisher", aud: "https://oauth2.googleapis.com/token", iat: ahora, exp: ahora + 3600 })));
  const pem = c.private_key.replace(/-----[A-Z ]+-----/g, "").replace(/\s+/g, ""), der = Uint8Array.from(atob(pem), (ch) => ch.charCodeAt(0));
  const llave = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const firma = b64url(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", llave, enc.encode(cab + "." + cuerpo)));
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: cab + "." + cuerpo + "." + firma }) });
  const j = await r.json(); if (!r.ok || !j.access_token) throw new Error("google: " + (j.error || r.status));
  paseCache = { t: Date.now() + 50 * 60000, v: j.access_token };
  return j.access_token;
}

// ¿Este token es una compra real, pagada, de ese producto? Devuelve { orden, pagada, consumida } o null si Google no lo conoce.
export async function verificarCompra(cuentaJson, sku, token) {
  const pase = await paseGoogle(cuentaJson);
  const r = await fetch(`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PAQUETE}/purchases/products/${encodeURIComponent(sku)}/tokens/${encodeURIComponent(token)}`, { headers: { authorization: "Bearer " + pase } });
  if (r.status === 404 || r.status === 400) return null;
  if (!r.ok) throw new Error("play: " + r.status);
  const j = await r.json();
  // purchaseState: 0 comprada · 1 cancelada · 2 pendiente. consumptionState: 0 sin consumir · 1 consumida
  return { orden: String(j.orderId || ""), pagada: j.purchaseState === 0, consumida: j.consumptionState === 1, prueba: j.purchaseType === 0 };
}
