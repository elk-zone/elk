<script setup lang="ts">
import type { UpdateCredentialsParams } from 'masto'

const { form } = defineModel<{
  form: {
    fieldsAttributes: NonNullable<UpdateCredentialsParams['fieldsAttributes']>
  }
}>()

const fieldIcons = computed(() =>
  Array.from({ length: 4 }, (_, i) =>
    getAccountFieldIcon(form.value.fieldsAttributes[i].name),
  ),
)
</script>

<template>
  <div flex="~ col gap4">
    <div v-for="i in 4" :key="i" flex="~ gap3" items-center>
      <CommonDropdown placement="left">
        <CommonTooltip content="Pick a icon">
          <button btn-action-icon>
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
                <div btn-action-icon @click="form.fieldsAttributes[i - 1].name = text">
                  <div text-xl :class="icon" />
                </div>
              </template>
            </CommonTooltip>
          </div>
        </template>
      </CommonDropdown>
      <input
        v-model="form.fieldsAttributes[i - 1].name"
        type="text"
        p2 border-rounded w-full bg-transparent
        outline-none border="~ base"
        placeholder="Label"
      >
      <input
        v-model="form.fieldsAttributes[i - 1].value"
        type="text"
        p2 border-rounded w-full bg-transparent
        outline-none border="~ base"
        placeholder="Content"
      >
    </div>
  </div>
</template>
