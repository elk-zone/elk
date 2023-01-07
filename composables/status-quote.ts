import type { Status } from 'masto'

type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
}

export type StatusQuote = RecursivePartial<Status>
