import { STATUS_CODES } from 'node:http'

export const status = (status: number) => new Response(STATUS_CODES[status], { status })
