<script lang="ts" setup>
import type { akkoma } from '@bdxtown/akko'
import { statusVisibilities } from './../../composables/akko/icons'

const client = useAkkoClient()
const isCanSubmit = ref<boolean>(true)
const failedMessages = ref<string[]>([])
const currentVisibility = computed(() => currentUser.value?.account.source.privacy)

const availableVisibilities = computed(() => statusVisibilities.filter(v => v.value !== 'direct'))

async function setVisibility(value: akkoma.v1.StatusVisibility) {
  if (!isCanSubmit.value)
    return
  isCanSubmit.value = false

  try {
    const account = await client.v1.accounts.updateCredentials({ source: { privacy: value } })
    const server = currentUser.value!.server

    if (!account.acct.includes('@'))
      account.acct = `${account.acct}@${server}`

    cacheAccount(account, server, true)
    currentUser.value!.account = account
  }
  catch (e) {
    console.error(e)
    failedMessages.value.push((e as Error).message)
  }
  finally {
    isCanSubmit.value = true
  }
}
</script>

<template>
  <CommonErrorMessage v-if="failedMessages.length > 0" described-by="save-failed" mx5>
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
  <div px5 py2>
    <div flex items-center gap-2>
      {{ $t('settings.preferences.default_privacy') }} <div v-if="!isCanSubmit" inline-block i-ri:loader-4-line animate-spin />
    </div>
    <div flex items-center gap2 mt-2 flex-wrap>
      <button
        v-for="visibility in availableVisibilities"
        :key="visibility.value"
        type="button"
        btn-text min-w-full sm:min-w-auto flex="~ gap-1 items-center" p3 border="~ base rounded" bg-base ws-nowrap
        :aria-pressed="currentVisibility === visibility.value"
        :class="currentVisibility === visibility.value ? 'pointer-events-none' : 'filter-saturate-0'"
        @click="() => setVisibility(visibility.value)"
      >
        <div :class="visibility.icon" />
        {{ $t(`visibility.${visibility.value}`) }}
      </button>
    </div>
  </div>
</template>
