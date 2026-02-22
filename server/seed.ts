import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { tours, adminEmails } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  // Check if tour already exists
  const existingTours = await db.select().from(tours).limit(1);
  if (existingTours.length > 0) {
    console.log("[Seed] Tour already exists, skipping seed.");
    process.exit(0);
  }

  console.log("[Seed] Creating Armenia tour...");

  // Insert the Armenia tour
  await db.insert(tours).values({
    title: "סיור לארמניה - ירוואן 2026",
    description: "סיור מיוחד לארמניה בארגון ההסתדרות - 4 ימים / 3 לילות בירוואן",
    startDate: "2026-06-28",
    endDate: "2026-07-01",
    flightDetails: "טיסות פרטיות ישירות לירוואן במטוס ההסתדרות | המראה 28.6.2026 בשעות הבוקר המוקדמות | חזרה 1.7.2026 בשעות הערב",
    luggageDetails: "כבודה אישית בהתאם להנחיות ההסתדרות",
    hotelDetails: "מרחב חיפה, צפון ושפלה + מרחב דרום: Ani Grand Hotel Yerevan (4 כוכבים) | מרחב מרכז, גוש דן וירושלים + בודדים: Ani Plaza Hotel Yerevan (4 כוכבים)",
    itinerary: "יום 1: הגעה לירוואן, סיור בעיר, ארוחת ערב חגיגית | יום 2-3: גגהארד, גרני, סימפוניית האבנות, יקב ווסקבאז | יום 4: הפארק היהודי, Grand Candy, קניון דלמה גרדן, עזיבה",
    capacity: 32,
    availableSpots: 32,
    isActive: 1,
  });

  // Insert admin email
  const adminEmail = process.env.ADMIN_EMAIL || "info.yerevan@histadrut.org";
  const existingEmails = await db.select().from(adminEmails).where(eq(adminEmails.email, adminEmail));
  if (existingEmails.length === 0) {
    await db.insert(adminEmails).values({ email: adminEmail });
    console.log(`[Seed] Admin email added: ${adminEmail}`);
  }

  console.log("[Seed] Armenia tour created successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("[Seed] Error:", err);
  process.exit(1);
});
