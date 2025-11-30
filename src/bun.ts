import type { BunRequest } from 'bun'

import type { MethodRouter } from './core/method-router'
import type { Handler, StrictHandler } from './core/types'
import type { TypedParams } from './core/types/typed-params'

import { App } from './core/app'
import { status } from './res'

class BunApp extends App {
  override get fetch(): StrictHandler {
    return this.fallback ?? (async () => status(404))
  }

  get routes(): Bun.Serve.Routes<undefined, string> {
    if (!this.routesObj)
      this.buildRoutes()

    return this.routesObj!
  }

  private routesObj: Bun.Serve.Routes<undefined, string> | undefined

  constructor(fallback?: StrictHandler) {
    super(fallback)
  }

  override merge(app: App): this {
    super.merge(app)
    this.routesObj = undefined
    return this
  }

  override route<T extends string>(path: T, handler: Handler<TypedParams<T>> | MethodRouter<TypedParams<T>>): this {
    super.route(path, handler)
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
