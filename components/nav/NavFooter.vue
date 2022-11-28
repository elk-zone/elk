<script setup lang="ts">
const buildTime = import.meta.env.__BUILD_TIME__ as string
const buildTimeAgo = useTimeAgo(buildTime)
</script>

<template>
  <footer p4 text-sm text-secondary-light flex="~ col">
    <div flex="~ gap2" items-center mb4>
      <button i-ri-sun-line dark:i-ri-moon-line text-lg @click="toggleDark()" />
      <button
        text-lg
        :class="isZenMode ? 'i-ri:layout-right-2-line' : 'i-ri:layout-right-line'"
        @click="toggleZenMode()"
      />
      <NavSelectLanguage />
    </div>
    <div>
      <button cursor-pointer hover:underline @click="openPreviewHelp">
        Show intro
      </button>
    </div>
    <div>A Mastodon client made with 🧡</div>
    <div>Built <time :datetime="buildTime" :title="buildTime">{{ buildTimeAgo }}</time> · <a href="https://github.com/elk-zone/elk" target="_blank">GitHub</a></div>
  </footer>
</template>
