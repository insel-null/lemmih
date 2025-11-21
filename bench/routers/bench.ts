import type { Route, RouterInterface } from './tool.ts'

import { bench, group, run, summary } from 'mitata'

import { patternRouter, regExpRouter, trieRouter } from './hono.ts'
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
    method: 'GET',
    name: 'short static',
    path: '/user',
  },
  {
    method: 'GET',
    name: 'static with same radix',
    path: '/user/comments',
  },
  {
    method: 'GET',
    name: 'dynamic route',
    path: '/user/lookup/username/hey',
  },
  {
    method: 'GET',
    name: 'mixed static dynamic',
    path: '/event/abcd1234/comments',
  },
  {
    method: 'POST',
    name: 'post',
    path: '/event/abcd1234/comment',
  },
  {
    method: 'GET',
    name: 'long static',
    path: '/very/deeply/nested/route/hello/there',
  },
  {
    method: 'GET',
    name: 'wildcard',
    path: '/static/index.html',
  },
]

// eslint-disable-next-line @masknet/no-top-level
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

// eslint-disable-next-line @masknet/no-top-level
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

// eslint-disable-next-line @masknet/no-top-level, antfu/no-top-level-await
await run()
