<script setup lang="ts">
const { code, lang } = defineProps<{
  code: string
  lang?: string
}>()

const raw = computed(() => decodeURIComponent(code).replace(/&#39;/g, '\''))

const langMap: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  vue: 'html',
}

const highlighted = computed(() => {
  return lang ? highlightCode(raw.value, (langMap[lang] || lang) as any) : raw
})
</script>

<template>
  <pre v-if="lang" class="code-block" v-html="highlighted" />
  <pre v-else class="code-block">{{ raw }}</pre>
</template>
