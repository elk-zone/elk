<script setup lang="ts">


const { t } = useI18n()

useHeadFixed({
  title: () => t('title.federated_timeline'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/public" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:group-2-line />
        <span>{{ t('title.federated_timeline') }}</span>
      </NuxtLink>
    </template>

    <TimelinePublic v-if="isMastoInitialised" />
  </MainContent>
</template>
