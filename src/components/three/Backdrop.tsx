"use client";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "motion/react";
import Aurora from "./Aurora";
import ParticleType from "./ParticleType";
import { useReducedMotion } from "@/lib/hooks";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Fixed full-page WebGL layers: a soft aurora whose colours follow the section
 * in view, and particle typography on top of it (skipped for reduced motion).
 */
export default function Backdrop() {
  // Only ever rendered on the client (loaded with ssr: false).
  const [supported] = useState(hasWebGL);
  const reduced = useReducedMotion();

  if (!supported) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_50%_at_90%_0%,rgb(124_92_255/0.18),transparent),radial-gradient(50%_40%_at_0%_100%,rgb(255_79_163/0.12),transparent)]"
      />
    );
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      {/* The glow is entirely soft, so rendering at half resolution is invisible and cheap. */}
      <Canvas
        dpr={0.5}
        gl={{ alpha: false, antialias: false, powerPreference: "low-power" }}
        eventSource={document.body}
        eventPrefix="client"
      >
        <Aurora reducedMotion={reduced} />
      </Canvas>
      {!reduced && (
        <div className="absolute inset-0">
          <Canvas
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
            eventSource={document.body}
            eventPrefix="client"
          >
            <ParticleType />
          </Canvas>
        </div>
      )}
    </motion.div>
  );
}
