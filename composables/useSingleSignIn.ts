export const useSingleSignIn = () => {
  const singleInstanceServer = useAppConfig().singleInstanceServer
  const userSettings = useUserSettings()
  const users = useUsers()
  const { t } = useI18n()

  const busy = ref(false)

  async function signIn() {
    if (busy.value)
      return

    busy.value = true

    await nextTick()

    try {
      const href = await (globalThis.$fetch as any)(`/api/${publicServer.value}/login`, {
        method: 'POST',
        body: {
          force_login: users.value.length > 0,
          origin: location.origin,
          lang: userSettings.value.language,
        },
      })
      busy.value = false
      location.href = href
    }
    catch (err) {
      console.error(err)
      busy.value = false
      await openErrorDialog({
        title: t('common.error'),
        messages: [t('error.sign_in_error')],
        close: t('action.close'),
      })
    }
  }

  return { busy, signIn, singleInstanceServer }
}
