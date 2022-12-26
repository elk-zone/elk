<template>
  <CommonDropdown placement="top">
    <slot />
    <template #popper>
      <CommonDropdownItem
        :checked="currentUserFeatureFlags.experimentalVirtualScroll"
        @click="toggleFeatureFlag('experimentalVirtualScroll')"
      >
        {{ $t('feature_flag.virtual_scroll') }}
      </CommonDropdownItem>
      <CommonDropdownItem
        :checked="currentUserFeatureFlags.experimentalAvatarOnAvatar"
        @click="toggleFeatureFlag('experimentalAvatarOnAvatar')"
      >
        {{ $t('feature_flag.avatar_on_avatar') }}
      </CommonDropdownItem>
      <CommonDropdownItem
        :checked="currentUserFeatureFlags.experimentalGitHubCards"
        @click="toggleFeatureFlag('experimentalGitHubCards')"
      >
        {{ $t('feature_flag.github_cards') }}
      </CommonDropdownItem>
      <CommonDropdownItem
        :checked="currentUserFeatureFlags.experimentalUserPicker"
        @click="toggleFeatureFlag('experimentalUserPicker')"
      >
        {{ $t('feature_flag.user_picker') }}
      </CommonDropdownItem>
    </template>
  </CommonDropdown>
</template>
