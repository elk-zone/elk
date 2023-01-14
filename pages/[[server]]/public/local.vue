<script setup lang="ts">

const { t } = useI18n()

useHeadFixed({
  title: () => t('title.local_timeline'),
})

if (process.server) {
  const masto = useMasto()
  const route = useRoute()
  // render OG tags for crawlers
  const client = await masto.loginTo({
    server: route.params.server as string,
  })
  const server = await client.v1.instances.fetch()
  if (server) {
    useHead({
      title: `${t('title.local_timeline')} | ${server.title}`,
      meta: [
        { property: 'og:title', content: `${t('title.local_timeline')} | ${server.title}` },
        { property: 'og:description', content: removeHTMLTags(server.description) },
        ...server.thumbnail ? [{ property: 'og:image', content: server.thumbnail || '' }] : [],
      ],
    })
  }
}
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/public/local" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:group-2-line />
        <span>{{ t('title.local_timeline') }}</span>
      </NuxtLink>
    </template>

    <TimelinePublicLocal v-if="isMastoInitialised" />
  </MainContent>
</template>
