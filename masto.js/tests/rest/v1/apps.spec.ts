describe("apps", () => {
  it("creates an app", async () => {
    await using client = await sessions.acquire();
    const app = await client.rest.v1.apps.create({
      clientName: "My App",
      redirectUris: "https://example.com/oauth/callback",
      scopes: "read write",
    });

    expect(app.name).toBe("My App");
  });

  it("verifies an app", async () => {
    await using client = await sessions.acquire();
    const app = await client.rest.v1.apps.verifyCredentials();
    expect(app.name).toEqual(expect.any(String));
  });
});
