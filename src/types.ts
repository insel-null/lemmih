export type Handler = ((req: Request, params?: Record<string, string>) => MaybePromise<Response>) | MaybePromise<Response>

export type MaybePromise<T> = Promise<T> | T
