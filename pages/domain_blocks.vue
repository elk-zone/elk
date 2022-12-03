<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().domainBlocks.iterate()

useHeadFixed({
  title: 'Blocked domains',
})

const unblock = async (domain: string) => {
  await useMasto().domainBlocks.unblock(domain)
}
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ $t('account.blocked_domains') }}</span>
    </template>

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
  </MainContent>
</template>
