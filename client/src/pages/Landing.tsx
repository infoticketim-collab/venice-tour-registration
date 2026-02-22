import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4" dir="rtl">
      {/* Logo at top */}
      <div className="w-full flex justify-center py-6 border-b border-gray-100 mb-8">
        <img
          src="/logo.png"
          alt="ההסתדרות"
          className="h-24 md:h-32 w-auto"
        />
      </div>

      <div className="max-w-3xl w-full">
        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
            ארמניה: היכן שההיסטוריה פוגשת את הלב
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed text-right">
            המסע הזה הוא הזמנה לחוות את ארמניה לא רק כיעד, אלא כהרגשה. סעו אל נתיבי הציביליזציה כדי ליצור מגע עם המורשת האדירה ומגוון התרבות שארמניה מציעה כיעד תיירותי.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed text-right">
            במהלך מספר ימים בקצב מחושב, תטבלו במדינה שבה היסטוריה עתיקה נושמת לצד חיים מודרניים, ושבה הכנסת אורחים אינה שירות, אלא דרך חיים. תנדדו ברחובות תוססים ובפינות שקטות, תרגישו את משקלן של מאות שנים חקוקות באבן, ותגלו מסורות שנשמרו באהבה ושופלו מדור לדור.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed text-right">
            הסיור הייחודי הזה מזמין אתכם ללכת בנתיבים של מנזרים בני אלפי שנים החצובים בצוקים, ולהשתאות מאתרי מורשת עולמית של אונסק"ו. ממפגשים תרבותיים ועד תענוגות קולינריים, תטעמו אותנטיות ותצרו זיכרונות שמרגישים אישיים ומתמשכים. המסע שלכם יוביל אתכם מאוצרות רוחניים נצחיים אל ארמניה המודרנית והתוססת, ויגיע לשיאו בבירה ירוואן – "העיר הוורודה", מטרופולין חי שבאופן מדהים מבוגר ב-29 שנים מרומא.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed text-right">
            זהו אינו רק סיור; זוהי חוויה מלאת נשמה שתופסת את המהות האמיתית של ארמניה – לבבית, עשירה ובלתי נשכחת.
          </p>

          <div className="bg-red-50 rounded-lg p-6 my-8 border border-red-100">
            <p className="text-xl font-semibold text-gray-800 mb-4 text-center">
              שריינו את התאריכים:
            </p>
            <div className="space-y-3 text-lg text-gray-700 text-center">
              <p>נסיעה לארמניה: 28.6.2026 – 1.7.2026</p>
              <p className="text-base text-gray-600">4 ימים / 3 לילות בירוואן</p>
            </div>
          </div>

          <p className="text-lg md:text-xl font-bold text-red-700 text-center">
            ההרשמה החלה! זה הזמן להבטיח לעצמכם מקום – מספר המקומות מוגבל!
          </p>

          {/* CTA Button */}
          <div className="pt-6 flex justify-center">
            <Button
              onClick={() => setLocation("/region-select")}
              size="lg"
              className="text-xl px-12 py-6 bg-red-700 hover:bg-red-800"
            >
              אני רוצה להירשם
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
