import type { Ref } from 'vue'

export function useSignIn(input?: Ref<HTMLInputElement | undefined>) {
  const singleInstanceServer = useRuntimeConfig().public.singleInstance
  const userSettings = useUserSettings()
  const users = useUsers()
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

    try {
      let href: string
      if (singleInstanceServer) {
        href = await (globalThis.$fetch as any)(`/api/${publicServer.value}/login`, {
          method: 'POST',
          body: {
            force_login: users.value.length > 0,
            origin: location.origin,
            lang: userSettings.value.language,
          },
        })
        busy.value = false
      }
      else {
        href = await (globalThis.$fetch as any)(`/api/${server.value || publicServer.value}/login`, {
          method: 'POST',
          body: {
            force_login: users.value.some(u => u.server === server.value),
            origin: location.origin,
            lang: userSettings.value.language,
          },
        })
      }
      location.href = href
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
