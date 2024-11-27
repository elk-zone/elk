import { camelCase } from "change-case";

import { transformKeys } from "./transform-keys";

describe("transformKeys", () => {
  it("transforms a flat object", () => {
    expect(
      transformKeys(
        {
          key: "value",
          key_key: ["value", "value"],
          key_key_key: 3,
        },
        camelCase,
      ),
    ).toEqual({
      key: "value",
      keyKey: ["value", "value"],
      keyKeyKey: 3,
    });
  });

  it("transforms a deep object", () => {
    expect(
      transformKeys(
        {
          key: {
            key_key: {
              key_key_key: "value",
            },
          },
        },
        camelCase,
      ),
    ).toEqual({
      key: { keyKey: { keyKeyKey: "value" } },
    });
  });

  it("transforms a deep object inside an array", () => {
    expect(transformKeys([{ key_one: "value" }], camelCase)).toEqual([
      {
        keyOne: "value",
      },
    ]);
  });

  it("transforms a array inside an object", () => {
    expect(
      transformKeys(
        {
          key_one: [
            {
              value_one: "value",
            },
          ],
        },
        camelCase,
      ),
    ).toEqual({
      keyOne: [{ valueOne: "value" }],
    });
  });

  it("does not transform special characters", () => {
    expect(
      transformKeys(
        {
          key: "value",
          "key:key": "value",
          _key: 3,
        },
        camelCase,
      ),
    ).toEqual({
      key: "value",
      "key:key": "value",
      _key: 3,
    });
  });
});
