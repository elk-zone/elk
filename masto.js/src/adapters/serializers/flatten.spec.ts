/* eslint-disable unicorn/no-null */
import { flattenForFormData, flattenForRailsQueryString } from "./flatten";

describe("form data", () => {
  test("flat value", () => {
    const result = flattenForFormData({
      apple: "red",
      mandarin: "orange",
      grapes: "purple",
    });

    expect(result).toStrictEqual({
      apple: "red",
      mandarin: "orange",
      grapes: "purple",
    });
  });

  test("array", () => {
    const result = flattenForFormData({
      animals: ["lion", "giraffe", "elephant"],
    });

    expect(result).toStrictEqual({
      "animals[0]": "lion",
      "animals[1]": "giraffe",
      "animals[2]": "elephant",
    });
  });

  test("nested object", () => {
    const result = flattenForFormData({
      a: "string",
      b: 123,
      c: [1, 2, 3],
      e: {
        e1: "string",
        e2: {
          e21: {
            e211: "string",
          },
          e22: [{ value: 1 }, { value: 2 }, { value: 3 }],
        },
      },
    });

    expect(result).toStrictEqual({
      a: "string",
      b: 123,
      "c[0]": 1,
      "c[1]": 2,
      "c[2]": 3,
      "e[e1]": "string",
      "e[e2][e21][e211]": "string",
      "e[e2][e22][0][value]": 1,
      "e[e2][e22][1][value]": 2,
      "e[e2][e22][2][value]": 3,
    });
  });
});

describe("flattenForRailsQueryString", () => {
  it("encodes null", () => {
    const result = flattenForRailsQueryString(null);
    expect(result).toBe("");
  });

  it("encodes an empty object", () => {
    const result = flattenForRailsQueryString({});
    expect(result).toBe("");
  });

  it("encodes a basic record", () => {
    const result = flattenForRailsQueryString({ key: "value" });
    expect(result).toBe("key=value");
  });

  it("encodes a record with multiple values", () => {
    const result = flattenForRailsQueryString({
      key1: "value1",
      key2: "value2",
    });
    expect(result).toBe("key1=value1&key2=value2");
  });

  it("encodes string safely", () => {
    const result = flattenForRailsQueryString({
      q: "https://neet.love",
    });
    // cspell:disable-next-line
    expect(result).toBe("q=https%3A%2F%2Fneet.love");
  });

  it("encodes an array inside a record", () => {
    const result = flattenForRailsQueryString({
      key1: "value1",
      key2: "value2",
      key3: ["apple", "facebook", "microsoft"],
    });
    expect(result).toBe(
      "key1=value1&key2=value2&key3[]=apple&key3[]=facebook&key3[]=microsoft",
    );
  });

  it("encodes null", () => {
    const result = flattenForRailsQueryString({
      foo: null,
      bar: "baz",
    });

    expect(result).toBe("bar=baz");
  });

  it("encodes undefined", () => {
    const result = flattenForRailsQueryString({
      foo: undefined,
      bar: "baz",
    });

    expect(result).toBe("bar=baz");
  });

  it("encodes tested object", () => {
    expect(
      flattenForRailsQueryString({
        title: "some group",
        context: ["notifications"],
        keywordsAttributes: [
          {
            keyword: "my keyword",
          },
        ],
      }),
    ).toMatchInlineSnapshot(
      `"title=some%20group&context[]=notifications&keywordsAttributes[][keyword]=my%20keyword"`,
    );
  });
});
