import type { Handler } from '../types'

export class Node {
  children: Map<string, Node> = new Map()
  param?: Node
  paramName?: string
  value?: Handler
  wildcard?: Node

  constructor(value?: Handler) {
    this.value = value
  }
}
