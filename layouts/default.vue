<template>
  <div h-full :class="{ zen: isZenMode }">
    <div v-if="isMastoInitialised" v-show="showUserSwitcherSidebar" fixed h-full hidden lg:block bg-code border-r-1 border-base>
      <UserPicker />
    </div>
    <main flex w-full mxa lg:max-w-80rem :class="isMastoInitialised && showUserSwitcherSidebar ? 'lg:pl-20' : ''">
      <aside class="hidden sm:flex w-1/8 md:w-1/6 justify-end lg:w-1/4 zen-hide" relative>
        <div sticky top-0 w-20 lg:w-auto h-screen flex="~ col">
          <slot name="left">
            <NavTitle mx3 mt4 mb2 self-start />
            <div flex="~ col" overflow-y-auto justify-between h-full>
              <div flex flex-col>
                <NavSide />
                <PublishButton v-if="isMastoInitialised && currentUser" m5 />
              </div>
              <div flex flex-col>
                <UserSignInEntry v-if="isMastoInitialised && !currentUser" />
                <div v-if="isMastoInitialised && currentUser" p6 pb8 w-full flex="~" items-center justify-between>
                  <NuxtLink
                    v-if="!isMediumScreen"
                    rounded-full text-start w-full
                    hover:bg-active cursor-pointer transition-100
                    :to="getAccountRoute(currentUser.account)"
                  >
                    <AccountInfo :account="currentUser.account" md:break-words />
                  </NuxtLink>
                  <VDropdown :distance="0" placement="bottom-end">
                    <button btn-action-icon :aria-label="$t('action.switch_account')">
                      <div v-if="!isMediumScreen" i-ri:more-2-line />
                      <AccountAvatar v-else :account="currentUser.account" w-9 h-9 />
                    </button>
                    <template #popper="{ hide }">
                      <UserSwitcher @click="hide" />
                    </template>
                  </VDropdown>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </aside>
      <div class="w-full mb14 sm:(w-600px mb0) min-h-screen" border="none sm:l sm:r base">
        <div min-h-screen>
          <slot />
        </div>
        <div sticky left-0 right-0 bottom-0 z-10 bg-base pb="[env(safe-area-inset-bottom)]" transition="padding 20">
          <CommonOfflineChecker :small-screen="isHydrated && isSmallScreen" />
          <NavBottom v-if="isHydrated && isSmallScreen" />
        </div>
      </div>
      <aside class="hidden sm:none lg:block w-1/4 zen-hide">
        <div sticky top-0 h-screen flex="~ col" py3>
          <slot name="right">
            <SearchWidget v-if="isMastoInitialised" />
            <div flex-auto />
            <NavFooter />
          </slot>
        </div>
      </aside>
    </main>
    <ModalContainer />
  </div>
</template>
