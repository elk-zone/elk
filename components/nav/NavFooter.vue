<script setup lang="ts">
const { t } = useI18n()
const buildTime = import.meta.env.__BUILD_TIME__ as string
const buildTimeAgo = useTimeAgo(buildTime)
</script>

<template>
  <footer p4 text-sm text-secondary-light flex="~ col">
    <div flex="~ gap2" items-center mb4>
      <CommonTooltip :content="t('nav_footer.toggle_theme')">
        <button flex i-ri:sun-line dark:i-ri:moon-line text-lg @click="toggleDark()" />
      </CommonTooltip>
      <CommonTooltip :content="t('nav_footer.zen_mode')">
        <button
          flex
          text-lg
          :class="isZenMode ? 'i-ri:layout-right-2-line' : 'i-ri:layout-right-line'"
          @click="toggleZenMode()"
        />
      </CommonTooltip>
      <NavSelectLanguage />
      <NavSelectFeatureFlags v-if="currentUser" />
    </div>
    <div>
      <button cursor-pointer hover:underline @click="openPreviewHelp">
        {{ t('footer.show_intro') }}
      </button>
    </div>
    <div>{{ t('footer.a_mastodon_client_made_with') }}</div>
    <div>Built <time :datetime="buildTime" :title="buildTime">{{ buildTimeAgo }}</time> · <a href="https://github.com/elk-zone/elk" target="_blank">GitHub</a></div>
  </footer>
</template>
