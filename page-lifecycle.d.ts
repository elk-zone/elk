declare module 'page-lifecycle/dist/lifecycle.mjs' {
     type PageLifecycleState = 'active' | 'passive' | 'hidden' | 'frozen' | 'terminated'

     interface PageLifecycleEvent extends Event {
       newState: PageLifecycleState
       oldState: PageLifecycleState
     }
     interface PageLifecycle extends EventTarget {
       get state(): PageLifecycleState
       get pageWasDiscarded(): boolean
       addUnsavedChanges: (id: symbol | any) => void
       removeUnsavedChanges: (id: symbol | any) => void
       addEventListener: (type: string, listener: (evt: PageLifecycleEvent) => void) => void
     }
     const lifecycle: PageLifecycle
     export default lifecycle
}
