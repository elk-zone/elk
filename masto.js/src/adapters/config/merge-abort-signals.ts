export const mergeAbortSignals = (
  signals: readonly AbortSignal[],
): AbortSignal => {
  const abortController = new AbortController();

  for (const signal of signals) {
    signal.addEventListener("abort", () => abortController.abort(), {
      once: true,
    });
  }

  return abortController.signal;
};
