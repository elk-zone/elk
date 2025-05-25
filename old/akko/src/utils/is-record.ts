export const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && x.constructor.name === "Object";
