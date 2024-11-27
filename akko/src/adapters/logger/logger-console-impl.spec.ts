import { LogLevel } from "./log-level";
import { LoggerConsoleImpl } from "./logger-console-impl";

describe("LoggerConsoleImpl", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("logs debug", () => {
    const consoleDebug = jest.spyOn(console, "debug").mockImplementation();
    const logger = new LoggerConsoleImpl(LogLevel.from("debug"));
    logger.log("debug", "message", { meta: "meta" });
    expect(consoleDebug).toHaveBeenCalledWith("message", { meta: "meta" });
  });

  it("logs info", () => {
    const consoleInfo = jest.spyOn(console, "info").mockImplementation();
    const logger = new LoggerConsoleImpl(LogLevel.from("info"));
    logger.log("info", "message", { meta: "meta" });
    expect(consoleInfo).toHaveBeenCalledWith("message", { meta: "meta" });
  });

  it("logs warn", () => {
    const consoleWarn = jest.spyOn(console, "warn").mockImplementation();
    const logger = new LoggerConsoleImpl(LogLevel.from("warn"));
    logger.log("warn", "message", { meta: "meta" });
    expect(consoleWarn).toHaveBeenCalledWith("message", { meta: "meta" });
  });

  it("logs error", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    const logger = new LoggerConsoleImpl(LogLevel.from("error"));
    logger.log("error", "message", { meta: "meta" });
    expect(consoleError).toHaveBeenCalledWith("message", { meta: "meta" });
  });
});
