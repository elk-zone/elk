<script setup lang="ts">
const masto = useMasto()
const paginator = masto.domainBlocks.iterate()

const unblock = async (domain: string) => {
  await masto.domainBlocks.unblock(domain)
}
</script>

<template>
  <CommonPaginator :paginator="paginator">
    <template #default="{ item }">
      <CommonDropdownItem class="!cursor-auto">
        {{ item }}
        <template #actions>
          <div i-ri:lock-unlock-line text-primary cursor-pointer @click="unblock(item)" />
        </template>
      </CommonDropdownItem>
    </template>
  </CommonPaginator>
</template>
