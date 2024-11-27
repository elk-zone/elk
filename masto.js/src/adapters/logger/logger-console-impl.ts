/* eslint-disable no-console */
import { type Logger, type LogType } from "../../interfaces";
import { type LogLevel } from "./log-level";

export class LoggerConsoleImpl implements Logger {
  constructor(private readonly level: LogLevel) {}

  log(type: LogType, message: string, meta: unknown): void {
    if (!this.level.satisfies(type)) {
      return;
    }

    const args = meta == undefined ? [message] : [message, meta];
    switch (type) {
      case "debug": {
        console.debug(...args);
        return;
      }
      case "info": {
        console.info(...args);
        return;
      }
      case "warn": {
        console.warn(...args);
        return;
      }
      case "error": {
        console.error(...args);
        return;
      }
    }
  }
}
