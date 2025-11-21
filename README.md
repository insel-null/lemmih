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
  ...app.build(), // Bun.serve optimized
  port: 3000
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
| elysia | bun | 165,919.86 | 289,342.74 | 114,199.43 | 94,217.41 |
| lemmih | bun | 83,172.147 | 105,613.91 | 64,541.17 | 79,361.36 |
| hono | bun | 65,372.537 | 94,328.79 | 58,534.07 | 43,254.75 |

We still have some distance to go before reaching Elysia, but we're already faster than Hono.

## License

[MIT](LICENSE.md)
