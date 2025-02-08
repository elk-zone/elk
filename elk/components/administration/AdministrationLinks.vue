<script lang="ts" setup>
const { config, update } = useFrontendConfig()
const links = ref(config.value?.links || [])
const isLoading = ref(false)

watch(config, () => {
  if (config.value)
    links.value = config.value?.links
})

function add() {
  links.value = [...links.value, { icon: '🔗', text: '', url: '' }]
}

function save() {
  const ls = links.value.filter(l => l.url && l.text)
  update({ links: ls }, isLoading)
  links.value = ls
}

function insertEmoji(url: string, emoji: string) {
  const ls = [...links.value]
  const index = ls.findIndex(l => l.url === url)
  ls.splice(index, 1, { ...ls[index], icon: emoji })
  links.value = ls
}

function onChange(e: Event, link: FrontendConfiguration['links'][number]) {
  const ls = [...links.value]
  const index = ls.findIndex(l => l.url === link.url)
  const data = new FormData((e.currentTarget as HTMLFieldSetElement).form!)
  ls.splice(index, 1, { ...ls[index], text: data.get(`${link.url}-text`) as string, url: data.get(`${link.url}-url`) as string })
  links.value = ls
}
</script>

<template>
  <form @submit.prevent="save">
    <h2 font-medium>
      {{ $t('admin.links.title') }}
    </h2>
    <p my-2>
      {{ $t('admin.links.description') }}
    </p>
    <div flex flex-col gap-3>
      <template v-for="link in links" :key="link.url">
        <div flex items-center gap-3>
          <EmojiPicker :hide-custom-emojis="true" @select="(emoji) => insertEmoji(link.url, emoji)">
            <button grayscale input-base w-auto h-full type="button">
              {{ link.icon }}
            </button>
          </EmojiPicker>
          <fieldset grow flex items-center gap-3 @change="(e) => onChange(e, link)">
            <input
              :value="link.text"
              :name="`${link.url}-text`"
              shrink-1
              type="text" placeholder-text-secondary
              :placeholder="$t('admin.links.label')"
              input-base
              w-auto
            >
            <input
              :value="link.url"
              :name="`${link.url}-url`"
              grow
              type="text" placeholder-text-secondary
              :placeholder="$t('admin.links.url')"
              w-auto
              input-base
              pattern="https?://.*"
            >
          </fieldset>
        </div>
      </template>
      <button
        btn-outline font-bold py2 full-w sm-wa flex="~ gap2 center"
        type="button"
        @click="add"
      >
        <span aria-hidden="true" class="block i-ri:add-line" />
        {{ $t('admin.links.add') }}
      </button>
    </div>
    <button
      btn-outline font-bold py2 full-w sm-wa flex="~ gap2 center" ml-auto mt-3
      type="submit"
      :disabled="isLoading"
      :class="isLoading ? 'border-none' : undefined"
    >
      <span v-if="!isLoading" aria-hidden="true" class="block i-ri:save-2-line" />
      <span v-else i-ri:loader-4-line animate-spin />
      {{ $t('action.save') }}
    </button>
  </form>
</template>
