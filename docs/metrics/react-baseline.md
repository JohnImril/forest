# React Baseline Metrics

Collected on 2026-07-08 before creating the Svelte port branch.

## Environment

- Node: `v24.12.0`
- npm: `11.18.0`
- Shell: Windows PowerShell
- Working directory: `E:\Project\forest`
- OS details: not collected. `Get-CimInstance Win32_OperatingSystem` returned access denied in this environment.

## Dependency Versions

From `package.json`:

- `react`: `^19.2.7`
- `react-dom`: `^19.2.7`
- `@babel/core`: `^8.0.1`
- `@eslint/js`: `^10.0.1`
- `@rolldown/plugin-babel`: `^0.2.3`
- `@types/babel__core`: `^7.20.5`
- `@types/node`: `^26.0.1`
- `@types/react`: `^19.2.17`
- `@types/react-dom`: `^19.2.3`
- `@vitejs/plugin-react`: `^6.0.3`
- `babel-plugin-react-compiler`: `^1.0.0`
- `eslint`: `^10.6.0`
- `eslint-plugin-react-hooks`: `^7.1.1`
- `eslint-plugin-react-refresh`: `^0.5.3`
- `globals`: `^17.7.0`
- `prettier`: `^3.9.1`
- `typescript`: `^6.0.3`
- `typescript-eslint`: `^8.62.0`
- `vite`: `^8.1.0`
- `vitest`: `^4.1.9`

## Command Results

| Command | Result | Notes |
| --- | --- | --- |
| `npm ci` | Pass | Installed 226 packages, audited 227 packages, 0 vulnerabilities. |
| `npm run lint` | Pass | `eslint .` completed with no reported issues. |
| `npm run test` | Pass | 2 test files passed, 7 tests passed. Vitest duration: 169 ms. |
| `npm run build` | Pass | `tsc -b && vite build` completed successfully. |

## Build Metrics

- Timed build command: `Measure-Command { npm.cmd run build }`
- Build time: 1.967 seconds
- Vite reported build time: 387 ms
- Final `dist/` size: 6,131,095 bytes
- JavaScript bundle size: 200,911 bytes
- CSS bundle size: 10,619 bytes
- Image/static asset size: 5,917,848 bytes

Generated files:

- `dist/index.html`: 1,717 bytes
- `dist/assets/index-Byuu7YfU.js`: 200,911 bytes, gzip 63.70 kB
- `dist/assets/index-VCmh4rYe.css`: 10,619 bytes, gzip 2.78 kB
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

Warnings:

- Build emitted no warnings.
- Lighthouse completed and wrote JSON, but reported a cleanup warning: `EPERM, Permission denied` while removing a temporary Lighthouse directory under `C:\Users\nikit\AppData\Local\Temp`.

## Lighthouse

Command:

```sh
npx --yes lighthouse@latest http://127.0.0.1:4173/ --quiet --chrome-flags="--headless --no-sandbox" --output=json --output-path=tmp/metrics/react-lighthouse.json
```

Served with `npm run preview -- --host 127.0.0.1 --port 4173`.

| Metric | Value |
| --- | --- |
| Performance | 75 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 92 |
| FCP | 1.2 s |
| LCP | 8.9 s |
| CLS | 0 |
| TBT | 0 ms |
| Speed Index | 1.2 s |

