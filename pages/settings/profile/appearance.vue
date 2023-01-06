<script lang="ts" setup>
import type { UpdateCredentialsParams } from 'masto'
import { useForm } from 'slimeform'
import { parse } from 'ultrahtml'

definePageMeta({
  middleware: 'auth',
  // Keep alive the form page will reduce raw data timeliness and its status timeliness
  keepalive: false,
})

const { t } = useI18n()

useHeadFixed({
  title: () => `${t('settings.profile.appearance.title')} | ${t('nav.settings')}`,
})

const account = $computed(() => currentUser.value.account)

const onlineSrc = $computed(() => ({
  avatar: account?.avatar || '',
  header: account?.header || '',
}))

const { form, reset, submitter, dirtyFields, isError } = useForm({
  form: () => {
    // For complex types of objects, a deep copy is required to ensure correct comparison of initial and modified values
    const fieldsAttributes = Array.from({ length: 4 }, (_, i) => {
      const field = { ...account?.fields?.[i] || { name: '', value: '' } }

      const linkElement = (parse(field.value)?.children?.[0])
      if (linkElement && linkElement?.attributes?.href)
        field.value = linkElement.attributes.href

      return field
    })
    return {
      displayName: account?.displayName ?? '',
      note: account?.source.note.replaceAll('\r', '') ?? '',

      avatar: null as null | File,
      header: null as null | File,

      fieldsAttributes,

      // These look more like account and privacy settings than appearance settings
      // discoverable: false,
      // bot: false,
      // locked: false,
    }
  },
})

onMastoInit(async () => {
  // Keep the information to be edited up to date
  await pullMyAccountInfo()
  reset()
})

const isCanSubmit = computed(() => !isError.value && !isEmptyObject(dirtyFields.value))

const { submit, submitting } = submitter(async ({ dirtyFields }) => {
  if (!isCanSubmit.value)
    return

  const res = await useMasto().accounts.updateCredentials(dirtyFields.value as UpdateCredentialsParams)
    .then(account => ({ account }))
    .catch((error: Error) => ({ error }))

  if ('error' in res) {
    // TODO: Show error message
    console.error('Error(updateCredentials):', res.error)
    return
  }

  setAccountInfo(account!.id, res.account)
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
      <div v-if="isHydrated && account">
        <!-- banner -->
        <div of-hidden bg="gray-500/20" aspect="3">
          <CommonInputImage
            v-model="form.header"
            :original="onlineSrc.header"
            w-full h-full
          />
        </div>
        <CommonCropImage v-model="form.header" :stencil-aspect-ratio="3 / 1" />

        <!-- avatar -->
        <div px-4 flex="~ gap4">
          <CommonInputImage
            v-model="form.avatar"
            :original="onlineSrc.avatar"
            mt--10
            rounded-full border="bg-base 4"
            w="sm:30 24" min-w="sm:30 24" h="sm:30 24"
          />
          <div flex="~ col gap1" self-end>
            <AccountDisplayName
              :account="{ ...account, displayName: form.displayName }"
              font-bold sm:text-2xl text-xl
            />
            <AccountHandle :account="account" />
          </div>
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

        <!-- metadata -->
        <div space-y-2>
          <div font-medium>
            {{ $t('settings.profile.appearance.profile_metadata') }}
          </div>
          <div text-sm text-secondary>
            {{ $t('settings.profile.appearance.profile_metadata_desc') }}
          </div>

          <SettingsProfileMetadata v-if="isHydrated" v-model:form="form" />
        </div>

        <!-- actions -->
        <div flex="~ gap2" justify-end>
          <button
            type="button"
            btn-text text-sm
            flex gap-x-2 items-center
            text-red
            @click="reset()"
          >
            <div aria-hidden="true" i-ri:eraser-line />
            {{ $t('action.reset') }}
          </button>

          <button
            type="submit"
            btn-solid rounded-full text-sm
            flex gap-x-2 items-center
            :disabled="submitting || !isCanSubmit"
          >
            <div
              aria-hidden="true"
              :class="submitting ? 'i-ri:loader-2-fill animate animate-spin' : 'i-ri:save-line'"
            />
            {{ $t('action.save') }}
          </button>
        </div>
      </div>
    </form>
  </MainContent>
</template>
