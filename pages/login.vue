<script setup lang="ts">
import { login } from 'masto'
import { DEFAULT_SERVER } from '~/plugins/masto'

const server = useCookie('nuxtodon-server')
const token = useCookie('nuxtodon-token')

async function oauth() {
  const client = await login({
    url: `https://${server.value || DEFAULT_SERVER}`,
  })
  const redirectUri = `${location.origin}/api/${server.value || DEFAULT_SERVER}/oauth`
  const app = await client.apps.create({
    clientName: 'Nuxtodon',
    redirectUris: redirectUri,
    scopes: 'read write follow push',
  })

  console.log({ app })

  const url = `https://${server.value || DEFAULT_SERVER}/oauth/authorize
?client_id=${app.clientId}
&scope=read+write+follow+push
&redirect_uri=${encodeURIComponent(redirectUri)}
&response_type=code`.replace(/\n/g, '')

  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.click()
}
</script>

<template>
  <div p4>
    <button @click="oauth()">
      OAuth
    </button>
    <input
      v-model="server"
      placeholder="Server URL"
      bg-transparent text-current
      border="~ border" p="x2 y1" w-full
      outline-none
    >
    <input
      v-model="token"
      placeholder="Token"
      bg-transparent text-current
      border="~ border" p="x2 y1" w-full
      outline-none
    >
  </div>
</template>
