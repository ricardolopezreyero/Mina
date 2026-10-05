# RLR · Recorta y pasa a JPG las capturas de cap/ para el brochure (publico/guia-estilos/brochure/img/).
# Uso: python3 brochure-imagenes.py   (después de nav.mjs con brochure-capturas.mjs y brochure-celular.mjs)
import os
from PIL import Image
AQUI = os.path.dirname(os.path.abspath(__file__)); S = AQUI + '/cap/'; D = os.path.normpath(AQUI + '/../../publico/guia-estilos/brochure/img') + '/'
os.makedirs(D, exist_ok=True)
def g(n, sal, caja=None, ancho=1700):
    im = Image.open(S + n + '.png').convert('RGB'); w, h = im.size
    if caja: im = im.crop((int(caja[0] * w), int(caja[1] * h), int(caja[2] * w), int(caja[3] * h)))
    if im.width > ancho: im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    im.save(D + sal + '.jpg', quality=86, optimize=True, progressive=True); print(sal, im.size)
g('01-superficie', 'superficie'); g('02-excavando', 'excavando'); g('03-mapa', 'mapa', ancho=1300)
g('04-bascula', 'bascula', (0.14, 0.2, 0.86, 0.8), 1200); g('05-taller', 'taller', (0.14, 0.0, 0.86, 1.0), 1200); g('06-pintureria', 'pintureria', (0.14, 0.0, 0.86, 1.0), 1300); g('07-invitar', 'invitar', (0.14, 0.06, 0.86, 0.94), 1200)
g('08-acuifero', 'acuifero', (0.25, 0.3, 0.75, 0.92), 1000); g('09-gruta', 'gruta', (0.22, 0.32, 0.78, 1.0), 1000); g('10-ciudad', 'ciudad', (0.22, 0.24, 0.80, 0.97), 1000)
g('11-celular-superficie', 'celular-superficie', ancho=700); g('12-celular-excavando', 'celular-excavando', ancho=700)

# Las piezas chicas que usan el brochure y la guía del creador (gemas, maquinitas, palabra y QR): con las grandes del kit los PDF pesaban el doble.
import glob
K = os.path.normpath(AQUI + '/../../publico/guia-estilos/kit') + '/'
for a in sorted(glob.glob(K + '12-gemas/gema-*.png')): im = Image.open(a).convert('RGBA'); im.thumbnail((150, 150), Image.LANCZOS); im.save(D + os.path.basename(a)[:-4] + '.webp', quality=92, method=6)
for a in sorted(glob.glob(K + '04-maquinita/*.png')): im = Image.open(a).convert('RGBA'); im.thumbnail((220, 220), Image.LANCZOS); im.save(D + 'maq-' + os.path.basename(a)[:-4] + '.webp', quality=92, method=6)
im = Image.open(K + '03-logotipo/mina-palabra.png').convert('RGBA'); im.thumbnail((1100, 1100), Image.LANCZOS); im.save(D + 'mina-palabra.png', optimize=True)
Image.open(K + '09-video/qr-mina.png').convert('L').resize((600, 600), Image.NEAREST).convert('1').save(D + 'qr-mina.png', optimize=True)
