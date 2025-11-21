import type { Handler, Layer, Next } from '../types'

import { status } from '../res'
import { handle } from './handle'
import { Router } from './router'

export class App {
  fallback: Handler = status(404)
  layers: Layer[] = []
  routes: Map<string, Handler> = new Map()

  get fetch(): (req: Request) => Promise<Response> {
    const router = new Router<Handler>()
    this.routes.forEach((handler, path) => router.insert(path, handler))

    return async req => this.handle(req, router)
  }

  constructor(fallback?: Handler) {
    // eslint-disable-next-line @masknet/prefer-early-return
    if (fallback != null)
      this.fallback = fallback
  }

  public async handle(req: Request, router: Router<Handler>) {
    const result = router.find(new URL(req.url).pathname)

    const next = async () => handle(
      result?.value ?? this.fallback,
      req,
      result?.params,
    )

    return (
      this.layers.length > 0
        ? this.layers.reduceRight<Next>(
            (next, layer) => async () => layer(req, next),
            next,
          )
        : next
    )()
  }

  public layer(...layers: Layer[]): this {
    this.layers.push(...layers)

    return this
  }

  public merge(app: App): this {
    app.routes.forEach((handler, path) => this.routes.set(path, handler))
    app.layers.forEach(layer => this.layers.push(layer))

    // TODO: merge fallback

    return this
  }

  public route(path: string, handler: Handler): this {
    this.routes.set(path, handler)

    return this
  }
}
