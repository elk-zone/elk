<script setup lang="ts">
const props = defineProps<{
  code: string
  lang: string
}>()

const raw = computed(() => decodeURIComponent(props.code).replace(/&#39;/g, '\''))

const langMap: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  vue: 'html',
}

const hightlighted = computed(() => {
  return highlightCode(raw.value, langMap[props.lang] || props.lang as any)
})
</script>

<template>
  <pre class="code-block" v-html="hightlighted" />
</template>
