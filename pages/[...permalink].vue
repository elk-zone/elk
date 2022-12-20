<script setup lang="ts">
import { hasProtocol, parseURL } from 'ufo'

definePageMeta({
  middleware: async (to) => {
    const permalink = Array.isArray(to.params.permalink)
      ? to.params.permalink.join('/')
      : to.params.permalink

    if (hasProtocol(permalink)) {
      const { host, pathname } = parseURL(permalink)

      if (host)
        return `/${host}${pathname}`
    }

    // We've reached a page that doesn't exist
    return false
  },
})
</script>

<template>
  <div />
</template>
