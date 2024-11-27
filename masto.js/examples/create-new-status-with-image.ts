import fs from "node:fs";

import { createRestAPIClient } from "masto";

const masto = createRestAPIClient({
  url: "https://example.com",
  accessToken: "YOUR TOKEN",
});

// Create media from a local file
const attachment1 = await masto.v2.media.create({
  file: new Blob([fs.readFileSync("../some_image.png")]),
  description: "Some image",
});

// Create media from an URL
const remoteFile = await fetch("https://example.com/some_image.png");
const attachment2 = await masto.v2.media.create({
  file: await remoteFile.blob(),
  description: "Some image",
});

// Publish!
const status = await masto.v1.statuses.create({
  status: "Hello from #mastojs!",
  visibility: "public",
  mediaIds: [attachment1.id, attachment2.id],
});

console.log(status);
