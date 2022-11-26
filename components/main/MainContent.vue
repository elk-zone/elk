<template>
  <div relative>
    <div
      sticky top-0 z10
      border="b base"
      backdrop="blur-10px brightness-120 dark:brightness-80"
    >
      <div flex justify-between px5 py4>
        <div flex gap-1>
          <slot name="title">
            <NuxtLink flex="~ gap1" items-center btn-text p-0 @click="$router.go(-1)">
              <div i-ri-arrow-left-line />
              Back
            </NuxtLink>
          </slot>
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
