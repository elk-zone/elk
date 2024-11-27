import waitForExpect from "@sadams/wait-for-expect";

import { type mastodon } from "../../../src";

describe("notification group", () => {
  it("lists, fetches, counts unread, and dismisses", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    try {
      await bob.rest.v1.accounts.$select(alice.id).follow();

      await waitForExpect(async () => {
        const unreadCount =
          await alice.rest.v2.notifications.unreadCount.fetch();
        expect(unreadCount.count).toBe(1);
      });

      const notifications = await alice.rest.v2.notifications.list();
      expect(notifications.notificationGroups[0].type).toBe("follow");
      expect(notifications.accounts).toContainEqual(bob.account);

      const groupKey = notifications.notificationGroups[0].groupKey;
      const notification = await alice.rest.v2.notifications
        .$select(groupKey)
        .fetch();
      expect(notification.notificationGroups[0].type).toBe("follow");
      expect(notification.accounts).toContainEqual(bob.account);

      const accounts = await alice.rest.v2.notifications
        .$select(groupKey)
        .accounts.fetch();
      expect(accounts).toHaveLength(1);
      expect(accounts[0].id).toBe(bob.id);

      await alice.rest.v2.notifications.$select(groupKey).dismiss();
    } finally {
      await alice.rest.v1.notifications.clear();
      await bob.rest.v1.accounts.$select(alice.id).unfollow();
      await alice.rest.v1.accounts.$select(bob.id).unfollow();
    }
  });
});

describe("notifications policy", () => {
  it("handles", async () => {
    await using alice = await sessions.acquire();
    const originalPolicy = await alice.rest.v2.notifications.policy.fetch();

    try {
      const updatedPolicy = await alice.rest.v2.notifications.policy.update({
        forNewAccounts: "drop",
        forNotFollowers: "filter",
        forNotFollowing: "drop",
        forPrivateMentions: "filter",
        forLimitedAccounts: "drop",
      });

      expect(updatedPolicy).toEqual(
        expect.objectContaining({
          forNewAccounts: "drop",
          forNotFollowers: "filter",
          forNotFollowing: "drop",
          forPrivateMentions: "filter",
          forLimitedAccounts: "drop",
        }),
      );
    } finally {
      await alice.rest.v2.notifications.policy.update({
        forNewAccounts: originalPolicy.forNewAccounts,
        forNotFollowers: originalPolicy.forNotFollowers,
        forNotFollowing: originalPolicy.forNotFollowing,
        forPrivateMentions: originalPolicy.forPrivateMentions,
        forLimitedAccounts: originalPolicy.forLimitedAccounts,
      });
    }
  });
});

describe("notification requests", () => {
  it("fetches notification requests", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    await alice.rest.v1.accounts.$select(bob.id).unfollow();
    await bob.rest.v1.accounts.$select(alice.id).unfollow();

    try {
      await alice.rest.v2.notifications.policy.update({
        forNotFollowing: "filter",
      });

      await bob.rest.v1.statuses.create({
        status: `@${alice.account.acct} Hello`,
      });

      let requests!: mastodon.v1.NotificationRequest[];
      await waitForExpect(async () => {
        requests = await alice.rest.v1.notifications.requests.list();
        expect(requests).toHaveLength(1);
      });

      const request = await alice.rest.v1.notifications.requests
        .$select(requests[0].id)
        .fetch();
      await alice.rest.v1.notifications.requests.$select(request.id).dismiss();

      expect(request.account.id).toBe(bob.id);
    } finally {
      await alice.rest.v2.notifications.policy.update({
        forNotFollowing: "accept",
      });
      await alice.rest.v1.accounts.$select(bob.id).block();
      await alice.rest.v1.accounts.$select(bob.id).unblock();
      await bob.rest.v1.accounts.$select(alice.id).block();
      await bob.rest.v1.accounts.$select(alice.id).unblock();
    }
  });

  it("accepts all", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    await alice.rest.v1.accounts.$select(bob.id).unfollow();
    await bob.rest.v1.accounts.$select(alice.id).unfollow();

    try {
      await alice.rest.v2.notifications.policy.update({
        forNotFollowing: "filter",
      });

      await bob.rest.v1.statuses.create({
        status: `@${alice.account.acct} hello`,
      });

      await alice.rest.v1.notifications.requests.accept();
    } finally {
      await alice.rest.v2.notifications.policy.update({
        forNotFollowing: "accept",
      });
      await alice.rest.v1.accounts.$select(bob.id).block();
      await alice.rest.v1.accounts.$select(bob.id).unblock();
      await bob.rest.v1.accounts.$select(alice.id).block();
      await bob.rest.v1.accounts.$select(alice.id).unblock();
    }
  });

  it("dismiss all", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    await alice.rest.v1.accounts.$select(bob.id).unfollow();
    await bob.rest.v1.accounts.$select(alice.id).unfollow();

    try {
      await alice.rest.v2.notifications.policy.update({
        forNotFollowing: "filter",
      });

      await bob.rest.v1.statuses.create({
        status: `@${alice.account.acct} hello`,
      });

      await alice.rest.v1.notifications.requests.accept();
    } finally {
      await alice.rest.v2.notifications.policy.update({
        forNotFollowing: "accept",
      });
      await alice.rest.v1.accounts.$select(bob.id).block();
      await alice.rest.v1.accounts.$select(bob.id).unblock();
      await bob.rest.v1.accounts.$select(alice.id).block();
      await bob.rest.v1.accounts.$select(alice.id).unblock();
    }
  });

  it("checks if merged", async () => {
    await using alice = await sessions.acquire();
    const merged = await alice.rest.v1.notifications.requests.merged.fetch();
    expect(merged.merged).toBe(true);
  });

  it("accept single", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    await alice.rest.v1.accounts.$select(bob.id).unfollow();
    await bob.rest.v1.accounts.$select(alice.id).unfollow();

    try {
      await alice.rest.v2.notifications.policy.update({
        forNotFollowing: "filter",
      });

      await bob.rest.v1.statuses.create({
        status: `@${alice.account.acct} hello`,
      });

      let requests!: mastodon.v1.NotificationRequest[];
      await waitForExpect(async () => {
        requests = await alice.rest.v1.notifications.requests.list();
        expect(requests).toHaveLength(1);
      });

      await alice.rest.v1.notifications.requests
        .$select(requests[0].id)
        .dismiss();
    } finally {
      await alice.rest.v2.notifications.policy.update({
        forNotFollowing: "accept",
      });
      await alice.rest.v1.accounts.$select(bob.id).block();
      await alice.rest.v1.accounts.$select(bob.id).unblock();
      await bob.rest.v1.accounts.$select(alice.id).block();
      await bob.rest.v1.accounts.$select(alice.id).unblock();
    }
  });

  it("dismiss single", async () => {
    await using alice = await sessions.acquire();
    await using bob = await sessions.acquire();

    await alice.rest.v1.accounts.$select(bob.id).unfollow();
    await bob.rest.v1.accounts.$select(alice.id).unfollow();

    try {
      await alice.rest.v2.notifications.policy.update({
        forNotFollowing: "filter",
      });

      await bob.rest.v1.statuses.create({
        status: `@${alice.account.acct} hello`,
      });

      let requests!: mastodon.v1.NotificationRequest[];
      await waitForExpect(async () => {
        requests = await alice.rest.v1.notifications.requests.list();
        expect(requests).toHaveLength(1);
      });

      await alice.rest.v1.notifications.requests
        .$select(requests[0].id)
        .dismiss();
    } finally {
      await alice.rest.v2.notifications.policy.update({
        forNotFollowing: "accept",
      });
      await alice.rest.v1.accounts.$select(bob.id).block();
      await alice.rest.v1.accounts.$select(bob.id).unblock();
      await bob.rest.v1.accounts.$select(alice.id).block();
      await bob.rest.v1.accounts.$select(alice.id).unblock();
    }
  });
});
