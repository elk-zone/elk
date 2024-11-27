import { getMockImage } from "../../../test-utils/image";

describe("media", () => {
  it("creates a media attachment", async () => {
    const file = await getMockImage();
    let media = await admin.v2.media.create({ file });

    media = await admin.v1.media.$select(media.id).fetch();
    expect(media.type).toBe("image");

    media = await admin.v1.media.$select(media.id).update({
      description: "test",
    });
    expect(media.description).toBe("test");
  });

  it("creates media attachment without polling", async () => {
    await using session = await sessions.acquire();
    const file = await getMockImage();
    const media = await session.rest.v2.media.create({ file });
    expect(media.type).toBe("image");
  });
});
