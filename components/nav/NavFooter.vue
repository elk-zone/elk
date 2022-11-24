<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore build time
const buildTime = __BUILD_TIME__
const buildTimeAgo = useTimeAgo(buildTime)
</script>

<template>
  <div p4 text-sm op25 flex="~ col">
    <button i-ri-sun-line dark:i-ri-moon-line text-lg mb4 @click="toggleDark()" />
    <a cursor-pointer hover:underline @click="openPreviewHelp">Show intro</a>
    <div>A Mastodon client made with 💛</div>
    <div>Built <span :title="buildTime">{{ buildTimeAgo }}</span> · <a href="https://github.com/antfu/elk" target="_blank">GitHub</a></div>
  </div>
</template>
