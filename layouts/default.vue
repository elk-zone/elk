<template>
  <div h-full :class="{ zen: isZenMode }">
    <main flex w-full mxa lg:max-w-80rem>
      <div class="hidden md:block w-1/4 zen-hide" relative>
        <div sticky top-0 h-screen flex="~ col">
          <slot name="left">
            <NavTitle p5 />
            <NavSide border="y base" />
            <PublishButton v-if="currentUser" m5 />
            <div flex-auto />
            <AccountInfo
              v-if="currentUser"
              m5 p2 rounded-full
              hover:bg-active cursor-pointer transition-100
              :account="currentUser?.account"
              :link="false"
              @click="openUserSwitcher"
            />
          </slot>
        </div>
      </div>
      <div class="w-full md:w-2/4 min-h-screen" border="l r base">
        <slot />
      </div>
      <div class="hidden md:block w-1/4 zen-hide">
        <div sticky top-0 h-screen flex="~ col">
          <slot name="right">
            <UserSignInEntry v-if="!currentUser" />
            <div flex-auto />
            <NavFooter />
          </slot>
        </div>
      </div>
    </main>
    <ModalContainer />
  </div>
</template>
