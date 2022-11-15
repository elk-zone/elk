<template>
  <div h-full of-hidden>
    <main grid="~ lg:cols-[1fr_40rem_18rem]" h-full>
      <div>
        <slot name="left">
          <NavTitle p4 />
        </slot>
      </div>
      <div h-full of-auto border="l r border">
        <slot />
      </div>
      <div flex="~ col">
        <slot name="right">
          <AccountMe />
          <NavSide border="y border" py8 />
          <div flex-auto />
          <NavFooter />
        </slot>
      </div>
    </main>
  </div>
</template>
