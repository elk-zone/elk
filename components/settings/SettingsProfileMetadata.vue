<script setup lang="ts">
import type { mastodon } from 'masto'

const form = defineModel<{
  fieldsAttributes: NonNullable<mastodon.v1.UpdateCredentialsParams['fieldsAttributes']>
}>({ required: true })
const dropdown = $ref<any>()

const fieldIcons = computed(() =>
  Array.from({ length: maxAccountFieldCount.value }, (_, i) =>
    getAccountFieldIcon(form.value.fieldsAttributes[i].name),
  ),
)

const fieldCount = $computed(() => {
  // find last non-empty field
  const idx = [...form.value.fieldsAttributes].reverse().findIndex(f => f.name || f.value)
  if (idx === -1)
    return 1
  return Math.min(
    form.value.fieldsAttributes.length - idx + 1,
    maxAccountFieldCount.value,
  )
})

function chooseIcon(i: number, text: string) {
  form.value.fieldsAttributes[i].name = text
  dropdown[i]?.hide()
}
</script>

<template>
  <div space-y-2>
    <div font-medium>
      {{ $t('settings.profile.appearance.profile_metadata') }}
    </div>
    <div text-sm text-secondary>
      {{ $t('settings.profile.appearance.profile_metadata_desc', [maxAccountFieldCount]) }}
    </div>

    <div flex="~ col gap4">
      <div v-for="i in fieldCount" :key="i" flex="~ gap3" items-center>
        <CommonDropdown ref="dropdown" placement="left">
          <CommonTooltip :content="$t('tooltip.pick_an_icon')">
            <button type="button" btn-action-icon>
              <div :class="fieldIcons[i - 1] || 'i-ri:question-mark'" />
            </button>
          </CommonTooltip>
          <template #popper>
            <div flex="~ wrap gap-1" max-w-60 m2 me1>
              <CommonTooltip
                v-for="(icon, text) in accountFieldIcons"
                :key="icon"
                :content="text"
              >
                <template v-if="text !== 'Joined'">
                  <button type="button" btn-action-icon @click="chooseIcon(i - 1, text)">
                    <div text-xl :class="icon" />
                  </button>
                </template>
              </CommonTooltip>
            </div>
          </template>
        </CommonDropdown>
        <input
          v-model="form.fieldsAttributes[i - 1].name"
          type="text" placeholder-text-secondary
          :placeholder="$t('settings.profile.appearance.profile_metadata_label')"
          input-base
        >
        <input
          v-model="form.fieldsAttributes[i - 1].value"
          type="text" placeholder-text-secondary
          :placeholder="$t('settings.profile.appearance.profile_metadata_value')"
          input-base
        >
      </div>
    </div>
  </div>
</template>
