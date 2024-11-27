export interface Pool<T> {
  acquire(): Promise<T>;
}
