declare const self: ServiceWorkerGlobalScope

export const onShareTarget = (event: FetchEvent) => {
  if (!event.request.url.endsWith('/share-target') || event.request.method !== 'POST')
    return

  event.respondWith(Response.redirect('/home'))
  event.waitUntil(
    waitForClientToGetReady()
      .then(() => getClientAndFormData(event))
      .then(([client, data]) => sendShareTargetMessage(client, data)),
  )
}

async function sendShareTargetMessage(client: Client, data: FormData) {
  const text = data.get('text')
  if (text !== null) {
    client.postMessage({ text, action: 'compose-with-text' })
  }
  else {
    const files: File[] = []

    for (const [name, file] of data.entries()) {
      if (name === 'files' && file instanceof File)
        files.push(file)
    }

    if (files.length !== 0)
      client.postMessage({ files, action: 'compose-with-media' })
  }
}

async function getClientAndFormData(event: FetchEvent): Promise<[client: Client, formData: FormData]> {
  const client = await self.clients.get(event.resultingClientId)
  const data = await event.request.formData()
  return [client!, data]
}

function waitForClientToGetReady() {
  return new Promise<void>((resolve) => {
    self.addEventListener('message', (event) => {
      if (event.data.action === 'ready-to-receive')
        resolve()
    })
  })
}
