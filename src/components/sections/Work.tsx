"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLenis } from "lenis/react";
import { projects, type Project } from "@/content/site";
import { useMediaQuery, useReducedMotion } from "@/lib/hooks";
import { useScrollTo } from "@/lib/scroll";
import { palette } from "@/lib/palette";
import { Reveal, SectionLabel, TextReveal, easeOutExpo } from "@/components/ui/motion";

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoPlate({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <div className={`relative grid place-items-center overflow-hidden bg-white ${className}`}>
      <div className="relative h-[42%] w-[60%] transition-transform duration-700 ease-out-expo group-hover:scale-105">
        <Image src={project.logo} alt={`${project.name} logo`} fill sizes="360px" className="object-contain" />
      </div>
    </div>
  );
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const { accent } = project;
  return (
    <button
      onClick={onOpen}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 p-6 text-left backdrop-blur-xl transition-colors duration-500 hover:border-white/25 md:p-7"
      style={{
        background: `radial-gradient(120% 80% at 100% 0%, ${accent}59 0%, transparent 55%), radial-gradient(90% 60% at 0% 100%, ${accent}26 0%, transparent 60%), rgb(18 18 22 / 0.72)`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[13px] text-paper/60 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <span
          className="rounded-full px-3 py-1 font-mono text-[11px] tracking-wide uppercase"
          style={{ color: accent, background: `${accent}1f` }}
        >
          {project.category}
        </span>
      </div>

      <LogoPlate project={project} className="mt-6 aspect-[16/9] rounded-2xl" />

      <div className="mt-auto pt-8">
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">{project.name}</h3>
          <span
            className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:text-ink"
            style={{ "--accent": accent } as CSSProperties}
          >
            <span className="absolute h-11 w-11 scale-0 rounded-full bg-(--accent) transition-transform duration-500 group-hover:scale-100" />
            <Arrow className="relative h-5 w-5" />
          </span>
        </div>
        <p className="mt-1 label">{project.role}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-paper/70">{project.summary}</p>
      </div>
    </button>
  );
}

function ProjectDrawer({ project, onClose }: { project: Project; onClose: () => void }) {
  const lenis = useLenis();
  useEffect(() => {
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        data-lenis-prevent
        className="absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col overflow-y-auto bg-ink-2"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.8, ease: easeOutExpo }}
      >
        <div className="h-1 w-full shrink-0" style={{ background: project.accent }} />
        <div className="flex items-center justify-between px-6 py-5 md:px-10">
          <span className="label" style={{ color: project.accent }}>
            {project.category}
          </span>
          <button onClick={onClose} className="label transition-colors hover:text-paper" autoFocus>
            Close ✕
          </button>
        </div>
        <LogoPlate project={project} className="mx-6 aspect-[16/10] rounded-2xl md:mx-10" />
        <div className="flex flex-1 flex-col px-6 pt-10 pb-10 md:px-10">
          <h3 className="text-4xl font-medium tracking-[-0.03em] md:text-5xl">{project.name}</h3>
          <p className="mt-3 label">{project.role}</p>
          <p className="mt-8 text-[16px] leading-relaxed text-paper/80">{project.description}</p>
          <div className="mt-10 border-t border-line pt-6">
            <div className="label">Built with</div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[12px] text-paper/80">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-auto flex items-center justify-between border-t border-line pt-6 text-xl font-medium"
          >
            Visit {new URL(project.url).hostname.replace("www.", "")}
            <Arrow className="h-6 w-6 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>
      </motion.aside>
    </motion.div>
  );
}

function Heading() {
  return (
    <div className="container-page">
      <SectionLabel index="04" color={palette.sky}>
        Selected work
      </SectionLabel>
      <div className="mt-6 flex items-end justify-between gap-6">
        <TextReveal
          as="h2"
          text="Products I’ve helped ship."
          className="max-w-4xl text-5xl leading-[0.95] font-medium tracking-[-0.035em] md:text-7xl"
        />
        <span className="hidden label md:block">({String(projects.length).padStart(2, "0")})</span>
      </div>
    </div>
  );
}

function EndCard() {
  const scrollTo = useScrollTo();
  return (
    <button
      onClick={() => scrollTo("contact")}
      className="group flex h-full w-full flex-col justify-between rounded-3xl border border-dashed border-white/15 p-7 text-left transition-colors hover:border-white/40"
    >
      <span className="label">What’s next</span>
      <span className="text-4xl font-medium tracking-[-0.03em]">
        Your product
        <br />
        <span className="text-gradient">could be here.</span>
      </span>
      <span className="flex items-center gap-2 label group-hover:text-paper">
        Let’s talk <Arrow className="h-4 w-4" />
      </span>
    </button>
  );
}

const CARD_WIDTH = 400;
const CARD_GAP = 24;

/** A gallery slot that turns slightly away from the viewer as it nears either edge. */
function CoverflowSlot({ x, index, children }: { x: MotionValue<number>; index: number; children: ReactNode }) {
  const offset = useTransform(() => {
    const vw = window.innerWidth;
    const padding = vw >= 1536 ? (vw - 1400) / 2 + 48 : 48; // matches the track's px-12 / 2xl padding
    const center = padding + index * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2 + x.get();
    return Math.max(-1, Math.min(1, (center - vw / 2) / (vw / 2)));
  });
  const rotateY = useTransform(offset, (t) => t * -18);
  const scale = useTransform(offset, (t) => 1 - Math.abs(t) * 0.07);
  const opacity = useTransform(offset, (t) => 1 - Math.max(0, Math.abs(t) - 0.6) * 0.9);
  return (
    <motion.div
      style={{ rotateY, scale, opacity, transformPerspective: 1200, width: CARD_WIDTH }}
      className="h-[min(58vh,560px)] shrink-0"
    >
      {children}
    </motion.div>
  );
}

/** Desktop: the section pins and vertical scroll drives the cards sideways. */
function HorizontalGallery({ onOpen }: { onOpen: (p: Project) => void }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const travel = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * travel.get());
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const next = Math.max(0, el.scrollWidth - window.innerWidth);
      travel.set(next);
      setDistance(next);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [travel]);

  return (
    <section id="work" data-mood ref={section} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16">
        <Heading />
        <motion.div
          ref={track}
          style={{ x }}
          className="mt-12 flex w-max gap-6 px-12 2xl:px-[calc((100vw_-_1400px)/2_+_3rem)]"
        >
          {projects.map((project, i) => (
            <CoverflowSlot key={project.slug} x={x} index={i}>
              <ProjectCard project={project} index={i} onOpen={() => onOpen(project)} />
            </CoverflowSlot>
          ))}
          <CoverflowSlot x={x} index={projects.length}>
            <EndCard />
          </CoverflowSlot>
        </motion.div>
        <div className="container-page mt-10">
          <div className="relative h-px bg-line">
            <motion.div style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-gradient-brand" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Mobile / reduced motion: a simple vertical stack. */
function StackedGallery({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <section id="work" data-mood className="py-28">
      <Heading />
      <div className="container-page mt-14 grid gap-5 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.08} className="min-h-[440px]">
            <ProjectCard project={project} index={i} onOpen={() => onOpen(project)} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Work() {
  const [selected, setSelected] = useState<Project | null>(null);
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();
  const Gallery = wide && !reduced ? HorizontalGallery : StackedGallery;

  return (
    <>
      <Gallery onOpen={setSelected} />
      <AnimatePresence>
        {selected && <ProjectDrawer project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
