<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const languages = [
  'c',
  'cpp',
  'csharp',
  'css',
  'dart',
  'go',
  'html',
  'java',
  'javascript',
  'jsx',
  'kotlin',
  'python',
  'rust',
  'svelte',
  'swift',
  'tsx',
  'typescript',
  'vue',
]

const selectedLanguage = computed({
  get() {
    return props.node.attrs.language
  },
  set(language) {
    props.updateAttributes({ language })
  },
})
</script>

<template>
  <NodeViewWrapper>
    <div relative my2>
      <select
        v-model="selectedLanguage"
        contenteditable="false"
        absolute top-1 right-1 rounded px2 op0 hover:op100 focus:op100 transition
        outline-none border="~ base"
      >
        <option :value="null">
          plain
        </option>
        <option v-for="(language, index) in languages" :key="index" :value="language">
          {{ language }}
        </option>
      </select>
      <pre class="code-block"><code><NodeViewContent /></code></pre>
    </div>
  </NodeViewWrapper>
</template>
