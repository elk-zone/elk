<script setup lang="ts">
const { currentUser } = $(useAppStore())

const account = $computed(() => currentUser?.account)
</script>

<template>
  <div flex flex-col gap-4 p4>
    <!-- TODO: multiple account switcher -->
    <template v-if="account">
      <AccountInfo :account="account" />
      <PublishWidget />
    </template>
    <!-- TODO: dialog for select server -->
    <a v-else href="/api/mas.to/login" px2 py1 bg-teal6 text-white m2 rounded>Login</a>
  </div>
</template>
