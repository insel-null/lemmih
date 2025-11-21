# LeMMIH

A simple, performance-focused Web framework.

## Usage

```ts
import { App, res, routing } from 'lemmih'

const app = new App()
  .route('/', routing.get(() => res.text('Hello from LeMMIH')))

// Web Standards
export default app.fetch // (req: Request) => Promise<Response>
```

```ts
import { res, routing } from 'lemmih'
import { App } from 'lemmih/bun'

const app = new App()
  .route('/', routing.get(() => res.text('Hello from LeMMIH')))

// Bun.serve optimized
Bun.serve({
  ...app.build(),
  port: 3000
})
```

## Design

### Minimum Context

Use `import foo from 'lemmih'` instead of `ctx.foo`, which helps with tree shaking.

## Performance

### Router

```bash
bun bench:routers
```

```
• all together
------------------------------------------- -------------------------------
Hono RegExpRouter            610.85 ns/iter 686.17 ns █
                      (397.60 ns … 2.01 µs)   1.95 µs █
                    (  0.00  b … 896.00  b)  21.40  b █▇▅▃▃▃▂▃▂▂▁▁▁▁▁▂▁▁▁▁▂

Hono TrieRouter                7.67 µs/iter   9.71 µs    █
                       (4.58 µs … 12.46 µs)  12.40 µs  █ ██
                    (  0.00  b … 512.00  b)  67.05  b ████████▁▁▁▁▁██▁█▁█▁█

Hono PatternRouter             2.60 µs/iter   2.92 µs █
                        (1.54 µs … 6.88 µs)   6.67 µs █
                    (  0.00  b …   2.06 kb)  99.10  b █▅▅▆▃▃▂▂▁▂▃▂▄▂▂▁▁▁▁▃▂

LeMMIH                         1.27 µs/iter   1.90 µs █
                      (516.14 ns … 2.47 µs)   2.47 µs █▅
                    (  0.00  b … 448.00  b)   3.39  b ██▇█▄▇▇▇▇▄▅▂▇▂▄▃▂▆▆▇█

Memoirist                      1.04 µs/iter   1.50 µs ▄  █
                      (400.02 ns … 2.42 µs)   2.22 µs █  █
                    (  0.00  b …   1.00 kb)  88.15  b ██▅█▆▄▅▆▅▄▅▃▅▄▃▃▆█▅▂▂

summary
  Hono RegExpRouter
   1.7x faster than Memoirist
   2.08x faster than LeMMIH
   4.25x faster than Hono PatternRouter
   12.56x faster than Hono TrieRouter
```

Our LeMMIH router is smaller than the Elysia (Memoirist) router but slightly less powerful.

### [Framework](./results/result.md)

```bash
bun bench:frameworks
```

|  Framework       | Runtime | Average | Ping       | Query      | Body       |
| ---------------- | ------- | ------- | ---------- | ---------- | ---------- |
| elysia | bun | 143,717.933 | 299,444.38 | 78,088.78 | 53,620.64 |
| lemmih | bun | 74,235.703 | 126,405.7 | 49,198.34 | 47,103.07 |
| hono | bun | 52,641.26 | 71,254.38 | 48,320.05 | 38,349.35 |

We still have some distance to go before reaching Elysia, but we're already faster than Hono.

## License

[MIT](LICENSE.md)
