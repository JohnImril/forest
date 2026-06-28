# Forest

Interactive seasonal forest scene built with React, TypeScript, and Vite.

## Preview

![Forest app screenshot](docs/screenshot.png)

## Requirements

- Node.js 24+
- npm

## Development

Install dependencies:

```sh
npm ci
```

Run the local dev server:

```sh
npm run dev
```

Create a production build:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

Run ESLint:

```sh
npm run lint
```

## Assets

Season images live in `public/` and are copied to `dist/` by Vite during build.
The app uses `import.meta.env.BASE_URL` for these public assets so the same code
works locally and on GitHub Pages.

## GitHub Pages Deployment

Deployment is handled by `.github/workflows/deploy.yml`.

The workflow:

- runs on pushes to `main` or `master`
- can be started manually from the GitHub Actions tab
- installs dependencies with `npm ci`
- builds the app with `npm run build`
- uploads `dist/` to GitHub Pages

In the repository settings, set Pages source to **GitHub Actions**. For the
`JohnImril/forest` repository, CI builds Vite with `base: '/forest/'`, while
local builds keep `base: '/'`.
