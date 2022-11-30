<template>
  <div h-full :class="{ zen: isZenMode }">
    <main flex w-full mxa lg:max-w-80rem>
      <aside class="hidden md:block w-1/4 zen-hide" relative>
        <div sticky top-0 h-screen flex="~ col">
          <slot name="left">
            <NavTitle mx3 mt4 mb2 self-start />
            <div flex="~ col" overflow-y-auto>
              <NavSide />
              <PublishButton v-if="currentUser" m5 />
              <div flex-auto />
            </div>
          </slot>
        </div>
      </aside>
      <NavBottom v-if="isSmallScreen" />
      <div class="w-full mb14 md:(w-3/4 mb0) lg:(w-2/4 mb0) h-screen" border="l r base" relative>
        <div min-h-screen>
          <slot />
        </div>
        <CommonOfflineChecker :small-screen="isSmallScreen" />
      </div>
      <aside class="hidden md:none lg:block w-1/4 zen-hide">
        <div sticky top-0 h-screen flex="~ col">
          <slot name="right">
            <UserSignInEntry v-if="!currentUser" />
            <VDropdown
              v-if="currentUser"
              :distance="0"
              placement="bottom-end"
            >
              <button
                m5 p2 rounded-full text-start w-full
                hover:bg-active cursor-pointer transition-100
                class="md:(w-7.5/10 rounded-5)"
                aria-label="Switch account"
              >
                <AccountInfo :account="currentUser.account" md:flex="col" md:break-words />
              </button>
              <template #popper>
                <UserSwitcher />
              </template>
            </VDropdown>
            <div flex-auto />
            <NavFooter />
          </slot>
        </div>
      </aside>
    </main>
    <ModalContainer />
    <CommandRoot />
  </div>
</template>
