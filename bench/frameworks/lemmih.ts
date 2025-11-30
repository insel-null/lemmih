import { parse } from 'fast-querystring'

import { App, res, routing } from '../../src'

const app = new App()

// eslint-disable-next-line @masknet/no-top-level
app
  .route('/', routing.get(() => res.text('Hi')))
  .route('/json', routing.post(async req => req.json().then(res.json)))
  .route('/id/:id', routing.get((req, { id }) => new Response(`${id} ${parse(req.url.split('?')[1]!).name}`, {
    headers: {
      'x-powered-by': 'benchmark',
    },
  }),
  ))

// eslint-disable-next-line @masknet/no-top-level
Bun.serve({
  fetch: app.fetch,
  port: 3000,
})
