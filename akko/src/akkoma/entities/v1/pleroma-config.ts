export type FrontendConfiguration = { [x: string]: { [x: string]: unknown } };

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
    db: string[];
    value: FrontendConfiguration[];
  }[];
}
