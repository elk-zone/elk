import { MastoHttpError } from "./masto-http-error";

describe("MastoHttpError", () => {
  it("creates MastoHttpError", () => {
    const error = new MastoHttpError({ statusCode: 400, message: "message" });
    expect(error.message).toEqual("message");
    expect(error.statusCode).toEqual(400);
  });

  it("creates MastoHttpError with description", () => {
    const error = new MastoHttpError({
      statusCode: 400,
      message: "message",
      description: "description",
    });
    expect(error.message).toEqual("message");
    expect(error.statusCode).toEqual(400);
    expect(error.description).toEqual("description");
  });

  it("creates MastoHttpError with details", () => {
    const error = new MastoHttpError({
      statusCode: 400,
      message: "message",
      details: {
        error: [
          {
            error: "ERR_INVALID",
            description: "Invalid value",
          },
        ],
      },
    });
    expect(error.message).toEqual("message");
    expect(error.statusCode).toEqual(400);
    expect(error.details).toEqual({
      error: [
        {
          error: "ERR_INVALID",
          description: "Invalid value",
        },
      ],
    });
  });

  it("creates MastoHttpError with additionalProperties", () => {
    const error = new MastoHttpError({
      statusCode: 400,
      message: "message",
      additionalProperties: {
        foo: "bar",
      },
    });
    expect(error.message).toEqual("message");
    expect(error.statusCode).toEqual(400);
    expect(error.additionalProperties).toEqual({
      foo: "bar",
    });
  });
});
