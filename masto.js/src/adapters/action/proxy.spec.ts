/* eslint-disable @typescript-eslint/no-explicit-any */
import { type AnyAction } from "../../interfaces";
import { createActionProxy } from "./proxy";

describe("RequestBuilder", () => {
  it("returns undefined for special properties", () => {
    const builder: any = createActionProxy({
      dispatch: Promise.resolve,
    });

    expect(builder.then).toBeUndefined();
    expect(builder.catch).toBeUndefined();
    expect(builder.finally).toBeUndefined();
    expect(builder.inspect).toBeUndefined();
    expect(builder.toString).toBeUndefined();
    expect(builder.valueOf).toBeUndefined();
    expect(builder.toJSON).toBeUndefined();
    expect(builder.constructor).toBeUndefined();
    expect(builder.prototype).toBeUndefined();
    expect(builder.length).toBeUndefined();
    expect(builder.name).toBeUndefined();
    expect(builder.caller).toBeUndefined();
    expect(builder.callee).toBeUndefined();
    expect(builder.arguments).toBeUndefined();
    expect(builder.bind).toBeUndefined();
    expect(builder.apply).toBeUndefined();
    expect(builder.call).toBeUndefined();
    expect(builder[Symbol.asyncIterator]).toBeUndefined();
  });

  it("builds fetch manifest", () => {
    let action: AnyAction | undefined;

    const builder: any = createActionProxy(
      {
        dispatch: async <T>(a: AnyAction) => {
          action = a;
          return {} as T;
        },
      },
      { context: ["root"] },
    );
    const data = {};
    builder.$select("foo").bar.fetch(data);

    expect(action?.type).toBe("fetch");
    expect(action?.path).toBe("/root/foo/bar");
    expect(action?.data).toBe(data);
  });

  it("builds create manifest", () => {
    let action: AnyAction | undefined;

    const builder: any = createActionProxy(
      {
        dispatch: async <T>(a: AnyAction) => {
          action = a;
          return {} as T;
        },
      },
      {
        context: ["root"],
      },
    );
    const data = {};
    builder.$select("foo").bar.create(data);

    expect(action?.type).toBe("create");
    expect(action?.path).toBe("/root/foo/bar");
    expect(action?.data).toBe(data);
  });

  it("builds a resource with CamelCase", () => {
    let action: AnyAction | undefined;

    const builder: any = createActionProxy(
      {
        dispatch: async <T>(a: AnyAction) => {
          action = a;
          return {} as T;
        },
      },
      { context: ["root"] },
    );
    const data = {};
    builder.$select("AlphaBeta").gammaDelta.create(data);
    expect(action?.type).toBe("create");
    expect(action?.path).toBe("/root/AlphaBeta/gamma_delta");
    expect(action?.data).toBe(data);
  });

  it("cannot invoke with too few context", () => {
    const api: any = createActionProxy(
      {
        dispatch: async <T>(_: AnyAction) => {
          return {} as T;
        },
      },
      { context: [] },
    );

    expect(() => api()).toThrow(TypeError);
    expect(() => api.close()).not.toThrow(TypeError);
  });

  it("can be disposed", () => {
    const dispatcher = {
      dispatch: async <T>(_: AnyAction) => {
        return {} as T;
      },
      [Symbol.dispose]: jest.fn(),
    };
    const api: any = createActionProxy(dispatcher, { context: ["root"] });

    api[Symbol.dispose]();

    expect(dispatcher[Symbol.dispose]).toHaveBeenCalled();
  });
});
