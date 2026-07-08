# Svelte Port Metrics

Collected on 2026-07-08 on branch `svelte-port`.

## Environment

- Node: `v24.12.0`
- npm: `11.18.0`

## Dependency Versions

From `package.json`:

- `svelte`: `^5.56.4`
- `@eslint/js`: `^10.0.1`
- `@sveltejs/vite-plugin-svelte`: `^7.2.0`
- `@tsconfig/svelte`: `^5.0.8`
- `@types/node`: `^26.0.1`
- `eslint`: `^10.6.0`
- `eslint-plugin-svelte`: `^3.20.0`
- `globals`: `^17.7.0`
- `prettier`: `^3.9.1`
- `svelte-check`: `^4.7.2`
- `typescript`: `^6.0.3`
- `typescript-eslint`: `^8.62.0`
- `vite`: `^8.1.0`
- `vitest`: `^4.1.9`

## Command Results

| Command           | Result | Notes                                                                                       |
| ----------------- | ------ | ------------------------------------------------------------------------------------------- |
| `npm ci`          | Pass   | Installed 172 packages, audited 173 packages, 0 vulnerabilities.                            |
| `npm run lint`    | Pass   | `eslint . && svelte-check --tsconfig ./tsconfig.app.json`; 0 Svelte diagnostics.            |
| `npm run test`    | Pass   | 3 test files passed, 10 tests passed. Vitest duration: 159 ms.                              |
| `npm run build`   | Pass   | `svelte-check`, `tsc -b tsconfig.node.json`, and `vite build` completed successfully.       |
| `npm run preview` | Usable | Verified with Vite preview at `http://127.0.0.1:4173/` and a headless Edge DOM smoke check. |

## Build Metrics

- Timed build command: `npm run build`
- Build time: 2.496 seconds
- Vite reported build time: 141 ms
- Final `dist/` size: 5,982,408 bytes
- JavaScript bundle size: 52,025 bytes
- CSS bundle size: 10,818 bytes
- Image/static asset size: 5,917,848 bytes

Generated files:

- `dist/index.html`: 1,717 bytes
- `dist/assets/index-CTQBx7O5.js`: 52,025 bytes, gzip 19.45 kB
- `dist/assets/index-9fh9f5AL.css`: 10,818 bytes, gzip 2.86 kB
- `dist/autumn.avif`: 117,558 bytes
- `dist/autumn.png`: 1,108,660 bytes
- `dist/autumn.webp`: 185,230 bytes
- `dist/spring.avif`: 203,935 bytes
- `dist/spring.png`: 1,101,747 bytes
- `dist/spring.webp`: 281,454 bytes
- `dist/summer.avif`: 170,312 bytes
- `dist/summer.png`: 1,122,758 bytes
- `dist/summer.webp`: 247,090 bytes
- `dist/winter.avif`: 88,859 bytes
- `dist/winter.png`: 1,152,888 bytes
- `dist/winter.webp`: 136,378 bytes
- `dist/favicon.svg`: 979 bytes

## Lighthouse

Command:

```sh
npx --yes lighthouse@latest http://127.0.0.1:4173/ --quiet --chrome-flags="--headless --no-sandbox" --output=json --output-path=tmp/metrics/svelte-lighthouse.json
```

Served with `npm run preview -- --host 127.0.0.1 --port 4173`.

| Metric         | Value |
| -------------- | ----- |
| Performance    | 92    |
| Accessibility  | 100   |
| Best Practices | 100   |
| SEO            | 92    |
| FCP            | 1.1 s |
| LCP            | 3.4 s |
| CLS            | 0     |
| TBT            | 0 ms  |
| Speed Index    | 1.1 s |

## Runtime Smoke Check

A headless Edge `--dump-dom` run against the Vite preview confirmed that the built Svelte app mounted the full scene: background layers, season switcher, hollow eyes, and particle spans were present in `#root`.
