import type { Handler } from './types'

export const handle = async (handler: Handler, req: Request, params?: Record<string, string>) =>
  handler(req, params)
