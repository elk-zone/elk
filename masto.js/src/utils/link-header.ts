export const parseLinkHeader = (linkHeader: string): Map<string, string> => {
  const links = new Map<string, string>();
  for (const link of linkHeader.split(",")) {
    const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      links.set(match[2], match[1]);
    }
  }
  return links;
};
