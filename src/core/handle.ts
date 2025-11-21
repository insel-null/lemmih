import type { Handler } from "../types";

export const handle = (handler: Handler, req: Request, params?: Record<string, string>) =>
  handler instanceof Function
    ? handler(req, params)
    : handler
