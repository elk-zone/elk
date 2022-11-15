<template>
  <div h-full of-hidden>
    <main grid="~ lg:cols-[1fr_40rem_1fr]" h-full>
      <div>
        <slot name="left">
          <NavTitle p4 />
        </slot>
      </div>
      <div h-full of-auto border="l r border">
        <slot />
      </div>
      <div>
        <slot name="right">
          <AccountMe />
        </slot>
      </div>
    </main>
  </div>
</template>
