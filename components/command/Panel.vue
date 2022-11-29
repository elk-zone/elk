<script setup lang="ts">
import type { CommandParent, QueryIndexedCommand } from '@/composables/command'

const isMac = useIsMac()
const registry = useCommandRegistry()

const inputEl = $ref<HTMLInputElement>()
const resultEl = $ref<HTMLDivElement>()

let show = $ref(false)
let scopes = $ref<CommandParent[]>([])
let input = $ref('')

// listen to ctrl+/ on windows/linux or cmd+/ on mac
useEventListener('keydown', async (e: KeyboardEvent) => {
  if (e.key === '/' && (isMac.value ? e.metaKey : e.ctrlKey)) {
    e.preventDefault()
    show = true
    scopes = []
    input = '>'
    await nextTick()
    inputEl?.focus()
  }
})
onKeyStroke('Escape', (e) => {
  e.preventDefault()
  show = false
}, { target: document })

const commandMode = $computed(() => input.startsWith('>'))
const result = $computed(() => commandMode
  ? registry.query(scopes.map(s => s.id).join('.'), input.slice(1))
  : { length: 0, items: [], grouped: {} })
let active = $ref(0)
watch($$(result), (n, o) => {
  if (n.length !== o.length || !n.items.every((i, idx) => i === o.items[idx]))
    active = 0
})

const findItemEl = (index: number) =>
  resultEl?.querySelector(`[data-index="${index}"]`) as HTMLDivElement | null
const onCommandActivate = (item: QueryIndexedCommand) => {
  if (item.onActivate) {
    item.onActivate()
    show = false
  }
  else if (item.onComplete) {
    scopes.push(item.onComplete())
    input = '>'
  }
}
const onCommandComplete = (item: QueryIndexedCommand) => {
  if (item.onComplete) {
    scopes.push(item.onComplete())
    input = '>'
  }
  else if (item.onActivate) {
    item.onActivate()
  }
}
const intoView = (index: number) => {
  const el = findItemEl(index)
  if (el)
    el.scrollIntoView({ block: 'nearest' })
}
const onKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp': {
      e.preventDefault()

      active = Math.max(0, active - 1)

      intoView(active)

      break
    }

    case 'ArrowDown': {
      e.preventDefault()

      active = Math.min(result.length - 1, active + 1)

      intoView(active)

      break
    }

    case 'Home': {
      e.preventDefault()

      active = 0

      intoView(active)

      break
    }

    case 'End': {
      e.preventDefault()

      active = result.length - 1

      intoView(active)

      break
    }

    case 'Enter': {
      e.preventDefault()

      const cmd = result.items[active]
      if (cmd)
        onCommandActivate(cmd)

      break
    }

    case 'Tab': {
      e.preventDefault()

      const cmd = result.items[active]
      if (cmd)
        onCommandComplete(cmd)

      break
    }

    case 'Backspace': {
      if (input === '>' && scopes.length) {
        e.preventDefault()
        scopes.pop()
      }
      break
    }
  }
}
</script>

<template>
  <!-- Overlay -->
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="transform opacity-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="transform opacity-100"
    leave-to-class="transform opacity-0"
  >
    <div
      v-if="show"
      class="z-100 fixed inset-0 opacity-70 bg-base"
      @click="show = false"
    />
  </Transition>

  <!-- Panel -->
  <Transition
    enter-active-class="transition duration-65 ease-out"
    enter-from-class="transform scale-95"
    enter-to-class="transform scale-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="transform scale-100"
    leave-to-class="transform scale-95"
  >
    <div v-if="show" class="z-100 fixed inset-0 grid place-items-center pointer-events-none">
      <div
        class="flex flex-col w-50vw h-50vh rounded-md bg-base shadow-lg pointer-events-auto"
        border="1 base"
      >
        <!-- Input -->
        <label class="flex mx-3 my-1 items-center">
          <div mx-1 i-ri:search-line />

          <div v-for="scope in scopes" :key="scope.id" class="flex items-center mx-1 gap-2">
            <div class="text-sm">{{ scope.display }}</div>
            <span class="text-secondary">/</span>
          </div>

          <input
            ref="inputEl"
            v-model="input"
            class="focus:outline-none flex-1 p-2 rounded bg-base"
            placeholder="Search"
            @keydown="onKeyDown"
          >

          <CommandKey name="Escape" />
        </label>

        <div class="w-full border-b-1 border-base" />

        <!-- Results -->
        <div ref="resultEl" class="flex-1 mx-1 overflow-y-auto">
          <template v-for="[scope, group] in result.grouped" :key="scope">
            <div class="mt-2 px-2 py-1 text-sm text-secondary">
              {{ scope }}
            </div>

            <template v-for="cmd in group" :key="cmd.index">
              <div
                class="flex px-3 py-2 my-1 items-center rounded-lg transition-all duration-65 ease-in-out cursor-pointer scroll-m-10"
                :class="{ 'bg-active': active === cmd.index }"
                :data-index="cmd.index"
                @click="onCommandActivate(cmd)"
              >
                <div v-if="cmd.icon" mr-2 :class="cmd.icon" />

                <div class="flex-1 flex items-baseline gap-2">
                  <div :class="{ 'font-medium': active === cmd.index }">
                    {{ cmd.name }}
                  </div>
                  <div v-if="cmd.description" class="text-xs text-secondary">
                    {{ cmd.description }}
                  </div>
                </div>

                <div
                  v-if="cmd.onComplete"
                  class="flex items-center gap-1 transition-all duration-65 ease-in-out"
                  :class="active === cmd.index ? 'opacity-100' : 'opacity-0'"
                >
                  <div class="text-xs text-secondary">
                    Complete
                  </div>
                  <CommandKey name="Tab" />
                </div>
                <div
                  v-if="cmd.onActivate"
                  class="flex items-center gap-1 transition-all duration-65 ease-in-out"
                  :class="active === cmd.index ? 'opacity-100' : 'opacity-0'"
                >
                  <div class="text-xs text-secondary">
                    Activate
                  </div>
                  <CommandKey name="Enter" />
                </div>
              </div>
            </template>
          </template>
        </div>

        <div class="w-full border-b-1 border-base" />

        <!-- Footer -->
        <div class="flex items-center px-3 py-1 text-xs">
          <div i-ri:lightbulb-flash-line />
          Tip: Use <CommandKey name="Ctrl+K" /> to search,
          <CommandKey name="Ctrl+/" /> to activate command mode.
        </div>
      </div>
    </div>
  </Transition>
</template>
