import { App, res, routing } from '../../src'
import { App as BunApp } from '../../src/bun'

export const lemmih = () => new App()
  .route('/', routing.get(() => res.text('Hi')))
  .route('/json', routing.post(async req => req.json().then(res.json)))
  .route('/id/:id', routing.get((req, { id }) => new Response(`${id} ${new URL(req.url).searchParams.get('name')}`, {
    headers: {
      'x-powered-by': 'benchmark',
    },
  }),
  ))
  .fetch

export const lemmihBun = () => new BunApp()
  .route('/', routing.get(() => res.text('Hi')))
  .route('/json', routing.post(async req => req.json().then(res.json)))
  .route('/id/:id', routing.get((req, { id }) => new Response(`${id} ${new URL(req.url).searchParams.get('name')}`, {
    headers: {
      'x-powered-by': 'benchmark',
    },
  }),
  ))
  .build()
