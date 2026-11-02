# Zerror Studios — website

Next.js 16 (App Router, JSX) · React Three Fiber 9 · drei 10 · Three.js · GLSL · GSAP 3.14 (ScrollTrigger, SplitText) · Lenis.

```bash
npm run dev     # http://localhost:3000
npm run build
```

## How it fits together

- **One persistent WebGL canvas** (`src/components/gl/Scene.jsx`) sits behind every page. The voxel scene is a full-screen drei `View`; case-study images register their own `View`s (`GLImage.jsx`) and render into the same context.
- **Voxels** (`gl/Voxels.jsx`, `gl/formations.js`): ~1,700 cubes driven by a CPU spring simulation. They morph between formations built on the brand's construction grid: the wordmark, design-vs-development clusters, a unified sphere, a pixel floor, a browser, a software stack, a shopping bag, the Z submark and the brand pixel elements.
- **Sections describe themselves with data attributes**, applied as they cross the middle of the viewport (`layout/SiteShell.jsx`):
  - `data-theme="blue | ink | light"`: the colour scheme (CSS variables and WebGL uniforms)
  - `data-formation="logo | split | unified | field | web | software | commerce | brand | pixels | none"`
  - `data-fx / data-fy / data-fs`: where the formation sits (viewport fractions from the centre, plus scale), with `data-mfx / mfy / mfs` for portrait screens
  - `data-label / data-index`: the HUD section label
- **Shaders** live in `src/components/gl/shaders/*.glsl` (imported as strings through `raw-loader`; see `next.config.mjs`).
- **Pixel transition / preloader** (`layout/Transition.jsx`): internal links use `components/ui/TLink.jsx` so navigation runs through it.
- **Copy** is all in `src/lib/content.js`, sourced from the 2026 business deck, the Phase 01 brand guidelines and zerrorstudios.com.

## Brand

Colours and type scale follow the Phase 01 guidelines (`src/styles/base.css`). Alt Riviera and Roc Grotesk aren't bundled because they need a licence. The font stacks use them when they're installed or loaded (for example through an Adobe Fonts kit for Roc Grotesk); otherwise they fall back to Inter Tight and Hanken Grotesk.

Client logos in `public/images/clients` are white alpha masks taken from the deck, so CSS can tint them for any theme.
