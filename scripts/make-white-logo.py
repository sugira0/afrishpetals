"""
Builds public/images/logo-white.png from public/images/logo.png.

Turns the logo's dark olive-brown parts (plate ring, fork, knife, top leaves) white
and leaves everything else exactly as it was: the orange Africa map and the small
reddish-brown leaves on the plate.

The dark parts are one colour (~#352F1B). The reddish leaves and the shaded part of
Africa have a much larger red-over-green difference, which is how they are told apart.
Anti-aliased edges between a dark part and the orange are un-mixed so no brown fringe is left.

Run:  python scripts/make-white-logo.py      (needs Pillow, numpy, scipy)
"""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = 'public/images/logo.png'
DST = 'public/images/logo-white.png'

im = Image.open(SRC).convert('RGBA')
a = np.asarray(im).astype(np.float32)
rgb, alpha = a[..., :3], a[..., 3]
R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]

DARK = np.array([53, 47, 27], dtype=np.float32)  # the logo's main dark colour
WHITE = np.array([255, 255, 255], dtype=np.float32)

clamp = lambda x: np.clip(x, 0, 1)

# 1) Solid dark-olive pixels: dark AND a small red-over-green difference.
brightness = rgb.max(axis=-1)
w_dark = clamp((120 - brightness) / 30) * clamp((24 - (R - G)) / 10) * clamp((alpha - 8) / 60)

# 2) Edge pixels where dark olive blends into orange: p = t*Orange + (1-t)*Dark.
#    Replace only the dark share with white:  new = p + (1-t)*(white-dark).
solid = w_dark > 0.9
near = ndi.binary_dilation(solid, iterations=3) & ~solid & (alpha > 8)
orange = np.array([255, 169, 46], dtype=np.float32)
axis = orange - DARK
t = ((rgb - DARK) @ axis) / float(axis @ axis)
t = clamp(t)
resid = np.linalg.norm(rgb - (DARK + t[..., None] * axis), axis=-1)
mix = near & (resid < 16) & (t < 0.98)
add = np.where(mix, 1 - t, 0)[..., None] * (WHITE - DARK)

out = rgb + add
out = out * (1 - w_dark[..., None]) + WHITE * w_dark[..., None]
out = np.clip(out, 0, 255)

res = np.dstack([out, alpha]).astype(np.uint8)
Image.fromarray(res, 'RGBA').save(DST, optimize=True)
print('wrote', DST, res.shape)
