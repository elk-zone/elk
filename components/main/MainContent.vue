<script setup lang="ts">
defineProps<{
  back?: boolean
}>()
</script>

<template>
  <div relative>
    <div
      sticky top-0 z10
      border="b base"
      backdrop="blur-10px brightness-120 dark:brightness-80"
      :class="isZenMode ? 'op0 hover:op100 transition duration-300' : ''"
    >
      <div flex justify-between px5 py4>
        <div flex gap-3>
          <NuxtLink v-if="back" flex="~ gap1" items-center btn-text p-0 @click="$router.go(-1)">
            <div i-ri-arrow-left-line />
          </NuxtLink>
          <slot name="title" />
          <div h-7 w-1px />
        </div>
        <div flex items-center>
          <slot name="actions" />
          <template v-if="currentUser">
            <NuxtLink md:hidden :to="`/@${currentUser.account?.username}`">
              <AccountAvatar :account="currentUser.account" h="1.5em" />
            </NuxtLink>
          </template>
          <template v-else>
            <button md-hidden btn-solid text-sm px-2 py-1 text-center @click="openSigninDialog()">
              Sign in
            </button>
          </template>
        </div>
      </div>
      <slot name="header" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
