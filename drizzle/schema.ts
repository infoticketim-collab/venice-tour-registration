import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tours table - stores Venice tour information
 */
export const tours = mysqlTable("tours", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  flightDetails: text("flightDetails"),
  luggageDetails: text("luggageDetails"),
  hotelDetails: text("hotelDetails"),
  itinerary: text("itinerary"),
  price: decimal("price", { precision: 10, scale: 2 }),
  capacity: int("capacity").notNull().default(32),
  availableSpots: int("availableSpots").notNull().default(32),
  isActive: int("isActive").notNull().default(1), // 1 = active, 0 = inactive
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tour = typeof tours.$inferSelect;
export type InsertTour = typeof tours.$inferInsert;

/**
 * Registrations table - stores registration requests
 */
export const registrations = mysqlTable("registrations", {
  id: int("id").autoincrement().primaryKey(),
  tourId: int("tourId").notNull(),
  orderNumber: int("orderNumber").notNull().unique(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  datePreference: mysqlEnum("datePreference", ["may_4_6", "may_25_27", "no_preference"]),
  assignedDate: mysqlEnum("assignedDate", ["may_4_6", "may_25_27"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = typeof registrations.$inferInsert;

/**
 * Participants table - stores participant details for each registration
 */
export const participants = mysqlTable("participants", {
  id: int("id").autoincrement().primaryKey(),
  registrationId: int("registrationId").notNull(),
  firstNameHe: varchar("firstNameHe", { length: 100 }).notNull(),
  lastNameHe: varchar("lastNameHe", { length: 100 }).notNull(),
  firstNameEn: varchar("firstNameEn", { length: 100 }).notNull(),
  lastNameEn: varchar("lastNameEn", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  birthDate: date("birthDate").notNull(),
  passportConfirmed: int("passportConfirmed").notNull().default(0), // 1 = confirmed, 0 = not confirmed
  insuranceAcknowledged: int("insuranceAcknowledged").notNull().default(0), // 1 = acknowledged, 0 = not acknowledged
  additionalLuggage: int("additionalLuggage").notNull().default(0), // 1 = requested, 0 = not requested
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Participant = typeof participants.$inferSelect;
export type InsertParticipant = typeof participants.$inferInsert;

/**
 * Admin emails table - stores email addresses for admin notifications
 */
export const adminEmails = mysqlTable("adminEmails", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  isActive: int("isActive").notNull().default(1), // 1 = active, 0 = inactive
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminEmail = typeof adminEmails.$inferSelect;
export type InsertAdminEmail = typeof adminEmails.$inferInsert;
