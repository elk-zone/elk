export const mergeHeadersInit = ([
  head,
  ...tail
]: readonly HeadersInit[]): HeadersInit => {
  const headers = new Headers(head);

  for (const entry of tail) {
    for (const [key, value] of new Headers(entry).entries()) {
      headers.set(key, value);
    }
  }

  return headers;
};
