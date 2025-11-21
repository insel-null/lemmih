import type { MaybePromise } from "bun";

export type Handler = ((req: Request) => MaybePromise<Response>) | MaybePromise<Response>
