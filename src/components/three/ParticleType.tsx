"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, MathUtils, Vector2, type ShaderMaterial } from "three";
import { particleFragment, particleVertex } from "./shaders";
import { sampleText } from "./sampleText";
import { palette } from "@/lib/palette";

const MAX_PARTICLES = 16000;
const pointerPx = new Vector2();
const DUST_COLORS = Object.values(palette).map((hex) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
});

/** Small deterministic PRNG so the starfield is identical between rebuilds. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGeometry(): { geometry: BufferGeometry; step: number } | null {
  const hero = Array.from(document.querySelectorAll<HTMLElement>('[data-particles="hero"]'));
  const contact = Array.from(document.querySelectorAll<HTMLElement>('[data-particles="contact"]'));
  if (hero.length === 0) return null;

  // Dot spacing scales with the type size (denser dots for small text), then
  // grows if needed to keep both words under the particle budget.
  const fontSize = Number.parseFloat(getComputedStyle(hero[0]).fontSize);
  let step = Math.min(3, Math.max(1.5, fontSize / 32));
  let a = sampleText(hero, step);
  let c = sampleText(contact, step);
  while (Math.max(a.points.length, c.points.length) / 2 > MAX_PARTICLES) {
    step += 0.5;
    a = sampleText(hero, step);
    c = sampleText(contact, step);
  }

  const countA = a.points.length / 2;
  const countC = c.points.length / 2;
  const count = Math.max(countA, countC);
  if (count === 0) return null;

  const rand = mulberry32(7);
  const textA = new Float32Array(count * 2);
  const textC = new Float32Array(count * 2);
  const dust = new Float32Array(count * 2);
  const colorA = new Float32Array(count * 3);
  const colorC = new Float32Array(count * 3);
  const colorDust = new Float32Array(count * 3);
  const random = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // The smaller formation reuses points so every particle has a home in both.
    const ia = i % countA;
    const ic = countC ? i % countC : ia;
    textA.set([a.points[ia * 2], a.points[ia * 2 + 1]], i * 2);
    textC.set(countC ? [c.points[ic * 2], c.points[ic * 2 + 1]] : [a.points[ia * 2], a.points[ia * 2 + 1]], i * 2);
    colorA.set(a.colors.slice(ia * 3, ia * 3 + 3), i * 3);
    colorC.set(countC ? c.colors.slice(ic * 3, ic * 3 + 3) : a.colors.slice(ia * 3, ia * 3 + 3), i * 3);
    dust.set([rand(), rand()], i * 2);
    colorDust.set(DUST_COLORS[Math.floor(rand() * DUST_COLORS.length)], i * 3);
    random[i] = rand();
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute("aTextA", new BufferAttribute(textA, 2));
  geometry.setAttribute("aTextC", new BufferAttribute(textC, 2));
  geometry.setAttribute("aDust", new BufferAttribute(dust, 2));
  geometry.setAttribute("aColorA", new BufferAttribute(colorA, 3));
  geometry.setAttribute("aColorC", new BufferAttribute(colorC, 3));
  geometry.setAttribute("aColorDust", new BufferAttribute(colorDust, 3));
  geometry.setAttribute("aRandom", new BufferAttribute(random, 1));
  return { geometry, step };
}

/**
 * Particles that assemble into the hero name, scatter into a faint starfield
 * as you scroll, and regroup as "Let's talk" at the contact section.
 * The real HTML text stays in the page (visually hidden) for accessibility.
 */
export default function ParticleType() {
  const material = useRef<ShaderMaterial>(null);
  const pointerMoved = useRef(false);
  const [built, setBuilt] = useState<{ geometry: BufferGeometry; step: number } | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("particles-on");
    let cancelled = false;
    let timer = 0;

    const rebuild = () => {
      if (cancelled) return;
      const next = buildGeometry();
      if (!next) return;
      setBuilt(next);
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(rebuild, 200);
    };

    document.fonts.ready.then(rebuild);
    // Layout shifts (images, resizes, the pinned gallery) move the contact heading.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    const onMove = () => (pointerMoved.current = true);
    window.addEventListener("pointermove", onMove, { once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      root.classList.remove("particles-on");
    };
  }, []);

  // Free the previous buffers whenever the layout is re-sampled.
  useEffect(() => () => built?.geometry.dispose(), [built]);

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new Vector2(1, 1) },
      uScroll: { value: 0 },
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uMorphA: { value: 0 },
      uMorphC: { value: 0 },
      uMouse: { value: new Vector2(-9999, -9999) },
      uMouseStrength: { value: 0 },
      uPixelRatio: { value: 1 },
      uSizeText: { value: 3 },
      uSizeDust: { value: 1.6 },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!material.current || !built) return;
    const u = material.current.uniforms;
    const dt = Math.min(delta, 0.1);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scroll = window.scrollY;

    (u.uResolution.value as Vector2).set(vw, vh);
    u.uScroll.value = scroll;
    u.uTime.value += dt;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    u.uSizeText.value = built.step * 1.1;

    // Intro assembles the name; scroll then scatters it and later forms "Let's talk".
    u.uIntro.value = MathUtils.damp(u.uIntro.value, 1, 1.4, dt);
    u.uMorphA.value = MathUtils.damp(u.uMorphA.value, MathUtils.clamp(scroll / (vh * 0.55), 0, 1), 6, dt);
    const heading = document.querySelector<HTMLElement>('[data-particles="contact"]');
    const top = heading ? heading.getBoundingClientRect().top : Infinity;
    u.uMorphC.value = MathUtils.damp(u.uMorphC.value, MathUtils.clamp((vh - top) / (vh * 0.6), 0, 1), 6, dt);

    const mouse = u.uMouse.value as Vector2;
    mouse.lerp(pointerPx.set(((state.pointer.x + 1) / 2) * vw, ((1 - state.pointer.y) / 2) * vh), 0.2);
    const active = pointerMoved.current && u.uIntro.value > 0.9 ? 1 : 0;
    u.uMouseStrength.value = MathUtils.damp(u.uMouseStrength.value, active, 4, dt);
  });

  if (!built) return null;
  return (
    <points geometry={built.geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
