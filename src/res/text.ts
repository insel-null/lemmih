export const text = (body: string, init?: ResponseInit) =>
  new Response(body, {
    ...init,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...init?.headers,
    },
  })
