/* eslint-disable @masknet/no-top-level */
import { bench, run, summary } from 'mitata'

import { elysia } from './elysia'
import { hono, honoQuick, honoTiny } from './hono'
import { lemmih, lemmihBun } from './lemmih'

summary(() => {
  bench('elysia', () => elysia())
  bench('hono', () => hono())
  bench('hono/quick', () => honoQuick())
  bench('hono/tiny', () => honoTiny())
  bench('lemmih', () => lemmih())
  bench('lemmih/bun', () => lemmihBun())
})

// eslint-disable-next-line antfu/no-top-level-await
await run()
