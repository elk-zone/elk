<script setup lang="ts">
</script>

<template>
  <div px3 py4 flex="~ col gap2" text-lg>
    <template v-if="currentUser">
      <NuxtLink to="/home" active-class="text-primary" group>
        <div flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 group-hover:bg-active>
          <div i-ri:home-5-line />
          <span>Home</span>
        </div>
      </NuxtLink>
      <NuxtLink to="/notifications" active-class="text-primary" group>
        <div flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 group-hover:bg-active>
          <div i-ri:notification-4-line />
          <span>Notifications</span>
        </div>
      </NuxtLink>
    </template>
    <NuxtLink to="/explore" active-class="text-primary" group>
      <div flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 group-hover:bg-active>
        <div i-ri:hashtag />
        <span>Explore</span>
      </div>
    </NuxtLink>
    <NuxtLink group to="/public/local" active-class="text-primary">
      <div flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 group-hover:bg-active>
        <div i-ri:group-2-line />
        <span>Local</span>
      </div>
    </NuxtLink>
    <NuxtLink to="/public" active-class="text-primary" group>
      <div flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 group-hover:bg-active>
        <div i-ri:earth-line />
        <span>Federated</span>
      </div>
    </NuxtLink>
    <template v-if="currentUser">
      <NuxtLink to="/conversations" active-class="text-primary" group>
        <div flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 group-hover:bg-active>
          <div i-ri:at-line />
          <span>Conversations</span>
        </div>
      </NuxtLink>
      <NuxtLink to="/favourites" active-class="text-primary" group>
        <div flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 group-hover:bg-active>
          <div i-ri:heart-3-line />
          <span>Favorites</span>
        </div>
      </NuxtLink>
      <NuxtLink to="/bookmarks" active-class="text-primary" group>
        <div flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 group-hover:bg-active>
          <div i-ri:bookmark-line />
          <span>Bookmarks</span>
        </div>
      </NuxtLink>
      <NuxtLink :to="`/@${currentUser.account?.username}`" active-class="text-primary" group>
        <div flex w-fit px5 py2 gap2 items-center transition-100 rounded-10 hover:bg-active>
          <AccountAvatar :account="currentUser.account" h="1.2em" />
          <span>Profile</span>
        </div>
      </NuxtLink>
    </template>
  </div>
</template>
