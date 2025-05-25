// We have TypeError: AbortSignal.timeout is not a function when running tests against masto.js v6
if (!AbortSignal.timeout) {
  AbortSignal.timeout = (ms) => {
    const controller = new AbortController()
    setTimeout(() => controller.abort(new DOMException('TimeoutError')), ms)
    return controller.signal
  }
}
