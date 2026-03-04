import { notifyOwner } from "./_core/notification";
import * as db from "./db";
import { sendAdminDailySummaryEmail } from "./emailService";

/**
 * Send email notification to admin when new registration is created
 */
export async function notifyAdminNewRegistration(
  registrationId: number
): Promise<boolean> {
  try {
    const registration = await db.getRegistrationById(registrationId);
    if (!registration) {
      console.error("[Email] Registration not found:", registrationId);
      return false;
    }

    const participants = await db.getParticipantsByRegistrationId(registrationId);
    const participant = participants[0];
    if (!participant) {
      console.error("[Email] No participant found for registration:", registrationId);
      return false;
    }

    const tour = await db.getTourById(registration.tourId);
    if (!tour) {
      console.error("[Email] Tour not found:", registration.tourId);
      return false;
    }

    const datePreferenceText = 
      registration.datePreference === "may_4_6" ? "4-6 במאי" :
      registration.datePreference === "may_25_27" ? "25-27 במאי" :
      "אין העדפה";

    const title = `🎉 רישום חדש לסיור בוונציה - #${registration.orderNumber}`;
    
    const content = `
רישום חדש התקבל למערכת!

**פרטי ההזמנה:**
- מספר הזמנה: ${registration.orderNumber}
- סיור: ${tour.title}
- תאריך מועדף: ${datePreferenceText}

**פרטי הנוסע:**
- שם: ${participant.firstNameHe} ${participant.lastNameHe}
- שם באנגלית: ${participant.firstNameEn} ${participant.lastNameEn}
- טלפון: ${participant.phone}
- דוא"ל: ${participant.email}
- תאריך לידה: ${new Date(participant.birthDate).toLocaleDateString('he-IL')}
- אישור דרכון: ${participant.passportConfirmed ? 'כן' : 'לא'}

**סטטוס:** ממתין לאישור

אנא היכנס לממשק הניהול לאישור או דחיית ההרשמה.
    `.trim();

    const success = await notifyOwner({ title, content });
    
    if (success) {
      console.log("[Email] Notification sent successfully for registration:", registrationId);
    } else {
      console.warn("[Email] Failed to send notification for registration:", registrationId);
    }
    
    return success;
  } catch (error) {
    console.error("[Email] Error sending notification:", error);
    return false;
  }
}

/**
 * Send daily summary email to admin with registration statistics
 */
export async function sendDailySummaryEmail(): Promise<boolean> {
  try {
    const tours = await db.getAllActiveTours();
    const registrations = await db.getAllRegistrations();

    if (tours.length === 0) {
      console.log("[Email] No active tours, skipping daily summary");
      return true;
    }

    const totalPending = registrations.filter(r => r.status === "pending").length;
    
    // Only send if there are pending registrations
    if (totalPending === 0) {
      console.log("[Email] No pending registrations, skipping daily summary");
      return true;
    }

    const tourStats = tours.map(tour => {
      const tourRegistrations = registrations.filter(r => r.tourId === tour.id);
      const pending = tourRegistrations.filter(r => r.status === "pending").length;
      const approved = tourRegistrations.filter(r => r.status === "approved").length;
      const rejected = tourRegistrations.filter(r => r.status === "rejected").length;

      return {
        tourTitle: tour.title,
        dateRange: `${new Date(tour.startDate).toLocaleDateString('he-IL')} - ${new Date(tour.endDate).toLocaleDateString('he-IL')}`,
        availableSpots: tour.availableSpots,
        capacity: tour.capacity,
        pending,
        approved,
        rejected,
      };
    });

    const success = await sendAdminDailySummaryEmail({
      pendingCount: totalPending,
      tourStats,
    });
    
    if (success) {
      console.log("[Email] Daily summary sent successfully");
    } else {
      console.warn("[Email] Failed to send daily summary");
    }
    
    return success;
  } catch (error) {
    console.error("[Email] Error sending daily summary:", error);
    return false;
  }
}

/**
 * Send notification when registration is approved
 */
export async function notifyRegistrationApproved(registrationId: number): Promise<boolean> {
  try {
    const registration = await db.getRegistrationById(registrationId);
    if (!registration) return false;

    const participants = await db.getParticipantsByRegistrationId(registrationId);
    const participant = participants[0];
    if (!participant) return false;

    const tour = await db.getTourById(registration.tourId);
    if (!tour) return false;

    const title = `✅ הרשמה אושרה - #${registration.orderNumber}`;
    const content = `
ההרשמה של ${participant.firstNameHe} ${participant.lastNameHe} לסיור "${tour.title}" אושרה בהצלחה.

מספר הזמנה: ${registration.orderNumber}
דוא"ל: ${participant.email}
    `.trim();

    return await notifyOwner({ title, content });
  } catch (error) {
    console.error("[Email] Error sending approval notification:", error);
    return false;
  }
}

/**
 * Send notification when registration is rejected
 */
export async function notifyRegistrationRejected(registrationId: number): Promise<boolean> {
  try {
    const registration = await db.getRegistrationById(registrationId);
    if (!registration) return false;

    const participants = await db.getParticipantsByRegistrationId(registrationId);
    const participant = participants[0];
    if (!participant) return false;

    const tour = await db.getTourById(registration.tourId);
    if (!tour) return false;

    const title = `❌ הרשמה נדחתה - #${registration.orderNumber}`;
    const content = `
ההרשמה של ${participant.firstNameHe} ${participant.lastNameHe} לסיור "${tour.title}" נדחתה.

מספר הזמנה: ${registration.orderNumber}
דוא"ל: ${participant.email}
    `.trim();

    return await notifyOwner({ title, content });
  } catch (error) {
    console.error("[Email] Error sending rejection notification:", error);
    return false;
  }
}
