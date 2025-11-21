import { Node } from './node'

export class Router<T> {
  root: Node<T>

  constructor() {
    this.root = new Node()
  }

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
    const segments = path.split('/').filter(Boolean)
    for (const segment of segments) {
      if (segment.startsWith(':')) {
        if (!currentNode.param) {
          currentNode.param = new Node()
          currentNode.param.paramName = segment.substring(1)
        }
        currentNode = currentNode.param
      }
      else if (segment === '*') {
        if (!currentNode.wildcard) {
          currentNode.wildcard = new Node()
        }
        currentNode = currentNode.wildcard
        break
      }
      else {
        if (!currentNode.children.has(segment)) {
          currentNode.children.set(segment, new Node())
        }
        currentNode = currentNode.children.get(segment)!
      }
    }
    currentNode.value = value
  }
}
