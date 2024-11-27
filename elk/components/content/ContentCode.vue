<script setup lang="ts">
const props = defineProps<{
  code: string
  lang?: string
}>()

const raw = computed(() => decodeURIComponent(props.code).replace(/&#39;/g, '\''))

const langMap: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  vue: 'html',
}

const highlighted = computed(() => {
  return props.lang ? highlightCode(raw.value, (langMap[props.lang] || props.lang) as any) : raw
})
</script>

<template>
  <pre v-if="lang" class="code-block" v-html="highlighted" />
  <pre v-else class="code-block">{{ raw }}</pre>
</template>
