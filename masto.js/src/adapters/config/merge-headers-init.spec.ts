import { mergeHeadersInit } from "./merge-headers-init";

describe("mergeHeadersInit", () => {
  it("merges headers init", () => {
    const merged = new Headers(
      mergeHeadersInit([
        new Headers([["Authorization", "Bearer TOKEN"]]),
        new Headers([["Content-Type", "application/json"]]),
      ]),
    );

    expect(merged.get("Authorization")).toBe("Bearer TOKEN");
    expect(merged.get("Content-Type")).toBe("application/json");
  });

  it("respects the order", () => {
    const merged = new Headers(
      mergeHeadersInit([
        new Headers([["Content-Type", "text/html"]]),
        new Headers([["Content-Type", "application/json"]]),
        new Headers([["Content-Type", "multipart/form-data"]]),
      ]),
    );

    expect(merged.get("Content-Type")).toBe("multipart/form-data");
  });
});
