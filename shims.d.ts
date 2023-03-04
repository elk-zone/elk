declare global {
  namespace NodeJS {
    interface Process {
      test?: boolean
    }
  }
}

export {}
