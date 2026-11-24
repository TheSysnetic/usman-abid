"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { experience, type Role } from "@/content/site";
import { palette, rotation } from "@/lib/palette";
import { SectionLabel, TextReveal, easeOutExpo } from "@/components/ui/motion";

function RoleCard({ role, color }: { role: Role; color: string }) {
  return (
    <motion.li
      className="relative border-t border-line pt-8 pb-12"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: easeOutExpo }}
    >
      <motion.span
        className="absolute -top-px left-0 h-px w-full origin-left"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.6, ease: easeOutExpo, delay: 0.1 }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[13px] text-muted tabular-nums">{role.period}</span>
        {role.current && (
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-[11px] tracking-wide uppercase"
            style={{ color, background: `${color}1f` }}
          >
            Current
          </span>
        )}
      </div>
      <h3 className="mt-4 text-3xl font-medium tracking-[-0.025em] md:text-4xl">{role.title}</h3>
      <p className="mt-2 flex items-center gap-2 text-[15px]">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        <span className="text-paper/90">{role.company}</span>
        <span className="text-muted">· {role.location}</span>
      </p>
      <ul className="mt-7 grid gap-3 text-[15px] leading-relaxed text-muted md:grid-cols-2 md:gap-x-10">
        {role.highlights.map((h) => (
          <li key={h} className="flex gap-3">
            <span className="mt-[0.7em] h-px w-3 shrink-0" style={{ background: color }} />
            {h}
          </li>
        ))}
      </ul>
      <p className="mt-7 font-mono text-[13px] leading-relaxed text-paper/60">{role.stack.join(" · ")}</p>
    </motion.li>
  );
}

export function Experience() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 0.6", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(experience.length - 1, Math.max(0, Math.floor(v * experience.length))));
  });

  const current = experience[active];
  const color = rotation[active % rotation.length];

  return (
    <section id="experience" data-mood className="container-page py-28 md:py-44">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionLabel index="02" color={palette.mint}>
              Experience
            </SectionLabel>
            <TextReveal
              as="h2"
              text="A track record of shipping."
              className="mt-6 text-5xl leading-[0.95] font-medium tracking-[-0.035em] md:text-6xl"
            />

            {/* Scroll-linked progress through the roles */}
            <div className="mt-12 hidden items-stretch gap-6 lg:flex">
              <div className="relative w-px bg-line">
                <motion.div
                  style={{ scaleY: fill }}
                  className="absolute inset-0 origin-top bg-linear-to-b from-mint via-sky to-violet"
                />
              </div>
              <div className="py-1">
                <div className="label">Now viewing</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: easeOutExpo }}
                    className="mt-3"
                  >
                    <div className="text-2xl font-medium tracking-tight" style={{ color }}>
                      {current.company}
                    </div>
                    <div className="mt-1 text-[15px] text-muted">{current.title}</div>
                  </motion.div>
                </AnimatePresence>
                <div className="mt-8 font-mono text-[13px] text-muted tabular-nums">
                  {String(active + 1).padStart(2, "0")} / {String(experience.length).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ol ref={list} className="lg:col-span-7 lg:col-start-6">
          {experience.map((role, i) => (
            <RoleCard key={`${role.company}-${role.title}`} role={role} color={rotation[i % rotation.length]} />
          ))}
        </ol>
      </div>
    </section>
  );
}
