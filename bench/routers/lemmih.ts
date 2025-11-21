import type { Handler } from '../../src/index.ts'
import type { RouterInterface } from './tool.ts'
import { routes, handler } from './tool.ts'
import { routing } from '../../src/index.ts'
import { Router } from '../../src/core/router.ts'

const name = 'LeMMIH'
const router = new Router()

for (const route of routes) {
  router.insert(route.path, routing[route.method.toLowerCase() as 'get' | 'post'](handler as unknown as Handler))
}

export const lemmihRouter: RouterInterface = {
  name,
  match: (route) => router.find(route.path),
}
