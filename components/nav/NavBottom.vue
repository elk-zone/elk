<script setup lang="ts">
import { NavButtonExplore, NavButtonFederated, NavButtonHome, NavButtonLocal, NavButtonMention, NavButtonMoreMenu, NavButtonNotification, NavButtonSearch } from '#components'

const navButtons = currentUser.value
  ? [NavButtonHome, NavButtonSearch, NavButtonNotification, NavButtonMention, NavButtonMoreMenu]
  : [NavButtonExplore, NavButtonLocal, NavButtonFederated, NavButtonMoreMenu]

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
  </nav>
</template>
