export type Mutable<T> = {
  -readonly[P in keyof T]: T[P]
}

export type Overwrite<T, O> = Omit<T, keyof O> & O
export type MarkNonNullable<T, K extends keyof T> = Overwrite<T, {
  [P in K]-?: NonNullable<T[P]>
}>
