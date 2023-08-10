<script setup lang="ts">
const { options, command } = defineProps<{
  options: string[] | {
    name: string
    icon?: string
    display: string
  }[]
  command?: boolean
}>()

const modelValue = defineModel<string>({ required: true })

const tabs = $computed(() => {
  return options.map((option) => {
    if (typeof option === 'string')
      return { name: option, display: option }
    else
      return option
  })
})

function toValidName(otpion: string) {
  return otpion.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')
}

useCommands(() => command
  ? tabs.map(tab => ({
    scope: 'Tabs',

    name: tab.display,
    icon: tab.icon ?? 'i-ri:file-list-2-line',

    onActivate: () => modelValue.value = tab.name,
  }))
  : [])
</script>

<template>
  <div flex w-full items-center lg:text-lg>
    <template v-for="option in tabs" :key="option">
      <input
        :id="`tab-${toValidName(option.name)}`"
        :checked="modelValue === option.name"
        :value="option"
        type="radio"
        name="tabs"
        display="none"
        @change="modelValue = option.name"
      ><label
        flex flex-auto cursor-pointer px3 m1 rounded transition-all
        :for="`tab-${toValidName(option.name)}`"
        tabindex="1"
        hover:bg-active transition-100
        @keypress.enter="modelValue = option.name"
      ><span
        mxa px4 py3 text-center border-b-3
        :class="modelValue === option.name ? 'font-bold border-primary' : 'op50 hover:op50 border-transparent'"
      >{{ option.display }}</span>
      </label>
    </template>
  </div>
</template>
