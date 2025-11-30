/* eslint-disable @masknet/no-top-level */
import { bench, run, summary } from 'mitata'

import { elysia } from './elysia'
import { hono, honoQuick, honoTiny } from './hono'
// import { ittyRouter, ittyRouterAuto } from './itty-router'
import { lemmih, lemmihBun } from './lemmih'

summary(() => {
  bench('elysia', () => elysia())
  bench('hono', () => hono())
  bench('hono/quick', () => honoQuick())
  bench('hono/tiny', () => honoTiny())
  // bench('itty-router/IttyRouter', () => ittyRouter())
  // bench('itty-router/AutoRouter', () => ittyRouterAuto())
  bench('lemmih', () => lemmih())
  bench('lemmih/bun', () => lemmihBun())
})

// eslint-disable-next-line antfu/no-top-level-await
await run()
