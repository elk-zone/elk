<script setup lang="ts">
</script>

<template>
  <div px3 py4 flex="~ col gap2" text-lg>
    <template v-if="currentUser">
      <NuxtLink
        flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 hover:bg-active
        to="/home" active-class="text-primary"
      >
        <div i-ri:home-5-line />
        <span>Home</span>
      </NuxtLink>
      <NuxtLink
        flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 hover:bg-active
        to="/notifications" active-class="text-primary"
      >
        <div i-ri:notification-4-line />
        <span>Notifications</span>
      </NuxtLink>
    </template>
    <NuxtLink
      flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 hover:bg-active
      to="/explore" active-class="text-primary"
    >
      <div i-ri:hashtag />
      <span>Explore</span>
    </NuxtLink>
    <NuxtLink
      flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 hover:bg-active
      to="/public/local" active-class="text-primary"
    >
      <div i-ri:group-2-line />
      <span>Local</span>
    </NuxtLink>
    <NuxtLink
      flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 hover:bg-active
      to="/public" active-class="text-primary"
    >
      <div i-ri:earth-line />
      <span>Federated</span>
    </NuxtLink>
    <template v-if="currentUser">
      <NuxtLink
        flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 hover:bg-active
        to="/conversations" active-class="text-primary"
      >
        <div i-ri:at-line />
        <span>Conversations</span>
      </NuxtLink>
      <NuxtLink
        flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 hover:bg-active
        to="/favourites" active-class="text-primary"
      >
        <div i-ri:heart-3-line />
        <span>Favorites</span>
      </NuxtLink>
      <NuxtLink
        flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 hover:bg-active
        to="/bookmarks" active-class="text-primary"
      >
        <div i-ri:bookmark-line />
        <span>Bookmarks</span>
      </NuxtLink>
      <NuxtLink
        flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 hover:bg-active
        :to="`/@${currentUser.account?.username}`" active-class="text-primary"
      >
        <AccountAvatar :account="currentUser.account" h="1.2em" />
        <span>Profile</span>
      </NuxtLink>
    </template>
  </div>
</template>
