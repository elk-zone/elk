describe("Suggestions", () => {
  it("fetches suggestions", async () => {
    const all = await admin.v2.suggestions.list();
    expect(Array.isArray(all)).toBe(true);
  });
});
