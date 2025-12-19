export type Handler<T = undefined> = (req: Request, params: T extends undefined
  ? Record<string, string> | undefined
  : T) => MaybePromise<Response | undefined>

export type Layer = (req: Request, next: StrictHandler) => MaybePromise<Response>

export type MaybePromise<T> = Promise<T> | T

export type StrictHandler = (req: Request) => Promise<Response>
