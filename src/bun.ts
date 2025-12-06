import type { BunRequest } from 'bun'

import type { Handler, StrictHandler } from './core/types'

import { BaseApp } from './core/base-app'
import { MethodRouter } from './core/method-router'
import { status } from './res'

class BunApp extends BaseApp {
  get fetch(): StrictHandler {
    return this.fallback ?? (async () => status(404))
  }

  get routes(): Bun.Serve.Routes<undefined, string> {
    if (!this.routesObj)
      this.buildRoutes()

    return this.routesObj!
  }

  private routesObj: Bun.Serve.Routes<undefined, string> | undefined

  override merge(app: BunApp): this {
    this.routesObj = undefined
    return super.merge(app)
  }

  public route<T extends string>(path: T, handler: Handler<Bun.Serve.ExtractRouteParams<T>> | MethodRouter<Bun.Serve.ExtractRouteParams<T>>): this {
    this.routesMap.set(
      path,
      handler instanceof MethodRouter
        ? (async (req, params) => handler.handle(req, params)) satisfies Handler<Bun.Serve.ExtractRouteParams<T>> as Handler
        // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
        : handler as unknown as Handler,
    )

    this.routesObj = undefined
    return this
  }

  private buildRoutes() {
    const routesObj: Bun.Serve.Routes<undefined, string> = {}

    this.routesMap.forEach((handler, path) => {
      routesObj[path] = async (req: BunRequest) => this.handle(req, handler, req.params)
    })

    this.routesObj = routesObj
  }
}

export { BunApp as App }
