describe("account", () => {
  it("fetches an account", async () => {
    await using session = await sessions.acquire();
    const account = await admin.v1.admin.accounts.$select(session.id).fetch();
    expect(account.id).toBe(session.id);
  });

  it("lists accounts", async () => {
    const accounts = await admin.v1.admin.accounts.list();
    expect(accounts.length).toBeGreaterThan(0);
  });

  test.todo("approves an account");

  test.todo("rejects an account");

  it("disables an account", async () => {
    await using client = await sessions.acquire();
    await admin.v1.admin.accounts.$select(client.id).action.create({
      type: "disable",
    });
    let account = await admin.v1.admin.accounts.$select(client.id).fetch();
    expect(account.disabled).toBe(true);

    account = await admin.v1.admin.accounts.$select(client.id).enable();
    expect(account.disabled).toBe(false);
  });

  it("suspends an account", async () => {
    await using session = await sessions.acquire();
    await admin.v1.admin.accounts.$select(session.id).action.create({
      type: "suspend",
    });
    let account = await admin.v1.admin.accounts.$select(session.id).fetch();
    expect(account.suspended).toBe(true);

    account = await admin.v1.admin.accounts.$select(session.id).unsuspend();
    expect(account.suspended).toBe(false);
  });

  it("silences an account", async () => {
    await using session = await sessions.acquire();
    await admin.v1.admin.accounts.$select(session.id).action.create({
      type: "silence",
    });
    let account = await admin.v1.admin.accounts.$select(session.id).fetch();
    expect(account.silenced).toBe(true);

    account = await admin.v1.admin.accounts.$select(session.id).unsilence();
    expect(account.silenced).toBe(false);
  });

  it("marks account as sensitive", async () => {
    await using session = await sessions.acquire();
    await admin.v1.admin.accounts.$select(session.id).action.create({
      type: "sensitive",
    });
    let account = await admin.v1.admin.accounts.$select(session.id).fetch();
    expect(account.sensitized).toBe(true);

    account = await admin.v1.admin.accounts.$select(session.id).unsensitive();
    expect(account.sensitized).toBe(false);
  });
});
