import { isRecord } from "../../utils";

interface KeyMapper {
  readonly onArray: (parent: unknown, index: number) => string;
  readonly onObject: (parent: string, key: string) => string;
}

const ObjectFlattener = (keyMapper: KeyMapper) => {
  const flatten = (object: unknown, parent = ""): [string, unknown][] => {
    if (Array.isArray(object)) {
      return object.flatMap((value, i) =>
        flatten(
          value,
          parent == "" ? i.toString() : keyMapper.onArray(parent, i),
        ),
      );
    }

    if (isRecord(object)) {
      return Object.entries(object).flatMap(([key, value]) =>
        flatten(value, parent === "" ? key : keyMapper.onObject(parent, key)),
      );
    }

    return [[parent, object]];
  };

  return flatten;
};

export const flattenForFormData = (
  object: unknown,
): Record<string, unknown> => {
  const flatten = ObjectFlattener({
    onArray: (parent, index) => `${parent}[${index}]`,
    onObject: (parent, key) => `${parent}[${key}]`,
  });

  return Object.fromEntries(flatten(object));
};

export const flattenForRailsQueryString = (object: unknown): string => {
  const flatten = ObjectFlattener({
    onArray: (parent) => `${parent}[]`,
    onObject: (parent, key) => `${parent}[${key}]`,
  });

  return flatten(object)
    .filter(([, v]) => !!v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");
};
