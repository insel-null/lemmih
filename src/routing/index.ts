import type { Handler } from '../types'

import { status } from '../res/status'

const routing = (method: string) =>
  (handler: Handler): Handler =>
    async (req, params) =>
      req.method.toUpperCase() === method
        ? handler(req, params)
        : status(405)

export const connect = routing('CONNECT')

export const del = routing('DELETE')

export const get = routing('GET')

export const head = routing('HEAD')

export const options = routing('OPTIONS')

export const patch = routing('PATCH')

export const post = routing('POST')

export const put = routing('PUT')

export const trace = routing('TRACE')
