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
| elysia | bun | 92,375.663 | 113,800.04 | 84,030.92 | 79,296.03 |
| lemmih-bun | bun | 78,891.933 | 89,154.16 | 77,758.65 | 69,762.99 |
| lemmih | bun | 72,496.61 | 75,916 | 76,078.43 | 65,495.4 |
| hono | bun | 69,325.417 | 84,974.44 | 70,775.3 | 52,226.51 |
| itty-router | bun | 64,429.353 | 72,902.13 | 60,072.32 | 60,313.61 |
| itty-router-auto | bun | 58,448.183 | 68,248.62 | 56,588.95 | 50,506.98 |

We're still a distance from Elysia.

### Framework cold start

```bash
bun bench:frameworks-init
```

```
summary
  lemmih/bun
   3.29x faster than lemmih
   4.16x faster than hono/quick
   4.23x faster than hono
   13.48x faster than hono/tiny
   36.43x faster than elysia
```

Due to LeMMIH's minimal context design, it achieves very fast cold starts.

## License

[MIT](LICENSE.md)
