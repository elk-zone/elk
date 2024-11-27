import { camelCase, snakeCase } from "change-case";

import { type Encoding, type Serializer } from "../../interfaces";
import { MastoDeserializeError, MastoUnexpectedError } from "../errors";
import { flattenForFormData, flattenForRailsQueryString } from "./flatten";
import { transformKeys } from "./transform-keys";

export class SerializerNativeImpl implements Serializer {
  serialize(type: "json" | "querystring", rawData: unknown): string;
  serialize(type: Encoding, rawData: unknown): BodyInit {
    const data = transformKeys(rawData, snakeCase);

    switch (type) {
      case "json": {
        return JSON.stringify(data);
      }
      case "multipart-form": {
        const formData = new FormData();
        for (const [key, value] of Object.entries(flattenForFormData(data))) {
          formData.append(key, value);
        }
        return formData;
      }
      case "querystring": {
        return flattenForRailsQueryString(data);
      }
      default: {
        throw new MastoUnexpectedError(
          `Unknown content type ${type} to serialize.`,
        );
      }
    }
  }

  deserialize<T = Record<string, unknown>>(type: Encoding, data: string): T {
    switch (type) {
      case "json": {
        try {
          return transformKeys(JSON.parse(data), camelCase);
        } catch {
          throw new MastoDeserializeError(
            `Malformed JSON ${data} returned from the server.`,
            type,
            data,
          );
        }
      }
      default: {
        throw new MastoDeserializeError(
          `Unknown content type ${type} returned from the server.`,
          type,
          data,
        );
      }
    }
  }
}
