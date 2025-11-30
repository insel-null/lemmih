import { AutoRouter, json, text } from 'itty-router'

const app = AutoRouter()

// eslint-disable-next-line @masknet/no-top-level
app
  .get('/', () => text('Hi'))
  .post('/json', async req => req.json().then(json))
  .get('/id/:id', ({ params, query }) => text(`${params.id} ${query.name as string}`, {
    headers: {
      'x-powered-by': 'benchmark',
    },
  }))

// eslint-disable-next-line @masknet/no-top-level
Bun.serve({
  fetch: app.fetch,
  port: 3000,
})
