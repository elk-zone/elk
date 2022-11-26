<script setup lang="ts">
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import type { Paginator, Status } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Status[]>
}>()
</script>

<template>
  <CommonPaginator :paginator="paginator" virtual-scroller>
    <template #default="{ item, active }">
      <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[item.text]">
        <StatusCard
          :status="item"
          border="b base" py-3
        />
      </DynamicScrollerItem>
    </template>
  </CommonPaginator>
</template>
