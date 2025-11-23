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
summary
  LeMMIH
   1.32x faster than Hono RegExpRouter
   1.32x faster than Memoirist
   5.51x faster than Hono PatternRouter
   13.93x faster than Hono TrieRouter
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
summary
  lemmih/bun
   3.87x faster than lemmih
   4.51x faster than hono/quick
   4.79x faster than hono
   14.61x faster than hono/tiny
   66.48x faster than elysia
```

## License

[MIT](LICENSE.md)
