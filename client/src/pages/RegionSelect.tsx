import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RegionSelect() {
  const [, setLocation] = useLocation();

  const handleRegionSelect = (region: string) => {
    // Store region in sessionStorage to use in registration
    sessionStorage.setItem("selectedRegion", region);
    // Navigate to trip details page
    setLocation("/trip-details");
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
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            בחרו את האזור שלכם
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Region 1: Sharon, Center, South */}
            <Card 
              className="p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-500"
              onClick={() => handleRegionSelect("שרון, מרכז ודרום")}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🛶</div>
                <h2 className="text-2xl font-bold text-gray-800">
                  אזורים: שרון, מרכז ודרום
                </h2>
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <p className="text-lg font-semibold text-blue-700">
                    סבב ראשון
                  </p>
                  <p className="text-xl font-bold text-gray-800 mt-2">
                    4-6 במאי 2026
                  </p>
                </div>
                <Button 
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  בחר אזור זה
                </Button>
              </div>
            </Card>

            {/* Region 2: North, TA, Jerusalem */}
            <Card 
              className="p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-500"
              onClick={() => handleRegionSelect("צפון, ת\"א וירושלים")}
            >
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🛶</div>
                <h2 className="text-2xl font-bold text-gray-800">
                  אזורים: צפון, ת"א וירושלים
                </h2>
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <p className="text-lg font-semibold text-blue-700">
                    סבב שני
                  </p>
                  <p className="text-xl font-bold text-gray-800 mt-2">
                    25-27 במאי 2026
                  </p>
                </div>
                <Button 
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  בחר אזור זה
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
