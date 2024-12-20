<script setup lang="ts">
import type { NavButtonName } from '~/composables/settings'
import { STORAGE_KEY_BOTTOM_NAV_BUTTONS } from '~/constants'

interface NavButton {
  name: NavButtonName
  label: string
  icon: string
}

const availableNavButtons: NavButton[] = [
  { name: 'home', label: 'nav.home', icon: 'i-ri:home-5-line' },
  { name: 'search', label: 'nav.search', icon: 'i-ri:search-line' },
  { name: 'notification', label: 'nav.notifications', icon: 'i-ri:notification-4-line' },
  { name: 'mention', label: 'nav.conversations', icon: 'i-ri:at-line' },
  { name: 'favorite', label: 'nav.favourites', icon: 'i-ri:heart-line' },
  { name: 'bookmark', label: 'nav.bookmarks', icon: 'i-ri:bookmark-line' },
  { name: 'compose', label: 'nav.compose', icon: 'i-ri:quill-pen-line' },
  { name: 'explore', label: 'nav.explore', icon: 'i-ri:compass-3-line' },
  { name: 'local', label: 'nav.local', icon: 'i-ri:group-2-line' },
  { name: 'federated', label: 'nav.federated', icon: 'i-ri:earth-line' },
  { name: 'list', label: 'nav.lists', icon: 'i-ri:list-check' },
  { name: 'hashtag', label: 'nav.hashtags', icon: 'i-ri:hashtag' },
  { name: 'moreMenu', label: 'nav.more_menu', icon: 'i-ri:more-fill' },
] as const

const defaultSelectedNavButtonNames = computed<NavButtonName[]>(() =>
  currentUser.value
    ? ['home', 'search', 'notification', 'mention', 'moreMenu']
    : ['explore', 'local', 'federated', 'moreMenu'],
)
const navButtonNamesSetting = useLocalStorage<NavButtonName[]>(STORAGE_KEY_BOTTOM_NAV_BUTTONS, defaultSelectedNavButtonNames.value)
const selectedNavButtonNames = ref<NavButtonName[]>(navButtonNamesSetting.value)

const selectedNavButtons = computed<NavButton[]>(() =>
  selectedNavButtonNames.value.map(name =>
    availableNavButtons.find(navButton => navButton.name === name)!,
  ),
)

const canSave = computed(() =>
  selectedNavButtonNames.value.length > 0
  && selectedNavButtonNames.value.includes('moreMenu')
  && JSON.stringify(selectedNavButtonNames.value) !== JSON.stringify(navButtonNamesSetting.value),
)

function isAdded(name: NavButtonName) {
  return selectedNavButtonNames.value.includes(name)
}

function append(navButtonName: NavButtonName) {
  const maxButtonNumber = 5
  if (selectedNavButtonNames.value.length < maxButtonNumber)
    selectedNavButtonNames.value = [...selectedNavButtonNames.value, navButtonName]
}

function remove(navButtonName: NavButtonName) {
  selectedNavButtonNames.value = selectedNavButtonNames.value.filter(name => name !== navButtonName)
}

function clear() {
  selectedNavButtonNames.value = []
}

function reset() {
  selectedNavButtonNames.value = defaultSelectedNavButtonNames.value
}

function save() {
  navButtonNamesSetting.value = selectedNavButtonNames.value
}
</script>

<template>
  <section space-y-2>
    <h2 id="interface-bn" font-medium>
      {{ $t('settings.interface.bottom_nav') }}
    </h2>
    <form aria-labelledby="interface-bn" aria-describedby="interface-bn-desc" @submit.prevent="save">
      <p id="interface-bn-desc" pb-2>
        {{ $t('settings.interface.bottom_nav_instructions') }}
      </p>
      <!-- preview -->
      <div aria-hidden="true" flex="~ gap4 wrap" items-center select-settings h-14>
        <nav
          v-for="availableNavButton in selectedNavButtons" :key="availableNavButton.name"
          flex="~ 1" items-center justify-center text-xl
          scrollbar-hide overscroll-none
        >
          <span :class="availableNavButton.icon" />
        </nav>
      </div>

      <!-- button selection -->
      <div flex="~ gap4 wrap" py4>
        <button
          v-for="{ name, label, icon } in availableNavButtons"
          :key="name"
          btn-text flex="~ gap-2" items-center p2 border="~ base rounded" bg-base ws-nowrap
          :class="isAdded(name) ? 'text-secondary hover:text-second bg-auto' : ''"
          type="button"
          role="switch"
          :aria-checked="isAdded(name)"
          @click="isAdded(name) ? remove(name) : append(name)"
        >
          <span :class="icon" />
          {{ label ? $t(label) : 'More menu' }}
        </button>
      </div>

      <div flex="~ col" gap-y-4 gap-x-2 py-1 sm="~ justify-end flex-row">
        <button
          btn-outline font-bold py2 full-w sm-wa flex="~ gap2 center"
          type="button"
          :disabled="selectedNavButtonNames.length === 0"
          :class="selectedNavButtonNames.length === 0 ? 'border-none' : undefined"
          @click="clear"
        >
          <span aria-hidden="true" class="block i-ri:delete-bin-line" />
          {{ $t('action.clear') }}
        </button>
        <button
          btn-outline font-bold py2 full-w sm-wa flex="~ gap2 center"
          type="reset"
          @click="reset"
        >
          <span aria-hidden="true" class="block i-ri:repeat-line" />
          {{ $t('action.reset') }}
        </button>
        <button
          btn-solid font-bold py2 full-w sm-wa flex="~ gap2 center"
          :disabled="!canSave"
        >
          <span aria-hidden="true" i-ri:save-2-fill />
          {{ $t('action.save') }}
        </button>
      </div>
    </form>
  </section>
</template>
