import type { Method } from '../core/method-router'
import type { Handler } from '../core/types'

import { MethodRouter } from '../core/method-router'

const routing = {
  any: <T>(handler: Handler<T>) => new MethodRouter<T>().any(handler),
  connect: <T>(handler: Handler<T>) => new MethodRouter<T>().connect(handler),
  delete: <T>(handler: Handler<T>) => new MethodRouter<T>().delete(handler),
  get: <T>(handler: Handler<T>) => new MethodRouter<T>().get(handler),
  on: <T>(method: Method, handler: Handler<T>) => new MethodRouter<T>().on(method, handler),
  patch: <T>(handler: Handler<T>) => new MethodRouter<T>().patch(handler),
  post: <T>(handler: Handler<T>) => new MethodRouter<T>().post(handler),
  put: <T>(handler: Handler<T>) => new MethodRouter<T>().put(handler),
  trace: <T>(handler: Handler<T>) => new MethodRouter<T>().trace(handler),
}

export default routing
