<script setup lang="ts">

</script>

<template>
  <nav h-14 border="t base" flex flex-row text-xl>
    <template v-if="currentUser">
      <NuxtLink to="/home" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
        <div i-ri:home-5-line />
      </NuxtLink>
      <NuxtLink to="/notifications" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
        <div i-ri:notification-4-line />
      </NuxtLink>
    </template>
    <NuxtLink to="/explore" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
      <div i-ri:hashtag />
    </NuxtLink>
    <NuxtLink group to="/public/local" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
      <div i-ri:group-2-line />
    </NuxtLink>
    <!-- <NuxtLink to="/public" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
      <div i-ri:earth-line />
    </NuxtLink> -->
    <template v-if="currentUser">
      <NuxtLink to="/conversations" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
        <div i-ri:at-line />
      </NuxtLink>
    </template>
    <NavBottomMoreMenu v-slot="{ changeShow, show }" flex flex-row items-center place-content-center h-full flex-1 cursor-pointer>
      <!-- <NuxtLink to="/conversations" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
        <div i-ri:at-line />
      </NuxtLink> -->
      <label
        flex items-center place-content-center h-full flex-1
        :class="show ? '!text-primary' : ''"
      >
        <input type="checkbox" z="-1" absolute inset-0 opacity-0 @click="changeShow">
        <span v-show="show" i-ri:close-fill />
        <span v-show="!show" i-ri:more-fill />
      </label>
    </NavBottomMoreMenu>
  </nav>
</template>
