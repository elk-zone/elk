<script setup lang="ts">
const accounts = useAccounts()
</script>

<template>
  <div flex flex-col gap-4 p4>
    <AccountInfo :account="currentUser?.account" :link="false" @click="openAccountSwitcher" />
  </div>
</template>
