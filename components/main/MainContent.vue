<template>
  <div relative>
    <div
      sticky top-0 z10
      border="b base"
      backdrop="blur-10px brightness-120 dark:brightness-80"
    >
      <div flex justify-between px5 py4>
        <div flex gap-1>
          <slot name="title">
            <NuxtLink flex="~ gap1" items-center btn-text p-0 @click="$router.go(-1)">
              <div i-ri-arrow-left-line />
              Back
            </NuxtLink>
          </slot>
        </div>
        <div flex>
          <slot name="actions" />
        </div>
      </div>
      <slot name="header" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
