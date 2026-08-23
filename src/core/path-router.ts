export interface PathRouterNode<T> {
  children: Map<string, PathRouterNode<T>>
  param?: PathRouterNode<T>
  paramName?: string
  value?: T
  wildcard?: PathRouterNode<T>
}

interface PathRouterMatchState<T> {
  node: PathRouterNode<T>
  paramName?: string
  params?: Record<string, string>
  paramValue?: string
  segmentIndex: number
}

const pushMatchState = <T>(
  alternatives: PathRouterMatchState<T>[] | undefined,
  node: PathRouterNode<T>,
  segmentIndex: number,
  params: Record<string, string> | undefined,
  paramName?: string,
  paramValue?: string,
): PathRouterMatchState<T>[] => {
  alternatives ||= []
  alternatives.push({ node, paramName, params, paramValue, segmentIndex })
  return alternatives
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

  // eslint-disable-next-line sonarjs/cognitive-complexity -- the explicit branches preserve route priority while backtracking
  find(path: string): undefined | { params: Record<string, string>, value?: T } {
    const segments = path.split('/')
    let currentNode = this.root
    let params: Record<string, string> | undefined
    let segmentIndex = 0
    let alternatives: PathRouterMatchState<T>[] | undefined

    while (segmentIndex < segments.length && segments[segmentIndex] === '')
      segmentIndex++

    while (true) {
      if (segmentIndex >= segments.length) {
        if (currentNode.value != null)
          return { params: params ?? {}, value: currentNode.value }
      }
      else {
        const segment = segments[segmentIndex]!
        let nextSegmentIndex = segmentIndex + 1
        while (nextSegmentIndex < segments.length && segments[nextSegmentIndex] === '')
          nextSegmentIndex++

        const child = currentNode.children.get(segment)
        const param = currentNode.param
        const wildcard = currentNode.wildcard

        if (child) {
          // Keep lower-priority branches so a static branch that fails later
          // can fall back to a parameter or wildcard branch.
          if (wildcard)
            alternatives = pushMatchState(alternatives, wildcard, segments.length, params)
          if (param)
            alternatives = pushMatchState(alternatives, param, nextSegmentIndex, params, param.paramName, segment)

          currentNode = child
          segmentIndex = nextSegmentIndex
          continue
        }

        if (param) {
          if (wildcard)
            alternatives = pushMatchState(alternatives, wildcard, segments.length, params)

          currentNode = param
          params = param.paramName != null
            ? { ...(params ?? {}), [param.paramName]: segment }
            : params
          segmentIndex = nextSegmentIndex
          continue
        }

        if (wildcard) {
          currentNode = wildcard
          segmentIndex = segments.length
          continue
        }
      }

      const alternative = alternatives?.pop()
      if (!alternative)
        return

      currentNode = alternative.node
      params = alternative.paramName != null
        ? { ...(alternative.params ?? {}), [alternative.paramName]: alternative.paramValue! }
        : alternative.params
      segmentIndex = alternative.segmentIndex
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
