/* eslint-disable @masknet/no-top-level */
import { bench, run } from 'mitata'

import { elysia } from './elysia'
import { hono } from './hono'
import { honoTiny } from './hono-tiny'
import { lemmih } from './lemmih'

bench('elysia', () => elysia())
bench('hono', () => hono())
bench('hono/tiny', () => honoTiny())
bench('lemmih', () => lemmih())

// eslint-disable-next-line antfu/no-top-level-await
await run()
