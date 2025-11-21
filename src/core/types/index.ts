export type Handler<T = undefined> = (req: Request, params: T extends undefined
  ? Record<string, string> | undefined
  : T) => MaybePromise<Response>

export type Layer = (req: Request, next: Next) => MaybePromise<Response>

export type MaybePromise<T> = Promise<T> | T

export type Next = () => MaybePromise<Response>

export type StrictHandler = (req: Request) => Promise<Response>
