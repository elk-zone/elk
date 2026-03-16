<script setup lang="ts">
const { client } = useMasto()
const paginator = client.value.v1.domainBlocks.list()

async function unblock(domain: string) {
  await client.value.v1.domainBlocks.remove({ domain })
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
