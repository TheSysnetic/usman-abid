# Usman Abid — Portfolio

Personal portfolio built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**,
**Motion** and **React Three Fiber**.

Two fixed WebGL layers sit behind the page:

- **Aurora** — a soft, half-resolution colour wash whose palette follows the section in view.
- **Particle typography** — ~15k particles assemble into the name on load, scatter from the cursor,
  burst into a faint starfield as you scroll, and regroup as "Let's talk" at the contact section.
  They sample the real HTML headings (`[data-particles]`), which stay in the page for screen readers
  and become visible when WebGL is unavailable or reduced motion is requested.

Scroll-driven sections (Motion): sticky experience progress, sideways-scrolling capability words,
and a pinned horizontal "coverflow" project gallery.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | What it does                      |
| ------------------- | --------------------------------- |
| `npm run dev`       | Start the dev server (Turbopack)  |
| `npm run build`     | Production build                  |
| `npm start`         | Serve the production build        |
| `npm run lint`      | ESLint (Next.js core web vitals)  |
| `npm run typecheck` | TypeScript, no emit               |
| `npm run format`    | Prettier + Tailwind class sorting |

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://usmanabid.dev`) in production so Open Graph images resolve.

## Editing content

All copy (profile, experience, projects, capabilities, education) lives in
[`src/content/site.ts`](src/content/site.ts). Project logos are in `public/assets/projects/`.

## Structure

```
src/
  app/                 layout, page, global styles (Tailwind v4 theme tokens)
  content/site.ts      every piece of text on the site
  components/
    layout/            header, footer, smooth scrolling (Lenis)
    sections/          Hero, About, Experience, Capabilities, Work, Contact
    three/             backdrop canvases, aurora + particle shaders, text sampler
    ui/motion.tsx      reveal / text animation primitives
  lib/                 small hooks (media queries, clock, in-viewport, scroll-to)
scripts/enhance-portrait.py   reproducible portrait retouch (Pillow)
```
