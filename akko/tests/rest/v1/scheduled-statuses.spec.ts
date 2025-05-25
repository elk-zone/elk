describe("scheduled-statuses", () => {
  it("schedules a status", async () => {
    await using client = await sessions.acquire();
    const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const scheduledAt = tomorrow.toISOString();

    let schedule = await client.rest.v1.statuses.create({
      status: "Scheduled status",
      scheduledAt,
    });
    expect(schedule.params.text).toBe("Scheduled status");
    expect(schedule.scheduledAt).toBe(scheduledAt);

    schedule = await client.rest.v1.scheduledStatuses
      .$select(schedule.id)
      .fetch();
    expect(schedule.params.text).toBe("Scheduled status");
    expect(schedule.scheduledAt).toBe(scheduledAt);

    const dayAfterTomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
    schedule = await client.rest.v1.scheduledStatuses
      .$select(schedule.id)
      .update({
        scheduledAt: dayAfterTomorrow.toISOString(),
      });
    expect(schedule.params.text).toBe("Scheduled status");
    expect(schedule.scheduledAt).toBe(dayAfterTomorrow.toISOString());

    const scheduledStatuses = await client.rest.v1.scheduledStatuses.list();
    expect(scheduledStatuses[0].id).toBe(schedule.id);

    await client.rest.v1.scheduledStatuses.$select(schedule.id).remove();
  });
});
