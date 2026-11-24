"use client";
import { profile } from "@/content/site";
import { useClock } from "@/lib/hooks";
import { useScrollTo } from "@/lib/scroll";

export function Footer() {
  const scrollTo = useScrollTo();
  const time = useClock(profile.timeZone);
  return (
    <footer className="container-page">
      <div className="flex flex-col gap-4 border-t border-line py-8 label md:flex-row md:items-center md:justify-between">
        <span suppressHydrationWarning>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span suppressHydrationWarning>
          {profile.location} · {time}
        </span>
        <button onClick={() => scrollTo("top")} className="text-left transition-colors hover:text-paper md:text-right">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
