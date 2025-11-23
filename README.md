# LeMMIH

A simple, performance-focused Web framework.

## Usage

```ts
import { App, res, routing } from 'lemmih'

const app = new App()
  .route('/', routing.get(() => res.text('Hello from LeMMIH')))

// Web Standards (Deno, Bun, Vercel, Cloudflare, etc...)
// For Node.js, you can use https://srvx.h3.dev
export default app.fetch // (req: Request) => Promise<Response>
```

```ts
import { res, routing } from 'lemmih'
import { App } from 'lemmih/bun' // Bun-specific app

const app = new App()
  .route('/', routing.get(() => res.text('Hello from LeMMIH')))

Bun.serve({
  fetch: app.fetch, // Bun.serve optimized
  port: 3000,
  routes: app.routes // Bun.serve optimized
})
```

## Design

### Minimum Context

Use `import foo from 'lemmih'` instead of `ctx.foo`, which helps with tree shaking.

### Runtime-agnostic

LeMMIH can run on many runtimes, and when you run it on Bun, you can take advantage of related optimizations.

### Look familiar?

~~Scenes like these are happening all over the galaxy right now. You could be next.~~

LeMMIH's architecture draws inspiration from Axum. In fact, you can even pair it with the [Result/Option library](https://std.moeru.ai/docs/packages/results)!

## Performance

### Router

```bash
bun bench:routers
```

```
• all together
------------------------------------------- -------------------------------
Hono RegExpRouter            471.77 ns/iter 450.52 ns █▇
                      (399.93 ns … 1.79 µs)   1.37 µs ██
                    (  0.00  b … 896.00  b)  23.14  b ██▃▂▂▂▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁

Hono TrieRouter                3.08 µs/iter   3.15 µs   █  ▃
                        (2.69 µs … 4.16 µs)   3.94 µs   █▆▆█▆▃
                    (  0.00  b … 256.00  b)  10.64  b █▄██████▁▄▆▆▆▄▆▁▄▁▁▁▄

Hono PatternRouter             2.15 µs/iter   2.30 µs  ▅▂ ▅    ▂  █
                        (1.86 µs … 2.67 µs)   2.62 µs ▇██▇█ ▂ ▇█▇▅█▅    ▂
                    (  0.00  b … 928.00  b)  14.96  b █████▇█▁██████▄▄▄▁█▄▄

LeMMIH                       195.85 ns/iter 196.16 ns  █
                    (168.76 ns … 589.25 ns) 440.65 ns  █▇
                    (  0.00  b … 288.00  b)   3.74  b ▆██▆▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

Memoirist                    546.81 ns/iter 560.28 ns   █▅▂
                    (472.48 ns … 869.89 ns) 844.06 ns  ████▃
                    (  0.00  b … 256.00  b)   2.95  b ▄█████▆▃▅▂▂▂▂▂▁▁▁▁▁▁▁

summary
  LeMMIH
   2.41x faster than Hono RegExpRouter
   2.79x faster than Memoirist
   10.99x faster than Hono PatternRouter
   15.71x faster than Hono TrieRouter
```

We're now the fastest router!

### [Framework](./results/result.md)

```bash
bun bench:frameworks
```

|  Framework       | Runtime | Average | Ping       | Query      | Body       |
| ---------------- | ------- | ------- | ---------- | ---------- | ---------- |
| elysia | bun | 81,925.21 | 98,416.89 | 75,861.53 | 71,497.21 |
| lemmih | bun | 75,771.083 | 79,894.87 | 74,951.42 | 72,466.96 |
| hono | bun | 63,737.29 | 66,442.04 | 67,496 | 57,273.83 |

We're close to Elysia.

### Framework cold start

```bash
bun bench:frameworks-init
```

```
benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
elysia                         6.05 µs/iter   5.49 µs ▂█
                      (3.82 µs … 721.88 µs)  29.58 µs ██
                    (  0.00  b …   1.00 mb) 520.89  b ██▅▃▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

hono                           1.54 µs/iter   1.64 µs █▅
                    (585.00 ns … 919.75 µs)   8.58 µs ██▆
                    (  0.00  b … 256.00 kb)  54.36  b ████▆▄▃▂▂▁▁▁▁▁▁▁▁▁▁▁▁

hono/quick                     1.31 µs/iter   1.28 µs █▃
                    (564.00 ns … 976.53 µs)   7.88 µs ██
                    (  0.00  b … 512.00 kb)  36.25  b ███▅▃▂▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁

hono/tiny                      2.80 µs/iter   2.64 µs █▇
                      (1.47 µs … 838.74 µs)  12.58 µs ██
                    (  0.00  b … 256.00 kb) 133.15  b ██▆▄▃▃▃▂▂▂▂▁▁▁▁▁▁▁▁▁▁

lemmih                       467.87 ns/iter 445.00 ns  █
                    (296.00 ns … 589.00 µs)   1.64 µs  █
                    (  0.00  b … 256.00 kb)  12.98  b ▄█▅▃▃▃▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁

lemmih/bun                     1.04 µs/iter   1.45 µs ▃█
                      (451.06 ns … 2.25 µs)   2.13 µs ██▃
                    (  0.00  b … 512.00  b)   9.88  b ███▂█▅▅▅▄▄▆▄▄▃▄▂▅▃█▆▄
```

## License

[MIT](LICENSE.md)
