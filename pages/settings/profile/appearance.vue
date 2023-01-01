<script lang="ts" setup>
import { useForm } from 'slimeform'

definePageMeta({
  middleware: 'auth',
  // Keep alive the form page will reduce raw data timeliness and its status timeliness
  keepalive: false,
})

const acccount = $computed(() => currentUser.value?.account)

const onlineSrc = $computed(() => ({
  avatar: acccount?.avatar || '',
  header: acccount?.header || '',
}))

const { form, reset, submitter, dirtyFields, isError } = useForm({
  form: () => ({
    displayName: acccount?.displayName ?? '',
    note: acccount?.source.note.replaceAll('\r', '') ?? '',

    avatar: null as null | File,
    header: null as null | File,

    // These look more like account and privacy settings than appearance settings
    // discoverable: false,
    // bot: false,
    // locked: false,
  }),
})

watch(isMastoInitialised, async (val) => {
  if (!val)
    return

  // Keep the information to be edited up to date
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

  setAccountInfo(acccount!.id, res.account)
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

    <form space-y-5 @submit.prevent="submit">
      <div>
        <!-- banner -->
        <div of-hidden bg="gray-500/20" aspect="3">
          <CommonInputImage
            v-if="isHydrated"
            ref="elInputImage"
            v-model="form.header"
            :original="onlineSrc.header"
            w-full h-full
          />
        </div>
        <CommonCropImage v-model="form.header" :stencil-aspect-ratio="3 / 1" />

        <!-- avatar -->
        <div px-4>
          <CommonInputImage
            v-if="isHydrated"
            v-model="form.avatar"
            :original="onlineSrc.avatar"
            mt--10
            rounded-full border="bg-base 4"
            w="sm:30 24" min-w="sm:30 24" h="sm:30 24"
          />
        </div>
        <CommonCropImage v-model="form.avatar" />
      </div>

      <div px4 py3 space-y-5>
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
      </div>
    </form>
  </MainContent>
</template>
