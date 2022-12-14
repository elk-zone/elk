<script lang="ts" setup>
definePageMeta({
  layout: 'settings',
})
</script>

<template>
  <div min-h-screen flex>
    <div border="none md:l md:r base">
      <MainContent>
        <template #title>
          <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
            <div i-ri:test-tube-line />
            <span>Settings Nav</span>
          </div>
        </template>
        <div text-center mt-10 w-97>
          <h1 text-4xl>
            🚧
          </h1>
          <h3 text-xl>
            Settings Nav
          </h3>
        </div>
      </MainContent>
    </div>
    <div flex-1>
      <NuxtPage />
    </div>
  </div>
</template>
