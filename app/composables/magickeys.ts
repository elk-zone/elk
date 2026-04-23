import type { ComputedRef } from 'vue'

// TODO: consider to allow combinations similar to useMagicKeys using proxy?
//       e.g. `const magicSequence = useMagicSequence()`
//         `magicSequence['Shift+Ctrl+A']`
//         `const { Ctrl_A_B } = useMagicSequence()`

/**
 * source: inspired by https://github.com/vueuse/vueuse/issues/427#issuecomment-815619446
 * @param keys ordered list of keys making up the sequence
 */
export function useMagicSequence(keys: string[]): ComputedRef<boolean> {
  const magicKeys = useMagicKeys()

  const success = ref(false)
  const i = ref(0)
  let down = false

  watch(
    () => magicKeys.current,
    () => {
      if (magicKeys[keys[i.value]].value && !down) {
        down = true
        i.value += 1
      }
      else if (i.value > 0 && !magicKeys[keys[i.value - 1]].value && down) {
        down = false
      }
      else {
        i.value = 0
        down = false
        success.value = false
      }
      if (i.value >= keys.length && !down) {
        i.value = 0
        down = false
        success.value = true
      }
    },
    {
      deep: true,
    },
  )

  return computed(() => success.value)
}
