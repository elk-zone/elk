<script setup lang="ts">
const settings = useUserSettings()
</script>

<template>
  <CommonDropdown placement="bottom" auto-boundary-max-size auto-size>
    <button select-settings text-left flex justify-between>
      {{ languagesNameList.find(l => l.code === (settings.publishLanguage || settings.language || 'en'))?.nativeName }}<span class="i-ri:arrow-down-s-line" relative left-3 />
    </button>

    <template #popper>
      <PublishLanguagePicker v-model="settings.publishLanguage" class="w-full" />
    </template>
  </CommonDropdown>
</template>
