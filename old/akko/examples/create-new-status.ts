import { createRestAPIClient, type mastodon } from "masto";

const masto = createRestAPIClient({
  url: "https://example.com",
  accessToken: "YOUR TOKEN",
});

const s: mastodon.v1.Status = await masto.v1.statuses.create({
  status: "Hello from #mastojs!",
  visibility: "public",
});

console.log(s);
