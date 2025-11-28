export interface PathRouterNode<T> {
  children: Map<string, PathRouterNode<T>>
  param?: PathRouterNode<T>
  paramName?: string
  value?: T
  wildcard?: PathRouterNode<T>
}

export const createNode = <T>(value?: T): PathRouterNode<T> => ({
  children: new Map(),
  param: undefined,
  paramName: undefined,
  value,
  wildcard: undefined,
})

export class PathRouter<T> {
  root = createNode<T>()

  find(path: string): undefined | { params: Record<string, string>, value?: T } {
    let currentNode = this.root
    let params: Record<string, string> | undefined

    const segments = path.split('/')
    for (let i = 0, len = segments.length; i < len; i++) {
      const segment = segments[i]
      // eslint-disable-next-line ts/strict-boolean-expressions
      if (!segment)
        continue

      const child = currentNode.children.get(segment)
      if (child) {
        currentNode = child
      }
      else if (currentNode.param) {
        currentNode = currentNode.param
        if (currentNode.param?.paramName != null) {
          params ||= {}
          params[currentNode.param.paramName] = segment
        }
      }
      else if (currentNode.wildcard) {
        currentNode = currentNode.wildcard
        // params ||= {}
        // params['*'] = segments.slice(i).filter(Boolean).join('/')
        break
      }
      else {
        return
      }
    }

    if (currentNode.value != null) {
      // if (wildcardPath)
      //   params['*'] = wildcardPath

      // return { params, value: currentNode.value }
      return { params: params ?? {}, value: currentNode.value }
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
          currentNode.param = createNode()
          currentNode.param.paramName = segment.slice(1)
        }
        currentNode = currentNode.param
      }
      else if (segment === '*') {
        currentNode.wildcard ||= createNode()
        currentNode = currentNode.wildcard
        break
      }
      else {
        if (currentNode.children.has(segment)) {
          currentNode = currentNode.children.get(segment)!
        }
        else {
          const node = createNode<T>()
          currentNode.children.set(segment, node)
          currentNode = node
        }
      }
    }
    currentNode.value = value
  }
}
