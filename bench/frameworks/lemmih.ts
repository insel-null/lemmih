import { res, routing } from '../../src'
import { App } from '../../src/bun'

const app = new App()

// eslint-disable-next-line @masknet/no-top-level
app
  .route('/', routing.get(() => res.text('Hi')))
  .route('/json', routing.post(async req => req.json().then(res.json)))
  .route('/id/:id', routing.get((req, param) => new Response(`${param!.id!} ${new URL(req.url).searchParams.get('name')}`, {
    headers: {
      'x-powered-by': 'benchmark',
    },
  }),
  ))

// eslint-disable-next-line @masknet/no-top-level
Bun.serve({
  ...app.build(),
  port: 3000,
})
