import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RegionSelect() {
  const [, setLocation] = useLocation();

  const handleRegionSelect = (region: string) => {
    sessionStorage.setItem("selectedRegion", region);
    setLocation("/trip-details");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="ההסתדרות"
            className="h-20 md:h-24 w-auto"
          />
        </div>

        <Card className="p-8 md:p-12 bg-white">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            בחרו את המרחב שלכם
          </h1>
          <p className="text-center text-gray-600 mb-8 text-lg">
            בחרו את המרחב הגאוגרפי שאליו אתם משויכים
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Region 1 */}
            <Card
              className="p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-red-500"
              onClick={() => handleRegionSelect("מרחב חיפה, צפון ושפלה")}
            >
              <div className="text-center space-y-4">
                <div className="text-5xl mb-3">🏔️</div>
                <h2 className="text-xl font-bold text-gray-800">
                  מרחב חיפה, צפון ושפלה
                </h2>
                <div className="bg-red-50 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold text-red-700">מלון</p>
                  <p className="text-base font-bold text-gray-800 mt-1">
                    Ani Grand Hotel ★★★★
                  </p>
                </div>
                <Button
                  className="w-full mt-4 bg-red-700 hover:bg-red-800"
                  size="lg"
                >
                  בחר מרחב זה
                </Button>
              </div>
            </Card>

            {/* Region 2 */}
            <Card
              className="p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-red-500"
              onClick={() => handleRegionSelect("מרחב מרכז, גוש דן וירושלים")}
            >
              <div className="text-center space-y-4">
                <div className="text-5xl mb-3">🏙️</div>
                <h2 className="text-xl font-bold text-gray-800">
                  מרחב מרכז, גוש דן וירושלים
                </h2>
                <div className="bg-red-50 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold text-red-700">מלון</p>
                  <p className="text-base font-bold text-gray-800 mt-1">
                    Ani Plaza Hotel ★★★★
                  </p>
                </div>
                <Button
                  className="w-full mt-4 bg-red-700 hover:bg-red-800"
                  size="lg"
                >
                  בחר מרחב זה
                </Button>
              </div>
            </Card>

            {/* Region 3 */}
            <Card
              className="p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-red-500"
              onClick={() => handleRegionSelect("מרחב דרום")}
            >
              <div className="text-center space-y-4">
                <div className="text-5xl mb-3">🌅</div>
                <h2 className="text-xl font-bold text-gray-800">
                  מרחב דרום
                </h2>
                <div className="bg-red-50 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold text-red-700">מלון</p>
                  <p className="text-base font-bold text-gray-800 mt-1">
                    Ani Grand Hotel ★★★★
                  </p>
                </div>
                <Button
                  className="w-full mt-4 bg-red-700 hover:bg-red-800"
                  size="lg"
                >
                  בחר מרחב זה
                </Button>
              </div>
            </Card>

            {/* Region 4 */}
            <Card
              className="p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-red-500"
              onClick={() => handleRegionSelect("בודדים שאינם משויכים למרחבים")}
            >
              <div className="text-center space-y-4">
                <div className="text-5xl mb-3">👤</div>
                <h2 className="text-xl font-bold text-gray-800">
                  בודדים שאינם משויכים למרחבים
                </h2>
                <div className="bg-red-50 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold text-red-700">מלון</p>
                  <p className="text-base font-bold text-gray-800 mt-1">
                    Ani Plaza Hotel ★★★★
                  </p>
                </div>
                <Button
                  className="w-full mt-4 bg-red-700 hover:bg-red-800"
                  size="lg"
                >
                  בחר מרחב זה
                </Button>
              </div>
            </Card>
          </div>

          {/* Back button */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="text-gray-600"
            >
              ← חזרה
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
