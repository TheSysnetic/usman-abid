"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { capabilities } from "@/content/site";
import { palette, rotation } from "@/lib/palette";
import { Reveal, SectionLabel, TextReveal } from "@/components/ui/motion";

const ROW_ONE = ["Architecture", "AI pipelines", "MLOps", "APIs", "Security"];
const ROW_TWO = ["Node.js", "React", "Next.js", "PostgreSQL", "AWS", "TypeScript"];

/** A line of oversized words that slides sideways as the section scrolls past. */
function ScrollRow({ words, from, to, outline }: { words: string[]; from: string; to: string; outline?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <div ref={ref} className="overflow-hidden whitespace-nowrap" aria-hidden>
      <motion.div style={{ x }} className="flex w-max items-center gap-[4vw]">
        {[...words, ...words].map((word, i) => (
          <span key={i} className="flex items-center gap-[4vw]">
            <span
              className={`text-[13vw] leading-none font-semibold tracking-[-0.05em] md:text-[9vw] ${
                outline ? "text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.25)]" : "text-gradient"
              }`}
            >
              {word}
            </span>
            <span className="h-[1.6vw] w-[1.6vw] rounded-full" style={{ background: rotation[i % rotation.length] }} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Capabilities() {
  return (
    <section id="capabilities" data-mood className="py-28 md:py-44">
      <div className="container-page">
        <SectionLabel index="03" color={palette.sun}>
          Capabilities
        </SectionLabel>
        <TextReveal
          as="h2"
          text="End to end, from schema to screen."
          className="mt-6 max-w-4xl text-5xl leading-[0.95] font-medium tracking-[-0.035em] md:text-7xl"
        />
      </div>

      <div className="mt-16 space-y-2 md:mt-24">
        <ScrollRow words={ROW_ONE} from="0%" to="-35%" />
        <ScrollRow words={ROW_TWO} from="-35%" to="0%" outline />
      </div>

      <div className="container-page">
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-24 md:grid-cols-4">
          {capabilities.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.08} className="border-t border-line pt-6">
              <h3 className="flex items-center gap-2 label">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: rotation[i] }} />
                {group.title}
              </h3>
              <ul className="mt-5 space-y-2 text-lg text-paper/85 md:text-xl">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
