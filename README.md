# Forest

Forest is a measured React-to-Svelte migration of a small, image-heavy SPA. The same interactive seasonal scene was implemented in both frameworks, then compared using production bundle output, build timings, dependency counts, and Lighthouse.

The migration reduced the JavaScript bundle from **200,911 B to 52,025 B (-74%)** and improved Lighthouse Performance from **75 to 92** in the recorded local run. It did not make every metric better: the full quality-gated build became 0.529 s slower, CSS grew by 199 B, and the unchanged 5.9 MB image payload still dominates the app.

## Live Demo

GitHub Pages: https://johnimril.github.io/forest/

If the link is not available yet, enable Pages in the repository settings and set the source to **GitHub Actions**.

## Screenshot

![Forest app screenshot](docs/screenshot.png)

## Measured Result

Metrics were collected on 2026-07-08 from production builds served through the same local Vite preview setup.

| Metric                   | React Baseline | Svelte Port |    Change |
| ------------------------ | -------------: | ----------: | --------: |
| JavaScript bundle        |      200,911 B |    52,025 B |      -74% |
| JavaScript gzip          |       63.70 kB |    19.45 kB | -44.25 kB |
| Lighthouse Performance   |             75 |          92 |       +17 |
| Largest Contentful Paint |          8.9 s |       3.4 s |    -5.5 s |
| Vite build phase         |         387 ms |      141 ms |   -246 ms |
| Full build command       |        1.967 s |     2.496 s |  +0.529 s |
| Installed packages       |            226 |         172 |       -54 |
| Static image assets      |    5,917,848 B | 5,917,848 B |       0 B |

These results describe this app and this measurement environment, not a universal framework benchmark. Lighthouse is run-sensitive, and Forest's payload is dominated by seasonal imagery rather than framework code.

Detailed reports:

- [React baseline metrics](docs/metrics/react-baseline.md)
- [Svelte port metrics](docs/metrics/svelte-port.md)
- [React-to-Svelte comparison](docs/metrics/comparison.md)

## What Was Migrated

The React baseline remains on `main`; the equivalent Svelte implementation is on `svelte-port`. Both versions provide:

- Full-screen seasonal forest scene.
- Four seasons: spring, summer, autumn, and winter.
- Responsive image loading with AVIF/WebP previews and PNG high-resolution fallbacks.
- Idle high-resolution image loading that respects data saver and very slow connections.
- CSS particle animations tailored to each season.
- Animated hollow eyes positioned against the cover-scaled background.
- GitHub Pages-ready Vite base path.

## Implementations

- **React baseline (`main`):** React 19, TypeScript 6, Vite 8.
- **Svelte port (`svelte-port`):** Svelte, TypeScript, Vite.
- **Shared tooling:** Vitest, ESLint, Lighthouse, GitHub Pages.

## Migration Notes

The port preserves the UI and asset set so the comparison focuses on framework and implementation overhead. React's `useSeasonScene` orchestration became a Svelte store, while eye positioning moved closer to the bound scene element in `App.svelte`.

For this declarative, mostly local-state interface, Svelte removed much of the client runtime cost. The trade-off was additional Svelte compiler/type-checking work in the full build and framework-specific store initialization behavior.

## Project Structure

```text
src/
  App.tsx                         Page composition
  App.css                         Scene-level layout styles
  components/
    HollowEyes/                   Eye overlay component and styles
    ParticlesLayer/               Particle renderer and seasonal CSS
    SceneLoader/                  Loading state component
    SeasonBackgrounds/            Responsive background image layers
    SeasonSwitcher/               Season selection controls
  domain/
    seasons.ts                    Season config, image paths, shared types
  hooks/
    useEyePosition.ts             Cover-image aligned eye positioning
    useSeasonScene.ts             Scene state and image loading flow
  lib/
    imageLoading.ts               Image/network loading helpers
    particles.ts                  Particle generation
public/                           Static season assets copied by Vite
docs/screenshot.png               README screenshot
.github/workflows/deploy.yml      GitHub Pages deployment workflow
```

## Requirements

- Node.js 24+
- npm

## Commands

Install dependencies:

```sh
npm ci
```

Start the local dev server:

```sh
npm run dev
```

Create a production build:

```sh
npm run build
```

Run ESLint:

```sh
npm run lint
```

Run unit tests:

```sh
npm run test
```

Preview the production build locally:

```sh
npm run preview
```

## Assets

Season images live in `public/` and are copied to `dist/` by Vite during build. The app builds asset URLs with `import.meta.env.BASE_URL`, so the same code works both locally and under the `/forest/` GitHub Pages path.

## Deployment

Deployment is handled by `.github/workflows/deploy.yml`.

The workflow:

- runs on pushes to `main` or `master`;
- can be started manually from the GitHub Actions tab;
- installs dependencies with `npm ci`;
- runs `npm run lint`;
- runs `npm run test`;
- builds the app with `npm run build`;
- uploads `dist/` to GitHub Pages.

In the repository settings, set Pages source to **GitHub Actions**. For the `JohnImril/forest` repository, CI builds Vite with `base: "/forest/"`, while local builds keep `base: "/"`.

## Possible Improvements / Roadmap

- Add visual regression checks for the seasonal scenes.
- Add lightweight hook tests for `useSeasonScene` if the loading flow grows.
- Add accessibility smoke checks for keyboard navigation and reduced-motion preferences.
- Consider CSS Modules if the component set grows and global class names become harder to manage.
- Add a small CI badge after the GitHub Actions workflow is enabled in the public repository.
