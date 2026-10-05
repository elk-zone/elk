import type { mastodon } from 'masto'

const _filters = ref<mastodon.v2.Filter[]>([])
const REGEX_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g

export function useFilters() {
  return _filters
}

export async function refreshFilters(): Promise<void> {
  if (!currentUser.value)
    return

  try {
    const client = useMastoClient()
    const paginator = client.v2.filters.list()
    const result = await paginator.values().next()
    _filters.value = result.done ? [] : result.value
  }
  catch {
    // Keep existing filters on error
  }
}

/**
 * Build a regex for a filter keyword following Mastodon's implementation guidelines.
 * @see https://docs.joinmastodon.org/api/guidelines/#filters
 */
function buildKeywordRegex(keyword: string, wholeWord: boolean): RegExp {
  const escaped = keyword.replace(REGEX_SPECIAL_CHARS, '\\$&')
  const pattern = wholeWord ? `\\b${escaped}\\b` : escaped
  return new RegExp(pattern, 'i')
}

function getStatusText(status: mastodon.v1.Status): string {
  const parts: string[] = []
  if (status.content)
    parts.push(removeHTMLTags(status.content))
  if (status.spoilerText)
    parts.push(status.spoilerText)
  return parts.join(' ')
}

/**
 * Apply client-side filters to a single status that doesn't already have
 * server-populated filter results (e.g., statuses from streaming).
 */
export function applyClientFiltersToStatus(
  status: mastodon.v1.Status,
  context: mastodon.v2.FilterContext,
): mastodon.v1.Status {
  return applyClientFilters([status], context)[0]
}

/**
 * Apply client-side filters to statuses that don't already have
 * server-populated filter results (e.g., statuses from streaming).
 */
export function applyClientFilters(
  items: mastodon.v1.Status[],
  context: mastodon.v2.FilterContext,
): mastodon.v1.Status[] {
  const filters = _filters.value
  if (!filters.length)
    return items

  // Pre-filter to only active filters for this context
  const activeFilters = filters.filter((f) => {
    if (!f.context.includes(context))
      return false
    if (f.expiresAt && new Date(f.expiresAt) < new Date())
      return false
    return true
  })

  if (!activeFilters.length)
    return items

  // Build regex patterns for each filter
  const filterPatterns = activeFilters.map(filter => ({
    filter,
    patterns: filter.keywords.map(kw => ({
      keyword: kw,
      regex: buildKeywordRegex(kw.keyword, kw.wholeWord),
    })),
  }))

  return items.map((item) => {
    // Skip if server already provided filter results
    if (item.filtered && item.filtered.length > 0)
      return item

    const statusToCheck = item.reblog ?? item
    const text = getStatusText(statusToCheck)
    if (!text)
      return item

    const matchedResults: mastodon.v1.FilterResult[] = []

    for (const { filter, patterns } of filterPatterns) {
      const keywordMatches: string[] = []
      for (const { keyword, regex } of patterns) {
        if (regex.test(text))
          keywordMatches.push(keyword.keyword)
      }
      if (keywordMatches.length > 0) {
        matchedResults.push({
          filter,
          keywordMatches,
          statusMatches: null,
        })
      }
    }

    if (matchedResults.length > 0) {
      const updatedStatus = { ...item }
      if (item.reblog) {
        updatedStatus.reblog = { ...item.reblog, filtered: matchedResults }
      }
      else {
        updatedStatus.filtered = matchedResults
      }
      return updatedStatus
    }

    return item
  })
}
