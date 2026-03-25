# Muhammad Iqbal, PMP® — Portfolio

> **Live site → [owai63.github.io/M.I-portfolio-](https://owai63.github.io/M.I-portfolio-)**

A fully custom portfolio website for **Muhammad Iqbal, PMP®** — Program & Delivery Executive based in Riyadh, Saudi Arabia. 30+ years across telecom infrastructure, PMO governance, and digital transformation in the KSA & GCC region.

---

## ✦ Preview

| Hero | Career Timeline | Projects |
|------|----------------|----------|
| Holographic monogram card, typewriter roles, KPI highlights | Vertical timeline with dot-type indicators | Accordion with 16 signature programs |

**Theme:** Saudi Futurism 2030 — Midnight Teal + Electric Cyan  
**Stack:** Vanilla HTML · CSS · JavaScript — zero framework dependencies

---

## ✦ Features

- **Animated loader** — SVG monogram draw with progress bar
- **Custom cursor** — dot + glow, mix-blend-mode difference
- **Particle canvas** — 100-node interactive graph, mouse-attracted
- **Typewriter** — scramble-character morphing between role phrases
- **Holographic card** — 3D parallax monogram with scan-line effect
- **Stat rings** — SVG stroke-dashoffset counters, triggered on scroll
- **Flip cards** — CSS 3D, touch-supported (Achievements section)
- **Accordion** — smooth grid-template-rows animation (Projects section)
- **Scroll reveals** — staggered `data-reveal` IntersectionObserver
- **Timeline spine** — animated draw as you scroll into the section
- **Skill bars** — width-transition bars triggered on viewport entry
- **Section dots** — fixed right-rail navigation with tooltip labels
- **Marquee** — seamless infinite scroll, pauses on hover
- **Mobile drawer** — slide-in nav with stagger animations
- **Particle burst** — on every CTA click
- **Confetti** — on award card hover
- **Back-to-top** — SVG ring fill tracking scroll progress

---

## ✦ File Structure

```
├── index.html          # Generated HTML (do not edit manually)
├── style.css           # All styles — single consolidated stylesheet
├── app.js              # All JS — interactions, animations, observers
└── content.json        # Content data (source of truth)
```

> **`index.html`** is generated from `content.json`. Manual edits to `index.html` will be overwritten on the next update.

---

## ✦ How GitHub Pages Works

This site is served via **GitHub Pages** from the `main` branch root. Every time you publish from the editor:

1. `index.html` is regenerated from `content.json`
2. `app.js` is patched (PHRASES conflict fix applied automatically)
3. `content.json` is updated as the data source
4. GitHub Pages rebuilds within ~60 seconds

### Enable GitHub Pages

`Repository Settings → Pages → Source: Deploy from branch → Branch: main → / (root)`

---

## ✦ Technical Notes

### Browser Support
Chrome 90+ · Firefox 88+ · Safari 14+ · Edge 90+  
Mobile-responsive down to 320px. Touch-device detections disables custom cursor and 3D tilt effects.

---

## ✦ Content Source of Truth

All content lives in `content.json`. The HTML is always generated from it — never edit `index.html` directly. If you need to make a one-time fix, update `content.json` and republish via the editor.

---

## ✦ Fonts

Loaded from Google Fonts and Fontshare — no local font files required:

- **Cabinet Grotesk** — headings (Fontshare)
- **Space Grotesk** — body text (Google Fonts)
- **DM Mono** — labels, tags, metadata (Google Fonts)
- **Syne** — fallback heading (Google Fonts)

---

## ✦ Contact

**Muhammad Iqbal, PMP®**  
PMO & Operations Manager · Riyadh, Saudi Arabia  
✉ ikbalmalic@gmail.com  
📱 +966 533 747 222  
🔗 [linkedin.com/in/icmalik](https://linkedin.com/in/icmalik)

---

*Portfolio built and maintained by Owais. Editor and site architecture custom-built — no templates.*
