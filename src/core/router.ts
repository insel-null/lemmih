import { status } from "../res";
import type { Handler } from "../types";

export class Router {
  private fallback: Handler = status(404)

  constructor(fallback?: Handler) {
    if (fallback)
      this.fallback = fallback
  }

  // TODO
  public merge(_router: Router): this {
    return this
  }

  public route(path: string, handler: Handler): this {


    return this
  }
}
