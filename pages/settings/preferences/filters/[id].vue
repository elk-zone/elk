<script setup lang="ts">
import { useForm } from 'slimeform'

const params = useRoute().params
const client = useMastoClient()

const filter = await client.v2.filters.fetch(params.id as string)

const { form, reset, submitter, isError, isDirty } = useForm({
  form() {
    return {
      ...filter,
    }
  },
})

const isCanSubmit = computed(() => !isError.value && isDirty.value)

const submitterResult = submitter(async ({ dirtyFields, reset }) => {
  if (!isCanSubmit.value)
    return

  const res = await client.v2.filters.update(params.id as string, dirtyFields.value)
    .then(filter => ({ filter }))
    .catch((error: Error) => ({ error }))

  if ('error' in res) {
    // TODO: Show error message
    console.error('Error(updateCredentials):', res.error)
  }

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
          {{ $t('settings.preferences.filters.editing.contexts') }}
        </p>
        <CommonCheckbox v-model="form.context" value="home" :label="$t('settings.preferences.filters.context.home')" hover />
        <CommonCheckbox v-model="form.context" value="account" :label="$t('settings.preferences.filters.context.account')" hover />
        <CommonCheckbox v-model="form.context" value="notifications" :label="$t('settings.preferences.filters.context.notifications')" hover />
        <CommonCheckbox v-model="form.context" value="thread" :label="$t('settings.preferences.filters.context.thread')" hover />
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
