import { breakpointsTailwind } from '@vueuse/core'

export const breakpoints = useBreakpoints(breakpointsTailwind)

export const isSmallScreen = breakpoints.smaller('sm')
export const isSmallOrMediumScreen = breakpoints.smaller('lg')
export const isMediumOrLargeScreen = breakpoints.between('sm', 'xl')
export const isExtraLargeScreen = breakpoints.greaterOrEqual('xl')
