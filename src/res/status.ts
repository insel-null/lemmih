import { STATUS_CODES } from '../deps/status-codes'

export const status = (status: number) => new Response(STATUS_CODES[status as keyof typeof STATUS_CODES], { status })

export const notFound = () => status(404)
