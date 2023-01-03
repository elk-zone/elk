import { breakpointsTailwind } from '@vueuse/core'

export const breakpoints = useBreakpoints(breakpointsTailwind)

export const isMobileScreen = breakpoints.smallerOrEqual('sm')
export const isSmallScreen = breakpoints.smallerOrEqual('md')
export const isMediumScreen = breakpoints.smallerOrEqual('lg')
