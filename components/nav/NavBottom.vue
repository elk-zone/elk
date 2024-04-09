<script setup lang="ts">
// only one icon can be lit up at the same time
import { STORAGE_KEY_LAST_ACCESSED_EXPLORE_ROUTE, STORAGE_KEY_LAST_ACCESSED_NOTIFICATION_ROUTE } from '~/constants'

const moreMenuVisible = ref(false)

const { notifications } = useNotifications()
const lastAccessedNotificationRoute = useLocalStorage(STORAGE_KEY_LAST_ACCESSED_NOTIFICATION_ROUTE, '')
const lastAccessedExploreRoute = useLocalStorage(STORAGE_KEY_LAST_ACCESSED_EXPLORE_ROUTE, '')
</script>

<template>
  <nav
    h-14 border="t base" flex flex-row text-xl
    of-y-scroll scrollbar-hide overscroll-none
    class="after-content-empty after:(h-[calc(100%+0.5px)] w-0.1px pointer-events-none)"
  >
    <!-- These weird styles above are used for scroll locking, don't change it unless you know exactly what you're doing. -->
    <template v-if="currentUser">
      <NuxtLink to="/home" :aria-label="$t('nav.home')" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
        <div i-ri:home-5-line />
      </NuxtLink>
      <NuxtLink to="/search" :aria-label="$t('nav.search')" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
        <div i-ri:search-line />
      </NuxtLink>
      <NuxtLink :to="`/notifications/${lastAccessedNotificationRoute}`" :aria-label="$t('nav.notifications')" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
        <div flex relative>
          <div class="i-ri:notification-4-line" text-xl />
          <div v-if="notifications" class="top-[-0.3rem] right-[-0.3rem]" absolute font-bold rounded-full h-4 w-4 text-xs bg-primary text-inverted flex items-center justify-center>
            {{ notifications < 10 ? notifications : '•' }}
          </div>
        </div>
      </NuxtLink>
      <NuxtLink to="/conversations" :aria-label="$t('nav.conversations')" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
        <div i-ri:at-line />
      </NuxtLink>
    </template>
    <template v-else>
      <NuxtLink :to="`/${currentServer}/explore/${lastAccessedExploreRoute}`" :aria-label="$t('nav.explore')" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
        <div i-ri:compass-3-line />
      </NuxtLink>
      <NuxtLink group :to="`/${currentServer}/public/local`" :aria-label="$t('nav.local')" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
        <div i-ri:group-2-line />
      </NuxtLink>
      <NuxtLink :to="`/${currentServer}/public`" :aria-label="$t('nav.federated')" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
        <div i-ri:earth-line />
      </NuxtLink>
    </template>
    <NavBottomMoreMenu v-slot="{ toggleVisible, show }" v-model="moreMenuVisible" flex flex-row items-center place-content-center h-full flex-1 cursor-pointer>
      <button
        flex items-center place-content-center h-full flex-1 class="select-none"
        :class="show ? '!text-primary' : ''"
        aria-label="More menu"
        @click="toggleVisible"
      >
        <span :class="show ? 'i-ri:close-fill' : 'i-ri:more-fill'" />
      </button>
    </NavBottomMoreMenu>
  </nav>
</template>
