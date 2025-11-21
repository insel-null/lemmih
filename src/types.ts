export type Handler = ((req: Request, params?: Record<string, string>) => MaybePromise<Response>) | MaybePromise<Response>

export type Layer = (req: Request, next: Next) => MaybePromise<Response>

export type MaybePromise<T> = Promise<T> | T

export type Next = () => MaybePromise<Response>

export type StrictHandler = (req: Request) => Promise<Response>
