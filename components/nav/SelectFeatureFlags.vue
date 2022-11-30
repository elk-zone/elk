<script setup lang="ts">
const { t } = useI18n()

const featureFlags = useFeatureFlags()
</script>

<template>
  <CommonTooltip :content="t('nav_footer.select_feature_flags')">
    <CommonDropdown>
      <button flex :aria-label="t('nav_footer.select_feature_flags')">
        <div i-ri:flag-line text-lg />
      </button>

      <template #popper>
        <CommonDropdownItem
          :checked="featureFlags.experimentalVirtualScroll"
          @click="toggleFeatureFlag('experimentalVirtualScroll')"
        >
          {{ t('feature_flag.virtual_scroll') }}
        </CommonDropdownItem>
      </template>
    </CommonDropdown>
  </CommonTooltip>
</template>
