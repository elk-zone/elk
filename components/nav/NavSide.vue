<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <nav px3 py4 flex="~ col gap2" text-lg>
    <template v-if="currentUser">
      <NavSideItem :text="t('nav_side.home')" to="/home" icon="i-ri:home-5-line" />
      <NavSideItem :text="t('nav_side.notifications')" to="/notifications" icon="i-ri:notification-4-line" />
    </template>
    <NavSideItem :text="t('nav_side.explore')" to="/explore" icon="i-ri:hashtag" />
    <NavSideItem :text="t('nav_side.local')" to="/public/local" icon="i-ri:group-2-line " />
    <NavSideItem :text="t('nav_side.federated')" to="/public" icon="i-ri:earth-line" />
    <template v-if="currentUser">
      <NavSideItem :text="t('nav_side.conversations')" to="/conversations" icon="i-ri:at-line" />
      <NavSideItem :text="t('nav_side.favourites')" to="/favourites" icon="i-ri:heart-3-line" />
      <NavSideItem :text="t('nav_side.bookmarks')" to="/bookmarks" icon="i-ri:bookmark-line " />
      <NavSideItem
        v-if="isMediumScreen"
        :text="currentUser.account.displayName"
        :to="getAccountPath(currentUser.account)"
        icon="i-ri:account-circle-line"
      >
        <template #icon>
          <AccountAvatar :account="currentUser.account" h="1.2em" />
        </template>
        <ContentRich
          :content="getDisplayName(currentUser.account, { rich: true }) || t('nav_side.profile')"
          :emojis="currentUser.account.emojis"
        />
      </NavSideItem>
    </template>
  </nav>
</template>
