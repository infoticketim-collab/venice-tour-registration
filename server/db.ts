import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  tours, 
  Tour, 
  InsertTour,
  registrations,
  Registration,
  InsertRegistration,
  participants,
  Participant,
  InsertParticipant,
  adminEmails,
  AdminEmail,
  InsertAdminEmail
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============= User Functions =============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= Tour Functions =============

export async function getAllActiveTours(): Promise<Tour[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(tours).where(eq(tours.isActive, 1)).orderBy(tours.startDate);
  return result;
}

export async function getTourById(id: number): Promise<Tour | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTour(tour: InsertTour): Promise<Tour> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(tours).values(tour);
  const insertedId = Number(result[0].insertId);
  const created = await getTourById(insertedId);
  if (!created) throw new Error("Failed to retrieve created tour");
  return created;
}

export async function updateTour(id: number, tour: Partial<InsertTour>): Promise<Tour | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(tours).set(tour).where(eq(tours.id, id));
  return getTourById(id);
}

export async function updateTourAvailableSpots(tourId: number, delta: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const tour = await getTourById(tourId);
  if (!tour) throw new Error("Tour not found");
  
  const newSpots = tour.availableSpots + delta;
  if (newSpots < 0) throw new Error("Not enough available spots");
  if (newSpots > tour.capacity) throw new Error("Cannot exceed tour capacity");
  
  await db.update(tours).set({ availableSpots: newSpots }).where(eq(tours.id, tourId));
}

// ============= Registration Functions =============

export async function getNextOrderNumber(): Promise<number> {
  const db = await getDb();
  if (!db) return 1000;
  
  const result = await db.select().from(registrations).orderBy(desc(registrations.orderNumber)).limit(1);
  if (result.length === 0) return 1000;
  return result[0].orderNumber + 1;
}

export async function createRegistration(registration: InsertRegistration): Promise<Registration> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(registrations).values(registration);
  const insertedId = Number(result[0].insertId);
  const created = await getRegistrationById(insertedId);
  if (!created) throw new Error("Failed to retrieve created registration");
  return created;
}

export async function getRegistrationById(id: number): Promise<Registration | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(registrations).where(eq(registrations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllRegistrations(): Promise<Registration[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(registrations).orderBy(desc(registrations.createdAt));
  return result;
}

export async function updateRegistrationStatus(id: number, status: "pending" | "approved" | "rejected"): Promise<Registration | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  await db.update(registrations).set({ status }).where(eq(registrations.id, id));
  return getRegistrationById(id);
}

// ============= Participant Functions =============

export async function createParticipant(participant: InsertParticipant): Promise<Participant> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(participants).values(participant);
  const insertedId = Number(result[0].insertId);
  const created = await getParticipantById(insertedId);
  if (!created) throw new Error("Failed to retrieve created participant");
  return created;
}

export async function getParticipantById(id: number): Promise<Participant | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(participants).where(eq(participants.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getParticipantsByRegistrationId(registrationId: number): Promise<Participant[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(participants).where(eq(participants.registrationId, registrationId));
  return result;
}

// ============= Admin Email Functions =============

export async function getAllActiveAdminEmails(): Promise<AdminEmail[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(adminEmails).where(eq(adminEmails.isActive, 1));
  return result;
}

export async function createAdminEmail(email: string): Promise<AdminEmail> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(adminEmails).values({ email });
  const insertedId = Number(result[0].insertId);
  const created = await getAdminEmailById(insertedId);
  if (!created) throw new Error("Failed to retrieve created admin email");
  return created;
}

export async function getAdminEmailById(id: number): Promise<AdminEmail | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(adminEmails).where(eq(adminEmails.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteAdminEmail(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(adminEmails).set({ isActive: 0 }).where(eq(adminEmails.id, id));
}
