import type { Handler } from '../../src/index.ts'
import type { RouterInterface } from './tool.ts'

import { MethodRouter } from '../../src/core/method-router.ts'
import { PathRouter } from '../../src/core/path-router.ts'
import { handler, routes } from './tool.ts'

const name = 'LeMMIH'
const router = new PathRouter()

// eslint-disable-next-line @masknet/no-top-level
for (const route of routes) {
  // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
  router.insert(route.path, new MethodRouter<undefined>().on(route.method, handler as unknown as Handler))
}

export const lemmihRouter: RouterInterface = {
  match: route => router.find(route.path),
  name,
}
