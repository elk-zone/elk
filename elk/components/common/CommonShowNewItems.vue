<script lang="ts" setup>
const { number, update } = defineProps<{
  number: number
  update: () => void
}>()
const emit = defineEmits(['click'])
const previousNumber = ref(0)
const { formatNumber } = useHumanReadableNumber()

const autoloadNewItems = usePreferences('autoloadNewItems')

function compare() {
  const top = window.pageYOffset || document.documentElement.scrollTop
  if (number !== previousNumber.value && autoloadNewItems.value && top < 50) {
    refresh()
  }
  previousNumber.value = number
}

function refresh() {
  update()
  emit('click')
}

watch(() => number, compare)

onMounted(compare)
</script>

<template>
  <button id="elk_show_new_items" py-4 border="b base" flex gap-2 items-center justify-center p-3 w-full text-primary font-bold @click="refresh">
    {{ $t('timeline.show_new_items', number, { named: { v: formatNumber(number) } }) }}
  </button>
</template>
