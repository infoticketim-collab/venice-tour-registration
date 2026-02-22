import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Plane, Luggage, Hotel, MapPin } from "lucide-react";

// Helper function to convert markdown bold to HTML
function renderMarkdown(text: string) {
  // Convert **text** to <strong>text</strong>
  const withBold = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Convert semicolons to line breaks
  return withBold.replace(/; /g, '<br/>');
}

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

  // Tour description
  const description = "סיור מאורגן של 3 ימים לצפון איטליה, לסיורים במפעלי פסטה וקמח. הסיור יתחיל ויסתיים בוונציה, אחת הערים היפות בעולם, שם גם נהנה מסיורים בתעלות הציוריות, מאוכל טוב ומחברה נפלאה!";

  // Flight details
  const flightDetails = `**מחזור ראשון:**; הלוך (04.05.2026): תל אביב – ונציה | המראה: 11:15, נחיתה: 14:10; חזור (06.05.2026): ונציה – תל אביב | המראה: 22:05, נחיתה: 02:25 (+1); **מחזור שני:**; הלוך (25.05.2026): תל אביב – ונציה | המראה: 11:15, נחיתה: 14:10; חזור (27.05.2026): ונציה – תל אביב | המראה: 22:05, נחיתה: 02:25 (+1)`;

  // Luggage details
  const luggageDetails = "תיק יד לכל נוסע; טרולי עד 10 ק\"ג לכל נוסע";

  // Hotel details
  const hotelDetails = "שהייה של 2 לילות במלון Leonardo Royal בוונציה על בסיס לינה וארוחת בוקר; חדרים זוגיים";

  // Itinerary
  const itinerary = `**יום 1: ת"א-ונציה**; נחיתה בנמל התעופה ונציה, איסוף והעברה למלון. צ'ק אין במלון וזמן חופשי. ארוחת ערב במסעדה כשרה בוונציה.; לינה: ונציה; **יום 2: סיור מקצועי**; ארוחת בוקר במלון ולאחריה יציאה לסיור מקצועי במפעל קמח ובמפעל פסטה. ארוחת צהריים כשרה ארוזה (סנדוויצ'ים). חזרה למלון וארוחת ערב כשרה במסעדה.; לינה: ונציה; **יום 3: ונציה וחזרה ארצה**; ארוחת בוקר במלון. סיור בוונציה: שייט בוואפורטו, ביקור באתרים המרכזים (כיכר סן מרקו, גשר ריאלטו והגטו היהודי). זמן חופשי ובערב העברה לנמל התעופה לקראת הטיסה חזרה.`;

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

          {/* Tour Description */}
          <div className="mb-8">
            <Card className="p-6 bg-blue-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">אודות הסיור</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{description}</p>
            </Card>
          </div>

          {/* Flight Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Plane className="w-6 h-6 text-primary ml-3" />
              פרטי טיסה
            </h2>
            <Card className="p-6 bg-blue-50">
              <div 
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(flightDetails) }}
              />
            </Card>
          </div>

          {/* Luggage Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Luggage className="w-6 h-6 text-primary ml-3" />
              כבודה
            </h2>
            <Card className="p-6 bg-blue-50">
              <div 
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(luggageDetails) }}
              />
            </Card>
          </div>

          {/* Hotel Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Hotel className="w-6 h-6 text-primary ml-3" />
              מלון
            </h2>
            <Card className="p-6 bg-blue-50">
              <div 
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(hotelDetails) }}
              />
            </Card>
          </div>

          {/* Itinerary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <MapPin className="w-6 h-6 text-primary ml-3" />
              תוכנית הסיור
            </h2>
            <Card className="p-6 bg-blue-50">
              <div 
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(itinerary) }}
              />
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
