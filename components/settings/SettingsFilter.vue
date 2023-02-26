<script lang="ts" setup>
import type { mastodon } from 'masto'

const { filter } = defineProps<{
  filter: mastodon.v2.Filter
}>()

const emit = defineEmits<{
  (e: 'filterUpdated', filter: mastodon.v2.Filter): void
  (e: 'filterRemoved', id: string): void
}>()

const { t } = useI18n()
const client = useMastoClient()

let deleteBusy = $ref<boolean>(false)
let hasStartedDelete = $ref<boolean>(false)

const router = useRouter()
const editPath = `/settings/preferences/filters/${filter.id}`

function startDelete() {
  hasStartedDelete = true
}

function cancelDelete() {
  hasStartedDelete = false
}

function editFilter() {
  router.push(editPath)
}

async function deleteFilter() {
  deleteBusy = true

  try {
    await client.v2.filters.remove(filter.id)
    emit('filterRemoved', filter.id)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    deleteBusy = false
  }
}
</script>

<template>
  <NuxtLink
    block w-full group focus:outline-none
    :to="editPath"
    @click="$scrollToTop()"
  >
    <div
      w-full flex w-fit px5 py3 md:gap2 gap4 items-center
      transition-250 group-hover:bg-active
      group-focus-visible:ring="2 current"
    >
      <div flex-1 flex items-center md:gap2 gap4>
        <div flex="~ col">
          <p mb-2>
            <span>{{ filter.title }}</span>
          </p>
          <p text-sm text-secondary pr-4>
            <b>{{ $t('settings.preferences.filters.keywords_list_prefix', filter.keywords.length) }}</b>
            {{
              filter.keywords.length
                ? filter.keywords.map(({ keyword }) => keyword).join(', ')
                : $t('settings.preferences.filters.no_keywords')
            }}
          </p>
          <span flex flex-wrap gap-2 mt-5>
            <span
              v-for="ctx in filter.context" :key="ctx"
              bg-tag px-2 py-1 rounded text-sm text-secondary whitespace-nowrap
            >
              {{ $t(`settings.preferences.filters.context.${ctx}`) }}
            </span>
          </span>
        </div>
      </div>
      <div flex="~ row gap-2" items-center>
        <template v-if="hasStartedDelete">
          <CommonTooltip :content="$t('settings.preferences.filters.confirm_delete')" no-auto-focus>
            <button
              type="submit"
              text-sm p2 border-1 transition-colors
              border-red
              class="bg-red/30 hover:bg-red/50"
              btn-action-icon
              :disabled="deleteBusy"
              @click.prevent="deleteFilter"
            >
              <span v-if="deleteBusy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
                <span block i-ri:loader-2-fill aria-hidden="true" />
              </span>
              <span v-else block text-current i-ri-check-line class="rtl-flip" />
            </button>
          </CommonTooltip>
          <CommonTooltip :content="$t('settings.preferences.filters.cancel_delete')" no-auto-focus>
            <button
              ref="delete"
              type="button"
              text-sm p2 border-1 transition-colors
              border-dark hover:text-primary
              btn-action-icon
              :aria-label="$t('settings.preferences.filters.cancel_delete')"
              :disabled="deleteBusy"
              @click.prevent="cancelDelete"
            >
              <span block text-current i-ri:close-fill class="rtl-flip" />
            </button>
          </CommonTooltip>
        </template>
        <template v-else>
          <CommonTooltip :content="$t('settings.preferences.filters.edit')" no-auto-focus>
            <button
              ref="delete"
              type="button"
              text-sm p2 border-1 transition-colors
              border-dark hover:text-primary
              btn-action-icon
              :aria-label="$t('settings.preferences.filters.edit')"
              @click.prevent="editFilter"
            >
              <span block text-current i-ri-edit-2-line class="rtl-flip" />
            </button>
          </CommonTooltip>
          <CommonTooltip :content="$t('settings.preferences.filters.delete')" no-auto-focus>
            <button
              ref="delete"
              type="button"
              text-sm p2 border-1 transition-colors
              border-dark hover:text-primary
              btn-action-icon
              :aria-label="$t('settings.preferences.filters.delete')"
              @click.prevent="startDelete"
            >
              <span v-if="deleteBusy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
                <span block i-ri:loader-2-fill aria-hidden="true" />
              </span>
              <span v-else block text-current i-ri:delete-bin-2-line class="rtl-flip" />
            </button>
          </CommonTooltip>
        </template>
      </div>
    </div>
  </NuxtLink>
</template>
