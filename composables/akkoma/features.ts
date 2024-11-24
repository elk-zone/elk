import { AkkomaFeatures, type AkkomaInstance } from './akkoma'

export async function useFeatures() {
  if (!currentUser.value)
    return {}
  const instance = instanceStorage.value[currentUser.value.server]
  if (!(instance as AkkomaInstance).pleroma)
    return {}
  const akkomaInstance = instance as AkkomaInstance
  return {
    [AkkomaFeatures.BUBBLE_TIMELINE]: akkomaInstance.pleroma.metadata.features.includes(AkkomaFeatures.BUBBLE_TIMELINE),
  }
}
