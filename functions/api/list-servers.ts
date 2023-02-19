import type { EventContext, KVNamespace, PagesFunction } from '@cloudflare/workers-types'
import { listServers } from '../shared'

interface Env {
  STORAGE: KVNamespace
}

export const onRequestGet: PagesFunction<Env> = async (context: EventContext): Response | Promise<Response> => {
  return listServers(context.env.STORAGE)
    .then((serverList: string[]) => {
      return new Response(serverList, { status: 200 })
    })
    .catch((reason: Error) => {
      const m = `Encountered ${reason.name} while trying to update server list: ${reason.message}`
      console.error(m)
      return new Response(m, { status: 500 })
    })
}
