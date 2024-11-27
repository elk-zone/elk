/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  projects: [
    {
      displayName: "unit",
      testEnvironment: "node",
      testMatch: ["<rootDir>/src/**/*.spec.ts"],
      transform: { "^.+\\.tsx?$": "ts-jest" },
      setupFilesAfterEnv: ["<rootDir>/test-utils/jest-setup-after-env-unit.ts"],
    },
    {
      displayName: "e2e",
      testEnvironment: "./test-utils/jest-environment.ts",
      testMatch: ["<rootDir>/tests/**/*.spec.ts"],
      transform: {
        "^.+\\.tsx?$": [
          "ts-jest",
          {
            tsconfig: {
              target: "ES2022",
              module: "ES2022",
            },
          },
        ],
      },
      globalSetup: "<rootDir>/test-utils/jest-global-setup.ts",
      setupFilesAfterEnv: ["<rootDir>/test-utils/jest-setup-after-env.ts"],
    },
  ],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/index.ts",
    "!src/**/*.spec.ts",
    "!**/__mocks__/**",
  ],
};
