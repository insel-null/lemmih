import { run, bench, group, summary } from 'mitata'
import { regExpRouter, trieRouter, patternRouter } from './hono.ts'
import type { Route, RouterInterface } from './tool.ts'
import { lemmihRouter } from './lemmih.ts'
import { memoiristRouter } from './memoirist.ts'

const routers: RouterInterface[] = [
  regExpRouter,
  trieRouter,
  patternRouter,
  lemmihRouter,
  memoiristRouter,
]

const routes: (Route & { name: string })[] = [
  {
    name: 'short static',
    method: 'GET',
    path: '/user',
  },
  {
    name: 'static with same radix',
    method: 'GET',
    path: '/user/comments',
  },
  {
    name: 'dynamic route',
    method: 'GET',
    path: '/user/lookup/username/hey',
  },
  {
    name: 'mixed static dynamic',
    method: 'GET',
    path: '/event/abcd1234/comments',
  },
  {
    name: 'post',
    method: 'POST',
    path: '/event/abcd1234/comment',
  },
  {
    name: 'long static',
    method: 'GET',
    path: '/very/deeply/nested/route/hello/there',
  },
  {
    name: 'wildcard',
    method: 'GET',
    path: '/static/index.html',
  },
]

for (const route of routes) {
  summary(() => {
    group(`${route.name} - ${route.method} ${route.path}`, () => {
      for (const router of routers) {
        bench(router.name, async () => {
          router.match(route)
        })
      }
    })
  })
}

group('all together', () => {
  summary(() => {
    for (const router of routers) {
      bench(router.name, async () => {
        for (const route of routes) {
          router.match(route)
        }
      })
    }
  })
})

await run()
