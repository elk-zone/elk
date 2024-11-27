import { getEncoding } from "./get-encoding";

test.each([
  [{ "Content-Type": "application/json; charset=utf-8" }, "json"],
  [{ "content-type": "application/json; charset=utf-8" }, "json"],
  [{ "Content-Type": "application/json" }, "json"],
  [{ "Content-Type": "multipart/form-data" }, "multipart-form"],
  [{ "Content-Type": "text/html" }, undefined],
  [{}, undefined],
])("removes charset from content-type", (headers, expected) => {
  expect(getEncoding(new Headers(headers))).toBe(expected);
});
