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
Hono RegExpRouter            403.35 ns/iter 401.53 ns  █▄
                    (370.76 ns … 670.03 ns) 618.39 ns  ██
                    (  0.00  b … 448.00  b)   2.27  b ▇███▂▂▁▃▂▁▂▁▁▁▁▁▁▁▁▁▁

Hono TrieRouter                4.03 µs/iter   4.56 µs  █            ▃
                        (3.10 µs … 5.36 µs)   5.14 µs  █      ▃     █▆
                    (  0.00  b … 448.00  b)  25.30  b ▆█▄▄▁▄▁▁█▄▄▁▁███▄▄▁▁▄

Hono PatternRouter             1.53 µs/iter   1.54 µs    ▆█  ▅
                        (1.46 µs … 1.78 µs)   1.64 µs   ██████▃      ▃
                    (  0.00  b … 128.00  b)   2.91  b ▆████████▆▃▃▆▄▃█▃▄▁▆▄

LeMMIH                       559.11 ns/iter 569.00 ns ▇█
                      (478.69 ns … 1.55 µs)   1.25 µs ██
                    (  0.00  b …   1.63 kb)  11.83  b ██▄▆▄▂▂▂▁▂▁▁▁▁▁▁▁▁▁▁▁

Memoirist                    548.81 ns/iter 436.64 ns █
                      (390.68 ns … 2.01 µs)   1.96 µs █
                    (  0.00  b …   0.00  b)   0.00  b █▄▂▁▂▁▁▁▁▁▁▁▁▁▁▁▂▁▁▁▁

summary
  Hono RegExpRouter
   1.36x faster than Memoirist
   1.39x faster than LeMMIH
   3.79x faster than Hono PatternRouter
   9.98x faster than Hono TrieRouter
```

Our LeMMIH router is smaller than the Elysia (Memoirist) router but slightly less powerful.

### [Framework](./results/result.md)

```bash
bun bench:frameworks
```

|  Framework       | Runtime | Average | Ping       | Query      | Body       |
| ---------------- | ------- | ------- | ---------- | ---------- | ---------- |
| elysia | bun | 78,939.283 | 95,063.59 | 75,846.83 | 65,907.43 |
| lemmih | bun | 78,259.113 | 88,234.07 | 75,674.28 | 70,868.99 |
| hono | bun | 66,688.83 | 71,057.76 | 70,602.88 | 58,405.85 |

We're very close to Elysia.

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
