import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { SignJWT, jwtVerify } from "jose";

type CookieCall = {
  name: string;
  value: string;
  options: Record<string, unknown>;
};

function createPublicContext(cookies: string = ""): { ctx: TrpcContext; setCookies: CookieCall[]; clearedCookies: string[] } {
  const setCookies: CookieCall[] = [];
  const clearedCookies: string[] = [];
  const ctx: TrpcContext = {
    user: null,
    req: {
      headers: { cookie: cookies },
      protocol: "https",
    } as any,
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        setCookies.push({ name, value, options });
      },
      clearCookie: (name: string) => {
        clearedCookies.push(name);
      },
    } as any,
  };
  return { ctx, setCookies, clearedCookies };
}

describe("Admin JWT Cookie Authentication", () => {
  const CORRECT_PASSWORD = process.env.VITE_ADMIN_PASSWORD || "Venice2026!";
  const COOKIE_SECRET = process.env.JWT_SECRET || "admin-secret-fallback";

  it("should reject wrong password", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.adminLogin({ password: "wrongpassword" })
    ).rejects.toThrow();
  });

  it("should set admin_session cookie on correct password", async () => {
    const { ctx, setCookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.adminLogin({ password: CORRECT_PASSWORD });

    expect(result.success).toBe(true);
    expect(setCookies.length).toBe(1);
    expect(setCookies[0].name).toBe("admin_session");
    expect(setCookies[0].value).toBeTruthy();
    // JWT tokens have 3 parts separated by dots
    expect(setCookies[0].value.split(".").length).toBe(3);
  });

  it("should produce a JWT with role=admin", async () => {
    const { ctx, setCookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await caller.auth.adminLogin({ password: CORRECT_PASSWORD });

    const token = setCookies[0]?.value;
    expect(token).toBeTruthy();

    // Verify the JWT contains role=admin
    const secret = new TextEncoder().encode(COOKIE_SECRET);
    const { payload } = await jwtVerify(token, secret);
    expect(payload.role).toBe("admin");
  });

  it("should reject admin procedures without cookie with FORBIDDEN", async () => {
    const { ctx } = createPublicContext(); // no cookies
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.admin.getAllRegistrations();
      expect.fail('Should have thrown');
    } catch (err: any) {
      expect(err.code).toBe('FORBIDDEN');
    }
  });

  it("should clear admin_session cookie on logout", async () => {
    const { ctx, clearedCookies } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.adminLogout();

    expect(result.success).toBe(true);
    expect(clearedCookies).toContain("admin_session");
  });

  it("should reject admin procedures with invalid/expired JWT cookie", async () => {
    // Use a fake/invalid JWT
    const { ctx } = createPublicContext("admin_session=invalid.jwt.token");
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.getAllRegistrations()
    ).rejects.toThrow();
  });

  it("should reject admin procedures with a JWT signed with wrong secret", async () => {
    // Sign with wrong secret
    const wrongSecret = new TextEncoder().encode("wrong-secret");
    const fakeToken = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(wrongSecret);

    const { ctx } = createPublicContext(`admin_session=${fakeToken}`);
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.getAllRegistrations()
    ).rejects.toThrow();
  });
});
