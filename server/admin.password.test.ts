import { describe, it, expect } from "vitest";
import { ENV } from "./_core/env";

describe("Admin Password Configuration", () => {
  it("should have VITE_ADMIN_PASSWORD configured", () => {
    expect(ENV.adminPassword).toBeDefined();
    expect(ENV.adminPassword).not.toBe("");
    expect(ENV.adminPassword.length).toBeGreaterThanOrEqual(4);
  });
});
