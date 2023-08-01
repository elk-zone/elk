<script setup lang="ts">
const { editing } = defineProps<{
  editing?: boolean
}>()

const modelValue = defineModel<string>({
  required: true,
})

const currentVisibility = $computed(() =>
  statusVisibilities.find(v => v.value === modelValue.value) || statusVisibilities[0],
)

function chooseVisibility(visibility: string) {
  modelValue.value = visibility
}
</script>

<template>
  <CommonTooltip placement="top" :content="editing ? $t(`visibility.${currentVisibility.value}`) : $t('tooltip.change_content_visibility')">
    <CommonDropdown placement="bottom">
      <slot :visibility="currentVisibility" />
      <template #popper>
        <CommonDropdownItem
          v-for="visibility in statusVisibilities"
          :key="visibility.value"
          :icon="visibility.icon"
          :text="$t(`visibility.${visibility.value}`)"
          :description="$t(`visibility.${visibility.value}_desc`)"
          :checked="visibility.value === modelValue"
          @click="chooseVisibility(visibility.value)"
        />
      </template>
    </CommonDropdown>
  </CommonTooltip>
</template>
