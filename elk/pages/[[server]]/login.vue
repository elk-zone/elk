<script setup lang="ts">
import { retrieveAccessToken } from '~/composables/akko/akko'

const { t } = useI18n()

const route = useRoute()
const singleInstanceServer = useRuntimeConfig().public.singleInstance
const domain = (singleInstanceServer ? publicServer.value : route.params.server as string).replace(/https:\/\//g, '')

const router = useRouter()

async function finalizeAuth() {
  if (!isHydrated.value)
    return
  try {
    await retrieveAccessToken(domain, route.query.code as string)
  }
  catch (e) {
    console.error(e)
    await openErrorDialog({
      title: t('common.error'),
      messages: [t('error.sign_in_error')],
      close: t('action.close'),
    })
    router.push({ path: '/', force: true })
  }
}

watch(isHydrated, finalizeAuth)
</script>

<template>
  <div class="flex items-center justify-center m-4 gap-2">
    <div i-ri:loader-4-line animate-spin /> {{ t('common.login') }}
  </div>
</template>
