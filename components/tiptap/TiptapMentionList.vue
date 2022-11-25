<script setup lang="ts">
const { items, command } = defineProps<{
  items: any[]
  command: Function
}>()

let selectedIndex = $ref(0)

watch(items, () => {
  selectedIndex = 0
})

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    selectedIndex = ((selectedIndex + items.length) - 1) % items.length
    return true
  }
  else if (event.key === 'ArrowDown') {
    selectedIndex = (selectedIndex + 1) % items.length
    return true
  }
  else if (event.key === 'Enter') {
    selectItem(selectedIndex)
    return true
  }

  return false
}

function selectItem(index: number) {
  const item = items[index]
  if (item)
    command({ id: item })
}

defineExpose({
  onKeyDown,
})
</script>

<template>
  <div relative bg-base text-base shadow border="~ base rounded" text-sm>
    <template v-if="items.length">
      <button
        v-for="(item, index) in items"
        :key="index"
        :class="index === selectedIndex ? 'bg-active' : 'op50'"
        block m0 w-full text-left px2 py1
        @click="selectItem(index)"
      >
        {{ item }}asd
      </button>
    </template>
    <div v-else block m0 w-full text-left px2 py1 italic op30>
      No result
    </div>
  </div>
</template>
