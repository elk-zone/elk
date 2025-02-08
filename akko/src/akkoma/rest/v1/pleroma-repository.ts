import {
  type FrontendConfiguration,
  type PleromaConfig,
} from "../../entities/v1/pleroma-config";

export interface CreateAdminConfigParams {
  configs: PleromaConfig["configs"];
}

export interface PleromaRepository {
  admin: {
    config: {
      /** Retrieves current pleroma configuration */
      fetch(): Promise<PleromaConfig>;
      /**
       * Update current pleroma configuration
       * (yeah the name is create but that's how things works what do you want)
       */
      create(params: CreateAdminConfigParams): Promise<PleromaConfig>;
    };
  };

  /** Fetch frontend configuration */
  frontendConfigurations: {
    fetch(): Promise<{ [x: string]: FrontendConfiguration }>;
  };
}
