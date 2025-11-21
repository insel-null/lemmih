export type TypedParams<Path extends string>
  = Path extends `/${infer Rest}`
    ? TypedParams<Rest>
    : Path extends `${infer Segment}/${infer Rest}`
      ? PathSegment<Segment> & TypedParams<Rest>
      : Path extends ''
        ? EmptyObject
        : PathSegment<Path>

type EmptyObject = Record<never, never>

type PathSegment<S extends string>
  = S extends '*'
    ? { '*': string }
    : S extends `:${infer ParamName}`
      ? { [K in ParamName]: string }
      : EmptyObject
