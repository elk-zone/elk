export type Encoding = "none" | "json" | "multipart-form" | "querystring";

export interface Serializer {
  serialize(type: "json" | "querystring", data: unknown): string;
  serialize(type: Encoding, data: unknown): BodyInit;
  deserialize<T = Record<string, unknown>>(type: Encoding, data: unknown): T;
}
