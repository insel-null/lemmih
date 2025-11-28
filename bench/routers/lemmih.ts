import type { Handler } from '../../src/index.ts'
import type { RouterInterface } from './tool.ts'

import { Router } from '../../src/core/router.ts'
import { routing } from '../../src/index.ts'
import { handler, routes } from './tool.ts'

const name = 'LeMMIH'
const router = new Router()

// eslint-disable-next-line @masknet/no-top-level
for (const route of routes) {
  // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
  router.insert(route.path, routing.on(route.method, handler as unknown as Handler))
}

export const lemmihRouter: RouterInterface = {
  match: route => router.find(route.path),
  name,
}
