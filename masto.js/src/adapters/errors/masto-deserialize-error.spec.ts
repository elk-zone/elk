import { MastoDeserializeError } from "./masto-deserialize-error";

it("creates MastoDeserializeError", () => {
  const error = new MastoDeserializeError("message", "application/json", {});
  expect(error.message).toEqual("message");
});
