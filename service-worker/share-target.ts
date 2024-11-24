/// <reference lib="WebWorker" />
declare const self: ServiceWorkerGlobalScope

const clientResolves: { [key: string]: () => void } = {}

self.addEventListener('message', (event) => {
  if (event.data.action !== 'ready-to-receive')
    return

  const id: string | undefined = (event.source as any)?.id ?? undefined

  if (id && clientResolves[id] !== undefined)
    clientResolves[id]()
})

export function onShareTarget(event: FetchEvent) {
  if (!event.request.url.endsWith('/web-share-target') || event.request.method !== 'POST')
    return

  event.waitUntil(handleSharedTarget(event))
}

async function handleSharedTarget(event: FetchEvent) {
  event.respondWith(Response.redirect('/home?share-target=true', 303))
  await waitForClientToGetReady(event.resultingClientId)

  const [client, formData] = await getClientAndFormData(event)
  if (client === undefined)
    return

  await sendShareTargetMessage(client, formData)
}

async function sendShareTargetMessage(client: Client, data: FormData) {
  const sharedData: {
    textParts: string[]
    files: File[]
  } = {
    textParts: [],
    files: [],
  }

  // We collect the text data shared with us
  const title = data.get('title')
  if (title !== null)
    sharedData.textParts.push(title.toString())

  const text = data.get('text')
  if (text !== null)
    sharedData.textParts.push(text.toString())

  const link = data.get('link')
  if (link !== null)
    sharedData.textParts.push(link.toString())

  // We collect the files shared with us
  for (const [name, file] of data.entries()) {
    if (name === 'files' && file instanceof File)
      sharedData.files.push(file)
  }

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
