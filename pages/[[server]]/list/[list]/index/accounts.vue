<script setup lang="ts">
definePageMeta({
  name: 'list-accounts',
})

const params = useRoute().params
const listId = computed(() => params.list as string)

const paginator = useMastoClient().v1.lists.$select(listId.value).accounts.list()

// TODO - these are placeholder vars -- need to rename &/or set correctly
const actionError = false
const createText = ref('')
const inputRef = ref<HTMLInputElement>()
function addAccount() {
  // TODO: implement
}
</script>

<template>
  <!-- Search Accounts You Follow -->
  <form
    border="t base"
    p-4 w-full
    flex="~ wrap" relative gap-3
    :aria-describedby="actionError ? 'create-list-error' : undefined"
    :class="actionError ? 'border border-base border-rounded rounded-be-is-0 rounded-be-ie-0 border-b-unset border-$c-danger-active' : null"
    @submit.prevent="addAccount"
  >
    <div
      bg-base border="~ base" flex-1 h10 ps-1 pe-4 rounded-2 w-full flex="~ row"
      items-center relative focus-within:box-shadow-outline gap-3
      ps-4
    >
      <div i-ri:search-2-line pointer-events-none text-secondary mt="1px" class="rtl-flip" />
      <input
        ref="inputRef"
        v-model="createText"
        bg-transparent
        outline="focus:none"
        ps-3
        rounded-3
        pb="1px"
        h-full
        w-full
        placeholder-text-secondary
        :placeholder="$t('list.search_following_placeholder')"
        @keypress.enter="addAccount"
      >
    </div>
  </form>

  <CommonPaginator :paginator="paginator">
    <template #default="{ item }">
      <ListAccount
        :account="item"
        :list="listId"
        hover-card
        border="b base" py2 px4
      />
    </template>
  </CommonPaginator>
</template>
