export const html = (body: string | TemplateStringsArray, ...substitutions: unknown[]) =>
  new Response(typeof body === 'string'
    ? body
    : String.raw(body, ...substitutions), {
    headers: {
      'Content-Type': 'text/html',
    },
  })
