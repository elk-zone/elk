import type { akkoma } from '@bdxtown/akko'

export class DedupPaginator<Params> implements akkoma.Paginator<akkoma.v1.Status[], Params> {
  private paginator: akkoma.Paginator<akkoma.v1.Status[], Params>
  private previousIds: string

  constructor(paginator: akkoma.Paginator<akkoma.v1.Status[], Params>) {
    this.paginator = paginator
    this.previousIds = ''
  }

  filter(data: akkoma.v1.Status[]): akkoma.v1.Status[] {
    const value = [] as akkoma.v1.Status[]
    (data).forEach((status) => {
      if (!this.previousIds.includes(status.reblog?.id || status.id))
        value.push(status)
      if (status.reblog)
        this.previousIds = `${this.previousIds}-${status.reblog.id}`
    })
    return value
  }

  getDirection(): 'next' | 'prev' {
    return this.paginator.getDirection()
  }

  setDirection(direction: 'next' | 'prev'): DedupPaginator<Params> {
    return new DedupPaginator(this.paginator.setDirection(direction))
  }

  clone(): DedupPaginator<Params> {
    return new DedupPaginator(this.paginator.clone())
  }

  async next(params?: string | Params | undefined): Promise<IteratorResult<akkoma.v1.Status[], undefined>> {
    const result = await this.paginator.next(params)
    return {
      done: !result.done ? false : undefined,
      value: this.filter(result.value || []),
    }
  }

  return(value: undefined | PromiseLike<undefined>): Promise<IteratorResult<akkoma.v1.Status[], undefined>> {
    return this.paginator.return(value)
  }

  throw(e?: unknown): Promise<IteratorResult<akkoma.v1.Status[], undefined>> {
    return this.paginator.throw(e)
  }

  values(): AsyncIterableIterator<akkoma.v1.Status[]> {
    throw new Error('Method not implemented.')
  }

  [Symbol.asyncIterator](): AsyncIterator<akkoma.v1.Status[], undefined, string | Params | undefined> {
    throw new Error('Method not implemented.')
  }

  then<TResult1 = akkoma.v1.Status[], TResult2 = never>(_onfulfilled?: ((value: akkoma.v1.Status[]) => TResult1 | PromiseLike<TResult1>) | null | undefined, _onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
    throw new Error('Method not implemented.')
  }
}
