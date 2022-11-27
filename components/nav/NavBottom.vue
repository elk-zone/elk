<script setup lang="ts">

</script>

<template>
  <nav h-14 fixed bottom-0 left-0 right-0 z-50 border="t base" bg-base flex flex-row>
    <template v-if="currentUser">
      <NuxtLink to="/home" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1>
        <div i-ri:home-5-line />
      </NuxtLink>
      <NuxtLink to="/notifications" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1>
        <div i-ri:notification-4-line />
      </NuxtLink>
    </template>
    <NuxtLink to="/explore" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1>
      <div i-ri:hashtag />
    </NuxtLink>
    <NuxtLink group to="/public/local" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1>
      <div i-ri:group-2-line />
    </NuxtLink>
    <NuxtLink to="/public" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1>
      <div i-ri:earth-line />
    </NuxtLink>
    <template v-if="currentUser">
      <NuxtLink to="/conversations" active-class="text-primary" flex flex-row items-center place-content-center h-full flex-1>
        <div i-ri:at-line />
      </NuxtLink>
    </template>
  </nav>
</template>
