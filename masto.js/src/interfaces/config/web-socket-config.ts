export interface WebSocketConfig {
  getMaxAttempts(): number;
  getProtocols(protocols?: readonly string[]): string[];
  resolvePath(path: string, params?: Record<string, unknown>): URL;
}
