import { createStreamingAPIClient } from "masto";

const subscribe = async (): Promise<void> => {
  using masto = createStreamingAPIClient({
    streamingApiUrl: "<STREAMING API URL>",
    accessToken: "<TOKEN>",
  });

  for await (const event of masto.hashtag.subscribe({ tag: "mastojs" })) {
    switch (event.event) {
      case "update": {
        console.log("new post", event.payload.content);
        break;
      }
      case "delete": {
        console.log("deleted post", event.payload);
        break;
      }
      default: {
        break;
      }
    }
  }
};

try {
  await subscribe();
} catch (error) {
  console.error(error);
}
