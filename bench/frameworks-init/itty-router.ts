import { AutoRouter, IttyRouter, json, text } from 'itty-router'

export const ittyRouter = () => IttyRouter()
  .get('/', () => text('Hi'))
  .post('/json', async req => req.json().then(json))
  .get('/id/:id', ({ params, query }) => text(`${params.id} ${query.name as string}`, {
    headers: {
      'x-powered-by': 'benchmark',
    },
  }))

export const ittyRouterAuto = () => AutoRouter()
  .get('/', () => text('Hi'))
  .post('/json', async req => req.json().then(json))
  .get('/id/:id', ({ params, query }) => text(`${params.id} ${query.name as string}`, {
    headers: {
      'x-powered-by': 'benchmark',
    },
  }))
