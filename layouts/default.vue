<script lang="ts" setup>
import { usePreferences } from '~/composables/settings'

const route = useRoute()
const userSettings = useUserSettings()

const wideLayout = computed(() => route.meta.wideLayout ?? false)

const showUserPicker = logicAnd(
  usePreferences('experimentalUserPicker'),
  () => useUsers().value.length > 1,
)
</script>

<template>
  <div h-full>
    <main flex w-full mxa lg:max-w-80rem>
      <aside class="hidden sm:flex w-1/8 md:w-1/6 lg:w-1/5 xl:w-1/4 justify-end xl:me-4 zen-hide" relative>
        <div sticky top-0 w-20 xl:w-100 h-screen flex="~ col" lt-xl-items-center>
          <slot name="left">
            <div flex="~ col" overflow-y-auto justify-between h-full max-w-full mt-5>
              <NavTitle />
              <NavSide command />
              <div flex-auto />
              <div v-if="isHydrated" flex flex-col>
                <div hidden xl:block>
                  <UserSignInEntry v-if="!currentUser" />
                </div>
                <div v-if="currentUser" p6 pb8 w-full>
                  <div hidden xl-block>
                    <UserPicker v-if="showUserPicker" />
                    <div v-else flex="~" items-center justify-between>
                      <NuxtLink
                        hidden xl:block
                        rounded-3 text-primary text-start w-full
                        hover:bg-active cursor-pointer transition-100
                        :to="getAccountRoute(currentUser.account)"
                      >
                        <AccountInfo :account="currentUser.account" md:break-words square />
                      </NuxtLink>
                      <UserDropdown />
                    </div>
                  </div>
                  <UserDropdown xl:hidden />
                </div>
              </div>
            </div>
          </slot>
        </div>
      </aside>
      <div w-full min-h-screen :class="isHydrated && wideLayout ? 'xl:w-full sm:w-600px' : 'sm:w-600px md:shrink-0'" border-base>
        <div min-h="[calc(100vh-3.5rem)]" sm:min-h-screen>
          <slot />
        </div>
        <div sticky left-0 right-0 bottom-0 z-10 bg-base pb="[env(safe-area-inset-bottom)]" transition="padding 20">
          <CommonOfflineChecker v-if="isHydrated" />
          <NavBottom v-if="isHydrated" sm:hidden />
        </div>
      </div>
      <aside v-if="isHydrated && !wideLayout" class="hidden sm:none lg:block w-1/4 zen-hide">
        <div sticky top-0 h-screen flex="~ col" gap-2 py3 ms-2>
          <slot name="right">
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
