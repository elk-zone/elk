import { mergeAbortSignals } from "./merge-abort-signals";

const getRandomInt = (): number => Math.floor(Math.random() * 10);

describe("mergeAbortSignals", () => {
  it("merges abort signal", () => {
    const a = new AbortController();
    const b = new AbortController();

    const merged = mergeAbortSignals([a.signal, b.signal]);
    const oneOfAB = [a, b][getRandomInt() % 2];
    oneOfAB.abort();

    expect(merged.aborted).toBe(true);
  });
});
