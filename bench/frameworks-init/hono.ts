import { Hono } from 'hono'
import { Hono as HonoQuick } from 'hono/quick'
import { Hono as HonoTiny } from 'hono/tiny'

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

export const honoTiny = () => new HonoTiny()
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

export const honoQuick = () => new HonoQuick()
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
