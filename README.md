# Forest

Forest is a small portfolio SPA with an interactive full-screen forest scene. It lets the user switch between spring, summer, autumn, and winter while keeping the scene lightweight through responsive image formats and CSS-driven particle animations.

## Live Demo

GitHub Pages: https://johnimril.github.io/forest/

If the link is not available yet, enable Pages in the repository settings and set the source to **GitHub Actions**.

## Screenshot

![Forest app screenshot](docs/screenshot.png)

## Features

- Full-screen seasonal forest scene.
- Four seasons: spring, summer, autumn, and winter.
- Responsive image loading with AVIF/WebP previews and PNG high-resolution fallbacks.
- Idle high-resolution image loading that respects data saver and very slow connections.
- CSS particle animations tailored to each season.
- Animated hollow eyes positioned against the cover-scaled background.
- GitHub Pages-ready Vite base path.

## Stack

- React 19
- TypeScript 6
- Vite 8
- Vitest
- ESLint
- GitHub Pages

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
