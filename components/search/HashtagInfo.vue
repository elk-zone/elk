<script setup lang="ts">
defineProps<{ hashtag: any }>()
</script>

<template>
  <div flex flex-row items-center gap2>
    <div w-12 h-12 rounded-full bg-active flex place-items-center place-content-center>
      <div i-ri:hashtag text-secondary text-lg />
    </div>
    <div flex flex-col>
      <span>
        {{ hashtag.name }}
      </span>
      <span text-xs text-secondary>
        {{ hashtag.following ? 'Following' : 'Not Following' }}
      </span>
    </div>
  </div>
</template>
