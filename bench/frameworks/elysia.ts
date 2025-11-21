import { Elysia } from 'elysia'

// eslint-disable-next-line @masknet/no-top-level
new Elysia()
  .get('/', 'Hi')
  .get('/id/:id', (c) => {
    c.set.headers['x-powered-by'] = 'benchmark'

    return `${c.params.id} ${c.query.name}`
  })
  .post('/json', c => c.body, {
    parse: 'json',
  })
  .listen(3000)
