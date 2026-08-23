import { describe, expect, test } from 'bun:test'

import { PathRouter } from '../../src/core/path-router.ts'

describe('PathRouter', () => {
  test('falls back from a static branch to a parameter branch', () => {
    const router = new PathRouter<string>()
    router.insert('/foo/bar', 'static')
    router.insert('/foo/:id/edit', 'parameter')

    expect(router.find('/foo/bar/edit')).toEqual({
      params: { id: 'bar' },
      value: 'parameter',
    })
  })

  test('falls back from a parameter branch to a wildcard branch', () => {
    const router = new PathRouter<string>()
    router.insert('/foo/:id', 'parameter')
    router.insert('/foo/*', 'wildcard')

    expect(router.find('/foo/bar/baz')).toEqual({
      params: {},
      value: 'wildcard',
    })
  })

  test('keeps static routes ahead of parameter routes', () => {
    const router = new PathRouter<string>()
    router.insert('/foo/:id', 'parameter')
    router.insert('/foo/bar', 'static')

    expect(router.find('/foo/bar')).toEqual({
      params: {},
      value: 'static',
    })
  })
})
