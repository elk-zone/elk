<script setup lang="ts">
const props = defineProps<{ class?: string }>()
const { config } = useFrontendConfig()
</script>

<template>
  <nav :class="props.class" flex flex-col gap-6>
    <NuxtLink v-for="link in config?.links" :key="link.url" target="_blank" flex gap-2 text-lg :href="link.url">
      <div grayscale>
        {{ link.icon }}
      </div>
      {{ link.text }}
    </NuxtLink>
  </nav>
</template>
