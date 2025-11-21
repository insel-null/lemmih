import { App, res, routing } from '../../src'

const app = new App()
  .route('/', routing.get(res.text('Hello LeMMIH')))
  .route('/user/:id', routing.get((_, params) => res.text(params!.id!)))
  .route('/form', routing.post(async req => res.json(await req.json() as Record<string, unknown>)))

// eslint-disable-next-line @masknet/no-top-level
Bun.serve({
  ...app.build(),
  port: 3000,
})
