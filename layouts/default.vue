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
      <div class="w-full mb14 md:(w-3/4 mb0) lg:(w-2/4 mb0) min-h-screen" border="l r base">
        <slot />
      </div>
      <aside class="hidden md:none lg:block w-1/4 zen-hide">
        <div sticky top-0 h-screen flex="~ col">
          <slot name="right">
            <UserSignInEntry v-if="!currentUser" />
            <div v-if="currentUser" py6 px4 w-full flex="~" items-center justify-between>
              <NuxtLink
                p2 rounded-full text-start w-full
                hover:bg-active cursor-pointer transition-100
                :to="getAccountPath(currentUser.account)"
              >
                <AccountInfo :account="currentUser.account" md:break-words />
              </NuxtLink>
              <VDropdown :distance="0" placement="bottom-end">
                <button btn-action-icon aria-label="Switch account">
                  <div i-ri:more-2-line />
                </button>
                <template #popper>
                  <UserSwitcher />
                </template>
              </VDropdown>
            </div>

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
