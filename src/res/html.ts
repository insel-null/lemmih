export const html = (body: ((html: typeof String.raw) => string) | string, init?: ResponseInit) =>
  new Response(typeof body === 'function'
    ? body(String.raw)
    : body, {
    ...init,
    headers: {
      'Content-Type': 'text/html',
      ...init?.headers,
    },
  })
