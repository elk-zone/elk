<script setup lang="ts">
const { currentUser } = useAppStore()
</script>

<template>
  <div p4>
    <!-- TODO: multiple account switcher -->
    <AccountInfo v-if="currentUser?.account" :account="currentUser.account" />
    <!-- TODO: dialog for select server -->
    <a v-else href="/api/mas.to/login" px2 py1 bg-teal6 text-white m2 rounded>Login</a>
  </div>
</template>
