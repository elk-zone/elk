<template>
  <div h-full of-hidden>
    <main grid="~ lg:cols-[1fr_40rem_1fr]" max-w-80rem mxa h-full>
      <div>
        <slot name="left">
          <AccountMe />
        </slot>
      </div>
      <div h-full of-auto border="l r border">
        <slot />
      </div>
      <div flex="~ col">
        <slot name="right">
          <NavTitle p5 />
          <NavSide border="y border" py8 />
          <div flex-auto />
          <NavFooter />
        </slot>
      </div>
    </main>
  </div>
</template>
