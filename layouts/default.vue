<script lang="ts" setup>
const route = useRoute()

const wideLayout = computed(() => route.meta.wideLayout ?? false)
</script>

<template>
  <div h-full :class="{ zen: isZenMode }">
    <main flex w-full mxa lg:max-w-80rem>
      <aside class="hidden sm:flex w-1/8 md:w-1/6 justify-end lg:w-1/4 zen-hide" relative>
        <div sticky top-0 w-20 lg:w-100 h-screen flex="~ col" lt-lg-items-center>
          <slot name="left">
            <NavTitle mt4 mb2 lg:mx-3 />
            <div flex="~ col" overflow-y-auto justify-between h-full max-w-full>
              <div flex flex-col>
                <NavSide command />
                <PublishButton m="y5 xa" lg:m="r5 l3" lg:rtl-m="l5 r3" />
              </div>
              <div v-if="isMastoInitialised" flex flex-col>
                <UserSignInEntry v-if="!currentUser" sm:hidden />
                <div v-if="currentUser" p6 pb8 w-full>
                  <div hidden lg-block>
                    <UserPicker v-if="showUserPicker" />
                    <div v-else flex="~" items-center justify-between>
                      <NuxtLink
                        hidden lg:block
                        rounded-full text-start w-full
                        hover:bg-active cursor-pointer transition-100
                        :to="getAccountRoute(currentUser.account)"
                      >
                        <AccountInfo :account="currentUser.account" md:break-words />
                      </NuxtLink>
                      <UserDropdown />
                    </div>
                  </div>
                  <UserDropdown lg:hidden />
                </div>
              </div>
            </div>
          </slot>
        </div>
      </aside>
      <div class="w-full min-h-screen" :class="wideLayout ? 'lg:w-full sm:w-600px' : 'sm:w-600px'" sm:border-l sm:border-r border-base>
        <div min-h="[calc(100vh-3.5rem)]" sm:min-h-screen>
          <slot />
        </div>
        <div sm:hidden sticky left-0 right-0 bottom-0 z-10 bg-base pb="[env(safe-area-inset-bottom)]" transition="padding 20">
          <CommonOfflineChecker :small-screen="isHydrated" />
          <NavBottom v-if="isHydrated" />
        </div>
      </div>
      <aside v-if="!wideLayout" class="hidden sm:none lg:block w-1/4 zen-hide">
        <div sticky top-0 h-screen flex="~ col" py3>
          <slot name="right">
            <SearchWidget />
            <div flex-auto />
            <PwaPrompt />
            <NavFooter />
          </slot>
        </div>
      </aside>
    </main>
    <ModalContainer />
  </div>
</template>
