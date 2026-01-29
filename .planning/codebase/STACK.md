# Stack

**Analysis Date:** 2026-01-29

## Languages

**Primary:** TypeScript
- Version: 5.9.3
- Target: ESNext
- Module System: ES Modules
- Strict Mode: Disabled

**Styling:** CSS
- Tailwind CSS v4.0.0 with Vite plugin
- Custom CSS variables for game configuration
- CSS-in-JS approach via Vite

## Runtime

**Target:** Web Browser
- Platform: Any modern browser with ESNext support
- DOM-based rendering (no canvas)
- requestAnimationFrame for game loop

## Frameworks & Libraries

**Build Tool:**
- Vite 6.4.1 - Modern build tool with HMR
- TypeScript compilation integrated

**Styling:**
- Tailwind CSS v4.0.0 - Utility-first CSS framework
- @tailwindcss/vite v4.1.18 - Vite plugin for Tailwind
- PostCSS v8.5.6 - CSS transformation
- Autoprefixer v10.4.23 - Vendor prefixing

**Utilities:**
- clsx v2.1.1 - Conditional class names (imported but not actively used)
- tailwind-merge v2.6.0 - Merge Tailwind classes (imported but not actively used)

**Type Definitions:**
- @types/node v25.0.10 - Node.js type definitions

## Configuration

**TypeScript Config** (`tsconfig.json`):
- Target: ESNext
- Module: ESNext
- Libs: ESNext, DOM
- Strict: false
- Source maps: enabled
- No unused locals/parameters checks: disabled

**Vite Config** (`vite.config.ts`):
- Base path: `/08-car-racing-game/` (GitHub Pages)
- Fallback to `./` for Vercel/Netlify deployments
- Tailwind CSS plugin active

## Package Manager

**npm** - Inferred from presence of package-lock.json

## Development Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript compile + Vite production build |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | Type check without emitting files |
| `npm run lint` | Run ESLint (no config file present) |

## Build Output

- **Directory:** `dist/`
- **Format:** Optimized static assets
- **Ready for:** GitHub Pages, Vercel, Netlify

---

*Stack analysis: 2026-01-29*
