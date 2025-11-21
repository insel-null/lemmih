import type { MaybePromise } from "bun";

export type Handler = ((req: Request, params?: Record<string, string>) => MaybePromise<Response>) | MaybePromise<Response>
