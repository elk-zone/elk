export type LogType = "debug" | "info" | "warn" | "error";

export interface Logger {
  log(type: LogType, message: string, meta?: unknown): void;
}
