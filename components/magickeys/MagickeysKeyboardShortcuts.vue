<script setup lang="ts">
const emit = defineEmits(['close'])
const { t } = useI18n()

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

const isMac = useIsMac()
const modifierKeyName = computed(() => isMac.value ? '⌘' : 'Ctrl')

const shortcutItemGroups = computed<ShortcutItemGroup[]>(() => [
  {
    name: t('magic_keys.groups.navigation.title'),
    items: [
      {
        description: t('magic_keys.groups.navigation.shortcut_help'),
        shortcut: { keys: ['?'], isSequence: false },
      },
      {
        description: t('magic_keys.groups.navigation.next_status'),
        shortcut: { keys: ['j'], isSequence: false },
      },
      {
        description: t('magic_keys.groups.navigation.previous_status'),
        shortcut: { keys: ['k'], isSequence: false },
      },
      {
        description: t('magic_keys.groups.navigation.go_to_search'),
        shortcut: { keys: ['/'], isSequence: false },
      },
      {
        description: t('magic_keys.groups.navigation.go_to_home'),
        shortcut: { keys: ['g', 'h'], isSequence: true },
      },
      {
        description: t('magic_keys.groups.navigation.go_to_notifications'),
        shortcut: { keys: ['g', 'n'], isSequence: true },
      },
      {
        description: t('magic_keys.groups.navigation.go_to_conversations'),
        shortcut: { keys: ['g', 'c'], isSequence: true },
      },
      {
        description: t('magic_keys.groups.navigation.go_to_favourites'),
        shortcut: { keys: ['g', 'f'], isSequence: true },
      },
      {
        description: t('magic_keys.groups.navigation.go_to_bookmarks'),
        shortcut: { keys: ['g', 'b'], isSequence: true },
      },
      {
        description: t('magic_keys.groups.navigation.go_to_explore'),
        shortcut: { keys: ['g', 'e'], isSequence: true },
      },
      {
        description: t('magic_keys.groups.navigation.go_to_local'),
        shortcut: { keys: ['g', 'l'], isSequence: true },
      },
      {
        description: t('magic_keys.groups.navigation.go_to_federated'),
        shortcut: { keys: ['g', 't'], isSequence: true },
      },
      {
        description: t('magic_keys.groups.navigation.go_to_lists'),
        shortcut: { keys: ['g', 'i'], isSequence: true },
      },
      {
        description: t('magic_keys.groups.navigation.go_to_settings'),
        shortcut: { keys: ['g', 's'], isSequence: true },
      },
      {
        description: t('magic_keys.groups.navigation.go_to_profile'),
        shortcut: { keys: ['g', 'p'], isSequence: true },
      },
    ],
  },
  {
    name: t('magic_keys.groups.actions.title'),
    items: [
      {
        description: t('magic_keys.groups.actions.search'),
        shortcut: { keys: [modifierKeyName.value, 'k'], isSequence: false },
      },
      {
        description: t('magic_keys.groups.actions.command_mode'),
        shortcut: { keys: [modifierKeyName.value, '/'], isSequence: false },
      },
      {
        description: t('magic_keys.groups.actions.compose'),
        shortcut: { keys: ['c'], isSequence: false },
      },
      {
        description: t('magic_keys.groups.actions.show_new_items'),
        shortcut: { keys: ['.'], isSequence: false },
      },
      {
        description: t('magic_keys.groups.actions.favourite'),
        shortcut: { keys: ['f'], isSequence: false },
      },
      {
        description: t('magic_keys.groups.actions.boost'),
        shortcut: { keys: ['b'], isSequence: false },
      },
    ],
  },
  {
    name: t('magic_keys.groups.media.title'),
    items: [],
  },
])
</script>

<template>
  <div px-3 sm:px-5 py-2 sm:py-4 max-w-220 relative max-h-screen>
    <button btn-action-icon absolute top-1 sm:top-2 right-1 sm:right-2 m1 :aria-label="$t('modals.aria_label_close')" @click="emit('close')">
      <div i-ri:close-fill />
    </button>
    <h2 text-xl font-700 mb3>
      {{ $t('magic_keys.dialog_header') }}
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
              <span v-if="idx !== 0" mx1 text-sm op80>{{ item.shortcut.isSequence ? $t('magic_keys.sequence_then') : '+' }}</span>
              <code class="px2 md:px1.5 lg:px2 lg:px2 py0 lg:py-0.5" rounded bg-code border="px $c-border-code" shadow-sm my1 font-mono font-600>{{ key }}</code>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
