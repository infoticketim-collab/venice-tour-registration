import { describe, it, expect } from "vitest";
import { sendEmail } from "./emailService";
import { ENV } from "./_core/env";

describe("Email Service", () => {
  it("should have RESEND_API_KEY configured", () => {
    expect(ENV.resendApiKey).toBeTruthy();
    expect(ENV.resendApiKey.length).toBeGreaterThan(0);
  });

  it("should have FROM_EMAIL configured", () => {
    expect(ENV.fromEmail).toBeTruthy();
    expect(ENV.fromEmail).toContain("@");
  });

  it("should have ADMIN_EMAIL configured", () => {
    expect(ENV.adminEmail).toBeTruthy();
    expect(ENV.adminEmail).toBe("Ori@nizat.co.il");
  });

  it("should send a test email successfully", async () => {
    // This test validates that the Resend API key is valid
    // In testing mode, we can only send to the verified email (info.ticketim@gmail.com)
    const result = await sendEmail({
      to: "info.ticketim@gmail.com",
      subject: "Test Email - Resend Integration",
      html: "<p>This is a test email to validate the Resend API key configuration.</p>",
    });

    expect(result).toBe(true);
  }, 10000); // 10 second timeout for API call
});
