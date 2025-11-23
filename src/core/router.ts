import { newNode } from './node'

export class Router<T> {
  root = newNode<T>()

  find(path: string): undefined | { params: Record<string, string>, value?: T } {
    let currentNode = this.root
    const params: Record<string, string> = {}

    let wildcardPath = ''
    const segments = path.split('/').filter(Boolean)
    for (const [i, segment] of segments.entries()) {
      if (currentNode.children.has(segment)) {
        currentNode = currentNode.children.get(segment)!
      }
      else if (currentNode.param) {
        if (currentNode.param.paramName != null) {
          params[currentNode.param.paramName] = segment
        }
        currentNode = currentNode.param
      }
      else if (currentNode.wildcard) {
        wildcardPath = segments.slice(i).join('/')
        currentNode = currentNode.wildcard
        break
      }
      else {
        return
      }
    }

    if (currentNode.value != null) {
      if (wildcardPath)
        params['*'] = wildcardPath

      return { params, value: currentNode.value }
    }
  }

  insert(path: string, value: T): void {
    let currentNode = this.root
    const segments = path.split('/')

    for (let i = 0, len = segments.length; i < len; i++) {
      const segment = segments[i]
      // eslint-disable-next-line ts/strict-boolean-expressions -- performance
      if (!segment) {
        continue
      }
      if (segment[0] === ':') {
        if (currentNode.param === undefined) {
          currentNode.param = newNode()
          currentNode.param.paramName = segment.slice(1)
        }
        currentNode = currentNode.param
      }
      else if (segment === '*') {
        currentNode.wildcard ||= newNode()
        currentNode = currentNode.wildcard
        break
      }
      else {
        if (currentNode.children.has(segment)) {
          currentNode = currentNode.children.get(segment)!
        }
        else {
          const node = newNode<T>()
          currentNode.children.set(segment, node)
          currentNode = node
        }
      }
    }
    currentNode.value = value
  }
}
