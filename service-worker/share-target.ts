declare const self: ServiceWorkerGlobalScope

export const onShareTarget = (event) => {
  if (!event.request.url.endsWith('/share-target') || event.request.method !== 'POST')
    return

  event.respondWith(Response.redirect('/home'))
  event.waitUntil(
    (async function () {
      await waitForClientToGetReady()

      const client = await self.clients.get(event.resultingClientId)
      const data = await event.request.formData()

      const text = data.get('text')
      if (text !== null) {
        client?.postMessage({ text, action: 'compose-with-text' })
      }
      else {
        const files: File[] = []

        for (const [name, file] of data.entries()) {
          if (name === 'files')
            files.push(file)
        }

        if (files.length !== 0)
          client?.postMessage({ files, action: 'compose-with-media' })
      }
    })(),
  )
}

function waitForClientToGetReady() {
  return new Promise<void>((resolve) => {
    self.addEventListener('message', (event) => {
      if (event.data.action === 'ready-to-receive')
        resolve()
    })
  })
}
