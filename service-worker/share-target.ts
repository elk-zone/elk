import { get } from 'idb-keyval'
import type { UserLogin } from './types'

declare const self: ServiceWorkerGlobalScope

export const onShareTarget = (event: FetchEvent) => {
  if (!event.request.url.endsWith('/web-share-target') || event.request.method !== 'POST')
    return

  event.waitUntil(handleSharedTarget(event))
}

async function handleSharedTarget(event: FetchEvent) {
  const signedIn = await checkUserSignedIn()
  // TODO: handle
  if (!signedIn) {
    event.respondWith(Response.redirect('/share-target'))
    await waitForClientToGetReady()

    return
  }

  event.respondWith(Response.redirect('/home'))
  await waitForClientToGetReady()

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

function waitForClientToGetReady() {
  return new Promise<void>((resolve) => {
    self.addEventListener('message', (event) => {
      if (event.data.action === 'ready-to-receive')
        resolve()
    })
  })
}

async function checkUserSignedIn() {
  const users = await get<UserLogin[]>('elk-users')
  return users !== undefined && users.length !== 0
}

function getClientAndFormData(event: FetchEvent): Promise<[client: Client | undefined, formData: FormData]> {
  return Promise.all([
    self.clients.get(event.resultingClientId),
    event.request.formData(),
  ])
}
