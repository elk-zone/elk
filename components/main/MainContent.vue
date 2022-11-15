<template>
  <div flex flex-col>
    <div flex justify-between>
      <div p3 flex gap-1>
        <slot name="title" />
      </div>
      <div p3 flex>
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </div>
</template>
