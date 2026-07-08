# React to Svelte Comparison

Collected on 2026-07-08. React metrics were collected before creating `svelte-port`; Svelte metrics were collected after the port on `svelte-port`.

## Summary Table

| Metric                            | React Baseline | Svelte Port | Difference |
| --------------------------------- | -------------: | ----------: | ---------: |
| Installed packages after `npm ci` |            226 |         172 |        -54 |
| Tests                             |      7 passing |  10 passing |   +3 tests |
| Timed build                       |        1.967 s |     2.496 s |   +0.529 s |
| Vite build phase                  |         387 ms |      141 ms |    -246 ms |
| Final `dist/` size                |    6,131,095 B | 5,982,408 B | -148,687 B |
| JS bundle size                    |      200,911 B |    52,025 B | -148,886 B |
| JS gzip size                      |       63.70 kB |    19.45 kB |  -44.25 kB |
| CSS bundle size                   |       10,619 B |    10,818 B |     +199 B |
| CSS gzip size                     |        2.78 kB |     2.86 kB |   +0.08 kB |
| Image/static asset size           |    5,917,848 B | 5,917,848 B |        0 B |

## Lighthouse

| Metric         | React Baseline | Svelte Port | Difference |
| -------------- | -------------: | ----------: | ---------: |
| Performance    |             75 |          92 |        +17 |
| Accessibility  |            100 |         100 |          0 |
| Best Practices |            100 |         100 |          0 |
| SEO            |             92 |          92 |          0 |
| FCP            |          1.2 s |       1.1 s |     -0.1 s |
| LCP            |          8.9 s |       3.4 s |     -5.5 s |
| CLS            |              0 |           0 |          0 |
| TBT            |           0 ms |        0 ms |       0 ms |
| Speed Index    |          1.2 s |       1.1 s |     -0.1 s |

Both Lighthouse runs used local Vite preview on `http://127.0.0.1:4173/` with Lighthouse `13.4.0`. Both runs wrote JSON successfully but reported a Windows temp-directory cleanup warning after completion.

## What Improved

- The JavaScript bundle is substantially smaller in the Svelte build. The app has simple local state and declarative DOM updates, so Svelte removes much of the framework/runtime overhead that React and React DOM carried for this small SPA.
- The Vite bundling phase was faster for Svelte in this run: 141 ms versus 387 ms.
- Lighthouse Performance and LCP improved in the measured local run. The most defensible explanation is lower JavaScript byte weight and less runtime work before the scene settles, but Lighthouse can vary across runs and should not be treated as a lab-grade benchmark.

## What Did Not Improve

- The full `npm run build` command was slower for Svelte in this setup because it runs `svelte-check` before `tsc` and Vite. The Vite phase improved, but the total quality-gated build command did not.
- CSS size increased slightly because the Svelte port adds a small global reduced-motion rule and Svelte's CSS processing changed the final output shape.
- Static assets dominate the project size. The seasonal AVIF/WebP/PNG assets are unchanged, so total `dist/` size moved much less than the JS bundle size.

## Engineering Trade-Offs

React used `useSeasonScene` for state orchestration and `useEyePosition` for viewport/image-cover positioning. The Svelte version moves scene orchestration into `stores/seasonScene.ts` and keeps eye-position measurement in `App.svelte`, where it can bind directly to the scene element.

The Svelte component files are a little closer to the rendered HTML because props, loops, and conditionals live in the template. The React version kept all component logic in TypeScript functions and JSX, which may be more familiar to React teams.

Svelte reduced runtime and bundle overhead for this small interactive scene. The trade-off is Svelte-specific compiler and type-checking setup, plus attention to initialization order because Svelte stores emit synchronously.

## Conclusion

The rewrite is useful as a framework comparison and portfolio exercise. It preserves the same visual behavior while producing a much smaller JavaScript bundle and better measured Lighthouse Performance in this environment. It is not a universal proof that Svelte is faster; the app is small, image-heavy, and animation-heavy, and the largest payload remains static image assets rather than framework code.
