import { App, res, routing } from '../../src'

const app = new App()
  .route('/', routing.get(() => res.text('Hello LeMMIH')))
  .route('/user/:id', routing.get((_, { id }) => res.text(id)))
  .route('/form', routing.post(async req => res.json(await req.json())))

// eslint-disable-next-line @masknet/no-top-level
Bun.serve({
  fetch: app.fetch,
  port: 3000,
})
