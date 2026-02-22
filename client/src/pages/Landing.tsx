import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/logo.png" 
            alt="ההסתדרות"
            className="h-24 md:h-32 w-auto"
          />
        </div>

        {/* Teaser Text */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            ברוכים הבאים לארמניה! 🇦🇲
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            הזמנה לחוות את ארמניה – לא רק כיעד, אלא כהרגשה. היכן שההיסטוריה פוגשת את הלב.
          </p>
          
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            שילוב מושלם בין סיור תרבותי מעשיר ומגבש, לבין הקסם הייחודי של ירוואן – "העיר הוורודה" – מטרופולין חי שמתפתח בצורה מדהימה.
          </p>

          <div className="bg-red-50 rounded-lg p-6 my-8 border border-red-100">
            <p className="text-xl font-semibold text-gray-800 mb-4">
              שריינו את התאריכים:
            </p>
            <div className="space-y-3 text-lg text-gray-700">
              <p>🏔️ נסיעה לארמניה: 28.6.2026 – 1.7.2026</p>
              <p className="text-base text-gray-600">4 ימים / 3 לילות בירוואן</p>
            </div>
          </div>

          <p className="text-lg md:text-xl font-bold text-red-700">
            ההרשמה החלה! זה הזמן להבטיח לעצמכם מקום – מספר המקומות מוגבל!
          </p>

          {/* CTA Button */}
          <div className="pt-6">
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
