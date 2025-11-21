import type { Handler } from '../core/types'

import { status } from '../res/status'

const routing = <T = undefined>(method: string) =>
  (handler: Handler<T>): Handler<T> =>
    async (req, params) =>
      req.method.toUpperCase() === method
        ? handler(req, params)
        : status(405)

export const connect = routing('CONNECT')

export const del = routing('DELETE')

export const get = <T = undefined>(handler: Handler<T>) => routing<T>('GET')(handler)

export const head = routing('HEAD')

export const options = routing('OPTIONS')

export const patch = routing('PATCH')

export const post = <T = undefined>(handler: Handler<T>) => routing<T>('POST')(handler)

export const put = routing('PUT')

export const trace = routing('TRACE')
