import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Plane, Luggage, Hotel, MapPin, ArrowRight } from "lucide-react";

function renderMarkdown(text: string) {
  const withBold = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return withBold.replace(/; /g, '<br/>');
}

function getHotelForRegion(region: string) {
  if (region === "מרחב חיפה, צפון ושפלה" || region === "מרחב דרום") {
    return {
      name: "Ani Grand Hotel Yerevan",
      stars: "★★★★",
      address: "65 Hanrapetutyan St, Yerevan 0010, ארמניה",
      mapQuery: "Ani+Grand+Hotel+Yerevan+65+Hanrapetutyan+St",
      mapLink: "https://maps.google.com/?q=Ani+Grand+Hotel+Yerevan,65+Hanrapetutyan+St+Yerevan",
    };
  }
  return {
    name: "Ani Plaza Hotel Yerevan",
    stars: "★★★★",
    address: "19 Sayat-Nova Ave, Yerevan 0001, ארמניה",
    mapQuery: "Ani+Plaza+Hotel+Yerevan+19+Sayat-Nova+Ave",
    mapLink: "https://maps.google.com/?q=Ani+Plaza+Hotel+Yerevan,19+Sayat-Nova+Ave+Yerevan",
  };
}

const tourImages = Array.from({ length: 32 }, (_, i) => `/images/armenia-${i + 1}.png`);

export default function TripDetails() {
  const [, setLocation] = useLocation();
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  useEffect(() => {
    const region = sessionStorage.getItem("selectedRegion");
    if (!region) {
      setLocation("/region-select");
      return;
    }
    setSelectedRegion(region);
  }, [setLocation]);

  const hotel = getHotelForRegion(selectedRegion);

  const description =
    "סיור מאורגן של 4 ימים לארמניה – מסע ייחודי שמשלב היסטוריה עתיקה, תרבות עשירה, נופים מרהיבים ואירוח חם. הסיור יתחיל ויסתיים בירוואן, הבירה הוורודה, שם נחווה את הקסם הארמני האותנטי.";

  const flightDetails =
    "**טיסות פרטיות ישירות לירוואן במטוס ההסתדרות**; הלוך (28.6.2026): המראה בשעות הבוקר המוקדמות לירוואן; חזור (1.7.2026): המראה בשעות הערב לתל אביב";

  const luggageDetails =
    "כל נוסע זכאי לתיק יד אישי; מזוודה אחת לנוסע (עד 23 ק\"ג); ניתן להוסיף מזוודה נוספת בתשלום נפרד";

  const hotelDetails = `שהייה של 3 לילות במלון ${hotel.name} ${hotel.stars} בירוואן; בסיס לינה וארוחת בוקר; חדרים זוגיים (שיתוף); תוספת לחדר יחיד בתשלום נפרד`;

  const itinerary =
    "**יום 1 (28.6): הגעה לירוואן**; נחיתה בנמל התעופה ירוואן, קבלת פנים חמה ממדריכינו. ארוחת צהריים ב-Agape Refectory – מבנה היסטורי מרשים משנת 1655. סיור בירוואן: מתחם הקסקד, בית האופרה, רחוב הצפון. ארוחת ערב חגיגית במרכז התרבות \"שטיחי מגריאן\" – כולל סדנת בישול עם השף המפורסם מר סרק מומולומי.; **יום 2 (29.6): גהרהגד, סימפוניית האבנים, שאבאל ויקב**; ארוחת בוקר במלון. נסיעה נופית לכפרים יגוטי וגרני. ביקור במנזר גהרהגד – אתר מורשת עולמי של יונסק\"ו. הופעת מקהלה בחדרי המנזר. סימפוניית האבנים – עמודי הבזלת המדהימים. סדנת אפיית לחם שאבאל מסורתי בתנור טוניר. ביקור במקדש הפגאני גרני. הופעת דודוק חי. ביקור ביקב \"ווסקבאז\" – טעימת יינות ארמניים.; **יום 3 (30.6): קניות ואנדרטאות**; ארוחת בוקר במלון. קניות בשוק הפשפשים \"ורניסאז'\" ובשוק GUM. ביקור באנדרטת \"אמא ארמניה\". זמן חופשי ומנוחה. ארוחת ערב פרידה ב-Tavern Yerevan Riverside – מוזיקה חיה ופולקלור.; **יום 4 (1.7): יום אחרון וחזרה**; ארוחת בוקר במלון. ביקור בפארק היהודי ובית הכנסת המקומי. חנות שוקולד Grand Candy. קניות אחרונות בקניון Dalma Garden Mall. העברה לנמל התעופה לקראת הטיסה חזרה.";

  const handleContinue = () => {
    setLocation("/register/1");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="ההסתדרות" className="h-20 md:h-24 w-auto" />
        </div>

        <Card className="p-8 md:p-12 bg-white">
          <Button variant="ghost" className="mb-6" onClick={() => setLocation("/region-select")}>
            <ArrowRight className="w-4 h-4 ml-2" />
            חזרה לבחירת מרחב
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            פרטי הנסיעה לארמניה
          </h1>

          <div className="text-center mb-8">
            <p className="text-xl text-red-700 font-semibold">
              {selectedRegion} &bull; 28.6.2026 &ndash; 1.7.2026
            </p>
          </div>

          <div className="mb-8">
            <Card className="p-6 bg-red-50 border border-red-100">
              <p className="text-lg text-gray-700 leading-relaxed text-center">{description}</p>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">גלריית תמונות</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tourImages.map((img, idx) => (
                <div key={idx} className="aspect-video overflow-hidden rounded-lg shadow">
                  <img
                    src={img}
                    alt={`ארמניה ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).parentElement!.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Plane className="w-6 h-6 text-red-700" />
                פרטי טיסה
              </h3>
              <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(flightDetails) }} />
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Luggage className="w-6 h-6 text-red-700" />
                כבודה
              </h3>
              <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(luggageDetails) }} />
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Hotel className="w-6 h-6 text-red-700" />
                מלון
              </h3>
              <div className="text-gray-600 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(hotelDetails) }} />

              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-red-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">{hotel.name} {hotel.stars}</p>
                    <p className="text-gray-600 text-sm">{hotel.address}</p>
                  </div>
                </div>
                <div className="mt-3 rounded-lg overflow-hidden border border-red-200">
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${hotel.mapQuery}&zoom=15&size=600x250&markers=color:red%7C${hotel.mapQuery}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3Kqo`}
                    alt={`מיקום ${hotel.name}`}
                    className="w-full"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.parentElement!.innerHTML = `<div class="bg-gray-100 flex items-center justify-center h-32 text-gray-500 text-sm">לחץ על הקישור למטה לפתיחת המפה</div>`;
                    }}
                  />
                </div>
                <a
                  href={hotel.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-red-700 hover:underline"
                >
                  פתח במפות Google ↗
                </a>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📅</span>
                תוכנית הסיור
              </h3>
              <div className="text-gray-600 leading-relaxed space-y-3" dangerouslySetInnerHTML={{ __html: renderMarkdown(itinerary) }} />
            </Card>
          </div>

          <div className="mt-10 text-center">
            <Button
              onClick={handleContinue}
              className="bg-red-700 hover:bg-red-800 text-white text-lg px-10 py-6 rounded-xl shadow-lg"
            >
              אני מעוניין להירשם
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
