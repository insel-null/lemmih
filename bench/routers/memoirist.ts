import type { RouterInterface } from './tool.ts'

import { Memoirist } from 'memoirist'

import { handler, routes } from './tool.ts'

const name = 'Memoirist'
const router = new Memoirist()

// eslint-disable-next-line @masknet/no-top-level
for (const route of routes) {
  router.add(route.method, route.path, handler)
}

export const memoiristRouter: RouterInterface = {
  match: (route) => {
    router.find(route.method, route.path)
  },
  name,
}
