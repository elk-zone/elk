export type Direction = "next" | "prev";

// eslint-disable-next-line prettier/prettier
export interface Paginator<Entity, Params = undefined> extends PromiseLike<Entity> { 
  /**
   * Get the current direction of the paginator.
   * @returns The current direction of the paginator.
   */
  getDirection(): Direction;

  /**
   * Creates a new paginator with the given direction.
   * @param direction New direction of the paginator.
   * @returns A new paginator with the given direction.
   */
  setDirection(direction: Direction): Paginator<Entity, Params>;

  /**
   * Clones the paginator.
   * @returns A new paginator with the same direction and parameters.
   */
  clone(): Paginator<Entity, Params>;

  next(params?: Params | string): Promise<IteratorResult<Entity, undefined>>;
  return(
    value: undefined | PromiseLike<undefined>,
  ): Promise<IteratorResult<Entity, undefined>>;
  throw(e?: unknown): Promise<IteratorResult<Entity, undefined>>;

  values(): AsyncIterableIterator<Entity>;

  [Symbol.asyncIterator](): AsyncIterator<
    Entity,
    undefined,
    Params | string | undefined
  >;
}
