<script setup lang="ts">
const { notifications } = useNotifications()
</script>

<template>
  <nav md:px3 md:py4 flex="~ col gap2" text-size-base leading-normal md:text-lg>
    <template v-if="currentUser">
      <NavSideItem :text="$t('nav_side.home')" to="/home" icon="i-ri:home-5-line" />
      <NavSideItem :text="$t('nav_side.notifications')" to="/notifications" icon="i-ri:notification-4-line">
        <template #icon>
          <div flex relative>
            <div class="i-ri:notification-4-line" md:text-size-inherit text-xl />
            <div v-if="notifications" class="top-[-0.3rem] right-[-0.3rem]" absolute font-bold rounded-full h-4 w-4 text-xs bg-primary text-inverted flex items-center justify-center>
              {{ notifications < 10 ? notifications : '•' }}
            </div>
          </div>
        </template>
      </NavSideItem>
    </template>
    <NavSideItem :text="$t('nav_side.explore')" :to="`/${currentServer}/explore`" icon="i-ri:hashtag" />
    <NavSideItem :text="$t('nav_side.local')" :to="`/${currentServer}/public/local`" icon="i-ri:group-2-line " />
    <NavSideItem :text="$t('nav_side.federated')" :to="`/${currentServer}/public`" icon="i-ri:earth-line" />
    <template v-if="currentUser">
      <NavSideItem :text="$t('nav_side.conversations')" to="/conversations" icon="i-ri:at-line" />
      <NavSideItem :text="$t('nav_side.favourites')" to="/favourites" icon="i-ri:heart-3-line" />
      <NavSideItem :text="$t('nav_side.bookmarks')" to="/bookmarks" icon="i-ri:bookmark-line " />
      <NavSideItem
        v-if="isMediumScreen"
        :text="currentUser.account.displayName"
        :to="getAccountRoute(currentUser.account)"
        icon="i-ri:account-circle-line"
      >
        <template #icon>
          <AccountAvatar :account="currentUser.account" h="1.2em" md:text-size-inherit text-xl />
        </template>
        <ContentRich
          :content="getDisplayName(currentUser.account, { rich: true }) || $t('nav_side.profile')"
          :emojis="currentUser.account.emojis"
        />
      </NavSideItem>
      <NavSideItem :text="$t('nav_side.settings')" to="/settings" icon="i-ri:settings-4-line " />
    </template>
  </nav>
</template>
