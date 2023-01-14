/// <reference lib="WebWorker" />
declare const self: ServiceWorkerGlobalScope

const clientResolves: { [key: string]: Function } = {}

self.addEventListener('message', (event) => {
  if (event.data.action !== 'ready-to-receive')
    return

  const id: string | undefined = (event.source as any)?.id ?? undefined

  if (id && clientResolves[id] !== undefined)
    clientResolves[id]()
})

export const onShareTarget = (event: FetchEvent) => {
  if (!event.request.url.endsWith('/web-share-target') || event.request.method !== 'POST')
    return

  event.waitUntil(handleSharedTarget(event))
}

async function handleSharedTarget(event: FetchEvent) {
  event.respondWith(Response.redirect('/home?share-target=true'))
  await waitForClientToGetReady(event.resultingClientId)

  const [client, formData] = await getClientAndFormData(event)
  if (client === undefined)
    return

  await sendShareTargetMessage(client, formData)
}

async function sendShareTargetMessage(client: Client, data: FormData) {
  const sharedData: { text?: string; files?: File[] } = {}

  const text = data.get('text')
  if (text !== null)
    sharedData.text = text.toString()

  const files: File[] = []
  for (const [name, file] of data.entries()) {
    if (name === 'files' && file instanceof File)
      files.push(file)
  }

  if (files.length !== 0)
    sharedData.files = files

  client.postMessage({ data: sharedData, action: 'compose-with-shared-data' })
}

function waitForClientToGetReady(clientId: string) {
  return new Promise<void>((resolve) => {
    clientResolves[clientId] = resolve
  })
}

function getClientAndFormData(event: FetchEvent): Promise<[client: Client | undefined, formData: FormData]> {
  return Promise.all([
    self.clients.get(event.resultingClientId),
    event.request.formData(),
  ])
}
