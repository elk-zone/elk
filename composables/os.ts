export const useIsMac = () => computed(() =>
  useRequestHeaders(['user-agent'])['user-agent']?.includes('Macintosh')
    ?? navigator?.platform?.includes('Mac') ?? false)
