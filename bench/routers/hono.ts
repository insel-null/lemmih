import { PatternRouter } from 'hono/router/pattern-router'
import { RegExpRouter } from 'hono/router/reg-exp-router'
import { TrieRouter } from 'hono/router/trie-router'
import type { Router } from 'hono/router'
import type { RouterInterface } from './tool.ts'
import { routes, handler } from './tool.ts'

const createHonoRouter = (name: string, router: Router<unknown>): RouterInterface => {
  for (const route of routes) {
    router.add(route.method, route.path, handler)
  }
  return {
    name: `Hono ${name}`,
    match: (route) => {
      router.match(route.method, route.path)
    },
  }
}

export const regExpRouter = createHonoRouter('RegExpRouter', new RegExpRouter())
export const trieRouter = createHonoRouter('TrieRouter', new TrieRouter())
export const patternRouter = createHonoRouter('PatternRouter', new PatternRouter())
