"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, MathUtils, Vector2, type ShaderMaterial } from "three";
import { auroraFragment, auroraVertex } from "./shaders";
import { palette } from "@/lib/palette";

/** Colours and brightness per section, in the order sections carry `data-mood`. */
const MOODS: { colors: [string, string, string]; intensity: number }[] = [
  { colors: [palette.violet, palette.pink, palette.sky], intensity: 0.16 }, // hero
  { colors: [palette.coral, palette.violet, palette.sun], intensity: 0.1 }, // about
  { colors: [palette.mint, palette.sky, palette.violet], intensity: 0.09 }, // experience
  { colors: [palette.sun, palette.coral, palette.pink], intensity: 0.1 }, // capabilities
  { colors: [palette.sky, palette.violet, palette.mint], intensity: 0.1 }, // work
  { colors: [palette.pink, palette.violet, palette.sun], intensity: 0.14 }, // contact
];

/** Fractional index of the section currently framing the viewport. */
function sectionProgress() {
  // Re-queried each frame: sections can be swapped (Work's mobile ↔ pinned layout).
  const sections = document.querySelectorAll<HTMLElement>("[data-mood]");
  const vh = window.innerHeight;
  let f = 0;
  for (let i = 1; i < sections.length; i++) {
    const p = MathUtils.clamp((vh * 0.6 - sections[i].getBoundingClientRect().top) / (vh * 0.6), 0, 1);
    f = Math.max(f, i - 1 + p);
  }
  return MathUtils.clamp(f, 0, MOODS.length - 1);
}

const target = new Color();

export default function Aurora({ reducedMotion }: { reducedMotion: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const palettes = useMemo(() => MOODS.map((m) => m.colors.map((c) => new Color(c))), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new Vector2(1, 1) },
      uPointer: { value: new Vector2() },
      uScroll: { value: 0 },
      uIntensity: { value: MOODS[0].intensity },
      uBase: { value: new Color("#0a0a0b") },
      uColorA: { value: new Color(MOODS[0].colors[0]) },
      uColorB: { value: new Color(MOODS[0].colors[1]) },
      uColorC: { value: new Color(MOODS[0].colors[2]) },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    const dt = Math.min(delta, 0.1);
    const f = sectionProgress();
    const i = Math.min(Math.floor(f), MOODS.length - 2);
    const k = MathUtils.smootherstep(f - i, 0, 1);
    const blend = 1 - Math.exp(-2.5 * dt);

    u.uTime.value += dt * (reducedMotion ? 0.2 : 1);
    (u.uResolution.value as Vector2).set(state.size.width, state.size.height);
    (u.uPointer.value as Vector2).lerp(state.pointer, blend);
    u.uScroll.value = MathUtils.damp(u.uScroll.value, f, 2, dt);
    u.uIntensity.value = MathUtils.damp(
      u.uIntensity.value,
      MathUtils.lerp(MOODS[i].intensity, MOODS[i + 1].intensity, k),
      2.5,
      dt,
    );
    (["uColorA", "uColorB", "uColorC"] as const).forEach((key, c) => {
      (u[key].value as Color).lerp(target.lerpColors(palettes[i][c], palettes[i + 1][c], k), blend);
    });
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={auroraVertex}
        fragmentShader={auroraFragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  );
}
