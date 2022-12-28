<script setup lang="ts">
import buildInfo from 'virtual:build-info'

const timeAgoOptions = useTimeAgoOptions()

const buildTimeDate = new Date(buildInfo.time)
const buildTimeAgo = useTimeAgo(buildTimeDate, timeAgoOptions)

const colorMode = useColorModeRef()
function toggleDark() {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <footer p4 text-sm text-secondary-light flex="~ col">
    <div flex="~ gap2" items-center mb4>
      <CommonTooltip :content="$t('nav.toggle_theme')">
        <button flex i-ri:sun-line dark:i-ri:moon-line text-lg :aria-label="$t('nav.toggle_theme')" @click="toggleDark()" />
      </CommonTooltip>
      <CommonTooltip :content="$t('nav.zen_mode')">
        <button
          flex
          text-lg
          :class="isZenMode ? 'i-ri:layout-right-2-line' : 'i-ri:layout-right-line'"
          :aria-label="$t('nav.zen_mode')"
          @click="toggleZenMode()"
        />
      </CommonTooltip>
      <CommonTooltip :content="$t('nav.settings')">
        <NuxtLink
          flex
          text-lg
          to="/settings"
          i-ri:settings-4-line
          :aria-label="$t('nav.settings')"
        />
      </CommonTooltip>
    </div>
    <div>
      <button cursor-pointer hover:underline @click="openPreviewHelp">
        {{ $t('nav.show_intro') }}
      </button>
    </div>
    <div>{{ $t('app_desc_short') }}</div>
    <div>
      <i18n-t keypath="nav.built_at">
        <time :datetime="String(buildTimeDate)" :title="$d(buildTimeDate, 'long')">{{ buildTimeAgo }}</time>
      </i18n-t>
      <template v-if="buildInfo.version">
        &middot;
        v{{ buildInfo.version }}
      </template>
      <template v-if="buildInfo.commit && buildInfo.branch !== 'release'">
        &middot;
        <NuxtLink
          external
          :href="`https://github.com/elk-zone/elk/commit/${buildInfo.commit}`"
          target="_blank"
          font-mono
        >
          {{ buildInfo.commit.slice(0, 7) }}
        </NuxtLink>
      </template>
    </div>
    <div>
      <a href="https://m.webtoo.ls/@elk" target="_blank">Mastodon</a> &middot; <a href="https://chat.elk.zone" target="_blank">Discord</a> &middot; <a href="https://github.com/elk-zone" target="_blank">GitHub</a>
    </div>
  </footer>
</template>
