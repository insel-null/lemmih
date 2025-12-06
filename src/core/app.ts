import type { Handler, StrictHandler } from './types'
import type { TypedParams } from './types/typed-params'

import { BaseApp } from './base-app'
import { MethodRouter } from './method-router'
import { PathRouter } from './path-router'

export class App extends BaseApp {
  get fetch(): StrictHandler {
    const router = this.buildRouter()

    return async (req) => {
      const result = router.find(new URL(req.url).pathname)

      return this.handle(
        req,
        result?.value,
        result?.params,
      )
    }
  }

  private router: PathRouter<Handler> | undefined

  override merge(app: App): this {
    this.router = undefined
    return super.merge(app)
  }

  public route<T extends string>(path: T, handler: Handler<TypedParams<T>> | MethodRouter<TypedParams<T>>): this {
    this.routesMap.set(
      path,
      handler instanceof MethodRouter
        ? (async (req, params) => handler.handle(req, params)) satisfies Handler<TypedParams<T>> as Handler
        // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
        : handler as unknown as Handler,
    )

    this.router = undefined
    return this
  }

  private buildRouter(): PathRouter<Handler> {
    if (this.router)
      return this.router

    const router = new PathRouter<Handler>()
    this.routesMap.forEach((handler, path) => router.insert(path, handler))
    this.router = router

    return this.router
  }
}
