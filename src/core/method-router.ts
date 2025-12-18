import type { Handler } from './types'

import { status } from '../res'

export type Method = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE'

export class MethodRouter<T = undefined> {
  private anyHandler: Handler<T>[] = [async () => status(405)]

  private handlers: Record<Method, Handler<T>[]> = Object.create(null) as Record<string, Handler<T>[]>

  any(handlers: Handler<T>[]): MethodRouter<T> {
    this.anyHandler = handlers
    return this
  }

  connect(handlers: Handler<T>[]): MethodRouter<T> {
    return this.on('CONNECT', handlers)
  }

  delete(handlers: Handler<T>[]): MethodRouter<T> {
    return this.on('DELETE', handlers)
  }

  get(handlers: Handler<T>[]): MethodRouter<T> {
    this.handlers.GET = handlers
    this.handlers.HEAD = [this.headHandler()]

    return this
  }

  async handle(req: Request, params: Parameters<Handler<T>>[1]): Promise<Response> {
    const handlers = this.handlers[req.method as Method] ?? this.anyHandler
    return this.runHandlers(handlers, req, params)
  }

  on(method: Method, handlers: Handler<T>[]): MethodRouter<T> {
    this.handlers[method] = handlers

    return this
  }

  options(handlers: Handler<T>[]): MethodRouter<T> {
    return this.on('OPTIONS', handlers)
  }

  patch(handlers: Handler<T>[]): MethodRouter<T> {
    return this.on('PATCH', handlers)
  }

  post(handlers: Handler<T>[]): MethodRouter<T> {
    return this.on('POST', handlers)
  }

  put(handlers: Handler<T>[]): MethodRouter<T> {
    return this.on('PUT', handlers)
  }

  trace(handlers: Handler<T>[]): MethodRouter<T> {
    return this.on('TRACE', handlers)
  }

  private headHandler(): Handler<T> {
    return async (req, params) => {
      const handlers = this.handlers.GET ?? this.anyHandler
      const res = await this.runHandlers(handlers, req, params)

      return new Response(null, {
        headers: res.headers,
        status: res.status,
        statusText: res.statusText,
      })
    }
  }

  private async runHandlers(handlers: Handler<T>[], req: Request, params: Parameters<Handler<T>>[1]): Promise<Response> {
    let res: Response | undefined
    for (let i = 0, len = handlers.length; i < len; i++) {
      res = await handlers[i]!(req, params)
      if (res != null)
        break
    }
    // TODO: throw a type error if res is undefined here
    return res!
  }
}
