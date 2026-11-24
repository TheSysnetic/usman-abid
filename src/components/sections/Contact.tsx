"use client";
import { useState } from "react";
import { profile, socials } from "@/content/site";
import { palette } from "@/lib/palette";
import { Reveal, SectionLabel } from "@/components/ui/motion";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  return (
    <section
      id="contact"
      data-mood
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-28"
    >
      <div className="container-page">
        <SectionLabel index="05" color={palette.pink}>
          Contact
        </SectionLabel>
      </div>

      {/* Drawn by the particle layer as it scrolls into view (see three/ParticleType). */}
      <h2 className="mt-10 text-center text-[19vw] leading-[0.82] font-semibold tracking-[-0.06em] md:text-[17vw]">
        <span data-particles="contact" className="inline-block">
          Let’s
        </span>{" "}
        <span data-particles="contact" data-gradient className="inline-block text-gradient">
          talk
        </span>
      </h2>

      <div className="container-page mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="text-xl leading-snug text-paper/85 md:text-2xl">
            Have a product to architect, a platform to scale or an AI feature to take to production? I’d love to hear
            about it.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
          <div className="label">Write to me</div>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={`mailto:${profile.email}`}
              className="group relative text-2xl font-medium tracking-tight break-all md:text-4xl"
            >
              {profile.email}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-gradient-brand transition-transform duration-700 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
            </a>
            <button
              onClick={copy}
              className="rounded-full border border-line px-3 py-1.5 label transition-colors hover:text-paper"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <ul className="mt-10 flex flex-wrap gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-gradient-brand p-px"
                >
                  <span className="rounded-full bg-ink px-5 py-2.5 text-[14px] transition-colors hover:bg-transparent hover:text-ink">
                    {s.label} ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
