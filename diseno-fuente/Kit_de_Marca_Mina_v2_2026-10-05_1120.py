#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# RLR · Kit de marca de Mina — Ricardo López Reyero · mina.capitaltorreon.com/guia-estilos
# Arma TODAS las imágenes de la guía de estilos a partir del arte crudo que sale del propio juego (kit-captura/cdp.mjs):
# ícono, favicon, logotipos, la maquinita, fotos de perfil (el círculo), portadas y fondos para redes, cierres, marcos para
# video, QR, paleta y tipografía. Deja cada archivo en publico/guia-estilos/kit/<carpeta>/, su miniatura, kit.json y el zip.
#   Uso:  python3 Kit_de_Marca_Mina_v1_….py <carpeta del arte crudo> <carpeta con Inter-*.ttf>
import io
import os, sys, json, shutil, zipfile, glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import qrcode
_RLR = 'Ricardo López Reyero'; _k = 'EYE'; _rev = 181218

AQUI = os.path.dirname(os.path.abspath(__file__)); RAW, FUENTES = sys.argv[1], sys.argv[2]
SAL = os.path.normpath(os.path.join(AQUI, '..', 'publico', 'guia-estilos')); KIT, MINI = SAL + '/kit', SAL + '/mini'
VERSION, SELLO, LIGA = 'v2', '2026-10-05_1120', 'mina.capitaltorreon.com'
AMARILLO, TINTA, FONDO, CAJA, BORDE, CREMA, ARENA, BLANCO = '#ffd23f', '#2a1a14', '#1b120e', '#2a1c16', '#5a3d2c', '#f3e6d8', '#c9b29c', '#ffffff'
for d in (KIT, MINI): shutil.rmtree(d, ignore_errors=True); os.makedirs(d)

# ── ayudas ───────────────────────────────────────────────────────────────────────────────────────────────────────────
def hexa(h, a=255): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (a,)
def F(peso, tam): return ImageFont.truetype(f'{FUENTES}/Inter-{peso}.ttf', int(tam))
def crudo(n): return Image.open(f'{RAW}/{n}.png').convert('RGBA')
def recorta(im): return im.crop(im.getbbox())
def alto(im, h): return im.resize((max(1, round(im.width * h / im.height)), int(h)), Image.LANCZOS)
def ancho(im, w): return im.resize((int(w), max(1, round(im.height * w / im.width))), Image.LANCZOS)
def lienzo(w, h, color=None): return Image.new('RGBA', (int(w), int(h)), hexa(color) if color else (0, 0, 0, 0))
def pega(base, im, x, y): base.alpha_composite(im, (max(0, int(x)), max(0, int(y))))
def centro(base, im, y, cx=None): pega(base, im, (base.width if cx is None else cx * 2) / 2 - im.width / 2, y)

def palabra(txt='MINA', tam=400, color=AMARILLO, borde=TINTA, extr=0.06, grosor=0.045, peso='Black'):
    """La palabra de la marca: letras amarillas, contorno café y un escalón café abajo. Sirve sobre cualquier fondo."""
    f = F(peso, tam); g = max(0, round(tam * grosor)); e = round(tam * extr)
    x0, y0, x1, y1 = f.getbbox(txt, stroke_width=g)
    im = lienzo(x1 - x0 + 2, y1 - y0 + e + 2); d = ImageDraw.Draw(im)
    for k in range(e, 0, -1): d.text((1 - x0, 1 - y0 + k), txt, font=f, fill=borde, stroke_width=g, stroke_fill=borde)
    d.text((1 - x0, 1 - y0), txt, font=f, fill=color, stroke_width=g, stroke_fill=borde)
    return im
def rotulo(lineas, tam, color=BLANCO, borde=TINTA, peso='ExtraBold', grosor=0.085, al='izq', inter=1.2):
    """Texto de apoyo: claro con contorno café, legible sobre cielo, tierra, negro o blanco."""
    if isinstance(lineas, str): lineas = [lineas]
    f = F(peso, tam); g = round(tam * grosor); asc, desc = f.getmetrics(); paso = round(tam * inter)
    cajas = [f.getbbox(l, stroke_width=g) for l in lineas]; w = max(b[2] - b[0] for b in cajas) + 2
    im = lienzo(w, paso * (len(lineas) - 1) + asc + desc + 2 * g + 2); d = ImageDraw.Draw(im)
    for k, l in enumerate(lineas):
        b = cajas[k]; x = (w - (b[2] - b[0])) // 2 if al == 'centro' else 0
        d.text((x - b[0], g + k * paso), l, font=f, fill=color, stroke_width=g, stroke_fill=borde)
    return recorta(im)
def tam_para_ancho(txt, peso, w, grosor=0.085): b = F(peso, 200).getbbox(txt, stroke_width=round(200 * grosor)); return 200 * w / (b[2] - b[0])
def gris(im, lo=0, hi=255):
    l = ImageOps.grayscale(im.convert('RGB')).point(lambda v: int(lo + v * (hi - lo) / 255)); return Image.merge('RGBA', (l, l, l, im.getchannel('A')))
def silueta(im, color): s = lienzo(im.width, im.height, color); s.putalpha(im.getchannel('A')); return s
def con_sombra(im, radio=18, dy=10, alfa=150):
    m = radio * 3; s = lienzo(im.width + m * 2, im.height + m * 2); n = lienzo(im.width, im.height, '#000000'); n.putalpha(im.getchannel('A').point(lambda v: v * alfa // 255))
    s.alpha_composite(n, (m, m + dy)); s = s.filter(ImageFilter.GaussianBlur(radio)); s.alpha_composite(im, (m, m)); return s
def radial(w, h, dentro, fuera):
    m = Image.radial_gradient('L').resize((int(w), int(h)), Image.BICUBIC); return Image.composite(lienzo(w, h, fuera), lienzo(w, h, dentro), m)
def vineta(im, fuerza=0.6, color=FONDO):
    m = Image.radial_gradient('L').resize(im.size, Image.BICUBIC).point(lambda v: int(max(0, v - 80) * fuerza * 255 / 175))
    n = lienzo(im.width, im.height, color); n.putalpha(m); out = im.copy(); out.alpha_composite(n); return out
def oscurece(im, cuanto=0.6, color=FONDO): return Image.blend(im, lienzo(im.width, im.height, color), cuanto)
def circulo(im):
    f = 4; m = Image.new('L', (im.width * f, im.height * f), 0); ImageDraw.Draw(m).ellipse([0, 0, m.width - 1, m.height - 1], fill=255)
    out = im.copy(); out.putalpha(m.resize(im.size, Image.LANCZOS)); return out
def pastilla(w, h, relleno, borde=None, g=0, radio=None):
    f = 3; im = lienzo(w * f, h * f); ImageDraw.Draw(im).rounded_rectangle([0, 0, w * f - 1, h * f - 1], radius=(radio if radio is not None else h / 2) * f, fill=relleno, outline=borde, width=g * f)
    return im.resize((int(w), int(h)), Image.LANCZOS)
def qr_img(dato, lado, color=FONDO):
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=1, border=0); q.add_data(dato); q.make(fit=True)
    n = q.modules_count; caja = lado // (n + 4); q.box_size = caja; q.border = 2
    im = q.make_image(fill_color=color, back_color='white').convert('RGBA'); out = lienzo(lado, lado, BLANCO); pega(out, im, (lado - im.width) / 2, (lado - im.height) / 2); return out

# ── el registro: cada archivo queda con su carpeta, título, uso, medidas, peso y miniatura ────────────────────────────
REG = []
def guarda(im, carpeta, nombre, titulo, uso, jpg=False, fondo='cuadros'):
    d = f'{KIT}/{carpeta}'; os.makedirs(d, exist_ok=True); arch = nombre + ('.jpg' if jpg else '.png'); ruta = f'{d}/{arch}'
    if jpg: im.convert('RGB').save(ruta, quality=90, optimize=True, subsampling=0)
    else: im.save(ruta, optimize=True)
    t = im.copy(); t.thumbnail((760, 760), Image.LANCZOS); mini = f'{carpeta}__{nombre}.webp'; t.save(f'{MINI}/{mini}', quality=84, method=6)
    REG.append({'c': carpeta, 'f': arch, 't': titulo, 'u': uso, 'w': im.width, 'h': im.height, 'kb': round(os.path.getsize(ruta) / 1024), 'mini': mini, 'fondo': fondo}); return im
def guarda_archivo(origen, carpeta, nombre, titulo, uso, icono='📄'):
    d = f'{KIT}/{carpeta}'; os.makedirs(d, exist_ok=True); shutil.copyfile(origen, f'{d}/{nombre}')
    REG.append({'c': carpeta, 'f': nombre, 't': titulo, 'u': uso, 'w': 0, 'h': 0, 'kb': round(os.path.getsize(f'{d}/{nombre}') / 1024), 'mini': '', 'fondo': 'archivo', 'ic': icono})

# ── el ícono (el mismo dibujo del ícono de la app, a cualquier tamaño) ─────────────────────────────────────────────────
def icono(margen=0.0, redondo=True, S=1024):
    im = lienzo(S, S); fondo = lienzo(S, S); f = ImageDraw.Draw(fondo); u = S / 1024
    for y in range(S):
        k = y / S
        if k < 0.46: a, b, t = (34, 64, 122), (240, 168, 104), k / 0.46
        else: a, b, t = (122, 76, 49), (58, 31, 27), (k - 0.46) / 0.54
        f.line([(0, y), (S, y)], fill=tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3)) + (255,))
    f.rectangle([0, int(S * 0.46), S, int(S * 0.485)], fill=(124, 194, 78, 255))
    for (x, y, r, c) in [(150, 640, 26, (107, 66, 42)), (860, 600, 20, (107, 66, 42)), (240, 880, 30, (58, 31, 27)), (800, 860, 24, (75, 41, 28)), (640, 930, 18, (107, 66, 42))]:
        f.ellipse([(x - r * 1.3) * u, (y - r) * u, (x + r * 1.3) * u, (y + r) * u], fill=c + (255,))
    mask = Image.new('L', (S, S), 0); m = ImageDraw.Draw(mask)
    if redondo: m.rounded_rectangle([0, 0, S, S], radius=int(S * 0.22), fill=255)
    else: m.rectangle([0, 0, S, S], fill=255)
    im.paste(fondo, (0, 0), mask)
    capa = lienzo(S, S); c = ImageDraw.Draw(capa)
    cx, cy, w, h = S // 2, int(S * 0.50), int(S * 0.56), int(S * 0.40); x0, y0 = cx - w // 2, cy - h // 2
    c.rounded_rectangle([cx - w * 0.36, cy + h * 0.1, cx + w * 0.36, cy + h * 1.02], radius=30 * u, fill=(36, 21, 15, 255))
    c.polygon([(cx - w * 0.2, cy + h * 0.52), (cx + w * 0.2, cy + h * 0.52), (cx, cy + h * 1.0)], fill=(215, 219, 224, 255), outline=(43, 43, 43, 255))
    for i in range(3):
        yy = cy + h * (0.6 + i * 0.12); an = w * 0.2 * (1 - (0.08 + i * 0.12) / 0.48)
        c.line([(cx - an, yy), (cx + an, yy + h * 0.05)], fill=(127, 135, 145, 255), width=round(14 * u))
    c.rounded_rectangle([x0 - 14 * u, cy + h * 0.2, x0 + w + 14 * u, cy + h * 0.54], radius=60 * u, fill=(38, 34, 31, 255))
    for i in range(3):
        px = x0 + w * (0.17 + i * 0.33); c.ellipse([px - 38 * u, cy + h * 0.37 - 38 * u, px + 38 * u, cy + h * 0.37 + 38 * u], fill=(111, 106, 102, 255))
    c.rounded_rectangle([x0, y0 + h * 0.02, x0 + w, cy + h * 0.28], radius=70 * u, fill=(255, 210, 63, 255), outline=(122, 82, 0, 255), width=round(10 * u))
    c.rounded_rectangle([x0 + 12 * u, y0 + h * 0.04, x0 + w - 12 * u, y0 + h * 0.22], radius=56 * u, fill=(255, 226, 122, 255))
    c.rectangle([x0 + w * 0.06, cy + h * 0.14, x0 + w * 0.94, cy + h * 0.19], fill=(176, 122, 0, 255))
    kx, ky, kr = cx + w * 0.14, cy - h * 0.1, w * 0.2
    c.pieslice([kx - kr, ky - kr, kx + kr, ky + kr], 180, 360, fill=(159, 227, 255, 255), outline=(27, 58, 74, 255), width=round(10 * u))
    c.ellipse([kx - kr * 0.55, ky - kr * 0.75, kx - kr * 0.15, ky - kr * 0.4], fill=(255, 255, 255, 190))
    c.ellipse([kx - 22 * u, ky - kr * 0.42, kx + 34 * u, ky - kr * 0.42 + 56 * u], fill=(36, 50, 58, 255))
    c.ellipse([x0 + w - 60 * u, cy, x0 + w - 8 * u, cy + 52 * u], fill=(255, 243, 176, 255))
    gx, gy = int(S * 0.2), int(S * 0.76)
    c.polygon([(gx, gy - 46 * u), (gx + 42 * u, gy - 12 * u), (gx + 26 * u, gy + 40 * u), (gx - 28 * u, gy + 38 * u), (gx - 44 * u, gy - 10 * u)], fill=(255, 210, 63, 255), outline=(122, 82, 0, 255))
    c.polygon([(gx, gy - 46 * u), (gx + 6 * u, gy - 6 * u), (gx - 44 * u, gy - 10 * u)], fill=(255, 240, 170, 255))
    sx, sy, l = gx + 52 * u, gy - 52 * u, 26 * u
    c.line([(sx - l, sy), (sx + l, sy)], fill=(255, 255, 255, 255), width=round(8 * u)); c.line([(sx, sy - l), (sx, sy + l)], fill=(255, 255, 255, 255), width=round(8 * u))
    if margen:
        n = int(S * (1 - 2 * margen)); capa = capa.resize((n, n), Image.LANCZOS); l2 = lienzo(S, S); l2.paste(capa, ((S - n) // 2, (S - n) // 2), capa); capa = l2
    return Image.alpha_composite(im, capa)

IC = icono(S=2048); ICC = icono(redondo=False, S=2048)
C = '01-icono'
guarda(IC.resize((1024, 1024), Image.LANCZOS), C, 'mina-icono-1024', 'Ícono de la app · 1024', 'El ícono oficial, con esquinas redondeadas y fondo transparente. Para presentaciones, sitios y donde se muestre «la app».')
guarda(IC.resize((512, 512), Image.LANCZOS), C, 'mina-icono-512', 'Ícono · 512', 'El mismo ícono, mediano.')
guarda(IC.resize((192, 192), Image.LANCZOS), C, 'mina-icono-192', 'Ícono · 192', 'Para Android y accesos directos.')
guarda(ICC.resize((1024, 1024), Image.LANCZOS), C, 'mina-icono-cuadrado-1024', 'Ícono cuadrado · 1024', 'Sin esquinas redondeadas: para iPhone y tiendas, que las redondean solas.', fondo='oscuro')
guarda(icono(margen=0.11, redondo=False, S=2048).resize((1024, 1024), Image.LANCZOS), C, 'mina-icono-mascara-1024', 'Ícono enmascarable · 1024', 'Con margen de seguridad: para Android, que lo recorta en círculo o en gota.', fondo='oscuro')
C = '02-favicon'
for n in (16, 32, 48, 64, 180):
    guarda((ICC if n == 180 else IC).resize((n, n), Image.LANCZOS), C, f'favicon-{n}', f'Favicon · {n} px', {16: 'La pestaña del navegador.', 32: 'La pestaña en pantallas nítidas.', 48: 'Accesos directos de Windows.', 64: 'Marcadores.', 180: 'El ícono de iPhone al «Agregar a inicio».'}[n], fondo='oscuro' if n == 180 else 'cuadros')
os.makedirs(f'{KIT}/{C}', exist_ok=True); IC.resize((256, 256), Image.LANCZOS).save(f'{KIT}/{C}/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
REG.append({'c': C, 'f': 'favicon.ico', 't': 'favicon.ico', 'u': 'El archivo clásico, con 16, 32 y 48 px adentro. Va en la raíz de un sitio.', 'w': 48, 'h': 48, 'kb': round(os.path.getsize(f'{KIT}/{C}/favicon.ico') / 1024), 'mini': '02-favicon__favicon-48.webp', 'fondo': 'cuadros'})

# ── la maquinita ──────────────────────────────────────────────────────────────────────────────────────────────────────
M = {n: recorta(crudo(n)) for n in ['maq-0', 'maq-0-perfora', 'maq-0-vuela', 'maq-0-lado'] + [f'maq-{k}' for k in range(1, 8)] + [f'carro-{k}' for k in range(1, 5)]}
MP = M['maq-0-perfora']          # la de la marca: amarilla, con el taladro hacia abajo
C = '04-maquinita'
guarda(alto(MP, 1000), C, 'maquinita-perforando', 'La maquinita, perforando', 'La imagen de la marca: amarilla, con el taladro hacia abajo. Fondo transparente.')
guarda(ancho(M['maq-0'], 1000), C, 'maquinita-amarilla', 'La maquinita amarilla', 'De lado, quieta. Fondo transparente.')
guarda(ancho(M['maq-0-vuela'], 1000), C, 'maquinita-volando', 'Volando', 'Con la hélice abierta.')
guarda(ancho(M['maq-0-lado'], 1000), C, 'maquinita-taladro-al-frente', 'Taladro al frente', 'Perforando de lado.')
guarda(alto(gris(MP, 30, 240), 1000), C, 'maquinita-gris', 'La maquinita en gris', 'Una sola tinta, para fondos negros, blancos o de tierra.')
for k, n in enumerate(['roja', 'azul', 'verde', 'morada', 'naranja', 'crema', 'rosa'], 1): guarda(ancho(M[f'maq-{k}'], 800), C, f'maquinita-{n}', f'Maquinita {n}', 'Uno de los ocho modelos del juego.')
for k, n in enumerate(['El Escarabajo', 'La Locomotora', 'El Submarino', 'El Tanque'], 1): guarda(ancho(M[f'carro-{k}'], 800), C, 'carroceria-' + n.split(' ')[1].lower(), n, 'Carrocería de La Pinturería (nivel 7).')

# ── el logotipo ───────────────────────────────────────────────────────────────────────────────────────────────────────
LEMA = 'Excava con tus amigos'
def logo_h(tam=420, lema=False, mono=None):
    P = palabra('MINA', tam) if not mono else palabra('MINA', tam, mono, mono, 0, 0)
    m = alto(MP, round(tam * 1.0)); m = silueta(m, mono) if mono else m; hueco = round(tam * 0.16)
    R = rotulo(LEMA, tam_para_ancho(LEMA, 'ExtraBold', P.width)) if lema else None
    w = m.width + hueco + P.width; h = max(m.height, P.height + (R.height + round(tam * 0.1) if R else 0))
    im = lienzo(w, h); pega(im, m, 0, 0); pega(im, P, m.width + hueco, round(tam * 0.02))
    if R: pega(im, R, m.width + hueco, round(tam * 0.02) + P.height + round(tam * 0.1))
    return recorta(im)
def logo_v(tam=420, lema=False):
    P = palabra('MINA', tam); m = alto(MP, round(tam * 1.15)); R = rotulo(LEMA, tam_para_ancho(LEMA, 'ExtraBold', P.width)) if lema else None
    w = max(P.width, m.width); im = lienzo(w, m.height + round(tam * 0.14) + P.height + (R.height + round(tam * 0.1) if R else 0))
    centro(im, m, 0); centro(im, P, m.height + round(tam * 0.14))
    if R: centro(im, R, m.height + round(tam * 0.14) + P.height + round(tam * 0.1))
    return recorta(im)
C = '03-logotipo'
guarda(logo_h(520), C, 'mina-logo-horizontal', 'Logotipo horizontal', 'El de uso general: la maquinita y la palabra. Fondo transparente; sirve sobre claro y sobre oscuro.')
guarda(logo_h(520, lema=True), C, 'mina-logo-horizontal-lema', 'Horizontal con lema', 'Con «Excava con tus amigos». Para portadas y cierres.')
guarda(logo_v(520), C, 'mina-logo-vertical', 'Logotipo vertical', 'Apilado: para espacios cuadrados o angostos.')
guarda(logo_v(520, lema=True), C, 'mina-logo-vertical-lema', 'Vertical con lema', 'Apilado, con el lema.')
guarda(palabra('MINA', 640), C, 'mina-palabra', 'Solo la palabra', 'Cuando la maquinita ya aparece en la imagen.')
guarda(logo_h(520, mono=BLANCO), C, 'mina-logo-blanco', 'Una tinta · blanco', 'Para marca de agua sobre video o foto oscura.', fondo='oscuro')
guarda(logo_h(520, mono=FONDO), C, 'mina-logo-cafe', 'Una tinta · café', 'Para fondos claros, sellos y papel.', fondo='claro')

# ── la foto de perfil: el círculo ─────────────────────────────────────────────────────────────────────────────────────
L = 1080
TIERRA = vineta(oscurece(crudo('tierra-c-1080x1080').filter(ImageFilter.GaussianBlur(1.2)), 0.34), 0.75)
CAFE = radial(L, L, '#6f4a33', '#33201a')
def perfil(fondo, m, escala=0.5):
    im = fondo.copy(); s = con_sombra(ancho(m, round(L * escala)), 22, 14, 150); pega(im, s, (L - s.width) / 2, (L - s.height) / 2 + L * 0.015); return im
PERFILES = [
    ('perfil-atardecer', ICC.resize((L, L), Image.LANCZOS), 'Atardecer', 'El principal: TikTok, Instagram, YouTube, Facebook y el grupo de WhatsApp.'),
    ('perfil-tierra', perfil(TIERRA, MP), 'Tierra', 'La maquinita sobre tierra con mineral. Buena alternativa para TikTok y para el grupo de WhatsApp.'),
    ('perfil-tierra-gris', perfil(TIERRA, gris(MP, 45, 245)), 'Tierra · ícono gris', 'Para la comunidad de WhatsApp: sobrio y minero.'),
    ('perfil-cafe', perfil(CAFE, MP), 'Café', 'Fondo café liso con la maquinita a color.'),
    ('perfil-cafe-gris', perfil(CAFE, gris(MP, 45, 245)), 'Café · ícono gris', 'Para la comunidad de WhatsApp o canales secundarios.'),
    ('perfil-negro-gris', perfil(lienzo(L, L, '#000000'), gris(MP, 70, 250)), 'Negro · ícono gris', 'Para la comunidad de WhatsApp: el círculo negro con el ícono gris.'),
    ('perfil-blanco-gris', perfil(lienzo(L, L, BLANCO), gris(MP, 25, 215)), 'Blanco · ícono gris', 'Para la comunidad de WhatsApp: el círculo blanco con el ícono gris.'),
    ('perfil-negro', perfil(lienzo(L, L, '#000000'), MP), 'Negro', 'Fondo negro con la maquinita a color.'),
    ('perfil-blanco', perfil(lienzo(L, L, BLANCO), MP), 'Blanco', 'Fondo blanco con la maquinita a color.'),
]
C = '05-perfil'
for nombre, im, t, u in PERFILES:
    guarda(im, C, nombre, t + ' · cuadrado', u + ' Súbela así: cada red la recorta en círculo.', fondo='oscuro')
    guarda(circulo(im), C, nombre + '-circulo', t + ' · círculo', 'Ya recortada en círculo, con fondo transparente: para video, presentaciones y stickers.')

# ── portadas, fondos y cierres ────────────────────────────────────────────────────────────────────────────────────────
def portada(raw, tam, x, y, lema, lema_tam):
    im = crudo(raw); P = palabra('MINA', tam); pega(im, con_sombra(P, round(tam * 0.05), round(tam * 0.03), 90), x - round(tam * 0.15), y - round(tam * 0.15))
    pega(im, rotulo(lema, lema_tam), x + round(tam * 0.02), y + P.height + round(tam * 0.11)); return im
def chips(textos, h=70):
    f = F('Bold', h * 0.46); ims = []
    for t in textos:
        b = f.getbbox(t); w = b[2] - b[0] + round(h * 1.0); p = pastilla(w, h, hexa(CAJA, 235), hexa(AMARILLO), 3); ImageDraw.Draw(p).text((w / 2, h / 2), t, font=f, fill=hexa(CREMA), anchor='mm'); ims.append(p)
    hueco = round(h * 0.3); im = lienzo(sum(i.width for i in ims) + hueco * (len(ims) - 1), h); x = 0
    for i in ims: pega(im, i, x, 0); x += i.width + hueco
    return im
def tarjeta_qr(lado, pie=None):
    m = round(lado * 0.07); h = lado + (round(lado * 0.2) if pie else 0); t = pastilla(lado, h, hexa(BLANCO), radio=lado * 0.08); q = qr_img('https://' + LIGA, lado - m * 2); pega(t, q, m, m)
    if pie: ImageDraw.Draw(t).text((lado / 2, lado + round(lado * 0.07)), pie, font=F('Black', lado * 0.085), fill=hexa(FONDO), anchor='mm')
    return t
CHIPS = ['Gratis', 'Sin registro', 'Sin anuncios']
def fondo_cierre(raw): return vineta(oscurece(crudo(raw).filter(ImageFilter.GaussianBlur(1.5)), 0.6), 0.8)
def liga_txt(tam): return rotulo(LIGA, tam, AMARILLO, TINTA, 'Black', 0.07)
def cierre_v():
    im = fondo_cierre('tierra-v-1080x1920'); m = con_sombra(alto(MP, 250), 20, 12)
    centro(im, m, 250); centro(im, palabra('MINA', 250), 560); centro(im, rotulo(LEMA, 62), 800); centro(im, chips(CHIPS, 70), 895)
    centro(im, con_sombra(tarjeta_qr(330), 20, 12, 120), 990 - 60); centro(im, liga_txt(58), 1365); return im
def cierre_h():
    im = fondo_cierre('tierra-h-1920x1080'); cx = 640
    centro(im, con_sombra(alto(MP, 220), 20, 12), 110, cx); centro(im, palabra('MINA', 250), 385, cx); centro(im, rotulo(LEMA, 62), 625, cx); centro(im, chips(CHIPS, 72), 725, cx); centro(im, liga_txt(62), 850, cx)
    centro(im, con_sombra(tarjeta_qr(440, 'Escanea y juega'), 22, 14, 120), 270 - 66, 1500); return im
def cierre_c():
    im = fondo_cierre('tierra-c-1080x1080')
    centro(im, con_sombra(alto(MP, 160), 16, 10), 20); centro(im, palabra('MINA', 190), 225); centro(im, rotulo(LEMA, 50), 410); centro(im, chips(CHIPS, 60), 487)
    centro(im, con_sombra(tarjeta_qr(300), 18, 10, 120), 590 - 54); centro(im, liga_txt(50), 975); return im
def cintillo(texto, h=150, icono_m=True):
    f = F('Black', h * 0.4); b = f.getbbox(texto); mi = alto(M['maq-0'], round(h * 0.6)) if icono_m else None
    w = round(h * 0.5) + (mi.width + round(h * 0.22) if mi else 0) + (b[2] - b[0]) + round(h * 0.55); p = pastilla(w, h, hexa(FONDO, 238), hexa(AMARILLO), round(h * 0.045)); x = round(h * 0.5)
    if mi: pega(p, mi, x, (h - mi.height) / 2 + h * 0.02); x += mi.width + round(h * 0.22)
    ImageDraw.Draw(p).text((x - b[0], h / 2), texto, font=f, fill=hexa(AMARILLO), anchor='lm'); return p
def marco(w, h, logo_xy, logo_tam, pas_xy, pas_h, derecha=False):
    im = lienzo(w, h); lg = con_sombra(logo_h(logo_tam), 10, 5, 130); pega(im, lg, logo_xy[0] - 30, logo_xy[1] - 30)
    c = con_sombra(cintillo(LIGA, pas_h), 12, 6, 120); pega(im, c, (w - pas_xy[0] - c.width + 36) if derecha else pas_xy[0] - 36, pas_xy[1] - 36); return im
def zonas_v():
    im = lienzo(1080, 1920); d = ImageDraw.Draw(im); rojo = (255, 80, 60, 105); f = F('Bold', 30)
    for (caja, t) in [([0, 0, 1080, 130], 'Barra de arriba'), ([0, 1440, 1080, 1920], 'Texto del video, sonido y botones de abajo'), ([940, 760, 1080, 1440], '')]:
        d.rectangle(caja, fill=rojo)
        if t: d.text(((caja[0] + caja[2]) / 2, (caja[1] + caja[3]) / 2), t, font=f, fill=(255, 255, 255, 255), anchor='mm', stroke_width=3, stroke_fill=(0, 0, 0, 255))
    d.text((1010, 1100), 'Botones', font=F('Bold', 24), fill=(255, 255, 255, 255), anchor='mm', stroke_width=3, stroke_fill=(0, 0, 0, 255))
    for y in (240, 1680):
        for x in range(0, 1080, 40): d.line([(x, y), (x + 22, y)], fill=(255, 210, 63, 255), width=4)
    d.text((540, 205), 'Arriba de esta línea se corta en la cuadrícula del perfil (3:4)', font=F('Bold', 26), fill=hexa(AMARILLO), anchor='mm', stroke_width=3, stroke_fill=(0, 0, 0, 255))
    d.rounded_rectangle([40, 150, 920, 1420], radius=24, outline=(111, 220, 122, 255), width=5)
    d.text((480, 1385), 'Zona segura: aquí va lo importante', font=F('Bold', 30), fill=(111, 220, 122, 255), anchor='mm', stroke_width=3, stroke_fill=(0, 0, 0, 255)); return im

C = '06-vertical'
PV = guarda(portada('escena-v-1080x1920', 250, 64, 268, ['Excava con', 'tus amigos'], 68), C, 'portada-vertical-1080x1920', 'Portada vertical', 'Portada de TikTok, Reels y Shorts; también historia. El título queda dentro de la zona segura.', jpg=True, fondo='foto')
guarda(crudo('escena-v-1080x1920'), C, 'fondo-vertical-escena-1080x1920', 'Fondo vertical · el mundo', 'La misma escena sin texto, para escribir encima en el editor.', jpg=True, fondo='foto')
guarda(crudo('tierra-v-1080x1920'), C, 'fondo-vertical-tierra-1080x1920', 'Fondo vertical · tierra', 'Pura tierra con mineral: fondo para textos, listas y avisos.', jpg=True, fondo='foto')
guarda(cierre_v(), C, 'cierre-vertical-1080x1920', 'Cierre vertical', 'La última pantalla del video: logo, lema, QR y la liga.', jpg=True, fondo='foto')
guarda(marco(1080, 1920, (48, 160), 86, (48, 1300), 104), C, 'marco-vertical-1080x1920', 'Marco para video vertical', 'Transparente: se pone encima del video grabado. Logo arriba, liga abajo, todo en zona segura.', fondo='foto-marco-v')
zv = PV.copy(); zv.alpha_composite(zonas_v()); guarda(zv, C, 'zonas-seguras-vertical', 'Zonas seguras (referencia)', 'No se publica: enseña qué tapan los botones y qué se corta en el perfil. Medidas aproximadas.', jpg=True, fondo='foto')

C = '07-horizontal'
PH = guarda(portada('escena-h-1920x1080', 220, 70, 60, [LEMA], 58), C, 'portada-horizontal-1920x1080', 'Portada horizontal', 'Para YouTube, presentaciones y pantallas. 16:9.', jpg=True, fondo='foto')
guarda(PH.resize((1280, 720), Image.LANCZOS), C, 'miniatura-youtube-1280x720', 'Miniatura de YouTube', 'El tamaño que pide YouTube para la miniatura.', jpg=True, fondo='foto')
guarda(crudo('escena-h-1920x1080'), C, 'fondo-horizontal-escena-1920x1080', 'Fondo horizontal · el mundo', 'Sin texto, para escribir encima.', jpg=True, fondo='foto')
guarda(crudo('tierra-h-1920x1080'), C, 'fondo-horizontal-tierra-1920x1080', 'Fondo horizontal · tierra', 'Pura tierra con mineral.', jpg=True, fondo='foto')
guarda(cierre_h(), C, 'cierre-horizontal-1920x1080', 'Cierre horizontal', 'Pantalla final para video horizontal.', jpg=True, fondo='foto')
guarda(marco(1920, 1080, (48, 44), 84, (48, 936), 100, derecha=True), C, 'marco-horizontal-1920x1080', 'Marco para video horizontal', 'Transparente: logo arriba a la izquierda y liga abajo a la derecha.', fondo='foto-marco-h')
guarda(portada('escena-banner-2560x1440', 190, 545, 532, [LEMA], 48), C, 'banner-youtube-2560x1440', 'Banner del canal de YouTube', 'El título queda en la franja central, que es lo único que se ve en computadora y celular.', jpg=True, fondo='foto')
guarda(portada('escena-x-1500x500', 150, 48, 62, [LEMA], 38), C, 'encabezado-x-1500x500', 'Encabezado de X', 'También sirve para LinkedIn.', jpg=True, fondo='foto')
guarda(portada('escena-fb-1640x624', 170, 60, 54, [LEMA], 42), C, 'portada-facebook-1640x624', 'Portada de Facebook', 'Página o grupo.', jpg=True, fondo='foto')
guarda(Image.open(os.path.join(AQUI, '..', 'publico', 'mina.jpg')).convert('RGBA'), C, 'liga-1200x630', 'Imagen de la liga', 'La que sale sola al pegar la liga en WhatsApp o iMessage.', jpg=True, fondo='foto')

C = '08-cuadrado'
guarda(portada('escena-c-1080x1080', 200, 50, 56, ['Excava con', 'tus amigos'], 54), C, 'publicacion-1080x1080', 'Publicación cuadrada', 'Instagram, Facebook y estados.', jpg=True, fondo='foto')
guarda(crudo('escena-c-1080x1080'), C, 'fondo-cuadrado-escena-1080x1080', 'Fondo cuadrado · el mundo', 'Sin texto.', jpg=True, fondo='foto')
guarda(portada('escena-c45-1080x1350', 200, 50, 70, ['Excava con', 'tus amigos'], 54), C, 'publicacion-4x5-1080x1350', 'Publicación 4:5', 'El formato que más espacio ocupa en Instagram.', jpg=True, fondo='foto')
guarda(crudo('escena-c45-1080x1350'), C, 'fondo-4x5-escena-1080x1350', 'Fondo 4:5 · el mundo', 'Sin texto.', jpg=True, fondo='foto')
guarda(crudo('tierra-c-1080x1080'), C, 'fondo-cuadrado-tierra-1080x1080', 'Fondo cuadrado · tierra', 'Pura tierra con mineral.', jpg=True, fondo='foto')
guarda(cierre_c(), C, 'cierre-cuadrado-1080x1080', 'Cierre cuadrado', 'Última imagen de un carrusel.', jpg=True, fondo='foto')

C = '09-video'
guarda(con_sombra(cintillo(LIGA, 170), 14, 8, 120), C, 'cintillo-liga', 'Cintillo con la liga', 'Transparente. Se pone abajo del video para decir dónde se juega.')
guarda(con_sombra(cintillo('Juega gratis · sin registro', 170), 14, 8, 120), C, 'cintillo-juega-gratis', 'Cintillo «Juega gratis»', 'Transparente. Para los primeros segundos.')
guarda(logo_h(300, mono=BLANCO), C, 'marca-de-agua-blanca', 'Marca de agua', 'Logo en una tinta: va en una esquina, al 60–80 % de opacidad.', fondo='oscuro')
guarda(qr_img('https://' + LIGA, 1200), C, 'qr-mina', 'Código QR', 'Lleva a ' + LIGA + '. Para pantallas, carteles y el cierre del video.', fondo='oscuro')
guarda(tarjeta_qr(1000, 'Escanea y juega'), C, 'qr-mina-tarjeta', 'QR con leyenda', 'Tarjeta lista para pegar, con esquinas redondeadas.', fondo='oscuro')

# ── las 22 gemas, el arte hecho con ellas y el brochure ───────────────────────────────────────────────────────────────
SLUG = ['hierro', 'cobre', 'plata', 'oro', 'platino', 'einstenio', 'esmeralda', 'rubi', 'diamante', 'amazonita', 'aguamarina', 'zafiro', 'perla-negra', 'onix', 'topacio', 'jade-imperial', 'amatista', 'tanzanita', 'alejandrita', 'paladio', 'rodio', 'osmio']
MINERALES = json.load(open(f'{RAW}/minerales.json', encoding='utf-8'))
def dinero(v): return f'${v:,}' if v < 1e6 else f'${v / 1e6:g} M'
for m in MINERALES:
    guarda(crudo(f"gema-{m['i']:02d}"), '12-gemas', f"gema-{m['i'] + 1:02d}-{SLUG[m['i']]}", m['n'], f"Vale {dinero(m['v'])} la pieza. Aparece desde los {m['a']:,} m.".replace(',', ','))
ARTE = sorted(glob.glob(f'{RAW}/arte/*.png'))
for a in ARTE:
    n = os.path.basename(a)[:-4]; info = json.load(open(a[:-4] + '.json', encoding='utf-8')) if os.path.exists(a[:-4] + '.json') else {}
    guarda(Image.open(a).convert('RGBA'), '13-arte', n, info.get('titulo', n), info.get('texto', 'Arte con gemas, 1080 × 1920.') + ' Se rehace igual en el generador con esa semilla.', fondo='foto')
BROCHURE = sorted(glob.glob(f'{RAW}/brochure/Mina_Brochure_*.pdf'))
if BROCHURE:
    os.makedirs(f'{KIT}/14-brochure', exist_ok=True); bn = os.path.basename(BROCHURE[-1]); shutil.copyfile(BROCHURE[-1], f'{KIT}/14-brochure/{bn}'); shutil.copyfile(BROCHURE[-1], f'{SAL}/Mina_Brochure.pdf')      # además del fechado, uno con nombre fijo: esa liga se manda por WhatsApp y no cambia
    for viejo in glob.glob(f'{SAL}/Mina_Brochure_*.pdf'): os.remove(viejo)
    mini = ''
    if os.path.exists(f'{RAW}/brochure/portada.png'): t = Image.open(f'{RAW}/brochure/portada.png').convert('RGB'); t.thumbnail((760, 760), Image.LANCZOS); mini = '14-brochure__portada.webp'; t.save(f'{MINI}/{mini}', quality=84, method=6)
    REG.append({'c': '14-brochure', 'f': bn, 't': 'Brochure de Mina (PDF)', 'u': 'Seis hojas con capturas: qué es, cómo se juega, por qué es distinto y cómo empezar. Para cuando piden «pásame más información».', 'w': 0, 'h': 0, 'kb': round(os.path.getsize(BROCHURE[-1]) / 1024), 'mini': mini, 'fondo': 'foto' if mini else 'archivo', 'ic': '📕'})

# ── colores y tipografía ──────────────────────────────────────────────────────────────────────────────────────────────
COLORES = [('Amarillo Mina', AMARILLO, 'La marca: títulos, botones y acentos.'), ('Café tinta', TINTA, 'Contornos y texto sobre amarillo.'), ('Tierra oscura', FONDO, 'El fondo de todo.'), ('Caja', CAJA, 'Tarjetas y menús.'), ('Borde', BORDE, 'Líneas y marcos.'),
           ('Crema', CREMA, 'Texto sobre oscuro.'), ('Arena', ARENA, 'Texto secundario.'), ('Tierra', '#a9744f', 'La tierra del mundo.'), ('Pasto', '#7cc24e', 'La superficie.'), ('Cielo alto', '#22407a', 'Arriba del atardecer.'),
           ('Atardecer', '#f0a868', 'El horizonte.'), ('Rosa Pinturería', '#ff7ac8', 'La Pinturería.'), ('Rojo', '#ff6b5a', 'Peligro y Gasolinera.'), ('Azul', '#6ec3ff', 'El Taller y los vidrios.'), ('Verde', '#6fdc7a', 'Éxito y El Almacén.'), ('Morado', '#c05cff', 'La Remineralizadora.')]
def paleta():
    cols, cw, ch = 4, 440, 250; im = lienzo(cols * cw + 80, ((len(COLORES) + cols - 1) // cols) * ch + 200, FONDO); d = ImageDraw.Draw(im); pega(im, palabra('MINA', 90), 40, 40)
    d.text((im.width - 40, 85), 'Paleta de color', font=F('ExtraBold', 44), fill=hexa(CREMA), anchor='rm')
    for k, (n, h, _) in enumerate(COLORES):
        x, y = 40 + (k % cols) * cw, 170 + (k // cols) * ch; d.rounded_rectangle([x, y, x + cw - 24, y + 140], radius=18, fill=hexa(h), outline=hexa(BORDE), width=2)
        d.text((x + 4, y + 158), n, font=F('ExtraBold', 30), fill=hexa(CREMA)); d.text((x + 4, y + 196), h.upper(), font=F('SemiBold', 26), fill=hexa(ARENA))
    return im
guarda(paleta(), '11-color', 'mina-paleta', 'La paleta en una imagen', 'Para tenerla a la mano en el editor.', fondo='oscuro')
with open(f'{KIT}/11-color/mina-colores.txt', 'w', encoding='utf-8') as f: f.write('Mina · paleta de color\n\n' + '\n'.join(f'{h.upper()}  {n} — {u}' for n, h, u in COLORES) + '\n')
REG.append({'c': '11-color', 'f': 'mina-colores.txt', 't': 'Los códigos en texto', 'u': 'Los dieciséis colores con su código hexadecimal.', 'w': 0, 'h': 0, 'kb': 1, 'mini': '', 'fondo': 'archivo', 'ic': '🎨'})
def muestra_tipo():
    im = lienzo(1600, 900, FONDO); d = ImageDraw.Draw(im); pega(im, palabra('MINA', 230), 70, 70); d.text((1530, 110), 'Inter', font=F('Black', 120), fill=hexa(CREMA), anchor='rm')
    y = 360
    for peso, n, uso in [('Black', 'Black 900', 'El logotipo y los títulos grandes'), ('ExtraBold', 'ExtraBold 800', 'Lemas y subtítulos'), ('Bold', 'Bold 700', 'Botones y etiquetas'), ('SemiBold', 'SemiBold 600', 'Texto destacado'), ('Regular', 'Regular 400', 'Texto corrido')]:
        d.text((70, y), 'Excava con tus amigos', font=F(peso, 64), fill=hexa(AMARILLO if peso == 'Black' else CREMA)); d.text((1530, y + 16), n + ' · ' + uso, font=F('SemiBold', 26), fill=hexa(ARENA), anchor='ra'); y += 100
    return im
C = '10-tipografia'
guarda(muestra_tipo(), C, 'mina-tipografia', 'La tipografía en una imagen', 'Inter y sus cinco pesos, con para qué sirve cada uno.', fondo='oscuro')
for p, n in [('Black', 'Inter Black (900)'), ('ExtraBold', 'Inter ExtraBold (800)'), ('Bold', 'Inter Bold (700)'), ('SemiBold', 'Inter SemiBold (600)'), ('Regular', 'Inter Regular (400)')]:
    guarda_archivo(f'{FUENTES}/Inter-{p}.ttf', C, f'Inter-{p}.ttf', n, 'Archivo de fuente (.ttf). Se instala con doble clic; en CapCut se importa desde Texto → Fuente.', '🔤')
guarda_archivo(f'{FUENTES}/LICENSE.txt', C, 'Inter-LICENCIA-OFL.txt', 'Licencia de Inter', 'SIL Open Font License: se puede usar y repartir gratis, también en trabajos comerciales.', '📜')
with zipfile.ZipFile(f'{KIT}/{C}/Inter-para-Mina.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for a in sorted(os.listdir(f'{KIT}/{C}')):
        if a.endswith('.ttf') or a.endswith('.txt'): z.write(f'{KIT}/{C}/{a}', a)
REG.append({'c': C, 'f': 'Inter-para-Mina.zip', 't': 'Los cinco pesos, en un zip', 'u': 'Todo Inter para Mina con su licencia.', 'w': 0, 'h': 0, 'kb': round(os.path.getsize(f'{KIT}/{C}/Inter-para-Mina.zip') / 1024), 'mini': '', 'fondo': 'archivo', 'ic': '🗜️'})

# ── el LÉEME, el zip con todo y el índice para la página ─────────────────────────────────────────────────────────────
CARPETAS = [('01-icono', 'Ícono'), ('02-favicon', 'Favicon'), ('03-logotipo', 'Logotipo'), ('04-maquinita', 'La maquinita'), ('05-perfil', 'Foto de perfil (el círculo)'), ('06-vertical', 'Vertical 9:16'), ('07-horizontal', 'Horizontal'), ('08-cuadrado', 'Cuadrado y 4:5'), ('09-video', 'Para video'), ('10-tipografia', 'Tipografía'), ('11-color', 'Color'), ('12-gemas', 'Las 22 gemas'), ('13-arte', 'Arte con gemas'), ('14-brochure', 'Brochure')]
leeme = f"""MINA · Kit de marca {VERSION} · {SELLO.replace('_', ' ')}
Guía de estilos en línea: https://{LIGA}/guia-estilos
Hecho por Ing. Ricardo López Reyero · CapitalTorreon

QUÉ HAY AQUÍ
""" + '\n'.join(f'  {c}/  {t} ({sum(1 for r in REG if r["c"] == c)} archivos)' for c, t in CARPETAS) + f"""

PARA EMPEZAR EN TIKTOK
  1. Foto de perfil: 05-perfil/perfil-atardecer.png
  2. Portada de cada video: 06-vertical/portada-vertical-1080x1920.jpg
  3. Encima de lo grabado: 06-vertical/marco-vertical-1080x1920.png (es transparente)
  4. Última pantalla: 06-vertical/cierre-vertical-1080x1920.jpg
  5. Texto en el editor: Inter Black para títulos (10-tipografia), amarillo #FFD23F con contorno café #2A1A14
  6. Liga en la biografía: https://{LIGA}

ARTE CON GEMAS Y BROCHURE
  · 13-arte/ trae seis imágenes verticales hechas con las gemas del juego (aquí en JPG para que el zip pese poco;
    en PNG se bajan una por una en la guía, o todas en Mina_Arte_con_Gemas_{VERSION}_{SELLO}.zip).
  · Para hacer más: https://{LIGA}/guia-estilos/#arte, botón «Generar». Cada una es distinta y se baja en PNG.
  · 14-brochure/ es el PDF de seis hojas para cuando piden más información.
    También se lee en línea: https://{LIGA}/guia-estilos/brochure/

TRES REGLAS
  · El logo no se deforma, no se recolorea y no se le quita el contorno café.
  · Mina es gratis, sin anuncios y sin registro: se dice tal cual, sin exagerar ni prometer premios.
  · Siempre se dice dónde se juega: {LIGA}

Tipografía Inter: SIL Open Font License (ver 10-tipografia/Inter-LICENCIA-OFL.txt).
"""
with open(f'{KIT}/LEEME.txt', 'w', encoding='utf-8') as f: f.write(leeme)
for a in os.listdir(SAL):
    if a.endswith('.zip'): os.remove(f'{SAL}/{a}')
ZIP = f'Mina_Kit_de_Marca_{VERSION}_{SELLO}.zip'
with zipfile.ZipFile(f'{SAL}/{ZIP}', 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for raiz, _, archivos in os.walk(KIT):
        for a in sorted(archivos):
            r = os.path.join(raiz, a); rel = 'Mina_Kit_de_Marca/' + os.path.relpath(r, KIT)
            if os.path.basename(raiz) == '13-arte' and a.endswith('.png'):      # el arte pesa casi 3 MB por imagen en PNG: en el zip va en JPG
                b = io.BytesIO(); Image.open(r).convert('RGB').save(b, 'JPEG', quality=93, optimize=True, progressive=True); z.writestr(rel[:-4] + '.jpg', b.getvalue())
            else: z.write(r, rel)
mb = os.path.getsize(f'{SAL}/{ZIP}') / 1048576
assert mb < 24.5, f'El zip pesa {mb:.1f} MB y Cloudflare no sirve archivos de más de 25 MiB'
ZIP_ARTE = f'Mina_Arte_con_Gemas_{VERSION}_{SELLO}.zip' if ARTE else ''
if ARTE:
    with zipfile.ZipFile(f'{SAL}/{ZIP_ARTE}', 'w', zipfile.ZIP_STORED) as z:
        for a in ARTE: z.write(a, 'Mina_Arte_con_Gemas/' + os.path.basename(a))
    assert os.path.getsize(f'{SAL}/{ZIP_ARTE}') / 1048576 < 24.5, 'El zip del arte pasa de 25 MiB: baja el número de imágenes'
json.dump({'version': VERSION, 'sello': SELLO, 'zip': ZIP, 'zipMb': round(mb, 1), 'brochure': 'Mina_Brochure.pdf' if BROCHURE else '', 'brochureNombre': os.path.basename(BROCHURE[-1]) if BROCHURE else '', 'brochureMb': round(os.path.getsize(BROCHURE[-1]) / 1048576, 1) if BROCHURE else 0, 'arteZip': ZIP_ARTE, 'arteZipMb': round(os.path.getsize(f'{SAL}/{ZIP_ARTE}') / 1048576, 1) if ARTE else 0, 'arte': [json.load(open(a[:-4] + '.json', encoding='utf-8')) for a in ARTE if os.path.exists(a[:-4] + '.json')], 'carpetas': [{'c': c, 't': t} for c, t in CARPETAS], 'colores': [{'n': n, 'h': h, 'u': u} for n, h, u in COLORES], 'archivos': REG},
          open(f'{SAL}/kit.json', 'w', encoding='utf-8'), ensure_ascii=False)
print(f'{len(REG)} archivos · zip {mb:.1f} MB · mayor: ' + ', '.join(f"{r['f']} {r['kb']} KB" for r in sorted(REG, key=lambda r: -r['kb'])[:4]))
