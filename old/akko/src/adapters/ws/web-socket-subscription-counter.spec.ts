import { WebSocketSubscriptionCounterImpl } from "./web-socket-subscription-counter";

describe("WebSocketSubscriptionCounter", () => {
  it("counts", () => {
    const counter = new WebSocketSubscriptionCounterImpl();
    expect(counter.count("stream")).toBe(0);
  });

  it("increments", () => {
    const counter = new WebSocketSubscriptionCounterImpl();
    counter.increment("stream");
    expect(counter.count("stream")).toBe(1);
  });

  it("decrements", () => {
    const counter = new WebSocketSubscriptionCounterImpl();
    counter.increment("stream");
    expect(counter.count("stream")).toBe(1);
    counter.decrement("stream");
    expect(counter.count("stream")).toBe(0);
  });

  it("count differently for different params", () => {
    const counter = new WebSocketSubscriptionCounterImpl();
    counter.increment("stream", { foo: "bar" });
    expect(counter.count("stream", { foo: "bar" })).toBe(1);
    expect(counter.count("stream", { foo: "baz" })).toBe(0);
  });

  it("does not decrement non-existing stream", () => {
    const counter = new WebSocketSubscriptionCounterImpl();
    expect(() => counter.decrement("stream")).toThrow();
  });
});
