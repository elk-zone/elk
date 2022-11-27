<script setup lang="ts">
const toggleFollowTag = () => {
  // TODO @Shinigami92 2022-11-27: Awaiting https://github.com/neet/masto.js/issues/708
  console.log('TODO: Follow/Unfollow tag')
}
</script>

<template>
  <button
    rounded group focus:outline-none
    hover:text-green focus-visible:text-green
    @click="toggleFollowTag()"
  >
    <CommonTooltip placement="bottom" content="Un/Follow">
      <div rounded-full p2 group-hover="bg-green/10" group-focus-visible="bg-green/10" group-focus-visible:ring="2 current">
        <div i-ri:add-box-line />
      </div>
    </CommonTooltip>
  </button>
</template>
