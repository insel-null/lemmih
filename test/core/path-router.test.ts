import { describe, expect, it } from 'vitest'

import { PathRouter } from '../../src/core/path-router.ts'

describe('path-router', () => {
  it('falls back from a static branch to a parameter branch', () => {
    const router = new PathRouter<string>()
    router.insert('/foo/bar', 'static')
    router.insert('/foo/:id/edit', 'parameter')

    expect(router.find('/foo/bar/edit')).toEqual({
      params: { id: 'bar' },
      value: 'parameter',
    })
  })

  it('falls back from a parameter branch to a wildcard branch', () => {
    const router = new PathRouter<string>()
    router.insert('/foo/:id', 'parameter')
    router.insert('/foo/*', 'wildcard')

    expect(router.find('/foo/bar/baz')).toEqual({
      params: {},
      value: 'wildcard',
    })
  })

  it('keeps static routes ahead of parameter routes', () => {
    const router = new PathRouter<string>()
    router.insert('/foo/:id', 'parameter')
    router.insert('/foo/bar', 'static')

    expect(router.find('/foo/bar')).toEqual({
      params: {},
      value: 'static',
    })
  })

  it('falls back to a root wildcard after a static branch ends early', () => {
    const router = new PathRouter<string>()
    router.insert('/v1/example', 'static')
    router.insert('/*', 'fallback')

    expect(router.find('/v1')).toEqual({
      params: {},
      value: 'fallback',
    })
    expect(router.find('/v1/example')).toEqual({
      params: {},
      value: 'static',
    })
  })

  it('falls back to the trie for non-canonical static paths', () => {
    const router = new PathRouter<string>()
    router.insert('/foo', 'static')

    expect(router.find('/foo/')).toEqual({
      params: {},
      value: 'static',
    })
  })
})
