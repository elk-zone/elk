import type { Ref } from 'vue'

export function useSignIn(input?: Ref<HTMLInputElement | undefined>) {
  const singleInstanceServer = useRuntimeConfig().public.singleInstance
  const { t } = useI18n()

  const busy = ref(false)
  const error = ref(false)
  const server = ref('')
  const displayError = ref(false)

  async function oauth() {
    if (busy.value)
      return

    busy.value = true
    error.value = false
    displayError.value = false

    await nextTick()

    if (!singleInstanceServer && server.value)
      server.value = server.value.split('/')[0]

    const domain = `${!singleInstanceServer ? (server.value || publicServer.value) : publicServer.value}`

    try {
      const client = await createApp(domain)
      await redirectToInstanceLogin(client, domain)
    }
    catch (err) {
      if (singleInstanceServer) {
        console.error(err)
        busy.value = false
        await openErrorDialog({
          title: t('common.error'),
          messages: [t('error.sign_in_error')],
          close: t('action.close'),
        })
      }
      else {
        displayError.value = true
        error.value = true
        await nextTick()
        input?.value?.focus()
        await nextTick()
        setTimeout(() => {
          busy.value = false
          error.value = false
        }, 512)
      }
    }
  }

  return { busy, displayError, error, server, singleInstanceServer, oauth }
}
