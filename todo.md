# Venice Tour Registration System - TODO

## Database Schema
- [x] Create tours table (id, title, description, date, time, price, capacity, available_spots)
- [x] Create registrations table (id, tour_id, user_id, status, order_number, created_at)
- [x] Create participants table (id, registration_id, first_name_he, last_name_he, first_name_en, last_name_en, phone, email, birth_date, passport_confirmed)
- [x] Create admin_emails table (id, email, created_at)
- [x] Add proper relationships and indexes

## Backend API (tRPC Procedures)
- [x] Public procedure: Get all available tours with remaining spots
- [x] Public procedure: Get tour details by ID
- [x] Public procedure: Create new registration with participant details
- [x] Protected procedure: Get all registrations (admin only)
- [x] Protected procedure: Approve registration (admin only)
- [x] Protected procedure: Reject registration (admin only)
- [x] Protected procedure: Cancel approved registration (admin only)
- [x] Protected procedure: Get tour inventory statistics
- [x] Protected procedure: Create/update/delete tours (admin only)
- [x] Protected procedure: Manage admin emails

## User Registration Flow
- [x] Screen 1: Tour information display with flight, luggage, hotel, itinerary details
- [x] Screen 1: "I want to register" button leading to Screen 2
- [x] Screen 2: Welcome message and personal info form (first name, last name, phone, email)
- [x] Screen 2: Radio button selection for tour dates (May 4-6, May 25-27, No preference)
- [x] Screen 2: "Continue to details" button leading to Screen 3
- [x] Screen 3: Passport details form (English names, birth date)
- [x] Screen 3: Checkbox confirmation for valid passport (6 months validity)
- [x] Screen 3: "Complete registration" button
- [x] Confirmation screen: Display order number (starting from 1000)
- [x] Confirmation screen: Message that registration will be approved soon
- [x] Back navigation support between all screens

## Admin Dashboard
- [x] Admin authentication and role-based access control
- [x] Dashboard layout with sidebar navigation
- [x] Tour management page: Create/edit/delete tours
- [x] Inventory tracking: Display available spots per tour date
- [x] Registration list: Three columns (Pending, Approved, Rejected)
- [x] Pending column: Green approve button and red reject button per registration
- [x] Approved column: Green "Approved" status badge and red "Cancel registration" button
- [x] Rejected column: Red "Rejected" status badge and green "Approve registration" button
- [x] Confirmation dialog for cancel registration action
- [x] Real-time counter update when approving/rejecting registrations
- [x] Admin email management interface

## Email Notifications
- [x] Send email to admin(s) when new registration is submitted
- [x] Include participant details in new registration email
- [x] Daily automated email with registration status summary
- [x] Daily email includes: remaining spots, pending registrations count
- [x] Email template design with branding

## Design & Styling
- [x] Elegant and minimalistic design with light blue headers
- [x] Very light gray background (no pink)
- [x] Header background with incentive tourism images
- [x] Responsive design for mobile and desktop
- [x] Consistent typography and spacing
- [x] Smooth transitions and animations
- [x] Professional color palette

## Testing
- [x] Write vitest tests for registration creation
- [x] Write vitest tests for approval workflow
- [x] Write vitest tests for inventory tracking
- [x] Write vitest tests for admin procedures
- [x] Test email notification triggers
- [x] Test back navigation in user flow
- [x] Test role-based access control

## Deployment
- [x] Final testing of all features
- [x] Create checkpoint for deployment
- [x] Verify all environment variables

## Admin Dashboard Improvements
- [x] Remove test tour data from database
- [x] Separate admin dashboard by tour dates (May 4-6 and May 25-27)
- [x] Each date gets its own section with Pending/Approved/Rejected columns
- [x] Add date assignment dropdown for "no preference" registrations
- [x] Admin must assign date before approving "no preference" registrations
- [x] Update backend to support date assignment during approval

## RTL and Status Format Improvements
- [x] Add RTL (right-to-left) support to all pages
- [x] Set HTML dir="rtl" for Hebrew content
- [x] Update admin dashboard status format to: "32 איש בקבוצה / X רשומים / Y מקומות פנויים"
- [x] Ensure all UI components work correctly in RTL mode

## Compact Admin Dashboard Layout
- [x] Replace card layout with compact table rows
- [x] Each registration displayed as single row with: order number, name, action buttons
- [x] Email and phone in expandable details (click to expand)
- [x] Small inline action buttons (approve/reject/cancel) in same row
- [x] Significant vertical space savings

## Table Column Alignment Fix
- [x] Fix table column widths to match header widths
- [x] Ensure proper alignment between headers and data cells

## RTL Table Alignment and Status Column Fix
- [x] Add text-right alignment to all table headers and cells
- [x] Remove status column from approved registrations table
- [x] Remove status column from rejected registrations table
- [x] Keep status column only in pending registrations table
- [x] Make action buttons smaller and more elegant

## Table Header Alignment Fix
- [x] Change all TableHead elements to text-right
- [x] Change action column data cells to text-right and justify-end
- [x] Ensure headers align vertically with their data cells

## Explicit RTL Table Direction Fix
- [x] Add dir="rtl" attribute to all Table components
- [x] Override shadcn/ui default LTR alignment
- [x] Reverse column order in all tables for proper RTL layout
- [x] Update renderRegistrationRow to output cells in RTL order

## Correct RTL Column Order
- [x] Fix table column order from right to left: # (order number) → name → actions → expand button
- [x] Update all table headers with correct order
- [x] Update renderRegistrationRow to output cells in correct order

## Table Header Text Alignment Fix
- [x] Add inline style={{ textAlign: 'right' }} to all TableHead components to override shadcn default
- [x] Ensure "שם" and "פעולות" headers align with their data cells

## Table Layout Fixed Width Solution
- [x] Add table-layout: fixed to all Table components
- [x] Define explicit column widths using percentage widths in inline styles
- [x] Ensure headers and data cells have identical widths

## Actions Column Header Alignment Fix
- [x] Fix "פעולות" header alignment - wrapped in flex container with justify-end
- [x] Ensure action buttons and their header are both aligned to the right

## RTL Flex Direction Fix for Actions Header
- [x] Change justify-end to justify-start in actions header flex containers
- [x] In RTL, flex-end points to the left, flex-start points to the right

## Tour Content Updates
- [x] Update main title to "סיור לימודי לצפון איטליה - מאי 2026"
- [x] Add two separate date lines for both tour groups
- [x] Remove price display
- [x] Update tour description to focus on pasta and flour factories
- [x] Split flight details into two sections (first cycle and second cycle)
- [x] Update luggage allowance details
- [x] Update hotel information (Leonardo Royal Venice)
- [x] Update detailed 3-day itinerary
- [x] Remove available spots counter from main page

## Content Formatting Improvements
- [x] Add bold formatting to flight cycle headers (מחזור ראשון, מחזור שני)
- [x] Add bold formatting to daily itinerary headers (יום 1, יום 2, יום 3)

## Markdown Rendering Fix
- [x] Update TourInfo component to render markdown content as HTML
- [x] Convert markdown bold (**text**) to actual bold HTML tags
- [x] Ensure proper line breaks and formatting

## Confirmation Screen Text Update
- [x] Change "תודה שנרשמת לסיור בוונציה" to "תודה שנרשמת לסיור הלימודי בוונציה"

## Email System Improvements (Resend Integration)
- [x] Install Resend package
- [x] Configure Resend API key as environment variable
- [x] Create email service module with Resend
- [x] Send confirmation email to customer after registration with all details
- [x] Send approval email to customer when admin approves registration
- [x] Send rejection email to customer when admin rejects registration
- [x] Send daily summary email to admin (Ori@nizat.co.il) with pending registrations
- [x] Add Ori@nizat.co.il contact info to confirmation screen
- [x] Test all email scenarios

## Table Header Alignment Fix
- [x] Fix text alignment in pending registrations table headers (admin panel)
