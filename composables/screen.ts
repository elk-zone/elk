import { breakpointsTailwind } from '@vueuse/core'

export const breakpoints = useBreakpoints(breakpointsTailwind)

export const isSmallScreen = breakpoints.smallerOrEqual('md')
