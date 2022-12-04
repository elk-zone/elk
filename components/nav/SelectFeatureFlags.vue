<script setup lang="ts">
const featureFlags = useFeatureFlags()
</script>

<template>
  <CommonDropdown placement="top">
    <slot />
    <template #popper>
      <CommonDropdownItem
        :checked="featureFlags.experimentalVirtualScroll"
        @click="toggleFeatureFlag('experimentalVirtualScroll')"
      >
        {{ $t('feature_flag.virtual_scroll') }}
      </CommonDropdownItem>
    </template>
  </CommonDropdown>
</template>
