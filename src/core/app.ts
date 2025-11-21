import { status } from "../res";
import type { Handler } from "../types";
import { Router } from "./router";
import { handle } from './handle'
import type { MaybePromise } from "bun";

export class App {
  private fallback: Handler = status(404)
  private routes: Map<string, Handler> = new Map()

  constructor(fallback?: Handler) {
    if (fallback)
      this.fallback = fallback
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

  public build(): (req: Request) => MaybePromise<Response> {
    const router = new Router()
    this.routes.forEach((handler, path) => router.insert(path, handler))

    return (req) => {
      const result = router.find(new URL(req.url).pathname)

      return handle(
        result?.value ?? this.fallback,
        req,
        result?.params
      )
    }
  }
}
