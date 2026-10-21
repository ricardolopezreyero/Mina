// ─────────────────────────────────────────────────────────────────────────────
// Mina · la moderación — Ricardo López Reyero (RLR)
// Lo que la gente reporta desde el chat (un mensaje, o el nombre de una maquinita) llega aquí: se guarda en la tabla mundial,
// le llega un correo a quien modera y se atiende en mina.capitaltorreon.com/moderacion. Solo entran las cuentas que
// administran (las mismas del tablero interno, ADMINES en src/gtm.js), con el login de la casa.
// Lo que se puede decidir: borrar el mensaje, cambiarle el nombre a la maquinita, pausar su chat (7 días, 30 días o sin
// fecha) o descartar el reporte. Con tres reportes de personas distintas, un mensaje ya se ocultó solo, sin esperar a nadie.
// ─────────────────────────────────────────────────────────────────────────────
import { quienEs } from "./gtm.js";

const _RLR = "Ricardo López Reyero", _k = "EYE", _rev = 181218;
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
async function secreto(v) { if (!v) return ""; if (typeof v === "string") return v; try { return (await v.get()) || ""; } catch { return ""; } }
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const MOTIVO_TX = { acoso: "Acoso o insultos", sexual: "Contenido sexual", odio: "Odio o discriminación", violencia: "Amenazas o violencia", datos: "Datos personales", spam: "Spam o estafa", nombre: "Nombre ofensivo", otro: "Otro" };
const CORREOS = ["contacto@ingenieriadigital.mx", "ricardo@superleads.mx"];

// El correo a quien modera: qué se reportó, por qué y dónde atenderlo. Corto y con un solo botón.
export async function avisarModeracion(env, e) {
  const llave = await secreto(env.RESEND_API_KEY); if (!llave) return;
  const motivo = Object.keys(e.motivos || {}).map((k) => MOTIVO_TX[k] || k).join(", ");
  const html = `<div style="background:#fff;color:#1b1b1b;font:16px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px 20px;max-width:520px;margin:0 auto">
    <p style="margin:0 0 10px"><b>🚩 Reporte en Mina · ${esc(motivo)}</b></p>
    <p style="margin:0 0 6px;color:#555">${e.tipo === "mensaje" ? "Mensaje de" : "Nombre de la maquinita"} <b>${esc(e.autor && e.autor.n)}</b> en ${esc(e.nm || "el mundo " + e.mundo)}</p>
    <p style="margin:0 0 14px;background:#f4f4f4;border-radius:8px;padding:10px 12px">${esc(e.x)}</p>
    ${e.nota ? `<p style="margin:0 0 14px;color:#555">Nota de quien reporta: ${esc(e.nota)}</p>` : ""}
    ${e.oculto ? `<p style="margin:0 0 14px;color:#555">Ya se ocultó solo: lo reportaron tres personas.</p>` : ""}
    <p style="margin:18px 0"><a href="https://mina.capitaltorreon.com/moderacion#r${e.id}" style="background:#1b1b1b;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;display:inline-block">Atender el reporte</a></p>
    <p style="margin:0;color:#777;font-size:13px">Mina · aviso automático de moderación. Las tiendas de apps piden atender los reportes pronto.</p></div>`;
  try { await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: "Bearer " + llave, "content-type": "application/json" }, body: JSON.stringify({ from: "Mina <hola@capitaltorreon.com>", to: CORREOS, subject: "🚩 Reporte en Mina · " + motivo, html }) }); } catch {}
}

export async function moderacionApi(u, request, env) {
  const q = await quienEs(request, env, u);
  if (!q.correo) return json({ error: "nadie" }, 401);
  if (!q.admin) return json({ error: "ajeno", correo: q.correo }, 403);
  const tabla = env.TABLA.get(env.TABLA.idFromName("mundial")), mundo = (id) => env.MUNDO.get(env.MUNDO.idFromName(id)), ruta = u.pathname.replace(/^\/api\/moderacion\/?/, "");
  if (ruta === "lista" && request.method === "GET") return json({ yo: { correo: q.correo, nombre: q.nombre }, reportes: await tabla.listaReportes(), silencio: await tabla.silenciados(), motivos: MOTIVO_TX });
  if (ruta === "accion" && request.method === "POST") {
    let d; try { d = await request.json(); } catch { return json({ error: "datos" }, 400); }
    if (d.accion === "quitarSilencio") { if (!/^[0-9a-f]{16}$/.test(d.h || "")) return json({ error: "datos" }, 400); return json({ ok: 1, silencio: await tabla.ponerSilencio(d.h, 0, q.correo) }); }
    const e = (await tabla.listaReportes()).find((x) => x.id === Number(d.id)); if (!e) return json({ error: "no" }, 404);
    const a = e.autor || {}, M = /^[2-9A-HJ-NP-Z]{8}$/.test(e.mundo || "") ? mundo(e.mundo) : null;
    let estado = "";
    if (d.accion === "borrar") { if (e.tipo !== "mensaje" || !M) return json({ error: "datos" }, 400); await M.moderar({ accion: "borrarMsg", id: Number(String(e.ref).slice(1)) }); estado = "borrado"; }
    else if (d.accion === "renombrar") { if (!M) return json({ error: "datos" }, 400); await M.moderar({ accion: "renombrar", i: a.i }); estado = "renombrado"; }
    else if (["pausa7", "pausa30", "pausa"].includes(d.accion)) {
      if (!/^[0-9a-f]{16}$/.test(a.h || "")) return json({ error: "sinhuella" }, 400);
      await tabla.ponerSilencio(a.h, d.accion === "pausa7" ? 7 : d.accion === "pausa30" ? 30 : 3650, q.correo, a.n);
      if (M) { try { await M.moderar({ accion: "silencio" }); } catch {} }
      if (e.tipo === "mensaje" && M && d.borrar) await M.moderar({ accion: "borrarMsg", id: Number(String(e.ref).slice(1)) });
      estado = d.accion === "pausa" ? "chat pausado sin fecha" : "chat pausado " + (d.accion === "pausa7" ? "7" : "30") + " días";
    }
    else if (d.accion === "descartar") estado = "descartado";
    else return json({ error: "accion" }, 400);
    return json({ ok: 1, reporte: await tabla.cerrarReporte(e.id, estado, q.correo), silencio: await tabla.silenciados() });
  }
  return json({ error: "no" }, 404);
}
