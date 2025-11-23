import type { BunRequest } from 'bun'

import type { StrictHandler } from './core/types'

import { App } from './core/app'
import { status } from './res'

class BunApp extends App {
  override get fetch(): StrictHandler {
    return this.fallback ?? (async () => status(404))
  }

  get routes(): Bun.Serve.Routes<undefined, string> {
    const routes: Bun.Serve.Routes<undefined, string> = {}

    this.routesMap.forEach((handler, path) => {
      routes[path] = async (req: BunRequest) => this.handle(req, handler, req.params)
    })

    return routes
  }

  constructor(fallback?: StrictHandler) {
    super(fallback)
  }
}

export { BunApp as App }
