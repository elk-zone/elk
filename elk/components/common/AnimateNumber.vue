<script setup lang="ts">
const { increased } = defineProps<{
  increased?: boolean
}>()

function getAnimation(newValue: boolean, oldValue: boolean) {
  if (newValue && !oldValue) {
    return 'rotate'
  }
  else if (!newValue && oldValue) {
    return 'rotate-inverse'
  }
  return ''
}

const animation = ref(getAnimation(increased, increased))

watch(() => increased, (newValue, oldValue) => {
  animation.value = getAnimation(newValue, oldValue || false)
}, { immediate: true })
</script>

<template>
  <div of-hidden h="1.25rem">
    <div flex="~ col" :class="animation">
      <slot />
      <slot name="next" />
    </div>
  </div>
</template>

<style scoped>
@keyframes rotate {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-50%);
  }
}
@keyframes rotate-inverse {
  100% {
    transform: translateY(0);
  }

  0% {
    transform: translateY(-50%);
  }
}

.rotate {
  animation: 300ms ease both rotate;
}

.rotate-inverse {
  animation: 300ms ease both rotate-inverse;
}
</style>
