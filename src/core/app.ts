import type { Handler, Layer, StrictHandler } from './types'
import type { TypedParams } from './types/typed-params'

import { status } from '../res'
import { MethodRouter } from './method-router'
import { PathRouter } from './path-router'

export class App {
  fallback?: StrictHandler
  layers: Layer[] = []
  routesMap: Map<string, Handler> = new Map()

  get fetch(): StrictHandler {
    const router = new PathRouter<Handler>()
    this.routesMap.forEach((handler, path) => router.insert(path, handler))

    return async (req) => {
      const result = router.find(new URL(req.url).pathname)

      return this.handle(
        req,
        result?.value,
        result?.params,
      )
    }
  }

  constructor(fallback?: StrictHandler) {
    // eslint-disable-next-line @masknet/prefer-early-return
    if (fallback != null)
      this.fallback = fallback
  }

  public async handle(req: Request, handler?: Handler, params?: Record<string, string>): Promise<Response> {
    const next = async (req: Request) => (handler ?? this.fallback ?? (() => status(404)) satisfies Handler)(
      req,
      params,
    )

    return (
      this.layers.length > 0
        ? this.layers.reduceRight<StrictHandler>(
            (next, layer) => async req => layer(req, next),
            next,
          )
        : next
    )(req)
  }

  public layer(...layers: Layer[]): this {
    this.layers.push(...layers)

    return this
  }

  public merge(app: App): this {
    app.routesMap.forEach((handler, path) => this.routesMap.set(path, handler))
    app.layers.forEach(layer => this.layers.push(layer))

    if (app.fallback) {
      if (!this.fallback)
        this.fallback = app.fallback
      else
        throw new Error('lemmih: Cannot merge two `App`s that both have a fallback')
    }

    return this
  }

  public route<T extends string>(path: T, handler: Handler<TypedParams<T>> | MethodRouter<TypedParams<T>>): this {
    this.routesMap.set(
      path,
      handler instanceof MethodRouter
        // TODO: remove any
        // eslint-disable-next-line ts/no-unsafe-argument
        ? async (req, params) => handler.handle(req, params as any)
        // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
        : handler as unknown as Handler,
    )

    return this
  }
}
