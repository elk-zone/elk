import crypto from "node:crypto";

describe("subscription", () => {
  it("can subscribe", async () => {
    await using client = await sessions.acquire();
    const ecdh = crypto.createECDH("prime256v1");
    const auth = crypto.randomBytes(16).toString("base64");
    const p256dh = ecdh.generateKeys().toString("base64");

    const { id } = await client.rest.v1.push.subscription.create({
      subscription: {
        endpoint: "https://example.com",
        keys: {
          p256dh,
          auth,
        },
      },
      policy: "all",
      data: {
        alerts: {
          follow: true,
        },
      },
    });

    let subscription = await client.rest.v1.push.subscription.fetch();

    expect(subscription.id).toBe(id);
    expect(subscription.endpoint).toBe("https://example.com");
    expect(subscription.policy).toBe("all");
    expect(subscription.alerts.follow).toBe(true);

    subscription = await client.rest.v1.push.subscription.update({
      data: {
        alerts: {
          follow: false,
        },
      },
    });

    expect(subscription.alerts.follow).toBe(false);

    await client.rest.v1.push.subscription.remove();
  });
});
