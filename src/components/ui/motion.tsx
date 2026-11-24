"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts content in once it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: easeOutExpo, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Words slide up from behind a mask, one after another. */
export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = "span",
  immediate = false,
  wordClassName = "",
}: {
  text: string;
  className?: string;
  /** Applied to each animated word — use for effects like `text-gradient`. */
  wordClassName?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  immediate?: boolean;
}) {
  const words = text.split(" ");
  const trigger = immediate
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, amount: 0.6 } };
  const MotionTag = motion[Tag];
  return (
    <MotionTag className={className} initial="hide" {...trigger} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={{
              hide: { y: "110%" },
              show: { y: "0%", transition: { duration: 1.1, ease: easeOutExpo, delay: delay + i * 0.06 } },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Paragraph whose words brighten as it scrolls through the viewport. */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

export function SectionLabel({ index, children, color }: { index: string; children: ReactNode; color: string }) {
  return (
    <Reveal className="flex items-center gap-3 label">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
      <span className="text-faint">{index}</span>
      <span>{children}</span>
    </Reveal>
  );
}

/** Counts up to the number in `value` (keeping a suffix such as "+") once scrolled into view. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const target = Number.parseInt(value, 10);
  const suffix = value.replace(/^\d+/, "");
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, { duration: 1.6, ease: easeOutExpo });
    return () => controls.stop();
  }, [inView, count, target]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
