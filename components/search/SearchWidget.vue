<script setup lang="ts">
const query = ref('')
const { accounts, hashtags, loading } = useSearch(query)
</script>

<template>
  <div py2 px4 relative group>
    <div bg-base border="~ base" h10 rounded-full flex="~ row" items-center relative outline-primary outline-1 focus-within:outline transition-all transition-duration-500>
      <div i-ri:search-2-line mx4 absolute pointer-events-none text-secondary mt="1px" />
      <input v-model="query" h-full rounded-full w-full pl-10 bg-transparent outline="focus:none" pr-4 placeholder="Search Elk" pb="1px" placeholder-text-secondary>
    </div>

    <!-- Search Results -->
    <div absolute mt-2 block left-0 right-0 px-4 z-5 group-focus-within="op100 pointer-events-auto" op0 pointer-events-none transition-opacity transition-100>
      <div bg-base border="~ base" rounded-md max-h-120 overflow-auto overflow-x-hidden>
        <template v-if="(!loading && !query) || !query">
          <div py2 px-4 text-secondary text-sm text-center>
            Try searching for accounts or hashtags
          </div>
        </template>

        <!-- Twitter seems to only include 3 hashtag results in a search. For now we'll copy that unless we come up with a better solution -->
        <template v-if="hashtags && query">
          <NuxtLink v-for="hashtag in hashtags.slice(0, 3)" :key="hashtag.name" :to="`/tags/${hashtag}`" px4 py2 block flex flex-row items-center gap-3>
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
          </NuxtLink>
        </template>

        <template v-if="accounts && query">
          <NuxtLink v-for="account in accounts" :key="account.id" :to="getAccountRoute(account)" px4 py2 block>
            <AccountInfo :account="account" />
          </NuxtLink>
        </template>

        <!-- Loading Skeleton -->
        <template v-if="loading && query">
          <div flex flex-col gap-2 px-4 py4>
            <div v-for="_ in 3" :key="_" flex gap-4>
              <div>
                <div w-12 h-12 rounded-full class="skeleton-loading-bg" />
              </div>
              <div flex="~ col 1 gap-2" pb2 min-w-0>
                <div flex class="skeleton-loading-bg" h-5 w-20 rounded />
                <div flex class="skeleton-loading-bg" h-4 w-full rounded />
              </div>
            </div>
          </div>
        </template>

        <NuxtLink v-if="query && !loading" to="/" block w-full text-center text-sm py2 hover:bg-active flex flex-row items-center justify-center text-secondary border="t-1 base">
          View More Results
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
