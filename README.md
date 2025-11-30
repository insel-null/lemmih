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
| elysia | bun | 102,003.007 | 123,049.73 | 94,130.53 | 88,828.76 |
| lemmih-bun | bun | 92,167.47 | 101,994.83 | 89,719.56 | 84,788.02 |
| hono | bun | 85,715.473 | 91,087.84 | 91,546.16 | 74,512.42 |
| lemmih | bun | 84,603.257 | 94,127.75 | 82,830.43 | 76,851.59 |
| itty-router | bun | 84,211.093 | 97,420.58 | 80,179.38 | 75,033.32 |
| itty-router-auto | bun | 76,336.063 | 89,243.72 | 68,843.69 | 70,920.78 |

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
