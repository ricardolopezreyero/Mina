# Mina en las tiendas · Google Play primero, App Store después

**Ver en vivo: https://mina.capitaltorreon.com**

Versión 2 · 20 de octubre de 2026, 11:04 p. m. (hora de Torreón) · Ing. Ricardo López Reyero

La versión 1 decía qué piden las dos tiendas. Esta versión cruza **cada política de Google Play** con lo que tiene Mina, deja construido lo que faltaba y trae la ficha y los formularios listos para pegar.

<!-- RLR · Ricardo López Reyero · _k=EYE · _rev=181218 -->

---

## 1. Veredicto

Con lo construido hoy, Mina cumple todas las políticas de Google Play que dependen del juego. Lo que falta solo se puede hacer **al publicar**: abrir la cuenta de empresa, armar el paquete de Android y conectar Google Play Billing para volver a vender dentro de la app. Mientras no esté ese cobro, la app de Android **no cobra con tarjeta** (así lo pide la regla de pagos) y todo lo demás funciona igual.

---

## 2. Quién publica y las ligas de los formularios

| Dato | Valor |
|---|---|
| Razón social | **Consultores en Ingeniería Digital S.C.** · RFC CID180905UD2 |
| Domicilio (Google Play lo muestra en la ficha de apps con compras) | Calle Pedro Camino 242-1, Col. Ampliación Los Ángeles, C.P. 27148, Torreón, Coah. |
| Correo y teléfono de contacto | contacto@ingenieriadigital.mx · 871 277 8426 |
| Aviso de privacidad | https://mina.capitaltorreon.com/privacidad |
| Borrar la cuenta (campo obligatorio de Play) | https://mina.capitaltorreon.com/borrar-cuenta |
| Términos y reglas de la comunidad | https://mina.capitaltorreon.com/terminos |
| Estándares de seguridad infantil | https://mina.capitaltorreon.com/seguridad-infantil |
| Ayuda | https://mina.capitaltorreon.com/soporte |

---

## 3. El cruce: cada política de Google Play contra Mina

✅ listo · 🔧 se hace al publicar · 📌 decisión de Ricardo

| Política de Google Play | Qué pide | Cómo está Mina | |
|---|---|---|---|
| **Contenido generado por usuarios** | Términos accesibles y **aceptarlos antes de crear contenido**; reportar contenido y personas; bloquear; moderación continua; nada sexual | **Nuevo:** antes del primer mensaje o de poner un nombre se aceptan las reglas (el servidor rechaza el chat sin esa aceptación). Reportar mensajes (toque) y personas (🚩 en la lista J); bloquear en todos los mundos; filtro de palabras; moderación humana en `/moderacion` con correo por reporte; con 3 reportes se oculta solo. Lo sexual está prohibido, no «oculto por filtro» | ✅ |
| **Público objetivo y contenido** (Familias) | Declarar la edad; si puede atraer a menores, pantalla de edad neutra; nada de anuncios ni SDK no aprobados para menores | **Nuevo:** pantalla de edad neutra (mes y año, sin sugerir respuesta) antes del chat, la cuenta y las compras; a menores de 13 no se les enseñan. Se declara **13+** (no «diseñada para niños»). Mina no tiene anuncios ni SDK de terceros | ✅ |
| **Seguridad infantil** (abuso y explotación sexual infantil) | Obligatoria para apps Sociales y de Citas: normas publicadas, forma de reportar, actuar ante el material, cumplir la ley, punto de contacto | Mina es «Juego», pero tiene chat, así que se cumple igual: **nuevo** `/seguridad-infantil` (tolerancia cero, grooming y sextorsión prohibidos, a quién se reporta: FGR, Policía Cibernética, NCMEC), sin mensajes privados, sin fotos en el chat, chat que se puede apagar, contacto de seguridad infantil | ✅ |
| **Pagos** | Lo digital que se vende dentro de una app de Play se cobra con **Google Play Billing**; no mandar a pagar fuera | **Nuevo modo app:** la app abre `/?app=android`; ahí La Pinturería no cobra con tarjeta ni manda a la web («las compras con tarjeta llegan muy pronto»). Colores gratis y saldo de referidos funcionan igual. Falta conectar Play Billing (Digital Goods API) | ✅ hoy · 🔧 Billing |
| **Datos del usuario** | Aviso de privacidad dentro de la app y en la ficha; usar los datos solo para lo declarado | `/privacidad` (ley mexicana de 2025), ligado en Menú → Mi maquinita y en «Mis mundos»; junto al botón de Google dice que al entrar se aceptan términos y aviso | ✅ |
| **Borrado de cuenta** | Borrar desde la app y desde una liga web; borrar los datos asociados | En el juego (Privacidad y datos) y en `/borrar-cuenta`; borra cuenta, maquinitas, compras, capturas, tabla, mensajes | ✅ |
| **Sección «Seguridad de los datos»** | Declarar qué se recoge y para qué, igual a la realidad | Respuestas exactas en la sección 6 | 🔧 llenar |
| **Permisos** | Pedir solo lo necesario | La app solo necesita internet. Declarar que **no** usa el identificador de publicidad (AD_ID) y revisar que el paquete no lo agregue | 🔧 |
| **Anuncios** | Declarar si hay anuncios | No hay | ✅ |
| **Apuestas y cajas sorpresa** | Nada de azar pagado; si hay, mostrar probabilidades | No hay nada al azar que se compre | ✅ |
| **Clasificación de contenido (IARC)** | Contestar el cuestionario con verdad | Respuestas en la sección 6 (violencia de caricatura por los pleitos, usuarios que interactúan, compras digitales) | 🔧 llenar |
| **Metadatos de la ficha** | Sin mayúsculas ni emojis de más en el título, sin «el mejor», sin palabras de relleno, sin nombres ajenos | Ficha escrita en la sección 5. **No mencionar Motherload** en la ficha (sí puede quedarse en el Manifiesto del juego) | ✅ |
| **Propiedad intelectual** | No usar marcas ni obras ajenas | Arte, sonido y música hechos por código; las piezas clásicas de Ritmo son de dominio público e interpretadas por el propio juego | ✅ |
| **Funcionalidad mínima y calidad** | Que no sea solo una página; que no truene; que funcione sin señal | Juego completo, multijugador, abre sin internet. En la app no debe verse la barra del navegador: se logra con `assetlinks.json` | 🔧 |
| **Código que se descarga** | No actualizar la app por fuera de Play | Lo que corre es la página web dentro de Chrome, que la política permite | ✅ |
| **Nivel de API** | Apuntar a la versión de Android que exija Play | El paquete se genera con la versión que pida Play en ese momento | 🔧 |
| **Acceso a la app** | Si algo pide cuenta, explicar cómo probarlo | Todo se juega sin cuenta; texto para quien revisa en la sección 6 | ✅ |
| **Reseñas** | No premiar calificaciones | Mina no pide ni premia reseñas. El saldo por invitar a alguien que abre cuenta no se liga a reseñas | ✅ |
| **Leyes de verificación de edad en Estados Unidos** | En Texas (en vigor desde mayo de 2026) las apps deben recibir el rango de edad y el permiso de los padres con la **Play Age Signals API** | La app todavía no la usa | 📌 publicar primero **sin Estados Unidos**, o conectar la API en el paquete de Android antes de abrir allá |
| **Cuenta de desarrollador** | Identidad verificada; para empresa, D-U-N-S | Datos listos (sección 2) | 🔧 |

---

## 4. Lo que se construyó para esta revisión (20-oct-2026)

1. **Aceptar las reglas antes de escribir.** Una cajita con las cinco reglas y «Acepto las reglas» antes del primer mensaje o de cambiar un nombre. El servidor no acepta mensajes sin esa aceptación (`chatNo {reglas}`); si alguien la borra, se vuelve a pedir.
2. **Pantalla de edad neutra.** Mes y año de nacimiento, una vez, antes del chat, la cuenta o una compra. En el equipo solo queda el rango (`mina_edad`: menor13, 13a17, 18). A menores de 13 no se les enseñan chat, cuenta ni compras; juegan todo lo demás. Sin saber la edad, el chat no se asoma solo.
3. **Apagar el chat** en el equipo (Privacidad y datos): no se ve ni suena nada del chat.
4. **Modo app de Android** sin cobro con tarjeta ni ligas a pagar fuera.
5. **`/seguridad-infantil`**, ligado en todas las páginas, en los términos (con grooming y sextorsión prohibidos por nombre) y en el juego.
6. Junto al botón de Google: «Al entrar aceptas los términos y el aviso de privacidad».
7. Bloquear ahora **sobrevive a cerrar sesión** (borrar todo sí lo quita).

Probado: 34 comprobaciones de punta a punta en local (incluye que sin aceptar reglas no se puede escribir) y en pantalla la edad (menor de 13 y adulto), las reglas, el chat apagado y el modo app.

---

## 5. La ficha de Google Play (lista para pegar)

**Nombre (27 de 30):** Mina: excava con tus amigos

**Descripción corta (73 de 80):** Excava con tus amigos en el mismo mundo. Gratis, sin anuncios y sin azar.

**Descripción completa:**

> Mina es un juego de minería para jugar con tus amigos en el mismo mundo, en tiempo real.
>
> Baja con tu maquinita, llena la bodega de minerales, sube a venderlos y mejora tu equipo para llegar más hondo: hasta 10,000 metros, con lugares escondidos, una colección de 99 objetos que se encuentra en equipo y un final que se celebra entre todos.
>
> Manda la liga de tu mundo por WhatsApp y quien la abra entra a excavar contigo, sin registrarse.
>
> • Se juega completo gratis.
> • Sin anuncios.
> • Nada al azar ni cajas sorpresa.
> • Nada de lo que se compra da ventaja: La Pinturería solo cambia cómo se ve tu maquinita.
> • Funciona sin internet y se retoma donde te quedaste.
> • Chat por mundo con filtro de palabras, reportar, bloquear y moderación por personas. El chat se puede apagar.
>
> Para personas de 13 años en adelante.
> Hecho en Torreón, México.

**Categoría:** Juegos → Casual (o Aventura). **Etiquetas:** minería, multijugador, casual.
**Gráficos:** ícono 512 × 512 (ya existe en `publico/iconos/icono-512.png`), imagen destacada 1024 × 500, de 4 a 8 capturas de teléfono (de Galería y Gameplay), video opcional de Ritmo. Sin fotos de niñas o niños y sin palabras como «para niños».

---

## 6. Los formularios de «Contenido de la app»

**Público objetivo:** 13 a 15, 16 a 17 y 18 o más. ¿Atrae a menores de 13? Responder con verdad que es casual y colorido, y que tiene pantalla de edad neutra y chat cerrado a menores de 13.

**Anuncios:** No contiene anuncios.

**Acceso a la app (texto para quien revisa):**
> Todo Mina se juega sin cuenta ni contraseña: al abrir ya estás en un mundo. La cuenta (Google) solo sirve para recuperar la partida en otro equipo. Para probar el chat abre un mundo, toca 💬, contesta mes y año de nacimiento (18 o más) y acepta las reglas. Reportar y bloquear: toca cualquier mensaje. Borrar cuenta: Menú → Mi maquinita → Privacidad y datos.

**Clasificación (IARC):** violencia: sí, de caricatura y fantasía (las maquinitas chocan en los pleitos, sin sangre); lenguaje: no (hay filtro); contenido sexual: no; apuestas: no; usuarios pueden interactuar: **sí**; comparte ubicación: no; compras digitales: **sí**; la app permite comprar sin restricción de edad: no (13 a 17 con permiso del tutor).

**Seguridad de los datos:**
- ¿Recoge datos? **Sí.** ¿Comparte con terceros? **No** (Cloudflare, Google, Stripe y Resend operan por nuestra cuenta, y eso no cuenta como compartir).
- Cifrados en tránsito: **sí**. Se pueden borrar: **sí** (`/borrar-cuenta`).

| Tipo (Play) | Obligatorio u opcional | Para qué |
|---|---|---|
| Información personal → Nombre, Correo | Opcional (solo con cuenta) | Funcionalidad, administrar la cuenta |
| Información personal → ID de usuario | Opcional (identificador de Google) | Funcionalidad, administrar la cuenta |
| Información financiera → Historial de compras | Opcional | Funcionalidad |
| Mensajes → Otros mensajes en la app | Opcional (chat) | Funcionalidad |
| Fotos y videos → Fotos | Opcional (capturas del juego que la persona guarda) | Funcionalidad |
| Actividad en la app → Otras acciones (progreso del juego) | Obligatorio | Funcionalidad |
| ID del dispositivo u otros → código de la maquinita y huella cifrada de la IP de quien es sacado de un mundo | Obligatorio | Funcionalidad, seguridad y prevención de fraude |

**Seguridad infantil:** si la consola la pide, ligar `/seguridad-infantil` y como contacto contacto@ingenieriadigital.mx.

---

## 7. Al publicar, en este orden

1. **D-U-N-S** de Consultores en Ingeniería Digital S.C. (gratis, días).
2. **Cuenta de desarrollador de empresa** en Google Play ($25 dólares, un pago). Con cuenta de empresa no aplica la prueba cerrada de 12 personas por 14 días.
3. **Paquete de Android** (Trusted Web Activity con Bubblewrap): inicio en `https://mina.capitaltorreon.com/?app=android`, sin el permiso AD_ID.
4. **`/.well-known/assetlinks.json`** con la huella SHA-256 de la firma de Play. Esto lo construyo yo cuando exista la app.
5. **Google Play Billing:** crear en la consola los productos (los 10 niveles, las piezas de sonido y el apoyo) y conectar la Digital Goods API, con verificación de cada compra en el servidor. Hasta entonces la app no cobra con tarjeta.
6. **Países:** México y Latinoamérica primero; Estados Unidos cuando la app use la Play Age Signals API (ley de Texas).
7. Llenar los formularios de la sección 6 y subir la ficha de la sección 5.
8. **Prueba interna** con el equipo (teléfonos reales) y luego producción.

**Después de publicar:** atender cada reporte en `/moderacion` (idealmente el mismo día), leer los correos de políticas de Google Play Console, revisar el «informe previo al lanzamiento» y los Android vitals, y volver a correr este cruce cuando Google cambie una política.

---

## 8. App Store (después de Google Play)

Igual que en la versión 1: cuenta de empresa de Apple ($99 dólares al año, mismo D-U-N-S), envolver con Capacitor con los archivos dentro de la app, **Sign in with Apple** en login.capitaltorreon.com, cobro con StoreKit, y las mismas páginas de privacidad, términos, seguridad infantil, ayuda y borrado. La pantalla de edad, las reglas antes de escribir, reportar, bloquear y apagar el chat también cubren la regla 1.2 de Apple.
