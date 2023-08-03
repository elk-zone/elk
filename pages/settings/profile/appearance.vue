<script lang="ts" setup>
import type { mastodon } from 'masto'
import { useForm } from 'slimeform'
import { parse } from 'ultrahtml'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => `${t('settings.profile.appearance.title')} | ${t('nav.settings')}`,
})

const { client } = $(useMasto())

const avatarInput = ref<any>()
const headerInput = ref<any>()

const account = $computed(() => currentUser.value?.account)

const onlineSrc = $computed(() => ({
  avatar: account?.avatar || '',
  header: account?.header || '',
}))

const { form, reset, submitter, isDirty, isError } = useForm({
  form: () => {
    // For complex types of objects, a deep copy is required to ensure correct comparison of initial and modified values
    const fieldsAttributes = Array.from({ length: maxAccountFieldCount.value }, (_, i) => {
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

      bot: account?.bot ?? false,
      locked: account?.locked ?? false,

      // These look more like account and privacy settings than appearance settings
      // discoverable: false,
      // locked: false,
    }
  },
})

const isCanSubmit = computed(() => !isError.value && isDirty.value)
const failedMessages = $ref<string[]>([])

const { submit, submitting } = submitter(async ({ dirtyFields }) => {
  if (!isCanSubmit.value)
    return

  const res = await client.v1.accounts.updateCredentials(dirtyFields.value as mastodon.v1.UpdateCredentialsParams)
    .then(account => ({ account }))
    .catch((error: Error) => ({ error }))

  if ('error' in res) {
    console.error(res.error)
    failedMessages.push(res.error.message)
    return
  }

  const server = currentUser.value!.server

  if (!res.account.acct.includes('@'))
    res.account.acct = `${res.account.acct}@${server}`

  cacheAccount(res.account, server, true)
  currentUser.value!.account = res.account
  reset()
})

async function refreshInfo() {
  if (!currentUser.value)
    return
  // Keep the information to be edited up to date
  await refreshAccountInfo()
  if (!isDirty)
    reset()
}

useDropZone(avatarInput, (files) => {
  if (files?.[0])
    form.avatar = files[0]
})
useDropZone(headerInput, (files) => {
  if (files?.[0])
    form.header = files[0]
})

onHydrated(refreshInfo)
onReactivated(refreshInfo)
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
            ref="headerInput"
            v-model="form.header"
            :original="onlineSrc.header"
            w-full h-full
          />
        </div>
        <CommonCropImage v-model="form.header" :stencil-aspect-ratio="3 / 1" />

        <!-- avatar -->
        <div px-4 flex="~ gap4">
          <CommonInputImage
            ref="avatarInput"
            v-model="form.avatar"
            :original="onlineSrc.avatar"
            mt--10
            rounded-full border="bg-base 4"
            w="sm:30 24" min-w="sm:30 24" h="sm:30 24"
          />
        </div>
        <CommonCropImage v-model="form.avatar" />

        <div px4>
          <div flex justify-between>
            <AccountDisplayName
              :account="{ ...account, displayName: form.displayName }"
              font-bold sm:text-2xl text-xl
            />
            <div flex="~ row" items-center gap2>
              <label>
                <AccountLockIndicator show-label px2 py1>
                  <template #prepend>
                    <input v-model="form.locked" type="checkbox" cursor-pointer>
                  </template>
                </AccountLockIndicator>
              </label>
              <label>
                <AccountBotIndicator show-label px2 py1>
                  <template #prepend>
                    <input v-model="form.bot" type="checkbox" cursor-pointer>
                  </template>
                </AccountBotIndicator>
              </label>
            </div>
          </div>
          <AccountHandle :account="account" />
        </div>
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

        <SettingsProfileMetadata v-if="isHydrated" v-model="form" />

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
            v-if="failedMessages.length === 0"
            type="submit"
            btn-solid rounded-full text-sm
            flex gap-x-2 items-center
            :disabled="submitting || !isCanSubmit"
          >
            <span v-if="submitting" aria-hidden="true" block animate-spin preserve-3d>
              <span block i-ri:loader-2-fill aria-hidden="true" />
            </span>
            <span v-else aria-hidden="true" block i-ri:save-line />
            {{ $t('action.save') }}
          </button>

          <button
            v-else
            type="submit"
            btn-danger rounded-full text-sm
            flex gap-x-2 items-center
          >
            <span
              aria-hidden="true" block i-carbon:face-dizzy-filled
            />
            <span>{{ $t('state.save_failed') }}</span>
          </button>
        </div>

        <CommonErrorMessage v-if="failedMessages.length > 0" described-by="save-failed">
          <header id="save-failed" flex justify-between>
            <div flex items-center gap-x-2 font-bold>
              <div aria-hidden="true" i-ri:error-warning-fill />
              <p>{{ $t('state.save_failed') }}</p>
            </div>
            <CommonTooltip placement="bottom" :content="$t('action.clear_save_failed')">
              <button
                flex rounded-4 p1 hover:bg-active cursor-pointer transition-100 :aria-label="$t('action.clear_save_failed')"
                @click="failedMessages = []"
              >
                <span aria-hidden="true" w="1.75em" h="1.75em" i-ri:close-line />
              </button>
            </CommonTooltip>
          </header>
          <ol ps-2 sm:ps-1>
            <li v-for="(error, i) in failedMessages" :key="i" flex="~ col sm:row" gap-y-1 sm:gap-x-2>
              <strong>{{ i + 1 }}.</strong>
              <span>{{ error }}</span>
            </li>
          </ol>
        </CommonErrorMessage>
      </div>
    </form>
  </MainContent>
</template>
