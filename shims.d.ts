declare global {
  namespace NodeJS {
    interface Process {
      test?: boolean
    }
  }

  interface Document { startViewTransition: Function | undefined }
}

export {}