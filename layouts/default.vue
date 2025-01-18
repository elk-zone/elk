<script setup lang="ts">
import { usePreferences } from '~/composables/settings'

const route = useRoute()
const info = useBuildInfo()

const wideLayout = computed(() => route.meta.wideLayout ?? false)

const showUserPicker = logicAnd(
  usePreferences('experimentalUserPicker'),
  () => useUsers().value.length > 1,
)

const isGrayscale = usePreferences('grayscaleMode')
</script>

<template>
  <div h-full :data-mode="isHydrated && isGrayscale ? 'grayscale' : ''" data-tauri-drag-region>
    <main flex w-full mxa lg:max-w-80rem class="native:grid native:sm:grid-cols-[auto_1fr] native:lg:grid-cols-[auto_minmax(600px,2fr)_1fr]">
      <aside class="native:w-auto w-1/8 md:w-1/6 lg:w-1/5 xl:w-1/4 zen-hide" hidden sm:flex justify-end xl:me-4 native:me-0 relative>
        <div sticky top-0 w-20 xl:w-100 h-100dvh flex="~ col" lt-xl-items-center>
          <slot name="left">
            <div flex="~ col" overflow-y-auto justify-between h-full max-w-full overflow-x-hidden>
              <NavTitle />
              <NavSide command />
              <div flex-auto />
              <div v-if="isHydrated" flex flex-col sticky bottom-0 bg-base>
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
      <aside v-if="isHydrated && !wideLayout" class="hidden lg:w-1/5 xl:w-1/4 sm:none xl:block native:w-full zen-hide">
        <div sticky top-0 h-100dvh flex="~ col" gap-2 py3 ms-2>
          <slot name="right">
            <SearchWidget mt-4 mx-1 hidden xl:block />
            <div flex-auto />

            <PwaPrompt />
            <PwaInstallPrompt />
            <LazyCommonPreviewPrompt v-if="info.env === 'preview'" />
            <NavFooter />
          </slot>
        </div>
      </aside>
    </main>
    <ModalContainer />
  </div>
</template>
