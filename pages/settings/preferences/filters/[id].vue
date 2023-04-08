<script setup lang="ts">
import { useForm } from 'slimeform'
import Keyword from '~~/components/filters/Keyword.vue'

const params = useRoute().params
const client = useMastoClient()

let filter = await client.v2.filters.fetch(params.id as string)

function makeISOStringUsable(iso: string) {
  return iso.slice(0, -8)
}

const expiresAtSet = ref(filter.expiresAt !== null)

const { form, reset: resetForm, submitter, isError, isDirty } = useForm({
  form() {
    const expiresAt = filter.expiresAt
      ? makeISOStringUsable(new Date(filter.expiresAt).toISOString())
      : null

    return {
      title: filter.title,
      context: filter.context,
      filterAction: filter.filterAction,
      keywords: [
        ...filter.keywords.map(keyword => ({
          ...keyword,
          modified: false,
          removed: false,
        })),
      ],
      expiresAt: expiresAtSet.value ? expiresAt : null,
    }
  },
})

function reset() {
  expiresAtSet.value = filter.expiresAt !== null
  resetForm()
}

const newKeyword = ref('')
const isCanSubmit = computed(() => !isError.value && isDirty.value)

function updateKeyword(id: string) {
  form.keywords.find(keyword => keyword.id === id)!.modified = true
}

function removeKeyword(id: string) {
  const keywordIndex = form.keywords.findIndex(keyword => keyword.id === id)

  if (keywordIndex !== -1)
    form.keywords[keywordIndex].removed = true
}

function addKeyword() {
  form.keywords.push({
    id: 'new',
    keyword: newKeyword.value,
    // @ts-expect-error 2322 Mastodon's documentation saying wholeWord is a string is wrong, it is in fact a boolean
    wholeWord: true,
    modified: true,
    removed: false,
  })
  newKeyword.value = ''
}

const submitterResult = submitter(async ({ form, dirtyFields, reset }) => {
  if (!isCanSubmit.value)
    return

  const keywords = form.keywords.map(keyword => ({ ...keyword, id: keyword.id === 'new' ? undefined : keyword.id }))

  const modifiedKeywords = keywords
    .filter(({ modified }) => modified)
    .map(({ id, keyword, wholeWord: whole_word }) => ({ id, keyword, whole_word }))

  const deletedKeywords = keywords
    .filter(({ removed }) => removed)
    .map(({ id }) => ({ id, _destroy: true }))

  const body = {
    filter_action: dirtyFields.value.filterAction,
    title: dirtyFields.value.title,
    keywords_attributes: [
      ...deletedKeywords,
      ...modifiedKeywords,
    ],
    context: dirtyFields.value.context,
    expires_in: dirtyFields.value.expiresAt
      ? Math.floor((new Date(`${dirtyFields.value.expiresAt}Z`).getTime() - new Date().getTime()) / 1000)
      : null,
  }

  const res = await client.v2.filters.update(params.id as string, body)
    .then(filter => ({ filter }))
    .catch((error: Error) => ({ error }))

  if ('error' in res) {
    // TODO: Show error message
    console.error('Error(updateCredentials):', res.error)
  }

  if ('filter' in res)
    filter = res.filter

  reset()
})

function expiresAtSetChange() {
  if (form.expiresAt === null)
    form.expiresAt = makeISOStringUsable(new Date().toISOString())
}

let deleteBusy = $ref<boolean>(false)
const { t } = useI18n()
const router = useRouter()

async function deleteFilter() {
  if (await openConfirmDialog({
    title: t('settings.preferences.filters.confirm_delete'),
    confirm: t('settings.preferences.filters.confirm_delete_button'),
    cancel: t('settings.preferences.filters.cancel_delete_button'),
  }) !== 'confirm')
    return

  deleteBusy = true

  try {
    await client.v2.filters.remove(params.id)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    router.push('/settings/preferences/filters')
  }
}
</script>

<template>
  <MainContent
    back-on-small-screen
    :class="deleteBusy ? 'opacity-50 pointer-events-none' : ''"
  >
    <form p6 space-y-5 @submit.prevent="submitterResult.submit">
      <label space-y-2 block>
        <p font-medium>
          {{ $t('settings.preferences.filters.editing.field_title') }}
        </p>
        <input v-model="form.title" type="text" input-base>
      </label>
      <div space-y-2 block>
        <p font-medium>
          {{ $t('settings.preferences.filters.editing.field_contexts') }}
        </p>
        <CommonCheckbox v-model="form.context" value="home" :label="$t('settings.preferences.filters.context.home')" hover />
        <CommonCheckbox v-model="form.context" value="account" :label="$t('settings.preferences.filters.context.account')" hover />
        <CommonCheckbox v-model="form.context" value="notifications" :label="$t('settings.preferences.filters.context.notifications')" hover />
        <CommonCheckbox v-model="form.context" value="thread" :label="$t('settings.preferences.filters.context.thread')" hover />
        <CommonCheckbox v-model="form.context" value="public" :label="$t('settings.preferences.filters.context.public')" hover />
      </div>
      <fieldset flex="~ col" gap-y-1 py-1>
        <legend font-medium>
          {{ $t('settings.preferences.filters.editing.field_filter_action') }}
        </legend>
        <CommonRadio v-model="form.filterAction" ms--2 px-4 py-2 hover:bg-active value="warn" :label="$t('settings.preferences.filters.filter_action.warn')" />
        <CommonRadio v-model="form.filterAction" ms--2 px-4 py-2 hover:bg-active value="hide" :label="$t('settings.preferences.filters.filter_action.hide')" />
      </fieldset>
      <label space-y-2 block>
        <p font-medium>
          {{ $t('settings.preferences.filters.editing.field_expire_at') }}
        </p>
        <select v-model="expiresAtSet" class="select-settings" @change="expiresAtSetChange">
          <option :value="false" :selected="!expiresAtSet">
            {{ $t('settings.preferences.filters.expires_at_never') }}
          </option>
          <option :value="true" :selected="expiresAtSet">
            {{ $t('settings.preferences.filters.expires_at_custom_date') }}
          </option>
        </select>
        <input
          v-if="expiresAtSet"
          v-model="form.expiresAt"
          type="datetime-local"
          input-base
          :min="makeISOStringUsable(new Date().toISOString())"
        >
      </label>
      <div space-y-2 block>
        <p font-medium>
          {{ $t('settings.preferences.filters.editing.field_keywords') }}
        </p>
        <template
          v-for="keyword in form.keywords"
          :key="keyword.keyword"
        >
          <Keyword
            v-if="!keyword.removed"
            v-model:text="keyword.keyword"
            v-model:whole-world="keyword.wholeWord"
            :class="keyword.modified ? 'keyword-modified bg-active' : 'keyword'"
            @on-update="updateKeyword(keyword.id)"
            @on-remove="removeKeyword(keyword.id)"
          />
        </template>
        <form
          border="t base"
          p-4 w-full
          flex="~ wrap" relative gap-3
          @submit.prevent="addKeyword"
        >
          <div
            bg-base border="~ base" flex-1 h10 ps-1 pe-4 rounded-2 w-full flex="~ row"
            items-center relative focus-within:box-shadow-outline gap-3
          >
            <input
              v-model="newKeyword"
              bg-transparent
              outline="focus:none"
              px-4
              pb="1px"
              flex-1
              placeholder-text-secondary
              placeholder="Keyword"
              @keypress.enter="addKeyword"
            >
          </div>
          <div flex="~ col" gap-y-4 gap-x-2 sm="~ justify-between flex-row">
            <button flex="~ row" gap-x-2 items-center btn-solid :disabled="newKeyword.length === 0">
              {{ $t('settings.preferences.filters.editing.add') }}
            </button>
          </div>
        </form>
      </div>
      <div flex="~ gap2" justify-end>
        <button
          type="button"
          btn-text text-sm
          flex gap-x-2 items-center
          text-red
          @click="reset()"
        >
          <div aria-hidden="true" i-ri:eraser-line />
          {{ $t('action.reset') }}
        </button>
        <button
          type="button"
          btn-text text-sm
          border border-red rounded-full
          flex gap-x-2 items-center
          class="hover:bg-red/20 hover:text-base"
          text-red
          @click="deleteFilter()"
        >
          <div aria-hidden="true" i-ri:delete-bin-2-line />
          {{ $t('settings.preferences.filters.delete_start_button') }}
        </button>

        <button
          type="submit"
          btn-solid rounded-full text-sm
          flex gap-x-2 items-center
          :disabled="submitterResult.submitting.value || !isCanSubmit"
        >
          <span v-if="submitterResult.submitting.value" aria-hidden="true" block animate-spin preserve-3d>
            <span block i-ri:loader-2-fill aria-hidden="true" />
          </span>
          <span v-else aria-hidden="true" block i-ri:save-line />
          {{ $t('action.save') }}
        </button>
      </div>
    </form>
  </MainContent>
</template>

<style>
  .keyword {
    /* to avoid the border taking up visual space */
    border-left: 2px solid transparent;
  }

  .keyword-modified {
    border-left: 2px solid var(--c-primary);
  }
</style>
