import { isRecord } from "../../utils";

const _transformKeys = <T>(
  data: unknown,
  transform: (key: string) => string,
): T => {
  if (Array.isArray(data)) {
    return data.map((value) =>
      _transformKeys(value, transform),
    ) as unknown as T;
  }

  if (isRecord(data)) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        transform(key),
        _transformKeys(value, transform),
      ]),
    ) as T;
  }

  return data as T;
};

export const transformKeys = <T>(
  data: unknown,
  transform: (key: string) => string,
): T => {
  const f = (key: string) => {
    // `PATCH /v1/preferences` uses `:` as a delimiter
    if (key.includes(":")) return key;

    // `PATCH /v2/filters` uses _destroy as a special key
    if (key.startsWith("_")) return key;

    return transform(key);
  };

  return _transformKeys(data, f);
};
