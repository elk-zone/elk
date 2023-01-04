// Thanks rollup!

const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$'
const base = 64

export function toBase64(value: number): string {
  let outString = ''
  do {
    const currentDigit = value % base
    value = (value / base) | 0
    outString = chars[currentDigit] + outString
  } while (value !== 0)
  return outString
}

export const reserved_names: ReadonlySet<string> = new Set([
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'eval',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'NaN',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'undefined',
  'var',
  'void',
  'while',
  'with',
  'yield',
])

export function getSafeName(
  baseName: string,
  usedNames: Set<string>,
  forbiddenNames: Set<string> | null,
): string {
  let safeName = baseName
  let count = 1
  while (usedNames.has(safeName) || reserved_names.has(safeName) || forbiddenNames?.has(safeName))
    safeName = `${baseName}$${toBase64(count++)}`

  usedNames.add(safeName)
  return safeName
}

export function parseQuery(id: string) {
  const [path, query] = id.split('?')
  const params = new URLSearchParams(query)
  return { path, query, params }
}
