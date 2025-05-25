<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'
import { favouritedBoostedByStatusId } from '~/composables/dialog'

const type = ref<'reacted-by' | 'boosted-by'>('reacted-by')

const { client } = useAkko()

function loadPaginator() {
  if (type.value === 'boosted-by') {
    return client.value.v1.statuses.$select(favouritedBoostedByStatusId.value!).rebloggedBy.list()
  }
  return client.value.v1.statuses.$select(favouritedBoostedByStatusId.value!).favouritedBy.list()
}

const paginator = computed(() => loadPaginator())

const emojiReactions = ref<(akkoma.v1.CustomEmoji & { account: akkoma.v1.Account })[] | undefined>(undefined)
const isError = ref<Error | undefined>(undefined)

function clearError() {
  isError.value = undefined
  loadReactions()
}

async function loadReactions() {
  if (isError.value || !!emojiReactions.value)
    return
  try {
    const emojiReactionsPromises = (await fetchStatus(favouritedBoostedByStatusId.value!))
      .pleroma
      .emojiReactions
      .map((react: { name: string, url?: string, accountIds: string[] }) => react.accountIds.map(accountId => ({ accountId, shortcode: react.name, staticUrl: react.url as string, url: react.url as string, visibleInPicker: false })))
      .flat()
      .map(async react => ({
        ...react,
        account: (await fetchAccountById(react.accountId)) as akkoma.v1.Account,
      }))
    emojiReactions.value = await Promise.all(emojiReactionsPromises)
  }
  catch (e) {
    console.error(e)
    isError.value = e as Error
    emojiReactions.value = []
  }
}

onMounted(loadReactions)

function showFavouritedBy() {
  type.value = 'reacted-by'
}

function showRebloggedBy() {
  type.value = 'boosted-by'
}

const { t } = useI18n()
const tabs = [
  {
    name: 'reacted-by',
    display: t('status.reacted_by'),
    onClick: showFavouritedBy,
  },
  {
    name: 'boosted-by',
    display: t('status.boosted_by'),
    onClick: showRebloggedBy,
  },
]
</script>

<template>
  <div flex w-full items-center lg:text-lg of-x-auto scrollbar-hide>
    <template
      v-for="option in tabs"
      :key="option.name"
    >
      <div
        relative flex flex-auto cursor-pointer sm:px6 px2 rounded transition-all
        tabindex="0"
        hover:bg-active transition-100
        @click="option.onClick"
      >
        <span
          ws-nowrap mxa sm:px2 sm:py3 xl:pb4 xl:pt5 py2 text-center border-b-3
          :class="option.name === type ? 'border-primary op100 text-base' : 'border-transparent text-secondary-light hover:text-secondary op50'"
        >{{
          option.display
        }}</span>
      </div>
    </template>
  </div>
  <template v-if="type === 'boosted-by'">
    <AccountPaginator :key="`paginator-${type}`" :paginator="paginator" />
  </template>
  <template v-else>
    <div v-if="emojiReactions === undefined" text-center>
      <div i-ri:loader-2-line animate-spin mx-auto my-5 />
    </div>
    <template v-else-if="isError === undefined">
      <div
        v-for="reaction in emojiReactions"
        :key="reaction.account.id + reaction.shortcode"
        relative
      >
        <div absolute bottom-0 left-3>
          <img v-if="reaction.staticUrl" :src="reaction.staticUrl" :alt="reaction.shortcode" class="w-[30px] h-[30px] leading-[30px]">
          <div v-else class="text-[30px]">
            {{ reaction.shortcode }}
          </div>
        </div>
        <AccountCard
          :account="reaction.account"
          hover-card
          border="b base" py2 px4
        />
      </div>
      <AccountPaginator :key="`paginator-${type}`" :paginator="paginator" />
    </template>
    <CommonErrorMessage
      v-if="isError"
      id="action-list-error"
      described-by="action-list-failed"
      m-3
    >
      <header id="action-list-failed" flex justify-between>
        <div flex items-center gap-x-2 font-bold>
          <div aria-hidden="true" i-ri:error-warning-fill />
          <p>{{ $t(`list.error`) }}</p>
        </div>
        <CommonTooltip placement="bottom" :content="$t('list.clear_error')">
          <button
            flex rounded-4 p1 hover:bg-active cursor-pointer transition-100 :aria-label="$t('list.clear_error')"
            @click="clearError"
          >
            <span aria-hidden="true" w="1.75em" h="1.75em" i-ri:close-line />
          </button>
        </CommonTooltip>
      </header>
      <ol ps-2 sm:ps-1>
        <li flex="~ col sm:row" gap-y-1 sm:gap-x-2>
          <strong sr-only>{{ $t('list.error_prefix') }}</strong>
          <span>{{ isError }}</span>
        </li>
      </ol>
    </CommonErrorMessage>
  </template>
</template>
