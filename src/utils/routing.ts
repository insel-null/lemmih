import type { Method } from '../core/method-router'
import type { Handler } from '../core/types'

import { MethodRouter } from '../core/method-router'

const routing = {
  any: <T>(...handlers: Handler<T>[]) => new MethodRouter<T>().any(handlers),
  connect: <T>(...handlers: Handler<T>[]) => new MethodRouter<T>().connect(handlers),
  delete: <T>(...handlers: Handler<T>[]) => new MethodRouter<T>().delete(handlers),
  get: <T>(...handlers: Handler<T>[]) => new MethodRouter<T>().get(handlers),
  on: <T>(method: Method, ...handlers: Handler<T>[]) => new MethodRouter<T>().on(method, handlers),
  patch: <T>(...handlers: Handler<T>[]) => new MethodRouter<T>().patch(handlers),
  post: <T>(...handlers: Handler<T>[]) => new MethodRouter<T>().post(handlers),
  put: <T>(...handlers: Handler<T>[]) => new MethodRouter<T>().put(handlers),
  trace: <T>(...handlers: Handler<T>[]) => new MethodRouter<T>().trace(handlers),
}

export default routing
