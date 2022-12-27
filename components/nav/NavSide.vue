<script setup lang="ts">
const { notifications } = useNotifications()
</script>

<template>
  <nav sm:px3 sm:py4 flex="~ col gap2" text-size-base leading-normal md:text-lg>
    <NavSideItem :text="$t('nav.home')" to="/home" icon="i-ri:home-5-line" user-only />
    <NavSideItem :text="$t('nav.notifications')" to="/notifications" icon="i-ri:notification-4-line" user-only>
      <template #icon>
        <div flex relative>
          <div class="i-ri:notification-4-line" md:text-size-inherit text-xl />
          <div v-if="notifications" class="top-[-0.3rem] right-[-0.3rem]" absolute font-bold rounded-full h-4 w-4 text-xs bg-primary text-inverted flex items-center justify-center>
            {{ notifications < 10 ? notifications : '•' }}
          </div>
        </div>
      </template>
    </NavSideItem>

    <!-- Use Search for small screens once the right sidebar is collapsed -->
    <NavSideItem :text="$t('nav.search')" to="/search" icon="i-ri:search-line" lg:hidden />
    <NavSideItem :text="$t('nav.explore')" :to="`/${currentServer}/explore`" icon="i-ri:hashtag" hidden lg:block />

    <NavSideItem :text="$t('nav.local')" :to="`/${currentServer}/public/local`" icon="i-ri:group-2-line " />
    <NavSideItem :text="$t('nav.federated')" :to="`/${currentServer}/public`" icon="i-ri:earth-line" />
    <NavSideItem :text="$t('nav.conversations')" to="/conversations" icon="i-ri:at-line" user-only />
    <NavSideItem :text="$t('nav.favourites')" to="/favourites" icon="i-ri:heart-3-line" user-only />
    <NavSideItem :text="$t('nav.bookmarks')" to="/bookmarks" icon="i-ri:bookmark-line " user-only />
  </nav>
</template>
