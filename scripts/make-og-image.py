"""
Builds public/og-image.png (1200x630) — the picture shown when the site is shared
on WhatsApp, Facebook, X, LinkedIn, iMessage, etc.

Run:  python scripts/make-og-image.py      (needs Pillow; uses public/images/logo-white.png)
"""
from PIL import Image, ImageDraw, ImageFont
import numpy as np

W, H = 1200, 630
BG_TOP, BG_BOT = (15, 47, 38), (3, 10, 8)       # deep green → near black
ORANGE, CREAM = (224, 112, 31), (243, 235, 221)

# vertical gradient
g = np.linspace(0, 1, H)[:, None, None]
grad = (np.array(BG_TOP) * (1 - g) + np.array(BG_BOT) * g).astype(np.uint8)
img = Image.fromarray(np.repeat(grad, W, axis=1), 'RGB').convert('RGBA')

def font(names, size):
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            continue
    return ImageFont.load_default()

serif = ['C:/Windows/Fonts/georgia.ttf', 'C:/Windows/Fonts/times.ttf', 'DejaVuSerif.ttf']
serif_i = ['C:/Windows/Fonts/georgiai.ttf', 'C:/Windows/Fonts/timesi.ttf', 'DejaVuSerif-Italic.ttf']
sans = ['C:/Windows/Fonts/segoeui.ttf', 'C:/Windows/Fonts/arial.ttf', 'DejaVuSans.ttf']

d = ImageDraw.Draw(img)

# hairline frame
d.rectangle((36, 36, W - 37, H - 37), outline=(224, 112, 31, 90), width=1)

# logo (white version), left
logo = Image.open('public/images/logo-white.png').convert('RGBA')
logo.thumbnail((330, 330), Image.LANCZOS)
img.alpha_composite(logo, (110, (H - logo.height) // 2 - 6))

# text block, right of logo
x = 520
d.text((x, 190), 'AFRISH', font=font(serif, 108), fill=CREAM)
d.text((x, 292), 'PETALS', font=font(serif_i, 108), fill=ORANGE)
d.line((x, 432, x + 120, 432), fill=ORANGE, width=2)
d.text((x, 452), 'PREMIUM AFRICAN RESTAURANT', font=font(sans, 24), fill=CREAM)
d.text((x, 492), 'KIGALI  ·  RWANDA', font=font(sans, 24), fill=(224, 112, 31))

img.convert('RGB').save('public/og-image.png', optimize=True)
print('wrote public/og-image.png')
