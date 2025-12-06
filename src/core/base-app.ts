import type { Handler, Layer, StrictHandler } from './types'

import { status } from '../res'

export class BaseApp {
  fallback?: StrictHandler
  layers: Layer[] = []
  routesMap: Map<string, Handler> = new Map()

  constructor(fallback?: StrictHandler) {
    if (!fallback)
      return

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

  public merge(app: BaseApp): this {
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
}
