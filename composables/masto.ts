import type { Ref } from 'vue'
import type { Account, MastoClient, Relationship } from 'masto'

export function getDisplayName(account: Account) {
  return account.displayName || account.username
}

// Batch requests for relationships when used in the UI
// We don't want to hold to old values, so every time a Relationship is needed it
// is requested again from the server to show the latest state

const requestedRelationships = new Map<string, Ref<Relationship | undefined> >()
let timeoutHandle: NodeJS.Timeout | undefined

export function useRelationship(account: Account): Ref<Relationship | undefined> {
  let relationship = requestedRelationships.get(account.id)
  if (relationship)
    return relationship
  relationship = ref<Relationship | undefined>()
  requestedRelationships.set(account.id, relationship)
  if (timeoutHandle)
    clearTimeout(timeoutHandle)
  timeoutHandle = setTimeout(() => {
    timeoutHandle = undefined
    fetchRelationships()
  }, 100)
  return relationship
}

async function fetchRelationships() {
  const masto = await useMasto()

  const requested = Array.from(requestedRelationships.entries())
  requestedRelationships.clear()

  const relationships = await masto.accounts.fetchRelationships(requested.map(([id]) => id))
  for (let i = 0; i < requested.length; i++)
    requested[i][1].value = relationships[i]
}
