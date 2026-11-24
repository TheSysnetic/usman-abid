"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { certifications, education, experience, profile, projects } from "@/content/site";
import { CountUp, Reveal, ScrollText, SectionLabel, easeOutExpo } from "@/components/ui/motion";
import { palette, rotation } from "@/lib/palette";

function yearsSince(date: string) {
  return Math.floor((Date.now() - new Date(date).getTime()) / (365.25 * 24 * 3600 * 1000));
}

function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  // The in-view trigger sits on an unclipped wrapper: IntersectionObserver
  // honours clip-path, so a fully clipped element would never "enter" view.
  return (
    <motion.div ref={ref} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.3 }}>
      <motion.div
        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-2"
        variants={{
          hidden: { clipPath: "inset(100% 0% 0% 0% round 16px)" },
          shown: { clipPath: "inset(0% 0% 0% 0% round 16px)" },
        }}
        transition={{ duration: 1.4, ease: easeOutExpo }}
      >
        <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[10%]">
          <Image
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            fill
            sizes="(min-width: 768px) 30vw, 90vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function About() {
  const stats = [
    { value: `${yearsSince(profile.careerStart)}+`, label: "Years in production" },
    { value: String(projects.length), label: "Products shipped" },
    { value: String(new Set(experience.map((r) => r.company)).size), label: "Companies" },
    { value: String(certifications.length), label: "Certifications" },
  ];

  return (
    <section id="about" data-mood className="container-page py-28 md:py-44">
      <div className="grid gap-y-14 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-4">
          <SectionLabel index="01" color={palette.coral}>
            About
          </SectionLabel>
          <div className="mt-8 max-w-sm">
            <Portrait />
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <ScrollText
            text={profile.intro}
            className="text-[1.85rem] leading-[1.15] font-medium tracking-[-0.02em] md:text-5xl md:leading-[1.08]"
          />

          <div className="mt-14 grid gap-6 text-[16px] leading-relaxed text-muted md:grid-cols-2 md:gap-10">
            {profile.about.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <dl className="mt-20 grid grid-cols-2 border-t border-line md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06} className="relative border-b border-line py-6 pr-4 md:border-b-0">
                <span className="absolute -top-px left-0 h-px w-10" style={{ background: rotation[i] }} />
                <dd className="text-4xl font-medium tracking-tight md:text-5xl" suppressHydrationWarning>
                  <CountUp value={s.value} />
                </dd>
                <dt className="mt-2 label">{s.label}</dt>
              </Reveal>
            ))}
          </dl>

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="label">Education</h3>
              <ul className="mt-4 space-y-4">
                {education.map((e) => (
                  <li key={e.school}>
                    <div className="text-[15px]">{e.school}</div>
                    <div className="text-sm text-muted">
                      {e.detail} · {e.period}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="label">Certifications</h3>
              <ul className="mt-4 space-y-4">
                {certifications.map((c) => (
                  <li key={c} className="text-[15px]">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
