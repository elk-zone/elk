<template>
  <div h-full>
    <main flex w-full mxa lg:max-w-80rem>
      <div class="hidden md:block w-1/4" relative>
        <div sticky top-0 h-screen flex="~ col">
          <slot name="left">
            <AccountMe v-if="currentUser" />
            <AccountSignIn v-else />
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
  </div>
</template>
