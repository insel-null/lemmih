export class Node<T> {
  children: Map<string, Node<T>> = new Map()
  param?: Node<T>
  paramName?: string
  value?: T
  wildcard?: Node<T>

  constructor(value?: T) {
    this.value = value
  }
}
