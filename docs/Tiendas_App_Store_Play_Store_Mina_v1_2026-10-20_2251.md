# Mina en las tiendas · App Store y Google Play

**Ver en vivo: https://mina.capitaltorreon.com**

Versión 1 · 20 de octubre de 2026, 10:51 p. m. (hora de Torreón) · Ing. Ricardo López Reyero

Qué piden Apple y Google, qué ya cumple Mina, qué se contesta en cada formulario y qué falta para publicar. Orden recomendado: **primero Google Play, después App Store**.

<!-- RLR · Ricardo López Reyero · _k=EYE · _rev=181218 -->

---

## 1. Quién publica

| Dato | Valor |
|---|---|
| Razón social | **Consultores en Ingeniería Digital S.C.** |
| RFC | CID180905UD2 |
| Domicilio | Calle Pedro Camino 242-1, Col. Ampliación Los Ángeles, C.P. 27148, Torreón, Coah. |
| Teléfono | 871 277 8426 |
| Correo | contacto@ingenieriadigital.mx |

Las dos tiendas, para cuenta de **empresa**, piden un **número D-U-N-S** de la razón social (gratis en dnb.com; tarda días). Con cuenta de empresa, Google Play **no** pide la prueba cerrada de 12 personas durante 14 días que sí pide a las cuentas personales.

---

## 2. Las cuatro ligas que piden los formularios

| Para qué | Liga |
|---|---|
| Aviso de privacidad (las dos tiendas) | https://mina.capitaltorreon.com/privacidad |
| Términos y reglas de la comunidad | https://mina.capitaltorreon.com/terminos (reglas en `#reglas`) |
| Soporte (App Store pide «Support URL») | https://mina.capitaltorreon.com/soporte |
| Borrar la cuenta desde fuera de la app (Google Play lo exige) | https://mina.capitaltorreon.com/borrar-cuenta |

---

## 3. Lo que ya cumple Mina (construido el 20-oct-2026)

| Regla | Qué pide | Cómo lo cumple Mina |
|---|---|---|
| Aviso de privacidad | Una página pública con qué datos, para qué, con quién y cómo borrarlos | `/privacidad`: aviso integral conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (2025), con la razón social, derechos ARCO, proveedores (Cloudflare, Google, Stripe, Resend), menores y autoridad (Secretaría Anticorrupción y Buen Gobierno) |
| Apple 5.1.1(v) y Google «Account deletion» | Borrar la cuenta **desde la app**, y (Google) también **desde la web** | En el juego: Menú → Mi maquinita → Privacidad y datos → Borrar. En la web: `/borrar-cuenta` con el login de la casa. Se borra al momento: cuenta, maquinitas, compras, capturas (R2), tabla mundial, cumpleaños, mensajes; en mundos compartidos la maquinita queda como «Maquinita retirada»; los mundos donde solo jugó esa persona se borran. Sin cuenta, se borran las maquinitas que guarda el equipo |
| Apple 1.2 y Google «User Generated Content» | Filtrar contenido ofensivo, reportar, bloquear, contacto publicado, atender reportes pronto | **Filtro** en el servidor (`src/filtro.js`) para chat, nombres de maquinitas y de mundos. **Reportar** (toque en un mensaje, o 🚩 en la lista J), con motivo y nota; con 3 reportes distintos el mensaje se oculta solo. **Bloquear** en todos los mundos (por huella de maquinita): no ves sus mensajes, su nombre sale 🚫, sus golpes, reacciones y claxon no te llegan. **Moderación** en `/moderacion` (solo las dos cuentas que administran): borrar mensaje, cambiar nombre, pausar chat 7 / 30 días / sin fecha, descartar; correo a quien modera por cada reporte nuevo. Contacto en `/soporte` |
| Términos | Reglas de conducta claras y consecuencias | `/terminos`: edad mínima 13, reglas de la comunidad, compras, reembolsos, PROFECO, ley de México y tribunales de Torreón |
| Edad | Decir para quién es | 13 años en adelante; de 13 a 17, compras con permiso de tutor. No va en la sección «Niños» ni en «Familias» |

Probado en local con 33 comprobaciones de punta a punta (filtro, reportes, ocultar solo, moderación, pausa, borrar con sesión, con pase y sin cuenta, capturas) y en pantalla (reportar, bloquear, borrar desde el juego).

---

## 4. Respuestas para los formularios

### App Store Connect · «App Privacy»

- **¿Rastreas (tracking)?** No.
- **Datos que se recogen** (todos «ligados a la persona», ninguno para publicidad):

| Tipo (Apple) | Cuándo | Para qué |
|---|---|---|
| Contact Info → Email Address, Name | Solo si entra con su cuenta | App Functionality |
| Identifiers → User ID | Identificador de Google (con cuenta) y el código de la maquinita | App Functionality |
| User Content → Other User Content | Mensajes del chat, nombres | App Functionality |
| User Content → Photos or Videos | Capturas de pantalla del juego que la persona decide guardar | App Functionality |
| User Content → Gameplay Content | Progreso, mundos | App Functionality |
| Purchases → Purchase History | Compras de La Pinturería | App Functionality |
| Contact Info → Other (cumpleaños, opcional) | Día y mes | App Functionality |

- **Clasificación por edad:** contestar «sí» a mensajes entre usuarios y contenido generado por usuarios, «no» a todo lo demás (sin violencia realista, sin azar, sin web abierta). Se espera **13+**.

### Google Play Console · «Data safety»

- **¿Se recogen datos?** Sí. **¿Se comparten con terceros?** No (los proveedores que operan por nuestra cuenta no cuentan como «compartir»).
- **Cifrados en tránsito:** sí. **La persona puede pedir que se borren:** sí → `/borrar-cuenta`.
- **Tipos:** Personal info (Name, Email address, User IDs) · Financial info (Purchase history) · Messages (Other in-app messages) · Photos and videos (Photos) · App activity (Other actions: progreso del juego). Todos para «App functionality» y «Account management»; ninguno para publicidad ni analítica.
- **Cuestionario IARC:** usuarios pueden comunicarse (sí), compras digitales (sí), comparte ubicación (no), apuestas o azar (no).
- **Público objetivo:** 13 años en adelante (no «diseñada para niños»).

---

## 5. Lo que falta para publicar

### Google Play (primero)

1. **Cuenta de desarrollador de empresa** a nombre de Consultores en Ingeniería Digital S.C. ($25 dólares, un pago) con su D-U-N-S.
2. **El paquete Android** como Trusted Web Activity (Bubblewrap): la app es Chrome mostrando mina.capitaltorreon.com; cada versión de la página llega sola, sin revisión.
3. **`/.well-known/assetlinks.json`** en el sitio con la huella SHA-256 de la firma que da Play (prueba que la app y la página son del mismo dueño).
4. **Cobro con Google Play Billing** para La Pinturería dentro de la app (Digital Goods API + Payment Request). En la web sigue Stripe.
5. **Ficha:** ícono 512 × 512, imagen destacada 1024 × 500, capturas de teléfono (salen de Galería y Gameplay), descripción corta y larga, video opcional.

### App Store (después)

1. **Apple Developer Program** de empresa ($99 dólares al año) con el D-U-N-S.
2. **Envolver el juego** con Capacitor, con los archivos dentro de la app (no solo una liga), para pasar la regla 4.2 de «funcionalidad mínima».
3. **Sign in with Apple** en login.capitaltorreon.com (regla 4.8: si se ofrece Google, hay que ofrecer también una opción que cuide la privacidad). El login abre en el navegador del sistema, no incrustado.
4. **Cobro con StoreKit** (compras dentro de la app de Apple) para La Pinturería.
5. **Ficha y TestFlight:** capturas de iPhone y iPad, descripción, y una cuenta de prueba para quien revisa.

### En el juego, antes de cualquier tienda

- Revisar los textos de privacidad y términos con un abogado (yo no lo soy): están escritos para cumplir, pero conviene una lectura legal.
- Avisar dentro del juego que hay aviso de privacidad nuevo la primera vez que alguien entre después de publicarlo (hoy las ligas están en Menú → Mi maquinita y en «Mis mundos»).
- Probar el chat, el reporte y el borrado en un teléfono Android y un iPhone reales.

---

## 6. Dónde vive cada cosa

| Archivo | Qué es |
|---|---|
| `publico/privacidad.html`, `publico/terminos.html`, `publico/soporte.html`, `publico/borrar-cuenta.html` | Las cuatro páginas públicas (estilo en `publico/legal.css`, botones A−/A+ en `publico/legal.js`) |
| `publico/moderacion.html` | El panel de moderación (solo administradores) |
| `src/filtro.js` | El filtro de palabras: listas `EXACTAS` y `RAICES` |
| `src/moderacion.js` | La API de moderación y el correo de cada reporte nuevo |
| `src/mundo.js` | `borrarDatos`, `borrarCuenta` (`POST /api/cuenta/borrar`), `Mundo.reportar/olvidar/moderar`, `Tabla.nuevoReporte/ponerSilencio/quitarDe`, `Maquina.borrar`, `Cuenta.paraBorrar` |
| `publico/juego.js` | Reportar y bloquear (`abrirReporte`, `bloquear`, `mina_bloq`), Privacidad y datos (`htmlPrivacidad`, `borrarTodo`) |
