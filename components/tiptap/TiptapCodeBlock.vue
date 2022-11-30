<script setup lang="ts">
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const languages = [
  'js',
  'ts',
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
    <div relative my2 class="code-block">
      <select v-model="selectedLanguage" contenteditable="false" absolute top-1 right-1 rounded px2 op0 hover:op100 focus:op100 transition>
        <option :value="null">
          plain
        </option>
        <option v-for="(language, index) in languages" :key="index" :value="language">
          {{ language }}
        </option>
      </select>
      <pre><code><NodeViewContent /></code></pre>
    </div>
  </NodeViewWrapper>
</template>
