import type { MaybePromise } from 'bun'

import type { Handler } from '../types'

import { status } from '../res'
import { handle } from './handle'
import { Router } from './router'

export class App {
  private fallback: Handler = status(404)
  private routes: Map<string, Handler> = new Map()

  constructor(fallback?: Handler) {
    // eslint-disable-next-line @masknet/prefer-early-return
    if (fallback != null)
      this.fallback = fallback
  }

  public build(): (req: Request) => MaybePromise<Response> {
    // TODO: static, routes

    const router = new Router()
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
