import { Logger } from "../interfaces";

export const log = jest.fn();

export class LoggerMockImpl implements Logger {
  log = log;
}
