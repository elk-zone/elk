import type { Ref } from 'vue'

export function useSignIn(input?: Ref<HTMLInputElement | undefined>) {
  const runtimeConfig = useRuntimeConfig()
  const singleInstanceServer = runtimeConfig.public.singleInstance
  const defaultServer = runtimeConfig.public.defaultServer
  const userSettings = useUserSettings()
  const users = useUsers()
  const { t } = useI18n()

  const busy = ref(false)
  const error = ref(false)
  const server = ref(singleInstanceServer ? '' : (defaultServer || ''))
  const displayError = ref(false)

  async function oauth() {
    if (busy.value)
      return

    // Open a new tab synchronously to preserve user-gesture context (avoids popup blockers).
    // Will be navigated to the real OAuth URL once we have it.
    let popup: Window | null = null
    if (typeof window !== 'undefined')
      popup = window.open('about:blank', '_blank')

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

      if (popup && !popup.closed) {
        popup.location.href = href
        const interval = setInterval(() => {
          if (popup!.closed) {
            clearInterval(interval)
            busy.value = false
            // Reload so the parent picks up the new user from localStorage.
            location.reload()
          }
        }, 500)
      }
      else {
        // Popup was blocked — fall back to full-page redirect (original behavior).
        location.href = href
      }
    }
    catch (err) {
      if (popup && !popup.closed)
        popup.close()
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
