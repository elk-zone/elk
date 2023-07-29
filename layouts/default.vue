<script lang="ts" setup>
import { usePreferences } from '~/composables/settings'

const route = useRoute()

const wideLayout = computed(() => route.meta.wideLayout ?? false)

const showUserPicker = logicAnd(
  usePreferences('experimentalUserPicker'),
  () => useUsers().value.length > 1,
)

const isGrayscale = usePreferences('grayscaleMode')

const appContainerRef = ref()

const { width: appContainerWidth } = useElementBounding(appContainerRef)

const shouldRenderRightNav = computed(() => ((!route.path?.startsWith('/settings')) && (appContainerWidth.value > 1024)))

const isUserAdjustingSettings = computed(() => route.path?.startsWith('/settings'))
const appContainerClass = computed(() => {
  if (!route.path?.startsWith('/settings'))
    return null

  if (appContainerWidth.value < 1280)
    return 'flex w-full h-100dvh justify-center grid grid-cols-[minmax(70px,80px)_600px_0px]'

  return 'flex w-full h-100dvh justify-center grid grid-cols-[275px_auto_0px]'
})
</script>

<template>
  <div
    ref="appContainerRef" h-full :data-mode="isHydrated && isGrayscale ? 'grayscale' : ''"
    data-tauri-drag-region
    sm="ml-0 pl-0"
    overflow-y-hidden
    overscroll-y-contain
  >
    <main
      overflow-y-hidden
      overscroll-y-contain
      content-between w-full
      class="native:grid native:sm:grid-cols-[auto_1fr] native:lg:grid-cols-[auto_minmax(600px,3fr)_2fr"
      sm="flex w-full justify-center"
      md="flex w-full h-100dvh justify-center grid-cols-[minmax(70px,80px)_minmax(600px,2fr)]"
      lg="flex w-full h-100dvh justify-center grid grid-cols-[minmax(70px,80px)_600px_minmax(275px,390px)]"
      xl="flex w-full h-100dvh justify-center grid grid-cols-[minmax(275px,1fr)_600px_auto]"
      :class="appContainerClass"
    >
      <!-- LEFT NAV -->
      <aside
        v-if="isHydrated"
        class="zen-hide"
        hidden justify-start
        native="me-0 w-auto"
        sm="flex mx-0 px-0 max-w-80px"
        xl="w-275px max-w-full"
      >
        <div
          flex="~ col" lt-lg-items-center
          sm="w-80px"
          xl="w-275px max-w-full"
        >
          <slot name="left">
            <div sticky top-0>
              <NavTitle
                sm="w-fit mr-10px"
                xl="w-full mr-0"
              />
              <NavSide
                command flex-col flex-auto flex-basis-lg
                mt0 mb0
                sm="w-80px min-h-10vh max-h-80vh"
                xl="w-275px min-h-10vh max-h-80vh"
              />
              <!-- USER SIGN-IN -->
              <div shrink flex-basis-78px />
              <div
                v-if="isHydrated" bg-base flex-grow flex-basis
                sm="w-70px min-h-70px"
                xl="w-275px min-h-10vh max-h-80vh"
                pb8 mb8
              >
                <div hidden xl="block" p0 m0>
                  <UserSignInEntry v-if="!currentUser" p0 m0 />
                </div>
                <div v-if="currentUser" p0 m0>
                  <div xl="hidden" px6 pt4>
                    <CommonTooltip :disabled="!isMediumOrLargeScreen" :content="$t('action.switch_account')" placement="right">
                      <div
                        class="item"
                        flex gap4
                        rounded-3
                        sm="max-w-70px w-content justify-center mx0"
                        xl="items-center justify-start ml0 mr5 px5 w-auto"
                        transition-100
                        elk-group-hover="bg-active" group-focus-visible:ring="2 current"
                      >
                        <UserDropdown xl:hidden />
                      </div>
                    </CommonTooltip>
                  </div>
                  <div hidden xl="block" p6 w-full>
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
                </div>
              </div>
            </div>
          </slot>
        </div>
        <div class="spacer" max-h-full grow />
      </aside>
      <!-- MAIN -->
      <div
        v-if="isHydrated" id="__main" h-100vh overscroll-none overflow-hidden
        min-w-280px w-full
        sm="max-w-full"
        md="min-w-600px"
        :class="isUserAdjustingSettings ? 'md:max-w-600px lg:max-w-600px xl:max-w-[calc(980px-2rem)] xl:mx-0 xl:px-0' : 'md:max-w-600px'"
      >
        <div
          overflow-y-hidden overscroll-y-none
          min-w-280px w-full
          sm="max-w-full"
          md="min-w-600px"
          :class="isUserAdjustingSettings ? 'md:max-w-600px lg:max-w-fit xl:max-w-[calc(980px-2rem)] xl:mx-0 xl:px-0' : 'md:max-w-600px'"
        >
          <slot />
        </div>
        <div sticky left-0 right-0 bottom-0 z-10 bg-base pb="[env(safe-area-inset-bottom)]" transition="padding 20">
          <CommonOfflineChecker v-if="isHydrated" />
          <NavBottom v-if="isHydrated" sm="hidden" />
        </div>
      </div>
      <!-- RIGHT DRAWER -->
      <aside
        v-if="shouldRenderRightNav && isHydrated && !wideLayout"
        hidden justify-start
        native="me-0 w-auto"
        xl="block mx-0 px-0 min-w-275px max-w-390px h-100vh"
      >
        <div
          flex="~ col" lt-lg-items-center hidden
          overscroll-y-contain
          lg="block h-100dh pb0 ps4 pt2 min-w-275px max-w-390px"
          xl="block py0 ps2 pt2 w-350px max-w-full"
        >
          <template v-if="shouldRenderRightNav">
            <slot name="right">
              <div v-show="!isUserAdjustingSettings" hidden overscroll-y-contain xl="block sticky top-0 my0 mx0 pt0 pb2" overflow-hidden>
                <div hidden xl="grid grid-rows-[auto_minmax(80vh,93vh)] gap-4">
                  <SearchWidget hidden xl="block sticky" />
                  <DrawerContent hidden xl="block overflow-y-hidden" />
                </div>
              </div>
            </slot>
          </template>
        </div>
      </aside>
    </main>
    <ModalContainer />
  </div>
</template>
