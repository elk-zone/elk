import fs from "node:fs/promises";

import { createRestAPIClient } from "../src";

const masto = createRestAPIClient({
  url: "https://example.com",
  accessToken: "YOUR TOKEN",
});

const newProfile = await masto.v1.accounts.updateCredentials({
  displayName: "Fluffy elephant friend",
  note: "Hi fediverse!",
  avatar: new Blob([await fs.readFile("../some_image.png")]),
});

console.log(newProfile);
