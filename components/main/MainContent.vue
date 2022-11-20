<template>
  <div relative>
    <div sticky top-0 bg="#222" z10>
      <div flex justify-between>
        <div p3 flex gap-1>
          <slot name="title" />
        </div>
        <div p3 flex>
          <slot name="actions" />
        </div>
      </div>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
