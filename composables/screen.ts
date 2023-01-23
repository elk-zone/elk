import { breakpointsTailwind } from '@vueuse/core'

export const breakpoints = useBreakpoints(breakpointsTailwind)

export const isSmallScreen = breakpoints.smallerOrEqual('md')
export const isMediumScreen = breakpoints.smallerOrEqual('lg')
export const isMediumOrLargeScreen = breakpoints.between('sm', 'xl')
