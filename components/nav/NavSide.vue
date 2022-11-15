<script setup lang="ts">

</script>

<template>
  <div px6 py2 flex="~ col gap6" text-lg>
    <NuxtLink flex gap2 items-center to="/home">
      <div i-ri:home-5-line />
      <span>Home</span>
    </NuxtLink>
    <NuxtLink flex gap2 items-center to="/notifications">
      <div i-ri:notification-4-line />
      <span>Notifications</span>
    </NuxtLink>
    <NuxtLink flex gap2 items-center>
      <div i-ri:hashtag />
      <span>Explore</span>
    </NuxtLink>
    <NuxtLink flex gap2 items-center to="/public/local">
      <div i-ri:group-2-line />
      <span>Local</span>
    </NuxtLink>
    <NuxtLink flex gap2 items-center to="/public">
      <div i-ri:earth-line />
      <span>Federated</span>
    </NuxtLink>
    <NuxtLink flex gap2 items-center>
      <div i-ri:at-line />
      <span>Direct Messages</span>
    </NuxtLink>
    <NuxtLink flex gap2 items-center>
      <div i-ri:heart-3-line />
      <span>Favorites</span>
    </NuxtLink>
    <NuxtLink flex gap2 items-center to="/bookmarks">
      <div i-ri:bookmark-line />
      <span>Bookmarks</span>
    </NuxtLink>
  </div>
</template>
