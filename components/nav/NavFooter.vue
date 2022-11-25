<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore build time
const buildTime = __BUILD_TIME__
const buildTimeAgo = useTimeAgo(buildTime)
</script>

<template>
  <div p4 text-sm op25 flex="~ col">
    <div flex="~ gap2">
      <button i-ri-sun-line dark:i-ri-moon-line text-lg mb4 @click="toggleDark()" />
      <button
        text-lg mb4
        :class="isZenMode ? 'i-ri:layout-right-2-line' : 'i-ri:layout-right-line'"
        @click="toggleZenMode()"
      />
    </div>
    <a cursor-pointer hover:underline @click="openPreviewHelp">Show intro</a>
    <div>A Mastodon client made with 💛</div>
    <div>Built <time :datetime="buildTime" :title="buildTime">{{ buildTimeAgo }}</time> · <a href="https://github.com/elk-zone/elk" target="_blank">GitHub</a></div>
  </div>
</template>
