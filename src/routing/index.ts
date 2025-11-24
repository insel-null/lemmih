import type { Method } from '../core/method-router'
import type { Handler } from '../core/types'

import { MethodRouter } from '../core/method-router'

export const any = <T>(handler: Handler<T>) => new MethodRouter<T>().any(handler)
export const connect = <T>(handler: Handler<T>) => new MethodRouter<T>().connect(handler)
export const del = <T>(handler: Handler<T>) => new MethodRouter<T>().delete(handler)
export const get = <T>(handler: Handler<T>) => new MethodRouter<T>().get(handler)
export const head = <T>(handler: Handler<T>) => new MethodRouter<T>().head(handler)
export const on = <T>(method: Method, handler: Handler<T>) => new MethodRouter<T>().on(method, handler)
export const patch = <T>(handler: Handler<T>) => new MethodRouter<T>().patch(handler)
export const post = <T>(handler: Handler<T>) => new MethodRouter<T>().post(handler)
export const put = <T>(handler: Handler<T>) => new MethodRouter<T>().put(handler)
export const trace = <T>(handler: Handler<T>) => new MethodRouter<T>().trace(handler)
