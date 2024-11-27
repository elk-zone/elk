import childProcess from "node:child_process";
import { promisify } from "node:util";

import {
  type CreateAccountParams,
  type CreateAccountResult,
  type Tootctl,
} from "./tootctl";

const exec = promisify(childProcess.exec);

const extractPassword = (stdout: string) => {
  return stdout.match(/New password:\s(.+?)$/)?.[1];
};

const stringifyArguments = (
  args: Record<string, string | number | boolean>,
): string => {
  return Object.entries(args)
    .map(([key, value]) => (value === true ? `--${key}` : `--${key}=${value}`))
    .join(" ");
};

export interface CreateTootctlParams {
  readonly container: string;
  readonly compose: boolean;
}

export const createTootctl = (params: CreateTootctlParams): Tootctl => {
  const { container, compose } = params;

  const command = compose
    ? `docker compose exec ${container}`
    : `docker exec ${container}`;

  return {
    accounts: {
      create: async (
        username: string,
        params: CreateAccountParams,
      ): Promise<CreateAccountResult> => {
        const args = stringifyArguments({ ...params });

        const { stdout } = await exec(
          [
            command,
            `bash -c "RAILS_ENV=development bin/tootctl accounts create ${username} ${args}"`,
          ].join(" "),
        );

        const password = extractPassword(stdout.trim());
        if (password == undefined) {
          throw new Error("Couldn't extract password from stdout");
        }

        return { password };
      },
    },
    settings: {
      registrations: {
        open: async (): Promise<void> => {
          await exec(
            [
              command,
              "bash -c 'RAILS_ENV=development bin/tootctl settings registrations open'",
            ].join(" "),
          );
        },
      },
    },
  };
};
