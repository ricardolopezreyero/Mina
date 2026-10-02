# Icono de Mina: la maquinita amarilla perforando, sobre tierra. Se dibuja grande y se reduce.  RLR · Ricardo López Reyero
from PIL import Image, ImageDraw, ImageFilter
S = 1024
def icono(margen=0.0, redondo=True):
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    # fondo: cielo de atardecer arriba, tierra abajo
    fondo = Image.new('RGBA', (S, S)); f = ImageDraw.Draw(fondo)
    for y in range(S):
        k = y / S
        if k < 0.46:
            a, b = (34, 64, 122), (240, 168, 104); t = k / 0.46
        else:
            a, b = (122, 76, 49), (58, 31, 27); t = (k - 0.46) / 0.54
        f.line([(0, y), (S, y)], fill=tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3)) + (255,))
    f.rectangle([0, int(S * 0.46), S, int(S * 0.485)], fill=(124, 194, 78, 255))            # el pasto
    for (x, y, r, c) in [(150, 640, 26, (107, 66, 42)), (860, 600, 20, (107, 66, 42)), (240, 880, 30, (58, 31, 27)), (800, 860, 24, (75, 41, 28)), (640, 930, 18, (107, 66, 42))]:
        f.ellipse([x - r * 1.3, y - r, x + r * 1.3, y + r], fill=c + (255,))
    mask = Image.new('L', (S, S), 0); m = ImageDraw.Draw(mask)
    if redondo: m.rounded_rectangle([0, 0, S, S], radius=int(S * 0.22), fill=255)
    else: m.rectangle([0, 0, S, S], fill=255)
    im.paste(fondo, (0, 0), mask); d = ImageDraw.Draw(im)
    # todo lo demás se dibuja en una capa que luego se encoge si hay margen (para el icono «enmascarable»)
    capa = Image.new('RGBA', (S, S), (0, 0, 0, 0)); c = ImageDraw.Draw(capa)
    cx, cy, w, h = S // 2, int(S * 0.50), int(S * 0.56), int(S * 0.40)
    x0, y0 = cx - w // 2, cy - h // 2
    # el túnel que va abriendo
    c.rounded_rectangle([cx - w * 0.36, cy + h * 0.1, cx + w * 0.36, cy + h * 1.02], radius=30, fill=(36, 21, 15, 255))
    # el taladro
    c.polygon([(cx - w * 0.2, cy + h * 0.52), (cx + w * 0.2, cy + h * 0.52), (cx, cy + h * 1.0)], fill=(215, 219, 224, 255), outline=(43, 43, 43, 255))
    for i in range(3):
        yy = cy + h * (0.6 + i * 0.12); an = w * 0.2 * (1 - (0.08 + i * 0.12) / 0.48)
        c.line([(cx - an, yy), (cx + an, yy + h * 0.05)], fill=(127, 135, 145, 255), width=14)
    # las orugas
    c.rounded_rectangle([x0 - 14, cy + h * 0.2, x0 + w + 14, cy + h * 0.54], radius=60, fill=(38, 34, 31, 255))
    for i in range(3):
        px = x0 + w * (0.17 + i * 0.33)
        c.ellipse([px - 38, cy + h * 0.37 - 38, px + 38, cy + h * 0.37 + 38], fill=(111, 106, 102, 255))
    # el cuerpo
    c.rounded_rectangle([x0, y0 + h * 0.02, x0 + w, cy + h * 0.28], radius=70, fill=(255, 210, 63, 255), outline=(122, 82, 0, 255), width=10)
    c.rounded_rectangle([x0 + 12, y0 + h * 0.04, x0 + w - 12, y0 + h * 0.22], radius=56, fill=(255, 226, 122, 255))
    c.rectangle([x0 + w * 0.06, cy + h * 0.14, x0 + w * 0.94, cy + h * 0.19], fill=(176, 122, 0, 255))
    # la cabina
    kx, ky, kr = cx + w * 0.14, cy - h * 0.1, w * 0.2
    c.pieslice([kx - kr, ky - kr, kx + kr, ky + kr], 180, 360, fill=(159, 227, 255, 255), outline=(27, 58, 74, 255), width=10)
    c.ellipse([kx - kr * 0.55, ky - kr * 0.75, kx - kr * 0.15, ky - kr * 0.4], fill=(255, 255, 255, 190))
    c.ellipse([kx - 22, ky - kr * 0.42, kx + 34, ky - kr * 0.42 + 56], fill=(36, 50, 58, 255))
    # el faro y su luz
    c.ellipse([x0 + w - 60, cy + h * 0.0, x0 + w - 8, cy + h * 0.0 + 52], fill=(255, 243, 176, 255))
    # una pepita brillando en la tierra
    gx, gy = int(S * 0.2), int(S * 0.76)
    c.polygon([(gx, gy - 46), (gx + 42, gy - 12), (gx + 26, gy + 40), (gx - 28, gy + 38), (gx - 44, gy - 10)], fill=(255, 210, 63, 255), outline=(122, 82, 0, 255))
    c.polygon([(gx, gy - 46), (gx + 6, gy - 6), (gx - 44, gy - 10)], fill=(255, 240, 170, 255))
    for (sx, sy, l) in [(gx + 52, gy - 52, 26)]:
        c.line([(sx - l, sy), (sx + l, sy)], fill=(255, 255, 255, 255), width=8); c.line([(sx, sy - l), (sx, sy + l)], fill=(255, 255, 255, 255), width=8)
    if margen:
        n = int(S * (1 - 2 * margen)); capa = capa.resize((n, n), Image.LANCZOS); lienzo = Image.new('RGBA', (S, S), (0, 0, 0, 0)); lienzo.paste(capa, ((S - n) // 2, (S - n) // 2), capa); capa = lienzo
    return Image.alpha_composite(im, capa)
d = '../publico/iconos/'
base = icono()
for n in (512, 192, 180, 64, 32):
    base.resize((n, n), Image.LANCZOS).save(f'{d}icono-{n}.png', optimize=True)
icono(margen=0.11, redondo=False).resize((512, 512), Image.LANCZOS).save(d + 'icono-mascara-512.png', optimize=True)
icono(redondo=False).resize((180, 180), Image.LANCZOS).convert('RGB').save(d + 'icono-180.png', optimize=True)     # el de iPhone va sin esquinas: el teléfono las redondea
print('listo')
