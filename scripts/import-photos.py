"""Turns the restaurant's own photos (Photos/…) into responsive WebP sets in public/images/real/.
Run:  python scripts/import-photos.py      (needs Pillow)
Each photo becomes  name.webp (1200w) + name-480/800/1200/1800.webp, matching local() in src/data/images.js.
"""
import os
from PIL import Image, ImageOps

OUT = 'public/images/real'
WIDTHS = [480, 800, 1200, 1800]
E, C = 'Photos/Events/WhatsApp Image 2026-09-24 at ', 'Photos/Events catering/WhatsApp Image 2026-09-24 at '
PHOTOS = {
    'event-long-table': E + '14.45.02.jpeg',
    'event-speech': E + '14.45.03.jpeg',
    'event-cake': E + '14.45.04.jpeg',
    'event-bride': E + '14.45.05.jpeg',
    'catering-drinks': C + '14.49.05.jpeg',
    'catering-buffet': C + '14.49.09.jpeg',
    'catering-fruit': C + '14.49.10.jpeg',
    'catering-donuts': C + '14.53.22.jpeg',
}

os.makedirs(OUT, exist_ok=True)
for name, path in PHOTOS.items():
    im = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    for w in WIDTHS + [1200]:
        if w > im.width:
            continue
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(f'{OUT}/{name}-{w}.webp', 'WEBP', quality=78, method=6)
    im1200 = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS)
    im1200.save(f'{OUT}/{name}.webp', 'WEBP', quality=78, method=6)
    print(name, im.size)
