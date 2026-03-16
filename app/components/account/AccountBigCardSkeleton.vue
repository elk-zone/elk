<template>
  <div>
    <!-- Banner -->
    <div px2 pt2>
      <div rounded of-hidden aspect="3.19" class="flex skeleton-loading-bg" />
      <div px-4 pb-4 flex="~ col gap-2">
        <!-- User info -->
        <div flex sm:flex-row flex-col flex-gap-2>
          <div flex items-center justify-between>
            <div w-17 h-17 rounded-full border-4 border-bg-base z-2 mt--2 ms--1 of-hidden bg-base>
              <div class="flex skeleton-loading-bg" w-full h-full />
            </div>
            <div block sm:hidden class="skeleton-loading-bg" h-8 w-30 rounded-full />
          </div>
          <div sm:mt-2 flex="~ col 1 gap-2">
            <div flex class="skeleton-loading-bg" h-5 w-20 rounded />
            <div flex class="skeleton-loading-bg" h-4 w-40 rounded />
          </div>
        </div>
        <!-- Note -->
        <div flex class="skeleton-loading-bg" h-4 my3 w="3/5" rounded />
        <!-- Follow info -->
        <div flex justify-between items-center>
          <div flex class="skeleton-loading-bg" h-4 w="sm:1/2 full" rounded />
          <div sm:flex hidden class="skeleton-loading-bg" h-8 w-30 rounded-full />
        </div>
      </div>
    </div>
  </div>
</template>
