<script setup lang="ts">
import { NavButtonExplore, NavButtonFederated, NavButtonHome, NavButtonLocal, NavButtonMention, NavButtonNotification, NavButtonSearch } from '#components'

const navButtons = currentUser.value
  ? [NavButtonHome, NavButtonSearch, NavButtonNotification, NavButtonMention]
  : [NavButtonExplore, NavButtonLocal, NavButtonFederated]

// only one icon can be lit up at the same time
const moreMenuVisible = ref(false)
</script>

<template>
  <nav
    h-14 border="t base" flex flex-row text-xl
    of-y-scroll scrollbar-hide overscroll-none
    class="after-content-empty after:(h-[calc(100%+0.5px)] w-0.1px pointer-events-none)"
  >
    <!-- These weird styles above are used for scroll locking, don't change it unless you know exactly what you're doing. -->
    <Component :is="button" v-for="button in navButtons" :key="button.name" :active-class="moreMenuVisible ? '' : 'text-primary'" />
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
