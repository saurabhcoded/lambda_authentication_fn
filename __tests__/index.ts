import { handler } from "../src/index";

describe("Lambda Handler - /authenticate route", () => {
  test("missing email/password", async () => {
    const res = await handler({
      path: "/authenticate",
    });

    expect(res.statusCode).toBe(404);

    const body = res.body;
    expect(body.success).toBe(false);
  });

  test("invalid email", async () => {
    const res = await handler({
      path: "/authenticate",
      email: "x",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);

    const body = res.body;
    expect(body.success).toBe(false);
  });

  test("invalid password", async () => {
    const res = await handler({
      path: "/authenticate",
      email: "a@b.com",
      password: "123",
    });

    expect(res.statusCode).toBe(400);

    const body = res.body;
    expect(body.success).toBe(false);
  });

  test("successful login", async () => {
    const res = await handler({
      path: "/authenticate",
      email: "a@b.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);

    const body = res.body;
    expect(body.success).toBe(true);
    expect(body.token).toBe("mockToken123");
  });

  test("route not found", async () => {
    const res = await handler({
      path: "/unknown",
      httpMethod: "GET",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Route not found");
  });
});
