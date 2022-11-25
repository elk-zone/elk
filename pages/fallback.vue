<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Error</span>
    </template>
    <slot>
      <div p5 op50>
        Upps, something went wrong.
        <!-- TODO: add Retry button -->
      </div>
    </slot>
  </MainContent>
</template>
