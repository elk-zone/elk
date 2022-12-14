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
      <div class="w-full mb14 md:(mb0) lg:(mb0) min-h-screen" border="none md:l md:r base">
        <div min-h-screen>
          <slot />
        </div>
        <div sticky left-0 right-0 bottom-0 z-10 bg-base pb="[env(safe-area-inset-bottom)]" transition="padding 20">
          <CommonOfflineChecker :small-screen="isSmallScreen" />
          <NavBottom v-if="isSmallScreen" />
        </div>
      </div>
    </main>
    <ModalContainer />
  </div>
</template>
