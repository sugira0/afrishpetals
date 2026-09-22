"""
Builds the app icons from public/images/logo-white.png:
  public/favicon.png (256), public/icon-192.png, public/icon-512.png, public/apple-touch-icon.png (180)

Run:  python scripts/make-icons.py      (needs Pillow)
"""
from PIL import Image, ImageDraw

logo = Image.open('public/images/logo-white.png').convert('RGBA')
BG = (7, 26, 22, 255)


def icon(size, radius_ratio=0.2, pad=0.74):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(img).rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * radius_ratio), fill=BG)
    lg = logo.copy()
    lg.thumbnail((int(size * pad), int(size * pad)), Image.LANCZOS)
    img.alpha_composite(lg, ((size - lg.width) // 2, (size - lg.height) // 2))
    return img


icon(256).save('public/favicon.png', optimize=True)
icon(192).save('public/icon-192.png', optimize=True)
icon(512).save('public/icon-512.png', optimize=True)
# iOS applies its own rounding: give it a full-bleed square
icon(180, radius_ratio=0).save('public/apple-touch-icon.png', optimize=True)
print('icons written')
