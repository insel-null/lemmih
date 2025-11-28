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
   1.07x faster than Hono RegExpRouter
   1.37x faster than Memoirist
   3.89x faster than Hono PatternRouter
   10.4x faster than Hono TrieRouter
```

We're now the fastest router!

### [Framework](./results/result.md)

```bash
bun bench:frameworks
```

|  Framework       | Runtime | Average | Ping       | Query      | Body       |
| ---------------- | ------- | ------- | ---------- | ---------- | ---------- |
| elysia | bun | 142,691.557 | 308,885.15 | 67,891.31 | 51,298.21 |
| lemmih-bun | bun | 72,257.477 | 81,757.63 | 72,651.35 | 62,363.45 |
| lemmih | bun | 50,596.787 | 69,206.43 | 46,928.6 | 35,655.33 |
| hono | bun | 46,156.69 | 60,575.09 | 44,380.09 | 33,514.89 |

We're still a distance from Elysia.

### Framework cold start

```bash
bun bench:frameworks-init
```

```
summary
  lemmih/bun
   2.4x faster than lemmih
   4.56x faster than hono/quick
   6.43x faster than hono
   10.43x faster than hono/tiny
   29.41x faster than elysia
```

Due to LeMMIH's minimal context design, it achieves very fast cold starts.

## License

[MIT](LICENSE.md)
