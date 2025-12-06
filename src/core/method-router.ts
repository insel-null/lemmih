import type { Handler } from './types'

import { status } from '../res'

export type Method = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE'

export class MethodRouter<T> {
  private handlers: Record<Method, Handler<T>> = Object.create(null) as Record<string, Handler<T>>

  any(handler: Handler<T>): MethodRouter<T> {
    this.anyHandler = handler

    return this
  }

  connect(handler: Handler<T>): MethodRouter<T> {
    return this.on('CONNECT', handler)
  }

  delete(handler: Handler<T>): MethodRouter<T> {
    return this.on('DELETE', handler)
  }

  get(handler: Handler<T>): MethodRouter<T> {
    this.handlers.GET = handler
    this.handlers.HEAD = this.headHandler()

    return this
  }

  async handle(req: Request, params: Parameters<Handler<T>>[1]): Promise<Response> {
    return (this.handlers[req.method as Method] ?? this.anyHandler)(req, params)
  }

  on(method: Method, handler: Handler<T>): MethodRouter<T> {
    this.handlers[method] = handler

    return this
  }

  options(handler: Handler<T>): MethodRouter<T> {
    return this.on('OPTIONS', handler)
  }

  patch(handler: Handler<T>): MethodRouter<T> {
    return this.on('PATCH', handler)
  }

  post(handler: Handler<T>): MethodRouter<T> {
    return this.on('POST', handler)
  }

  put(handler: Handler<T>): MethodRouter<T> {
    return this.on('PUT', handler)
  }

  trace(handler: Handler<T>): MethodRouter<T> {
    return this.on('TRACE', handler)
  }

  private anyHandler: Handler<T> = async () => status(405)

  private headHandler(): Handler<T> {
    return async (req, params) => {
      const res = await this.handlers.GET(req, params)

      return new Response(null, {
        headers: res.headers,
        status: res.status,
        statusText: res.statusText,
      })
    }
  }
}
