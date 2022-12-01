<script setup lang="ts">

</script>

<template>
  <nav h-14 border="t base" flex flex-row>
    <template v-if="currentUser">
      <NuxtLink to="/home" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
        <div text="[inherit]" i-ri:home-5-line />
      </NuxtLink>
      <NuxtLink to="/notifications" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
        <div text="[inherit]" i-ri:notification-4-line />
      </NuxtLink>
    </template>
    <NuxtLink to="/explore" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
      <div text="[inherit]" i-ri:hashtag />
    </NuxtLink>
    <NuxtLink group to="/public/local" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
      <div text="[inherit]" i-ri:group-2-line />
    </NuxtLink>
    <NuxtLink to="/public" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
      <div text="[inherit]" i-ri:earth-line />
    </NuxtLink>
    <template v-if="currentUser">
      <NuxtLink to="/conversations" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1 @click="$scrollToTop">
        <div text="[inherit]" i-ri:at-line />
      </NuxtLink>
    </template>
  </nav>
</template>
