"use client";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { nav, profile } from "@/content/site";
import { useClock } from "@/lib/hooks";
import { useScrollTo } from "@/lib/scroll";
import { easeOutExpo } from "@/components/ui/motion";

export function Header() {
  const scrollTo = useScrollTo();
  const time = useClock(profile.timeZone);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // Hide while scrolling down, reveal on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > previous && y > 240);
  });

  const go = (id: string) => {
    setOpen(false);
    scrollTo(id);
  };

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-brand"
        aria-hidden
      />
      <motion.header
        className="fixed inset-x-0 top-0 z-50 mix-blend-difference"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden && !open ? "-100%" : 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: easeOutExpo }}
      >
        <div className="container-page flex h-16 items-center justify-between md:h-20">
          <button onClick={() => go("top")} className="text-[15px] font-medium tracking-tight">
            {profile.name}
          </button>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className="group relative text-[14px] text-paper/80 transition-colors hover:text-paper"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-paper transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
              </button>
            ))}
            <span className="label tabular-nums" suppressHydrationWarning>
              LHR {time}
            </span>
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="text-[14px] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-5 pb-16 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          >
            {nav.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => go(item.id)}
                className="border-b border-line py-4 text-left text-5xl font-medium tracking-tight"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.8, ease: easeOutExpo }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
