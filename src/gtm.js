// RLR · Ricardo López Reyero — Mina · el tablero interno de salida al mercado (mina.capitaltorreon.com/gtm)
// Aquí no vive el plan: el plan, sus tareas y las fichas de personas son documentos internos que se guardan en un cajón privado (R2,
// «mina-interno») y solo se entregan a quien entra con un correo de la casa. Este archivo es la puerta y la libreta:
//   · la puerta: quién eres (pase del login de la casa) y si tu correo es de los dominios que pueden entrar;
//   · la libreta (objeto Gtm): cada palomita con quién la puso y a qué hora, lo real de cada punto de control y el seguimiento de las fichas.
import { DurableObject } from "cloudflare:workers";
import { verificarPase } from "./verificar.js";
const _RLR = "Ricardo López Reyero", _k = "EYE", _rev = 181218;

const DOMINIOS = ["ingenieriadigital.mx", "superleads.mx"];                    // solo estos correos entran y palomean
const ADMINES = ["ricardo@superleads.mx", "contacto@ingenieriadigital.mx"];     // además ven lo reservado: candidatos y el trato
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const corto = (s, n) => String(s == null ? "" : s).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
const entero = (v) => (v === "" || v == null || !isFinite(+v) || +v < 0 ? null : Math.min(1e12, Math.round(+v)));

export class Gtm extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      const q = this.ctx.storage.sql;
      q.exec("CREATE TABLE IF NOT EXISTS marcas (id TEXT PRIMARY KEY, estado TEXT NOT NULL, por TEXT NOT NULL, nombre TEXT, cuando INTEGER NOT NULL)");
      q.exec("CREATE TABLE IF NOT EXISTS bitacora (n INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT NOT NULL, estado TEXT NOT NULL, por TEXT NOT NULL, nombre TEXT, cuando INTEGER NOT NULL)");
      q.exec("CREATE TABLE IF NOT EXISTS puntos (id TEXT PRIMARY KEY, u INTEGER, i INTEGER, mu INTEGER, mi INTEGER, por TEXT, cuando INTEGER)");
      q.exec("CREATE TABLE IF NOT EXISTS fichas (id TEXT PRIMARY KEY, estado TEXT, notas TEXT, por TEXT, cuando INTEGER)");
      q.exec("CREATE TABLE IF NOT EXISTS fichas_mas (id TEXT PRIMARY KEY, datos TEXT NOT NULL, por TEXT, cuando INTEGER)");
    });
  }
  // todo lo que la página necesita para pintarse: las marcas, los puntos y la bitácora reciente (de ahí salen la racha y el marcador)
  estado() {
    const q = this.ctx.storage.sql, marcas = {}, puntos = {};
    for (const r of q.exec("SELECT id, estado, por, nombre, cuando FROM marcas")) marcas[r.id] = { e: r.estado, por: r.por, nombre: r.nombre || "", cuando: r.cuando };
    for (const r of q.exec("SELECT id, u, i, mu, mi, por, cuando FROM puntos")) puntos[r.id] = { u: r.u, i: r.i, mu: r.mu, mi: r.mi, por: r.por || "", cuando: r.cuando || 0 };
    const bitacora = q.exec("SELECT n, id, estado, por, nombre, cuando FROM bitacora ORDER BY n DESC LIMIT 400").toArray();
    return { marcas, puntos, bitacora, ultimo: bitacora.length ? bitacora[0].n : 0 };
  }
  // una palomita (o quitarla, o «en curso»): queda quién y cuándo, y además un renglón en la bitácora que no se borra
  marcar(id, estado, quien) {
    const q = this.ctx.storage.sql, ahora = Date.now();
    if (estado === "p") q.exec("DELETE FROM marcas WHERE id = ?", id);
    else q.exec("INSERT INTO marcas (id, estado, por, nombre, cuando) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET estado = excluded.estado, por = excluded.por, nombre = excluded.nombre, cuando = excluded.cuando", id, estado, quien.correo, quien.nombre, ahora);
    q.exec("INSERT INTO bitacora (id, estado, por, nombre, cuando) VALUES (?, ?, ?, ?, ?)", id, estado, quien.correo, quien.nombre, ahora);
    return this.estado();
  }
  // lo real (u, i) o la meta (mu, mi) de un punto de control
  punto(id, k, v, quien) {
    const q = this.ctx.storage.sql;
    q.exec("INSERT INTO puntos (id, por, cuando) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET por = excluded.por, cuando = excluded.cuando", id, quien.correo, Date.now());
    q.exec(`UPDATE puntos SET ${k} = ? WHERE id = ?`, v, id);                 // k ya viene revisada: u, i, mu o mi
    return this.estado();
  }
  // el seguimiento de las fichas de personas (solo para quien administra)
  fichas() {
    const q = this.ctx.storage.sql, e = {};
    for (const r of q.exec("SELECT id, estado, notas, por, cuando FROM fichas")) e[r.id] = { estado: r.estado || "por_contactar", notas: r.notas || "", updated_por: r.por || "", updated_at: Math.floor((r.cuando || 0) / 1000) };
    const mas = q.exec("SELECT datos FROM fichas_mas ORDER BY cuando").toArray().map((r) => { try { return JSON.parse(r.datos); } catch { return null; } }).filter(Boolean);
    return { e, mas };
  }
  fichaGuardar(id, cambios, quien) {
    const q = this.ctx.storage.sql, a = q.exec("SELECT estado, notas FROM fichas WHERE id = ?", id).toArray()[0] || {};
    const estado = typeof cambios.estado === "string" ? corto(cambios.estado, 24) : a.estado || "por_contactar", notas = typeof cambios.notas === "string" ? cambios.notas.slice(0, 4000) : a.notas || "", ahora = Date.now();
    q.exec("INSERT INTO fichas (id, estado, notas, por, cuando) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET estado = excluded.estado, notas = excluded.notas, por = excluded.por, cuando = excluded.cuando", id, estado, notas, quien.correo, ahora);
    return { estado, notas, updated_por: quien.correo, updated_at: Math.floor(ahora / 1000) };
  }
  fichaAgregar(f, quien) {
    const q = this.ctx.storage.sql;
    if (q.exec("SELECT COUNT(*) AS n FROM fichas_mas").one().n >= 80) return null;
    q.exec("INSERT INTO fichas_mas (id, datos, por, cuando) VALUES (?, ?, ?, ?)", f.id, JSON.stringify(f), quien.correo, Date.now());
    return f;
  }
}

// Quién toca la puerta. Devuelve { correo, nombre, admin } o un motivo: "nadie" (sin pase o vencido) o "ajeno" (correo de otro dominio).
async function quienEs(request, env, u) {
  const cred = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim();
  let q = null;
  // en la computadora de pruebas (solo ahí) sirve un pase de mentiras: «prueba:<quien>:<correo>»
  if (env.MINA_PRUEBA === "1" && ["::1", "127.0.0.1"].includes(request.headers.get("CF-Connecting-IP")) && cred.startsWith("prueba:")) { const [, sub, email] = cred.split(":"); q = { email, name: "Prueba " + sub }; }
  else if (cred.length > 100 && cred.length < 4096) { try { q = await verificarPase(cred, u.hostname); } catch {} }
  const correo = q && typeof q.email === "string" ? q.email.trim().toLowerCase() : "";
  if (!/^[^\s@]{1,64}@[a-z0-9.-]{3,80}$/.test(correo)) return { motivo: "nadie" };
  if (!DOMINIOS.includes(correo.split("@")[1])) return { motivo: "ajeno", correo };
  return { correo, nombre: corto(q.name, 60) || correo.split("@")[0], admin: ADMINES.includes(correo) };
}
// La página que se entrega: a quien no administra se le quita, aquí en el servidor, todo lo que va entre las marcas de «reservado».
const sinReservado = (html) => html.replace(/<!--RESERVADO-->[\s\S]*?<!--\/RESERVADO-->/g, "");

export async function gtmApi(u, request, env) {
  const ruta = u.pathname.replace(/^\/api\/gtm\/?/, ""), M = request.method;
  // Solo en la computadora de pruebas (MINA_PRUEBA vive en .dev.vars, que nunca se publica, y la petición sale de la misma máquina):
  // meter los documentos al cajón de mentiras. En producción se suben con «wrangler r2 object put … --remote».
  if (M === "PUT" && env.MINA_PRUEBA === "1" && ["::1", "127.0.0.1"].includes(request.headers.get("CF-Connecting-IP")) && /^sembrar\/(pagina\.html|candidatos\.json)$/.test(ruta)) { await env.INTERNO.put("gtm/" + ruta.slice(8), await request.arrayBuffer()); return json({ ok: 1 }); }
  const q = await quienEs(request, env, u);
  if (q.motivo) return json({ error: q.motivo, correo: q.correo || "", dominios: DOMINIOS }, q.motivo === "nadie" ? 401 : 403);
  const libreta = env.GTM.get(env.GTM.idFromName("mina")), yo = { correo: q.correo, nombre: q.nombre, admin: q.admin };
  let d = {}; if (M === "POST") { try { d = await request.json(); } catch { return json({ error: "datos" }, 400); } }

  if (ruta === "pagina" && M === "GET") {
    const o = await env.INTERNO.get("gtm/pagina.html");
    if (!o) return json({ error: "vacio" }, 404);
    const html = await o.text();
    return new Response(q.admin ? html : sinReservado(html), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" } });
  }
  if (ruta === "estado" && M === "GET") return json({ yo, ...(await libreta.estado()) });
  if (ruta === "tarea" && M === "POST") {
    const id = String(d.id || ""), estado = String(d.estado || "");
    if (!/^T\d{2,3}$/.test(id) || !["p", "c", "h"].includes(estado)) return json({ error: "datos" }, 400);
    return json({ yo, ...(await libreta.marcar(id, estado, q)) });
  }
  if (ruta === "punto" && M === "POST") {
    const id = String(d.id || ""), k = String(d.k || ""), v = entero(d.v);
    if (!/^P\d{2}$/.test(id) || !["u", "i", "mu", "mi"].includes(k) || (k[0] === "m" && v === 0)) return json({ error: "datos" }, 400);
    return json({ yo, ...(await libreta.punto(id, k, v, q)) });
  }
  // ── las fichas de personas: solo quien administra. Mismas tres rutas que pide el módulo de fichas. ──
  if (ruta === "candidatos" || ruta.startsWith("candidatos/")) {
    if (!q.admin) return json({ error: "reservado" }, 403);
    const o = await env.INTERNO.get("gtm/candidatos.json"); let base = { meta: {}, fichas: [] };
    if (o) { try { base = JSON.parse(await o.text()); } catch {} }
    if (ruta === "candidatos" && M === "GET") { const s = await libreta.fichas(); return json({ meta: base.meta || {}, fichas: (base.fichas || []).concat(s.mas).map((f) => ({ ...f, estado: "por_contactar", notas: "", ...(s.e[f.id] || {}) })) }); }
    if (ruta === "candidatos" && M === "POST") {
      const nombre = corto(d.nombre, 90); if (!nombre) return json({ error: "falta_nombre" }, 400);
      if (d.liga && !/^https:\/\/\S{4,300}$/i.test(String(d.liga))) return json({ error: "liga_invalida" }, 400);
      const f = await libreta.fichaAgregar({ id: "mio-" + Date.now().toString(36), grupo: "banca", orden: 99, nombre, liga: corto(d.liga, 300), titular: corto(d.titular, 200), ciudad: corto(d.ciudad, 80), resumen: corto(d.porque, 1200), agregado_por: q.correo }, q);
      return f ? json({ ficha: { ...f, estado: "por_contactar", notas: "" } }) : json({ error: "demasiados" }, 400);
    }
    const id = decodeURIComponent(ruta.slice("candidatos/".length));
    if (M === "POST" && /^[a-z0-9-]{2,60}$/.test(id)) return json(await libreta.fichaGuardar(id, d, q));
  }
  return json({ error: "no" }, 404);
}
