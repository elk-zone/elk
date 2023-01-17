<script setup lang="ts">
const { t } = useI18n()
const params = useRoute().params
const handle = $(computedEager(() => params.account as string))

definePageMeta({ name: 'account-following-hashtags' })

const account = await fetchAccountByHandle(handle)
const paginator = useMastoClient().v1.followedTags.list({
  limit: 20,
})

if (account) {
  useHeadFixed({
    title: () => `${t('account.following_tag')} | ${getDisplayName(account)} (@${account.acct})`,
  })
}
</script>

<template>
  <TagCardPaginator v-bind="{ paginator }" />
</template>
