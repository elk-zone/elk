<script setup lang="ts">
const model = defineModel<boolean>()

const userSettings = useUserSettings()
</script>

<template>
  <NavBottomMoreMenu
    v-slot="{ toggleVisible, show }" v-model="model!" flex flex-row items-center
    place-content-center h-full flex-1 cursor-pointer
  >
    <button
      flex flex-col items-center place-content-center h-full flex-1 class="select-none"
      :class="show ? '!text-primary' : ''"
      :aria-label="$t('nav.more_menu')"
      @click="toggleVisible"
    >
      <span :class="show ? 'i-ri:close-fill' : 'i-ri:more-fill'" />
      <span v-if="!getPreferences(userSettings, 'hideBottomNavLabel')" text-xs>{{ $t('nav.more_menu') }}</span>
    </button>
  </NavBottomMoreMenu>
</template>
