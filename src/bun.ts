import type { Handler, MaybePromise, Next, StrictHandler } from './core/types'

import { App } from './core/app'
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
          acc.staticRoutes[path] = this.withLayers(handler)
        }
        return acc
      }, {
        dynamicRoutes: new Map<string, Handler>(),
        staticRoutes: {} as Record<string, StrictHandler>,
      })

    const router = new Router<Handler>()
    dynamicRoutes.forEach((handler, path) => router.insert(path, handler))

    return {
      fetch: async req => this.handle(req, router),
      routes: staticRoutes,
    }
  }

  private withLayers(handler: Handler): StrictHandler {
    return async (req: Request) => {
      const next: Next = async () => (handler as StrictHandler)(req)

      return (
        this.layers.length > 0
          ? this.layers.reduceRight<Next>(
              (currentNext, layer) => async () => layer(req, currentNext),
              next,
            )
          : next
      )()
    }
  }
}

export { BunApp as App }
