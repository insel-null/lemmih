export const json = <T extends Record<string, unknown>>(body: T) => Response.json(body)
