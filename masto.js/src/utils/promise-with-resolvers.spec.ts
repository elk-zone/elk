import { createPromiseWithResolvers } from "./promise-with-resolvers";

describe("createPromiseWithResolvers", () => {
  it("resolves promise with resolver", async () => {
    const { promise, resolve } = createPromiseWithResolvers<string>();

    expect(promise).toBeInstanceOf(Promise);
    resolve("foo");
    await expect(promise).resolves.toBe("foo");
  });

  it("rejects promise with resolver", async () => {
    const { promise, reject } = createPromiseWithResolvers<string>();

    expect(promise).toBeInstanceOf(Promise);
    reject("foo");
    await expect(promise).rejects.toBe("foo");
  });
});
