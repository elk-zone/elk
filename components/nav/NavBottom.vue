<script setup lang="ts">
// only one icon can be lit up at the same time
const moreMenuVisible = ref(false)
</script>

<template>
  <nav
    h-14 border="t base" flex flex-row text-xl
    of-y-scroll overscroll-none
    class="scrollbar-hide after-content-empty after:(h-[calc(100%+0.5px)] w-0.1px pointer-events-none)"
  >
    <!-- These weird styles above are used for scroll locking, don't change it unless you know exactly what you're doing. -->
    <template v-if="currentUser">
      <NuxtLink to="/home" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
        <div i-ri:home-5-line />
      </NuxtLink>
      <NuxtLink to="/notifications" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
        <div i-ri:notification-4-line />
      </NuxtLink>
    </template>
    <NuxtLink to="/explore" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
      <div i-ri:hashtag />
    </NuxtLink>
    <NuxtLink group to="/public/local" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
      <div i-ri:group-2-line />
    </NuxtLink>
    <template v-if="!currentUser">
      <NuxtLink to="/public" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
        <div i-ri:earth-line />
      </NuxtLink>
    </template>
    <template v-if="currentUser">
      <NuxtLink to="/conversations" :active-class="moreMenuVisible ? '' : 'text-primary'" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
        <div i-ri:at-line />
      </NuxtLink>
    </template>
    <NavBottomMoreMenu v-slot="{ changeShow, show }" v-model="moreMenuVisible" flex flex-row items-center place-content-center h-full flex-1 cursor-pointer>
      <label
        flex items-center place-content-center h-full flex-1 class="selete-none"
        :class="show ? '!text-primary' : ''"
      >
        <input type="checkbox" z="-1" absolute inset-0 opacity-0 @click="changeShow">
        <span v-show="show" i-ri:close-fill />
        <span v-show="!show" i-ri:more-fill />
      </label>
    </NavBottomMoreMenu>
  </nav>
</template>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
