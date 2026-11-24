"use client";
import { motion } from "motion/react";
import { profile } from "@/content/site";
import { useReducedMotion } from "@/lib/hooks";
import { useScrollTo } from "@/lib/scroll";
import { palette } from "@/lib/palette";
import { easeOutExpo } from "@/components/ui/motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: easeOutExpo, delay },
});

export function Hero() {
  const reduced = useReducedMotion();
  const scrollTo = useScrollTo();
  const [first, last] = profile.name.split(" ");

  return (
    <section
      id="top"
      data-mood
      className="relative flex h-[100svh] min-h-[640px] flex-col justify-between overflow-hidden pt-24 pb-10 md:pt-28 md:pb-12"
    >
      <div className="container-page flex justify-between">
        <motion.span {...fadeUp(0.5)} className="flex items-center gap-3 label">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-mint opacity-60" />
            <span className="relative h-2 w-2 rounded-full bg-mint" />
          </span>
          {profile.role}
        </motion.span>
        <motion.span {...fadeUp(0.6)} className="hidden label sm:block">
          {profile.location}
        </motion.span>
      </div>

      {/*
        The name is drawn by the particle layer (see three/ParticleType). These spans
        define its exact position and font, and remain visible when WebGL is off.
        No transforms here: the particles sample these boxes.
      */}
      <motion.h1
        className="container-page text-[16.5vw] leading-[0.82] font-semibold tracking-[-0.06em] whitespace-nowrap 2xl:text-[15rem]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.1 }}
      >
        <span data-particles="hero" className="inline-block">
          {first}
        </span>{" "}
        <span data-particles="hero" data-gradient className="inline-block text-gradient">
          {last}
        </span>
      </motion.h1>

      <div className="container-page grid gap-8 md:grid-cols-12 md:items-end">
        <motion.p {...fadeUp(0.8)} className="max-w-md text-lg leading-snug text-paper/90 md:col-span-5 md:text-xl">
          I turn complex ideas into <span className="text-gradient">production‑ready, scalable systems</span> —
          architecture, full‑stack and AI.
        </motion.p>

        <motion.div {...fadeUp(0.9)} className="md:col-span-3 md:col-start-7">
          <div className="label">Currently</div>
          <div className="mt-2 flex flex-wrap gap-2 text-[14px]">
            {[
              ["KnowledgeCity", palette.coral],
              ["InvoZone", palette.sky],
            ].map(([name, color]) => (
              <span
                key={name}
                className="rounded-full border border-line px-3 py-1"
                style={{ boxShadow: `inset 0 0 0 1px ${color}33` }}
              >
                <span
                  className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
                  style={{ background: color }}
                />
                {name}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.button
          {...fadeUp(1)}
          onClick={() => scrollTo("about")}
          className="hidden items-center justify-end gap-3 label md:col-span-2 md:col-start-11 md:flex"
        >
          Scroll
          <span className="relative block h-8 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-gradient-brand"
              animate={reduced ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.button>
      </div>
    </section>
  );
}
