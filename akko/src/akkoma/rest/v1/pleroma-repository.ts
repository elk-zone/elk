import {
  type FrontendConfiguration,
  type PleromaConfig,
} from "../../entities/v1/pleroma-config";

export interface PleromaRepository {
  admin: {
    config: {
      /** Retrieves current pleroma configuration */
      fetch(): Promise<PleromaConfig>;
    };
  };

  frontendConfigurations: {
    fetch(): Promise<FrontendConfiguration>;
  };
}
