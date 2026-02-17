import { Resend } from "resend";
import { ENV } from "./_core/env";

const resend = new Resend(ENV.resendApiKey);

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

/**
 * Send email using Resend
 */
export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  try {
    if (!ENV.resendApiKey) {
      console.error("[Email] RESEND_API_KEY is not configured");
      return false;
    }

    if (!ENV.fromEmail) {
      console.error("[Email] FROM_EMAIL is not configured");
      return false;
    }

    const { data, error } = await resend.emails.send({
      from: ENV.fromEmail,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error("[Email] Failed to send email:", error);
      return false;
    }

    console.log("[Email] Email sent successfully:", data?.id);
    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}

/**
 * Send confirmation email to customer after registration
 */
export async function sendCustomerConfirmationEmail(params: {
  customerEmail: string;
  orderNumber: number;
  customerName: string;
  tourTitle: string;
  datePreference: string;
  birthDate: string;
  phone: string;
  email: string;
  additionalLuggage: boolean;
  singleRoomUpgrade: boolean;
}): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>אישור הזמנה</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
  <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 80px; height: 80px; background-color: #22c55e; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="color: white; font-size: 40px;">✓</span>
      </div>
      <h1 style="color: #2563eb; margin: 0;">ההרשמה התקבלה בהצלחה!</h1>
    </div>

    <p style="font-size: 18px; text-align: center; margin-bottom: 30px;">
      תודה שנרשמת לסיור הלימודי בוונציה
    </p>

    <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; border: 2px solid: #2563eb; margin-bottom: 20px; text-align: center;">
      <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">מספר הזמנה</p>
      <p style="margin: 0; font-size: 36px; font-weight: bold; color: #2563eb;">${params.orderNumber}</p>
    </div>

    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">פרטי ההזמנה</h2>
      <p style="margin: 8px 0;"><strong>שם:</strong> ${params.customerName}</p>
      <p style="margin: 8px 0;"><strong>סיור:</strong> ${params.tourTitle}</p>
      <p style="margin: 8px 0;"><strong>תאריך מועדף:</strong> ${params.datePreference}</p>
      <p style="margin: 8px 0;"><strong>תאריך לידה:</strong> ${params.birthDate}</p>
      <p style="margin: 8px 0;"><strong>טלפון:</strong> ${params.phone}</p>
      <p style="margin: 8px 0;"><strong>דוא\"ל:</strong> ${params.email}</p>
    </div>

    ${params.additionalLuggage || params.singleRoomUpgrade ? `
    <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid #f59e0b;">
      <h3 style="color: #92400e; font-size: 16px; margin-top: 0;">שירותים נלווים שהוזמנו:</h3>
      ${params.additionalLuggage ? '<p style="margin: 5px 0;">✓ תוספת מזוודה (60 יורו)</p>' : ''}
      ${params.singleRoomUpgrade ? '<p style="margin: 5px 0;">✓ שדרוג לחדר יחיד (275 יורו)</p>' : ''}
    </div>
    ` : ''}

    <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-right: 4px solid #2563eb; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 14px;">
        <strong>שים לב:</strong> תקבל אישור סופי למייל שהזנת לאחר שההזמנה תאושר על ידי צוות ניצת הדובדבן.
        אנא שמור את מספר ההזמנה לצורך מעקב.
      </p>
    </div>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
      <p style="color: #64748b; font-size: 14px; margin: 0;">
        יש לך שאלות? צור קשר עם צוות ניצת הדובדבן
      </p>
      <p style="color: #2563eb; font-size: 14px; margin: 5px 0 0 0;">
        <a href="mailto:${ENV.adminEmail}" style="color: #2563eb; text-decoration: none;">${ENV.adminEmail}</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: params.customerEmail,
    subject: `אישור הזמנה #${params.orderNumber} - סיור לימודי בוונציה`,
    html,
  });
}

/**
 * Send approval email to customer
 */
export async function sendCustomerApprovalEmail(params: {
  customerEmail: string;
  orderNumber: number;
  customerName: string;
  tourTitle: string;
  datePreference: string;
  additionalLuggage: boolean;
  singleRoomUpgrade: boolean;
}): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>הזמנה אושרה</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
  <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 80px; height: 80px; background-color: #22c55e; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
        <span style="color: white; font-size: 40px;">✓</span>
      </div>
      <h1 style="color: #22c55e; margin: 0;">ההזמנה שלך אושרה!</h1>
    </div>

    <p style="font-size: 18px; text-align: center; margin-bottom: 30px;">
      שלום ${params.customerName},
    </p>

    <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-right: 4px solid #22c55e; margin-bottom: 20px;">
      <p style="margin: 0 0 10px 0; font-size: 16px;">
        ברכות! ההזמנה שלך לסיור "${params.tourTitle}" אושרה בהצלחה!
      </p>
      <p style="margin: 0; font-size: 14px; color: #166534;">
        <strong>תאריך הסיור:</strong> ${params.datePreference}
      </p>
    </div>

    ${params.additionalLuggage || params.singleRoomUpgrade ? `
    <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid #f59e0b;">
      <h3 style="color: #92400e; font-size: 16px; margin-top: 0;">שירותים נלווים</h3>
      <p style="margin: 0 0 10px 0; font-size: 14px;">קיבלנו את בקשתכם ל:</p>
      ${params.additionalLuggage ? '<p style="margin: 5px 0 5px 20px;">✓ תוספת מזוודה (60 יורו)</p>' : ''}
      ${params.singleRoomUpgrade ? '<p style="margin: 5px 0 5px 20px;">✓ שדרוג לחדר יחיד (275 יורו)</p>' : ''}
      <p style="margin: 10px 0 0 0; font-size: 14px; font-weight: bold; color: #92400e;">נציגנו יצרו עמכם קשר בהקדם</p>
    </div>
    ` : ''}

    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">מספר הזמנה</p>
      <p style="margin: 0; font-size: 28px; font-weight: bold; color: #22c55e;">${params.orderNumber}</p>
    </div>

    <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid #dc2626;">
      <p style="margin: 0; font-size: 16px; font-weight: bold; color: #991b1b;">
        ⚠️ תזכורת חשובה
      </p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #991b1b;">
        מזכירים שוב, חובה להצטייד מבעוד מועד בביטוח בריאות חו"ל המותאם לצרכיכם
      </p>
    </div>

    <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 14px;">
        <strong>הצעדים הבאים:</strong><br>
        • וודא שדרכונך בתוקף ל-6 חודשים מיום הנסיעה<br>
        • צוות ניצת הדובדבן ייצור איתך קשר בקרוב עם פרטים נוספים<br>
        • שמור את מספר ההזמנה לצורך התכתבות
      </p>
    </div>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
      <p style="color: #64748b; font-size: 14px; margin: 0;">
        יש לך שאלות? צור קשר עם צוות ניצת הדובדבן
      </p>
      <p style="color: #2563eb; font-size: 14px; margin: 5px 0 0 0;">
        <a href="mailto:${ENV.adminEmail}" style="color: #2563eb; text-decoration: none;">${ENV.adminEmail}</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: params.customerEmail,
    subject: `✅ הזמנה #${params.orderNumber} אושרה - סיור לימודי בוונציה`,
    html,
  });
}

/**
 * Send rejection email to customer
 */
export async function sendCustomerRejectionEmail(params: {
  customerEmail: string;
  orderNumber: number;
  customerName: string;
  tourTitle: string;
}): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>הזמנה נדחתה</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
  <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #dc2626; margin: 0;">עדכון לגבי הזמנתך</h1>
    </div>

    <p style="font-size: 18px; text-align: center; margin-bottom: 30px;">
      שלום ${params.customerName},
    </p>

    <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-right: 4px solid #dc2626; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 16px;">
        ההזמנה שלך לסיור "${params.tourTitle}" נדחתה.
      </p>
    </div>

    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">מספר הזמנה</p>
      <p style="margin: 0; font-size: 28px; font-weight: bold; color: #64748b;">${params.orderNumber}</p>
    </div>

    <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p style="margin: 0 0 15px 0; font-size: 14px;">
        ניתן ליצור קשר עם צוות ההנהלה לפרטים נוספים:
      </p>
      <p style="margin: 0; font-size: 16px; text-align: center;">
        <strong style="color: #2563eb;">אורי בראון</strong><br>
        <a href="mailto:Ori@nizat.co.il" style="color: #2563eb; text-decoration: none; font-size: 14px;">Ori@nizat.co.il</a>
      </p>
    </div>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
      <p style="color: #64748b; font-size: 14px; margin: 0;">
        יש לך שאלות? צור קשר עם צוות ניצת הדובדבן
      </p>
      <p style="color: #2563eb; font-size: 14px; margin: 5px 0 0 0;">
        <a href="mailto:${ENV.adminEmail}" style="color: #2563eb; text-decoration: none;">${ENV.adminEmail}</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: params.customerEmail,
    subject: `עדכון הזמנה #${params.orderNumber} - סיור לימודי בוונציה`,
    html,
  });
}

/**
 * Send daily summary email to admin
 */
export async function sendAdminDailySummaryEmail(params: {
  pendingCount: number;
  tourStats: Array<{
    tourTitle: string;
    dateRange: string;
    availableSpots: number;
    capacity: number;
    pending: number;
    approved: number;
    rejected: number;
  }>;
}): Promise<boolean> {
  const statsRows = params.tourStats
    .map(
      (stat) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${stat.tourTitle}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${stat.dateRange}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${stat.availableSpots}/${stat.capacity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #f59e0b; font-weight: bold;">${stat.pending}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #22c55e;">${stat.approved}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #dc2626;">${stat.rejected}</td>
    </tr>
  `
    )
    .join("");

  const alertSection =
    params.pendingCount > 0
      ? `
    <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-right: 4px solid #f59e0b; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 16px; font-weight: bold; color: #92400e;">
        ⚠️ יש ${params.pendingCount} הרשמות ממתינות לאישור
      </p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #92400e;">
        אנא היכנס לממשק הניהול לטיפול בהרשמות.
      </p>
    </div>
  `
      : `
    <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-right: 4px solid #22c55e; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 16px; font-weight: bold; color: #166534;">
        ✅ אין הרשמות ממתינות לאישור
      </p>
    </div>
  `;

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>סיכום יומי</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
  <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h1 style="color: #2563eb; margin: 0 0 10px 0; text-align: center;">📊 סיכום יומי</h1>
    <p style="text-align: center; color: #64748b; margin: 0 0 30px 0;">${new Date().toLocaleDateString("he-IL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>

    ${alertSection}

    <h2 style="color: #1e293b; font-size: 18px; margin: 30px 0 15px 0;">סטטוס סיורים</h2>
    <table style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
      <thead>
        <tr style="background-color: #2563eb; color: white;">
          <th style="padding: 12px; text-align: right;">סיור</th>
          <th style="padding: 12px; text-align: right;">תאריכים</th>
          <th style="padding: 12px; text-align: center;">מקומות פנויים</th>
          <th style="padding: 12px; text-align: center;">ממתינים</th>
          <th style="padding: 12px; text-align: center;">מאושרים</th>
          <th style="padding: 12px; text-align: center;">נדחו</th>
        </tr>
      </thead>
      <tbody>
        ${statsRows}
      </tbody>
    </table>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
      <p style="color: #64748b; font-size: 14px; margin: 0;">
        מערכת רישום לסיורים - ניצת הדובדבן
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  if (!ENV.adminEmail) {
    console.error("[Email] ADMIN_EMAIL is not configured");
    return false;
  }

  return sendEmail({
    to: ENV.adminEmail,
    subject: `📊 סיכום יומי - ${new Date().toLocaleDateString("he-IL")}`,
    html,
  });
}
