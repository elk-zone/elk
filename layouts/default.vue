<template>
  <div h-full :class="{ zen: isZenMode }">
    <main flex w-full mxa lg:max-w-80rem>
      <div class="hidden md:block w-1/4 zen-hide" relative>
        <div sticky top-0 h-screen flex="~ col">
          <slot name="left">
            <NavTitle px6 pt6 pb4 />
            <div flex="~ col" overflow-y-auto>
              <NavSide />
              <PublishButton v-if="currentUser" m5 />
              <div flex-auto />
            </div>
          </slot>
        </div>
      </div>
      <NavBottom md:hidden />
      <div class="w-full mb14 md:(w-2/4 mb0) min-h-screen" border="l r base">
        <slot />
      </div>
      <div class="hidden md:block w-1/4 zen-hide">
        <div sticky top-0 h-screen flex="~ col">
          <slot name="right">
            <UserSignInEntry v-if="!currentUser" />
            <AccountInfo
              v-if="currentUser"
              tabindex="0"
              m5 p2 rounded-full
              hover:bg-active cursor-pointer transition-100
              :account="currentUser?.account"
              :link="false"
              @keydown.enter="openUserSwitcher"
              @click="openUserSwitcher"
            />
            <div flex-auto />
            <NavFooter />
          </slot>
        </div>
      </div>
    </main>
    <ModalContainer />
  </div>
</template>
