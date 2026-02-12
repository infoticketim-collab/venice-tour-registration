import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Registration Workflow", () => {
  let testTourId: number;

  beforeAll(async () => {
    // Create a test tour
    const adminCaller = appRouter.createCaller(createAdminContext());
    const result = await adminCaller.admin.createTour({
      title: "Test Tour",
      description: "Test Description",
      startDate: "2026-06-01",
      endDate: "2026-06-03",
      capacity: 5,
    });
    testTourId = result.tour.id;
  });

  it("should create a new registration successfully", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());

    const result = await publicCaller.registrations.create({
      tourId: testTourId,
      datePreference: "may_4_6",
      participant: {
        firstNameHe: "יוסי",
        lastNameHe: "כהן",
        firstNameEn: "Yossi",
        lastNameEn: "Cohen",
        phone: "050-1234567",
        email: "yossi@example.com",
        birthDate: "1990-01-01",
        passportConfirmed: true,
      },
    });

    expect(result.success).toBe(true);
    expect(result.orderNumber).toBeGreaterThanOrEqual(1000);
  });

  it("should generate sequential order numbers", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());

    const result1 = await publicCaller.registrations.create({
      tourId: testTourId,
      datePreference: "may_25_27",
      participant: {
        firstNameHe: "דני",
        lastNameHe: "לוי",
        firstNameEn: "Danny",
        lastNameEn: "Levi",
        phone: "052-9876543",
        email: "danny@example.com",
        birthDate: "1985-05-15",
        passportConfirmed: true,
      },
    });

    const result2 = await publicCaller.registrations.create({
      tourId: testTourId,
      datePreference: "no_preference",
      participant: {
        firstNameHe: "שרה",
        lastNameHe: "אברהם",
        firstNameEn: "Sara",
        lastNameEn: "Avraham",
        phone: "054-5555555",
        email: "sara@example.com",
        birthDate: "1992-12-25",
        passportConfirmed: true,
      },
    });

    expect(result2.orderNumber).toBe(result1.orderNumber + 1);
  });

  it("should retrieve all registrations as admin", async () => {
    const adminCaller = appRouter.createCaller(createAdminContext());

    const registrations = await adminCaller.admin.getAllRegistrations();

    expect(Array.isArray(registrations)).toBe(true);
    expect(registrations.length).toBeGreaterThan(0);
    expect(registrations[0]).toHaveProperty("participants");
    expect(registrations[0]).toHaveProperty("tour");
  });

  it("should approve registration and update inventory", async () => {
    const adminCaller = appRouter.createCaller(createAdminContext());
    const publicCaller = appRouter.createCaller(createPublicContext());

    // Create a new registration
    const createResult = await publicCaller.registrations.create({
      tourId: testTourId,
      datePreference: "may_4_6",
      participant: {
        firstNameHe: "מיכל",
        lastNameHe: "דוד",
        firstNameEn: "Michal",
        lastNameEn: "David",
        phone: "053-1111111",
        email: "michal@example.com",
        birthDate: "1988-03-10",
        passportConfirmed: true,
      },
    });

    // Get tour before approval
    const tourBefore = await db.getTourById(testTourId);
    const availableSpotsBefore = tourBefore?.availableSpots || 0;

    // Find the registration
    const registrations = await adminCaller.admin.getAllRegistrations();
    const registration = registrations.find(r => r.orderNumber === createResult.orderNumber);
    expect(registration).toBeDefined();

    // Approve the registration
    const approveResult = await adminCaller.admin.approveRegistration({
      registrationId: registration!.id,
    });

    expect(approveResult.success).toBe(true);
    expect(approveResult.registration?.status).toBe("approved");

    // Verify inventory decreased
    const tourAfter = await db.getTourById(testTourId);
    expect(tourAfter?.availableSpots).toBe(availableSpotsBefore - 1);
  });

  it("should reject registration without changing inventory", async () => {
    const adminCaller = appRouter.createCaller(createAdminContext());
    const publicCaller = appRouter.createCaller(createPublicContext());

    // Create a new registration
    const createResult = await publicCaller.registrations.create({
      tourId: testTourId,
      datePreference: "no_preference",
      participant: {
        firstNameHe: "רון",
        lastNameHe: "משה",
        firstNameEn: "Ron",
        lastNameEn: "Moshe",
        phone: "050-9999999",
        email: "ron@example.com",
        birthDate: "1995-07-20",
        passportConfirmed: true,
      },
    });

    // Get tour before rejection
    const tourBefore = await db.getTourById(testTourId);
    const availableSpotsBefore = tourBefore?.availableSpots || 0;

    // Find the registration
    const registrations = await adminCaller.admin.getAllRegistrations();
    const registration = registrations.find(r => r.orderNumber === createResult.orderNumber);

    // Reject the registration
    const rejectResult = await adminCaller.admin.rejectRegistration({
      registrationId: registration!.id,
    });

    expect(rejectResult.success).toBe(true);
    expect(rejectResult.registration?.status).toBe("rejected");

    // Verify inventory unchanged
    const tourAfter = await db.getTourById(testTourId);
    expect(tourAfter?.availableSpots).toBe(availableSpotsBefore);
  });

  it("should cancel approved registration and restore inventory", { timeout: 10000 }, async () => {
    const adminCaller = appRouter.createCaller(createAdminContext());
    const publicCaller = appRouter.createCaller(createPublicContext());

    // Create and approve a registration
    const createResult = await publicCaller.registrations.create({
      tourId: testTourId,
      datePreference: "may_25_27",
      participant: {
        firstNameHe: "עדי",
        lastNameHe: "שמעון",
        firstNameEn: "Adi",
        lastNameEn: "Shimon",
        phone: "052-7777777",
        email: "adi@example.com",
        birthDate: "1993-09-05",
        passportConfirmed: true,
      },
    });

    const registrations = await adminCaller.admin.getAllRegistrations();
    const registration = registrations.find(r => r.orderNumber === createResult.orderNumber);

    await adminCaller.admin.approveRegistration({
      registrationId: registration!.id,
    });

    // Get tour after approval
    const tourBeforeCancel = await db.getTourById(testTourId);
    const availableSpotsBefore = tourBeforeCancel?.availableSpots || 0;

    // Cancel the registration
    const cancelResult = await adminCaller.admin.cancelRegistration({
      registrationId: registration!.id,
    });

    expect(cancelResult.success).toBe(true);
    expect(cancelResult.registration?.status).toBe("rejected");

    // Verify inventory increased
    const tourAfter = await db.getTourById(testTourId);
    expect(tourAfter?.availableSpots).toBe(availableSpotsBefore + 1);
  });

  it("should get inventory statistics correctly", async () => {
    const adminCaller = appRouter.createCaller(createAdminContext());

    const stats = await adminCaller.admin.getInventoryStats();

    expect(Array.isArray(stats)).toBe(true);
    expect(stats.length).toBeGreaterThan(0);
    
    const testTourStats = stats.find(s => s.tour.id === testTourId);
    expect(testTourStats).toBeDefined();
    expect(testTourStats?.pending).toBeGreaterThanOrEqual(0);
    expect(testTourStats?.approved).toBeGreaterThanOrEqual(0);
    expect(testTourStats?.rejected).toBeGreaterThanOrEqual(0);
    expect(testTourStats?.availableSpots).toBeLessThanOrEqual(testTourStats?.capacity || 0);
  });
});
