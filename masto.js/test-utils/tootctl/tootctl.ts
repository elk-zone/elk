export interface CreateAccountParams {
  readonly email: string;
  readonly confirmed: boolean;
}

export interface CreateAccountResult {
  password: string;
}

export interface Tootctl {
  accounts: {
    create: (
      username: string,
      params: CreateAccountParams,
    ) => Promise<CreateAccountResult>;
  };
  settings: {
    registrations: {
      open: () => Promise<void>;
    };
  };
}
