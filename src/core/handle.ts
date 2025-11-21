import type { Handler } from '../types'

export const handle = async (handler: Handler, req: Request, params?: Record<string, string>) =>
  typeof handler === 'function'
    ? handler(req, params)
    : handler
