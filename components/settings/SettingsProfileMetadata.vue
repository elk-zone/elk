<script setup lang="ts">
import type { UpdateCredentialsParams } from 'masto'
import { accountFieldIcons, getAccountFieldIcon } from '~/composables/masto/icons'

const { form } = defineModel<{
  form: {
    fieldsAttributes: NonNullable<UpdateCredentialsParams['fieldsAttributes']>
  }
}>()
const dropdown = $ref<any>()

const fieldIcons = computed(() =>
  Array.from({ length: 4 }, (_, i) =>
    getAccountFieldIcon(form.value.fieldsAttributes[i].name),
  ),
)

const chooseIcon = (i: number, text: string) => {
  form.value.fieldsAttributes[i].name = text
  dropdown[i]?.hide()
}
</script>

<template>
  <div flex="~ col gap4">
    <div v-for="i in 4" :key="i" flex="~ gap3" items-center>
      <CommonDropdown ref="dropdown" placement="left">
        <CommonTooltip content="Pick a icon">
          <button type="button" btn-action-icon>
            <div :class="fieldIcons[i - 1] || 'i-ri:question-mark'" />
          </button>
        </CommonTooltip>
        <template #popper>
          <div flex="~ wrap gap-1" max-w-50 m2>
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
        type="text" placeholder="Label"
        input-base
      >
      <input
        v-model="form.fieldsAttributes[i - 1].value"
        type="text" placeholder="Content"
        input-base
      >
    </div>
  </div>
</template>
