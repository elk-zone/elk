export type FrontendConfiguration =
  | { [x: string]: unknown }
  | unknown[]
  | { tuple: unknown[] }
  | string;

export interface PleromaConfig {
  /**
   * Instance needs to be rebooted
   */
  need_reboot: boolean;
  /**
   * Pleroma settings
   */
  configs: {
    group: string;
    key: string;
    value: FrontendConfiguration[];
  }[];
}
