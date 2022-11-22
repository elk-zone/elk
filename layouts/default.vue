<template>
  <div h-full>
    <main flex w-full mxa lg:max-w-80rem>
      <div class="w-1/4" hidden lg:flex flex-col items-end>
        <div fixed>
          <slot name="left">
            <AccountMe />
          </slot>
        </div>
      </div>
      <div class="lg:w-3/4" flex>
        <div class="w-full md:w-2/3" border="l r border" min-h-screen>
          <slot />
        </div>
        <div hidden md:flex="~ col" class="w-1/3">
          <div fixed>
            <slot name="right">
              <NavTitle p5 />
              <NavSide border="y border" py8 />
              <div flex-auto />
              <NavFooter />
            </slot>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
