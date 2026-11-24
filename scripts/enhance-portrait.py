"""Enhance the portrait: tighter crop, tone curve, face light, split-tone grade, sharpen, vignette."""
import sys
from PIL import Image, ImageOps, ImageFilter, ImageChops, ImageDraw, ImageEnhance

src, out_dir = sys.argv[1], sys.argv[2]
im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
W, H = im.size  # 1200x1600

# 1. Tighter 3:4 head-and-shoulders crop
cw = int(W * 0.86)
ch = int(cw * 4 / 3)
left = (W - cw) // 2
top = int(H * 0.06)
im = im.crop((left, top, left + cw, min(H, top + ch)))
W, H = im.size

# 2. Gentle denoise before sharpening (removes jpeg blockiness in the dark backdrop)
im = im.filter(ImageFilter.GaussianBlur(0.6))

# 3. Auto levels + gentle S-curve with lifted blacks
im = ImageOps.autocontrast(im, cutoff=(0.3, 0.0))
def s_curve(v):
    x = v / 255.0
    y = x + 0.12 * (x - 0.5) * (1 - abs(2 * x - 1))  # mild contrast in mids
    y = 0.025 + y * 0.975                             # lift blacks slightly (filmic)
    return max(0, min(255, int(y * 255)))
im = im.point([s_curve(i) for i in range(256)] * 3)

# 4. Soft "key light" on the face region
mask = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(mask)
cx, cy = W * 0.5, H * 0.33
rx, ry = W * 0.30, H * 0.24
d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(W * 0.12))
bright = ImageEnhance.Brightness(im).enhance(1.07)
bright = ImageEnhance.Contrast(bright).enhance(1.05)
im = Image.composite(bright, im, mask)

# 5. Split-tone grade: teal shadows, warm highlights
def ch_curve(shadow_shift, high_shift):
    lut = []
    for i in range(256):
        x = i / 255.0
        sh = (1 - x) ** 2.2
        hi = x ** 2.0
        lut.append(max(0, min(255, int(i + shadow_shift * sh * 255 + high_shift * hi * 255))))
    return lut
r = ch_curve(-0.010, 0.006)
g = ch_curve(0.018, 0.004)
b = ch_curve(0.040, -0.012)
im = im.point(r + g + b)
im = ImageEnhance.Color(im).enhance(1.06)

# 6. Sharpen detail (eyes, hair, fabric)
im = im.filter(ImageFilter.UnsharpMask(radius=2.2, percent=85, threshold=3))

# 7. Vignette
vig = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(vig)
d.ellipse((-W * 0.25, -H * 0.12, W * 1.25, H * 1.18), fill=255)
vig = vig.filter(ImageFilter.GaussianBlur(W * 0.18))
dark = ImageEnhance.Brightness(im).enhance(0.55)
im = Image.composite(im, dark, vig)

im.save(f"{out_dir}/usman.jpg", "JPEG", quality=88, optimize=True, progressive=True)
im.resize((W // 2, H // 2), Image.LANCZOS).save(f"{out_dir}/usman-sm.jpg", "JPEG", quality=85, optimize=True, progressive=True)
im.save(f"{out_dir}/usman.webp", "WEBP", quality=86, method=6)
print(im.size)
