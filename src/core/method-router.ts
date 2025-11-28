import type { Handler } from './types'

import { status } from '../res'

export type Method = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE'

export class MethodRouter<T> {
  private anyHandler: Handler<T>
  private handlers: Record<string, Handler<T>>

  constructor() {
    this.handlers = Object.create(null) as Record<string, Handler<T>>
    this.anyHandler = async () => status(405)
  }

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
    return this.on('GET', handler)
  }

  async handle(req: Request, params: Parameters<Handler<T>>[1]): Promise<Response> {
    return (this.handlers[req.method] ?? this.anyHandler)(req, params)
  }

  head(handler: Handler<T>): MethodRouter<T> {
    return this.on('HEAD', handler)
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
}
