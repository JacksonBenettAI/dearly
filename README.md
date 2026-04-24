# Dearly

A static site + interactive app prototype for Dearly.

## Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag this folder into the drop zone (or connect a GitHub repo)
3. Settings:
   - **Framework preset:** Other
   - **Build command:** *(leave empty)*
   - **Output directory:** `./`
4. Deploy.

The site is pure static — no build step required.

## Local preview

Any static server works:

```
npx serve .
```

Then open the printed URL.

## Structure

- `index.html` — entry point
- `styles.css` — design tokens + all styles
- `landing.jsx` — landing page sections
- `app-screens.jsx` — prototype app screens (Today, People, History, Onboarding, Settings)
- `app.jsx` — router + Tweaks panel
- `tweaks-panel.jsx` — reusable tweak controls
- `public/hero-bg.mp4` — hero background video

## Tweaks

The Tweaks panel (gear icon toolbar) exposes hero overlay, grain, accent color, video source URL, and jump-to-screen buttons. These are design-time controls; remove the `<TweaksPanel>` block from `app.jsx` to strip them from production.
