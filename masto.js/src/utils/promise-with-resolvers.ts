export interface PromiseWithResolvers<T, U = unknown> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T) => void;
  readonly reject: (reason: U) => void;
}

// https://github.com/tc39/proposal-promise-with-resolvers
export const createPromiseWithResolvers = <
  T,
  U = unknown,
>(): PromiseWithResolvers<T, U> => {
  let resolve!: (value: T) => void;
  let reject!: (reason: U) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};
