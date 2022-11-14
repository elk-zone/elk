<template>
  <div h-full of-hidden>
    <main grid="~ lg:cols-[1fr_40rem_1fr]" h-full>
      <div>
        <NavTitle p4 />
      </div>
      <div h-full of-auto border="l r border">
        <slot />
      </div>
      <div>Right</div>
    </main>
  </div>
</template>
