import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/logo.png" 
            alt="ניצת הדובדבן" 
            className="h-24 md:h-32 w-auto"
          />
        </div>

        {/* Teaser Text */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Andiamo gestori!
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            תארזו מזוודות ותתחילו להתאמן על ה-Buongiorno שלכם... אתם טסים לוונציה! 🛫 🇮🇹
          </p>
          
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            לשילוב מושלם בין סיור מקצועי מעשיר ומגבש, לבין הקסם האיטלקי של העיר על המים.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 my-8">
            <p className="text-xl font-semibold text-gray-800 mb-4">
              שריינו את התאריכים:
            </p>
            <div className="space-y-3 text-lg text-gray-700">
              <p>🛶 סבב ראשון: 4-6/5/26 לאזורים שרון, מרכז ודרום</p>
              <p>🛶 סבב שני: 25-27/5/26 לאזורים צפון, ת"א וירושלים</p>
            </div>
          </div>

          <p className="text-lg md:text-xl font-bold text-red-600">
            ההרשמה החלה! זה הזמן להבטיח לעצמכם מקום, אל תחכו לרגע האחרון – מספר המקומות מוגבל!
          </p>

          {/* CTA Button */}
          <div className="pt-6">
            <Button
              onClick={() => setLocation("/region-select")}
              size="lg"
              className="text-xl px-12 py-6 bg-blue-600 hover:bg-blue-700"
            >
              אני רוצה להירשם
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
