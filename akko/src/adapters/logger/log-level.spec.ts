import { LogLevel } from "./log-level";

describe("LogLevel", () => {
  const debug = LogLevel.from("debug");
  const info = LogLevel.from("info");
  const warn = LogLevel.from("warn");
  const error = LogLevel.from("error");

  test.each([
    [debug, "debug", true],
    [debug, "info", true],
    [debug, "warn", true],
    [debug, "error", true],
    [info, "debug", false],
    [info, "info", true],
    [info, "warn", true],
    [info, "error", true],
    [warn, "debug", false],
    [warn, "info", false],
    [warn, "warn", true],
    [warn, "error", true],
    [error, "debug", false],
    [error, "info", false],
    [error, "warn", false],
    [error, "error", true],
  ] as const)("%o vs %s = %p", (level, type, expected) => {
    expect(level.satisfies(type)).toBe(expected);
  });
});
