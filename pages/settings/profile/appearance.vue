<script lang="ts" setup>
import { invoke } from '@vueuse/shared'
import type { UpdateCredentialsParams } from 'masto'
import { useForm } from 'slimeform'

const my = $computed(() => currentUser.value?.account)

const onlineSrc = $computed(() => ({
  avatar: my?.avatar || '',
  header: my?.header || '',
}))

const { form, reset, submitter } = useForm({
  form: () => ({
    displayName: my?.displayName ?? '',
    note: my?.note ?? '',

    avatar: null as null | File,
    header: null as null | File,

    // These look more like account and privacy settings than appearance settings
    // discoverable: false,
    // bot: false,
    // locked: false,
  }),
})

// Keep the information to be edited up to date
invoke(async () => {
  await pullMyAccountInfo()
  reset()
})

const { submit, submitting } = submitter(async ({ dirtyFields }) => {
  // ...
  const res = await useMasto().accounts.updateCredentials(dirtyFields.value)
    .then(account => ({ account }))
    .catch((error: Error) => ({ error }))

  if ('error' in res) {
    // TODO: Show error message
    console.error('Error(updateCredentials):', res.error)
    return
  }

  setAccountInfo(my!.id, res.account)
})
</script>

<template>
  <MainContent back>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.profile.appearance.title') }}</span>
      </div>
    </template>
    <div text-center mt-10>
      <h1 text-4xl>
        🚧
      </h1>
      <h3 text-xl>
        {{ $t('settings.profile.appearance.title') }}
      </h3>
    </div>
    <form @submit.prevent="submit">
      <!-- Form -->
    </form>
  </MainContent>
</template>
