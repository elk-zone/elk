<script setup lang="ts">
import { STORAGE_KEY_LAST_ACCESSED_EXPLORE_ROUTE, STORAGE_KEY_LAST_ACCESSED_NOTIFICATION_ROUTE } from '~/constants'

const { command } = defineProps<{
  command?: boolean
}>()
const { notifications } = useNotifications()
const useStarFavoriteIcon = usePreferences('useStarFavoriteIcon')
const lastAccessedNotificationRoute = useLocalStorage(STORAGE_KEY_LAST_ACCESSED_NOTIFICATION_ROUTE, '')
const lastAccessedExploreRoute = useLocalStorage(STORAGE_KEY_LAST_ACCESSED_EXPLORE_ROUTE, '')

const notificationsLink = computed(() => {
  const hydrated = isHydrated.value
  const user = currentUser.value
  const lastRoute = lastAccessedNotificationRoute.value
  if (!hydrated || !user || !lastRoute) {
    return '/notifications'
  }

  return `/notifications/${lastRoute}`
})
const exploreLink = computed(() => {
  const hydrated = isHydrated.value
  const server = currentServer.value
  let lastRoute = lastAccessedExploreRoute.value
  if (!hydrated) {
    return '/explore'
  }

  if (lastRoute.length) {
    lastRoute = `/${lastRoute}`
  }

  return server ? `/${server}/explore${lastRoute}` : `/explore${lastRoute}`
})
</script>

<template>
  <nav sm:px3 flex="~ col gap2" shrink text-size-base leading-normal md:text-lg h-full mt-1 overflow-y-auto>
    <NavSideItem :text="$t('nav.search')" to="/search" icon="i-ri:search-line" xl:hidden :command="command" />

    <div class="spacer" shrink xl:hidden />
    <NavSideItem :text="$t('nav.home')" to="/home" icon="i-ri:home-5-line" user-only :command="command" />
    <NavSideItem :text="$t('nav.notifications')" :to="notificationsLink" icon="i-ri:notification-4-line" user-only :command="command">
      <template #icon>
        <div flex relative>
          <div class="i-ri:notification-4-line" text-xl />
          <div v-if="notifications" class="top-[-0.3rem] right-[-0.3rem]" absolute font-bold rounded-full h-4 w-4 text-xs bg-primary text-inverted flex items-center justify-center>
            {{ notifications < 10 ? notifications : '•' }}
          </div>
        </div>
      </template>
    </NavSideItem>
    <NavSideItem :text="$t('nav.conversations')" to="/conversations" icon="i-ri:at-line" user-only :command="command" />
    <NavSideItem :text="$t('nav.favourites')" to="/favourites" :icon="useStarFavoriteIcon ? 'i-ri:star-line' : 'i-ri:heart-3-line'" user-only :command="command" />
    <NavSideItem :text="$t('nav.bookmarks')" to="/bookmarks" icon="i-ri:bookmark-line" user-only :command="command" />

    <div class="spacer" shrink hidden sm:block />
    <NavSideItem :text="$t('action.compose')" to="/compose" icon="i-ri:quill-pen-line" user-only :command="command" />

    <div class="spacer" shrink hidden sm:block />
    <NavSideItem :text="$t('nav.explore')" :to="exploreLink" icon="i-ri:compass-3-line" :command="command" />
    <NavSideItem :text="$t('nav.local')" :to="isHydrated ? `/${currentServer}/public/local` : '/public/local'" icon="i-ri:group-2-line " :command="command" />
    <NavSideItem :text="$t('nav.federated')" :to="isHydrated ? `/${currentServer}/public` : '/public'" icon="i-ri:earth-line" :command="command" />
    <NavSideItem :text="$t('nav.lists')" :to="isHydrated ? `/${currentServer}/lists` : '/lists'" icon="i-ri:list-check" user-only :command="command" />
    <NavSideItem :text="$t('nav.hashtags')" to="/hashtags" icon="i-ri:hashtag" user-only :command="command" />

    <div class="spacer" shrink hidden sm:block />
    <NavSideItem :text="$t('nav.settings')" to="/settings" icon="i-ri:settings-3-line" :command="command" />
  </nav>
</template>

<style scoped>
  .spacer {
    margin-top: 0.5em;
  }
  @media screen and ( max-height: 920px ) and ( min-width: 640px ) {
    .spacer {
      margin-top: 0;
    }
  }
</style>
