<script setup lang="ts">
const emit = defineEmits(['close'])

/* TODOs:
 * - I18n
 */

interface ShortcutDef {
  keys: string[]
  isSequence: boolean
}

interface ShortcutItem {
  description: string
  shortcut: ShortcutDef
}

interface ShortcutItemGroup {
  name: string
  items: ShortcutItem[]
}

const shortcutItemGroups: ShortcutItemGroup[] = [
  {
    name: 'Navigation',
    items: [
      {
        description: 'Shortcut help',
        shortcut: { keys: ['?'], isSequence: false },
      },
      {
        description: 'Next status',
        shortcut: { keys: ['j'], isSequence: false },
      },
      {
        description: 'Previous status',
        shortcut: { keys: ['k'], isSequence: false },
      },
      {
        description: 'Home',
        shortcut: { keys: ['g', 'h'], isSequence: true },
      },
      {
        description: 'Notifications',
        shortcut: { keys: ['g', 'n'], isSequence: true },
      },
    ],
  },
  {
    name: 'Actions',
    items: [
      {
        description: 'Command mode',
        shortcut: { keys: ['cmd', '/'], isSequence: false },
      },
      {
        description: 'Compose',
        shortcut: { keys: ['c'], isSequence: false },
      },
    ],
  },
  {
    name: 'Media',
    items: [],
  },
]
</script>

<template>
  <div px-3 sm:px-5 py-2 sm:py-4 max-w-220 relative max-h-screen>
    <button btn-action-icon absolute top-1 sm:top-2 right-1 sm:right-2 m1 aria-label="Close" @click="emit('close')">
      <div i-ri:close-fill />
    </button>
    <h2 text-xl font-700 mb3>
      Keyboard shortcuts
    </h2>
    <div mb2 grid grid-cols-1 md:grid-cols-3 gap-y- md:gap-x-6 lg:gap-x-8>
      <div
        v-for="group in shortcutItemGroups"
        :key="group.name"
      >
        <h3 font-700 my-2 text-lg>
          {{ group.name }}
        </h3>
        <div
          v-for="item in group.items"
          :key="item.description"
          flex my-1 lg:my-2 justify-between place-items-center max-w-full text-base
        >
          <div mr-2 break-words overflow-hidden leading-4 h-full inline-block align-middle>
            {{ item.description }}
          </div>
          <div>
            <template
              v-for="(key, idx) in item.shortcut.keys"
              :key="idx"
            >
              <span v-if="idx !== 0" mx1 text-sm op80>{{ item.shortcut.isSequence ? 'then' : '+' }}</span>
              <code class="px2 md:px1.5 lg:px2 lg:px2 py0 lg:py-0.5" rounded bg-code border="px $c-border-code" shadow-sm my1 font-mono font-600>{{ key }}</code>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
