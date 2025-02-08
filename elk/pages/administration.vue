<script lang="ts" setup>
definePageMeta({
  wideLayout: true,
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.admin'),
})
</script>

<template>
  <div>
    <div min-h-screen flex flex-col gap-3 p-5>
      <div timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:admin-line />
        <span>{{ $t('nav.admin') }}</span>
      </div>
      <div>
        <AdministrationLinks />
      </div>
    </div>
  </div>
</template>
