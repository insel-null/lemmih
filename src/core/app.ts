import type { Handler } from '../types'

import { status } from '../res'
import { handle } from './handle'
import { Router } from './router'

export class App {
  fallback: Handler = status(404)
  routes: Map<string, Handler> = new Map()

  get fetch(): (req: Request) => Promise<Response> {
    const router = new Router<Handler>()
    this.routes.forEach((handler, path) => router.insert(path, handler))

    return async (req) => {
      const result = router.find(new URL(req.url).pathname)

      return handle(
        result?.value ?? this.fallback,
        req,
        result?.params,
      )
    }
  }

  constructor(fallback?: Handler) {
    // eslint-disable-next-line @masknet/prefer-early-return
    if (fallback != null)
      this.fallback = fallback
  }

  public merge(app: App): this {
    app.routes.forEach((handler, path) => this.routes.set(path, handler))

    // TODO: merge fallback

    return this
  }

  public route(path: string, handler: Handler): this {
    this.routes.set(path, handler)

    return this
  }
}
