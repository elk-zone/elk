export const useSingleSignIn = () => {
  const userSettings = useUserSettings()
  const singleInstanceServer = useAppConfig().buildInfo.singleInstanceServer
  const { t } = useI18n()

  let busy = $ref<boolean>(false)

  async function signIn() {
    if (busy)
      return

    busy = true

    await nextTick()

    try {
      location.href = await (globalThis.$fetch as any)(`/api/${publicServer.value}/login`, {
        method: 'POST',
        body: {
          force_login: true,
          origin: location.origin,
          lang: userSettings.value.language,
        },
      })
    }
    catch (err) {
      console.error(err)
      busy = false
      await openErrorDialog({
        title: t('common.error'),
        messages: [t('error.sign_in_error')],
        close: t('action.close'),
      })
    }
    finally {
      busy = false
    }
  }

  return { busy, signIn, singleInstanceServer }
}
