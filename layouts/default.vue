<template>
  <div h-full>
    <main flex w-full mxa lg:max-w-80rem>
      <div class="hidden md:block w-1/4" relative>
        <div sticky top-0 h-screen flex="~ col">
          <slot name="left">
            <template v-if="currentUser">
              <PublishWidget px4 draft-key="home" />
            </template>
            <UserSignInEntry v-else />
            <div flex-auto />
            <AccountInfo
              v-if="currentUser"
              mx4 mb4 p2 rounded
              hover:bg-active cursor-pointer
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
      <div class="hidden md:block w-1/4">
        <div sticky top-0 h-screen flex="~ col">
          <slot name="right">
            <NavTitle p5 />
            <NavSide border="y base" py8 />
            <div flex-auto />
            <NavFooter />
          </slot>
        </div>
      </div>
    </main>
    <ModalContainer />
  </div>
</template>
