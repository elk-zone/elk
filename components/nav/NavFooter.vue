<script setup lang="ts">
const buildTime = import.meta.env.__BUILD_TIME__ as string
const buildTimeDate = new Date(buildTime)

const timeAgoOptions = useTimeAgoOptions()

const buildTimeAgo = useTimeAgo(buildTime, timeAgoOptions)
</script>

<template>
  <footer p4 text-sm text-secondary-light flex="~ col">
    <div flex="~ gap2" items-center mb4>
      <CommonTooltip :content="$t('nav_footer.toggle_theme')">
        <button flex i-ri:sun-line dark:i-ri:moon-line text-lg :aria-label="$t('nav_footer.toggle_theme')" @click="toggleDark()" />
      </CommonTooltip>
      <CommonTooltip :content="$t('nav_footer.zen_mode')">
        <button
          flex
          text-lg
          :class="isZenMode ? 'i-ri:layout-right-2-line' : 'i-ri:layout-right-line'"
          :aria-label="$t('nav_footer.zen_mode')"
          @click="toggleZenMode()"
        />
      </CommonTooltip>
      <NavSelectLanguage />
      <NavSelectFeatureFlags v-if="currentUser" />
    </div>
    <div>
      <button cursor-pointer hover:underline @click="openPreviewHelp">
        {{ $t('nav_footer.show_intro') }}
      </button>
    </div>
    <div>{{ $t('app_desc_short') }}</div>
    <div>
      <i18n-t keypath="nav_footer.built_at">
        <time :datetime="buildTime" :title="$d(buildTimeDate, 'long')">{{ buildTimeAgo }}</time>
      </i18n-t> · <a href="https://github.com/elk-zone/elk" target="_blank">GitHub</a>
    </div>
  </footer>
</template>
