declare module 'page-lifecycle/dist/lifecycle.mjs' {
    type PageLifecycleState = 'pageshow' | 'resume' | 'focus' | 'blur' | 'pagehide' | 'unload' | 'visibilitychange' | 'freeze'

    interface PageLifecycleEvent extends Event {
        newState: PageLifecycleState
        oldState: PageLifecycleState
    }
    interface PageLifecycle extends EventTarget {
        get state(): PageLifecycleState
        get pageWasDiscarded(): boolean
        addUnsavedChanges: (id: Symbol | any) => void
        removeUnsavedChanges: (id: Symbol | any) => void
        addEventListener: (type: string, listener: (evt: PageLifecycleEvent) => void) => void
    }
    const lifecycle: PageLifecycle
    export default lifecycle
}
