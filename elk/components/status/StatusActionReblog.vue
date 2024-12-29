<script lang="ts" setup>
import type { akkoma } from '@bdxtown/akko'

const { status, command, toggleReblog } = defineProps<{
  status: akkoma.v1.Status
  command?: boolean
  canReblog: boolean
  isLoading: { reblogged: boolean }
  toggleReblog: () => void
  quote: () => void
}>()

const userSettings = useUserSettings()

const shown = ref(false)

function toggle() {
  shown.value = !shown.value
}

function reblog() {
  toggle()
  toggleReblog()
}
</script>

<template>
  <VDropdown v-model:shown="shown" w-fit placement="bottom" :triggers="[]">
    <StatusActionButton
      :content="$t(status.reblogged ? 'action.boosted' : 'action.boost')"
      :text="!getPreferences(userSettings, 'hideBoostCount') && status.reblogsCount ? status.reblogsCount : ''"
      color="text-green" hover="text-green" elk-group-hover="bg-green/10"
      icon="i-ri:repeat-line"
      active-icon="i-ri:repeat-fill"
      inactive-icon="i-tabler:repeat-off"
      :active="!!status.reblogged"
      :disabled="isLoading.reblogged || !canReblog"
      :command="command"
      @click="toggle"
    >
      <template v-if="status.reblogsCount && !getPreferences(userSettings, 'hideBoostCount')" #text>
        <CommonLocalizedNumber
          keypath="action.boost_count"
          :count="status.reblogsCount"
        />
      </template>
    </StatusActionButton>
    <template #popper>
      <div flex flex-col gap-1 items-start>
        <button p-2 py-3 flex gap-2 items-center @click="reblog">
          <div :class="status.reblogged ? 'i-tabler:repeat-off' : 'i-ri:repeat-line'" />
          {{ $t(status.reblogged ? 'action.boosted' : 'action.boost') }}
        </button>
        <button p-2 py-3 flex gap-2 items-center @click="quote">
          <div i-ri:chat-quote-line />
          {{ $t('action.quote') }}
        </button>
      </div>
    </template>
  </VDropdown>
</template>
