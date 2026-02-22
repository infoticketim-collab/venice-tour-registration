import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function TripDetails() {
  const [, setLocation] = useLocation();
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [tourDate, setTourDate] = useState<string>("");

  useEffect(() => {
    const region = sessionStorage.getItem("selectedRegion");
    if (!region) {
      setLocation("/region-select");
      return;
    }
    setSelectedRegion(region);
    
    // Determine tour date based on region
    if (region === "שרון, מרכז ודרום") {
      setTourDate("4-6 במאי 2026");
    } else {
      setTourDate("25-27 במאי 2026");
    }
  }, [setLocation]);

  const handleContinue = () => {
    setLocation("/register/1");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/logo.png" 
            alt="ניצת הדובדבן" 
            className="h-20 md:h-24 w-auto"
          />
        </div>

        <Card className="p-8 md:p-12 bg-white">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            פרטי הנסיעה
          </h1>
          
          <div className="text-center mb-8">
            <p className="text-xl text-blue-600 font-semibold">
              {selectedRegion} • {tourDate}
            </p>
          </div>

          {/* Flight Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-3xl ml-3">✈️</span>
              פרטי הטיסה
            </h2>
            <Card className="p-6 bg-blue-50">
              {selectedRegion === "שרון, מרכז ודרום" ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-lg text-gray-800">טיסת יציאה - 4 במאי 2026</p>
                    <p className="text-gray-700">המראה: 06:00 | נחיתה: 09:30 (שעון מקומי)</p>
                    <p className="text-gray-600">חברת תעופה: El Al</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-800">טיסת חזרה - 6 במאי 2026</p>
                    <p className="text-gray-700">המראה: 20:00 (שעון מקומי) | נחיתה: 01:30+1</p>
                    <p className="text-gray-600">חברת תעופה: El Al</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-lg text-gray-800">טיסת יציאה - 25 במאי 2026</p>
                    <p className="text-gray-700">המראה: 06:00 | נחיתה: 09:30 (שעון מקומי)</p>
                    <p className="text-gray-600">חברת תעופה: El Al</p>
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-800">טיסת חזרה - 27 במאי 2026</p>
                    <p className="text-gray-700">המראה: 20:00 (שעון מקומי) | נחיתה: 01:30+1</p>
                    <p className="text-gray-600">חברת תעופה: El Al</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Hotel Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-3xl ml-3">🏨</span>
              המלון
            </h2>
            <Card className="p-6 bg-blue-50">
              <p className="font-semibold text-xl text-gray-800 mb-2">Hotel Principe Venice</p>
              <p className="text-gray-700 mb-2">מלון 4 כוכבים במיקום מרכזי בוונציה</p>
              <p className="text-gray-600">כתובת: Calle Larga XXII Marzo, 2467, 30124 Venezia VE, Italy</p>
              <p className="text-gray-600 mt-2">חדרים זוגיים עם אפשרות לשדרוג לחדר יחיד</p>
            </Card>
          </div>

          {/* Itinerary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-3xl ml-3">📋</span>
              לוח זמנים
            </h2>
            <Card className="p-6 bg-blue-50">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-lg text-gray-800">יום ראשון - הגעה וסיור בעיר</p>
                  <p className="text-gray-700">09:30 - הגעה לשדה התעופה ונסיעה למלון</p>
                  <p className="text-gray-700">14:00 - צ'ק-אין במלון</p>
                  <p className="text-gray-700">16:00 - סיור מודרך בכיכר סן מרקו ובזיליקה</p>
                  <p className="text-gray-700">19:30 - ארוחת ערב במסעדה איטלקית מסורתית</p>
                </div>
                <div>
                  <p className="font-semibold text-lg text-gray-800">יום שני - סיור מקצועי וגיבוש</p>
                  <p className="text-gray-700">09:00 - ארוחת בוקר במלון</p>
                  <p className="text-gray-700">10:00 - סדנת גיבוש וניהול צוות</p>
                  <p className="text-gray-700">13:00 - ארוחת צהריים</p>
                  <p className="text-gray-700">15:00 - שייט בתעלות וונציה בגונדולות</p>
                  <p className="text-gray-700">20:00 - ערב חופשי</p>
                </div>
                <div>
                  <p className="font-semibold text-lg text-gray-800">יום שלישי - סיכום וחזרה</p>
                  <p className="text-gray-700">09:00 - ארוחת בוקר וצ'ק-אאוט</p>
                  <p className="text-gray-700">10:00 - סיור בשוק ריאלטו וזמן חופשי לקניות</p>
                  <p className="text-gray-700">14:00 - ארוחת צהריים וסיכום</p>
                  <p className="text-gray-700">17:00 - נסיעה לשדה התעופה</p>
                  <p className="text-gray-700">20:00 - המראה לישראל</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Important Notes */}
          <div className="mb-8">
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <h3 className="font-bold text-lg text-gray-800 mb-3">⚠️ חשוב לדעת:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• חובה להצטייד בדרכון בתוקף ל-6 חודשים מיום הנסיעה</li>
                <li>• חובה להצטייד בביטוח בריאות חו"ל המותאם לצרכיכם</li>
                <li>• מזוודה נוספת (23 ק"ג) - תוספת של 150 ש"ח</li>
                <li>• שדרוג לחדר יחיד - תוספת של 800 ש"ח</li>
              </ul>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => setLocation("/region-select")}
              size="lg"
              className="text-gray-600"
            >
              ← חזרה לבחירת אזור
            </Button>
            <Button
              onClick={handleContinue}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              אני מעוניין להירשם →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
