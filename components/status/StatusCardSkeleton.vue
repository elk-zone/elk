<template>
  <div flex flex-col gap-2 px-4 py-3>
    <div flex gap-4>
      <div>
        <div w-12 h-12 rounded-full class="skeleton-loading-bg" />
      </div>
      <div flex="~ col 1 gap-2" pb2 min-w-0>
        <div flex class="skeleton-loading-bg" h-5 w-20 rounded />
        <div flex class="skeleton-loading-bg" h-4 w-full rounded />
        <div flex class="skeleton-loading-bg" h-4 w="4/5" rounded />
        <div flex class="skeleton-loading-bg" h-4 w="2/5" rounded />
      </div>
    </div>
  </div>
</template>
