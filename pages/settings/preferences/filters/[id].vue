<script setup lang="ts">
import { useForm } from 'slimeform'
import Keyword from '~~/components/filters/Keyword.vue'

const params = useRoute().params
const client = useMastoClient()

let filter = await client.v2.filters.fetch(params.id as string)

const { form, reset, submitter, isError, isDirty } = useForm({
  form() {
    return {
      title: filter.title,
      context: filter.context,
      keywords: [
        ...filter.keywords.map(keyword => ({
          ...keyword,
          modified: false,
          removed: false,
        })),
      ],
      expiresAt: filter.expiresAt ? new Date(filter.expiresAt).toISOString().slice(0, 16) : undefined,
    }
  },
})

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
    wholeWord: 'true',
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
    .map(({ id, keyword, wholeWord }) => ({ id, keyword, wholeWord }))

  const deletedKeywords = keywords
    .filter(({ removed }) => removed)
    .map(({ id }) => ({ id, _destroy: true }))

  const body = {
    ...dirtyFields.value,
    keywordsAttributes: [
      ...deletedKeywords,
      ...modifiedKeywords,
    ],
    expiresIn: dirtyFields.value.expiresAt
      ? Math.floor((new Date(dirtyFields.value.expiresAt).getTime() - new Date().getTime()) / 1000)
      : undefined,
  }

  delete body.expiresAt

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
</script>

<template>
  <MainContent back-on-small-screen>
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
      <label space-y-2 block>
        <p font-medium>
          {{ $t('settings.preferences.filters.editing.field_expire_at') }}
        </p>
        <input
          v-model="form.expiresAt"
          type="datetime-local"
          input-base
          :min="new Date().toISOString().split('T')[0]"
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
            v-model="keyword.keyword"
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
              ref="inputRef"
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
