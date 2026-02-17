import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import * as db from "./db";
import { registrations } from "../drizzle/schema";
import { notifyAdminNewRegistration, notifyRegistrationApproved, notifyRegistrationRejected, sendDailySummaryEmail } from "./emailNotifications";
import { sendCustomerConfirmationEmail, sendCustomerApprovalEmail, sendCustomerRejectionEmail } from "./emailService";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Public tour procedures
  tours: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllActiveTours();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const tour = await db.getTourById(input.id);
        if (!tour) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Tour not found' });
        }
        return tour;
      }),
  }),

  // Public registration procedures
  registrations: router({
    create: publicProcedure
      .input(z.object({
        tourId: z.number(),
        datePreference: z.enum(["may_4_6", "may_25_27", "no_preference"]).optional(),
        participant: z.object({
          firstNameHe: z.string().min(1),
          lastNameHe: z.string().min(1),
          firstNameEn: z.string().min(1),
          lastNameEn: z.string().min(1),
          phone: z.string().min(1),
          email: z.string().email(),
          birthDate: z.string(), // Will be converted to Date
          passportConfirmed: z.boolean(),
          insuranceAcknowledged: z.boolean(),
          additionalLuggage: z.boolean(),
          singleRoomUpgrade: z.boolean(),
        }),
      }))
      .mutation(async ({ input }) => {
        // Get next order number
        const orderNumber = await db.getNextOrderNumber();
        
        // Create registration
        const registration = await db.createRegistration({
          tourId: input.tourId,
          orderNumber,
          datePreference: input.datePreference,
          status: "pending",
        });
        
        // Create participant
        await db.createParticipant({
          registrationId: registration.id,
          firstNameHe: input.participant.firstNameHe,
          lastNameHe: input.participant.lastNameHe,
          firstNameEn: input.participant.firstNameEn,
          lastNameEn: input.participant.lastNameEn,
          phone: input.participant.phone,
          email: input.participant.email,
          birthDate: input.participant.birthDate as any,
          passportConfirmed: input.participant.passportConfirmed ? 1 : 0,
          insuranceAcknowledged: input.participant.insuranceAcknowledged ? 1 : 0,
          additionalLuggage: input.participant.additionalLuggage ? 1 : 0,
          singleRoomUpgrade: input.participant.singleRoomUpgrade ? 1 : 0,
        });
        
        // Send email notification to admin
        notifyAdminNewRegistration(registration.id).catch(err => 
          console.error("Failed to send admin notification:", err)
        );
        
        // Send confirmation email to customer
        const tour = await db.getTourById(input.tourId);
        if (tour) {
          const datePreferenceText = 
            input.datePreference === "may_4_6" ? "4-6 במאי 2026" :
            input.datePreference === "may_25_27" ? "25-27 במאי 2026" :
            "אין העדפה";
          
          sendCustomerConfirmationEmail({
            customerEmail: input.participant.email,
            orderNumber: registration.orderNumber,
            customerName: `${input.participant.firstNameHe} ${input.participant.lastNameHe}`,
            tourTitle: tour.title,
            datePreference: datePreferenceText,
            birthDate: new Date(input.participant.birthDate).toLocaleDateString('he-IL'),
            phone: input.participant.phone,
            email: input.participant.email,
            additionalLuggage: input.participant.additionalLuggage,
            singleRoomUpgrade: input.participant.singleRoomUpgrade,
          }).catch(err => 
            console.error("Failed to send customer confirmation email:", err)
          );
        }
        
        return {
          success: true,
          orderNumber: registration.orderNumber,
        };
      }),
  }),

  // Admin procedures
  admin: router({
    // Get all registrations with participant details
    getAllRegistrations: adminProcedure.query(async () => {
      const registrations = await db.getAllRegistrations();
      const registrationsWithParticipants = await Promise.all(
        registrations.map(async (reg) => {
          const participants = await db.getParticipantsByRegistrationId(reg.id);
          const tour = await db.getTourById(reg.tourId);
          return {
            ...reg,
            participants,
            tour,
          };
        })
      );
      return registrationsWithParticipants;
    }),

    // Assign date and approve registration (for no_preference)
    assignDateAndApprove: adminProcedure
      .input(z.object({ 
        registrationId: z.number(),
        assignedDate: z.enum(["may_4_6", "may_25_27"])
      }))
      .mutation(async ({ input }) => {
        const registration = await db.getRegistrationById(input.registrationId);
        if (!registration) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Registration not found' });
        }
        
        // Update assigned date
        const dbInstance = await db.getDb();
        if (dbInstance) {
          await dbInstance.update(registrations).set({ assignedDate: input.assignedDate }).where(eq(registrations.id, input.registrationId));
        }
        
        // Decrease available spots
        if (registration.status === "pending") {
          await db.updateTourAvailableSpots(registration.tourId, -1);
        } else if (registration.status === "rejected") {
          await db.updateTourAvailableSpots(registration.tourId, -1);
        }
        
        const updated = await db.updateRegistrationStatus(input.registrationId, "approved");
        
        // Send approval notification to admin
        notifyRegistrationApproved(input.registrationId).catch(err => 
          console.error("Failed to send admin approval notification:", err)
        );
        
        // Send approval email to customer
        const participants = await db.getParticipantsByRegistrationId(input.registrationId);
        const tour = await db.getTourById(registration.tourId);
        if (participants[0] && tour && updated) {
          const dateText = 
            (updated.assignedDate || updated.datePreference) === "may_4_6" ? "4-6 במאי 2026" :
            (updated.assignedDate || updated.datePreference) === "may_25_27" ? "25-27 במאי 2026" :
            "תאריך יקבע בהמשך";
          
          sendCustomerApprovalEmail({
            customerEmail: participants[0].email,
            orderNumber: registration.orderNumber,
            customerName: `${participants[0].firstNameHe} ${participants[0].lastNameHe}`,
            tourTitle: tour.title,
            datePreference: dateText,
            additionalLuggage: participants[0].additionalLuggage === 1,
            singleRoomUpgrade: participants[0].singleRoomUpgrade === 1,
          }).catch(err => 
            console.error("Failed to send customer approval email:", err)
          );
        }
        
        return { success: true, registration: updated };
      }),

    // Approve registration
    approveRegistration: adminProcedure
      .input(z.object({ registrationId: z.number() }))
      .mutation(async ({ input }) => {
        const registration = await db.getRegistrationById(input.registrationId);
        if (!registration) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Registration not found' });
        }
        
        // If moving from pending to approved, decrease available spots
        if (registration.status === "pending") {
          await db.updateTourAvailableSpots(registration.tourId, -1);
        }
        // If moving from rejected to approved, decrease available spots
        else if (registration.status === "rejected") {
          await db.updateTourAvailableSpots(registration.tourId, -1);
        }
        
        const updated = await db.updateRegistrationStatus(input.registrationId, "approved");
        
        // Send approval notification to admin
        notifyRegistrationApproved(input.registrationId).catch(err => 
          console.error("Failed to send admin approval notification:", err)
        );
        
        // Send approval email to customer
        const participants = await db.getParticipantsByRegistrationId(input.registrationId);
        const tour = await db.getTourById(registration.tourId);
        if (participants[0] && tour && updated) {
          const dateText = 
            (updated.assignedDate || updated.datePreference) === "may_4_6" ? "4-6 במאי 2026" :
            (updated.assignedDate || updated.datePreference) === "may_25_27" ? "25-27 במאי 2026" :
            "תאריך יקבע בהמשך";
          
          sendCustomerApprovalEmail({
            customerEmail: participants[0].email,
            orderNumber: registration.orderNumber,
            customerName: `${participants[0].firstNameHe} ${participants[0].lastNameHe}`,
            tourTitle: tour.title,
            datePreference: dateText,
            additionalLuggage: participants[0].additionalLuggage === 1,
            singleRoomUpgrade: participants[0].singleRoomUpgrade === 1,
          }).catch(err => 
            console.error("Failed to send customer approval email:", err)
          );
        }
        
        return { success: true, registration: updated };
      }),

    // Reject registration
    rejectRegistration: adminProcedure
      .input(z.object({ registrationId: z.number() }))
      .mutation(async ({ input }) => {
        const registration = await db.getRegistrationById(input.registrationId);
        if (!registration) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Registration not found' });
        }
        
        // If moving from approved to rejected, increase available spots
        if (registration.status === "approved") {
          await db.updateTourAvailableSpots(registration.tourId, 1);
        }
        
        const updated = await db.updateRegistrationStatus(input.registrationId, "rejected");
        
        // Send rejection notification to admin
        notifyRegistrationRejected(input.registrationId).catch(err => 
          console.error("Failed to send admin rejection notification:", err)
        );
        
        // Send rejection email to customer
        const participants = await db.getParticipantsByRegistrationId(input.registrationId);
        const tour = await db.getTourById(registration.tourId);
        if (participants[0] && tour) {
          sendCustomerRejectionEmail({
            customerEmail: participants[0].email,
            orderNumber: registration.orderNumber,
            customerName: `${participants[0].firstNameHe} ${participants[0].lastNameHe}`,
            tourTitle: tour.title,
          }).catch(err => 
            console.error("Failed to send customer rejection email:", err)
          );
        }
        
        return { success: true, registration: updated };
      }),

    // Cancel approved registration
    cancelRegistration: adminProcedure
      .input(z.object({ registrationId: z.number() }))
      .mutation(async ({ input }) => {
        const registration = await db.getRegistrationById(input.registrationId);
        if (!registration) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Registration not found' });
        }
        
        if (registration.status !== "approved") {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Can only cancel approved registrations' });
        }
        
        // Increase available spots when canceling
        await db.updateTourAvailableSpots(registration.tourId, 1);
        
        const updated = await db.updateRegistrationStatus(input.registrationId, "rejected");
        return { success: true, registration: updated };
      }),

    // Tour management
    createTour: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        startDate: z.string(),
        endDate: z.string(),
        flightDetails: z.string().optional(),
        luggageDetails: z.string().optional(),
        hotelDetails: z.string().optional(),
        itinerary: z.string().optional(),
        price: z.string().optional(),
        capacity: z.number().default(32),
      }))
      .mutation(async ({ input }) => {
        const tour = await db.createTour({
          ...input,
          startDate: input.startDate as any,
          endDate: input.endDate as any,
          availableSpots: input.capacity,
        });
        return { success: true, tour };
      }),

    updateTour: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        flightDetails: z.string().optional(),
        luggageDetails: z.string().optional(),
        hotelDetails: z.string().optional(),
        itinerary: z.string().optional(),
        price: z.string().optional(),
        capacity: z.number().optional(),
        isActive: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, startDate, endDate, ...rest } = input;
        const updates: any = { ...rest };
        if (startDate) updates.startDate = startDate;
        if (endDate) updates.endDate = endDate;
        const tour = await db.updateTour(id, updates);
        return { success: true, tour };
      }),

    // Admin email management
    getAdminEmails: adminProcedure.query(async () => {
      return await db.getAllActiveAdminEmails();
    }),

    addAdminEmail: adminProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const adminEmail = await db.createAdminEmail(input.email);
        return { success: true, adminEmail };
      }),

    removeAdminEmail: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteAdminEmail(input.id);
        return { success: true };
      }),

    // Get inventory statistics
    getInventoryStats: adminProcedure.query(async () => {
      const tours = await db.getAllActiveTours();
      const registrations = await db.getAllRegistrations();
      
      const stats = tours.map(tour => {
        const tourRegistrations = registrations.filter(r => r.tourId === tour.id);
        const pending = tourRegistrations.filter(r => r.status === "pending").length;
        const approved = tourRegistrations.filter(r => r.status === "approved").length;
        const rejected = tourRegistrations.filter(r => r.status === "rejected").length;
        
        return {
          tour,
          pending,
          approved,
          rejected,
          availableSpots: tour.availableSpots,
          capacity: tour.capacity,
        };
      });
      
      return stats;
    }),

    // Send daily summary email manually
    sendDailySummary: adminProcedure.mutation(async () => {
      const success = await sendDailySummaryEmail();
      return { success };
    }),
  }),
});

export type AppRouter = typeof appRouter;
