import type { Handler } from "../types";

export class Node {
  value?: Handler
  children: Map<string, Node> = new Map()
  param?: Node
  wildcard?: Node
  paramName?: string

  constructor(value?: Handler) {
    this.value = value;
  }
}
