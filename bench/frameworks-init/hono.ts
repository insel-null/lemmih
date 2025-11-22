import { Hono } from 'hono'

export const hono = () => new Hono()
  .get('/', c => c.text('Hi'))
  // @ts-expect-error ignore types
  .post('/json', async c => c.req.json().then(c.json))
  .get('/id/:id', (c) => {
    const id = c.req.param('id')
    const name = c.req.query('name')

    c.header('x-powered-by', 'benchmark')

    return c.text(`${id} ${name}`)
  })
  .fetch
