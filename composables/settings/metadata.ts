import type { Node } from 'ultrahtml'
import { decode } from 'tiny-decode'
import { parse, TEXT_NODE } from 'ultrahtml'

export const maxAccountFieldCount = computed(() => currentInstance.value?.pleroma?.metadata?.fieldsLimits?.maxFields || (isGlitchEdition.value ? 16 : 4))

export const maxAccountFieldNameLength = computed(() => currentInstance.value?.pleroma?.metadata?.fieldsLimits?.nameLength || 50)

export const maxAccountFieldValueLength = computed(() => currentInstance.value?.pleroma?.metadata?.fieldsLimits?.valueLength || 200)

export function convertMetadata(metadata: string) {
  try {
    const tree = parse(metadata)
    return (tree.children as Node[]).map(n => convertToText(n)).join('').trim()
  }
  catch (err) {
    console.error(err)
    return ''
  }
}

function convertToText(input: Node): string {
  let text = ''

  if (input.type === TEXT_NODE)
    return decode(input.value)

  if ('children' in input)
    text = (input.children as Node[]).map(n => convertToText(n)).join('')

  return text
}
