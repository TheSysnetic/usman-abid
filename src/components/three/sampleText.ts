import { palette } from "@/lib/palette";

export type TextSample = { points: number[]; colors: number[] };

const GRADIENT = [palette.violet, palette.pink, palette.coral, palette.sun].map(hexToRgb);
const PAPER = hexToRgb("#ededeb");

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function gradientAt(t: number): [number, number, number] {
  const x = Math.min(Math.max(t, 0), 1) * (GRADIENT.length - 1);
  const i = Math.min(Math.floor(x), GRADIENT.length - 2);
  const f = x - i;
  return GRADIENT[i].map((c, k) => c + (GRADIENT[i + 1][k] - c) * f) as [number, number, number];
}

/**
 * Rasterises an element's text with its computed font and returns a grid of
 * points (in page pixels) covering the glyphs, plus a colour per point.
 * Elements marked `data-gradient` get the brand gradient, others are paper white.
 */
export function sampleText(elements: HTMLElement[], step: number): TextSample {
  const points: number[] = [];
  const colors: number[] = [];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { points, colors };

  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    if (!rect.width || !rect.height) continue;
    // Glyphs overflow tight line boxes (line-height < 1), so rasterise with padding.
    const pad = Number.parseFloat(style.fontSize) * 0.35;
    const width = Math.ceil(rect.width + pad * 2);
    const height = Math.ceil(rect.height + pad * 2);

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    ctx.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "alphabetic";

    // Place the baseline where CSS does: content area centred in the line box.
    const metrics = ctx.measureText(el.textContent ?? "");
    const ascent = metrics.fontBoundingBoxAscent;
    const descent = metrics.fontBoundingBoxDescent;
    const baseline = pad + (rect.height - (ascent + descent)) / 2 + ascent;
    ctx.fillText(el.textContent ?? "", pad, baseline);

    const pixels = ctx.getImageData(0, 0, width, height).data;
    const gradient = el.hasAttribute("data-gradient");
    const left = rect.left + window.scrollX - pad;
    const top = rect.top + window.scrollY - pad;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const px = Math.floor(x);
        const py = Math.floor(y);
        if (pixels[(py * width + px) * 4 + 3] < 128) continue;
        points.push(left + px, top + py);
        colors.push(...(gradient ? gradientAt((px - pad) / rect.width) : PAPER));
      }
    }
  }
  return { points, colors };
}
