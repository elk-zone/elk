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

const deleteBusy = $ref<boolean>(false)
let hasStartedDelete = $ref<boolean>(false)

const context = $computed(() => {
  const list = filter.context.map(context => t(`settings.preferences.filters.context.${context}`)).join(', ')

  return t('settings.preferences.filters.context.filters_in', [list])
})

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

function deleteFilter() {
  emit('filterRemoved', filter.id)
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
        <div flex="~ col gap-0.5">
          <p>
            <span>{{ filter.title }}</span>
          </p>
          <p text-sm text-secondary>
            {{ filter.keywords.map(({ keyword }) => keyword).join(', ') }}
          </p>
        </div>
      </div>
      <div flex="~ row gap-2" items-center>
        <CommonTooltip :content="context">
          <div text-secondary-light hover:text-blue class="hover:bg-blue/10" rounded-full p-2 transition-all>
            <div class="i-ri-information-line rtl-flip" text-xl />
          </div>
        </CommonTooltip>
        <template v-if="hasStartedDelete">
          <CommonTooltip :content="$t('settings.preferences.filters.confirm_delete')" no-auto-focus>
            <button
              type="submit"
              text-sm p2 border-1 transition-colors
              border-red
              class="bg-red/30 hover:bg-red/50"
              btn-action-icon
              :disabled="deleteBusy"
            >
              <span v-if="deleteBusy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
                <span block i-ri:loader-2-fill aria-hidden="true" />
              </span>
              <span v-else block text-current i-ri:save-2-fill class="rtl-flip" />
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
              <span v-if="deleteBusy" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
                <span block i-ri:loader-2-fill aria-hidden="true" />
              </span>
              <span v-else block text-current i-ri:close-fill class="rtl-flip" />
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
