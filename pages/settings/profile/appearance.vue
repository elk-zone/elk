<script lang="ts" setup>
import { invoke } from '@vueuse/shared'
import { useForm } from 'slimeform'

definePageMeta({
  // Keep alive the form page will reduce raw data timeliness and its status timeliness
  keepalive: false,
})

const router = useRouter()

const my = $computed(() => currentUser.value?.account)

watch($$(my), (value) => {
  if (!value)
    router.push('/')
})

const onlineSrc = $computed(() => ({
  avatar: my?.avatar || '',
  header: my?.header || '',
}))

const { form, reset, submitter, dirtyFields, isError } = useForm({
  form: () => ({
    displayName: my?.displayName ?? '',
    note: my?.source.note.replaceAll('\r', '') ?? '',

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

const isCanSubmit = computed(() => !isError.value && !isEmptyObject(dirtyFields.value))

const { submit, submitting } = submitter(async ({ dirtyFields }) => {
  const res = await useMasto().accounts.updateCredentials(dirtyFields.value)
    .then(account => ({ account }))
    .catch((error: Error) => ({ error }))

  if ('error' in res) {
    // TODO: Show error message
    console.error('Error(updateCredentials):', res.error)
    return
  }

  setAccountInfo(my!.id, res.account)
  reset()
})
</script>

<template>
  <MainContent back>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.profile.appearance.title') }}</span>
      </div>
    </template>

    <form space-y-5 px4 py3 @submit.prevent="submit">
      <!-- banner -->
      <div space-y-2>
        <p font-medium>
          Banner
        </p>
        <SettingsUploadHeader v-model="form.header" :original="onlineSrc.header" />
      </div>
      <!-- avatar -->
      <div space-y-2>
        <p font-medium>
          Avatar
        </p>
        <SettingsUploadAvatar v-model="form.avatar" :original="onlineSrc.avatar" />
      </div>

      <!-- display name -->
      <label space-y-2 block>
        <p font-medium>
          {{ $t('settings.profile.appearance.display_name') }}
        </p>
        <input v-model="form.displayName" type="text" input-base>
      </label>

      <!-- note -->
      <label space-y-2 block>
        <p font-medium>
          {{ $t('settings.profile.appearance.bio') }}
        </p>
        <textarea v-model="form.note" maxlength="500" min-h-10ex input-base />
      </label>

      <!-- submit -->
      <div text-right>
        <button
          type="submit"
          btn-solid rounded-full text-sm
          flex-inline gap-x-2 items-center
          :disabled="submitting || !isCanSubmit"
        >
          <span
            aria-hidden="true"
            inline-block
            :class="submitting ? 'i-ri:loader-2-fill animate animate-spin' : 'i-ri:save-line'"
          />
          <span>
            {{ $t('action.save') }}
          </span>
        </button>
      </div>
    </form>
  </MainContent>
</template>
