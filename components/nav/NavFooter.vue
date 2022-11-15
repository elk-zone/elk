<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore build time
const buildTime = __BUILD_TIME__
const buildTimeAgo = useTimeAgo(buildTime)
</script>

<template>
  <div p4 text-sm op25>
    A Mastodon client powered by Nuxt<br>
    Built <span :title="buildTime">{{ buildTimeAgo }}</span> · <a href="https://github.com/antfu/nuxtodon" target="_blank">GitHub</a>
  </div>
</template>
