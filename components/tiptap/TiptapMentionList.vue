<script setup lang="ts">
import type { Account } from 'masto'

const { items, command } = defineProps<{
  items: Account[]
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
    command({ id: item.acct })
}

defineExpose({
  onKeyDown,
})
</script>

<template>
  <div relative bg-base text-base shadow border="~ base rounded" text-sm py-2 overflow-x-hidden overflow-y-auto max-h-100>
    <template v-if="items.length">
      <button
        v-for="(item, index) in items"
        :key="index"
        :class="index === selectedIndex ? 'bg-active' : 'op50'"
        block m0 w-full text-left px2 py1
        @click="selectItem(index)"
      >
        <AccountInfo :link="false" :account="item" />
      </button>
    </template>
    <div v-else block m0 w-full text-left px2 py1 italic op30>
      No result
    </div>
  </div>
</template>
