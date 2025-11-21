import type { Handler, MaybePromise } from './types'

import { App } from './core/app'
import { handle } from './core/handle'
import { Router } from './core/router'

export interface LeMMIHBuildResult {
  fetch: (req: Request) => MaybePromise<Response>
  routes: Record<string, (req: Request) => MaybePromise<Response>>
}

class BunApp extends App {
  constructor(fallback?: Handler) {
    super(fallback)
  }

  public build(): LeMMIHBuildResult {
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
}

export { BunApp as App }
