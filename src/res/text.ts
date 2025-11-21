export const text = (body: string | TemplateStringsArray, ...substitutions: unknown[]) =>
  new Response(typeof body === 'string'
    ? body
    : String.raw(body, ...substitutions),
    {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    }
  )
