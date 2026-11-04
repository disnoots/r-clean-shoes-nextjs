# R Clean Shoes — Next.js Setup Guide

## What this project uses
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- No database, no backend needed — it's a pure landing page

## Run locally (first time)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open http://localhost:3000 in your browser.

## Add your own assets (in the `public/` folder)
| File | What it is |
| --- | --- |
| `logo.png` | Your logo (shown in the header, auto-hidden if missing) |
| `og-image.jpg` | Preview image shared on WhatsApp/social media |
| `before-1.jpg` + `after-1.jpg` | Before/after slider pair 1 (auto-hidden if missing) |
| `before-2.jpg` + `after-2.jpg` | Before/after slider pair 2 (auto-hidden if missing) |

**Photo tips:** use the same angle and distance for both shots (tripod or same spot works best), good lighting, and landscape orientation (4:3-ish). The slider looks most convincing when the shoe is in the same position in both photos. To add a third pair, duplicate an entry in `COMPARISONS` inside `src/components/site/gallery.tsx`.

## Where things live
```
src/
  app/
    layout.tsx          → SEO metadata, JSON-LD, Plus Jakarta Sans font
    page.tsx            → assembles all sections + shared state (svc, promo code, toast)
    globals.css         → brand colors (navy, gold, wa green...) as Tailwind theme
    icon.svg            → favicon (👟)
  components/site/
    site-header.tsx     → sticky navy header + nav + WhatsApp button
    hero.tsx            → big headline + CTA + facts
    bits.tsx            → ticker + reusable section heading
    pricing.tsx         → price list + monthly plans (buttons set the form's service)
    promo.tsx           → NEWCLEAN10 code box + copy button
    steps.tsx           → "Cara kerja" 4 steps
    gallery.tsx         → before/after comparison sliders (auto-hide when files missing)
    testimonials.tsx    → customer quotes
    order-form.tsx      → price calculator, promo validation, WhatsApp submission
    faq.tsx             → accordion (native <details>)
    site-footer.tsx     → footer with address/hours/contact
```

## Build for production
```bash
npm run build
npm run start
```

## Deploy (free options)
- **Vercel**: push to GitHub → vercel.com → Import → Deploy
- **Netlify** (same host as your current site): push to GitHub → netlify.com → Add new site → connect repo (build command `npm run build`, publish `.next` with the Next.js runtime plugin)
