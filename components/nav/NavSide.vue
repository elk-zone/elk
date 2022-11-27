<template>
  <nav px3 py4 flex="~ col gap2" text-lg>
    <template v-if="currentUser">
      <NavSideItem text="Home" to="/home" icon="i-ri:home-5-line" />
      <NavSideItem text="Notifications" to="/notifications" icon="i-ri:notification-4-line" />
    </template>
    <NavSideItem text="Explore" to="/explore" icon="i-ri:hashtag" />
    <NavSideItem text="Local" to="/public/local" icon="i-ri:group-2-line " />
    <NavSideItem text="Federated" to="/public" icon="i-ri:earth-line" />
    <template v-if="currentUser">
      <NavSideItem text="Conversations" to="/conversations" icon="i-ri:at-line" />
      <NavSideItem text="Favourites" to="/favourites" icon="i-ri:heart-3-line" />
      <NavSideItem text="Bookmarks" to="/bookmarks" icon="i-ri:bookmark-line " />
      <NavSideItem
        :text="currentUser.account.displayName || 'Profile'"
        :to="getAccountPath(currentUser.account)" icon="i-ri:list-check-2-line"
      >
        <template #icon>
          <AccountAvatar :account="currentUser.account" h="1.2em" />
        </template>
      </NavSideItem>
    </template>
  </nav>
</template>
