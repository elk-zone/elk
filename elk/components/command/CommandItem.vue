<script setup lang="ts">
import type { ResolvedCommand } from '~/composables/command'

const {
  cmd,
  index,
  active = false,
} = defineProps<{
  cmd: ResolvedCommand
  index: number
  active?: boolean
}>()

const emit = defineEmits<{
  (event: 'activate'): void
}>()
</script>

<template>
  <div
    class="flex px-3 py-2 my-1 items-center rounded-lg hover:bg-active transition-all duration-65 ease-in-out cursor-pointer scroll-m-10"
    :class="{ 'bg-active': active }"
    :data-index="index"
    @click="emit('activate')"
  >
    <div v-if="cmd.icon" me-2 :class="cmd.icon" />

    <div class="flex-1 flex items-baseline gap-2">
      <div :class="{ 'font-medium': active }">
        {{ cmd.name }}
      </div>
      <div v-if="cmd.description" class="text-xs text-secondary">
        {{ cmd.description }}
      </div>
    </div>

    <div
      v-if="cmd.onComplete"
      class="flex items-center gap-1 transition-all duration-65 ease-in-out"
      :class="active ? 'opacity-100' : 'opacity-0'"
    >
      <div class="text-xs text-secondary">
        {{ $t('command.complete') }}
      </div>
      <CommandKey name="Tab" />
    </div>
    <div
      v-if="cmd.onActivate"
      class="flex items-center gap-1 transition-all duration-65 ease-in-out"
      :class="active ? 'opacity-100' : 'opacity-0'"
    >
      <div class="text-xs text-secondary">
        {{ $t('command.activate') }}
      </div>
      <CommandKey name="Enter" />
    </div>
  </div>
</template>
