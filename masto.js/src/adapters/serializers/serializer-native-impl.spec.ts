import assert from "node:assert";

import { type Serializer } from "../../interfaces";
import { MastoDeserializeError, MastoUnexpectedError } from "../errors";
import { SerializerNativeImpl } from "./serializer-native-impl";

describe("SerializerNativeImpl", () => {
  const serializer: Serializer = new SerializerNativeImpl();

  it("encodes an object to JSON", () => {
    const data = serializer.serialize("json", {
      keyName: "value",
      anotherKeyName: ["value1", "value2"],
    });

    expect(data).toBe(
      '{"key_name":"value","another_key_name":["value1","value2"]}',
    );
  });

  it("encodes an object to form-data", () => {
    const data = serializer.serialize("multipart-form", {
      keyName: "value",
      anotherKeyName: ["value1", "value2"],
    });
    assert(data instanceof FormData);
    expect(data.get("key_name")).toBe("value");
    expect(data.get("another_key_name[0]")).toEqual("value1");
    expect(data.get("another_key_name[1]")).toEqual("value2");
  });

  it("throws when unknown type passed", () => {
    expect(() => {
      serializer.serialize("none", "<html><body>test</body></html>");
    }).toThrowError(MastoUnexpectedError);
  });

  it("encodes an object to a querystring", () => {
    const data = serializer.serialize("querystring", {
      keyName: "value",
      anotherKeyName: ["value1", "value2"],
    });

    expect(data).toBe(
      "key_name=value&another_key_name[]=value1&another_key_name[]=value2",
    );
  });

  it("parses JSON string to an Object", () => {
    const data = serializer.deserialize("json", '{ "key_name": "value" }');
    expect(data).toEqual({ keyName: "value" });
  });

  it("throws an error for unparsable JSON", () => {
    expect(() => {
      serializer.deserialize("json", "");
    }).toThrowError(MastoDeserializeError);
  });

  it("throws deserialize error for unknown types", () => {
    expect(() => {
      serializer.deserialize("none", "<html><body>test</body></html>");
    }).toThrowError(MastoDeserializeError);
  });
});
