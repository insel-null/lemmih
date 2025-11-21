import type { MaybePromise } from 'bun'

import type { Handler } from '../types'

import { status } from '../res'
import { handle } from './handle'
import { Router } from './router'

export interface AppBuildResult {
  fetch: (req: Request) => MaybePromise<Response>
  routes: Record<string, (req: Request) => MaybePromise<Response>>
}

export class App {
  private fallback: Handler = status(404)
  private routes: Map<string, Handler> = new Map()

  constructor(fallback?: Handler) {
    // eslint-disable-next-line @masknet/prefer-early-return
    if (fallback != null)
      this.fallback = fallback
  }

  public build(): AppBuildResult {
    const { dynamicRoutes, staticRoutes } = Array.from(this.routes.entries())
      .reduce((acc, [path, handler]) => {
        const isDynamic = path.includes(':') || path.includes('*')

        if (isDynamic) {
          acc.dynamicRoutes.set(path, handler)
        }
        else {
          acc.staticRoutes[path] = handler as (req: Request) => MaybePromise<Response>
        }
        return acc
      }, {
        dynamicRoutes: new Map<string, Handler>(),
        staticRoutes: {} as Record<string, (req: Request) => MaybePromise<Response>>,
      })

    const router = new Router()
    dynamicRoutes.forEach((handler, path) => router.insert(path, handler))

    return {
      fetch: async (req) => {
        const result = router.find(new URL(req.url).pathname)

        return handle(
          result?.value ?? this.fallback,
          req,
          result?.params,
        )
      },
      routes: staticRoutes,
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
