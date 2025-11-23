export interface Node<T> {
  children: Map<string, Node<T>>
  param?: Node<T>
  paramName?: string
  value?: T
  wildcard?: Node<T>
}

export const newNode = <T>(value?: T): Node<T> => ({
  children: new Map(),
  param: undefined,
  paramName: undefined,
  value,
  wildcard: undefined,
})
