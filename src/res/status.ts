import { STATUS_CODES } from '../deps/status-codes'

export const status = (status: number, init?: ResponseInit) =>
  new Response(STATUS_CODES[status as keyof typeof STATUS_CODES], {
    status,
    ...init,
  })

export const notFound = () => status(404)
