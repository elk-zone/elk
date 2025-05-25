import { MastoInvalidArgumentError } from "./masto-invalid-argument-error";

it("creates MastoInvalidArgumentError", () => {
  const error = new MastoInvalidArgumentError("message");
  expect(error.message).toEqual("message");
});
