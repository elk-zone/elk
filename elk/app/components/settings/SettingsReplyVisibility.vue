<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'

const currentVisibility = usePreferences('replyVisibility')

const replyVisibilities: { label: string, icon: string, value: akkoma.rest.v1.ListTimelineParams['replyVisibility'] }[] = [
  {
    value: 'self',
    icon: 'i-ri:user-line',
    label: 'null',
  },
  {
    value: 'following',
    icon: 'i-ri:group-line',
    label: 'null',
  },
  {
    value: null,
    icon: 'i-ri:user-community-line',
    label: 'null',
  },
]

function setVisibility(value: akkoma.rest.v1.ListTimelineParams['replyVisibility']) {
  currentVisibility.value = value
}
</script>

<template>
  <div px5 py2>
    <div flex items-center gap-2>
      {{ $t('settings.preferences.reply_visibility') }}
    </div>
    <div block text-sm text-secondary>
      {{ $t('settings.preferences.reply_visibility_description') }}
    </div>
    <div flex items-center gap2 mt-2 flex-wrap>
      <button
        v-for="visibility in replyVisibilities"
        :key="visibility.value || 'null'"
        type="button"
        btn-text min-w-full sm:min-w-auto flex="~ gap-1 items-center" p3 border="~ base rounded" bg-base ws-nowrap
        :aria-pressed="currentVisibility === visibility.value"
        :class="currentVisibility === visibility.value ? 'pointer-events-none' : 'filter-saturate-0'"
        @click="() => setVisibility(visibility.value)"
      >
        <div :class="visibility.icon" />
        {{ $t(`reply_visibility.${visibility.value}`) }}
      </button>
    </div>
  </div>
</template>
