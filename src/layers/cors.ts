import type { CorsOptions } from 'cors-edge'

import type { Layer } from '..'

import { createCors } from 'cors-edge'

export type { CorsOptions } from 'cors-edge'

export const cors = (options: CorsOptions): Layer => {
  const corsEdge = createCors(options)

  return async (req, next) => {
    if (req.method === 'OPTIONS') {
      return corsEdge(req, new Response(null, { status: 204, statusText: 'No Content' }))
    }

    return corsEdge(req, await next(req))
  }
}
