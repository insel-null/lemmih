import { status } from "../res/status";
import type { Handler } from "../types";

const routing = (method: string) =>
  (handler: Handler): Handler =>
  (req) =>
    req.method.toUpperCase() === method
      ? handler instanceof Function
        ? handler(req)
        : handler
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
